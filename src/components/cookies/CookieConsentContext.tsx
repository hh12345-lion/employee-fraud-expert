"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ALL_GRANTED,
  DEFAULT_CONSENT,
  readStoredConsent,
  writeStoredConsent,
} from "@/lib/cookies/storage";
import { syncTrackingScripts } from "@/lib/cookies/consent-manager";
import type {
  CategoryConsent,
  ConsentStatus,
  CookieConsentContextValue,
} from "@/lib/cookies/types";

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider"
    );
  }
  return ctx;
}

export function useCookieConsentOptional(): CookieConsentContextValue | null {
  return useContext(CookieConsentContext);
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [consent, setConsent] = useState<CategoryConsent>(DEFAULT_CONSENT);
  const [showPreferences, setShowPreferences] = useState(false);

  const persistAndApply = useCallback((next: CategoryConsent) => {
    const stored = writeStoredConsent(next);
    setConsent(stored);
    setStatus("granted");
    setShowPreferences(false);
    syncTrackingScripts(stored);
  }, []);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setConsent(stored);
      setStatus("granted");
      syncTrackingScripts(stored);
    }
    setIsReady(true);
  }, []);

  const acceptAll = useCallback(() => {
    persistAndApply(ALL_GRANTED);
  }, [persistAndApply]);

  const rejectNonEssential = useCallback(() => {
    persistAndApply(DEFAULT_CONSENT);
  }, [persistAndApply]);

  const savePreferences = useCallback(
    (prefs: Omit<CategoryConsent, "necessary">) => {
      persistAndApply({ necessary: true, ...prefs });
    },
    [persistAndApply]
  );

  const openPreferences = useCallback(() => setShowPreferences(true), []);
  const closePreferences = useCallback(() => setShowPreferences(false), []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      status,
      consent,
      isReady,
      showPreferences,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences,
      closePreferences,
    }),
    [
      status,
      consent,
      isReady,
      showPreferences,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences,
      closePreferences,
    ]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}
