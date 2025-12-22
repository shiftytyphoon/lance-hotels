"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How does Lance integrate with our existing property management system?",
    answer: "Lance offers native integrations with all major PMS platforms including Opera, Protel, Mews, Cloudbeds, and many others. We also connect with your CRS, CRM, and booking engine through secure APIs. Our implementation team handles the technical setup, typically completing integrations within 1-2 weeks. For custom or legacy systems, we provide flexible API options to ensure seamless data flow.",
  },
  {
    question: "Can Lance handle the complexity of hospitality-specific requests?",
    answer: "Absolutely. Lance is purpose-built for travel and hospitality, understanding the nuances of room types, rate codes, package inclusions, loyalty programs, and special requests. It can handle complex multi-room bookings, group reservations, wedding blocks, and corporate accounts. When requests exceed its capabilities or require human judgment, it seamlessly escalates to your team with full context.",
  },
  {
    question: "How does Lance maintain our brand voice and service standards?",
    answer: "During onboarding, we work closely with your team to capture your brand voice, service philosophy, and communication guidelines. Lance is trained on your specific terminology, policies, and preferred responses. You have full control to customize conversation flows, set guardrails, and approve responses before they go live. The result is an AI that sounds and acts like a natural extension of your team.",
  },
  {
    question: "What languages does Lance support for international guests?",
    answer: "Lance communicates fluently in 99+ languages, automatically detecting and responding in each guest's preferred language. This includes real-time translation for voice calls and messages, culturally appropriate responses, and support for regional dialects. Your international guests receive the same high-quality service as native speakers, without any additional configuration.",
  },
  {
    question: "How quickly can we deploy Lance across our properties?",
    answer: "Most properties are live within 2-3 weeks. Our implementation process includes discovery and requirements gathering, system integrations, brand voice customization, team training, and a phased rollout. For enterprise deployments across multiple properties, we develop a tailored timeline that minimizes disruption while ensuring consistency. We provide dedicated support throughout and ongoing optimization based on performance data.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-28 md:py-36 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Section label */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[11px] text-white/50 uppercase tracking-[0.15em]">
              FAQ
            </span>
          </div>

          {/* Big serif headline */}
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1] tracking-[-0.02em]">
            <span className="italic">Frequently Asked</span>
            <br />
            <span className="italic text-white/40">Questions</span>
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border-t border-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-7 flex items-start justify-between text-left gap-4 group"
              >
                <span className={`font-sans text-base transition-colors ${openIndex === index ? "text-white font-medium" : "text-white/70 group-hover:text-white/90"}`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 font-sans text-[15px] text-white/50 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  )
}
