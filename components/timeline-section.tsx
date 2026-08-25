"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function TimelineSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  const events = [
    { date: "Now – Aug 27", title: "Recruitment & Screening", status: "upcoming" },
    { date: "Aug 21", title: "Final Cohort Announced (30 Elite Seats)", status: "upcoming" },
    { date: "Aug 31", title: "Program Kick-off", status: "upcoming" },
    { date: "September", title: "Specialized Training Tracks", status: "upcoming" },
    { date: "Mid October", title: "Capstone Project Submission", status: "upcoming" },
    { date: "Late October", title: "Talent Showcase & Hiring Draft", status: "upcoming" },
  ]

  return (
    <section className="py-20 lg:py-32 bg-card border-y border-border" ref={sectionRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 animate-on-scroll ${isVisible ? "is-visible" : ""}`}>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Program Timeline</h2>
          <p className="text-lg text-muted-foreground">Mark your calendar for these important dates</p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-8">
            {events.map((event, index) => (
              <div
                key={event.date}
                className={`relative flex items-center gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } animate-on-scroll ${isVisible ? "is-visible" : ""}`}
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                  <div
                    className={`inline-block p-4 rounded-lg bg-background border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-105 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <p className="text-sm text-primary font-medium mb-1">{event.date}</p>
                    <p className="font-medium text-foreground">{event.title}</p>
                  </div>
                </div>

                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1/2 ring-4 ring-background transition-all duration-300 hover:scale-150 hover:ring-primary/30" />

                <div className="flex-1 md:hidden pl-10">
                  <div className="p-4 rounded-lg bg-background border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                    <p className="text-sm text-primary font-medium mb-1">{event.date}</p>
                    <p className="font-medium text-foreground">{event.title}</p>
                  </div>
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
