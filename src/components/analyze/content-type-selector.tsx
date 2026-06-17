"use client";

import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  MessageSquare,
  FileText,
  FileCheck,
  File,
  type LucideIcon,
} from "lucide-react";
import { CONTENT_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ContentType } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Mail,
  MessageCircle,
  Linkedin: MessageSquare,
  FileText,
  FileCheck,
  File,
};

interface ContentTypeSelectorProps {
  value: ContentType;
  onChange: (type: ContentType) => void;
}

export function ContentTypeSelector({
  value,
  onChange,
}: ContentTypeSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
      {CONTENT_TYPES.map((type) => {
        const Icon = ICON_MAP[type.icon] ?? File;
        const isActive = value === type.value;

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              "relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
              "whitespace-nowrap transition-all duration-200",
              "border border-white/[0.08] cursor-pointer shrink-0",
              isActive
                ? "text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 bg-white/[0.03] hover:bg-white/[0.06] hover:text-slate-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-content-type"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600"
                style={{
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {type.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
