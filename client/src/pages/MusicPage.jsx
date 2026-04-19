import { useEffect, useState } from 'react';
import { searchVideos } from '../api/youtube';
import { useMusic } from '../context/MusicContext';

const MUSIC_QUERIES = [
  { label: '🔥 Trending', query: 'garhwali trending hit songs 2026' },
  { label: '🎶 Classic', query: 'old garhwali evergreen songs Narendra Singh Negi' },
  { label: '🏔️ Kumaoni', query: 'kumaoni hit songs uttarakhand' },
  { label: '🎧 DJ Mix', query: 'garhwali DJ remix nonstop dance' },
  { label: '🙏 Bhajan', query: 'garhwali bhajan devotional aarti' },
  { label: '🪘 Jaagar', query: 'garhwali jaagar Pritam Bhartwan ritual' },
  { label: '💃 Folk Dance', query: 'garhwali folk dance chaunphula thadya' },
  { label: '👩 Female Voices', query: 'garhwali female singer Meena Rana Priyanka Meher' },
];

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack } = useMusic();

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
    playTrack(track, tracks);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-32">
      {/* Header — YouTube Music style */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold">Pahadi Music</h1>
          <p className="text-sm text-gray-400">Garhwali & Kumaoni songs — tap to play</p>
        </div>
      </div>

      {/* Category tabs — pill style */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scroll-row">
        {MUSIC_QUERIES.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === i
                ? 'bg-white text-black shadow-md'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Track list — YouTube Music style */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800">
              <div className="w-12 h-12 rounded-lg skeleton" />
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
        <div className="space-y-1">
          {tracks.map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handlePlay(track)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border
                  ${isActive
                    ? 'bg-primary-500/10 border-primary-500/30 shadow-sm shadow-primary-500/10'
                    : 'bg-dark-800/40 border-transparent hover:bg-dark-700/60'
                  }`}
              >
                {/* Index / equalizer */}
                <div className="w-7 text-center shrink-0">
                  {isActive ? (
                    <div className="flex items-end justify-center gap-[2px] h-4">
                      <span className="w-[3px] bg-primary-400 rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_alternate]" style={{ height: '60%' }} />
                      <span className="w-[3px] bg-primary-400 rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_alternate_0.2s]" style={{ height: '100%' }} />
                      <span className="w-[3px] bg-primary-400 rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_alternate_0.4s]" style={{ height: '40%' }} />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">{index + 1}</span>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 group">
                  <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-300' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{track.channelTitle}</p>
                </div>

                {/* Play icon */}
                <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
