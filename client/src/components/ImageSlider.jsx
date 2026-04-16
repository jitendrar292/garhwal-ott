import { useState, useEffect, useCallback } from 'react';

const SLIDES = [
  {
    src: '/slider/20210711_114700.jpg',
    title: 'Misty Green Valleys',
    subtitle: 'The breathtaking terraced hills of Garhwal',
  },
  {
    src: '/slider/20170516_073914.jpg',
    title: 'Garhwali Festival',
    subtitle: 'A vibrant doli procession celebrating local traditions',
  },
  {
    src: '/slider/20191228_094933.jpg',
    title: 'Life in the Mountains',
    subtitle: 'Snow-capped peaks and warm village moments',
  },
  {
    src: '/slider/20191228_094951.jpg',
    title: 'Village Bonds',
    subtitle: 'Simple joys amidst the Himalayan landscape',
  },
  {
    src: '/slider/20200711_162530.jpg',
    title: 'Traditional Stone House',
    subtitle: 'Heritage Garhwali architecture with stone-slate roofs',
  },
  {
    src: '/slider/IMG_4129.jpg',
    title: 'Pahadi Serenity',
    subtitle: 'Peaceful moments in the heart of Uttarakhand',
  },
  {
    src: '/slider/IMG_4652.jpg',
    title: 'Mountain Splendour',
    subtitle: 'Nature\u2019s beauty across the Garhwal hills',
  },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused, total]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  if (total === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden shadow-2xl shadow-black/40 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Image slideshow"
    >
      {/* Slides with crossfade + Ken Burns */}
      <div className="relative aspect-[16/7] sm:aspect-[3.5/1] bg-dark-800">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                       ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={slide.src}
              alt={slide.title}
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out
                         ${index === current ? 'scale-110' : 'scale-100'}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-dark-900/70 via-transparent to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 z-30 p-6 sm:p-10 max-w-xl">
          <p
            key={`title-${current}`}
            className="text-white text-2xl sm:text-4xl font-extrabold drop-shadow-lg
                       animate-fade-in-up"
          >
            {SLIDES[current].title}
          </p>
          <p
            key={`sub-${current}`}
            className="text-gray-300 text-sm sm:text-lg mt-2 drop-shadow animate-fade-in-up"
            style={{ animationDelay: '150ms' }}
          >
            {SLIDES[current].subtitle}
          </p>
        </div>

        {/* Slide counter badge */}
        <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-sm rounded-full
                        px-3 py-1 text-xs text-white/80 font-medium">
          {current + 1} / {total}
        </div>
      </div>

      {/* Nav arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full
                       bg-black/30 backdrop-blur-sm border border-white/10
                       hover:bg-primary-500/80 hover:border-primary-400
                       text-white flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-all duration-300
                       hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full
                       bg-black/30 backdrop-blur-sm border border-white/10
                       hover:bg-primary-500/80 hover:border-primary-400
                       text-white flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-all duration-300
                       hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Progress dots */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500 bg-white/20"
              style={{ width: index === current ? '2rem' : '0.5rem' }}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === current && (
                <div
                  className="absolute inset-0 bg-primary-400 rounded-full"
                  style={{
                    animation: paused ? 'none' : 'progress 5s linear',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
