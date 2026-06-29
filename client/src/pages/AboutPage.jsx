import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FEATURES = [
  {
    icon: '🎬',
    title: 'Pahadi Movies & Web Series',
    desc: 'Full-length Garhwali and Kumaoni films, short films, and web series — all in one place, curated from YouTube. From classic Garhwali cinema to contemporary independent productions.',
  },
  {
    icon: '🎵',
    title: 'Folk & Modern Music',
    desc: 'From timeless Jagar and Pandav Nritya to modern Uttarakhandi chart-toppers — our music library is updated daily with curated selections.',
  },
  {
    icon: '📰',
    title: 'Regional News',
    desc: 'Daily news from across Uttarakhand — covering culture, politics, development, weather, and local events in Hindi and Garhwali.',
  },
  {
    icon: '📖',
    title: 'Folk Stories (Lok Gatha)',
    desc: 'Garhwali Lok Kathas like Kalu Bhandari, Jeetu Bagdwal, Tilu Rauteli, and Ranu Rout — preserving oral traditions in written form for future generations.',
  },
  {
    icon: '💼',
    title: 'Government Jobs',
    desc: 'Curated Sarkari Naukri listings for Uttarakhand — state, central, police, defence, teaching, and PSU vacancies with regular updates.',
  },
  {
    icon: '🍲',
    title: 'Pahadi Cuisine',
    desc: 'Recipes, ingredients, and stories behind authentic Pahadi dishes like Kafuli, Bhatt ki Churkani, Aloo ke Gutke, and regional specialties.',
  },
  {
    icon: '📚',
    title: 'Garhwali Sikho',
    desc: 'Learn conversational Garhwali — common phrases, vocabulary, pronunciation guides, and grammar for Hindi and English speakers.',
  },
  {
    icon: '🤖',
    title: 'Ghughuti AI',
    desc: 'An AI chatbot that speaks Garhwali — ask it about Uttarakhand culture, folklore, food, festivals, travel, and traditions.',
  },
];

const MISSION_POINTS = [
  'Preserve and promote Garhwali and Kumaoni language, music, and oral traditions in the digital age.',
  'Give Pahadi content creators a dedicated platform to reach their community and earn recognition.',
  'Bridge the gap between the Pahadi diaspora and their roots — wherever they are in the world.',
  'Celebrate Devbhoomi Uttarakhand — its people, its stories, its spirit, and its rich cultural heritage.',
];

