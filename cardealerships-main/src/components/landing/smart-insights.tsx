"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { BarChart3, Sparkles, Zap } from "lucide-react"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"

export function SmartInsights() {
  const features = [
    {
      icon: BarChart3,
      title: "Performance tracking",
      description: "Track conversion rates, response times, and pipeline velocity in real-time",
    },
    {
      icon: Sparkles,
      title: "Clean interface",
      description: "See active campaigns, pending actions, and completed tasks at a glance",
    },
    {
      icon: Zap,
      title: "Quick setup",
      description: "Connect your tools, set preferences, and start running in under an hour",
    },
  ]

  return (
    <section className="relative bg-[#0a0a0a] text-white py-32 lg:py-40 overflow-hidden">
      {/* Ambient glow effects - very subtle */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Top section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          {/* Left - Headline */}
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
                Simple Interface
              </span>
            </div>

            {/* Big serif headline with scroll animation */}
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-[-0.02em]">
              <TextGradientScroll
                text="Built for revenue teams"
                type="word"
                textOpacity="medium"
                className="flex-wrap"
              />
            </h2>
          </motion.div>

          {/* Right - Features */}
          <div className="grid sm:grid-cols-3 gap-8 lg:gap-6 lg:pt-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-5 h-5 text-white/40 mb-4" strokeWidth={1.5} />
                <h3 className="font-sans text-base font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom section - Card with image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8 bg-[#111] rounded-3xl overflow-hidden"
        >
          {/* Left - Content */}
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="font-sans text-2xl font-medium text-white mb-3">Designed for RevOps</h3>
              <div className="w-12 h-0.5 bg-orange-500" />
            </div>
            <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-6 max-w-md">
              Your team gets full visibility into what Lance is doing. Review actions before they go out, set approval rules for high-value accounts, and monitor performance across all channels.
            </p>
            <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-8 max-w-md">
              The interface is preference-based, not workflow-heavy. Configure once, then let Lance run.
            </p>
            <Link
              href="#"
              className="inline-flex items-center justify-center w-fit px-6 py-3 bg-white/10 text-white font-sans text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              Explore the platform
            </Link>
          </div>

          {/* Right - Image */}
          <div className="relative min-h-[300px] lg:min-h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop"
              alt="Revenue dashboard"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-transparent" />

            {/* Floating UI element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-[#1a1a1a]/95 backdrop-blur-xl rounded-xl border border-white/10 p-4 shadow-2xl">
              <div className="font-sans text-sm text-white mb-3">Recent Actions</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/60">Customer re-engagement</div>
                  <div className="text-xs text-green-400">✓ Sent</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/60">Outbound campaign</div>
                  <div className="text-xs text-green-400">✓ Active</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/60">Risk escalation</div>
                  <div className="text-xs text-orange-400">→ Pending</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
