import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceNode,
} from "@/lib/schema";
import type { ServiceItem } from "@/data/types";
import type { BreadcrumbItem } from "@/components/PageHero";

interface ServicePageTemplateProps {
  service: ServiceItem;
  breadcrumbs: BreadcrumbItem[];
}

export function ServicePageTemplate({
  service,
  breadcrumbs,
}: ServicePageTemplateProps) {
  const schemas = [
    breadcrumbSchema(
      breadcrumbs
        .filter((b) => b.href)
        .map((b) => ({ name: b.label, path: b.href! }))
        .concat([
          { name: service.title, path: `/services/${service.id}` },
        ])
    ),
    serviceNode(service.id, service.title, service.description),
    faqPageSchema(service.faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero title={service.title} breadcrumbs={breadcrumbs} />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <p className="text-body leading-relaxed">{service.description}</p>

          <h2 className="mt-10 text-xl font-bold text-heading">Our Methodology</h2>
          <div className="table-scroll mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="bg-section-alt">
                  <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                    Phase
                  </th>
                  <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                    What We Do
                  </th>
                  <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                    Deliverable
                  </th>
                </tr>
              </thead>
              <tbody>
                {service.methodology.map((row) => (
                  <tr key={row.phase} className="even:bg-section-alt/50">
                    <td className="border border-border px-4 py-3 font-medium text-heading">
                      {row.phase}
                    </td>
                    <td className="border border-border px-4 py-3 text-body">
                      {row.whatWeDo}
                    </td>
                    <td className="border border-border px-4 py-3 text-body">
                      {row.deliverable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {service.relatedCaseType && (
            <p className="mt-6">
              <Link
                href={service.relatedCaseType}
                className="font-medium text-accent hover:text-primary"
              >
                Related case type →
              </Link>
            </p>
          )}
        </div>
      </Section>

      <Section alt>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-heading">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-6">
            {service.faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-border bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-heading">
                  {faq.question}
                </h3>
                <p className="mt-3 text-body leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
