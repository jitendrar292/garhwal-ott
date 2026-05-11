import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FEATURES = [
  {
    icon: '🎬',
    title: 'Pahadi Movies & Web Series',
    desc: 'Full-length Garhwali and Kumaoni films, short films, and web series — all in one place, curated from YouTube.',
  },
  {
    icon: '🎵',
    title: 'Folk & Modern Music',
    desc: 'From timeless Jagar and Pandav Nritya to modern Uttarakhandi chart-toppers — our music library is updated daily.',
  },
  {
    icon: '📰',
    title: 'Regional News',
    desc: 'Daily news from across Uttarakhand — covering culture, politics, development, weather, and local events.',
  },
  {
    icon: '📖',
    title: 'Folk Stories (Lok Gatha)',
    desc: 'Garhwali Lok Kathas like Kalu Bhandari, Jeetu Bagdwal, Tilu Rauteli, and Ranu Rout — preserving oral traditions in written form for future generations.',
  },
  {
    icon: '💼',
    title: 'Government Jobs',
    desc: 'Curated Sarkari Naukri listings for Uttarakhand — state, central, police, defence, teaching, and PSU vacancies.',
  },
  {
    icon: '🍲',
    title: 'Pahadi Cuisine',
    desc: 'Recipes, ingredients, and stories behind authentic Pahadi dishes like Kafuli, Bhatt ki Churkani, and Aloo ke Gutke.',
  },
  {
    icon: '📚',
    title: 'Garhwali Sikho',
    desc: 'Learn conversational Garhwali — common phrases, vocabulary, and pronunciation guides for speakers of Hindi and English.',
  },
  {
    icon: '🤖',
    title: 'Ghughuti AI',
    desc: 'An AI chatbot that speaks Garhwali — ask it about Uttarakhand culture, folklore, food, festivals, and travel.',
  },
];

const MISSION_POINTS = [
  'Preserve and promote Garhwali and Kumaoni language, music, and oral traditions.',
  'Give Pahadi content creators a dedicated platform to reach their community.',
  'Bridge the gap between the Pahadi diaspora and their roots — wherever they are in the world.',
  'Celebrate Devbhoomi Uttarakhand — its people, its stories, its spirit.',
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <SEO
        title="About PahadiTube — Pahadi Entertainment & Culture"
        description="PahadiTube is Uttarakhand's premier free streaming platform for Garhwali and Kumaoni movies, music, folk stories, news, and culture. Learn about our mission."
        path="/about"
        keywords="about PahadiTube, Garhwali entertainment, Kumaoni culture, Uttarakhand streaming, Pahadi movies, Devbhoomi"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About PahadiTube',
          url: 'https://pahaditube.in/about',
          description: 'PahadiTube is Uttarakhand\'s free streaming platform for Garhwali and Kumaoni entertainment, folk stories, news, and culture.',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
        }}
      />

      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          About <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">PahadiTube</span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          PahadiTube is a free digital platform dedicated to celebrating the rich culture, language, and stories of Devbhoomi Uttarakhand — the land of the Garhwalis and Kumaonis.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-14 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
          <span className="text-2xl">🏔️</span> Our Mission
        </h2>
        <p className="text-gray-400 leading-relaxed mb-5">
          Millions of people from Uttarakhand live across India and the world — yet finding authentic Pahadi entertainment, local news, and cultural content in one place was nearly impossible. PahadiTube was built to change that.
        </p>
        <ul className="space-y-3">
          {MISSION_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* What we offer */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">✨</span> What PahadiTube Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-primary-500/30 transition-colors duration-200"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-14 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
          <span className="text-2xl">📖</span> Our Story
        </h2>
        <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
          <p>
            PahadiTube was founded by <strong className="text-gray-300">Jitendra Singh Rawat</strong>, a software engineer and proud Pahari from Uttarakhand, who grew up watching Garhwali films and listening to folk songs — and saw a generation slowly losing touch with their cultural roots.
          </p>
          <p>
            The platform started as a simple idea: bring all the best Pahadi YouTube content together in one well-designed, easy-to-use place. It has since grown into a full cultural hub — with folk stories, regional news, government job listings, Pahadi recipe guides, and an AI chatbot that speaks Garhwali.
          </p>
          <p>
            Every feature on PahadiTube is built with one goal in mind — to make it easy and joyful to stay connected to Uttarakhand's language, culture, and community, no matter where you are in the world.
          </p>
          <p className="italic text-gray-500">
            "अपणी भाषा, अपणू मनोरंजन — Apni Bhasha, Apna Entertainment."
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-gray-500 mb-5 text-sm">Have a suggestion, feedback, or want to collaborate?</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/feedback"
            className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors duration-200"
          >
            Send Feedback
          </Link>
          <a
            href="mailto:info@pahaditube.in"
            className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary-500/30 text-gray-300 text-sm font-medium transition-colors duration-200"
          >
            info@pahaditube.in
          </a>
        </div>
      </section>
    </div>
  );
}
