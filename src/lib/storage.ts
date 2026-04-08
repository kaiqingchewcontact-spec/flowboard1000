import { SEED_PORTFOLIOS, VALID_TEMPLATE_IDS } from '../data/seedPortfolios'
import { PORTFOLIO_TEMPLATES } from '../data/templates'
import type { PortfolioData } from '../types'

const STORAGE_KEY = 'flowboard-profiles-v2'
const LEGACY_STORAGE_KEY = 'portfolio-studio-profiles-v1'

const DEFAULT_API_CONNECTIONS: PortfolioData['apiConnections'] = {
  instagramToken: '',
  linkedinToken: '',
  xToken: '',
  aiProvider: 'OpenAI',
  aiModel: 'gpt-4.1-mini',
  customEndpoint: '',
}

const normalizeSlug = (slug: string) =>
  slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const sanitizeProfile = (profile: PortfolioData): PortfolioData => {
  const templateId = VALID_TEMPLATE_IDS.has(profile.templateId)
    ? profile.templateId
    : PORTFOLIO_TEMPLATES[0].id

  return {
    ...profile,
    slug: normalizeSlug(profile.slug) || 'my-portfolio',
    templateId,
    apiConnections: profile.apiConnections ?? DEFAULT_API_CONNECTIONS,
    updatedAt: profile.updatedAt || new Date().toISOString(),
  }
}

export const getSavedProfiles = (): PortfolioData[] => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PortfolioData[]
    if (!Array.isArray(parsed)) return []
    return parsed.map(sanitizeProfile)
  } catch {
    return []
  }
}

export const saveProfile = (profile: PortfolioData): PortfolioData => {
  const savedProfiles = getSavedProfiles()
  const normalized = sanitizeProfile(profile)
  const nextProfiles = savedProfiles.filter((item) => item.id !== normalized.id && item.slug !== normalized.slug)
  nextProfiles.unshift(normalized)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfiles))
  return normalized
}

export const getAllProfiles = (): PortfolioData[] => {
  const merged = [...SEED_PORTFOLIOS, ...getSavedProfiles()]
  const bySlug = new Map<string, PortfolioData>()
  merged.forEach((profile) => {
    bySlug.set(profile.slug, profile)
  })
  return [...bySlug.values()]
}

export const getProfileBySlug = (slug: string): PortfolioData | undefined => {
  const normalized = normalizeSlug(slug)
  return getAllProfiles().find((profile) => profile.slug === normalized)
}

export const slugExists = (slug: string, currentId?: string): boolean => {
  const normalized = normalizeSlug(slug)
  return getAllProfiles().some((profile) => profile.slug === normalized && profile.id !== currentId)
}

export const normalizePortfolioSlug = normalizeSlug
