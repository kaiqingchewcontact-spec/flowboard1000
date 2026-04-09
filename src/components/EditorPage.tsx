import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { DEFAULT_EDITOR_PROFILE } from '../data/seedPortfolios'
import { PORTFOLIO_TEMPLATES } from '../data/templates'
import {
  disconnectOAuthProvider,
  getOAuthConnections,
  startOAuthConnect,
  type OAuthProvider,
} from '../lib/backendApi'
import { autoDesignLandingPage, pullSocialDataWithAI } from '../lib/socialImport'
import {
  getProfileBySlug,
  normalizePortfolioSlug,
  saveProfile,
  slugExists,
} from '../lib/storage'
import type { EditorPanel, PortfolioData } from '../types'
import { PortfolioRenderer } from './PortfolioRenderer'

const PANELS: { id: EditorPanel; label: string }[] = [
  { id: 'basics', label: 'Basics' },
  { id: 'bio', label: 'Bio' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'api', label: 'API Connect' },
  { id: 'social', label: 'Social + AI' },
  { id: 'sharing', label: 'Slug + QR' },
]

const toMultiline = (items: string[]) => items.join('\n')
const fromMultiline = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const emptyPortfolioItem = {
  title: '',
  description: '',
  link: 'https://example.com',
  imageUrl: 'https://picsum.photos/seed/new-item/800/500',
}

const emptyTestimonial = {
  quote: '',
  name: '',
  role: '',
}

