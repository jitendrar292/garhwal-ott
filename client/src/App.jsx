import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import FloatingPlayer from './components/FloatingPlayer';
import InstallBanner from './components/InstallBanner';
import IntroSound from './components/IntroSound';
import IntroDanceOverlay from './components/IntroDanceOverlay';
import { ToastProvider } from './components/ui/Toast';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import PlayerPage from './pages/PlayerPage';
import FavoritesPage from './pages/FavoritesPage';
import FeedbackPage from './pages/FeedbackPage';
import FeedbackAdminPage from './pages/FeedbackAdminPage';
import MusicPage from './pages/MusicPage';
import ShortsPage from './pages/ShortsPage';
import PodcastPage from './pages/PodcastPage';
import GhughutiAIPage from './pages/GhughutiAIPage';
import NewsPage from './pages/NewsPage';
import NewsAdminPage from './pages/NewsAdminPage';
import YouTubeAdminPage from './pages/YouTubeAdminPage';
import FolkStoryPage from './pages/FolkStoryPage';
import FolkStoriesIndexPage from './pages/FolkStoriesIndexPage';
import GovtJobsPage from './pages/GovtJobsPage';
import JobsAdminPage from './pages/JobsAdminPage';
import SarkaariYojanaPage from './pages/SarkaariYojanaPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import VoiceRecordingPage from './pages/VoiceRecordingPage';
import GarhwaliSikhaPage from './pages/GarhwaliSikhaPage';
import PahadiKhanoPage from './pages/PahadiKhanoPage';
import PahadiStorePage from './pages/PahadiStorePage';
import PahadiPehnawaPage from './pages/PahadiPehnawaPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// Protected route wrapper - redirects to login if not authenticated
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col text-white bg-surface-0">
            <Navbar />
            <main className="flex-1 pb-24 sm:pb-8">
              <AnimatedRoutes />
            </main>
            <Footer />
            <FloatingPlayer />
            <BottomNav />
            <InstallBanner />
            <IntroSound />
            <IntroDanceOverlay />
          </div>
        </ToastProvider>
      </MusicProvider>
    </AuthProvider>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Listens for push notification clicks forwarded by the service worker and
// navigates to the target route via React Router (soft SPA navigation).
function PushNavigationHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const handler = (event) => {
      if (event.data?.type === 'NOTIFICATION_CLICK' && event.data.url) {
        try {
          const url = new URL(event.data.url, window.location.origin);
          if (url.origin === window.location.origin) {
            navigate(url.pathname + url.search + url.hash, { replace: false });
          }
        } catch { /* malformed url — ignore */ }
      }
    };
    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  }, [navigate]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <PushNavigationHandler />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/watch/:videoId" element={<PlayerPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/feedback/admin" element={<FeedbackAdminPage />} />
            <Route path="/youtube/admin" element={<YouTubeAdminPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/shorts" element={<ShortsPage />} />
            <Route path="/podcast" element={<PodcastPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/ghughuti-ai"
              element={
                <RequireAuth>
                  <GhughutiAIPage />
                </RequireAuth>
              }
            />
            {/* Legacy URL — keep so old bookmarks/sitemap entries don't 404. */}
            <Route path="/pahadi-ai" element={<Navigate to="/ghughuti-ai" replace />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/admin" element={<NewsAdminPage />} />
            <Route path="/folk-story/:slug" element={<FolkStoryPage />} />
            <Route path="/folk-stories" element={<FolkStoriesIndexPage />} />
            <Route path="/jobs" element={<GovtJobsPage />} />
            <Route path="/jobs/admin" element={<JobsAdminPage />} />
            <Route path="/yojana" element={<SarkaariYojanaPage />} />
            <Route path="/voice-recording" element={<VoiceRecordingPage />} />
            <Route path="/garhwali-sikha" element={<GarhwaliSikhaPage />} />
            <Route path="/pahadi-khano" element={<PahadiKhanoPage />} />
            <Route path="/pahadi-store" element={<PahadiStorePage />} />
            <Route path="/pahadi-pehnawa" element={<PahadiPehnawaPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
