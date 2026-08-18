import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Prisma 7 uses a driver adapter for the connection. We point node-postgres at
// DATABASE_URL (Prisma Postgres in prod, or any Postgres locally). A single
// client is reused across hot reloads in dev to avoid exhausting connections.
function createClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL || process.env.POSTGRES_URL || ""
  if (!connectionString) {
    throw new Error("No DATABASE_URL set. Add it to .env / .env.local.")
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
