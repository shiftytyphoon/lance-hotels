"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const cloudsY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  return (
    <section ref={ref} className="relative h-screen flex flex-col overflow-hidden">
      {/* Background Image with parallax */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ y: backgroundY }}
      >
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2946&auto=format&fit=crop"
          alt="Luxury beach resort destination"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </motion.div>

      {/* Atmospheric overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[50vh] z-[1] pointer-events-none"
        style={{ y: cloudsY }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center"
        style={{ y: textY, opacity }}
      >
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-[38px] sm:text-[48px] md:text-[60px] lg:text-[72px] text-white leading-[1.05] tracking-[-0.02em] max-w-5xl"
        >
          <span className="italic">Exceptional guest experiences,</span>
          <br />
          <span className="italic">powered by AI</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 font-sans text-[15px] md:text-[17px] text-white/70 tracking-wide max-w-2xl leading-relaxed"
        >
          Drive bookings, build loyalty, and boost revenue with AI agents that deliver personalized service at every touchpoint—from first inquiry to post-stay follow-up.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10"
        >
          <Link
            href="https://cal.com/caleb-chan-bmhfcl/lance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 bg-white text-black font-sans text-[14px] font-medium rounded-full hover:bg-white/90 transition-colors"
          >
            Book a demo
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-8 md:gap-12 lg:gap-16"
        >
          {[
            { value: "85%", label: "Booking Conversion" },
            { value: "60%", label: "Cost Reduction" },
            { value: "4.9", label: "Guest Rating" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <div className="font-serif text-3xl md:text-4xl text-white">{stat.value}</div>
              <div className="font-sans text-[11px] text-white/50 uppercase tracking-wider mt-1.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
