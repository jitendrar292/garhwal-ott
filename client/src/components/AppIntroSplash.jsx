import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Netflix-style app-open reveal for PahadiTube. Renders a full-screen black
// overlay on first mount of the session, animates the logo + red light-beam
// sweeps, then fades out. Plays exactly once per browser session (survives
// SPA route changes; resets on tab close / hard reload). Coordinates with
// <IntroSound> which handles /sounds/intro.mp3 on the same lifecycle.
//
// Skip semantics:
// - Tap / click anywhere dismisses after a short grace window.
// - Respects prefers-reduced-motion (shows a brief static logo instead).
// - Never renders during SSR/prerender (sessionStorage guard).

const SESSION_KEY = 'pahadi_intro_splash_shown';
const TOTAL_MS = 3000;              // Full splash duration (matches Netflix ~4s TUDUM cadence but snappier)
const SKIP_GRACE_MS = 600;          // Ignore accidental early taps for this long
const REDUCED_MOTION_MS = 600;      // Very brief flash for a11y

export default function AppIntroSplash() {
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (sessionStorage.getItem(SESSION_KEY)) return undefined;

    const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prm);
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(true);

    const totalMs = prm ? REDUCED_MOTION_MS : TOTAL_MS;
    const graceTimer = window.setTimeout(() => setCanSkip(true), Math.min(SKIP_GRACE_MS, totalMs));
    const hideTimer = window.setTimeout(() => setVisible(false), totalMs);
    return () => {
      window.clearTimeout(graceTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  // Lock body scroll while the splash is on screen so background content can't
  // scroll behind the overlay (mostly matters if the initial route was deep-linked).
  useEffect(() => {
    if (!visible) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  const handleSkip = () => {
    if (!canSkip) return;
    setVisible(false);
  };

  if (reduced) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            key="intro-splash-reduced"
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onClick={handleSkip}
            aria-hidden="true"
          >
            <img src="/logo.png" alt="PahadiTube" className="h-24 w-auto" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-splash"
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          onClick={handleSkip}
          role="presentation"
          aria-hidden="true"
        >
          {/* Skip hint (fades in only after grace window ends) */}
          <motion.p
            className="absolute top-4 right-5 text-white/40 text-[10px] uppercase tracking-[0.3em] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: canSkip ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            tap to skip
          </motion.p>

          {/* ── Left → center red light beam sweep ─────────────────── */}
          <motion.div
            className="absolute top-1/2 left-0 h-[2px] w-1/2 -translate-y-1/2"
            style={{
              transformOrigin: 'right center',
              background: 'linear-gradient(to right, transparent 0%, rgba(229,9,20,0.9) 70%, #f6121d 100%)',
              boxShadow: '0 0 18px 3px rgba(229,9,20,0.55)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.9,
              times: [0, 0.35, 0.75, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* ── Right → center red light beam sweep ────────────────── */}
          <motion.div
            className="absolute top-1/2 right-0 h-[2px] w-1/2 -translate-y-1/2"
            style={{
              transformOrigin: 'left center',
              background: 'linear-gradient(to left, transparent 0%, rgba(229,9,20,0.9) 70%, #f6121d 100%)',
              boxShadow: '0 0 18px 3px rgba(229,9,20,0.55)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.9,
              times: [0, 0.35, 0.75, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* ── Radiating red glow behind the logo ─────────────────── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 560,
              height: 560,
              background:
                'radial-gradient(circle, rgba(229,9,20,0.45) 0%, rgba(229,9,20,0.18) 30%, rgba(229,9,20,0.05) 55%, transparent 75%)',
              filter: 'blur(2px)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.25, 1.05],
              opacity: [0, 1, 0.85],
            }}
            transition={{
              duration: 1.6,
              delay: 0.5,
              times: [0, 0.55, 1],
              ease: 'easeOut',
            }}
          />

          {/* ── Logo reveal ────────────────────────────────────────── */}
          <motion.img
            src="/logo.png"
            alt="PahadiTube"
            width={160}
            height={160}
            className="relative z-10 h-28 sm:h-40 w-auto"
            style={{ filter: 'drop-shadow(0 0 40px rgba(229,9,20,0.85))' }}
            initial={{ scale: 0.35, opacity: 0 }}
            animate={{
              scale: [0.35, 1.18, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 1.3,
              delay: 0.55,
              times: [0, 0.65, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* ── Wordmark + tagline ─────────────────────────────────── */}
          <motion.div
            className="absolute left-0 right-0 text-center px-6"
            style={{ top: 'calc(50% + 92px)' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.55, ease: 'easeOut' }}
          >
            <h1
              className="text-3xl sm:text-5xl font-black text-white"
              style={{ fontFamily: 'Outfit, Inter, system-ui, sans-serif', letterSpacing: '0.18em' }}
            >
              PAHADI<span className="text-primary-500">TUBE</span>
            </h1>
            <motion.p
              className="mt-3 text-[10px] sm:text-xs uppercase tracking-[0.45em] text-white/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.95, duration: 0.5 }}
            >
              A Devbhoomi Original
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
