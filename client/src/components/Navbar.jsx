import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import SnowEffect from './SnowEffect';

const TABS = [
  { name: 'Home', path: '/', emoji: '🏠' },
  { name: 'Movies', path: '/category/movies', emoji: '🎬' },
  { name: 'Songs', path: '/category/songs', emoji: '🎵' },
  { name: 'Comedy', path: '/category/comedy', emoji: '😂' },
  { name: 'Devotional', path: '/category/devotional', emoji: '�' },
  { name: 'Folk Dance', path: '/category/folkdance', emoji: '💃' },
  { name: 'Mela', path: '/category/mela', emoji: '🎪' },
  { name: 'Vlogs', path: '/category/vlogs', emoji: '📹' },
  { name: 'Reels', path: '/shorts', emoji: '⚡' },
  { name: 'Podcast', path: '/podcast', emoji: '🎙️' },
  { name: 'Jobs', path: '/jobs', emoji: '💼' },
  { name: 'Garhwali Sikha', path: '/garhwali-sikha', emoji: '📖' },
  { name: 'Ghughuti AI', path: '/ghughuti-ai', emoji: '🤖' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState('');
  const [snowBatches, setSnowBatches] = useState([]);
  const [pushInfo, setPushInfo] = useState({ subscribed: false, notifications: [], unread: 0 });
  const [showPushTooltip, setShowPushTooltip] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();

  // Auto-trigger snow on first visit
  useEffect(() => {
    const id = Date.now();
    setSnowBatches([id]);
    const timer = setTimeout(() => setSnowBatches(prev => prev.filter(b => b !== id)), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Check push subscription status and fetch notifications
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
    let cancelled = false;
    (async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (cancelled) return;
        if (sub) {
          // Fetch recent notifications
          const res = await fetch('/api/push/notifications');
          if (res.ok) {
            const { notifications } = await res.json();
            const lastSeen = parseInt(localStorage.getItem('push_last_seen') || '0', 10);
            const unread = notifications.filter(n => n.id > lastSeen).length;
            if (!cancelled) setPushInfo({ subscribed: true, notifications, unread });
          } else {
            if (!cancelled) setPushInfo(prev => ({ ...prev, subscribed: true }));
          }
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

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
    <>
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-surface-0/95 backdrop-blur-2xl shadow-elevation-2 border-b border-white/6'
        : 'bg-surface-0/80 backdrop-blur-xl border-b border-white/[0.03]'
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
            className="hidden sm:flex items-center flex-1 max-w-lg mx-8"
          >
            <div className="relative w-full group">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={listening ? '🎙️ Listening… बोला' : 'Search videos, music, stories…'}
                className={`w-full bg-surface-2/80 border rounded-xl pl-10 ${speechSupported ? 'pr-11' : 'pr-4'} py-2.5 text-sm
                           text-white placeholder-white/30 focus:outline-none focus:bg-surface-3/80 focus:ring-2 transition-all duration-200
                           ${listening ? 'border-accent-500/60 ring-2 ring-accent-500/20' : 'border-white/8 focus:border-primary-500/50 focus:ring-primary-500/15'}`}
                maxLength={200}
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={listening ? stopVoiceSearch : startVoiceSearch}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                    listening ? 'bg-accent-500 text-white animate-pulse' : 'text-white/40 hover:text-primary-300 hover:bg-white/5'
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
            {/* Snow cloud button */}
            <button
              onClick={() => {
                const id = Date.now();
                setSnowBatches(prev => [...prev, id]);
                setTimeout(() => setSnowBatches(prev => prev.filter(b => b !== id)), 8000);
              }}
              className={`p-2.5 rounded-xl transition-all ${
                snowBatches.length > 0 ? 'text-sky-300 bg-sky-500/15' : 'text-white/50 hover:text-sky-300 hover:bg-sky-500/10'
              }`}
              aria-label="Let it snow"
              title="Let it snow!"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04A7.49 7.49 0 0012 4a7.49 7.49 0 00-7.35 6.04A6 6 0 005 22h14a5 5 0 00.35-11.96z" />
              </svg>
            </button>

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
                  className={`w-40 bg-surface-2 border rounded-xl px-3 py-2 text-sm
                             text-white placeholder-white/30 focus:outline-none transition-all
                             ${listening ? 'border-accent-500/60' : 'border-white/8 focus:border-primary-500/50'}`}
                  maxLength={200}
                />
                {speechSupported && (
                  <button
                    type="button"
                    onClick={listening ? stopVoiceSearch : startVoiceSearch}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                      listening ? 'bg-accent-500 text-white animate-pulse' : 'text-white/40 hover:text-primary-300 bg-white/5 hover:bg-white/10'
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
                className="sm:hidden p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all"
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
              className="p-2.5 text-white/50 hover:text-accent-400 hover:bg-accent-500/10 rounded-xl transition-all"
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
              className="hidden sm:flex p-2.5 text-white/50 hover:text-secondary-400 hover:bg-secondary-500/10 rounded-xl transition-all"
              aria-label="Feedback"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>

            {/* Notification bell */}
            {pushInfo.subscribed && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowPushTooltip(prev => !prev);
                    if (!showPushTooltip && pushInfo.notifications.length > 0) {
                      localStorage.setItem('push_last_seen', String(pushInfo.notifications[0].id));
                      setPushInfo(prev => ({ ...prev, unread: 0 }));
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowPushTooltip(false), 200)}
                  className="relative p-2.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl transition-all"
                  aria-label="Notifications"
                  title="Recent notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {pushInfo.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold bg-accent-500 text-white rounded-full shadow-lg animate-pulse">
                      {pushInfo.unread > 9 ? '9+' : pushInfo.unread}
                    </span>
                  )}
                </button>
                {showPushTooltip && (
                  <div className="fixed right-2 left-2 sm:left-auto sm:absolute sm:right-0 top-16 sm:top-full sm:mt-2 sm:w-72 max-w-[calc(100vw-1rem)] bg-surface-2 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs text-white/90 font-medium">🔔 Notifications</p>
                    </div>
                    <div className="max-h-[60vh] sm:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                      {pushInfo.notifications.length === 0 ? (
                        <p className="px-3 py-4 text-xs text-white/40 text-center">No notifications yet</p>
                      ) : (
                        pushInfo.notifications.slice(0, 10).map((n) => (
                          <a
                            key={n.id}
                            href={n.url || '/'}
                            className="block px-3 py-2.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                          >
                            <p className="text-xs font-medium text-white/90 truncate">{n.title}</p>
                            {n.body && <p className="text-[11px] text-white/50 mt-0.5 line-clamp-2">{n.body}</p>}
                            <p className="text-[10px] text-white/30 mt-1">{new Date(n.sentAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  aria-label="User menu"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl border-2 border-primary-500/40 transition-all hover:border-primary-400"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/20 border-2 border-primary-500/40 flex items-center justify-center text-primary-300 text-sm font-semibold">
                      {user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </Menu.Button>

                <Transition
                  enter="transition duration-200 ease-out"
                  enterFrom="opacity-0 scale-95 -translate-y-1"
                  enterTo="opacity-100 scale-100 translate-y-0"
                  leave="transition duration-150 ease-in"
                  leaveFrom="opacity-100 scale-100 translate-y-0"
                  leaveTo="opacity-0 scale-95 -translate-y-1"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 bg-surface-3 rounded-2xl shadow-elevation-4 py-2 z-50 focus:outline-none border border-white/8">
                    <div className="px-4 py-3 border-b border-white/6">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/ghughuti-ai"
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
                            active ? 'text-white bg-white/5' : 'text-white/70'
                          }`}
                        >
                          <span>🤖</span> Ghughuti AI
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/favorites"
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
                            active ? 'text-white bg-white/5' : 'text-white/70'
                          }`}
                        >
                          <span>❤️</span> Favorites
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/feedback"
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
                            active ? 'text-white bg-white/5' : 'text-white/70'
                          }`}
                        >
                          <span>💬</span> Feedback
                        </Link>
                      )}
                    </Menu.Item>
                    <div className="border-t border-white/6 mt-1 pt-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={signOut}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
                              active ? 'text-accent-300 bg-accent-500/10' : 'text-accent-400'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            साइन आउट
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-300 hover:text-white bg-primary-500/10 hover:bg-primary-500/20 rounded-xl border border-primary-500/20 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Tab bar — scrollable, with animated indicator */}
        <div className="hidden sm:flex items-center gap-0.5 pb-2.5 -mx-1 overflow-x-auto scroll-row">
          {TABS.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium whitespace-nowrap rounded-xl transition-all duration-250
                ${isActive(tab.path)
                  ? 'text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
            >
              {isActive(tab.path) && (
                <motion.div
                  layoutId="navTabIndicator"
                  className="absolute inset-0 bg-primary-500/12 border border-primary-500/25 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative text-sm">{tab.emoji}</span>
              <span className="relative">{tab.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mic error toast */}
      <AnimatePresence>
      {micError && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-accent-500/90 text-white text-xs font-medium rounded-xl shadow-elevation-3 backdrop-blur-sm z-50 whitespace-nowrap"
        >
          ⚠️ {micError}
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
    {snowBatches.map(id => <SnowEffect key={id} active={true} />)}
    </>
  );
}
