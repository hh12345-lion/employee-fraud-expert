import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_EMAIL } from "@/lib/site";

export const metadata = createMetadata({
  title: "Contact | Employee Fraud Expert Witness Referrals",
  description:
    "Submit your details to be matched with a qualified employee fraud forensic accountant. Employers and attorneys welcome.",
  path: "/contact",
});

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
        title="Request an Expert Witness"
        subtitle="Tell us about your matter. We respond within one business day."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-xl">
          <p className="mb-8 text-sm text-body">
            Prefer email? Write to{" "}
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="font-medium text-accent underline hover:text-primary"
            >
              {SITE_EMAIL}
            </a>
            .
          </p>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
