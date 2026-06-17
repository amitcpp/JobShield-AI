"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentTypeSelector } from "@/components/analyze/content-type-selector";
import { ContentInput } from "@/components/analyze/content-input";
import { SampleMessages } from "@/components/analyze/sample-messages";
import { AnalyzingAnimation } from "@/components/analyze/analyzing-animation";
import type { ContentType } from "@/types";

export default function AnalyzePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("email");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, contentType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      router.push(`/report/${data.data._id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setIsAnalyzing(false);
    }
  };

  const handleSampleSelect = (sampleContent: string, type: ContentType) => {
    setContent(sampleContent);
    setContentType(type);
  };

  return (
    <>
      <AnalyzingAnimation isVisible={isAnalyzing} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Analyze Content
          </h1>
          <p className="text-muted-foreground mt-1">
            Paste suspicious job content to check for scams using AI
          </p>
        </div>

        {/* Content Type Selector */}
        <ContentTypeSelector value={contentType} onChange={setContentType} />

        {/* Content Input */}
        <ContentInput
          value={content}
          onChange={setContent}
          contentType={contentType}
          disabled={isAnalyzing}
        />

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!content.trim() || isAnalyzing || content.length < 10}
          size="lg"
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-base px-8 py-5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
        >
          <Search className="w-5 h-5" />
          Analyze Content
        </Button>

        {/* Sample Messages */}
        <SampleMessages onSelect={handleSampleSelect} />
      </motion.div>
    </>
  );
}
