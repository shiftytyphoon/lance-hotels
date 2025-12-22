"use client"

import { motion } from "framer-motion"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  company: string
  variant?: "default" | "light"
}

export function Testimonial({ quote, author, role, company, variant = "default" }: TestimonialProps) {
  const isLight = variant === "light"

  return (
    <section className={`py-24 md:py-32 px-6 lg:px-12 ${isLight ? "bg-white" : "bg-[#0a0a0a]"}`}>
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_250px] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Quote marks */}
            <div className="text-orange-500 text-6xl font-serif leading-none mb-6">"</div>

            {/* Quote */}
            <blockquote className={`font-serif text-[clamp(1.25rem,3vw,2rem)] leading-[1.4] tracking-[-0.01em] mb-8 italic ${isLight ? "text-black" : "text-white"}`}>
              {quote}
            </blockquote>

            {/* Company */}
            <div className="mb-4">
              <span className={`text-lg font-semibold ${isLight ? "text-orange-500" : "text-orange-500"}`}>{company}</span>
            </div>

            {/* Author */}
            <div>
              <div className={`font-medium ${isLight ? "text-black" : "text-white"}`}>{author}</div>
              <div className={`text-sm ${isLight ? "text-black/50" : "text-white/50"}`}>{role}</div>
            </div>
          </motion.div>

          {/* Portrait placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-40 h-40">
              <div className={`absolute inset-0 rounded-full ${isLight ? "bg-gray-100" : "bg-white/5"} flex items-center justify-center`}>
                <div className={`text-4xl ${isLight ? "text-gray-300" : "text-white/20"}`}>
                  {author.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
