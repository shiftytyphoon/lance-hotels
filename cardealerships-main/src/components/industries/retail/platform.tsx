"use client"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Shield } from "lucide-react"

const platformFeatures = [
  {
    icon: Sparkles,
    title: "Personalized experiences",
    description: "Give your customers conversational, on-brand responses across channels that adapt to their needs and emotions.",
  },
  {
    icon: TrendingUp,
    title: "Scale without strain",
    description: "Easily handle seasonal spikes, flash sales, and promotional campaigns without expanding your support team.",
  },
  {
    icon: Shield,
    title: "Enterprise-grade security",
    description: "SOC 2 compliant with enterprise security standards. Your customer data is protected at every step.",
  },
]

export function Platform() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
              Platform
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em]">
              <span className="italic">Built for</span>
              <br />
              <span className="italic text-white/40">modern retail</span>
            </h2>

            <p className="font-sans text-white/60 leading-relaxed lg:pt-4">
              Launch your AI agent on a platform designed for retail at scale. From DTC brands to enterprise retailers, Lance grows with your business.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {platformFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="border-t border-white/10 pt-8">
                <feature.icon className="w-6 h-6 text-orange-500 mb-4" strokeWidth={1.5} />
                <h3 className="font-sans text-lg font-medium text-white mb-3">{feature.title}</h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 p-8 lg:p-12">
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="font-serif text-2xl md:text-3xl text-white italic mb-4">Seamless integrations</h3>
                <p className="font-sans text-white/50 max-w-lg mx-auto">Connect Lance to your existing tech stack in minutes, not months.</p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {["Shopify", "Salesforce", "Zendesk", "Gorgias", "Klaviyo", "Stripe"].map((integration) => (
                  <div
                    key={integration}
                    className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 font-sans text-sm text-white/60 hover:text-white/80 hover:border-white/20 transition-all"
                  >
                    {integration}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
