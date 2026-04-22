import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotifyButton from '../components/NotifyButton';
import SEO from '../components/SEO';

const CATEGORIES = [
  { id: 'all', label: 'सब / All', emoji: '📰' },
  { id: 'general', label: 'सामान्य', emoji: '📋' },
  { id: 'politics', label: 'राजनीति', emoji: '🏛️' },
  { id: 'culture', label: 'संस्कृति', emoji: '🪔' },
  { id: 'sports', label: 'खेल', emoji: '🏏' },
  { id: 'weather', label: 'मौसम', emoji: '⛰️' },
  { id: 'development', label: 'विकास', emoji: '🏗️' },
];

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState(null); // article id
  const [fullBodies, setFullBodies] = useState({}); // id -> body text

  useEffect(() => {
    let alive = true;
    const load = () => {
      setLoading(true);
      fetch('/api/news', { cache: 'no-store' })
        .then((r) => r.json())
        .then((data) => {
          if (alive) setArticles(data.articles || []);
        })
        .catch(() => {})
        .finally(() => alive && setLoading(false));
    };
    load();

    // Refetch when the user clicks a push notification (handled in sw.js)
    // or when the tab becomes visible again — ensures latest news is shown.
    const onSwMessage = (event) => {
      if (event.data?.type === 'NOTIFICATION_CLICK') load();
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', onSwMessage);
    }
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      alive = false;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', onSwMessage);
      }
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const filtered = category === 'all'
    ? articles
    : articles.filter((a) => a.category === category);

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <SEO
        title="Pahadi News - Latest Uttarakhand & Garhwali Samachar"
        description="Daily Pahadi news from Uttarakhand — politics, culture, sports, weather and development updates from Garhwal and Kumaon, in Hindi and Garhwali."
        path="/news"
        keywords="Pahadi news, Uttarakhand news, Garhwali samachar, Kumaon news, Garhwal news, Uttarakhand politics, Uttarakhand weather"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Pahadi News - Uttarakhand Samachar',
          url: 'https://pahaditube.in/news',
          description: 'Daily Uttarakhand and Garhwali news covering politics, culture, sports, weather and development.',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
        }}
      />
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">पहाड़ी समाचार</h1>
          <p className="text-sm text-gray-400">Local News from Devbhoomi Uttarakhand</p>
        </div>
        <NotifyButton />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scroll-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategory(cat.id); setExpanded(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-white text-black shadow-md'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            <span className="mr-1">{cat.emoji}</span>{cat.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-dark-800 p-4 space-y-3">
              <div className="h-40 skeleton rounded-xl" />
              <div className="h-5 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">📰</span>
          <p className="text-gray-400 text-lg">अभी कोई समाचार नहीं</p>
          <p className="text-gray-500 text-sm mt-1">No news articles yet — check back soon!</p>
        </div>
      )}

      {/* Articles */}
      <div className="space-y-5">
        {filtered.map((article) => (
          <article
            key={article.id}
            className="rounded-2xl bg-dark-800 border border-white/[0.06] overflow-hidden hover:border-primary-500/30 transition-colors"
          >
            {article.imageUrl && (
              <div className="aspect-[16/9] sm:aspect-[2.4/1] overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full font-medium">
                  {article.category || 'general'}
                </span>
                <span className="text-xs text-gray-500">{formatDate(article.createdAt)}</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-snug">{article.title}</h2>
              {article.summary && (
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{article.summary}</p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => {
                    if (expanded === article.id) {
                      setExpanded(null);
                    } else {
                      setExpanded(article.id);
                      if (!fullBodies[article.id]) {
                        fetch(`/api/news/${article.id}`)
                          .then((r) => r.json())
                          .then((data) => {
                            if (data.article?.body) {
                              setFullBodies((prev) => ({ ...prev, [article.id]: data.article.body }));
                            }
                          })
                          .catch(() => {});
                      }
                    }
                  }}
                  className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  {expanded === article.id ? 'कम दिखाएं ▲' : 'पूरा पढ़ें ▼'}
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/news`;
                    const text = `${article.title}\n\n${article.summary || ''}\n\n${url}`;
                    if (navigator.share) {
                      navigator.share({ title: article.title, text: article.summary || article.title, url }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(text).then(() => alert('Link copied!')).catch(() => {});
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  title="Share"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
              {expanded === article.id && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {fullBodies[article.id] || 'Loading...'}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
