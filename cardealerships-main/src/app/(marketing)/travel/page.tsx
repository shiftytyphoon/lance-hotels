'use client'

import { Hero } from "@/components/industries/travel/hero"
import { LogoBar } from "@/components/industries/travel/logo-bar"
import { ValueProp } from "@/components/industries/travel/value-prop"
import { BookingAutomation } from "@/components/industries/travel/booking-automation"
import { Concierge } from "@/components/industries/travel/concierge"
import { Loyalty } from "@/components/industries/travel/loyalty"
import { AICapabilities } from "@/components/industries/travel/ai-capabilities"
import { Stats } from "@/components/industries/travel/stats"
import { Testimonials } from "@/components/industries/travel/testimonials"
import { FAQ } from "@/components/industries/travel/faq"
import { CTA } from "@/components/industries/travel/cta"

export default function TravelPage() {
  return (
    <div className="bg-[#0a0a0a]">
      <Hero />
      <LogoBar />
      <ValueProp />
      <BookingAutomation />
      <Concierge />
      <Loyalty />
      <AICapabilities />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  )
}
