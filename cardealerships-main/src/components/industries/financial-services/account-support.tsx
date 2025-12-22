"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Phone, CheckCircle } from "lucide-react"

const benefits = [
  "Handle balance inquiries, transaction history, and account updates instantly",
  "Authenticate customers securely with multi-factor verification",
  "Route complex issues to the right specialist with full context",
]

export function AccountSupport() {
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
                Account Support
              </span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em]">
              <span className="italic">Resolve account inquiries</span>
              <br />
              <span className="italic text-white/40">in seconds, not minutes</span>
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
            Your customers expect immediate answers about their accounts. Lance handles routine inquiries 24/7 while maintaining the security and compliance your institution requires.
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
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2940&auto=format&fit=crop"
              alt="Financial advisor"
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
                  <div className="font-sans text-lg text-white">First National Bank</div>
                  <div className="font-mono text-xs text-white/40 mt-1">Account Services</div>
                  <motion.div
                    className="font-mono text-xs text-orange-400 mt-2"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Connected • 0:32
                  </motion.div>
                </div>

                {/* Conversation */}
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-sans text-white/60">C</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/80">
                        What's my current checking account balance?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                      <p className="font-sans text-sm text-white/90">
                        Your checking account ending in 4829 has a current balance of $12,847.32.
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
