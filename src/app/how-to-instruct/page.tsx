import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = createMetadata({
  title: "How to Instruct an Employee Fraud Expert UK | Step-by-Step Guide",
  description:
    "How employers and solicitors instruct an employee fraud expert witness in the UK - investigation scope, evidence preservation, and expert reports.",
  path: "/how-to-instruct",
});

const employerSteps = [
  {
    step: 1,
    title: "Secure evidence first",
    detail:
      "Do not alert the suspect or access their systems. Preserve all financial records in their current state. See our 72-hour guide.",
  },
  {
    step: 2,
    title: "Engage via a solicitor",
    detail:
      "Instruct a forensic accountant through your solicitor to ensure legal professional privilege protects the investigation.",
  },
  {
    step: 3,
    title: "Provide access to financial records",
    detail:
      "Make payroll data, bank statements, expense claims, supplier records, and system access available to the expert.",
  },
  {
    step: 4,
    title: "Define scope",
    detail:
      "Agree whether the engagement is investigation only, or investigation plus expert report for proceedings.",
  },
  {
    step: 5,
    title: "Review preliminary findings",
    detail:
      "Review the preliminary assessment with your solicitor before deciding on civil, criminal, or employment routes.",
  },
  {
    step: 6,
    title: "Commission full expert report",
    detail:
      "If proceedings follow, commission a CPR Part 35 compliant expert witness report based on the investigation findings.",
  },
];

const solicitorSteps = [
  {
    step: 1,
    title: "Issue letter of instruction",
    detail:
      "Provide clear instructions including case background, scope of investigation, documents available, and report requirements under CPR Part 35.",
  },
  {
    step: 2,
    title: "Confirm privilege status",
    detail:
      "Confirm whether the engagement is privileged (preliminary assessment) or for court (expert witness report).",
  },
  {
    step: 3,
    title: "Provide document access",
    detail:
      "Supply financial records, correspondence, and any evidence obtained through disclosure or Norwich Pharmacal orders.",
  },
  {
    step: 4,
    title: "Agree scope and timetable",
    detail:
      "Define investigation scope, report deadline, and whether oral evidence at trial is anticipated.",
  },
  {
    step: 5,
    title: "Review draft report",
    detail:
      "Review the draft expert report for factual accuracy only - not for advocacy. Raise queries via formal letter.",
  },
  {
    step: 6,
    title: "Serve and exchange",
    detail:
      "Serve the expert report in accordance with court directions. Arrange joint expert meeting if SJE or directions require.",
  },
  {
    step: 7,
    title: "Trial preparation",
    detail:
      "Brief the expert on trial procedure, arrange conference before trial, and confirm availability for oral evidence.",
  },
];

export default function HowToInstructPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How to Instruct", path: "/how-to-instruct" },
        ])}
      />
      <PageHero
        title="How to Instruct an Employee Fraud Expert"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "How to Instruct" },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-heading">For Employers</h2>
            <p className="mt-4 text-body">
              If you&apos;ve just discovered suspected fraud, see our 72-hour
              guide at{" "}
              <Link href="/investigation-process">Investigation Process</Link>.
            </p>
            <div className="mt-6 space-y-4">
              {employerSteps.map((s) => (
                <div
                  key={s.step}
                  className="flex gap-4 rounded-lg border border-border bg-white p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-heading">{s.title}</h3>
                    <p className="mt-1 text-sm text-body">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-heading">For Solicitors</h2>
            <div className="mt-6 space-y-4">
              {solicitorSteps.map((s) => (
                <div
                  key={s.step}
                  className="flex gap-4 rounded-lg border border-border bg-white p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-heading">{s.title}</h3>
                    <p className="mt-1 text-sm text-body">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="prose-content">
            <h2>Red Flags Before Instruction</h2>
            <p>
              Before instructing an expert, ensure you have preserved evidence and
              identified the scope of suspected fraud. Common red flags include:
              unexplained journal entries, payroll changes without HR records,
              expense claims near approval thresholds, new suppliers with residential
              addresses, and employees who never take holiday.{" "}
              <Link href="/fraud-types">View all red flags →</Link>
            </p>
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
