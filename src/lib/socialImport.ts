import { PORTFOLIO_TEMPLATES } from '../data/templates'
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
  const tokenByPlatform: Record<SocialPlatform, string> = {
    instagram: current.apiConnections.instagramToken,
    linkedin: current.apiConnections.linkedinToken,
    x: current.apiConnections.xToken,
  }

  if (!tokenByPlatform[platform].trim()) {
    throw new Error(`Connect your ${platform === 'x' ? 'X' : platform} API token in API Connect first.`)
  }

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
        `AI-enriched social profile (${current.apiConnections.aiProvider} · ${current.apiConnections.aiModel})`,
      ]),
    ).slice(0, 5),
    social: {
      ...current.social,
      [platform]: socialLink,
    },
    avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(handle)}`,
  }
}

const templateByCategory = (category: PortfolioData['category']) => {
  const categoryTemplate = PORTFOLIO_TEMPLATES.find((template) => template.category === category)
  return categoryTemplate ?? PORTFOLIO_TEMPLATES[0]
}

export const autoDesignLandingPage = async ({
  current,
}: LandingAutoDesignInput): Promise<Partial<PortfolioData>> => {
  const tokenByPlatform: Record<SocialPlatform, string> = {
    instagram: current.apiConnections.instagramToken,
    linkedin: current.apiConnections.linkedinToken,
    x: current.apiConnections.xToken,
  }

  const connectedPlatforms = (['instagram', 'linkedin', 'x'] as const).filter(
    (platform) => tokenByPlatform[platform].trim().length > 0,
  )

  if (current.apiConnections.aiProvider === 'Custom' && !current.apiConnections.customEndpoint.trim()) {
    throw new Error('Custom AI provider selected. Please add a custom AI endpoint first.')
  }

  if (connectedPlatforms.length === 0) {
    throw new Error('Connect at least one social API token before running AI auto-design.')
  }

  await wait(900)

  const selectedTemplate = templateByCategory(current.category)
  const socialProof = connectedPlatforms
    .map((platform) => `${platform === 'x' ? 'X' : platform} connected`)
    .join(' · ')

  const maybeWebsite =
    current.social.website.trim() || `https://flowboard.site/${current.slug || current.displayName.toLowerCase()}`

  return {
    templateId: selectedTemplate.id,
    tagline: `${current.displayName} on Flowboard — ${selectedTemplate.trendNote.toLowerCase()}.`,
    bio: `${current.bio}\n\nDesigned by AI from your connected social graph (${socialProof}).`,
    highlights: Array.from(
      new Set([
        ...current.highlights,
        `Auto-designed with ${current.apiConnections.aiProvider}`,
        selectedTemplate.trendNote,
        `Landing style: ${selectedTemplate.name}`,
      ]),
    ).slice(0, 6),
    services: Array.from(
      new Set([
        ...current.services,
        'Brand-safe landing page automation',
        'Social profile to portfolio sync',
        'AI narrative and design enhancement',
      ]),
    ).slice(0, 6),
    social: {
      ...current.social,
      website: maybeWebsite,
    },
  }
}
