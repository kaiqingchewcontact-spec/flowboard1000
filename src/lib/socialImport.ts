import { pullLiveSocialData, runAutoDesign } from './backendApi'
import type { PortfolioData } from '../types'

type SocialPlatform = 'instagram' | 'linkedin' | 'x'

interface SocialPullInput {
  platform: SocialPlatform
  source: string
  current: PortfolioData
}

interface LandingAutoDesignInput {
  current: PortfolioData
}

export const pullSocialDataWithAI = async ({
  platform,
  source,
  current,
}: SocialPullInput): Promise<Partial<PortfolioData>> => {
  const response = await pullLiveSocialData({
    platform,
    source,
    current,
  })

  return {
    ...response.updates,
    social: {
      ...current.social,
      ...response.updates.social,
      [platform]: response.socialProfile.profileUrl || source || current.social[platform],
    },
    avatarUrl: response.socialProfile.avatarUrl || response.updates.avatarUrl || current.avatarUrl,
    displayName:
      response.updates.displayName || response.socialProfile.displayName || current.displayName,
  }
}

export const autoDesignLandingPage = async ({
  current,
}: LandingAutoDesignInput): Promise<Partial<PortfolioData>> => {
  const response = await runAutoDesign(current)
  return response.updates
}
