"use client"

import Link from "next/link"
import { GL } from "./gl"
import { Button } from "./ui/Button"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function Hero() {
  const [hovering, setHovering] = useState(false)

  return (
    <div className="relative h-svh flex flex-col overflow-hidden">
      <GL hovering={hovering} />

      {/* Main hero content - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">

            {/* Main headline */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sentient leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Your AI
              <br />
              <span className="text-primary">receptionist</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="font-mono text-lg sm:text-xl text-foreground/50 mt-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              Voice agents that answer calls, book appointments, and never miss a lead.
            </motion.p>

            {/* Single CTA */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <Link
                href="https://cal.com/caleb-chan-bmhfcl/lance"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="group"
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            {/* Minimal social proof */}
            <motion.div
              className="mt-16 flex items-center justify-center gap-8 text-foreground/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10"
                    />
                  ))}
                </div>
                <span className="font-mono text-sm">50+ dealerships</span>
              </div>
              <div className="w-px h-4 bg-foreground/20" />
              <span className="font-mono text-sm">1M+ calls handled</span>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-mono text-xs text-foreground/30 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-foreground/30 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  )
}
