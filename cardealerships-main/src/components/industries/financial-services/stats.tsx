"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 1500
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  )
}

const stats = [
  {
    value: 85,
    suffix: "%",
    label: "First Contact Resolution Rate",
  },
  {
    value: 60,
    suffix: "%",
    label: "Reduction in Call Wait Times",
  },
  {
    value: 40,
    suffix: "%",
    label: "Decrease in Operational Costs",
  },
]

const successStats = [
  {
    value: 100,
    suffix: "%",
    label: "SOC 2 Type II compliant with bank-grade security",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Availability with 99.99% uptime guarantee",
  },
  {
    value: 50,
    suffix: "+",
    label: "Financial institutions trust Lance",
  },
]

export function Stats() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* First stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-sans text-white/60 text-lg mb-12">
            Financial institutions using Lance see measurable results:
          </p>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-6xl md:text-7xl lg:text-8xl text-white tracking-tight mb-4">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-sans text-sm text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/10 my-20" />

        {/* Second stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="font-serif text-3xl md:text-4xl text-white italic mb-4">
            Enterprise security that meets
          </h3>
          <h3 className="font-serif text-3xl md:text-4xl text-white/40 italic mb-16">
            the highest compliance standards.
          </h3>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
            {successStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-[#111] border border-white/10"
              >
                <div className="font-serif text-5xl md:text-6xl text-orange-500 tracking-tight mb-4">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-sans text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
