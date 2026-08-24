"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/fraud-types", label: "Fraud Types" },
  { href: "/case-types", label: "Case Types" },
  { href: "/who-we-help", label: "Who We Help" },
  { href: "/investigation-process", label: "Process" },
  { href: "/guides", label: "Guides" },
  { href: "/glossary", label: "Glossary" },
  { href: "/qualifications", label: "Qualifications" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6 lg:gap-8 lg:py-5">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-3"
            onClick={close}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent font-serif text-sm font-bold leading-none text-white"
              aria-hidden
            >
              EF
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-serif text-base font-semibold text-heading sm:text-lg">
                Employee Fraud Expert
              </span>
              <span className="block text-[0.65rem] text-body/70 sm:text-xs">
                Forensic referral network
              </span>
            </span>
          </Link>

          <nav
            className="ml-auto hidden flex-wrap items-center justify-end gap-x-1 gap-y-1 text-sm lg:flex"
            aria-label="Main"
          >
            {navLinks.map((item, index) => (
              <span key={item.href} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-1.5 text-border select-none" aria-hidden>
                    ·
                  </span>
                )}
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-body transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </span>
            ))}
            <span className="mx-3 text-border select-none" aria-hidden>
              |
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-accent transition-colors hover:text-primary"
            >
              Enquire
              <span aria-hidden>→</span>
            </Link>
          </nav>

          <button
            type="button"
            className="ml-auto inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center bg-section-alt px-3 text-xs font-semibold uppercase tracking-wider text-heading lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        <div className="h-1 bg-accent" aria-hidden />
      </header>

      {open && (
        <div
          id="site-menu"
          className="fixed inset-0 z-[60] flex flex-col bg-primary lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
            <p className="font-serif text-lg text-white">Navigate</p>
            <button
              type="button"
              className="min-h-11 px-3 text-sm font-medium text-accent"
              onClick={close}
            >
              Close
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-label="Mobile">
            <ul className="space-y-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-14 items-center border-b border-white/10 font-serif text-2xl text-white/90 transition-colors hover:text-accent"
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-white/10 px-4 py-6 sm:px-6">
            <Link
              href="/contact"
              className="flex min-h-14 items-center justify-between bg-accent px-5 font-medium text-primary"
              onClick={close}
            >
              Start an enquiry
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
