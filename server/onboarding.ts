import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DATA_DIR = path.resolve(process.cwd(), '.flowboard')
const ONBOARDING_PATH = path.join(DATA_DIR, 'onboarding.json')

export interface OnboardingSubmission {
  sessionId: string
  fullName: string
  email: string
  brandName: string
  category: string
  primaryGoal: string
  preferredTier: string
  notes: string
  createdAt: string
}

export const saveOnboardingSubmission = async (submission: OnboardingSubmission) => {
  await mkdir(DATA_DIR, { recursive: true })

  let existing: OnboardingSubmission[] = []
  try {
    const raw = await readFile(ONBOARDING_PATH, 'utf8')
    const parsed = JSON.parse(raw) as OnboardingSubmission[]
    existing = Array.isArray(parsed) ? parsed : []
  } catch {
    existing = []
  }

  existing.unshift(submission)
  await writeFile(ONBOARDING_PATH, JSON.stringify(existing, null, 2), 'utf8')
}
