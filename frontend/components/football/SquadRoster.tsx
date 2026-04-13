"use client";

import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { User, Activity, AlertCircle, Calendar } from "lucide-react";
import type { Member } from "@/types";

interface SquadRosterProps {
  players: Member[];
  isLoading?: boolean;
}

export function SquadRoster({ players, isLoading }: SquadRosterProps) {
  const { isArabic, fmtDate } = useLocalization();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card h-48 animate-pulse bg-slate-50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {players.map((player) => (
        <div key={player.id} className="card group hover:shadow-card-hover transition-all cursor-pointer overflow-hidden border-brand-100">
          <div className="p-5 flex items-start gap-4">
            {/* Player Avatar Placeholder */}
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100 group-hover:bg-brand-100 transition-colors">
              <User className="w-8 h-8 text-brand-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xs font-bold text-brand-500 uppercase tracking-wider">
                  #{player.id.slice(0, 2)}
                </span>
                <StatusBadge status={player.status} />
              </div>
              <h3 className="text-base font-bold text-ink truncate mt-1">
                {isArabic ? player.fullNameAr : player.fullNameEn}
              </h3>
              <p className="text-xs font-medium text-ink-faint">
                {player.academyNameEn}
              </p>
            </div>
          </div>

          <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-2xs font-semibold text-ink-muted">
              <Activity className="w-3 h-3 text-brand-500" />
              {player.role}
            </div>
            <div className="flex items-center gap-1.5 text-2xs font-semibold text-ink-muted">
              <Calendar className="w-3 h-3 text-brand-500" />
              {fmtDate(player.createdAt, { dateStyle: "short" })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { isArabic } = useLocalization();
  const styles = {
    Active:    "bg-success-light text-success border-success/20",
    Injured:   "bg-danger-light text-danger border-danger/20",
    Inactive:  "bg-slate-100 text-slate-500 border-slate-200",
    default:   "bg-info-light text-info border-info/20",
  };

  const labels = {
    Active:    isArabic ? "نشط" : "Active",
    Injured:   isArabic ? "مصاب" : "Injured",
    Inactive:  isArabic ? "غير نشط" : "Inactive",
  };

  const currentStyle = styles[status as keyof typeof styles] || styles.default;
  const currentLabel = labels[status as keyof typeof labels] || status;

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", currentStyle)}>
      {currentLabel}
    </span>
  );
}
