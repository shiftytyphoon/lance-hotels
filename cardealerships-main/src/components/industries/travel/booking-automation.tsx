"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, CheckCircle, Plane } from "lucide-react"

const benefits = [
  "Handle booking inquiries, modifications, and cancellations 24/7",
  "Intelligently upsell room upgrades, packages, and add-ons",
  "Seamless integration with your PMS, CRS, and booking engine",
]

export function BookingAutomation() {
  return (
    <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[850px]">
        {/* Left side - Content */}
        <div className="relative z-10 px-6 lg:px-12 xl:px-20 py-24 lg:py-32 flex flex-col justify-center">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Section label */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
                Booking Automation
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em]">
              <span className="italic">Never miss</span>
              <br />
              <span className="italic text-white/40">a booking</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-white/60 text-lg leading-relaxed mb-10 max-w-md"
          >
            Convert more inquiries into confirmed reservations with AI that responds instantly, understands complex requests, and guides guests seamlessly through the booking process.
          </motion.p>

          {/* Benefits list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-12"
          >
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="font-sans text-[15px] text-white/80">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 text-white font-sans text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              Explore booking automation
            </Link>
          </motion.div>
        </div>

        {/* Right side - Image + Booking mockup */}
        <div className="relative">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2960&auto=format&fit=crop"
              alt="Luxury hotel lobby"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
          </div>

          {/* Booking mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 p-8 lg:p-12 flex items-center justify-center min-h-[700px]"
          >
            <div className="w-full max-w-sm">
              {/* Booking card */}
              <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="font-sans text-sm font-medium text-white">New Booking Request</div>
                      <div className="font-mono text-xs text-white/40">Just now</div>
                    </div>
                  </div>
                </div>

                {/* Chat content */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-sans text-white/60">G</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/80">
                        I'd like to book a suite for 3 nights starting March 15th for our anniversary
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/90">
                        Happy anniversary! I have our Ocean View Suite available with a special romance package including champagne and rose petals. Shall I reserve it?
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-sans text-orange-400">L</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-sans text-white/60">G</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/80">
                        That sounds perfect! Yes please
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking confirmation */}
                <div className="mx-6 mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-sans text-sm font-medium text-green-400">Booking Confirmed</span>
                  </div>
                  <div className="font-mono text-xs text-white/50">
                    Ocean View Suite • Mar 15-18 • $2,847
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
