// 404 — friendly Garhwali-themed not-found page with quick navigation back
// to the most popular destinations. Wired up via the catch-all `*` route
// in App.jsx so any unknown URL lands here instead of a blank screen.

import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const QUICK_LINKS = [
  { to: '/', label: 'होम', emoji: '🏠' },
  { to: '/music', label: 'गीत-संगीत', emoji: '🎵' },
  { to: '/folk-stories', label: 'लोक कथाएं', emoji: '📖' },
  { to: '/pahadi-khano', label: 'पहाड़ी खाणू', emoji: '🥘' },
  { to: '/jobs', label: 'रोजगार', emoji: '💼' },
  { to: '/chardham-yatra', label: 'चार धाम', emoji: '🛕' },
];

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="min-h-[60vh] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <SEO
        title="Page not found — PahadiTube"
        description="The page you were looking for is not here. Browse Garhwali videos, folk stories, recipes and more on PahadiTube."
        path={location.pathname}
        noindex
      />

      <p className="text-7xl mb-6" aria-hidden="true">🏔️</p>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">404</h1>
      <p className="text-lg text-white/80 mb-2">यो पेज नी मिल्यो</p>
      <p className="text-sm text-white/50 mb-1">
        The page you were looking for doesn't exist or has moved.
      </p>
      <p className="text-xs text-white/30 font-mono mb-10 break-all">
        {location.pathname}
      </p>

      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold text-sm transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
        Or explore something else
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 py-3 text-sm text-white/80 transition-colors"
          >
            <span aria-hidden="true">{l.emoji}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
