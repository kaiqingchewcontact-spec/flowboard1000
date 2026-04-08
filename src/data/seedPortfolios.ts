import { PORTFOLIO_TEMPLATES } from './templates'
import type { PortfolioData, TemplateCategory } from '../types'

const now = new Date().toISOString()

const makeProfile = (
  slug: string,
  templateId: string,
  displayName: string,
  category: TemplateCategory,
  role: string,
  tagline: string,
  bio: string,
): PortfolioData => ({
  id: `seed-${slug}`,
  slug,
  templateId,
  category,
  displayName,
  role,
  tagline,
  bio,
  location: 'Global',
  avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(displayName)}`,
  heroImageUrl: `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/600`,
  highlights: ['50M+ total reach', 'Featured in global media', 'Available for collaborations'],
  services: ['Brand campaigns', 'Speaking engagements', 'Strategic partnerships'],
  portfolioItems: [
    {
      title: 'Signature Project',
      description: 'A standout work that demonstrates identity, craft, and impact.',
      link: 'https://example.com',
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(`${slug}-1`)}/800/500`,
    },
    {
      title: 'Audience Growth Campaign',
      description: 'Cross-platform campaign that grew trust and engagement.',
      link: 'https://example.com',
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(`${slug}-2`)}/800/500`,
    },
    {
      title: 'Partnership Showcase',
      description: 'A curated view of collaboration and measurable outcomes.',
      link: 'https://example.com',
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(`${slug}-3`)}/800/500`,
    },
  ],
  testimonials: [
    {
      quote: 'Reliable, creative, and incredible to work with.',
      name: 'Partnership Lead',
      role: 'Global Brand',
    },
    {
      quote: 'Delivered beyond expectations with clear professional vision.',
      name: 'Creative Director',
      role: 'Studio Partner',
    },
  ],
  social: {
    instagram: '',
    linkedin: '',
    x: '',
    youtube: '',
    tiktok: '',
    website: '',
  },
  contactEmail: 'hello@example.com',
  contactPhone: '+1 555 0101',
  updatedAt: now,
})

export const SEED_PORTFOLIOS: PortfolioData[] = [
  makeProfile(
    'aria-velvet',
    'sonic-spotlight',
    'Aria Velvet',
    'Singer',
    'Pop & RnB Vocalist',
    'Live performances, cinematic visuals, and global collaborations.',
    'Aria blends intimate lyricism with high-energy production to create songs that travel from streaming charts to sold-out stages.',
  ),
  makeProfile(
    'milo-cast',
    'cinema-reel',
    'Milo Cast',
    'Actor',
    'Film & Stage Actor',
    'Character-driven acting for modern drama and thriller.',
    'Milo is known for emotionally grounded performances in independent films and international stage productions.',
  ),
  makeProfile(
    'dana-river',
    'public-pulse',
    'Dana River',
    'Public Figure',
    'Advocate & Speaker',
    'Public leadership, media interviews, and social impact.',
    'Dana speaks on civic growth, education reform, and youth empowerment across global forums.',
  ),
  makeProfile(
    'northstar-labs',
    'brand-prism',
    'Northstar Labs',
    'Company',
    'AI Product Company',
    'Designing practical AI products for fast-moving teams.',
    'Northstar Labs builds secure, human-centered AI systems for operations, analytics, and content at enterprise scale.',
  ),
  makeProfile(
    'everlane-group',
    'corporate-edge',
    'Everlane Group',
    'Company',
    'Advisory Firm',
    'Executive advisory and strategic growth programs.',
    'Everlane Group helps leadership teams modernize go-to-market strategies and build durable organizations.',
  ),
  makeProfile(
    'nia-noir',
    'luxe-persona',
    'Nia Noir',
    'Influencer',
    'Lifestyle Creator',
    'Premium storytelling across beauty, travel, and fashion.',
    'Nia curates visual narratives for luxury and emerging brands, balancing aesthetic craft with measurable engagement.',
  ),
  makeProfile(
    'kai-founder',
    'founder-grid',
    'Kai Founder',
    'Startup',
    'Startup CEO',
    'Building digital products that solve everyday friction.',
    'Kai is a repeat founder focused on tools that simplify customer operations and accelerate startup velocity.',
  ),
  makeProfile(
    'mono-creative',
    'creative-minimal',
    'Mono Creative',
    'Agency',
    'Creative Agency',
    'Minimal systems for identity, web, and growth campaigns.',
    'Mono Creative designs brand systems and conversion experiences for creators, teams, and ambitious companies.',
  ),
]

export const DEFAULT_EDITOR_PROFILE: PortfolioData = {
  ...SEED_PORTFOLIOS[0],
  id: 'draft-profile',
  slug: 'your-name',
  displayName: 'Your Name',
  role: 'Singer / Actor / Public Figure / Company',
  tagline: 'A short one-line value proposition.',
  bio: 'Write your story, achievements, and goals here. This text is fully editable from the portfolio editor.',
  highlights: ['1 key achievement', '2nd social proof', '3rd credibility point'],
  services: ['Service 1', 'Service 2', 'Service 3'],
}

export const isSeedSlug = (slug: string) => SEED_PORTFOLIOS.some((profile) => profile.slug === slug)

export const VALID_TEMPLATE_IDS = new Set(PORTFOLIO_TEMPLATES.map((template) => template.id))
