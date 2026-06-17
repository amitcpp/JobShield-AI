import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobShield AI — Detect Job Scams Instantly",
  description:
    "AI-powered scam detection for job seekers. Analyze suspicious job emails, WhatsApp messages, LinkedIn offers, and recruiter communications to protect yourself from fraud.",
  keywords: [
    "job scam detector",
    "fake job offer",
    "scam detection",
    "AI job analysis",
    "phishing detection",
    "job fraud protection",
  ],
  openGraph: {
    title: "JobShield AI — Detect Job Scams Instantly",
    description:
      "Protect yourself from fake job offers with AI-powered scam detection.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "#111827",
          colorForeground: "#F8FAFC",
          colorPrimary: "#6366F1",
          colorInput: "#1E293B",
          colorInputForeground: "#F8FAFC",
          colorNeutral: "#F8FAFC",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} dark`}>
        <body className="min-h-screen bg-background text-foreground font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
