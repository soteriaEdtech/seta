import { prisma } from "@/lib/prisma"
import type { AdmissionStatus, PaymentStatus } from "@/lib/config"

export interface Application {
  id: string
  reference: string
  full_name: string
  email: string
  phone: string
  location: string | null
  track: string
  experience_level: string | null
  background: string | null
  motivation: string | null
  portfolio_url: string | null
  referral_source: string | null
  amount: number
  payment_status: PaymentStatus
  payment_reference: string | null
  paid_at: string | null
  admission_status: AdmissionStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface NewApplication {
  reference: string
  full_name: string
  email: string
  phone: string
  location?: string
  track: string
  experience_level?: string
  background?: string
  motivation?: string
  portfolio_url?: string
  referral_source?: string
  amount: number
}

// Prisma returns DateTime columns as JS Date objects. The rest of the app treats
// these as ISO strings, so normalize the row into the Application shape here.
type Row = {
  id: string
  reference: string
  full_name: string
  email: string
  phone: string
  location: string | null
  track: string
  experience_level: string | null
  background: string | null
  motivation: string | null
  portfolio_url: string | null
  referral_source: string | null
  amount: number
  payment_status: string
  payment_reference: string | null
  paid_at: Date | null
  admission_status: string
  admin_notes: string | null
  created_at: Date
  updated_at: Date
}

function toApplication(row: Row): Application {
  return {
    ...row,
    payment_status: row.payment_status as PaymentStatus,
    admission_status: row.admission_status as AdmissionStatus,
    paid_at: row.paid_at ? row.paid_at.toISOString() : null,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

export async function createApplication(data: NewApplication): Promise<Application> {
  const row = await prisma.application.create({
    data: {
      reference: data.reference,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      location: data.location ?? null,
      track: data.track,
      experience_level: data.experience_level ?? null,
      background: data.background ?? null,
      motivation: data.motivation ?? null,
      portfolio_url: data.portfolio_url ?? null,
      referral_source: data.referral_source ?? null,
      amount: data.amount,
    },
  })
  return toApplication(row)
}

export async function getApplicationByReference(
  reference: string,
): Promise<Application | null> {
  const row = await prisma.application.findUnique({ where: { reference } })
  return row ? toApplication(row) : null
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const row = await prisma.application.findUnique({ where: { id } })
  return row ? toApplication(row) : null
}

export async function listApplications(): Promise<Application[]> {
  const rows = await prisma.application.findMany({
    orderBy: { created_at: "desc" },
  })
  return rows.map(toApplication)
}

export async function markPayment(
  reference: string,
  status: PaymentStatus,
  paymentReference: string | null,
): Promise<Application | null> {
  try {
    const row = await prisma.application.update({
      where: { reference },
      data: {
        payment_status: status,
        payment_reference: paymentReference,
        paid_at: status === "paid" ? new Date() : null,
      },
    })
    return toApplication(row)
  } catch {
    // Record not found (e.g. unknown reference) — mirror the previous null return.
    return null
  }
}

export async function updateAdmission(
  id: string,
  status: AdmissionStatus,
  notes?: string,
): Promise<Application | null> {
  try {
    const row = await prisma.application.update({
      where: { id },
      data: {
        admission_status: status,
        // Only overwrite notes when provided; otherwise keep the existing value.
        ...(notes != null ? { admin_notes: notes } : {}),
      },
    })
    return toApplication(row)
  } catch {
    return null
  }
}

export async function recordPayment(entry: {
  application_id: string | null
  reference: string
  amount: number
  status: string
  channel?: string | null
  paid_at?: string | null
  raw?: unknown
}): Promise<void> {
  await prisma.payment.create({
    data: {
      application_id: entry.application_id,
      reference: entry.reference,
      amount: entry.amount,
      status: entry.status,
      channel: entry.channel ?? null,
      paid_at: entry.paid_at ? new Date(entry.paid_at) : null,
      raw: (entry.raw ?? undefined) as never,
    },
  })
}

export interface ApplicationStats {
  total: number
  paid: number
  admitted: number
  pending_review: number
}

export async function getStats(): Promise<ApplicationStats> {
  const [total, paid, admitted, pending_review] = await prisma.$transaction([
    prisma.application.count(),
    prisma.application.count({ where: { payment_status: "paid" } }),
    prisma.application.count({ where: { admission_status: "admitted" } }),
    prisma.application.count({
      where: { payment_status: "paid", admission_status: "pending" },
    }),
  ])
  return { total, paid, admitted, pending_review }
}
