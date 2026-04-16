import { Link } from 'react-router-dom';

const HERO_CATEGORIES = [
  { name: 'Movies', path: '/category/movies', icon: '🎬', color: 'from-purple-500 to-indigo-600' },
  { name: 'Songs', path: '/category/songs', icon: '🎵', color: 'from-pink-500 to-rose-600' },
  { name: 'Comedy', path: '/category/comedy', icon: '😂', color: 'from-yellow-500 to-orange-600' },
  { name: 'Devotional', path: '/category/devotional', icon: '🙏', color: 'from-green-500 to-teal-600' },
];

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-dark-700 via-dark-800 to-dark-900 py-16 sm:py-24">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 bg-clip-text text-transparent">
            PahadiTube
          </span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Watch the latest Pahadi movies, trending songs, comedy, and devotional content — all in one place.
        </p>

        {/* Category cards */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {HERO_CATEGORIES.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`bg-gradient-to-br ${cat.color} rounded-2xl p-4 sm:p-5 text-center
                         hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-sm font-semibold text-white">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
