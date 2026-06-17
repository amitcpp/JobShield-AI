"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Verdict } from "@/types";
import { RISK_CONFIG } from "@/lib/constants";

interface RiskScoreGaugeProps {
  score: number;
  verdict: Verdict;
}

const GAUGE_SIZE = 200;
const STROKE_WIDTH = 12;
const RADIUS = (GAUGE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function AnimatedCounter({ target, color }: { target: number; color: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1] as const,
    });

    const unsubscribe = rounded.on("change", (v) => setDisplay(v));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, target]);

  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      className="font-bold"
      style={{ fill: color, fontSize: "48px" }}
    >
      {display}
    </text>
  );
}

export default function RiskScoreGauge({ score, verdict }: RiskScoreGaugeProps) {
  const config = RISK_CONFIG[verdict];
  const color = config.color;
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: GAUGE_SIZE, height: GAUGE_SIZE }}>
        <svg
          width={GAUGE_SIZE}
          height={GAUGE_SIZE}
          viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={GAUGE_SIZE / 2}
            cy={GAUGE_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-white/5"
          />

          {/* Animated foreground arc */}
          <motion.circle
            cx={GAUGE_SIZE / 2}
            cy={GAUGE_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] as const }}
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>

        {/* Center text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width={GAUGE_SIZE} height={GAUGE_SIZE} viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}>
            <AnimatedCounter target={score} color={color} />
            <text
              x="50%"
              y="62%"
              dominantBaseline="central"
              textAnchor="middle"
              className="text-sm"
              style={{ fill: "#94A3B8", fontSize: "14px" }}
            >
              / 100
            </text>
          </svg>
        </div>
      </div>

      {/* Verdict label */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide uppercase"
        style={{
          color,
          backgroundColor: config.bgColor,
          border: `1px solid ${config.borderColor}`,
        }}
      >
        {config.label}
      </motion.div>
    </div>
  );
}
