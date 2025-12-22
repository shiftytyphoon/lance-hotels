'use client'

import { Hero } from "@/components/industries/automotive/hero"
import { LogoBar } from "@/components/industries/automotive/logo-bar"
import { ValueProp } from "@/components/industries/automotive/value-prop"
import { InboundAutomation } from "@/components/industries/automotive/inbound-automation"
import { Testimonial } from "@/components/industries/automotive/testimonial"
import { Safeguards } from "@/components/industries/automotive/safeguards"
import { Inbox } from "@/components/industries/automotive/inbox"

export default function AutomotivePage() {
  return (
    <div className="bg-[#0a0a0a]">
      <Hero />
      <LogoBar />
      <ValueProp />
      <InboundAutomation />
      <Testimonial
        quote="We went from missing 40% of calls to capturing every single lead. It saves 43 hours of our advisors' time each month so we can focus on in-person customers and drive revenue."
        author="Michael Torres"
        role="General Manager, Bay City Ford"
        company="Bay City Ford"
      />
      <Safeguards />
      <Inbox />
      <Testimonial
        quote="Inbox gives my team a simple way to see who needs attention right now. AI handles the routine, and when a customer needs a human, we jump in instantly with the full context."
        author="Sarah Chen"
        role="Service Director, Premier Honda"
        company="Premier Honda"
      />
    </div>
  )
}
