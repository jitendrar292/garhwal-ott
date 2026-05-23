// OptimizedImage — serves WebP with fallback to original format via <picture>
// Usage: <OptimizedImage src="/slider/hisalu.png" alt="Hisalu" className="..." />
// Automatically generates a .webp srcSet from the original path.

export default function OptimizedImage({ src, alt, className, loading, onError, ...rest }) {
  if (!src || src.startsWith('http')) {
    // External URLs (e.g. Wikimedia) — skip <picture>, use plain <img>
    return <img src={src} alt={alt} className={className} loading={loading} onError={onError} {...rest} />;
  }

  const webpSrc = src.replace(/\.(png|jpe?g)$/i, '.webp');

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} className={className} loading={loading} onError={onError} {...rest} />
    </picture>
  );
}
