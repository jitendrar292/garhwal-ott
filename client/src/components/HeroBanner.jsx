import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HERO_CATEGORIES = [
  { name: 'Movies', path: '/category/movies', icon: '🎬', color: 'from-purple-500 to-indigo-600' },
  { name: 'Songs', path: '/category/songs', icon: '🎵', color: 'from-pink-500 to-rose-600' },
  { name: 'Comedy', path: '/category/comedy', icon: '😂', color: 'from-yellow-500 to-orange-600' },
  { name: 'Devotional', path: '/category/devotional', icon: '🙏', color: 'from-green-500 to-teal-600' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

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
          className="mt-4 text-body sm:text-heading-sm text-white/60 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-gradient-primary font-semibold">Watch the latest Pahadi movies, trending songs, comedy,</span>
          <br className="hidden sm:block" />
          and devotional content — all in one place.
        </motion.p>

        {/* Category cards */}
        <motion.div
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {HERO_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.path}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                to={cat.path}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl p-4 sm:p-5 text-center
                           shadow-elevation-2 hover:shadow-elevation-3 block transition-all duration-200
                           ring-1 ring-white/10 hover:ring-white/20`}
              >
                <div className="text-4xl mb-2">
                  {cat.icon}
                </div>
                <p className="text-body-sm font-bold text-white tracking-wide">{cat.name}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
