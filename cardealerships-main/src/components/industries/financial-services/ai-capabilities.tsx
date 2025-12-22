"use client"

import { motion } from "framer-motion"
import {
  Wallet,
  CreditCard,
  FileText,
  ArrowRightLeft,
  Lock,
  HelpCircle,
  Calendar,
  Bell,
  Calculator
} from "lucide-react"

const capabilities = [
  {
    icon: Wallet,
    title: "Balance Inquiries",
    description: "Customers can check account balances, available credit, and pending transactions instantly.",
  },
  {
    icon: CreditCard,
    title: "Card Services",
    description: "Handle card activation, PIN resets, limit increases, and lost/stolen card reports.",
  },
  {
    icon: ArrowRightLeft,
    title: "Transfer Assistance",
    description: "Guide customers through wire transfers, ACH payments, and internal account transfers.",
  },
  {
    icon: FileText,
    title: "Statement Requests",
    description: "Generate and send account statements, tax documents, and transaction histories.",
  },
  {
    icon: Lock,
    title: "Security Verification",
    description: "Multi-factor authentication and identity verification for sensitive transactions.",
  },
  {
    icon: Calculator,
    title: "Loan Inquiries",
    description: "Provide loan status updates, payment information, and payoff quotes.",
  },
  {
    icon: HelpCircle,
    title: "Product Information",
    description: "Answer questions about rates, fees, and features of banking products.",
  },
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description: "Book meetings with bankers, advisors, and loan officers based on availability.",
  },
  {
    icon: Bell,
    title: "Alert Management",
    description: "Set up and modify account alerts for transactions, balances, and due dates.",
  },
]

export function AICapabilities() {
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
              AI Capabilities
            </span>
          </div>

          {/* Big serif headline */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-[-0.02em]">
            <span className="italic">Automate routine banking tasks</span>
            <br />
            <span className="italic text-white/40">with enterprise-grade AI</span>
          </h2>
        </motion.div>

        {/* Capabilities grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="p-6 rounded-2xl bg-[#111] border border-white/10 hover:border-orange-500/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-colors">
                <capability.icon className="w-5 h-5 text-white/60 group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="font-sans text-base font-medium text-white mb-2">
                {capability.title}
              </h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                {capability.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
