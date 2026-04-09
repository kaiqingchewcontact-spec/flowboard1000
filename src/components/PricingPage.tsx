import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

interface Tier {
  name: string
  monthlyPrice: string
  annualPrice: string
  annualCaption: string
  idealFor: string
  features: string[]
  highlighted?: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    annualPrice: '$0',
    annualCaption: 'Always free',
    idealFor: 'Testing, students, and side projects',
    features: [
      '1 board on Flowboard subdomain',
      'Manual editing only',
      'Template access for evaluation',
      'Basic share link',
    ],
  },
  {
    name: 'Starter',
    monthlyPrice: '$19',
    annualPrice: '$171',
    annualCaption: '$14.25/mo billed yearly',
    idealFor: 'Solo creators and talents launching professionally',
    features: [
      '1 custom-slug published board',
      '5 AI generations / month',
      'Instagram + LinkedIn + X OAuth',
      'QR export + enhanced share controls',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: '$49',
    annualPrice: '$441',
    annualCaption: '$36.75/mo billed yearly',
    idealFor: 'Teams, agencies, and serious growth workflows',
    features: [
      'Unlimited published boards',
      'Unlimited AI generations',
      '3 team seats',
      'Analytics dashboard + custom domains',
    ],
    highlighted: true,
  },
  {
    name: 'Studio / Enterprise',
    monthlyPrice: '$99',
    annualPrice: '$891',
    annualCaption: 'or custom enterprise contract',
    idealFor: 'Agencies and brands requiring scale + SLA',
    features: [
      'White-label options',
      'Unlimited seats',
      'API + webhook automations',
      'Dedicated onboarding + priority support',
    ],
  },
]

const COMPARISON_ROWS = [
  {
    label: 'Live OAuth social ingestion',
    flowboard: 'Yes (Instagram, LinkedIn, X)',
    linktree: 'No',
    carrd: 'No',
    manualBuild: 'Custom integration required',
  },
  {
    label: 'AI landing narrative generation',
    flowboard: 'Yes',
    linktree: 'Limited',
    carrd: 'No',
    manualBuild: 'Depends on stack',
  },
  {
    label: 'Editorial template architecture',
    flowboard: 'Yes',
    linktree: 'Basic',
    carrd: 'Basic',
    manualBuild: 'Manual effort',
  },
  {
    label: 'Publish speed',
    flowboard: 'Under 8 minutes',
    linktree: 'Fast',
    carrd: 'Fast',
    manualBuild: 'Days to weeks',
  },
]

export function PricingPage() {
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('annual')
  const savingsLabel = useMemo(() => (billingMode === 'annual' ? 'Annual billing: save 25%' : 'Monthly billing'), [billingMode])

  return (
    <main className="page page--pricing">
      <header className="page__header">
        <p className="page__eyebrow">Flowboard Pricing</p>
        <h1>Fair pricing for creators, teams, and agencies</h1>
        <p>
          Start free, upgrade when ready, and scale with real OAuth + AI workflows built for conversion-focused landing
          pages.
        </p>
      </header>

      <section className="pricing__billing-toggle">
        <p>{savingsLabel}</p>
        <div>
          <button
            type="button"
            className={billingMode === 'monthly' ? 'is-active' : ''}
            onClick={() => setBillingMode('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={billingMode === 'annual' ? 'is-active' : ''}
            onClick={() => setBillingMode('annual')}
          >
            Annual (save 25%)
          </button>
        </div>
      </section>

      <section className="pricing-grid">
        {TIERS.map((tier) => {
          const price = billingMode === 'monthly' ? tier.monthlyPrice : tier.annualPrice
          const suffix = billingMode === 'monthly' ? '/mo' : '/yr'

          return (
            <article
              key={tier.name}
              className={`pricing-card${tier.highlighted ? ' pricing-card--highlighted' : ''}`}
            >
              <h2>{tier.name}</h2>
              <p className="pricing-card__price">
                {price}
                {tier.name === 'Free' ? '' : suffix}
              </p>
              <p className="pricing-card__ideal">{tier.idealFor}</p>
              <p className="pricing-card__caption">{tier.annualCaption}</p>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link to="/onboarding">
                {tier.name === 'Free' ? 'Start free' : `Choose ${tier.name}`}
              </Link>
            </article>
          )
        })}
      </section>

      <section className="pricing__comparison">
        <h2>Flowboard vs common alternatives</h2>
        <div className="pricing__comparison-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Flowboard</th>
                <th>Linktree/Beacons</th>
                <th>Carrd</th>
                <th>Manual designer + dev</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.flowboard}</td>
                  <td>{row.linktree}</td>
                  <td>{row.carrd}</td>
                  <td>{row.manualBuild}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pricing__notes">
        <p>Need more generations? Add AI credit packs (e.g., $10 for 50 extra generations).</p>
        <p>Launch offer: annual plans include a 25% discount and faster onboarding queue.</p>
      </section>
    </main>
  )
}
