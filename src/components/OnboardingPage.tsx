import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { submitOnboarding } from '../lib/backendApi'

const CATEGORIES = ['Singer', 'Actor', 'Public Figure', 'Company', 'Influencer', 'Startup', 'Agency']
const TIERS = ['Starter', 'Pro', 'Scale']

export function OnboardingPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Tell us about your brand to customize your Flowboard setup.')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    brandName: '',
    category: CATEGORIES[0],
    primaryGoal: 'Generate more qualified inbound leads from my portfolio page.',
    preferredTier: TIERS[1],
    notes: '',
  })

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('Submitting onboarding…')

    try {
      await submitOnboarding(form)
      window.localStorage.setItem(
        'flowboard-onboarding-v1',
        JSON.stringify({
          brandName: form.brandName,
          category: form.category,
          contactEmail: form.email,
        }),
      )
      setStatus('Onboarding saved. Redirecting to editor…')
      navigate('/editor?onboarding=success')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to submit onboarding.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page page--onboarding">
      <header className="page__header">
        <p className="page__eyebrow">Flowboard Onboarding</p>
        <h1>Client onboarding</h1>
        <p>Complete this once so Flowboard can tailor templates, AI tone, and publishing defaults.</p>
      </header>

      <section className="onboarding">
        <form className="onboarding__form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              required
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              placeholder="Jamie Tan"
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="jamie@brand.com"
            />
          </label>
          <label>
            Brand / Stage name
            <input
              required
              value={form.brandName}
              onChange={(event) => updateField('brandName', event.target.value)}
              placeholder="Jamie Noir"
            />
          </label>
          <label>
            Category
            <select value={form.category} onChange={(event) => updateField('category', event.target.value)}>
              {CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Primary goal
            <textarea
              rows={4}
              value={form.primaryGoal}
              onChange={(event) => updateField('primaryGoal', event.target.value)}
            />
          </label>
          <label>
            Preferred tier
            <select value={form.preferredTier} onChange={(event) => updateField('preferredTier', event.target.value)}>
              {TIERS.map((tier) => (
                <option key={tier}>{tier}</option>
              ))}
            </select>
          </label>
          <label>
            Additional notes
            <textarea rows={4} value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />
          </label>

          <div className="onboarding__actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Complete onboarding'}
            </button>
            <Link to="/pricing">Compare pricing tiers</Link>
            <Link to="/editor">Skip to editor</Link>
          </div>
          <p className="onboarding__status">{status}</p>
        </form>
      </section>
    </main>
  )
}
