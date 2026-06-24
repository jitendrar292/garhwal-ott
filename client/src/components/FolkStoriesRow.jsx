import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { folkStories } from '../data/folkStories';

const STORY_CATEGORIES = {
  'teelu-rauteli': 'veer',
  'surja-kunwar': 'veer',
  'ranu-rout': 'veer',
  'ranu-rout-2': 'veer',
  'jagdev-panwar': 'veer',
  'madhomahesh-gaatha': 'veer',

  'rajula-malushahi': 'prem',
  'kalu-bhandari': 'prem',
  'bhana-gangnath': 'prem',

  'garhwali-bhoot-katha': 'bhoot',
  'khala-ki-chudail': 'bhoot',
  'devdar-ka-jhyunta': 'bhoot',
  'masaan-ghat-rahasya': 'bhoot',
  'pipal-ka-saya': 'bhoot',
};

const FILTER_TABS = [
  { id: 'all', label: 'सभी' },
  { id: 'veer', label: 'वीर' },
  { id: 'prem', label: 'प्रेम' },
  { id: 'bhoot', label: 'भूत' },
];

// Horizontally-scrolling row of Garhwali folk-story cards. Layout intentionally
// mirrors VideoRow so the homepage stays visually coherent.
export default function FolkStoriesRow() {
  const scrollRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const categoryCounts = useMemo(() => {
    const counts = { all: folkStories.length, veer: 0, prem: 0, bhoot: 0 };
    for (const story of folkStories) {
      const cat = STORY_CATEGORIES[story.slug];
      if (cat && counts[cat] != null) counts[cat] += 1;
    }
    return counts;
  }, []);

  const visibleStories = useMemo(() => {
    if (activeFilter === 'all') return folkStories;
    return folkStories.filter((s) => STORY_CATEGORIES[s.slug] === activeFilter);
  }, [activeFilter]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.75;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="mb-10 group/section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-header">
            📖 <span className="gradient-text">गढ़वाली लोक-गाथा</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Folk tales of Garhwali heroes, romance and bhoot kathayein
          </p>
        </div>
        {visibleStories.length > 3 && (
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

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {FILTER_TABS.map((tab) => {
          const active = activeFilter === tab.id;
          const count = categoryCounts[tab.id] || 0;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs border transition-all ${
                active
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-100'
                  : 'bg-white/[0.03] border-white/[0.1] text-white/70 hover:text-white hover:border-white/[0.25]'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      <div ref={scrollRef} className="scroll-row">
        {visibleStories.map((s) => (
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

        {visibleStories.length === 0 && (
          <div className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-center text-sm text-white/60">
            इस श्रेणी में अभी कथा उपलब्ध नहीं है।
          </div>
        )}
      </div>
    </section>
  );
}
