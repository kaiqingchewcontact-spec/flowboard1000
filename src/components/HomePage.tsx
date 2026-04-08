import { Link } from 'react-router-dom'
import { SEED_PORTFOLIOS } from '../data/seedPortfolios'
import { getTemplateById } from '../data/templates'

export function HomePage() {
  return (
    <main className="home">
      <header className="home__hero">
        <p className="home__eyebrow">Webflow-style Portfolio Studio</p>
        <h1>8 Ready Portfolio Templates + Live Editor</h1>
        <p>
          Build portfolio pages for singers, actors, public figures, companies, and creators. Connect socials,
          auto-populate with AI, choose your slug, and generate QR name cards.
        </p>
        <div className="home__actions">
          <Link to="/editor" className="primary">
            Open Editor
          </Link>
        </div>
      </header>

      <section className="home__section">
        <h2>Template-Driven Portfolio Pages</h2>
        <p>Pick any starter page below, then open it in the editor to customize every section.</p>
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
                </div>
                <div className="home__card-actions">
                  <Link to={`/p/${portfolio.slug}`}>View Page</Link>
                  <Link to={`/editor?slug=${portfolio.slug}`}>Edit</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
