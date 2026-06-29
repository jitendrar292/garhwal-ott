// Pahadi Fal — authentic Uttarakhand fruits (wild + cultivated).
// Lists every fruit in PAHADI_FAL with seasonal filtering and a detail modal
// showing uses, health benefits, and regional notes. Mirrors the visual
// language of PahadiKhanoPage so the experience is consistent.

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PAHADI_FAL from '../data/pahadiFal';

const TYPES = [
  'All',
  'Wild Berry',
  'Stone Fruit',
  'Citrus',
  'Nut',
  'Pome Fruit',
  'Wild Fig',
  'Flower',
];

const REGION_BADGE = {
  Garhwal: 'bg-emerald-600',
  Kumaon: 'bg-indigo-600',
  'Garhwal & Kumaon': 'bg-amber-600',
};

// Hindi month names — used by the "in season now" chip
const HI_MONTHS = [
  '', 'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
];

export default function PahadiFalPage() {
  const [activeType, setActiveType] = useState('All');
  const [seasonOnly, setSeasonOnly] = useState(false);
  const [openId, setOpenId] = useState(null);

  const currentMonth = new Date().getMonth() + 1; // 1-12

  const visible = useMemo(() => {
    return PAHADI_FAL.filter((f) => {
      if (activeType !== 'All' && f.type !== activeType) return false;
      if (seasonOnly && !(f.months || []).includes(currentMonth)) return false;
      return true;
    });
  }, [activeType, seasonOnly, currentMonth]);

  const inSeasonCount = useMemo(
    () => PAHADI_FAL.filter((f) => (f.months || []).includes(currentMonth)).length,
    [currentMonth]
  );

  const opened = PAHADI_FAL.find((f) => f.id === openId);

  return (
    <div className="w-full text-white">
      <SEO
        title="पहाड़ी फल – Pahadi Fruits of Uttarakhand"
        description="उत्तराखंड के पारंपरिक पहाड़ी फल — काफल, हिसालू, बेडू, तिमला, आड़ू, पुलम, खुबानी, अखरोट, माल्टा, बुरांश और अन्य। पूरी जानकारी और उपयोग।"
        path="/pahadi-fal"
        keywords="pahadi fruits, uttarakhand fruits, kafal, hisalu, bedu, timla, aadu, pulum, khubani, malta, akhrot, buransh, garhwali fal, kumaoni fal"
      />

      {/* ── HERO BANNER ── */}
      <div className="max-w-full mx-auto px-4 sm:px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-6 p-6"
          style={{
            background:
              'linear-gradient(135deg, #2a0a1a 0%, #3d1a2a 40%, #1a2a14 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 select-none">🍑</div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg shrink-0">
              🍒
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                <span className="gradient-text">पहाड़ी फल</span>
              </h1>
              <p className="text-rose-300 font-bold text-sm sm:text-base">
                उत्तराखंड के जंगली व पारंपरिक फल
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {PAHADI_FAL.length} authentic fruits · season-wise guide
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── IN-SEASON CTA ── */}
        <button
          onClick={() => setSeasonOnly((v) => !v)}
          className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 mb-4 border transition-all
            ${seasonOnly
              ? 'bg-gradient-to-r from-emerald-700/40 to-lime-700/30 border-emerald-400/50 text-emerald-100'
              : 'bg-emerald-900/20 border-emerald-500/25 text-emerald-200 hover:border-emerald-400/50'}`}
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <span className="text-xl">🗓️</span>
            <span>
              अभी ({HI_MONTHS[currentMonth]}) {inSeasonCount} फल मौसम मा छन्न
            </span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/30">
            {seasonOnly ? '✓ filtered' : 'show only in-season'}
          </span>
        </button>

        {/* ── TYPE FILTERS ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-4 px-4">
          {TYPES.map((t) => {
            const active = activeType === t;
            return (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200
                  ${active
                    ? 'bg-rose-500 text-black shadow-lg shadow-rose-500/30 scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'}`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <p className="text-slate-400 text-xs uppercase tracking-widest mb-4 px-1">
          {activeType === 'All' && !seasonOnly
            ? `All ${visible.length} pahadi fruits`
            : `${visible.length} matching fruits`}
        </p>

        {/* ── FRUITS GRID ── */}
        {visible.length === 0 ? (
          <div className="rounded-2xl bg-dark-800/70 border border-white/10 p-8 text-center mb-10">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-slate-300 text-sm font-semibold mb-1">
              इस फिल्टर मा कुछ नी मिल्यो
            </p>
            <p className="text-slate-500 text-xs">
              Try removing the season filter or pick "All"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {visible.map((fal, idx) => {
              const inSeason = (fal.months || []).includes(currentMonth);
              return (
                <motion.button
                  key={fal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOpenId(fal.id)}
                  className={`relative rounded-2xl overflow-hidden text-left bg-gradient-to-br ${fal.bg}
                    shadow-lg shadow-black/30 ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300`}
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 20%, #fff 1px, transparent 1px)',
                      backgroundSize: '10px 10px',
                    }}
                  />

                  {inSeason && (
                    <span className="absolute top-2 right-2 z-10 text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-black shadow-md animate-pulse">
                      अभी मौसम
                    </span>
                  )}

                  <div className="relative p-3 sm:p-4 min-h-[150px] flex flex-col">
                    <span className="text-3xl sm:text-4xl drop-shadow mb-2">{fal.emoji}</span>
                    <p className="font-black text-white text-sm leading-tight">{fal.name}</p>
                    <p className="text-[11px] text-rose-200 font-semibold mb-1">{fal.nameLocal}</p>
                    <p className="text-[10px] text-slate-200 line-clamp-2 mt-auto">{fal.tagline}</p>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white
                          ${REGION_BADGE[fal.region] ?? 'bg-slate-600'}`}
                      >
                        {fal.type}
                      </span>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-black/30 text-rose-100">
                        🗓 {fal.season.split('–')[0].trim()}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* ── LINK TO KHANO ── */}
        <Link
          to="/pahadi-khano"
          className="flex items-center gap-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-900/30 to-yellow-900/20 px-5 py-4 mb-5 hover:border-amber-400/60 transition-all group"
        >
          <span className="text-3xl shrink-0">🥘</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-amber-200 group-hover:text-amber-100">पहाड़ी खाणू भी देखो</p>
            <p className="text-xs text-slate-400 mt-0.5">
              इन फलों से बनी traditional recipes और अन्य पहाड़ी व्यंजन →
            </p>
          </div>
          <span className="text-amber-400 font-black text-lg shrink-0 group-hover:translate-x-1 transition-transform">›</span>
        </Link>

        {/* ── INFO STRIP ── */}
        <div className="rounded-2xl bg-dark-800/70 border border-white/10 p-5 text-center mb-10">
          <p className="text-rose-300 font-black text-base mb-1">🌳 देवभूमि का प्रसाद</p>
          <p className="text-slate-400 text-xs">
            Tap any fruit to view full details, uses, health benefits and regional notes
          </p>
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenId(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl
                bg-gradient-to-br ${opened.bg} shadow-2xl ring-1 ring-white/15`}
            >
              <button
                onClick={() => setOpenId(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white text-lg font-bold transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="p-5 sm:p-7">
                {/* header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl sm:text-6xl drop-shadow-lg">{opened.emoji}</div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {opened.name}
                    </h2>
                    <p className="text-rose-200 font-bold text-base">{opened.nameLocal}</p>
                    <p className="text-slate-300 text-[11px] italic mt-0.5">
                      {opened.scientific}
                    </p>
                    <p className="text-slate-200 text-xs italic mt-1">{opened.tagline}</p>
                  </div>
                </div>

                {/* meta strip */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-black/30 rounded-xl px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-300 uppercase">मौसम</p>
                    <p className="text-xs font-bold text-rose-100">🗓 {opened.season}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-300 uppercase">क्षेत्र</p>
                    <p className="text-xs font-bold text-rose-100">📍 {opened.region}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-300 uppercase">प्रकार</p>
                    <p className="text-xs font-bold text-rose-100">🌿 {opened.type}</p>
                  </div>
                </div>

                {/* description */}
                <div className="bg-black/30 rounded-xl px-4 py-3 mb-5 border-l-4 border-rose-400">
                  <p className="text-sm text-slate-100 leading-relaxed">{opened.description}</p>
                </div>

                {/* uses */}
                <h3 className="text-rose-200 font-black text-base mb-3 flex items-center gap-2">
                  🍽️ उपयोग (Uses)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {opened.uses.map((u, i) => (
                    <div
                      key={i}
                      className="bg-black/25 rounded-lg px-3 py-2 text-xs text-slate-100 flex items-start gap-2 border border-white/5"
                    >
                      <span className="text-rose-300 font-bold mt-0.5">▸</span>
                      <span>{u}</span>
                    </div>
                  ))}
                </div>

                {/* benefits */}
                <h3 className="text-rose-200 font-black text-base mb-3 flex items-center gap-2">
                  💚 स्वास्थ्य लाभ (Benefits)
                </h3>
                <ul className="space-y-2 mb-6">
                  {opened.benefits.map((b, i) => (
                    <li
                      key={i}
                      className="bg-black/25 rounded-xl px-4 py-2.5 flex gap-3 border border-white/5"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/80 text-black font-black text-xs flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-100 leading-relaxed">{b}</p>
                    </li>
                  ))}
                </ul>

                {/* notes / fun-fact */}
                {opened.notes && (
                  <div className="bg-rose-500/15 border border-rose-400/40 rounded-xl px-4 py-3 mb-3">
                    <p className="text-[10px] font-bold text-rose-300 uppercase tracking-widest mb-1">
                      💡 जाणकारी
                    </p>
                    <p className="text-sm text-rose-50 leading-relaxed">{opened.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
