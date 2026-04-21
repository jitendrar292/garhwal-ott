import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import FloatingPlayer from './components/FloatingPlayer';
import InstallBanner from './components/InstallBanner';
import IntroSound from './components/IntroSound';
import { MusicProvider } from './context/MusicContext';
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
import PahadiAIPage from './pages/PahadiAIPage';
import NewsPage from './pages/NewsPage';
import NewsAdminPage from './pages/NewsAdminPage';
import YouTubeAdminPage from './pages/YouTubeAdminPage';
import FolkStoryPage from './pages/FolkStoryPage';
import FolkStoriesIndexPage from './pages/FolkStoriesIndexPage';

export default function App() {
  return (
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
            <Route path="/music" element={<MusicPage />} />
            <Route path="/shorts" element={<ShortsPage />} />
            <Route path="/podcast" element={<PodcastPage />} />
            <Route path="/pahadi-ai" element={<PahadiAIPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/admin" element={<NewsAdminPage />} />
            <Route path="/folk-story/:slug" element={<FolkStoryPage />} />
            <Route path="/folk-stories" element={<FolkStoriesIndexPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingPlayer />
        <BottomNav />
        <InstallBanner />
        <IntroSound />
      </div>
    </MusicProvider>
  );
}
