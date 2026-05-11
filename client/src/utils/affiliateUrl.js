const AMAZON_TAG = 'pahadistore29-21';

/**
 * Ensures any amazon.in URL carries the affiliate tag.
 * Non-Amazon URLs are returned unchanged.
 */
export function withAffiliateTag(url) {
  if (!url || !url.includes('amazon.in')) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('tag', AMAZON_TAG);
    return u.toString();
  } catch {
    // Malformed URL — return as-is
    return url;
  }
}
