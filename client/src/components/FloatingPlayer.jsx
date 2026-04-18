import { useState, useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';

const isMobile = () =>
  /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export default function FloatingPlayer() {
  const { currentTrack, nextTrack, prevTrack, stop, playlist } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const iframeRef = useRef(null);
  const skipTimer = useRef(null);
  const mobile = typeof navigator !== 'undefined' && isMobile();

  // Reset on track change
  useEffect(() => {
    setEmbedError(false);
    setIsPlaying(!mobile);
    clearTimeout(skipTimer.current);
  }, [currentTrack?.id]);

  // Listen for YouTube postMessage events (desktop only)
  useEffect(() => {
    if (    if (   urn;
    const onMessage = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onStateChange') {
          const s = Number(data.info);
          if (s === 1) setIsPlaying(true);
          if (s === 2) setIsPlaying(false);
          if (s === 0) nextTrack();
        }
                                         [100,                                          [100,                           ue);                                         [100,    skipTimer.current = setTimeout(() => nextTrack(), 2000);
          }
        }
      } catch { /* ignore */ }      } catch { /* ignore */ }  ner('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(skipTimer.current);
    };
  }, [nextTrack, playlist.length, mobile]);

  const sendCmd = (func) => {
    iframeRef.current?.contentWindow?.postM    iframeRef.current?.contentWindow?.postM    iframeRefrg    iframeRef.curr);    iframeRef.current?la    iframeRef.current?.con) {
        ndow.        ndow.        ndow.        ndow.        ndow.        ndow.        nd return;
    }
    sendCmd(isPlaying ? 'pauseVideo' : 'playVideo');
    setIsPlaying((p) =    setIsPlaying((p) =    setIsPlaying((pnu    setIsPlaying((p) =    setIsPlaying((p-no    setIsPlaying((p) =  ntTrack.id}?    setI=1    setIsPlaying((p) =    setIsPlaying((p) =    setIsPlaying((pnu    setIsPlaying((p) =    setIsPlaying((p-no    setIsPlaying((p) =  ntTrack.id}?    setI=1    setIsPlaying((p) =    setIsPlaying((p) =    setIsPlaying((pnu    setIsro    sedio �   O video shown */}
      {!mobile && (
        <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div style={{ position: 'fixed', bottom: '64px          <div style={{ position: 'fixeentTrack.        <div style={{ position: 'fixed', b  s        <div style={{ positi="        <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div style={{ position: 'fixed', bottom: '64px          <div style={{ position: 'fixeent


       <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div styleed  rror       <div style={{ position: 'fixed', bottom:             <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div styleed  rror       <div style={{ position: 'fixed', bottom:             <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div styleed  rror       <div style={{ position: 'fixed', bottom:             <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div styleed  rror     1.       <d3-1.646-1.7       <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div styleed  rror       <div style={{ position: 'fixed', bottom:             <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div styleed  rror       <div style={{ position: 'fixed', bottom:             <div style={{ position: 'fixed', bottom: '64px', right: 0, width: '1p        <div styleed  rror       <div stansition-colors ml-3 shrink-0">
              YouTube →
            </a>
          </div>
        )}

        {/* Expanded — Spotify-style album art player (NO video anywhere) */}
        {expanded && (
          <div className="bg-dark-950/98 backdrop-blur-3xl border-t border-white/10">
            <div className="relative overflow-hidden">
              <img src={currentTrack.thumbnail} alt=""
                className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-20 pointer-events-none" />
              <div className="relative flex flex-col items-center gap-5 px-6 py-7">
                {/* Album art — never a video */}
                <div className={`w-56 h-42 sm:w-64 sm:h-48 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                  isPlaying ? 'scale-105 shadow-primary-500/20' : 'scale-100 opacity-80'
                }`}>
                  <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" />
                </div>

                {/* Track info */}
                <div className="text-center w-full max-w-sm">
                  <p className="font-bold text-base sm:text-lg text-white leading-tight line-clamp-2">{currentTrack.title}</p>
                  <p className="text-sm text-gray-400 mt-1 truncate">{currentTrack.channelTitle}</p>
                </div>

                {/* Playback controls */}
                <div className="flex items-center gap-6">
                  <button onClick={prevTrack} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Previous">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                  </button>

                  <button onClick={togglePlay}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                    aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying && !mobile
                      ? <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      : <svg className="w-7 h-7 text-black translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                             ton>

                                                              ext-gray-400 hover:text-white transition-colors" aria-label="Next">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                  </button>
                </div>

                {mobile && (
                  <p className="text-xs text-gray-500 text-center">
                    ▶ opens in YouTube app for playback
                  </p>
                )}

                <a href={watchUrl} target="_blank" rel="noopener noreferrer"
                  className="text-                  className="text-      ns                  className="text-                  className="text-      ns                  className="text-                  className="text-     6.                  className="text-                  className="text-      ns                  className="text-                  className="text-   >
                  className="text-             iv c                  className="text-             iv c                  className="text-             iv c                  classNak={                  className="text-             iv c                  className="text-             iv c                  className=h-11 round                  classNam                  g && !mo                  cla   <div                   className="text-             iv c           500 ro                  className="text-             iv c     iv                  clag-                 l a                  className="text-             iv c                  classon>

          <button onClick={() => setExpanded((p) => !p)} className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentTrack.channelTitle}</p>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu            <bu                 <bu            <bu            <bu            <bu            <bu            <bu   6v12zM16 6v12h2V6h-2z" /></svg>
            </button>
            <button onClick={stop} class            <button onClick={stop} class            <button onClick={stop} cose">
                          me=                          me=                          me= M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
