import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ImageSlider from '../components/ImageSlider';
import GenreGrid from '../components/GenreGrid';
import VideoRow from '../components/VideoRow';
import FolkStoriesRow from '../components/FolkStoriesRow';
import GovtJobsRow from '../components/GovtJobsRow';
import SarkaariYojanaRow from '../components/SarkaariYojanaRow';
import UpcomingHappenings from '../components/UpcomingHappenings';
import AboutSection from '../components/AboutSection';
import { getVideosByCategory } from '../api/youtube';

export default function HomePage() {
  const [movies, setMovies] = useState({ videos: [], loading: true, error: null });
  const [trending, setTrending] = useState({ videos: [], loading: true, error: null });
  const [songs, setSongs] = useState({ videos: [], loading: true, error: null });
  const [comedy, setComedy] = useState({ videos: [], loading: true, error: null });
  const [blogs, setBlogs] = useState({ videos: [], loading: true, error: null });
  const [podcasts, setPodcasts] = useState({ videos: [], loading: true, error: null });
  const [folkdance, setFolkdance] = useState({ videos: [], loading: true, error: null });
  const [devotional, setDevotional] = useState({ videos: [], loading: true, error: null });
  const [mela, setMela] = useState({ videos: [], loading: true, error: null });
  const [theatre, setTheatre] = useState({ videos: [], loading: true, error: null });
  const [userLocation, setUserLocation] = useState(null);

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
    load('podcast', setPodcasts);
    load('folkdance', setFolkdance);
    load('devotional', setDevotional);
    load('mela', setMela);
    load('theatre', setTheatre);

    // Detect user location via IP
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.city) {
          setUserLocation({ city: data.city, region: data.region || '' });
        }
      })
      .catch(() => {});
  }, []);

  const trendingTitle = userLocation
    ? `🔥 Trending near ${userLocation.city}`
    : '🔥 Trending Now';

  return (
    <div>
      {/* Full-width slider */}
      <ImageSlider />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Genre cards */}
        <GenreGrid />

        {/* Festivals · Melas · Theatre / Events — unified row with type filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <UpcomingHappenings />
        </motion.div>

        {/* Garhwali folk-stories — Devanagari narratives sourced from himlingo.com */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <FolkStoriesRow />
        </motion.div>

        {/* Govt Jobs — recent job postings for Uttarakhand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <GovtJobsRow />
        </motion.div>

        {/* Sarkaari Yojana — current govt schemes for Uttarakhand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SarkaariYojanaRow />
        </motion.div>

        {/* Trending */}
        <VideoRow
          title={trendingTitle}
          subtitle={userLocation ? `${userLocation.city}, ${userLocation.region}` : null}
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

        {/* Podcasts */}
        <VideoRow
          title="🎙️ Pahadi Podcasts – Baramasa & Ghughuti"
          videos={podcasts.videos}
          loading={podcasts.loading}
          error={podcasts.error}
          categoryLink="/podcast"
        />

        {/* Folk Dances */}
        <VideoRow
          title="💃 Folk Dances"
          videos={folkdance.videos}
          loading={folkdance.loading}
          error={folkdance.error}
          categoryLink="/category/folkdance"
        />

        {/* Jaagar & Devotional */}
        <VideoRow
          title="🔱 Jaagar & Devotional"
          videos={devotional.videos}
          loading={devotional.loading}
          error={devotional.error}
          categoryLink="/category/devotional"
        />

        {/* Mela & Festivals */}
        <VideoRow
          title="🎪 Mela & Festivals"
          videos={mela.videos}
          loading={mela.loading}
          error={mela.error}
          categoryLink="/category/mela"
        />

        {/* Theatre & Culture (HNBGU + Uttarakhand rangmanch) */}
        <VideoRow
          title="🎭 Uttarakhand Theatre & Culture"
          subtitle="Featuring Theatre Department, HNB Garhwal University"
          videos={theatre.videos}
          loading={theatre.loading}
          error={theatre.error}
          categoryLink="/category/theatre"
        />

        {/* About PahadiTube */}
        <AboutSection />
      </div>
    </div>
  );
}
