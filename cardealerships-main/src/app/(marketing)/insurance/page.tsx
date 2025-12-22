'use client'

import { Hero } from "@/components/industries/insurance/hero"
import { LogoBar } from "@/components/industries/insurance/logo-bar"
import { ValueProp } from "@/components/industries/insurance/value-prop"
import { Features } from "@/components/industries/insurance/features"
import { Testimonial } from "@/components/industries/insurance/testimonial"
import { Platform } from "@/components/industries/insurance/platform"

export default function InsurancePage() {
  return (
    <div className="bg-[#0a0a0a]">
      <Hero />
      <LogoBar />
      <ValueProp />
      <Features />
      <Testimonial
        quote="Lance cut our average claims processing time by 60%. Policyholders get instant updates, and our adjusters can focus on complex cases that really need their expertise."
        author="Rebecca Martinez"
        role="VP of Claims Operations"
        company="SafeGuard Insurance"
      />
      <Platform />
      <Testimonial
        quote="We handle 3x the volume with the same team size. The AI handles routine inquiries flawlessly, and when it escalates to a human, the context is always there."
        author="David Park"
        role="Chief Customer Officer"
        company="Pinnacle Insurance Group"
      />
    </div>
  )
}
