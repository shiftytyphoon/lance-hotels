"use client"

import { motion } from "framer-motion"

export function Stats() {
  const stats = [
    { value: "98%", label: "Resolution Rate", description: "Issues resolved without human intervention" },
    { value: "99", label: "Languages", description: "Supported across all regions" },
    { value: "<1s", label: "Response Time", description: "Average latency on calls" },
    { value: "50M+", label: "Calls Handled", description: "And counting" },
  ]

  return (
    <section className="py-24 px-6 bg-background border-t border-white/5">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative lg:pl-8 lg:border-l border-white/10 first:border-l-0 first:pl-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-5xl md:text-6xl font-sentient text-primary mb-2">{stat.value}</div>
              <div className="font-mono text-xs text-foreground uppercase tracking-wider mb-2">{stat.label}</div>
              <div className="font-mono text-sm text-foreground/40">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
