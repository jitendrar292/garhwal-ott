import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import { searchVideos } from '../api/youtube';

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
  }, [query]);

  const loadMore = useCallback(async () => {
    if (!state.nextPageToken || state.loadingMore) return;
    setState((s) => ({ ...s, loadingMore: true }));
    try {
      const data = await searchVideos(query, state.nextPageToken, 10);
      setState((s) => ({
        ...s,
        videos: [...s.videos, ...data.videos],
        nextPageToken: data.nextPageToken,
        loadingMore: false,
      }));
    } catch {
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, [query, state.nextPageToken, state.loadingMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
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
