"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does JobShield AI detect scams?",
    answer:
      "JobShield AI uses Google's Gemini AI to analyze your content across 50+ scam indicators. It checks for suspicious language patterns, urgency tactics, payment requests, fake company details, unrealistic offers, and known scam templates. The analysis produces a risk score, red flags, and actionable recommendations.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. Your submitted content is only used for analysis and stored securely in your personal history. We never share your data with third parties. All connections are encrypted with HTTPS, and your data is stored in encrypted databases. You can delete your analysis history at any time.",
  },
  {
    question: "What types of content can I analyze?",
    answer:
      "You can analyze job-related emails, WhatsApp messages, LinkedIn messages and InMails, job descriptions from any platform, offer letters, recruiter communications, and any other job-related text content. Simply paste the content and our AI will analyze it.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes! JobShield AI offers a generous free tier with up to 10 analyses per day. This is more than enough for most job seekers. We plan to offer a Pro tier with additional features in the future.",
  },
  {
    question: "How accurate is the analysis?",
    answer:
      "Our AI achieves over 99% accuracy in identifying known scam patterns. However, we always recommend using JobShield as one tool in your verification process. Always verify job offers independently through official company channels. Our AI continues to improve as it learns from new scam patterns.",
  },
];

export default function FAQ() {
  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Got questions? We&apos;ve got answers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card/50 data-[state=open]:border-indigo-500/30"
              >
                <AccordionTrigger className="text-left text-[15px] font-medium hover:text-indigo-400 transition-colors py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
