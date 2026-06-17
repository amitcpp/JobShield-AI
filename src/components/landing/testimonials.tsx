"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Fresh Graduate",
    initials: "PS",
    gradient: "from-pink-500 to-rose-500",
    quote:
      "JobShield saved me from paying ₹5000 to a fake Google recruiter. The analysis caught every red flag instantly!",
  },
  {
    name: "Rahul Patel",
    role: "Software Engineer",
    initials: "RP",
    gradient: "from-indigo-500 to-cyan-500",
    quote:
      "I use this for every job offer I receive. It correctly identified a legitimate Razorpay offer as safe. Incredibly accurate.",
  },
  {
    name: "Ananya Gupta",
    role: "MBA Student",
    initials: "AG",
    gradient: "from-violet-500 to-purple-500",
    quote:
      "Got a suspicious internship offer via WhatsApp. JobShield flagged 7 red flags I would have missed. This tool is essential!",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by <span className="gradient-text">Job Seekers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our users have to say about JobShield AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/90 leading-relaxed mb-6 text-[15px]">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} text-white text-sm font-bold shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
