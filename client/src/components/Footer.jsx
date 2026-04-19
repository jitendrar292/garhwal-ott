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

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-1">
              <a
                href="https://www.linkedin.com/in/jitendrar-singh-rawat/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn — Jitendrar Singh Rawat"
                title="LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/pahaditube.323/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram — @pahaditube.323"
                title="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#FEDA75] hover:via-[#FA7E1E] hover:to-[#D62976] hover:border-transparent transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <Link
                to="/feedback"
                aria-label="Send feedback"
                title="Feedback"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-primary-300 hover:bg-primary-500/10 hover:border-primary-500/30 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed text-center md:text-left mt-1">
              Built by <a href="https://www.linkedin.com/in/jitendrar-singh-rawat/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">Jitendrar Singh Rawat</a> · Copyright concerns? Reach out any time.
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
