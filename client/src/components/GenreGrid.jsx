import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useToast } from './ui/Toast';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20, rotate: -3 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20, mass: 0.6 },
  },
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
    icon: '/icons/music.png',
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
    name: 'रैबार',
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
    icon: '/icons/khano.png',
    bg: 'bg-red-700',
    badge: { text: '🆕', cls: 'bg-red-500/85' },
  },
  {
    name: 'पहाड़ी फल',
    sub: 'काफल · हिसालू\nआड़ू · पुलम',
    path: '/pahadi-fal',
    emoji: '🍑',
    bg: 'bg-rose-700',
    badge: { text: '🆕', cls: 'bg-rose-500/85' },
  },
  {
    name: 'पहाड़ी पहनावा',
    sub: 'पारंपरिक\nवेशभूषा',
    path: '/pahadi-pehnawa',
    emoji: '👗',
    icon: '/icons/pehnawa.png',
    bg: 'bg-purple-700',
    badge: { text: '🆕', cls: 'bg-purple-500/85' },
  },
  {
    name: 'पहाड़ी उत्पाद',
    sub: 'नून · अचार\nस्क्वैश · जैम',
    path: '/pahadi-products',
    emoji: '🫙',
    bg: 'bg-amber-700',
    badge: { text: '🆕', cls: 'bg-amber-500/85' },
  },
];

export default function GenreGrid() {
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const handleShareApp = () => {
    const url = window.location.origin;
    const shareData = { title: 'PahadiTube', text: 'PahadiTube – Garhwali & Kumaoni entertainment app 🎬🎵', url };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(url)
        .then(() => toast.success('Link copied — share with your group!', 2200))
        .catch(() => toast.error('Could not copy link', 2500));
    }
  };

  return (
    <section className="mb-section-md">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-header">
          <span className="text-gradient-primary">खोजा (Explore)</span>
        </h2>
        <button
          onClick={handleShareApp}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          title="Share App"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share App
        </button>
      </div>
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {GENRES.map((g, idx) => (
          <motion.div
            key={g.path}
            variants={cardVariants}
            whileHover={reduceMotion ? undefined : { y: -6, scale: 1.06, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
            whileTap={{ scale: 0.94 }}
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

            {/* Shimmer sweep on hover */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out pointer-events-none"
              style={{
                background:
                  'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
              }}
            />

            {/* Soft glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-white/[0.08] via-transparent to-white/[0.04]" />

            {/* Badge */}
            {g.badge && (
              <motion.div
                className={`absolute top-1.5 right-1.5 z-20 ${g.badge.cls} backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg leading-none shadow-lg`}
                animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: (idx % 5) * 0.3 }}
              >
                {g.badge.text}
              </motion.div>
            )}

            <div className="relative flex flex-col items-center justify-center gap-1.5 min-h-[96px]">
              <motion.div
                className="text-2xl sm:text-3xl drop-shadow-sm"
                animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                transition={{ duration: 3 + (idx % 4) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: (idx % 6) * 0.25 }}
                whileHover={reduceMotion ? undefined : { scale: 1.18, rotate: [0, -8, 8, -4, 0], transition: { duration: 0.6 } }}
              >
                {g.icon ? <img src={g.icon} alt={g.name} className="w-8 h-8 sm:w-9 sm:h-9 object-contain inline-block" /> : g.emoji}
              </motion.div>
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
