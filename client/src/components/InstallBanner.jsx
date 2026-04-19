import { useState, useEffect } from 'react';

// Module-level flag — survives client-side route changes within the same
// page session, but resets on full reload. We deliberately avoid localStorage
// (Redis is the only store, and a per-device dismiss flag isn't worth a
// server round-trip).
let dismissedThisSession = false;

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Don't show if already installed as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Don't show if dismissed in this page session
    if (dismissedThisSession) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);
    setVisible(true);
  }, []);

  function dismiss() {
    dismissedThisSession = true;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-80 z-50 animate-fade-in">
      <div className="bg-dark-800 border border-primary-500/40 rounded-2xl shadow-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PahadiTube" className="w-10 h-10 rounded-xl shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">PahadiTube ऐप इंस्टाल करें</p>
              <p className="text-xs text-gray-400 mt-0.5">APK नहीं — सीधे ब्राउज़र से!</p>
            </div>
          </div>
          <button onClick={dismiss} className="text-gray-500 hover:text-white mt-0.5 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3 space-y-1.5 text-xs text-gray-300">
          {isIOS ? (
            <>
              <p className="flex items-center gap-2">
                <span className="text-primary-400 font-bold">1.</span>
                Safari में नीचे <span className="bg-dark-600 px-1.5 py-0.5 rounded text-white">Share ↑</span> बटन दबाएं
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary-400 font-bold">2.</span>
                <span className="bg-dark-600 px-1.5 py-0.5 rounded text-white">"Add to Home Screen"</span> चुनें
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary-400 font-bold">3.</span>
                <span className="bg-dark-600 px-1.5 py-0.5 rounded text-white">Add</span> दबाएं — हो गया! ✅
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2">
                <span className="text-primary-400 font-bold">1.</span>
                Chrome में ऊपर <span className="bg-dark-600 px-1.5 py-0.5 rounded text-white">⋮ Menu</span> खोलें
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary-400 font-bold">2.</span>
                <span className="bg-dark-600 px-1.5 py-0.5 rounded text-white">"Add to Home Screen"</span> दबाएं
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary-400 font-bold">3.</span>
                <span className="bg-dark-600 px-1.5 py-0.5 rounded text-white">Install</span> दबाएं — हो गया! ✅
              </p>
            </>
          )}
          <p className="text-yellow-400/80 mt-2">⚠️ कोई APK फ़ाइल इंस्टाल न करें — वो हमारी नहीं है!</p>
        </div>
      </div>
    </div>
  );
}
