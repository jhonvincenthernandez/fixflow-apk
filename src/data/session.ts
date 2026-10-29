import { logger } from '@/domain/logger'

const SESSION_KEY = 'fixflow.session'

/**
 * The session is only the signed-in user's id. Application data lives in PostgreSQL;
 * this device handle keeps the user signed in across app launches until they sign out.
 *
 * localStorage can throw (blocked storage, private mode), so every access is guarded
 * and a failure falls back to an in-memory handle for the current page.
 */
let memorySession: string | null = null

export function readStoredSession(): string | null {
  try {
    const value = localStorage.getItem(SESSION_KEY)
    if (value !== null && value.length > 0) return value
  } catch (error) {
    logger.warn('Could not read the stored session', { error: String(error) })
  }
  return memorySession
}

export function storeSession(userId: string): void {
  memorySession = userId
  try {
    localStorage.setItem(SESSION_KEY, userId)
  } catch (error) {
    logger.warn('Could not persist the session; you will need to sign in again next launch', { error: String(error) })
  }
}

export function clearSession(): void {
  memorySession = null
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch (error) {
    logger.warn('Could not clear the stored session', { error: String(error) })
  }
}
