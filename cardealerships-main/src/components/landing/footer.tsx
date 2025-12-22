"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  const links = {
    product: [
      { label: "Execution Engine", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Platform", href: "#" },
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
    <footer className="bg-white text-black border-t border-black/10">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="text-black" />
            <p className="font-sans text-sm text-black/50 mt-4 max-w-xs">
              AI that runs revenue execution automatically. Close the loop between signal and outcome.
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
