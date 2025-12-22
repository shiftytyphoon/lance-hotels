'use client'

import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { CustomAgents } from "@/components/landing/custom-agents"
import { AgentCanvas } from "@/components/landing/agent-canvas"
import { SmartInsights } from "@/components/landing/smart-insights"
import { VoiceExperience } from "@/components/landing/voice-experience"
import { CustomerSpotlight } from "@/components/landing/customer-spotlight"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { AmbientBackground } from "@/components/landing/ambient-background"

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a]">
      {/* Ambient floating orbs that persist throughout the page */}
      <AmbientBackground />

      {/* Hero with mountain background */}
      <Hero />

      {/* Content that flows seamlessly from the hero */}
      <div className="relative z-10">
        <Stats />
        <CustomAgents />
        <AgentCanvas />
        <SmartInsights />
        <VoiceExperience />
        <CustomerSpotlight />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
