'use client'

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function ContactPage() {
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
      {/* Hero Section */}
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
        </motion.div>

        {/* Cloud/fog layer */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[40vh] z-[1] pointer-events-none"
          style={{ y: cloudsY }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center"
          style={{ y: textY, opacity }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-white leading-[1.1] tracking-[-0.3px]"
          >
            Get in touch.
          </motion.h1>
        </motion.div>
      </section>

      <CTA />
      <Footer />
    </main>
  )
}
