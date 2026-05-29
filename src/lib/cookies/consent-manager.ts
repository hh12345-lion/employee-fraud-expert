/**
 * Consent-aware third-party script loader.
 * Scripts are only injected when the matching category is granted.
 * Withdrawing consent removes script nodes and clears known cookies where possible.
 */
import type { CategoryConsent } from "./types";

type ScriptKey =
  | "ga-lib"
  | "ga-config"
  | "gtm"
  | "meta-pixel"
  | "linkedin-lib"
  | "linkedin-config"
  | "hotjar";

const LOADED_SCRIPTS = new Set<ScriptKey>();

function scriptId(key: ScriptKey): string {
  return `efe-consent-script-${key}`;
}

function removeScript(key: ScriptKey): void {
  document.getElementById(scriptId(key))?.remove();
  LOADED_SCRIPTS.delete(key);
}

/** Google Consent Mode v2 - update tags when user changes preferences */
export function applyGoogleConsentMode(consent: CategoryConsent): void {
  if (typeof window === "undefined") return;

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (!gtag) return;

  gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
    functionality_storage: consent.preferences ? "granted" : "denied",
    personalization_storage: consent.preferences ? "granted" : "denied",
    security_storage: "granted",
  });
}

function injectScript(
  key: ScriptKey,
  src: string,
  options?: { async?: boolean; defer?: boolean }
): void {
  if (LOADED_SCRIPTS.has(key) || document.getElementById(scriptId(key))) {
    LOADED_SCRIPTS.add(key);
    return;
  }
  const el = document.createElement("script");
  el.id = scriptId(key);
  el.src = src;
  if (options?.async) el.async = true;
  if (options?.defer) el.defer = true;
  document.head.appendChild(el);
  LOADED_SCRIPTS.add(key);
}

function injectInlineScript(key: ScriptKey, content: string): void {
  if (LOADED_SCRIPTS.has(key) || document.getElementById(scriptId(key))) {
    LOADED_SCRIPTS.add(key);
    return;
  }
  const el = document.createElement("script");
  el.id = scriptId(key);
  el.textContent = content;
  document.head.appendChild(el);
  LOADED_SCRIPTS.add(key);
}

function loadGoogleAnalytics(measurementId: string): void {
  injectScript(
    "ga-lib",
    `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    { async: true }
  );
  injectInlineScript(
    "ga-config",
    `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`
  );
}

function loadGTM(containerId: string): void {
  injectInlineScript(
    "gtm",
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${containerId}');`
  );
}

function loadMetaPixel(pixelId: string): void {
  injectInlineScript(
    "meta-pixel",
    `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`
  );
}

function loadLinkedInInsight(partnerId: string): void {
  injectInlineScript(
    "linkedin-config",
    `_linkedin_partner_id="${partnerId}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);`
  );
  injectScript(
    "linkedin-lib",
    "https://snap.licdn.com/li.lms-analytics/insight.min.js",
    { async: true }
  );
}

function loadHotjar(siteId: string): void {
  injectInlineScript(
    "hotjar",
    `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${siteId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
  );
}

function clearMarketingCookies(): void {
  const names = [
    "_fbp",
    "_fbc",
    "li_sugr",
    "lidc",
    "bcookie",
    "UserMatchHistory",
  ];
  names.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
    document.cookie = `${name}=; Max-Age=0; path=/`;
  });
}

function clearAnalyticsCookies(): void {
  const prefixes = ["_ga", "_gid", "_gat", "_hj"];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]?.trim();
    if (name && prefixes.some((p) => name.startsWith(p))) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
    }
  });
}

/**
 * Sync third-party scripts with current consent.
 * Call on every consent change and after hydration when stored consent exists.
 */
export function syncTrackingScripts(consent: CategoryConsent): void {
  if (typeof window === "undefined") return;

  applyGoogleConsentMode(consent);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const linkedInId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;

  if (consent.analytics) {
    if (gaId) loadGoogleAnalytics(gaId);
    if (gtmId) loadGTM(gtmId);
    if (hotjarId) loadHotjar(hotjarId);
  } else {
    removeScript("ga-lib");
    removeScript("ga-config");
    removeScript("gtm");
    removeScript("hotjar");
    clearAnalyticsCookies();
  }

  if (consent.marketing) {
    if (metaPixelId) loadMetaPixel(metaPixelId);
    if (linkedInId) loadLinkedInInsight(linkedInId);
  } else {
    removeScript("meta-pixel");
    removeScript("linkedin-lib");
    removeScript("linkedin-config");
    clearMarketingCookies();
  }
}
