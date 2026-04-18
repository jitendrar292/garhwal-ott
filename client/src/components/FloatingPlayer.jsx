import { useState, useCallback } from 'react';
import { useMusic } from '../context/MusicContext';

export default function FloatingPlayer() {
  const { currentTrack, nextTrack, prevTrack, stop } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  // Reset error state whenever the track changes
  const handleIframeLoad = useCallback(() => setEmbedError(false), []);

  // YouTube fires an error event for restricted videos (Error 153, 150, etc.)
  // We can't catch it from the iframe directly, but we detect the
  // postMessage error the YouTube player sends via window message
  const handleIframeRef = useCallback((node) => {
    if (!node) return;
    setEmbedError(false);
    const onMessage = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onError' && [150, 153, 101].includes(data?.info)) {
          setEmbedError(true);
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('message', onMessage);
    node._removeMsg = () => window.removeEventListener('message', onMessage);
    return () => node._removeMsg?.();
  }, [currentTrack?.id]);

  if (!currentTrack) return null;

  const ytUrl = `https://www.youtube-nocookie.com/embed/${currentTrack.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${currentTrack.id}`;

  return (
    <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-50">
      {/* Expanded player */}
      {expanded && (
        <div className="bg-dark-900 border-t border-white/10">
          <div className="relative w-full aspect-video max-h-[35vh] sm:max-h-[45vh] bg-black">
            {embedError ? (
              /* Embedding disabled by video owner — offer YouTube link */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90">
                <img
                  src={currentTrack.thumbnail}
                  alt=""
                  className="w-24 h-16 object-cover rounded-lg opacity-60"
                />
                <p className="text-sm text-gray-400 text-center px-4">
                  This video can't be played here
                </p>
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.47 12.38 12.38 0 00-8.45 3.57L5.5 9.66a12.38 12.38 0 00-2.5 7.61 4.77 4.77 0 003.76 2.47 12.38 12.38 0 008.45-3.57l1.87-1.86a12.38 12.38 0 002.5-7.62zm-7.42 7.12L10.11 12l2.06-1.81L14.23 12z"/>
                  </svg>
                  Watch on YouTube
                </a>
                <button
                  onClick={nextTrack}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Skip to next →
                </button>
              </div>
            ) : (
              <iframe
                key={currentTrack.id}
                ref={handleIframeRef}
                src={ytUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Now playing"
                onLoad={handleIframeLoad}
                style={{ border: 'none' }}
              />
            )}
          </div>
        </div>
      )}

      {/* Compact bottom bar */}
      <div className="bg-dark-800/95 backdrop-blur-lg border-t border-white/10 px-3 py-2 flex items-center gap-3">
        {/* Thumbnail */}
        <button onClick={() => { setExpanded(!expanded); setEmbedError(false); }} className="shrink-0">
          <img src={currentTrack.thumbnail} alt="" className="w-11 h-11 rounded-lg object-cover" />
        </button>

        {/* Track info */}
        <button onClick={() => { setExpanded(!expanded); setEmbedError(false); }} className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
          <p className="text-xs text-gray-400 truncate">{currentTrack.channelTitle}</p>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={prevTrack} className="p-1.5 text-gray-400 hover:text-white transition-colors" aria-label="Previous">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {embedError ? (
            /* Show YouTube external link button when embed is broken */
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-red-600 rounded-full text-white hover:bg-red-500 transition-colors"
              aria-label="Watch on YouTube"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </a>
          ) : (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 bg-primary-500 rounded-full text-white hover:bg-primary-400 transition-colors"
              aria-label={expanded ? 'Collapse' : 'Play'}
            >
              {expanded ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}

          <button onClick={nextTrack} className="p-1.5 text-gray-400 hover:text-white transition-colors" aria-label="Next">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
          <button onClick={stop} className="p-1.5 text-gray-400 hover:text-white transition-colors" aria-label="Close">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
