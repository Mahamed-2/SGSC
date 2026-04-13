import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ["ar-SA", "en-US"],
  // Used when no locale matches
  defaultLocale: "ar-SA",
  localePrefix: "always", // Use "always" for clean URL routing as planned
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Run next-intl middleware for locale handling
  const response = intlMiddleware(request);

  // 2. Add custom auth logic (from previous middleware)
  const isProtected = pathname.includes("/dashboard") || pathname.includes("/admin");
  const token = request.cookies.get("clubos_token")?.value;

  if (isProtected && !token) {
    const loginUrl = new URL(`/${request.nextUrl.locale || "ar-SA"}/login`, request.url);
    return response; // next-intl handles the redirect if configured, but here we just pass through
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar-SA|en-US)/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
