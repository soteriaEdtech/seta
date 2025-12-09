"use client"

import { CheckCircle2 } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function OpportunitySection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  const benefits = [
    { label: "Cost to You", value: "$0", description: "Fully funded by our Hiring Partners" },
    { label: "Your Commitment", value: "12 Weeks", description: "Grit, creativity, and intense learning" },
    { label: "The Outcome", value: "Portfolio + Jobs", description: "Priority access to recruitment interviews" },
  ]

  const checkItems = ["Industry-ready portfolio", "Expert mentorship", "Direct employer connections"]

  return (
    <section id="opportunity" className="py-20 lg:py-32 border-t border-border" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`animate-on-scroll-left ${isVisible ? "is-visible" : ""}`}>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground text-balance mb-6">
              The eLearning Industry is Booming. <span className="text-primary">Are You Ready?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              The corporate world is shifting. Companies are no longer just "training"—they are building digital
              learning ecosystems. They need more than just teachers; they need architects, developers, and analysts.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              We are bridging the gap between talent and opportunity. Supported by a committed Primary Sponsor and a
              coalition of industry partners, this initiative is designed to take you from "aspiring" to
              "industry-ready" in just 12 weeks.
            </p>
            <div className="flex flex-col gap-3">
              {checkItems.map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-3 animate-on-scroll ${isVisible ? "is-visible" : ""}`}
                  style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.label}
                className={`p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 animate-on-scroll-right ${isVisible ? "is-visible" : ""}`}
                style={{ transitionDelay: `${0.1 + index * 0.15}s` }}
              >
                <p className="text-sm text-muted-foreground mb-1">{benefit.label}</p>
                <p className="text-2xl font-bold text-foreground mb-1">{benefit.value}</p>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
