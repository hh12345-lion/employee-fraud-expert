import Link from "next/link";

export function FTPFAlertBanner() {
  return (
    <div className="border-b border-[#b45309]/30 bg-[#FEF3C7]">
      <div className="mx-auto flex min-w-0 max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 text-sm text-[#92400E] sm:px-6 lg:px-8">
        <span aria-hidden>⚠</span>
        <span>
          <strong>New Law:</strong> Failure to Prevent Fraud offence in force
          from 1 September 2025. Large organisations now face unlimited fines
          if employees commit fraud for the company&apos;s benefit without
          adequate prevention procedures.{" "}
          <Link
            href="/guides/failure-to-prevent-fraud-guide"
            className="font-semibold underline hover:text-[#78350F]"
          >
            Learn more →
          </Link>
        </span>
      </div>
    </div>
  );
}
