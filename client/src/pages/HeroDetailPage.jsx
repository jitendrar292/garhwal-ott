// HeroDetailPage — dedicated article URL per Pahadi hero.
// Surfacing each entry from `pahadiHeroes.js` at /pahadi-heroes/:slug gives
// Google substantive, unique pages it can index (the hub page only renders
// the full body on click, so crawlers see only headlines there).

import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import PAHADI_HEROES from '../data/pahadiHeroes';

export default function HeroDetailPage() {
  const { slug } = useParams();
  const hero = PAHADI_HEROES.find((h) => h.id === slug);

  if (!hero) return <Navigate to="/pahadi-heroes" replace />;

  const idx = PAHADI_HEROES.findIndex((h) => h.id === slug);
  const prev = idx > 0 ? PAHADI_HEROES[idx - 1] : null;
  const next = idx < PAHADI_HEROES.length - 1 ? PAHADI_HEROES[idx + 1] : null;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <SEO
        title={`${hero.name} (${hero.nameLocal}) — ${hero.role}, ${hero.region}`}
        description={hero.description.slice(0, 180)}
        path={`/pahadi-heroes/${hero.id}`}
        type="article"
        keywords={`${hero.name}, ${hero.nameLocal}, ${hero.region}, Uttarakhand history, Pahadi heroes, ${hero.tags.join(', ')}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: hero.name,
          alternateName: hero.nameLocal,
          description: hero.description,
          birthPlace: hero.region,
          jobTitle: hero.role,
          url: `https://pahaditube.in/pahadi-heroes/${hero.id}`,
        }}
      />

      <nav className="text-xs text-white/40 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>›</span>
        <Link to="/pahadi-heroes" className="hover:text-white">Pahadi Heroes</Link>
        <span>›</span>
        <span className="text-white/60 truncate">{hero.name}</span>
      </nav>

      <header className={`bg-gradient-to-br ${hero.bg} rounded-2xl p-6 sm:p-8 mb-8 ring-1 ring-white/10`}>
        <span className="text-5xl block mb-3">{hero.emoji}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{hero.name}</h1>
        <p className="text-xl text-white/80 font-medium">{hero.nameLocal}</p>
        <p className="text-sm text-white/60 mt-3">
          {hero.role} · {hero.era} · {hero.region}
        </p>
        <p className="text-base text-white/80 italic mt-3">{hero.tagline}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">Biography</h2>
        <p className="text-base text-gray-200 leading-relaxed">{hero.description}</p>
      </section>

      <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Key Contributions</h2>
        <ul className="space-y-2">
          {hero.contributions.map((c, ci) => (
            <li key={ci} className="flex items-start gap-3 text-gray-200 leading-relaxed">
              <span className="text-primary-400 mt-1 flex-shrink-0">▸</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <blockquote className="border-l-4 border-primary-500/60 pl-5 py-2 mb-8">
        <p className="text-lg text-white/85 italic leading-relaxed">{hero.quote}</p>
      </blockquote>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-white/70 mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {hero.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/15 capitalize"
            >
              {tag.replace('-', ' ')}
            </Link>
          ))}
        </div>
      </section>

      <nav className="flex items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm">
        {prev ? (
          <Link to={`/pahadi-heroes/${prev.id}`} className="text-white/70 hover:text-white">
            ← {prev.name}
          </Link>
        ) : <span />}
        <Link to="/pahadi-heroes" className="text-primary-400 hover:text-primary-300">
          All Heroes
        </Link>
        {next ? (
          <Link to={`/pahadi-heroes/${next.id}`} className="text-white/70 hover:text-white text-right">
            {next.name} →
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
