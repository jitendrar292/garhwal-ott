// useDailyStreak — counts consecutive days the user has opened the app.
// Pure client-side (localStorage). One read on mount; one write per day.
//
// Rules:
//   - First visit ever: streak = 1, longest = 1.
//   - Same calendar day as last visit: streak unchanged.
//   - Exactly the next calendar day: streak += 1, longest = max(longest, streak).
//   - Otherwise (gap > 1 day): streak resets to 1.

import { useEffect, useState } from 'react';

const KEY = 'pahaditube_streak';

function ymd(date) {
  // Local date (not UTC) so "next day" matches the user's wall clock.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysBetween(prevYmd, currYmd) {
  const a = new Date(`${prevYmd}T00:00:00`);
  const b = new Date(`${currYmd}T00:00:00`);
  return Math.round((b - a) / 86400000);
}

function load() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return null;
    return obj;
  } catch {
    return null;
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function useDailyStreak() {
  // Empty initial state — actual value resolved in the effect below so SSR /
  // first-paint never blocks on localStorage.
  const [state, setState] = useState({ streak: 0, longest: 0, last: '', justIncreased: false });

  useEffect(() => {
    const today = ymd(new Date());
    const prev = load();

    if (!prev || !prev.last) {
      const next = { streak: 1, longest: 1, last: today, justIncreased: true };
      save({ streak: 1, longest: 1, last: today });
      setState(next);
      return;
    }

    if (prev.last === today) {
      setState({ ...prev, justIncreased: false });
      return;
    }

    const gap = daysBetween(prev.last, today);
    if (gap === 1) {
      const streak = (prev.streak || 0) + 1;
      const longest = Math.max(prev.longest || 0, streak);
      const next = { streak, longest, last: today };
      save(next);
      setState({ ...next, justIncreased: true });
    } else {
      // Gap > 1 day (or clock moved backwards) → reset.
      const next = { streak: 1, longest: Math.max(prev.longest || 0, 1), last: today };
      save(next);
      setState({ ...next, justIncreased: false });
    }
  }, []);

  return state;
}
