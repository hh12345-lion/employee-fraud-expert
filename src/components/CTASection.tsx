import Link from "next/link";
import { SITE_EMAIL } from "@/lib/site";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export function CTASection({
  title = "Suspected employee fraud? Get expert help today.",
  description = "Submit your details and we will match you with a qualified UK employee fraud expert witness. Employers and solicitors welcome. Response within 1 business day.",
  buttonLabel = "Get Expert Help",
}: CTASectionProps) {
  return (
    <section className="bg-highlight py-12 sm:py-14 md:py-16">
      <div className="mx-auto min-w-0 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/90">{description}</p>
        <Link
          href="/contact"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded bg-white px-8 py-3 font-semibold text-highlight transition-colors hover:bg-white/90"
        >
          {buttonLabel}
        </Link>
        <p className="mt-6 text-sm text-white/90">
          Or email{" "}
          <a
            href={`mailto:${SITE_EMAIL}`}
            className="font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
          >
            {SITE_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
