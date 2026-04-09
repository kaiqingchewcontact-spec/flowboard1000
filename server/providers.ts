import type { OAuthTokenSet, Provider, SocialProfile } from './types'

interface ProviderConfig {
  authUrl: string
  tokenUrl: string
  defaultScopes: string[]
  clientIdEnv: string
  clientSecretEnv: string
}

const providerConfigs: Record<Provider, ProviderConfig> = {
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    defaultScopes: ['user_profile', 'user_media'],
    clientIdEnv: 'INSTAGRAM_CLIENT_ID',
    clientSecretEnv: 'INSTAGRAM_CLIENT_SECRET',
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    defaultScopes: ['openid', 'profile', 'email'],
    clientIdEnv: 'LINKEDIN_CLIENT_ID',
    clientSecretEnv: 'LINKEDIN_CLIENT_SECRET',
  },
  x: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.x.com/2/oauth2/token',
    defaultScopes: ['users.read', 'tweet.read', 'offline.access'],
    clientIdEnv: 'X_CLIENT_ID',
    clientSecretEnv: 'X_CLIENT_SECRET',
  },
}

const publicAppUrl = () => process.env.FLOWBOARD_PUBLIC_URL || 'http://localhost:5173'

const providerRedirectUri = (provider: Provider) =>
  process.env[`${provider.toUpperCase()}_REDIRECT_URI`] || `${publicAppUrl()}/api/oauth/${provider}/callback`

const providerClientId = (provider: Provider) => process.env[providerConfigs[provider].clientIdEnv] || ''
const providerClientSecret = (provider: Provider) => process.env[providerConfigs[provider].clientSecretEnv] || ''

const providerScopes = (provider: Provider) => {
  const override = process.env[`${provider.toUpperCase()}_SCOPES`]
  return override ? override.split(',').map((scope) => scope.trim()).filter(Boolean) : providerConfigs[provider].defaultScopes
}

const fetchJson = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Provider request failed (${response.status}): ${text.slice(0, 240)}`)
  }
  return JSON.parse(text) as Record<string, unknown>
}

export const isProvider = (value: string): value is Provider =>
  value === 'instagram' || value === 'linkedin' || value === 'x'

export const oauthConfigured = (provider: Provider) =>
  Boolean(providerClientId(provider) && providerClientSecret(provider))

export const buildAuthorizationUrl = (provider: Provider, state: string) => {
  const config = providerConfigs[provider]
  const url = new URL(config.authUrl)

  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', providerClientId(provider))
  url.searchParams.set('redirect_uri', providerRedirectUri(provider))
  url.searchParams.set('scope', providerScopes(provider).join(' '))
  url.searchParams.set('state', state)

  if (provider === 'instagram') {
    url.searchParams.set('response_type', 'code')
  }

  return url.toString()
}

export const exchangeCodeForToken = async (provider: Provider, code: string): Promise<OAuthTokenSet> => {
  const config = providerConfigs[provider]
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: providerRedirectUri(provider),
    client_id: providerClientId(provider),
    client_secret: providerClientSecret(provider),
  })

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Token exchange failed for ${provider}: ${text.slice(0, 280)}`)
  }

  const payload = JSON.parse(text) as Record<string, unknown>
  const expiresIn = typeof payload.expires_in === 'number' ? payload.expires_in : undefined

  return {
    accessToken: String(payload.access_token ?? ''),
    refreshToken: typeof payload.refresh_token === 'string' ? payload.refresh_token : undefined,
    tokenType: typeof payload.token_type === 'string' ? payload.token_type : undefined,
    scope: typeof payload.scope === 'string' ? payload.scope : undefined,
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
  }
}

const toSocialProfile = (
  provider: Provider,
  username: string,
  displayName: string,
  bio: string,
  profileUrl: string,
  avatarUrl?: string,
  followers?: number,
): SocialProfile => ({
  provider,
  username,
  displayName,
  bio,
  profileUrl,
  avatarUrl,
  followers,
})

export const fetchProviderProfile = async (
  provider: Provider,
  tokenSet: OAuthTokenSet,
  sourceHint = '',
): Promise<SocialProfile> => {
  if (provider === 'instagram') {
    const payload = await fetchJson(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${encodeURIComponent(tokenSet.accessToken)}`,
    )
    const username = String(payload.username ?? (sourceHint || 'instagram-user'))
    return toSocialProfile(
      'instagram',
      username,
      username,
      `Instagram account type: ${String(payload.account_type ?? 'creator')}`,
      `https://instagram.com/${username}`,
      undefined,
      typeof payload.media_count === 'number' ? payload.media_count : undefined,
    )
  }

  if (provider === 'linkedin') {
    const payload = await fetchJson('https://api.linkedin.com/v2/userinfo', {
      headers: {
        authorization: `Bearer ${tokenSet.accessToken}`,
      },
    })
    const name = String(
      payload.name ?? `${String(payload.given_name ?? '')} ${String(payload.family_name ?? '')}`.trim(),
    )
    const username = String(payload.sub ?? (sourceHint || 'linkedin-user'))
    return toSocialProfile(
      'linkedin',
      username,
      name || 'LinkedIn Professional',
      'Professional profile imported from LinkedIn.',
      sourceHint || `https://linkedin.com/in/${username}`,
      typeof payload.picture === 'string' ? payload.picture : undefined,
      undefined,
    )
  }

  const payload = await fetchJson('https://api.x.com/2/users/me?user.fields=description,profile_image_url,public_metrics,url', {
    headers: {
      authorization: `Bearer ${tokenSet.accessToken}`,
    },
  })
  const data = (payload.data ?? {}) as Record<string, unknown>
  const metrics = (data.public_metrics ?? {}) as Record<string, unknown>
  const username = String(data.username ?? (sourceHint || 'x-user'))
  return toSocialProfile(
    'x',
    username,
    String(data.name ?? username),
    String(data.description ?? 'Imported from X.'),
    typeof data.url === 'string' && data.url ? data.url : `https://x.com/${username}`,
    typeof data.profile_image_url === 'string' ? data.profile_image_url : undefined,
    typeof metrics.followers_count === 'number' ? metrics.followers_count : undefined,
  )
}
