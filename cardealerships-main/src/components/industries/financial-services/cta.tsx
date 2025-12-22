"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
            <span className="italic">Ready to transform your</span>
            <br />
            <span className="italic text-white/40">customer experience?</span>
          </h2>

          <p className="font-sans text-white/60 text-lg max-w-xl mx-auto mb-10">
            See how Lance can help your financial institution deliver faster, more secure customer support while reducing operational costs.
          </p>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-sans text-sm font-medium rounded-full hover:bg-white/90 transition-all hover:shadow-lg"
            >
              Book a demo
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
