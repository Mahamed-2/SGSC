"use client";

import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { colors } from "@/styles/design-tokens";

interface ClubHealthGaugeProps {
  score: number;
  className?: string;
}

/**
 * ClubHealthGauge — A premium SVG radial gauge for the Club Health Score.
 * Includes a brand-native Al-Faisaly green/gold aesthetic.
 */
export function ClubHealthGauge({ score, className }: ClubHealthGaugeProps) {
  const { isArabic } = useLocalization();
  
  // SVG math
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center pt-4", className)}>
      <svg className="w-48 h-48 transform -rotate-90">
        {/* Background track */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke={colors.neutral[100]}
          strokeWidth="12"
          fill="transparent"
          className="dark:stroke-dark-border"
        />
        {/* Progress bar */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke={colors.brand.primary}
          strokeWidth="14"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-2">
        <span className="text-4xl font-bold text-ink translate-y-1">{Math.round(score)}</span>
        <span className="text-2xs font-semibold text-ink-muted uppercase tracking-wider">
          {isArabic ? "مؤشر الأداء" : "Health Score"}
        </span>
      </div>

      {/* Gold Accents */}
      <div className="absolute bottom-10 flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-60" />
        ))}
      </div>
    </div>
  );
}
