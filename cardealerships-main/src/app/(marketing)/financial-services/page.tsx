'use client'

import { Hero } from "@/components/industries/financial-services/hero"
import { LogoBar } from "@/components/industries/financial-services/logo-bar"
import { ValueProp } from "@/components/industries/financial-services/value-prop"
import { AccountSupport } from "@/components/industries/financial-services/account-support"
import { FraudPrevention } from "@/components/industries/financial-services/fraud-prevention"
import { WealthManagement } from "@/components/industries/financial-services/wealth-management"
import { AICapabilities } from "@/components/industries/financial-services/ai-capabilities"
import { Stats } from "@/components/industries/financial-services/stats"
import { Testimonials } from "@/components/industries/financial-services/testimonials"
import { FAQ } from "@/components/industries/financial-services/faq"
import { CTA } from "@/components/industries/financial-services/cta"

export default function FinancialServicesPage() {
  return (
    <div className="bg-[#0a0a0a]">
      <Hero />
      <LogoBar />
      <ValueProp />
      <AccountSupport />
      <FraudPrevention />
      <WealthManagement />
      <AICapabilities />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  )
}
