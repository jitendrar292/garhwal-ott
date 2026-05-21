import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const TABS = [
  {
    name: 'Home',
    path: '/',
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    iconActive: (
      <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 11-1.06 1.06l-.22-.22V19.5a1.5 1.5 0 01-1.5 1.5h-4.75a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H5.56a1.5 1.5 0 01-1.5-1.5v-6.13l-.22.22a.75.75 0 01-1.06-1.06l8.69-8.69z" />
      </svg>
    ),
  },
  {
    name: 'Music',
    path: '/music',
    icon: (
      <img src="/icons/music.png" alt="Music" className="w-[22px] h-[22px] object-contain opacity-60" />
    ),
    iconActive: (
      <img src="/icons/music.png" alt="Music" className="w-[22px] h-[22px] object-contain" />
    ),
    featured: true,
  },
  {
    name: 'Samagri',
    path: '/pahadi-store',
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
    iconActive: (
      <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
      </svg>
    ),
  },
  {
    name: 'News',
    path: '/news',
    icon: (
      <img src="/art/samachar.png" alt="News" className="w-[22px] h-[22px] opacity-70" />
    ),
    iconActive: (
      <img src="/art/samachar.png" alt="News" className="w-[22px] h-[22px]" />
    ),
  },
  {
    name: 'Jobs',
    path: '/jobs',
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    iconActive: (
      <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3V6a.75.75 0 01-.75.75H8.25A.75.75 0 017.5 6v-.75zm3-1.5a1.5 1.5 0 00-1.5 1.5v.003h6V5.25a1.5 1.5 0 00-1.5-1.5h-3z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M2.25 9.75a3 3 0 013-3h13.5a3 3 0 013 3v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V9.75zM12 12a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75v-.01a.75.75 0 00-.75-.75H12z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Pehnawa',
    path: '/pahadi-pehnawa',
    icon: (
      <img src="/icons/pehnawa.png" alt="Pehnawa" className="w-[22px] h-[22px] object-contain opacity-60" />
    ),
    iconActive: (
      <img src="/icons/pehnawa.png" alt="Pehnawa" className="w-[22px] h-[22px] object-contain" />
    ),
  },
  {
    name: 'AI',
    path: '/ghughuti-ai',
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    iconActive: (
      <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576L2.049 12.72a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.47 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTabClick = (e, path) => {
    if (path === '/ghughuti-ai' && !isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: '/ghughuti-ai' } } });
    }
  };

  return (
    <motion.nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-0/95 backdrop-blur-2xl border-t border-white/6"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.2 }}
    >
      <div className="flex items-center justify-around h-[64px] px-1 max-w-lg mx-auto">
        {TABS.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            onClick={(e) => handleTabClick(e, tab.path)}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-250
              ${tab.featured && !isActive(tab.path) ? 'text-content-music' : ''}
              ${isActive(tab.path)
                ? 'text-primary-400'
                : tab.featured ? '' : 'text-white/40'
              }`}
          >
            {isActive(tab.path) && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute inset-0 bg-primary-500/10 border border-primary-500/20 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">
              {isActive(tab.path) ? tab.iconActive : tab.icon}
            </span>
            <span className={`relative text-[9px] font-medium ${isActive(tab.path) ? 'text-primary-400' : ''}`}>
              {tab.name}
            </span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}
