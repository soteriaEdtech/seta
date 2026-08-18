import { NextResponse } from "next/server"
import { z } from "zod"
import { randomUUID } from "node:crypto"
import { createApplication } from "@/lib/applications"
import { initializeTransaction } from "@/lib/paystack"
import { sendApplicationReceived, sendAdminNewApplication } from "@/lib/email"
import { COMMITMENT_FEE_KOBO, TRACKS, appUrl } from "@/lib/config"

const trackValues = TRACKS.map((t) => t.value) as [string, ...string[]]

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  track: z.enum(trackValues),
  experience_level: z.string().trim().max(40).optional().or(z.literal("")),
  background: z.string().trim().max(2000).optional().or(z.literal("")),
  motivation: z.string().trim().min(20, "Tell us a bit more (min 20 chars)").max(2000),
  portfolio_url: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  referral_source: z.string().trim().max(40).optional().or(z.literal("")),
})

export async function POST(req: Request) {
  let data: z.infer<typeof schema>
  try {
    data = schema.parse(await req.json())
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const reference = `seta-${Date.now()}-${randomUUID().slice(0, 8)}`

  try {
    const application = await createApplication({
      reference,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      location: data.location || undefined,
      track: data.track,
      experience_level: data.experience_level || undefined,
      background: data.background || undefined,
      motivation: data.motivation || undefined,
      portfolio_url: data.portfolio_url || undefined,
      referral_source: data.referral_source || undefined,
      amount: COMMITMENT_FEE_KOBO,
    })

    const init = await initializeTransaction({
      email: data.email,
      amount: COMMITMENT_FEE_KOBO,
      reference,
      callbackUrl: appUrl(`/api/paystack/callback`),
      metadata: {
        application_id: application.id,
        full_name: data.full_name,
        track: data.track,
      },
    })

    // Best-effort notifications — never block the payment redirect.
    void sendApplicationReceived(application)
    void sendAdminNewApplication(application)

    return NextResponse.json({
      reference,
      authorization_url: init.authorization_url,
    })
  } catch (err) {
    console.error("[api/applications] error:", err)
    return NextResponse.json(
      { error: "Could not start your application. Please try again." },
      { status: 500 },
    )
  }
}
