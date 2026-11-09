import Head from "next/head";

const SITE_NAME = "NoDoseOff";
const DEFAULT_DESCRIPTION =
  "Track medications, get smart dose reminders, and stay on top of long-term treatment with NoDoseOff.";

function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://nodoseoff.vercel.app";
  return raw.replace(/\/$/, "");
}

export type SeoHeadProps = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export default function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/og-image.jpg",
  noIndex = false,
}: SeoHeadProps) {
  const base = siteUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const imageUrl = image.startsWith("http") ? image : `${base}${image}`;
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}
