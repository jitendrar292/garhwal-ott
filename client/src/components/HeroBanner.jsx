import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RECENT_JOINERS = [
  { emoji: '👩', name: 'Naina', region: 'Kumaon' },
  { emoji: '👨', name: 'Mohit', region: 'Garhwal' },
  { emoji: '👩‍🎤', name: 'Neha', region: 'Himachal' },
  { emoji: '👨', name: 'Karan', region: 'Jaunsar' },
  { emoji: '👩', name: 'Riya', region: 'Nepal' },
];

// Floating particles for visual depth
const particles = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: `${15 + i * 15}%`,
  size: 3 + (i % 3) * 2,
  delay: i * 0.8,
  duration: 4 + (i % 3) * 2,
}));

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-surface-2 via-surface-1 to-surface-0 py-16 sm:py-24">
      {/* Primary background glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-500/10 rounded-full blur-[140px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Secondary accent glow */}
      <motion.div
        className="absolute top-20 right-[10%] w-[300px] h-[200px] bg-secondary-400/8 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2], x: [0, 30, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Third glow for depth */}
      <motion.div
        className="absolute bottom-0 left-[15%] w-[250px] h-[150px] bg-purple-500/8 rounded-full blur-[80px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary-400/20"
          style={{ left: p.x, width: p.size, height: p.size }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}

      <div className="relative max-w-full mx-auto px-4 sm:px-6 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src="/logo.png"
            alt="PahadiTube"
            width={112}
            height={112}
            className="h-20 sm:h-28 w-auto mx-auto drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
        </motion.h1>
        <motion.p
          className="mt-5 text-xl sm:text-2xl font-bold text-white max-w-2xl mx-auto leading-snug"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-gradient-primary">The Internet's First Social Space for Pahadis</span>{' '}❤️
        </motion.p>

        <motion.p
          className="mt-3 text-base sm:text-lg text-white/70 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          Find people who understand Buransh, Binsar, Jhumelo, and home.
        </motion.p>

        <motion.p
          className="mt-2 text-sm sm:text-base text-white/40 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          Not dating. Not matrimony. Just real pahadi connections.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/waitlist"
            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400
                       text-white font-bold text-base sm:text-lg px-7 py-3.5 rounded-2xl shadow-elevation-2
                       hover:shadow-elevation-3 transition-all duration-200 ring-1 ring-white/10 hover:ring-white/20"
          >
            <span>🚀</span> Join Waitlist
          </Link>
          <Link
            to="/compatibility"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30
                       text-white font-bold text-base sm:text-lg px-7 py-3.5 rounded-2xl shadow-elevation-2
                       transition-all duration-200"
          >
            <span>❤️</span> Check Compatibility
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          className="mt-5 text-sm sm:text-base text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          🔥 <span className="text-white/80 font-semibold">1,247 Pahadis</span> already joined
        </motion.p>

        {/* Recently Joined */}
        <motion.div
          className="mt-10 max-w-sm mx-auto bg-white/5 border border-white/10 rounded-2xl px-5 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Recently Joined
          </p>
          <ul className="space-y-2">
            {RECENT_JOINERS.map((person, i) => (
              <motion.li
                key={person.name}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.85 + i * 0.08 }}
              >
                <span className="text-2xl leading-none w-9 h-9 flex items-center justify-center bg-white/10 rounded-full ring-1 ring-white/10">
                  {person.emoji}
                </span>
                <span className="text-sm text-white/80 font-medium">
                  {person.name}
                </span>
                <span className="text-xs text-white/35 ml-auto">
                  {person.region}
                </span>
              </motion.li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/40 text-right">
            +120 joined today
          </p>
        </motion.div>
      </div>
    </div>
  );
}
