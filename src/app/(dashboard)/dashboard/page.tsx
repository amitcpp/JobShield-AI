"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { RISK_CONFIG } from "@/lib/constants";
import type { UserStats, AnalysisResult, Verdict } from "@/types";

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

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card className="bg-card border-border hover:border-white/10 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
          >
            <div style={{ color }}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function AnalysisCard({ analysis }: { analysis: AnalysisResult }) {
  const config = RISK_CONFIG[analysis.verdict as Verdict];
  return (
    <Link href={`/report/${analysis._id}`}>
      <Card className="bg-card border-border hover:border-indigo-500/30 transition-all hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm text-foreground/90 line-clamp-2 flex-1">
              {analysis.contentPreview}
            </p>
            <Badge
              variant="outline"
              className="shrink-0 text-xs"
              style={{
                color: config.color,
                borderColor: config.borderColor,
                backgroundColor: config.bgColor,
              }}
            >
              {analysis.riskScore}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground capitalize">
              {analysis.contentType.replace("_", " ")}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(analysis.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Stats grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="Total Analyses"
          value={stats?.totalAnalyses ?? 0}
          icon={Shield}
          color="#6366F1"
        />
        <StatCard
          label="Safe"
          value={stats?.safeCount ?? 0}
          icon={ShieldCheck}
          color="#10B981"
        />
        <StatCard
          label="Suspicious"
          value={stats?.suspiciousCount ?? 0}
          icon={ShieldAlert}
          color="#F59E0B"
        />
        <StatCard
          label="High Risk"
          value={stats?.highRiskCount ?? 0}
          icon={ShieldX}
          color="#EF4444"
        />
      </motion.div>

      {/* Quick analyze CTA */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-indigo-600/10 to-violet-600/10 border-indigo-500/20">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/20">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Analyze New Content
                </h3>
                <p className="text-sm text-muted-foreground">
                  Paste suspicious job content to get instant AI analysis
                </p>
              </div>
            </div>
            <Link href="/analyze">
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white gap-2">
                <Search className="w-4 h-4" />
                Analyze Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent analyses */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Recent Analyses
          </h2>
          {(stats?.recentAnalyses?.length ?? 0) > 0 && (
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          )}
        </div>

        {!stats?.recentAnalyses?.length ? (
          <EmptyState
            icon={Shield}
            title="No analyses yet"
            description="Start by analyzing your first suspicious job content"
            actionLabel="Analyze Content"
            actionHref="/analyze"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.recentAnalyses.map((analysis) => (
              <AnalysisCard key={analysis._id} analysis={analysis} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
