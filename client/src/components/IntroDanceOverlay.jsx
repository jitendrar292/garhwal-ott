// IntroDanceOverlay — shows a brief full-screen dance image splash when the
// home page first loads, then fades out. Only plays once per session.
// Images: local slider photos + public-domain Wikimedia folk-dance images.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_KEY = 'pahadi_dance_intro_shown';

const DANCE_SLIDES = [
  {
    src: '/slider/ramman.png',
    caption: 'रम्माण • Ramman Festival',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cholia_dance_Uttarakhand.jpg?width=800',
    caption: 'छोलिया नृत्य • Chholia Sword Dance',
  },
  {
    src: '/slider/20170516_073914.jpg',
    caption: 'देवता की डोली • Doli Procession',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Langvir_Nritya.jpg?width=800',
    caption: 'लांगविर नृत्य • Langvir Dance',
  },
];

// Show each slide for this many ms before cycling
const SLIDE_MS = 700;
// Total duration before overlay disappears
const TOTAL_MS = DANCE_SLIDES.length * SLIDE_MS + 400;

export default function IntroDanceOverlay() {
  const [visible, setVisible] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(true);

    // Cycle through slides
    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      if (idx < DANCE_SLIDES.length) {
        setSlideIdx(idx);
      } else {
        clearInterval(timer);
      }
    }, SLIDE_MS);

    // Hide overlay after all slides
    const hideTimer = setTimeout(() => setVisible(false), TOTAL_MS);

    return () => {
      clearInterval(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dance-intro"
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          onClick={() => setVisible(false)}
        >
          {/* Skip hint */}
          <p className="absolute top-4 right-5 text-white/50 text-xs select-none">
            tap to skip
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={slideIdx}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <img
                src={DANCE_SLIDES[slideIdx].src}
                alt={DANCE_SLIDES[slideIdx].caption}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Caption */}
          <motion.p
            key={`cap-${slideIdx}`}
            className="absolute bottom-10 left-0 right-0 text-center text-white text-lg font-semibold drop-shadow-lg px-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {DANCE_SLIDES[slideIdx].caption}
          </motion.p>

          {/* Progress dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {DANCE_SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === slideIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
