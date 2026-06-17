import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeConfig = {
  sm: { icon: "h-5 w-5", wrapper: "h-8 w-8", text: "text-xs" },
  md: { icon: "h-8 w-8", wrapper: "h-12 w-12", text: "text-sm" },
  lg: { icon: "h-12 w-12", wrapper: "h-16 w-16", text: "text-base" },
} as const;

export function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        {/* Spinning gradient ring */}
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-transparent",
            config.wrapper
          )}
          style={{
            borderTopColor: "#4F46E5",
            borderRightColor: "#7C3AED",
          }}
        />
        {/* Center shield icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck
            className={cn("text-indigo-400 animate-pulse", config.icon)}
            style={{
              width: "60%",
              height: "60%",
            }}
          />
        </div>
      </div>
      {text && (
        <p className={cn("text-slate-400 animate-pulse", config.text)}>
          {text}
        </p>
      )}

      {/* SVG gradient for the spinner */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
