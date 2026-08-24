import { LINKEDIN_URL, SITE_EMAIL, SITE_NAME, SITE_URL } from "./site";

export function breadcrumbSchema(
  items: { name: string; path: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqPageSchema(
  faqs: { question: string; answer: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema({
  headline,
  description,
  path,
  datePublished = "2025-01-15",
  dateModified = "2025-05-26",
  aboutServiceId,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  aboutServiceId?: string;
}): object {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${SITE_URL}${path}`,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (aboutServiceId) {
    schema.about = {
      "@type": "Service",
      "@id": `${SITE_URL}/services#${aboutServiceId}`,
    };
  }

  return schema;
}

export const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  email: SITE_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  sameAs: [LINKEDIN_URL],
};

export function professionalServiceSchema(
  serviceNames: string[]
): object {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: "Employee Fraud Expert Witness",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "United States",
    serviceType: "Employee Fraud Expert Witness",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Employee Fraud Expert Witness Services",
      itemListElement: serviceNames.map((name, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name,
        },
      })),
    },
  };
}

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/glossary?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function serviceNode(
  id: string,
  name: string,
  description: string
): object {
  return {
    "@type": "Service",
    "@id": `${SITE_URL}/services#${id}`,
    name,
    description,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "United States",
  };
}

export function personSchema(expert: {
  name: string;
  jobTitle: string;
  description: string;
  credentials: string[];
}): object {
  return {
    "@type": "Person",
    name: expert.name,
    jobTitle: expert.jobTitle,
    description: expert.description,
    knowsAbout: expert.credentials,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function graphSchema(nodes: object[]): object {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
