import type { PortfolioData } from '../types'

export type OAuthProvider = 'instagram' | 'linkedin' | 'x'

interface ApiErrorPayload {
  error?: string
}

interface ConnectionsResponse {
  connections: Record<OAuthProvider, boolean>
  configured: Record<OAuthProvider, boolean>
}

interface SocialPullResponse {
  updates: Partial<PortfolioData>
  socialProfile: {
    provider: OAuthProvider
    username: string
    displayName: string
    bio: string
    profileUrl: string
    avatarUrl?: string
    followers?: number
  }
}

interface AutoDesignResponse {
  updates: Partial<PortfolioData>
}

interface OnboardingInput {
  fullName: string
  email: string
  brandName: string
  category: string
  primaryGoal: string
  preferredTier: string
  notes: string
}

const parseJsonSafely = <T>(text: string): T | null => {
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

const parseApiError = (response: Response, bodyText: string, contentType: string) => {
  if (contentType.includes('application/json')) {
    const payload = parseJsonSafely<ApiErrorPayload>(bodyText)
    return payload?.error || `Request failed (${response.status}).`
  }

  const bodyHint =
    bodyText.trim().startsWith('<!doctype') || bodyText.trim().startsWith('<html')
      ? 'The server returned HTML instead of JSON.'
      : `Unexpected response: ${bodyText.slice(0, 120)}`
  return `Request failed (${response.status}). ${bodyHint} If you are running locally, start API + web together with "npm run dev:full".`
}

const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })
  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  const bodyText = await response.text()

  if (!response.ok) {
    throw new Error(parseApiError(response, bodyText, contentType))
  }

  if (!contentType.includes('application/json')) {
    const bodyHint =
      bodyText.trim().startsWith('<!doctype') || bodyText.trim().startsWith('<html')
        ? 'Received an HTML document.'
        : `Unexpected response: ${bodyText.slice(0, 120)}`
    throw new Error(
      `${bodyHint} Flowboard API expected JSON. If local, run "npm run dev:full" so the backend is available.`,
    )
  }

  const payload = parseJsonSafely<T>(bodyText)
  if (!payload) {
    throw new Error('Failed to parse API JSON response.')
  }
  return payload
}

export const getOAuthConnections = () => fetchApi<ConnectionsResponse>('/api/oauth/connections')

export const startOAuthConnect = (provider: OAuthProvider, returnTo = window.location.href) => {
  window.location.href = `/api/oauth/${provider}/start?returnTo=${encodeURIComponent(returnTo)}`
}

export const disconnectOAuthProvider = (provider: OAuthProvider) =>
  fetchApi<{ ok: boolean; connections: Record<OAuthProvider, boolean> }>(`/api/oauth/${provider}`, {
    method: 'DELETE',
  })

export const pullLiveSocialData = (input: {
  platform: OAuthProvider
  source: string
  current: PortfolioData
}) =>
  fetchApi<SocialPullResponse>('/api/social/pull', {
    method: 'POST',
    body: JSON.stringify(input),
  })

export const runAutoDesign = (current: PortfolioData) =>
  fetchApi<AutoDesignResponse>('/api/ai/auto-design', {
    method: 'POST',
    body: JSON.stringify({ current }),
  })

export const submitOnboarding = (payload: OnboardingInput) =>
  fetchApi<{ ok: boolean }>('/api/onboarding', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
