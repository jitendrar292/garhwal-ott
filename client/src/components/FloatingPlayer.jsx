import { useState, useEffect, useRef, useCallback } from 'react';
import { useMusic } from '../context/MusicContext';

const isMobile = () =>
  /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const fmt = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function FloatingPlayer() {
  const { currentTrack, nextTrack, prevTrack, stop, playlist, currentIndex } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const iframeRef = useRef(null);
  const skipTimer = useRef(null);
  const mobile = typeof navigator !== 'undefined' && isMobile();

  useEffect(() => {
    setEmbedError(false);
    setIsPlaying(!mobile);
    setCurrentTime(0);
    setDuration(0);
    clearTimeout(skipTimer.current);
  }, [currentTrack?.id]);

  const sendCmd = useCallback((func, args = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }), '*'
    );
  }, []);

  useEffect(() => {
    if (mobile) return;
    const onMsg = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onStateChange') {
          const s = Number(data.info);
          if (s === 1) setIsPlaying(true);
          if (s === 2) setIsPlaying(false);
          if (s === 0) {
            if (repeat) {
              sendCmd('seekTo', [0, true]);
              sendCmd('playVideo');
            } else {
              nextTrack();
            }
          }
        }
        if (data?.event === 'onError' && [100, 101, 150, 153].includes(Number(data?.info))) {
          setEmbedError(true);
          if (playlist.length > 1) {
            skipTimer.current = setTimeout(() => nextTrack(), 2000);
          }
        }
        if (data?.event === 'infoDelivery') {
          if (typeof data.info?.currentTime === 'number') setCurrentTime(data.info.currentTime);
          if (typeof data.info?.duration === 'number' && data.info.duration > 0) setDuration(data.info.duration);
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('message', onMsg);
    return () => {
      window.removeEventListener('message', onMsg);
      clearTimeout(skipTimer.current);
    };
  }, [nextTrack, playlist.length, mobile, repeat, sendCmd]);

  const togglePlay = () => {
    if (mobile) {
      window.open(`https://www.youtube.com/watch?v=${currentTrack.id}`, '_blank');
      return;
    }
    sendCmd(isPlaying ? 'pauseVideo' : 'playVideo');
    setIsPlaying((p) => !p);
  };

  const handleSeek = (e) => {
    if (!duration || mobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = ratio * duration;
    setCurrentTime(t);
    sendCmd('seekTo', [t, true]);
  };

  if (!currentTrack) return null;

  const ytUrl = `https://www.youtube-nocookie.com/embed/${currentTrack.id}?autoplay=1&rel=0&enablejsapi=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`;
  const watchUrl = `https://www.youtube.com/watch?v=${currentTrack.id}`;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Audio-only: completely invisible iframe (screen-reader-hidden, clipped off-screen) */}
      {!mobile && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          <iframe
            key={currentTrack.id}
            ref={iframeRef}
            src={ytUrl}
            allow="autoplay; encrypted-media"
            title="audio"
            width="1"
            height="1"
            tabIndex={-1}
            style={{ border: 'none', opacity: 0 }}
          />
        </div>
      )}

      {/* ===== FULL-SCREEN MUSIC PLAYER (expanded) ===== */}
      {expanded && (
        <div className="fixed inset-0 z-[60] bg-dark-950 flex flex-col select-none">
          {/* Blurred album-art background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover scale-150 blur-[80px] opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 via-dark-950/70 to-dark-950" />
          </div>

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-2 safe-top">
            <button onClick={() => setExpanded(false)} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Now Playing</p>
              <p className="text-[11px] text-white/50 mt-0.5">{currentIndex + 1} / {playlist.length}</p>
            </div>
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="p-2 -mr-2 text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          {/* Album art — large centered square with glow */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-12 sm:px-20">
            <div className={`w-full max-w-[280px] sm:max-w-[340px] aspect-square rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ${
              isPlaying ? 'shadow-primary-500/20 scale-100' : 'shadow-black/50 scale-[0.92] opacity-75'
            }`}>
              <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" />
              {isPlaying && !mobile && (
                <div className="absolute bottom-4 right-4 flex items-end gap-[3px]">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <span key={i} className="w-[3px] bg-white/70 rounded-full" style={{ animation: `musicBar 0.6s ease-in-out ${d}s infinite alternate`, height: `${10 + i * 5}px` }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom section: info + progress + controls */}
          <div className="relative z-10 px-7 sm:px-10 pb-10 safe-bottom">
            {/* Track info */}
            <div className="mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2">{currentTrack.title}</h2>
              <p className="text-sm text-white/50 mt-1 truncate">{currentTrack.channelTitle}</p>
            </div>

            {/* Progress bar */}
            {!mobile && (
              <div className="mb-5">
                <div onClick={handleSeek} className="group relative h-1 bg-white/10 rounded-full cursor-pointer hover:h-2 transition-all">
                  <div className="absolute inset-y-0 left-0 bg-white rounded-full" style={{ width: `${progress}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 8px)` }} />
                </div>
                <div className="flex justify-between mt-1.5 text-[11px] text-white/35 font-mono">
                  <span>{fmt(currentTime)}</span>
                  <span>{duration > 0 ? fmt(duration) : '--:--'}</span>
                </div>
              </div>
            )}

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-8">
              <button onClick={() => setShuffle((s) => !s)} className={`p-1.5 transition-colors ${shuffle ? 'text-primary-400' : 'text-white/30 hover:text-white/60'}`} aria-label="Shuffle">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
              </button>
              <button onClick={prevTrack} className="p-1 text-white/70 hover:text-white transition-colors" aria-label="Previous">
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button onClick={togglePlay} className="w-[68px] h-[68px] bg-white rounded-full flex items-center justify-center shadow-xl shadow-white/10 hover:scale-[1.04] active:scale-95 transition-transform" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying && !mobile
                  ? <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  : <svg className="w-8 h-8 text-black translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                }
              </button>
              <button onClick={nextTrack} className="p-1 text-white/70 hover:text-white transition-colors" aria-label="Next">
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
              <button onClick={() => setRepeat((r) => !r)} className={`p-1.5 transition-colors ${repeat ? 'text-primary-400' : 'text-white/30 hover:text-white/60'}`} aria-label="Repeat">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
              </button>
            </div>

            {mobile && <p className="text-[11px] text-white/30 text-center mt-4">Tap play to open in YouTube app</p>}
            {embedError && !mobile && (
              <p className="text-[11px] text-yellow-400/70 text-center mt-3">
                {playlist.length > 1 ? "Skipping \u2014 can't embed this track" : "This track can't play here"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===== MINI PLAYER BAR ===== */}
      {!expanded && (
        <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-50">
          {!mobile && duration > 0 && (
            <div className="h-[2px] bg-white/5">
              <div className="h-full bg-primary-500 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          )}
          <div className="bg-dark-900/95 backdrop-blur-2xl border-t border-white/[0.06] px-3 py-2.5 flex items-center gap-3">
            <button onClick={() => setExpanded(true)} className="shrink-0 relative">
              <img src={currentTrack.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover" />
              {isPlaying && !mobile && (
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
              <button onClick={togglePlay} className="p-2.5 bg-white rounded-full text-black hover:scale-105 active:scale-95 transition-transform" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying && !mobile
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
