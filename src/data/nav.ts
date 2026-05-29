import { services } from "./services";

export const navServiceDropdownLinks = [
  { href: "/services", label: "All Services" },
  ...services.map((s) => ({
    href: `/services/${s.id}`,
    label: s.title,
  })),
];

export const navFraudTypeLinks = [
  { href: "/fraud-types", label: "All Fraud Types" },
  { href: "/fraud-types#embezzlement", label: "Embezzlement" },
  { href: "/fraud-types#payroll-fraud", label: "Payroll Fraud" },
  { href: "/fraud-types#expense-fraud", label: "Expense Fraud" },
  {
    href: "/fraud-types#invoice-supplier-fraud",
    label: "Invoice & Supplier Fraud",
  },
  { href: "/fraud-types#procurement-fraud", label: "Procurement Fraud" },
  {
    href: "/fraud-types#financial-statement-fraud",
    label: "Financial Statement Fraud",
  },
  { href: "/fraud-types#data-ip-theft", label: "Data & IP Theft" },
  { href: "/fraud-types#bribery-corruption", label: "Bribery & Corruption" },
  {
    href: "/fraud-types#failure-to-prevent-fraud",
    label: "Failure to Prevent Fraud (FTPF)",
  },
];

export const navCaseTypeLinks = [
  { href: "/case-types/civil-fraud-recovery", label: "Civil Fraud Recovery" },
  {
    href: "/case-types/poca-confiscation-proceedings",
    label: "POCA Confiscation",
  },
  {
    href: "/case-types/employment-tribunal-fraud",
    label: "Employment Tribunal",
  },
  {
    href: "/case-types/director-misconduct-misappropriation",
    label: "Director Misconduct",
  },
  {
    href: "/case-types/payroll-fraud-ghost-employees",
    label: "Payroll Fraud",
  },
  {
    href: "/case-types/invoice-supplier-fraud",
    label: "Invoice & Supplier Fraud",
  },
  {
    href: "/case-types/expense-fraud-investigation",
    label: "Expense Fraud",
  },
  { href: "/case-types/data-ip-theft", label: "Data & IP Theft" },
  { href: "/case-types/bribery-corruption", label: "Bribery & Corruption" },
  {
    href: "/case-types/failure-to-prevent-fraud-eccta",
    label: "Failure to Prevent Fraud",
  },
];

export const whoWeHelpItems = [
  { href: "/who-we-help/employers-hr", label: "Employers & HR Teams" },
  {
    href: "/who-we-help/solicitors-law-firms",
    label: "Solicitors & Law Firms",
  },
];

export const navResourcesDropdownLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/how-to-instruct", label: "How to Instruct" },
  { href: "/qualifications", label: "Qualifications" },
];

export const navResourcesMenuLinks = [
  { href: "/guides", label: "All Guides" },
  { href: "/glossary", label: "Glossary" },
  {
    href: "/investigation-process",
    label: "Investigation Process",
  },
  {
    href: "/what-is-employee-fraud",
    label: "What Is Employee Fraud?",
  },
];

export const mobileGroups = [
  {
    title: "Help",
    links: [
      { href: "/who-we-help", label: "Who We Help" },
      { href: "/who-we-help/employers-hr", label: "Employers & HR" },
      {
        href: "/who-we-help/solicitors-law-firms",
        label: "Solicitors & Law Firms",
      },
      { href: "/investigation-process", label: "Investigation Process" },
    ],
  },
  {
    title: "Services",
    links: navServiceDropdownLinks,
  },
  {
    title: "Fraud Types",
    links: navFraudTypeLinks,
  },
  {
    title: "Case Types",
    links: [
      { href: "/case-types", label: "All Case Types" },
      ...navCaseTypeLinks,
    ],
  },
  {
    title: "Resources",
    links: [
      ...navResourcesDropdownLinks,
      { href: "/glossary", label: "Glossary" },
    ],
  },
];
