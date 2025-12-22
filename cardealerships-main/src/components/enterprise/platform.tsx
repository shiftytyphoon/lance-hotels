"use client"

import { motion } from "framer-motion"
import { LayoutGrid } from "lucide-react"

export function Platform() {
  return (
    <section id="platform" className="py-32 px-6 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <LayoutGrid className="w-5 h-5 text-primary" />
              <span className="font-sentient text-xl">Agent Canvas</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-sentient mb-6 text-foreground/80">
              The fastest way to build, govern, and scale enterprise AI agents.
            </h2>
            <ul className="space-y-4">
              {[
                "Visual workflow builder for complex conversation flows",
                "Real-time analytics and call monitoring",
                "A/B testing for response optimization",
                "Role-based access control and audit logs",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 font-mono text-sm text-foreground/50"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right - Platform preview mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/5 rounded-md px-3 py-1.5 text-center">
                    <span className="font-mono text-xs text-foreground/30">app.lance.ai/canvas</span>
                  </div>
                </div>
              </div>

              {/* App content */}
              <div className="p-6 min-h-[400px] bg-gradient-to-br from-black to-black/90">
                {/* Sidebar */}
                <div className="flex gap-6">
                  <div className="w-48 space-y-2">
                    <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="font-mono text-xs text-primary">Workflows</span>
                    </div>
                    <div className="px-3 py-2 rounded-lg">
                      <span className="font-mono text-xs text-foreground/40">Analytics</span>
                    </div>
                    <div className="px-3 py-2 rounded-lg">
                      <span className="font-mono text-xs text-foreground/40">Integrations</span>
                    </div>
                    <div className="px-3 py-2 rounded-lg">
                      <span className="font-mono text-xs text-foreground/40">Settings</span>
                    </div>
                  </div>

                  {/* Canvas area */}
                  <div className="flex-1 relative">
                    {/* Flow nodes */}
                    <div className="absolute top-0 left-0 w-32 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="font-mono text-[10px] text-foreground/40 mb-1">START</div>
                      <div className="font-mono text-xs text-foreground/70">Incoming Call</div>
                    </div>

                    <div className="absolute top-20 left-40 w-40 p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="font-mono text-[10px] text-primary mb-1">AI AGENT</div>
                      <div className="font-mono text-xs text-foreground/70">Greeting & Intent</div>
                    </div>

                    <div className="absolute top-44 left-16 w-36 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="font-mono text-[10px] text-foreground/40 mb-1">CONDITION</div>
                      <div className="font-mono text-xs text-foreground/70">Route by intent</div>
                    </div>

                    <div className="absolute top-44 left-60 w-36 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="font-mono text-[10px] text-green-400 mb-1">ACTION</div>
                      <div className="font-mono text-xs text-foreground/70">Book appointment</div>
                    </div>

                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                      <path d="M 96 48 L 160 80" stroke="rgba(255,199,0,0.3)" strokeWidth="2" fill="none" />
                      <path d="M 200 120 L 100 176" stroke="rgba(255,199,0,0.3)" strokeWidth="2" fill="none" />
                      <path d="M 200 120 L 280 176" stroke="rgba(255,199,0,0.3)" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-primary/10 blur-[80px] rounded-full -z-10 opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
