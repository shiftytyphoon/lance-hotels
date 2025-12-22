"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MessageSquare, CheckCircle, MapPin, Utensils, Ticket } from "lucide-react"

const services = [
  { icon: Utensils, label: "Restaurant reservations" },
  { icon: Ticket, label: "Activity bookings" },
  { icon: MapPin, label: "Local recommendations" },
]

const benefits = [
  "Provide instant, knowledgeable responses to guest inquiries",
  "Book restaurants, tours, and experiences on behalf of guests",
  "Remember preferences to personalize every interaction",
]

export function Concierge() {
  return (
    <section className="relative bg-[#0a0a0a] text-white py-28 lg:py-36 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
                AI Concierge
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
              <span className="italic">White-glove service,</span>
              <br />
              <span className="italic text-white/40">at scale</span>
            </h2>

            {/* Description */}
            <p className="font-sans text-white/60 text-lg leading-relaxed mb-10 max-w-md">
              Give every guest access to a knowledgeable concierge who can answer questions, make recommendations, and handle requests—instantly, in any language.
            </p>

            {/* Service pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {services.map((service) => (
                <div
                  key={service.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                >
                  <service.icon className="w-4 h-4 text-orange-500" />
                  <span className="font-sans text-sm text-white/70">{service.label}</span>
                </div>
              ))}
            </div>

            {/* Benefits list */}
            <div className="space-y-4 mb-12">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="font-sans text-[15px] text-white/80">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 text-white font-sans text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              Explore concierge features
            </Link>
          </motion.div>

          {/* Right - Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-[#111] rounded-3xl border border-white/10 p-6 lg:p-8">
              {/* Chat header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-500/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="font-sans text-base text-white font-medium">Lance Concierge</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-mono text-xs text-white/40">Online • Avg. response 3s</span>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-sans text-white/60">E</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                    <p className="font-sans text-sm text-white/80">
                      Can you recommend a romantic restaurant nearby for our anniversary dinner tonight?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-orange-500/15 border border-orange-500/25 rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                    <p className="font-sans text-sm text-white/90 mb-3">
                      Happy anniversary! I'd recommend La Maison—it has stunning ocean views and a Michelin-starred tasting menu. I can reserve a table by the window for 7:30 PM.
                    </p>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-sm font-medium text-white">La Maison</span>
                        <span className="text-xs text-orange-400">★ 4.9</span>
                      </div>
                      <div className="font-mono text-xs text-white/40">French Fine Dining • 0.3 mi • $$$</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 bg-orange-500 text-white text-xs rounded-lg font-medium hover:bg-orange-600 transition-colors">Reserve 7:30 PM</button>
                      <button className="px-4 py-2 bg-white/10 text-white/70 text-xs rounded-lg hover:bg-white/20 transition-colors">Other options</button>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-sans text-orange-400">L</span>
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
