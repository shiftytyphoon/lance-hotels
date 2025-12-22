"use client"

import { motion } from "framer-motion"
import {
  Calendar,
  MessageSquare,
  Globe,
  CreditCard,
  Clock,
  MapPin,
  Bell,
  Headphones,
  Sparkles
} from "lucide-react"

const capabilities = [
  {
    icon: Calendar,
    title: "Booking Management",
    description: "Handle reservations, modifications, cancellations, and special requests across all channels.",
  },
  {
    icon: MessageSquare,
    title: "Guest Messaging",
    description: "Engage guests via SMS, WhatsApp, web chat, and voice with consistent, on-brand responses.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Communicate fluently in 99+ languages to serve international travelers seamlessly.",
  },
  {
    icon: CreditCard,
    title: "Payment & Billing",
    description: "Process payments, send invoices, handle refunds, and answer billing inquiries securely.",
  },
  {
    icon: Clock,
    title: "Check-in & Check-out",
    description: "Streamline arrivals and departures with mobile check-in, key delivery, and express checkout.",
  },
  {
    icon: MapPin,
    title: "Local Recommendations",
    description: "Provide personalized suggestions for dining, activities, and attractions based on guest preferences.",
  },
  {
    icon: Bell,
    title: "Service Requests",
    description: "Handle housekeeping, maintenance, room service, and amenity requests instantly.",
  },
  {
    icon: Headphones,
    title: "Issue Resolution",
    description: "Resolve complaints quickly with empathy, escalating to staff when human touch is needed.",
  },
  {
    icon: Sparkles,
    title: "Upselling & Cross-selling",
    description: "Identify and present relevant upgrades, packages, and add-ons at the perfect moment.",
  },
]

export function AICapabilities() {
  return (
    <section className="py-28 md:py-36 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Section label */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
              AI Capabilities
            </span>
          </div>

          {/* Big serif headline */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
            <span className="italic">Everything your team does,</span>
            <br />
            <span className="italic text-white/40">automated intelligently</span>
          </h2>

          <p className="font-sans text-white/50 text-lg max-w-2xl mx-auto">
            Lance handles the full spectrum of guest interactions, from simple inquiries to complex requests—freeing your team to focus on creating memorable moments.
          </p>
        </motion.div>

        {/* Capabilities grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group p-7 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/[0.08] hover:border-orange-500/30 hover:from-white/[0.08] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all duration-500">
                <capability.icon className="w-6 h-6 text-white/50 group-hover:text-orange-500 transition-colors duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans text-base font-medium text-white mb-2">
                {capability.title}
              </h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                {capability.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
