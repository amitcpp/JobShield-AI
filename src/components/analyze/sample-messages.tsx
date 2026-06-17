"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SAMPLE_MESSAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ContentType } from "@/types";

interface SampleMessagesProps {
  onSelect: (content: string, type: ContentType) => void;
}

const BADGE_COLORS: Record<string, string> = {
  email: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  whatsapp: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  linkedin: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  job_description: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  offer_letter: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  other: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

export function SampleMessages({ onSelect }: SampleMessagesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span>Try a sample to see how it works</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SAMPLE_MESSAGES.map((sample, index) => (
          <motion.button
            key={sample.title}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            onClick={() => onSelect(sample.content, sample.contentType)}
            className={cn(
              "group relative flex flex-col items-start gap-2 rounded-xl p-4 text-left",
              "bg-white/[0.03] border border-white/[0.08]",
              "hover:bg-white/[0.06] hover:border-white/[0.15]",
              "transition-all duration-200 cursor-pointer"
            )}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none" />

            <Badge
              variant="outline"
              className={cn(
                "relative text-[10px] uppercase tracking-wider font-semibold",
                BADGE_COLORS[sample.contentType] ?? BADGE_COLORS.other
              )}
            >
              {sample.contentType.replace("_", " ")}
            </Badge>

            <span className="relative text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
              {sample.title}
            </span>

            <span className="relative text-xs text-slate-500 line-clamp-2">
              {sample.content.substring(0, 100)}...
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
