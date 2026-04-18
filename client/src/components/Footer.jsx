import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Movies', path: '/category/movies' },
  { label: 'Songs', path: '/category/songs' },
  { label: 'Comedy', path: '/category/comedy' },
  { label: 'Folk Dance', path: '/category/folkdance' },
  { label: 'Jaagar', path: '/category/jaagar' },
  { label: 'Mela', path: '/category/mela' },
  { label: 'Favorites', path: '/favorites' },
  { label: 'Feedback', path: '/feedback' },
];

export default function Footer() {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    const visited = sessionStorage.getItem('pahadi_tube_visited');
    if (!visited) {
      fetch('/api/visits', { method: 'POST' })
        .then((r) => r.json())
        .then((data) => {
          setVisits(data.count);
          sessionStorage.setItem('pahadi_tube_visited', '1');
        })
        .catch(() => {});
    } else {
      fetch('/api/visits')
        .then((r) => r.json())
        .then((data) => setVisits(data.count))
        .catch(() => {});
    }
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-gradient-to-b from-dark-900/80 to-dark-950">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="group">
              <img
                src="/logo.png"
                alt="PahadiTube"
                className="h-10 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed text-center md:text-left max-w-xs">
              Your home for Garhwali & Kumaoni entertainment — movies, songs, comedy, folk culture, and more from Devbhoomi Uttarakhand.
            </p>
            {/* Visit counter */}
            {visits !== null && (
              <div className="flex items-center gap-2 bg-dark-800/60 border border-white/[0.06] rounded-full px-4 py-1.5 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                </span>
                <span className="text-xs font-medium text-gray-400">
                  {visits.toLocaleString()} visitor{visits !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Quick Links
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-gray-500 hover:text-primary-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Get in Touch
            </h3>
            <a
              href="mailto:jitendrar292@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-400 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              jitendrar292@gmail.com
            </a>
            <p className="text-xs text-gray-600 leading-relaxed text-center md:text-left">
              Copyright concerns? Content removal requests? Reach out any time.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} PahadiTube. All videos are from YouTube.
          </p>
          <p className="text-[11px] text-gray-700">
            PahadiTube does not host or control third-party embedded content.
          </p>
        </div>
      </div>
    </footer>
  );
}
