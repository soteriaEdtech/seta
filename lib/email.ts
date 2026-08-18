// Transactional email via nodemailer (SMTP). All senders are best-effort:
// callers should not let a mail failure break the application/payment flow.
import nodemailer from "nodemailer"
import { formatNaira, PROGRAM_NAME } from "@/lib/config"
import type { Application } from "@/lib/applications"

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST
  if (!host) {
    console.warn("[email] SMTP_HOST not set — skipping email send.")
    return null
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // true for 465
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    })
  }
  return transporter
}

const FROM = () => process.env.MAIL_FROM || "SETA Program <no-reply@soterialearning.com>"

async function send(to: string, subject: string, html: string): Promise<void> {
  const t = getTransporter()
  if (!t) return
  try {
    await t.sendMail({ from: FROM(), to, subject, html })
  } catch (err) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, err)
  }
}

function layout(title: string, body: string): string {
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">
    <div style="padding:24px 0;border-bottom:2px solid #6d28d9">
      <h1 style="font-size:18px;margin:0;color:#6d28d9">${PROGRAM_NAME}</h1>
    </div>
    <div style="padding:24px 0;line-height:1.6">
      <h2 style="font-size:20px;margin:0 0 12px">${title}</h2>
      ${body}
    </div>
    <div style="padding:16px 0;border-top:1px solid #eee;font-size:12px;color:#777">
      SETA Program · Soteria Learning · Please do not reply to this automated message.
    </div>
  </div>`
}

export async function sendApplicationReceived(app: Application): Promise<void> {
  const html = layout(
    `Thanks for applying, ${app.full_name.split(" ")[0]}!`,
    `<p>We've received your application to the <strong>${PROGRAM_NAME}</strong>.</p>
     <p>Your application reference is <strong>${app.reference}</strong>.</p>
     <p>To secure your spot, please complete your commitment fee of
        <strong>${formatNaira(app.amount)}</strong>. If you were redirected away from
        the payment page, you can restart from our website.</p>
     <p>Once payment is confirmed, our team will review your application and get back to
        you with an admission decision.</p>`,
  )
  await send(app.email, "We received your SETA application", html)
}

export async function sendPaymentConfirmation(app: Application): Promise<void> {
  const html = layout(
    "Payment confirmed ✅",
    `<p>Hi ${app.full_name.split(" ")[0]},</p>
     <p>We've confirmed your commitment fee of <strong>${formatNaira(app.amount)}</strong>
        (ref: ${app.payment_reference || app.reference}).</p>
     <p>Your application is now complete and in the review queue. We'll email you once an
        admission decision has been made. Good luck!</p>`,
  )
  await send(app.email, "Your SETA commitment fee is confirmed", html)
}

export async function sendAdmissionDecision(app: Application): Promise<void> {
  let title = "Application update"
  let message = ""
  switch (app.admission_status) {
    case "admitted":
      title = "🎉 You're in — welcome to SETA!"
      message = `<p>Congratulations ${app.full_name.split(" ")[0]}! You've been
        <strong>admitted</strong> into the ${PROGRAM_NAME}. Our team will follow up shortly
        with onboarding details and your cohort schedule.</p>`
      break
    case "waitlisted":
      title = "You're on the SETA waitlist"
      message = `<p>Hi ${app.full_name.split(" ")[0]}, thank you for applying. You've been
        placed on our <strong>waitlist</strong>. We'll reach out immediately if a seat opens
        up.</p>`
      break
    case "rejected":
      title = "Your SETA application"
      message = `<p>Hi ${app.full_name.split(" ")[0]}, thank you for your interest in SETA.
        After careful review we're unable to offer you a seat in this cohort. We encourage
        you to apply again for future cohorts.</p>`
      break
    default:
      return
  }
  await send(app.email, title, layout(title, message))
}

export async function sendAdminNewApplication(app: Application): Promise<void> {
  const admin = process.env.ADMIN_EMAIL
  if (!admin) return
  const html = layout(
    "New application received",
    `<p><strong>${app.full_name}</strong> (${app.email}) applied for
        <strong>${app.track}</strong>.</p>
     <p>Reference: ${app.reference}<br/>Phone: ${app.phone}<br/>
        Payment status: ${app.payment_status}</p>
     <p>Review it in the admin dashboard.</p>`,
  )
  await send(admin, `New SETA application — ${app.full_name}`, html)
}
