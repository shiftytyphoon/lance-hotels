'use client'

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function AboutPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Hero Section with Mountain Background */}
      <section ref={heroRef} className="relative h-screen flex flex-col overflow-hidden">
        {/* Background Image with parallax */}
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ y: backgroundY }}
        >
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop"
            alt="Mountains"
            fill
            className="object-cover object-center scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
        </motion.div>

        {/* Cloud/fog layer */}
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] z-[1] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center"
          style={{ y: textY, opacity }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-[42px] sm:text-[56px] md:text-[68px] lg:text-[80px] text-white leading-[1.05] tracking-[-0.02em]"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-sans text-[15px] md:text-[17px] text-white/50 max-w-xl"
          >
            Building the future of enterprise voice AI
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 -mt-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/[0.02] backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/[0.05]"
          >
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Lance builds advanced voice agents that operate with human-level reasoning, speed, and reliability. We focus on voice systems that can listen, interpret intent, manage ambiguity, and execute multi-step workflows without relying on scripts.
            </p>
            <p className="mt-6 text-white/50 text-lg leading-relaxed">
              Our agents integrate directly with enterprise systems, follow policy constraints, and make decisions in real time. The result is consistent, high-quality operations at scale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="px-6 lg:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[16/10] rounded-3xl overflow-hidden"
          >
            <Image
              src="/team-photo.jpg"
              alt="Caleb Chan and Gatik Trivedi - Lance Founders"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-[36px] sm:text-[44px] text-white leading-[1.15] tracking-[-0.02em] mb-12">
              Our Story
            </h2>

            <div className="space-y-8 text-white/60 text-[17px] leading-[1.8]">
              <p>
                Lance was founded by <span className="text-white">Caleb Chan</span> and <span className="text-white">Gatik Trivedi</span>, two engineers with deep experience in AI research, enterprise automation, and human-like voice systems.
              </p>

              <p>
                Before building Lance, we spent years inside organizations where latency, accuracy, and reliability were non-negotiable.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 py-4">
                {[
                  "Google — NotebookLM and multi-speaker voice reasoning",
                  "Tesla & MongoDB — Large-scale, fault-tolerant software",
                  "Salesforce — ML-driven automation and data infrastructure",
                  "Pfizer, Kaiser & Domo — Regulated, high-compliance environments",
                  "UC Berkeley — AI and systems research",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-[14px] text-white/70">{item}</span>
                  </motion.div>
                ))}
              </div>

              <p>
                Across these environments, we kept seeing the same operational bottleneck. Even with modern software, critical workflows still relied on human conversation—clarifying instructions, gathering context, resolving confusion, coordinating between systems, and following through.
              </p>

              <p className="text-white/80">
                We started Lance to address this directly.
              </p>

              <p>
                Our team specializes in building voice models that behave like real humans. These agents track context across steps, correct themselves, adjust to tone shifts, and handle off-pattern situations the way an experienced operator would.
              </p>

              <p>
                Since launching, Lance has been trusted by teams that manage thousands of conversations a day. Every deployment strengthens our system&apos;s ability to reason, adapt, and support mission-critical operations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-[36px] sm:text-[44px] text-white leading-[1.15] tracking-[-0.02em] mb-16 text-center"
          >
            Meet the Founders
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Caleb */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group"
            >
              <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl p-8 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-orange-500/30 transition-all duration-300">
                    <Image
                      src="/caleb.png"
                      alt="Caleb Chan"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-1">Caleb Chan</h3>
                  <p className="text-orange-500 text-sm font-medium mb-6">Co-founder & CEO</p>

                  {/* Company Logos */}
                  <div className="flex items-center justify-center gap-5 mb-6">
                    {/* Google */}
                    <div className="text-white/30 hover:text-white/50 transition-colors">
                      <svg className="h-5 w-auto" viewBox="0 0 74 24" fill="currentColor">
                        <path d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z"/>
                        <path d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
                        <path d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54 0 2.02-1.36 3.5-3.1 3.5z"/>
                        <path d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
                        <path d="M58 .24h2.51v17.57H58z"/>
                        <path d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z"/>
                      </svg>
                    </div>
                    {/* Salesforce */}
                    <div className="text-white/30 hover:text-white/50 transition-colors">
                      <svg className="h-5 w-auto" viewBox="0 0 50 35" fill="currentColor">
                        <path d="M20.85 8.55c1.45-1.5 3.45-2.45 5.65-2.45 2.85 0 5.35 1.5 6.75 3.75 1.25-.55 2.6-.85 4.05-.85 5.65 0 10.25 4.6 10.25 10.25S42.95 29.5 37.3 29.5c-.8 0-1.6-.1-2.35-.25-1.25 2.05-3.5 3.4-6.05 3.4-1.25 0-2.45-.35-3.45-.9-1.3 2.25-3.75 3.75-6.55 3.75-3.05 0-5.7-1.8-6.9-4.45-.6.1-1.2.2-1.85.2-5.6 0-10.15-4.55-10.15-10.15s4.55-10.15 10.15-10.15c1.6 0 3.15.35 4.5 1.05 1.4-2.1 3.8-3.5 6.5-3.5h-.3z"/>
                      </svg>
                    </div>
                    {/* Tesla */}
                    <div className="text-white/30 hover:text-white/50 transition-colors">
                      <svg className="h-5 w-auto" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M50 0C35 0 22 4 12 10l4 8c8-5 19-8 34-8s26 3 34 8l4-8C78 4 65 0 50 0zm0 18c-13 0-24 2-32 6l4 8c6-3 15-5 28-5s22 2 28 5l4-8c-8-4-19-6-32-6zm-4 14h8v68h-8V32z"/>
                      </svg>
                    </div>
                  </div>

                  <Link
                    href="https://www.linkedin.com/in/caleb-chan-327b14239/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Connect on LinkedIn
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Gatik */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group"
            >
              <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl p-8 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-orange-500/30 transition-all duration-300">
                    <Image
                      src="/gatik.png"
                      alt="Gatik Trivedi"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-1">Gatik Trivedi</h3>
                  <p className="text-orange-500 text-sm font-medium mb-6">Co-founder & CTO</p>

                  {/* Company Logos */}
                  <div className="flex items-center justify-center gap-5 mb-6">
                    {/* Pfizer */}
                    <div className="text-white/30 hover:text-white/50 transition-colors">
                      <span className="font-sans text-[13px] font-bold tracking-tight">Pfizer</span>
                    </div>
                    {/* MongoDB */}
                    <div className="text-white/30 hover:text-white/50 transition-colors">
                      <span className="font-sans text-[12px] font-bold">MongoDB</span>
                    </div>
                    {/* Kaiser */}
                    <div className="text-white/30 hover:text-white/50 transition-colors">
                      <span className="font-sans text-[11px] font-bold">KAISER</span>
                    </div>
                  </div>

                  <Link
                    href="https://www.linkedin.com/in/gatik-trivedi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Connect on LinkedIn
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Teams Choose Lance */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-[36px] sm:text-[44px] text-white leading-[1.15] tracking-[-0.02em] mb-16 text-center"
          >
            Why Teams Choose Lance
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Research Foundations",
                description: "Founded by engineers with backgrounds in AI research and high-stakes enterprise systems"
              },
              {
                title: "Optimized Voice Models",
                description: "Voice models built for reasoning, accuracy, and graceful recovery from errors"
              },
              {
                title: "Real-time Decisions",
                description: "Decision-making that works inside complex, multi-step workflows"
              },
              {
                title: "Proven Performance",
                description: "Battle-tested in environments where consistency and reliability matter"
              },
              {
                title: "Engineering-First",
                description: "An approach grounded in research and engineering, not scripts"
              },
              {
                title: "Enterprise Ready",
                description: "Built for teams managing thousands of conversations daily"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-orange-500/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mb-4 group-hover:scale-125 transition-transform" />
                <h3 className="font-sans text-white text-[15px] font-medium mb-2">{item.title}</h3>
                <p className="text-white/50 text-[14px] leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-[36px] sm:text-[48px] text-white leading-[1.1] tracking-[-0.02em] mb-6">
              Ready to transform
              <br />
              your operations?
            </h2>
            <p className="text-white/40 text-[15px] mb-10 max-w-md mx-auto">
              See how Lance can help your team handle thousands of conversations with human-level quality.
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="https://cal.com/caleb-chan-bmhfcl/lance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#111] font-sans text-[14px] font-medium rounded-full hover:bg-white/90 transition-colors"
              >
                Book a demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
