// Stateless admin session: a signed token derived from the admin password and a
// server secret. Single shared password — see CLAUDE.md for the upgrade path.
import crypto from "node:crypto"

export const ADMIN_COOKIE = "seta_admin"

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret"
}

/** The single valid session token value. Changing the password/secret invalidates sessions. */
export function expectedToken(): string {
  return crypto
    .createHmac("sha256", sessionSecret())
    .update("seta-admin-session-v1")
    .digest("hex")
}

/**
 * Hash a password for storage in the `admins` table.
 * Format: `scrypt$<saltHex>$<hashHex>` — self-describing, no external deps.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, 64)
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`
}

/** Verify a plaintext password against a stored `scrypt$salt$hash` value. */
export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split("$")
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, "hex")
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length)
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

export function isValidToken(token: string | undefined | null): boolean {
  if (!token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(expectedToken())
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
