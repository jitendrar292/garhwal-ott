import { Link } from 'react-router-dom';

// Card style matches the Pahadi AI topic tiles: solid colour, centred
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
    path: '/category/songs',
    emoji: '🎵',
    bg: 'bg-pink-600',
    badge: { text: '✨', cls: 'bg-fuchsia-600/85' },
  },
  {
    name: 'जागर',
    sub: 'भजन\nआरती',
    path: '/category/devotional',
    emoji: '🔱',
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
    name: 'मेला',
    sub: 'थौलू\nजात्रा',
    path: '/category/mela',
    emoji: '🎪',
    bg: 'bg-emerald-700',
  },
  {
    name: 'रंगमंच',
    sub: 'थियेटर\nHNBGU',
    path: '/category/theatre',
    emoji: '🎭',
    bg: 'bg-purple-700',
    badge: { text: '🆕', cls: 'bg-purple-500/85' },
  },
  {
    name: 'पहाड़ी AI',
    sub: 'गढ़वळि\nमा बच्या',
    path: '/pahadi-ai',
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
];

export default function GenreGrid() {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        खोजा (Explore)
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
        {GENRES.map((g) => (
          <Link
            key={g.path}
            to={g.path}
            className={`group relative ${g.bg} rounded-xl p-2 text-center shadow-md shadow-black/30 ring-1 ring-white/10 hover:scale-[1.03] hover:ring-white/30 transition-all overflow-hidden`}
          >
            {/* subtle dot pattern overlay (matches Pahadi AI cards) */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 20%, #fff 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            />

            {/* Badge */}
            {g.badge && (
              <div
                className={`absolute top-1.5 right-1.5 z-20 ${g.badge.cls} backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none`}
              >
                {g.badge.text}
              </div>
            )}

            <div className="relative flex flex-col items-center justify-center gap-1 min-h-[92px]">
              <div className="text-2xl sm:text-3xl drop-shadow group-hover:scale-110 transition-transform">
                {g.emoji}
              </div>
              <div className="text-white font-bold text-[12px] sm:text-[13px] leading-tight drop-shadow">
                {g.name}
              </div>
              <div className="text-white/80 font-medium text-[9px] sm:text-[10px] leading-tight whitespace-pre-line drop-shadow">
                {g.sub}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
