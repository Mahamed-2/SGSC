import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Direction, Locale, UserRole } from "@/types";

/** Merge Tailwind classes safely (resolves conflicts). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Return "rtl" for Arabic locale, "ltr" otherwise. */
export function getDirection(locale: Locale): Direction {
  return locale === "ar-SA" ? "rtl" : "ltr";
}

/** Format numbers with locale-aware grouping (e.g. 1,523 vs ١٬٥٢٣). */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Format currency in SAR with Western Arabic numerals (1, 2, 3). */
export function formatSAR(value: number, locale: Locale): string {
  const formatter = new Intl.NumberFormat(locale === "ar-SA" ? "en-US" : locale, {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
  });
  
  const formatted = formatter.format(value);
  return locale === "ar-SA" ? formatted.replace("SAR", "ر.س") : formatted;
}

/** Format a date in Saudi timezone (AST = UTC+3). */
export function formatDate(
  isoString: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: "Asia/Riyadh",
  }).format(new Date(isoString));
}

/** Format a date in Saudi Hijri (Umm al-Qura). */
export function formatHijri(
  isoString: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" }
): string {
  return new Intl.DateTimeFormat(locale + "-u-ca-islamic-uma", {
    ...options,
    timeZone: "Asia/Riyadh",
  }).format(new Date(isoString));
}

/** Truncate text with ellipsis. */
export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
}

/** Check if a user role has permission. */
export function hasRole(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  const hierarchy: UserRole[] = [
    "SystemAdmin", "TenantAdmin", "AcademyManager", "Coach", "Staff",
  ];
  const userLevel     = hierarchy.indexOf(userRole);
  const requiredLevel = Math.min(...requiredRoles.map(r => hierarchy.indexOf(r)));
  return userLevel <= requiredLevel;
}

/** Compute trend badge: positive number = up, negative = down. */
export function getTrend(current: number, previous: number) {
  if (previous === 0) return { trend: "flat" as const, pct: 0 };
  const pct = ((current - previous) / previous) * 100;
  return {
    trend: pct > 0.5 ? "up" : pct < -0.5 ? "down" : "flat",
    pct:   Math.abs(pct),
  } as { trend: "up" | "down" | "flat"; pct: number };
}

/** KPI type → display label */
export const kpiLabelMap: Record<string, { en: string; ar: string; unit?: string }> = {
  AttendanceRate:           { en: "Attendance Rate",       ar: "معدل الحضور",        unit: "%" },
  MemberRetentionRate:      { en: "Member Retention",      ar: "الاحتفاظ بالأعضاء",  unit: "%" },
  RevenueMonthly:           { en: "Monthly Revenue",       ar: "الإيرادات الشهرية",   unit: "SAR" },
  FeedbackSatisfactionScore:{ en: "Satisfaction Score",    ar: "نقاط الرضا",           unit: "/10" },
  CoachToPlayerRatio:       { en: "Coach : Player Ratio",  ar: "نسبة المدرب للاعب",    unit: ":1" },
  InjuryRate:               { en: "Injury Rate",           ar: "معدل الإصابات",        unit: "%" },
  TournamentWinRate:        { en: "Tournament Win Rate",   ar: "معدل الفوز",           unit: "%" },
  TrainingHoursPerWeek:     { en: "Training Hours / Week", ar: "ساعات التدريب أسبوعياً", unit: "h" },
  ActiveMemberCount:        { en: "Active Members",        ar: "الأعضاء النشطون",      unit: "" },
  ChurnRate:                { en: "Churn Rate",            ar: "معدل التسرب",           unit: "%" },
};
