"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, ScanSearch, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: ClipboardPaste,
    title: "Paste Your Content",
    description:
      "Copy and paste suspicious job emails, WhatsApp messages, LinkedIn DMs, or any job-related content.",
    step: "01",
  },
  {
    icon: ScanSearch,
    title: "AI Analyzes It",
    description:
      "Our AI engine scans for 50+ scam indicators including urgency tactics, payment demands, and fake patterns.",
    step: "02",
  },
  {
    icon: ShieldCheck,
    title: "Get Your Report",
    description:
      "Receive a detailed risk assessment with red flags, category breakdowns, and actionable recommendations.",
    step: "03",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to verify any job opportunity.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-500/50 via-violet-500/50 to-indigo-500/50" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative text-center"
            >
              {/* Step number */}
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20" />
                <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold z-10">
                  {step.step}
                </div>
                <step.icon className="w-12 h-12 text-indigo-400" />
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
