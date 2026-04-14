import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["ar-SA", "en-US"],

  // Used when no locale matches
  defaultLocale: "ar-SA",
  
  // Use "always" for clean URL routing as planned in the dashboard structure
  localePrefix: "always"
});

// Lightweight wrappers around Next.js navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
