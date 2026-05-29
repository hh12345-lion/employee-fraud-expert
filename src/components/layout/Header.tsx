"use client";

import Link from "next/link";
import { useState } from "react";
import { NavDropdown } from "./NavDropdown";
import {
  navServiceDropdownLinks,
  navFraudTypeLinks,
  navCaseTypeLinks,
  whoWeHelpItems,
  navResourcesDropdownLinks,
  mobileGroups,
} from "@/data/nav";

export function Header() {
  const [open, setOpen] = useState(false);
  const closeMobile = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
      <div className="mx-auto flex min-w-0 max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="min-w-0 shrink truncate text-base font-bold text-primary sm:text-lg"
          onClick={closeMobile}
        >
          Employee<span className="text-highlight">Fraud</span>Expert
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex"
          aria-label="Main"
        >
          <Link
            href="/"
            className="rounded px-2 py-2 text-sm text-body transition-colors hover:bg-section-alt hover:text-primary"
          >
            Home
          </Link>
          <NavDropdown
            label="Services"
            href="/services"
            items={navServiceDropdownLinks}
          />
          <NavDropdown
            label="Fraud Types"
            href="/fraud-types"
            items={navFraudTypeLinks}
          />
          <NavDropdown
            label="Who We Help"
            href="/who-we-help"
            items={whoWeHelpItems}
          />
          <Link
            href="/investigation-process"
            className="rounded px-2 py-2 text-sm text-body transition-colors hover:bg-section-alt hover:text-primary"
          >
            Investigation Process
          </Link>
          <NavDropdown
            label="Case Types"
            href="/case-types"
            items={navCaseTypeLinks}
          />
          <NavDropdown
            label="Resources"
            href="/guides"
            items={navResourcesDropdownLinks}
          />
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/contact"
            className="hidden min-h-[44px] items-center rounded bg-highlight px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b45309] sm:px-4 lg:inline-flex"
          >
            Contact Us
          </Link>

          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-border p-2 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-border bg-white xl:hidden"
          aria-label="Mobile"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {mobileGroups.map((group) => (
              <div key={group.title} className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="block min-h-[44px] rounded px-3 py-2.5 text-sm text-body hover:bg-section-alt"
                        onClick={closeMobile}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              href="/contact"
              className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded bg-highlight px-4 py-3 text-sm font-semibold text-white hover:bg-[#b45309]"
              onClick={closeMobile}
            >
              Contact Us
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
