"use client"

import { motion } from "framer-motion"
import { Shield, TrendingUp, Clock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Build customer trust",
    description: "Deliver secure, accurate responses that maintain compliance while building lasting relationships.",
  },
  {
    icon: TrendingUp,
    title: "Grow lifetime value",
    description: "Identify cross-sell opportunities and provide proactive support that increases customer retention.",
  },
  {
    icon: Clock,
    title: "Reduce wait times",
    description: "Handle routine inquiries instantly so your team can focus on complex financial guidance.",
  },
]

export function ValueProp() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Main value proposition text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mb-20"
        >
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] text-white leading-[1.3] tracking-[-0.01em]">
            <span className="italic">Financial institutions are struggling with</span>{" "}
            <span className="italic text-white/40">high call volumes, long wait times, and rising customer expectations.</span>
          </h2>
          <p className="mt-6 font-sans text-white/60 text-lg max-w-2xl">
            By deploying Lance, they've been able to automate routine inquiries, reduce operational costs, and deliver the personalized service their customers expect.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-[#111] border border-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-sans text-lg font-medium text-white mb-3">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
