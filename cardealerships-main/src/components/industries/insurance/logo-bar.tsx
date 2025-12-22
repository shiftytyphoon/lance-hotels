"use client"

import { motion } from "framer-motion"

export function LogoBar() {
  const companies = [
    "Progressive",
    "Allstate",
    "Liberty Mutual",
    "Nationwide",
    "Travelers",
    "MetLife",
    "Aflac",
    "Prudential",
  ]

  return (
    <section className="py-12 px-6 lg:px-12 bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center gap-8"
        >
          <p className="text-sm text-white/40 whitespace-nowrap">
            Trusted by leading
            <br className="md:hidden" />
            insurance providers
          </p>

          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            {companies.map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="text-white/30 hover:text-white/50 transition-colors"
              >
                <span className="font-sans text-sm font-medium tracking-wide">{name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
