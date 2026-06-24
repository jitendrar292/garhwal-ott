import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import TrendingInstagramRow from '../components/TrendingInstagramRow';
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'सुप्रभात';
    if (hour < 17) return 'नमस्कार';
    return 'शुभ संध्या';
  }, []);

  const quickActions = [
    { to: '/music', label: 'Music', emoji: '🎵' },
    { to: '/folk-stories', label: 'Folk Stories', emoji: '📖' },
    { to: '/news', label: 'News', emoji: '📰' },
    { to: '/jobs', label: 'Jobs', emoji: '💼' },
    { to: '/culture', label: 'Culture Library', emoji: '🏔️' },
    { to: '/ghughuti-ai', label: 'Ask Ghughuti AI', emoji: '✨' },
  ];

  const todayPicks = useMemo(() => {
    const candidates = [
      { title: 'Trending Pick', video: trending.videos[0], tint: 'from-red-500/20 to-orange-500/10' },
      { title: 'Movie Pick', video: movies.videos[0], tint: 'from-amber-500/20 to-yellow-500/10' },
      { title: 'Song Pick', video: songs.videos[0], tint: 'from-primary-500/20 to-cyan-500/10' },
      { title: 'Comedy Pick', video: comedy.videos[0], tint: 'from-fuchsia-500/20 to-pink-500/10' },
    ];
    return candidates.filter((item) => item.video && item.video.id).slice(0, 4);
  }, [trending.videos, movies.videos, songs.videos, comedy.videos]);

  return (
    <div>
      {/* Full-width slider */}
      <ImageSlider />

      <div className="max-w-full mx-auto px-4 sm:px-6 pt-8 space-y-0">
        {/* Genre cards */}
        <GenreGrid />

        {/* Welcome + quick actions for faster discovery */}
        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 p-4 sm:p-5 mt-2 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {greeting} 👋
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Continue where you left off, discover fresh Pahadi content, and explore stories from Devbhoomi.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/55">
                <span className="px-2 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">{watchHistory.length} continue watching</span>
                <span className="px-2 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">{favorites.length} saved in my list</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.08] text-xs sm:text-sm text-white/85 hover:text-white transition-colors"
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Daily curated picks */}
        {todayPicks.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">✨ Today&apos;s Picks</h3>
              <span className="text-xs text-white/50">Handpicked for faster discovery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {todayPicks.map((item) => (
                <Link
                  key={item.video.id}
                  to={`/watch/${item.video.id}`}
                  className={`group rounded-xl border border-white/[0.08] bg-gradient-to-br ${item.tint} p-3 hover:border-white/[0.2] transition-all`}
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-2">
                    <img
                      src={item.video.thumbnail}
                      alt={item.video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[11px] text-white/70 mb-1">{item.title}</p>
                  <p className="text-sm font-medium text-white line-clamp-2">{item.video.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="section-instagram pl-3"
        >
          <TrendingInstagramRow />
        </motion.div>

        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-amber-900/20 via-primary-900/20 to-surface-2 p-5 sm:p-6 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-amber-100">New: Garhwali Culture Library</h2>
              <p className="text-sm text-white/65 mt-1 max-w-2xl">
                Read original blogs and educational articles on Uttarakhand history, traditions, migration, language, and mountain life.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/culture"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
              >
                Explore Articles
              </Link>
              <Link
                to="/folk-stories"
                className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 text-white text-sm font-semibold transition-colors"
              >
                Folk Stories
              </Link>
            </div>
          </div>
        </section>

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
