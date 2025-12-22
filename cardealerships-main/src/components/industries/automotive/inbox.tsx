"use client"

import { motion } from "framer-motion"

const features = [
  {
    number: "1",
    title: "Unify customer interaction",
    description: "See every call, text, and message in one place. Lance brings all customer conversations together so your team can respond faster.",
  },
  {
    number: "2",
    title: "Act fast and stay organized",
    description: "Lance automatically assigns follow-ups, flags urgent requests, and keeps your staff on top of every customer inquiry.",
  },
  {
    number: "3",
    title: "Complete visibility",
    description: "Track every interaction from start to finish. With full transcripts and outcomes in one dashboard, your team always knows what needs attention.",
  },
]

export function Inbox() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
            Inbox
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-16 max-w-2xl"
        >
          <span className="italic">A better way to</span>
          <br />
          <span className="italic text-white/40">manage relationships</span>
        </motion.h2>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-sm text-white/40 mb-3">{feature.number}</div>
              <h3 className="font-medium text-white mb-3 italic">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* UI Mockups */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Inbox mockup */}
          <div className="rounded-2xl overflow-hidden bg-[#111] border border-white/10 p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-4 h-4 rounded border border-white/30" />
                <span className="text-xs text-white">[Follow-up] Customer waiting on...</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <div className="w-4 h-4 rounded border border-white/20" />
                <span className="text-xs text-white/50">[Voicemail] Update from advisor</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <div className="w-4 h-4 rounded border border-white/20" />
                <span className="text-xs text-white/50">Inbound SMS: Is my car ready...</span>
              </div>
            </div>
          </div>

          {/* Assignment mockup */}
          <div className="rounded-2xl overflow-hidden bg-[#111] border border-white/10 p-6">
            <div className="text-xs text-white/50 mb-4">Select assignee</div>
            <div className="space-y-2">
              {["George", "Sierra", "Thomas", "Jessica"].map((name) => (
                <div key={name} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs text-white/60">{name[0]}</span>
                  </div>
                  <div>
                    <div className="text-xs text-white">{name}</div>
                    <div className="text-[10px] text-white/40">Service advisor</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call details mockup */}
          <div className="rounded-2xl overflow-hidden bg-[#111] border border-white/10 p-6">
            <div className="text-xs text-white font-medium mb-1">Call with Jordan</div>
            <div className="text-[10px] text-white/40 mb-4">1 (630) 346 6789</div>
            <div className="h-8 bg-white/5 rounded-lg flex items-center px-3 mb-4">
              <div className="flex gap-0.5">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 bg-orange-500/60 rounded" style={{ height: `${Math.random() * 16 + 4}px` }} />
                ))}
              </div>
              <span className="text-[10px] text-white/40 ml-auto">0:01 / 4:32</span>
            </div>
            <div className="text-xs text-white/40">Summary</div>
            <div className="text-xs text-white/60 mt-1">Customer inquired about service appointment...</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
