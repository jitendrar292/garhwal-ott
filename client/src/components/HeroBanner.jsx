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
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-dark-700 via-dark-800 to-dark-900 py-16 sm:py-24">
      {/* Background glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/10 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <img src="/logo.png" alt="PahadiTube" className="h-20 sm:h-28 w-auto mx-auto" />
        </motion.h1>
        <motion.p
          className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Watch the latest Pahadi movies, trending songs, comedy, and devotional content — all in one place.
        </motion.p>

        {/* Category cards */}
        <motion.div
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {HERO_CATEGORIES.map((cat) => (
            <motion.div key={cat.path} variants={cardVariants} whileHover={{ y: -6, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={cat.path}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl p-4 sm:p-5 text-center
                           shadow-lg hover:shadow-2xl block transition-shadow duration-300`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-sm font-semibold text-white">{cat.name}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
