// SarkaariYojanaRow — displays current govt schemes on homepage

import { Link } from 'react-router-dom';
import SARKAARI_YOJANA from '../data/sarkaariYojana';

const categoryColors = {
  health: 'from-rose-600 to-pink-700',
  education: 'from-purple-600 to-violet-700',
  agriculture: 'from-green-600 to-emerald-700',
  women: 'from-fuchsia-500 to-pink-600',
  youth: 'from-orange-500 to-amber-600',
  housing: 'from-cyan-600 to-sky-700',
  employment: 'from-blue-600 to-indigo-700',
  infrastructure: 'from-slate-600 to-gray-700',
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
  active: { label: 'सक्रिय', bg: 'bg-emerald-500' },
  new: { label: 'नई', bg: 'bg-yellow-400 text-gray-900' },
  'registration-open': { label: 'रजिस्ट्रेशन खुला', bg: 'bg-blue-500' },
  ongoing: { label: 'जारी', bg: 'bg-teal-500' },
};

function YojanaCard({ yojana }) {
  const status = statusConfig[yojana.status] || statusConfig.active;

  return (
    <a
      href={yojana.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative flex-shrink-0 w-72 sm:w-80 rounded-xl overflow-hidden bg-gradient-to-br ${
        categoryColors[yojana.category] || 'from-gray-600 to-slate-700'
      } shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer block`}
    >
      {/* Status badge */}
      <div
        className={`absolute top-2 right-2 ${status.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
      >
        {status.label}
      </div>

      <div className="p-4">
        {/* Category + Emoji */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{yojana.emoji}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80 bg-white/20 px-2 py-0.5 rounded">
            {categoryLabels[yojana.category] || yojana.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm leading-snug mb-1 line-clamp-2">
          {yojana.titleLocal || yojana.title}
        </h3>
        <p className="text-white/70 text-xs mb-2 line-clamp-1">{yojana.department}</p>

        {/* Beneficiary */}
        <div className="flex items-start gap-1.5 text-[11px] text-white/80 mb-2">
          <span className="shrink-0">👤</span>
          <span className="line-clamp-1">{yojana.beneficiary}</span>
        </div>

        {/* Benefit */}
        <p className="text-white/90 text-xs leading-relaxed line-clamp-2 mb-3">
          {yojana.benefit}
        </p>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/70">उत्तराखंड सरकार</span>
          <span className="text-[11px] bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors">
            अधिक जानें →
          </span>
        </div>
      </div>
    </a>
  );
}

export default function SarkaariYojanaRow() {
  const featured = SARKAARI_YOJANA.filter((y) => y.featured);

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            🏛️ सरकारी योजनाएं
          </h2>
          <p className="text-white/50 text-xs mt-0.5">
            उत्तराखंड में चल रही प्रमुख सरकारी योजनाएं
          </p>
        </div>
        <Link
          to="/yojana"
          className="text-xs text-primary-400 hover:text-primary-300 font-medium shrink-0 transition-colors"
        >
          सभी देखें →
        </Link>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {featured.map((yojana) => (
          <div key={yojana.id} className="snap-start">
            <YojanaCard yojana={yojana} />
          </div>
        ))}
      </div>
    </section>
  );
}