export function EditorPage() {
  const [searchParams] = useSearchParams()
  const selectedSlug = searchParams.get('slug')

  const [activePanel, setActivePanel] = useState<EditorPanel>('basics')
  const [profile, setProfile] = useState<PortfolioData>(DEFAULT_EDITOR_PROFILE)
  const [status, setStatus] = useState('Flowboard ready. Start shaping your portfolio board.')
  const [busyPlatform, setBusyPlatform] = useState<'instagram' | 'linkedin' | 'x' | ''>('')
  const [isAutoDesigning, setIsAutoDesigning] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [oauthConnections, setOauthConnections] = useState<Record<OAuthProvider, boolean>>({
    instagram: false,
    linkedin: false,
    x: false,
  })
  const [oauthConfigured, setOauthConfigured] = useState<Record<OAuthProvider, boolean>>({
    instagram: false,
    linkedin: false,
    x: false,
  })
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    if (!selectedSlug) return
    const existing = getProfileBySlug(selectedSlug)
    if (existing) {
      setProfile(existing)
      setStatus(`Loaded ${existing.displayName} into the editor.`)
    }
  }, [selectedSlug])

  const refreshOAuthStatus = async () => {
    setOauthLoading(true)
    try {
      const data = await getOAuthConnections()
      setOauthConnections(data.connections)
      setOauthConfigured(data.configured)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to load OAuth status.')
    } finally {
      setOauthLoading(false)
    }
  }

  useEffect(() => {
    void refreshOAuthStatus()
  }, [])

  useEffect(() => {
    const oauthResult = searchParams.get('oauth')
    const provider = searchParams.get('provider')
    const message = searchParams.get('message')
    const onboarding = searchParams.get('onboarding')

    if (onboarding === 'success') {
      setStatus('Onboarding completed. Continue connecting socials and generating your board.')
      setActivePanel('api')
    }

    if (!oauthResult || !provider) return

    if (oauthResult === 'success') {
      setStatus(`${provider === 'x' ? 'X' : provider} connected successfully.`)
      setActivePanel('api')
      void refreshOAuthStatus()
      return
    }

    const fallback = `${provider === 'x' ? 'X' : provider} connection failed.`
    setStatus(message || fallback)
    setActivePanel('api')
  }, [searchParams])

  const normalizedSlug = useMemo(() => normalizePortfolioSlug(profile.slug) || 'my-portfolio', [profile.slug])
  const publicUrl = useMemo(
    () => `${window.location.origin}/p/${normalizedSlug}`,
    [normalizedSlug],
  )
  const isSlugTaken = slugExists(normalizedSlug, profile.id)

  useEffect(() => {
    void QRCode.toDataURL(publicUrl, {
      width: 230,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [publicUrl])

  const updateProfile = (updates: Partial<PortfolioData>) =>
    setProfile((current) => ({ ...current, ...updates }))

  const publishProfile = () => {
    if (isSlugTaken) {
      setStatus('Slug already in use. Choose another slug before publishing.')
      setActivePanel('sharing')
      return
    }

    const saved = saveProfile({
      ...profile,
      slug: normalizedSlug,
      updatedAt: new Date().toISOString(),
    })
    setProfile(saved)
    setStatus(`Published on Flowboard! Portfolio available at ${window.location.origin}/p/${saved.slug}`)
  }

  const runSocialImport = async (platform: 'instagram' | 'linkedin' | 'x') => {
    if (!oauthConnections[platform]) {
      setStatus(`${platform === 'x' ? 'X' : platform} is not connected. Connect it in API Connect first.`)
      setActivePanel('api')
      return
    }

    const value = profile.social[platform]
    setBusyPlatform(platform)
    setStatus(`AI is importing from ${platform === 'x' ? 'X' : platform}...`)

    try {
      const updates = await pullSocialDataWithAI({
        platform,
        source: value,
        current: profile,
      })
      setProfile((current) => ({ ...current, ...updates }))
      setStatus(`Imported and populated fields from ${platform === 'x' ? 'X' : platform}.`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to import social profile.')
    } finally {
      setBusyPlatform('')
    }
  }

  const runAutoDesign = async () => {
    if (!oauthConnections.instagram && !oauthConnections.linkedin && !oauthConnections.x) {
      setStatus('Connect at least one social account in API Connect before running auto-design.')
      setActivePanel('api')
      return
    }

    setIsAutoDesigning(true)
    setStatus('Flowboard AI is building your landing page style from connected social data...')

    try {
      const updates = await autoDesignLandingPage({ current: profile })
      setProfile((current) => ({ ...current, ...updates }))
      setStatus('Flowboard AI generated a compelling layout direction. Review and publish when ready.')
      setActivePanel('sharing')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to run AI auto-design.')
    } finally {
      setIsAutoDesigning(false)
    }
  }

  const connectProvider = (provider: OAuthProvider) => {
    if (!oauthConfigured[provider]) {
      setStatus(
        `${provider === 'x' ? 'X' : provider} OAuth is not configured on the server yet. Set env vars first.`,
      )
      return
    }
    startOAuthConnect(provider)
  }

  const disconnectProvider = async (provider: OAuthProvider) => {
    setOauthLoading(true)
    try {
      const response = await disconnectOAuthProvider(provider)
      setOauthConnections(response.connections)
      setStatus(`${provider === 'x' ? 'X' : provider} disconnected.`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to disconnect provider.')
    } finally {
      setOauthLoading(false)
    }
  }

  return (
    <main className="studio">
      <section className="studio__editor">
        <header className="studio__header">
          <h1>Flowboard Editor</h1>
          <p>
            Build your portfolio board with editorial templates, connected APIs, and AI-assisted page automation.
          </p>
          <p className="studio__status">{status}</p>
        </header>

        <nav className="studio__nav">
          {PANELS.map((panel) => (
            <button
              key={panel.id}
              type="button"
              className={activePanel === panel.id ? 'is-active' : ''}
              onClick={() => setActivePanel(panel.id)}
            >
              {panel.label}
            </button>
          ))}
        </nav>

        {activePanel === 'basics' && (
          <section className="studio__panel">
            <h2>Profile Basics</h2>
            <label>
              Display Name
              <input
                value={profile.displayName}
                onChange={(event) => updateProfile({ displayName: event.target.value })}
              />
            </label>
            <label>
              Role
              <input value={profile.role} onChange={(event) => updateProfile({ role: event.target.value })} />
            </label>
            <label>
              Tagline
              <input value={profile.tagline} onChange={(event) => updateProfile({ tagline: event.target.value })} />
            </label>
            <label>
              Category
              <select
                value={profile.category}
                onChange={(event) => updateProfile({ category: event.target.value as PortfolioData['category'] })}
              >
                <option>Singer</option>
                <option>Actor</option>
                <option>Public Figure</option>
                <option>Company</option>
                <option>Influencer</option>
                <option>Consultant</option>
                <option>Startup</option>
                <option>Agency</option>
              </select>
            </label>
            <label>
              Avatar URL
              <input value={profile.avatarUrl} onChange={(event) => updateProfile({ avatarUrl: event.target.value })} />
            </label>
            <label>
              Hero Image URL
              <input
                value={profile.heroImageUrl}
                onChange={(event) => updateProfile({ heroImageUrl: event.target.value })}
              />
            </label>
          </section>
        )}

        {activePanel === 'bio' && (
          <section className="studio__panel">
            <h2>Bio & Highlights</h2>
            <label>
              Bio
              <textarea value={profile.bio} onChange={(event) => updateProfile({ bio: event.target.value })} rows={7} />
            </label>
            <label>
              Location
              <input value={profile.location} onChange={(event) => updateProfile({ location: event.target.value })} />
            </label>
            <label>
              Highlights (one per line)
              <textarea
                value={toMultiline(profile.highlights)}
                rows={6}
                onChange={(event) => updateProfile({ highlights: fromMultiline(event.target.value) })}
              />
            </label>
          </section>
        )}

        {activePanel === 'services' && (
          <section className="studio__panel">
            <h2>Services</h2>
            <label>
              Services (one per line)
              <textarea
                value={toMultiline(profile.services)}
                rows={7}
                onChange={(event) => updateProfile({ services: fromMultiline(event.target.value) })}
              />
            </label>
            <label>
              Contact Email
              <input
                value={profile.contactEmail}
                onChange={(event) => updateProfile({ contactEmail: event.target.value })}
              />
            </label>
            <label>
              Contact Phone
              <input
                value={profile.contactPhone}
                onChange={(event) => updateProfile({ contactPhone: event.target.value })}
              />
            </label>
          </section>
        )}

        {activePanel === 'portfolio' && (
          <section className="studio__panel">
            <h2>Portfolio Items</h2>
            {profile.portfolioItems.map((item, index) => (
              <div key={`${item.title}-${index}`} className="studio__group">
                <h3>Item {index + 1}</h3>
                <label>
                  Title
                  <input
                    value={item.title}
                    onChange={(event) =>
                      updateProfile({
                        portfolioItems: profile.portfolioItems.map((currentItem, itemIndex) =>
                          itemIndex === index ? { ...currentItem, title: event.target.value } : currentItem,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(event) =>
                      updateProfile({
                        portfolioItems: profile.portfolioItems.map((currentItem, itemIndex) =>
                          itemIndex === index ? { ...currentItem, description: event.target.value } : currentItem,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Link
                  <input
                    value={item.link}
                    onChange={(event) =>
                      updateProfile({
                        portfolioItems: profile.portfolioItems.map((currentItem, itemIndex) =>
                          itemIndex === index ? { ...currentItem, link: event.target.value } : currentItem,
                        ),
                      })
                    }
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updateProfile({
                  portfolioItems: [...profile.portfolioItems, { ...emptyPortfolioItem }],
                })
              }
            >
              + Add Portfolio Item
            </button>
          </section>
        )}

        {activePanel === 'testimonials' && (
          <section className="studio__panel">
            <h2>Testimonials</h2>
            {profile.testimonials.map((testimonial, index) => (
              <div key={`${testimonial.name}-${index}`} className="studio__group">
                <h3>Testimonial {index + 1}</h3>
                <label>
                  Quote
                  <textarea
                    rows={3}
                    value={testimonial.quote}
                    onChange={(event) =>
                      updateProfile({
                        testimonials: profile.testimonials.map((currentTestimonial, testimonialIndex) =>
                          testimonialIndex === index
                            ? { ...currentTestimonial, quote: event.target.value }
                            : currentTestimonial,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Name
                  <input
                    value={testimonial.name}
                    onChange={(event) =>
                      updateProfile({
                        testimonials: profile.testimonials.map((currentTestimonial, testimonialIndex) =>
                          testimonialIndex === index
                            ? { ...currentTestimonial, name: event.target.value }
                            : currentTestimonial,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Role
                  <input
                    value={testimonial.role}
                    onChange={(event) =>
                      updateProfile({
                        testimonials: profile.testimonials.map((currentTestimonial, testimonialIndex) =>
                          testimonialIndex === index
                            ? { ...currentTestimonial, role: event.target.value }
                            : currentTestimonial,
                        ),
                      })
                    }
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updateProfile({
                  testimonials: [...profile.testimonials, { ...emptyTestimonial }],
                })
              }
            >
              + Add Testimonial
            </button>
          </section>
        )}

        {activePanel === 'api' && (
          <section className="studio__panel">
            <h2>Flowboard API Connect</h2>
            <p>
              Connect your social accounts through OAuth so Flowboard can securely store tokens server-side and pull
              live profile signals.
            </p>
            <button type="button" disabled={oauthLoading} onClick={() => void refreshOAuthStatus()}>
              {oauthLoading ? 'Refreshing…' : 'Refresh connection status'}
            </button>
            <div className="studio__oauth-list">
              {(['instagram', 'linkedin', 'x'] as const).map((provider) => (
                <div key={provider} className="studio__oauth-item">
                  <div>
                    <p className="studio__oauth-title">{provider === 'x' ? 'X' : provider}</p>
                    <p className={`studio__oauth-badge ${oauthConnections[provider] ? 'is-connected' : 'is-disconnected'}`}>
                      {oauthConnections[provider] ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                  <div className="studio__oauth-actions">
                    <button
                      type="button"
                      disabled={oauthLoading || !oauthConfigured[provider]}
                      onClick={() => connectProvider(provider)}
                    >
                      {oauthConfigured[provider] ? 'Connect OAuth' : 'Not configured'}
                    </button>
                    <button
                      type="button"
                      disabled={oauthLoading || !oauthConnections[provider]}
                      onClick={() => {
                        void disconnectProvider(provider)
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <label>
              AI Provider
              <select
                value={profile.apiConnections.aiProvider}
                onChange={(event) =>
                  updateProfile({
                    apiConnections: {
                      ...profile.apiConnections,
                      aiProvider: event.target.value as PortfolioData['apiConnections']['aiProvider'],
                    },
                  })
                }
              >
                <option>OpenAI</option>
                <option>Anthropic</option>
                <option>Custom</option>
              </select>
            </label>
            <label>
              AI Model
              <input
                value={profile.apiConnections.aiModel}
                onChange={(event) =>
                  updateProfile({
                    apiConnections: {
                      ...profile.apiConnections,
                      aiModel: event.target.value,
                    },
                  })
                }
                placeholder="gpt-4.1-mini / claude-3.7-sonnet / custom"
              />
            </label>
            {profile.apiConnections.aiProvider === 'Custom' && (
              <label>
                Custom AI Endpoint
                <input
                  value={profile.apiConnections.customEndpoint}
                  onChange={(event) =>
                    updateProfile({
                      apiConnections: {
                        ...profile.apiConnections,
                        customEndpoint: event.target.value,
                      },
                    })
                  }
                  placeholder="https://your-ai-endpoint.example.com/generate"
                />
              </label>
            )}
            <p className="studio__hint">
              OAuth tokens are stored in the server-side encrypted vault. AI provider keys are read from server env
              variables.
            </p>
          </section>
        )}

        {activePanel === 'social' && (
          <section className="studio__panel">
            <h2>Social Connect + AI Populate</h2>
            <p>Paste profile URLs or usernames and run live social pull to auto-populate your portfolio fields.</p>
            {(['instagram', 'linkedin', 'x'] as const).map((platform) => (
              <div key={platform} className="studio__social-row">
                <label>
                  {platform === 'x' ? 'X' : platform}
                  <input
                    value={profile.social[platform]}
                    onChange={(event) =>
                      updateProfile({
                        social: { ...profile.social, [platform]: event.target.value },
                      })
                    }
                    placeholder={`Paste ${platform} profile URL or handle`}
                  />
                </label>
                <button
                  type="button"
                  disabled={busyPlatform.length > 0 || isAutoDesigning}
                  onClick={() => {
                    void runSocialImport(platform)
                  }}
                >
                  {busyPlatform === platform
                    ? 'Importing...'
                    : `Pull live data + AI from ${platform === 'x' ? 'X' : platform}`}
                </button>
              </div>
            ))}
            <label>
              YouTube
              <input
                value={profile.social.youtube}
                onChange={(event) =>
                  updateProfile({
                    social: { ...profile.social, youtube: event.target.value },
                  })
                }
              />
            </label>
            <label>
              TikTok
              <input
                value={profile.social.tiktok}
                onChange={(event) =>
                  updateProfile({
                    social: { ...profile.social, tiktok: event.target.value },
                  })
                }
              />
            </label>
            <label>
              Website
              <input
                value={profile.social.website}
                onChange={(event) =>
                  updateProfile({
                    social: { ...profile.social, website: event.target.value },
                  })
                }
              />
            </label>
            <button type="button" disabled={isAutoDesigning || busyPlatform.length > 0} onClick={() => void runAutoDesign()}>
              {isAutoDesigning ? 'Auto-designing...' : 'Auto-Design Landing Page with AI'}
            </button>
          </section>
        )}

        {activePanel === 'sharing' && (
          <section className="studio__panel">
            <h2>Template, Slug, and QR Name Card</h2>
            <div className="studio__templates">
              {PORTFOLIO_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={profile.templateId === template.id ? 'is-selected' : ''}
                  onClick={() => updateProfile({ templateId: template.id, category: template.category })}
                >
                  <strong>{template.name}</strong>
                  <span>{template.description}</span>
                  <span className="studio__template-meta">
                    {template.trendNote} · {template.motion} motion · {template.graphics} graphics
                  </span>
                </button>
              ))}
            </div>

            <label>
              Custom Slug
              <input
                value={profile.slug}
                onChange={(event) => updateProfile({ slug: normalizePortfolioSlug(event.target.value) })}
                placeholder="your-name"
              />
            </label>
            {isSlugTaken ? (
              <p className="studio__warning">This slug is already used by another portfolio. Pick a new one.</p>
            ) : (
              <p>Your page URL: {publicUrl}</p>
            )}

            {qrDataUrl && (
              <div className="studio__qr">
                <img src={qrDataUrl} alt="QR code for portfolio page" />
                <a download={`${normalizedSlug}-qr.png`} href={qrDataUrl}>
                  Download QR (name card ready)
                </a>
              </div>
            )}
          </section>
        )}

        <footer className="studio__footer">
          <button type="button" onClick={publishProfile}>
            Publish to /p/{normalizedSlug}
          </button>
          <Link to={`/p/${normalizedSlug}`} target="_blank">
            Open Public Page
          </Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/onboarding">Onboarding</Link>
        </footer>
      </section>

      <section className="studio__preview">
        <PortfolioRenderer profile={{ ...profile, slug: normalizedSlug }} shareUrl={publicUrl} mode="preview" />
      </section>
    </main>
  )
}
