import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/metadata";
import { ContentPageTemplate } from "@/components/ContentPageTemplate";
import { getCaseType, caseTypeSlugs } from "@/data/case-types";

export function generateStaticParams() {
  return caseTypeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCaseType(slug);
  if (!page) return {};
  return createMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/case-types/${slug}`,
  });
}

export default async function CaseTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCaseType(slug);
  if (!page) notFound();

  return (
    <ContentPageTemplate
      page={page}
      hubPath="/case-types"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Case Types", href: "/case-types" },
        { label: page.title },
      ]}
    />
  );
}
