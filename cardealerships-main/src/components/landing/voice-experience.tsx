"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Mic, RefreshCw, Zap } from "lucide-react"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"

export function VoiceExperience() {
  const features = [
    {
      icon: Mic,
      title: "Engagement drops",
      description: "Detects inactivity and sends personalized re-engagement sequences",
    },
    {
      icon: RefreshCw,
      title: "High-intent behavior",
      description: "Identifies pricing page visits, feature requests, and starts outbound immediately",
    },
    {
      icon: Zap,
      title: "Churn indicators",
      description: "Routes at-risk accounts to your team with full context and suggested actions",
    },
  ]

  return (
    <section className="relative bg-[#0a0a0a] text-white py-32 lg:py-40 overflow-hidden">
      {/* Ambient glow effects - very subtle */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-white/[0.015] rounded-full blur-[130px] pointer-events-none" />

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
                Automated Actions
              </span>
            </div>

            {/* Big serif headline with scroll animation */}
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-[-0.02em]">
              <TextGradientScroll
                text="Nothing slips through"
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
              <h3 className="font-sans text-2xl font-medium text-white mb-3">Lance Execution Engine</h3>
              <div className="w-12 h-0.5 bg-orange-500" />
            </div>
            <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-6 max-w-md">
              Our proprietary system continuously monitors customer behavior across all your tools. It detects patterns, identifies intent, and executes follow-ups in real-time.
            </p>
            <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-8 max-w-md">
              Most platforms stop at showing you insights. Lance actually does something about them.
            </p>
            <Link
              href="#"
              className="inline-flex items-center justify-center w-fit px-6 py-3 bg-white/10 text-white font-sans text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              View technical details
            </Link>
          </div>

          {/* Right - Image */}
          <div className="relative min-h-[300px] lg:min-h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop"
              alt="Data analytics dashboard"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
