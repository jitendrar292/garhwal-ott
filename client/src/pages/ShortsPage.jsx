import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVideosByCategory } from '../api/youtube';
import INSTAGRAM_REELS from '../data/instagramReels';
import SEO from '../components/SEO';

// Interleave two arrays so the user sees a mix instead of all-shorts-then-all-reels.
function interleave(a, b) {
  const out = [];
  const len = Math.max(a.length, b.length);
  const seen = new Set();
  for (let i = 0; i < len; i++) {
    if (a[i] && !seen.has(a[i].id)) { out.push(a[i]); seen.add(a[i].id); }
    if (b[i] && !seen.has(b[i].id)) { out.push(b[i]); seen.add(b[i].id); }
  }
  return out;
}

const TABS = [
  { id: 'all',    label: 'सब / All',  emoji: '✨' },
  { id: 'shorts', label: 'Shorts',    emoji: '⚡' },
  { id: 'reels',  label: 'YT Reels',  emoji: '🎬' },
  { id: 'insta',  label: 'Insta',     emoji: '📸' },
];

// Load Instagram's embed.js once, then re-process whenever new blockquotes mount.
let _igScriptPromise = null;
function loadInstagramEmbedScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.instgrm?.Embeds) return Promise.resolve();
  if (_igScriptPromise) return _igScriptPromise;
  _igScriptPromise = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve(); // fail soft — blockquote will still show a link
    document.body.appendChild(s);
  });
  return _igScriptPromise;
}

function InstagramReelEmbed({ url }) {
  useEffect(() => {
    loadInstagramEmbedScript().then(() => {
      window.instgrm?.Embeds?.process?.();
    });
  }, [url]);
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: '#000',
        border: 0,
        margin: 0,
        maxWidth: '100%',
        width: '100%',
        minWidth: 0,
      }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-pink-400 text-sm">
        View on Instagram
      </a>
    </blockquote>
  );
}

