'use client'

import { Hero } from "@/components/industries/healthcare/hero"
import { LogoBar } from "@/components/industries/healthcare/logo-bar"
import { ValueProp } from "@/components/industries/healthcare/value-prop"
import { CallCenter } from "@/components/industries/healthcare/call-center"
import { VirtualAssistant } from "@/components/industries/healthcare/virtual-assistant"
import { Insights } from "@/components/industries/healthcare/insights"
import { AISkills } from "@/components/industries/healthcare/ai-skills"
import { Stats } from "@/components/industries/healthcare/stats"
import { Testimonials } from "@/components/industries/healthcare/testimonials"
import { FAQ } from "@/components/industries/healthcare/faq"
import { CTA } from "@/components/industries/healthcare/cta"

export default function HealthcarePage() {
  return (
    <div className="bg-[#0a0a0a]">
      <Hero />
      <LogoBar />
      <ValueProp />
      <CallCenter />
      <VirtualAssistant />
      <Insights />
      <AISkills />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  )
}
