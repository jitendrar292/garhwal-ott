import { useMemo } from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import PAHADI_VICHAR from '../data/pahadiVichar';
import PAHADI_HASTAKALA from '../data/pahadiHastakala';
import PAHADI_PRAKRITI from '../data/pahadiPrakriti';
import { folkStories as STORIES } from '../data/folkStories';
import FESTIVALS from '../data/festivals';
import { BLOG_POSTS } from '../data/cultureLibrary';

// ─── Tag taxonomy ────────────────────────────────────────────────────────────
const TAGS = {
  garhwal: {
    label: 'Garhwal',
    emoji: '🏔️',
    color: 'from-emerald-600 to-teal-900',
    chip: 'bg-emerald-500/20 text-emerald-300',
    description: 'Stories, crafts, nature and culture rooted in the Garhwal region of Uttarakhand.',
  },
  kumaon: {
    label: 'Kumaon',
    emoji: '🎨',
    color: 'from-rose-600 to-pink-900',
    chip: 'bg-rose-500/20 text-rose-300',
    description: 'Content celebrating the Kumaon Himalaya — Aipan art, songs, landscapes and festivals.',
  },
  devotional: {
    label: 'Devotional',
    emoji: '🙏',
    color: 'from-amber-600 to-orange-900',
    chip: 'bg-amber-500/20 text-amber-300',
    description: 'Jaagar rituals, temple culture, Char Dham, and the sacred songs of Devbhoomi.',
  },
  folk: {
    label: 'Folk',
    emoji: '📖',
    color: 'from-indigo-600 to-purple-900',
    chip: 'bg-indigo-500/20 text-indigo-300',
    description: 'Traditional folk tales, oral legends, and the mythic heroes of the Garhwali tradition.',
  },
  nature: {
    label: 'Nature',
    emoji: '🌿',
    color: 'from-green-600 to-emerald-900',
    chip: 'bg-green-500/20 text-green-300',
    description: 'Glaciers, rivers, rare plants, wildlife and the high-altitude ecosystems of Uttarakhand.',
  },
  diaspora: {
    label: 'Diaspora',
    emoji: '✈️',
    color: 'from-sky-600 to-blue-900',
    chip: 'bg-sky-500/20 text-sky-300',
    description: 'Voices from pahadi people living in cities and abroad — longing, identity, and return.',
  },
  food: {
    label: 'Food',
    emoji: '🍲',
    color: 'from-orange-600 to-red-900',
    chip: 'bg-orange-500/20 text-orange-300',
    description: 'Mountain cuisine, seasonal ingredients and the food culture of pahadi households.',
  },
  crafts: {
    label: 'Crafts',
    emoji: '🧺',
    color: 'from-yellow-600 to-amber-900',
    chip: 'bg-yellow-500/20 text-yellow-300',
    description: 'Traditional handicrafts — Aipan, Ringal, woodcarving, Thulma embroidery and more.',
  },
  monsoon: {
    label: 'Monsoon',
    emoji: '🌧️',
    color: 'from-teal-600 to-cyan-900',
    chip: 'bg-teal-500/20 text-teal-300',
    description: 'Harela, Teej, seasonal songs, rain recipes and the world that comes alive with the monsoon.',
  },
  festival: {
    label: 'Festivals',
    emoji: '🎉',
    color: 'from-fuchsia-600 to-violet-900',
    chip: 'bg-fuchsia-500/20 text-fuchsia-300',
    description: 'Upcoming and celebrated festivals across Garhwal, Kumaon and Jaunsar-Bawar.',
  },
  migration: {
    label: 'Migration',
    emoji: '🏘️',
    color: 'from-slate-600 to-gray-900',
    chip: 'bg-slate-500/20 text-slate-300',
    description: 'The story of pahadi villages emptying — ghost villages, reverse migration, and staying.',
  },
};

