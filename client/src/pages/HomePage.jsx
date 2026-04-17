import { useEffect, useState } from 'react';
import ImageSlider from '../components/ImageSlider';
import GenreGrid from '../components/GenreGrid';
import VideoRow from '../components/VideoRow';
import AboutSection from '../components/AboutSection';
import { getVideosByCategory } from '../api/youtube';

export default function HomePage() {
  const [movies, setMovies] = useState({ videos: [], loading: true, error: null });
  const [trending, setTrending] = useState({ videos: [], loading: true, error: null });
  const [songs, setSongs] = useState({ videos: [], loading: true, error: null });
  const [comedy, setComedy] = useState({ videos: [], loading: true, error: null });
  const [blogs, setBlogs] = useState({ videos: [], loading: true, error: null });

  useEffect(() => {
    async function load(category, setter) {
      try {
        const data = await getVideosByCategory(category, '', 12);
        setter({ videos: data.videos, loading: false, error: null });
      } catch (err) {
        setter((s) => ({ ...s, loading: false, error: err.message }));
      }
    }
    load('movies', setMovies);
    load('trending', setTrending);
    load('songs', setSongs);
    load('comedy', setComedy);
    load('vlogs', setBlogs);
  }, []);

  return (
    <div>
      {/* Full-width slider */}
      <ImageSlider />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Genre cards */}
        <GenreGrid />

        {/* Trending */}
        <VideoRow
          title="🔥 Trending Now"
          videos={trending.videos}
          loading={trending.loading}
          error={trending.error}
          categoryLink="/category/trending"
        />

        {/* Movies */}
        <VideoRow
          title="🎬 Latest Movies"
          videos={movies.videos}
          loading={movies.loading}
          error={movies.error}
          categoryLink="/category/movies"
        />

        {/* Songs */}
        <VideoRow
          title="🎵 Pahadi Songs"
          videos={songs.videos}
          loading={songs.loading}
          error={songs.error}
          categoryLink="/category/songs"
        />

        {/* Comedy */}
        <VideoRow
          title="😂 Comedy"
          videos={comedy.videos}
          loading={comedy.loading}
          error={comedy.error}
          categoryLink="/category/comedy"
        />

        {/* Trending Blogs */}
        <VideoRow
          title="📹 Trending Pahadi Vlogs"
          videos={blogs.videos}
          loading={blogs.loading}
          error={blogs.error}
          categoryLink="/category/vlogs"
        />

        {/* About PahadiTube */}
        <AboutSection />
      </div>
    </div>
  );
}
