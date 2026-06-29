import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import PAHADI_KHEL from '../data/pahadiKhel';

const TYPE_COLORS = {
  'Outdoor': 'bg-green-500/20 text-green-300',
  'Outdoor / Ground': 'bg-emerald-500/20 text-emerald-300',
  'Outdoor / Indoor': 'bg-teal-500/20 text-teal-300',
  'Contact Sport': 'bg-red-500/20 text-red-300',
};

export default function PahadiKhelPage() {
  const [openId, setOpenId] = useState(null);

  return (
    <>
      <SEO
        title="Pahadi Khel — Traditional Games of Uttarakhand | PahadiTube"
        description="Gilli Danda, Kanche, Pithoo, Latto, Kabaddi — the traditional folk games that shaped childhood in the mountains of Uttarakhand."
        keywords="pahadi games, uttarakhand traditional games, gilli danda, kanche marbles, pithoo, latto spinning top, pahadi kabaddi, folk sports"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-5xl block mb-3">🎮</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Pahadi Khel
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
              The traditional games that filled every village childhood — before screens,
              before Wi-Fi, just mountains and friends.
            </p>
            <p className="text-white/30 text-sm mt-1">{PAHADI_KHEL.length} games documented</p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PAHADI_KHEL.map((game, i) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setOpenId(openId === game.id ? null : game.id)}
              className={`bg-gradient-to-br ${game.bg} rounded-2xl p-5 text-left ring-1 ring-white/10 hover:ring-white/20 transition-all shadow-elevation-2 w-full`}
            >
              {/* Card header */}
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0 mt-0.5">{game.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-base leading-tight">{game.name}</p>
                  <p className="text-white/60 text-xs mt-0.5">{game.nameLocal}</p>
                  <p className="text-white/50 text-xs mt-1 italic">{game.tagline}</p>
                </div>
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[game.type] || 'bg-white/10 text-white/50'}`}>
                  {game.type}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                  👥 {game.players}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                  🎂 Age {game.age}
                </span>
              </div>

              {/* Expandable detail */}
              <AnimatePresence>
                {openId === game.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      <p className="text-white/80 text-sm leading-relaxed">{game.description}</p>

                      {/* Equipment */}
                      <div className="bg-black/20 rounded-xl p-3">
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                          Equipment
                        </p>
                        <ul className="space-y-1">
                          {game.equipment.map((e, ei) => (
                            <li key={ei} className="flex items-start gap-2 text-xs text-white/70">
                              <span className="text-primary-400 flex-shrink-0 mt-0.5">▸</span>
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* How to play */}
                      <div className="bg-black/20 rounded-xl p-3">
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                          How to Play
                        </p>
                        <ol className="space-y-1">
                          {game.howToPlay.map((step, si) => (
                            <li key={si} className="flex items-start gap-2 text-xs text-white/70">
                              <span className="text-primary-400 font-bold flex-shrink-0">{si + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Cultural note */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
                          Cultural Note
                        </p>
                        <p className="text-xs text-white/65 italic leading-relaxed">
                          {game.culturalNote}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-white/40 text-xs mt-3 text-right">
                {openId === game.id ? 'Tap to close ▲' : 'Tap to see rules ▼'}
              </p>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-white/20 mt-12 max-w-md mx-auto">
          PahadiTube — documenting the games our grandparents played.
        </p>
      </div>
    </>
  );
}
