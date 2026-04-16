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
    <footer className="border-t border-white/10 bg-dark-800/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-400">PahadiTube</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link to="/category/movies" className="hover:text-gray-300 transition-colors">Movies</Link>
            <Link to="/category/songs" className="hover:text-gray-300 transition-colors">Songs</Link>
            <Link to="/favorites" className="hover:text-gray-300 transition-colors">Favorites</Link>
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
      </div>
    </footer>
  );
}
