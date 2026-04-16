import type { Metadata } from "next";
import { Mulish, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { Providers } from "./providers";
import { getMessages } from "next-intl/server";
import { PerformanceProvider } from "@/providers/PerformanceProvider";
import { DemoProvider } from "@/providers/DemoProvider";

const mulish = Mulish({ 
  subsets: ["latin"], 
  variable: "--font-mulish",
  display: "swap",
  weight: ["400", "500", "700", "900"]
});

const tajawal = Tajawal({ 
  subsets: ["arabic"], 
  variable: "--font-tajawal",
  display: "swap",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: {
    template: "%s | ClubOS",
    default: "ClubOS – منصة الأكاديميات الرياضية",
  },
  description:
    "نظام إدارة الأكاديميات الرياضية متعدد المستأجرين | ClubOS Multi-tenant Sports Academy Management",
  keywords: ["ClubOS", "sports academy", "Saudi Arabia", "رياضة", "أكاديمية"],
  authors: [{ name: "ClubOS Team" }],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const direction = locale === "ar-SA" ? "rtl" : "ltr";

  return (
    <html 
      lang={locale} 
      dir={direction} 
      className={`${mulish.variable} ${tajawal.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen antialiased bg-background font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DemoProvider>
            <PerformanceProvider>
              <Providers>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1">{children}</main>
                  <footer className="py-6 border-t border-border bg-muted/30">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                      <p dir="rtl" className="mb-2">
                        بيانات العرض تجريبية. يدعم النشر الإنتاجي الاستضافة في المملكة العربية السعودية (Edge/On-prem).
                      </p>
                      <p>
                        Demo data simulated. Production deployment supports on-prem/edge Saudi hosting.
                      </p>
                      <p className="mt-2 text-[10px] opacity-70">
                        Audit-ready | CMA/Tadawul Standard Compliant Simulation
                      </p>
                    </div>
                  </footer>
                </div>
              </Providers>
            </PerformanceProvider>
          </DemoProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
