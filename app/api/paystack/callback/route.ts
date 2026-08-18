import { NextResponse } from "next/server"
import { verifyTransaction } from "@/lib/paystack"
import {
  getApplicationByReference,
  markPayment,
  recordPayment,
} from "@/lib/applications"
import { sendPaymentConfirmation } from "@/lib/email"
import { appUrl } from "@/lib/config"

// Paystack redirects the user here after checkout with ?reference=...
// We verify server-side (never trust the client) and update the record.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const reference = searchParams.get("reference") || searchParams.get("trxref")

  if (!reference) {
    return NextResponse.redirect(appUrl("/apply/success?status=error"))
  }

  try {
    const verified = await verifyTransaction(reference)
    const app = await getApplicationByReference(reference)

    if (app) {
      const paid = verified.status === "success"
      await markPayment(reference, paid ? "paid" : "failed", verified.reference)
      await recordPayment({
        application_id: app.id,
        reference: verified.reference,
        amount: verified.amount,
        status: verified.status,
        channel: verified.channel,
        paid_at: verified.paid_at,
        raw: verified.raw,
      })
      if (paid && app.payment_status !== "paid") {
        void sendPaymentConfirmation({ ...app, payment_status: "paid" })
      }
    }

    const status = verified.status === "success" ? "success" : "failed"
    return NextResponse.redirect(appUrl(`/apply/success?status=${status}&ref=${reference}`))
  } catch (err) {
    console.error("[paystack/callback] error:", err)
    return NextResponse.redirect(appUrl(`/apply/success?status=error&ref=${reference}`))
  }
}
