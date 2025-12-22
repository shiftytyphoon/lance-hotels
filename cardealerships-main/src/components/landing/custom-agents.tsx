"use client"

import { motion } from "framer-motion"
import { Copy, Pen, Bot } from "lucide-react"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"

export function CustomAgents() {
  const features = [
    {
      icon: Copy,
      title: "Unified data layer",
      description: "Ingests signals from Zendesk, Intercom, Salesforce, HubSpot, and your product analytics",
    },
    {
      icon: Pen,
      title: "Intent detection",
      description: "Identifies buying signals, churn risk, and engagement drops in real-time",
    },
    {
      icon: Bot,
      title: "Execution at scale",
      description: "Sends follow-ups, triggers campaigns, and routes high-priority accounts to your team",
    },
  ]

  return (
    <section className="relative bg-[#0a0a0a] text-white py-32 lg:py-40 overflow-hidden">
      {/* Ambient glow effects - very subtle */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label with orange dot */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
                Execution Engine
              </span>
            </div>

            {/* Big serif headline with scroll animation */}
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-[-0.02em]">
              <TextGradientScroll
                text="Intelligence meets execution"
                type="word"
                textOpacity="medium"
                className="flex-wrap"
              />
            </h2>
          </motion.div>

          {/* Right - Features grid */}
          <div className="grid sm:grid-cols-3 gap-8 lg:gap-6 lg:pt-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-5 h-5 text-white/40 mb-4" strokeWidth={1.5} />
                <h3 className="font-sans text-base font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
