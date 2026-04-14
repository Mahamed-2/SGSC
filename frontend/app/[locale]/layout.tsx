import type { Metadata } from "next";
import "../globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | ClubOS",
    default:  "ClubOS – منصة الأكاديميات الرياضية",
  },
  description:
    "نظام إدارة الأكاديميات الرياضية متعدد المستأجرين | ClubOS Multi-tenant Sports Academy Management",
  keywords: ["ClubOS", "sports academy", "Saudi Arabia", "رياضة", "أكاديمية"],
  authors: [{ name: "ClubOS Team" }],
};

import { getMessages } from "next-intl/server";
import { PerformanceProvider } from "@/providers/PerformanceProvider";
import { DemoProvider } from "@/providers/DemoProvider";

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
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DemoProvider>
            <PerformanceProvider>
              <Providers>{children}</Providers>
            </PerformanceProvider>
          </DemoProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
