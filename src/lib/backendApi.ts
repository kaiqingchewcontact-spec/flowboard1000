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

const parseApiError = async (response: Response) => {
  try {
    const payload = (await response.json()) as ApiErrorPayload
    return payload.error || `Request failed (${response.status}).`
  } catch {
    return `Request failed (${response.status}).`
  }
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

  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }

  return (await response.json()) as T
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
