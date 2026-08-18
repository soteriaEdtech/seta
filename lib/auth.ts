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

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || ""
  if (!expected) return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function isValidToken(token: string | undefined | null): boolean {
  if (!token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(expectedToken())
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
