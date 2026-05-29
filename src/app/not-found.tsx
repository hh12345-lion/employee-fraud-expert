import Link from "next/link";
import { CTASection } from "@/components/CTASection";

export default function NotFound() {
  return (
    <>
      <section className="bg-primary py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-6xl font-bold text-highlight md:text-8xl">404</p>
          <h1 className="mt-4 text-2xl font-bold text-white min-[375px]:text-3xl sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
      </section>

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
