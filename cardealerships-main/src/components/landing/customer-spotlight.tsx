"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"

export function CustomerSpotlight() {
  return (
    <section className="relative bg-white text-black py-32 lg:py-40 overflow-hidden">
      {/* Subtle ambient glows for the light section */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
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
              Customer Spotlight
            </span>
          </div>

          {/* Big serif headline with scroll animation */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-black leading-[1.1] tracking-[-0.02em] max-w-3xl">
            <TextGradientScroll
              text="How revenue teams use Lance"
              type="word"
              textOpacity="medium"
              className="flex-wrap"
            />
          </h2>
        </motion.div>

        {/* Customer case study card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Left - Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2940&auto=format&fit=crop"
              alt="Revenue team collaboration"
              fill
              className="object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              {/* Use case 1 */}
              <div>
                <h3 className="font-sans text-lg font-medium text-black mb-3">
                  Re-engagement campaigns
                </h3>
                <p className="font-sans text-[15px] text-black/60 leading-relaxed">
                  When a customer stops using your product or goes dark on communication, Lance automatically sends personalized re-engagement sequences and alerts your team if manual intervention is needed.
                </p>
              </div>

              {/* Use case 2 */}
              <div>
                <h3 className="font-sans text-lg font-medium text-black mb-3">
                  Intent-based outbound
                </h3>
                <p className="font-sans text-[15px] text-black/60 leading-relaxed">
                  Pricing page visits, demo requests, and feature inquiries trigger immediate outbound campaigns. Your sales team gets notified only when accounts hit high-intent thresholds.
                </p>
              </div>

              {/* Use case 3 */}
              <div>
                <h3 className="font-sans text-lg font-medium text-black mb-3">
                  Churn prevention
                </h3>
                <p className="font-sans text-[15px] text-black/60 leading-relaxed">
                  Support ticket patterns, usage drops, and billing issues automatically escalate to account managers with full context, suggested talking points, and recommended actions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
