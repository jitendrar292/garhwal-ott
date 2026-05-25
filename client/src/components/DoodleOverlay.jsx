// DoodleOverlay — Google Doodle-style full-screen splash.
// Fetches active doodle from /api/doodle. Shows once per session, auto-fades.
// Tap anywhere to dismiss early.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'pahadi_doodle_shown';
const DOODLE_DURATION_MS = 4000; // Show for 4 seconds

export default function DoodleOverlay() {
  const [visible, setVisible] = useState(false);
  const [doodle, setDoodle] = useState(null);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Fetch active doodle from server
    fetch('/api/doodle')
      .then((r) => r.json())
      .then((data) => {
        if (!data.doodle) return; // No active doodle
        sessionStorage.setItem(STORAGE_KEY, '1');
        setDoodle(data.doodle);
        setVisible(true);

        setTimeout(() => setVisible(false), DOODLE_DURATION_MS);
      })
      .catch(() => {}); // Silently fail — doodle is non-critical
  }, []);

  if (!doodle) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="doodle-overlay"
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={() => setVisible(false)}
        >
          {/* Skip hint */}
          <p className="absolute top-4 right-5 text-white/40 text-xs select-none">
            tap to skip
          </p>

          {/* Doodle image with entrance animation */}
          <motion.img
            src={doodle.src}
            alt={doodle.caption}
            className="max-w-[85vw] max-h-[55vh] sm:max-w-[60vw] sm:max-h-[60vh] object-contain rounded-2xl shadow-2xl shadow-primary-500/20"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 150 }}
          />

          {/* Caption */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="text-white text-lg sm:text-xl font-bold">
              {doodle.caption}
            </p>
            <p className="text-white/50 text-sm mt-1">
              {doodle.subtitle}
            </p>
          </motion.div>

          {/* Decorative dots / confetti effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  backgroundColor: ['#f43f5e', '#f59e0b', '#10b981', '#6366f1', '#ec4899'][i % 5],
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 0.8, 0.4] }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.8 }}
              />
            ))}
          </div>

          {/* PahadiTube branding */}
          <motion.p
            className="absolute bottom-6 text-white/30 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            PahadiTube Doodle
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
