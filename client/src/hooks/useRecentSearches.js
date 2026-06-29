// useRecentSearches — last 10 search queries persisted to localStorage.
// Used by the navbar search bar and SearchPage empty state so users don't
// have to retype queries every session.

import { useCallback, useEffect, useState } from 'react';

const KEY = 'pahaditube_recent_searches';
const MAX = 10;

function load() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function save(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* quota or private-mode — ignore */
  }
}

export function useRecentSearches() {
  const [recent, setRecent] = useState(load);

  // Keep multiple useRecentSearches() consumers in sync across tabs/components.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === KEY) setRecent(load());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const push = useCallback((query) => {
    const q = String(query || '').trim();
    if (!q || q.length < 2) return;
    setRecent((prev) => {
      const lower = q.toLowerCase();
      const filtered = prev.filter((s) => s.toLowerCase() !== lower);
      const next = [q, ...filtered].slice(0, MAX);
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((query) => {
    setRecent((prev) => {
      const next = prev.filter((s) => s !== query);
      save(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
    save([]);
  }, []);

  return { recent, push, remove, clear };
}

// Static trending suggestions shown next to the user's own recent searches.
// Hand-curated for the Pahadi audience — these queries return rich results
// from local content + YouTube.
export const TRENDING_SEARCHES = [
  'गढ़वाली भजन',
  'लोक नृत्य',
  'नरेंद्र सिंह नेगी',
  'जागर',
  'कुमाऊंनी गीत',
  'पहाड़ी रेसिपी',
  'चार धाम',
  'मंगल गीत',
];
