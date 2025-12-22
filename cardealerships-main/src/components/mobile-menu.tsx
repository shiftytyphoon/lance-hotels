"use client"

import { cn } from "@/lib/utils"
import * as Dialog from "@radix-ui/react-dialog"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Logo } from "./logo"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuProps {
  className?: string
}

const productLinks = [
  { label: "Inbound", description: "Answer calls, qualify leads, and book appointments.", href: "#" },
  { label: "Outbound", description: "Reminders, follow-ups, and outreach campaigns.", href: "#" },
  { label: "Back Office", description: "Internal workflows and agent-assist tools.", href: "#" },
]

const industryLinks = [
  { label: "Automotive", description: "AI voice agents for dealerships", href: "/automotive" },
  { label: "Healthcare", description: "HIPAA-compliant patient engagement", href: "/healthcare" },
  { label: "Financial Services", description: "Secure, compliant AI support", href: "/financial-services" },
  { label: "Retail & Consumer", description: "Personalized customer service", href: "/retail" },
  { label: "Insurance", description: "Claims and policy assistance", href: "/insurance" },
  { label: "Travel & Hospitality", description: "Booking and guest services", href: "/travel" },
]

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "/contact" },
]

export const MobileMenu = ({ className }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)

  const handleLinkClick = () => {
    setIsOpen(false)
    setProductOpen(false)
    setIndustryOpen(false)
    setCompanyOpen(false)
  }

  return (
    <Dialog.Root modal={false} open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        setProductOpen(false)
        setIndustryOpen(false)
        setCompanyOpen(false)
      }
    }}>
      <Dialog.Trigger asChild>
        <button
          className={cn("lg:hidden p-2 text-white transition-colors", className)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content className="fixed inset-0 z-50 bg-[#141414]/40 backdrop-blur-2xl overflow-y-auto" style={{ WebkitBackdropFilter: "blur(40px)" }}>
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <Link href="/" onClick={handleLinkClick}>
              <Logo />
            </Link>
            <Dialog.Close asChild>
              <button className="p-2 text-white/80 hover:text-white transition-colors" aria-label="Close menu">
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          {/* Navigation */}
          <nav className="px-6 pt-4 pb-8">
            {/* Product Accordion */}
            <div className="border-b border-white/[0.08]">
              <button
                onClick={() => setProductOpen(!productOpen)}
                className="w-full flex items-center justify-between py-4 text-white/80 font-sans text-[15px] font-medium"
              >
                Product
                <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${productOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {productOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 space-y-1">
                      {productLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={handleLinkClick}
                          className="block px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="font-sans text-[14px] text-white/90">{link.label}</div>
                          <div className="font-sans text-[12px] text-white/40 mt-0.5">{link.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Industries Accordion */}
            <div className="border-b border-white/[0.08]">
              <button
                onClick={() => setIndustryOpen(!industryOpen)}
                className="w-full flex items-center justify-between py-4 text-white/80 font-sans text-[15px] font-medium"
              >
                Industries
                <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${industryOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {industryOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 space-y-1">
                      {industryLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={handleLinkClick}
                          className="block px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="font-sans text-[14px] text-white/90">{link.label}</div>
                          <div className="font-sans text-[12px] text-white/40 mt-0.5">{link.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Customers */}
            <Link
              href="#"
              onClick={handleLinkClick}
              className="block py-4 text-white/80 font-sans text-[15px] font-medium border-b border-white/[0.08]"
            >
              Customers
            </Link>

            {/* Company Accordion */}
            <div className="border-b border-white/[0.08]">
              <button
                onClick={() => setCompanyOpen(!companyOpen)}
                className="w-full flex items-center justify-between py-4 text-white/80 font-sans text-[15px] font-medium"
              >
                Company
                <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${companyOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {companyOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 space-y-1">
                      {companyLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={handleLinkClick}
                          className="block px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors font-sans text-[14px] text-white/90"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTAs */}
            <div className="mt-8 space-y-3">
              <Link
                href="/signin"
                onClick={handleLinkClick}
                className="block text-center py-3 text-white/80 font-sans text-[14px] font-medium hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="https://cal.com/caleb-chan-bmhfcl/lance"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="block text-center py-3 bg-white text-[#111] font-sans text-[13px] font-medium rounded-full hover:bg-white/95 transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
