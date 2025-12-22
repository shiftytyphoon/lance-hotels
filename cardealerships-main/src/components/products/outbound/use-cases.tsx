"use client"

import { motion } from "framer-motion"

const useCases = [
  {
    title: "Appointment Reminders",
    description: "Reduce no-shows by 40% with automated confirmation calls.",
    stat: "40%",
    statLabel: "fewer no-shows",
  },
  {
    title: "Service Due Notifications",
    description: "Proactively reach customers when maintenance is due.",
    stat: "3x",
    statLabel: "more bookings",
  },
  {
    title: "Lead Follow-up",
    description: "Re-engage prospects who didn't convert the first time.",
    stat: "25%",
    statLabel: "conversion lift",
  },
  {
    title: "Customer Surveys",
    description: "Gather feedback at scale with natural voice interactions.",
    stat: "60%",
    statLabel: "response rate",
  },
]

export function UseCases() {
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
              Use Cases
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1] tracking-[-0.02em]">
            <span className="italic">Built for every</span>{" "}
            <span className="italic text-white/40">outreach need</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-[#111] border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-sans text-xl font-medium text-white mb-2">{useCase.title}</h3>
                  <p className="font-sans text-white/50 leading-relaxed">{useCase.description}</p>
                </div>
                <div className="text-right ml-6">
                  <div className="font-serif text-3xl text-orange-500">{useCase.stat}</div>
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{useCase.statLabel}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
