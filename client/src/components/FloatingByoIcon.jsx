import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Prefetch the page chunk on idle so navigation is instant
const prefetchByoPage = () => import('../pages/PahadiByoPage');

export default function FloatingByoIcon() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Prefetch when browser is idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(prefetchByoPage);
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(prefetchByoPage, 3000);
      return () => clearTimeout(t);
    }
  }, []);

  // Hide on the Byo page itself
  if (pathname === '/pahadi-byo') return null;

  return (
    <motion.button
      onClick={() => navigate('/pahadi-byo')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-28 right-4 z-50 sm:bottom-8 sm:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30 flex items-center justify-center border-2 border-white/20 group"
      aria-label="पहाड़ी ब्यो — Pahadi Matrimonial"
      title="पहाड़ी ब्यो"
    >
      <span className="text-2xl">💍</span>
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-ping bg-pink-400/20 pointer-events-none" />
      {/* Label tooltip */}
      <span className="absolute -top-8 right-0 bg-dark-900/90 text-[10px] text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
        पहाड़ी ब्यो 💍
      </span>
    </motion.button>
  );
}
