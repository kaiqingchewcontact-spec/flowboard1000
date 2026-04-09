import { Navigate, Route, Routes } from 'react-router-dom'
import { EditorPage } from './components/EditorPage'
import { HomePage } from './components/HomePage'
import { OnboardingPage } from './components/OnboardingPage'
import { PricingPage } from './components/PricingPage'
import { PublicPortfolioPage } from './components/PublicPortfolioPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/p/:slug" element={<PublicPortfolioPage />} />
      <Route path="/:slug" element={<PublicPortfolioPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
