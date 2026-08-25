// Data access for the `admins` table. Keep all admin queries here (mirrors the
// convention in lib/applications.ts). Passwords are stored hashed — see lib/auth.ts.
import { prisma } from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/auth"

export interface Admin {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

function toAdmin(row: {
  id: string
  email: string
  name: string | null
  created_at: Date
  updated_at: Date
}): Admin {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

/** Return true only when the email exists and the password matches its hash. */
export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } })
  if (!admin) return false
  return verifyPassword(password, admin.password_hash)
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const row = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } })
  return row ? toAdmin(row) : null
}

export async function countAdmins(): Promise<number> {
  return prisma.admin.count()
}

/** Create an admin, or reset the password/name of an existing one (by email). */
export async function upsertAdmin(
  email: string,
  password: string,
  name?: string,
): Promise<Admin> {
  const normalized = email.toLowerCase()
  const password_hash = hashPassword(password)
  const row = await prisma.admin.upsert({
    where: { email: normalized },
    update: { password_hash, ...(name != null ? { name } : {}) },
    create: { email: normalized, password_hash, name: name ?? null },
  })
  return toAdmin(row)
}
