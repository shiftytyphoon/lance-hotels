'use client'

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Footer } from "@/components/landing/footer"

export default function CareersPage() {
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
    <main className="relative bg-[#0a0a0a]">
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
          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-white leading-[1.1] tracking-[-0.3px]"
          >
            Join the fastest growing
            <br />
            voice company.
          </motion.h1>

          {/* Email */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 font-sans text-[16px] md:text-[18px] text-white/70"
          >
            Email{" "}
            <a
              href="mailto:caleb@lance.live"
              className="text-white hover:text-orange-400 transition-colors underline underline-offset-4"
            >
              caleb@lance.live
            </a>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <a
                href="mailto:caleb@lance.live"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-[#111] font-sans text-[13px] font-medium rounded-full hover:bg-white/95 transition-colors"
              >
                Get in touch
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
