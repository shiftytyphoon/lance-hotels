"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export function CTA() {
  return (
    <section className="relative py-32 md:py-40 px-6 lg:px-12 bg-[#0a0a0a] overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2940&auto=format&fit=crop"
          alt="Luxury resort pool"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/60" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/[0.05] rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-orange-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
              Get Started
            </span>
          </motion.div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
            <span className="italic">Ready to transform your</span>
            <br />
            <span className="italic text-white/50">guest experience?</span>
          </h2>

          <p className="font-sans text-white/60 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Join the world's leading travel and hospitality brands using Lance to deliver exceptional service at scale. See a personalized demo in just 15 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="https://cal.com/caleb-chan-bmhfcl/lance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 bg-white text-black font-sans text-sm font-medium rounded-full hover:bg-white/90 transition-all shadow-lg shadow-white/10"
              >
                Book a demo
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="#"
                className="inline-flex items-center justify-center px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-sans text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all"
              >
                Contact sales
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
