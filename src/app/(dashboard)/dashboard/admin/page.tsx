"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, TrendingUp, Users, Calendar, ArrowRight, FileText, Globe, Search, RefreshCw, BarChart3, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminStats, ContentType, Verdict } from "@/types";
import { RISK_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchAdminStats() {
    try {
      setError(null);
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access Denied. You must be an administrator to view this page.");
        }
        throw new Error("Failed to load admin analytics.");
      }
      const data = await res.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdminStats();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[300px] lg:col-span-1 rounded-xl" />
        </div>
        <Skeleton className="h-[250px] rounded-xl" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Admin Authentication Required</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {error || "Verify that your user role is set to 'admin' in your Clerk user metadata."}
        </p>
        <div className="flex gap-3 pt-2">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Button onClick={handleRefresh} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // --- SVG Line/Area Chart calculations for daily scan volume ---
  const maxVolume = Math.max(...stats.dailyScans.map((d) => d.count), 5);
  const chartWidth = 500;
  const chartHeight = 160;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  // Map dates into SVG graph points
  const timelinePoints = stats.dailyScans.map((d, index) => {
    const x = paddingLeft + (index / (stats.dailyScans.length - 1 || 1)) * graphWidth;
    const y = paddingTop + graphHeight - (d.count / maxVolume) * graphHeight;
    return { x, y, count: d.count, date: d.date };
  });

  const linePath = timelinePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    timelinePoints.length > 0
      ? `${paddingLeft},${paddingTop + graphHeight} ${linePath} ${
          timelinePoints[timelinePoints.length - 1].x
        },${paddingTop + graphHeight}`
      : "";

  // --- SVG Donut Chart calculations for verdicts ---
  const safeCount = stats.verdictDistribution.find((v) => v.verdict === "safe")?.count ?? 0;
  const suspiciousCount =
    stats.verdictDistribution.find((v) => v.verdict === "suspicious")?.count ?? 0;
  const highRiskCount =
    stats.verdictDistribution.find((v) => v.verdict === "high_risk")?.count ?? 0;
  const totalVerdicts = safeCount + suspiciousCount + highRiskCount || 1;

  const safePct = safeCount / totalVerdicts;
  const suspiciousPct = suspiciousCount / totalVerdicts;
  const highRiskPct = highRiskCount / totalVerdicts;

  const donutRadius = 40;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~251.327

  // Segment offset coordinates
  const safeOffset = donutCircumference;
  const suspiciousOffset = donutCircumference - safePct * donutCircumference;
  const highRiskOffset = donutCircumference - (safePct + suspiciousPct) * donutCircumference;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header and demo banner */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">Admin Operations</h1>
            <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/10 border-indigo-500/20 text-[10px] font-bold uppercase py-0.5 px-2">
              System Wide Analytics
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Monitor real-time job scam detection rates, threat progression trends, and user statistics.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-white/10 text-slate-300 hover:text-white"
        >
          <RefreshCw className={cn("h-4 w-4 mr-1.5", refreshing && "animate-spin")} />
          Refresh Stats
        </Button>
      </motion.div>

      {/* Global Stat cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <Card className="bg-card border-border hover:border-white/10 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Scans
              </span>
              <span className="text-3xl font-extrabold text-white block">{stats.totalScans}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Scam detection rate */}
        <Card className="bg-card border-border hover:border-white/10 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Threat Detection Rate
              </span>
              <span className="text-3xl font-extrabold text-amber-400 block">{stats.scamRate}%</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Average risk score */}
        <Card className="bg-card border-border hover:border-white/10 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Avg Risk Score
              </span>
              <span className="text-3xl font-extrabold text-red-500 block">{stats.averageRiskScore}%</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              <ShieldX className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Active users count */}
        <Card className="bg-card border-border hover:border-white/10 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Unique Seekers
              </span>
              <span className="text-3xl font-extrabold text-emerald-400 block">{stats.activeUsersCount}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Visual Analytics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scam timeline growth chart (Line/Area) */}
        <Card className="bg-card border-border lg:col-span-2 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              Platform Utilization (Daily Scans History)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {stats.dailyScans.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-xs text-slate-500 border border-dashed border-white/5 rounded-xl">
                Scan history details unavailable.
              </div>
            ) : (
              <div className="w-full relative">
                {/* SVG Area Chart */}
                <svg
                  className="w-full h-auto max-h-[160px]"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const y = paddingTop + (i / 3) * graphHeight;
                    return (
                      <line
                        key={i}
                        x1={paddingLeft}
                        y1={y}
                        x2={chartWidth - paddingRight}
                        y2={y}
                        className="stroke-slate-800/60"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                      />
                    );
                  })}

                  {/* Area path */}
                  <path d={areaPath} className="fill-[url(#areaGrad)]" />

                  {/* Line path */}
                  <path
                    d={linePath}
                    className="stroke-indigo-500 fill-none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Circle nodes for data points */}
                  {timelinePoints.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r="3.5"
                      className="fill-indigo-400 stroke-[#111827]"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Y Axis Label */}
                  <text
                    x="2"
                    y={paddingTop + graphHeight / 2}
                    dominantBaseline="central"
                    className="fill-slate-500 font-bold uppercase"
                    style={{ fontSize: "9px" }}
                  >
                    Scans
                  </text>

                  {/* Date labels at bottom */}
                  {timelinePoints.length > 0 && (
                    <>
                      <text
                        x={timelinePoints[0].x}
                        y={chartHeight - 4}
                        textAnchor="start"
                        className="fill-slate-500"
                        style={{ fontSize: "8px" }}
                      >
                        {new Date(timelinePoints[0].date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </text>
                      <text
                        x={timelinePoints[timelinePoints.length - 1].x}
                        y={chartHeight - 4}
                        textAnchor="end"
                        className="fill-slate-500"
                        style={{ fontSize: "8px" }}
                      >
                        {new Date(timelinePoints[timelinePoints.length - 1].date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </text>
                    </>
                  )}
                </svg>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verdict Distribution Donut Chart */}
        <Card className="bg-card border-border lg:col-span-1 flex flex-col justify-between">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              Verdict Classifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex items-center justify-between gap-4">
            {/* SVG Donut */}
            <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
              <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 100 100">
                {/* Safe Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r={donutRadius}
                  className="stroke-emerald-500 fill-none"
                  strokeWidth="11"
                  strokeDasharray={donutCircumference}
                  strokeDashoffset={donutCircumference - safePct * donutCircumference}
                  strokeLinecap="round"
                />
                {/* Suspicious Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r={donutRadius}
                  className="stroke-amber-500 fill-none"
                  strokeWidth="11"
                  strokeDasharray={donutCircumference}
                  strokeDashoffset={suspiciousOffset}
                  strokeLinecap="round"
                />
                {/* High Risk Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r={donutRadius}
                  className="stroke-red-500 fill-none"
                  strokeWidth="11"
                  strokeDasharray={donutCircumference}
                  strokeDashoffset={highRiskOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-white leading-none">
                  {stats.totalScans}
                </span>
                <span className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">
                  Total
                </span>
              </div>
            </div>

            {/* Labels and legends */}
            <div className="flex-1 space-y-2.5">
              {/* High Risk */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>High Risk</span>
                </div>
                <span className="font-mono text-slate-400 font-bold">{highRiskCount}</span>
              </div>
              {/* Suspicious */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Suspicious</span>
                </div>
                <span className="font-mono text-slate-400 font-bold">{suspiciousCount}</span>
              </div>
              {/* Safe */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Safe</span>
                </div>
                <span className="font-mono text-slate-400 font-bold">{safeCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 3: Content types and Scam Patterns */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Type bar lists */}
        <Card className="bg-card border-border flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-200">
              Analyses by Outreach Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {stats.contentTypeDistribution.map((item) => {
              const pct = Math.round((item.count / (stats.totalScans || 1)) * 100);
              return (
                <div key={item.type} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                    <span className="capitalize">{item.type.replace("_", " ")}</span>
                    <span className="text-slate-400 font-bold">{item.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden w-full">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Aggregated Scam Patterns */}
        <Card className="bg-card border-border flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              Predominant Recruitment Scams Identified
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {stats.topScamPatterns.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No threat patterns flagged in system yet.
              </div>
            ) : (
              <div className="space-y-3">
                {stats.topScamPatterns.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01] text-xs leading-normal"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-red-500/10 text-[9px] font-black text-red-400">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-200 truncate pr-2">
                        {item.pattern}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-red-500/5 border-red-500/15 text-red-400 shrink-0 font-bold">
                      {item.count} Scans
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Global Activity Log */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              Global Scan Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {stats.recentScans.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No analyses records exist in the database.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-white/5 bg-white/[0.005]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="p-3">User Reference</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Scam Probability</th>
                      <th className="p-3">Threat Rating</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.recentScans.map((scan) => {
                      const config = RISK_CONFIG[scan.verdict as Verdict];
                      return (
                        <tr key={scan._id} className="hover:bg-white/[0.01]">
                          <td className="p-3 font-mono text-slate-400">
                            {scan.userId.substring(0, 10)}...
                          </td>
                          <td className="p-3 capitalize font-semibold text-slate-300">
                            {scan.contentType.replace("_", " ")}
                          </td>
                          <td className="p-3 font-bold text-slate-200">
                            {scan.riskScore}%
                          </td>
                          <td className="p-3">
                            <span
                              className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border"
                              style={{
                                color: config.color,
                                borderColor: config.borderColor,
                                backgroundColor: config.bgColor,
                              }}
                            >
                              {scan.verdict.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">
                            {new Date(scan.createdAt).toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <Link href={`/report/${scan._id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-indigo-400 hover:text-indigo-300 p-0 hover:bg-transparent"
                              >
                                View Report <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
