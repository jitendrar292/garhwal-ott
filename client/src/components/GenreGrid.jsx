import { Link } from 'react-router-dom';

const GENRES = [
  {
    name: 'Movies',
    path: '/category/movies',
    emoji: '🎬',
    gradient: 'from-indigo-600 via-purple-600 to-purple-800',
    glow: 'hover:shadow-indigo-500/50',
    hint: 'Films & Web Series',
  },
  {
    name: 'Comedy',
    path: '/category/comedy',
    emoji: '😂',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    glow: 'hover:shadow-orange-500/50',
    hint: 'हँसते रहो!',
    badge: { text: '🔥 Hot', cls: 'bg-red-600/80' },
  },
  {
    name: 'Songs',
    path: '/category/songs',
    emoji: '🎵',
    gradient: 'from-pink-500 via-rose-500 to-fuchsia-600',
    glow: 'hover:shadow-pink-500/50',
    hint: 'Garhwali & Kumaoni',
    badge: { text: '✨ New', cls: 'bg-fuchsia-600/80' },
  },
  {
    name: 'Devotional',
    path: '/category/devotional',
    emoji: '🙏',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    glow: 'hover:shadow-emerald-500/50',
    hint: 'भक्ति & आरती',
  },
  {
    name: 'Vlogs',
    path: '/category/vlogs',
    emoji: '📹',
    gradient: 'from-cyan-500 via-blue-500 to-blue-700',
    glow: 'hover:shadow-blue-500/50',
    hint: 'पहाड़ की यात्रा',
  },
  {
    name: 'Podcast',
    path: '/podcast',
    emoji: '🎙️',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    glow: 'hover:shadow-violet-500/50',
    hint: 'Pahadi Stories',
  },
  {
    name: 'Folk Dances',
    path: '/category/folkdance',
    emoji: '💃',
    gradient: 'from-rose-500 via-red-500 to-orange-500',
    glow: 'hover:shadow-rose-500/50',
    hint: 'तांदी, छोलिया & more',
  },
  {
    name: 'Jaagar',
    path: '/category/jaagar',
    emoji: '🔱',
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    glow: 'hover:shadow-amber-500/50',
    hint: 'देवभूमि की जागर',
  },
  {
    name: 'Mela',
    path: '/category/mela',
    emoji: '🎪',
    gradient: 'from-lime-500 via-green-500 to-emerald-600',
    glow: 'hover:shadow-green-500/50',
    hint: 'Fairs & Festivals',
  },
];

export default function GenreGrid() {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
        Explore
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-2 sm:gap-3">
        {GENRES.map((genre) => (
          <Link
            key={genre.path}
            to={genre.path}
            className={`relative bg-gradient-to-br ${genre.gradient} rounded-2xl overflow-hidden
                       group hover:scale-[1.06] active:scale-[0.97]
                       transition-all duration-300 shadow-lg hover:shadow-2xl ${genre.glow}`}
          >
            {/* Shine sweep on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent
                            -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-10 pointer-events-none" />

            {/* Badge */}
            {genre.badge && (
              <div className={`absolute top-2 right-2 z-20 ${genre.badge.cls} backdrop-blur-sm
                              text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight`}>
                {genre.badge.text}
              </div>
            )}

            <div className="relative z-10 p-3 pb-2.5 flex flex-col items-start gap-0.5">
              {/* Large emoji */}
              <span className="text-2xl sm:text-3xl mb-1 drop-shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">
                {genre.emoji}
              </span>
              <p className="text-white font-extrabold text-sm leading-tight">{genre.name}</p>
              <p className="text-white/60 text-[10px] leading-snug">{genre.hint}</p>
              {/* Browse arrow — fades in on hover */}
              <span className="mt-1.5 text-white/0 group-hover:text-white/90 text-xs font-semibold
                               transition-colors duration-300 flex items-center gap-0.5">
                Browse <span className="text-sm">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
