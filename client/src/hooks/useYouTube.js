import { useState, useEffect, useCallback } from 'react';

export function useYouTube(fetchFn, ...initialArgs) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn(...args);
      setVideos(data.videos);
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  const loadMore = useCallback(async (...args) => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchFn(...args, nextPageToken);
      setVideos((prev) => [...prev, ...data.videos]);
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchFn, nextPageToken, loadingMore]);

  useEffect(() => {
    if (initialArgs.length > 0 && initialArgs[0]) {
      fetchData(...initialArgs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { videos, loading, error, nextPageToken, loadingMore, fetchData, loadMore };
}
