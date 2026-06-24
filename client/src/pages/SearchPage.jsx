import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import { searchVideos } from '../api/youtube';

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

const filterReels = (items = []) =>
  items.filter((v) => {
    const hay = `${v?.title || ''} ${v?.channelTitle || ''}`;
    return !REEL_WORDS_RE.test(hay);
  });

const mergeUniqueByTitle = (existing = [], incoming = []) => {
  const byVideoId = new Set(existing.map((v) => v.id));
  const byTitle = new Set(existing.map((v) => normalizeTitle(v.title)).filter(Boolean));
  const merged = [...existing];

  for (const video of incoming) {
    if (!video?.id || byVideoId.has(video.id)) continue;
    const key = normalizeTitle(video.title);
    if (key && byTitle.has(key)) continue;
    byVideoId.add(video.id);
    if (key) byTitle.add(key);
    merged.push(video);
  }
  return merged;
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [state, setState] = useState({ videos: [], loading: false, error: null, nextPageToken: null, loadingMore: false });

  useEffect(() => {
    let cancelled = false;
    if (!query) {
      setState({ videos: [], loading: false, error: null, nextPageToken: null, loadingMore: false });
      return;
    }
    async function load() {
      setState({ videos: [], loading: true, error: null, nextPageToken: null, loadingMore: false });
      try {
        const data = await searchVideos(query, '', 10);
        if (!cancelled) {
          const cleaned = mergeUniqueByTitle([], filterReels(data.videos || []));
          setState({ videos: cleaned, loading: false, error: null, nextPageToken: data.nextPageToken, loadingMore: false });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: err.message }));
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [query]);

  const loadMore = useCallback(async () => {
    if (!state.nextPageToken || state.loadingMore) return;
    setState((s) => ({ ...s, loadingMore: true }));
    try {
      const data = await searchVideos(query, state.nextPageToken, 10);
      setState((s) => ({
        ...s,
        videos: mergeUniqueByTitle(s.videos, filterReels(data.videos || [])),
        nextPageToken: data.nextPageToken,
        loadingMore: false,
      }));
    } catch {
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, [query, state.nextPageToken, state.loadingMore]);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 py-10">
      {!query ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">Enter a search term to find Pahadi videos</p>
        </div>
      ) : (
        <VideoGrid
          title={`Search results for "${query}"`}
          videos={state.videos}
          loading={state.loading}
          error={state.error}
          onLoadMore={loadMore}
          hasMore={!!state.nextPageToken}
          loadingMore={state.loadingMore}
        />
      )}
    </div>
  );
}
