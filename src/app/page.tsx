import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import {
  graphSchema,
  organizationSchema,
  professionalServiceSchema,
  websiteSchema,
} from "@/lib/schema";
import { services, serviceNames } from "@/data/services";

const stats = [
  {
    fact: "Organizations experiencing fraud annually",
    figure: "49%",
    source: "ACFE Report to the Nations 2024",
  },
  {
    fact: "Median loss per occupational fraud case",
    figure: "$145,000",
    source: "ACFE Report to the Nations 2024",
  },
  {
    fact: "Fraud committed by employees",
    figure: "Over 50%",
    source: "ACFE Report to the Nations 2024",
  },
  {
    fact: "Average fraud duration before detection",
    figure: "12 months",
    source: "ACFE Report to the Nations 2024",
  },
  {
    fact: "Cases detected by tip or whistleblower",
    figure: "43%",
    source: "ACFE Report to the Nations 2024",
  },
  {
    fact: "Asset misappropriation as fraud type",
    figure: "Most common",
    source: "ACFE Report to the Nations 2024",
  },
];

export default function HomePage() {
  const schemas = graphSchema([
    organizationSchema,
    professionalServiceSchema(serviceNames),
    websiteSchema,
  ]);

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero
        large
        title="Employee Fraud Expert Witness Services"
        subtitle="Whether you've just discovered suspected fraud or you're preparing for civil or criminal proceedings, you need a forensic accountant who moves fast and builds defensible evidence. We connect employers and attorneys with qualified experts in employee fraud investigation and expert witness work."
        label="Forensic accountant referral network"
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/who-we-help/employers-hr"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-7 font-serif text-sm font-semibold text-cream transition hover:bg-accent-ink"
          >
            I&apos;m an Employer
          </Link>
          <Link
            href="/who-we-help/solicitors-law-firms"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary/30 bg-white px-7 font-serif text-sm font-semibold text-primary transition hover:border-primary"
          >
            I&apos;m an Attorney
          </Link>
        </div>
      </PageHero>

      <section className="bg-primary py-16 text-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-bold text-cream md:text-4xl">Where employee fraud tends to surface</h2>
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { p: photos.retailCheckout, t: "Tills and takings", d: "Voided sales, refunds and cash that never reaches the bank." },
              { p: photos.punchClock, t: "Payroll and hours", d: "Ghost employees, inflated overtime and altered rates." },
              { p: photos.warehouseLoading, t: "Stock and supply", d: "Inventory losses, fictitious suppliers and kickbacks." },
              { p: photos.openOffice, t: "Finance teams", d: "Expense claims, journal entries and misused company cards." },
            ].map((x) => (
              <li key={x.t} className="text-center sm:text-left">
                <div className="ring mx-auto h-44 w-44 sm:mx-0">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image src={x.p.src} alt={x.p.alt} fill sizes="176px" className="object-cover" />
                  </div>
                </div>
                <h3 className="mt-7 font-serif text-xl font-semibold text-cream">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{x.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section alt>
        <h2 className="font-serif text-2xl font-semibold text-heading md:text-3xl">
          What Our Expert Witnesses Cover
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="border border-border bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
            >
              <h3 className="font-medium text-heading">{service.title}</h3>
              <p className="mt-2 text-sm text-body">{service.shortDescription}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="font-serif text-2xl font-semibold text-heading md:text-3xl">
          Employee Fraud: Key Facts
        </h2>
        <div className="table-scroll mt-8 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="bg-section-alt">
                <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                  Fact
                </th>
                <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                  Figure
                </th>
                <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((row) => (
                <tr key={row.fact} className="even:bg-section-alt/50">
                  <td className="border border-border px-4 py-3 text-body">
                    {row.fact}
                  </td>
                  <td className="border border-border px-4 py-3 font-medium text-heading">
                    {row.figure}
                  </td>
                  <td className="border border-border px-4 py-3 text-body">
                    {row.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-body/70">
          Source: ACFE Report to the Nations 2024.
        </p>
      </Section>

      <Section alt>
        <h2 className="font-serif text-2xl font-semibold text-heading md:text-3xl">
          Who Uses Our Services?
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="border border-border bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="font-serif text-lg font-semibold text-heading">
              Employers &amp; HR
            </h3>
            <p className="mt-3 text-body leading-relaxed">
              You&apos;ve discovered suspected fraud in your organization. You
              need to move quickly, preserve evidence, and understand what has
              been taken, before engaging counsel or law enforcement.
            </p>
            <Link
              href="/who-we-help/employers-hr"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-accent hover:text-primary"
            >
              Help for employers →
            </Link>
          </div>
          <div className="border border-border bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="font-serif text-lg font-semibold text-heading">
              Attorneys &amp; Law Firms
            </h3>
            <p className="mt-3 text-body leading-relaxed">
              You need a forensic accountant who produces Daubert-compliant
              expert reports, traces assets, and gives credible testimony in civil
              or criminal proceedings.
            </p>
            <Link
              href="/who-we-help/solicitors-law-firms"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-accent hover:text-primary"
            >
              Help for attorneys →
            </Link>
          </div>
        </div>
        <p className="mt-8 text-body leading-relaxed">
          Employee fraud is financial crime committed by a person in a position
          of trust against the organization that employs them.{" "}
          <Link
            href="/what-is-employee-fraud"
            className="font-medium text-accent hover:text-primary"
          >
            Learn what employee fraud is →
          </Link>
        </p>
      </Section>

      <CTASection />
    </>
  );
}