export default function ShortsPage() {
  const [shorts, setShorts] = useState([]);
  const [reels, setReels]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  // Click-to-play: tracks which card indices the user has tapped to start.
  // Without this, scrolling the snap-feed would mount one YouTube iframe per
  // visible card — each loading the ~1MB embed bundle and burning quota.
  // We mount the iframe only for tapped indices; everything else stays a
  // lightweight thumbnail poster.
  const [startedSet, setStartedSet] = useState(() => new Set());
  const containerRef = useRef(null);

  // Tag Instagram entries so we can render the correct embed
  const instaList = useMemo(
    () => INSTAGRAM_REELS
      .filter((r) => r?.url)
      .map((r, i) => ({
        id: r.url,
        title: r.title || 'Instagram Reel',
        channelTitle: r.channel || 'Instagram',
        url: r.url,
        source: 'instagram',
        _key: `ig-${i}`,
      })),
    []
  );

  useEffect(() => {
    let alive = true;
    Promise.allSettled([
      // 10 per tab — keeps each YouTube quota call cheap and matches the
      // 5–10 max per-page policy used elsewhere in the app.
      getVideosByCategory('shorts', '', 10),
      getVideosByCategory('reels', '', 10),
    ]).then(([s, r]) => {
      if (!alive) return;
      if (s.status === 'fulfilled') setShorts((s.value.videos || []).map((v) => ({ ...v, source: 'youtube' })));
      if (r.status === 'fulfilled') setReels((r.value.videos || []).map((v) => ({ ...v, source: 'youtube' })));
    }).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  // Active list based on selected tab
  const videos = useMemo(() => {
    if (tab === 'shorts') return shorts;
    if (tab === 'reels')  return reels;
    if (tab === 'insta')  return instaList;
    // "All" — interleave YT shorts + YT reels, then sprinkle IG reels every 4 items
    const ytMix = interleave(shorts, reels);
    if (instaList.length === 0) return ytMix;
    const out = [];
    let igIdx = 0;
    ytMix.forEach((v, i) => {
      out.push(v);
      if ((i + 1) % 4 === 0 && igIdx < instaList.length) {
        out.push(instaList[igIdx++]);
      }
    });
    while (igIdx < instaList.length) out.push(instaList[igIdx++]);
    return out;
  }, [tab, shorts, reels, instaList]);

  // Reset to top when switching tabs
  useEffect(() => {
    setActiveIndex(0);
    // Drop any "started" iframes from the previous tab so we don't keep
    // off-screen YouTube players running in the background.
    setStartedSet(new Set());
    containerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [tab]);

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
  }, [videos]);

  // Re-process Instagram embeds whenever the visible list changes
  useEffect(() => {
    if (videos.some((v) => v.source === 'instagram')) {
      loadInstagramEmbedScript().then(() => window.instgrm?.Embeds?.process?.());
    }
  }, [videos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <SEO
        title="Pahadi Reels & Shorts - Garhwali Comedy, Dance & Vlogs"
        description="Scroll the best Pahadi Shorts, YouTube Reels and Instagram Reels — Garhwali comedy, folk dance, vlogs and trending clips from Uttarakhand creators."
        path="/shorts"
        keywords="Pahadi shorts, Garhwali reels, Pahadi reels, Uttarakhand shorts, Garhwali comedy reels"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Pahadi Reels & Shorts',
          url: 'https://pahaditube.in/shorts',
          description: 'Short-form Garhwali and Pahadi videos — comedy, dance, vlogs and trending reels.',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
        }}
      />
      {/* Header */}
      <div className="w-full max-w-md px-4 pt-4 pb-2 flex items-center gap-3">
        <div className="w-1 h-7 bg-gradient-to-b from-pink-400 to-red-500 rounded-full" />
        <h1 className="page-header">📱 Pahadi <span className="gradient-text">Reels</span></h1>
        <span className="text-xs text-gray-500 ml-auto">Tap to play</span>
      </div>

      {/* Tab switcher */}
      <div className="w-full max-w-md px-4 pb-2 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
              tab === t.id
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white border-transparent shadow'
                : 'bg-dark-800/60 text-gray-300 border-white/10 hover:bg-dark-700'
            }`}
          >
            <span className="mr-1">{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Vertical snap scroll container */}
      <div
        ref={containerRef}
        className="w-full max-w-md overflow-y-scroll snap-y snap-mandatory"
        style={{ height: 'calc(100dvh - 175px)' }}
      >
        {videos.map((video, i) => (
          <div
            key={video._key || `${tab}-${video.id}-${i}`}
            data-short-card={i}
            className="snap-start snap-always flex flex-col items-center justify-center px-3 py-2"
            style={{ height: 'calc(100dvh - 175px)' }}
          >
            {video.source === 'instagram' ? (
              // Instagram reel — handled by IG's own embed script
              <div className="w-full" style={{ maxHeight: 'calc(100dvh - 225px)', overflow: 'auto' }}>
                <InstagramReelEmbed url={video.url} />
                <div className="w-full mt-2 px-1 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{video.title}</p>
                    <p className="text-xs text-gray-500 truncate">{video.channelTitle}</p>
                  </div>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-3 py-1.5 rounded-full font-medium transition-opacity"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            ) : (
              // YouTube short / reel — click-to-play poster.
              // The iframe is mounted only after the user taps the card.
              <>
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-dark-800"
                  style={{ aspectRatio: '9/16', maxHeight: 'calc(100dvh - 225px)' }}>
                  {startedSet.has(i) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${encodeURIComponent(video.id)}?rel=0&modestbranding=1&autoplay=1&playsinline=1`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStartedSet((prev) => {
                        const next = new Set(prev);
                        next.add(i);
                        return next;
                      })}
                      className="absolute inset-0 w-full h-full group/poster"
                      aria-label={`Play ${video.title}`}
                    >
                      <img
                        src={video.thumbnail || `https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/hqdefault.jpg`}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover/poster:bg-black/55 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-600/90 group-hover/poster:bg-red-500
                                        flex items-center justify-center shadow-2xl
                                        transition-transform duration-200 group-hover/poster:scale-110">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  )}
                </div>

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
              </>
            )}
          </div>
        ))}

        {videos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500 px-6 text-center">
            <span className="text-5xl">{tab === 'insta' ? '📸' : '📱'}</span>
            {tab === 'insta' ? (
              <>
                <p className="font-medium">No Instagram reels added yet</p>
                <p className="text-xs">
                  Add public reel URLs to <code className="text-pink-400">client/src/data/instagramReels.js</code> to populate this tab.
                </p>
              </>
            ) : (
              <p>No {tab === 'reels' ? 'reels' : tab === 'shorts' ? 'shorts' : 'videos'} available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
