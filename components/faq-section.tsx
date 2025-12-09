"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function FAQSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  const faqs = [
    {
      question: "Is this program really free?",
      answer: "Yes. Thanks to our sponsors, tuition is 100% covered for the selected 100 participants.",
    },
    {
      question: "Can I work full-time while doing this?",
      answer:
        "Yes, but it will be demanding. The program requires 10-15 hours a week, including some live weekend sessions and evening assignments.",
    },
    {
      question: "Do I get a certificate?",
      answer:
        "Yes. Upon successful completion of the Capstone project, you will receive a Certificate of Completion and a digital badge validating your skills.",
    },
    {
      question: "Will I be guaranteed a job?",
      answer:
        "No program can guarantee a job. However, we guarantee access. Our sponsors have first priority to interview graduates, and we provide career coaching to help you land a role.",
    },
  ]

  return (
    <section id="faq" className="py-20 lg:py-32" ref={sectionRef}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 animate-on-scroll ${isVisible ? "is-visible" : ""}`}>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about the program</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`animate-on-scroll ${isVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors duration-300">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
