"use client"

import { motion } from "framer-motion"

export function ValueProp() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-[clamp(1.5rem,4vw,2.75rem)] text-white leading-[1.3] tracking-[-0.01em] italic"
        >
          Let Lance handle the everyday conversations that keep your dealership running, while your team handles everything else.
        </motion.p>
      </div>
    </section>
  )
}
