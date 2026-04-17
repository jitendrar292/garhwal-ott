import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVideosByCategory } from '../api/youtube';

export default function ShortsPage() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    getVideosByCategory('shorts', '', 12)
      .then((data) => setShorts(data.videos))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Track which card is visible via IntersectionObserver
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('[data-short-card]');
    if (!cards?.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveIndex(Number(e.target.dataset.shortCard));
          }
        });
      },
      { threshold: 0.6 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [shorts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md px-4 pt-4 pb-2 flex items-center gap-3">
        <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-red-500 rounded-full" />
        <h1 className="text-lg font-bold">📱 Pahadi Shorts</h1>
        <span className="text-xs text-gray-500 ml-auto">Scroll to explore</span>
      </div>

      {/* Vertical snap scroll container */}
      <div
        ref={containerRef}
        className="w-full max-w-md overflow-y-scroll snap-y snap-mandatory"
        style={{ height: 'calc(100dvh - 130px)' }}
      >
        {shorts.map((video, i) => (
          <div
            key={video.id}
            data-short-card={i}
            className="snap-start snap-always flex flex-col items-center justify-center px-3 py-2"
            style={{ height: 'calc(100dvh - 130px)' }}
          >
            {/* Portrait video card */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-dark-800"
              style={{ aspectRatio: '9/16', maxHeight: 'calc(100dvh - 180px)' }}>
              <iframe
                src={`https://www.youtube.com/embed/${encodeURIComponent(video.id)}?rel=0&modestbranding=1${activeIndex === i ? '&autoplay=1' : ''}`}
                title={video.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Info bar below video */}
            <div className="w-full mt-2 px-1 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{video.title}</p>
                <p className="text-xs text-gray-500 truncate">{video.channelTitle}</p>
              </div>
              <a
                href={`https://www.youtube.com/shorts/${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-full font-medium transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        ))}

        {shorts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
            <span className="text-5xl">📱</span>
            <p>No shorts available</p>
          </div>
        )}
      </div>
    </div>
  );
}
