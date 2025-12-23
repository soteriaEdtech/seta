"use client"

import { Button } from "@/components/ui/button"
import { Laptop, Clock, Globe, Zap, FileText, Brain, Video, ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Link from 'next/link'

export function EligibilitySection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  const requirements = [
    { icon: Laptop, label: "Tech Ready", description: "Functioning laptop (Min i5/8GB RAM) and reliable internet" },
    { icon: Clock, label: "Time Commitment", description: "Available for 10-15 hours per week (Jan 19 – April)" },
    { icon: Globe, label: "Language", description: "Proficient in English (Written and Spoken)" },
    { icon: Zap, label: "Attitude", description: "A self-starter willing to collaborate and accept feedback" },
  ]

  const process = [
    { icon: FileText, step: "1", title: "Online Application", description: "Submit your details and motivation" },
    {
      icon: Brain,
      step: "2",
      title: "Aptitude Assessment",
      description: "A specialized test based on your chosen track",
    },
    {
      icon: Video,
      step: "3",
      title: "Video Interview",
      description: "Final screening to assess communication and drive",
    },
  ]

  return (
    <section id="eligibility" className="py-20 lg:py-32 bg-card border-y border-border" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 animate-on-scroll ${isVisible ? "is-visible" : ""}`}>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Who We Are Looking For</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We have only 100 sponsored seats. Selection is merit-based. We are not looking for experts; we are looking
            for potential.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div
            className={`animate-on-scroll-left ${isVisible ? "is-visible" : ""}`}
            style={{ transitionDelay: "0.1s" }}
          >
            <h3 className="text-xl font-bold text-foreground mb-6">The Essentials</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {requirements.map((req, index) => (
                <div
                  key={req.label}
                  className={`p-4 rounded-lg bg-background border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 animate-on-scroll ${isVisible ? "is-visible" : ""}`}
                  style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
                >
                  <req.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="font-medium text-foreground mb-1">{req.label}</p>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`animate-on-scroll-right ${isVisible ? "is-visible" : ""}`}
            style={{ transitionDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold text-foreground mb-6">The Selection Process</h3>
            <div className="space-y-4">
              {process.map((step, index) => (
                <div
                  key={step.step}
                  className={`flex gap-4 p-4 rounded-lg bg-background border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:translate-x-2 animate-on-scroll ${isVisible ? "is-visible" : ""}`}
                  style={{ transitionDelay: `${0.3 + index * 0.15}s` }}
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary/20">
                    <span className="text-primary font-bold">{step.step}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`text-center mt-12 animate-on-scroll ${isVisible ? "is-visible" : ""}`}
          style={{ transitionDelay: "0.5s" }}
        >
          <Button
            size="lg"
            className="gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <Link 
            className="flex items-center gap-2"
            href="https://luma.com/jbumncjn"
            target="_blank"
            >
            Start Your Application
            <ArrowRight className="h-4 w-4 transition-transform hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
