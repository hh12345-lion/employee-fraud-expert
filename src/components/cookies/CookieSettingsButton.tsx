"use client";

import { useCookieConsentOptional } from "./CookieConsentContext";

/**
 * Footer control to reopen cookie preferences at any time (GDPR / CCPA best practice).
 */
export function CookieSettingsButton() {
  const ctx = useCookieConsentOptional();
  if (!ctx) return null;

  return (
    <button
      type="button"
      onClick={ctx.openPreferences}
      className="min-h-[44px] text-sm text-white/60 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
    >
      Cookie Settings
    </button>
  );
}
