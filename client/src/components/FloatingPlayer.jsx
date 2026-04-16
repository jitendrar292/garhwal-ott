import { useEffect, useRef, useState } from 'react';
import { useMusic } from '../context/MusicContext';

export default function FloatingPlayer() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, stop } = useMusic();
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [minimized, setMinimized] = useState(false);
  const [ready, setReady] = useState(false);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (window.YT && window.YT.Player) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }, []);

  // Create / update player when track changes
  useEffect(() => {
    if (!currentTrack) return;

    const createPlayer = () => {
      // Destroy previous player
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }

      // Recreate the target div
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div id="yt-audio-player"></div>';
      }

      playerRef.current = new window.YT.Player('yt-audio-player', {
        height: '1',
        width: '1',
        videoId: currentTrack.id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              nextTrack();
            }
          },
          onError: () => {
            // Skip to next on error
            nextTrack();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      setReady(false);
    };
  }, [currentTrack?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
  }, []);

  // Play/Pause sync
  useEffect(() => {
    if (!playerRef.current || !ready) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {
      // Player not ready yet
    }
  }, [isPlaying, ready]);

  if (!currentTrack) return null;

  return (
    <>
      {/* YouTube player - tiny but visible (not display:none) so playback works */}
      <div
        ref={containerRef}
        style={{ position: 'fixed', top: '-100px', left: '-100px', width: '1px', height: '1px', overflow: 'hidden', opacity: 0.01 }}
      >
        <div id="yt-audio-player" />
      </div>

      {/* Floating player bar */}
      <div
        className={`fixed z-50 transition-all duration-300 ${
          minimized
            ? 'bottom-16 sm:bottom-4 right-4 w-12 h-12'
            : 'bottom-16 sm:bottom-0 left-0 right-0'
        }`}
      >
        {minimized ? (
          <button
            onClick={() => setMinimized(false)}
            className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </button>
        ) : (
          <div className="bg-dark-800/95 backdrop-blur-lg border-t border-white/10 px-4 py-2.5 flex items-center gap-3">
            {/* Thumbnail */}
            <img
              src={currentTrack.thumbnail}
              alt=""
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentTrack.channelTitle}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={prevTrack} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button
                onClick={togglePlay}
                className="p-2 bg-primary-500 rounded-full text-white hover:bg-primary-400 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
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
              <button onClick={() => setMinimized(true)} className="p-1.5 text-gray-400 hover:text-white transition-colors sm:hidden">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
