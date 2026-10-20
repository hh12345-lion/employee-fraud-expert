import Link from "next/link";
import type { ReactNode } from "react";
import { HeroPhotos } from "@/components/HeroPhotos";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  label?: string;
  large?: boolean;
  children?: ReactNode;
}

/** Page opening: the heading comes first; intro and actions follow; breadcrumbs sit beneath. */
export function PageHero({ title, subtitle, breadcrumbs, label, large = false, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-cream">
      <div className={`relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] ${large ? "py-14 lg:py-20" : "py-12 lg:py-16"}`}>
        <div className="min-w-0">
          <h1 className={`max-w-3xl font-serif font-bold leading-[1.08] tracking-tight text-heading ${large ? "text-[2.4rem] sm:text-5xl lg:text-[3.5rem]" : "text-[2.1rem] sm:text-[2.6rem] lg:text-5xl"}`}>
            {title}
          </h1>
          <div className="mt-6 flex items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-accent" />
            <span className="h-[3px] w-16 rounded-full bg-accent" />
          </div>
          {subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">{subtitle}</p>}
          {children}
          {(breadcrumbs?.length || label) && (
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav aria-label="Breadcrumb">
                  <ol className="flex flex-wrap items-center gap-2 font-serif text-xs font-semibold uppercase tracking-[0.14em] text-body/70">
                    {breadcrumbs.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {i > 0 && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />}
                        {item.href && i < breadcrumbs.length - 1 ? (
                          <Link href={item.href} className="transition-colors hover:text-accent-ink">
                            {item.label}
                          </Link>
                        ) : (
                          <span aria-current={i === breadcrumbs.length - 1 ? "page" : undefined} className="text-heading">
                            {item.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              {label && <p className="font-serif text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink">{label}</p>}
            </div>
          )}
        </div>
        <HeroPhotos large={large} />
      </div>
    </section>
  );
}
