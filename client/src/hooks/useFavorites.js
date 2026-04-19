import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchRemoteFavorites,
  pushFavoriteToServer,
  deleteFavoriteOnServer,
} from '../api/favorites';

// Redis is the only source of truth — no browser storage (localStorage /
// sessionStorage) is used. Per-IP favorites live in Upstash via /api/favorites
// (see server/src/routes/favorites.js + server/src/services/store.js).

function dedupeById(list) {
  const seen = new Set();
  const out = [];
  for (const v of list) {
    if (!v || !v.id || seen.has(v.id)) continue;
    seen.add(v.id);
    out.push(v);
  }
  return out;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const fetchedOnce = useRef(false);

  // Fetch from Redis on mount (once per hook instance).
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    (async () => {
      try {
        const remote = await fetchRemoteFavorites();
        setFavorites(dedupeById(remote));
      } catch {
        // Server unreachable — start empty; next add/remove will retry.
      }
    })();
  }, []);

  const addFavorite = useCallback((video) => {
    if (!video || !video.id) return;
    // Optimistic update — server response is the canonical list.
    setFavorites((prev) => (prev.some((v) => v.id === video.id) ? prev : [video, ...prev]));
    pushFavoriteToServer(video)
      .then((list) => { if (Array.isArray(list)) setFavorites(dedupeById(list)); })
      .catch(() => {});
  }, []);

  const removeFavorite = useCallback((videoId) => {
    setFavorites((prev) => prev.filter((v) => v.id !== videoId));
    deleteFavoriteOnServer(videoId)
      .then((list) => { if (Array.isArray(list)) setFavorites(dedupeById(list)); })
      .catch(() => {});
  }, []);

  const isFavorite = useCallback(
    (videoId) => favorites.some((v) => v.id === videoId),
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
