import Head from "next/head";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_ALTERNATE_NAMES,
  SITE_NAME,
  siteUrl,
} from "@/lib/seo/site";

export type SeoHeadProps = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  /** Extra comma-separated keywords merged with defaults */
  keywords?: string;
  /** Include rich WebSite / SoftwareApplication JSON-LD (home + key marketing pages) */
  jsonLd?: boolean;
};

export default function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/og-image.jpg",
  noIndex = false,
  keywords,
  jsonLd = false,
}: SeoHeadProps) {
  const base = siteUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const imageUrl = image.startsWith("http") ? image : `${base}${image}`;
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const keywordContent = keywords
    ? `${DEFAULT_KEYWORDS}, ${keywords}`
    : DEFAULT_KEYWORDS;

  const structuredData = jsonLd
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${base}/#organization`,
            name: SITE_NAME,
            alternateName: [...SITE_ALTERNATE_NAMES],
            url: base,
            logo: `${base}/logo.png`,
            description: DEFAULT_DESCRIPTION,
            sameAs: [],
          },
          {
            "@type": "WebSite",
            "@id": `${base}/#website`,
            name: SITE_NAME,
            alternateName: [...SITE_ALTERNATE_NAMES],
            url: base,
            description: DEFAULT_DESCRIPTION,
            publisher: { "@id": `${base}/#organization` },
            inLanguage: "en",
          },
          {
            "@type": "SoftwareApplication",
            "@id": `${base}/#app`,
            name: SITE_NAME,
            alternateName: [...SITE_ALTERNATE_NAMES],
            applicationCategory: "HealthApplication",
            operatingSystem: "Web",
            url: base,
            image: imageUrl,
            description: DEFAULT_DESCRIPTION,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Medication and common drug tracking",
              "Smart dose reminders",
              "Adherence reports for clinicians",
              "AMANDA 6 medication AI search and education",
              "AI medication assistant grounded in your regimen",
            ],
            publisher: { "@id": `${base}/#organization` },
          },
          {
            "@type": "SoftwareApplication",
            "@id": `${base}/amanda/#amanda6`,
            name: "AMANDA 6",
            alternateName: [
              "AMANDA 6 AI",
              "AMANDA 6 medication AI",
              "NoDoseOff AI",
            ],
            applicationCategory: "HealthApplication",
            applicationSubCategory: "Medication AI Assistant",
            operatingSystem: "Web",
            url: `${base}/amanda`,
            description:
              "AMANDA 6 is NoDoseOff’s medication AI — ask about dosing, interactions, missed doses, storage, and side effects with answers grounded in your regimen.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            isPartOf: { "@id": `${base}/#app` },
            publisher: { "@id": `${base}/#organization` },
          },
        ],
      }
    : null;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordContent} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <link rel="canonical" href={url} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — medication tracking`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escape `<` so values cannot break out of the script tag.
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
    </Head>
  );
}
