"use client"

import { motion } from "framer-motion"

const steps = [
  { label: "Incoming Call", sublabel: "Voice captured" },
  { label: "Intent", sublabel: "Classified" },
  { label: "Identity Lookup", sublabel: "CRM matched" },
  { label: "Policy Engine", sublabel: "Rules applied" },
  { label: "Action", sublabel: "Task executed" },
  { label: "Summary", sublabel: "Logged & sent" },
]

export function Workflow() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
              How It Works
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1] tracking-[-0.02em]">
            <span className="italic">From call to resolution</span>
          </h2>
        </motion.div>

        {/* Workflow diagram */}
        <div className="relative">
          {/* Glowing line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent transform -translate-y-1/2 hidden md:block" />

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-center"
              >
                {/* Node */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-[#0a0a0a] border-2 border-orange-500/50 flex items-center justify-center mb-4">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-orange-500"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(249, 115, 22, 0.4)",
                        "0 0 0 8px rgba(249, 115, 22, 0)",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                </div>

                {/* Label */}
                <div className="text-center">
                  <div className="font-sans text-sm font-medium text-white mb-1">{step.label}</div>
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{step.sublabel}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
