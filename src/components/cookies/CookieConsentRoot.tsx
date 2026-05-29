"use client";

import {
  CookieConsentProvider,
  useCookieConsent,
} from "./CookieConsentContext";
import { CookieBanner } from "./CookieBanner";
import { CookiePreferencesPanel } from "./CookiePreferencesPanel";

/** Preferences modal when reopened from footer after initial consent */
function PreferencesOverlay() {
  const { status, showPreferences, closePreferences, isReady } =
    useCookieConsent();
  if (!isReady || !showPreferences || status === "pending") return null;
  return <CookiePreferencesPanel onClose={closePreferences} />;
}

export function CookieConsentRoot({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      {children}
      <CookieBanner />
      <PreferencesOverlay />
    </CookieConsentProvider>
  );
}
