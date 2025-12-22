"use client"

import { motion } from "framer-motion"
import {
  Calendar,
  Users,
  BarChart3,
  Clock,
  MessageSquare,
  Sliders
} from "lucide-react"

const capabilities = [
  {
    icon: Calendar,
    title: "Smart scheduling",
    description: "Calls at optimal times based on customer data.",
  },
  {
    icon: Users,
    title: "Audience segmentation",
    description: "Target the right customers with the right message.",
  },
  {
    icon: BarChart3,
    title: "Campaign analytics",
    description: "Track performance and optimize in real-time.",
  },
  {
    icon: Clock,
    title: "Timezone awareness",
    description: "Never call at inconvenient hours.",
  },
  {
    icon: MessageSquare,
    title: "Voicemail detection",
    description: "Leave personalized messages when needed.",
  },
  {
    icon: Sliders,
    title: "Configurable scripts",
    description: "Customize messaging for any campaign type.",
  },
]

export function Capabilities() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0f0f0f]">
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
              Key Capabilities
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1] tracking-[-0.02em]">
            <span className="italic">Outreach</span>{" "}
            <span className="italic text-white/40">that converts</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
            >
              <capability.icon className="w-6 h-6 text-orange-500 mb-4" strokeWidth={1.5} />
              <h3 className="font-sans text-lg font-medium text-white mb-2">{capability.title}</h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed">{capability.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
