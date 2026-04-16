"use client";

import { useLocale } from "next-intl";
import { useMemo } from "react";

/**
 * useRTL — detection and logic for RTL mirroring.
 */
export function useRTL() {
  const locale = useLocale();
  const isRTL = locale === "ar-SA";
  
  return {
    isRTL,
    dir: isRTL ? "rtl" : "ltr",
    // Utility class for mirroring icons
    flipClass: isRTL ? "-scale-x-100" : "",
  };
}

/**
 * useFormattedDate — Saudi-specific date logic (AST + Hijri).
 */
export function useFormattedDate() {
  const locale = useLocale();

  const formatGregorian = (date: Date | string, opts: Intl.DateTimeFormatOptions = { dateStyle: "long" }) => {
    return new Intl.DateTimeFormat(locale, {
      ...opts,
      timeZone: "Asia/Riyadh",
    }).format(new Date(date));
  };

  const formatHijri = (date: Date | string, opts: Intl.DateTimeFormatOptions = { dateStyle: "long" }) => {
    return new Intl.DateTimeFormat(locale + "-u-ca-islamic-uma", {
      ...opts,
      timeZone: "Asia/Riyadh",
    }).format(new Date(date));
  };

  return { formatGregorian, formatHijri };
}

/**
 * useCurrency — SAR formatting with Western Arabic numerals as requested.
 */
export function useCurrency() {
  const formatSAR = (amount: number) => {
    // Force English locale for numerals if Western Arabic (1,2,3) is strictly required 
    // but usually Intl with ar-SA already uses 1,2,3 in many modern environments 
    // unless configured otherwise. We'll use a formatter that ensures clean output.
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount).replace("SAR", "ر.س");
  };

  return { formatSAR };
}

/**
 * useLocalization — General localization utilities.
 */
export function useLocalization() {
  const locale = useLocale();
  const isArabic = locale === "ar-SA";

  const fmtNum = (num: number) => {
    return new Intl.NumberFormat(locale).format(num);
  };

  return { isArabic, fmtNum };
}
