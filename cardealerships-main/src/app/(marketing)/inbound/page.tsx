import { Hero } from "@/components/products/inbound/hero"
import { WhatItDoes } from "@/components/products/inbound/what-it-does"
import { Capabilities } from "@/components/products/inbound/capabilities"
import { Workflow } from "@/components/products/inbound/workflow"
import { Mockups } from "@/components/products/inbound/mockups"
import { Integrations } from "@/components/products/inbound/integrations"
import { CTA } from "@/components/products/inbound/cta"

export default function InboundPage() {
  return (
    <div className="bg-[#0a0a0a]">
      <Hero />
      <WhatItDoes />
      <Capabilities />
      <Workflow />
      <Mockups />
      <Integrations />
      <CTA />
    </div>
  )
}
