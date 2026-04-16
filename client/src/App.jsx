import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import PlayerPage from './pages/PlayerPage';
import FavoritesPage from './pages/FavoritesPage';
import FeedbackPage from './pages/FeedbackPage';
import FeedbackAdminPage from './pages/FeedbackAdminPage';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="h-[100dvh] flex flex-col bg-dark-950 text-white overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/watch/:videoId" element={<PlayerPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/feedback/admin" element={<FeedbackAdminPage />} />
        </Routes>
        {!isHome && <Footer />}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
