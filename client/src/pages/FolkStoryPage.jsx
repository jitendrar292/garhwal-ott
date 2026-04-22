import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { folkStories, getFolkStoryWithBody } from '../data/folkStories';
import SEO from '../components/SEO';

// Full-text reader for a single Garhwali folk-story. The story body is loaded
// via dynamic import so the heavy ~50 KB Devanagari bundle never lands in the
// homepage chunk.
export default function FolkStoryPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, story: null });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, story: null });
    getFolkStoryWithBody(slug).then((story) => {
      if (!cancelled) setState({ loading: false, story });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center text-gray-400">
        लोक-गाथा लोड हो रही है…
      </div>
    );
  }

  if (!state.story) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-gray-300 mb-4">यो लोक-गाथा नी मिली।</p>
        <Link to="/" className="text-primary-400 hover:underline">← घौर वापस</Link>
      </div>
    );
  }

  const { name, blurb, emoji, body, url } = state.story;
  const paragraphs = (body || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  // Promote other stories at the bottom — exclude the current one.
  const others = folkStories.filter((s) => s.slug !== slug);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      <SEO
        title={`${name} - Garhwali Folk Story`}
        description={blurb || `${name} — a Garhwali folk story (लोक-गाथा) from Uttarakhand.`}
        path={`/folk-story/${slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: name,
          description: blurb,
          inLanguage: 'hi',
          articleSection: 'Garhwali Folk Stories',
          mainEntityOfPage: `https://pahaditube.in/folk-story/${slug}`,
          publisher: { '@id': 'https://pahaditube.in/#organization' },
        }}
      />
      <Link to="/" className="text-sm text-gray-400 hover:text-primary-400 inline-flex items-center gap-1 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        सब लोक-गाथा
      </Link>

      <header className="mb-8 border-b border-dark-700 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">{emoji}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-100 leading-tight">{name}</h1>
            <p className="text-xs text-gray-500 mt-1">गढ़वाली लोक-गाथा</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mt-3 italic">{blurb}</p>
      </header>

      <article className="prose prose-invert max-w-none text-gray-200 leading-loose text-[1.05rem]">
        {paragraphs.map((para, i) => (
          <p key={i} className="mb-4 whitespace-pre-line">{para}</p>
        ))}
      </article>

      <footer className="mt-10 pt-6 border-t border-dark-700 text-xs text-gray-500 space-y-2">
        <p>
          स्रोत:{' '}
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
              himlingo.com
            </a>
          ) : (
            'himlingo.com'
          )}
          {' '}— एक समुदाय-आधारित पहाड़ी भाषा संरक्षण परियोजना।
        </p>
        <p>
          यो गाथा का बारे मा घुघुती AI सी पुछण च त{' '}
          <Link to="/ghughuti-ai" className="text-primary-400 hover:underline">घुघुती AI</Link> मा जा।
        </p>
      </footer>

      {others.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">और लोक-गाथा</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {others.slice(0, 4).map((s) => (
              <Link
                key={s.slug}
                to={`/folk-story/${s.slug}`}
                className="rounded-lg bg-dark-700/60 hover:bg-dark-600 border border-dark-600 hover:border-amber-500/50 transition-all p-3 flex items-center gap-3"
              >
                <span className="text-2xl">{s.emoji}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-amber-100 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{s.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
