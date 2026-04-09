export type TemplateCategory =
  | 'Singer'
  | 'Actor'
  | 'Public Figure'
  | 'Company'
  | 'Influencer'
  | 'Consultant'
  | 'Startup'
  | 'Agency'

export interface PortfolioItem {
  title: string
  description: string
  link: string
  imageUrl: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
}

export interface SocialLinks {
  instagram: string
  linkedin: string
  x: string
  youtube: string
  tiktok: string
  website: string
}

export interface ApiConnections {
  aiProvider: 'OpenAI' | 'Anthropic' | 'Custom'
  aiModel: string
  customEndpoint: string
}

export interface PortfolioData {
  id: string
  slug: string
  templateId: string
  category: TemplateCategory
  displayName: string
  role: string
  tagline: string
  bio: string
  location: string
  avatarUrl: string
  heroImageUrl: string
  highlights: string[]
  services: string[]
  portfolioItems: PortfolioItem[]
  testimonials: Testimonial[]
  social: SocialLinks
  apiConnections: ApiConnections
  contactEmail: string
  contactPhone: string
  updatedAt: string
}

export interface TemplateTheme {
  pageBg: string
  cardBg: string
  text: string
  accent: string
  muted: string
  buttonText: string
  fontFamily: string
}

export interface PortfolioTemplate {
  id: string
  name: string
  description: string
  trendNote: string
  inspiration: {
    studio: string
    url: string
    tier: 'Free' | 'Paid'
    access: 'live' | 'limited'
  }
  category: TemplateCategory
  layout: 'spotlight' | 'split' | 'story' | 'grid'
  architecture: 'editorial' | 'bento' | 'timeline' | 'showcase'
  motion: 'float' | 'pulse' | 'pan'
  graphics: 'mesh' | 'rings' | 'grain' | 'minimal'
  scrollEffect: 'fade-up' | 'stagger' | 'parallax'
  heroBackgroundImage: string
  theme: TemplateTheme
}

export type EditorPanel =
  | 'basics'
  | 'bio'
  | 'services'
  | 'portfolio'
  | 'testimonials'
  | 'api'
  | 'social'
  | 'sharing'
