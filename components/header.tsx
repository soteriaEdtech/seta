"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from '@/public/logo.svg'
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#opportunity", label: "The Opportunity" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#tracks", label: "Tracks" },
    { href: "#eligibility", label: "Eligibility" },
    { href: "#sponsors", label: "Partners" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            {/* <GraduationCap className="h-8 w-8 text-primary" /> */}
            <Image src={logo} alt="SETA Program Logo" width={32} height={32} />
            <span className="text-xl font-bold text-foreground">
              SETA Program
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="transition-all duration-300 hover:bg-primary/10"
            >
              <Link href="mailto:seta@soterialearning.com">
                Partner With Us
              </Link>
            </Button>

            <Button
              size="sm"
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              <Link href="https://luma.com/jbumncjn">Apply Now</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 transition-transform duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-4 py-4 border-t border-border">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-300"
              >
                <Link
                  className="flex items-center gap-2"
                  target="_blank"
                  href="https://drive.google.com/file/d/1RQFeNPJcPzDgRI7ERneZf7AE37zPwXH8/view"
                >
                  Partner With Us
                </Link>
              </Button>
              <Button size="sm" className="transition-all duration-300">
                <Link target="_blank" href="https://luma.com/jbumncjn">
                  Apply Now
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
