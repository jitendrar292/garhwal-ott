import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import PAHADI_VICHAR from '../data/pahadiVichar';

const ALL_TAGS = ['All', 'migration', 'home', 'language', 'identity', 'food', 'army', 'diaspora', 'woman', 'village-life', 'festival', 'climate'];

const TAG_COLORS = {
  migration: 'bg-blue-500/20 text-blue-300',
  home: 'bg-amber-500/20 text-amber-300',
  language: 'bg-purple-500/20 text-purple-300',
  identity: 'bg-pink-500/20 text-pink-300',
  food: 'bg-orange-500/20 text-orange-300',
  army: 'bg-slate-500/20 text-slate-300',
  diaspora: 'bg-cyan-500/20 text-cyan-300',
  woman: 'bg-rose-500/20 text-rose-300',
  'village-life': 'bg-green-500/20 text-green-300',
  festival: 'bg-yellow-500/20 text-yellow-300',
  climate: 'bg-teal-500/20 text-teal-300',
  grief: 'bg-indigo-500/20 text-indigo-300',
  default: 'bg-white/8 text-white/40',
};

function tagColor(tag) {
  return TAG_COLORS[tag] || TAG_COLORS.default;
}

const LOCATION_EMOJI = {
  'Bengaluru': '🏙️',
  'Delhi': '🏛️',
  'Mumbai': '🌆',
  'Dubai, UAE': '🌇',
  'Pune': '🏘️',
  'Toronto, Canada': '🍁',
  'London, UK': '🇬🇧',
  'Back in Chamoli (retired)': '🏔️',
  'Tehri Garhwal': '⛰️',
};

export default function PahadiVicharPage() {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? PAHADI_VICHAR
        : PAHADI_VICHAR.filter((s) => s.tags.includes(filter)),
    [filter]
  );

  const opened = PAHADI_VICHAR.find((s) => s.id === openId);

  return (
    <>
      <SEO
        title="Pahadi Vichar — Diaspora Stories from the Mountains | PahadiTube"
        description="Personal essays from Pahadis living away from home — stories of migration, language loss, longing, and the unbreakable pull of the mountains."
        keywords="pahadi diaspora, uttarakhand migration, garhwali stories, pahadi identity, ghost villages, pahadi abroad, mountain stories"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-12">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-5xl block mb-3">✍️</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              पहाड़ी विचार
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
              पहाड़ों से दूर रहने वाले लोगों की आपबीति — लंदन से लैंसडाउन तक, दुबई से वापसी तक।
            </p>
            <p className="text-white/30 text-sm mt-1">{PAHADI_VICHAR.length} विचार</p>
          </motion.div>
        </div>

        {/* Tag filters */}
        <div className="max-w-3xl mx-auto mb-8 flex flex-wrap justify-center gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${
                filter === tag
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              {tag === 'All' ? 'सभी विचार' : tag.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Story cards */}
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((story) => (
              <motion.article
                key={story.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                {/* Card header — click to expand */}
                <button
                  onClick={() => setOpenId(openId === story.id ? null : story.id)}
                  className="w-full text-left p-5 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-white leading-snug mb-0.5">
                        {story.title}
                      </h2>
                      <p className="text-white/40 text-xs italic mb-2">{story.titleLocal}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50 mb-3">
                        <span>✍️ {story.author}, {story.age}</span>
                        <span>🏡 {story.from}</span>
                        <span>{LOCATION_EMOJI[story.nowIn] || '📍'} {story.nowIn}</span>
                        <span>⏱ {story.readTime}</span>
                      </div>
                      <p className="text-white/65 text-sm italic leading-relaxed line-clamp-2">
                        &ldquo;{story.excerpt}&rdquo;
                      </p>
                    </div>
                    <span className="text-white/30 text-xl shrink-0 pt-1">
                      {openId === story.id ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {story.tags.map((tag) => (
                      <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tagColor(tag)}`}>
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Full story */}
                <AnimatePresence>
                  {openId === story.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/8 px-5 py-5">
                        <div className="prose prose-invert prose-sm max-w-none">
                          {story.body.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="text-white/70 text-sm leading-relaxed mb-4 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        <div className="mt-5 pt-4 border-t border-white/8 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/40 to-pink-500/40 flex items-center justify-center text-sm font-bold text-white">
                            {story.author[0]}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white/70">{story.author}</p>
                            <p className="text-xs text-white/35">{story.occupation} · Originally from {story.from}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-white/30 mt-12">No stories found for this theme.</p>
        )}

        <p className="text-center text-white/20 text-xs mt-12 max-w-md mx-auto">
          Stories are representative composites reflecting the real experiences of the pahadi diaspora.
          Share your own story on the Jhumelo community page.
        </p>
      </div>
    </>
  );
}
