"use client";

import { cn } from "@/lib/utils";

/**
 * KPICardSkeleton — Prevents Cumulative Layout Shift (CLS) by reserving exact space
 * for KPI cards during data fetching or code-splitting loads.
 */
export function KPICardSkeleton() {
  return (
    <div className="flex flex-col p-5 bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-dark-bg w-10 h-10" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-dark-border" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-4 bg-slate-100 dark:bg-dark-bg rounded w-2/3" />
        <div className="flex items-baseline gap-1.5 mt-1">
          <div className="h-8 bg-slate-200 dark:bg-dark-bg rounded w-1/3" />
          <div className="h-3 bg-slate-100 dark:bg-dark-bg rounded w-8" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex-1 h-10 bg-slate-50 dark:bg-dark-bg rounded-lg" />
        <div className="w-4 h-4 rounded bg-slate-200 dark:bg-dark-bg" />
      </div>
    </div>
  );
}
