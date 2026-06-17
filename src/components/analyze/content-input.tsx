"use client";

import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ContentType } from "@/types";

const PLACEHOLDERS: Record<ContentType, string> = {
  email: "Paste a suspicious job email here...",
  whatsapp: "Paste a suspicious WhatsApp message here...",
  linkedin: "Paste a suspicious LinkedIn message or InMail here...",
  job_description: "Paste a suspicious job description here...",
  offer_letter: "Paste a suspicious offer letter here...",
  other: "Paste any suspicious job-related content here...",
};

interface ContentInputProps {
  value: string;
  onChange: (val: string) => void;
  contentType: ContentType;
  disabled?: boolean;
}

export function ContentInput({
  value,
  onChange,
  contentType,
  disabled = false,
}: ContentInputProps) {
  const maxLength = APP_CONFIG.maxContentLength;
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.9;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            onChange(e.target.value);
          }
        }}
        placeholder={PLACEHOLDERS[contentType]}
        disabled={disabled}
        className={cn(
          "min-h-[250px] w-full resize-y rounded-xl",
          "bg-gray-900/50 border border-white/10",
          "text-slate-100 placeholder:text-slate-500",
          "text-base leading-relaxed p-4",
          "focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20",
          "transition-all duration-200",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      />

      {/* Character count */}
      <div
        className={cn(
          "absolute bottom-3 right-3 text-xs font-mono tabular-nums",
          "pointer-events-none select-none transition-colors duration-200",
          isOverLimit
            ? "text-red-400"
            : isNearLimit
              ? "text-amber-400"
              : "text-slate-500"
        )}
      >
        {charCount.toLocaleString()} / {maxLength.toLocaleString()}
      </div>
    </div>
  );
}
