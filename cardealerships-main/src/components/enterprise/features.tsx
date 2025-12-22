"use client"

import { motion } from "framer-motion"
import { Layers, Zap, Shield, Sparkles } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "Extremely customizable",
      description: "Fine-tune every nuance to match your brand voice and business logic.",
    },
    {
      icon: Zap,
      title: "Auto policy writing",
      description: "Get started with just a transcript. Our AI learns your processes automatically.",
    },
    {
      icon: Layers,
      title: "Built-in Copilot",
      description: "AI helps you build your ideal support agent with real-time suggestions.",
    },
    {
      icon: Shield,
      title: "Enterprise security",
      description: "SOC 2 Type II certified. Your data never leaves your control.",
    },
  ]

  return (
    <section className="py-32 px-6 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left side - heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-mono text-xs text-foreground/50 uppercase tracking-widest">Custom Agents</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient leading-tight">
              Built to handle
              <br />
              <span className="text-foreground/40">complexity</span>
            </h2>
          </motion.div>

          {/* Right side - features grid */}
          <div className="grid sm:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-6 h-6 text-foreground/40 mb-4" strokeWidth={1.5} />
                <h3 className="font-sentient text-lg mb-2">{feature.title}</h3>
                <p className="font-mono text-sm text-foreground/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
