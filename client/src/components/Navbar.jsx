import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { name: 'Home', path: '/', emoji: '🏠' },
  { name: 'Movies', path: '/category/movies', emoji: '🎬' },
  { name: 'Songs', path: '/category/songs', emoji: '🎵' },
  { name: 'Comedy', path: '/category/comedy', emoji: '😂' },
  { name: 'Devotional', path: '/category/devotional', emoji: '🙏' },
  { name: 'Folk Dance', path: '/category/folkdance', emoji: '💃' },
  { name: 'Jaagar', path: '/category/jaagar', emoji: '🔱' },
  { name: 'Mela', path: '/category/mela', emoji: '🎪' },
  { name: 'Vlogs', path: '/category/vlogs', emoji: '📹' },
  { name: 'Shorts', path: '/shorts', emoji: '⚡' },
  { name: 'Podcast', path: '/podcast', emoji: '🎙️' },
  { name: 'Pahadi AI', path: '/pahadi-ai', emoji: '🤖' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-dark-900/95 backdrop-blur-2xl shadow-lg shadow-black/20 border-b border-white/5'
        : 'bg-dark-900/80 backdrop-blur-xl border-b border-white/[0.03]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top row: Logo + Search + Actions */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0 group flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="PahadiTube"
              className="h-9 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Center search — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full group">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Garhwali videos..."
                className="w-full bg-dark-800/80 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm
                           text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50
                           focus:bg-dark-700/80 focus:ring-1 focus:ring-primary-500/25 transition-all duration-200"
                maxLength={200}
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Mobile search toggle */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center sm:hidden">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  onBlur={() => { if (!query) setSearchOpen(false); }}
                  className="w-44 bg-dark-700 border border-dark-500 rounded-full px-3 py-1.5 text-sm
                             text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  maxLength={200}
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            <Link
              to="/favorites"
              className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
              aria-label="Favorites"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd" />
              </svg>
            </Link>

            <Link
              to="/feedback"
              className="hidden sm:flex p-2.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all"
              aria-label="Feedback"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Tab bar — scrollable, pill-style */}
        <div className="hidden sm:flex items-center gap-1 pb-2 -mx-1 overflow-x-auto scroll-row">
          {TABS.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap rounded-full transition-all duration-200
                ${isActive(tab.path)
                  ? 'bg-primary-500/15 text-primary-300 ring-1 ring-primary-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="text-sm">{tab.emoji}</span>
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
