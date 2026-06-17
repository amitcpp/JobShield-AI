import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

const sizeConfig = {
  sm: {
    icon: "h-6 w-6",
    text: "text-lg",
    gap: "gap-2",
  },
  md: {
    icon: "h-8 w-8",
    text: "text-xl",
    gap: "gap-2.5",
  },
  lg: {
    icon: "h-10 w-10",
    text: "text-2xl",
    gap: "gap-3",
  },
} as const;

export function Logo({ size = "md", className, showText = true }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("flex items-center", config.gap, className)}>
      <div className="relative">
        {/* Pulse glow ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-40 blur-md animate-pulse",
            config.icon
          )}
        />
        {/* Shield icon with gradient */}
        <ShieldCheck
          className={cn(
            "relative text-transparent",
            config.icon
          )}
          style={{
            stroke: "url(#logo-gradient)",
          }}
        />
        {/* SVG gradient definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent",
            config.text
          )}
        >
          JobShield AI
        </span>
      )}
    </div>
  );
}
