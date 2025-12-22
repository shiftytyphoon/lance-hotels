"use client"

import { motion } from "framer-motion"
import { Bell, RefreshCw, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Bell,
    title: "Sends reminders",
    description: "Appointment confirmations, service due dates, and follow-ups that reduce no-shows.",
  },
  {
    icon: RefreshCw,
    title: "Re-engages leads",
    description: "Automated follow-ups that bring cold leads back into the conversation.",
  },
  {
    icon: TrendingUp,
    title: "Drives revenue",
    description: "Proactive campaigns for upsells, renewals, and promotional offers.",
  },
]

export function WhatItDoes() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
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
