import { createContext, useContext, useState, useCallback } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = playlist[currentIndex] || null;

  const playTrack = useCallback((track, list = []) => {
    if (list.length > 0) {
      setPlaylist(list);
      const idx = list.findIndex((t) => t.id === track.id);
      setCurrentIndex(idx >= 0 ? idx : 0);
    }
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  const prevTrack = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setPlaylist([]);
    setCurrentIndex(0);
  }, []);

  return (
    <MusicContext.Provider
      value={{ currentTrack, playlist, currentIndex, isPlaying, playTrack, togglePlay, nextTrack, prevTrack, stop }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
