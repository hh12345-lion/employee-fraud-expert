import type { GlossaryTerm } from "./types";

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Asset Misappropriation",
    slug: "asset-misappropriation",
    definition:
      "The theft or misuse of company assets by an employee for personal gain. Asset misappropriation accounts for approximately 86% of occupational fraud cases according to the ACFE Report to the Nations 2024, with a median loss exceeding £100,000.",
    link: { href: "/fraud-types", label: "Types of Employee Fraud" },
  },
  {
    term: "Asset Tracing",
    slug: "asset-tracing",
    definition:
      "The forensic accounting process of following misappropriated funds through bank accounts, property purchases, and connected entities to identify assets available for recovery in civil proceedings or POCA confiscation.",
    link: { href: "/services#asset-tracing", label: "Asset Tracing Service" },
  },
  {
    term: "Bribery Act 2010",
    slug: "bribery-act-2010",
    definition:
      "UK legislation creating offences of paying bribes (s1), receiving bribes (s2), bribing foreign public officials (s6), and the corporate offence of failure to prevent bribery (s7). Relevant to employee corruption and kickback schemes.",
    link: { href: "/case-types/bribery-corruption", label: "Bribery & Corruption Cases" },
  },
  {
    term: "Benefit from Criminal Conduct (POCA)",
    slug: "benefit-from-criminal-conduct",
    definition:
      "Under POCA 2002, the total financial gain a defendant obtained from criminal conduct. In employee fraud confiscation proceedings, forensic accountants quantify benefit by tracing all financial gain from the fraudulent activity.",
    link: { href: "/case-types/poca-confiscation-proceedings", label: "POCA Proceedings" },
  },
  {
    term: "CPR Part 35",
    slug: "cpr-part-35",
    definition:
      "Civil Procedure Rules Part 35 governs expert evidence in England and Wales court proceedings. It requires experts to comply with practice directions, owe their primary duty to the court, and produce reports meeting specified format and content requirements.",
    link: { href: "/qualifications", label: "Expert Qualifications" },
  },
  {
    term: "Deferred Prosecution Agreement (DPA)",
    slug: "deferred-prosecution-agreement",
    definition:
      "An agreement between the Serious Fraud Office and an organisation whereby criminal prosecution is deferred in exchange for remedial action, cooperation, and financial penalties. Forensic accountants quantify benefit and support remediation programmes.",
    link: { href: "/case-types/bribery-corruption", label: "Bribery & Corruption" },
  },
  {
    term: "Economic Crime and Corporate Transparency Act 2023 (ECCTA)",
    slug: "eccta-2023",
    definition:
      "UK legislation introducing the Failure to Prevent Fraud offence for large organisations, among other economic crime reforms. The FTPF offence came into force on 1 September 2025 with potentially unlimited fines for non-compliance.",
    link: { href: "/case-types/failure-to-prevent-fraud-eccta", label: "FTPF Offence" },
  },
  {
    term: "Embezzlement",
    slug: "embezzlement",
    definition:
      "The theft or misappropriation of funds entrusted to an employee. The employee has legitimate access to the funds; the taking requires skill to accomplish and conceal. Distinguished from larceny by the position of trust.",
    link: { href: "/fraud-types", label: "Types of Employee Fraud" },
  },
  {
    term: "Expense Fraud",
    slug: "expense-fraud",
    definition:
      "Submitting false, inflated, or fabricated expense claims for reimbursement. Common patterns include personal expenses as business costs, duplicate claims, inflated mileage, and split claims below approval thresholds.",
    link: { href: "/case-types/expense-fraud-investigation", label: "Expense Fraud Cases" },
  },
  {
    term: "Failure to Prevent Fraud (FTPF) Offence",
    slug: "failure-to-prevent-fraud",
    definition:
      "Corporate offence under ECCTA 2023, in force from 1 September 2025. Large organisations face unlimited fines if employees commit specified fraud offences for the organisation's benefit without reasonable prevention procedures.",
    link: { href: "/case-types/failure-to-prevent-fraud-eccta", label: "FTPF Case Type" },
  },
  {
    term: "False Accounting (Theft Act 1968 s17)",
    slug: "false-accounting",
    definition:
      "Criminal offence of falsifying financial records with intent to gain or cause loss. Commonly charged alongside fraud offences in employee fraud prosecutions where records were manipulated to conceal theft.",
    link: { href: "/what-is-employee-fraud", label: "Legal Framework" },
  },
  {
    term: "Fraud Act 2006",
    slug: "fraud-act-2006",
    definition:
      "Primary UK legislation covering employee fraud in England and Wales. Key offences include fraud by false representation (s2), fraud by failing to disclose (s3), and fraud by abuse of position (s4).",
    link: { href: "/what-is-employee-fraud", label: "What Is Employee Fraud?" },
  },
  {
    term: "Fraud by Abuse of Position (s4 Fraud Act 2006)",
    slug: "fraud-by-abuse-of-position",
    definition:
      "Offence committed when a person in a position of trust dishonestly abuses that position intending to make a gain or cause loss. The most common fraud charge in employee fraud cases where the perpetrator exploited their role.",
    link: { href: "/what-is-employee-fraud", label: "Legal Framework" },
  },
  {
    term: "Fraud Triangle (ACFE)",
    slug: "fraud-triangle",
    definition:
      "The three conditions enabling employee fraud: Opportunity (access to assets and weak controls), Pressure (financial stress or lifestyle demands), and Rationalisation (convincing oneself the fraud is justified). Used in fraud prevention framework design.",
    link: { href: "/fraud-types", label: "Fraud Types Guide" },
  },
  {
    term: "Freezing Injunction (Mareva)",
    slug: "freezing-injunction",
    definition:
      "Court order preventing a defendant from dissipating assets pending trial. In employee fraud cases, forensic accountants provide urgent quantum and asset tracing evidence to support without-notice applications.",
    link: { href: "/case-types/civil-fraud-recovery", label: "Civil Fraud Recovery" },
  },
  {
    term: "Ghost Employee",
    slug: "ghost-employee",
    definition:
      "A fictitious employee created on the payroll system whose wages are diverted to a bank account controlled by the fraudster. Detected by comparing payroll records against HR files and verifying identity documents.",
    link: { href: "/case-types/payroll-fraud-ghost-employees", label: "Payroll Fraud Cases" },
  },
  {
    term: "The Ikarian Reefer Duties",
    slug: "ikarian-reefer-duties",
    definition:
      "Expert witness duties established in National Justice Compania Naviera SA v Prudential Assurance Co Ltd [1993] (The Ikarian Reefer). Experts owe their primary duty to the court, must provide independent objective evidence, and must not act as advocates for the instructing party.",
    link: { href: "/qualifications", label: "CPR Part 35 Compliance" },
  },
  {
    term: "Invoice Fraud",
    slug: "invoice-fraud",
    definition:
      "Creation of fictitious invoices, inflation of supplier invoices, or submission of invoices for work not performed - often with secret payments back to the employee. Investigated through vendor master file analysis and three-way matching.",
    link: { href: "/case-types/invoice-supplier-fraud", label: "Invoice Fraud Cases" },
  },
  {
    term: "Kickback",
    slug: "kickback",
    definition:
      "A secret payment from a supplier to an employee in return for preferential treatment - such as contract awards at inflated rates or approval of invoices for work not done. Requires tracing both overpayments and secret return payments.",
    link: { href: "/case-types/invoice-supplier-fraud", label: "Invoice & Supplier Fraud" },
  },
  {
    term: "Legal Professional Privilege (LPP)",
    slug: "legal-professional-privilege",
    definition:
      "Protection from disclosure of communications and reports between a solicitor and client. Forensic accountants instructed via solicitors produce investigation reports protected by LPP, safeguarding the employer's legal strategy.",
    link: { href: "/who-we-help/employers-hr", label: "Help for Employers" },
  },
  {
    term: "Loss Quantification",
    slug: "loss-quantification",
    definition:
      "The forensic accounting process of calculating the total financial loss from employee fraud - identifying all fraudulent transactions, reconciling against legitimate activity, and producing a defensible quantum figure for civil recovery or insurance claims.",
    link: { href: "/services#loss-quantification", label: "Loss Quantification Service" },
  },
  {
    term: "Misfeasance (IA 1986 s212)",
    slug: "misfeasance",
    definition:
      "Claim under Insolvency Act 1986 s212 allowing a liquidator to seek repayment of money misapplied or retained by a director. Used in insolvency proceedings where a director misappropriated company funds.",
    link: { href: "/case-types/director-misconduct-misappropriation", label: "Director Misconduct" },
  },
  {
    term: "Norwich Pharmacal Order",
    slug: "norwich-pharmacal-order",
    definition:
      "Court order requiring a third party (such as a bank) to disclose information identifying wrongdoers. Used in employee fraud cases to identify recipients of misappropriated funds when the perpetrator used intermediary accounts.",
    link: { href: "/case-types/civil-fraud-recovery", label: "Civil Fraud Recovery" },
  },
  {
    term: "Occupational Fraud",
    slug: "occupational-fraud",
    definition:
      "Financial crime committed by an employee against the organisation that employs them. Encompasses asset misappropriation, corruption, and financial statement fraud. Over 50% of all fraud is committed by employees according to ACFE research.",
    link: { href: "/what-is-employee-fraud", label: "What Is Employee Fraud?" },
  },
  {
    term: "Payroll Fraud",
    slug: "payroll-fraud",
    definition:
      "Manipulation of the payroll system for financial gain - including ghost employees, wage inflation, commission fraud, overtime fraud, and benefits fraud. Detected by reconciling payroll against HR records and bank payments.",
    link: { href: "/case-types/payroll-fraud-ghost-employees", label: "Payroll Fraud Cases" },
  },
  {
    term: "POCA 2002 (Proceeds of Crime Act)",
    slug: "poca-2002",
    definition:
      "Legislation providing for confiscation of benefit from criminal conduct and available assets following conviction. In employee fraud cases, forensic accountants quantify benefit and available assets for confiscation hearings.",
    link: { href: "/case-types/poca-confiscation-proceedings", label: "POCA Proceedings" },
  },
  {
    term: "Procurement Fraud",
    slug: "procurement-fraud",
    definition:
      "Manipulation of the procurement process - steering contracts to favoured suppliers in exchange for personal benefit. Indicators include sole-source awards without competitive tender and split purchases to avoid approval limits.",
    link: { href: "/fraud-types", label: "Types of Employee Fraud" },
  },
  {
    term: "Search Order (Anton Piller)",
    slug: "search-order",
    definition:
      "Without-notice court order allowing the claimant to enter premises and seize evidence before it can be destroyed. Used in employee fraud cases where there is real risk the suspect will destroy financial records or digital evidence.",
    link: { href: "/case-types/civil-fraud-recovery", label: "Civil Fraud Recovery" },
  },
  {
    term: "Serious Fraud Office (SFO)",
    slug: "serious-fraud-office",
    definition:
      "UK agency investigating and prosecuting serious or complex fraud, bribery, and corruption. May pursue deferred prosecution agreements with organisations where employee fraud or bribery offences are discovered at scale.",
    link: { href: "/case-types/bribery-corruption", label: "Bribery & Corruption" },
  },
  {
    term: "Single Joint Expert (SJE)",
    slug: "single-joint-expert",
    definition:
      "An expert witness appointed jointly by both parties under CPR Part 35 to provide a single opinion on a disputed issue. Commonly used in employee fraud cases for quantum disputes where both parties agree on the need for independent expertise.",
    link: { href: "/how-to-instruct", label: "How to Instruct" },
  },
  {
    term: "Tainted Gift (POCA)",
    slug: "tainted-gift",
    definition:
      "Under POCA 2002, a gift made by a defendant within six years of conviction where the gift was a transfer of property obtained through criminal conduct. Tainted gifts can be recovered as available assets in confiscation proceedings.",
    link: { href: "/case-types/poca-confiscation-proceedings", label: "POCA Proceedings" },
  },
  {
    term: "Theft Act 1968",
    slug: "theft-act-1968",
    definition:
      "UK legislation covering theft (s1), false accounting (s17), and false statements by company directors (s19). Frequently charged alongside Fraud Act 2006 offences in employee fraud criminal prosecutions.",
    link: { href: "/what-is-employee-fraud", label: "Legal Framework" },
  },
];
