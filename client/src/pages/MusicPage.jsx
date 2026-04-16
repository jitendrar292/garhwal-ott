import { useEffect, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { searchVideos } from '../api/youtube';

const MUSIC_QUERIES = [
  { label: 'Trending Pahadi Songs', query: 'latest garhwali songs 2026' },
  { label: 'Classic Garhwali', query: 'old garhwali songs evergreen' },
  { label: 'Kumaoni Hits', query: 'kumaoni hit songs' },
  { label: 'Pahadi DJ Mix', query: 'garhwali DJ remix songs' },
  { label: 'Devotional Bhajans', query: 'garhwali bhajan devotional' },
];

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useMusic();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchVideos(MUSIC_QUERIES[activeTab].query, '', 20)
      .then((data) => {
        if (!cancelled) {
          setTracks(data.videos || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeTab]);

  const handlePlay = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, tracks);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold">Pahadi Music</h1>
          <p className="text-sm text-gray-400">Listen to Garhwali & Kumaoni songs</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {MUSIC_QUERIES.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === i
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Track list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800">
              <div className="w-14 h-14 rounded-lg skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-3 skeleton rounded w-3/4" />
                <div className="h-2.5 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No tracks found</p>
      ) : (
        <div className="space-y-2">
          {tracks.map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handlePlay(track)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-500/10 border border-primary-500/30'
                    : 'bg-dark-800/50 hover:bg-dark-700/80 border border-transparent'
                }`}
              >
                {/* Index / playing indicator */}
                <div className="w-8 text-center shrink-0">
                  {isActive && isPlaying ? (
                    <div className="flex items-end justify-center gap-0.5 h-4">
                      <span className="w-1 bg-primary-400 rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
                      <span className="w-1 bg-primary-400 rounded-full animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
                      <span className="w-1 bg-primary-400 rounded-full animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">{index + 1}</span>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
                  {isActive && isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    </div>
                  )}
                  {(!isActive || !isPlaying) && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-400' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{track.channelTitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
