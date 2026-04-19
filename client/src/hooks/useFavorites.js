import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchRemoteFavorites,
  pushFavoriteToServer,
  deleteFavoriteOnServer,
  bulkReplaceFavoritesOnServer,
} from '../api/favorites';

const STORAGE_KEY = 'pahadi_tube_favorites';

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persistLocal(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch { /* storage full / disabled */ }
}

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
  // localStorage is the instant cache so the UI renders immediately on mount,
  // even before the Redis fetch resolves (or if the network is offline).
  const [favorites, setFavorites] = useState(loadFavorites);
  const syncedOnce = useRef(false);

  // Keep localStorage mirror in sync on every change
  useEffect(() => {
    persistLocal(favorites);
  }, [favorites]);

  // One-time sync with server on mount: fetch remote, merge with local,
  // and if local had entries the server didn't, push them up.
  useEffect(() => {
    if (syncedOnce.current) return;
    syncedOnce.current = true;
    (async () => {
      try {
        const remote = await fetchRemoteFavorites();
        const local = loadFavorites();
        // Merge — local entries win on conflict (newer device interactions),
        // but remote entries fill in cross-device favorites.
        const merged = dedupeById([...local, ...remote]);
        setFavorites(merged);

        // If merging changed the server view, push the merged list back so
        // the device's local additions are persisted in Redis.
        const remoteIds = new Set(remote.map((v) => v.id));
        const hasNewLocal = merged.some((v) => !remoteIds.has(v.id));
        const hasFewerRemote = remote.length !== merged.length;
        if (hasNewLocal || hasFewerRemote) {
          await bulkReplaceFavoritesOnServer(merged).catch(() => {});
        }
      } catch {
        // Server unreachable — keep local-only mode silently
      }
    })();
  }, []);

  const addFavorite = useCallback((video) => {
    setFavorites((prev) => {
      if (prev.some((v) => v.id === video.id)) return prev;
      return [video, ...prev];
    });
    // Fire-and-forget; localStorage already has it
    pushFavoriteToServer(video).catch(() => {});
  }, []);

  const removeFavorite = useCallback((videoId) => {
    setFavorites((prev) => prev.filter((v) => v.id !== videoId));
    deleteFavoriteOnServer(videoId).catch(() => {});
  }, []);

  const isFavorite = useCallback(
    (videoId) => favorites.some((v) => v.id === videoId),
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
