"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function CTA() {
  return (
    <section className="bg-white text-black py-32 lg:py-40 relative overflow-hidden">
      {/* Background gradient blobs with animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[150px] opacity-50"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-100 rounded-full blur-[120px] opacity-50"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left - Headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Section label with orange dot */}
            <motion.div
              className="flex items-center gap-2 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-[11px] text-black/50 uppercase tracking-[0.15em]">
                Schedule a demo
              </span>
            </motion.div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-black leading-[1.1] tracking-[-0.02em]">
              See Lance in action
            </h2>
          </motion.div>

          {/* Right - Description and CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:pt-8"
          >
            <p className="font-sans text-[15px] text-black/60 leading-relaxed mb-8 max-w-md">
              See how Lance connects to your existing tools and starts executing on revenue opportunities automatically. We'll walk through your specific use cases and show you what Lance can do for your team.
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
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-sans text-sm font-medium rounded-full hover:bg-black/90 transition-all hover:shadow-lg"
              >
                Schedule a call
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
