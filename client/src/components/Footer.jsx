import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    const visited = sessionStorage.getItem('pahadi_tube_visited');
    if (!visited) {
      // First visit this session — increment
      fetch('/api/visits', { method: 'POST' })
        .then((r) => r.json())
        .then((data) => {
          setVisits(data.count);
          sessionStorage.setItem('pahadi_tube_visited', '1');
        })
        .catch(() => {});
    } else {
      // Already counted — just fetch current count
      fetch('/api/visits')
        .then((r) => r.json())
        .then((data) => setVisits(data.count))
        .catch(() => {});
    }
  }, []);

  return (
    <footer className="border-t border-white/10 bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="shrink-0">
            <img src="/logo.png" alt="PahadiTube" className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link to="/category/movies" className="hover:text-gray-300 transition-colors">Movies</Link>
            <Link to="/category/songs" className="hover:text-gray-300 transition-colors">Songs</Link>
            <Link to="/favorites" className="hover:text-gray-300 transition-colors">Favorites</Link>
            <Link to="/feedback" className="hover:text-gray-300 transition-colors">Feedback</Link>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            {visits !== null && (
              <div className="flex items-center gap-1.5 bg-dark-700 border border-white/10 rounded-full px-3 py-1">
                <svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-xs font-medium text-gray-300">
                  {visits.toLocaleString()} visit{visits !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} PahadiTube. All videos are from YouTube.
            </p>
          </div>
        </div>

        {/* Disclaimer + Copyright notice */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-xs text-gray-600">
            PahadiTube does not host or control third-party embedded content.
          </p>
          <p className="text-xs text-gray-600">
            Copyright owner?{' '}
            <a
              href="mailto:jitendrar292@gmail.com"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              jitendrar292@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
