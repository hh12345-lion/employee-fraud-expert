export interface FAQ {
  question: string;
  answer: string;
}

export interface ContentPage {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  paragraphs: string[];
  faqs: FAQ[];
  relatedLinks?: { href: string; label: string }[];
}

export interface GuidePage extends ContentPage {
  aboutServiceId?: string;
  sections: { heading: string; content: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  methodology: { phase: string; whatWeDo: string; deliverable: string }[];
  faqs: FAQ[];
  relatedCaseType?: string;
}

export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  link?: { href: string; label: string };
}

export interface Expert {
  name: string;
  jobTitle: string;
  credentials: string[];
  bio: string;
  specialisms: string[];
}
