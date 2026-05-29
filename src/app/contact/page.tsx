import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = createMetadata({
  title: "Get Employee Fraud Expert Help | EmployeeFraudExpert.com UK",
  description:
    "Suspected employee fraud? Submit your details to be matched with a qualified UK employee fraud expert. Employers and solicitors welcome. Response within 1 business day.",
  path: "/contact",
});

const trustPoints = [
  "24-hour emergency response available",
  "Legal professional privilege protection available",
  "Civil and criminal proceedings covered",
  "Confidential enquiry",
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHero
        title="Get Employee Fraud Expert Help"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 rounded-lg border-l-4 border-highlight bg-[#FEF3C7] p-4">
              <h2 className="font-semibold text-[#92400E]">
                Discovered suspected fraud?
              </h2>
              <p className="mt-1 text-sm text-[#92400E]">
                We can respond within 24 hours.
              </p>
            </div>
            <div className="mb-6 rounded-lg border border-border bg-section-alt p-4">
              <h2 className="font-semibold text-heading">
                Need a CPR Part 35 compliant expert witness report?
              </h2>
              <p className="mt-1 text-sm text-body">
                Solicitors - complete the form below with your case details.
              </p>
            </div>
            <ContactForm />
          </div>
          <aside>
            <div className="rounded-lg border border-border bg-section-alt p-6">
              <h2 className="font-semibold text-heading">Why contact us?</h2>
              <ul className="mt-4 space-y-3">
                {trustPoints.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-body">
                    <span className="text-highlight" aria-hidden>
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
      <CTASection
        title="Suspected employee fraud? Get expert help today."
        buttonLabel="Get Expert Help"
      />
    </>
  );
}
