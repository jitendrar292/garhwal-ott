// RunningCharacter — a Pahadi art character that periodically runs across
// the bottom of the screen. Click opens a gallery of all art characters.

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARACTERS = [
  { src: '/art/khelo.png', alt: 'Pahadi Khelo character' },
  { src: '/art/fun.png',   alt: 'Pahadi Fun character'  },
];

const GALLERY = [
  { src: '/art/khelo.png',               label: 'खेलो पहाड़ी 🏃' },
  { src: '/art/fun.png',                 label: 'हँसी-ठट्ठा 😄' },
  { src: '/art/diwali.png',              label: 'दिवाळी 🪔' },
  { src: '/art/narendra-singh-negi.png', label: 'गढ़ गौरव — नरेन्द्र सिंह नेगी 🎶' },
];

const FIRST_RUN_MS   = 8_000;
const MIN_INTERVAL   = 90_000;
const MAX_INTERVAL   = 130_000;
const MAX_RUNS       = 6;
const RUN_DURATION   = 5;   // seconds to cross screen
const CHAR_SIZE      = 90;  // px height
const SESSION_KEY    = 'pahadi_runner_count';

function randomInterval() {
  return MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
}

export default function RunningCharacter() {
  const [running, setRunning]       = useState(false);
  const [direction, setDirection]   = useState(1);   // 1 = left→right, -1 = right→left
  const [charIdx, setCharIdx]       = useState(0);
  const [gallery, setGallery]       = useState(false);
  const runCount = useRef(parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10));
  const timerRef = useRef(null);

  const scheduleRun = (delay) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (runCount.current >= MAX_RUNS) return;
      runCount.current += 1;
      sessionStorage.setItem(SESSION_KEY, String(runCount.current));
      setCharIdx((i) => (i + 1) % CHARACTERS.length);
      setDirection((d) => (runCount.current % 2 === 0 ? 1 : -1));
      setRunning(true);
    }, delay);
  };

  useEffect(() => {
    if (runCount.current < MAX_RUNS) {
      scheduleRun(FIRST_RUN_MS);
    }
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleRunComplete = () => {
    setRunning(false);
    if (runCount.current < MAX_RUNS) {
      scheduleRun(randomInterval());
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setGallery(true);
  };

  const startX  = direction === 1 ? -(CHAR_SIZE + 20) : window.innerWidth + CHAR_SIZE + 20;
  const endX    = direction === 1 ? window.innerWidth + CHAR_SIZE + 20 : -(CHAR_SIZE + 20);
  const flipX   = direction === -1 ? -1 : 1;

  return (
    <>
      {/* Gallery Modal */}
      <AnimatePresence>
        {gallery && (
          <motion.div
            key="gallery-overlay"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGallery(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-5"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">🎨 पहाड़ी कला Gallery</h2>
                <button
                  onClick={() => setGallery(false)}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {GALLERY.map((item) => (
                  <div key={item.src} className="flex flex-col items-center gap-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-2 w-full aspect-square flex items-center justify-center">
                      <img
                        src={item.src}
                        alt={item.label}
                        className="max-h-full max-w-full object-contain"
                        draggable={false}
                      />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Running character */}
      <AnimatePresence>
        {running && (
          <motion.div
            key={`run-${runCount.current}`}
            className="fixed z-[999] bottom-20 sm:bottom-6 cursor-pointer select-none"
            style={{ x: startX }}
            animate={{ x: endX }}
            transition={{ duration: RUN_DURATION, ease: 'linear' }}
            onAnimationComplete={handleRunComplete}
            onClick={handleClick}
            aria-label="Running Pahadi character — click to open gallery!"
          >
            {/* Character with bob + flip */}
            <motion.div
              style={{ scaleX: flipX }}
              animate={{ y: [0, -10, 0, -7, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src={CHARACTERS[charIdx].src}
                alt=""
                className="object-contain drop-shadow-xl"
                style={{ height: CHAR_SIZE, width: 'auto', maxWidth: CHAR_SIZE * 1.5 }}
                draggable={false}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
