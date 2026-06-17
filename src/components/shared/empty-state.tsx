"use client";

import { type LucideIcon, FileSearch } from "lucide-react";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileSearch,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {/* Icon container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-xl scale-150" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Icon className="h-10 w-10 text-slate-400" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* CTA Button */}
      {actionLabel && (actionHref || onAction) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25"
              )}
            >
              {actionLabel}
            </Link>
          ) : (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25"
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </motion.div>
  );
}
