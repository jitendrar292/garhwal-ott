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

// Unique editorial descriptions per category — adds original content value for each page
const CATEGORY_DESCRIPTIONS = {
  movies: 'Garhwali cinema has evolved from low-budget local productions to professionally crafted feature films that showcase the landscapes, dialects, and cultural narratives of Uttarakhand. From the pioneering works of directors who first brought Garhwali stories to the screen, to modern releases that tackle social themes while preserving linguistic authenticity — this collection brings together the best of Pahadi filmmaking. Whether you\'re looking for family dramas set in mountain villages, action films inspired by local legends, or heartfelt romances in the Garhwali language, you\'ll find them here.',
  songs: 'Garhwali music is the soul of Uttarakhand — from the soulful ballads of Narendra Singh Negi to the energetic DJ remixes that dominate pahadi weddings. This collection spans decades of Pahadi musical heritage: traditional folk songs passed down through generations, devotional hymns sung at temple festivals, romantic duets from Garhwali cinema, and viral hits from emerging artists like Saurav Maithani, Priyanka Meher, and Kishan Mahipal. Every song carries the essence of the mountains — stories of love, separation (virha), nature, and the unbreakable bond between Pahadis and their homeland.',
  comedy: 'Garhwali comedy brings the everyday humour of mountain life to your screen. From the legendary Ghananand Bhandari\'s "Boda-Bodi" characters to new-age sketch creators on YouTube, Pahadi comedy reflects the witty observations, dialect jokes, and situational humour unique to Uttarakhandi culture. These sketches often feature relatable village characters — the clever housewife, the lazy husband, the scheming neighbour — and use authentic Garhwali dialogue that resonates with anyone who grew up in or around Uttarakhand.',
  devotional: 'The devotional music of Garhwal is deeply rooted in centuries-old spiritual traditions. Jaagar — the ritualistic invocation of local deities through song and drum — is unique to Uttarakhand and recognised as an intangible cultural heritage. This collection includes Jaagar performances by masters like Pritam Bhartwan, bhajans dedicated to Kedarnath, Badrinath, and local devtas, and aarti recordings from temples across the region. These are not just songs — they are living traditions that connect the Pahadi diaspora to their ancestral spiritual practices.',
  jaagar: 'Jaagar is the ancient Garhwali practice of invoking local deities through rhythmic drumming (dhol-damau) and narrative singing. Performed by a Jagariya (the lead singer) with a Dangariyan (the medium), Jaagar ceremonies are integral to village festivals, healing rituals, and community gatherings in Uttarakhand. This page brings you authentic Jaagar performances, devotional bhajans, and temple music that preserves this living tradition of Devbhoomi.',
  folkdance: 'The folk dances of Garhwal and Kumaon are vibrant expressions of community celebration. Chaunphula — the graceful four-step dance performed during spring festivals; Thadya — the energetic group dance at weddings and fairs; Jhumelo — the swaying dance of harvest celebrations; and Langvir Nritya — the acrobatic warrior dance. Each form tells a story of seasons, love, valour, or devotion, accompanied by traditional instruments like dhol, damau, and ransingha. Watch these authentic performances and feel the rhythm of the mountains.',
  mela: 'Uttarakhand\'s melas (fairs) and festivals are the heartbeat of Pahadi social life. From the legendary Nanda Devi Raj Jaat Yatra — the longest religious procession in Asia — to local village melas celebrating seasonal harvests, each event brings communities together with music, dance, trade, and spiritual rituals. This collection covers major events including Bissu Mela, Uttarayani, Gindari Mela, Bagwal, and more, offering a window into the living cultural heritage of the Garhwal and Kumaon regions.',
  theatre: 'Garhwali theatre and cultural programs represent the performing arts traditions of Uttarakhand. From community stage shows ("nautanki" and "ramlila" in Pahadi style) to modern experimental theatre that blends traditional folk narratives with contemporary storytelling — these performances keep the oral traditions of the mountains alive. This section also includes recordings of cultural programs from Pahadi diaspora events in Delhi, Mumbai, and other cities where Uttarakhandi communities preserve their heritage through performance.',
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

const MOVIES_CONTENT_BLOCKS = [
  {
    title: 'What You Will Find',
    body: 'Classic Garhwali films, modern indie cinema, village dramas, family stories, social issue films, and culturally rooted storytelling from Garhwal and Kumaon creators.',
  },
  {
    title: 'Why These Films Matter',
    body: 'Movies preserve dialects, folk expressions, and regional identity. Watching and sharing Garhwali cinema helps keep the language and mountain narratives alive for younger generations.',
  },
  {
    title: 'How To Explore Better',
    body: 'Open any movie, then use Script (Text) to read captions in plain text, copy lines, or download script notes. This is useful for language learners and cultural documentation.',
  },
];

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
    <div className="max-w-full mx-auto px-4 sm:px-6 py-10">
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

      {/* Editorial description — unique original content per category */}
      {CATEGORY_DESCRIPTIONS[category] && (
        <div className="mb-8">
          <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-4xl">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
        </div>
      )}

      {category === 'movies' && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOVIES_CONTENT_BLOCKS.map((item) => (
            <article key={item.title} className="rounded-2xl bg-surface-1/70 border border-white/10 p-4">
              <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      )}

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
