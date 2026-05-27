import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Module-level flag — survives client-side route changes within the same
// page session, but resets on full reload.
let dismissedThisSession = false;

// Capture the beforeinstallprompt event globally so it's available when the banner mounts
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [canPrompt, setCanPrompt] = useState(!!deferredPrompt);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Don't show if dismissed in this page session
    if (dismissedThisSession) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);
    setVisible(true);

    // Listen for late-arriving beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    setCanPrompt(false);
    setInstalling(false);
    if (outcome === 'accepted') {
      dismiss();
    }
  }

  function dismiss() {
    dismissedThisSession = true;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
    <motion.div
      className="fixed bottom-[76px] sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-80 z-50"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <div className="bg-surface-2 border border-primary-500/30 rounded-2xl shadow-elevation-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PahadiTube" className="w-10 h-10 rounded-xl shrink-0" />
            <div>
              <p className="text-body-sm font-bold text-white">PahadiTube ऐप इंस्टाल करें</p>
              <p className="text-caption text-white/50 mt-0.5">APK नहीं — सीधे ब्राउज़र से!</p>
            </div>
          </div>
          <button onClick={dismiss} className="text-white/40 hover:text-white mt-0.5 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3">
          {canPrompt && !isIOS ? (
            <button
              onClick={handleInstallClick}
              disabled={installing}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-sm"
            >
              {installing ? 'Installing...' : 'Install करें — One Tap! 🚀'}
            </button>
          ) : (
            <div className="space-y-1.5 text-caption text-white/70">
              {isIOS ? (
                <>
                  <p className="flex items-center gap-2">
                    <span className="text-primary-400 font-bold">1.</span>
                    Safari में नीचे <span className="bg-surface-3 px-1.5 py-0.5 rounded text-white">Share ↑</span> बटन दबाएं
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary-400 font-bold">2.</span>
                    <span className="bg-surface-3 px-1.5 py-0.5 rounded text-white">"Add to Home Screen"</span> चुनें
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary-400 font-bold">3.</span>
                    <span className="bg-surface-3 px-1.5 py-0.5 rounded text-white">Add</span> दबाएं — हो गया! ✅
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center gap-2">
                    <span className="text-primary-400 font-bold">1.</span>
                    Chrome में ऊपर <span className="bg-surface-3 px-1.5 py-0.5 rounded text-white">⋮ Menu</span> खोलें
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary-400 font-bold">2.</span>
                    <span className="bg-surface-3 px-1.5 py-0.5 rounded text-white">"Add to Home Screen"</span> दबाएं
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary-400 font-bold">3.</span>
                    <span className="bg-surface-3 px-1.5 py-0.5 rounded text-white">Install</span> दबाएं — हो गया! ✅
                  </p>
                </>
              )}
            </div>
          )}
          <p className="text-yellow-400/80 text-caption mt-2">⚠️ कोई APK फ़ाइल इंस्टाल न करें — वो हमारी नहीं है!</p>
        </div>
      </div>
    </motion.div>
    </AnimatePresence>
  );
}
