import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { folkStories } from '../data/folkStories';

// Horizontally-scrolling row of Garhwali folk-story cards. Layout intentionally
// mirrors VideoRow so the homepage stays visually coherent.
export default function FolkStoriesRow() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.75;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="mb-10 group/section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            📖 गढ़वाली लोक-गाथा
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Folk tales of Garhwali heroes — Jagdev Panwar, Tilu Rauteli, Jeetu Bagdwal &amp; more
          </p>
        </div>
        {folkStories.length > 3 && (
          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-1.5 rounded-full bg-dark-600 hover:bg-dark-500 text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-1.5 rounded-full bg-dark-600 hover:bg-dark-500 text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="scroll-row">
        {folkStories.map((s) => (
          <Link
            key={s.slug}
            to={`/folk-story/${s.slug}`}
            className="w-64 sm:w-72 rounded-xl bg-gradient-to-br from-amber-900/40 via-dark-700 to-dark-800 border border-amber-700/30 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-900/30 transition-all p-4 flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className="text-3xl leading-none">{s.emoji}</span>
                <h3 className="text-base font-bold text-amber-100 leading-tight">{s.name}</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">{s.blurb}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-medium">पढ़ें →</span>
              <span className="text-gray-500">गढ़वाली लोक-गाथा</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
