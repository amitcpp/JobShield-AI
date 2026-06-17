"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Calendar, FileText, Building2, CircleDollarSign, ShieldAlert, Sparkles, AlertTriangle, ShieldCheck, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import RiskScoreGauge from "@/components/report/risk-score-gauge";
import VerdictBanner from "@/components/report/verdict-banner";
import RedFlagsList from "@/components/report/red-flags-list";
import AnalysisBreakdown from "@/components/report/analysis-breakdown";
import Recommendations from "@/components/report/recommendations";

import CompanyChecker from "@/components/report/company-checker";
import SalaryRealityCheck from "@/components/report/salary-reality-check";
import PhishingDetector from "@/components/report/phishing-detector";
import ScamTimeline from "@/components/report/scam-timeline";

import type { AnalysisResult } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch(`/api/analyses/${params.id}`);
        if (!res.ok) {
          throw new Error("Analysis not found");
        }
        const data = await res.json();
        setAnalysis(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analysis"
        );
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchAnalysis();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[120px] rounded-xl" />
        <div className="flex justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">
          {error || "Analysis not found"}
        </p>
        <Button variant="outline" onClick={() => router.push("/history")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
        </Button>
      </div>
    );
  }

  // Count warning levels for badge indicators
  const redFlagsCount = analysis.redFlags?.length ?? 0;
  const companyConfidence = analysis.companyLegitimacy?.confidenceScore ?? 0;
  const isPhishingThreat =
    analysis.phishingDetection?.credentialTheftRisk ||
    analysis.phishingDetection?.fakeInterviewLinksRisk ||
    analysis.phishingDetection?.suspiciousAttachmentsRisk ||
    analysis.phishingDetection?.suspiciousUrlsRisk;

  const isSalaryThreat =
    analysis.salaryRealityCheck?.isUnrealistic ||
    analysis.salaryRealityCheck?.suspiciousCommission ||
    analysis.salaryRealityCheck?.payToWorkRisk;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Back button & metadata */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4"
      >
        <Button
          variant="ghost"
          onClick={() => router.push("/history")}
          className="text-muted-foreground hover:text-white gap-2 px-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Button>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1 text-xs bg-white/[0.02] border-white/10 px-3 py-1">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="capitalize">{analysis.contentType.replace("_", " ")}</span>
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs text-slate-400 bg-white/[0.02] border-white/10 px-3 py-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(analysis.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Badge>
        </div>
      </motion.div>

      {/* AI Risk Dashboard Panel (Upper Grid) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score Circular Gauge */}
        <Card className="bg-card border-border flex items-center justify-center p-6 lg:col-span-1">
          <CardContent className="p-0 flex flex-col items-center justify-center">
            <RiskScoreGauge score={analysis.riskScore} verdict={analysis.verdict} />
          </CardContent>
        </Card>

        {/* Verdict & Executive Summary */}
        <Card className="bg-card border-border overflow-hidden lg:col-span-2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-violet-500/[0.02]" />
          <CardContent className="p-6 h-full flex flex-col justify-between relative gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Threat Verdict
              </span>
              <VerdictBanner verdict={analysis.verdict} summary={analysis.summary} />
            </div>
            {analysis.recommendations?.length > 0 && (
              <div className="text-xs text-slate-400 mt-2 border-t border-white/5 pt-3">
                <strong>Primary recommendation:</strong> {analysis.recommendations[0]}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Scam Kill Chain Timeline Dashboard */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <ScamTimeline analysis={analysis} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Multi-Intelligence Checking Panels */}
      <motion.div variants={itemVariants} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border border-white/5 p-1 rounded-xl w-full grid grid-cols-2 md:grid-cols-4 gap-1">
            <TabsTrigger
              value="overview"
              className="py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Scam Profile</span>
              {redFlagsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full border border-red-500/20">
                  {redFlagsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>Company Check</span>
              <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                companyConfidence >= 70
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : companyConfidence >= 40
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {companyConfidence}%
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="salary"
              className="py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <CircleDollarSign className="h-3.5 w-3.5 shrink-0" />
              <span>Salary Reality</span>
              {isSalaryThreat && (
                <span className="ml-1 h-2 w-2 rounded-full bg-red-500 border border-red-400 animate-ping" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="phishing"
              className="py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span>Phishing Radar</span>
              {isPhishingThreat && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full border border-red-500/20">
                  Risk
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Tab 1: Scam Profile (Red Flags & Breakdown) */}
            <TabsContent value="overview" className="space-y-8 outline-none">
              {/* Red Flags List */}
              {redFlagsCount > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    🚩 Flagged Vulnerability Factors (Click to expand details)
                  </h3>
                  <RedFlagsList flags={analysis.redFlags} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 py-12 text-center">
                  <ShieldCheck className="h-10 w-10 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-slate-200">Zero Red Flags Triggered</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-normal">
                    This communication does not trigger our automated threat patterns.
                  </p>
                </div>
              )}

              {/* Analysis Category Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    📊 Content Analysis Breakdown
                  </h3>
                  <AnalysisBreakdown categories={analysis.categories} />
                </div>

                <div className="md:col-span-1">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    💡 Countermeasure Checklist
                  </h3>
                  <Recommendations recommendations={analysis.recommendations} />
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Company Checker */}
            <TabsContent value="company" className="outline-none">
              <CompanyChecker data={analysis.companyLegitimacy} />
            </TabsContent>

            {/* Tab 3: Salary Checker */}
            <TabsContent value="salary" className="outline-none">
              <SalaryRealityCheck data={analysis.salaryRealityCheck} />
            </TabsContent>

            {/* Tab 4: Phishing Detector */}
            <TabsContent value="phishing" className="outline-none">
              <PhishingDetector data={analysis.phishingDetection} />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Analyze Another */}
      <motion.div variants={itemVariants} className="flex justify-center pt-8 pb-12">
        <Link href="/analyze">
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white gap-2 px-8 rounded-xl shadow-lg shadow-indigo-500/20"
          >
            <Search className="w-5 h-5" />
            Analyze Another
            <span className="text-xs text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full ml-1">
              Free
            </span>
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
