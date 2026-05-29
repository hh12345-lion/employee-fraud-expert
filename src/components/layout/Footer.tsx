import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";
import { SITE_EMAIL } from "@/lib/site";

const servicesCol = [
  { href: "/services/fraud-investigation", label: "Fraud Investigation" },
  { href: "/services/asset-tracing", label: "Asset Tracing" },
  { href: "/services/loss-quantification", label: "Loss Quantification" },
  { href: "/services/payroll-fraud-analysis", label: "Payroll Fraud Analysis" },
  {
    href: "/services/expense-procurement-review",
    label: "Expense Fraud Review",
  },
  {
    href: "/services/invoice-supplier-investigation",
    label: "Invoice Fraud Investigation",
  },
  { href: "/services/expert-witness-reports", label: "Expert Witness Reports" },
  { href: "/services/ftpf-advisory", label: "FTPF Advisory" },
];

const caseTypesCol = [
  { href: "/case-types/civil-fraud-recovery", label: "Civil Fraud Recovery" },
  { href: "/case-types/poca-confiscation-proceedings", label: "POCA Confiscation" },
  { href: "/case-types/payroll-fraud-ghost-employees", label: "Payroll Fraud" },
  { href: "/case-types/invoice-supplier-fraud", label: "Invoice Fraud" },
  {
    href: "/case-types/director-misconduct-misappropriation",
    label: "Director Misconduct",
  },
  { href: "/case-types", label: "View all 10 →" },
];

const resourcesCol = [
  { href: "/guides", label: "Solicitor Guides" },
  { href: "/glossary", label: "Glossary" },
  { href: "/investigation-process", label: "Investigation Process" },
  { href: "/what-is-employee-fraud", label: "What is Employee Fraud?" },
];

const whoWeHelpCol = [
  { href: "/who-we-help/employers-hr", label: "Employers & HR Teams" },
  { href: "/who-we-help/solicitors-law-firms", label: "Solicitors & Law Firms" },
  { href: "/qualifications", label: "Qualifications" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Services
            </h3>
            <ul className="space-y-2">
              {servicesCol.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Case Types
            </h3>
            <ul className="space-y-2">
              {caseTypesCol.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Resources
            </h3>
            <ul className="space-y-2">
              {resourcesCol.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Who We Help
            </h3>
            <ul className="space-y-2">
              {whoWeHelpCol.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-8">
          <p className="text-sm text-white/70">
            EmployeeFraudExpert.com connects employers and solicitors with
            employee fraud expert witnesses. We are not a law firm and do not
            provide legal advice.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
            <span>© 2025 EmployeeFraudExpert. England and Wales.</span>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookies
            </Link>
            <CookieSettingsButton />
            <a href={`mailto:${SITE_EMAIL}`} className="hover:text-white">
              {SITE_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
