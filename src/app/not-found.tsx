import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";

export default function NotFound() {
  return (
    <>
      <PageHero
        title="Page not found"
        subtitle="The page you are looking for does not exist or has been moved."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Page not found" }]}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-heading">
            Quick links
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/fraud-types"
              className="min-h-[44px] rounded border border-border px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-highlight"
            >
              Fraud Types
            </Link>
            <Link
              href="/investigation-process"
              className="min-h-[44px] rounded border border-border px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-highlight"
            >
              Investigation Process
            </Link>
            <Link
              href="/who-we-help"
              className="min-h-[44px] rounded border border-border px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-highlight"
            >
              Who We Help
            </Link>
            <Link
              href="/contact"
              className="min-h-[44px] rounded border border-border px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-highlight"
            >
              Contact
            </Link>
          </div>
          <Link
            href="/"
            className="mt-10 inline-flex min-h-[44px] items-center rounded bg-highlight px-8 py-3 font-semibold text-white hover:bg-[#b45309]"
          >
            Return to Homepage
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
