import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useFavorites } from '../hooks/useFavorites';
import ImageSlider from '../components/ImageSlider';
import GenreGrid from '../components/GenreGrid';
import VideoRow from '../components/VideoRow';
import FolkStoriesRow from '../components/FolkStoriesRow';
import GarhwaliSikhaRow from '../components/GarhwaliSikhaRow';
import GovtJobsRow from '../components/GovtJobsRow';
import SarkaariYojanaRow from '../components/SarkaariYojanaRow';
import UpcomingHappenings from '../components/UpcomingHappenings';
import CharDhamRow from '../components/CharDhamRow';
import AboutSection from '../components/AboutSection';
import AdUnit, { AdUnitFluid } from '../components/AdUnit';
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

  // Merged Jaagar + Mela: interleave both arrays so both categories are represented
  const jagarMelaVideos = (() => {
    const d = devotional.videos;
    const m = mela.videos;
    const out = [];
    const len = Math.max(d.length, m.length);
    for (let i = 0; i < len; i++) {
      if (d[i]) out.push(d[i]);
      if (m[i]) out.push(m[i]);
    }
    return out;
  })();
  const jagarMelaLoading = devotional.loading || mela.loading;
  const jagarMelaError = devotional.error || mela.error;
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    async function load(category, setter, region = '') {
      try {
        const data = await getVideosByCategory(category, '', 12, region);
        setter({ videos: data.videos, loading: false, error: null });
        return data;
      } catch (err) {
        setter((s) => ({ ...s, loading: false, error: err.message }));
        return null;
      }
    }
    load('movies', setMovies);
    load('songs', setSongs);
    load('comedy', setComedy);
    load('vlogs', setBlogs);
    load('podcast', setPodcasts);
    load('folkdance', setFolkdance);
    load('devotional', setDevotional);
    load('mela', setMela);
    load('theatre', setTheatre);

    // Trending: server auto-detects region from IP and pools all users
    // from the same bucket (e.g. Dehradun, Rishikesh → "garhwal") into
    // one shared cache — no separate /api/geo call needed.
    load('trending', setTrending).then((data) => {
      // Use the geo endpoint to get city name for display only
      if (!data?._bucket) {
        fetch('/api/geo')
          .then((r) => r.json())
          .then((geo) => {
            if (geo?.city) setUserLocation({ city: geo.city, region: geo.region || '' });
          })
          .catch(() => {});
      }
    });
    // Also fetch city for the heading label
    fetch('/api/geo')
      .then((r) => r.json())
      .then((data) => {
        if (data?.city) setUserLocation({ city: data.city, region: data.region || '' });
      })
      .catch(() => {});
  }, []);

  const trendingTitle = userLocation
    ? `🔥 Trending near ${userLocation.city}`
    : '🔥 Trending Now';

  const { history: watchHistory } = useWatchHistory();
  const { favorites } = useFavorites();

  return (
    <div>
      {/* Full-width slider */}
      <ImageSlider />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-0">
        {/* Genre cards */}
        <GenreGrid />

        {/* Continue Watching — localStorage-persisted watch history */}
        {watchHistory.length > 0 && (
          <VideoRow
            title="▶ Continue Watching"
            videos={watchHistory}
            loading={false}
            error={null}
          />
        )}

        {/* My List — user's saved favorites */}
        {favorites.length > 0 && (
          <VideoRow
            title="❤️ My List"
            videos={favorites}
            loading={false}
            error={null}
          />
        )}

        {/* Festivals · Melas · Theatre / Events — unified row with type filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="section-happenings pl-3"
        >
          <UpcomingHappenings />
        </motion.div>

        {/* Char Dham Yatra — 4-dham guide cards + yatra videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <CharDhamRow />
        </motion.div>

        {/* Garhwali folk-stories — traditional Uttarakhand narratives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="section-stories pl-3"
        >
          <FolkStoriesRow />
        </motion.div>

        {/* Garhwali Sikha — Learn Garhwali language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="section-learning pl-3"
        >
          <GarhwaliSikhaRow />
        </motion.div>

        {/* Govt Jobs — recent job postings for Uttarakhand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="section-jobs pl-3"
        >
          <GovtJobsRow />
        </motion.div>

        {/* Sarkaari Yojana — current govt schemes for Uttarakhand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Ad — after Trending */}
        <AdUnitFluid />

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

        {/* Ad — after Songs */}
        <AdUnitFluid />

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

        {/* Ad — after Folk Dances */}
        <AdUnitFluid />

        {/* Jaagar, Devotional & Mela — merged row */}
        <VideoRow
          title="🔱🎪 Jaagar, Devotional & Mela"
          videos={jagarMelaVideos}
          loading={jagarMelaLoading}
          error={jagarMelaError}
          categoryLink="/category/devotional"
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
