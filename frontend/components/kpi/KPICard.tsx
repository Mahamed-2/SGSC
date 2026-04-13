import { usePerformance } from "@/providers/PerformanceProvider";
import dynamic from "next/dynamic";

// Dynamic import for Recharts to split the bundle
const Sparkline = dynamic(
  () => import("recharts").then((mod) => {
    const { LineChart, Line, ResponsiveContainer } = mod;
    return function SparklineComponent({ data, status }: { data: any[]; status: string }) {
      return (
        <div className="flex-1 h-10 -ml-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="val"
                stroke={status === "danger" ? "#dc2626" : "#2d9e2d"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    };
  }),
  { 
    ssr: false, 
    loading: () => <div className="flex-1 h-10 bg-slate-50 dark:bg-dark-bg/50 rounded animate-pulse" /> 
  }
);

interface KPICardProps {
  labelEn: string;
  labelAr: string;
  value: string | number;
  unit?: string;
  trend: "Up" | "Down" | "Stable";
  status: "success" | "warning" | "danger";
  icon: LucideIcon;
  sparklineData?: { val: number }[];
  onClick?: () => void;
}

/**
 * KPICard — Modern dashboard card with sparkline and status indicators.
 * Optimized for Al-Faisaly green/white aesthetic + Performance.
 */
export function KPICard({
  labelEn, labelAr, value, unit, trend, status, icon: Icon, sparklineData, onClick
}: KPICardProps) {
  const { isArabic, fmtNum } = useLocalization();
  const { lowBandwidthMode } = usePerformance();

  const trendIcons = {
    Up:     <TrendingUp className="w-4 h-4 text-success" />,
    Down:   <TrendingDown className="w-4 h-4 text-danger" />,
    Stable: <Minus className="w-4 h-4 text-slate-400" />,
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-card transition-all cursor-pointer",
        "hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.98]",
        "dark:bg-dark-surface dark:border-dark-border"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg group-hover:bg-brand-50 transition-colors">
          <Icon className="w-5 h-5 text-ink-muted group-hover:text-brand-500" />
        </div>
        
        {/* Status dot */}
        <div className={cn("w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-dark-surface", {
          "bg-success": status === "success",
          "bg-warning": status === "warning",
          "bg-danger":  status === "danger",
        })} />
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-sm font-medium text-ink-muted truncate">
          {isArabic ? labelAr : labelEn}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-ink tracking-tight">
            {typeof value === "number" ? fmtNum(value) : value}
          </span>
          {unit && <span className="text-xs font-semibold text-ink-faint uppercase">{unit}</span>}
        </div>
      </div>

      {/* Sparkline & Trend — Deferred and conditional */}
      <div className="mt-4 flex items-center justify-between gap-4">
        {sparklineData && !lowBandwidthMode ? (
          <Sparkline data={sparklineData} status={status} />
        ) : (
          <div className="flex-1 border-t border-dashed border-slate-100 dark:border-dark-border my-5" />
        )}
        
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-dark-bg">
          {trendIcons[trend]}
        </div>
      </div>

      {/* Background glow on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-brand-500/10 pointer-events-none" />
    </div>
  );
}

export function KPIGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}
