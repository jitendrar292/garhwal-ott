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
      className="mb-section-md group/section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="section-header">
            <span>{title}</span>
            {categoryLink && (
              <Link
                to={categoryLink}
                className="ml-3 inline-flex items-center gap-1 text-caption font-medium text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/15 px-3 py-1 rounded-lg transition-all"
              >
                See All
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </h2>
          {subtitle && (
            <p className="text-caption text-white/40 flex items-center gap-1 mt-1">
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
          <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover/section:opacity-100 transition-opacity">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl bg-surface-3 hover:bg-surface-4 text-white/70 hover:text-white border border-white/6 transition-all"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl bg-surface-3 hover:bg-surface-4 text-white/70 hover:text-white border border-white/6 transition-all"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="alert-error">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Scrollable row */}
      {loading ? (
        <div className="scroll-row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[200px] sm:w-[240px] md:w-[260px] rounded-2xl overflow-hidden bg-surface-2 border border-white/5">
              <div className="aspect-video skeleton" />
              <div className="p-3.5 space-y-2">
                <div className="h-3.5 skeleton rounded-lg w-full" />
                <div className="h-3 skeleton rounded-lg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={scrollRef} className="scroll-row">
          {videos.map((video) => (
            <div key={video.id} className="w-[200px] sm:w-[240px] md:w-[260px]">
              <VideoCard video={video} compact />
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
