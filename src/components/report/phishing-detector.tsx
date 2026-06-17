"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, AlertTriangle, ShieldCheck, Link2, Download, Key, Info, HelpCircle } from "lucide-react";
import type { PhishingDetection } from "@/types";
import { cn } from "@/lib/utils";

interface PhishingDetectorProps {
  data?: PhishingDetection;
}

export default function PhishingDetector({ data }: PhishingDetectorProps) {
  // Safe defaults if data is missing
  const credentialTheftRisk = data?.credentialTheftRisk ?? false;
  const fakeInterviewLinksRisk = data?.fakeInterviewLinksRisk ?? false;
  const suspiciousAttachmentsRisk = data?.suspiciousAttachmentsRisk ?? false;
  const suspiciousUrlsRisk = data?.suspiciousUrlsRisk ?? false;
  const detectedUrls = data?.detectedUrls || [];
  const analysisDetails = data?.analysisDetails || "No phishing details analyzed.";

  // Overall threat indicator
  const hasPhishingThreats =
    credentialTheftRisk || fakeInterviewLinksRisk || suspiciousAttachmentsRisk || suspiciousUrlsRisk;

  return (
    <div className="space-y-6">
      {/* Overview Threat Banner */}
      <Card
        className={cn(
          "bg-card border-border overflow-hidden relative",
          hasPhishingThreats
            ? "border-red-500/20 bg-red-500/[0.01]"
            : "border-emerald-500/20 bg-emerald-500/[0.01]"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r",
            hasPhishingThreats ? "from-red-500/5 to-orange-500/5" : "from-emerald-500/5 to-teal-500/5"
          )}
        />
        <CardContent className="p-6 relative flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl border",
                hasPhishingThreats
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              )}
            >
              {hasPhishingThreats ? <ShieldAlert className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
            </div>
            <div>
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider block",
                  hasPhishingThreats ? "text-red-400" : "text-emerald-400"
                )}
              >
                Phishing & Link Safety Assessment
              </span>
              <h3 className="text-xl font-bold text-white mt-1 leading-snug">
                {hasPhishingThreats
                  ? "Potential Phishing Indicators Identified"
                  : "No Critical Phishing Vulnerabilities Found"}
              </h3>
            </div>
          </div>

          <div>
            {hasPhishingThreats ? (
              <Badge className="bg-red-500/10 hover:bg-red-500/10 text-red-400 border-red-500/25 px-3 py-1 text-xs">
                Threat Detected
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/25 px-3 py-1 text-xs">
                Clean Scan
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Phishing risk indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credential Theft */}
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center p-4 rounded-xl border bg-card border-border",
            credentialTheftRisk && "border-red-500/25 bg-red-500/5"
          )}
        >
          <Key className={cn("h-6 w-6 mb-2", credentialTheftRisk ? "text-red-400" : "text-slate-400")} />
          <span className="text-xs font-semibold text-slate-300">Credential Harvesting</span>
          <span className={cn("text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded", credentialTheftRisk ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-800 text-slate-400")}>
            {credentialTheftRisk ? "Risk Flagged" : "Secure"}
          </span>
        </div>

        {/* Fake Interview Links */}
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center p-4 rounded-xl border bg-card border-border",
            fakeInterviewLinksRisk && "border-amber-500/25 bg-amber-500/5"
          )}
        >
          <Link2 className={cn("h-6 w-6 mb-2", fakeInterviewLinksRisk ? "text-amber-400" : "text-slate-400")} />
          <span className="text-xs font-semibold text-slate-300">Interview Links</span>
          <span className={cn("text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded", fakeInterviewLinksRisk ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-800 text-slate-400")}>
            {fakeInterviewLinksRisk ? "Suspicious" : "Secure"}
          </span>
        </div>

        {/* Suspicious Attachments */}
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center p-4 rounded-xl border bg-card border-border",
            suspiciousAttachmentsRisk && "border-red-500/25 bg-red-500/5"
          )}
        >
          <Download className={cn("h-6 w-6 mb-2", suspiciousAttachmentsRisk ? "text-red-400" : "text-slate-400")} />
          <span className="text-xs font-semibold text-slate-300">File Attachments</span>
          <span className={cn("text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded", suspiciousAttachmentsRisk ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-800 text-slate-400")}>
            {suspiciousAttachmentsRisk ? "Risk Flagged" : "Secure"}
          </span>
        </div>

        {/* Suspicious URLs */}
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center p-4 rounded-xl border bg-card border-border",
            suspiciousUrlsRisk && "border-amber-500/25 bg-amber-500/5"
          )}
        >
          <AlertTriangle className={cn("h-6 w-6 mb-2", suspiciousUrlsRisk ? "text-amber-400" : "text-slate-400")} />
          <span className="text-xs font-semibold text-slate-300">Domain Mismatch</span>
          <span className={cn("text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded", suspiciousUrlsRisk ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-800 text-slate-400")}>
            {suspiciousUrlsRisk ? "Suspicious" : "Secure"}
          </span>
        </div>
      </div>

      {/* Extracted Link Verification table */}
      <Card className="bg-card border-border">
        <CardContent className="p-5 space-y-4">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-indigo-400" />
            Domain Safety Assessment Log
          </h4>

          {detectedUrls.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-white/5 rounded-xl text-slate-500 text-xs flex flex-col items-center justify-center gap-1.5">
              <ShieldCheck className="h-8 w-8 text-slate-600" />
              <span>No URLs or hyperlinks detected in content.</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/5 bg-white/[0.005]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="p-3">Extracted Domain</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Safety Verdict Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {detectedUrls.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01]">
                      <td className="p-3 font-mono text-slate-200 break-all select-all">
                        {item.domain}
                      </td>
                      <td className="p-3">
                        {item.isSuspicious ? (
                          <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/10 font-bold uppercase text-[9px]">
                            <AlertTriangle className="h-3 w-3" /> Suspicious
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold uppercase text-[9px]">
                            <ShieldCheck className="h-3 w-3" /> Approved
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400 max-w-xs leading-relaxed">
                        {item.reason || "Domain matches legitimate reference profiles."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phishing Analysis details */}
      <Card className="bg-card border-border">
        <CardContent className="p-5 space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-400" />
            Security Intelligence Details
          </h4>
          <p className="text-sm leading-relaxed text-slate-400">
            {analysisDetails}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
