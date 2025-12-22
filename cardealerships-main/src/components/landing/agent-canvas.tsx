"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { LayoutGrid } from "lucide-react"

export function AgentCanvas() {
  const steps = [
    {
      title: "Connect data sources",
      description: "Integrate your CRM, support platform, product analytics, and marketing tools. Lance starts ingesting signals immediately.",
    },
    {
      title: "Define triggers",
      description: "Set thresholds for engagement drops, buying intent, and churn risk. Configure how Lance should respond to each scenario.",
    },
    {
      title: "Configure actions",
      description: "Map automated workflows for re-engagement, outbound campaigns, and account escalations. Customize messaging and approval rules.",
    },
    {
      title: "Monitor and refine",
      description: "Track performance metrics, review actions, and adjust thresholds based on results. Lance improves as it learns from your team.",
    },
  ]

  return (
    <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Ambient glow effects - very subtle */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />

      <div className="grid lg:grid-cols-2 min-h-[800px]">
        {/* Left side - Content */}
        <div className="relative z-10 px-6 lg:px-12 xl:px-20 py-20 lg:py-32">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <LayoutGrid className="w-5 h-5 text-white/60" />
              <span className="font-sans text-xl font-medium">How it works</span>
            </div>
            <p className="font-sans text-white/60 text-[15px] max-w-md leading-relaxed">
              Lance connects to your existing tools and starts executing on revenue opportunities. Setup takes less than an hour.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <Link
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-sans text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              View integration docs
            </Link>
          </motion.div>

          {/* Steps */}
          <div className="space-y-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-t border-white/10 pt-6"
              >
                <h3 className="font-sans text-base font-medium text-white mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Image + UI Preview */}
        <div className="relative">
          {/* Background mountain image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop"
              alt="Mountains"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          </div>

          {/* Floating UI mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 p-8 lg:p-12 flex items-center justify-center min-h-[600px]"
          >
            <div className="w-full max-w-lg bg-[#1a1a1a]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Window header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
                  <span className="font-mono text-xs text-white/60">Revenue execution dashboard</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="font-sans text-sm text-white mb-4">Active workflows</div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="font-mono text-xs text-white/60">Re-engagement campaign</span>
                      </div>
                      <span className="font-mono text-xs text-green-400">Active</span>
                    </div>
                    <div className="font-mono text-xs text-white/40">
                      24 accounts matched • 18 emails sent
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="font-mono text-xs text-white/60">High-intent outbound</span>
                      </div>
                      <span className="font-mono text-xs text-blue-400">Running</span>
                    </div>
                    <div className="font-mono text-xs text-white/40">
                      12 qualified leads • 8 contacted
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <span className="font-mono text-xs text-white/60">Churn prevention</span>
                      </div>
                      <span className="font-mono text-xs text-orange-400">Pending</span>
                    </div>
                    <div className="font-mono text-xs text-white/40">
                      3 at-risk accounts • Review required
                    </div>
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
