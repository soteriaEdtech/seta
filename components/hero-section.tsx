"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in-down">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Applications Open for January 2026</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground text-balance mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Launch a Future-Proof Career in <span className="text-primary">eLearning & Instructional Design</span>
          </h1>

          <p
            className="text-xl lg:text-2xl text-muted-foreground mb-4 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            12 Weeks. 5 Specialized Tracks. 100% Sponsored.
          </p>

          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Join the elite cohort of 100 professionals being trained by industry experts and connected directly to top
            employers.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              size="lg"
              className="text-base px-8 gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 animate-pulse-glow"
            >
               Sponsor SETA
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-primary/10"
            >
              Become a Hiring Partner
            </Button>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="text-sm text-muted-foreground">
              Applications Close: <span className="text-foreground font-medium">January 10, 2026</span>
            </span>
            <span className="text-border">|</span>
            <span className="text-sm text-muted-foreground">
              Program Starts: <span className="text-foreground font-medium">January 19, 2026</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
