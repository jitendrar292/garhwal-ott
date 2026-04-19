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
  { name: 'Reels', path: '/shorts', emoji: '⚡' },
  { name: 'Podcast', path: '/podcast', emoji: '🎙️' },
  { name: 'Pahadi AI', path: '/pahadi-ai', emoji: '🤖' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState('');
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Speech recognition support (skip iOS — webkit impl is unreliable)
  const SpeechRecognition = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const isIOS = typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  const speechSupported = !!SpeechRecognition && !isIOS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* noop */ }
      }
    };
  }, []);

  // Auto-clear mic errors after a short delay
  useEffect(() => {
    if (!micError) return undefined;
    const t = setTimeout(() => setMicError(''), 3500);
    return () => clearTimeout(t);
  }, [micError]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const startVoiceSearch = () => {
    if (!speechSupported || listening) return;
    setMicError('');
    const rec = new SpeechRecognition();
    rec.lang = 'hi-IN'; // Hindi — closest to Garhwali
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    let finalText = '';
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setQuery((finalText + interim).trim());
    };
    rec.onerror = (ev) => {
      const errMap = {
        'not-allowed': 'Mic permission denied.',
        'service-not-allowed': 'Voice search not available on this device.',
        'audio-capture': 'No microphone found.',
        'network': 'Voice search needs internet.',
      };
      if (ev.error !== 'no-speech' && ev.error !== 'aborted') {
        setMicError(errMap[ev.error] || `Mic error: ${ev.error}`);
      }
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      // Auto-submit when we got a final transcript
      const submitted = finalText.trim();
      if (submitted) {
        navigate(`/search?q=${encodeURIComponent(submitted)}`);
        setQuery('');
        setSearchOpen(false);
      }
    };

    try {
      rec.start();
      recognitionRef.current = rec;
      setListening(true);
    } catch (err) {
      setMicError(err.message || 'Could not start microphone');
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* noop */ }
    }
    setListening(false);
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
                placeholder={listening ? '🎙️ Listening… बोला' : 'Search Garhwali videos…'}
                className={`w-full bg-dark-800/80 border rounded-full pl-10 ${speechSupported ? 'pr-11' : 'pr-4'} py-2 text-sm
                           text-white placeholder-gray-500 focus:outline-none focus:bg-dark-700/80 focus:ring-1 transition-all duration-200
                           ${listening ? 'border-red-500/60 ring-1 ring-red-500/30' : 'border-white/10 focus:border-primary-500/50 focus:ring-primary-500/25'}`}
                maxLength={200}
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={listening ? stopVoiceSearch : startVoiceSearch}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    listening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-primary-300 hover:bg-white/5'
                  }`}
                  aria-label={listening ? 'Stop voice search' : 'Voice search'}
                  title={listening ? 'Stop' : 'Voice search (Hindi/Garhwali)'}
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
                    <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V20H8a1 1 0 100 2h8a1 1 0 100-2h-3v-2.08A7 7 0 0019 11z" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Mobile search toggle */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-1 sm:hidden">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={listening ? '🎙️ बोला…' : 'Search…'}
                  autoFocus
                  onBlur={() => { if (!query && !listening) setSearchOpen(false); }}
                  className={`w-40 bg-dark-700 border rounded-full px-3 py-1.5 text-sm
                             text-white placeholder-gray-500 focus:outline-none transition-all
                             ${listening ? 'border-red-500/60' : 'border-dark-500 focus:border-primary-500'}`}
                  maxLength={200}
                />
                {speechSupported && (
                  <button
                    type="button"
                    onClick={listening ? stopVoiceSearch : startVoiceSearch}
                    onMouseDown={(e) => e.preventDefault()} // keep input focus
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                      listening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-primary-300 bg-white/5 hover:bg-white/10'
                    }`}
                    aria-label={listening ? 'Stop voice search' : 'Voice search'}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
                      <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V20H8a1 1 0 100 2h8a1 1 0 100-2h-3v-2.08A7 7 0 0019 11z" />
                    </svg>
                  </button>
                )}
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

      {/* Mic error toast */}
      {micError && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-red-500/90 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-sm z-50 whitespace-nowrap">
          ⚠️ {micError}
        </div>
      )}
    </nav>
  );
}
