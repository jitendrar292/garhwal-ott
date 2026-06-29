import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import PAHADI_PRAKRITI from '../data/pahadiPrakriti';

const TYPE_FILTERS = ['All', 'plant', 'animal', 'bird', 'glacier', 'river', 'ecosystem'];

const TYPE_META = {
  plant:     { label: '🌿 Plants',      color: 'bg-green-500/20 text-green-300' },
  animal:    { label: '🐾 Animals',     color: 'bg-amber-500/20 text-amber-300' },
  bird:      { label: '🦅 Birds',       color: 'bg-sky-500/20 text-sky-300' },
  glacier:   { label: '🧊 Glaciers',    color: 'bg-blue-500/20 text-blue-300' },
  river:     { label: '🌊 Rivers',      color: 'bg-teal-500/20 text-teal-300' },
  ecosystem: { label: '🏕️ Ecosystems',  color: 'bg-fuchsia-500/20 text-fuchsia-300' },
};

const STATUS_COLOR = (s) => {
  if (!s) return 'text-white/30';
  const sl = s.toLowerCase();
  if (sl.includes('endangered') || sl.includes('vulnerable')) return 'text-rose-400';
  if (sl.includes('retreating') || sl.includes('declining')) return 'text-orange-400';
  if (sl.includes('least concern') || sl.includes('not endangered')) return 'text-green-400';
  return 'text-white/40';
};

export default function PahadiPrakritiPage() {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? PAHADI_PRAKRITI
        : PAHADI_PRAKRITI.filter((e) => e.type === filter),
    [filter]
  );

  return (
    <>
      <SEO
        title="Pahadi Prakriti — Nature & Ecology of Uttarakhand | PahadiTube"
        description="Buransh, monal pheasant, snow leopard, Gangotri glacier, Valley of Flowers — explore the plants, animals, rivers and ecosystems of Uttarakhand."
        keywords="uttarakhand nature, pahadi prakriti, buransh rhododendron, monal pheasant, snow leopard, gangotri glacier, valley of flowers, himalayan ecology"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-12">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-5xl block mb-3">🏔️</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              पहाड़ी प्रकृति
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
              उत्तराखंड की जीवंत दुनिया — गंगोत्री हिमनद से फूलों की घाटी तक, हिम तेंदुओं से बुराँश तक।
            </p>
            <p className="text-white/30 text-sm mt-1">{PAHADI_PRAKRITI.length} प्रजातियाँ व विशेषताएँ</p>
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
              {t === 'All' ? 'सभी' : (TYPE_META[t]?.label || t)}
            </button>
          ))}
        </div>

        {/* Nature grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  onClick={() => setOpenId(openId === entry.id ? null : entry.id)}
                  className="w-full text-left rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all"
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-br ${entry.bg} p-5`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-3xl block mb-2">{entry.emoji}</span>
                        <h2 className="text-lg font-bold text-white">{entry.name}</h2>
                        <p className="text-white/70 text-sm">{entry.nameLocal}</p>
                        {entry.scientificName && (
                          <p className="text-white/40 text-xs italic mt-0.5">{entry.scientificName}</p>
                        )}
                        <p className="text-white/55 text-xs mt-1">{entry.tagline}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_META[entry.type]?.color || 'bg-white/10 text-white/40'}`}>
                          {TYPE_META[entry.type]?.label || entry.type}
                        </span>
                        {entry.stateSymbol && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold text-right max-w-[130px] leading-tight">
                            {entry.stateSymbol}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/55">
                      {entry.altitude && <span>⛰️ {entry.altitude}</span>}
                      {entry.seasonBest && <span>📅 {entry.seasonBest}</span>}
                    </div>
                  </div>

                  {/* Conservation status strip */}
                  <div className="bg-white/[0.03] px-5 py-2.5 flex items-center justify-between">
                    <p className={`text-xs truncate max-w-[200px] ${STATUS_COLOR(entry.conservationStatus)}`}>
                      {entry.conservationStatus || 'Status unknown'}
                    </p>
                    <span className="text-white/30 text-lg shrink-0">{openId === entry.id ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {openId === entry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-b-2xl border border-t-0 border-white/10 bg-dark-900/80 px-5 py-5 space-y-4">
                        <p className="text-white/75 text-sm leading-relaxed">{entry.description}</p>

                        {/* Ecological role */}
                        {entry.ecologicalRole?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">वानिकी भूमिका</p>
                            <ul className="space-y-1">
                              {entry.ecologicalRole.map((r) => (
                                <li key={r} className="text-xs text-white/60 flex gap-2">
                                  <span className="text-green-400 shrink-0">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Cultural significance */}
                        {entry.culturalSignificance && (
                          <div>
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">सांस्कृतिक महत्व</p>
                            <blockquote className="border-l-2 border-amber-400/40 pl-4 text-sm text-white/60 italic leading-relaxed">
                              {entry.culturalSignificance}
                            </blockquote>
                          </div>
                        )}

                        {/* Conservation status */}
                        <div className={`text-xs px-3 py-2 rounded-lg bg-white/[0.04] ${STATUS_COLOR(entry.conservationStatus)}`}>
                          <span className="font-semibold">संरक्षण स्थिति: </span>
                          {entry.conservationStatus}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-white/30 mt-12">No entries for this type.</p>
        )}

        <p className="text-center text-white/20 text-xs mt-12 max-w-md mx-auto">
          उत्तराखंड एक जैव-विविधता का हॉटस्पॉट है — इसके जंगलों, सोतों और ग्लेशियरों की रक्षा करें।
        </p>
      </div>
    </>
  );
}
