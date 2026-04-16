import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import { getVideosByCategory } from '../api/youtube';

const CATEGORY_LABELS = {
  movies: '🎬 Garhwali Movies',
  songs: '🎵 Garhwali Songs',
  comedy: '😂 Garhwali Comedy',
  devotional: '🙏 Garhwali Devotional',
};

export default function CategoryPage() {
  const { category } = useParams();
  const [state, setState] = useState({ videos: [], loading: true, error: null, nextPageToken: null, loadingMore: false });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ videos: [], loading: true, error: null, nextPageToken: null, loadingMore: false });
      try {
        const data = await getVideosByCategory(category, '', 12);
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
  }, [category]);

  const loadMore = useCallback(async () => {
    if (!state.nextPageToken || state.loadingMore) return;
    setState((s) => ({ ...s, loadingMore: true }));
    try {
      const data = await getVideosByCategory(category, state.nextPageToken, 12);
      setState((s) => ({
        ...s,
        videos: [...s.videos, ...data.videos],
        nextPageToken: data.nextPageToken,
        loadingMore: false,
      }));
    } catch {
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, [category, state.nextPageToken, state.loadingMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <VideoGrid
        title={CATEGORY_LABELS[category] || category}
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
