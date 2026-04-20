import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function VideoCard({ video, compact }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(video.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fav) {
      removeFavorite(video.id);
    } else {
      addFavorite(video);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/watch/${video.id}`;
    const shareData = {
      title: video.title,
      text: `${video.title} — ${video.channelTitle || ''}`.trim(),
      url,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => alert('Link copied!'))
        .catch(() => {});
    }
  };

  return (
    <Link
      to={`/watch/${video.id}`}
      className="group block card-hover rounded-xl overflow-hidden bg-dark-800 animate-fade-in-up"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} bg-white/90 rounded-full flex items-center justify-center
                          opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
                          transition-all duration-300`}>
            <svg className={`${compact ? 'w-4 h-4' : 'w-7 h-7'} text-dark-900 ml-0.5`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200
                     ${fav
                       ? 'bg-red-500 text-white'
                       : 'bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white'
                     }`}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* Share button */}
        <button
          onClick={handleShare}
          className="absolute top-2 right-12 p-2 rounded-full transition-all duration-200
                     bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-primary-500 hover:text-white"
          aria-label="Share"
          title="Share"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 truncate">{video.channelTitle}</p>
      </div>
    </Link>
  );
}
