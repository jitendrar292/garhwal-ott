import { useEffect, useState } from 'react';
import ImageSlider from '../components/ImageSlider';
import GenreGrid from '../components/GenreGrid';
import VideoRow from '../components/VideoRow';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import { getVideosByCategory } from '../api/youtube';

export default function HomePage() {
  const [movies, setMovies] = useState({ videos: [], loading: true, error: null });
  const [trending, setTrending] = useState({ videos: [], loading: true, error: null });
  const [songs, setSongs] = useState({ videos: [], loading: true, error: null });
  const [comedy, setComedy] = useState({ videos: [], loading: true, error: null });

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
  }, []);

  return (
    <div className="snap-container pb-20 sm:pb-0">
      {/* Full-width slider */}
      <section className="snap-section">
        <ImageSlider />
      </section>

      {/* Genre cards */}
      <section className="snap-section flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <GenreGrid />
        </div>
      </section>

      {/* Trending */}
      <section className="snap-section flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <VideoRow
            title="🔥 Trending Now"
            videos={trending.videos}
            loading={trending.loading}
            error={trending.error}
            categoryLink="/category/trending"
          />
        </div>
      </section>

      {/* Movies */}
      <section className="snap-section flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <VideoRow
            title="🎬 Latest Movies"
            videos={movies.videos}
            loading={movies.loading}
            error={movies.error}
            categoryLink="/category/movies"
          />
        </div>
      </section>

      {/* Songs */}
      <section className="snap-section flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <VideoRow
            title="🎵 Pahadi Songs"
            videos={songs.videos}
            loading={songs.loading}
            error={songs.error}
            categoryLink="/category/songs"
          />
        </div>
      </section>

      {/* Comedy */}
      <section className="snap-section flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <VideoRow
            title="😂 Comedy"
            videos={comedy.videos}
            loading={comedy.loading}
            error={comedy.error}
            categoryLink="/category/comedy"
          />
        </div>
      </section>

      {/* About PahadiTube */}
      <section className="snap-section flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex items-center">
          <div className="w-full">
            <AboutSection />
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
}
