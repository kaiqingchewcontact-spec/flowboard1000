import type { AiSettings, SocialProfile } from './types'

interface AiGenerationInput {
  intent: 'social-pull' | 'auto-design'
  currentProfile: Record<string, unknown>
  socialProfiles: SocialProfile[]
  focusProvider?: SocialProfile['provider']
  aiSettings: AiSettings
}

const extractJsonObject = (raw: string): Record<string, unknown> => {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI response did not return a JSON object.')
  }
  const jsonSlice = raw.slice(start, end + 1)
  return JSON.parse(jsonSlice) as Record<string, unknown>
}

const buildPrompt = ({
  intent,
  currentProfile,
  socialProfiles,
  focusProvider,
}: Omit<AiGenerationInput, 'aiSettings'>) => {
  const intentNote =
    intent === 'social-pull'
      ? `Enhance this portfolio from one social source (${focusProvider ?? 'unknown'}).`
      : 'Create a compelling landing-page direction from all connected social sources.'

  return `
You are Flowboard AI, generating portfolio edits.
${intentNote}

Rules:
- Return only JSON.
- Keep edits concise and credible.
- Do not invent impossible claims.
- Preserve the user's category and overall voice.

Return object shape:
{
  "displayName": "string (optional)",
  "role": "string (optional)",
  "tagline": "string",
  "bio": "string",
  "highlights": ["string", "string"],
  "services": ["string", "string"],
  "avatarUrl": "string (optional)",
  "social": {
    "instagram": "string",
    "linkedin": "string",
    "x": "string",
    "youtube": "string",
    "tiktok": "string",
    "website": "string"
  }
}

Current profile:
${JSON.stringify(currentProfile, null, 2)}

Connected social data:
${JSON.stringify(socialProfiles, null, 2)}
`
}

const callOpenAI = async (model: string, prompt: string): Promise<Record<string, unknown>> => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured on the server.')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You generate concise, high-conversion portfolio landing page content as strict JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status}): ${text.slice(0, 280)}`)
  }

  const parsed = JSON.parse(text) as Record<string, unknown>
  const choices = (parsed.choices ?? []) as Array<Record<string, unknown>>
  const message = (choices[0]?.message ?? {}) as Record<string, unknown>
  const content = String(message.content ?? '{}')
  return extractJsonObject(content)
}

const callAnthropic = async (model: string, prompt: string): Promise<Record<string, unknown>> => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured on the server.')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: model || process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
      system: 'Return only a JSON object. No markdown.',
    }),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Anthropic request failed (${response.status}): ${text.slice(0, 280)}`)
  }

  const parsed = JSON.parse(text) as Record<string, unknown>
  const content = (parsed.content ?? []) as Array<Record<string, unknown>>
  const combinedText = content.map((part) => String(part.text ?? '')).join('\n')
  return extractJsonObject(combinedText)
}

const callCustom = async (endpoint: string, prompt: string): Promise<Record<string, unknown>> => {
  if (!endpoint) {
    throw new Error('Custom AI endpoint is missing.')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: process.env.CUSTOM_AI_API_KEY ? `Bearer ${process.env.CUSTOM_AI_API_KEY}` : '',
    },
    body: JSON.stringify({ prompt }),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Custom AI request failed (${response.status}): ${text.slice(0, 280)}`)
  }

  const parsed = JSON.parse(text) as Record<string, unknown>
  const updates = parsed.updates as Record<string, unknown> | undefined
  if (updates && typeof updates === 'object') return updates
  return parsed
}

export const generatePortfolioUpdates = async ({
  intent,
  currentProfile,
  socialProfiles,
  focusProvider,
  aiSettings,
}: AiGenerationInput): Promise<Record<string, unknown>> => {
  const prompt = buildPrompt({
    intent,
    currentProfile,
    socialProfiles,
    focusProvider,
  })

  if (aiSettings.aiProvider === 'OpenAI') {
    return callOpenAI(aiSettings.aiModel, prompt)
  }
  if (aiSettings.aiProvider === 'Anthropic') {
    return callAnthropic(aiSettings.aiModel, prompt)
  }
  return callCustom(aiSettings.customEndpoint ?? '', prompt)
}
