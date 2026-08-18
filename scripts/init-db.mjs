// Idempotent schema migration. Run with: npm run db:init
// Loads DATABASE_URL from .env.local (or the environment).
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { neon } from "@neondatabase/serverless"

// Minimal .env.local loader (no dependency on dotenv).
try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8")
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
    }
  }
} catch {
  // no .env.local — rely on process env (e.g. CI / vercel)
}

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED

if (!connectionString) {
  console.error("✗ DATABASE_URL is not set. Provision Neon first (vercel env pull).")
  process.exit(1)
}

// Use the Neon HTTP driver for Neon hosts; fall back to node-postgres (`pg`)
// for a plain/local Postgres so `npm run db:init` works in local dev too.
const isNeon = /neon\.(tech|build)|\.neon\.|neondatabase/.test(connectionString)

let sql
let closePool = async () => {}
if (isNeon) {
  sql = neon(connectionString)
} else {
  const require = createRequire(import.meta.url)
  const pg = require("pg")
  const pool = new pg.Pool({
    connectionString,
    ssl: /sslmode=require|sslmode=verify/.test(connectionString)
      ? { rejectUnauthorized: false }
      : false,
  })
  closePool = () => pool.end()
  sql = async (strings, ...values) => {
    let text = ""
    strings.forEach((chunk, i) => {
      text += chunk
      if (i < values.length) text += "$" + (i + 1)
    })
    const res = await pool.query(text, values)
    return res.rows
  }
}

async function main() {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`

  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference        TEXT UNIQUE NOT NULL,
      full_name        TEXT NOT NULL,
      email            TEXT NOT NULL,
      phone            TEXT NOT NULL,
      location         TEXT,
      track            TEXT NOT NULL,
      experience_level TEXT,
      background       TEXT,
      motivation       TEXT,
      portfolio_url    TEXT,
      referral_source  TEXT,
      amount           INTEGER NOT NULL,
      payment_status   TEXT NOT NULL DEFAULT 'pending',
      payment_reference TEXT,
      paid_at          TIMESTAMPTZ,
      admission_status TEXT NOT NULL DEFAULT 'pending',
      admin_notes      TEXT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  await sql`CREATE INDEX IF NOT EXISTS applications_email_idx ON applications (email)`
  await sql`CREATE INDEX IF NOT EXISTS applications_created_idx ON applications (created_at DESC)`

  await sql`
    CREATE TABLE IF NOT EXISTS payments (
      id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id UUID REFERENCES applications (id) ON DELETE CASCADE,
      reference      TEXT NOT NULL,
      amount         INTEGER NOT NULL,
      status         TEXT NOT NULL,
      channel        TEXT,
      paid_at        TIMESTAMPTZ,
      raw            JSONB,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS payments_reference_idx ON payments (reference)`

  console.log("✓ Database schema is up to date.")
}

main()
  .then(closePool)
  .catch(async (err) => {
    console.error("✗ Migration failed:", err)
    await closePool()
    process.exit(1)
  })
