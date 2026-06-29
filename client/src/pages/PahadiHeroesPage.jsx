import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import PAHADI_HEROES from '../data/pahadiHeroes';

const TAG_COLORS = {
  warrior: 'bg-rose-500/20 text-rose-300',
  'freedom-fighter': 'bg-orange-500/20 text-orange-300',
  environment: 'bg-green-500/20 text-green-300',
  chipko: 'bg-emerald-500/20 text-emerald-300',
  music: 'bg-yellow-500/20 text-yellow-300',
  art: 'bg-purple-500/20 text-purple-300',
  soldier: 'bg-slate-500/20 text-slate-300',
  'war-hero': 'bg-red-500/20 text-red-300',
  politics: 'bg-blue-500/20 text-blue-300',
  woman: 'bg-pink-500/20 text-pink-300',
  folklore: 'bg-amber-500/20 text-amber-300',
  default: 'bg-white/10 text-white/50',
};

function tagColor(tag) {
  return TAG_COLORS[tag] || TAG_COLORS.default;
}

export default function PahadiHeroesPage() {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('All');

  const allTags = ['All', 'warrior', 'freedom-fighter', 'environment', 'music', 'soldier', 'art', 'woman'];

  const filtered =
    filter === 'All'
      ? PAHADI_HEROES
      : PAHADI_HEROES.filter((h) => h.tags.includes(filter));

  const opened = PAHADI_HEROES.find((h) => h.id === openId);

  return (
    <>
      <SEO
        title="Pahadi Heroes — Icons of Uttarakhand | PahadiTube"
        description="Warriors, poets, musicians, environmentalists — the 10 most iconic figures from Garhwal and Kumaon who shaped Uttarakhand's history and identity."
        keywords="pahadi heroes, uttarakhand icons, garhwali history, gaura devi, chipko, teelu rauteli, narendra singh negi, veer chandra singh"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-5xl block mb-3">🏔️</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Pahadi Heroes
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
              Warriors, musicians, poets, environmentalists — the icons who made the
              mountains proud.
            </p>
            <p className="text-white/30 text-sm mt-1">{PAHADI_HEROES.length} figures documented</p>
          </motion.div>
        </div>

        {/* Tag filters */}
        <div className="max-w-3xl mx-auto mb-8 flex flex-wrap justify-center gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${
                filter === tag
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              {tag.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((hero, i) => (
            <motion.button
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setOpenId(openId === hero.id ? null : hero.id)}
              className={`bg-gradient-to-br ${hero.bg} rounded-2xl p-5 text-left ring-1 ring-white/10 hover:ring-white/20 transition-all shadow-elevation-2 w-full`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0 mt-0.5">{hero.emoji}</span>
                <div className="min-w-0">
                  <p className="font-bold text-white text-base leading-tight">{hero.name}</p>
                  <p className="text-white/60 text-xs mt-0.5">{hero.nameLocal}</p>
                  <p className="text-white/50 text-xs mt-1">{hero.role} · {hero.era}</p>
                  <p className="text-white/70 text-xs mt-1 italic">{hero.tagline}</p>
                </div>
              </div>

              <AnimatePresence>
                {openId === hero.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3 text-left">
                      <p className="text-white/80 text-sm leading-relaxed">{hero.description}</p>

                      <div className="bg-black/20 rounded-xl p-3">
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                          Key Contributions
                        </p>
                        <ul className="space-y-1">
                          {hero.contributions.map((c, ci) => (
                            <li key={ci} className="flex items-start gap-2 text-xs text-white/70">
                              <span className="text-primary-400 mt-0.5 flex-shrink-0">▸</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <blockquote className="border-l-2 border-white/30 pl-3">
                        <p className="text-sm text-white/60 italic">{hero.quote}</p>
                      </blockquote>

                      <div className="flex flex-wrap gap-1.5">
                        {hero.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${tagColor(tag)}`}
                          >
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-white/40 text-xs mt-3 text-right">
                {openId === hero.id ? 'Tap to close ▲' : 'Tap to read ▼'}
              </p>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-white/20 mt-12 max-w-md mx-auto">
          PahadiTube — preserving the stories of those who shaped the mountains.
        </p>
      </div>
    </>
  );
}
