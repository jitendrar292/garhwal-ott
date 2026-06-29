import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import PAHADI_HASTAKALA from '../data/pahadiHastakala';

const TYPE_FILTERS = ['All', 'painting', 'basketry', 'woodwork', 'metalwork', 'weaving', 'jewellery', 'stonework', 'embroidery', 'masks'];

const TYPE_LABELS = {
  painting: '🎨 Painting',
  basketry: '🧺 Basketry',
  woodwork: '🪵 Woodwork',
  metalwork: '🪔 Metalwork',
  weaving: '🧶 Weaving',
  jewellery: '💎 Jewellery',
  stonework: '🗿 Stonework',
  embroidery: '🧵 Embroidery',
  masks: '🎭 Masks',
};

export default function PahadiHastakalaPage() {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered =
    filter === 'All'
      ? PAHADI_HASTAKALA
      : PAHADI_HASTAKALA.filter((c) => c.type === filter);

  const opened = PAHADI_HASTAKALA.find((c) => c.id === openId);

  return (
    <>
      <SEO
        title="Pahadi Hastakala — Traditional Crafts of Uttarakhand | PahadiTube"
        description="Aipan, Ringal weaving, Garhwal miniature painting, Bhotiya wool, copper brassware — explore 12 traditional handicrafts from Garhwal and Kumaon."
        keywords="pahadi hastakala, uttarakhand crafts, aipan art, ringal weaving, garhwal painting, bhotiya wool, traditional handicrafts, pahadi art"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-12">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-5xl block mb-3">🏺</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Pahadi Hastakala
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
              Traditional crafts of Garhwal and Kumaon — made by hand, passed down generations.
            </p>
            <p className="text-white/30 text-sm mt-1">{PAHADI_HASTAKALA.length} crafts documented</p>
          </motion.div>
        </div>

        {/* Type filters */}
        <div className="max-w-3xl mx-auto mb-8 flex flex-wrap justify-center gap-2">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${
                filter === t
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              {t === 'All' ? 'All Crafts' : (TYPE_LABELS[t] || t)}
            </button>
          ))}
        </div>

        {/* Craft grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((craft) => (
              <motion.div
                key={craft.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  onClick={() => setOpenId(openId === craft.id ? null : craft.id)}
                  className="w-full text-left rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all"
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-br ${craft.bg} p-5`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-3xl block mb-2">{craft.emoji}</span>
                        <h2 className="text-lg font-bold text-white">{craft.name}</h2>
                        <p className="text-white/60 text-sm">{craft.nameLocal}</p>
                        <p className="text-white/50 text-xs mt-1 italic">{craft.tagline}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/15 text-white/70 capitalize">
                          {TYPE_LABELS[craft.type] || craft.type}
                        </span>
                        {craft.giStatus && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold">
                            {craft.giStatus}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-white/70 text-xs mt-2">📍 {craft.region}</p>
                  </div>

                  {/* Quick meta */}
                  <div className="bg-white/[0.03] px-5 py-3 flex items-center justify-between">
                    <p className="text-white/40 text-xs">🛒 {craft.buyAt}</p>
                    <span className="text-white/40 text-lg">{openId === craft.id ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {openId === craft.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-b-2xl border border-t-0 border-white/10 bg-dark-900/80 px-5 py-5 space-y-4">
                        <p className="text-white/75 text-sm leading-relaxed">{craft.description}</p>

                        {/* Materials */}
                        <div>
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Materials</p>
                          <div className="flex flex-wrap gap-1.5">
                            {craft.materials.map((m) => (
                              <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/60">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Uses */}
                        {craft.uses?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Uses</p>
                            <ul className="space-y-1">
                              {craft.uses.map((u) => (
                                <li key={u} className="text-xs text-white/60 flex gap-2">
                                  <span className="text-primary-400 shrink-0">•</span>
                                  <span>{u}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Practitioners */}
                        <div className="flex items-start gap-2 bg-white/[0.04] rounded-xl px-4 py-3">
                          <span className="text-lg shrink-0">👐</span>
                          <div>
                            <p className="text-xs font-semibold text-white/50 mb-0.5">Practitioners</p>
                            <p className="text-sm text-white/75">{craft.practitioners}</p>
                          </div>
                        </div>

                        {/* Cultural note */}
                        {craft.culturalNote && (
                          <blockquote className="border-l-2 border-amber-400/40 pl-4 text-sm text-white/55 italic leading-relaxed">
                            {craft.culturalNote}
                          </blockquote>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-white/30 mt-12">No crafts found for this type.</p>
        )}

        <p className="text-center text-white/20 text-xs mt-12">
          Supporting pahadi artisans — buy direct from craftspeople when possible.
        </p>
      </div>
    </>
  );
}
