import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import type { GuidePage } from "@/data/types";
import type { BreadcrumbItem } from "@/components/PageHero";

interface GuidePageTemplateProps {
  guide: GuidePage;
  breadcrumbs: BreadcrumbItem[];
  relatedLinks?: { href: string; label: string }[];
}

export function GuidePageTemplate({
  guide,
  breadcrumbs,
  relatedLinks,
}: GuidePageTemplateProps) {
  const path = `/guides/${guide.slug}`;
  const links = relatedLinks ?? guide.relatedLinks ?? [];
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: guide.h1, path },
    ]),
    articleSchema({
      headline: guide.h1,
      description: guide.metaDescription,
      path,
      aboutServiceId: guide.aboutServiceId,
    }),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero
        title={guide.h1}
        subtitle={guide.paragraphs[0]}
        breadcrumbs={breadcrumbs}
      />
      <Section>
        <article className="prose-content mx-auto max-w-3xl">
          {guide.paragraphs.slice(1).map((p, i) => (
            <p key={i} className="text-body leading-relaxed">
              {p}
            </p>
          ))}
          {guide.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              {section.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-body leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          ))}
          <RelatedLinks links={links} />
        </article>
      </Section>
      <CTASection />
    </>
  );
}
