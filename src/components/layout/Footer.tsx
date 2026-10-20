import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";
import { services } from "@/data/services";
import { photos } from "@/lib/photos";
import { SITE_EMAIL, SITE_NAME } from "@/lib/site";

const practiceLinks = [
  { href: "/fraud-types", label: "Fraud Types" },
  { href: "/case-types", label: "Case Types" },
  { href: "/who-we-help", label: "Who We Help" },
  { href: "/investigation-process", label: "Investigation Process" },
  { href: "/how-to-instruct", label: "How to Instruct" },
  { href: "/qualifications", label: "Qualifications" },
];

const resourceLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/glossary", label: "Glossary" },
  { href: "/what-is-employee-fraud", label: "What Is Employee Fraud?" },
  { href: "/contact", label: "Contact" },
];

const linkCls = "text-sm text-cream/70 transition-colors hover:text-cream";

export function Footer() {
  return (
    <footer className="mt-auto bg-primary text-cream">
      {/* Enquiry band: three ring-framed photographs beside the call to act */}
      <div className="border-b border-cream/10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 className="max-w-xl font-serif text-3xl font-bold leading-tight text-cream md:text-[2.4rem]">
              Need a forensic accountant for employee fraud?
            </h2>
            <p className="mt-4 max-w-lg text-cream/75">
              Tell us what has been found, what is at stake and how quickly you need to act. We will connect you with a
              qualified forensic accountant.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/contact" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-accent px-7 font-serif text-sm font-semibold text-white transition hover:bg-accent-ink">
                Start an enquiry
              </Link>
              <a href={`mailto:${SITE_EMAIL}`} className="text-cream underline decoration-accent decoration-2 underline-offset-4 hover:decoration-cream">
                {SITE_EMAIL}
              </a>
            </div>
          </div>
          <div className="flex items-end justify-center gap-6 lg:justify-end">
            {[photos.officeSafe, photos.punchClock, photos.openOffice].map((p, i) => (
              <div key={p.src} className={`ring overflow-hidden ${i === 1 ? "h-40 w-40" : "h-28 w-28"}`}>
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image src={p.src} alt={p.alt} fill sizes="160px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_1.3fr_1fr_0.9fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-stacked-light.svg" alt={SITE_NAME} width={571} height={270} className="h-auto w-48" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/65">
            Referral network for employers and attorneys seeking qualified forensic accountants in employee fraud
            investigation and expert witness work. Not a law firm; we do not provide legal advice.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-xs font-semibold uppercase tracking-[0.18em] text-sand">Services</h3>
          <ul className="mt-5 space-y-2.5">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.id}`} className={linkCls}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-xs font-semibold uppercase tracking-[0.18em] text-sand">The network</h3>
          <ul className="mt-5 space-y-2.5">
            {practiceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-xs font-semibold uppercase tracking-[0.18em] text-sand">Resources</h3>
          <ul className="mt-5 space-y-2.5">
            {resourceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 bg-[#232a2c]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>&copy; {new Date().getFullYear()} {SITE_NAME}</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-cream">Privacy</Link>
            <Link href="/terms" className="hover:text-cream">Terms</Link>
            <Link href="/cookies" className="hover:text-cream">Cookies</Link>
            <Link href="/image-credits" className="hover:text-cream">Image credits</Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
