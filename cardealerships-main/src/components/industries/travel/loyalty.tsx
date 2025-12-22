"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Award, CheckCircle, Gift, Star, Crown } from "lucide-react"

const benefits = [
  "Instant access to points balance, tier status, and rewards",
  "Personalized offers based on guest history and preferences",
  "Seamless redemption for upgrades, experiences, and perks",
]

export function Loyalty() {
  return (
    <section className="relative bg-[#0a0a0a] text-white py-28 lg:py-36 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Loyalty dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-[#111] rounded-3xl border border-white/10 p-6 lg:p-8 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-500/10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-sans text-sm font-medium text-white">Elite Member</div>
                    <div className="font-mono text-xs text-white/40">Since 2019</div>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <span className="font-mono text-xs text-amber-400">Platinum</span>
                </div>
              </div>

              {/* Points display */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 mb-6">
                <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">Available Points</div>
                <div className="font-serif text-5xl text-white mb-2">247,850</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: "78%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="font-mono text-xs text-white/50">78%</span>
                </div>
                <div className="font-mono text-xs text-white/40 mt-2">52,150 points to Diamond</div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Gift, label: "Redeem" },
                  { icon: Star, label: "Benefits" },
                  { icon: Award, label: "History" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <action.icon className="w-5 h-5 text-white/40 group-hover:text-orange-500 transition-colors mx-auto mb-2" />
                    <div className="font-sans text-xs text-white/60 text-center">{action.label}</div>
                  </button>
                ))}
              </div>

              {/* Recent activity */}
              <div>
                <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-3">Recent Activity</div>
                <div className="space-y-3">
                  {[
                    { action: "Suite upgrade redeemed", points: "-15,000", date: "Today" },
                    { action: "Stay at Miami Beach Resort", points: "+4,250", date: "Mar 2" },
                    { action: "Dining credit earned", points: "+500", date: "Mar 1" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <div className="font-sans text-sm text-white/80">{item.action}</div>
                        <div className="font-mono text-xs text-white/40">{item.date}</div>
                      </div>
                      <div className={`font-mono text-sm ${item.points.startsWith('+') ? 'text-green-400' : 'text-white/50'}`}>
                        {item.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
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
                Loyalty & Rewards
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em] mb-6">
              <span className="italic">Turn guests into</span>
              <br />
              <span className="italic text-white/40">lifelong fans</span>
            </h2>

            {/* Description */}
            <p className="font-sans text-white/60 text-lg leading-relaxed mb-10 max-w-md">
              Make your loyalty program effortless. Lance gives members instant access to their rewards, personalized offers, and seamless redemption—all through natural conversation.
            </p>

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
              Explore loyalty features
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
