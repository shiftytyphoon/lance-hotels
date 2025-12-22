"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Phone, CheckCircle } from "lucide-react"

const benefits = [
  "Automatically resolve or deflect over 65% of incoming calls",
  "Free up your staff to deal with complex cases",
  "Reduce patient friction and eliminate long wait times",
]

export function CallCenter() {
  return (
    <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[800px]">
        {/* Left side - Content */}
        <div className="relative z-10 px-6 lg:px-12 xl:px-20 py-20 lg:py-32">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Section label with orange dot */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
                Call Center Automation
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em]">
              <span className="italic">Leave the repetitive</span>
              <br />
              <span className="italic text-white/40">calls to us</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-white/60 leading-relaxed mb-8 max-w-md"
          >
            Patient access teams are overwhelmed and overworked with routine calls flooding their call centers. Route smarter, resolve faster and prevent burnout with call center automation.
          </motion.p>

          {/* Benefits list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-10"
          >
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="font-sans text-sm text-white/80">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="https://cal.com/caleb-chan-bmhfcl/lance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-sans text-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              Book a demo
            </Link>
          </motion.div>
        </div>

        {/* Right side - Image + Phone mockup */}
        <div className="relative">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2940&auto=format&fit=crop"
              alt="Healthcare professional on phone"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 p-8 lg:p-12 flex items-center justify-center min-h-[600px]"
          >
            <div className="w-full max-w-sm bg-[#1a1a1a]/90 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
              {/* Phone notch */}
              <div className="flex justify-center pt-2">
                <div className="w-24 h-6 bg-black rounded-b-2xl" />
              </div>

              {/* Phone content */}
              <div className="p-6">
                {/* Call header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500/30 to-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
                    <Phone className="w-7 h-7 text-orange-400" />
                  </div>
                  <div className="font-sans text-lg text-white">Mercy Health System</div>
                  <div className="font-mono text-xs text-white/40 mt-1">Patient Services</div>
                  <motion.div
                    className="font-mono text-xs text-orange-400 mt-2"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Connected • 1:23
                  </motion.div>
                </div>

                {/* Conversation */}
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-sans text-white/60">P</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/80">
                        I need to schedule an appointment with Dr. Martinez
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/90">
                        I can help with that. Dr. Martinez has availability Thursday at 2 PM or Friday at 10 AM.
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-sans text-orange-400">AI</span>
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