const VALUES = [
  {
    title: 'Cultural Preservation',
    description: 'We believe Garhwali language and traditions must be documented and celebrated for future generations. Without platforms like ours, entire genres of folk music, oral histories, and linguistic nuances would be lost.',
    icon: '🏛️'
  },
  {
    title: 'Community First',
    description: 'Every feature on PahadiTube is designed with Pahadi people in mind — whether you\'re in Dehradun, Delhi, Dubai, or the diaspora. Your feedback and needs drive our development.',
    icon: '👥'
  },
  {
    title: 'Accessibility',
    description: 'Quality Pahadi entertainment and educational content should be free and easy to access. No paywalls, no hidden charges — just authentic content for your community.',
    icon: '🔓'
  },
  {
    title: 'Quality & Curation',
    description: 'We don\'t just aggregate — we curate. Every movie, song, folk story, and article is selected for quality, authenticity, and cultural value.',
    icon: '⭐'
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Jitendra Singh Rawat',
    role: 'Founder & Lead Developer',
    bio: 'A software engineer from Uttarakhand passionate about preserving Pahadi culture in the digital age. Jitendra built PahadiTube to create a space where Garhwali language and traditions could thrive online.',
    interests: 'Full-stack web development, AI/ML integration, cultural digitization'
  },
  {
    name: 'Community Contributors',
    role: 'Content & Curation Team',
    bio: 'A network of Pahadi journalists, folklorists, musicians, and cultural enthusiasts who contribute news, stories, recipes, and cultural insights to keep the platform vibrant and authentic.',
    interests: 'Journalism, folklore documentation, cultural advocacy'
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 py-12">
      <SEO
        title="About PahadiTube — Uttarakhand's Premier Pahadi Entertainment & Culture Platform"
        description="Learn about PahadiTube's mission to preserve Garhwali and Kumaoni culture, language, and traditions. A free platform celebrating Devbhoomi Uttarakhand and the Pahadi diaspora."
        path="/about"
        keywords="about PahadiTube, Garhwali entertainment, Kumaoni culture, Uttarakhand streaming, Pahadi movies, cultural preservation, Devbhoomi, Garhwali language"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About PahadiTube',
          url: 'https://pahaditube.in/about',
          description: 'PahadiTube is Uttarakhand\'s free streaming platform dedicated to preserving Garhwali and Kumaoni culture, language, entertainment, folk stories, news, and traditions.',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
          creator: { '@type': 'Person', name: 'Jitendra Singh Rawat' },
          datePublished: '2024-01-01',
        }}
      />

      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          About <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">PahadiTube</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
          PahadiTube is Uttarakhand's premier digital platform dedicated to celebrating, preserving, and amplifying the rich culture, language, and stories of Devbhoomi — the land of the Garhwalis and Kumaonis.
        </p>
        <p className="text-sm text-gray-500 mt-4 italic">
          "अपणी भाषा, अपणू मनोरंजन — Apni Bhasha, Apna Entertainment"
        </p>
      </div>

      {/* The Problem We're Solving */}
      <section className="mb-16 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-5">Why PahadiTube Exists</h2>
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Over 5 million Garhwalis and Kumaonis live across India and the world. Yet many struggle to find authentic Pahadi entertainment, local news, cultural educational content, and language learning resources all in one place.
          </p>
          <p>
            Traditional media platforms don't prioritize regional languages or niche cultures. YouTube is fragmented and disorganized. Streaming apps focus on mainstream Hindi and English content. Meanwhile, an entire linguistic and cultural heritage — with thousands of years of history — risks being forgotten by younger generations.
          </p>
          <p>
            <strong className="text-gray-300">PahadiTube was built to solve this problem:</strong> A single, unified platform where Pahadi people can discover Garhwali movies, folk songs, regional news, job opportunities, cultural knowledge, and even learn their own language — all for free, all in one place.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-3xl">🎯</span> Our Mission
        </h2>
        <ul className="space-y-4">
          {MISSION_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-4 text-gray-400 leading-relaxed bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <span className="mt-1 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-3xl">💎</span> Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((value) => (
            <div key={value.title} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <div className="text-3xl mb-3">{value.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we offer */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-3xl">✨</span> What PahadiTube Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-primary-500/30 transition-colors duration-200"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-16 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">📖</span> Our Story
        </h2>
        <div className="space-y-5 text-gray-400 leading-relaxed">
          <p>
            PahadiTube was founded by <strong className="text-gray-300">Jitendra Singh Rawat</strong>, a software engineer and proud Pahari from Uttarakhand. Growing up, Jitendra watched Garhwali films, listened to folk songs at family gatherings, and heard stories of the mountains from his grandparents.
          </p>
          <p>
            But over time, he noticed something troubling: his younger cousins in the cities had little interest in Garhwali language or culture. The songs were on YouTube, scattered across dozens of channels. The folk stories were disappearing. The news from Uttarakhand was hard to find. No one had built a space where Pahadi people could easily access their own culture.
          </p>
          <p>
            In 2024, Jitendra decided to build it himself. What started as a simple project to aggregate Garhwali YouTube videos has grown into a comprehensive cultural platform — with folk stories, regional news, AI chatbots that speak Garhwali, educational resources, and a thriving community of Pahadi culture enthusiasts.
          </p>
          <p>
            Today, PahadiTube is used by tens of thousands of Pahadi people around the world — from schoolchildren learning Garhwali, to parents reconnecting with their heritage, to journalists documenting regional news, to musicians sharing their craft.
          </p>
          <p className="italic text-gray-500 border-l-2 border-primary-500/50 pl-4">
            "Every line of Garhwali code, every folk story preserved, every song discovered — it's an act of cultural resistance and love for the mountains."
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-3xl">👥</span> The Team Behind PahadiTube
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-sm text-primary-400 mb-3">{member.role}</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{member.bio}</p>
              <p className="text-xs text-gray-500"><strong>Passions:</strong> {member.interests}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-6 text-center italic">
          Plus a growing network of journalists, folklorists, musicians, developers, and cultural advocates who contribute to PahadiTube.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Is PahadiTube free?',
              a: 'Yes, completely free. We believe Pahadi culture should be accessible to everyone. We don\'t charge for any content or features.'
            },
            {
              q: 'Where do you get your content?',
              a: 'We curate content from YouTube, original contributions from creators, news agencies, academic sources, and community submissions. All sources are credited.'
            },
            {
              q: 'Can I contribute content?',
              a: 'Absolutely! We welcome submissions from journalists, creators, folklorists, and cultural enthusiasts. Contact us at feedback page with your submissions.'
            },
            {
              q: 'Is PahadiTube affiliated with the Uttarakhand government?',
              a: 'No, PahadiTube is an independent cultural platform. We operate as a non-profit in spirit, though currently registered as a business.'
            },
            {
              q: 'Why Garhwali and Kumaoni specifically?',
              a: 'These are the two major linguistic and cultural groups of Uttarakhand. We celebrate both equally, and plan to expand to other regional languages in the future.'
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <p className="font-semibold text-white mb-2">{faq.q}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="mb-16 bg-gradient-to-r from-primary-900/20 to-purple-900/20 border border-primary-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">What We've Built So Far</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-8">
          {[
            { number: '20+', label: 'Folk Stories' },
            { number: '100+', label: 'Garhwali Phrases' },
            { number: '28', label: 'Govt. Schemes' },
            { number: '24/7', label: 'Free Access' },
          ].map((stat, idx) => (
            <div key={idx}>
              <p className="text-2xl sm:text-3xl font-bold text-primary-400">{stat.number}</p>
              <p className="text-xs text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-sm leading-relaxed text-center">
          Every number above maps to original content we've researched, written, or curated — folk-story narratives in Devanagari, structured language-learning phrases, and government-scheme guides with verified portal links. We grow the catalogue every week.
        </p>
      </section>

      {/* Contact & CTA */}
      <section className="text-center bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Join the Movement</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Whether you're a creator, journalist, developer, translator, or just a Pahadi culture enthusiast, there are many ways to contribute to PahadiTube. Your ideas, content, and feedback help us grow.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/feedback"
            className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors duration-200"
          >
            Send Feedback & Ideas
          </Link>
          <a
            href="mailto:contact@pahaditube.in"
            className="px-6 py-2.5 rounded-lg bg-white/[0.1] hover:bg-white/[0.15] text-white text-sm font-medium transition-colors duration-200 border border-white/[0.2]"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer Message */}
      <div className="mt-16 pt-8 border-t border-white/[0.1] text-center">
        <p className="text-gray-500 text-sm">
          Made with 🏔️ for the Pahadi community, wherever you are.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          © 2024 PahadiTube. Celebrating Devbhoomi Uttarakhand.
        </p>
      </div>
    </div>
  );
}
