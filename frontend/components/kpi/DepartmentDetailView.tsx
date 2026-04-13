"use client";

import { useLocalization } from "@/hooks/useLocalization";
import * as Dialog from "@radix-ui/react-dialog";
import { X, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { colors } from "@/styles/design-tokens";

interface DepartmentDetailViewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deptCode: string;
  deptNameEn: string;
  deptNameAr: string;
}

const mockChartData = [
  { month: "Jan", val: 65 },
  { month: "Feb", val: 59 },
  { month: "Mar", val: 80 },
  { month: "Apr", val: 81 },
  { month: "May", val: 76 },
  { month: "Jun", val: 85 },
];

export function DepartmentDetailView({
  isOpen, onOpenChange, deptCode, deptNameEn, deptNameAr
}: DepartmentDetailViewProps) {
  const { isArabic, isRTL } = useLocalization();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-[60] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className={cn(
          "fixed inset-y-0 w-full max-w-xl bg-surface shadow-2xl z-[70] p-0 flex flex-col focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in duration-300",
          isRTL 
            ? "left-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left" 
            : "right-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        )}>
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-ink">
                  {isArabic ? deptNameAr : deptNameEn}
                </Dialog.Title>
                <p className="text-sm font-medium text-ink-faint uppercase">{deptCode}</p>
              </div>
            </div>
            <Dialog.Close className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <X className="w-5 h-5 text-ink-muted" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section className="space-y-4">
              <h4 className="font-bold text-ink">{isArabic ? "تحليل الأداء" : "Performance Analysis"}</h4>
              <div className="h-64 card p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.brand.primary} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={colors.brand.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="val" stroke={colors.brand.primary} fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <div className="card p-4 bg-slate-50/50">
                <p className="text-xs font-bold text-ink-faint uppercase">{isArabic ? "معدل التحسن" : "Improvement Rate"}</p>
                <p className="text-xl font-bold text-success">+12.5%</p>
              </div>
              <div className="card p-4 bg-slate-50/50">
                <p className="text-xs font-bold text-ink-faint uppercase">{isArabic ? "حالة الأهداف" : "Objective Status"}</p>
                <p className="text-xl font-bold text-brand-500">8/10</p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/30">
            <button className="w-full btn btn-brand py-3 font-bold">
              {isArabic ? "تحميل التقرير التفصيلي" : "Download Detailed Report"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
