"use client";

import { motion } from "framer-motion";
import { Building2, Globe, CheckCircle2, AlertCircle, ExternalLink, HelpCircle } from "lucide-react";
import type { CompanyLegitimacy } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CompanyCheckerProps {
  data?: CompanyLegitimacy;
}

export default function CompanyChecker({ data }: CompanyCheckerProps) {
  // Safe defaults if data is missing (e.g. from old analyses)
  const companyName = data?.name || "Not Mentioned";
  const confidenceScore = data?.confidenceScore ?? 0;
  const hasWebsite = data?.hasOfficialWebsite ?? false;
  const websiteUrl = data?.websiteUrl || null;
  const indicators = data?.legitimacyIndicators || [
    "No structured company validation could be performed."
  ];

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidenceScore / 100) * circumference;

  // Color selection based on confidence score
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500 stroke-emerald-500";
    if (score >= 40) return "text-amber-500 stroke-amber-500";
    return "text-red-500 stroke-red-500";
  };

  const scoreColorClass = getScoreColor(confidenceScore);

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <Card className="bg-card border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5" />
        <CardContent className="p-6 relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                Extracted Organization
              </span>
              <h3 className="text-2xl font-bold text-white mt-0.5">
                {companyName}
              </h3>
              {websiteUrl && (
                <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-sm">
                  <Globe className="h-3.5 w-3.5" />
                  <span>{websiteUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* Confidence Score Circle */}
          <div className="flex items-center gap-4 border-l border-white/5 pl-0 md:pl-6">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="h-full w-full rotate-[-90deg]">
                {/* Background Track */}
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-slate-800 fill-none"
                  strokeWidth="8"
                />
                {/* Foreground Track */}
                <motion.circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className={cn("fill-none transition-all duration-1000", scoreColorClass.split(" ")[1])}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  strokeLinecap="round"
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={cn("text-2xl font-extrabold leading-none", scoreColorClass.split(" ")[0])}>
                  {confidenceScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">
                  Confidence
                </span>
              </div>
            </div>

            <div className="max-w-[150px]">
              <h4 className="text-sm font-semibold text-slate-200">
                Extraction Accuracy
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Confidence rating based on textual context, credentials, and digital patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Website Verification Status */}
        <Card className="bg-card border-border md:col-span-1">
          <CardContent className="p-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-400" />
              Website Check
            </h4>
            <div className="flex flex-col items-center justify-center py-4 text-center rounded-xl bg-white/[0.01] border border-white/5">
              {hasWebsite ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-200">
                    Official Site Detected
                  </span>
                  <p className="text-xs text-slate-400 mt-1 max-w-[180px]">
                    Extracted communication matches corporate website domains.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-200">
                    No Website Confirmed
                  </span>
                  <p className="text-xs text-slate-400 mt-1 max-w-[180px]">
                    No official domains identified in the analyzed text.
                  </p>
                </>
              )}
            </div>

            {/* Quick Action Link */}
            {companyName !== "Not Mentioned" && (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(companyName + " official website careers")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors"
              >
                <span>Verify on Google Search</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </CardContent>
        </Card>

        {/* Legitimacy Indicators */}
        <Card className="bg-card border-border md:col-span-2">
          <CardContent className="p-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Legitimacy Assessment
            </h4>
            <div className="space-y-3">
              {indicators.map((indicator, index) => {
                const isNegative =
                  indicator.toLowerCase().includes("no ") ||
                  indicator.toLowerCase().includes("lack") ||
                  indicator.toLowerCase().includes("suspicious") ||
                  indicator.toLowerCase().includes("missing") ||
                  indicator.toLowerCase().includes("gmail") ||
                  indicator.toLowerCase().includes("unable");

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border text-sm leading-relaxed",
                      isNegative
                        ? "bg-amber-500/5 border-amber-500/10 text-slate-300"
                        : "bg-emerald-500/5 border-emerald-500/10 text-slate-300"
                    )}
                  >
                    {isNegative ? (
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <span>{indicator}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
