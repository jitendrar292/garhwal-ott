import TRENDING_CREATORS from '../data/trendingCreators';

function profileUrl(handle) {
  return `https://www.instagram.com/${handle}/?utm_source=pahaditube`;
}

function CreatorPill({ creator }) {
  const label = `Open @${creator.handle} on Instagram`;
  const initial = creator.handle?.charAt(0)?.toUpperCase() || 'I';

  return (
    <a
      href={profileUrl(creator.handle)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={[
        'snap-start shrink-0 rounded-full p-[1px] transition-transform hover:scale-[1.03] focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-pink-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900',
        creator.own
          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
          : 'bg-gradient-to-r from-pink-500 to-purple-600',
      ].join(' ')}
      title={`@${creator.handle}`}
    >
      <span className="flex items-center gap-2 rounded-full bg-dark-900 px-3 py-1.5 border border-white/10">
        {creator.avatar ? (
          <img
            src={creator.avatar}
            alt={`@${creator.handle}`}
            className="h-6 w-6 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-500/70 to-orange-500/70 text-[11px] font-semibold text-white grid place-items-center">
            {initial}
          </span>
        )}
        <span className="text-xs font-medium text-white">@{creator.handle}</span>
        {creator.verified && <span className="text-[10px] text-sky-300">✓</span>}
      </span>
    </a>
  );
}

export default function TrendingInstagramRow() {
  if (!TRENDING_CREATORS.length) return null;

  return (
    <section className="mb-8 group/section">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="section-header">📸 <span className="gradient-text">Trending on Instagram</span></h2>
          <p className="text-xs text-gray-500 mt-0.5">Tap any creator to open Instagram app</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TRENDING_CREATORS.map((creator) => (
          <CreatorPill key={creator.handle} creator={creator} />
        ))}

        <a
          href="/shorts?tab=insta"
          className="snap-start shrink-0 rounded-full border border-white/15 bg-dark-800/70 px-3 py-1.5 text-xs text-gray-200 hover:bg-dark-700 transition-colors"
          aria-label="Open all Instagram reels"
        >
          See all reels →
        </a>
      </div>
    </section>
  );
}
