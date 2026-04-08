import { Link, useParams } from 'react-router-dom'
import { getProfileBySlug } from '../lib/storage'
import { PortfolioRenderer } from './PortfolioRenderer'

export function PublicPortfolioPage() {
  const { slug = '' } = useParams()
  const profile = getProfileBySlug(slug)
  const url = `${window.location.origin}/p/${slug}`

  if (!profile) {
    return (
      <main className="missing">
        <h1>Portfolio not found</h1>
        <p>
          The slug <strong>/{slug}</strong> does not exist yet.
        </p>
        <div className="missing__actions">
          <Link to="/">See template gallery</Link>
          <Link to="/editor">Create this page in editor</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="public-page">
      <div className="public-page__actions">
        <Link to="/">Template Gallery</Link>
        <Link to={`/editor?slug=${profile.slug}`}>Edit this Portfolio</Link>
      </div>
      <PortfolioRenderer profile={profile} shareUrl={url} />
    </main>
  )
}
