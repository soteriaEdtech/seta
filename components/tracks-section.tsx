"use client"

import { PenTool, Code, Film, Settings, BarChart3 } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function TracksSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  const tracks = [
    {
      icon: PenTool,
      title: "Instructional Design",
      role: "The Architect",
      bestFor: "Writers, teachers, and analytical thinkers",
      skills:
        "Structure complex information into engaging learning experiences, storyboard creation, and scriptwriting",
    },
    {
      icon: Code,
      title: "eLearning Development",
      role: "The Builder",
      bestFor: "Tech-savvy creatives and visual thinkers",
      skills:
        "Articulate Storyline 360, Rise, and Adobe Captivate. Turn storyboards into interactive functional courses",
    },
    {
      icon: Film,
      title: "Multimedia & Motion Design",
      role: "The Creator",
      bestFor: "Graphic designers, video editors, and artists",
      skills: "Vyond (Animation), After Effects, and VideoScribe. Creating high-impact educational video assets",
    },
    {
      icon: Settings,
      title: "LMS & Learning Tech Admin",
      role: "The Engineer",
      bestFor: "Systems thinkers, IT support backgrounds, and organized planners",
      skills: "Managing Learning Management Systems (LMS), user management, SCORM compliance, and tech infrastructure",
    },
    {
      icon: BarChart3,
      title: "Learning Analytics & Data",
      role: "The Strategist",
      bestFor: "Data enthusiasts and math/logic-oriented minds",
      skills: "Measure learning impact, xAPI basics, data visualization for L&D, and ROI calculation",
    },
  ]

  return (
    <section id="tracks" className="py-20 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 animate-on-scroll ${isVisible ? "is-visible" : ""}`}>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">The 5 Talent Tracks</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the path that fits your strengths. All participants complete the Foundation module before splitting
            into these specialized tracks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, index) => (
            <div
              key={track.title}
              className={`group p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-2 animate-on-scroll-scale ${isVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <track.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{track.title}</h3>
              <p className="text-sm text-primary font-medium mb-3">{track.role}</p>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="text-foreground font-medium">Best for:</span> {track.bestFor}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">You will learn:</span> {track.skills}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
