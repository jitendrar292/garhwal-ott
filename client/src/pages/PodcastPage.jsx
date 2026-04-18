import { useEffect, useState, useCallback } from 'react';
import VideoGrid from '../components/VideoGrid';
import { getVideosByCategory } from '../api/youtube';

export default function PodcastPage() {
  const [state, setState] = useState({
    videos: [],
    loading: true,
    error: null,
    nextPageToken: null,
    loadingMore: false,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ videos: [], loading: true, error: null, nextPageToken: null, loadingMore: false });
      try {
        const data = await getVideosByCategory('podcast', '', 12);
        if (!cancelled) {
          setState({ videos: data.videos, loading: false, error: null, nextPageToken: data.nextPageToken, loadingMore: false });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: err.message }));
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const loadMore = useCallback(async () => {
    if (!state.nextPageToken || state.loadingMore) return;
    setState((s) => ({ ...s, loadingMore: true }));
    try {
      const data = await getVideosByCategory('podcast', state.nextPageToken, 12);
      setState((s) => ({
        ...s,
        videos: [...s.videos, ...data.videos],
        nextPageToken: data.nextPageToken,
        loadingMore: false,
      }));
    } catch {
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, [state.nextPageToken, state.loadingMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Channel credits header */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-dark-800 rounded-xl px-4 py-2 border border-white/5">
          <span className="text-lg">🎙️</span>
          <span className="text-sm font-semibold text-white">Baramasa</span>
          <span className="text-xs text-gray-400">• 395K subscribers</span>
        </div>
        <div className="flex items-center gap-2 bg-dark-800 rounded-xl px-4 py-2 border border-white/5">
          <span className="text-lg">🏔️</span>
          <span className="text-sm font-semibold text-white">Ghughuti</span>
          <span className="text-xs text-gray-400">• 238K subscribers</span>
        </div>
      </div>

      <VideoGrid
        title="🎙️ Pahadi Podcasts"
        videos={state.videos}
        loading={state.loading}
        error={state.error}
        onLoadMore={loadMore}
        hasMore={!!state.nextPageToken}
        loadingMore={state.loadingMore}
      />
    </div>
  );
}
