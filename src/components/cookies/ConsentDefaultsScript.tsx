import Script from "next/script";

/**
 * Google Consent Mode v2 defaults - must run before any Google tag loads.
 * Loaded with beforeInteractive to avoid race conditions and hydration issues.
 */
export function ConsentDefaultsScript() {
  return (
    <Script id="efe-google-consent-defaults" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          functionality_storage: 'denied',
          personalization_storage: 'denied',
          security_storage: 'granted',
          wait_for_update: 500
        });
      `}
    </Script>
  );
}
