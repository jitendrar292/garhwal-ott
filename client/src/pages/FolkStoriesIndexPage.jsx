import { Link } from 'react-router-dom';
import { folkStories } from '../data/folkStories';
import SEO from '../components/SEO';
import UttarakhandSpecialtiesGrid from '../components/PahadiCuisineGrid';

const FEATURED_NARRATIVES = [
  {
    title: 'Tilu Rauteli: Pahad ki Veerangana',
    detail:
      'Tilu Rauteli ki gatha sirf yudh ki kahani nahi hai. Yeh Garhwal ki social memory hai jahan ek yuva mahila ne apne parivaar, asmita, aur bhoomi ke liye sainik leadership li. Is narrative me shaurya ke saath grief aur duty dono saath chalte hain.',
  },
  {
    title: 'Jeetu Bagdwal: Sangeet aur Adhyatmik Sankat',
    detail:
      'Jeetu ki kahani mountain folklore me kala aur adhyatmik duniya ke beech ki rekha ko dikhati hai. Bansuri ka sur akarshan ban jata hai, aur wahin se katha fate, promise, aur loss tak pahunchti hai. Isliye yeh gatha lok-sangeet aur lok-vishwas dono ki study ke liye mahatvapurn hai.',
  },
  {
    title: 'Rajula Malushahi: Prem ke Pare Samajik Arth',
    detail:
      'Rajula-Malushahi ko aksar romantic epic ke roop me padha jata hai, lekin isme trade routes, parivarik power, aur social boundaries ka bhi gahra sanket milta hai. Is narrative ko padhte waqt Himalayan mobility aur identity politics dono samajh aate hain.',
  },
];

// Grid index for /folk-stories — shows every Garhwali folk-tale card so the
// "लोक-गाथा" Explore tile has a real destination. Cards reuse the same
// gradient styling as FolkStoriesRow but stack 2-up on mobile / 3-up on
// desktop instead of scrolling horizontally.
export default function FolkStoriesIndexPage() {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 pt-6 pb-16">
      <SEO
        title="Garhwali Folk Stories - Uttarakhand Lok Gatha & Legends"
        description="Read Garhwali folk stories (लोक-गाथा) from Uttarakhand — Jagdev Panwar, Jeetu Bagdwal, Teelu Rauteli, Kalu Bhandari, Ranu Rout and more Pahadi legends."
        path="/folk-stories"
        keywords="Garhwali folk stories, Uttarakhand lok gatha, Pahadi legends, Teelu Rauteli, Jeetu Bagdwal, Jagdev Panwar, Garhwali kahani"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Garhwali Folk Stories',
          url: 'https://pahaditube.in/folk-stories',
          description: 'A collection of Garhwali folk tales and Uttarakhand legends.',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: folkStories.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://pahaditube.in/folk-story/${s.slug}`,
              name: s.name,
            })),
          },
        }}
      />
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-100 flex items-center gap-3">
          <span className="text-4xl">📖</span>
          गढ़वाली लोक-गाथा
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Folk tales of Garhwal — heroes, lovers and warriors of the Pahadi heartland.
          These traditional oral narratives have been passed down through generations in Uttarakhand's
          Garhwali-speaking communities, preserving the region's rich cultural heritage.
        </p>
      </header>

      <section className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white mb-3">Why These Folk Narratives Matter</h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          Garhwali lok-gatha oral tradition ka hissa rahi hain. In kahaniyon me itihaas, social ethics, regional politics,
          ecological memory, aur community values saath-saath record hue milte hain. Is archive ka uddeshya keval stories
          list karna nahi, balki unka cultural context bhi preserve karna hai.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FEATURED_NARRATIVES.map((item) => (
            <article key={item.title} className="rounded-xl border border-amber-700/30 bg-amber-900/20 p-4">
              <h3 className="text-sm font-semibold text-amber-200 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folkStories.map((s) => (
          <Link
            key={s.slug}
            to={`/folk-story/${s.slug}`}
            className="rounded-xl bg-gradient-to-br from-amber-900/40 via-dark-700 to-dark-800 border border-amber-700/30 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-900/30 transition-all p-5 flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-4xl leading-none">{s.emoji}</span>
                <h2 className="text-lg font-bold text-amber-100 leading-tight">{s.name}</h2>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{s.blurb}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-medium">पढ़ें →</span>
              <span className="text-gray-500">गढ़वाली लोक-गाथा</span>
            </div>
          </Link>
        ))}
      </div>

      {/* District-wise Famous Things from Uttarakhand */}
      <div className="mt-16">
        <UttarakhandSpecialtiesGrid />
      </div>
    </div>
  );
}
