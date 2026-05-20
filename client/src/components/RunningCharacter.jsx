// RunningCharacter — a Pahadi art character that periodically runs across
// the bottom of the screen. Clicks show a Garhwali speech bubble.
// Only uses khelo.png + fun.png (portrait-style images excluded).

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARACTERS = [
  { src: '/art/khelo.png', alt: 'Pahadi Khelo character' },
  { src: '/art/fun.png',   alt: 'Pahadi Fun character'  },
];

const PHRASES = [
  'खेलो पहाड़ी! 🏔️',
  'भाग रौ छूं! 🏃',
  'जय उत्तराखंड! 🙌',
  'हँसते रौ! 😄',
  'पहाड़ म जीण बड़ी बात च!',
  'अरे भुला, छोड़ ना! 😂',
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
  const [bubble, setBubble]         = useState(null); // phrase string or null
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
    setBubble(null);
    if (runCount.current < MAX_RUNS) {
      scheduleRun(randomInterval());
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    setBubble(phrase);
    setTimeout(() => setBubble(null), 2200);
  };

  const startX  = direction === 1 ? -(CHAR_SIZE + 20) : window.innerWidth + CHAR_SIZE + 20;
  const endX    = direction === 1 ? window.innerWidth + CHAR_SIZE + 20 : -(CHAR_SIZE + 20);
  const flipX   = direction === -1 ? -1 : 1;

  return (
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
          aria-label="Running Pahadi character — click for a surprise!"
        >
          {/* Speech bubble */}
          <AnimatePresence>
            {bubble && (
              <motion.div
                key="bubble"
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                           bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full
                           shadow-lg border border-gray-200 pointer-events-none"
                initial={{ opacity: 0, y: 6, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {bubble}
                {/* tiny tail */}
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-1.5
                                 bg-white border-b border-r border-gray-200"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Character with bob + flip */}
          <motion.div
            style={{ scaleX: flipX }}
            animate={{ y: [0, -10, 0, -7, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="rounded-full bg-white shadow-lg overflow-hidden border-2 border-orange-300/60"
              style={{ width: CHAR_SIZE, height: CHAR_SIZE }}
            >
              <img
                src={CHARACTERS[charIdx].src}
                alt={CHARACTERS[charIdx].alt}
                className="w-full h-full object-contain p-1"
                draggable={false}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
