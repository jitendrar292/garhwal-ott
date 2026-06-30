// CharDhamDetailPage — long-form Hindi/Garhwali guide per dham.
// `charDham.js` exports CHAR_DHAM (the 4 main dhams) plus PANCH_KEDAR and
// nearby-attraction lists; each entry from any of those lists gets its
// own URL here. Crawlers can index a full route table, cost guide, tips
// and significance for every site instead of an opaque hub grid.

import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import CHAR_DHAM, {
  PANCH_KEDAR,
  BADRINATH_NEARBY_ATTRACTIONS,
  GANGOTRI_NEARBY_ATTRACTIONS,
  YAMUNOTRI_NEARBY_ATTRACTIONS,
} from '../data/charDham';

// Flatten everything into a single addressable list and tag the section.
const ALL_SITES = [
  ...CHAR_DHAM.map((s) => ({ ...s, section: 'char-dham', sectionLabel: 'Char Dham' })),
  ...PANCH_KEDAR.map((s) => ({ ...s, section: 'panch-kedar', sectionLabel: 'Panch Kedar' })),
  ...BADRINATH_NEARBY_ATTRACTIONS.map((s) => ({ ...s, section: 'badrinath-nearby', sectionLabel: 'Near Badrinath' })),
  ...GANGOTRI_NEARBY_ATTRACTIONS.map((s) => ({ ...s, section: 'gangotri-nearby', sectionLabel: 'Near Gangotri' })),
  ...YAMUNOTRI_NEARBY_ATTRACTIONS.map((s) => ({ ...s, section: 'yamunotri-nearby', sectionLabel: 'Near Yamunotri' })),
];

