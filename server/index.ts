import cookieParser from 'cookie-parser'
import express, { type Request, type Response } from 'express'
import { randomUUID } from 'node:crypto'
import { generatePortfolioUpdates } from './ai'
import { saveOnboardingSubmission } from './onboarding'
import {
  buildAuthorizationUrl,
  exchangeCodeForToken,
  fetchProviderProfile,
  isProvider,
  oauthConfigured,
} from './providers'
import type { AiSettings, Provider, SocialProfile } from './types'
import {
  createSessionId,
  getProviderToken,
  providerConnectionStatus,
  removeProviderToken,
  setProviderToken,
} from './vault'

const app = express()
const port = Number(process.env.API_PORT || 8787)
const sessionCookie = 'flowboard_sid'
const publicUrl = process.env.FLOWBOARD_PUBLIC_URL || 'http://localhost:5173'

interface OAuthStateEntry {
  sessionId: string
  provider: Provider
  returnTo: string
  createdAt: number
}

const oauthState = new Map<string, OAuthStateEntry>()

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

const ensureSession = (req: Request, res: Response) => {
  const existing = req.cookies[sessionCookie]
  if (typeof existing === 'string' && existing.length > 0) return existing

  const sessionId = createSessionId()
  res.cookie(sessionCookie, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  })
  return sessionId
}

const safeReturnUrl = (candidate: string | undefined) => {
  if (!candidate) return `${publicUrl}/editor`
  try {
    const url = new URL(candidate, publicUrl)
    const publicOrigin = new URL(publicUrl).origin
    if (url.origin !== publicOrigin) return `${publicUrl}/editor`
    return url.toString()
  } catch {
    return `${publicUrl}/editor`
  }
}

const withQuery = (base: string, params: Record<string, string>) => {
  const url = new URL(base)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}

const parseAiSettings = (current: Record<string, unknown>): AiSettings => {
  const raw = (current.apiConnections ?? {}) as Record<string, unknown>
  const aiProvider = raw.aiProvider
  const aiModel = raw.aiModel
  const customEndpoint = raw.customEndpoint

  return {
    aiProvider:
      aiProvider === 'Anthropic' || aiProvider === 'Custom' || aiProvider === 'OpenAI'
        ? aiProvider
        : 'OpenAI',
    aiModel: typeof aiModel === 'string' ? aiModel : '',
    customEndpoint: typeof customEndpoint === 'string' ? customEndpoint : '',
  }
}

const profileSourceHint = (current: Record<string, unknown>, provider: Provider): string => {
  const social = (current.social ?? {}) as Record<string, unknown>
  const value = social[provider]
  return typeof value === 'string' ? value : ''
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'flowboard-api' })
})

app.get('/api/session', async (req, res) => {
  const sessionId = ensureSession(req, res)
  const connections = await providerConnectionStatus(sessionId)
  res.json({
    sessionId,
    connections,
  })
})

app.get('/api/oauth/connections', async (req, res) => {
  const sessionId = ensureSession(req, res)
  const connections = await providerConnectionStatus(sessionId)
  res.json({
    connections,
    configured: {
      instagram: oauthConfigured('instagram'),
      linkedin: oauthConfigured('linkedin'),
      x: oauthConfigured('x'),
    },
  })
})

app.get('/api/oauth/:provider/start', (req, res) => {
  const provider = req.params.provider
  if (!isProvider(provider)) {
    res.status(400).json({ error: 'Unsupported provider.' })
    return
  }
  if (!oauthConfigured(provider)) {
    res.status(400).json({
      error: `${provider} OAuth is not configured on the server. Add client id/secret env vars.`,
    })
    return
  }

  const sessionId = ensureSession(req, res)
  const state = randomUUID()
  const returnTo = safeReturnUrl(typeof req.query.returnTo === 'string' ? req.query.returnTo : undefined)
  oauthState.set(state, {
    sessionId,
    provider,
    returnTo,
    createdAt: Date.now(),
  })

  res.redirect(buildAuthorizationUrl(provider, state))
})

