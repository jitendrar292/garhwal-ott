import { useRef } from 'react';
import { Link } from 'react-router-dom';
import VideoCard from './VideoCard';

export default function VideoRow({ title, videos, loading, error, categoryLink }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.offsetWidth * 0.75;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-10 group/section">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          {title}
          {categoryLink && (
            <Link to={categoryLink} className="text-gray-500 hover:text-primary-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </h2>
        {/* Desktop scroll arrows */}
        {!loading && videos.length > 3 && (
          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full bg-dark-600 hover:bg-dark-500 text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full bg-dark-600 hover:bg-dark-500 text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Scrollable row */}
      {loading ? (
        <div className="scroll-row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[160px] sm:w-[200px] md:w-[220px] rounded-xl overflow-hidden bg-dark-800">
              <div className="aspect-video skeleton" />
              <div className="p-2.5 space-y-1.5">
                <div className="h-3 skeleton rounded w-full" />
                <div className="h-2.5 skeleton rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={scrollRef} className="scroll-row">
          {videos.map((video) => (
            <div key={video.id} className="w-[160px] sm:w-[200px] md:w-[220px]">
              <VideoCard video={video} compact />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
