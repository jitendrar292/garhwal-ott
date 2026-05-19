export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-surface-2 border border-white/5">
          <div className="aspect-video skeleton" />
          <div className="p-3.5 space-y-2.5">
            <div className="h-4 skeleton rounded-lg w-full" />
            <div className="h-3 skeleton rounded-lg w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5, height = 'h-16' }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} skeleton rounded-2xl`} />
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 4 }) {
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-full', 'w-2/3'];
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3.5 skeleton rounded-lg ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
}

export function InlineSkeleton({ className = 'h-4 w-24' }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}
