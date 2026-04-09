import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SEED_PORTFOLIOS } from '../data/seedPortfolios'
import { getTemplateById, PORTFOLIO_TEMPLATES } from '../data/templates'

const featureSteps = [
  {
    title: 'Connect your channels',
    description:
      'Use OAuth to connect Instagram, LinkedIn, and X so Flowboard can ingest real profile context automatically.',
  },
  {
    title: 'Generate your page with AI',
    description:
      'Apply editorial templates + AI to generate sharper headlines, bios, social proof, and conversion-ready structure.',
  },
  {
    title: 'Publish + share instantly',
    description:
      'Launch on your custom slug, add social links, and export QR cards for bios, pitch decks, and name cards.',
  },
]

const trustSignals = ['Creative founders', 'Talent managers', 'Public figures', 'Studios', 'Agencies']
const logoWall = ['Aster', 'Northbeam', 'Verve', 'Motif', 'Radius', 'Luma', 'Vertex']

const testimonials = [
  {
    quote:
      'Flowboard cut our launch process from days to hours. The AI copy output was immediately usable for campaign pages.',
    name: 'Lena Moore',
    role: 'Talent Manager, Northbeam',
  },
  {
    quote:
      'The OAuth pull + template system makes this different from normal link tools. It actually feels like a full landing builder.',
    name: 'Kaito Reed',
    role: 'Creative Lead, Luma Studio',
  },
  {
    quote:
      'The custom slug and QR flow drove more inquiries at events. We now use Flowboard as our default profile launch stack.',
    name: 'Maya Carter',
    role: 'Marketing Director, Aster House',
  },
]

const pricingTeaser = [
  {
    name: 'Free',
    price: '$0',
    detail: '1 board on subdomain · manual edits',
  },
  {
    name: 'Starter',
    price: '$19/mo',
    detail: '1 board · OAuth + basic AI',
  },
  {
    name: 'Pro',
    price: '$49/mo',
    detail: 'Unlimited boards · unlimited AI',
    featured: true,
  },
  {
    name: 'Studio',
    price: '$99/mo',
    detail: 'Enterprise controls + onboarding',
  },
]

const faqs = [
  {
    q: 'How secure is my social data?',
    a: 'OAuth access tokens are stored server-side in the encrypted Flowboard vault and are never exposed in the browser.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Plans are month-to-month by default, with optional annual billing discounts.',
  },
  {
    q: 'Do I need design or code skills?',
    a: 'No. You can connect channels, generate copy/design direction, and publish in minutes from the editor.',
  },
]

export function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const highlightedTemplates = SEED_PORTFOLIOS.slice(0, 8)
  const activeTestimonial = testimonials[testimonialIndex]
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
            <a href="#flowboard-faq">FAQ</a>
          </div>
          <div className="home__sticky-nav-actions">
            <Link to="/pricing">Pricing</Link>
            <Link to="/editor">Editor</Link>
            <Link className="is-primary" to="/onboarding">
              Build in 60s
            </Link>
          </div>
        </nav>
      </div>

      <header id="flowboard-overview" className="home__hero">
        <div className="home__hero-shell">
          <div className="home__hero-copy">
            <p className="home__eyebrow">Flowboard · AI Portfolio Boards</p>
            <h1>Launch a stunning, conversion-optimized portfolio page in under 8 minutes</h1>
            <p>
              Flowboard automatically pulls your real Instagram, LinkedIn, and X data, applies proven editorial
              templates, and uses AI to write sharp copy so you can publish a professional landing page that converts.
              Built for singers, actors, creators, public figures, and personal brands.
            </p>
            <div className="home__actions">
              <Link to="/onboarding" className="primary">
                Start Free — Build My Page Now
              </Link>
              <Link to="/editor">Open Live Editor</Link>
              <a href="#flowboard-templates">See live examples</a>
            </div>
            <div className="home__hero-metrics">
              <article>
                <strong>8 min</strong>
                <span>Average time to launch</span>
              </article>
              <article>
                <strong>3</strong>
                <span>Social channels connected live</span>
              </article>
              <article>
                <strong>2x</strong>
                <span>More inquiries reported by users</span>
              </article>
            </div>
          </div>

          <aside className="home__hero-panel" aria-label="Flowboard product mockup">
            <p className="home__panel-label">Interactive product preview</p>
            <h2>AI-powered conversion setup</h2>
            <div className="home__mockup">
              <div className="home__mockup-card">
                <div className="home__mockup-toolbar">
                  <div className="home__mockup-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="home__mockup-canvas">
                  <div className="home__mockup-hero" />
                  <div className="home__mockup-content">
                    <article>
                      <p>OAuth</p>
                      <strong>Instagram + LinkedIn + X</strong>
                    </article>
                    <article>
                      <p>Template style</p>
                      <strong>Editorial + bento</strong>
                    </article>
                    <article>
                      <p>Status</p>
                      <strong>Ready to publish</strong>
                    </article>
                  </div>
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
        <p>Trusted by teams shaping modern brand pages</p>
        <div className="home__logo-grid">
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

      <section id="flowboard-templates" className="home__section">
        <h2>{templateCount} editorial templates with live AI adaptation</h2>
        <p>Choose a starter board, then adapt every section in the editor with live social pulls.</p>
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
      </section>

      <section id="flowboard-pricing" className="home__section home__pricing-teaser">
        <div className="home__pricing-header">
          <h2>Pricing built for growth</h2>
          <Link to="/pricing">Compare full pricing</Link>
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

      <section id="flowboard-testimonials" className="home__section home__testimonials-wrap">
        <h3>What teams say about Flowboard</h3>
        <article className="home__testimonial home__testimonial--active">
          <p>"{activeTestimonial.quote}"</p>
          <footer>
            <strong>{activeTestimonial.name}</strong> · <span>{activeTestimonial.role}</span>
          </footer>
        </article>
        <div className="home__testimonial-controls">
          <button
            type="button"
            onClick={() =>
              setTestimonialIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
            }
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setTestimonialIndex((current) => (current + 1) % testimonials.length)}
          >
            Next
          </button>
        </div>
      </section>

      <section id="flowboard-faq" className="home__section home__faq">
        <h2>Frequently asked questions</h2>
        <div className="home__faq-grid">
          {faqs.map((faq) => (
            <article key={faq.q} className="home__faq-item">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
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
