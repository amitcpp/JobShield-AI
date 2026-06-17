"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { RISK_CONFIG } from "@/lib/constants";
import type { AnalysisResult, Verdict } from "@/types";

const verdictFilters = [
  { label: "All", value: "" },
  { label: "Safe", value: "safe" },
  { label: "Suspicious", value: "suspicious" },
  { label: "High Risk", value: "high_risk" },
];

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "9" });
      if (filter) params.set("verdict", filter);

      const res = await fetch(`/api/analyses?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data.data.items);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Delete this analysis?")) return;

    try {
      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnalyses((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analysis History</h1>
        <p className="text-muted-foreground mt-1">
          View and revisit your past scam analyses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {verdictFilters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange(f.value)}
            className={
              filter === f.value
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0"
                : "border-border text-muted-foreground hover:text-white"
            }
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] rounded-xl" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No analyses found"
          description={
            filter
              ? "No analyses match this filter. Try a different one."
              : "You haven't analyzed any content yet."
          }
          actionLabel="Analyze Content"
          actionHref="/analyze"
        />
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis, index) => {
              const config = RISK_CONFIG[analysis.verdict as Verdict];
              return (
                <motion.div
                  key={analysis._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/report/${analysis._id}`}>
                    <Card className="bg-card border-border hover:border-indigo-500/30 transition-all hover:-translate-y-1 cursor-pointer h-full">
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="text-xs shrink-0"
                            style={{
                              color: config.color,
                              borderColor: config.borderColor,
                              backgroundColor: config.bgColor,
                            }}
                          >
                            {config.label} • {analysis.riskScore}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-red-400 shrink-0"
                            onClick={(e) => handleDelete(analysis._id, e)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        <p className="text-sm text-foreground/90 line-clamp-3 flex-1 mb-3">
                          {analysis.contentPreview}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="capitalize">
                            {analysis.contentType.replace("_", " ")}
                          </span>
                          <span>
                            {new Date(analysis.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-border"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-border"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
