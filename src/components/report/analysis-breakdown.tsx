"use client";

import {
  Languages,
  DollarSign,
  BadgeCheck,
  Fingerprint,
  Contact,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { AnalysisCategories, CategoryAnalysis } from "@/types";

interface AnalysisBreakdownProps {
  categories: AnalysisCategories;
}

function getScoreColor(score: number): string {
  if (score <= 30) return "#10B981";
  if (score <= 60) return "#F59E0B";
  return "#EF4444";
}

function getDotClass(score: number): string {
  if (score <= 30) return "bg-emerald-500";
  if (score <= 60) return "bg-amber-500";
  return "bg-red-500";
}

interface TabConfig {
  key: keyof AnalysisCategories;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabConfig[] = [
  { key: "languageAnalysis", label: "Language", icon: Languages },
  { key: "financialIndicators", label: "Financial", icon: DollarSign },
  { key: "legitimacyChecks", label: "Legitimacy", icon: BadgeCheck },
  { key: "patternMatching", label: "Patterns", icon: Fingerprint },
  { key: "contactInfo", label: "Contact", icon: Contact },
];

function CategoryPanel({ category }: { category: CategoryAnalysis }) {
  const color = getScoreColor(category.score);

  return (
    <div className="space-y-4 pt-4">
      {/* Score bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Risk Score</span>
          <span className="text-sm font-bold tabular-nums" style={{ color }}>
            {category.score}/100
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${category.score}%`,
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}40`,
            }}
          />
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Findings
        </h4>
        {category.findings.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No notable findings in this category.
          </p>
        ) : (
          <ul className="space-y-2">
            {category.findings.map((finding, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {finding}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function AnalysisBreakdown({
  categories,
}: AnalysisBreakdownProps) {
  return (
    <Tabs defaultValue="languageAnalysis">
      <TabsList className="flex w-full flex-wrap gap-1 bg-white/[0.03] p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const score = categories[tab.key].score;

          return (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${getDotClass(score)}`}
              />
              <Icon className="hidden h-3.5 w-3.5 sm:block" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {TABS.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          <CategoryPanel category={categories[tab.key]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
