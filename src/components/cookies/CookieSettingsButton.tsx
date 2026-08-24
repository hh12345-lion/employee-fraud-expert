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
      className="min-h-11 text-xs text-white/50 transition-colors hover:text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      Cookie Settings
    </button>
  );
}
