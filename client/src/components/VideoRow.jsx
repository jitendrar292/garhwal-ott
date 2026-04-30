import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';

export default function VideoRow({ title, subtitle, videos, loading, error, categoryLink }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.offsetWidth * 0.75;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      className="mb-10 group/section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="neon-underline">{title}</span>
            {categoryLink && (
              <Link to={categoryLink} className="text-gray-500 hover:text-primary-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {subtitle}
            </p>
          )}
        </div>
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
    </motion.section>
  );
}
