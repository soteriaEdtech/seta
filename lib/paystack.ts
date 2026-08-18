// Paystack REST helpers. No SDK — Paystack's API is a thin HTTPS surface.
import crypto from "node:crypto"

const PAYSTACK_BASE = "https://api.paystack.co"

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set")
  return key
}

export interface InitializeParams {
  email: string
  amount: number // kobo
  reference: string
  callbackUrl: string
  metadata?: Record<string, unknown>
}

export interface InitializeResult {
  authorization_url: string
  access_code: string
  reference: string
}

export async function initializeTransaction(
  params: InitializeParams,
): Promise<InitializeResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      reference: params.reference,
      currency: "NGN",
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  })

  const json = await res.json()
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to initialize Paystack transaction")
  }
  return json.data as InitializeResult
}

export interface VerifyResult {
  status: string // 'success' | 'failed' | ...
  reference: string
  amount: number
  channel: string | null
  paid_at: string | null
  raw: unknown
}

export async function verifyTransaction(reference: string): Promise<VerifyResult> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` }, cache: "no-store" },
  )
  const json = await res.json()
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to verify Paystack transaction")
  }
  const d = json.data
  return {
    status: d.status,
    reference: d.reference,
    amount: d.amount,
    channel: d.channel ?? null,
    paid_at: d.paid_at ?? null,
    raw: d,
  }
}

/** Validate a Paystack webhook signature (HMAC-SHA512 of the raw body). */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false
  const hash = crypto
    .createHmac("sha512", secretKey())
    .update(rawBody)
    .digest("hex")
  // Constant-time compare.
  const a = Buffer.from(hash)
  const b = Buffer.from(signature)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
