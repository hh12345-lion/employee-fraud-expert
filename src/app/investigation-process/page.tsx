import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata = createMetadata({
  title:
    "Employee Fraud Investigation Process UK | What to Do in the First 72 Hours",
  description:
    "Step-by-step guide to investigating employee fraud in the UK - what employers and solicitors should do in the first 24–72 hours after discovering suspected fraud.",
  path: "/investigation-process",
});

const steps = [
  {
    title: "Before You Do Anything Else",
    timing: "Immediate",
    items: [
      "Do not alert the suspect",
      "Do not access their computer or systems yourself",
      "Do not discuss with colleagues who may warn the suspect",
      "Time is critical - assets can be moved within hours",
    ],
  },
  {
    title: "Hour 1 - Secure the Evidence",
    timing: "Hour 1",
    items: [
      "Do not delete, move, or access suspect's files or emails",
      "Preserve financial records in their current state",
      "Note what you know and when you discovered it",
      "Call a forensic accountant and civil fraud solicitor",
    ],
  },
  {
    title: "Hour 2–4 - Engage Experts",
    timing: "Hours 2–4",
    items: [
      "Instruct a forensic accountant under legal professional privilege (via your solicitor) to begin preliminary assessment",
      "The forensic accountant assesses the scale of the fraud and the evidence available",
      "Solicitor advises on immediate legal steps (freezing injunction, search order, POCA report)",
    ],
  },
  {
    title: "Day 1 - Preliminary Assessment",
    timing: "Day 1",
    items: [
      "Forensic accountant reviews financial records",
      "Identifies the fraud type, approximate quantum, and how long it has been occurring",
      "Identifies connected parties (accomplices, third parties)",
      "Advises on civil vs criminal route",
    ],
  },
  {
    title: "Day 2–3 - Legal Steps",
    timing: "Days 2–3",
    items: [
      "Freezing injunction application (if assets at risk of dissipation)",
      "Search order (Anton Piller) if evidence at risk",
      "Norwich Pharmacal order (to identify wrongdoers)",
      "Police report (if criminal proceedings appropriate)",
      "Suspension of employee (following HR procedure)",
    ],
  },
  {
    title: "Week 1–2 - Full Investigation",
    timing: "Week 1–2",
    items: [
      "Forensic accountant conducts full investigation under legal professional privilege",
      "Evidence-quality workpapers prepared",
      "Loss quantification completed",
      "Expert witness report prepared (CPR Part 35 if civil proceedings)",
    ],
  },
];

export default function InvestigationProcessPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: "Investigation Process",
              path: "/investigation-process",
            },
          ]),
          articleSchema({
            headline:
              "Employee Fraud Investigation: What to Do in the First 72 Hours",
            description:
              "Step-by-step guide to investigating employee fraud in the UK - what employers and solicitors should do in the first 24–72 hours after discovering suspected fraud.",
            path: "/investigation-process",
            aboutServiceId: "fraud-investigation",
          }),
        ]}
      />
      <PageHero
        title="Employee Fraud Investigation: What to Do in the First 72 Hours"
        subtitle="This is the highest-urgency guide on our site - for employers who have just discovered suspected fraud and need immediate, practical guidance on preserving evidence and engaging experts."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Investigation Process" },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-lg border border-border bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                  {step.timing}
                </span>
                <h2 className="text-lg font-bold text-heading">{step.title}</h2>
              </div>
              <ul className="mt-4 space-y-2">
                {step.items.map((item) => (
                  <li key={item} className="flex gap-2 text-body">
                    <span className="text-highlight" aria-hidden>
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="prose-content mx-auto mt-12 max-w-3xl">
          <h2>Civil vs Criminal - Which Route?</h2>
          <div className="table-scroll overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Aim</th>
                  <th>Outcome</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Civil recovery</td>
                  <td>Recover money</td>
                  <td>Judgment + asset recovery</td>
                  <td>Months–years</td>
                </tr>
                <tr>
                  <td>Criminal prosecution</td>
                  <td>Punish offender</td>
                  <td>Conviction + POCA confiscation</td>
                  <td>Years</td>
                </tr>
                <tr>
                  <td>Both simultaneously</td>
                  <td>Punish + recover</td>
                  <td>Maximum recovery</td>
                  <td>Staged</td>
                </tr>
                <tr>
                  <td>Employment tribunal</td>
                  <td>Dismiss + recover</td>
                  <td>ET award</td>
                  <td>Months</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Preserving Legal Professional Privilege</h2>
          <p>
            Forensic accountants working under legal professional privilege produce
            reports that are protected from disclosure to the opposing party -
            protecting the employer&apos;s legal strategy. This requires the
            forensic accountant to be instructed via the solicitor, not directly
            by the employer.{" "}
            <Link href="/who-we-help/employers-hr">Learn more →</Link>
          </p>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center rounded bg-highlight px-8 py-3 font-semibold text-white hover:bg-[#b45309]"
            >
              Get Expert Help Now
            </Link>
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
