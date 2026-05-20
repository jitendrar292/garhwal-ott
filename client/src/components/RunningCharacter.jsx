// RunningCharacter — a Pahadi art character that periodically runs across
// the bottom of the screen. Click navigates to the art gallery page.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CHARACTERS = [
  { src: '/art/run-char.png' },
  { src: '/art/pahadi-naari.png' },
];

const FIRST_RUN_MS   = 5_000;
const MIN_INTERVAL   = 90_000;
const MAX_INTERVAL   = 130_000;
const MAX_RUNS       = 6;
const RUN_DURATION   = 9;   // seconds to cross screen
const CHAR_SIZE      = 90;  // px height
const SESSION_KEY    = 'pahadi_runner_count';

function randomInterval() {
  return MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
}

export default function RunningCharacter() {
  const navigate = useNavigate();
  const [running, setRunning]       = useState(false);
  const [direction, setDirection]   = useState(1);
  const [charIdx, setCharIdx]       = useState(0);
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
    navigate('/art-gallery');
  };

  const startX  = direction === 1 ? -(CHAR_SIZE + 20) : window.innerWidth + CHAR_SIZE + 20;
  const endX    = direction === 1 ? window.innerWidth + CHAR_SIZE + 20 : -(CHAR_SIZE + 20);
  const flipX   = direction === -1 ? -1 : 1;

  return (
    <AnimatePresence>
      {running && (
        <motion.div
          key={`run-${runCount.current}`}
          className="fixed z-[999] bottom-20 sm:bottom-6 cursor-pointer select-none flex items-end gap-3"
          style={{ x: startX }}
          animate={{ x: endX }}
          transition={{ duration: RUN_DURATION, ease: 'linear' }}
          onAnimationComplete={handleRunComplete}
          onClick={handleClick}
          aria-label="Running Pahadi characters — click to open gallery!"
        >
          {CHARACTERS.map((char, i) => (
            <motion.div
              key={char.src}
              style={{ scaleX: flipX }}
              animate={{ y: [0, -10, 0, -7, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
            >
              <img
                src={char.src}
                alt=""
                className="object-contain drop-shadow-xl"
                style={{ height: CHAR_SIZE, width: 'auto', maxWidth: CHAR_SIZE * 1.5 }}
                draggable={false}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
