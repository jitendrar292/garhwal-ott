import { Helmet } from 'react-helmet-async';

const SITE = 'https://pahaditube.in';
const DEFAULT_IMAGE = `${SITE}/icons/icon-512-v2.png`;

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
  type = 'website',
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

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="PahadiTube" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
