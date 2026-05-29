import {
  CONSENT_MAX_AGE_MS,
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
} from "./constants";
import type { CategoryConsent, StoredConsent } from "./types";

export const DEFAULT_CONSENT: CategoryConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

export const ALL_GRANTED: CategoryConsent = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
};

export function isConsentExpired(stored: StoredConsent): boolean {
  return Date.now() - stored.timestamp > CONSENT_MAX_AGE_MS;
}

export function isConsentVersionValid(stored: StoredConsent): boolean {
  return stored.version === CONSENT_POLICY_VERSION;
}

export function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (typeof parsed.timestamp !== "number" || parsed.necessary !== true) {
      return null;
    }
    if (isConsentExpired(parsed) || !isConsentVersionValid(parsed)) {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredConsent(consent: CategoryConsent): StoredConsent {
  const stored: StoredConsent = {
    ...consent,
    necessary: true,
    timestamp: Date.now(),
    version: CONSENT_POLICY_VERSION,
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  return stored;
}

export function clearStoredConsent(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  }
}
