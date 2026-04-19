import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchVideos } from '../api/youtube';
import VideoCard from '../components/VideoCard';
import { useFavorites } from '../hooks/useFavorites';
import LyricsSection from '../components/LyricsSection';

export default function PlayerPage() {
  const { videoId } = useParams();
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [videoMeta, setVideoMeta] = useState({ title: '', channelTitle: '' });
  // Click-to-play: don't mount the YouTube iframe until the user explicitly
  // taps the poster. This avoids loading the full ~1MB+ player bundle (and
  // burning a YouTube quota unit) just because a route was opened — important
  // for users who navigated by mistake or hit Back. Each /watch/:id mount
  // resets the gate so navigating between videos requires another tap.
  const [playerStarted, setPlayerStarted] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    window.scrollTo(0, 0);
    setPlayerStarted(false);
    // Fetch title via YouTube oEmbed (no API key needed)
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setVideoMeta({ title: data.title || '', channelTitle: data.author_name || '' });
      })
      .catch(() => {});
  }, [videoId]);

  useEffect(() => {
    let cancelled = false;
    async function loadRelated() {
      setRelatedLoading(true);
      try {
        // 10 results, then we filter the current video out before rendering.
        const data = await searchVideos('Garhwali', '', 10);
        if (!cancelled) {
          setRelated(data.videos.filter((v) => v.id !== videoId));
        }
      } catch {
        // silently fail for related videos
      } finally {
        if (!cancelled) setRelatedLoading(false);
      }
    }
    loadRelated();
    return () => { cancelled = true; };
  }, [videoId]);

  const fav = isFavorite(videoId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark-700 shadow-2xl">
            {playerStarted ? (
              <iframe
                src={`https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
                title="Video Player"
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              // Click-to-play poster. Uses the YouTube hqdefault thumbnail
              // (free, CDN-cached) instead of mounting the embed iframe.
              // Tapping the play button mounts the iframe with autoplay=1
              // so playback starts immediately on user gesture.
              <button
                type="button"
                onClick={() => setPlayerStarted(true)}
                className="absolute inset-0 w-full h-full group/poster"
                aria-label="Play video"
              >
                <img
                  src={`https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`}
                  alt={videoMeta.title || 'Video thumbnail'}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover/poster:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600/90 group-hover/poster:bg-red-500
                                  flex items-center justify-center shadow-2xl
                                  transition-transform duration-200 group-hover/poster:scale-110">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                <span className="absolute bottom-3 left-3 right-3 text-left text-white text-sm font-medium drop-shadow line-clamp-2">
                  {videoMeta.title}
                </span>
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => fav
                ? removeFavorite(videoId)
                : addFavorite({
                    id: videoId,
                    title: videoMeta.title,
                    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                    channelTitle: videoMeta.channelTitle,
                  })
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium
                         ${fav ? 'bg-red-500 text-white' : 'bg-dark-600 text-gray-300 hover:bg-dark-500'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              {fav ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.2071 14.2071L9.79289 12.7929L17.585 5H13V3H21Z" />
              </svg>
              Watch on YouTube
            </a>
          </div>

          {/* Song lyrics in Garhwali */}
          <LyricsSection videoId={videoId} />
        </div>

        {/* Related videos sidebar */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
            More Videos
          </h3>
          {relatedLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-40 aspect-video skeleton rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 skeleton rounded w-full" />
                    <div className="h-3 skeleton rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {related.slice(0, 6).map((video) => (
                <Link
                  key={video.id}
                  to={`/watch/${video.id}`}
                  className="flex gap-3 group hover:bg-dark-600 rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="w-40 aspect-video rounded-lg overflow-hidden shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{video.channelTitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
