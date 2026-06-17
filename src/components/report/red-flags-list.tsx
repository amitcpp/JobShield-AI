"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldOff, ChevronDown } from "lucide-react";
import type { RedFlag, FlagSeverity } from "@/types";
import { SEVERITY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface RedFlagsListProps {
  flags: RedFlag[];
}

const SEVERITY_ORDER: Record<FlagSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function RedFlagsList({ flags }: RedFlagsListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!flags || flags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <ShieldOff className="h-6 w-6 text-emerald-400" />
        </div>
        <p className="text-sm text-slate-400">No red flags detected</p>
      </div>
    );
  }

  const sorted = [...flags].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {sorted.map((flag, idx) => {
        const severity = SEVERITY_CONFIG[flag.severity];
        const isExpanded = expandedIndex === idx;

        return (
          <motion.div
            key={`${flag.title}-${idx}`}
            variants={item}
            onClick={() => toggleExpand(idx)}
            className={cn(
              "group rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 cursor-pointer hover:bg-white/[0.04] select-none",
              isExpanded && "border-indigo-500/20 bg-white/[0.03]"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded"
                style={{ backgroundColor: severity.bgColor }}
              >
                <AlertTriangle
                  className="h-3 w-3"
                  style={{ color: severity.color }}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                      style={{
                        color: severity.color,
                        backgroundColor: severity.bgColor,
                      }}
                    >
                      {severity.label}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {flag.title}
                    </h4>
                  </div>
                  <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isExpanded && "rotate-180 text-indigo-400"
                      )}
                    />
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">
                  {flag.description}
                </p>

                {/* Explainable AI Expanded Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-3 border-t border-white/5 space-y-3">
                        {flag.quote && (
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                              Quote from Content
                            </span>
                            <blockquote
                              className="rounded-lg border-l-2 bg-white/[0.01] py-2 pl-4 pr-3 text-xs italic leading-relaxed text-slate-400"
                              style={{ borderColor: severity.color }}
                            >
                              &ldquo;{flag.quote}&rdquo;
                            </blockquote>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block mb-1">
                              Threat Vector (Why Suspicious)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {flag.whySuspicious || "Scam indicator verified by AI model analysis."}
                            </p>
                          </div>
                          <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-1">
                              Scam Pattern Match
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {flag.commonScamPattern || "Standard fraudulent recruitment outreach pattern."}
                            </p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                            Countermeasures (Suggested Action)
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {flag.suggestedAction || "Independently verify via corporate directories."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
