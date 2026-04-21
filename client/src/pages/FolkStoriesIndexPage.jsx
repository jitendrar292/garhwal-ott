import { Link } from 'react-router-dom';
import { folkStories } from '../data/folkStories';

// Grid index for /folk-stories — shows every Garhwali folk-tale card so the
// "लोक-गाथा" Explore tile has a real destination. Cards reuse the same
// gradient styling as FolkStoriesRow but stack 2-up on mobile / 3-up on
// desktop instead of scrolling horizontally.
export default function FolkStoriesIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-100 flex items-center gap-3">
          <span className="text-4xl">📖</span>
          गढ़वाली लोक-गाथा
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Folk tales of Garhwal — heroes, lovers and warriors of the Pahadi heartland.
          Sourced from{' '}
          <a
            href="https://himlingo.com/folk-stories/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:underline"
          >
            himlingo.com
          </a>
          .
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folkStories.map((s) => (
          <Link
            key={s.slug}
            to={`/folk-story/${s.slug}`}
            className="rounded-xl bg-gradient-to-br from-amber-900/40 via-dark-700 to-dark-800 border border-amber-700/30 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-900/30 transition-all p-5 flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-4xl leading-none">{s.emoji}</span>
                <h2 className="text-lg font-bold text-amber-100 leading-tight">{s.name}</h2>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{s.blurb}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-medium">पढ़ें →</span>
              <span className="text-gray-500">गढ़वाली लोक-गाथा</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
