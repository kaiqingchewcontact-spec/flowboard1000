import { Link } from 'react-router-dom'
import { SEED_PORTFOLIOS } from '../data/seedPortfolios'
import { getTemplateById } from '../data/templates'

const featureSteps = [
  {
    title: '1) Start with a trend-driven template',
    description:
      'Choose from 8 editorial template styles with distinct fonts, color systems, motion, and graphics.',
  },
  {
    title: '2) Connect social OAuth + AI',
    description:
      'Connect Instagram, LinkedIn, and X. Flowboard pulls live profile context and drafts compelling landing copy.',
  },
  {
    title: '3) Publish and share instantly',
    description:
      'Pick your custom slug, publish your board, and download a QR card for social bios and name cards.',
  },
]

export function HomePage() {
  return (
    <main className="home">
      <header className="home__hero">
        <nav className="home__top-nav">
          <Link to="/">Flowboard</Link>
          <div>
            <Link to="/onboarding">Onboarding</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/editor">Editor</Link>
          </div>
        </nav>
        <p className="home__eyebrow">Flowboard · AI Portfolio Boards</p>
        <h1>Create a compelling portfolio landing page with live social data</h1>
        <p>
          Built for singers, actors, public figures, companies, and creators. Flowboard combines design templates,
          OAuth integrations, and real AI generation to automate a high-conversion portfolio board.
        </p>
        <div className="home__actions">
          <Link to="/onboarding" className="primary">
            Start onboarding
          </Link>
          <Link to="/editor">Open editor</Link>
          <Link to="/pricing">See tiered pricing</Link>
        </div>
      </header>

      <section className="home__section">
        <h2>How Flowboard works</h2>
        <div className="home__steps">
          {featureSteps.map((step) => (
            <article key={step.title} className="home__step-card">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home__section">
        <h2>8 Trend-Driven Portfolio Templates</h2>
        <p>Pick any starter board below, then open it in the editor to customize every section.</p>
        <div className="home__grid">
          {SEED_PORTFOLIOS.map((portfolio) => {
            const template = getTemplateById(portfolio.templateId)
            return (
              <article key={portfolio.slug} className="home__card">
                <img src={portfolio.heroImageUrl} alt={portfolio.displayName} />
                <div>
                  <p className="home__chip">{template.name}</p>
                  <h3>{portfolio.displayName}</h3>
                  <p>{portfolio.tagline}</p>
                  <p className="home__trend">{template.trendNote}</p>
                </div>
                <div className="home__card-actions">
                  <Link to={`/p/${portfolio.slug}`}>View page</Link>
                  <Link to={`/editor?slug=${portfolio.slug}`}>Edit template</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="home__section home__insights">
        <h2>Design direction used in Flowboard templates</h2>
        <ul>
          <li>Editorial typography with oversized hero headlines for faster first-glance clarity.</li>
          <li>Bento-style information grids for better scanning and conversion-focused structure.</li>
          <li>Purposeful kinetic motion + micro-interactions for modern perceived quality.</li>
          <li>Accent gradients and glass-like layers used selectively for premium depth.</li>
        </ul>
      </section>
    </main>
  )
}
