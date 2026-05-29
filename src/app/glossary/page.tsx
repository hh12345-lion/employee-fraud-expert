import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { glossaryTerms } from "@/data/glossary";

export const metadata = createMetadata({
  title: "Employee Fraud Glossary | Key UK Legal & Forensic Terms",
  description:
    "Definitions of key employee fraud and forensic accounting terms for UK proceedings - from embezzlement to POCA, Failure to Prevent Fraud, freezing injunctions, and CPR Part 35.",
  path: "/glossary",
});

export default function GlossaryPage() {
  const faqItems = glossaryTerms.map((t) => ({
    question: t.term,
    answer: t.definition,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Glossary", path: "/glossary" },
          ]),
          faqPageSchema(faqItems),
        ]}
      />
      <PageHero
        title="Employee Fraud Glossary"
        subtitle="Key legal and forensic accounting terms used in UK employee fraud proceedings."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Glossary" },
        ]}
      />
      <Section>
        <dl className="mx-auto max-w-3xl space-y-6">
          {glossaryTerms.map((term) => (
            <div
              key={term.slug}
              id={term.slug}
              className="rounded-lg border border-border bg-white p-6 scroll-mt-24"
            >
              <dt className="text-lg font-semibold text-heading">{term.term}</dt>
              <dd className="mt-2 text-body leading-relaxed">
                {term.definition}
                {term.link && (
                  <>
                    {" "}
                    <Link
                      href={term.link.href}
                      className="text-highlight underline hover:text-[#b45309]"
                    >
                      {term.link.label} →
                    </Link>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      <CTASection />
    </>
  );
}
