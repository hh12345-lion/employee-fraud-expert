import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";
import { SITE_EMAIL, SITE_NAME } from "@/lib/site";

const footerTrail = [
  { href: "/services", label: "Services" },
  { href: "/fraud-types", label: "Fraud Types" },
  { href: "/case-types", label: "Case Types" },
  { href: "/who-we-help", label: "Who We Help" },
  { href: "/investigation-process", label: "Investigation Process" },
  { href: "/how-to-instruct", label: "How to Instruct" },
  { href: "/guides", label: "Guides" },
  { href: "/glossary", label: "Glossary" },
  { href: "/qualifications", label: "Qualifications" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-accent bg-primary text-white">
      <div className="border-b border-white/10 bg-accent px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg font-semibold text-primary">
            Need a forensic accountant for employee fraud?
          </p>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center gap-2 self-start bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 sm:self-auto"
            >
              Start an enquiry
              <span aria-hidden>→</span>
            </Link>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="text-sm text-primary/80 hover:text-primary"
            >
              {SITE_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-serif text-lg font-semibold text-accent">EF</span>
          <span className="text-white/40" aria-hidden>
            ·
          </span>
          <span className="font-serif text-lg text-white">{SITE_NAME}</span>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
          Referral network for employers and attorneys seeking qualified forensic
          accountants in employee fraud investigation and expert witness work. Not
          a law firm — we do not provide legal advice.
        </p>

        <nav
          aria-label="Footer"
          className="mt-8 text-sm leading-loose text-white/75"
        >
          {footerTrail.map((link, index) => (
            <span key={link.href}>
              {index > 0 && (
                <span className="mx-2 text-white/25 select-none" aria-hidden>
                  |
                </span>
              )}
              <Link
                href={link.href}
                className="transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>&copy; {new Date().getFullYear()} {SITE_NAME}</span>
            <span className="hidden text-white/25 sm:inline" aria-hidden>
              |
            </span>
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-accent">
              Cookies
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
