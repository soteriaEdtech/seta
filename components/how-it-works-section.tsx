"use client"

import { BookOpen, Target, Trophy } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function HowItWorksSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  const phases = [
    {
      icon: BookOpen,
      phase: "Phase 1",
      title: "The Foundation",
      weeks: "Weeks 1-2",
      description:
        "Master the core principles of Instructional Design (ID), Adult Learning Theory, and Needs Analysis. Everyone starts here.",
    },
    {
      icon: Target,
      phase: "Phase 2",
      title: "Specialization",
      weeks: "Weeks 3-10",
      description:
        "Select your dedicated career track and dive deep with expert mentors. Hands-on projects and real-world scenarios.",
    },
    {
      icon: Trophy,
      phase: "Phase 3",
      title: "Capstone & Showcase",
      weeks: "Weeks 11-12",
      description: "Build a real-world project. Present it at our 'Talent Draft Day' to sponsors and recruiters.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-card border-y border-border" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 animate-on-scroll ${isVisible ? "is-visible" : ""}`}>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">A Hybrid, Project-Based Bootcamp</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We don't just teach theory; we build careers. The program is delivered through a mix of live masterclasses,
            mentorship, and real-world capstone projects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {phases.map((phase, index) => (
            <div key={phase.title} className="relative">
              {index < phases.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-border -translate-x-1/2 z-0" />
              )}
              <div
                className={`relative z-10 bg-background p-8 rounded-lg border border-border h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 animate-on-scroll-scale ${isVisible ? "is-visible" : ""}`}
                style={{ transitionDelay: `${0.15 + index * 0.15}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 transition-all duration-300 group-hover:bg-primary/20">
                  <phase.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-primary font-medium mb-1">{phase.phase}</p>
                <h3 className="text-xl font-bold text-foreground mb-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{phase.weeks}</p>
                <p className="text-muted-foreground">{phase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
