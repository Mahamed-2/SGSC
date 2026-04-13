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
  Users, Trophy, Landmark, Heart pulse, 
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
    { code: "MEDICAL", en: "Medical", ar: "القسم الطبي", val: 71, unit: "%", trend: "Down", status: "warning", icon: Heart pulse },
    { code: "FINANCE", en: "Finance", ar: "المالية", val: 89, unit: "SAR", trend: "Up", status: "success", icon: Landmark },
    { code: "HR", en: "Human Resources", ar: "الموارد البشرية", val: 72, unit: "%", trend: "Stable", status: "warning", icon: Users },
    { code: "STRATEGY", en: "Strategy", ar: "الاستراتيجية", val: 95, unit: "%", trend: "Up", status: "success", icon: FileCheck },
    { code: "COMMUNITY", en: "Community", ar: "المسؤولية الاجتماعية", val: 64, unit: "Pts", trend: "Down", status: "danger", icon: ArrowRightLeft },
  ];

  const { isDemoMode, toggleDemoMode } = useDemo();
  
  const [selectedDept, setSelectedDept] = useState<{ code: string; en: string; ar: string } | null>(null);

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
          <button 
            onClick={() => exportAsPDF()}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير التقرير" : "Export Report"}
          </button>
        </div>
      }
    >
      <DemoTour />
      <div ref={exportRef} className="space-y-8 pb-10">
        {/* 1. Executive Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold">{t("Strategic Overview", "النظرة الاستراتيجية")}</h2>
              <p className="opacity-80 mt-1 max-w-md">
                {isArabic 
                  ? "أداء نادي الفيصلي مقارنة بالأهداف الاستراتيجية لعام 2026." 
                  : "Al-Faisaly performance vs 2026 Strategic Objectives."}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 relative z-10">
              {quickStats.map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <stat.icon className="w-5 h-5 text-amber-400 mb-2" />
                  <p className="text-xs font-medium opacity-70 uppercase tracking-tighter">{stat.label}</p>
                  <p className="text-xl font-bold mt-1">{stat.val}</p>
                </div>
              ))}
            </div>

            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="card p-6 flex items-center justify-center bg-white dark:bg-dark-surface shadow-glow">
            <ClubHealthGauge score={mockHealthScore.totalScore} />
          </div>
        </div>

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">{t("Department Performance", "أداء الأقسام")}</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-2xs font-bold text-ink-faint">
                  <span className="w-2 h-2 rounded-full bg-success" /> {isArabic ? "على المسار" : "On Track"}
                </span>
                <span className="flex items-center gap-1.5 text-2xs font-bold text-ink-faint">
                  <span className="w-2 h-2 rounded-full bg-warning" /> {isArabic ? "تحت المراقبة" : "At Risk"}
                </span>
              </div>
            </div>

            <KPIGrid>
              {departments.map((dept) => (
                <KPICard
                  key={dept.code}
                  labelEn={dept.en}
                  labelAr={dept.ar}
                  value={dept.val}
                  unit={dept.unit}
                  trend={dept.trend as any}
                  status={dept.status as any}
                  icon={dept.icon}
                  sparklineData={[
                    { val: 40 }, { val: 65 }, { val: 55 }, { val: 80 }, { val: 75 }, { val: 90 }
                  ]}
                  onClick={() => setSelectedDept(dept)}
                />
              ))}
            </KPIGrid>
          </div>

          {/* 3. Sidebar Timeline */}
          <div className="xl:col-span-1 min-h-[500px]">
            <ActivityTimeline />
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
