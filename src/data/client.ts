import type { ExecuteQueryOptions } from 'firebase/data-connect'
import type { z } from 'zod'
import { AppError, StorageError } from '@/domain/errors'
import { dataConnect } from '@/firebase'

export { dataConnect }

/**
 * The SDK keeps query results in an in-memory cache and does not refresh list
 * queries after a mutation. Every read therefore goes to PostgreSQL so two
 * signed-in devices always see the same rows.
 */
export const freshRead: ExecuteQueryOptions = { fetchPolicy: 'SERVER_ONLY' }

/** PostgreSQL timestamps travel as RFC 3339 strings through Data Connect. */
export function toTimestamp(millis: number): string {
  return new Date(millis).toISOString()
}

export function fromTimestamp(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const millis = Date.parse(value)
  if (Number.isNaN(millis)) throw new StorageError('A stored timestamp is not in the expected format')
  return millis
}

export function requireTimestamp(value: string | null | undefined): number {
  const millis = fromTimestamp(value)
  if (millis === null) throw new StorageError('A required timestamp is missing from the database')
  return millis
}

/** Nested workflow data is stored as validated JSON text in PostgreSQL. */
export function encodeJson(value: unknown): string | null {
  if (value === null || value === undefined) return null
  return JSON.stringify(value)
}

export function decodeJson<T>(schema: z.ZodType<T>, value: string | null | undefined, fallback: T): T {
  if (value === null || value === undefined || value === '') return fallback
  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch (error) {
    throw new StorageError('Stored data is not valid JSON', { cause: error })
  }
  const result = schema.safeParse(parsed)
  if (!result.success) {
    throw new StorageError('Stored data is not in the expected format', { cause: result.error })
  }
  return result.data
}

export function decodeNullableJson<T>(schema: z.ZodType<T>, value: string | null | undefined): T | null {
  if (value === null || value === undefined || value === '') return null
  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch (error) {
    throw new StorageError('Stored data is not valid JSON', { cause: error })
  }
  const result = schema.safeParse(parsed)
  if (!result.success) {
    throw new StorageError('Stored data is not in the expected format', { cause: result.error })
  }
  return result.data
}

/** PostgreSQL reports a violated unique index with this wording. */
export function isUniqueViolation(error: unknown): boolean {
  const text = error instanceof Error ? `${error.name} ${error.message}`.toLowerCase() : String(error).toLowerCase()
  return text.includes('duplicate') || text.includes('unique') || text.includes('already exists')
}

/** Keeps domain errors intact and wraps transport or database failures. */
export function toStorageError(error: unknown, action: string): AppError {
  if (error instanceof AppError) return error
  return new StorageError(`Could not ${action}.`, { cause: error })
}

/** Validates a row read from PostgreSQL before it reaches the UI. */
export function parseStored<S extends z.ZodType>(schema: S, value: unknown, label: string): z.output<S> {
  const result = schema.safeParse(value)
  if (!result.success) {
    throw new StorageError(`Stored ${label} data is not in the expected format`, { cause: result.error })
  }
  return result.data
}
