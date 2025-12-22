"use client"

import { motion } from "framer-motion"
import { PhoneOutgoing } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0a0a0a] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
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
                    Outbound Agent
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
                <span className="italic">Proactive outreach</span>
                <br />
                <span className="italic text-white/40">that feels personal.</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-sans text-lg text-white/50 leading-relaxed max-w-lg"
              >
                Automate reminders, follow-ups, and campaigns with voice AI that sounds human and drives results.
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
                {/* Campaign panel */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <PhoneOutgoing className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <div className="font-sans text-sm text-white">Outbound Campaign</div>
                        <div className="font-mono text-xs text-white/40">Service Reminders</div>
                      </div>
                    </div>
                    <motion.div
                      className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="font-mono text-xs text-green-400">Active</span>
                    </motion.div>
                  </div>

                  {/* Campaign stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <div className="font-serif text-2xl text-white">247</div>
                      <div className="font-mono text-[10px] text-white/40 uppercase">Calls Made</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <div className="font-serif text-2xl text-white">89%</div>
                      <div className="font-mono text-[10px] text-white/40 uppercase">Answer Rate</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <div className="font-serif text-2xl text-white">156</div>
                      <div className="font-mono text-[10px] text-white/40 uppercase">Booked</div>
                    </div>
                  </div>
                </div>

                {/* Call queue */}
                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-2">Live Queue</div>
                  {[
                    { name: "Michael Chen", status: "In progress", time: "0:45" },
                    { name: "Emily Parker", status: "Up next", time: "--" },
                    { name: "David Wilson", status: "Queued", time: "--" },
                  ].map((call, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="font-sans text-sm text-white/70">{call.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/40">{call.time}</span>
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                          call.status === "In progress" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"
                        }`}>{call.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
