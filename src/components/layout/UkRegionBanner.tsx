import { SITE_REGION_LABEL } from "@/lib/site";

/**
 * Persistent UK-only notice shown on every page above the main header.
 */
export function UkRegionBanner() {
  return (
    <div
      role="note"
      aria-label="Service region"
      className="border-b border-primary/20 bg-[#4a1212] text-center text-xs text-white/90 sm:text-sm"
    >
      <p className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <span className="font-semibold text-white">{SITE_REGION_LABEL}</span>
        <span className="hidden sm:inline">
          {" "}
          - This website and our expert witness referral service are for
          employers and solicitors in England and Wales, Scotland, and Northern
          Ireland only. We do not serve enquiries outside the United Kingdom.
        </span>
        <span className="sm:hidden">
          {" "}
          - UK employers and solicitors only. No international enquiries.
        </span>
      </p>
    </div>
  );
}
