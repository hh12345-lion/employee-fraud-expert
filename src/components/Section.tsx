interface SectionProps {
  alt?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Section({ alt, children, className = "" }: SectionProps) {
  return (
    <section
      className={`py-12 md:py-16 ${alt ? "bg-section-alt" : "bg-white"} ${className}`}
    >
      <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
