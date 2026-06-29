import React, { useState } from 'react';
import PAHADI_PRODUCTS from '../data/pahadiProducts';
import { withAffiliateTag } from '../utils/affiliateUrl';

// Color themes per category — vibrant, distinct per food-product type.
const CATEGORY_COLORS = {
  Namak:   { badge: 'bg-amber-600',  glow: 'shadow-amber-500/40'  },
  Achar:   { badge: 'bg-red-600',    glow: 'shadow-red-500/40'    },
  Squash:  { badge: 'bg-pink-600',   glow: 'shadow-pink-500/40'   },
  Juice:   { badge: 'bg-orange-600', glow: 'shadow-orange-500/40' },
  Jam:     { badge: 'bg-rose-600',   glow: 'shadow-rose-500/40'   },
  Murabba: { badge: 'bg-yellow-600', glow: 'shadow-yellow-500/40' },
  Chutney: { badge: 'bg-emerald-600', glow: 'shadow-emerald-500/40' },
  Honey:   { badge: 'bg-yellow-500', glow: 'shadow-yellow-400/40' },
};

const CARD_GRADIENTS = [
  'from-amber-700  to-orange-900',
  'from-red-700    to-rose-900',
  'from-pink-700   to-fuchsia-900',
  'from-orange-700 to-red-900',
  'from-rose-700   to-pink-900',
  'from-yellow-600 to-amber-800',
  'from-emerald-700 to-green-900',
  'from-yellow-500 to-amber-700',
];

const PahadiProductsGrid = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const categories = [...new Set(PAHADI_PRODUCTS.map((d) => d.category))];

  const visible = activeCategory
    ? PAHADI_PRODUCTS.filter((d) => d.category === activeCategory)
    : PAHADI_PRODUCTS;

  return (
    <div className="w-full bg-dark-950 text-white px-4 pt-10 pb-20">
      {/* ── HERO BANNER ── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6"
        style={{
          background:
            'linear-gradient(135deg, #3a1f0e 0%, #4a2410 40%, #2a1408 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* decorative pattern */}
        <svg
          className="absolute right-0 bottom-0 opacity-10 w-48 h-24"
          viewBox="0 0 200 100" fill="white"
        >
          <polygon points="0,100 60,20 90,55 130,10 200,100" />
        </svg>
        <div className="absolute -right-4 -top-4 text-8xl opacity-10 select-none">🫙</div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="text-5xl drop-shadow-lg">🍯</div>
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">
              <span className="gradient-text">पहाड़ी उत्पाद</span>
            </h2>
            <p className="text-amber-300 font-bold text-base">
              नून · अचार · स्क्वैश · जैम · चटनी · शहद
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Authentic homemade Uttarakhand food products
            </p>
          </div>
        </div>

        {/* Category filter chips */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-5">
          {categories.map((c) => {
            const cnt = PAHADI_PRODUCTS.filter((d) => d.category === c).length;
            const theme = CATEGORY_COLORS[c] ?? { badge: 'bg-slate-600', glow: '' };
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(activeCategory === c ? null : c)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300
                  ${activeCategory === c
                    ? `${theme.badge} scale-105 shadow-lg ${theme.glow}`
                    : 'bg-white/10 hover:bg-white/20'}`}
              >
                <span className="text-lg font-black">{cnt}</span>
                <span className="text-[10px] font-semibold text-slate-200">{c}</span>
              </button>
            );
          })}
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 transition-all"
            >
              ✕ सभी
            </button>
          )}
        </div>
      </div>

      {/* ── SECTION LABEL ── */}
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-4 px-1">
        {activeCategory
          ? `${activeCategory} · ${visible.length} product${visible.length === 1 ? '' : 's'}`
          : `All ${PAHADI_PRODUCTS.length} product categories`}
      </p>

      {/* ── CARD GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {visible.map((item, idx) => {
          const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
          const isOpen = expanded === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setExpanded(isOpen ? null : item.id)}
              className={`relative col-span-1 rounded-2xl overflow-hidden text-left transition-all duration-300
                bg-gradient-to-br ${gradient}
                ${isOpen ? 'col-span-2 sm:col-span-3 md:col-span-2 row-span-2 scale-100 shadow-2xl' : 'hover:scale-105 hover:shadow-xl'}`}
              style={{ minHeight: isOpen ? 'auto' : '100px' }}
            >
              {/* Decorative circle */}
              <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/5" />

              {/* Collapsed view */}
              <div className={`p-4 ${isOpen ? 'pb-2' : ''}`}>
                <span className="text-3xl block mb-2 drop-shadow">{item.emoji}</span>
                <p className="font-black text-white text-sm leading-tight">{item.titleEn}</p>
                <p className="text-[11px] text-amber-200 font-semibold">{item.title}</p>

                {/* Category badge */}
                <span
                  className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full
                    ${CATEGORY_COLORS[item.category]?.badge ?? 'bg-slate-600'} text-white`}
                >
                  {item.category}
                </span>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-4 pb-5 text-white">
                  {/* description */}
                  <div className="bg-black/30 rounded-xl px-4 py-3 mb-4 border-l-4 border-amber-400">
                    <p className="text-xs text-slate-200 leading-relaxed italic">
                      {item.description}
                    </p>
                  </div>

                  {/* sub-items grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.items.map((sub, i) => (
                      <div
                        key={i}
                        className="bg-black/30 rounded-xl px-3 py-2.5 hover:bg-black/40 transition-colors border border-white/10 flex items-start gap-2"
                      >
                        <span className="text-xl shrink-0">{sub.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{sub.name}</p>
                          <p className="text-[10px] text-amber-200">{sub.nameLocal}</p>
                          <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">{sub.description}</p>
                          {sub.buyUrl && (
                            <a
                              href={withAffiliateTag(sub.buyUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-amber-300 hover:text-amber-100 bg-amber-900/40 hover:bg-amber-900/60 px-2 py-0.5 rounded-full transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              🛒 Buy Online
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shop All link */}
                  {item.shopUrl && (
                    <a
                      href={withAffiliateTag(item.shopUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 text-amber-200 text-xs font-bold transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🛍️ सब खरीदें — Shop All on Amazon
                    </a>
                  )}

                  <p className="text-center text-[10px] text-slate-400 mt-3">
                    ↑ बंद करने के लिए tap करें
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── BOTTOM BADGE ROW ── */}
      <div className="rounded-2xl bg-dark-800/70 border border-white/10 p-5 text-center">
        <p className="text-amber-300 font-black text-lg mb-1">🏔️ Pure Pahadi · Made in Uttarakhand</p>
        <p className="text-slate-400 text-xs">
          Tap any product card to explore varieties · Affiliate links support PahadiTube
        </p>
      </div>
    </div>
  );
};

export default PahadiProductsGrid;
