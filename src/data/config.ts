/**
 * Tunables for the data layer. Tests lower the iteration count so hashing stays fast.
 *
 * Accounts and requests live in PostgreSQL through Firebase Data Connect, so password
 * hashing protects the shared database rather than a single device.
 */
export const dataConfig = {
  passwordIterations: 210_000,
  maxImageBytes: 5 * 1024 * 1024,
}
