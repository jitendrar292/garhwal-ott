// RecipeDetailPage — full Pahadi recipe URL.
// Each entry from `pahadiDishes.js` becomes /pahadi-khano/recipe/:slug
// with ingredients, step-by-step instructions, tip and optional video.
// Marked up with Schema.org Recipe so Google can surface rich results.

import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import PAHADI_DISHES from '../data/pahadiDishes';

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const dish = PAHADI_DISHES.find((d) => d.id === slug);

  if (!dish) return <Navigate to="/pahadi-khano" replace />;

  const idx = PAHADI_DISHES.findIndex((d) => d.id === slug);
  const prev = idx > 0 ? PAHADI_DISHES[idx - 1] : null;
  const next = idx < PAHADI_DISHES.length - 1 ? PAHADI_DISHES[idx + 1] : null;

  // YouTube short → embed URL (for the optional inline video)
  const videoEmbed = (() => {
    if (!dish.video) return null;
    const m = dish.video.match(/(?:shorts\/|watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  })();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <SEO
        title={`${dish.name} (${dish.nameLocal}) Recipe — Pahadi ${dish.type} from ${dish.region}`}
        description={dish.description.slice(0, 180)}
        path={`/pahadi-khano/recipe/${dish.id}`}
        type="article"
        keywords={`${dish.name}, ${dish.nameLocal}, Pahadi recipe, Garhwali food, Uttarakhand cuisine, ${dish.type}, ${dish.region}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: dish.name,
          alternateName: dish.nameLocal,
          description: dish.description,
          recipeCategory: dish.type,
          recipeCuisine: `Pahadi (${dish.region})`,
          recipeYield: dish.serves,
          totalTime: dish.time,
          recipeIngredient: dish.ingredients,
          recipeInstructions: dish.steps.map((s) => ({ '@type': 'HowToStep', text: s })),
          url: `https://pahaditube.in/pahadi-khano/recipe/${dish.id}`,
        }}
      />

      <nav className="text-xs text-white/40 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>›</span>
        <Link to="/pahadi-khano" className="hover:text-white">Pahadi Khano</Link>
        <span>›</span>
        <span className="text-white/60">{dish.name}</span>
      </nav>

      <header className={`bg-gradient-to-br ${dish.bg} rounded-2xl p-6 sm:p-8 mb-8 ring-1 ring-white/10`}>
        <span className="text-5xl block mb-3">{dish.emoji}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{dish.name}</h1>
        <p className="text-xl text-white/85 font-medium mt-1">{dish.nameLocal}</p>
        <p className="text-sm text-white/70 mt-3">{dish.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/75">
          <span className="px-3 py-1 rounded-full bg-black/30">⏱️ {dish.time}</span>
          <span className="px-3 py-1 rounded-full bg-black/30">🍽️ {dish.serves}</span>
          <span className="px-3 py-1 rounded-full bg-black/30">📊 {dish.difficulty}</span>
          <span className="px-3 py-1 rounded-full bg-black/30">📍 {dish.region}</span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">परिचय · About This Dish</h2>
        <p className="text-base text-gray-200 leading-relaxed">{dish.description}</p>
      </section>

      <section className="mb-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">सामग्री · Ingredients</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-200">
          {dish.ingredients.map((ing, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary-400 mt-0.5">•</span>
              <span>{ing}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">बनाने की विधि · Instructions</h2>
        <ol className="space-y-4">
          {dish.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500/20 text-primary-300 font-bold flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <p className="text-base text-gray-200 leading-relaxed pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {dish.tip && (
        <section className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
          <p className="text-sm text-amber-100">{dish.tip}</p>
        </section>
      )}

      {videoEmbed && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">वीडियो · Video</h2>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={videoEmbed}
              title={`${dish.name} recipe video`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      )}

      <nav className="flex items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm">
        {prev ? (
          <Link to={`/pahadi-khano/recipe/${prev.id}`} className="text-white/70 hover:text-white">
            ← {prev.name}
          </Link>
        ) : <span />}
        <Link to="/pahadi-khano" className="text-primary-400 hover:text-primary-300">
          All Recipes
        </Link>
        {next ? (
          <Link to={`/pahadi-khano/recipe/${next.id}`} className="text-white/70 hover:text-white text-right">
            {next.name} →
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
