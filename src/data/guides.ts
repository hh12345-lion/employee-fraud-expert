import type { GuidePage } from "./types";

export const guides: GuidePage[] = [
  {
    slug: "what-to-do-when-you-discover-fraud",
    title: "What to Do When You Discover Fraud",
    h1: "What to Do When You Discover Employee Fraud: A Complete Guide",
    metaTitle:
      "What to Do When You Discover Employee Fraud | Complete UK Guide",
    metaDescription:
      "Complete guide for UK employers who have discovered employee fraud - immediate steps, evidence preservation, legal professional privilege, and civil vs criminal options.",
    aboutServiceId: "fraud-investigation",
    paragraphs: [
      "Discovering suspected employee fraud is one of the most stressful situations an employer, HR director, or finance team can face. The decisions you make in the first 24–72 hours will determine whether you can recover losses, preserve evidence for proceedings, and protect the organisation from further harm. This guide explains exactly what to do - and what not to do - when fraud is discovered.",
    ],
    sections: [
      {
        heading: "Immediate Steps: The First Hour",
        content:
          "Do not alert the suspect. Do not access their computer, email, or files yourself - you may inadvertently alter metadata or destroy evidence. Do not discuss the discovery with colleagues who may warn the suspect. Document what you know: what was discovered, when, by whom, and what records are available.\n\nContact a civil fraud solicitor and a forensic accountant immediately. Many firms offer same-day or next-day emergency response. The forensic accountant should be instructed via your solicitor to ensure legal professional privilege protects the investigation findings.",
      },
      {
        heading: "Evidence Preservation",
        content:
          "Preserve all financial records in their current state - do not delete, move, or modify any files. Secure backup copies of payroll records, expense claims, supplier invoices, bank statements, and email data. If your IT team needs to act, ensure they do so under forensic protocols that maintain chain of custody.\n\nNote all system access the suspect had - payroll systems, accounts payable, expense approval workflows, and vendor master file administration. This information helps the forensic accountant scope the investigation efficiently.",
      },
      {
        heading: "Legal Professional Privilege",
        content:
          "Forensic accountants working under legal professional privilege produce reports protected from disclosure to the opposing party. This requires instruction via your solicitor, not direct engagement by the employer. Privileged investigation reports allow your solicitor to assess the strength of your case and develop strategy without revealing your analysis to the suspect.\n\nDirect instruction of a forensic accountant by the employer may waive privilege, making investigation findings disclosable in subsequent proceedings. Always engage via your solicitor from the outset.",
      },
      {
        heading: "Civil vs Criminal Route",
        content:
          "You can pursue civil recovery, criminal prosecution, or both simultaneously. Civil proceedings focus on recovering money through asset tracing, freezing injunctions, and judgment enforcement - and typically recover more than criminal prosecution alone. Criminal proceedings focus on prosecution and POCA confiscation, which benefits the Crown rather than the employer directly.\n\nYour solicitor and forensic accountant will advise on the optimal strategy based on the scale of fraud, available evidence, suspect's assets, and urgency. In most cases, civil proceedings should be initiated promptly while criminal options are evaluated.",
      },
      {
        heading: "HR Procedure and Employee Suspension",
        content:
          "Follow your disciplinary procedure if suspending the employee, but coordinate timing with your solicitor and forensic accountant. Premature suspension may alert the suspect before evidence is secured. Conversely, allowing the employee continued access to systems risks further loss and evidence destruction.\n\nYour solicitor will advise on the appropriate point to suspend, ensuring the investigation is sufficiently advanced to support a reasonable belief in gross misconduct on the balance of probabilities.",
      },
      {
        heading: "Insurance Notification",
        content:
          "Many employer fraud losses are covered by fidelity insurance (employee dishonesty cover). Notify your broker promptly - policies often require notification within a specified period. Expert witness fees may be recoverable under the policy. Confirm coverage and notification requirements before instructing experts, as the insurer may have panel requirements or approval processes.",
      },
    ],
    faqs: [],
    relatedLinks: [
      { href: "/investigation-process", label: "First 72 Hours Guide" },
      { href: "/who-we-help/employers-hr", label: "Help for Employers" },
      { href: "/contact", label: "Get Expert Help" },
    ],
  },
  {
    slug: "civil-fraud-recovery-guide",
    title: "Civil Fraud Recovery Guide",
    h1: "Civil Fraud Recovery: A Solicitor's Guide to Expert Evidence",
    metaTitle:
      "Civil Fraud Recovery Guide for Solicitors | Expert Evidence UK",
    metaDescription:
      "Solicitor's guide to civil fraud recovery in employee fraud cases - freezing injunctions, Norwich Pharmacal orders, asset tracing, and forensic accountant expert evidence.",
    aboutServiceId: "asset-tracing",
    paragraphs: [
      "Civil fraud recovery is the primary mechanism for UK employers to recover losses from employee fraud. This guide explains the role of forensic accounting expert evidence at each stage of civil proceedings - from the urgent without-notice freezing injunction application through to trial.",
    ],
    sections: [
      {
        heading: "The Civil Fraud Claim Structure",
        content:
          "Employee fraud civil claims typically allege dishonest misappropriation of the employer's property, seeking restitution, account of profits, and equitable tracing remedies. The claimant must establish dishonesty (objectively assessed under Ivey v Genting Casinos [2017]), causation, and quantum.\n\nForensic accountants support each element: investigation establishes the dishonest conduct and mechanism; asset tracing establishes causation between the fraud and identifiable assets; loss quantification establishes quantum.",
      },
      {
        heading: "Freezing Injunctions",
        content:
          "Freezing injunction applications are typically made without notice when there is real risk of asset dissipation. The court requires credible evidence of a good arguable case and a real risk of dissipation. Forensic accountants provide preliminary quantum assessment and asset tracing within 24–48 hours.\n\nThe supporting affidavit should include: summary of the fraud mechanism; preliminary quantum; identified assets and their location; and evidence of dissipation risk (e.g. recent large transfers, property sales, or suspect's knowledge of the investigation).",
      },
      {
        heading: "Norwich Pharmacal Orders",
        content:
          "Where the employer knows funds were misappropriated but cannot identify the recipient accounts, a Norwich Pharmacal order requires banks or other third parties to disclose information identifying wrongdoers. Forensic accountants analyse the disclosed information and trace funds through subsequent transfers.\n\nNorwich Pharmacal applications are often combined with freezing injunction applications in the initial without-notice hearing.",
      },
      {
        heading: "Asset Tracing Methodology",
        content:
          "Asset tracing follows misappropriated funds from source through intermediate accounts to current asset location. The forensic accountant produces a tracing schedule showing each transaction, the account involved, and the current status of funds.\n\nTracing becomes complex where funds have been mixed with legitimate income (the lowest intermediate balance rule may apply) or converted into property. Expert evidence must address these complexities clearly for the court.",
      },
      {
        heading: "The Expert Witness Report",
        content:
          "The CPR Part 35 expert report should clearly explain: the fraud mechanism; the investigation methodology; the findings with supporting schedules; the loss quantification; and the asset tracing conclusions. The report must comply with PD 35 and address the Ikarian Reefer duties of independence and objectivity.\n\nExpert reports in fraud cases are heavily scrutinised at trial. Clear methodology, transparent workings, and acknowledgment of limitations strengthen credibility under cross-examination.",
      },
    ],
    faqs: [],
    relatedLinks: [
      { href: "/case-types/civil-fraud-recovery", label: "Civil Fraud Recovery" },
      { href: "/services#asset-tracing", label: "Asset Tracing Service" },
      { href: "/how-to-instruct", label: "How to Instruct" },
    ],
  },
  {
    slug: "failure-to-prevent-fraud-guide",
    title: "Failure to Prevent Fraud Guide",
    h1: "Failure to Prevent Fraud: What Employers Need to Know About ECCTA 2023",
    metaTitle:
      "Failure to Prevent Fraud Guide | ECCTA 2023 | UK Employers",
    metaDescription:
      "Complete guide to the Failure to Prevent Fraud offence under ECCTA 2023 - who is in scope, reasonable procedures defence, and expert advisory role for UK employers.",
    aboutServiceId: "ftpf-advisory",
    paragraphs: [
      "The Failure to Prevent Fraud offence under the Economic Crime and Corporate Transparency Act 2023 represents the biggest shift in UK corporate fraud law in a decade. In force from 1 September 2025, it creates potentially unlimited fines for large organisations that fail to prevent employee fraud committed for the organisation's benefit. This guide explains what employers need to know and how to prepare.",
    ],
    sections: [
      {
        heading: "The FTPF Offence Explained",
        content:
          "An organisation commits the offence if a specified fraud offence is committed by an employee or agent for the organisation's benefit and the organisation did not have reasonable fraud prevention procedures in place. The offence is one of strict liability - the organisation does not need to have known about or authorised the fraud.\n\nSpecified offences include: fraud by false representation (Fraud Act 2006 s2); fraud by abuse of position (s4); fraud by failing to disclose (s3); false accounting (Theft Act 1968 s17); and fraudulent trading (Companies Act 2006 s993).",
      },
      {
        heading: "Who Is in Scope?",
        content:
          "The offence applies to 'large organisations' meeting at least two of three thresholds: 250 or more employees; annual turnover of £36 million or more; or total assets of £18 million or more. These thresholds align with the Companies Act 2006 definition of a large company.\n\nThe offence applies to bodies corporate, partnerships, and unincorporated associations operating in the UK. Parent companies may be liable for fraud committed by subsidiaries where the fraud was for the parent's benefit.",
      },
      {
        heading: "The Reasonable Procedures Defence",
        content:
          "An organisation has a defence if it proves it had reasonable fraud prevention procedures in place, or that it was not reasonable in all the circumstances to expect procedures to be in place. The Ministry of Justice has published guidance on what constitutes reasonable procedures.\n\nReasonable procedures typically include: a fraud prevention policy; risk assessment; proportionate internal controls; due diligence on employees in sensitive roles; whistleblowing mechanisms; and regular monitoring and review. The procedures must be effective in practice, not merely documented.",
      },
      {
        heading: "Expert Advisory Role",
        content:
          "Forensic accountants and employee fraud experts assist organisations in assessing the adequacy of existing fraud prevention procedures, identifying gaps, and designing improvements before an offence occurs. This proactive advisory role is increasingly important for compliance teams and audit committees.\n\nIn FTPF proceedings, expert witnesses may be instructed to opine on whether the organisation's procedures were reasonable at the time the fraud occurred - a retrospective assessment requiring analysis of the controls environment, policy documentation, and actual practice.",
      },
      {
        heading: "How to Prepare",
        content:
          "Organisations should conduct a fraud prevention gap analysis against MOJ guidance before September 2025 and implement improvements. Key actions include: appointing a senior responsible officer for fraud prevention; conducting a fraud risk assessment; reviewing and updating internal controls; training employees; and establishing monitoring mechanisms.\n\nDocument all procedures and their implementation - the defence requires evidence that procedures were not merely written but actively maintained and enforced.",
      },
    ],
    faqs: [],
    relatedLinks: [
      { href: "/case-types/failure-to-prevent-fraud-eccta", label: "FTPF Case Type" },
      { href: "/services#ftpf-advisory", label: "FTPF Advisory Service" },
      { href: "/guides/employee-fraud-prevention-controls", label: "Prevention Controls Guide" },
    ],
  },
  {
    slug: "payroll-fraud-detection-guide",
    title: "Payroll Fraud Detection Guide",
    h1: "Payroll Fraud Detection: How Forensic Accountants Investigate Ghost Employees",
    metaTitle:
      "Payroll Fraud Detection Guide | Ghost Employees UK",
    metaDescription:
      "How forensic accountants detect and investigate payroll fraud and ghost employee schemes - data analytics, reconciliation methodology, and quantification.",
    aboutServiceId: "payroll-fraud-analysis",
    paragraphs: [
      "Payroll fraud is one of the most common forms of employee fraud, yet ghost employee schemes can run undetected for years when perpetrators control both payroll processing and record-keeping. This guide explains how forensic accountants detect payroll fraud and quantify losses.",
    ],
    sections: [
      {
        heading: "Ghost Employee Schemes",
        content:
          "A ghost employee is a fictitious person created on the payroll system whose wages are diverted to a bank account controlled by the fraudster. Schemes typically require the perpetrator to have access to payroll processing and the ability to add or modify employee records.\n\nGhost employees may share bank account details with the fraudster, use addresses linked to the fraudster or their associates, or have national insurance numbers that fail validation checks.",
      },
      {
        heading: "Detection Methodology",
        content:
          "Detection begins with reconciliation of payroll records against HR employee files. Every employee on the payroll should have a corresponding HR file with verified identity documents, signed contract, and confirmed bank details.\n\nRed flags include: employees with no HR file; duplicate national insurance numbers; bank accounts linked to existing employees or the payroll administrator; employees added shortly after changes in payroll system access; and employees who never take holiday or receive performance reviews.",
      },
      {
        heading: "Data Analytics Approach",
        content:
          "Forensic accountants use data analytics to analyse the complete payroll dataset - not just current employees. Analysis includes: trend analysis of headcount and payroll cost; comparison of payroll changes against HR onboarding records; bank account clustering (multiple employees sharing accounts); and analysis of who authorised payroll changes and when.\n\nDigital forensics may complement accounting analysis by examining system access logs, identifying when ghost employees were created, and establishing the audit trail of modifications.",
      },
      {
        heading: "Quantification",
        content:
          "Total loss is the sum of all payments to ghost employees or inflated wages, including employer national insurance and pension contributions improperly paid. Forensic accountants trace each payment through bank records and reconcile against the payroll system.\n\nWhere wage inflation rather than ghost employees is involved, the loss is the difference between actual pay and legitimate pay rates, calculated across the full period of manipulation.",
      },
      {
        heading: "Prevention Controls",
        content:
          "Effective payroll fraud prevention requires segregation of duties - no single employee should control both payroll processing and employee record maintenance. Regular reconciliation of payroll against HR records, independent review of payroll changes, and automated alerts for new employee additions below approval thresholds all reduce opportunity.\n\nUnder the Failure to Prevent Fraud offence, inadequate payroll controls may form part of a prosecution case against the organisation.",
      },
    ],
    faqs: [],
    relatedLinks: [
      { href: "/case-types/payroll-fraud-ghost-employees", label: "Payroll Fraud Cases" },
      { href: "/services#payroll-fraud-analysis", label: "Payroll Fraud Analysis" },
      { href: "/fraud-types", label: "Types of Employee Fraud" },
    ],
  },
  {
    slug: "poca-confiscation-fraud-guide",
    title: "POCA Confiscation Guide",
    h1: "POCA Confiscation in Employee Fraud Cases: Expert Evidence Guide",
    metaTitle:
      "POCA Confiscation Guide | Employee Fraud Expert Evidence UK",
    metaDescription:
      "Guide to POCA 2002 confiscation proceedings in employee fraud cases - benefit calculation, available assets, tainted gifts, and expert witness role.",
    aboutServiceId: "loss-quantification",
    paragraphs: [
      "Following conviction for employee fraud, POCA 2002 confiscation proceedings determine how much the defendant must pay from their assets. Forensic accountants play a central role in quantifying benefit from criminal conduct and identifying available assets. This guide explains the POCA framework and the expert's role.",
    ],
    sections: [
      {
        heading: "POCA 2002 Structure",
        content:
          "POCA confiscation proceedings follow conviction for a qualifying offence (including Fraud Act 2006 and Theft Act 1968 offences). The court determines the defendant's benefit from criminal conduct and makes a confiscation order for the recoverable amount - the benefit or available assets, whichever is lower.\n\nBenefit is the total financial gain from the criminal conduct. Available assets are the assets available to satisfy the confiscation order, including tainted gifts made within six years of the offence.",
      },
      {
        heading: "Benefit Calculation",
        content:
          "Forensic accountants quantify benefit by tracing all financial gain from the fraudulent conduct. In employee fraud cases, this includes direct theft, inflated expense reimbursements, kickbacks, and the value of assets purchased with fraud proceeds.\n\nWhere the defendant's criminal conduct constitutes a 'course of conduct', the court may make assumptions about benefit unless the defendant can disprove them on the balance of probabilities.",
      },
      {
        heading: "Available Assets Analysis",
        content:
          "Available assets include all property held by the defendant, including property transferred as tainted gifts. Forensic accountants analyse bank accounts, property registers, company shareholdings, and other asset classes to identify what can be realised.\n\nHidden assets are a common issue - forensic accountants use the same tracing techniques employed in civil recovery to identify assets held in third-party names or offshore jurisdictions.",
      },
      {
        heading: "Expert Witness Role",
        content:
          "The forensic accountant may be instructed by prosecution, defence, or as a single joint expert. The expert prepares benefit and available assets schedules, analyses contested transactions, and gives oral evidence at the confiscation hearing.\n\nDefence experts may challenge the prosecution's benefit calculation, identify legitimate sources of wealth, and argue that assumed benefit figures are excessive.",
      },
      {
        heading: "Civil Recovery Alongside POCA",
        content:
          "POCA confiscation benefits the Crown, not the victim employer directly. However, victim compensation orders can be made under s130 Sentencing Act 2020. Employers should pursue civil recovery in parallel to maximise total recovery from the perpetrator.\n\nRunning civil and criminal proceedings simultaneously requires careful coordination between the employer's solicitor and the forensic accountant to avoid prejudicing either track.",
      },
    ],
    faqs: [],
    relatedLinks: [
      { href: "/case-types/poca-confiscation-proceedings", label: "POCA Case Type" },
      { href: "/guides/civil-fraud-recovery-guide", label: "Civil Recovery Guide" },
      { href: "/services#loss-quantification", label: "Loss Quantification" },
    ],
  },
  {
    slug: "employee-fraud-prevention-controls",
    title: "Employee Fraud Prevention Controls",
    h1: "Employee Fraud Prevention: Controls & Expert Advisory",
    metaTitle:
      "Employee Fraud Prevention Controls | FTPF Compliance UK",
    metaDescription:
      "Guide to employee fraud prevention controls - ACFE fraud triangle, internal controls framework, FTPF reasonable procedures, and expert advisory role.",
    aboutServiceId: "ftpf-advisory",
    paragraphs: [
      "Preventing employee fraud requires a structured approach to internal controls, detection mechanisms, and response procedures. With the Failure to Prevent Fraud offence now in force, large organisations must demonstrate reasonable fraud prevention procedures or face potentially unlimited fines. This guide outlines the controls framework and expert advisory role.",
    ],
    sections: [
      {
        heading: "The ACFE Fraud Triangle",
        content:
          "Employee fraud occurs when three conditions align: Opportunity (access to assets and weak controls), Pressure (financial stress or lifestyle demands), and Rationalisation (convincing oneself the fraud is justified). Effective prevention addresses all three elements.\n\nReduce opportunity through segregation of duties, approval thresholds, and regular reconciliations. Address pressure through employee support programmes and fair compensation. Counter rationalisation through clear ethical standards and visible enforcement.",
      },
      {
        heading: "Internal Controls Framework",
        content:
          "Key controls for employee fraud prevention include: segregation of duties in finance and payroll functions; dual authorisation for payments above thresholds; regular bank reconciliations and exception reporting; vendor master file controls; expense claim analytics and random audits; and access controls on financial systems.\n\nControls must be proportionate to the organisation's size and fraud risk profile. A large organisation with 500 employees and £50m turnover requires more robust controls than a small business.",
      },
      {
        heading: "FTPF Reasonable Procedures",
        content:
          "Under ECCTA 2023, organisations must demonstrate reasonable fraud prevention procedures to establish a defence against the Failure to Prevent Fraud offence. MOJ guidance identifies six principles: top-level commitment; fraud risk assessment; proportionate procedures; due diligence; communication and training; and monitoring and review.\n\nProcedures must be documented, implemented, and regularly reviewed. An expert advisory review can identify gaps and recommend improvements before an offence occurs.",
      },
      {
        heading: "Expert Advisory Role in Controls Assessment",
        content:
          "Forensic accountants conduct independent assessments of fraud prevention controls, benchmarking against industry standards and MOJ guidance. The assessment identifies control gaps, prioritises improvements, and produces documentation supporting the reasonable procedures defence.\n\nExpert advisory engagements are increasingly requested by audit committees, compliance teams, and external auditors evaluating FTPF readiness.",
      },
      {
        heading: "Red Flags and Detection",
        content:
          "Detection mechanisms include: automated exception reporting in payroll and accounts payable; expense claim analytics; whistleblowing hotlines; regular internal audit reviews; and management review of financial reports. Employees who never take holiday, resist audit scrutiny, or display lifestyle inconsistent with salary are behavioural red flags requiring investigation.\n\nEarly detection limits loss and strengthens the organisation's position in any subsequent FTPF proceedings by demonstrating active monitoring.",
      },
    ],
    faqs: [],
    relatedLinks: [
      { href: "/guides/failure-to-prevent-fraud-guide", label: "FTPF Guide" },
      { href: "/services#ftpf-advisory", label: "FTPF Advisory" },
      { href: "/fraud-types", label: "Fraud Types & Red Flags" },
    ],
  },
];

export const guideSlugs = guides.map((g) => g.slug);

export function getGuide(slug: string): GuidePage | undefined {
  return guides.find((g) => g.slug === slug);
}
