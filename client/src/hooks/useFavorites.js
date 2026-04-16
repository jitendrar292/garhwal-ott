import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'garhwali_stream_favorites';

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((video) => {
    setFavorites((prev) => {
      if (prev.some((v) => v.id === video.id)) return prev;
      return [...prev, video];
    });
  }, []);

  const removeFavorite = useCallback((videoId) => {
    setFavorites((prev) => prev.filter((v) => v.id !== videoId));
  }, []);

  const isFavorite = useCallback(
    (videoId) => favorites.some((v) => v.id === videoId),
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
