"use client"

import { motion } from "framer-motion"

export function Testimonials() {
  const testimonials = [
    {
      quote: "We went from missing 40% of calls to capturing every single lead. The ROI was immediate.",
      author: "Michael Torres",
      role: "General Manager, Bay City Ford",
    },
    {
      quote: "Customers can't tell they're talking to AI. Our satisfaction scores actually went up.",
      author: "Sarah Chen",
      role: "Service Director, Premier Honda",
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
            Trusted by
            <br />
            <span className="text-foreground/40">leading dealerships</span>
          </h2>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <blockquote className="text-2xl md:text-3xl font-sentient leading-snug mb-8">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-mono text-sm text-foreground">{testimonial.author}</div>
                <div className="font-mono text-sm text-foreground/40">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logos placeholder */}
        <motion.div
          className="mt-24 pt-16 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <p className="font-mono text-sm text-foreground/30 mb-8">Integrates with your existing tools</p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {["CDK", "DealerSocket", "Reynolds", "Tekion", "VinSolutions"].map((name) => (
                <div
                  key={name}
                  className="font-mono text-lg text-foreground/20 hover:text-foreground/40 transition-colors"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
