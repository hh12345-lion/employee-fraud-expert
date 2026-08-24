import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";

export function buildHreflangAlternates(path: string = "") {
  const url = `${SITE_URL}${path}`;
  return {
    canonical: url,
    languages: {
      "en-US": url,
      "x-default": url,
    },
  };
}

export function createMetadata({
  title,
  description,
  path = "",
  noindex = false,
  nofollow = false,
}: {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
  nofollow?: boolean;
}): Metadata {
  const robots =
    noindex || nofollow
      ? { index: !noindex, follow: !nofollow }
      : { index: true, follow: true };

  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.BING_SITE_VERIFICATION;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: buildHreflangAlternates(path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots,
    ...(googleVerification && {
      verification: { google: googleVerification },
    }),
    ...(bingVerification && {
      other: { "msvalidate.01": bingVerification },
    }),
  };
}
