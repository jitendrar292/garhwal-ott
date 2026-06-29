import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import { searchVideos } from '../api/youtube';
import STORIES from '../data/folkStories';
import LYRICS_MAP from '../data/lyrics';
import { BLOG_POSTS } from '../data/cultureLibrary';

const REEL_WORDS_RE = /\b(shorts?|reels?|instagram|insta)\b/i;
const CLEAN_TAIL_RE = /\s*\([^)]*\)|\s*\[[^\]]*\]|\s*\|.*$/g;

const normalizeTitle = (title = '') =>
  title
    .toLowerCase()
    .replace(CLEAN_TAIL_RE, '')
    .replace(/\b(official|video|full|song|audio|lyrics?|hd|4k|remix)\b/g, '')
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const filterReels = (items = []) =>
  items.filter((v) => {
    const hay = `${v?.title || ''} ${v?.channelTitle || ''}`;
    return !REEL_WORDS_RE.test(hay);
  });

const mergeUniqueByTitle = (existing = [], incoming = []) => {
  const byVideoId = new Set(existing.map((v) => v.id));
  const byTitle = new Set(existing.map((v) => normalizeTitle(v.title)).filter(Boolean));
  const merged = [...existing];

  for (const video of incoming) {
    if (!video?.id || byVideoId.has(video.id)) continue;
    const key = normalizeTitle(video.title);
    if (key && byTitle.has(key)) continue;
    byVideoId.add(video.id);
    if (key) byTitle.add(key);
    merged.push(video);
  }
  return merged;
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [state, setState] = useState({ videos: [], loading: false, error: null, nextPageToken: null, loadingMore: false });

  // Local content search
  const localResults = useMemo(() => {
    if (!query || query.trim().length < 2) return { stories: [], lyrics: [], articles: [] };
    const q = query.toLowerCase();

    const stories = STORIES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q)
    ).slice(0, 5);

    const lyrics = Object.entries(LYRICS_MAP)
      .filter(([, v]) => v.title?.toLowerCase().includes(q) || v.artist?.toLowerCase().includes(q))
      .slice(0, 5)
      .map(([id, v]) => ({ id, ...v }));

    const articles = BLOG_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.sections?.some((sec) => sec.heading.toLowerCase().includes(q) || sec.body.toLowerCase().includes(q))
    ).slice(0, 4);

    return { stories, lyrics, articles };
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    if (!query) {
      setState({ videos: [], loading: false, error: null, nextPageToken: null, loadingMore: false });
      return;
    }
    async function load() {
      setState({ videos: [], loading: true, error: null, nextPageToken: null, loadingMore: false });
      try {
        const data = await searchVideos(query, '', 10);
        if (!cancelled) {
          const cleaned = mergeUniqueByTitle([], filterReels(data.videos || []));
          setState({ videos: cleaned, loading: false, error: null, nextPageToken: data.nextPageToken, loadingMore: false });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: err.message }));
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [query]);

  const loadMore = useCallback(async () => {
    if (!state.nextPageToken || state.loadingMore) return;
    setState((s) => ({ ...s, loadingMore: true }));
    try {
      const data = await searchVideos(query, state.nextPageToken, 10);
      setState((s) => ({
        ...s,
        videos: mergeUniqueByTitle(s.videos, filterReels(data.videos || [])),
        nextPageToken: data.nextPageToken,
        loadingMore: false,
      }));
    } catch {
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, [query, state.nextPageToken, state.loadingMore]);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 py-10">
      {!query ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">Enter a search term to find Pahadi videos</p>
        </div>
      ) : (
        <>
          {/* Local content results */}
          {(localResults.stories.length > 0 || localResults.lyrics.length > 0 || localResults.articles.length > 0) && (
            <div className="mb-8 space-y-6">
              <h2 className="text-base font-semibold text-white/60 uppercase tracking-widest">On PahadiTube</h2>

              {/* Folk Stories */}
              {localResults.stories.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-amber-400/70 uppercase tracking-widest mb-3">📖 Folk Stories</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {localResults.stories.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/folk-story/${s.slug}`}
                        className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] hover:border-white/20 transition-all"
                      >
                        <span className="text-2xl shrink-0">{s.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold text-white line-clamp-1">{s.name}</p>
                          <p className="text-xs text-white/50 mt-1 line-clamp-2">{s.blurb}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Lyrics */}
              {localResults.lyrics.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-primary-400/70 uppercase tracking-widest mb-3">🎵 Song Lyrics</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {localResults.lyrics.map((s) => (
                      <Link
                        key={s.id}
                        to={`/music?lyric=${s.id}`}
                        className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] hover:border-white/20 transition-all"
                      >
                        <span className="text-2xl shrink-0">🎶</span>
                        <div>
                          <p className="text-sm font-semibold text-white line-clamp-1">{s.title}</p>
                          <p className="text-xs text-white/50 mt-1">{s.artist} · {s.language}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Culture Library */}
              {localResults.articles.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-emerald-400/70 uppercase tracking-widest mb-3">🏔️ Culture Library</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {localResults.articles.map((p) => (
                      <Link
                        key={p.slug}
                        to={`/culture#${p.slug}`}
                        className="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] hover:border-white/20 transition-all"
                      >
                        <p className="text-sm font-semibold text-white line-clamp-1">{p.title}</p>
                        <p className="text-xs text-white/50 mt-1">{p.readTime} · {p.author}</p>
                        <p className="text-xs text-white/40 mt-1.5 line-clamp-2">{p.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <hr className="border-white/[0.07]" />
            </div>
          )}

          {/* YouTube videos */}
          <VideoGrid
            title={`Videos for "${query}"`}
            videos={state.videos}
            loading={state.loading}
            error={state.error}
            onLoadMore={loadMore}
            hasMore={!!state.nextPageToken}
            loadingMore={state.loadingMore}
          />
        </>
      )}
    </div>
  );
}
