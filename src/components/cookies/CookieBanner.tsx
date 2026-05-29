"use client";

import Link from "next/link";
import { useCookieConsent } from "./CookieConsentContext";
import { CookiePreferencesPanel } from "./CookiePreferencesPanel";

/**
 * Fixed bottom banner - no document flow impact (avoids CLS).
 * Hidden after consent is stored in localStorage.
 */
export function CookieBanner() {
  const {
    status,
    isReady,
    showPreferences,
    acceptAll,
    rejectNonEssential,
    openPreferences,
    closePreferences,
  } = useCookieConsent();

  if (!isReady || status === "granted") return null;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4"
        aria-hidden={false}
      >
        <div
          role="region"
          aria-label="Cookie consent"
          aria-live="polite"
          className="pointer-events-auto mx-auto w-full max-w-4xl motion-safe:animate-[slideUp_320ms_ease-out]"
        >
          <div className="overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-primary via-primary to-[#4a1212] shadow-[0_8px_40px_rgba(0,0,0,0.35)] sm:rounded-2xl">
            <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-highlight sm:text-sm">
                  Your privacy matters
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-[0.9375rem]">
                  We use cookies to improve your experience, analyse traffic,
                  and support marketing. Choose how we use them, or read our{" "}
                  <Link
                    href="/cookies"
                    className="font-medium text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
                  >
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:max-w-md md:justify-end lg:flex-nowrap">
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="min-h-[44px] w-full whitespace-nowrap rounded-lg border border-white/35 bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:w-auto"
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={openPreferences}
                  className="min-h-[44px] w-full whitespace-nowrap rounded-lg border border-white/35 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:w-auto"
                >
                  Customise Preferences
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="min-h-[44px] w-full whitespace-nowrap rounded-lg bg-highlight px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#b45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight/60 sm:w-auto"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreferences && (
        <CookiePreferencesPanel onClose={closePreferences} />
      )}
    </>
  );
}
