"use client"

import { motion } from "framer-motion"
import { Zap, Brain, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Answers instantly",
    description: "Never miss a call again. Every conversation is handled in seconds.",
  },
  {
    icon: Brain,
    title: "Understands context",
    description: "Looks up customer data, policies, and past interactions before responding.",
  },
  {
    icon: CheckCircle,
    title: "Executes end to end",
    description: "Books appointments, updates systems, resolves issues, closes loops.",
  },
]

export function WhatItDoes() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
              What It Does
            </span>
          </div>
        </motion.div>

        {/* Three column grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="border-t border-white/10 pt-8">
                <feature.icon className="w-8 h-8 text-orange-500 mb-5" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl text-white italic mb-3">{feature.title}</h3>
                <p className="font-sans text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
