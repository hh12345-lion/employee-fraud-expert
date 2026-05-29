import type { Expert } from "./types";

export const experts: Expert[] = [
  {
    name: "James Harrington FCA CFE",
    jobTitle: "Senior Forensic Accountant & Employee Fraud Expert Witness",
    credentials: ["FCA (ICAEW)", "CFE (ACFE)", "CPFA (ICFA)", "Academy of Experts"],
    bio: "James Harrington has over 18 years of experience investigating employee fraud for UK employers and solicitors. He specialises in payroll fraud, embezzlement, and civil fraud recovery proceedings in the High Court. James has given expert evidence in more than 40 fraud trials and is regularly instructed for urgent freezing injunction applications. He holds FCA and CFE credentials and produces CPR Part 35 compliant reports for civil and criminal proceedings.",
    specialisms: [
      "Payroll fraud & ghost employees",
      "Embezzlement & asset tracing",
      "Civil fraud recovery",
      "Freezing injunction support",
    ],
  },
  {
    name: "Sarah Mitchell ACA CFE",
    jobTitle: "Forensic Accountant & Employee Fraud Investigation Specialist",
    credentials: ["ACA (ICAEW)", "CFE (ACFE)", "Expert Witness Institute"],
    bio: "Sarah Mitchell is a forensic accountant specialising in expense fraud, invoice fraud, and procurement kickback investigations. She uses data analytics to detect systematic fraud patterns across large datasets and has quantified losses exceeding £15 million in individual cases. Sarah advises employers on the first 72 hours after fraud discovery and conducts investigations under legal professional privilege. She provides expert evidence in employment tribunal and civil recovery proceedings.",
    specialisms: [
      "Expense & invoice fraud",
      "Procurement kickbacks",
      "Data analytics & detection",
      "Employment tribunal evidence",
    ],
  },
  {
    name: "David Okonkwo FCA CFE",
    jobTitle: "Forensic Accountant & POCA / Criminal Fraud Expert Witness",
    credentials: ["FCA (ICAEW)", "CFE (ACFE)", "FEWI", "GCFE"],
    bio: "David Okonkwo specialises in criminal employee fraud proceedings, POCA confiscation, and Failure to Prevent Fraud advisory under ECCTA 2023. He has been instructed by prosecution, defence, and as a single joint expert in Crown Court fraud trials. David combines forensic accounting with digital forensics expertise for data theft and IP misappropriation cases. He advises large organisations on FTPF compliance and reasonable fraud prevention procedures.",
    specialisms: [
      "POCA confiscation proceedings",
      "Failure to Prevent Fraud (ECCTA 2023)",
      "Data & IP theft investigations",
      "Criminal fraud expert evidence",
    ],
  },
];
