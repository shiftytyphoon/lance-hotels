"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function AmbientBackground() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll()

  // Parallax for different layers
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const layer3Y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating ambient orbs - very subtle */}
      <motion.div
        className="absolute top-[40vh] left-[10%] w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[150px]"
        style={{ y: layer2Y }}
        animate={{
          x: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[60vh] right-[15%] w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[120px]"
        style={{ y: layer3Y }}
        animate={{
          x: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[100vh] left-[30%] w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[180px]"
        style={{ y: layer2Y }}
        animate={{
          y: [0, 30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[150vh] right-[20%] w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[140px]"
        style={{ y: layer3Y }}
        animate={{
          x: [0, 40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}
