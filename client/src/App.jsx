import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import { ToastProvider } from './components/ui/Toast';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy-load heavy layout components that aren't needed for first paint
const Footer = lazy(() => import('./components/Footer'));
const FloatingPlayer = lazy(() => import('./components/FloatingPlayer'));
const FloatingByoIcon = lazy(() => import('./components/FloatingByoIcon'));
const FloatingDailyProduct = lazy(() => import('./components/FloatingDailyProduct'));
const InstallBanner = lazy(() => import('./components/InstallBanner'));
const IntroSound = lazy(() => import('./components/IntroSound'));
const RunningCharacter = lazy(() => import('./components/RunningCharacter'));
const DoodleOverlay = lazy(() => import('./components/DoodleOverlay'));

// Lazy-loaded page components for route-level code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const FeedbackAdminPage = lazy(() => import('./pages/FeedbackAdminPage'));
const MusicPage = lazy(() => import('./pages/MusicPage'));
const ShortsPage = lazy(() => import('./pages/ShortsPage'));
const PodcastPage = lazy(() => import('./pages/PodcastPage'));
const GhughutiAIPage = lazy(() => import('./pages/GhughutiAIPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsAdminPage = lazy(() => import('./pages/NewsAdminPage'));
const YouTubeAdminPage = lazy(() => import('./pages/YouTubeAdminPage'));
const FolkStoryPage = lazy(() => import('./pages/FolkStoryPage'));
const FolkStoriesIndexPage = lazy(() => import('./pages/FolkStoriesIndexPage'));
const GovtJobsPage = lazy(() => import('./pages/GovtJobsPage'));
const JobsAdminPage = lazy(() => import('./pages/JobsAdminPage'));
const SarkaariYojanaPage = lazy(() => import('./pages/SarkaariYojanaPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const VoiceRecordingPage = lazy(() => import('./pages/VoiceRecordingPage'));
const GarhwaliSikhaPage = lazy(() => import('./pages/GarhwaliSikhaPage'));
const PahadiKhanoPage = lazy(() => import('./pages/PahadiKhanoPage'));
const PahadiStorePage = lazy(() => import('./pages/PahadiStorePage'));
const PahadiPehnawaPage = lazy(() => import('./pages/PahadiPehnawaPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ArtGalleryPage = lazy(() => import('./pages/ArtGalleryPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const JhumeloPage = lazy(() => import('./pages/JhumeloPage'));

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
            <Suspense fallback={null}>
              <Footer />
              <FloatingPlayer />
              <HomeOnlyFloating />
            </Suspense>
            <BottomNav />
            <Suspense fallback={null}>
              <InstallBanner />
              <IntroSound />
              <RunningCharacter />
              <DoodleOverlay />
            </Suspense>
          </div>
        </ToastProvider>
      </MusicProvider>
    </AuthProvider>
  );
}

/** Renders the daily-product + Jhumelo floating icons only on the home page. */
function HomeOnlyFloating() {
  const { pathname } = useLocation();
  if (pathname !== '/') return null;
  return (
    <>
      <FloatingByoIcon />
      <FloatingDailyProduct />
    </>
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
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" /></div>}>
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
            <Route path="/art-gallery" element={<ArtGalleryPage />} />
            <Route path="/jhumelo" element={<JhumeloPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