// ─── Tag → content filters ────────────────────────────────────────────────────
function getResults(tag) {
  const results = { vichar: [], hastakala: [], prakriti: [], stories: [], festivals: [], articles: [] };

  switch (tag) {
    case 'garhwal':
      results.vichar = PAHADI_VICHAR;
      results.hastakala = PAHADI_HASTAKALA.filter((h) => h.region.toLowerCase().includes('garhwal'));
      results.prakriti = PAHADI_PRAKRITI.filter((p) =>
        p.description.toLowerCase().includes('garhwal') || p.culturalSignificance?.toLowerCase().includes('garhwal')
      );
      results.stories = STORIES.slice(0, 8);
      results.festivals = FESTIVALS.filter((f) => f.region.toLowerCase().includes('garhwal'));
      results.articles = BLOG_POSTS.slice(0, 4);
      break;

    case 'kumaon':
      results.hastakala = PAHADI_HASTAKALA.filter((h) => h.region.toLowerCase().includes('kumaon'));
      results.prakriti = PAHADI_PRAKRITI.filter((p) =>
        p.description.toLowerCase().includes('kumaon') || p.ecologicalRole?.join(' ').toLowerCase().includes('kumaon')
      );
      results.festivals = FESTIVALS.filter((f) => f.region.toLowerCase().includes('kumaon'));
      results.articles = BLOG_POSTS.filter(
        (b) => b.title.toLowerCase().includes('kumaon') || b.excerpt.toLowerCase().includes('kumaon')
      );
      break;

    case 'devotional':
      results.vichar = PAHADI_VICHAR.filter((v) =>
        v.tags.some((t) => ['festival', 'devotional', 'army', 'village-life'].includes(t))
      );
      results.festivals = FESTIVALS.filter((f) =>
        f.description.toLowerCase().includes('पूजा') ||
        f.description.toLowerCase().includes('देव') ||
        f.name.toLowerCase().includes('purnima') ||
        f.name.toLowerCase().includes('devi') ||
        f.name.toLowerCase().includes('sankranti')
      );
      results.prakriti = PAHADI_PRAKRITI.filter((p) => p.culturalSignificance?.toLowerCase().includes('deity') || p.culturalSignificance?.toLowerCase().includes('sacred') || p.culturalSignificance?.toLowerCase().includes('ritual'));
      results.hastakala = PAHADI_HASTAKALA.filter((h) =>
        (h.uses || []).some((u) => u.toLowerCase().includes('deity') || u.toLowerCase().includes('ritual') || u.toLowerCase().includes('sacred') || u.toLowerCase().includes('festival'))
      );
      results.articles = BLOG_POSTS.filter(
        (b) => b.title.toLowerCase().includes('jagar') || b.excerpt.toLowerCase().includes('devotional') || b.title.toLowerCase().includes('mandir')
      );
      break;

    case 'folk':
      results.stories = STORIES;
      results.vichar = PAHADI_VICHAR.filter((v) => v.tags.some((t) => ['village-life', 'festival', 'pride'].includes(t)));
      results.articles = BLOG_POSTS.filter(
        (b) => b.title.toLowerCase().includes('jagar') || b.title.toLowerCase().includes('folk') || b.excerpt.toLowerCase().includes('folk')
      );
      break;

    case 'nature':
      results.prakriti = PAHADI_PRAKRITI;
      results.articles = BLOG_POSTS.filter(
        (b) => b.title.toLowerCase().includes('buransh') || b.title.toLowerCase().includes('forest') || b.excerpt.toLowerCase().includes('nature') || b.excerpt.toLowerCase().includes('forest')
      );
      results.vichar = PAHADI_VICHAR.filter((v) => v.tags.some((t) => ['climate', 'nature'].includes(t)));
      break;

    case 'diaspora':
      results.vichar = PAHADI_VICHAR.filter((v) => v.tags.some((t) => ['diaspora', 'migration', 'longing', 'identity'].includes(t)));
      results.articles = BLOG_POSTS.filter(
        (b) => b.excerpt.toLowerCase().includes('diaspora') || b.excerpt.toLowerCase().includes('migr')
      );
      break;

    case 'food':
      results.articles = BLOG_POSTS.filter(
        (b) => b.title.toLowerCase().includes('food') || b.excerpt.toLowerCase().includes('food') || b.excerpt.toLowerCase().includes('dish') || b.excerpt.toLowerCase().includes('recipe') || b.excerpt.toLowerCase().includes('buransh') || b.excerpt.toLowerCase().includes('cuisine')
      );
      results.vichar = PAHADI_VICHAR.filter((v) => v.tags.some((t) => ['food', 'entrepreneurship'].includes(t)));
      results.festivals = FESTIVALS.filter((f) =>
        f.name.toLowerCase().includes('ghee') || f.name.toLowerCase().includes('harela') || f.description.toLowerCase().includes('फसल')
      );
      break;

    case 'crafts':
      results.hastakala = PAHADI_HASTAKALA;
      results.articles = BLOG_POSTS.filter(
        (b) => b.title.toLowerCase().includes('aipan') || b.title.toLowerCase().includes('ringal') || b.title.toLowerCase().includes('craft')
      );
      break;

    case 'monsoon':
      results.festivals = FESTIVALS.filter((f) =>
        f.name.toLowerCase().includes('harela') || f.name.toLowerCase().includes('teej') || f.description.toLowerCase().includes('monsoon') || f.description.toLowerCase().includes('सावन') || f.description.toLowerCase().includes('वर्षा')
      );
      results.prakriti = PAHADI_PRAKRITI.filter((p) => p.seasonBest?.toLowerCase().includes('monsoon') || p.description.toLowerCase().includes('monsoon') || p.description.toLowerCase().includes('rain'));
      results.articles = BLOG_POSTS.filter(
        (b) => b.excerpt.toLowerCase().includes('monsoon') || b.excerpt.toLowerCase().includes('rain') || b.excerpt.toLowerCase().includes('seasonal')
      );
      results.vichar = PAHADI_VICHAR.filter((v) => v.tags.some((t) => ['village-life', 'home'].includes(t)));
      break;

    case 'festival':
      results.festivals = FESTIVALS;
      results.vichar = PAHADI_VICHAR.filter((v) => v.tags.some((t) => ['festival', 'Igas'].includes(t)));
      results.articles = BLOG_POSTS.filter(
        (b) => b.title.toLowerCase().includes('festival') || b.excerpt.toLowerCase().includes('festival') || b.excerpt.toLowerCase().includes('celebration')
      );
      break;

    case 'migration':
      results.vichar = PAHADI_VICHAR.filter((v) => v.tags.some((t) => ['migration', 'diaspora', 'return', 'village-life', 'staying'].includes(t)));
      results.articles = BLOG_POSTS.filter(
        (b) => b.title.toLowerCase().includes('migration') || b.title.toLowerCase().includes('ghost') || b.excerpt.toLowerCase().includes('migration') || b.excerpt.toLowerCase().includes('village')
      );
      results.prakriti = PAHADI_PRAKRITI.filter((p) => p.culturalSignificance?.toLowerCase().includes('migration') || p.culturalSignificance?.toLowerCase().includes('deforestation'));
      break;

    default:
      break;
  }

  return results;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TagBrowsePage() {
  const { tag } = useParams();
  const meta = TAGS[tag];
  const results = useMemo(() => getResults(tag), [tag]);
  const totalResults = Object.values(results).reduce((n, arr) => n + arr.length, 0);

  if (!meta) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-5xl">🏔️</p>
        <p className="text-white text-lg font-semibold">Unknown tag: <code className="text-primary-400">{tag}</code></p>
        <Link to="/" className="text-primary-400 text-sm hover:underline">Back to home</Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${meta.label} — Browse Pahadi Content | PahadiTube`}
        description={meta.description}
        keywords={`${tag}, uttarakhand, pahadi, ${meta.label.toLowerCase()}, garhwali, kumaoni`}
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">

        {/* Hero banner */}
        <div className={`bg-gradient-to-br ${meta.color} px-4 py-14 text-center`}>
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="text-5xl block mb-3">{meta.emoji}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">#{meta.label}</h1>
            <p className="text-white/70 text-base max-w-xl mx-auto mb-3">{meta.description}</p>
            <p className="text-white/40 text-sm">{totalResults} items</p>
          </motion.div>
        </div>

        {/* Other tags pill rail */}
        <div className="px-4 py-4 max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
          {Object.entries(TAGS).map(([t, m]) => (
            <NavLink
              key={t}
              to={`/tags/${t}`}
              className={({ isActive }) =>
                `px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white/5 border-white/15 text-white/55 hover:border-white/30'
                }`
              }
            >
              {m.emoji} {m.label}
            </NavLink>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-16 space-y-10">
          <AnimatePresence mode="wait">
            <motion.div key={tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

              {/* Diaspora stories / Vichar */}
              {results.vichar.length > 0 && (
                <Section title="✍️ Pahadi Vichar" subtitle="Personal essays" linkTo="/pahadi-vichar">
                  {results.vichar.map((v) => (
                    <Link key={v.id} to="/pahadi-vichar" className="card-item">
                      <p className="text-sm font-semibold text-white line-clamp-1">{v.title}</p>
                      <p className="text-xs text-white/50 mt-0.5">{v.author} · {v.from} → {v.nowIn}</p>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2">{v.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {v.tags.slice(0, 3).map((t) => (
                          <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full ${meta.chip}`}>{t}</span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </Section>
              )}

              {/* Folk Stories */}
              {results.stories.length > 0 && (
                <Section title="📖 Folk Stories" subtitle="Traditional Garhwali tales" linkTo="/folk-stories">
                  {results.stories.map((s) => (
                    <Link key={s.slug} to={`/folk-story/${s.slug}`} className="card-item">
                      <span className="text-2xl block mb-1">{s.emoji}</span>
                      <p className="text-sm font-semibold text-white line-clamp-1">{s.name}</p>
                      <p className="text-xs text-white/45 mt-1 line-clamp-2">{s.blurb}</p>
                    </Link>
                  ))}
                </Section>
              )}

              {/* Hastakala */}
              {results.hastakala.length > 0 && (
                <Section title="🧺 Traditional Crafts" subtitle="Pahadi Hastakala" linkTo="/pahadi-hastakala">
                  {results.hastakala.map((h) => (
                    <Link key={h.id} to="/pahadi-hastakala" className="card-item">
                      <span className="text-2xl block mb-1">{h.emoji}</span>
                      <p className="text-sm font-semibold text-white line-clamp-1">{h.name}</p>
                      <p className="text-xs text-white/45 mt-0.5">{h.nameLocal} · {h.region}</p>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2">{h.tagline}</p>
                    </Link>
                  ))}
                </Section>
              )}

              {/* Prakriti */}
              {results.prakriti.length > 0 && (
                <Section title="🌿 Nature & Ecology" subtitle="Pahadi Prakriti" linkTo="/pahadi-prakriti">
                  {results.prakriti.map((p) => (
                    <Link key={p.id} to="/pahadi-prakriti" className="card-item">
                      <span className="text-2xl block mb-1">{p.emoji}</span>
                      <p className="text-sm font-semibold text-white line-clamp-1">{p.name}</p>
                      <p className="text-xs text-white/45 mt-0.5 italic">{p.scientificName}</p>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2">{p.tagline}</p>
                    </Link>
                  ))}
                </Section>
              )}

              {/* Festivals */}
              {results.festivals.length > 0 && (
                <Section title="🎉 Festivals" subtitle="Pahadi calendar" linkTo="/tyohar">
                  {results.festivals.slice(0, 8).map((f) => (
                    <Link key={f.id} to="/tyohar" className="card-item">
                      <span className="text-2xl block mb-1">{f.emoji}</span>
                      <p className="text-sm font-semibold text-white line-clamp-1">{f.name}</p>
                      <p className="text-xs text-white/45 mt-0.5">{f.nameLocal} · {f.date}</p>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2">{f.region}</p>
                    </Link>
                  ))}
                </Section>
              )}

              {/* Culture Library */}
              {results.articles.length > 0 && (
                <Section title="📚 Culture Library" subtitle="Long reads" linkTo="/culture">
                  {results.articles.map((b) => (
                    <Link key={b.slug} to={`/culture#${b.slug}`} className="card-item">
                      <p className="text-sm font-semibold text-white line-clamp-2">{b.title}</p>
                      <p className="text-xs text-white/45 mt-0.5">{b.readTime} · {b.author}</p>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2">{b.excerpt}</p>
                    </Link>
                  ))}
                </Section>
              )}

              {totalResults === 0 && (
                <div className="text-center py-16 text-white/30">
                  <p className="text-3xl mb-3">🏔️</p>
                  <p>No content found for this tag yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ─── Section helper ────────────────────────────────────────────────────────────
function Section({ title, subtitle, linkTo, children }) {
  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
        </div>
        {linkTo && (
          <Link to={linkTo} className="text-xs text-primary-400 hover:underline shrink-0">
            See all →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 [&_.card-item]:rounded-xl [&_.card-item]:border [&_.card-item]:border-white/10 [&_.card-item]:bg-white/[0.04] [&_.card-item]:p-4 [&_.card-item:hover]:bg-white/[0.08] [&_.card-item:hover]:border-white/20 [&_.card-item]:transition-all [&_.card-item]:block">
        {children}
      </div>
    </div>
  );
}
