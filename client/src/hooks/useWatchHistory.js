import { useState, useCallback } from 'react';

const KEY = 'garhwali_watch_history';
const MAX = 20;

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function useWatchHistory() {
  const [history, setHistory] = useState(readHistory);

  const addToHistory = useCallback((video) => {
    if (!video?.id) return;
    setHistory((prev) => {
      const filtered = prev.filter((v) => v.id !== video.id);
      const next = [video, ...filtered].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {}
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
