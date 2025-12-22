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
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop"
          alt="Mountains"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
      </motion.div>

      {/* Cloud/fog layer that extends below */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[40vh] z-[1] pointer-events-none"
        style={{ y: cloudsY }}
      >
        {/* Multiple fog layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
      </motion.div>

      {/* Content - centered with scroll fade */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center"
        style={{ y: textY, opacity }}
      >
        {/* Y Combinator badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            transition={{ duration: 0.2 }}
          >
            {/* YC Logo - square not rounded */}
            <div className="w-3.5 h-3.5 bg-[#FF6600] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">Y</span>
            </div>
            <span className="font-sans text-[11px] text-white/60 tracking-[0.3px]">
              Backed by Y Combinator
            </span>
          </motion.div>
        </motion.div>

        {/* Main headline - two lines */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-white leading-[1.1] tracking-[-0.3px]"
        >
          Revenue execution that
          <br />
          happens automatically
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 font-sans text-[15px] text-white/60 tracking-wide max-w-xl"
        >
          Connect your customer data. Lance decides who to reach out to, when to start campaigns, and which accounts need attention.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3 bg-white text-[#111] font-sans text-[14px] font-medium rounded-full hover:bg-white/95 transition-colors"
            >
              Schedule a demo
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

    </section>
  )
}
