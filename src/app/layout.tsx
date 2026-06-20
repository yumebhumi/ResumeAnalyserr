import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "@/components/theme-provider";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { clerkLocalization } from "@/lib/clerk-localization";

import "./globals.css";

export const metadata: Metadata = {
  title: "HireMe AI",
  description:
    "Premium SaaS platform for AI resume analysis, GitHub insights, and instant developer portfolio generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerkConfig = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          {hasClerkConfig ? (
            <ClerkProvider
              appearance={clerkAppearance}
              localization={clerkLocalization}
              signInForceRedirectUrl="/dashboard"
              signInUrl="/sign-in"
              signInFallbackRedirectUrl="/dashboard"
              signUpForceRedirectUrl="/dashboard"
              signUpUrl="/sign-up"
              signUpFallbackRedirectUrl="/dashboard"
            >
              {children}
            </ClerkProvider>
          ) : (
            children
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
