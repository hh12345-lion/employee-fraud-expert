import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";
import { getBlogBySlug, getBlogSlugs } from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown";
import { createMetadata } from "@/lib/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return {};

  const base = createMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });

  const imageUrl = post.image ? `${SITE_URL}${post.image}` : undefined;

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      images: imageUrl
        ? [{ url: imageUrl, alt: post.imageAlt || post.title }]
        : base.openGraph && "images" in base.openGraph
          ? base.openGraph.images
          : undefined,
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const html = markdownToHtml(post.content);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleSchema({
            headline: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
          }),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updated || post.date,
            image: post.image ? `${SITE_URL}${post.image}` : undefined,
            inLanguage: "en-GB",
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
            mainEntityOfPage: url,
            url,
          },
        ]}
      />

      {post.image ? (
        <div className="relative mx-auto h-[min(28rem,55vw)] w-full max-w-6xl border-b border-border">
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <PageHero
        title={post.title}
        subtitle={post.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <Section>
        <p className="mb-6 text-sm text-body/70">
          <time dateTime={post.updated || post.date}>
            {new Date(post.updated || post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span className="mx-2">·</span>
          {post.readingTime}
        </p>
        <article
          className="prose-content mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <RelatedLinks
          links={[
            { href: "/blog", label: "All blog articles" },
            { href: "/investigation-process", label: "Investigation process" },
            { href: "/services", label: "Services" },
            { href: "/how-to-instruct", label: "How to instruct" },
          ]}
        />
        <p className="mt-10 text-sm">
          <Link
            href="/blog"
            className="font-semibold text-highlight hover:underline"
          >
            ← Back to the blog
          </Link>
        </p>
      </Section>
      <CTASection />
    </>
  );
}
