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

  return (
    <section ref={ref} className="relative h-screen flex flex-col overflow-hidden">
      {/* Background Image with parallax */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ y: backgroundY }}
      >
        <Image
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2991&auto=format&fit=crop"
          alt="Modern healthcare facility"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
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
          className="font-serif text-[38px] sm:text-[48px] md:text-[60px] lg:text-[72px] text-white leading-[1.1] tracking-[-0.02em] max-w-5xl"
        >
          <span className="italic">Responsible AI Agents</span>
          <br />
          <span className="italic">for Healthcare</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-5 font-sans text-[15px] md:text-[17px] text-white/60 tracking-wide max-w-2xl"
        >
          Improve patient engagement and overcome staffing shortages with HIPAA-compliant conversational AI, crafted for health systems.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8 md:gap-16"
        >
          <div className="text-center">
            <div className="font-serif text-2xl md:text-3xl text-white">HIPAA</div>
            <div className="font-sans text-[11px] text-white/40 uppercase tracking-wider mt-1">Compliant</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="font-serif text-2xl md:text-3xl text-white">65%</div>
            <div className="font-sans text-[11px] text-white/40 uppercase tracking-wider mt-1">Call Deflection</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="font-serif text-2xl md:text-3xl text-white">3 days</div>
            <div className="font-sans text-[11px] text-white/40 uppercase tracking-wider mt-1">To Deploy</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
