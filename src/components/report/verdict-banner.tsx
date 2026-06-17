import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import type { Verdict } from "@/types";
import { RISK_CONFIG } from "@/lib/constants";

interface VerdictBannerProps {
  verdict: Verdict;
  summary: string;
}

const VERDICT_ICONS = {
  safe: ShieldCheck,
  suspicious: ShieldAlert,
  high_risk: ShieldX,
} as const;

export default function VerdictBanner({ verdict, summary }: VerdictBannerProps) {
  const config = RISK_CONFIG[verdict];
  const Icon = VERDICT_ICONS[verdict];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${config.color} 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${config.color}15` }}
      />

      <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: `${config.color}20`,
            border: `1px solid ${config.borderColor}`,
          }}
        >
          <Icon className="h-7 w-7" style={{ color: config.color }} />
        </div>

        <div className="space-y-1.5">
          <h2
            className="text-xl font-bold tracking-wide uppercase sm:text-2xl"
            style={{ color: config.color }}
          >
            {config.label}
          </h2>
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
