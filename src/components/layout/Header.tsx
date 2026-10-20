"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  navCaseTypeLinks,
  navFraudTypeLinks,
  navResourcesDropdownLinks,
  navResourcesMenuLinks,
  navServiceDropdownLinks,
  whoWeHelpItems,
} from "@/data/nav";

type NavLink = { href: string; label: string };
type Group = { label: string; href: string; links: NavLink[] };

const groups: Group[] = [
  { label: "Services", href: "/services", links: navServiceDropdownLinks.slice(1) },
  { label: "Fraud types", href: "/fraud-types", links: navFraudTypeLinks.slice(1) },
  { label: "Case types", href: "/case-types", links: navCaseTypeLinks },
  { label: "Who we help", href: "/who-we-help", links: whoWeHelpItems },
  {
    label: "Resources",
    href: "/guides",
    links: [...navResourcesDropdownLinks, ...navResourcesMenuLinks.slice(1)],
  },
];

const simple: NavLink[] = [{ href: "/blog", label: "Blog" }];

function isActive(pathname: string, href: string) {
  const base = href.split("#")[0];
  return pathname === base || pathname.startsWith(base + "/");
}

/** Client only to read the current path; the header is rendered on the server first. */
export function Header() {
  const pathname = usePathname() || "/";
  const groupOn = (g: Group) => isActive(pathname, g.href) || g.links.some((l) => isActive(pathname, l.href));

  const top =
    "relative inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap font-serif text-[0.92rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
  /* The current section is marked by a terracotta dot, like the heads of the figures in the monogram */
  const dot = (on: boolean) =>
    on ? <span aria-hidden="true" className="absolute -bottom-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent" /> : null;

  return (
    <header className="relative z-50 bg-primary text-cream">
      <input key={pathname} id="mobile-nav-toggle" type="checkbox" className="peer sr-only" aria-hidden="true" tabIndex={-1} />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
        <Link href="/" aria-label="Employee Fraud Expert home" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-light.svg" alt="Employee Fraud Expert" width={744} height={120} className="h-9 w-auto sm:h-10" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 xl:flex">
          {groups.map((g) => {
            const on = groupOn(g);
            return (
              <div key={g.label} className="nav-item relative">
                <Link href={g.href} aria-current={pathname === g.href ? "page" : undefined} className={`${top} ${on ? "text-accent" : "text-cream/85 hover:text-cream"}`}>
                  {g.label}
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 opacity-60" aria-hidden="true">
                    <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  {dot(on)}
                </Link>
                <div className="nav-panel absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3 transition duration-150">
                  <div className="overflow-hidden rounded-3xl border border-border bg-white text-body shadow-xl">
                    <ul className="p-2">
                      {g.links.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            aria-current={pathname === l.href ? "page" : undefined}
                            className={`block rounded-2xl px-4 py-2.5 text-[0.95rem] transition-colors hover:bg-cream focus-visible:bg-cream focus-visible:outline-none ${
                              pathname === l.href ? "font-semibold text-accent-ink" : ""
                            }`}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={g.href} className="block border-t border-border bg-cream px-6 py-3 font-serif text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink hover:text-primary">
                      All {g.label.toLowerCase()}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {simple.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined} className={`${top} ${isActive(pathname, l.href) ? "text-accent" : "text-cream/85 hover:text-cream"}`}>
              {l.label}
              {dot(isActive(pathname, l.href))}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={`hidden min-h-[44px] items-center whitespace-nowrap rounded-full px-6 font-serif text-sm font-semibold transition sm:inline-flex ${
              pathname === "/contact" ? "bg-cream text-primary" : "bg-accent text-white hover:bg-accent-ink"
            }`}
          >
            Get expert help
          </Link>
          <label
            htmlFor="mobile-nav-toggle"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-cream/30 text-cream xl:hidden"
            aria-label="Open or close the menu"
          >
            <span className="menu-icon flex flex-col gap-[5px]">
              <span />
              <span />
              <span />
            </span>
          </label>
        </div>
      </div>

      <div className="hidden max-h-[calc(100vh-72px)] overflow-y-auto border-t border-cream/10 bg-primary peer-checked:block xl:!hidden">
        <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 pb-8 pt-2 sm:px-6">
          {groups.map((g) => (
            <details key={g.label} className="fold border-b border-cream/10" open={groupOn(g)}>
              <summary className={`flex min-h-[52px] cursor-pointer items-center justify-between font-serif text-lg font-semibold ${groupOn(g) ? "text-accent" : "text-cream"}`}>
                {g.label}
                <span className="fold-mark text-2xl font-light leading-none text-accent transition-transform" aria-hidden="true">
                  +
                </span>
              </summary>
              <ul className="pb-4">
                <li>
                  <Link href={g.href} aria-current={pathname === g.href ? "page" : undefined} className="block py-2 font-serif text-sm font-semibold uppercase tracking-[0.12em] text-sand">
                    All {g.label.toLowerCase()}
                  </Link>
                </li>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined} className={`block py-2 ${pathname === l.href ? "font-semibold text-accent" : "text-cream/80"}`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          {simple.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined} className={`flex min-h-[52px] items-center border-b border-cream/10 font-serif text-lg font-semibold ${isActive(pathname, l.href) ? "text-accent" : "text-cream"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="mt-6 flex min-h-[48px] items-center justify-center rounded-full bg-accent font-serif text-sm font-semibold text-white">
            Get expert help
          </Link>
        </nav>
      </div>
    </header>
  );
}