export default function CharDhamDetailPage() {
  const { slug } = useParams();
  const site = ALL_SITES.find((s) => s.id === slug);

  if (!site) return <Navigate to="/chardham-yatra" replace />;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <SEO
        title={`${site.name} — ${site.sectionLabel} Yatra Guide, ${site.district || 'Uttarakhand'}`}
        description={(site.significance || site.highlight || site.note || '').slice(0, 180)}
        path={`/chardham-yatra/${site.id}`}
        type="article"
        keywords={`${site.name}, Char Dham yatra, Uttarakhand pilgrimage, ${site.district || ''}, ${site.deity || ''}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'TouristAttraction',
          name: site.name,
          description: site.significance || site.highlight || site.note,
          address: site.district ? {
            '@type': 'PostalAddress',
            addressRegion: 'Uttarakhand',
            addressLocality: site.district,
            addressCountry: 'IN',
          } : undefined,
          url: `https://pahaditube.in/chardham-yatra/${site.id}`,
        }}
      />

      <nav className="text-xs text-white/40 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>›</span>
        <Link to="/chardham-yatra" className="hover:text-white">Char Dham Yatra</Link>
        <span>›</span>
        <span className="text-white/60">{site.name}</span>
      </nav>

      <header className={`bg-gradient-to-br ${site.color || 'from-slate-700 to-slate-900'} rounded-2xl p-6 sm:p-8 mb-8 ring-1 ring-white/10`}>
        <span className="text-5xl block mb-3">{site.emoji || '🛕'}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{site.name}</h1>
        {site.deity && <p className="text-base text-white/80 mt-2">{site.deity}</p>}
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
          {site.district && <span>📍 {site.district}</span>}
          {site.altitude && <span>⛰️ {site.altitude}</span>}
          <span className="px-2 py-0.5 rounded-full bg-white/10">{site.sectionLabel}</span>
        </div>
      </header>

      {site.image && (
        <figure className="mb-8">
          <OptimizedImage
            src={site.image}
            alt={site.imageAlt || site.name}
            className="w-full h-auto rounded-2xl ring-1 ring-white/10 object-cover max-h-[460px]"
            loading="lazy"
            width="1024"
            height="680"
          />
          {site.imageAlt && (
            <figcaption className="text-[11px] text-white/40 mt-2 text-center">{site.imageAlt} · फोटो: Wikimedia Commons</figcaption>
          )}
        </figure>
      )}

      {site.significance && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">महत्व · Significance</h2>
          <p className="text-base text-gray-200 leading-relaxed">{site.significance}</p>
        </section>
      )}

      {(site.openMonth || site.closeMonth || site.lastStation || site.trekDistance || site.trekDifficulty) && (
        <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">यात्रा सम्बन्धी जानकारी · Yatra Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {site.openMonth && (<div><dt className="text-white/50">कपाट खुलने का समय</dt><dd className="text-white/90">{site.openMonth}</dd></div>)}
            {site.closeMonth && (<div><dt className="text-white/50">कपाट बंद होने का समय</dt><dd className="text-white/90">{site.closeMonth}</dd></div>)}
            {site.lastStation && (<div><dt className="text-white/50">अन्तिम मोटर स्टेशन</dt><dd className="text-white/90">{site.lastStation}</dd></div>)}
            {site.trekDistance && (<div><dt className="text-white/50">ट्रेक की दूरी</dt><dd className="text-white/90">{site.trekDistance}</dd></div>)}
            {site.trekDifficulty && (<div><dt className="text-white/50">कठिनाई स्तर</dt><dd className="text-white/90">{site.trekDifficulty}</dd></div>)}
          </dl>
        </section>
      )}

      {Array.isArray(site.route) && site.route.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">यात्रा मार्ग · Route</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-200">
              <thead className="text-xs uppercase text-white/50 border-b border-white/10">
                <tr>
                  <th className="px-3 py-2">From</th>
                  <th className="px-3 py-2">To</th>
                  <th className="px-3 py-2">Distance</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Mode</th>
                </tr>
              </thead>
              <tbody>
                {site.route.map((leg, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-3 py-2">{leg.from}</td>
                    <td className="px-3 py-2">{leg.to}</td>
                    <td className="px-3 py-2">{leg.km}</td>
                    <td className="px-3 py-2">{leg.time}</td>
                    <td className="px-3 py-2">{leg.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {site.cost && (
        <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">अनुमानित खर्च · Estimated Cost</h2>
          <ul className="space-y-2 text-sm text-gray-200">
            {site.cost.budget && <li>💼 बजट यात्रा: <strong className="text-white">{site.cost.budget}</strong></li>}
            {site.cost.moderate && <li>🏨 मध्यम स्तर: <strong className="text-white">{site.cost.moderate}</strong></li>}
            {site.cost.comfortable && <li>✨ आरामदायक: <strong className="text-white">{site.cost.comfortable}</strong></li>}
            {site.cost.notes && <li className="text-white/70 italic pt-1">{site.cost.notes}</li>}
          </ul>
        </section>
      )}

      {Array.isArray(site.tips) && site.tips.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">यात्रा सुझाव · Travel Tips</h2>
          <ul className="space-y-2">
            {site.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-200">
                <span className="text-primary-400 mt-1 flex-shrink-0">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {site.accommodation && (
        <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">आवास व्यवस्था · Accommodation</h2>
          <p className="text-base text-gray-200 leading-relaxed">{site.accommodation}</p>

          {Array.isArray(site.stays) && site.stays.length > 0 && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-base font-semibold text-white">🛏️ कहाँ रुकें — MakeMyTrip पर देखें</h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40">Partner</span>
              </div>
              <p className="text-sm text-white/60 mb-4">
                {site.name} और आसपास के बेस-कैम्प के होटल विकल्प, कीमत और उपलब्धता।
              </p>
              <ul className="space-y-3">
                {site.stays.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="group block bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary-500/50 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-semibold text-white">{s.name}</div>
                          {s.note && (
                            <div className="text-[11px] text-white/50 mt-0.5">{s.note}</div>
                          )}
                        </div>
                        <span className="text-xs text-primary-300 group-hover:text-primary-200 flex-shrink-0 whitespace-nowrap">
                          होटल देखें ↗
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2 text-[11px] sm:text-xs">
                        {s.priceRange && (
                          <div className="flex items-start gap-1.5">
                            <span className="text-green-400">💰</span>
                            <span className="text-white/70"><span className="text-white/40">रेट:</span> {s.priceRange}</span>
                          </div>
                        )}
                        {s.distance && (
                          <div className="flex items-start gap-1.5">
                            <span className="text-blue-400">📍</span>
                            <span className="text-white/70"><span className="text-white/40">दूरी:</span> {s.distance}</span>
                          </div>
                        )}
                        {s.popular && (
                          <div className="flex items-start gap-1.5 sm:col-span-2">
                            <span className="text-yellow-400">🏨</span>
                            <span className="text-white/70"><span className="text-white/40">लोकप्रिय:</span> {s.popular}</span>
                          </div>
                        )}
                        {s.tip && (
                          <div className="flex items-start gap-1.5 sm:col-span-2 pt-1 mt-1 border-t border-white/10">
                            <span className="text-orange-400">💡</span>
                            <span className="text-white/70 italic">{s.tip}</span>
                          </div>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-white/40 mt-3">
                * लिंक MakeMyTrip की वेबसाइट पर नई टैब में खुलते हैं।
              </p>
            </div>
          )}
        </section>
      )}

      {site.form && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">शिव स्वरूप</h2>
          <p className="text-base text-gray-200 leading-relaxed">{site.form}</p>
        </section>
      )}

      {site.trek && (
        <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">ट्रेक</h2>
          <p className="text-base text-gray-200 leading-relaxed">{site.trek}</p>
          {site.bestBase && <p className="text-sm text-white/60 mt-2">Base camp: {site.bestBase}</p>}
        </section>
      )}

      {site.highlight && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">मुख्य आकर्षण</h2>
          <p className="text-base text-gray-200 leading-relaxed">{site.highlight}</p>
          {site.distance && <p className="text-sm text-white/60 mt-2">दूरी: {site.distance} · समय: {site.time}</p>}
        </section>
      )}

      {site.bestTime && (
        <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">सबसे अच्छा समय · Best Time to Visit</h2>
          <p className="text-base text-gray-200 leading-relaxed">{site.bestTime}</p>
        </section>
      )}

      {site.note && (
        <section className="mb-10">
          <p className="text-base text-gray-200 leading-relaxed italic border-l-2 border-white/20 pl-4">{site.note}</p>
        </section>
      )}

      <nav className="border-t border-white/10 pt-6 text-sm">
        <Link to="/chardham-yatra" className="text-primary-400 hover:text-primary-300">
          ← All Char Dham Yatra sites
        </Link>
      </nav>
    </article>
  );
}
