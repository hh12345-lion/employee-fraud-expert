import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
  serviceNode,
} from "@/lib/schema";
import { services } from "@/data/services";

export const metadata = createMetadata({
  title: "Employee Fraud Expert Witness Services UK | Full Service List",
  description:
    "UK employee fraud expert witness services: fraud investigation, asset tracing, loss quantification, payroll fraud analysis, expense fraud review, and expert testimony.",
  path: "/services",
});

export default function ServicesPage() {
  const serviceSchemas = services.map((s) =>
    serviceNode(s.id, s.title, s.description)
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          graphSchema([organizationSchema, ...serviceSchemas]),
        ]}
      />
      <PageHero
        title="Employee Fraud Expert Witness Services UK"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group rounded-lg border border-border bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
            >
              <h2 className="font-semibold text-heading group-hover:text-highlight">
                {service.title}
              </h2>
              <p className="mt-2 text-sm text-body">{service.shortDescription}</p>
              <span className="mt-3 inline-block text-sm font-medium text-highlight">
                View service &amp; FAQs →
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
