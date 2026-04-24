import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import { getVideosByCategory } from '../api/youtube';
import SEO from '../components/SEO';

const CATEGORY_SEO = {
  movies:     { title: 'Garhwali Movies - Watch Pahadi Films Online', desc: 'Watch full Garhwali movies and Pahadi films from Uttarakhand — classic and latest releases curated in one place.' },
  songs:      { title: 'Garhwali Songs - Pahadi Music & Hits', desc: 'Latest and evergreen Garhwali songs, Pahadi hits and Uttarakhandi music from top singers and labels.' },
  comedy:     { title: 'Garhwali Comedy - Pahadi Funny Videos', desc: 'Hilarious Garhwali comedy sketches and Pahadi funny videos from Uttarakhand creators.' },
  devotional: { title: 'Garhwali Bhajan & Jaagar - Devotional Songs', desc: 'Garhwali bhajans, Jaagar and devotional songs from Uttarakhand temples and folk traditions.' },
  jaagar:     { title: 'Garhwali Jaagar & Devotional Music', desc: 'Traditional Garhwali Jaagar performances and devotional music from Uttarakhand.' },
  folkdance:  { title: 'Garhwali Folk Dance - Chaunphula, Thadya, Jhumelo', desc: 'Watch Garhwali folk dances — Chaunphula, Thadya, Jhumelo and Pahadi traditional performances.' },
  mela:       { title: 'Uttarakhand Mela & Festivals', desc: 'Coverage of Uttarakhand melas, fairs and Pahadi festivals from across Garhwal and Kumaon.' },
  theatre:    { title: 'Garhwali Theatre & Cultural Programs', desc: 'Garhwali theatre, cultural performances and stage shows celebrating Pahadi heritage.' },
};

const CATEGORY_LABELS = {
  movies: '🎬 Garhwali Movies',
  songs: '🎵 Garhwali Songs',
  comedy: '😂 Garhwali Comedy',
  devotional: '� Jaagar & Devotional',
  folkdance: '💃 Folk Dances',
  jaagar: '🔱 Jaagar & Devotional',
  mela: '🎪 Mela & Festivals',
  theatre: '🎭 Theatre & Culture',
};

export default function CategoryPage() {
  const { category } = useParams();
  const [state, setState] = useState({ videos: [], loading: true, error: null, nextPageToken: null, loadingMore: false });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ videos: [], loading: true, error: null, nextPageToken: null, loadingMore: false });
      try {
        const data = await getVideosByCategory(category, '', 24);
        if (!cancelled) {
          setState({ videos: data.videos, loading: false, error: null, nextPageToken: data.nextPageToken, loadingMore: false });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: err.message }));
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [category]);

  const loadMore = useCallback(async () => {
    if (!state.nextPageToken || state.loadingMore) return;
    setState((s) => ({ ...s, loadingMore: true }));
    try {
      const data = await getVideosByCategory(category, state.nextPageToken, 24);
      setState((s) => ({
        ...s,
        videos: [...s.videos, ...data.videos],
        nextPageToken: data.nextPageToken,
        loadingMore: false,
      }));
    } catch {
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, [category, state.nextPageToken, state.loadingMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <SEO
        title={(CATEGORY_SEO[category] && CATEGORY_SEO[category].title) || `${CATEGORY_LABELS[category] || category} - PahadiTube`}
        description={(CATEGORY_SEO[category] && CATEGORY_SEO[category].desc) || `Browse ${category} videos on PahadiTube — Garhwali and Pahadi content from Uttarakhand.`}
        path={`/category/${category}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: CATEGORY_LABELS[category] || category,
          url: `https://pahaditube.in/category/${category}`,
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
        }}
      />
      <VideoGrid
        title={CATEGORY_LABELS[category] || category}
        videos={state.videos}
        loading={state.loading}
        error={state.error}
        onLoadMore={loadMore}
        hasMore={!!state.nextPageToken}
        loadingMore={state.loadingMore}
      />
    </div>
  );
}
