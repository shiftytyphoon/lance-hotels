"use client"

import { motion } from "framer-motion"
import { Phone, Calendar, MessageSquare, CheckCircle2 } from "lucide-react"

export function Showcase() {
  return (
    <section className="py-32 px-6 bg-background relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto max-w-6xl relative">
        {/* Section header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient">
            See it in action
          </h2>
        </motion.div>

        {/* Main showcase - Phone mockup with conversation */}
        <div className="relative max-w-lg mx-auto">
          {/* Glow effect behind phone */}
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75" />

          {/* Phone frame */}
          <motion.div
            className="relative bg-[#0a0a0a] rounded-[3rem] p-3 border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0a0a0a] rounded-b-2xl z-10" />

            {/* Screen */}
            <div className="bg-black rounded-[2.5rem] overflow-hidden">
              {/* Status bar */}
              <div className="flex justify-between items-center px-8 py-3 text-xs font-mono text-white/50">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 border border-white/50 rounded-sm">
                    <div className="w-3/4 h-full bg-white/50 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Call interface */}
              <div className="px-6 pt-8 pb-12">
                {/* Caller info */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <div className="font-sentient text-xl text-white">Bay City Ford</div>
                  <div className="font-mono text-sm text-white/40 mt-1">Service Department</div>
                  <motion.div
                    className="font-mono text-xs text-primary mt-2"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Connected • 0:47
                  </motion.div>
                </div>

                {/* Live transcript */}
                <div className="space-y-4 mb-8">
                  <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-mono text-white/60">C</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                      <p className="font-mono text-sm text-white/80">
                        Hi, I need to schedule an oil change for my F-150
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-3 justify-end"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                      <p className="font-mono text-sm text-white/90">
                        I'd be happy to help! I have availability tomorrow at 10 AM or Thursday at 2 PM. Which works better?
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-mono text-primary">AI</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-mono text-white/60">C</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                      <p className="font-mono text-sm text-white/80">
                        Tomorrow at 10 works perfectly
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-3 justify-end"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                      <p className="font-mono text-sm text-white/90">
                        You're all set for tomorrow at 10 AM. I'll send a confirmation to your phone. Anything else I can help with?
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-mono text-primary">AI</span>
                    </div>
                  </motion.div>
                </div>

                {/* Call actions */}
                <div className="flex justify-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white/60" />
                  </div>
                  <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white rotate-[135deg]" />
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white/60" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating cards around phone */}
          <motion.div
            className="absolute -left-20 top-1/4 hidden lg:block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="font-mono text-xs text-white/50">Appointment</div>
                  <div className="font-sentient text-sm text-white">Confirmed</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-16 top-1/3 hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-xs text-white/50">Tomorrow</div>
                  <div className="font-sentient text-sm text-white">10:00 AM</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-24 bottom-1/4 hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="font-mono text-xs text-white/50 mb-1">CRM Updated</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="font-mono text-xs text-green-400">Synced to CDK</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
