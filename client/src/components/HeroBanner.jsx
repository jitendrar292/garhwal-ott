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
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.85, rotateX: 15 },
  visible: {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
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
    <div className="relative overflow-hidden bg-gradient-to-b from-dark-700 via-dark-800 to-dark-900 py-16 sm:py-24">
      {/* Primary background glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-500/15 rounded-full blur-[140px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Secondary accent glow */}
      <motion.div
        className="absolute top-20 right-[10%] w-[300px] h-[200px] bg-accent-400/8 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3], x: [0, 30, 0] }}
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.img
            src="/logo.png"
            alt="PahadiTube"
            className="h-20 sm:h-28 w-auto mx-auto drop-shadow-[0_0_30px_rgba(0,188,212,0.3)]"
            whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        </motion.h1>
        <motion.p
          className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="text-shimmer font-semibold">Watch the latest Pahadi movies, trending songs, comedy,</span>
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
              whileHover={{ y: -8, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <Link
                to={cat.path}
                className={`card-shine bg-gradient-to-br ${cat.color} rounded-2xl p-4 sm:p-5 text-center
                           shadow-lg hover:shadow-2xl block transition-all duration-300
                           ring-1 ring-white/10 hover:ring-white/25`}
              >
                <motion.div
                  className="text-4xl mb-2"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
                >
                  {cat.icon}
                </motion.div>
                <p className="text-sm font-bold text-white tracking-wide">{cat.name}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
