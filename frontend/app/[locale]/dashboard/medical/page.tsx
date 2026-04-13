"use client";

import { useLocalization } from "@/hooks/useLocalization";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Activity, Thermometer, UserCheck, ShieldAlert } from "lucide-react";

export default function MedicalDashboard() {
  const { isArabic, t } = useLocalization();

  const metrics = [
    { label: t("Active Injuries", "الإصابات النشطة"), val: "5", icon: Thermometer, color: "text-red-500" },
    { label: t("Return this week", "عودة هذا الأسبوع"), val: "2", icon: UserCheck, color: "text-green-500" },
    { label: t("Tests Pending", "فحوصات معلقة"), val: "8", icon: Activity, color: "text-blue-500" },
  ];

  return (
    <DashboardShell
      title={{ en: "Medical Department", ar: "القسم الطبي" }}
      subtitle={{ en: "Player Health & Recovery Management", ar: "إدارة صحة اللاعبين والتعافي" }}
    >
      <div className="space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="card p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink-faint uppercase tracking-wider">{m.label}</p>
                <p className="text-3xl font-black text-ink mt-1">{m.val}</p>
              </div>
              <div className={cn("p-4 rounded-2xl bg-slate-50", m.color)}>
                <m.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Injury List */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-ink">{t("Current Injury Reports", "تقارير الإصابات الحالية")}</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-widest">
              <ShieldAlert className="w-3 h-3" /> {t("Privacy Enabled", "الخصوصية مفعلة")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs text-ink-faint uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-4">{t("Player", "اللاعب")}</th>
                  <th className="px-6 py-4">{t("Injury", "الإصابة")}</th>
                  <th className="px-6 py-4">{t("Severity", "الحدة")}</th>
                  <th className="px-6 py-4">{t("Exp. Return", "العودة المتوقعة")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "Al-Faisaly Player 1", type: "Hamstring Strain", severity: "Moderate", return: "2026-04-25" },
                  { name: "Al-Faisaly Player 5", type: "Ankle Sprain", severity: "Minor", return: "2026-04-18" },
                  { name: "Al-Faisaly Player 13", type: "Knee Contusion", severity: "Moderate", return: "2026-04-12" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-ink">{row.name}</td>
                    <td className="px-6 py-4 text-ink-muted">{row.type}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        row.severity === "Severe" ? "bg-red-50 text-red-600 border-red-100" : "bg-brand-50 text-brand-600 border-brand-100"
                      )}>
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted font-medium">{row.return}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

import { cn } from "@/lib/utils";
