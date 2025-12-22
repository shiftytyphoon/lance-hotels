"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative h-screen flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2940&auto=format&fit=crop"
          alt="Insurance professional"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-[38px] sm:text-[48px] md:text-[60px] lg:text-[72px] text-white leading-[1.1] tracking-[-0.02em] max-w-4xl"
        >
          <span className="italic">Claims resolved.</span>
          <br />
          <span className="italic">Customers retained.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-5 font-sans text-[15px] text-white/60 tracking-wide max-w-lg"
        >
          AI agents that streamline claims, answer policy questions, and deliver exceptional service at scale. Up and running in two weeks.
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
            <div className="font-serif text-2xl md:text-3xl text-white">60%</div>
            <div className="font-sans text-[11px] text-white/40 uppercase tracking-wider mt-1">Faster Claims</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="font-serif text-2xl md:text-3xl text-white">35%</div>
            <div className="font-sans text-[11px] text-white/40 uppercase tracking-wider mt-1">Cost Reduction</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="font-serif text-2xl md:text-3xl text-white">92%</div>
            <div className="font-sans text-[11px] text-white/40 uppercase tracking-wider mt-1">CSAT Score</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
