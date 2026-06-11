import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

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
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
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
      </body>
    </html>
  );
}
