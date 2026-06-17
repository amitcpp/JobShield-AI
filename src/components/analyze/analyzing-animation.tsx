"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const SCANNING_STEPS = [
  "Checking for urgency language...",
  "Scanning for payment requests...",
  "Verifying company details...",
  "Detecting scam patterns...",
  "Generating report...",
];

interface AnalyzingAnimationProps {
  isVisible: boolean;
}

export function AnalyzingAnimation({ isVisible }: AnalyzingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % SCANNING_STEPS.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-8 p-8"
          >
            {/* Shield with pulse rings */}
            <div className="relative flex items-center justify-center">
              {/* Outer pulse ring */}
              <motion.div
                className="absolute h-32 w-32 rounded-full border border-indigo-500/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Middle pulse ring */}
              <motion.div
                className="absolute h-28 w-28 rounded-full border border-violet-500/30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />

              {/* Glow background */}
              <motion.div
                className="absolute h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/20"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Shield icon */}
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ShieldCheck className="h-14 w-14 text-indigo-400" />
              </motion.div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Analyzing your content...
              </h3>
              <p className="text-sm text-slate-400">
                Our AI is scanning for scam indicators
              </p>
            </div>

            {/* Scanning line */}
            <div className="w-64 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                animate={{
                  x: ["-100%", "300%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Cycling status text */}
            <div className="h-6 relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-indigo-300/80 font-medium"
                >
                  {SCANNING_STEPS[currentStep]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {SCANNING_STEPS.map((_, index) => (
                <motion.div
                  key={index}
                  className="h-1.5 w-1.5 rounded-full"
                  animate={{
                    backgroundColor:
                      index === currentStep
                        ? "rgb(129, 140, 248)"
                        : "rgba(148, 163, 184, 0.3)",
                    scale: index === currentStep ? 1.4 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
