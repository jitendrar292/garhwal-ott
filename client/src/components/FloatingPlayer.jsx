import { useState, useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export default function FloatingPlayer() {
  const { currentTrack, nextTrack, prevTrack, stop, playlist } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [skipMsg, setSkipMsg] = useState(false);
  const iframeRef = useRef(null);
  const skipTimer = useRef(null);
  const ios = typeof navigator !== 'undefined' && isIOS();

  // Reset state on track change; auto-expand on iOS so user can tap the player
  useEffect(() => {
    setEmbedError(false);
    setSkipMsg(false);
    setIsPlaying(true);
    clearTimeout(skipTimer.current);
    if (ios) setExpanded(true);
  }, [currentTrack?.id]);

  // Listen for YouTube IFrame API postMessage events
  useEffect(() => {
    const onMessage = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onStateChange') {
          const s = Number(data.info);
          if (s === 1) setIsPlaying(true);
          if (s === 2) setIsPlaying(false);
          if (s === 0) nextTrack();
        }
        if (data?.event === 'onError' && [100, 101, 150, 153].includes(Number(data?.info))) {
          setEmbedError(true);
          setSkipMsg(true);
          if (playlist.length > 1) {
            skipTimer.current = setTimeout(() => nextTrack(), 2500);
          }
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(skipTimer.current);
    };
  }, [nextTrack, playlist.length]);

  const sendCmd = (func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }), '*'
    );
  };

  const togglePlay = () => {
    if (ios) {
      // On iOS we can't control the iframe — toggle expanded instead
      setExpanded((p) => !p);
      return;
    }
    sendCmd(isPlaying ? 'pauseVideo' : 'playVideo');
    setIsPlaying((p) => !p);
  };

  if (!currentTrack) return null;

  const ytUrl = `https://www.youtube-nocookie.com/embed/${currentTrack.id}?autoplay=1&rel=0&enablejsapi=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`;
  const watchUrl = `https://www.youtube.com/watch?v=${currentTrack.id}`;

  return (
    <>
      {/* Desktop: hidden 1×1 iframe for background audio */}
      {!ios && (
        <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1px', height: '1px', overflow: 'hidden', zIndex: -1 }}>
          <iframe
            key={currentTrack.id}
            ref={iframeRef}
            src={ytUrl}
            allow="autoplay; encrypted-media"
            title="audio"
            width="1"
            height="1"
            style={{ border: 'none' }}
          />
        </div>
      )}

      <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-50">
        {/* Auto-skip toast */}
        {skipMsg && (
          <div className="bg-yellow-500/10 border-t border-yellow-500/20 px-4 py-2 flex items-center justify-between">
            <p className="text-xs text-yellow-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {playlist.length > 1 ? 'Embedding disabled — auto-skipping…' : 'This track cannot be played here'}
            </p>
            <a href={watchUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors ml-3 shrink-0">
              YouTube →
            </a>
          </div>
        )}

        {/* Expanded player */}
        {expanded && (
          <div className="bg-dark-950/98 backdrop-blur-3xl border-t border-white/10">
            <div className="relative overflow-hidden">
              <img src={currentTrack.thumbnail} alt=""
                className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-20 pointer-events-none" />
              <div className="relative flex flex-col items-center gap-4 px-6 py-6">

                {/* iOS: show real YouTube iframe so user can tap to play */}
                {ios ? (
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      key={currentTrack.id}
                      ref={iframeRef}
                      src={ytUrl}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                      title="Now playing"
                      style={{ border: 'none' }}
                    />
                  </div>
                ) : (
                  /* Desktop: show album art — audio playing in hidden iframe */
                  <div className={`w-52 h-40 sm:w-64 sm:h-48 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isPlaying ? 'scale-105' : 'scale-100 opacity-80'}`}>
                    <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Track info */}
                <div className="text-center w-full max-w-sm">
                  <p className="font-bold text-base text-white leading-tight line-clamp-2">{currentTrack.title}</p>
                  <p className="text-sm text-gray-400 mt-1 truncate">{currentTrack.channelTitle}</p>
                </div>

                {/* Controls (desktop only — iOS uses native YouTube controls) */}
                {!ios && (
                  <div className="flex items-center gap-6">
                    <button onClick={prevTrack} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Previous">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                    </button>
                    <button onClick={togglePlay}
                      className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                      aria-label={isPlaying ? 'Pause' : 'Play'}>
                      {isPlaying
                        ? <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        : <svg className="w-7 h-7 text-black translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      }
                    </button>
                    <button onClick={nextTrack} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Next">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                    </button>
                  </div>
                )}

                {ios && (
                  <p className="text-xs text-gray-500 text-center">Tap ▶ inside the player to start audio on iPhone</p>
                )}

                <a href={watchUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" /></svg>
                  Open on YouTube
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mini bar */}
        <div className="bg-dark-800/97 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center gap-3">
          <button onClick={() => setExpanded((p) => !p)} className="shrink-0 relative">
            <img src={currentTrack.thumbnail} alt="" className="w-11 h-11 rounded-lg object-cover" />
            {isPlaying && !ios && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-dark-800">
                <div className="w-1 h-1 bg-white rounded-full animate-ping m-0.5" />
              </div>
            )}
          </button>

          <button onClick={() => setExpanded((p) => !p)} className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
            <p className="text-xs text-gray-400 truncate">{ios ? 'Tap to open player' : currentTrack.channelTitle}</p>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button onClick={togglePlay}
              className="p-2 bg-primary-500 rounded-full text-white hover:bg-primary-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying && !ios
                ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              }
            </button>
            <button onClick={nextTrack} className="p-1.5 text-gray-400 hover:text-white transition-colors" aria-label="Next">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
            </button>
            <button onClick={stop} className="p-1.5 text-gray-400 hover:text-white transition-colors" aria-label="Close">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
