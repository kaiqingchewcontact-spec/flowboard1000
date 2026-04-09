import { Link } from 'react-router-dom'
import { PORTFOLIO_TEMPLATES } from '../data/templates'

const TIERS = [
  {
    name: 'Starter',
    price: '$19/mo',
    idealFor: 'Solo creators launching their first portfolio board',
    features: [
      '1 published Flowboard page',
      `${PORTFOLIO_TEMPLATES.length} template library access`,
      'Slug + QR publishing',
      'Basic analytics snapshots',
    ],
  },
  {
    name: 'Pro',
    price: '$59/mo',
    idealFor: 'Professionals and public figures growing inbound opportunities',
    features: [
      '5 active portfolio boards',
      'OAuth social integrations (Instagram, LinkedIn, X)',
      'AI auto-design and social pull',
      'Custom sections and enhanced SEO controls',
    ],
    highlighted: true,
  },
  {
    name: 'Scale',
    price: '$149/mo',
    idealFor: 'Agencies and companies managing multiple client brands',
    features: [
      '25 active boards with team collaboration',
      'Advanced AI brand voice presets',
      'Priority onboarding and migration help',
      'API/webhook automation support',
    ],
  },
]

export function PricingPage() {
  return (
    <main className="page page--pricing">
      <header className="page__header">
        <p className="page__eyebrow">Flowboard Pricing</p>
        <h1>Tiered plans for creators, brands, and agencies</h1>
        <p>Start simple, then scale into deeper API automation and AI-powered landing optimization.</p>
      </header>

      <section className="pricing-grid">
        {TIERS.map((tier) => (
          <article
            key={tier.name}
            className={`pricing-card${tier.highlighted ? ' pricing-card--highlighted' : ''}`}
          >
            <h2>{tier.name}</h2>
            <p className="pricing-card__price">{tier.price}</p>
            <p className="pricing-card__ideal">{tier.idealFor}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link to="/onboarding">Choose {tier.name}</Link>
          </article>
        ))}
      </section>
    </main>
  )
}
