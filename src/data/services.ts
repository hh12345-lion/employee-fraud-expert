import type { ServiceItem } from "./types";

export const services: ServiceItem[] = [
  {
    id: "fraud-investigation",
    title: "Fraud Investigation & Evidence Gathering",
    shortDescription:
      "Forensic investigation of suspected employee fraud - preserving evidence, identifying perpetrators, and building court-ready findings.",
    description:
      "Our employee fraud expert witnesses conduct structured forensic investigations under legal professional privilege. We analyse financial records, email data, system logs, and transaction trails to establish what occurred, who was involved, and how the fraud was concealed. Every investigation produces evidence-quality workpapers suitable for civil proceedings, criminal prosecution, or employment tribunal.",
    metaTitle:
      "Employee Fraud Investigation & Evidence Gathering UK | Expert Witness",
    metaDescription:
      "Forensic investigation of suspected employee fraud in the UK - evidence preservation, perpetrator identification, and court-ready findings under legal professional privilege.",
    faqs: [
      {
        question: "How quickly can a forensic accountant start an employee fraud investigation?",
        answer:
          "Emergency response is available within 24 hours for urgent cases where assets may be dissipated or evidence is at risk. A preliminary assessment can typically be completed within 48 hours, sufficient to support freezing injunction applications and inform your solicitor's immediate strategy.",
      },
      {
        question: "Should the fraud investigation be conducted under legal professional privilege?",
        answer:
          "Yes, in most cases. Forensic accountants instructed via your solicitor produce investigation reports protected by legal professional privilege - safeguarding your legal strategy from disclosure to the opposing party. Direct instruction by the employer may waive this protection.",
      },
    ],
    methodology: [
      {
        phase: "Initial scoping",
        whatWeDo:
          "Review available records, assess fraud type, identify evidence gaps, and agree investigation scope with instructing solicitor.",
        deliverable: "Investigation plan and evidence preservation checklist",
      },
      {
        phase: "Evidence collection",
        whatWeDo:
          "Secure financial records, payroll data, expense claims, supplier records, and digital evidence before suspect is alerted.",
        deliverable: "Preserved evidence archive with chain of custody",
      },
      {
        phase: "Analysis",
        whatWeDo:
          "Data analytics, transaction tracing, pattern identification, and reconciliation of records against bank statements.",
        deliverable: "Investigation workpapers with findings summary",
      },
      {
        phase: "Reporting",
        whatWeDo:
          "Prepare privileged investigation report or CPR Part 35 expert witness report depending on proceedings.",
        deliverable: "Expert report or confidential investigation findings",
      },
    ],
    relatedCaseType: "/case-types/civil-fraud-recovery",
  },
  {
    id: "asset-tracing",
    title: "Asset Tracing & Recovery",
    shortDescription:
      "Trace fraudulently obtained funds through bank accounts, property, and connected entities to support recovery and freezing injunctions.",
    description:
      "Asset tracing follows the money from the point of misappropriation through subsequent transfers, property purchases, and connected company accounts. Our forensic accountants produce tracing schedules that support freezing injunction applications, civil recovery claims, and POCA confiscation proceedings.",
    metaTitle: "Asset Tracing & Recovery UK | Employee Fraud Expert Witness",
    metaDescription:
      "Forensic asset tracing for employee fraud cases in the UK - follow misappropriated funds through bank accounts and property to support civil recovery and freezing injunctions.",
    faqs: [
      {
        question: "What is asset tracing in an employee fraud case?",
        answer:
          "Asset tracing is the forensic accounting process of following misappropriated funds from the point of theft through subsequent bank transfers, property purchases, and connected entities to identify where the money is now held - enabling recovery through civil proceedings or POCA confiscation.",
      },
      {
        question: "How quickly can asset tracing evidence be prepared for a freezing injunction?",
        answer:
          "Preliminary asset tracing and quantum assessment can be prepared within 24–48 hours for urgent without-notice freezing injunction applications. A full tracing report follows as proceedings develop.",
      },
    ],
    methodology: [
      {
        phase: "Source identification",
        whatWeDo:
          "Identify origin of misappropriated funds from payroll, expenses, invoices, or other fraud vectors.",
        deliverable: "Source transaction schedule",
      },
      {
        phase: "Flow analysis",
        whatWeDo:
          "Trace funds through bank accounts, credit cards, property purchases, and third-party entities.",
        deliverable: "Asset flow diagram and transaction schedule",
      },
      {
        phase: "Asset identification",
        whatWeDo:
          "Identify current location of assets - bank balances, property, vehicles, shares, and connected company accounts.",
        deliverable: "Available assets schedule",
      },
      {
        phase: "Expert evidence",
        whatWeDo:
          "Prepare tracing report for freezing injunction, civil recovery, or POCA proceedings.",
        deliverable: "CPR Part 35 compliant tracing report",
      },
    ],
    relatedCaseType: "/case-types/civil-fraud-recovery",
  },
  {
    id: "loss-quantification",
    title: "Loss Quantification & Quantum",
    shortDescription:
      "Precise calculation of total loss from employee fraud for civil recovery, insurance claims, and expert witness reports.",
    description:
      "Loss quantification establishes the exact financial impact of employee fraud - the figure that drives civil recovery claims, insurance notifications, and settlement negotiations. Our experts reconcile fraudulent transactions against legitimate business activity to produce defensible quantum figures.",
    metaTitle: "Employee Fraud Loss Quantification UK | Quantum Expert Witness",
    metaDescription:
      "Precise loss quantification for employee fraud in the UK - total fraud quantum for civil recovery claims, insurance notifications, and CPR Part 35 expert reports.",
    faqs: [
      {
        question: "How is the total loss from employee fraud calculated?",
        answer:
          "Forensic accountants identify all fraudulent transactions from source records, reconcile against bank statements, and calculate the total misappropriated amount. The quantum includes direct theft plus associated costs such as employer NI on ghost employee wages, and consequential losses where recoverable in civil proceedings.",
      },
      {
        question: "Is the initially discovered amount usually the full loss?",
        answer:
          "No. Systematic employee fraud often extends over years and involves more transactions than initially discovered. Forensic accountants analyse the full historical dataset to establish the true quantum - which is frequently substantially larger than the first identified amount.",
      },
    ],
    methodology: [
      {
        phase: "Scope definition",
        whatWeDo:
          "Agree period of fraud, categories of loss, and whether gross or net figures are required.",
        deliverable: "Quantum methodology statement",
      },
      {
        phase: "Transaction analysis",
        whatWeDo:
          "Identify and categorise all fraudulent transactions from source records.",
        deliverable: "Detailed transaction schedule",
      },
      {
        phase: "Quantum calculation",
        whatWeDo:
          "Calculate total loss including direct theft, associated costs, and consequential losses where recoverable.",
        deliverable: "Loss quantification schedule with supporting workings",
      },
      {
        phase: "Expert report",
        whatWeDo:
          "Prepare CPR Part 35 compliant quantum report with sensitivity analysis.",
        deliverable: "Expert witness report on quantum",
      },
    ],
    relatedCaseType: "/case-types/civil-fraud-recovery",
  },
  {
    id: "payroll-fraud-analysis",
    title: "Payroll Fraud Analysis",
    shortDescription:
      "Detection and quantification of ghost employees, wage inflation, commission fraud, and overtime manipulation.",
    description:
      "Payroll fraud analysis compares payroll records against HR files, bank payment data, and system access logs to identify ghost employees, inflated wages, and fraudulent commission claims. Our experts quantify total losses and identify control failures that enabled the fraud.",
    metaTitle: "Payroll Fraud Analysis UK | Ghost Employee Expert Witness",
    metaDescription:
      "Payroll fraud analysis and ghost employee detection in the UK - forensic reconciliation of payroll against HR records, loss quantification, and expert witness reports.",
    faqs: [
      {
        question: "How does a forensic accountant detect ghost employee fraud?",
        answer:
          "Ghost employee detection involves comparing payroll records against HR employee files - identifying employees with no HR file, duplicate national insurance numbers, or bank accounts linked to existing staff. Forensic accountants also analyse when ghost employees were added and who had payroll system access.",
      },
      {
        question: "Does payroll fraud quantum include employer NI and pension contributions?",
        answer:
          "Yes. The total loss includes all payments made to ghost employees or through inflated wages, plus employer national insurance and pension contributions improperly paid on fraudulent wages.",
      },
    ],
    methodology: [
      {
        phase: "Data reconciliation",
        whatWeDo:
          "Match payroll records to HR employee files, NI numbers, and bank account details.",
        deliverable: "Reconciliation report identifying anomalies",
      },
      {
        phase: "Ghost employee detection",
        whatWeDo:
          "Identify fictitious employees, duplicate NI numbers, and bank accounts linked to existing staff.",
        deliverable: "Ghost employee schedule with payment history",
      },
      {
        phase: "Pattern analysis",
        whatWeDo:
          "Analyse wage changes, overtime patterns, and commission claims for manipulation.",
        deliverable: "Fraud pattern analysis report",
      },
      {
        phase: "Quantum & report",
        whatWeDo:
          "Calculate total fraudulent payments including employer NI and pension contributions.",
        deliverable: "Payroll fraud quantum report",
      },
    ],
    relatedCaseType: "/case-types/payroll-fraud-ghost-employees",
  },
  {
    id: "expense-procurement-review",
    title: "Expense & Procurement Fraud Review",
    shortDescription:
      "Data analytics across expense claims and procurement records to detect systematic fraud and quantify losses.",
    description:
      "Expense and procurement fraud reviews use data analytics to identify duplicate claims, threshold manipulation, kickback arrangements, and sole-source awards without competitive tender. We analyse the full historical dataset - not just discovered instances - to establish the true scale of fraud.",
    metaTitle:
      "Expense & Procurement Fraud Review UK | Forensic Analysis Expert",
    metaDescription:
      "Expense and procurement fraud review in the UK - data analytics across expense claims and procurement records to detect systematic fraud and quantify total losses.",
    faqs: [
      {
        question: "How does forensic analysis detect expense fraud patterns?",
        answer:
          "Data analytics across the full expense claims dataset identifies duplicates (same amount, same date, different reference), claims systematically below approval thresholds, round-number amounts, weekend claims, and discrepancies against travel records and business system data.",
      },
      {
        question: "Is expense fraud worth investigating if individual claims are small?",
        answer:
          "Yes. Individual expense fraud claims may appear modest, but systematic fraud by one or more employees over years can amount to significant sums. Full dataset analytics typically reveals a total quantum substantially larger than initially discovered instances.",
      },
    ],
    methodology: [
      {
        phase: "Data extraction",
        whatWeDo:
          "Extract complete expense claims and procurement records for analysis period.",
        deliverable: "Structured dataset for analytics",
      },
      {
        phase: "Analytics",
        whatWeDo:
          "Duplicate detection, threshold analysis, vendor analysis, and pattern identification.",
        deliverable: "Anomaly report with flagged transactions",
      },
      {
        phase: "Investigation",
        whatWeDo:
          "Investigate flagged items, review supporting documentation, and interview where appropriate.",
        deliverable: "Investigation findings on confirmed fraud",
      },
      {
        phase: "Quantum",
        whatWeDo:
          "Calculate total fraudulent expense and procurement losses.",
        deliverable: "Loss quantification report",
      },
    ],
    relatedCaseType: "/case-types/expense-fraud-investigation",
  },
  {
    id: "invoice-supplier-investigation",
    title: "Invoice & Supplier Fraud Investigation",
    shortDescription:
      "Investigation of fictitious suppliers, invoice inflation, kickbacks, and vendor master file manipulation.",
    description:
      "Invoice and supplier fraud investigations analyse the vendor master file, three-way matching failures, and payment trails to identify fictitious suppliers, inflated invoices, and kickback arrangements. We trace payments to bank accounts and identify links to employees or connected companies.",
    metaTitle:
      "Invoice & Supplier Fraud Investigation UK | Expert Witness",
    metaDescription:
      "Invoice and supplier fraud investigation in the UK - fictitious suppliers, kickback schemes, vendor master file analysis, and payment tracing by forensic accountants.",
    faqs: [
      {
        question: "How do forensic accountants investigate invoice fraud?",
        answer:
          "Investigation involves analysing the vendor master file for suspicious entries, three-way matching of invoices against purchase orders and delivery records, tracing payments to bank accounts linked to employees, and reviewing approval workflows for control failures.",
      },
      {
        question: "What is a kickback scheme and how is it detected?",
        answer:
          "In kickback arrangements, a supplier invoices at inflated rates or for work not done, then makes secret payments back to the employee. Forensic accountants trace both sides - overpayments to the supplier and secret return payments to the employee - to quantify total loss.",
      },
    ],
    methodology: [
      {
        phase: "Vendor analysis",
        whatWeDo:
          "Review vendor master file for suspicious entries - residential addresses, similar names, recently created suppliers.",
        deliverable: "Suspicious vendor schedule",
      },
      {
        phase: "Three-way match",
        whatWeDo:
          "Match invoices against purchase orders and delivery records to identify unsupported payments.",
        deliverable: "Unsupported invoice schedule",
      },
      {
        phase: "Payment tracing",
        whatWeDo:
          "Trace supplier payments to bank accounts and identify employee connections.",
        deliverable: "Payment tracing report",
      },
      {
        phase: "Kickback analysis",
        whatWeDo:
          "Identify secret payments from suppliers back to employees or connected entities.",
        deliverable: "Kickback scheme analysis and quantum",
      },
    ],
    relatedCaseType: "/case-types/invoice-supplier-fraud",
  },
  {
    id: "expert-witness-reports",
    title: "Expert Witness Reports & Testimony",
    shortDescription:
      "CPR Part 35 compliant expert reports and oral evidence for civil, criminal, and tribunal proceedings.",
    description:
      "Our employee fraud expert witnesses produce CPR Part 35 compliant reports that clearly explain the fraud, quantify the loss, and withstand cross-examination. Reports address the Ikarian Reefer duties - primary duty to the court, objectivity, and independence from the instructing party.",
    metaTitle:
      "Employee Fraud Expert Witness Reports UK | CPR Part 35 Compliant",
    metaDescription:
      "CPR Part 35 compliant employee fraud expert witness reports and oral testimony for UK civil, criminal, and tribunal proceedings.",
    faqs: [
      {
        question: "What must an employee fraud expert witness report include under CPR Part 35?",
        answer:
          "A CPR Part 35 compliant report must include the expert's qualifications, instructions received, methodology, findings with supporting schedules, conclusions, and a statement of truth. The expert must confirm their primary duty is to the court, not the instructing party, per The Ikarian Reefer [1993] duties.",
      },
      {
        question: "Can the same expert provide both investigation and expert witness report?",
        answer:
          "Yes. The same forensic accountant typically conducts the investigation and prepares the expert witness report, ensuring consistency between workpapers and reported findings. Early investigation under privilege can transition to a court report when proceedings are issued.",
      },
    ],
    methodology: [
      {
        phase: "Instruction",
        whatWeDo:
          "Review letter of instruction, agree scope, and confirm CPR Part 35 compliance requirements.",
        deliverable: "Acknowledgement of instruction and scope agreement",
      },
      {
        phase: "Investigation",
        whatWeDo:
          "Conduct forensic investigation and analysis within agreed scope.",
        deliverable: "Investigation workpapers",
      },
      {
        phase: "Report drafting",
        whatWeDo:
          "Prepare structured expert report with executive summary, methodology, findings, and conclusions.",
        deliverable: "Draft expert witness report",
      },
      {
        phase: "Trial support",
        whatWeDo:
          "Joint expert meetings, supplemental reports, and oral evidence at trial or tribunal.",
        deliverable: "Oral testimony and supplemental reports as required",
      },
    ],
    relatedCaseType: "/case-types/civil-fraud-recovery",
  },
  {
    id: "ftpf-advisory",
    title: "Failure to Prevent Fraud Advisory & Procedures Review",
    shortDescription:
      "Assessment of fraud prevention procedures under ECCTA 2023 and advisory support for FTPF compliance.",
    description:
      "The Failure to Prevent Fraud offence under the Economic Crime and Corporate Transparency Act 2023, in force from 1 September 2025, makes large organisations liable for unlimited fines if employees commit fraud for the organisation's benefit without adequate prevention procedures. Our experts assess existing controls, identify gaps, and advise on reasonable procedures defence.",
    metaTitle:
      "Failure to Prevent Fraud Advisory UK | ECCTA 2023 Expert Witness",
    metaDescription:
      "FTPF advisory and fraud prevention procedures review under ECCTA 2023 - assess controls, identify gaps, and prepare the reasonable procedures defence for UK large organisations.",
    faqs: [
      {
        question: "What is the Failure to Prevent Fraud offence under ECCTA 2023?",
        answer:
          "In force from 1 September 2025, the FTPF offence makes large organisations (250+ employees, £36m+ turnover, or £18m+ assets) liable for unlimited fines if employees commit specified fraud offences for the organisation's benefit without reasonable fraud prevention procedures in place.",
      },
      {
        question: "How can an expert witness help with FTPF compliance?",
        answer:
          "Forensic accountants conduct independent assessments of fraud prevention controls against MOJ guidance, identify gaps before an offence occurs, and provide expert evidence on whether procedures were reasonable if FTPF proceedings are brought.",
      },
    ],
    methodology: [
      {
        phase: "Scope assessment",
        whatWeDo:
          "Determine whether organisation meets large organisation thresholds and which fraud offences are in scope.",
        deliverable: "FTPF applicability assessment",
      },
      {
        phase: "Controls review",
        whatWeDo:
          "Review existing fraud prevention policies, internal controls, and detection mechanisms.",
        deliverable: "Controls gap analysis",
      },
      {
        phase: "Procedures design",
        whatWeDo:
          "Recommend reasonable fraud prevention procedures aligned with MOJ guidance.",
        deliverable: "Procedures improvement plan",
      },
      {
        phase: "Expert evidence",
        whatWeDo:
          "Provide expert evidence on adequacy of procedures in FTPF proceedings if required.",
        deliverable: "Expert report on fraud prevention procedures",
      },
    ],
    relatedCaseType: "/case-types/failure-to-prevent-fraud-eccta",
  },
];

export const serviceNames = services.map((s) => s.title);
export const serviceSlugs = services.map((s) => s.id);

export function getService(id: string): ServiceItem | undefined {
  return services.find((s) => s.id === id);
}
