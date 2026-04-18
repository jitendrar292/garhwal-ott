import { Link } from 'react-router-dom';

const GENRES = [
  { name: 'Movies', path: '/category/movies', emoji: '🎬', gradient: 'from-indigo-600 to-purple-700' },
  { name: 'Comedy', path: '/category/comedy', emoji: '😂', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Songs', path: '/category/songs', emoji: '🎵', gradient: 'from-pink-500 to-rose-600' },
  { name: 'Devotional', path: '/category/devotional', emoji: '🙏', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Vlogs', path: '/category/vlogs', emoji: '📹', gradient: 'from-cyan-500 to-blue-600' },
  { name: 'Podcast', path: '/podcast', emoji: '🎙️', gradient: 'from-violet-500 to-purple-700' },
];

export default function GenreGrid() {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        Genre
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {GENRES.map((genre) => (
          <Link
            key={genre.path}
            to={genre.path}
            className={`relative bg-gradient-to-br ${genre.gradient} rounded-2xl p-5 overflow-hidden
                       hover:scale-[1.03] transition-transform duration-300 shadow-lg group`}
          >
            <div className="absolute top-2 right-2 text-4xl opacity-30 group-hover:opacity-50 transition-opacity">
              {genre.emoji}
            </div>
            <p className="relative text-sm font-bold text-white mt-6">{genre.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
