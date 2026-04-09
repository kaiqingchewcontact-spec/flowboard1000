export type Provider = 'instagram' | 'linkedin' | 'x'

export interface OAuthTokenSet {
  accessToken: string
  refreshToken?: string
  tokenType?: string
  scope?: string
  expiresAt?: number
}

export interface VaultRecord {
  providers: Partial<Record<Provider, OAuthTokenSet>>
}

export interface SocialProfile {
  provider: Provider
  username: string
  displayName: string
  bio: string
  profileUrl: string
  avatarUrl?: string
  followers?: number
}

export interface AiSettings {
  aiProvider: 'OpenAI' | 'Anthropic' | 'Custom'
  aiModel: string
  customEndpoint?: string
}
