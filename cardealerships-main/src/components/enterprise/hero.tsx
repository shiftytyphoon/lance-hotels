"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function EnterpriseHero() {
  return (
    <section className="relative min-h-svh flex items-center overflow-hidden bg-background">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] opacity-50" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-12 bg-primary" />
            <span className="font-mono text-sm text-primary uppercase tracking-widest">Enterprise AI</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-sentient leading-[1.05] tracking-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            AI that talks like
            <br />
            <span className="text-primary">a human.</span>
            <br />
            <span className="text-foreground/40">Handles millions of calls.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="font-mono text-lg md:text-xl text-foreground/50 max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Voice agents for enterprise support. Up and running in two weeks.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black font-mono text-sm font-medium rounded-lg hover:bg-primary/90 transition-all hover:gap-3 group"
            >
              Talk to us
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#platform"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-foreground font-mono text-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              See the platform
            </Link>
          </motion.div>

          {/* Logo bar */}
          <motion.div
            className="mt-24 pt-12 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <p className="font-mono text-xs text-foreground/30 uppercase tracking-widest mb-8">Trusted by industry leaders</p>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
              {["Postman", "DoorDash", "Capital.com", "Afriex", "Reynolds"].map((name, i) => (
                <motion.div
                  key={name}
                  className="font-sentient text-xl text-foreground/20 hover:text-foreground/40 transition-colors cursor-default"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
