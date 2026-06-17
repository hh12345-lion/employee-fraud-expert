import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UkRegionBanner } from "@/components/layout/UkRegionBanner";
import { ConsentDefaultsScript } from "@/components/cookies/ConsentDefaultsScript";
import { CookieConsentRoot } from "@/components/cookies/CookieConsentRoot";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = createMetadata({
  title:
    "Employee Fraud Expert Witness UK | Forensic Accountants for Workplace Fraud",
  description:
    "UK-only employee fraud expert witness referral service. Find qualified forensic accountants in the United Kingdom for embezzlement, payroll fraud, expense fraud, and civil recovery. Employers and solicitors in England, Wales, Scotland, and Northern Ireland welcome.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <ConsentDefaultsScript />
        <CookieConsentRoot>
          <UkRegionBanner />
          <Header />
          <main className="min-w-0 flex-1">{children}</main>
          <Footer />
        </CookieConsentRoot>
      </body>
    </html>
  );
}
