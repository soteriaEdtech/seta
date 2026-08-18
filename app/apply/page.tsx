import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ApplyForm } from "@/components/apply-form"
import { Toaster } from "@/components/ui/sonner"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Apply — SETA Program Cohort 2",
  description: "Apply for the SETA Program Cohort 2. 8 weeks, 3 tracks, 30 seats.",
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-4">
              <span className="text-xs text-muted-foreground">SETA Cohort 2 · Applications Open</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Apply to the SETA Program
            </h1>
            <p className="text-muted-foreground">
              Complete the form below and secure your seat with the commitment fee. Fields
              marked * are required.
            </p>
          </div>

          <div className="rounded-xl bg-card border border-border p-6 lg:p-8">
            <ApplyForm />
          </div>
        </div>
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  )
}
