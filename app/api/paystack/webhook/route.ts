import { NextResponse } from "next/server"
import { verifyWebhookSignature } from "@/lib/paystack"
import {
  getApplicationByReference,
  markPayment,
  recordPayment,
} from "@/lib/applications"
import { sendPaymentConfirmation } from "@/lib/email"

// Paystack webhook — the authoritative source of payment truth. Configure this URL
// (<app>/api/paystack/webhook) in your Paystack dashboard.
export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-paystack-signature")

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    if (event?.event === "charge.success") {
      const d = event.data
      const reference = d.reference
      const app = await getApplicationByReference(reference)
      if (app) {
        await markPayment(reference, "paid", reference)
        await recordPayment({
          application_id: app.id,
          reference,
          amount: d.amount,
          status: "success",
          channel: d.channel ?? null,
          paid_at: d.paid_at ?? null,
          raw: d,
        })
        if (app.payment_status !== "paid") {
          void sendPaymentConfirmation({ ...app, payment_status: "paid" })
        }
      }
    }
  } catch (err) {
    console.error("[paystack/webhook] error:", err)
    // Return 200 so Paystack doesn't retry indefinitely on our internal errors,
    // but log for investigation.
  }

  return NextResponse.json({ received: true })
}
