import { useState, useEffect, useRef, useCallback } from 'react';
import { useMusic } from '../context/MusicContext';

/* ── helpers ────────────────────────────────────────── */
const fmt = (s) => {
  if (!s || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

/* ── YouTube IFrame API loader (runs once globally) ── */
let ytApiPromise = null;
function loadYTApi() {
  if (ytApiPromise) return ytApiPromise;
  if (window.YT && window.YT.Player) return Promise.resolve();
  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev();
      resolve();
    };
  });
  return ytApiPromise;
}

/* ── component ──────────────────────────────────────── */
export default function FloatingPlayer() {
  const { currentTrack, nextTrack, prevTrack, stop, playlist, currentIndex } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const playerRef = useRef(null);
  const skipTimer = useRef(null);
  const pollTimer = useRef(null);
  const wakeLockRef = useRef(null);
  const endedFiredRef = useRef(false);

  // Refs so YT callbacks always see latest values
  const repeatRef = useRef(repeat);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);
  const nextTrackRef = useRef(nextTrack);
  useEffect(() => { nextTrackRef.current = nextTrack; }, [nextTrack]);
  const prevTrackRef = useRef(prevTrack);
  useEffect(() => { prevTrackRef.current = prevTrack; }, [prevTrack]);

  /* ── Wake Lock: keep screen on while playing so audio doesn't suspend ── */
  const acquireWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener?.('release', () => {
          wakeLockRef.current = null;
        });
      }
    } catch { /* user denied or unsupported */ }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try { await wakeLockRef.current?.release?.(); } catch {}
    wakeLockRef.current = null;
  }, []);

  // Re-acquire wake lock if page becomes visible again while playing
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && isPlaying && !wakeLockRef.current) {
        acquireWakeLock();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [isPlaying, acquireWakeLock]);

  /* ── Media Session API: lock-screen controls + metadata ── */
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.channelTitle || 'PahadiTube',
        album: 'PahadiTube Music',
        artwork: [
          { src: currentTrack.thumbnail, sizes: '480x360', type: 'image/jpeg' },
          { src: `https://i.ytimg.com/vi/${currentTrack.id}/hqdefault.jpg`, sizes: '480x360', type: 'image/jpeg' },
          { src: `https://i.ytimg.com/vi/${currentTrack.id}/maxresdefault.jpg`, sizes: '1280x720', type: 'image/jpeg' },
        ],
      });
    } catch {}

    const setHandler = (action, fn) => {
      try { navigator.mediaSession.setActionHandler(action, fn); } catch {}
    };
    setHandler('play', () => { playerRef.current?.playVideo?.(); });
    setHandler('pause', () => { playerRef.current?.pauseVideo?.(); });
    setHandler('previoustrack', () => prevTrackRef.current?.());
    setHandler('nexttrack', () => nextTrackRef.current?.());
    setHandler('seekto', (details) => {
      if (details.seekTime != null) playerRef.current?.seekTo?.(details.seekTime, true);
    });
  }, [currentTrack?.id]);

  // Update playback state for the OS
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
    if (isPlaying) acquireWakeLock(); else releaseWakeLock();
  }, [isPlaying, acquireWakeLock, releaseWakeLock]);

  // Update position state continuously
  useEffect(() => {
    if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return;
    if (duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration,
          position: Math.min(currentTime, duration),
          playbackRate: 1,
        });
      } catch {}
    }
  }, [currentTime, duration]);

  /* ── create YT player ONCE; reuse it across track changes ──
     Recreating the iframe on every track breaks autoplay on iOS PWA
     (loss of user-gesture context). Instead we keep one player alive
     and call loadVideoById() to switch tracks. ── */
  const playlistLenRef = useRef(playlist.length);
  useEffect(() => { playlistLenRef.current = playlist.length; }, [playlist.length]);

  useEffect(() => {
    if (!currentTrack) return;

    setEmbedError(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    endedFiredRef.current = false;
    clearTimeout(skipTimer.current);

    // If a player already exists, just swap the video — keeps iOS gesture context
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById(currentTrack.id);
        playerRef.current.unMute?.();
        playerRef.current.setVolume?.(100);
        playerRef.current.playVideo?.();
      } catch {}
      return;
    }

    setIsReady(false);
    let destroyed = false;

    loadYTApi().then(() => {
      if (destroyed) return;
      if (playerRef.current) return; // another effect already built it

      const host = document.getElementById('yt-audio-host');
      if (!host) return;
      host.innerHTML = '';
      const div = document.createElement('div');
      host.appendChild(div);

      const player = new window.YT.Player(div, {
        videoId: currentTrack.id,
        width: '1',
        height: '1',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady(e) {
            if (destroyed) return;
            setIsReady(true);
            try {
              e.target.unMute();
              e.target.setVolume(100);
              e.target.playVideo();
            } catch {}
            const d = e.target.getDuration();
            if (d > 0) setDuration(d);
          },
          onStateChange(e) {
            if (destroyed) return;
            const s = e.data;
            if (s === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              endedFiredRef.current = false;
              const d = e.target.getDuration();
              if (d > 0) setDuration(d);
            }
            if (s === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (s === window.YT.PlayerState.ENDED) {
              if (endedFiredRef.current) return;
              endedFiredRef.current = true;
              if (repeatRef.current) {
                endedFiredRef.current = false;
                try { e.target.seekTo(0); e.target.playVideo(); } catch {}
              } else {
                nextTrackRef.current?.();
              }
            }
          },
          onError() {
            if (destroyed) return;
            setEmbedError(true);
            setIsPlaying(false);
            if (playlistLenRef.current > 1) {
              skipTimer.current = setTimeout(() => nextTrackRef.current?.(), 2500);
            }
          },
        },
      });

      playerRef.current = player;
    });

    return () => {
      destroyed = true;
      clearTimeout(skipTimer.current);
      // Note: we intentionally do NOT destroy the player here — it must
      // persist across track changes for iOS autoplay to keep working.
    };
  }, [currentTrack?.id]);

  /* ── tear down the player only when music is fully stopped ── */
  useEffect(() => {
    if (currentTrack) return;
    clearInterval(pollTimer.current);
    try { playerRef.current?.destroy(); } catch {}
    playerRef.current = null;
    setIsReady(false);
    setIsPlaying(false);
  }, [currentTrack]);

  /* ── poll current time while playing ── */
  useEffect(() => {
    clearInterval(pollTimer.current);
    if (!isPlaying) return;
    pollTimer.current = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      const t = p.getCurrentTime();
      const d = p.getDuration();
      setCurrentTime(t);
      if (d > 0) setDuration(d);
      // Fallback: some browsers/videos never fire YT's ENDED event reliably.
      // If we're at (or past) the end of the track, advance manually.
      if (d > 0 && t >= d - 0.4 && !endedFiredRef.current) {
        endedFiredRef.current = true;
        if (repeatRef.current) {
          endedFiredRef.current = false;
          try { p.seekTo(0); p.playVideo(); } catch {}
        } else {
          try { nextTrackRef.current?.(); } catch {}
        }
      }
    }, 400);
    return () => clearInterval(pollTimer.current);
  }, [isPlaying]);

  /* ── controls ── */
  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      p.unMute();
      p.setVolume(100);
      if (isPlaying) { p.pauseVideo(); } else { p.playVideo(); }
    } catch {}
  }, [isPlaying]);

  const handleSeek = useCallback((e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = ratio * duration;
    setCurrentTime(t);
    playerRef.current?.seekTo(t, true);
  }, [duration]);

  if (!currentTrack) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${currentTrack.id}`;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* ── Invisible YT Player host (audio only) ── */}
      <div
        id="yt-audio-host"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* ═══════ FULL-SCREEN PLAYER (JioSaavn style) ═══════ */}
      {expanded && (
        <div className="fixed inset-0 z-[60] bg-dark-950 flex flex-col select-none overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover scale-150 blur-[80px] opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-dark-950/60 to-dark-950" />
          </div>

          <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
            <button onClick={() => setExpanded(false)} className="p-2 -ml-2 text-white/60 hover:text-white active:scale-90 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Now Playing</p>
              <p className="text-[11px] text-white/50 mt-0.5">{currentIndex + 1} of {playlist.length}</p>
            </div>
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="p-2 -mr-2 text-white/60 hover:text-white transition-colors" title="Open on YouTube">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center px-10 sm:px-16">
            <div className="relative">
              {isPlaying && (
                <div className="absolute -inset-3 rounded-[2rem] bg-primary-500/20 blur-xl animate-pulse" />
              )}
              <div className={`relative w-72 sm:w-80 aspect-square rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ${
                isPlaying ? 'scale-100' : 'scale-[0.9] opacity-70'
              }`}>
                <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" />
                {isPlaying && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-[3px] bg-black/50 px-3 py-1.5 rounded-full">
                    {[0, 0.15, 0.3, 0.1, 0.25].map((d, i) => (
                      <span key={i} className="w-[3px] bg-primary-400 rounded-full" style={{ animation: `musicBar 0.55s ease-in-out ${d}s infinite alternate`, height: `${6 + (i % 3) * 5}px` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10 px-7 sm:px-10 pb-8 sm:pb-10">
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2">{currentTrack.title}</h2>
              <p className="text-sm text-white/45 mt-1 truncate">{currentTrack.channelTitle}</p>
            </div>

            <div className="mb-6">
              <div onClick={handleSeek} className="group relative h-[5px] bg-white/10 rounded-full cursor-pointer transition-all hover:h-[7px]">
                <div className="absolute inset-y-0 left-0 bg-primary-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 8px)` }} />
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-white/30 font-mono tabular-nums">
                <span>{fmt(currentTime)}</span>
                <span>{duration > 0 ? fmt(duration) : '--:--'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between max-w-xs mx-auto">
              <button onClick={() => setShuffle((s) => !s)} className={`p-2 transition-colors ${shuffle ? 'text-primary-400' : 'text-white/25 hover:text-white/50'}`} aria-label="Shuffle">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
              </button>
              <button onClick={prevTrack} className="p-2 text-white/70 hover:text-white active:scale-90 transition-all" aria-label="Previous">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button onClick={togglePlay} disabled={!isReady} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {!isReady
                  ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : isPlaying
                    ? <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    : <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                }
              </button>
              <button onClick={nextTrack} className="p-2 text-white/70 hover:text-white active:scale-90 transition-all" aria-label="Next">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
              <button onClick={() => setRepeat((r) => !r)} className={`p-2 transition-colors ${repeat ? 'text-primary-400' : 'text-white/25 hover:text-white/50'}`} aria-label="Repeat">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
              </button>
            </div>

            {embedError && (
              <p className="text-[11px] text-yellow-400/60 text-center mt-4">
                {playlist.length > 1 ? "Skipping \u2014 this track can't be embedded..." : "This track can't play here"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ═══════ MINI PLAYER BAR ═══════ */}
      {!expanded && (
        <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-50">
          {duration > 0 && (
            <div className="h-[2px] bg-white/5">
              <div className="h-full bg-primary-500 transition-[width] duration-500 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          )}
          <div className="bg-dark-900/95 backdrop-blur-2xl border-t border-white/[0.06] px-3 py-2.5 flex items-center gap-3">
            <button onClick={() => setExpanded(true)} className="shrink-0 relative group">
              <img src={currentTrack.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover" />
              {isPlaying && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/40">
                  <div className="flex items-end gap-[2px] h-3">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <span key={i} className="w-[2px] bg-white rounded-full" style={{ animation: `musicBar 0.5s ease-in-out ${d}s infinite alternate`, height: `${5 + i * 3}px` }} />
                    ))}
                  </div>
                </div>
              )}
            </button>
            <button onClick={() => setExpanded(true)} className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-semibold text-white truncate">{currentTrack.title}</p>
              <p className="text-[11px] text-white/40 truncate">{currentTrack.channelTitle}</p>
            </button>
            <div className="flex items-center gap-0.5 shrink-0">
              <button onClick={togglePlay} disabled={!isReady} className="p-2.5 bg-white rounded-full text-black hover:scale-105 active:scale-95 transition-transform disabled:opacity-50" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {!isReady
                  ? <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : isPlaying
                    ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                }
              </button>
              <button onClick={nextTrack} className="p-2 text-white/50 hover:text-white transition-colors" aria-label="Next">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
              <button onClick={stop} className="p-2 text-white/40 hover:text-white transition-colors" aria-label="Close">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
