/** Employee Fraud Expert - consent storage (GDPR / ePrivacy / CCPA best practices) */
export const CONSENT_STORAGE_KEY = "efe-cookie-consent";

/** 12 months - common GDPR retention for consent records */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** Bump when cookie policy or categories change materially */
export const CONSENT_POLICY_VERSION = "1.0";

export const COOKIE_CATEGORY_LABELS = {
  necessary: {
    title: "Necessary Cookies",
    description:
      "Required for the site to function. These cannot be disabled. They include consent storage and essential security.",
  },
  analytics: {
    title: "Analytics",
    description:
      "Help us understand how visitors use the site (e.g. Google Analytics, Google Tag Manager, Hotjar) so we can improve content and performance.",
  },
  marketing: {
    title: "Marketing",
    description:
      "Used to measure advertising effectiveness and deliver relevant campaigns (e.g. Meta Pixel, LinkedIn Insight Tag).",
  },
  preferences: {
    title: "Preferences",
    description:
      "Remember choices such as interface or content settings to personalise your experience.",
  },
} as const;
