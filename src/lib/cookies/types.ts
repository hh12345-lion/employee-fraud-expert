/** Cookie categories aligned with GDPR / ePrivacy consent purposes */
export type CookieCategory =
  | "necessary"
  | "analytics"
  | "marketing"
  | "preferences";

export interface CategoryConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface StoredConsent extends CategoryConsent {
  /** Unix ms when consent was saved */
  timestamp: number;
  /** Policy version - bump when cookie policy changes materially */
  version: string;
}

export type ConsentStatus = "pending" | "granted";

export interface CookieConsentContextValue {
  status: ConsentStatus;
  consent: CategoryConsent;
  /** True after client mount - safe for conditional UI (avoids hydration mismatch) */
  isReady: boolean;
  showPreferences: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: Omit<CategoryConsent, "necessary">) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}
