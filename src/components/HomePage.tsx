import { Link } from 'react-router-dom'
import { SEED_PORTFOLIOS } from '../data/seedPortfolios'
import { getTemplateById, PORTFOLIO_TEMPLATES } from '../data/templates'

const featureSteps = [
  {
    title: 'Connect your channels',
    description:
      'Use OAuth to connect Instagram, LinkedIn, and X so Flowboard can ingest real profile context.',
  },
  {
    title: 'Generate a compelling board',
    description:
      'Apply template architecture + AI to shape sharper messaging, structure, and conversion blocks.',
  },
  {
    title: 'Publish in one click',
    description:
      'Launch to your custom slug and share through social links, QR cards, and campaign touchpoints.',
  },
]

const trustSignals = ['Creative founders', 'Talent managers', 'Personal brands', 'Studios', 'Agencies']

const logoWall = ['Aster', 'Northbeam', 'Verve', 'Motif', 'Radius', 'Luma', 'Vertex']

const testimonials = [
  {
    quote:
      'Flowboard cut our launch time from days to hours. The AI copy and template architecture felt agency-grade out of the box.',
    name: 'Lena Moore',
    role: 'Talent Manager, Northbeam',
  },
  {
    quote:
      'We connected socials, selected a style, and published a polished board before our campaign call. Super practical product.',
    name: 'Kaito Reed',
    role: 'Creative Lead, Luma Studio',
  },
  {
    quote:
      'The slug + QR workflow is exactly what our team needed for events, press kits, and social bios.',
    name: 'Maya Carter',
    role: 'Marketing Director, Aster House',
  },
]

const valueCards = [
  {
    title: 'Editorial template architecture',
    description:
      'Template systems modeled from modern creative references: typography-led heroes, bento sections, and showcase grids.',
  },
  {
    title: 'Real social + AI workflow',
    description:
      'OAuth connections feed profile context into OpenAI or Anthropic to generate sharper story, highlights, and CTA copy.',
  },
  {
    title: 'Launch-ready publishing',
    description:
      'Custom slug routing, social links, and QR export give every creator a shareable landing page in minutes.',
  },
]

const pricingTeaser = [
  {
    name: 'Starter',
    price: '$29/mo',
    detail: 'For creators launching one polished board quickly.',
  },
  {
    name: 'Pro',
    price: '$89/mo',
    detail: 'For teams needing multi-board workflows and AI automation.',
    featured: true,
  },
  {
    name: 'Studio',
    price: 'Custom',
    detail: 'For agencies and enterprise brands with managed onboarding.',
  },
]

export function HomePage() {
  const highlightedTemplates = SEED_PORTFOLIOS
  const templateCount = PORTFOLIO_TEMPLATES.length

  return (
    <main className="home">
      <div className="home__sticky-nav-wrap">
        <nav className="home__sticky-nav">
          <Link className="home__brand-mark" to="/">
            Flowboard
          </Link>
          <div className="home__sticky-nav-links">
            <a href="#flowboard-overview">Overview</a>
            <a href="#flowboard-templates">Templates</a>
            <a href="#flowboard-pricing">Pricing</a>
            <a href="#flowboard-testimonials">Testimonials</a>
          </div>
          <div className="home__sticky-nav-actions">
            <Link to="/pricing">Pricing</Link>
            <Link to="/editor">Editor</Link>
            <Link className="is-primary" to="/onboarding">
              Start free
            </Link>
          </div>
        </nav>
      </div>

      <header id="flowboard-overview" className="home__hero">
        <div className="home__hero-shell">
          <div className="home__hero-copy">
            <p className="home__eyebrow">Flowboard · AI Portfolio Boards</p>
            <h1>Turn your portfolio into a modern SaaS-style landing page</h1>
            <p>
              For singers, actors, public people, and brands. Flowboard blends template architecture, live OAuth data,
              and AI generation into one conversion-focused publishing workflow.
            </p>
            <div className="home__actions">
              <Link to="/onboarding" className="primary">
                Start free onboarding
              </Link>
              <Link to="/editor">Open live editor</Link>
              <Link to="/pricing">View pricing</Link>
            </div>
            <div className="home__hero-metrics">
              <article>
                <strong>{templateCount}</strong>
                <span>Template architectures</span>
              </article>
              <article>
                <strong>3</strong>
                <span>OAuth channels</span>
              </article>
              <article>
                <strong>2+</strong>
                <span>AI providers</span>
              </article>
            </div>
          </div>

          <aside className="home__hero-panel" aria-label="Flowboard product mockup">
            <p className="home__panel-label">Live product preview</p>
            <h2>AI-powered conversion landing setup</h2>
            <div className="home__panel-grid">
              <article>
                <p>Connected channels</p>
                <strong>Instagram · LinkedIn · X</strong>
              </article>
              <article>
                <p>Template direction</p>
                <strong>Bento + editorial hero</strong>
              </article>
              <article>
                <p>Publish state</p>
                <strong>Ready at /p/your-slug</strong>
              </article>
              <article>
                <p>Share assets</p>
                <strong>Link + QR card</strong>
              </article>
            </div>
            <div className="home__mockup-device">
              <div className="home__mockup-head">
                <span />
                <span />
                <span />
              </div>
              <div className="home__mockup-screen">
                <div className="home__mockup-row">
                  <span className="w-lg" />
                  <span className="w-sm" />
                </div>
                <div className="home__mockup-row">
                  <span className="w-md" />
                  <span className="w-md" />
                </div>
                <div className="home__mockup-cards">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
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

      <section className="home__section home__logos" aria-label="Logo wall">
        <p>Used by teams shaping modern brand pages</p>
        <div>
          {logoWall.map((logo) => (
            <span key={logo}>{logo}</span>
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

      <section id="flowboard-templates" className="home__section">
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
                    · {template.architecture} grid · {template.scrollEffect} scroll
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

      <section id="flowboard-pricing" className="home__section home__pricing-teaser">
        <div className="home__pricing-header">
          <h2>Tiered pricing for every stage</h2>
          <Link to="/pricing">Compare all plan details</Link>
        </div>
        <div className="home__pricing-grid">
          {pricingTeaser.map((plan) => (
            <article key={plan.name} className={plan.featured ? 'is-featured' : ''}>
              <p>{plan.name}</p>
              <strong>{plan.price}</strong>
              <span>{plan.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="flowboard-testimonials" className="home__section home__testimonials">
        <h2>What teams say about Flowboard</h2>
        <div className="home__testimonial-track">
          {testimonials.map((item) => (
            <article key={item.name} className="home__testimonial-card">
              <p>"{item.quote}"</p>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="home__section home__insights">
        <h2>Ready to launch your Flowboard?</h2>
        <p>
          Connect socials, let AI shape your story, and publish a polished landing page designed for conversion and
          sharing.
        </p>
        <div className="home__insights-actions">
          <Link to="/onboarding">Start onboarding</Link>
          <Link to="/editor">Jump into editor</Link>
        </div>
      </section>
    </main>
  )
}
