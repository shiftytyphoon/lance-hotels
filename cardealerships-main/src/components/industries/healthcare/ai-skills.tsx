"use client"

import { motion } from "framer-motion"
import {
  Search,
  Calendar,
  Pill,
  CreditCard,
  ArrowRight,
  FileText,
  HelpCircle,
  MessageSquare,
  Globe
} from "lucide-react"

const skills = [
  {
    icon: Search,
    title: "Physician Search",
    description: "Patients can find doctors easily, with multiple attributes, in their own natural language.",
  },
  {
    icon: Calendar,
    title: "Scheduling Management",
    description: "Patients can book, reschedule and cancel appointments with physicians, 24/7.",
  },
  {
    icon: Pill,
    title: "Prescription Support",
    description: "Patients can automatically refill prescriptions and get immediate access to pharmaceutical information.",
  },
  {
    icon: CreditCard,
    title: "Billing and Registration",
    description: "Patients can generate invoices and get immediate information on insurance claims.",
  },
  {
    icon: ArrowRight,
    title: "Smart Routing",
    description: "Teams can route complex cases to the right agent automatically while resolving routine cases.",
  },
  {
    icon: FileText,
    title: "Form Filling",
    description: "Teams can reduce time on form management and allow easy filling during an online chat.",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    description: "Patients can get the most up-to-date answers to their most frequently asked questions at any time.",
  },
  {
    icon: MessageSquare,
    title: "Call-to-Text (SMS Deflection)",
    description: "Teams can deflect repetitive tasks from call centers to SMS and provide faster response.",
  },
  {
    icon: Globe,
    title: "Site Search",
    description: "Teams can simplify site search for patients and provide a better conversational experience.",
  },
]

export function AISkills() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
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
              AI Skills for Healthcare
            </span>
          </div>

          {/* Big serif headline */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em]">
            <span className="italic">Leverage conversational AI to</span>
            <br />
            <span className="italic text-white/40">automate critical routine tasks</span>
          </h2>
        </motion.div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="p-6 rounded-2xl bg-[#111] border border-white/10 hover:border-orange-500/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-colors">
                <skill.icon className="w-5 h-5 text-white/60 group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="font-sans text-base font-medium text-white mb-2">
                {skill.title}
              </h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
