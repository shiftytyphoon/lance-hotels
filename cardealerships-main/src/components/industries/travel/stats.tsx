"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

function AnimatedCounter({ value, suffix = "", prefix = "", decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 1800
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value, decimals])

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : count}{suffix}
    </span>
  )
}

const performanceStats = [
  {
    value: 85,
    suffix: "%",
    label: "Increase in Booking Conversion",
  },
  {
    value: 60,
    suffix: "%",
    label: "Reduction in Support Costs",
  },
  {
    value: 4.9,
    suffix: "/5",
    label: "Average Guest Satisfaction",
    decimals: 1,
  },
]

const operationalStats = [
  {
    value: 3,
    suffix: "s",
    label: "Average response time across all channels",
  },
  {
    value: 99,
    suffix: "+",
    label: "Languages supported natively",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Availability with 99.99% uptime",
  },
]

export function Stats() {
  return (
    <section className="py-28 md:py-36 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* First stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="font-sans text-white/50 text-lg mb-16">
            Leading travel brands using Lance see transformative results:
          </p>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
            {performanceStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="font-serif text-6xl md:text-7xl lg:text-8xl text-white tracking-tight mb-5">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </div>
                <p className="font-sans text-sm text-white/50 max-w-[200px] mx-auto">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/10 my-20" />

        {/* Second stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="font-serif text-3xl md:text-4xl text-white italic mb-3">
            Enterprise-grade performance
          </h3>
          <h3 className="font-serif text-3xl md:text-4xl text-white/40 italic mb-16">
            built for the hospitality industry.
          </h3>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {operationalStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-10 rounded-3xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/[0.08]"
              >
                <div className="font-serif text-5xl md:text-6xl text-orange-500 tracking-tight mb-5">
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
