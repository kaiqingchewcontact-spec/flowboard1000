import { getTemplateById } from '../data/templates'
import type { CSSProperties } from 'react'
import type { PortfolioData } from '../types'

interface PortfolioRendererProps {
  profile: PortfolioData
  shareUrl?: string
  mode?: 'public' | 'preview'
}

const socialLabelMap: Record<keyof PortfolioData['social'], string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  website: 'Website',
}

export function PortfolioRenderer({
  profile,
  shareUrl,
  mode = 'public',
}: PortfolioRendererProps) {
  const template = getTemplateById(profile.templateId)
  const socialEntries = Object.entries(profile.social).filter(([, url]) => url.trim().length > 0)

  return (
    <article
      className={`portfolio portfolio--${template.layout}`}
      style={
        {
          '--page-bg': template.theme.pageBg,
          '--card-bg': template.theme.cardBg,
          '--text-color': template.theme.text,
          '--accent-color': template.theme.accent,
          '--muted-color': template.theme.muted,
          '--button-text': template.theme.buttonText,
          '--font-family': template.theme.fontFamily,
        } as CSSProperties
      }
    >
      <header className="portfolio__hero">
        <img className="portfolio__hero-image" src={profile.heroImageUrl} alt={`${profile.displayName} banner`} />
        <div className="portfolio__hero-overlay" />
        <div className="portfolio__hero-content">
          <img className="portfolio__avatar" src={profile.avatarUrl} alt={profile.displayName} />
          <div>
            <p className="portfolio__chip">{profile.category}</p>
            <h1>{profile.displayName}</h1>
            <p className="portfolio__role">{profile.role}</p>
            <p className="portfolio__tagline">{profile.tagline}</p>
          </div>
        </div>
      </header>

      <section className="portfolio__section">
        <h2>About</h2>
        <p>{profile.bio}</p>
      </section>

      <section className="portfolio__section">
        <h2>Highlights</h2>
        <ul className="portfolio__list">
          {profile.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>

      <section className="portfolio__section">
        <h2>Services & Collaborations</h2>
        <div className="portfolio__pill-list">
          {profile.services.map((service) => (
            <span key={service} className="portfolio__pill">
              {service}
            </span>
          ))}
        </div>
      </section>

      <section className="portfolio__section">
        <h2>Portfolio</h2>
        <div className="portfolio__grid">
          {profile.portfolioItems.map((item) => (
            <a key={item.title} className="portfolio__card" href={item.link} target="_blank" rel="noreferrer">
              <img src={item.imageUrl} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="portfolio__section">
        <h2>Testimonials</h2>
        <div className="portfolio__testimonials">
          {profile.testimonials.map((testimonial) => (
            <blockquote key={`${testimonial.name}-${testimonial.role}`}>
              <p>"{testimonial.quote}"</p>
              <footer>
                {testimonial.name} · {testimonial.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="portfolio__section portfolio__contact">
        <h2>Contact</h2>
        <p>Email: {profile.contactEmail}</p>
        <p>Phone: {profile.contactPhone}</p>
        <p>Location: {profile.location}</p>
      </section>

      {socialEntries.length > 0 && (
        <section className="portfolio__section">
          <h2>Social</h2>
          <div className="portfolio__socials">
            {socialEntries.map(([key, value]) => (
              <a key={key} href={value} target="_blank" rel="noreferrer">
                {socialLabelMap[key as keyof PortfolioData['social']]}
              </a>
            ))}
          </div>
        </section>
      )}

      {shareUrl && (
        <section className="portfolio__section portfolio__share">
          <h2>Share</h2>
          <p>
            Public slug: <strong>/{profile.slug}</strong>
          </p>
          <a href={shareUrl} target="_blank" rel="noreferrer">
            {shareUrl}
          </a>
          {mode === 'preview' && <p>This preview updates live as you edit.</p>}
        </section>
      )}
    </article>
  )
}
