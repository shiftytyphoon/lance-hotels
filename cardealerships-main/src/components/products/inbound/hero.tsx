"use client"

import { motion } from "framer-motion"
import { Phone } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0a0a0a] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-12 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-sans text-[13px] text-white/70 tracking-wide">
                    Inbound Agent
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif text-[42px] md:text-[56px] lg:text-[64px] text-white leading-[1.1] tracking-[-0.02em] mb-6"
              >
                <span className="italic">Your smartest teammate</span>
                <br />
                <span className="italic text-white/40">for every incoming request.</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-sans text-lg text-white/50 leading-relaxed max-w-lg"
              >
                Handles calls, questions, routing, and multi-step workflows with human-level reasoning and speed.
              </motion.p>
            </div>

            {/* Right - Visual Asset */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-[#111] rounded-3xl border border-white/10 p-8 overflow-hidden">
                {/* Incoming call panel */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <div className="font-sans text-sm text-white">Incoming Call</div>
                        <div className="font-mono text-xs text-white/40">+1 (555) 234-5678</div>
                      </div>
                    </div>
                    <motion.div
                      className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="font-mono text-xs text-green-400">Live</span>
                    </motion.div>
                  </div>

                  {/* Waveform */}
                  <div className="flex items-center justify-center gap-1 h-16 mb-6">
                    {[...Array(40)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-orange-500/60 rounded-full"
                        animate={{
                          height: [8, Math.random() * 40 + 10, 8],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.02,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Context cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-1">Caller</div>
                    <div className="font-sans text-sm text-white">Sarah Johnson</div>
                    <div className="font-sans text-xs text-white/50">Returning Customer</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-1">Intent</div>
                    <div className="font-sans text-sm text-white">Service Booking</div>
                    <div className="font-sans text-xs text-orange-400">High confidence</div>
                  </div>
                  <div className="col-span-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-1">CRM Preview</div>
                    <div className="font-sans text-xs text-white/60">Last visit: Oct 15 • 2019 Honda Accord • VIP Status</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
