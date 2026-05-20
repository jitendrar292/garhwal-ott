import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

// Card style matches the Ghughuti AI topic tiles: solid colour, centred
// emoji, two-line Garhwali label, dotted texture overlay.
const GENRES = [
  {
    name: 'सिनेमा',
    sub: 'फिल्म\nगढ़वळि',
    path: '/category/movies',
    emoji: '🎬',
    bg: 'bg-indigo-700',
  },
  {
    name: 'हँसी-ठट्ठा',
    sub: 'कॉमेडी\nहँसते रौ',
    path: '/category/comedy',
    emoji: '😂',
    bg: 'bg-orange-600',
    badge: { text: '🔥', cls: 'bg-red-600/85' },
  },
  {
    name: 'गीत',
    sub: 'पहाड़ी\nगाणा',
    path: '/music',
    emoji: '🎵',
    bg: 'bg-pink-600',
    badge: { text: '✨', cls: 'bg-fuchsia-600/85' },
  },
  {
    name: 'जागर & मेला',
    sub: 'भजन\nमेला-जात्रा',
    path: '/category/devotional',
    emoji: '🔱🎪',
    bg: 'bg-amber-700',
  },
  {
    name: 'यात्रा',
    sub: 'पहाड़ की\nव्लॉग',
    path: '/category/vlogs',
    emoji: '📹',
    bg: 'bg-sky-700',
  },
  {
    name: 'पॉडकास्ट',
    sub: 'पहाड़ी\nकिस्सा',
    path: '/podcast',
    emoji: '🎙️',
    bg: 'bg-violet-700',
  },
  {
    name: 'नाच',
    sub: 'तांदी\nछोलिया',
    path: '/category/folkdance',
    emoji: '💃',
    bg: 'bg-rose-600',
  },
  {
    name: 'घुघुती AI',
    sub: 'गढ़वळि\nमा बच्या',
    path: '/ghughuti-ai',
    emoji: '🤖',
    bg: 'bg-teal-700',
    badge: { text: '🆕', cls: 'bg-teal-500/85' },
  },
  {
    name: 'समाचार',
    sub: 'पहाड़ की\nखबर',
    path: '/news',
    emoji: '📰',
    bg: 'bg-slate-700',
  },
  {
    name: 'लोक-गाथा',
    sub: 'गढ़वाली\nकहानी',
    path: '/folk-stories',
    emoji: '📖',
    bg: 'bg-amber-700',
    badge: { text: '🆕', cls: 'bg-amber-500/85' },
  },
  {
    name: 'पहाड़ी खाणू',
    sub: 'रेसिपी\nव्यंजन',
    path: '/pahadi-khano',
    emoji: '🍲',
    bg: 'bg-red-700',
    badge: { text: '🆕', cls: 'bg-red-500/85' },
  },
  {
    name: 'पहाड़ी पहनावा',
    sub: 'पारंपरिक\nवेशभूषा',
    path: '/pahadi-pehnawa',
    emoji: '👘',
    bg: 'bg-purple-700',
    badge: { text: '🆕', cls: 'bg-purple-500/85' },
  },
];

export default function GenreGrid() {
  return (
    <section className="mb-section-md">
      <h2 className="section-header mb-5">
        <span className="text-gradient-primary">खोजा (Explore)</span>
      </h2>
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {GENRES.map((g) => (
          <motion.div
            key={g.path}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
          <Link
            to={g.path}
            className={`group relative ${g.bg} rounded-2xl p-2.5 text-center shadow-elevation-1 hover:shadow-elevation-3 ring-1 ring-white/10 hover:ring-white/25 transition-all duration-250 overflow-hidden block`}
          >
            {/* subtle dot pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 20%, #fff 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            />

            {/* Badge */}
            {g.badge && (
              <div
                className={`absolute top-1.5 right-1.5 z-20 ${g.badge.cls} backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg leading-none`}
              >
                {g.badge.text}
              </div>
            )}

            <div className="relative flex flex-col items-center justify-center gap-1.5 min-h-[96px]">
              <div className="text-2xl sm:text-3xl drop-shadow-sm group-hover:scale-110 transition-transform duration-250">
                {g.emoji}
              </div>
              <div className="text-white font-semibold text-[12px] sm:text-[13px] leading-tight drop-shadow-sm">
                {g.name}
              </div>
              <div className="text-white/70 font-medium text-[9px] sm:text-[10px] leading-tight whitespace-pre-line">
                {g.sub}
              </div>
            </div>
          </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
