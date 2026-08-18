// Central program constants shared across the app.

export const PROGRAM_NAME = "SETA Program — Cohort 2"

// Money is stored and sent to Paystack in kobo (1 NGN = 100 kobo).
export const COMMITMENT_FEE_KOBO = 4_500_000 // ₦45,000
export const CURRENCY = "NGN"

export function formatNaira(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100)
}

export const TRACKS = [
  { value: "instructional-design", label: "Instructional Design (The Architect)" },
  { value: "elearning-development", label: "eLearning Development (The Builder)" },
  { value: "lms-admin", label: "LMS & Learning Tech Admin (The Engineer)" },
] as const

export type TrackValue = (typeof TRACKS)[number]["value"]

export const EXPERIENCE_LEVELS = [
  { value: "none", label: "No prior experience" },
  { value: "beginner", label: "Some exposure / self-taught" },
  { value: "intermediate", label: "1–3 years related experience" },
  { value: "advanced", label: "3+ years related experience" },
] as const

export const REFERRAL_SOURCES = [
  { value: "social-media", label: "Social media" },
  { value: "friend", label: "Friend or colleague" },
  { value: "search", label: "Search engine" },
  { value: "event", label: "Event / webinar" },
  { value: "employer", label: "Employer / school" },
  { value: "other", label: "Other" },
] as const

export const PAYMENT_STATUSES = ["pending", "paid", "failed"] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const ADMISSION_STATUSES = ["pending", "admitted", "waitlisted", "rejected"] as const
export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number]

export function appUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000"
  return `${base}${path}`
}
