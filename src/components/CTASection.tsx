import Link from "next/link";
import { SITE_EMAIL } from "@/lib/site";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export function CTASection({
  title = "Need a forensic accountant for employee fraud?",
  description = "Tell us about your matter and we will connect you with a qualified expert witness. Response within one business day.",
  buttonLabel = "Request Expert",
}: CTASectionProps) {
  return (
    <section className="border-y border-border bg-primary py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl font-semibold text-white md:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center border border-accent bg-accent px-8 py-3 text-sm font-medium text-primary transition-colors hover:bg-transparent hover:text-accent"
            >
              {buttonLabel}
            </Link>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="text-center text-sm text-white/60 transition-colors hover:text-accent sm:text-left"
            >
              {SITE_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
