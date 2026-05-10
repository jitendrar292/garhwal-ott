// SarkaariYojanaRow — displays current govt schemes on homepage

import { useState, useEffect } from 'react';
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
  'social-welfare': 'from-teal-600 to-cyan-700',
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
  'social-welfare': 'समाज कल्याण',
};

const statusConfig = {
  active: { label: 'सक्रिय', bg: 'bg-emerald-500' },
  new: { label: 'नई', bg: 'bg-yellow-400 text-gray-900' },
  'registration-open': { label: 'रजिस्ट्रेशन खुला', bg: 'bg-blue-500' },
  ongoing: { label: 'जारी', bg: 'bg-teal-500' },
};

function YojanaModal({ yojana, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const status = statusConfig[yojana.status] || statusConfig.active;

  const handleShare = () => {
    const text = `${yojana.titleLocal}\n${yojana.benefit}\n\nआधिकारिक वेबसाइट: ${yojana.link}`;
    if (navigator.share) {
      navigator.share({ title: yojana.titleLocal, text: yojana.benefit, url: yojana.link }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Copied!')).catch(() => {});
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-dark-900 border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[85vh]">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{yojana.emoji}</span>
            <div>
              <h2 className="text-white font-bold text-lg leading-snug">{yojana.titleLocal}</h2>
              <p className="text-white/50 text-xs italic">{yojana.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 mt-1 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap px-5 pt-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${status.bg}`}>
            {status.label}
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
            {categoryLabels[yojana.category] || yojana.category}
          </span>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
            <span className="text-lg shrink-0">🏢</span>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">विभाग</p>
              <p className="text-white/80 text-sm">{yojana.department}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
            <span className="text-lg shrink-0">👥</span>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">लाभार्थी</p>
              <p className="text-white/80 text-sm">{yojana.beneficiary}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
            <span className="text-lg shrink-0">🎁</span>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">मुख्य लाभ</p>
              <p className="text-white/80 text-sm leading-relaxed">{yojana.benefit}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
            <span className="text-lg shrink-0">🌐</span>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">आधिकारिक वेबसाइट</p>
              <a
                href={yojana.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 text-sm break-all underline underline-offset-2"
              >
                {yojana.link}
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-24 sm:pb-8">
          <a
            href={yojana.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-xl py-3 transition-colors"
          >
            आवेदन / अधिक जानकारी →
          </a>
          <button
            onClick={handleShare}
            className="shrink-0 px-3 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
            title="Share"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function YojanaCard({ yojana, onClick }) {
  const status = statusConfig[yojana.status] || statusConfig.active;

  return (
    <div
      onClick={() => onClick(yojana)}
      className={`relative flex-shrink-0 w-72 sm:w-80 rounded-xl overflow-hidden bg-gradient-to-br ${
        categoryColors[yojana.category] || 'from-gray-600 to-slate-700'
      } shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 cursor-pointer`}
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

        {/* CTA hint */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/70">उत्तराखंड सरकार</span>
          <span className="text-[11px] bg-white/20 text-white px-3 py-1 rounded-full">
            विवरण देखें →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SarkaariYojanaRow() {
  const featured = SARKAARI_YOJANA.filter((y) => y.featured);
  const [selectedYojana, setSelectedYojana] = useState(null);

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-header">
            🏛️ <span className="gradient-text">सरकारी योजनाएं</span>
          </h2>
          <p className="text-white/50 text-xs mt-0.5">
            उत्तराखंड में चल रही प्रमुख सरकारी योजनाएं
          </p>
        </div>
        <Link
          to="/yojana"
          className="text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          सभी देखें →
        </Link>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {featured.map((yojana) => (
          <div key={yojana.id} className="snap-start">
            <YojanaCard yojana={yojana} onClick={setSelectedYojana} />
          </div>
        ))}
      </div>

      {selectedYojana && (
        <YojanaModal yojana={selectedYojana} onClose={() => setSelectedYojana(null)} />
      )}
    </section>
  );
}
