"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What is conversational AI in healthcare?",
    answer: "Conversational AI technology facilitates patient interactions with healthcare organizations through natural language interfaces, including text and voice. By implementing conversational AI solutions, healthcare teams can automate various tasks and requests from patients, such as appointment scheduling, password resets, or prescription refills. This automation allows healthcare organizations to optimize their operations, improve access to care, and enhance the overall patient experience. Conversational AI offers a notable advantage in healthcare by alleviating the burden on healthcare call centers and patient access teams. AI assistants are capable of deflecting and resolving a significant percentage of calls, often exceeding 85%.",
  },
  {
    question: "What is the role of AI in patient experience solutions?",
    answer: "AI plays a crucial role in patient experience by providing 24/7 availability, instant responses, and personalized interactions. It can handle routine inquiries, schedule appointments, provide medication reminders, and offer health information, all while maintaining a consistent and empathetic tone. This leads to reduced wait times, improved satisfaction scores, and better overall patient engagement.",
  },
  {
    question: "How can AI be used in healthcare call centers?",
    answer: "AI in healthcare call centers can handle initial patient inquiries, route calls intelligently based on patient needs, automate appointment scheduling and rescheduling, process prescription refill requests, and provide answers to frequently asked questions. This allows human agents to focus on complex cases requiring empathy and critical thinking, while routine tasks are handled efficiently by AI.",
  },
  {
    question: 'How can conversational AI improve the "digital front door"?',
    answer: "Conversational AI serves as an intelligent entry point to healthcare services, guiding patients to the right resources whether they're seeking information, scheduling appointments, or accessing their health records. It creates a seamless, omnichannel experience across web, mobile, and voice interfaces, making healthcare more accessible and reducing friction in patient journeys.",
  },
  {
    question: "What makes Lance's AI healthcare assistants different from healthcare chatbots?",
    answer: "Unlike traditional rule-based chatbots, Lance uses advanced natural language understanding (NLU) to comprehend patient intent, even when requests are phrased in unexpected ways. Our AI adapts to your organization's specific terminology, integrates deeply with EHR systems like Epic, and provides end-to-end resolution rather than just deflection. We focus on outcomes like completed appointments and resolved inquiries, not just containment rates.",
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
