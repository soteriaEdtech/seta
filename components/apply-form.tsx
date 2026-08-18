"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"
import {
  TRACKS,
  EXPERIENCE_LEVELS,
  REFERRAL_SOURCES,
  COMMITMENT_FEE_KOBO,
  formatNaira,
} from "@/lib/config"

type Errors = Record<string, string[] | undefined>

export function ApplyForm() {
  const [submitting, setSubmitting] = useState(false)
  const [track, setTrack] = useState("")
  const [experience, setExperience] = useState("")
  const [referral, setReferral] = useState("")
  const [errors, setErrors] = useState<Errors>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    const form = e.currentTarget
    const fd = new FormData(form)

    const payload = {
      full_name: String(fd.get("full_name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      location: String(fd.get("location") || ""),
      track,
      experience_level: experience,
      background: String(fd.get("background") || ""),
      motivation: String(fd.get("motivation") || ""),
      portfolio_url: String(fd.get("portfolio_url") || ""),
      referral_source: referral,
    }

    if (!track) {
      setErrors({ track: ["Please choose a track"] })
      toast.error("Please choose a track")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.issues) setErrors(data.issues)
        toast.error(data.error || "Please fix the highlighted fields")
        setSubmitting(false)
        return
      }

      toast.success("Redirecting you to secure payment…")
      window.location.href = data.authorization_url
    } catch {
      toast.error("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  const err = (field: string) =>
    errors[field]?.[0] ? (
      <p className="text-sm text-destructive mt-1">{errors[field]![0]}</p>
    ) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full_name">Full name *</Label>
          <Input id="full_name" name="full_name" required placeholder="Ada Obi" className="mt-1.5" />
          {err("full_name")}
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="you@email.com" className="mt-1.5" />
          {err("email")}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone (WhatsApp) *</Label>
          <Input id="phone" name="phone" required placeholder="+234 800 000 0000" className="mt-1.5" />
          {err("phone")}
        </div>
        <div>
          <Label htmlFor="location">Location (city, country)</Label>
          <Input id="location" name="location" placeholder="Lagos, Nigeria" className="mt-1.5" />
          {err("location")}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="track">Preferred track *</Label>
          <Select value={track} onValueChange={setTrack}>
            <SelectTrigger id="track" className="mt-1.5">
              <SelectValue placeholder="Choose a track" />
            </SelectTrigger>
            <SelectContent>
              {TRACKS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {err("track")}
        </div>
        <div>
          <Label htmlFor="experience_level">Experience level</Label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger id="experience_level" className="mt-1.5">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  {x.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="background">Your background</Label>
        <Textarea
          id="background"
          name="background"
          rows={3}
          placeholder="Briefly describe your current role, studies, or experience."
          className="mt-1.5"
        />
        {err("background")}
      </div>

      <div>
        <Label htmlFor="motivation">Why do you want to join SETA? *</Label>
        <Textarea
          id="motivation"
          name="motivation"
          rows={4}
          required
          placeholder="Tell us what draws you to instructional design / eLearning and what you hope to achieve."
          className="mt-1.5"
        />
        {err("motivation")}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="portfolio_url">Portfolio / LinkedIn (optional)</Label>
          <Input id="portfolio_url" name="portfolio_url" placeholder="https://…" className="mt-1.5" />
          {err("portfolio_url")}
        </div>
        <div>
          <Label htmlFor="referral_source">How did you hear about us?</Label>
          <Select value={referral} onValueChange={setReferral}>
            <SelectTrigger id="referral_source" className="mt-1.5">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {REFERRAL_SOURCES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg bg-secondary border border-border p-4 text-sm text-muted-foreground">
        A refundable commitment fee of{" "}
        <span className="font-semibold text-foreground">{formatNaira(COMMITMENT_FEE_KOBO)}</span>{" "}
        secures your seat. After submitting, you'll be taken to Paystack to complete payment.
        Your application enters review only after payment is confirmed.
      </div>

      <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </>
        ) : (
          <>
            Submit &amp; Pay {formatNaira(COMMITMENT_FEE_KOBO)}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}
