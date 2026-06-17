"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, CheckCircle2, AlertTriangle, Info, Coins, ShieldAlert } from "lucide-react";
import type { SalaryRealityCheck } from "@/types";
import { cn } from "@/lib/utils";

interface SalaryRealityCheckProps {
  data?: SalaryRealityCheck;
}

export default function SalaryRealityCheck({ data }: SalaryRealityCheckProps) {
  // Safe defaults if data is missing
  const isSalaryMentioned = data?.isSalaryMentioned ?? false;
  const extractedSalary = data?.extractedSalary || "No compensation details found in text.";
  const isUnrealistic = data?.isUnrealistic ?? false;
  const unrealisticReason = data?.unrealisticReason || null;
  const suspiciousCommission = data?.suspiciousCommission ?? false;
  const payToWorkRisk = data?.payToWorkRisk ?? false;
  const analysisDetails = data?.analysisDetails || "No compensation analysis available.";

  // Determine overall salary threat status
  const hasSalaryThreats = isUnrealistic || suspiciousCommission || payToWorkRisk;

  return (
    <div className="space-y-6">
      {/* Extracted Salary Billboard */}
      <Card className="bg-card border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
        <CardContent className="p-6 relative flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CircleDollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Extracted Compensation Data
              </span>
              <p className="text-xl font-bold text-white mt-1 leading-snug">
                {extractedSalary}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isSalaryMentioned ? (
              <Badge className="bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/25 px-3 py-1 text-xs">
                Salary Mentioned
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-slate-400 border-white/5 px-3 py-1 text-xs">
                Salary Undefined
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checklist grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Unrealistic fresher check */}
        <Card
          className={cn(
            "bg-card border-border transition-colors",
            isUnrealistic && "border-red-500/20 bg-red-500/[0.01]"
          )}
        >
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Unrealistic Salary Check
              </span>
              {isUnrealistic ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">
                Fresher Salary Check
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Checks if entry-level salaries match industry averages or are highly inflated.
              </p>
            </div>
            {isUnrealistic ? (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2 leading-relaxed">
                <strong>Inflated:</strong> {unrealisticReason || "Compensation is unreasonably high for the requirements."}
              </div>
            ) : (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                Pay matches industry bounds or is not suspiciously high.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suspicious Commission Check */}
        <Card
          className={cn(
            "bg-card border-border transition-colors",
            suspiciousCommission && "border-amber-500/20 bg-amber-500/[0.01]"
          )}
        >
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Compensation Model
              </span>
              {suspiciousCommission ? (
                <Coins className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">
                Commission Traps
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Identifies deceptive or hidden commission-only structures disguised as fixed base salaries.
              </p>
            </div>
            {suspiciousCommission ? (
              <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 leading-relaxed">
                <strong>Alert:</strong> High-commission scheme or unclear salary breakdown identified.
              </div>
            ) : (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                No complex commission-only red flags identified.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pay-to-work scam risk */}
        <Card
          className={cn(
            "bg-card border-border transition-colors",
            payToWorkRisk && "border-red-500/20 bg-red-500/[0.01]"
          )}
        >
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Financial Transactions
              </span>
              {payToWorkRisk ? (
                <ShieldAlert className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">
                Upfront Payment Risks
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Flags demands for money (fees, security deposits, laptops) before starting work.
              </p>
            </div>
            {payToWorkRisk ? (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2 leading-relaxed">
                <strong>Threat Detected:</strong> Upfront payments or fee transfers are requested. Never pay to work.
              </div>
            ) : (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                No pay-to-work or security deposit requests identified.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytical Narrative */}
      <Card className="bg-card border-border">
        <CardContent className="p-5 space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-400" />
            Compensation Analysis Details
          </h4>
          <p className="text-sm leading-relaxed text-slate-400">
            {analysisDetails}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
