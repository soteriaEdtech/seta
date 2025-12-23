"use client"

import Link from "next/link"
import { GraduationCap, Linkedin, Twitter, Instagram } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function Footer() {
  const { ref: footerRef, isVisible } = useScrollAnimation()

  return (
    <footer className="py-12 border-t border-border" ref={footerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-6 animate-on-scroll ${isVisible ? "is-visible" : ""}`}
        >
          <Link href="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">SETA Program </span>
          </Link>

          <p className="text-center text-muted-foreground text-balance max-w-md">
            Join the movement. Reshape the future of learning.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-lg hover:bg-secondary transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
          </div>
        </div>

        <div
          className={`mt-8 pt-8 border-t border-border text-center animate-on-scroll ${isVisible ? "is-visible" : ""}`}
          style={{ transitionDelay: "0.1s" }}
        >
          <p className="text-sm text-muted-foreground">© 2025/2026 SETA Program. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
