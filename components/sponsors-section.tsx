"use client"

import { Button } from "@/components/ui/button"
import { Users, Wrench, Award, Heart, Download, Mail } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Link from "next/link"

export function SponsorsSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  const benefits = [
    {
      icon: Users,
      title: "First-Mover Advantage",
      description: "Get exclusive access to recruit the top 100 talents before they hit the open market",
    },
    {
      icon: Wrench,
      title: "Customized Training",
      description: "Have specific tech needs? We can integrate your tools into the curriculum",
    },
    {
      icon: Award,
      title: "Brand Visibility",
      description: "Position your organization as a leader in Learning & Development",
    },
    { icon: Heart, title: "CSR Impact", description: "Support upskilling and employability in the digital economy" },
  ]

  return (
    <section id="sponsors" className="py-20 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`animate-on-scroll-left ${isVisible ? "is-visible" : ""}`}>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground text-balance mb-6">
              Stop Searching. <span className="text-primary">Start Selecting.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Are you struggling to find "job-ready" L&D talent? Partner with us to fund the next generation of
              eLearning professionals. By the time they graduate, our participants have received 12 weeks of rigorous
              training, mentorship, and portfolio development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                <Link
                className="flex items-center gap-2"
                href="https://drive.google.com/file/d/1RQFeNPJcPzDgRI7ERneZf7AE37zPwXH8/view"
                >
                <Download className="h-4 w-4" />
                Download Sponsorship Deck
                </Link>
              </Button>
              <Link 
                href="mailto:seta@soterialearning.com" 
              >
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-primary/10"
              >
                <Mail className="h-4 w-4" />
                Contact Program Director
              </Button>
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-2 animate-on-scroll-scale ${isVisible ? "is-visible" : ""}`}
                style={{ transitionDelay: `${0.15 + index * 0.1}s` }}
              >
                <benefit.icon className="h-6 w-6 text-primary mb-3 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
