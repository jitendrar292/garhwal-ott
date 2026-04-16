import { useState } from 'react';
import { useMusic } from '../context/MusicContext';

export default function FloatingPlayer() {
  const { currentTrack, nextTrack, prevTrack, stop } = useMusic();
  const [minimized, setMinimized] = useState(false);

  if (!currentTrack) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        minimized
          ? 'bottom-16 sm:bottom-4 right-4 w-14 h-14'
          : 'bottom-16 sm:bottom-0 left-0 right-0'
      }`}
    >
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </button>
      ) : (
        <div className="bg-dark-800/95 backdrop-blur-lg border-t border-white/10 px-3 py-2 flex items-center gap-3">
          {/* Embedded YouTube player - small visible iframe for audio */}
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-dark-900">
            <iframe
              key={currentTrack.id}
              src={`https://www.youtube.com/embed/${currentTrack.id}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              width="48"
              height="48"
              allow="autoplay; encrypted-media"
              title="Now playing"
              className="w-full h-full"
              style={{ border: 'none', pointerEvents: 'none' }}
            />
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentTrack.channelTitle}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={prevTrack} className="p-1.5 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button onClick={nextTrack} className="p-1.5 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
            <button onClick={stop} className="p-1.5 text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
            <button onClick={() => setMinimized(true)} className="p-1.5 text-gray-400 hover:text-white transition-colors sm:hidden">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
