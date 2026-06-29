import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchRemoteFavorites,
  pushFavoriteToServer,
  deleteFavoriteOnServer,
} from '../api/favorites';
import { useToast } from '../components/ui/Toast';

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
  const { toast } = useToast();

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
    toast.success('❤️ My List मा जोड़ दियो', 2000);
    pushFavoriteToServer(video)
      .then((list) => { if (Array.isArray(list)) setFavorites(dedupeById(list)); })
      .catch(() => {
        // Rollback optimistic update and tell the user.
        setFavorites((prev) => prev.filter((v) => v.id !== video.id));
        toast.error('Could not save — please try again', 3000);
      });
  }, [toast]);

  const removeFavorite = useCallback((videoId) => {
    const removedVideo = favorites.find((v) => v.id === videoId);
    setFavorites((prev) => prev.filter((v) => v.id !== videoId));
    toast.info('Removed from My List', 1800);
    deleteFavoriteOnServer(videoId)
      .then((list) => { if (Array.isArray(list)) setFavorites(dedupeById(list)); })
      .catch(() => {
        if (removedVideo) setFavorites((prev) => [removedVideo, ...prev]);
        toast.error('Could not remove — please try again', 3000);
      });
  }, [favorites, toast]);

  const isFavorite = useCallback(
    (videoId) => favorites.some((v) => v.id === videoId),
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
