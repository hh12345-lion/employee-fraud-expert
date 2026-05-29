import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata = createMetadata({
  title:
    "Types of Employee Fraud UK | Embezzlement, Payroll, Expense & Invoice Fraud Explained",
  description:
    "The complete guide to types of employee fraud in the UK - embezzlement, payroll fraud, expense fraud, invoice fraud, procurement fraud, and data theft.",
  path: "/fraud-types",
});

export default function FraudTypesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Fraud Types", path: "/fraud-types" },
          ]),
          articleSchema({
            headline: "Types of Employee Fraud: The Complete UK Guide",
            description:
              "The complete guide to types of employee fraud in the UK - embezzlement, payroll fraud, expense fraud, invoice fraud, procurement fraud, and data theft.",
            path: "/fraud-types",
            aboutServiceId: "fraud-investigation",
          }),
        ]}
      />
      <PageHero
        title="Types of Employee Fraud: The Complete UK Guide"
        subtitle="Employee fraud encompasses every form of financial crime committed by a person in a position of trust against their employer. This guide defines each type, explains how it is detected, and links to expert witness services for UK proceedings."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Fraud Types" },
        ]}
      />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <p>
            Employee fraud - also called occupational fraud - is financial crime
            committed by an employee against the organisation that employs them.
            Over 50% of all fraud is committed by employees according to ACFE
            research, with a median loss exceeding £100,000 per case. Understanding
            the types of employee fraud is essential for employers discovering
            suspected misconduct and for solicitors preparing civil or criminal
            proceedings.
          </p>

          <h2>The Three Categories of Occupational Fraud (ACFE)</h2>
          <div className="table-scroll overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Definition</th>
                  <th>% of Cases</th>
                  <th>Median Loss</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Asset Misappropriation</td>
                  <td>Theft or misuse of company assets</td>
                  <td>86%</td>
                  <td>£100,000</td>
                </tr>
                <tr>
                  <td>Corruption</td>
                  <td>Bribery, conflicts of interest</td>
                  <td>50%</td>
                  <td>£200,000</td>
                </tr>
                <tr>
                  <td>Financial Statement Fraud</td>
                  <td>Falsifying accounts</td>
                  <td>9%</td>
                  <td>£593,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-body/70">
            Source: ACFE Report to the Nations 2024. Percentages exceed 100%
            because cases may involve multiple categories.
          </p>

          <h2 id="embezzlement">1. Embezzlement</h2>
          <p>
            <strong>Definition:</strong> The theft or misappropriation of funds
            entrusted to an employee. Distinguishing features: the employee has
            legitimate access to the funds; the taking requires professional skill
            to accomplish and cover up; it violates the ethical rules of a
            profession.
          </p>
          <p><strong>Common forms:</strong></p>
          <ul>
            <li>Cash skimming (taking cash before it is recorded)</li>
            <li>Larceny (taking recorded funds)</li>
            <li>Payroll fraud (ghost employees, inflated wages)</li>
            <li>Expense reimbursement fraud</li>
          </ul>

          <h2 id="payroll-fraud">2. Payroll Fraud</h2>
          <p>
            <strong>Definition:</strong> Manipulation of the payroll system for
            financial gain.
          </p>
          <div className="table-scroll overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ghost employees</td>
                  <td>
                    Creating fictitious employees and diverting their wages
                  </td>
                </tr>
                <tr>
                  <td>Wage inflation</td>
                  <td>Inflating own or colleagues&apos; pay rates</td>
                </tr>
                <tr>
                  <td>Commission fraud</td>
                  <td>Falsifying sales figures to inflate commission</td>
                </tr>
                <tr>
                  <td>Overtime fraud</td>
                  <td>Claiming for hours not worked</td>
                </tr>
                <tr>
                  <td>Benefits fraud</td>
                  <td>Claiming benefits for ineligible employees</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <Link href="/case-types/payroll-fraud-ghost-employees">
              Payroll fraud expert witness services →
            </Link>
          </p>

          <h2 id="expense-fraud">3. Expense Fraud</h2>
          <p>
            <strong>Definition:</strong> Submitting false, inflated, or fabricated
            expense claims for reimbursement.
          </p>
          <p>
            Common patterns: personal expenses submitted as business expenses;
            duplicate claims; inflated mileage; fictitious receipts; split claims
            to avoid approval thresholds.{" "}
            <Link href="/case-types/expense-fraud-investigation">
              Expense fraud investigation →
            </Link>
          </p>

          <h2 id="invoice-supplier-fraud">4. Invoice &amp; Supplier Fraud</h2>
          <p>
            <strong>Definition:</strong> The creation of fictitious suppliers,
            inflation of supplier invoices, or sham invoices for work not done
            - often with secret payments made back to the employee or their
            connected company.
          </p>
          <p><strong>Forms:</strong></p>
          <ul>
            <li>Fictitious supplier fraud</li>
            <li>Invoice inflation</li>
            <li>Kickback arrangements</li>
            <li>Duplicate invoice submission</li>
            <li>False credit notes</li>
          </ul>
          <p>
            <Link href="/case-types/invoice-supplier-fraud">
              Invoice fraud expert witness →
            </Link>
          </p>

          <h2 id="procurement-fraud">5. Procurement Fraud</h2>
          <p>
            <strong>Definition:</strong> Manipulation of the procurement process
            - steering contracts to favoured suppliers in exchange for personal
            benefit.
          </p>
          <p>
            Indicators: sole-source awards without competitive tender; split
            purchases to avoid approval limits; related-party suppliers not
            disclosed.
          </p>

          <h2 id="financial-statement-fraud">6. Financial Statement Fraud</h2>
          <p>
            <strong>Definition:</strong> Deliberate falsification of financial
            records to misrepresent the company&apos;s financial position -
            typically by senior employees or directors.
          </p>
          <p>
            Forms: revenue inflation; liability concealment; false accounting
            entries; improper capitalisation.{" "}
            <Link href="/case-types/director-misconduct-misappropriation">
              Director misconduct cases →
            </Link>
          </p>

          <h2 id="data-ip-theft">7. Data &amp; IP Theft</h2>
          <p>
            <strong>Definition:</strong> Theft of confidential business
            information, trade secrets, or customer data by employees - typically
            for personal gain or to benefit a competitor. Digital forensics and
            forensic accounting often combine here.{" "}
            <Link href="/case-types/data-ip-theft">Data theft cases →</Link>
          </p>

          <h2 id="bribery-corruption">8. Bribery &amp; Corruption</h2>
          <p>
            <strong>Definition:</strong> Receiving improper payments or benefits
            from third parties in exchange for preferential treatment - prohibited
            under Bribery Act 2010.{" "}
            <Link href="/case-types/bribery-corruption">
              Bribery &amp; corruption cases →
            </Link>
          </p>

          <h2 id="failure-to-prevent-fraud">
            The New Failure to Prevent Fraud Offence (ECCTA 2023)
          </h2>
          <p>
            The Failure to Prevent Fraud offence under ECCTA 2023, in force from
            1 September 2025, makes large organisations liable if employees
            commit specified fraud offences for the organisation&apos;s benefit
            and adequate prevention procedures were not in place - with
            potentially unlimited fines.
          </p>
          <p>
            Specified offences include: fraud by false representation, fraud by
            abuse of position, fraud by failing to disclose, false accounting
            under Theft Act 1968, and fraudulent trading under Companies Act
            2006.
          </p>
          <p>
            The defence: organisations must demonstrate they had reasonable
            fraud prevention procedures in place. Expert witnesses assist in
            assessing whether procedures were adequate and in quantifying losses
            where the offence occurred.{" "}
            <Link href="/case-types/failure-to-prevent-fraud-eccta">
              FTPF expert witness services →
            </Link>
          </p>

          <h2>Red Flags - Common Indicators of Employee Fraud</h2>
          <div className="table-scroll overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Red Flag</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Payroll</td>
                  <td>Unusual changes to bank account details</td>
                </tr>
                <tr>
                  <td>Expenses</td>
                  <td>Claims near approval thresholds; round-number amounts</td>
                </tr>
                <tr>
                  <td>Procurement</td>
                  <td>Single-source awards; no competitive tender</td>
                </tr>
                <tr>
                  <td>Suppliers</td>
                  <td>
                    New suppliers with residential addresses; similar names to
                    real suppliers
                  </td>
                </tr>
                <tr>
                  <td>Accounts</td>
                  <td>Unexplained journal entries; late reconciliations</td>
                </tr>
                <tr>
                  <td>Behaviour</td>
                  <td>
                    Employee never takes holiday; excessive lifestyle vs salary
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-8">
            <Link href="/investigation-process">
              What to do in the first 72 hours after discovering fraud →
            </Link>
            {" · "}
            <Link href="/contact">Get expert help →</Link>
          </p>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
