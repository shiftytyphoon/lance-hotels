"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export function Industries() {
  const industries = [
    {
      name: "Automotive",
      description: "Dealership reception, service scheduling, and sales support.",
      href: "/automotive",
      highlight: true,
    },
    {
      name: "Healthcare",
      description: "Patient scheduling, prescription refills, and care coordination.",
      href: "/healthcare",
    },
    {
      name: "Financial Services",
      description: "Account support, fraud detection, and transaction assistance.",
      href: "/financial-services",
    },
    {
      name: "Travel & Hospitality",
      description: "Reservations, concierge services, and booking modifications.",
      href: "/travel",
    },
    {
      name: "Retail",
      description: "Order status, returns processing, and product inquiries.",
      href: "/retail",
    },
    {
      name: "Telecommunications",
      description: "Technical support, plan changes, and billing inquiries.",
      href: "/telecommunications",
    },
  ]

  return (
    <section className="py-32 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-sentient mb-4">
            Industries
          </h2>
          <p className="font-mono text-foreground/50 max-w-xl">
            A new way to delight and support your customers, subscribers, patients, and clients.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={industry.href}
                className={`group block p-8 rounded-2xl border transition-all duration-300 h-full ${
                  industry.highlight
                    ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-xl font-sentient ${industry.highlight ? "text-primary" : ""}`}>
                    {industry.name}
                  </h3>
                  <ArrowUpRight className={`w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    industry.highlight ? "text-primary" : "text-foreground/30"
                  }`} />
                </div>
                <p className="font-mono text-sm text-foreground/50">{industry.description}</p>
                {industry.highlight && (
                  <div className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-primary">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Available now
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
