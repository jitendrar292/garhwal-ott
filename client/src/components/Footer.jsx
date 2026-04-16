import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark-800/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-400">PahadiTube</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link to="/category/movies" className="hover:text-gray-300 transition-colors">Movies</Link>
            <Link to="/category/songs" className="hover:text-gray-300 transition-colors">Songs</Link>
            <Link to="/favorites" className="hover:text-gray-300 transition-colors">Favorites</Link>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} PahadiTube. All videos are from YouTube.
          </p>
        </div>
      </div>
    </footer>
  );
}
