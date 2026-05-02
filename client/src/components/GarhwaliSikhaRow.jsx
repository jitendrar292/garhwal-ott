// GarhwaliSikhaRow — homepage teaser row for the Learn Garhwali section

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import PHRASES, { LEARN_CATEGORIES } from '../data/garhwaliLearn';

// Pick a few representative phrases per category for the teaser
const TEASER_CATEGORIES = LEARN_CATEGORIES.slice(0, 7);

export default function GarhwaliSikhaRow() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Pick the first 2 phrases from each teaser category
  const cards = TEASER_CATEGORIES.map((cat) => {
    const phrases = PHRASES.filter((p) => p.category === cat.id).slice(0, 2);
    return { cat, phrases };
  });

  return (
    <section className="mb-10 group/section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-header">
            📖 <span className="gradient-text">गढ़वाली सीखा</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Flashcards · Quiz · Pahadi Language — Learn Garhwali words &amp; phrases
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <Link
            to="/garhwali-sikha"
            className="text-xs text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap transition-colors"
          >
            सब देखें →
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className="scroll-row">
        {/* "Start Learning" CTA card */}
        <Link
          to="/garhwali-sikha"
          className="flex-shrink-0 w-56 sm:w-64 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-5 flex flex-col justify-between min-h-[180px] hover:scale-[1.02] transition-transform shadow-lg shadow-amber-500/20"
        >
          <div>
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-white font-bold text-base leading-tight">गढ़वाली सीखो</h3>
            <p className="text-white/80 text-xs mt-1">Flashcards, Quiz &amp; 100+ phrases</p>
          </div>
          <span className="text-white font-semibold text-sm mt-3">शुरू करो →</span>
        </Link>

        {/* Category phrase cards */}
        {cards.map(({ cat, phrases }) => (
          <Link
            key={cat.id}
            to={`/garhwali-sikha`}
            className="flex-shrink-0 w-56 sm:w-64 rounded-xl bg-dark-800 border border-dark-700 hover:border-amber-500/40 hover:shadow-lg transition-all p-4 flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-sm font-bold text-white">{cat.label}</span>
              </div>
              <div className="space-y-2">
                {phrases.map((p) => (
                  <div key={p.id} className="bg-dark-900/60 rounded-lg px-3 py-2">
                    <p className="text-base font-bold text-amber-300">{p.garhwali}</p>
                    <p className="text-xs text-gray-400">{p.hindi} · {p.english}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-amber-400/70 mt-3 font-mono">🔊 {phrases[0]?.pronunciation}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
