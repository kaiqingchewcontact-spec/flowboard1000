import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { OAuthTokenSet, Provider, VaultRecord } from './types'

const DATA_DIR = path.resolve(process.cwd(), '.flowboard')
const VAULT_PATH = path.join(DATA_DIR, 'vault.json')

interface VaultFile {
  version: number
  sessions: Record<
    string,
    {
      iv: string
      tag: string
      payload: string
      updatedAt: string
    }
  >
}

const defaultVaultFile = (): VaultFile => ({ version: 1, sessions: {} })

const resolveSecret = () =>
  process.env.FLOWBOARD_VAULT_SECRET ||
  process.env.VAULT_SECRET ||
  'flowboard-local-dev-secret-change-me'

const keyFromSecret = (secret: string) => createHash('sha256').update(secret).digest()

const encryptRecord = (record: VaultRecord) => {
  const iv = randomBytes(12)
  const key = keyFromSecret(resolveSecret())
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const plaintext = Buffer.from(JSON.stringify(record), 'utf8')
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()])
  const tag = cipher.getAuthTag()

  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    payload: encrypted.toString('base64'),
  }
}

const decryptRecord = (sessionId: string, file: VaultFile): VaultRecord => {
  const encrypted = file.sessions[sessionId]
  if (!encrypted) return { providers: {} }

  const key = keyFromSecret(resolveSecret())
  const iv = Buffer.from(encrypted.iv, 'base64')
  const tag = Buffer.from(encrypted.tag, 'base64')
  const payload = Buffer.from(encrypted.payload, 'base64')
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(payload), decipher.final()]).toString('utf8')
  const parsed = JSON.parse(decrypted) as VaultRecord
  return {
    providers: parsed.providers ?? {},
  }
}

const loadVault = async (): Promise<VaultFile> => {
  try {
    const raw = await readFile(VAULT_PATH, 'utf8')
    const parsed = JSON.parse(raw) as VaultFile
    if (parsed.version !== 1 || typeof parsed.sessions !== 'object') return defaultVaultFile()
    return parsed
  } catch {
    return defaultVaultFile()
  }
}

const saveVault = async (vault: VaultFile) => {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(VAULT_PATH, JSON.stringify(vault, null, 2), 'utf8')
}

export const getSessionRecord = async (sessionId: string): Promise<VaultRecord> => {
  const vault = await loadVault()
  return decryptRecord(sessionId, vault)
}

export const getProviderToken = async (sessionId: string, provider: Provider): Promise<OAuthTokenSet | null> => {
  const record = await getSessionRecord(sessionId)
  return record.providers[provider] ?? null
}

export const setProviderToken = async (sessionId: string, provider: Provider, tokenSet: OAuthTokenSet) => {
  const vault = await loadVault()
  const record = decryptRecord(sessionId, vault)
  record.providers[provider] = tokenSet
  vault.sessions[sessionId] = {
    ...encryptRecord(record),
    updatedAt: new Date().toISOString(),
  }
  await saveVault(vault)
}

export const removeProviderToken = async (sessionId: string, provider: Provider) => {
  const vault = await loadVault()
  const record = decryptRecord(sessionId, vault)
  delete record.providers[provider]
  vault.sessions[sessionId] = {
    ...encryptRecord(record),
    updatedAt: new Date().toISOString(),
  }
  await saveVault(vault)
}

export const providerConnectionStatus = async (sessionId: string) => {
  const record = await getSessionRecord(sessionId)
  return {
    instagram: Boolean(record.providers.instagram?.accessToken),
    linkedin: Boolean(record.providers.linkedin?.accessToken),
    x: Boolean(record.providers.x?.accessToken),
  }
}

export const createSessionId = () => randomUUID()
