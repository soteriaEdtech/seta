import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { OpportunitySection } from "@/components/opportunity-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TracksSection } from "@/components/tracks-section"
import { EligibilitySection } from "@/components/eligibility-section"
import { SponsorsSection } from "@/components/sponsors-section"
import { TimelineSection } from "@/components/timeline-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <OpportunitySection />
        <HowItWorksSection />
        <TracksSection />
        <EligibilitySection />
        <SponsorsSection />
        <TimelineSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
