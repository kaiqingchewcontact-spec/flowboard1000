import type { PortfolioData } from '../types'

type SocialPlatform = 'instagram' | 'linkedin' | 'x'

interface SocialPullInput {
  platform: SocialPlatform
  source: string
  current: PortfolioData
}

const toHandle = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    const path = url.pathname.replace(/^\/+|\/+$/g, '')
    return path.split('/')[0]?.replace('@', '') ?? trimmed.replace('@', '')
  } catch {
    return trimmed.replace('@', '').split('/').pop() ?? trimmed
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const pullSocialDataWithAI = async ({
  platform,
  source,
  current,
}: SocialPullInput): Promise<Partial<PortfolioData>> => {
  const handle = toHandle(source)
  if (!handle) {
    throw new Error('Please enter a username or profile URL first.')
  }

  // Demo AI behavior: predictable transformation so users can see
  // how imported social context updates editable portfolio fields.
  await wait(700)

  const prettyHandle = handle
    .split(/[-_.]/g)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')

  const roleByPlatform: Record<SocialPlatform, string> = {
    instagram: 'Creator',
    linkedin: 'Professional',
    x: 'Public Voice',
  }

  const summaryByPlatform: Record<SocialPlatform, string> = {
    instagram:
      'Visual-first storytelling with high engagement and audience resonance.',
    linkedin:
      'Professional thought leadership backed by proven achievements and partnerships.',
    x: 'Fast-moving commentary, industry updates, and conversation-led growth.',
  }

  const socialLink = source.startsWith('http')
    ? source
    : platform === 'instagram'
      ? `https://instagram.com/${handle}`
      : platform === 'linkedin'
        ? `https://linkedin.com/in/${handle}`
        : `https://x.com/${handle}`

  return {
    displayName: current.displayName === 'Your Name' ? prettyHandle : current.displayName,
    role:
      current.role === 'Singer / Actor / Public Figure / Company'
        ? `${roleByPlatform[platform]} Portfolio`
        : current.role,
    tagline:
      current.tagline === 'A short one-line value proposition.'
        ? `AI-updated profile from ${platform === 'x' ? 'X' : platform} insights`
        : current.tagline,
    bio: `${current.bio}\n\nAI import note: ${summaryByPlatform[platform]}`,
    highlights: Array.from(
      new Set([
        ...current.highlights,
        `${platform === 'x' ? 'X' : platform} handle: @${handle}`,
        'AI-enriched social profile',
      ]),
    ).slice(0, 5),
    social: {
      ...current.social,
      [platform]: socialLink,
    },
    avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(handle)}`,
  }
}
