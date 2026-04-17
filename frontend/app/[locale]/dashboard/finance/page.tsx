"use client";

import { useLocalization } from "@/hooks/useLocalization";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Wallet, PieChart, Landmark, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinanceDashboard() {
  const { isArabic, t } = useLocalization();

  const comparisons = [
    { label: t("Q1 Budget", "ميزانية الربع الأول"), allocated: 6500000, actual: 6480000, trend: "Up" },
    { label: t("Operations", "العمليات"), allocated: 1200000, actual: 1350000, trend: "Down" },
    { label: t("Sponsorships", "الرعايات"), allocated: 3700000, actual: 3700000, trend: "Stable" },
  ];

  return (
    <DashboardShell
      title={{ en: "Finance & Strategy", ar: "المالية والاستراتيجية" }}
      subtitle={{ en: "Budget Analysis & Sponsorship Management", ar: "تحليل الميزانية وإدارة الرعايات" }}
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-8 bg-brand-900 text-white relative overflow-hidden">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest">{t("Total Q1 Revenue", "إجمالي إيرادات الربع الأول")}</h3>
            <p className="text-4xl font-black mt-2 tracking-tight">SAR 12,450,000</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-success-light">
              <TrendingUp className="w-4 h-4" /> +12.5% vs Last Year
            </div>
            <Landmark className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12" />
          </div>
          
          <div className="card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink">{t("Budget Variance", "تباين الميزانية")}</h3>
              <PieChart className="w-5 h-5 text-ink-faint" />
            </div>
            <div className="mt-4 space-y-4">
              {comparisons.map((c, i) => {
                const percent = Math.min(100, (c.actual / c.allocated) * 100);
                const isOver = c.actual > c.allocated;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-ink-muted uppercase">{c.label}</span>
                      <span className={cn(isOver ? "text-red-500" : "text-brand-500")}>
                        {Math.round(percent)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", isOver ? "bg-red-500" : "bg-brand-500")}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sponsorship Contracts */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-surface-border flex items-center justify-between bg-surface-muted">
            <h3 className="font-bold text-ink">{t("Sponsorships (CMA Compliant)", "الرعايات (متوافق مع هيئة السوق)")}</h3>
            <button className="btn btn-secondary py-1.5 px-3 text-2xs uppercase tracking-widest font-black">
              {isArabic ? "تصدير التقرير المالي" : "Export CMA Report"}
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { partner: "Harmah Energy", value: "2.5M SAR", expiry: "Dec 2027", vat: "3001..0003" },
              { partner: "Saudi Logistics Co", value: "1.2M SAR", expiry: "Oct 2026", vat: "3009..0003" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-surface-border bg-surface hover:border-brand-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-subtle flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{s.partner}</p>
                    <p className="text-[10px] font-bold text-ink-faint uppercase font-mono">VAT: {s.vat}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-brand-600">{s.value}</p>
                  <p className="text-[10px] font-bold text-ink-faint">{s.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
