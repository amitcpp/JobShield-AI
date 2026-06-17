import { ArrowRight } from "lucide-react";

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({
  recommendations,
}: RecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="relative rounded-2xl p-[1px]">
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-cyan-500/30" />

      <div className="relative rounded-2xl bg-[#111827] p-5 sm:p-6">
        <ul className="space-y-3">
          {recommendations.map((rec, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-relaxed text-slate-300"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10">
                <ArrowRight className="h-3 w-3 text-indigo-400" />
              </span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
