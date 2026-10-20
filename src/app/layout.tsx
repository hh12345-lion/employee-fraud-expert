import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentDefaultsScript } from "@/components/cookies/ConsentDefaultsScript";
import { CookieConsentRoot } from "@/components/cookies/CookieConsentRoot";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";

const heading = localFont({
  src: [{ path: "./fonts/maven-pro.woff2", weight: "400 900", style: "normal" }],
  variable: "--font-heading",
  display: "swap",
});

const body = localFont({
  src: [{ path: "./fonts/pontano-sans.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-body",
  display: "swap",
});

// Every page is rendered on the server for each request.
export const dynamic = "force-dynamic";

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
    <html lang="en-US" className={`${heading.variable} ${body.variable} h-full`}>
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
