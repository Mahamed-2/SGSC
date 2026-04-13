"use client";

import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Calendar, UserCheck, AlertTriangle, FileText } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "training" | "medical" | "contract" | "alert";
  titleEn: string;
  titleAr: string;
  time: string;
  category: "Football" | "Medical" | "Finance" | "HR";
}

const mockEvents: TimelineEvent[] = [
  { id: "1", type: "training", titleEn: "U-17 Tactical Training", titleAr: "تدريب تكتيكي تحت 17", time: "16:30", category: "Football" },
  { id: "2", type: "medical", titleEn: "Player A Medical Clearance", titleAr: "فحص طبي للاعب أ", time: "18:00", category: "Medical" },
  { id: "3", type: "alert", titleEn: "Budget Threshold Warning", titleAr: "تحذير ميزانية القسم", time: "09:00", category: "Finance" },
  { id: "4", type: "contract", titleEn: "Coach X Renewal Due", titleAr: "تجديد عقد المدرب س", time: "11:00", category: "HR" },
];

export function ActivityTimeline() {
  const { isArabic, isRTL } = useLocalization();

  const icons = {
    training: <Calendar className="w-3.5 h-3.5" />,
    medical:  <UserCheck className="w-3.5 h-3.5" />,
    alert:    <AlertTriangle className="w-3.5 h-3.5" />,
    contract: <FileText className="w-3.5 h-3.5" />,
  };

  const colors = {
    training: "text-blue-600 bg-blue-50",
    medical:  "text-emerald-600 bg-emerald-50",
    alert:    "text-amber-600 bg-amber-50",
    contract: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="card p-5 h-full flex flex-col gap-5 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">{isArabic ? "النشاط المباشر" : "Live Activity"}</h3>
        <span className="text-2xs font-bold text-brand-500 uppercase">AST Timezone</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 relative pr-2">
        {/* Timeline line */}
        <div className={cn(
          "absolute top-0 bottom-0 w-px bg-slate-100 dark:bg-dark-border",
          isRTL ? "right-[19px]" : "left-[19px]"
        )} />

        {mockEvents.map((event) => (
          <div key={event.id} className="relative flex items-start gap-4">
            <div className={cn(
              "z-10 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white dark:border-dark-surface",
              colors[event.type]
            )}>
              {icons[event.type]}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-ink truncate leading-tight">
                  {isArabic ? event.titleAr : event.titleEn}
                </p>
                <span className="text-xs font-medium text-ink-faint shrink-0">{event.time}</span>
              </div>
              <p className="text-2xs font-semibold text-ink-faint uppercase mt-1">
                {event.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
