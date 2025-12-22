"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  CircleDotDashed,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: string;
  title: string;
  status: string;
  details: string[];
}

const callSteps: Task[] = [
  {
    id: "1",
    title: "Incoming Call",
    status: "completed",
    details: [
      "Caller: Alex Chen, 29, San Francisco, CA",
      "Dealership: Bay City Auto (Ford)",
      "Previous visit: 2024-09-12 (brake service)",
      "Inquiry: brake issue",
    ],
  },
  {
    id: "2",
    title: "During Call",
    status: "in-progress",
    details: [
      "Caller: 'My brakes squeal when I slow down'",
      "Agent: 'I can schedule a service appointment'",
      "Tone: calm, cooperative",
      "Urgency: medium",
      "Intent: Schedule service appointment",
      "Issue: Brake maintenance",
    ],
  },
  {
    id: "3",
    title: "Post-Call Summary",
    status: "pending",
    details: [
      "Appointment: Tuesday 10:30 AM",
      "Confirmation sent via SMS",
      "Added to training data",
    ],
  },
];

export default function Plan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tasks, setTasks] = useState<Task[]>(callSteps);

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Auto-play through steps
  useEffect(() => {
    if (currentStep < callSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);

        // Update status
        setTasks((prev) =>
          prev.map((task, index) => {
            if (index === currentStep) {
              return { ...task, status: "completed" };
            } else if (index === currentStep + 1) {
              return { ...task, status: "in-progress" };
            }
            return task;
          })
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const taskVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.6,
      },
    },
  };

  const detailsVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const detailItemVariants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -15,
      y: prefersReducedMotion ? 0 : 5,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <div className="bg-transparent text-foreground h-full overflow-auto flex items-center justify-center relative">
      {/* Animated dotted background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(235,184,0,0.12) 1px, transparent 1px)`,
          backgroundSize: '25px 25px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '25px 25px'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div
        className="bg-transparent border-transparent rounded-lg overflow-hidden w-full max-w-lg relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
          }
        }}
      >
        <div className="py-6 px-4 overflow-hidden relative">
          <ul className="space-y-5 overflow-hidden relative">
            {tasks.map((task, index) => {
              const isVisible = currentStep >= index;
              const isConversation = task.title === "During Call";

              // Only animate if this step is just appearing (not already visible)
              const shouldAnimate = currentStep === index;

              if (!isVisible) return null;

              return (
                <motion.li
                  key={task.id}
                  initial={shouldAnimate ? "hidden" : "visible"}
                  animate="visible"
                  variants={taskVariants}
                  className="group"
                >
                  <motion.div
                    className="flex items-start gap-4 px-3 py-2 rounded-lg transition-all duration-300"
                    whileHover={{
                      backgroundColor: "rgba(235,184,0,0.05)",
                      boxShadow: "0 0 20px rgba(235,184,0,0.1)",
                      scale: 1.01,
                    }}
                  >
                    <div className="flex flex-col items-center relative min-h-full">
                      {/* Connecting line to next item */}
                      {index < tasks.length - 1 && currentStep > index && (
                        <motion.div
                          className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#EBB800] to-[#EBB800]/60 shadow-[0_0_8px_rgba(235,184,0,0.4)]"
                          style={{ height: "calc(100% + 0.25rem)" }}
                          initial={{ scaleY: 0, originY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        />
                      )}
                      <motion.div className="flex-shrink-0 pt-1 relative z-10">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={task.status}
                            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              rotate: 0,
                            }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 25,
                            }}
                          >
                            {task.status === "completed" ? (
                              <motion.div
                                animate={{
                                  boxShadow: [
                                    "0 0 0px rgba(235,184,0,0)",
                                    "0 0 15px rgba(235,184,0,0.6)",
                                    "0 0 0px rgba(235,184,0,0)",
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="rounded-full"
                              >
                                <CheckCircle2 className="h-5 w-5 text-[#EBB800]" />
                              </motion.div>
                            ) : task.status === "in-progress" ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                              >
                                <CircleDotDashed className="h-5 w-5 text-[#EBB800]" />
                              </motion.div>
                            ) : (
                              <Circle className="text-[#EBB800]/40 h-5 w-5" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <motion.span
                          className="font-mono text-sm text-foreground font-medium"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {task.title}
                        </motion.span>
                        <motion.span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-mono whitespace-nowrap relative ${
                            task.status === "completed"
                              ? "bg-[#EBB800]/20 text-[#EBB800]"
                              : task.status === "in-progress"
                                ? "bg-[#EBB800]/30 text-[#EBB800]"
                                : "bg-[#EBB800]/10 text-[#EBB800]"
                          }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          transition={{ delay: 0.2 }}
                        >
                          {task.status === "completed" && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-[#EBB800]/30"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut"
                              }}
                            />
                          )}
                          <span className="relative z-10">{task.status}</span>
                        </motion.span>
                      </div>

                      <motion.div
                        className="overflow-hidden"
                        variants={detailsVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <ul className="space-y-1.5 pl-1">
                          {task.details.map((detail, idx) => {
                            const isCallerOrAgent = detail.startsWith("Caller:") || detail.startsWith("Agent:");

                            return (
                              <motion.li
                                key={`${task.id}-detail-${idx}`}
                                variants={detailItemVariants}
                                className="text-xs font-mono text-foreground/70 relative pl-4"
                                whileHover={{
                                  x: 3,
                                  color: "rgba(235,184,0,0.9)",
                                  transition: { duration: 0.2 }
                                }}
                              >
                                <motion.span
                                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#EBB800]/50"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: idx * 0.15 + 0.3 }}
                                />
                                {isCallerOrAgent && isConversation ? (
                                  <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                      delay: idx * 0.3,
                                      duration: 0.5
                                    }}
                                  >
                                    {detail}
                                  </motion.span>
                                ) : (
                                  detail
                                )}
                              </motion.li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
