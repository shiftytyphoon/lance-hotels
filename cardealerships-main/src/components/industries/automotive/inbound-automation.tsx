"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Phone, Calendar, Bell, MessageSquare } from "lucide-react"

const features = [
  {
    id: "service",
    title: "Service scheduling",
    icon: Calendar,
    description: "Automatically book service appointments with real-time availability checks and instant CRM sync.",
  },
  {
    id: "receptionist",
    title: "Full-store receptionist",
    icon: Phone,
    description: "Handle sales inquiries, route calls to the right department, and capture lead information 24/7.",
  },
  {
    id: "reminders",
    title: "Automated reminders",
    icon: Bell,
    description: "Reduce no-shows and keep your bays full with automated texts and calls that remind customers of upcoming appointments.",
  },
  {
    id: "sms",
    title: "Dropped call SMS",
    icon: MessageSquare,
    description: "Never lose a lead. When calls drop, automatically send a text to re-engage the customer.",
  },
]

export function InboundAutomation() {
  const [openFeature, setOpenFeature] = useState("reminders")

  return (
    <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[800px]">
        {/* Left side - Content */}
        <div className="relative z-10 px-6 lg:px-12 xl:px-20 py-20 lg:py-32">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Section label with orange dot */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
                Protect Your Revenue
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-[-0.02em]">
              <span className="italic">Inbound</span>
              <br />
              <span className="italic text-white/40">automation</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-white/60 leading-relaxed mb-8 max-w-md"
          >
            Our AI handles every inbound request with real-time responses, booking appointments, qualifying leads, and routing complex inquiries to your team.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-sans text-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              Book a demo
            </Link>
          </motion.div>

          {/* Accordion features */}
          <div className="space-y-0">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="border-t border-white/10"
              >
                <button
                  onClick={() => setOpenFeature(openFeature === feature.id ? "" : feature.id)}
                  className="w-full py-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    {openFeature === feature.id && (
                      <feature.icon className="w-4 h-4 text-orange-500" />
                    )}
                    <span className={`text-sm ${openFeature === feature.id ? "text-white font-medium" : "text-white/50"}`}>
                      {feature.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/50 transition-transform ${
                      openFeature === feature.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFeature === feature.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-white/50 leading-relaxed pl-7">
                        {feature.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </div>

        {/* Right side - Image + Phone mockup */}
        <div className="relative">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2942&auto=format&fit=crop"
              alt="Car dealership showroom"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 p-8 lg:p-12 flex items-center justify-center min-h-[600px]"
          >
            <div className="w-full max-w-sm bg-[#1a1a1a]/90 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
              {/* Phone notch */}
              <div className="flex justify-center pt-2">
                <div className="w-24 h-6 bg-black rounded-b-2xl" />
              </div>

              {/* Phone content */}
              <div className="p-6">
                {/* Call header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500/30 to-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
                    <Phone className="w-7 h-7 text-orange-400" />
                  </div>
                  <div className="font-sans text-lg text-white">Happy Valley Motors</div>
                  <div className="font-mono text-xs text-white/40 mt-1">Receptionist</div>
                  <motion.div
                    className="font-mono text-xs text-orange-400 mt-2"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Connected • 0:47
                  </motion.div>
                </div>

                {/* Conversation */}
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-sans text-white/60">C</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/80">
                        Hi, I need to schedule an oil change for my F-150
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/90">
                        I'd be happy to help! I have availability tomorrow at 10 AM or Thursday at 2 PM.
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-sans text-orange-400">AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
