// Seed (or reset) an admin login. Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME
// from the environment and upserts a row in the `admins` table with a hashed
// password. Run with:  node --env-file=.env scripts/seed-admin.mjs
import crypto from "node:crypto"
import { PrismaClient } from "../lib/generated/prisma/client.ts"
import { PrismaPg } from "@prisma/adapter-pg"

function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, 64)
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`
}

const email = (process.env.ADMIN_EMAIL || "").toLowerCase()
const password = process.env.ADMIN_PASSWORD || ""
const name = process.env.ADMIN_NAME || null
const connectionString = process.env.DATABASE_URL || ""

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment first.")
  process.exit(1)
}
if (!connectionString) {
  console.error("No DATABASE_URL set.")
  process.exit(1)
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

const admin = await prisma.admin.upsert({
  where: { email },
  update: { password_hash: hashPassword(password), ...(name ? { name } : {}) },
  create: { email, password_hash: hashPassword(password), name },
})

console.log(`Admin seeded: ${admin.email} (id ${admin.id})`)
await prisma.$disconnect()
