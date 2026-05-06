import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import PAHADI_DISHES from '../data/pahadiDishes';

const TYPES = ['All', 'Main Course', 'Side Dish', 'Bread', 'Dal', 'Curry', 'Chutney', 'Dessert', 'Sweet'];

const REGION_BADGE = {
  Garhwal: 'bg-emerald-600',
  Kumaon: 'bg-indigo-600',
  'Garhwal & Kumaon': 'bg-amber-600',
};

export default function PahadiKhanoPage() {
  const [activeType, setActiveType] = useState('All');
  const [openId, setOpenId] = useState(null);

  const visible = useMemo(() => {
    if (activeType === 'All') return PAHADI_DISHES;
    return PAHADI_DISHES.filter((d) => d.type === activeType);
  }, [activeType]);

  const opened = PAHADI_DISHES.find((d) => d.id === openId);

  return (
    <div className="w-full text-white">
      <SEO
        title="पहाड़ी खाणू – Pahadi Recipes"
        description="उत्तराखंड के पारंपरिक व्यंजन — कफुली, फाणू, चैंसू, आलू के गुटके, मंडुवे की रोटी, भांग की चटनी की पूरी रेसिपी हिंदी में।"
        path="/pahadi-khano"
        keywords="pahadi food, garhwali recipes, kumaoni recipes, kafuli, phaanu, chainsoo, mandua roti, bhang chutney, uttarakhand cuisine"
      />

      {/* ── HERO BANNER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-6 p-6"
          style={{
            background:
              'linear-gradient(135deg, #2a1810 0%, #3d2817 40%, #1f2a1a 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 select-none">🥘</div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="text-5xl drop-shadow-lg">🍲</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                <span className="gradient-text">पहाड़ी खाणू</span>
              </h1>
              <p className="text-amber-300 font-bold text-sm sm:text-base">
                उत्तराखंड के पारंपरिक व्यंजन व रेसिपी
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {PAHADI_DISHES.length} authentic dishes · with full recipes
              </p>
            </div>
          </div>
        </motion.div>

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
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'}`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <p className="text-slate-400 text-xs uppercase tracking-widest mb-4 px-1">
          {activeType === 'All'
            ? `All ${visible.length} traditional dishes`
            : `${activeType} · ${visible.length} dishes`}
        </p>

        {/* ── DISHES GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {visible.map((dish, idx) => (
            <motion.button
              key={dish.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpenId(dish.id)}
              className={`relative rounded-2xl overflow-hidden text-left bg-gradient-to-br ${dish.bg}
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

              <div className="relative p-3 sm:p-4 min-h-[140px] flex flex-col">
                <span className="text-3xl sm:text-4xl drop-shadow mb-2">{dish.emoji}</span>
                <p className="font-black text-white text-sm leading-tight">{dish.name}</p>
                <p className="text-[11px] text-amber-200 font-semibold mb-1">{dish.nameLocal}</p>
                <p className="text-[10px] text-slate-200 line-clamp-2 mt-auto">{dish.tagline}</p>

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white
                      ${REGION_BADGE[dish.region] ?? 'bg-slate-600'}`}
                  >
                    {dish.region}
                  </span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-black/30 text-amber-100">
                    ⏱ {dish.time.length > 12 ? dish.time.split(' ')[0] + '+' : dish.time}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── INFO STRIP ── */}
        <div className="rounded-2xl bg-dark-800/70 border border-white/10 p-5 text-center mb-10">
          <p className="text-amber-300 font-black text-base mb-1">🌄 स्वाद देवभूमि का</p>
          <p className="text-slate-400 text-xs">
            Tap any dish to view ingredients, step-by-step recipe and pro tips
          </p>
        </div>
      </div>

      {/* ── RECIPE MODAL ── */}
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
              {/* close button */}
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
                    <p className="text-amber-200 font-bold text-base">{opened.nameLocal}</p>
                    <p className="text-slate-200 text-xs italic mt-1">{opened.tagline}</p>
                  </div>
                </div>

                {/* meta strip */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-black/30 rounded-xl px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-300 uppercase">समय</p>
                    <p className="text-xs font-bold text-amber-100">⏱ {opened.time}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-300 uppercase">मात्रा</p>
                    <p className="text-xs font-bold text-amber-100">👥 {opened.serves}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-300 uppercase">स्तर</p>
                    <p className="text-xs font-bold text-amber-100">⭐ {opened.difficulty}</p>
                  </div>
                </div>

                {/* description */}
                <div className="bg-black/30 rounded-xl px-4 py-3 mb-5 border-l-4 border-amber-400">
                  <p className="text-sm text-slate-100 leading-relaxed">{opened.description}</p>
                </div>

                {/* ingredients */}
                <h3 className="text-amber-200 font-black text-base mb-3 flex items-center gap-2">
                  🛒 सामग्री (Ingredients)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {opened.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="bg-black/25 rounded-lg px-3 py-2 text-xs text-slate-100 flex items-start gap-2 border border-white/5"
                    >
                      <span className="text-amber-300 font-bold mt-0.5">▸</span>
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>

                {/* steps */}
                <h3 className="text-amber-200 font-black text-base mb-3 flex items-center gap-2">
                  👨‍🍳 बनाने की विधि (Method)
                </h3>
                <ol className="space-y-3 mb-6">
                  {opened.steps.map((step, i) => (
                    <li
                      key={i}
                      className="bg-black/25 rounded-xl px-4 py-3 flex gap-3 border border-white/5"
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 text-black font-black text-sm flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-100 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>

                {/* tip */}
                {opened.tip && (
                  <div className="bg-amber-500/15 border border-amber-400/40 rounded-xl px-4 py-3 mb-3">
                    <p className="text-sm text-amber-100 leading-relaxed">{opened.tip}</p>
                  </div>
                )}

                <div className="text-center pt-2">
                  <Link
                    to={`/category/cooking?q=${encodeURIComponent(opened.name + ' garhwali recipe')}`}
                    onClick={() => setOpenId(null)}
                    className="inline-block bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                  >
                    📺 Video देखें
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
