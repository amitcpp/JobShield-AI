"use client";

import { motion } from "framer-motion";
import { Send, Megaphone, UserX, Key, DollarSign, AlertTriangle, ShieldCheck } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { cn } from "@/lib/utils";

interface ScamTimelineProps {
  analysis?: AnalysisResult;
}

export default function ScamTimeline({ analysis }: ScamTimelineProps) {
  // If no analysis is provided, return default
  if (!analysis) return null;

  // Determine active threat stages based on actual AI analysis flags
  const hasUnrealisticSalary = analysis.salaryRealityCheck?.isUnrealistic ?? false;
  const hasSuspiciousCommission = analysis.salaryRealityCheck?.suspiciousCommission ?? false;
  const isCompanyLowConfidence = (analysis.companyLegitimacy?.confidenceScore ?? 100) < 50;
  const isGmailDomain = analysis.originalContent.toLowerCase().includes("@gmail.com") ||
                        analysis.originalContent.toLowerCase().includes("@yahoo.com");

  const hasPhishingIndicators =
    analysis.phishingDetection?.credentialTheftRisk ||
    analysis.phishingDetection?.fakeInterviewLinksRisk ||
    analysis.phishingDetection?.suspiciousAttachmentsRisk ||
    analysis.phishingDetection?.suspiciousUrlsRisk;

  const hasFinancialRequest = analysis.salaryRealityCheck?.payToWorkRisk ||
                              analysis.redFlags.some(flag => flag.title.toLowerCase().includes("payment") || flag.title.toLowerCase().includes("fee"));

  // Define the progression stages
  const stages = [
    {
      id: "outreach",
      label: "1. Initial Outreach",
      description: "Unsolicited contact via WhatsApp, SMS, LinkedIn or Gmail.",
      icon: Send,
      isActive: true, // Always active as they received the message
      isFlagged: isGmailDomain || analysis.contentType !== "job_description",
      flagReason: isGmailDomain ? "Uses a personal email for recruiting." : "Unsolicited direct messaging."
    },
    {
      id: "pitch",
      label: "2. The Hook / Pitch",
      description: "Inflated salary claims or low-barrier tasks offered.",
      icon: Megaphone,
      isActive: hasUnrealisticSalary || hasSuspiciousCommission || analysis.riskScore > 30,
      isFlagged: hasUnrealisticSalary || hasSuspiciousCommission,
      flagReason: hasUnrealisticSalary ? "Inflationary salary offer." : "Suspicious commission structure."
    },
    {
      id: "impersonation",
      label: "3. Brand Trust Setup",
      description: "Claiming association with reputable, global organizations.",
      icon: UserX,
      isActive: isCompanyLowConfidence || analysis.riskScore > 45,
      isFlagged: isCompanyLowConfidence,
      flagReason: "Failed brand validation check; domain check mismatch."
    },
    {
      id: "phishing",
      label: "4. Digital Capture",
      description: "Credential harvesting or fake online interview portals.",
      icon: Key,
      isActive: hasPhishingIndicators || analysis.riskScore > 60,
      isFlagged: hasPhishingIndicators,
      flagReason: "Phishing links or unauthorized application files detected."
    },
    {
      id: "ask",
      label: "5. Financial Extraction",
      description: "Demanding training deposits, laptop fees or crypto.",
      icon: DollarSign,
      isActive: hasFinancialRequest || analysis.riskScore > 80,
      isFlagged: hasFinancialRequest,
      flagReason: "Demands upfront registration fees or security deposits."
    }
  ];

  // Count how many stages are flagged
  const flaggedCount = stages.filter(s => s.isFlagged).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            Threat Kill-Chain / Scam Progression Timeline
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Visual map representing how this message scores along the five standard phases of recruitment fraud.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[11px] font-bold text-slate-400 uppercase">
          {flaggedCount > 0 ? (
            <>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>{flaggedCount} Phase Flags</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>0 Threats Flagged</span>
            </>
          )}
        </div>
      </div>

      {/* Horizontal timeline chart (desktops) */}
      <div className="hidden md:flex items-stretch justify-between relative py-6">
        {/* Track Line background */}
        <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-800 -translate-y-1/2 z-0" />

        {stages.map((stage, index) => {
          const IconComponent = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center text-center w-[18%]">
              {/* Node Indicator */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500",
                  stage.isFlagged
                    ? "bg-red-500/10 border-red-500 text-red-400 shadow-lg shadow-red-500/15"
                    : stage.isActive
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                    : "bg-[#0A0E1A] border-slate-800 text-slate-600"
                )}
              >
                {stage.isFlagged ? (
                  <AlertTriangle className="h-5 w-5 animate-pulse" />
                ) : (
                  <IconComponent className="h-5 w-5" />
                )}
              </div>

              {/* Text Label */}
              <h5 className={cn(
                "text-xs font-bold mt-3 transition-colors",
                stage.isFlagged ? "text-red-400" : stage.isActive ? "text-slate-200" : "text-slate-500"
              )}>
                {stage.label}
              </h5>

              <p className="text-[10px] text-slate-400 mt-1 max-w-[130px] leading-relaxed">
                {stage.description}
              </p>

              {/* Flag details if applicable */}
              {stage.isFlagged && (
                <div className="absolute top-36 bg-red-500/5 border border-red-500/10 rounded-lg p-2 max-w-[120px] text-[9px] text-red-400 leading-normal">
                  {stage.flagReason}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vertical timeline details (mobile and fallback view) */}
      <div className="md:hidden space-y-4 relative pl-4 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {stages.map((stage) => {
          const IconComponent = stage.icon;

          return (
            <div key={stage.id} className="relative pl-8 flex gap-3">
              {/* Node indicator */}
              <div
                className={cn(
                  "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 z-10",
                  stage.isFlagged
                    ? "bg-red-500/10 border-red-500 text-red-400"
                    : stage.isActive
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                    : "bg-[#0A0E1A] border-slate-800 text-slate-600"
                )}
              >
                {stage.isFlagged ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : (
                  <IconComponent className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="space-y-1">
                <h5 className={cn(
                  "text-xs font-bold",
                  stage.isFlagged ? "text-red-400" : stage.isActive ? "text-slate-200" : "text-slate-500"
                )}>
                  {stage.label}
                </h5>
                <p className="text-xs text-slate-400">
                  {stage.description}
                </p>
                {stage.isFlagged && (
                  <span className="inline-block text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded mt-1">
                    {stage.flagReason}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
