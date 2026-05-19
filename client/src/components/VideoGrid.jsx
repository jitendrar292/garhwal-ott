import VideoCard from './VideoCard';
import EmptyState from './ui/EmptyState';

export default function VideoGrid({ videos, title, loading, error, onLoadMore, hasMore, loadingMore }) {
  return (
    <section className="mb-section-md">
      {title && (
        <h2 className="page-header mb-6 flex items-center gap-3">
          <div className="w-1 h-7 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
          {title}
        </h2>
      )}

      {error && (
        <div className="alert-error">
          <p className="font-medium">Failed to load videos</p>
          <p className="text-white/40 text-sm mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-surface-2 border border-white/5">
              <div className="aspect-video skeleton" />
              <div className="p-3.5 space-y-2.5">
                <div className="h-4 skeleton rounded-lg w-full" />
                <div className="h-3 skeleton rounded-lg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {videos.map((video, index) => (
              <div key={video.id} style={{ animationDelay: `${index * 40}ms` }} className="animate-fade-in-up">
                <VideoCard video={video} />
              </div>
            ))}
          </div>

          {videos.length === 0 && !error && (
            <EmptyState
              icon="🎬"
              title="No videos found"
              description="Try searching for something else or browse our categories"
              actionLabel="Explore"
              actionTo="/"
            />
          )}

          {false && hasMore && onLoadMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                        strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
