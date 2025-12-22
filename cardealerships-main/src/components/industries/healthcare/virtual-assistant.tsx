"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Bot, CheckCircle } from "lucide-react"

const benefits = [
  "Deploy in a matter of days, not months",
  "Reduce the resources required to launch and maintain interfaces",
  "Expand to new use cases and channels seamlessly",
]

export function VirtualAssistant() {
  return (
    <section className="relative bg-[#0a0a0a] text-white py-32 lg:py-40 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Content */}
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
                AI Virtual Assistant
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
              <span className="italic">Navigate patients to</span>
              <br />
              <span className="italic text-white/40">the right digital services</span>
            </h2>

            {/* Description */}
            <p className="font-sans text-white/60 leading-relaxed mb-8 max-w-md">
              Move beyond outdated healthcare chatbots with Lance's NLU-based approach. Improve patient experience, optimize access to self-service, and boost engagement metrics without the heavy lifting.
            </p>

            {/* Benefits list */}
            <div className="space-y-4 mb-10">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-white/80">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-sans text-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              Explore Virtual Assistant
            </Link>
          </motion.div>

          {/* Right - Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-[#111] rounded-3xl border border-white/10 p-6 lg:p-8">
              {/* Chat header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="font-sans text-sm text-white font-medium">Lance AI Assistant</div>
                  <div className="font-mono text-xs text-white/40">Online now</div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-sans text-orange-400">L</span>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                    <p className="font-sans text-sm text-white/90">
                      Hi! How can I help you today?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-white/5 rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                    <p className="font-sans text-sm text-white/80">
                      I need to refill my prescription
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-sans text-white/60">J</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-sans text-orange-400">L</span>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                    <p className="font-sans text-sm text-white/90">
                      I can help with that! I found your prescription for Lisinopril. Would you like me to submit a refill request to CVS Pharmacy?
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1.5 bg-orange-500 text-white text-xs rounded-lg font-medium">Yes, refill</button>
                      <button className="px-3 py-1.5 bg-white/10 text-white/70 text-xs rounded-lg">Different pharmacy</button>
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
