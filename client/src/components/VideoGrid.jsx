import VideoCard from './VideoCard';

export default function VideoGrid({ videos, title, loading, error, onLoadMore, hasMore, loadingMore }) {
  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
          {title}
        </h2>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 font-medium">Failed to load videos</p>
          <p className="text-red-400/60 text-sm mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-dark-700">
              <div className="aspect-video skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-4 skeleton rounded w-full" />
                <div className="h-3 skeleton rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {videos.map((video, index) => (
              <div key={video.id} style={{ animationDelay: `${index * 50}ms` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>

          {videos.length === 0 && !error && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No videos found</p>
            </div>
          )}

          {/* Load More disabled for now */}
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
