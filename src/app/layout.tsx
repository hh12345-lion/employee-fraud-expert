import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentDefaultsScript } from "@/components/cookies/ConsentDefaultsScript";
import { CookieConsentRoot } from "@/components/cookies/CookieConsentRoot";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = createMetadata({
  title:
    "Employee Fraud Expert Witness | Forensic Accountants for Workplace Fraud",
  description:
    "Connect with qualified forensic accountants for employee fraud investigation and expert witness services. Embezzlement, payroll fraud, expense fraud, and civil recovery support for employers and attorneys.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={`${dmSans.variable} ${sourceSerif.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <ConsentDefaultsScript />
        <CookieConsentRoot>
          <Header />
          <main className="min-w-0 flex-1">{children}</main>
          <Footer />
        </CookieConsentRoot>
      </body>
    </html>
  );
}
