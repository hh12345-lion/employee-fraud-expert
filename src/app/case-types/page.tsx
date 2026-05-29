import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { caseTypes } from "@/data/case-types";

export const metadata = createMetadata({
  title:
    "Employee Fraud Case Types UK | Civil & Criminal Proceedings Guide",
  description:
    "Which legal proceedings arise from employee fraud? Civil recovery, POCA confiscation, employment tribunal, criminal prosecution, and regulatory proceedings explained.",
  path: "/case-types",
});

export default function CaseTypesHubPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Types", path: "/case-types" },
        ])}
      />
      <PageHero
        title="Employee Fraud Case Types: Civil & Criminal Proceedings"
        subtitle="Employee fraud gives rise to multiple legal proceedings - civil recovery, criminal prosecution, POCA confiscation, employment tribunal, and regulatory action. Each requires specific expert evidence."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Case Types" },
        ]}
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {caseTypes.map((ct) => (
            <Link
              key={ct.slug}
              href={`/case-types/${ct.slug}`}
              className="group rounded-lg border border-border bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
            >
              <h2 className="font-semibold text-heading group-hover:text-highlight">
                {ct.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-body">
                {ct.paragraphs[0]}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-highlight">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
