"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

// Suppress React 19 "Encountered a script tag while rendering React component" warning 
// which is triggered by next-themes injecting a script for theme flashing prevention.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" && 
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError(...args);
  };
}

// Suppress React 19 "Encountered a script tag while rendering React component" warning 
// which is triggered by next-themes injecting a script for theme flashing prevention.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" && 
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError(...args);
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          60_000,
      retry:              1,
      refetchOnWindowFocus: false,
    },
  },
});

async function initMocks() {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_MOCKS_ENABLED !== "true") return;
  const { worker } = await import("@/mocks/browser");
  await worker.start({ 
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js"
    }
  });

}

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initMocks().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
