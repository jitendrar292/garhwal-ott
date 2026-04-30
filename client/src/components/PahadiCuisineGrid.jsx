import React, { useState } from 'react';
import UTTARAKHAND_SPECIALTIES from '../data/pahadiCuisine';

// Color themes per region — matching app's vibrant dark palette
const REGION_COLORS = {
  Garhwal:        { badge: 'bg-emerald-600', glow: 'shadow-emerald-500/40' },
  Kumaon:         { badge: 'bg-indigo-600',  glow: 'shadow-indigo-500/40'  },
  Foothills:      { badge: 'bg-amber-600',   glow: 'shadow-amber-500/40'   },
  'Jaunsar-Bawar':{ badge: 'bg-rose-600',    glow: 'shadow-rose-500/40'    },
};

// Distinct gradient per card — same approach as AI Chat topic tiles
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
  'from-lime-700   to-green-800',
  'from-sky-700    to-blue-900',
  'from-yellow-600 to-amber-800',
];

const UttarakhandSpecialtiesGrid = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [expanded, setExpanded]         = useState(null); // id of expanded card

  const regions = [...new Set(UTTARAKHAND_SPECIALTIES.map((d) => d.region))];

  const visible = activeRegion
    ? UTTARAKHAND_SPECIALTIES.filter((d) => d.region === activeRegion)
    : UTTARAKHAND_SPECIALTIES;

  return (
    <div className="w-full bg-dark-950 text-white px-4 pt-10 pb-20">
      {/* ── HERO BANNER ── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6"
        style={{
          background:
            'linear-gradient(135deg, #1b2438 0%, #243049 40%, #1a2540 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* decorative mountain silhouette */}
        <svg
          className="absolute right-0 bottom-0 opacity-10 w-48 h-24"
          viewBox="0 0 200 100" fill="white"
        >
          <polygon points="0,100 60,20 90,55 130,10 200,100" />
        </svg>

        <div className="relative z-10 flex items-center gap-4">
          <div className="text-5xl drop-shadow-lg">🏔️</div>
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">
              <span className="gradient-text">उत्तराखंड की खोज</span>
            </h2>
            <p className="text-amber-300 font-bold text-base">
              जिलेवार प्रसिद्ध चीज़ें
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              13 districts · food · heritage · attractions
            </p>
          </div>
        </div>

        {/* live stats row */}
        <div className="relative z-10 flex gap-3 mt-5">
          {regions.map((r) => {
            const cnt   = UTTARAKHAND_SPECIALTIES.filter((d) => d.region === r).length;
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
        {activeRegion ? `${activeRegion} · ${visible.length} districts` : `All 13 districts of Uttarakhand`}
      </p>

      {/* ── DISTRICT TILE GRID  (3-col on mobile, 2-col wider on md) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {visible
          .sort((a, b) => a.sequence - b.sequence)
          .map((item, idx) => {
            const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
            const isOpen   = expanded === item.id;
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
                  <p className="font-black text-white text-sm leading-tight">{item.district}</p>
                  <p className="text-[11px] text-amber-200 font-semibold">{item.districtLocal}</p>

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
                    {/* title */}
                    <div className="bg-black/30 rounded-xl px-4 py-3 mb-4 border-l-4 border-amber-400">
                      <p className="font-black text-amber-100 text-base">{item.title}</p>
                      <p className="text-xs text-amber-300 italic">{item.titleLocal}</p>
                    </div>

                    {/* description */}
                    <p className="text-xs text-slate-200 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* sub-items grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {item.items.map((sub, i) => (
                        <div
                          key={i}
                          className="bg-black/30 rounded-xl px-3 py-2.5 hover:bg-black/40 transition-colors border border-white/10 flex items-start gap-2"
                        >
                          <span className="text-xl">{sub.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white leading-tight truncate">{sub.name}</p>
                            <p className="text-[10px] text-amber-200 leading-tight">{sub.nameLocal}</p>
                            <p className="text-[9px] text-slate-400 mt-1">{sub.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-4">
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
        <p className="text-amber-300 font-black text-lg mb-1">🌄 देवभूमि उत्तराखंड</p>
        <p className="text-slate-400 text-xs">
          Tap any district card to explore its food, heritage & famous attractions
        </p>
      </div>
    </div>
  );
};

export default UttarakhandSpecialtiesGrid;

