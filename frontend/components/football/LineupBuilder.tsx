"use client";

import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { User, Move, Check } from "lucide-react";
import { useState } from "react";

interface Position {
  id: string;
  x: number;
  y: number;
  label: string;
}

const DEFAULT_LINEUP: Position[] = [
  { id: "GK",  x: 50, y: 90, label: "GK" },
  { id: "LB",  x: 15, y: 70, label: "LB" },
  { id: "CB1", x: 38, y: 75, label: "CB" },
  { id: "CB2", x: 62, y: 75, label: "CB" },
  { id: "RB",  x: 85, y: 70, label: "RB" },
  { id: "CM1", x: 30, y: 50, label: "CM" },
  { id: "CM2", x: 70, y: 50, label: "CM" },
  { id: "CAM", x: 50, y: 35, label: "CAM" },
  { id: "LW",  x: 20, y: 20, label: "LW" },
  { id: "RW",  x: 80, y: 20, label: "RW" },
  { id: "ST",  x: 50, y: 10, label: "ST" },
];

export function LineupBuilder() {
  const { isArabic, isRTL } = useLocalization();
  const [lineup, setLineup] = useState(DEFAULT_LINEUP);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="card p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-ink">
            {isArabic ? "مخطط التشكيلة" : "Tactical Lineup"}
          </h3>
          <p className="text-sm font-medium text-ink-faint">Formation: 4-2-3-1</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary py-1.5 px-3 text-xs bg-slate-100 hover:bg-slate-200 border-none">
            {isArabic ? "حفظ كقالب" : "Save Template"}
          </button>
        </div>
      </div>

      {/* SVG Pitch */}
      <div className="relative aspect-[3/4] bg-brand-600 rounded-2xl overflow-hidden border-8 border-brand-700 shadow-inner">
        {/* Grass Texture Effect */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.2) 50px, rgba(0,0,0,0.2) 100px)"
        }} />

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {/* Pitch Lines */}
          <rect x="5" y="5" width="90" height="90" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
          
          {/* Penalty Areas */}
          <rect x="25" y="5" width="50" height="15" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
          <rect x="25" y="80" width="50" height="15" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />

          {/* Players */}
          {lineup.map((pos) => (
            <g 
              key={pos.id} 
              className="cursor-pointer group"
              onClick={() => setSelectedId(pos.id)}
            >
              <circle 
                cx={pos.x} 
                cy={pos.y} 
                r="4.5" 
                className={cn(
                  "transition-all duration-300",
                  selectedId === pos.id ? "fill-accent-gold" : "fill-white group-hover:fill-slate-100"
                )} 
              />
              <text 
                x={pos.x} 
                y={pos.y + 1} 
                textAnchor="middle" 
                className="text-[3px] font-bold fill-brand-900 pointer-events-none"
              >
                {pos.id}
              </text>
              <text 
                x={pos.x} 
                y={pos.y + 8} 
                textAnchor="middle" 
                className="text-[2.5px] font-bold fill-white/80 uppercase pointer-events-none"
              >
                {selectedId === pos.id && (isArabic ? "لاعب محدد" : "Selected")}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend/Selector */}
        <div className={cn(
          "absolute bottom-4 flex flex-col gap-2 p-3 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-lg scale-90",
          isRTL ? "right-4" : "left-4"
        )}>
          <p className="text-[10px] font-bold text-brand-700 uppercase">{isArabic ? "تعديل المركز" : "Edit Position"}</p>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-600" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl border border-brand-100">
        <div className="p-2 bg-brand-100 rounded-lg">
          <Check className="w-4 h-4 text-brand-600" />
        </div>
        <p className="text-xs font-medium text-brand-800">
          {isArabic 
            ? "تم حفظ التغييرات التكتيكية لمباراة الفتح." 
            : "Tactical changes saved for Al-Batin match."}
        </p>
      </div>
    </div>
  );
}
