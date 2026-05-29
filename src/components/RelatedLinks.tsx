import Link from "next/link";

interface RelatedLinksProps {
  links: { href: string; label: string }[];
  title?: string;
}

export function RelatedLinks({
  links,
  title = "Related pages",
}: RelatedLinksProps) {
  if (links.length === 0) return null;
  return (
    <div className="mt-10 rounded-lg border border-border bg-section-alt p-6">
      <h2 className="text-lg font-semibold text-heading">{title}</h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-highlight underline hover:text-[#b45309]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
