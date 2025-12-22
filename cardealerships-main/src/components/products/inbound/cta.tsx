"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
            <span className="italic">See the inbound agent</span>
            <br />
            <span className="italic text-white/40">in action</span>
          </h2>

          <p className="font-sans text-lg text-white/50 mb-10 max-w-lg mx-auto">
            Book a demo and see how Lance handles your toughest calls with ease.
          </p>

          <Link
            href="https://cal.com/caleb-chan-bmhfcl/lance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-sans text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
          >
            Book a demo
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
