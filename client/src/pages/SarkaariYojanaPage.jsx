// SarkaariYojanaPage — full page listing all Uttarakhand government schemes
// /yojana route

import { useState } from 'react';
import SEO from '../components/SEO';
import SARKAARI_YOJANA from '../data/sarkaariYojana';

const CATEGORIES = [
  { id: 'all', label: 'सभी', emoji: '🏛️' },
  { id: 'health', label: 'स्वास्थ्य', emoji: '🏥' },
  { id: 'women', label: 'महिला', emoji: '👩' },
  { id: 'education', label: 'शिक्षा', emoji: '🎓' },
  { id: 'agriculture', label: 'कृषि', emoji: '🌾' },
  { id: 'employment', label: 'रोजगार', emoji: '💼' },
  { id: 'youth', label: 'युवा', emoji: '🧑' },
  { id: 'housing', label: 'आवास', emoji: '🏡' },
  { id: 'infrastructure', label: 'अवसंरचना', emoji: '⛑️' },
];

const categoryColors = {
  health: 'border-rose-500/50 bg-rose-900/20',
  education: 'border-purple-500/50 bg-purple-900/20',
  agriculture: 'border-green-500/50 bg-green-900/20',
  women: 'border-fuchsia-500/50 bg-fuchsia-900/20',
  youth: 'border-orange-500/50 bg-orange-900/20',
  housing: 'border-cyan-500/50 bg-cyan-900/20',
  employment: 'border-blue-500/50 bg-blue-900/20',
  infrastructure: 'border-slate-500/50 bg-slate-800/30',
};

const categoryLabels = {
  health: 'स्वास्थ्य',
  education: 'शिक्षा',
  agriculture: 'कृषि',
  women: 'महिला',
  youth: 'युवा',
  housing: 'आवास',
  employment: 'रोजगार',
  infrastructure: 'अवसंरचना',
};

const statusConfig = {
  active: { label: 'सक्रिय', className: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
  new: { label: 'नई योजना', className: 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40' },
  'registration-open': { label: 'रजिस्ट्रेशन खुला', className: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
  ongoing: { label: 'जारी', className: 'bg-teal-500/20 text-teal-300 border border-teal-500/40' },
};

function YojanaCard({ yojana }) {
  const status = statusConfig[yojana.status] || statusConfig.active;

  return (
    <div
      className={`relative rounded-xl border ${
        categoryColors[yojana.category] || 'border-white/20 bg-white/5'
      } p-5 hover:scale-[1.01] transition-transform duration-200`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{yojana.emoji}</span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide text-white/60 bg-white/10 px-2 py-0.5 rounded shrink-0">
          {categoryLabels[yojana.category] || yojana.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-base leading-snug mb-0.5">
        {yojana.titleLocal}
      </h3>
      <p className="text-white/50 text-xs mb-3 italic">{yojana.title}</p>

      {/* Department */}
      <p className="text-white/60 text-xs mb-3">🏢 {yojana.department}</p>

      {/* Beneficiary */}
      <div className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2 mb-3">
        <span className="text-base shrink-0">👥</span>
        <div>
          <p className="text-white/50 text-[10px] uppercase tracking-wide mb-0.5">लाभार्थी</p>
          <p className="text-white/80 text-xs">{yojana.beneficiary}</p>
        </div>
      </div>

      {/* Benefit */}
      <div className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2 mb-4">
        <span className="text-base shrink-0">🎁</span>
        <div>
          <p className="text-white/50 text-[10px] uppercase tracking-wide mb-0.5">लाभ</p>
          <p className="text-white/80 text-xs leading-relaxed">{yojana.benefit}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-2">
        <a
          href={yojana.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 transition-colors"
        >
          आवेदन / अधिक जानकारी →
        </a>
        <button
          onClick={() => {
            const text = `${yojana.titleLocal}\n${yojana.benefit}\n\nअधिक जानें: ${yojana.link}`;
            if (navigator.share) {
              navigator.share({ title: yojana.titleLocal, text: yojana.benefit, url: yojana.link }).catch(() => {});
            } else {
              navigator.clipboard.writeText(text).then(() => alert('Link copied!')).catch(() => {});
            }
          }}
          className="shrink-0 p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
          title="Share"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SarkaariYojanaPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = SARKAARI_YOJANA.filter((y) => {
    const matchCat = activeCategory === 'all' || y.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      y.title.toLowerCase().includes(q) ||
      y.titleLocal.includes(q) ||
      y.beneficiary.toLowerCase().includes(q) ||
      y.benefit.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] =
      cat.id === 'all'
        ? SARKAARI_YOJANA.length
        : SARKAARI_YOJANA.filter((y) => y.category === cat.id).length;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <SEO
        title="सरकारी योजनाएं | उत्तराखंड | Pahadi Tube"
        description="उत्तराखंड में चल रही प्रमुख सरकारी योजनाओं की जानकारी — स्वास्थ्य, शिक्षा, कृषि, महिला, रोजगार, आवास और अधिक।"
        keywords="सरकारी योजनाएं उत्तराखंड, government schemes uttarakhand, atal ayushman, nanda devi kanya dhan, mukhyamantri yojana"
      />

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl shrink-0">
          🏛️
        </div>
        <div>
          <h1 className="page-header">सरकारी <span className="gradient-text">योजनाएं</span></h1>
          <p className="text-sm text-gray-400">उत्तराखंड सरकार की प्रमुख चल रही योजनाएं</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'कुल योजनाएं', value: SARKAARI_YOJANA.length, icon: '📋' },
          {
            label: 'सक्रिय / जारी',
            value: SARKAARI_YOJANA.filter((y) => y.status === 'active' || y.status === 'ongoing').length,
            icon: '✅',
          },
          {
            label: 'नई योजनाएं',
            value: SARKAARI_YOJANA.filter((y) => y.status === 'new').length,
            icon: '🆕',
          },
          {
            label: 'रजिस्ट्रेशन खुला',
            value: SARKAARI_YOJANA.filter((y) => y.status === 'registration-open').length,
            icon: '📝',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-dark-800 border border-white/10 rounded-xl p-4 text-center"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="योजना खोजें... (नाम, लाभार्थी, लाभ)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-800 border border-dark-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">✕</button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scroll-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
            {counts[cat.id] > 0 && (
              <span
                className={`text-[10px] rounded-full px-1.5 py-0.5 ${
                  activeCategory === cat.id
                    ? 'bg-black/20 text-black'
                    : 'bg-dark-600 text-gray-400'
                }`}
              >
                {counts[cat.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-lg font-medium">कोई योजना नहीं मिली</p>
          <p className="text-sm mt-1">अपनी खोज बदलकर देखें</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((yojana) => (
            <YojanaCard key={yojana.id} yojana={yojana} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-gray-600 text-xs mt-10">
        * यह जानकारी सार्वजनिक स्रोतों से ली गई है। आधिकारिक जानकारी के लिए संबंधित विभाग की वेबसाइट पर जाएं।
      </p>
    </div>
  );
}
