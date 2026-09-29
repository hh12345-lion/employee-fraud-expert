import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { getAllBlogPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = createMetadata({
  title: "Blog | Employee Fraud Expert Insights",
  description:
    "Articles for employers and solicitors on employee fraud investigations, loss calculations for civil recovery claims, and forensic accounting evidence.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${SITE_NAME} Blog`,
            url: `${SITE_URL}/blog`,
            inLanguage: "en-GB",
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              dateModified: post.updated || post.date,
              url: `${SITE_URL}/blog/${post.slug}`,
              image: post.image ? `${SITE_URL}${post.image}` : undefined,
            })),
          },
        ]}
      />
      <PageHero
        title="Blog"
        subtitle="Practitioner-facing articles on employee fraud investigations, civil recovery loss calculations, and forensic accounting evidence."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />
      <Section>
        {posts.length === 0 ? (
          <p className="text-body">Articles will appear here shortly.</p>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="overflow-hidden border border-border bg-white shadow-[var(--shadow-card)]"
              >
                {post.image ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block h-52 w-full"
                  >
                    <Image
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </Link>
                ) : null}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    <time dateTime={post.updated || post.date}>
                      {new Date(post.updated || post.date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </time>
                    <span className="mx-2 text-body/50">·</span>
                    <span className="normal-case tracking-normal text-body/70">
                      {post.readingTime}
                    </span>
                  </p>
                  <h2 className="mt-3 font-semibold text-heading">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-highlight focus:outline-none focus-visible:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-body leading-relaxed">
                    {post.description}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-3 inline-block text-sm font-medium text-highlight hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <CTASection />
    </>
  );
}
