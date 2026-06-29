// InstrumentDetailPage — dedicated article URL per traditional instrument.
// Renders the full description / cultural significance / playing style block
// from `garhwaliInstruments.js` so each instrument has its own indexable
// long-form page instead of being hidden inside a hub-page modal.

import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import GARHWALI_INSTRUMENTS from '../data/garhwaliInstruments';

export default function InstrumentDetailPage() {
  const { slug } = useParams();
  const instrument = GARHWALI_INSTRUMENTS.find((i) => i.id === slug);

  if (!instrument) return <Navigate to="/instruments" replace />;

  const idx = GARHWALI_INSTRUMENTS.findIndex((i) => i.id === slug);
  const prev = idx > 0 ? GARHWALI_INSTRUMENTS[idx - 1] : null;
  const next = idx < GARHWALI_INSTRUMENTS.length - 1 ? GARHWALI_INSTRUMENTS[idx + 1] : null;

  const englishName = {
    percussion: 'Percussion instrument',
    wind: 'Wind instrument',
    string: 'String instrument',
    idiophone: 'Idiophone',
  }[instrument.type] || 'Traditional instrument';

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <SEO
        title={`${instrument.name} — Traditional Garhwali ${englishName} of Uttarakhand`}
        description={`${instrument.name} (${instrument.region}) — ${instrument.description.slice(0, 150)}`}
        path={`/instruments/${instrument.id}`}
        type="article"
        keywords={`${instrument.name}, Garhwali instruments, Uttarakhand folk music, ${instrument.type}, Pahadi vadya`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${instrument.name} — Traditional Garhwali ${englishName}`,
          inLanguage: ['hi', 'en'],
          articleSection: 'Folk Music & Instruments',
          about: instrument.name,
          url: `https://pahaditube.in/instruments/${instrument.id}`,
        }}
      />

      <nav className="text-xs text-white/40 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>›</span>
        <Link to="/instruments" className="hover:text-white">Instruments</Link>
        <span>›</span>
        <span className="text-white/60">{instrument.name}</span>
      </nav>

      <header className="mb-8">
        <span className="text-6xl block mb-3">{instrument.image}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{instrument.name}</h1>
        <p className="text-sm text-white/60 mt-2">
          {englishName} · {instrument.region}
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">परिचय · Introduction</h2>
        <p className="text-base text-gray-200 leading-relaxed">{instrument.description}</p>
      </section>

      {instrument.culturalSignificance && (
        <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">सांस्कृतिक महत्व · Cultural Significance</h2>
          <p className="text-base text-gray-200 leading-relaxed">{instrument.culturalSignificance}</p>
        </section>
      )}

      {instrument.playingStyle && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">बजाने की शैली · Playing Style</h2>
          <p className="text-base text-gray-200 leading-relaxed">{instrument.playingStyle}</p>
        </section>
      )}

      {instrument.famousInfo && (
        <section className="mb-10 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">प्रसिद्ध कलाकार · Famous Performers</h2>
          <p className="text-base text-gray-200 leading-relaxed">{instrument.famousInfo}</p>
        </section>
      )}

      <nav className="flex items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm">
        {prev ? (
          <Link to={`/instruments/${prev.id}`} className="text-white/70 hover:text-white">
            ← {prev.name}
          </Link>
        ) : <span />}
        <Link to="/instruments" className="text-primary-400 hover:text-primary-300">
          All Instruments
        </Link>
        {next ? (
          <Link to={`/instruments/${next.id}`} className="text-white/70 hover:text-white text-right">
            {next.name} →
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
