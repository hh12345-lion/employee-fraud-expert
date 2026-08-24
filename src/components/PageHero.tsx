import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-section-alt">
      <div className="mx-auto max-w-6xl border-l-4 border-accent px-4 py-12 sm:px-6 md:py-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-body/60">
              {breadcrumbs.map((item, i) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <span aria-hidden className="text-border">/</span>}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-body">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="max-w-3xl font-serif text-3xl font-semibold leading-tight text-heading sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
