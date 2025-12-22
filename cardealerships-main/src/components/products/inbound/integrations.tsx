"use client"

import { motion } from "framer-motion"

const integrations = [
  "Salesforce",
  "HubSpot",
  "CDK",
  "Zendesk",
  "Twilio",
  "ServiceNow",
  "Freshdesk",
  "Intercom",
]

export function Integrations() {
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
              Integrations
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1] tracking-[-0.02em] mb-4">
            <span className="italic">Connects to your stack</span>
          </h2>
          <p className="font-sans text-white/50 max-w-lg mx-auto">
            Works with the tools you already use, no rip-and-replace required.
          </p>
        </motion.div>

        {/* Integration logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {integrations.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <span className="font-sans text-sm text-white/50 hover:text-white/70 transition-colors">{name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
