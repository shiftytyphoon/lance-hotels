"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const testimonials = [
  {
    quote: "What attracted us to Lance was their adaptive approach. Our physician data is now easily accessible—and we're seeing 47% more appointments booked online.",
    author: "Dr. Curtis Cole",
    role: "CIO",
    company: "Weill Cornell Medicine",
  },
  {
    quote: "Lance offered us a conversational interface that was customizable to our organization and could also be quickly launched within 48 hours as an out-of-the-box platform.",
    author: "Adrin Mammen",
    role: "AVP, Patient Access Transformation Officer",
    company: "Montefiore Health System",
  },
  {
    quote: "Many patient inquiries and tasks can now be resolved end-to-end by Lance's AI assistants. Patients get what they need quickly and easily without waiting on hold, and agents can focus on the most complex calls.",
    author: "Craig Richardville",
    role: "Chief Digital and Information Officer",
    company: "Intermountain Health",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          {/* Section label with orange dot */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[11px] text-black/50 uppercase tracking-[0.15em]">
              Customer Stories
            </span>
          </div>

          {/* Big serif headline */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-black leading-[1.1] tracking-[-0.02em]">
            <span className="italic">Trusted by leading</span>
            <br />
            <span className="italic text-black/40">health systems</span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-gray-50 border border-gray-100"
            >
              {/* Industry tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6">
                <span className="font-mono text-[10px] text-orange-600 uppercase tracking-wider">Healthcare</span>
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-lg text-black leading-relaxed mb-8 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
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

              {/* Read more link */}
              <Link
                href="#"
                className="inline-flex items-center gap-2 mt-6 font-sans text-sm text-black/60 hover:text-black transition-colors"
              >
                Read Full Case Study
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* See all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-sans text-sm rounded-full hover:bg-black/80 transition-colors"
          >
            See All Success Stories
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
