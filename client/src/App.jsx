import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import FloatingPlayer from './components/FloatingPlayer';
import InstallBanner from './components/InstallBanner';
import IntroSound from './components/IntroSound';
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
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import VoiceRecordingPage from './pages/VoiceRecordingPage';

// Protected route wrapper - redirects to login if not authenticated
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
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
        <div className="min-h-screen flex flex-col text-white" style={{ backgroundColor: '#14122a' }}>
          <Navbar />
          <main className="flex-1 pb-24 sm:pb-8">
            <Routes>
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
              <Route path="/voice-recording" element={<VoiceRecordingPage />} />
            </Routes>
          </main>
          <Footer />
          <FloatingPlayer />
          <BottomNav />
          <InstallBanner />
          <IntroSound />
        </div>
      </MusicProvider>
    </AuthProvider>
  );
}
