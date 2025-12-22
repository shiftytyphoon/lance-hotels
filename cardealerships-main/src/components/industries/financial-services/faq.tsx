"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How does Lance ensure security and compliance for financial services?",
    answer: "Lance is built with bank-grade security from the ground up. We maintain SOC 2 Type II certification, encrypt all data in transit and at rest, and comply with regulations including PCI DSS, GLBA, and state banking regulations. Our platform undergoes regular third-party security audits, and we can sign BAAs for institutions that require them. Customer data is never used to train models and can be deleted on demand.",
  },
  {
    question: "Can Lance integrate with our existing core banking systems?",
    answer: "Yes, Lance integrates with all major core banking platforms including FIS, Fiserv, Jack Henry, and Temenos. We also connect with CRM systems like Salesforce, ticketing systems, and knowledge bases. Our API-first architecture allows for custom integrations with proprietary systems, and our implementation team handles the technical setup.",
  },
  {
    question: "How does Lance handle sensitive financial information?",
    answer: "Lance uses secure authentication protocols to verify customer identity before accessing sensitive information. We support multi-factor authentication, knowledge-based verification, and integration with your existing identity verification systems. Sensitive data like full account numbers are masked in transcripts, and all conversations are logged for compliance and audit purposes.",
  },
  {
    question: "What types of inquiries can Lance handle for banks and credit unions?",
    answer: "Lance handles a wide range of routine banking inquiries including balance checks, transaction history, card services (activation, PIN reset, lost/stolen), payment scheduling, statement requests, branch/ATM locator, product information, and appointment scheduling. For complex issues like disputes or loan modifications, Lance gathers initial information and seamlessly transfers to a human agent with full context.",
  },
  {
    question: "How quickly can we deploy Lance, and what does implementation look like?",
    answer: "Most financial institutions are live within 2-4 weeks. Implementation includes discovery and requirements gathering, integration with your core banking and CRM systems, customization of conversation flows and compliance guardrails, testing and quality assurance, and a phased rollout with monitoring. We provide dedicated support throughout and ongoing optimization based on performance data.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Section label with orange dot */}
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
                className="w-full py-6 flex items-start justify-between text-left gap-4"
              >
                <span className={`font-sans text-base ${openIndex === index ? "text-white font-medium" : "text-white/70"}`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white/50 shrink-0 transition-transform ${
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
                    <p className="pb-6 font-sans text-sm text-white/50 leading-relaxed">
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
