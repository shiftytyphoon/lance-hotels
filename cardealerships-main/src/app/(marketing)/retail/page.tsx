'use client'

import { Hero } from "@/components/industries/retail/hero"
import { LogoBar } from "@/components/industries/retail/logo-bar"
import { ValueProp } from "@/components/industries/retail/value-prop"
import { Features } from "@/components/industries/retail/features"
import { Testimonial } from "@/components/industries/retail/testimonial"
import { Platform } from "@/components/industries/retail/platform"

export default function RetailPage() {
  return (
    <div className="bg-[#0a0a0a]">
      <Hero />
      <LogoBar />
      <ValueProp />
      <Features />
      <Testimonial
        quote="Lance transformed how we handle customer support. We went from overwhelmed during sales to actually enjoying the busy season. Our customers get instant help, and our team can focus on the conversations that matter most."
        author="Sarah Mitchell"
        role="VP of Customer Experience"
        company="Allbirds"
      />
      <Platform />
      <Testimonial
        quote="The AI handles 70% of our tickets automatically, and the handoffs to our team are seamless. Our CSAT scores have never been higher."
        author="James Chen"
        role="Head of Support"
        company="Warby Parker"
      />
    </div>
  )
}
