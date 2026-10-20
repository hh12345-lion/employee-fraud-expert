import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { createMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";

export const metadata: Metadata = createMetadata({
  title: "Image Credits | Employee Fraud Expert",
  description: "Sources, authors and licences for the photographs used on Employee Fraud Expert.",
  path: "/image-credits",
});

export default function ImageCreditsPage() {
  return (
    <>
      <PageHero
        title="Image credits"
        subtitle="The photographs on this site come from Wikimedia Commons. Each is shown unaltered apart from resizing and cropping, under the licence listed below."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Image credits" }]}
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {Object.values(photos).map((p) => (
            <li key={p.src} className="grid grid-cols-[120px_minmax(0,1fr)] gap-5 border-b border-border pb-8">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image src={p.src} alt={p.alt} fill sizes="120px" className="object-cover" />
              </div>
              <div className="min-w-0 text-sm leading-relaxed">
                <a href={p.credit.source} target="_blank" rel="noopener noreferrer" className="break-words font-semibold text-heading underline-offset-2 hover:underline">
                  {p.credit.title}
                </a>
                <p className="mt-1 text-body/70">By {p.credit.creator}</p>
                <p className="text-body/70">
                  <a href={p.credit.licenseUrl || p.credit.source} target="_blank" rel="noopener noreferrer license" className="underline-offset-2 hover:underline">
                    {p.credit.license}
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