app.get('/api/oauth/:provider/callback', async (req, res) => {
  const provider = req.params.provider
  if (!isProvider(provider)) {
    res.status(400).send('Unsupported provider')
    return
  }

  const code = typeof req.query.code === 'string' ? req.query.code : ''
  const state = typeof req.query.state === 'string' ? req.query.state : ''
  const stateEntry = oauthState.get(state)
  oauthState.delete(state)

  if (!code || !stateEntry || stateEntry.provider !== provider) {
    res.redirect(withQuery(`${publicUrl}/editor`, { oauth: 'error', provider, message: 'Invalid OAuth state.' }))
    return
  }

  try {
    const tokenSet = await exchangeCodeForToken(provider, code)
    await setProviderToken(stateEntry.sessionId, provider, tokenSet)
    res.redirect(withQuery(stateEntry.returnTo, { oauth: 'success', provider }))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OAuth callback failed.'
    res.redirect(withQuery(stateEntry.returnTo, { oauth: 'error', provider, message }))
  }
})

app.delete('/api/oauth/:provider', async (req, res) => {
  const provider = req.params.provider
  if (!isProvider(provider)) {
    res.status(400).json({ error: 'Unsupported provider.' })
    return
  }

  const sessionId = ensureSession(req, res)
  await removeProviderToken(sessionId, provider)
  const connections = await providerConnectionStatus(sessionId)
  res.json({ ok: true, connections })
})

app.post('/api/social/pull', async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>
  const platformValue = typeof body.platform === 'string' ? body.platform : ''
  const source = typeof body.source === 'string' ? body.source : ''
  const current = (body.current ?? {}) as Record<string, unknown>

  if (!isProvider(platformValue)) {
    res.status(400).json({ error: 'Invalid social platform.' })
    return
  }
  const platform: Provider = platformValue

  const sessionId = ensureSession(req, res)
  const tokenSet = await getProviderToken(sessionId, platform)
  if (!tokenSet?.accessToken) {
    res.status(400).json({ error: `${platform} is not connected. Use OAuth connect first.` })
    return
  }

  try {
    const socialProfile = await fetchProviderProfile(platform, tokenSet, source)
    const aiSettings = parseAiSettings(current)
    const updates = await generatePortfolioUpdates({
      intent: 'social-pull',
      currentProfile: current,
      socialProfiles: [socialProfile],
      focusProvider: platform,
      aiSettings,
    })

    res.json({
      updates,
      socialProfile,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to pull social data.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/ai/auto-design', async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>
  const current = (body.current ?? {}) as Record<string, unknown>
  const sessionId = ensureSession(req, res)
  const connections = await providerConnectionStatus(sessionId)

  const profiles: SocialProfile[] = []
  for (const provider of ['instagram', 'linkedin', 'x'] as const) {
    if (!connections[provider]) continue
    const tokenSet = await getProviderToken(sessionId, provider)
    if (!tokenSet?.accessToken) continue

    try {
      const profile = await fetchProviderProfile(provider, tokenSet, profileSourceHint(current, provider))
      profiles.push(profile)
    } catch {
      continue
    }
  }

  if (profiles.length === 0) {
    res.status(400).json({ error: 'Connect at least one social account before running AI auto-design.' })
    return
  }

  try {
    const aiSettings = parseAiSettings(current)
    const updates = await generatePortfolioUpdates({
      intent: 'auto-design',
      currentProfile: current,
      socialProfiles: profiles,
      aiSettings,
    })
    res.json({ updates, socialProfiles: profiles })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Auto-design failed.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/onboarding', async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>
  const fullName = String(body.fullName ?? '').trim()
  const email = String(body.email ?? '').trim()
  const brandName = String(body.brandName ?? '').trim()
  const category = String(body.category ?? '').trim()
  const primaryGoal = String(body.primaryGoal ?? '').trim()
  const preferredTier = String(body.preferredTier ?? '').trim()
  const notes = String(body.notes ?? '').trim()

  if (!fullName || !email || !brandName) {
    res.status(400).json({ error: 'fullName, email, and brandName are required.' })
    return
  }

  const sessionId = ensureSession(req, res)
  await saveOnboardingSubmission({
    sessionId,
    fullName,
    email,
    brandName,
    category,
    primaryGoal,
    preferredTier,
    notes,
    createdAt: new Date().toISOString(),
  })

  res.json({ ok: true })
})

setInterval(() => {
  const now = Date.now()
  for (const [state, value] of oauthState.entries()) {
    if (now - value.createdAt > 1000 * 60 * 15) {
      oauthState.delete(state)
    }
  }
}, 1000 * 60 * 2).unref()

app.listen(port, () => {
  console.log(`Flowboard API listening on http://localhost:${port}`)
})
