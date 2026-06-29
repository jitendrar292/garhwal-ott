// SacredPlaceDetailPage — dedicated article URL per temple / heritage site.
// The hub page (SacredPlacesPage) renders the rich legend / architecture /
// significance text only inside a modal; crawlers won't see it. This page
// gives each entry from `sacredPlaces.js` its own indexable URL.

import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import SACRED_PLACES from '../data/sacredPlaces';

const TYPE_LABEL = {
  temple: 'Temple',
  historical: 'Historical site',
  pilgrimage: 'Pilgrimage site',
  heritage: 'Heritage site',
};

export default function SacredPlaceDetailPage() {
  const { slug } = useParams();
  const place = SACRED_PLACES.find((p) => p.id === slug);

  if (!place) return <Navigate to="/sacred-places" replace />;

  const idx = SACRED_PLACES.findIndex((p) => p.id === slug);
  const prev = idx > 0 ? SACRED_PLACES[idx - 1] : null;
  const next = idx < SACRED_PLACES.length - 1 ? SACRED_PLACES[idx + 1] : null;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <SEO
        title={`${place.name} — ${TYPE_LABEL[place.type] || 'Sacred site'}, ${place.district}, Uttarakhand`}
        description={(place.legend || place.significance || '').slice(0, 180)}
        path={`/sacred-places/${place.id}`}
        type="article"
        keywords={`${place.name}, ${place.district}, Uttarakhand temples, Pahadi heritage, ${place.type}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: place.name,
          description: place.significance || place.legend,
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Uttarakhand',
            addressLocality: place.district,
            addressCountry: 'IN',
          },
          url: `https://pahaditube.in/sacred-places/${place.id}`,
        }}
      />

      <nav className="text-xs text-white/40 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>›</span>
        <Link to="/sacred-places" className="hover:text-white">Sacred Places</Link>
        <span>›</span>
        <span className="text-white/60">{place.name}</span>
      </nav>

      <header className="mb-8">
        <span className="text-6xl block mb-3">{place.emoji}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{place.name}</h1>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/60">
          <span>📍 {place.district}</span>
          {place.altitude && <span>⛰️ {place.altitude}</span>}
          <span>🏛️ {TYPE_LABEL[place.type] || place.type}</span>
        </div>
      </header>

      {place.legend && (
        <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">पौराणिक कथा · Legend</h2>
          <p className="text-base text-gray-200 leading-relaxed">{place.legend}</p>
        </section>
      )}

      {place.significance && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">महत्व · Significance</h2>
          <p className="text-base text-gray-200 leading-relaxed">{place.significance}</p>
        </section>
      )}

      {place.architecture && (
        <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">स्थापत्य · Architecture</h2>
          <p className="text-base text-gray-200 leading-relaxed">{place.architecture}</p>
        </section>
      )}

      {place.bestTime && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">सर्वोत्तम समय · Best Time to Visit</h2>
          <p className="text-base text-gray-200 leading-relaxed">{place.bestTime}</p>
        </section>
      )}

      {place.garhwaliConnection && (
        <section className="mb-10 bg-gradient-to-r from-amber-900/20 to-orange-900/10 border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-amber-200 mb-3">गढ़वाली सम्बन्ध · Garhwali Connection</h2>
          <p className="text-base text-gray-200 leading-relaxed">{place.garhwaliConnection}</p>
        </section>
      )}

      <nav className="flex items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm">
        {prev ? (
          <Link to={`/sacred-places/${prev.id}`} className="text-white/70 hover:text-white">
            ← {prev.name}
          </Link>
        ) : <span />}
        <Link to="/sacred-places" className="text-primary-400 hover:text-primary-300">
          All Sacred Places
        </Link>
        {next ? (
          <Link to={`/sacred-places/${next.id}`} className="text-white/70 hover:text-white text-right">
            {next.name} →
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
