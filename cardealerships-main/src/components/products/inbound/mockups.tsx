"use client"

import { motion } from "framer-motion"

export function Mockups() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0f0f0f]">
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
              The Experience
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1] tracking-[-0.02em]">
            <span className="italic">See it in action</span>
          </h2>
        </motion.div>

        {/* Mockup grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Live transcript */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-[#111] border border-white/10"
          >
            <div className="font-mono text-[10px] text-orange-500 uppercase tracking-wider mb-4">Live Transcript</div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="font-mono text-xs text-white/30 w-12">00:03</span>
                <span className="font-sans text-sm text-white/70">Hi, I'd like to schedule a service appointment.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-mono text-xs text-white/30 w-12">00:05</span>
                <span className="font-sans text-sm text-orange-400">I can help with that. Let me pull up your account...</span>
              </div>
              <div className="flex gap-3">
                <span className="font-mono text-xs text-white/30 w-12">00:08</span>
                <span className="font-sans text-sm text-orange-400">I see you have a 2019 Honda Accord. Is this for routine maintenance?</span>
              </div>
            </div>
          </motion.div>

          {/* Agent reasoning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-[#111] border border-white/10"
          >
            <div className="font-mono text-[10px] text-orange-500 uppercase tracking-wider mb-4">Agent Reasoning</div>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2 rounded bg-white/5 text-white/50">
                <span className="text-white/30">→</span> Detected intent: <span className="text-white">SERVICE_BOOKING</span>
              </div>
              <div className="p-2 rounded bg-white/5 text-white/50">
                <span className="text-white/30">→</span> Customer matched: <span className="text-white">ID-28491</span>
              </div>
              <div className="p-2 rounded bg-white/5 text-white/50">
                <span className="text-white/30">→</span> Vehicle: <span className="text-white">2019 Honda Accord</span>
              </div>
              <div className="p-2 rounded bg-white/5 text-white/50">
                <span className="text-white/30">→</span> Checking available slots...
              </div>
            </div>
          </motion.div>

          {/* Customer card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-[#111] border border-white/10"
          >
            <div className="font-mono text-[10px] text-orange-500 uppercase tracking-wider mb-4">Customer Card</div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="font-sans text-lg text-orange-400">SJ</span>
              </div>
              <div className="flex-1">
                <div className="font-sans text-white font-medium">Sarah Johnson</div>
                <div className="font-sans text-sm text-white/50 mb-3">VIP Customer since 2018</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white/5">
                    <div className="text-white/40">Lifetime Value</div>
                    <div className="text-white">$12,450</div>
                  </div>
                  <div className="p-2 rounded bg-white/5">
                    <div className="text-white/40">Last Service</div>
                    <div className="text-white">Oct 15, 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Task execution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-[#111] border border-white/10"
          >
            <div className="font-mono text-[10px] text-orange-500 uppercase tracking-wider mb-4">Task Execution</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="font-sans text-sm text-white/70">Appointment created</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="font-sans text-sm text-white/70">Confirmation SMS sent</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="font-sans text-sm text-white/70">CRM record updated</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="font-sans text-sm text-white/70">Call summary logged</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
