import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Thank You | EmployeeFraudExpert.com",
  description: "Thank you for contacting EmployeeFraudExpert.com.",
  path: "/thank-you",
  noindex: true,
  nofollow: true,
});

export default function ThankYouPage() {
  return (
    <>
      <PageHero
        title="Thank you"
        subtitle="Your enquiry has been received. We will reply by email, and sooner if you marked your enquiry as urgent."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Enquiry received" }]}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-body">
            While you wait, you may find these pages helpful:
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/investigation-process"
              className="min-h-[44px] rounded border border-border px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-highlight"
            >
              First 72 Hours Guide
            </Link>
            <Link
              href="/fraud-types"
              className="min-h-[44px] rounded border border-border px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-highlight"
            >
              Fraud Types
            </Link>
            <Link
              href="/services"
              className="min-h-[44px] rounded border border-border px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-highlight"
            >
              Our Services
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
    </>
  );
}
