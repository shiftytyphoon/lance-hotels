"use client"

import { motion } from "framer-motion"

export function WhyUs() {
  const features = [
    {
      number: "01",
      title: "Always Available",
      description: "24/7 coverage. Every call answered on the first ring, even at 2 AM on a holiday.",
    },
    {
      number: "02",
      title: "Instant Booking",
      description: "Appointments scheduled in real-time. Synced directly to your calendar and CRM.",
    },
    {
      number: "03",
      title: "Natural Conversations",
      description: "AI that listens, understands context, and responds like your best employee.",
    },
  ]

  return (
    <section className="py-32 px-6 bg-background relative">
      <div className="container mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-sentient">
            Why dealerships
            <br />
            <span className="text-foreground/40">choose Lance</span>
          </h2>
        </motion.div>

        {/* Features list */}
        <div className="space-y-0">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              className="group border-t border-white/10 py-12 grid md:grid-cols-12 gap-6 items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="md:col-span-1">
                <span className="font-mono text-sm text-primary">{feature.number}</span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-2xl font-sentient group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
              <div className="md:col-span-7">
                <p className="font-mono text-foreground/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
          {/* Bottom border */}
          <div className="border-t border-white/10" />
        </div>

        {/* Stats */}
        <motion.div
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {[
            { value: "98%", label: "Calls answered" },
            { value: "<1s", label: "Response time" },
            { value: "3x", label: "More bookings" },
            { value: "24/7", label: "Availability" },
          ].map((stat, index) => (
            <div key={index} className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-sentient text-primary mb-2">{stat.value}</div>
              <div className="font-mono text-sm text-foreground/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
