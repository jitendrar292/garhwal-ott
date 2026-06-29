import { useEffect, useState } from 'react';
import { searchVideos } from '../api/youtube';
import { useMusic } from '../context/MusicContext';
import SEO from '../components/SEO';
import { useToast } from '../components/ui/Toast';

// All queries append "-movie -film -trailer -full movie" to keep results
// limited to songs/audio only and exclude Garhwali movie uploads.
const EXCLUDE = '-movie -film -trailer -"full movie"';
const EXCLUDE_REELS = `${EXCLUDE} -reels -reel -shorts -short -#shorts -#reels -instagram`;
const MUSIC_QUERIES = [
  { label: '🔥 Trending', query: `garhwali trending hit songs 2026 ${EXCLUDE}` },
  { label: '🎙️ NSN', query: `Narendra Singh Negi best songs garhwali hit ${EXCLUDE_REELS}` },
  { label: '🎶 Classic', query: `old garhwali evergreen songs ${EXCLUDE}` },
  { label: '🏔️ Kumaoni', query: `kumaoni hit songs uttarakhand ${EXCLUDE}` },
  { label: '🎧 DJ Mix', query: `garhwali DJ remix nonstop dance ${EXCLUDE}` },
  { label: '🙏 Bhajan', query: `garhwali bhajan devotional aarti ${EXCLUDE}` },
  { label: '🪘 Jaagar', query: `garhwali jaagar Pritam Bhartwan ritual ${EXCLUDE}` },
  { label: '💃 Folk Dance', query: `garhwali folk dance chaunphula thadya ${EXCLUDE}` },
  { label: '👩 Female Voices', query: `garhwali female singer Meena Rana Priyanka Meher ${EXCLUDE}` },
];

export default function MusicPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const { playTrack, currentTrack } = useMusic();

  const REEL_WORDS_RE = /\b(shorts?|reels?|instagram|insta)\b/i;
  const CLEAN_TAIL_RE = /\s*\([^)]*\)|\s*\[[^\]]*\]|\s*\|.*$/g;

  const normalizeTitle = (title = '') =>
    title
      .toLowerCase()
      .replace(CLEAN_TAIL_RE, '')
      .replace(/\b(official|video|full|song|audio|lyrics?|hd|4k|remix)\b/g, '')
      .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const filterSongLikeVideos = (items = []) =>
    items.filter((t) => {
      const hay = `${t?.title || ''} ${t?.channelTitle || ''}`;
      return !REEL_WORDS_RE.test(hay);
    });

  // Dedupe by video id first, then by normalized title to avoid repeat songs.
  const mergeUnique = (existing, incoming) => {
    const byVideoId = new Set(existing.map((t) => t.id));
    const bySongKey = new Set(existing.map((t) => normalizeTitle(t.title)));

    const merged = [...existing];
    for (const track of incoming) {
      if (!track?.id || byVideoId.has(track.id)) continue;
      const songKey = normalizeTitle(track.title);
      if (songKey && bySongKey.has(songKey)) continue;
      byVideoId.add(track.id);
      if (songKey) bySongKey.add(songKey);
      merged.push(track);
    }
    return merged;
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setTracks([]);
    setNextPageToken(null);
    // First page: latest uploads first (order=date), 10 per fetch.
    // videoCategoryId omitted — category 10 (Music) is rarely set by regional
    // Garhwali/Pahadi uploaders, so it causes zero results for NSN and other tabs.
    // The query's -movie/-film exclusions already filter non-music content.
    searchVideos(MUSIC_QUERIES[activeTab].query, '', 10, 'date')
      .then((data) => {
        if (!cancelled) {
          setTracks(mergeUnique([], filterSongLikeVideos(data.videos || [])));
          setNextPageToken(data.nextPageToken || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeTab]);

  const handleLoadMore = () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    searchVideos(MUSIC_QUERIES[activeTab].query, nextPageToken, 10, 'date')
      .then((data) => {
        // Append older results after the latest ones already shown.
        setTracks((prev) => mergeUnique(prev, filterSongLikeVideos(data.videos || [])));
        setNextPageToken(data.nextPageToken || null);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  const handlePlay = (track) => {
    playTrack(track, tracks);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 py-6 pb-32">
      <SEO
        title="Garhwali & Pahadi Songs - Trending, Bhajan, Jaagar, DJ Mix"
        description="Stream the latest Garhwali songs, evergreen Narendra Singh Negi classics, Kumaoni hits, Pahadi DJ remixes, devotional bhajans and Jaagar — curated playlists from Uttarakhand."
        path="/music"
        keywords="Garhwali songs, Pahadi songs, Garhwali music, Narendra Singh Negi, Kumaoni songs, Garhwali bhajan, Jaagar, Garhwali DJ, Uttarakhand music"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Garhwali & Pahadi Songs',
          url: 'https://pahaditube.in/music',
          description: 'Curated Garhwali and Pahadi music playlists — trending hits, classics, bhajans, jaagar and DJ remixes.',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
        }}
      />
      {/* Header — YouTube Music style */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
          <img src="/icons/music.png" alt="Music" className="w-12 h-12 object-contain" />
        </div>
        <div>
          <h1 className="font-display text-heading-lg">पहाड़ी <span className="text-gradient-primary">गाना</span></h1>
          <p className="text-body-sm text-white/50">Garhwali & Kumaoni songs — tap to play</p>
        </div>
      </div>

      {/* Category tabs — pill style */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scroll-row">
        {MUSIC_QUERIES.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 rounded-xl text-body-sm font-medium whitespace-nowrap transition-all ${
              activeTab === i
                ? 'bg-primary-500 text-white shadow-glow-sm'
                : 'bg-surface-2 text-white/60 hover:bg-surface-3 hover:text-white'
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
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-1">
              <div className="w-12 h-12 rounded-lg skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-3 skeleton rounded w-3/4" />
                <div className="h-2.5 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <p className="text-white/40 text-center py-12">No tracks found</p>
      ) : (
        <div className="space-y-1">
          {tracks.map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            const handleShare = (e) => {
              e.stopPropagation();
              const url = `${window.location.origin}/watch/${track.id}`;
              const shareData = {
                title: track.title,
                text: `${track.title} — ${track.channelTitle || ''}`.trim(),
                url,
              };
              if (navigator.share) {
                navigator.share(shareData).catch(() => {});
              } else {
                navigator.clipboard
                  .writeText(url)
                  .then(() => toast.success('Link copied — share with your group!', 2200))
                  .catch(() => toast.error('Could not copy link', 2500));
              }
            };
            return (
              <div
                key={track.id}
                role="button"
                tabIndex={0}
                onClick={() => handlePlay(track)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlay(track);
                  }
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border cursor-pointer
                  ${isActive
                    ? 'bg-primary-500/10 border-primary-500/30 shadow-glow-sm'
                    : 'bg-surface-1/50 border-transparent hover:bg-surface-2'
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

                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-white/40 hover:text-white hover:bg-surface-3 transition-colors shrink-0"
                  aria-label="Share"
                  title="Share"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>

                {/* Play icon */}
                <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* Load more — appends older tracks after the latest ones */}
      {!loading && tracks.length > 0 && nextPageToken && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="btn-secondary px-6 py-2.5"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
