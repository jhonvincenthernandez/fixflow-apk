/**
 * ASSUMPTION: crypto.randomUUID exists. It is available in Android WebView 92+ and
 * every modern browser, but only in secure contexts. Capacitor serves the app from
 * https://localhost and `vite dev` runs on localhost, both of which are secure.
 *
 * Data Connect serializes PostgreSQL UUID columns as 32 hexadecimal characters
 * without hyphens. Client-generated identifiers use the same shape so a value
 * keeps one representation before and after a round trip.
 */
export function newId(): string {
  return crypto.randomUUID().replaceAll('-', '')
}

/** Human-friendly request reference such as FF-0042. */
export function formatRef(sequence: number): string {
  return `FF-${String(sequence).padStart(4, '0')}`
}
