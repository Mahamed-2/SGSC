"use client";

import { useState } from "react";
import { useLocalization } from "@/hooks/useLocalization";
import { useTenant } from "@/hooks/useTenant";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ClubHealthGauge } from "@/components/kpi/ClubHealthGauge";
import { KPICard, KPIGrid } from "@/components/kpi/KPICard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { DepartmentDetailView } from "@/components/kpi/DepartmentDetailView";
import { DemoTour } from "@/components/dashboard/DemoTour";
import { useDemo } from "@/providers/DemoProvider";
import { useExport } from "@/hooks/useExport";
import { 
  Users, Trophy, Landmark, Activity, 
  FileCheck, Download, Calendar, ArrowRightLeft, Target,
  PlayCircle
} from "lucide-react";
import { mockHealthScore } from "@/mocks/kpiData";

export default function DashboardPage() {
  const { isArabic, t } = useLocalization();
  const { tenant } = useTenant();
  const { exportRef, exportAsPDF } = useExport();
  
  const [selectedDept, setSelectedDept] = useState<{ code: string; en: string; ar: string } | null>(null);

  // Stats for executive summary
  const quickStats = [
    { label: t("Active Players", "اللاعبون النشطون"), val: "124", icon: Users },
    { label: t("Matches (Next 7d)", "مباريات (7 أيام)"), val: "3", icon: Trophy },
    { label: t("Budget Status", "حالة الميزانية"), val: "92%", icon: Landmark },
  ];

  const departments = [
    { code: "FOOTBALL", en: "Football Ops", ar: "عمليات كرة القدم", val: 82, unit: "%", trend: "Up", status: "success", icon: Target },
    { code: "MEDICAL", en: "Medical", ar: "القسم الطبي", val: 71, unit: "%", trend: "Down", status: "warning", icon: Activity },
    { code: "FINANCE", en: "Finance", ar: "المالية", val: 89, unit: "SAR", trend: "Up", status: "success", icon: Landmark },
    { code: "HR", en: "Human Resources", ar: "الموارد البشرية", val: 72, unit: "%", trend: "Stable", status: "warning", icon: Users },
    { code: "STRATEGY", en: "Strategy", ar: "الاستراتيجية", val: 95, unit: "%", trend: "Up", status: "success", icon: FileCheck },
    { code: "COMMUNITY", en: "Community", ar: "المسؤولية الاجتماعية", val: 64, unit: "Pts", trend: "Down", status: "danger", icon: ArrowRightLeft },
  ];

  const { isDemoMode, toggleDemoMode } = useDemo();

  return (
    <DashboardShell
      title={{ en: "Executive Dashboard", ar: "لوحة التحكم التنفيذية" }}
      actions={
        <div className="flex gap-2">
          {!isDemoMode && (
            <button 
              onClick={toggleDemoMode}
              className="btn bg-brand-50 text-brand-700 border-brand-200 flex items-center gap-2 hover:bg-brand-100"
            >
              <PlayCircle className="w-4 h-4" />
              {isArabic ? "تفعيل نمط العرض" : "Activate Demo Mode"}
            </button>
          )}
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير التقرير" : "Export Report"}
          </button>
        </div>
      }
    >
      <div ref={exportRef} className="space-y-10 pb-10">

        {/* 1. Statistics Row (High Priority) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, i) => (
            <div key={i} className="card p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-default bg-white border-transparent">
               <div className="flex items-center justify-between mb-2">
                 <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                    <stat.icon className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-bold text-success uppercase tracking-wider">+4.2%</span>
               </div>
               <div>
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#111827] mt-1">{stat.val}</p>
               </div>
            </div>
          ))}
          <div className="card p-6 bg-[#0f0f0f] text-white flex flex-col justify-between overflow-hidden relative">
             <div className="relative z-10">
                <p className="text-xs font-semibold opacity-60 uppercase tracking-wide">{isArabic ? "صحة النادي" : "Overall Health"}</p>
                <p className="text-3xl font-bold mt-1">94.2</p>
             </div>
             <div className="w-full h-1 bg-[#1f1f1f] rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-brand-500 w-[94%]" />
             </div>
             {/* Abstract circle in background */}
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500/10 rounded-full" />
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Department Monitoring */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-[#e5e7eb]">
              <div>
                <h3 className="text-xl font-bold text-[#111827]">{t("Department Performance", "أداء الأقسام")}</h3>
                <p className="text-sm text-[#6b7280]">{isArabic ? "مراقبة الأداء في الوقت الفعلي" : "Real-time divisional monitoring"}</p>
              </div>
              <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">{isArabic ? "عرض الكل" : "View All"}</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <div 
                  key={dept.code} 
                  onClick={() => setSelectedDept(dept)}
                  className="card p-6 cursor-pointer group hover:border-brand-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      dept.status === "success" ? "bg-emerald-50 text-emerald-600" : 
                      dept.status === "warning" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    )}>
                      <dept.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-[#111827]">{isArabic ? dept.ar : dept.en}</h4>
                       <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-[#f3f4f6] rounded-full">
                            <div className={cn(
                              "h-full rounded-full",
                              dept.status === "success" ? "bg-emerald-500" : 
                              dept.status === "warning" ? "bg-amber-500" : "bg-rose-500"
                            )} style={{ width: `${dept.val}%` }} />
                          </div>
                          <span className="text-xs font-bold text-[#374151]">{dept.val}%</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed and Insights */}
          <div className="space-y-8">
             <div className="card p-6">
                <h3 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-2">
                   <Calendar className="w-5 h-5 text-brand-500" />
                   {isArabic ? "النشاط الأخير" : "Recent Activity"}
                </h3>
                <ActivityTimeline />
             </div>
             
             <div className="card p-6 border-l-4 border-l-brand-500">
                <h4 className="text-sm font-bold text-brand-600 uppercase tracking-widest">{isArabic ? "رؤية الذكاء الاصطناعي" : "AI Insight"}</h4>
                <p className="mt-2 text-sm text-[#374151] leading-relaxed">
                   {isArabic 
                     ? "بناءً على اتجاهات الميزانية الحالية، نوصي بتحسين الإنفاق في قسم المسؤولية الاجتماعية." 
                     : "Based on current budget trends, we recommend optimizing Community spending for Q3."}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Drill-down Detail View */}
      {selectedDept && (
        <DepartmentDetailView
          isOpen={true}
          onOpenChange={(open) => !open && setSelectedDept(null)}
          deptCode={selectedDept.code}
          deptNameEn={selectedDept.en}
          deptNameAr={selectedDept.ar}
        />
      )}
    </DashboardShell>
  );
}
