"use client"

import { motion } from "framer-motion"
import { Phone, Bot, Calendar, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Phone,
      title: "Customer Calls",
      description: "A customer calls your dealership. Lance answers instantly — no wait time, no routing.",
    },
    {
      number: "02",
      icon: Bot,
      title: "AI Engages",
      description: "Lance greets the caller naturally, understands their needs, and handles the conversation intelligently.",
    },
    {
      number: "03",
      icon: Calendar,
      title: "Appointment Set",
      description: "Lance checks availability, books the appointment, and sends confirmation — all in real-time.",
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "CRM Updated",
      description: "All details synced to your CRM automatically. Your team sees everything before the customer arrives.",
    },
  ]

  return (
    <section id="how-it-works" className="py-32 px-6 bg-background relative z-10">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest mb-4 block">How It Works</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient mb-6">
            From ring to <i className="font-light">appointment</i>
          </h2>
          <p className="font-mono text-foreground/60 max-w-2xl mx-auto text-lg">
            See how Lance transforms every incoming call into a booked appointment in seconds.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className={`inline-block ${index % 2 === 0 ? "lg:ml-auto" : ""}`}>
                    <span className="font-mono text-5xl font-bold text-primary/20">{step.number}</span>
                    <h3 className="text-2xl font-sentient mt-2 mb-3">{step.title}</h3>
                    <p className="font-mono text-foreground/60 max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center icon */}
                <div className="relative z-10 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <step.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
