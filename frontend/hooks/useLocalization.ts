"use client";

import { useCallback } from "react";
import { useLocale } from "@/lib/store/useStore";
import { getDirection, formatDate, formatNumber, formatSAR } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * useLocalization — locale/direction state + formatting utilities.
 * Reads from Zustand (persisted) and applies document-level dir attribute.
 */
export function useLocalization() {
  const { locale, direction, setLocale } = useLocale();

  const switchLocale = useCallback(
    (next: Locale) => {
      setLocale(next);
      // Update the HTML dir/lang attributes for RTL rendering
      if (typeof document !== "undefined") {
        document.documentElement.dir  = getDirection(next);
        document.documentElement.lang = next;
      }
    },
    [setLocale]
  );

  const isRTL    = direction === "rtl";
  const isArabic = locale === "ar-SA";

  /** Pick the right field from a bilingual object. */
  const t = useCallback(
    (en: string, ar: string) => (isArabic ? ar : en),
    [isArabic]
  );

  /** Format a date in AST. */
  const fmtDate = useCallback(
    (iso: string, opts?: Intl.DateTimeFormatOptions) => formatDate(iso, locale, opts),
    [locale]
  );

  /** Format a plain number. */
  const fmtNum = useCallback(
    (n: number) => formatNumber(n, locale),
    [locale]
  );

  /** Format SAR currency. */
  const fmtSAR = useCallback(
    (n: number) => formatSAR(n, locale),
    [locale]
  );

  return {
    locale,
    direction,
    isRTL,
    isArabic,
    switchLocale,
    t,
    fmtDate,
    fmtNum,
    fmtSAR,
  };
}
