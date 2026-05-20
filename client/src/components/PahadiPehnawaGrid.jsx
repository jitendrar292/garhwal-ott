import React, { useState } from 'react';
import PAHADI_PEHNAWA from '../data/pahadiPehnawa';
import { withAffiliateTag } from '../utils/affiliateUrl';

// Color themes per region
const REGION_COLORS = {
  Garhwal:        { badge: 'bg-emerald-600', glow: 'shadow-emerald-500/40' },
  Kumaon:         { badge: 'bg-indigo-600',  glow: 'shadow-indigo-500/40'  },
  'Jaunsar-Bawar':{ badge: 'bg-rose-600',    glow: 'shadow-rose-500/40'    },
  Tribal:         { badge: 'bg-cyan-600',     glow: 'shadow-cyan-500/40'    },
  Textiles:       { badge: 'bg-fuchsia-600',  glow: 'shadow-fuchsia-500/40' },
  Festive:        { badge: 'bg-amber-600',    glow: 'shadow-amber-500/40'   },
};

const CARD_GRADIENTS = [
  'from-blue-700   to-blue-900',
  'from-amber-600  to-orange-800',
  'from-violet-700 to-purple-900',
  'from-teal-600   to-teal-900',
  'from-rose-700   to-rose-900',
  'from-indigo-700 to-indigo-900',
  'from-emerald-700 to-green-900',
  'from-cyan-700   to-sky-900',
  'from-pink-700   to-fuchsia-900',
  'from-orange-700 to-red-900',
];

const PahadiPehnawaGrid = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const regions = [...new Set(PAHADI_PEHNAWA.map((d) => d.region))];

  const visible = activeRegion
    ? PAHADI_PEHNAWA.filter((d) => d.region === activeRegion)
    : PAHADI_PEHNAWA;

  return (
    <div className="w-full bg-dark-950 text-white px-4 pt-10 pb-20">
      {/* ── HERO BANNER ── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6"
        style={{
          background:
            'linear-gradient(135deg, #2d1b38 0%, #3d2449 40%, #2a1a40 100%)',
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

        <div className="relative z-10 flex items-center gap-4">
          <img src="/icons/pehnawa.png" alt="Pahadi Pehnawa" className="w-14 h-14 object-contain drop-shadow-lg" />
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">
              <span className="gradient-text">पहाड़ी पहनावा</span>
            </h2>
            <p className="text-amber-300 font-bold text-base">
              उत्तराखंड की पारंपरिक वेशभूषा
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Traditional attire · Jewelry · Textiles · Weaving
            </p>
          </div>
        </div>

        {/* Region filter buttons */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-5">
          {regions.map((r) => {
            const cnt = PAHADI_PEHNAWA.filter((d) => d.region === r).length;
            const theme = REGION_COLORS[r] ?? { badge: 'bg-slate-600', glow: '' };
            return (
              <button
                key={r}
                onClick={() => setActiveRegion(activeRegion === r ? null : r)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300
                  ${activeRegion === r
                    ? `${theme.badge} scale-105 shadow-lg ${theme.glow}`
                    : 'bg-white/10 hover:bg-white/20'}`}
              >
                <span className="text-lg font-black">{cnt}</span>
                <span className="text-[10px] font-semibold text-slate-200">{r}</span>
              </button>
            );
          })}
          {activeRegion && (
            <button
              onClick={() => setActiveRegion(null)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 transition-all"
            >
              ✕ सभी
            </button>
          )}
        </div>
      </div>

      {/* ── SECTION LABEL ── */}
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-4 px-1">
        {activeRegion ? `${activeRegion} · ${visible.length} categories` : `All ${PAHADI_PEHNAWA.length} categories`}
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

                {/* Region badge */}
                <span
                  className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full
                    ${REGION_COLORS[item.region]?.badge ?? 'bg-slate-600'} text-white`}
                >
                  {item.region}
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
                        <span className="text-xl">{sub.icon}</span>
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
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PahadiPehnawaGrid;
