import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useConfetti } from '../hooks/useConfetti';
import WhatsAppShareBtn from './WhatsAppShareBtn';

export default function VideoCard({ video, compact }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToHistory } = useWatchHistory();
  const { fireHeartBurst } = useConfetti();
  const fav = isFavorite(video.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fav) {
      removeFavorite(video.id);
    } else {
      addFavorite(video);
      const rect = e.currentTarget.getBoundingClientRect();
      fireHeartBurst(
        (rect.left + rect.width / 2) / window.innerWidth,
        (rect.top + rect.height / 2) / window.innerHeight,
      );
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
    <motion.div
      role="article"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
    <Link
      to={`/watch/${video.id}`}
      onClick={() => addToHistory(video)}
      aria-label={video.title}
      className="group block rounded-2xl overflow-hidden surface-card-interactive"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} bg-white/95 rounded-full flex items-center justify-center
                          opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                          transition-all duration-300 shadow-elevation-3`}>
            <svg className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-surface-0 ml-0.5`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>

        {/* Action buttons — always visible on mobile, hover on desktop */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <WhatsAppShareBtn
            title={video.title}
            text={video.channelTitle || ''}
            url={`${window.location.origin}/watch/${video.id}`}
            compact
            onClick
            className="p-2 rounded-xl bg-black/50 backdrop-blur-sm border-transparent hover:border-[#25D366]"
          />
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white/80 hover:bg-secondary-500 hover:text-white transition-all duration-200"
            aria-label="Share video"
            title="Share"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-xl backdrop-blur-sm transition-all duration-200
                       ${fav
                         ? 'bg-accent-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                         : 'bg-black/50 text-white/80 hover:bg-accent-500 hover:text-white'
                       }`}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Duration badge (if available) */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium rounded-md">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-body-sm font-semibold text-white line-clamp-2 group-hover:text-primary-400 transition-colors duration-200">
          {video.title}
        </h3>
        <p className="text-caption text-white/40 mt-1.5 truncate group-hover:text-white/60 transition-colors">
          {video.channelTitle}
        </p>
      </div>
    </Link>
    </motion.div>
  );
}
