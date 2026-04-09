import { Link } from 'react-router-dom'
import { SEED_PORTFOLIOS } from '../data/seedPortfolios'
import { getTemplateById } from '../data/templates'

const featureSteps = [
  {
    title: 'Start with a trend-driven template',
    description:
      'Choose from 8 editorial template styles with distinct fonts, color systems, motion, and graphics.',
  },
  {
    title: 'Connect social OAuth + AI',
    description:
      'Connect Instagram, LinkedIn, and X. Flowboard pulls live profile context and drafts compelling landing copy.',
  },
  {
    title: 'Publish and share instantly',
    description:
      'Pick your custom slug, publish your board, and download a QR card for social bios and name cards.',
  },
]

const trustSignals = ['Creative founders', 'Talent managers', 'Personal brands', 'Studios', 'Agencies']

const valueCards = [
  {
    title: 'Editorial template architecture',
    description:
      'Template systems modeled from modern creative references: typography-led heroes, bento sections, and showcase grids.',
  },
  {
    title: 'Real social + AI workflow',
    description:
      'OAuth connections feed real profile context into OpenAI or Anthropic to generate sharper story, highlights, and CTA copy.',
  },
  {
    title: 'Launch-ready publishing',
    description:
      'Custom slug routing, social links, and QR export give every creator a shareable landing page in minutes.',
  },
]

export function HomePage() {
  const highlightedTemplates = SEED_PORTFOLIOS.slice(0, 6)

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
        <div className="home__hero-shell">
          <div className="home__hero-copy">
            <p className="home__eyebrow">Flowboard · AI Portfolio Boards</p>
            <h1>Build a conversion-ready portfolio landing page with live social intelligence</h1>
            <p>
              For singers, actors, public people, and brands. Flowboard combines creative template systems, social OAuth
              integrations, and production-grade AI generation in one editorial builder.
            </p>
            <div className="home__actions">
              <Link to="/onboarding" className="primary">
                Start onboarding
              </Link>
              <Link to="/editor">Open editor</Link>
              <Link to="/pricing">See pricing</Link>
            </div>
            <div className="home__hero-metrics">
              <article>
                <strong>8</strong>
                <span>Template architectures</span>
              </article>
              <article>
                <strong>3</strong>
                <span>Live OAuth sources</span>
              </article>
              <article>
                <strong>2</strong>
                <span>AI providers + custom API</span>
              </article>
            </div>
          </div>

          <aside className="home__hero-panel" aria-label="Flowboard editor preview">
            <p className="home__panel-label">Live Campaign View</p>
            <h2>AI-Powered Portfolio Launch</h2>
            <div className="home__panel-grid">
              <article>
                <p>Connected sources</p>
                <strong>Instagram · LinkedIn · X</strong>
              </article>
              <article>
                <p>Selected style</p>
                <strong>Bento + editorial hero</strong>
              </article>
              <article>
                <p>Publish status</p>
                <strong>Ready at /p/your-slug</strong>
              </article>
              <article>
                <p>Conversion assets</p>
                <strong>Slug link + QR card</strong>
              </article>
            </div>
            <Link className="home__panel-cta" to="/editor">
              Generate my landing page
            </Link>
          </aside>
        </div>
      </header>

      <section className="home__trust">
        <p>Built for</p>
        <div>
          {trustSignals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
      </section>

      <section className="home__section">
        <h2>How Flowboard works</h2>
        <div className="home__steps">
          {featureSteps.map((step, index) => (
            <article key={step.title} className="home__step-card">
              <p className="home__step-index">0{index + 1}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home__section home__value">
        <h2>Flowboard design + growth stack</h2>
        <div className="home__value-grid">
          {valueCards.map((card) => (
            <article key={card.title} className="home__value-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home__section">
        <h2>Template gallery</h2>
        <p>Choose a starter board, then adapt every section in the editor with live AI pulls.</p>
        <div className="home__grid">
          {highlightedTemplates.map((portfolio) => {
            const template = getTemplateById(portfolio.templateId)
            return (
              <article key={portfolio.slug} className="home__card">
                <img src={portfolio.heroImageUrl} alt={portfolio.displayName} />
                <div>
                  <p className="home__chip">{template.name}</p>
                  <h3>{portfolio.displayName}</h3>
                  <p>{portfolio.tagline}</p>
                  <p className="home__trend">{template.trendNote}</p>
                  <p className="home__inspiration">
                    Ref:{' '}
                    <a href={template.inspiration.url} target="_blank" rel="noreferrer">
                      {template.inspiration.studio}
                    </a>{' '}
                    · {template.architecture}{' '}
                    grid · {template.scrollEffect} scroll
                    {template.inspiration.access === 'limited' ? ' · limited crawl access' : ''}
                  </p>
                </div>
                <div className="home__card-actions">
                  <Link to={`/p/${portfolio.slug}`}>View page</Link>
                  <Link to={`/editor?slug=${portfolio.slug}`}>Edit template</Link>
                </div>
              </article>
            )
          })}
        </div>
        <div className="home__template-more">
          <Link to="/editor">View all templates in editor</Link>
        </div>
      </section>

      <section className="home__section home__pricing-teaser">
        <div className="home__pricing-header">
          <h2>Tiered pricing built for every stage</h2>
          <Link to="/pricing">Compare full pricing</Link>
        </div>
        <div className="home__pricing-grid">
          <article>
            <p>Starter</p>
            <strong>$29/mo</strong>
            <span>For solo creators launching one board.</span>
          </article>
          <article className="is-featured">
            <p>Pro</p>
            <strong>$89/mo</strong>
            <span>For teams that need multi-board workflows and faster production.</span>
          </article>
          <article>
            <p>Studio</p>
            <strong>Custom</strong>
            <span>For agencies and enterprise brand systems with managed onboarding.</span>
          </article>
        </div>
      </section>

      <section className="home__section home__insights">
        <h2>Ready to launch your Flowboard?</h2>
        <p>
          Start with onboarding, connect socials, and publish a polished landing page that is built for sharing and
          conversion.
        </p>
        <div className="home__insights-actions">
          <Link to="/onboarding">Start onboarding</Link>
          <Link to="/editor">Jump into editor</Link>
        </div>
      </section>
    </main>
  )
}
