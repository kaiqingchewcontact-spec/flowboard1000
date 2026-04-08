import { Link } from 'react-router-dom'
import { SEED_PORTFOLIOS } from '../data/seedPortfolios'
import { getTemplateById } from '../data/templates'

export function HomePage() {
  return (
    <main className="home">
      <header className="home__hero">
        <p className="home__eyebrow">Flowboard · AI Portfolio Boards</p>
        <h1>Create a Compelling Portfolio Landing Page in Minutes</h1>
        <p>
          Build portfolio boards for singers, actors, public figures, companies, and creators. Choose a trending
          template style, connect social APIs, let AI pull profile signals, then publish to your own slug + QR card.
        </p>
        <div className="home__actions">
          <Link to="/editor" className="primary">
            Launch Flowboard Editor
          </Link>
        </div>
      </header>

      <section className="home__section">
        <h2>8 Trend-Driven Portfolio Templates</h2>
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
                  <p className="home__trend">{template.trendNote}</p>
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

      <section className="home__section home__insights">
        <h2>Flowboard Trend Research</h2>
        <ul>
          <li>Editorial typography with large hero headlines improves first-glance clarity.</li>
          <li>Bento-style content grids make dense portfolio information easier to scan.</li>
          <li>Subtle kinetic motion and micro-interactions increase perceived polish and trust.</li>
          <li>Gradient and glass-like layers work best when used as accents, not everywhere.</li>
        </ul>
      </section>
    </main>
  )
}
