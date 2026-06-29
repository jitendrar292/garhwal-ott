// StreakBadge — small inline pill showing the user's consecutive-day streak.
// Pops a one-shot celebration animation on the day the streak increases.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyStreak } from '../hooks/useDailyStreak';

export default function StreakBadge() {
  const { streak, longest, justIncreased } = useDailyStreak();
  const [celebrating, setCelebrating] = useState(false);

  // Show a "+1" pulse the first time the user opens the app on a new day.
  useEffect(() => {
    if (!justIncreased || streak < 2) return;
    setCelebrating(true);
    const t = setTimeout(() => setCelebrating(false), 2400);
    return () => clearTimeout(t);
  }, [justIncreased, streak]);

  if (!streak) return null;

  const label = streak === 1
    ? 'आज से शुरुआत · Day 1'
    : `${streak} दिन की लगातार यात्रा`;
  const title = longest > streak
    ? `Current streak ${streak} · Best ${longest}`
    : `Current streak ${streak}`;

  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold" title={title}>
      <span aria-hidden="true">🔥</span>
      <span>{label}</span>
      <AnimatePresence>
        {celebrating && (
          <motion.span
            key="bump"
            initial={{ opacity: 0, y: 6, scale: 0.6 }}
            animate={{ opacity: 1, y: -14, scale: 1 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute -top-2 right-2 text-amber-300 text-[11px] font-bold pointer-events-none"
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
