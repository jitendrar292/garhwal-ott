import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Wikimedia Commons "Special:FilePath" auto-redirects to the latest upload.
// We pass `?width=1600` so Commons returns a resized JPEG instead of the
// original (often 5+ MB). If any slide 404s the onError handler hides it.
const wmc = (file, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

const SLIDES = [
  // ===== Local curated photos =====
  {
    src: '/slider/20210711_114700.jpg',
    title: 'पहाड़ की गोद',
    subtitle: 'Misty terraced fields — the timeless beauty of Garhwal',
    link: '/category/vlogs',
  },
  {
    src: '/slider/ramman.png',
    title: 'रम्माण महोत्सव',
    subtitle: 'UNESCO-listed Ramman festival — living heritage of Garhwal',
    link: '/category/devotional',
  },
  {
    src: '/slider/nandadevi.jpeg',
    title: 'नंदा देवी राज जात',
    subtitle: 'Sacred Nanda Devi pilgrimage — a journey of faith in the Himalayas',
    link: '/category/devotional',
  },
  {
    src: '/slider/20170516_073914.jpg',
    title: 'देवता की डोली',
    subtitle: 'A vibrant doli procession celebrating Garhwali traditions',
    link: '/category/devotional',
  },
  {
    src: '/slider/aanaj-kootna.jpeg',
    title: 'आनाज कूटना',
    subtitle: 'Traditional grain threshing — a timeless Pahadi practice',
    link: '/category/vlogs',
  },
  {
    src: '/slider/kaafal.png',
    title: 'काफल',
    subtitle: 'The wild mountain berry — pride of Uttarakhand\'s forests',
    link: '/category/vlogs',
  },
  {
    src: '/slider/ghughti.jpg',
    title: 'घुघुती',
    subtitle: 'The beloved Pahadi bird — symbol of longing and home',
    link: '/category/songs',
  },
  {
    src: '/slider/hisalu.png',
    title: 'हिसालू',
    subtitle: 'Golden wild raspberry of the Himalayas — a taste of childhood',
    link: '/category/vlogs',
  },
  {
    src: '/slider/maalta.png',
    title: 'माल्टा',
    subtitle: 'Pahadi malta — the sweet citrus jewel of Uttarakhand',
    link: '/category/vlogs',
  },

  // ===== Online cultural / heritage images (Wikimedia Commons, CC) =====
  {
    src: wmc('Kedarnath_Temple.jpg'),
    title: 'केदारनाथ',
    subtitle: 'Kedarnath — ancient Shiva shrine in the Garhwal Himalayas',
    link: '/category/devotional',
    credit: 'Wikimedia Commons',
  },
  {
    src: wmc('Badrinath_Temple.jpg'),
    title: 'बद्रीनाथ',
    subtitle: 'Badrinath Dham — sacred Vishnu temple of the Char Dham',
    link: '/category/devotional',
    credit: 'Wikimedia Commons',
  },
  {
    src: wmc('Valley_of_flowers_uttaranchal_full_view.JPG'),
    title: 'फूलों की घाटी',
    subtitle: 'Valley of Flowers — UNESCO World Heritage in Chamoli',
    link: '/category/vlogs',
    credit: 'Wikimedia Commons',
  },
  {
    src: wmc('Hemkund_Sahib.jpg'),
    title: 'हेमकुंड साहिब',
    subtitle: 'Hemkund Sahib — Sikh pilgrimage shrine at 4,632 m',
    link: '/category/devotional',
    credit: 'Wikimedia Commons',
  },
  {
    src: wmc('Auli_in_Uttarakhand.jpg'),
    title: 'औली',
    subtitle: 'Auli — alpine meadows and snow-capped peaks of Garhwal',
    link: '/category/vlogs',
    credit: 'Wikimedia Commons',
  },
  {
    src: wmc('Nainital_Lake_002.jpg'),
    title: 'नैनी ताल',
    subtitle: 'Naini Lake — the emerald heart of Kumaon',
    link: '/category/vlogs',
    credit: 'Wikimedia Commons',
  },
  {
    src: wmc('Jageshwar_Temple_complex.jpg'),
    title: 'जागेश्वर',
    subtitle: 'Jageshwar — cluster of 124 stone temples in Almora',
    link: '/category/devotional',
    credit: 'Wikimedia Commons',
  },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(() => new Set());

  // Drop slides whose images failed to load (e.g. 404 from Commons).
  const slides = useMemo(
    () => SLIDES.filter((s) => !failed.has(s.src)),
    [failed]
  );
  const total = slides.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (current >= total && total > 0) setCurrent(0);
  }, [current, total]);

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
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                       ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={slide.src}
              alt={slide.title}
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out
                         ${index === current ? 'scale-110' : 'scale-100'}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={() => {
                setFailed((prev) => {
                  if (prev.has(slide.src)) return prev;
                  const next = new Set(prev);
                  next.add(slide.src);
                  return next;
                });
              }}
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
            {slides[current]?.title}
          </p>
          <p
            key={`sub-${current}`}
            className="text-gray-300 text-sm sm:text-lg mt-2 drop-shadow animate-fade-in-up"
            style={{ animationDelay: '150ms' }}
          >
            {slides[current]?.subtitle}
          </p>
          {slides[current]?.link && (
            <Link
              key={`cta-${current}`}
              to={slides[current].link}
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full
                         bg-white/15 hover:bg-white/25 active:bg-white/10
                         backdrop-blur-sm border border-white/20 hover:border-white/40
                         text-white text-sm font-semibold
                         transition-all duration-200 hover:scale-105 active:scale-95
                         animate-fade-in-up shadow-lg"
              style={{ animationDelay: '280ms' }}
            >
              Explore
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
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
