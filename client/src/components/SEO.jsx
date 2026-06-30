import { Helmet } from 'react-helmet-async';

const SITE = 'https://pahaditube.in';
const DEFAULT_IMAGE = `${SITE}/icons/icon-512-v2.png`;
const DEFAULT_IMAGE_ALT = 'PahadiTube — Garhwali & Kumaoni entertainment from Uttarakhand';

/**
 * Per-route SEO tags. Pass `path` (e.g. "/news") so canonical + OG URL stay in
 * sync with the route. `jsonLd` is an optional schema.org object that will be
 * stringified into a <script type="application/ld+json"> block.
 */
export default function SEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  imageWidth = 512,
  imageHeight = 512,
  type = 'website',
  locale = 'hi_IN',
  jsonLd,
  keywords,
  noindex = false,
}) {
  const url = `${SITE}${path}`;
  const fullTitle = title?.includes('PahadiTube') ? title : `${title} | PahadiTube`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph — site is primarily Hindi; English listed as alternate */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="PahadiTube" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:locale" content={locale} />
      {locale !== 'en_IN' && <meta property="og:locale:alternate" content="en_IN" />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
