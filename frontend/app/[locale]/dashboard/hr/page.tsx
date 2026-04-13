"use client";

import { useLocalization } from "@/hooks/useLocalization";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Briefcase, FileBadge, CalendarClock, ShieldCheck, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HRDashboard() {
  const { isArabic, t } = useLocalization();

  const compliance = [
    { label: t("Staff Count", "عدد الموظفين"), val: "10", icon: Briefcase, status: "Normal" },
    { label: t("Certifications", "الشهادات المعتمدة"), val: "14", icon: FileBadge, status: "Healthy" },
    { label: t("Iqama Renewals", "تجديد الإقامة"), val: "3", icon: CalendarClock, status: "Alert" },
  ];

  return (
    <DashboardShell
      title={{ en: "Human Resources", ar: "الموارد البشرية" }}
      subtitle={{ en: "Staff Profiles & Saudi Labor Compliance", ar: "ملفات الموظفين والامتثال لقانون العمل السعودي" }}
    >
      <div className="space-y-8">
        {/* Compliance Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {compliance.map((c, i) => (
            <div key={i} className="card p-6 flex items-center gap-4 border-l-4" style={{ 
              borderLeftColor: c.status === "Alert" ? "#ef4444" : "#006633" 
            }}>
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                <c.icon className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink-faint uppercase">{c.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-ink">{c.val}</span>
                  {c.status === "Alert" && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">Needs Action</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Staff Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-ink">{t("Staff Directory (GOSI Integrated)", "دليل الموظفين (متكامل مع التأمينات)")}</h3>
            <div className="flex gap-2">
               <span className="flex items-center gap-1.5 text-xs font-bold text-success bg-success-light/50 px-3 py-1 rounded-full border border-success/10">
                 <ShieldCheck className="w-4 h-4" /> Saudi Labor Law Compliant
               </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs text-ink-faint uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-4">{t("Staff Member", "الموظف")}</th>
                  <th className="px-6 py-4">{t("Iqama / National ID", "الإقامة / الهوية الوطنية")}</th>
                  <th className="px-6 py-4">{t("Role", "الدور")}</th>
                  <th className="px-6 py-4">{t("GOSI Status", "حالة التأمينات")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "Ahmed Al-Harbi", id: "1092384...72", role: "Head Coach", gosi: "Registered", active: true },
                  { name: "Khaled Saud", id: "1029384...11", role: "Team Doctor", gosi: "Registered", active: true },
                  { name: "Sami Fayez", id: "2019283...88", role: "Physiotherapist", gosi: "Pending", active: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-brand-600" />
                      </div>
                      <span className="font-bold text-ink">{row.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink-muted">{row.id}</td>
                    <td className="px-6 py-4 text-ink-muted font-medium">{row.role}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        row.gosi === "Registered" ? "bg-success-light text-success border-success/20" : "bg-warning-light text-warning border-warning/20"
                      )}>
                        {row.gosi}
                      </span>
                    </td>
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
