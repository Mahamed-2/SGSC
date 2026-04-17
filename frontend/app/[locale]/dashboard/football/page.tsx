"use client";

import { useState, useEffect } from "react";
import { useLocalization } from "@/hooks/useLocalization";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SquadRoster } from "@/components/football/SquadRoster";
import { LineupBuilder } from "@/components/football/LineupBuilder";
import { 
  Trophy, Users, PlayCircle, ClipboardList, 
  Settings, Search, Filter, ArrowUpRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FootballDashboard() {
  const { isArabic, t } = useLocalization();
  const [activeTab, setActiveTab] = useState<"squad" | "tactics" | "drills">("squad");
  const [matchStats, setMatchStats] = useState({ possession: 52, shots: 8, goals: 0 });

  // Polling Mock for Match Stats
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchStats(prev => ({
        ...prev,
        shots: prev.shots + (Math.random() > 0.8 ? 1 : 0),
        possession: Math.max(45, Math.min(60, prev.possession + (Math.random() * 2 - 1)))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "squad",   en: "Squad Roster", ar: "قائمة الفريق", icon: Users },
    { id: "tactics", en: "Tactics & Lineup", ar: "التكتيك والتشكيل", icon: ClipboardList },
    { id: "drills",  en: "Drill Library", ar: "مكتبة التمارين", icon: PlayCircle },
  ];

  return (
    <DashboardShell
      title={{ en: "Football Operations", ar: "العمليات الكروية" }}
      subtitle={{ en: "Al-Faisaly First Team Hub", ar: "مركز الفريق الأول لنادي الفيصلي" }}
      actions={
        <div className="flex gap-2">
          <button className="btn btn-secondary flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent-gold" />
            {isArabic ? "المباراة القادمة" : "Next Match"}
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* 1. Live Match Mini-Tracker (Polling Demo) */}
        <div className="card p-6 bg-brand-900 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-black">0 - 0</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Live Simulation</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="flex gap-6">
              <StatItem label={t("Possession", "الاستحواذ")} val={`${Math.round(matchStats.possession)}%`} />
              <StatItem label={t("Shots", "التسديدات")} val={matchStats.shots.toString()} />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-3">
             <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
             <span className="text-xs font-bold uppercase">{isArabic ? "مباشر" : "Live"}</span>
          </div>
          {/* Subtle logo bg */}
          <Trophy className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-5 rotate-12" />
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-surface-border">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-4 text-sm font-bold transition-all relative",
                  activeTab === tab.id 
                    ? "text-brand-500" 
                    : "text-ink-faint hover:text-ink-muted"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {isArabic ? tab.ar : tab.en}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 pb-2 text-ink-faint">
            <Search className="w-4 h-4 cursor-pointer hover:text-ink-muted" />
            <Filter className="w-4 h-4 cursor-pointer hover:text-ink-muted" />
            <div className="h-4 w-px bg-surface-border" />
            <Settings className="w-4 h-4 cursor-pointer hover:text-ink-muted" />
          </div>
        </div>


        {/* 3. Tab Content */}
        <div className="animate-fade-up">
          {activeTab === "squad" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink">{isArabic ? "قائمة اللاعبين" : "Active Squad"}</h2>
                <button className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:underline">
                  {isArabic ? "طلب انتقالات" : "Request Transfers"} <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <SquadRoster players={[]} isLoading={false} /> {/* Data would be fetched from API in real env */}
            </div>
          )}

          {activeTab === "tactics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LineupBuilder />
              <div className="card p-6 space-y-6">
                <h3 className="font-bold text-ink">{isArabic ? "ملاحظات تكتيكية" : "Tactical Briefing"}</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-surface-muted rounded-xl border-l-4 border-accent-gold">
                    <p className="text-xs font-bold text-ink-faint uppercase">Opposition Analysis (Al-Batin)</p>
                    <p className="text-sm mt-1">Al-Batin transition slowly in wide areas. Exploit via RW/LW pace.</p>
                  </div>
                  <div className="p-4 bg-surface-muted rounded-xl border-l-4 border-brand-500">
                    <p className="text-xs font-bold text-ink-faint uppercase">Set Piece Strategy</p>
                    <p className="text-sm mt-1">Corners to near-post for CB1. Defensive wall to stay compact.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "drills" && (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-muted rounded-3xl border-2 border-dashed border-surface-border">
              <PlayCircle className="w-12 h-12 text-ink-faint mb-4 opacity-50" />
              <p className="font-bold text-ink-muted">{isArabic ? "مكتبة التمارين قيد التحديث" : "Drill Library updating..."}</p>
              <p className="text-xs text-ink-faint mt-1">Integration with YouTube active.</p>
            </div>
          )}

        </div>
      </div>
    </DashboardShell>
  );
}

function StatItem({ label, val }: { label: string, val: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase opacity-60 tracking-wider mb-0.5">{label}</p>
      <p className="text-lg font-bold">{val}</p>
    </div>
  );
}
