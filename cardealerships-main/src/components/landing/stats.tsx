"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
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
      {count}{suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Subtle fog continuation from hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] pointer-events-none" />

      {/* Ambient glow effects - very subtle */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[400px] h-[250px] bg-white/[0.015] rounded-full blur-[100px] pointer-events-none" />

      {/* Top section with description and stats */}
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          {/* Left - Description */}
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-sans text-lg md:text-xl text-white/80 max-w-xl leading-relaxed"
          >
            We connect to support tickets, product usage, CRM activity, and behavioral signals. When a customer goes quiet, shows buying intent, or displays risk, Lance acts.
          </motion.p>

          {/* Right - Stats */}
          <div className="flex gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="font-mono text-[11px] text-white/40 uppercase tracking-[0.15em] mb-2">
                Response Time
              </div>
              <div className="font-serif text-6xl md:text-7xl lg:text-8xl text-white tracking-tight">
                &lt;5<span className="text-5xl md:text-6xl lg:text-7xl">min</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div className="font-mono text-[11px] text-white/40 uppercase tracking-[0.15em] mb-2">
                Actions Daily
              </div>
              <div className="font-serif text-6xl md:text-7xl lg:text-8xl text-white tracking-tight">
                <AnimatedCounter value={1000} />
                <span className="text-5xl md:text-6xl lg:text-7xl">+</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
