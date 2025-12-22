"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { TrendingUp, CheckCircle } from "lucide-react"

const benefits = [
  "Provide instant portfolio updates and performance summaries",
  "Schedule meetings with advisors based on availability",
  "Answer questions about market conditions and investment options",
]

export function WealthManagement() {
  return (
    <section className="relative bg-[#0a0a0a] text-white py-32 lg:py-40 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Portfolio mockup */}
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
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="font-sans text-sm text-white font-medium">Portfolio Summary</span>
                </div>
                <span className="font-mono text-xs text-white/40">As of today</span>
              </div>

              {/* Portfolio stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="font-mono text-xs text-white/40 mb-1">Total Value</div>
                  <div className="font-serif text-2xl text-white">$847,293</div>
                  <div className="font-mono text-xs text-green-400 mt-1">+12.4% YTD</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="font-mono text-xs text-white/40 mb-1">Today's Change</div>
                  <div className="font-serif text-2xl text-white">+$2,847</div>
                  <div className="font-mono text-xs text-green-400 mt-1">+0.34%</div>
                </div>
              </div>

              {/* Holdings breakdown */}
              <div className="mb-6">
                <div className="font-mono text-xs text-white/40 mb-3">Holdings</div>
                <div className="space-y-3">
                  {[
                    { name: "US Equities", value: "$423,647", percent: "50%", color: "bg-blue-500" },
                    { name: "International", value: "$169,458", percent: "20%", color: "bg-purple-500" },
                    { name: "Fixed Income", value: "$169,458", percent: "20%", color: "bg-green-500" },
                    { name: "Cash", value: "$84,730", percent: "10%", color: "bg-orange-500" },
                  ].map((holding) => (
                    <div key={holding.name} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${holding.color}`} />
                      <span className="font-sans text-sm text-white/80 flex-1">{holding.name}</span>
                      <span className="font-mono text-xs text-white/60">{holding.value}</span>
                      <span className="font-mono text-xs text-white/40 w-10 text-right">{holding.percent}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini chart */}
              <div className="h-20 bg-white/5 rounded-xl border border-white/10 flex items-end gap-0.5 p-3">
                {[35, 42, 38, 55, 48, 62, 58, 70, 65, 72, 68, 75, 80, 78, 85].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-green-500/40 to-green-500/80 rounded-t"
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
                Wealth Management
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
              <span className="italic">Elevate your</span>
              <br />
              <span className="italic text-white/40">client experience</span>
            </h2>

            {/* Description */}
            <p className="font-sans text-white/60 leading-relaxed mb-8 max-w-md">
              High-net-worth clients expect white-glove service. Lance provides instant access to portfolio information and seamless scheduling while maintaining the personal touch they value.
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
              Explore Wealth Management
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
