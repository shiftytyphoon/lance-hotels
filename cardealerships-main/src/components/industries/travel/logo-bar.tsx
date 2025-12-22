"use client"

import { motion } from "framer-motion"

export function LogoBar() {
  const brands = [
    "Marriott",
    "Hilton",
    "Hyatt",
    "Four Seasons",
    "Airbnb",
    "Expedia",
    "Delta",
    "United",
  ]

  return (
    <section className="py-16 px-6 lg:px-12 bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center gap-10"
        >
          <p className="text-sm text-white/40 whitespace-nowrap leading-relaxed">
            Trusted by world-class
            <br className="md:hidden" />
            travel brands
          </p>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-6 md:gap-x-14">
            {brands.map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="text-white/25 hover:text-white/50 transition-colors duration-300"
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
