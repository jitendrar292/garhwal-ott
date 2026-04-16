import { useState } from 'react';
import { useMusic } from '../context/MusicContext';

export default function FloatingPlayer() {
  const { currentTrack, nextTrack, prevTrack, stop } = useMusic();
  const [expanded, setExpanded] = useState(false);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-50">
      {/* Expanded player with visible YouTube embed */}
      {expanded && (
        <div className="bg-dark-900 border-t border-white/10">
          <div className="relative w-full aspect-video max-h-[30vh] sm:max-h-[40vh]">
            <iframe
              key={currentTrack.id}
              src={`https://www.youtube.com/embed/${currentTrack.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title="Now playing"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      )}

      {/* Compact bottom bar */}
      <div className="bg-dark-800/95 backdrop-blur-lg border-t border-white/10 px-3 py-2 flex items-center gap-3">
        {/* Thumbnail / expand toggle */}
        <button onClick={() => setExpanded(!expanded)} className="shrink-0">
          <img
            src={currentTrack.thumbnail}
            alt=""
            className="w-11 h-11 rounded-lg object-cover"
          />
        </button>

        {/* Track info - tap to expand */}
        <button onClick={() => setExpanded(!expanded)} className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
          <p className="text-xs text-gray-400 truncate">{currentTrack.channelTitle}</p>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={prevTrack} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          {/* Play button expands to show YouTube player */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-primary-500 rounded-full text-white hover:bg-primary-400 transition-colors"
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
        </div>
      </div>
    </div>
  );
}
