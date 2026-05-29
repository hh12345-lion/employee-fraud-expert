import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { guides } from "@/data/guides";

export const metadata = createMetadata({
  title:
    "Guides: Employee Fraud UK | Investigation, Recovery & Expert Evidence",
  description:
    "In-depth guides on employee fraud for UK employers and solicitors - what to do when fraud is discovered, civil recovery, POCA, and expert evidence.",
  path: "/guides",
});

export default function GuidesHubPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />
      <PageHero
        title="Guides: Employee Fraud for UK Employers & Solicitors"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Guides" },
        ]}
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group rounded-lg border border-border bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
            >
              <h2 className="font-semibold text-heading group-hover:text-highlight">
                {guide.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-body">
                {guide.paragraphs[0]}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-highlight">
                Read guide →
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
