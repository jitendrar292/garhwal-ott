import { useFavorites } from '../hooks/useFavorites';
import VideoCard from '../components/VideoCard';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="page-header mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
        ♥ Your <span className="gradient-text">Favorites</span>
      </h2>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💔</div>
          <p className="text-gray-500 text-xl">No favorites yet</p>
          <p className="text-gray-600 text-sm mt-2">Click the heart icon on any video to save it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {favorites.map((video, index) => {
            // Patch missing thumbnails from old favorites saved with empty strings
            const patched = {
              ...video,
              thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
              title: video.title || 'Pahadi Video',
            };
            return (
              <div key={video.id} style={{ animationDelay: `${index * 50}ms` }}>
                <VideoCard video={patched} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
