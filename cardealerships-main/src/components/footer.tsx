"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { motion } from "framer-motion"

export function Footer() {
  const links = {
    product: [
      { label: "Agent Canvas", href: "#" },
      { label: "Smart Insights", href: "#" },
      { label: "Voice Experience", href: "#" },
      { label: "Security", href: "#" },
    ],
    industries: [
      { label: "Automotive", href: "/automotive" },
      { label: "Retail & Consumer", href: "/retail" },
      { label: "Healthcare", href: "#" },
      { label: "Financial Services", href: "#" },
    ],
    company: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Status", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  }

  return (
    <footer className="bg-white text-black">
      {/* CTA Section */}
      <section className="py-32 lg:py-40 relative overflow-hidden border-t border-black/10">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[150px] opacity-50"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-100 rounded-full blur-[120px] opacity-50"
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left - Headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Section label with orange dot */}
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="font-mono text-[11px] text-black/50 uppercase tracking-[0.15em]">
                  Get a Personalized Demo
                </span>
              </div>

              {/* Big serif headline */}
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-black leading-[1.1] tracking-[-0.02em]">
                <span className="italic">Ready to see Lance</span>
                <br />
                <span className="italic">in action?</span>
              </h2>
            </motion.div>

            {/* Right - Description and CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="lg:pt-8"
            >
              <p className="font-sans text-black/60 leading-relaxed mb-8 max-w-md">
                Lance's AI agents handle complex workflows at scale, from live delivery issues to compliance decisions, while maintaining over 90% resolution accuracy in production.
              </p>
              <Link
                href="https://cal.com/caleb-chan-bmhfcl/lance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-sans text-sm rounded-full hover:bg-black/80 transition-all"
              >
                Talk to us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20 border-t border-black/10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="text-black" />
            <p className="font-sans text-sm text-black/50 mt-4 max-w-xs">
              AI agents for enterprise support. Up and running in two weeks.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-sans text-sm font-medium text-black mb-4">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-black/50 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-sans text-sm font-medium text-black mb-4">Industries</h4>
            <ul className="space-y-3">
              {links.industries.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-black/50 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-sm font-medium text-black mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-black/50 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-sans text-sm font-medium text-black mb-4">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-black/50 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-sm text-black/40">
            © {new Date().getFullYear()} Lance. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="font-sans text-sm text-black/40 hover:text-black transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="font-sans text-sm text-black/40 hover:text-black transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
