"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { MobileMenu } from "./mobile-menu"
import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const productLinks = [
  { label: "Inbound", description: "Answer calls, qualify leads, and book appointments.", href: "/inbound" },
  { label: "Outbound", description: "Reminders, follow-ups, and outreach campaigns.", href: "/outbound" },
  { label: "Back Office", description: "Internal workflows and agent-assist tools.", href: "/back-office" },
]

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "/contact" },
]

const industryLinks = [
  { label: "Automotive", description: "Transform dealership operations with AI voice agents for service scheduling and sales.", href: "/automotive" },
  { label: "Healthcare", description: "Improve patient engagement and overcome staffing shortages with HIPAA-compliant AI.", href: "/healthcare" },
  { label: "Financial Services", description: "Build trust, strengthen relationships, and grow lifetime value.", href: "/financial-services" },
  { label: "Retail & Consumer", description: "Boost brand loyalty, drive conversion, and grow lifetime value.", href: "/retail" },
  { label: "Insurance", description: "Streamline claims, improve retention, and reduce costs.", href: "/insurance" },
  { label: "Travel & Hospitality", description: "Drive bookings, build loyalty, and boost revenue.", href: "/travel" },
]

export const Header = () => {
  const [productOpen, setProductOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if scrolled past threshold for background
      setScrolled(currentScrollY > 50)

      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < 100) {
        // Always show at the top
        setVisible(true)
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setVisible(true)
      } else if (currentScrollY > lastScrollY.current + 10) {
        // Scrolling down (with threshold to prevent jitter)
        setVisible(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className="fixed z-50 top-0 left-0 w-full"
      initial={{ y: 0 }}
      animate={{
        y: visible ? 0 : -100,
        backgroundColor: scrolled ? "rgba(20, 20, 20, 0.4)" : "rgba(0,0,0,0)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
      }}
    >
      <nav className={`mx-auto px-6 lg:px-12 flex items-center justify-between transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
        {/* Left - Logo and Nav */}
        <div className="flex items-center gap-10">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0">
            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductOpen(true)}
              onMouseLeave={() => setProductOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 font-sans text-[13px] font-medium text-white/80 hover:text-white transition-colors">
                Product
                <ChevronDown className={`w-3 h-3 transition-transform opacity-60 ${productOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {productOpen && (
                  <motion.div
                    className="absolute top-full left-0 mt-1 w-[480px] py-3 px-3 bg-white rounded-xl shadow-xl border border-black/5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.12 }}
                  >
                    <div className="flex gap-3">
                      {/* Left - Product links */}
                      <div className="flex-1 space-y-0.5">
                        {productLinks.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="group block px-3 py-2.5 rounded-lg hover:bg-black/[0.04] transition-all duration-150"
                          >
                            <div className="font-sans text-[13px] font-medium text-black group-hover:text-orange-600 transition-colors">{link.label}</div>
                            <div className="font-sans text-[11px] text-black/50 mt-0.5 leading-snug">{link.description}</div>
                          </Link>
                        ))}
                      </div>

                      {/* Divider */}
                      <div className="w-px bg-black/10" />

                      {/* Right - Featured box */}
                      <Link
                        href="#"
                        className="group w-[200px] p-4 bg-gradient-to-br from-orange-50 to-orange-100/60 rounded-lg hover:from-orange-100 hover:to-orange-100 transition-all duration-200 flex flex-col"
                      >
                        <div className="font-sans text-[10px] text-orange-600 font-semibold uppercase tracking-wider mb-3">Featured</div>
                        <div className="font-sans text-[15px] font-semibold text-black leading-tight mb-2 group-hover:text-orange-600 transition-colors">Human-like Adaptive Voice</div>
                        <p className="font-sans text-[11px] text-black/50 leading-relaxed mb-4">Conversations that adapt in real-time.</p>
                        <div className="mt-auto h-20 rounded-md bg-white/60 border border-orange-200/50 flex items-center justify-center">
                          <span className="text-[10px] text-black/30">Visual asset</span>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Industry Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIndustryOpen(true)}
              onMouseLeave={() => setIndustryOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 font-sans text-[13px] font-medium text-white/80 hover:text-white transition-colors">
                Industries
                <ChevronDown className={`w-3 h-3 transition-transform opacity-60 ${industryOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {industryOpen && (
                  <motion.div
                    className="absolute top-full left-0 mt-1 w-[420px] py-3 px-2 bg-white rounded-xl shadow-xl border border-black/5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.12 }}
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      {industryLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="group block px-3 py-2.5 rounded-lg hover:bg-black/[0.04] transition-all duration-150"
                        >
                          <div className="font-sans text-[13px] font-medium text-black group-hover:text-orange-600 transition-colors">{link.label}</div>
                          <div className="font-sans text-[11px] text-black/50 mt-0.5 leading-snug">{link.description}</div>
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
              className="px-4 py-2 font-sans text-[13px] font-medium text-white/80 hover:text-white transition-colors"
            >
              Customers
            </Link>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 font-sans text-[13px] font-medium text-white/80 hover:text-white transition-colors">
                Company
                <ChevronDown className={`w-3 h-3 transition-transform opacity-60 ${companyOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {companyOpen && (
                  <motion.div
                    className="absolute top-full left-0 mt-1 w-40 py-2 px-2 bg-white rounded-xl shadow-xl border border-black/5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.12 }}
                  >
                    {companyLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="group block px-3 py-2 rounded-lg font-sans text-[13px] text-black hover:bg-black/[0.04] hover:text-orange-600 transition-all duration-150"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right - CTA */}
        <div className="hidden lg:flex items-center gap-5">
          <Link
            href="/signin"
            className="font-sans text-[13px] font-medium text-white/80 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="https://cal.com/caleb-chan-bmhfcl/lance"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-white text-[#111] font-sans text-[12px] font-medium rounded-full hover:bg-white/95 transition-colors"
          >
            Talk to us
          </Link>
        </div>

        <MobileMenu />
      </nav>
    </motion.header>
  )
}
