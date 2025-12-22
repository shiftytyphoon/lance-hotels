"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "Lance has revolutionized how we handle guest communications. Our booking conversion increased by 40% and our team can finally focus on creating memorable in-person experiences instead of answering repetitive questions.",
    author: "Maria Santos",
    role: "VP of Guest Experience",
    company: "Rosewood Hotels",
    rating: 5,
  },
  {
    quote: "The AI concierge handles thousands of requests daily—restaurant reservations, spa bookings, local recommendations—all while maintaining the personalized touch our guests expect from a luxury property.",
    author: "James Morrison",
    role: "General Manager",
    company: "Four Seasons Maui",
    rating: 5,
  },
  {
    quote: "We've reduced our contact center costs by 55% while actually improving guest satisfaction scores. Lance understands the nuances of hospitality in a way no other AI solution we've tried can match.",
    author: "Sarah Chen",
    role: "Chief Digital Officer",
    company: "Hyatt International",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-28 md:py-36 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          {/* Section label */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[11px] text-black/50 uppercase tracking-[0.15em]">
              Customer Stories
            </span>
          </div>

          {/* Big serif headline */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-black leading-[1.1] tracking-[-0.02em]">
            <span className="italic">Trusted by the world's</span>
            <br />
            <span className="italic text-black/40">leading hospitality brands</span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 flex flex-col"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-lg text-black leading-relaxed mb-8 italic flex-1">
                "{testimonial.quote}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="font-sans text-lg text-gray-400">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-sans font-medium text-black">{testimonial.author}</div>
                  <div className="font-sans text-sm text-black/50">{testimonial.role}</div>
                  <div className="font-sans text-sm text-orange-500">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-sans text-sm font-medium rounded-full hover:bg-black/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Read all customer stories
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
