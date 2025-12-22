"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { BarChart3, Bell, FileText, CheckCircle } from "lucide-react"

const benefits = [
  "Identify trends and set up alerts in real-time",
  "Improve digital optimization and care delivery based on data",
  "Generate customized insight reports worth sending internally",
]

export function Insights() {
  return (
    <section className="relative bg-[#0a0a0a] text-white py-32 lg:py-40 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Analytics mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-[#111] rounded-3xl border border-white/10 p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  <span className="font-sans text-sm text-white font-medium">Patient Insights</span>
                </div>
                <span className="font-mono text-xs text-white/40">Last 30 days</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="font-mono text-xs text-white/40 mb-1">Call Volume</div>
                  <div className="font-serif text-2xl text-white">12,847</div>
                  <div className="font-mono text-xs text-green-400 mt-1">+23% from last month</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="font-mono text-xs text-white/40 mb-1">Resolution Rate</div>
                  <div className="font-serif text-2xl text-white">87%</div>
                  <div className="font-mono text-xs text-green-400 mt-1">+5% from last month</div>
                </div>
              </div>

              {/* Top keywords */}
              <div className="mb-6">
                <div className="font-mono text-xs text-white/40 mb-3">Top Patient Inquiries</div>
                <div className="flex flex-wrap gap-2">
                  {["Appointments", "Prescriptions", "Test Results", "Billing", "Referrals"].map((keyword) => (
                    <span key={keyword} className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-400">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mini chart representation */}
              <div className="h-24 bg-white/5 rounded-xl border border-white/10 flex items-end gap-1 p-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-orange-500/40 to-orange-500/80 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label with orange dot */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
                Conversational Intelligence
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
              <span className="italic">Uncover patient</span>
              <br />
              <span className="italic text-white/40">insights, automatically</span>
            </h2>

            {/* Description */}
            <p className="font-sans text-white/60 leading-relaxed mb-8 max-w-md">
              Generate actionable insights from patient journey analytics in your health system, including top keywords and trends, patient engagement metrics, knowledge gaps and more.
            </p>

            {/* Benefits list */}
            <div className="space-y-4 mb-10">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-white/80">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-sans text-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              Explore Insights
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
