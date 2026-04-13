"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/providers/DemoProvider";
import { useLocalization } from "@/hooks/useLocalization";

interface TourStep {
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  targetId: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    titleEn: "Strategic Dashboard",
    titleAr: "لوحة التحكم الاستراتيجية",
    bodyEn: "View Al-Faisaly's progress against 2026 strategic goals here.",
    bodyAr: "شاهد تقدم نادي الفيصلي مقابل الأهداف الاستراتيجية لعام 2026 هنا.",
    targetId: "main-content",
  },
  {
    titleEn: "Persona Switcher",
    titleAr: "مبدل الشخصيات",
    bodyEn: "Seamlessly switch between Coach, Admin, and Board views.",
    bodyAr: "بدّل بسلاسة بين وجهات نظر المدرب والمسؤول ومجلس الإدارة.",
    targetId: "persona-switcher",
  },
  {
    titleEn: "Performance Alerts",
    titleAr: "تنبيهات الأداء",
    bodyEn: "Real-time indicators for department health and compliance.",
    bodyAr: "مؤشرات فورية لصحة القسم والامتثال.",
    targetId: "kpi-grid",
  },
];

/**
 * DemoTour — Custom interactive onboarding for the Al-Faisaly showcase.
 * Zero-dependency, RTL-compliant, and brand-styled.
 */
export function DemoTour() {
  const { isDemoMode } = useDemo();
  const { isArabic, isRTL } = useLocalization();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show tour when demo mode is toggled ON for the first time in this session
    if (isDemoMode) {
      const hasSeen = sessionStorage.getItem("clubos_demo_tour_seen");
      if (!hasSeen) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
    }
  }, [isDemoMode]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("clubos_demo_tour_seen", "true");
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Overlay backdrop */}
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]" />
      
      {/* Tour Bubble */}
      <div 
        className={cn(
          "absolute bottom-10 right-10 w-[340px] bg-white dark:bg-dark-surface rounded-3xl shadow-2xl p-6 pointer-events-auto border border-brand-100 animate-in fade-in slide-in-from-bottom-4 duration-500",
          isRTL ? "left-10 right-auto" : "right-10"
        )}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-ink-faint hover:text-ink transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold uppercase tracking-wider">
            Step {currentStep + 1} of {TOUR_STEPS.length}
          </div>
          
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-ink">
              {isArabic ? step.titleAr : step.titleEn}
            </h4>
            <p className="text-sm text-ink-muted leading-relaxed">
              {isArabic ? step.bodyAr : step.bodyEn}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    i === currentStep ? "bg-brand-500 w-4" : "bg-brand-200"
                  )} 
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="btn btn-primary rounded-xl px-5 flex items-center gap-2 text-sm"
            >
              {isArabic ? "التالي" : "Next"}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
