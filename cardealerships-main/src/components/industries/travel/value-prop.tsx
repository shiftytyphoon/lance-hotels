"use client"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Heart } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Elevate guest experience",
    description: "Deliver instant, personalized responses across every channel—voice, chat, email, and SMS—in 99+ languages.",
  },
  {
    icon: TrendingUp,
    title: "Maximize revenue",
    description: "Convert more inquiries into bookings with AI that understands intent, upsells intelligently, and never misses an opportunity.",
  },
  {
    icon: Heart,
    title: "Build lasting loyalty",
    description: "Remember guest preferences, anticipate needs, and create moments that turn first-time visitors into lifelong advocates.",
  },
]

export function ValueProp() {
  return (
    <section className="py-28 md:py-36 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Main value proposition text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mb-24"
        >
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3.25rem)] text-white leading-[1.2] tracking-[-0.02em]">
            <span className="italic">The hospitality industry faces a perfect storm:</span>{" "}
            <span className="italic text-white/40">rising guest expectations, staffing challenges, and pressure to do more with less.</span>
          </h2>
          <p className="mt-8 font-sans text-white/60 text-lg max-w-2xl leading-relaxed">
            Lance helps travel and hospitality brands deliver the personalized, always-on service guests expect—without burning out your team or breaking your budget.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-orange-500/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-500">
                <feature.icon className="w-7 h-7 text-orange-500" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans text-xl font-medium text-white mb-4">
                {feature.title}
              </h3>
              <p className="font-sans text-[15px] text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
