import { useEffect, useState, useCallback } from 'react';
import HeroBanner from '../components/HeroBanner';
import ImageSlider from '../components/ImageSlider';
import VideoGrid from '../components/VideoGrid';
import { getVideosByCategory } from '../api/youtube';

export default function HomePage() {
  const [movies, setMovies] = useState({ videos: [], loading: true, error: null, nextPageToken: null });
  const [trending, setTrending] = useState({ videos: [], loading: true, error: null, nextPageToken: null });

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getVideosByCategory('movies', '', 8);
        setMovies({ videos: data.videos, loading: false, error: null, nextPageToken: data.nextPageToken });
      } catch (err) {
        setMovies((s) => ({ ...s, loading: false, error: err.message }));
      }
    }
    async function loadTrending() {
      try {
        const data = await getVideosByCategory('trending', '', 8);
        setTrending({ videos: data.videos, loading: false, error: null, nextPageToken: data.nextPageToken });
      } catch (err) {
        setTrending((s) => ({ ...s, loading: false, error: err.message }));
      }
    }
    loadMovies();
    loadTrending();
  }, []);

  const loadMoreMovies = useCallback(async () => {
    if (!movies.nextPageToken) return;
    setMovies((s) => ({ ...s, loadingMore: true }));
    try {
      const data = await getVideosByCategory('movies', movies.nextPageToken, 8);
      setMovies((s) => ({
        ...s,
        videos: [...s.videos, ...data.videos],
        nextPageToken: data.nextPageToken,
        loadingMore: false,
      }));
    } catch {
      setMovies((s) => ({ ...s, loadingMore: false }));
    }
  }, [movies.nextPageToken]);

  const loadMoreTrending = useCallback(async () => {
    if (!trending.nextPageToken) return;
    setTrending((s) => ({ ...s, loadingMore: true }));
    try {
      const data = await getVideosByCategory('trending', trending.nextPageToken, 8);
      setTrending((s) => ({
        ...s,
        videos: [...s.videos, ...data.videos],
        nextPageToken: data.nextPageToken,
        loadingMore: false,
      }));
    } catch {
      setTrending((s) => ({ ...s, loadingMore: false }));
    }
  }, [trending.nextPageToken]);

  return (
    <>
      <ImageSlider />
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <VideoGrid
          title="🎬 Latest Garhwali Movies"
          videos={movies.videos}
          loading={movies.loading}
          error={movies.error}
          onLoadMore={loadMoreMovies}
          hasMore={!!movies.nextPageToken}
          loadingMore={movies.loadingMore}
        />
        <VideoGrid
          title="🔥 Trending Clips"
          videos={trending.videos}
          loading={trending.loading}
          error={trending.error}
          onLoadMore={loadMoreTrending}
          hasMore={!!trending.nextPageToken}
          loadingMore={trending.loadingMore}
        />
      </div>
    </>
  );
}
