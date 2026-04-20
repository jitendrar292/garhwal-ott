import { useEffect, useRef } from 'react';

// Plays a short Pahadi intro sound once per browser session when the
// app/site opens. Caps playback at 5s. Honours browser autoplay policy
// by falling back to the first user interaction (tap / click / key).
//
// Drop the audio file at: client/public/sounds/intro.mp3
// (mp3, ogg or m4a all work — just match the src path below).
const SRC = '/sounds/intro.mp3';
const MAX_MS = 5000;
const SESSION_KEY = 'pahadi_intro_played';

export default function IntroSound() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const audio = new Audio(SRC);
    audio.preload = 'auto';
    audio.volume = 0.6;
    audioRef.current = audio;

    let stopTimer = null;
    let started = false;

    const stop = () => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch { /* noop */ }
      if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
      }
    };

    const play = () => {
      if (started) return;
      started = true;
      sessionStorage.setItem(SESSION_KEY, '1');
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          stopTimer = setTimeout(stop, MAX_MS);
        }).catch(() => {
          // Autoplay blocked — wait for first user interaction.
          started = false;
          sessionStorage.removeItem(SESSION_KEY);
          attachInteractionFallback();
        });
      }
    };

    const onInteract = () => {
      detachInteractionFallback();
      play();
    };

    const attachInteractionFallback = () => {
      window.addEventListener('pointerdown', onInteract, { once: true });
      window.addEventListener('keydown', onInteract, { once: true });
      window.addEventListener('touchstart', onInteract, { once: true });
    };

    const detachInteractionFallback = () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };

    // Try to autoplay first; browsers typically allow it on installed PWAs
    // and on returning visits where the user has interacted before.
    play();

    return () => {
      detachInteractionFallback();
      stop();
    };
  }, []);

  return null;
}
