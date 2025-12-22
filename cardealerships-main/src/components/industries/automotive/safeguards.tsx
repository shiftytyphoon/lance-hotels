"use client"

import { motion } from "framer-motion"
import { ArrowRight, RefreshCw, Bell } from "lucide-react"

const features = [
  {
    icon: ArrowRight,
    title: "Transfer triggers",
    description: "When a call needs attention, Lance connects you to a parts advisor or service manager instantly with full context.",
  },
  {
    icon: RefreshCw,
    title: "Transfer clawback",
    description: "If a transferred call goes unanswered, Lance automatically steps back in to keep the customer engaged.",
  },
  {
    icon: Bell,
    title: "Follow-up alerts",
    description: "When a call needs attention after it ends, Lance alerts the right team member with full context.",
  },
]

export function Safeguards() {
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
            Safeguards
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Content */}
          <div>
            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6"
            >
              <span className="italic">Features that protect</span>
              <br />
              <span className="italic text-white/40">customer experience</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 leading-relaxed max-w-lg"
            >
              Lance's top priority is to build an AI experience that resolves customer inquiries efficiently by either automating their request or escalating to the right team member immediately.
            </motion.p>
          </div>

          {/* Right side - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <div className="relative rounded-3xl overflow-hidden bg-[#111] border border-white/10 p-8 lg:p-12">
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Customer message */}
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-medium">E</span>
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-5 py-4 max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium text-sm">Edwin</span>
                    <span className="text-white/40 text-xs px-2 py-0.5 bg-white/5 rounded">Client</span>
                  </div>
                  <p className="text-white/80 text-sm">There is an issue with the car parts I've ordered.</p>
                </div>
              </div>

              {/* Lance response */}
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <span className="text-orange-400 text-sm font-bold">L</span>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl rounded-tl-sm px-5 py-4 max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium text-sm">Lance</span>
                    <span className="text-orange-400 text-xs px-2 py-0.5 bg-orange-500/10 rounded">AI agent</span>
                  </div>
                  <p className="text-white/90 text-sm">Sorry to hear that, I'll connect you to a parts advisor right away.</p>
                </div>
              </div>

              {/* Parts advisor message */}
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-5 py-4 max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium text-sm">Alex</span>
                    <span className="text-white/40 text-xs px-2 py-0.5 bg-white/5 rounded">Parts advisor</span>
                  </div>
                  <p className="text-white/80 text-sm">Hi Edwin. Sincere apologies for the inconvenience.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
