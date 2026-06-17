"use client";

import { motion } from "framer-motion";
import { Brain, Zap, FileStack, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced Gemini AI scans for 50+ scam indicators including fake urgency, payment requests, and suspicious patterns.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get a comprehensive scam analysis report with risk scores, red flags, and recommendations in seconds.",
  },
  {
    icon: FileStack,
    title: "Multi-Format Support",
    description:
      "Analyze emails, WhatsApp messages, LinkedIn DMs, job descriptions, and offer letters — all in one place.",
  },
  {
    icon: BarChart3,
    title: "Detailed Reports",
    description:
      "Receive red flags, category breakdowns, risk scores, and actionable safety recommendations.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Stay Safe</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful AI tools designed to protect job seekers from increasingly
            sophisticated scams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 mb-5">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
