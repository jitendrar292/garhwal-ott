import { useState, useEffect, useCallback } from 'react';

// Add your images here — just drop files into client/public/slider/ and add the path below
const SLIDES = [
  { src: '/slider/20210711_114700.jpg', alt: 'Garhwali Culture' },
  // Add more images:
  // { src: '/slider/image2.jpg', alt: 'Description' },
  // { src: '/slider/image3.jpg', alt: 'Description' },
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

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, paused, total]);

  if (total === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-dark-700 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <div className="relative aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
              {/* Caption */}
              {slide.alt && (
                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                  <p className="text-white text-lg sm:text-2xl font-bold drop-shadow-lg">
                    {slide.alt}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows (only if multiple slides) */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                       bg-black/40 hover:bg-black/70 text-white flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                       bg-black/40 hover:bg-black/70 text-white flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                         ${index === current
                           ? 'bg-primary-400 w-6'
                           : 'bg-white/40 hover:bg-white/70'
                         }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
