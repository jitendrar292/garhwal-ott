import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/category/movies' },
  { name: 'Songs', path: '/category/songs' },
  { name: 'Comedy', path: '/category/comedy' },
  { name: 'Devotional', path: '/category/devotional' },
  { name: 'Vlogs', path: '/category/vlogs' },
  { name: 'Shorts', path: '/shorts' },
  { name: 'Podcast', path: '/podcast' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top row: Logo + Search */}
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="shrink-0">
            <img src="/logo.png" alt="PahadiTube" className="h-9 sm:h-10 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  onBlur={() => { if (!query) setSearchOpen(false); }}
                  className="w-48 sm:w-64 bg-dark-700 border border-dark-500 rounded-lg px-3 py-1.5 text-sm
                             text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  maxLength={200}
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
            <Link to="/favorites" className="p-2 text-gray-400 hover:text-red-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="hidden sm:flex items-center gap-1 -mb-px overflow-x-auto">
          {TABS.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2
                ${isActive(tab.path)
                  ? 'text-white border-primary-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600'
                }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
