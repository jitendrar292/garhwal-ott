import { useMemo, useState, useEffect } from 'react';
import EVENTS from '../data/events';
import FESTIVALS from '../data/festivals';
import MELAS from '../data/melas';
import NotifyButton from './NotifyButton';

// Unified "Happenings" row — merges festivals, melas and cultural events
// into one horizontally-scrolling list. Each card shows a coloured TYPE
// tag (Festival / Mela / Theatre / Music / etc.) so users can scan the
// nature of each entry at a glance. A row of pill filters lets the user
// narrow down by type.
const MAX_UPCOMING = 12;
const MAX_PAST = 4;
const PAST_WINDOW_DAYS = 120;

function daysUntil(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T00:00:00');
  return Math.round((target - today) / 86400000);
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatRange(start, end) {
  if (!end || end === start) return formatDate(start);
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.getDate()}–${e.getDate()} ${e.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function countdownLabel(days) {
  if (days === 0) return 'आज!';
  if (days === 1) return 'सुबेर';
  if (days <= 30) return `${days} दिन बचिं`;
  const weeks = Math.round(days / 7);
  if (days <= 90) return `${weeks} हफ्ता बचिं`;
  const months = Math.round(days / 30);
  return `${months} महीना बचिं`;
}

function pastLabel(days) {
  const d = -days;
  if (d <= 1) return 'ब्यखुनी';
  if (d <= 30) return `${d} दिन पैल्ली`;
  const weeks = Math.round(d / 7);
  if (d <= 90) return `${weeks} हफ्ता पैल्ली`;
  const months = Math.round(d / 30);
  return `${months} महीना पैल्ली`;
}

// Unified type system. Keys are stable; labels + colours drive the UI.
const TYPES = {
  festival: { label: 'त्योहार', cls: 'bg-amber-500/85',   solid: 'bg-amber-700'   },
  mela:     { label: 'मेला',    cls: 'bg-lime-500/85',    solid: 'bg-lime-700'    },
  theatre:  { label: 'रंगमंच',  cls: 'bg-purple-500/85',  solid: 'bg-purple-700'  },
  music:    { label: 'गीत',     cls: 'bg-emerald-500/85', solid: 'bg-emerald-700' },
  fashion:  { label: 'पैरण',    cls: 'bg-pink-500/85',    solid: 'bg-pink-700'    },
  art:      { label: 'कला',     cls: 'bg-cyan-500/85',    solid: 'bg-cyan-700'    },
  literary: { label: 'साहित्य', cls: 'bg-yellow-500/85',  solid: 'bg-yellow-700'  },
};

// Event-data 'category' values that are really "events" (not festivals).
// 'fest' is a generic event-style fest (not a Hindu festival), so it maps
// to a generic Event tag.
const EVENT_CATEGORY_TO_TYPE = {
  theatre: 'theatre',
  music: 'music',
  fashion: 'fashion',
  art: 'art',
  literary: 'literary',
  fest: 'festival', // university/cultural fests still feel "festival-y"
};

// Normalise the three sources into a single shape the card can render.
function normaliseFestival(f) {
  return {
    id: `fest-${f.id}`,
    type: 'festival',
    name: f.name,
    nameLocal: f.nameLocal,
    date: f.date,
    endDate: null,
    location: f.region,
    organizer: null,
    description: f.description,
    emoji: f.emoji,
    bg: f.bg,
    link: null,
  };
}

function normaliseMela(m) {
  return {
    id: `mela-${m.id}`,
    type: 'mela',
    name: m.name,
    nameLocal: m.nameLocal,
    date: m.date,
    endDate: m.endDate || null,
    location: m.region || m.location,
    organizer: null,
    description: m.description,
    emoji: m.emoji,
    bg: m.bg,
    link: null,
  };
}

function normaliseEvent(e) {
  return {
    id: `evt-${e.id}`,
    type: EVENT_CATEGORY_TO_TYPE[e.category] || 'festival',
    name: e.name,
    nameLocal: e.nameLocal,
    date: e.date,
    endDate: e.endDate || null,
    location: e.location,
    organizer: e.organizer,
    description: e.description,
    emoji: e.emoji,
    bg: e.bg,
    link: e.link || null,
  };
}

function HappeningCard({ item, isPast, onClick }) {
  const days = daysUntil(item.date);
  const tag = TYPES[item.type];
  const dateLabel = formatRange(item.date, item.endDate);
  const timeLabel = isPast ? pastLabel(days) : countdownLabel(days);
  const solidBg = (tag && tag.solid) || 'bg-slate-700';

  return (
    <article
      onClick={() => onClick(item)}
      className={`relative w-[260px] sm:w-[280px] rounded-2xl ${solidBg} p-4 shadow-lg shadow-black/30 ring-1 ring-white/10 hover:scale-[1.02] hover:ring-white/30 transition-all overflow-hidden cursor-pointer ${isPast ? 'opacity-80' : ''}`}
    >
      {/* dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 20%, #fff 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="text-4xl drop-shadow">{item.emoji}</div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-bold text-white/90 bg-black/35 rounded-full px-2 py-0.5">
              {timeLabel}
            </div>
            <div className="mt-1 text-[11px] text-white/85">{dateLabel}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          {tag && (
            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${tag.cls}`}>
              {tag.label}
            </span>
          )}
          {isPast && (
            <span className="text-[10px] font-bold text-white/90 px-2 py-0.5 rounded-full bg-black/45">
              हाल का
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-white leading-tight">{item.name}</h3>
        {item.nameLocal && (
          <div className="text-sm text-white/90 font-medium">{item.nameLocal}</div>
        )}
        {item.location && (
          <div className="mt-1 text-[11px] text-white/80 font-medium">📍 {item.location}</div>
        )}
        <p className="mt-2 text-[12px] text-white/85 leading-snug line-clamp-2">
          {item.description}
        </p>
        <div className="mt-3 text-[11px] text-white/70 font-semibold flex items-center gap-1">
          <span>विवरण देखें</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  );
}

// ── Detail Modal ──
function HappeningModal({ item, onClose }) {
  const days = daysUntil(item.date);
  const tag = TYPES[item.type];
  const dateLabel = formatRange(item.date, item.endDate);
  const timeLabel = days >= 0 ? countdownLabel(days) : pastLabel(days);
  const solidBg = (tag && tag.solid) || 'bg-slate-700';
  const mapsQuery = encodeURIComponent(item.location + ', Uttarakhand, India');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleShare = () => {
    const text = `${item.emoji} ${item.name}${item.nameLocal ? ' · ' + item.nameLocal : ''}\n📅 ${dateLabel}\n📍 ${item.location}\n\n${item.description}`;
    if (navigator.share) {
      navigator.share({ title: item.name, text, url: item.link || window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Copied!')).catch(() => {});
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet / Modal */}
      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className={`relative ${solidBg} px-5 pt-5 pb-6`}>
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />
          {/* Drag handle (mobile) */}
          <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="text-5xl drop-shadow">{item.emoji}</div>
            <button
              onClick={onClose}
              className="mt-1 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative mt-2">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {tag && (
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${tag.cls}`}>
                  {tag.label}
                </span>
              )}
              <span className="text-[10px] font-bold text-white/90 bg-black/30 px-2 py-0.5 rounded-full">
                {timeLabel}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{item.name}</h2>
            {item.nameLocal && (
              <p className="text-base text-white/90 font-medium">{item.nameLocal}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="bg-dark-900 px-5 py-5 space-y-4 max-h-[60vh] overflow-y-auto">

          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-lg shrink-0">📅</div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">तारीख</p>
              <p className="text-white font-semibold">{dateLabel}</p>
              {item.endDate && item.endDate !== item.date && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {Math.round((new Date(item.endDate + 'T00:00:00') - new Date(item.date + 'T00:00:00')) / 86400000) + 1} दिन का आयोजन
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          {item.location && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-lg shrink-0">📍</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">स्थान / Venue</p>
                <p className="text-white font-semibold">{item.location}</p>
                <p className="text-xs text-gray-400">Uttarakhand, India</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Google Maps पर देखें
                </a>
              </div>
            </div>
          )}

          {/* Organizer */}
          {item.organizer && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-lg shrink-0">🏛️</div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">आयोजक</p>
                <p className="text-white font-semibold">{item.organizer}</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg shrink-0">📝</div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">विवरण</p>
              <p className="text-gray-200 text-sm leading-relaxed mt-1">{item.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 rounded-xl bg-white text-dark-950 font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                और जाणा →
              </a>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Map
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpcomingHappenings() {
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const { upcoming, past, presentTypes } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const pastCutoffMs = todayMs - PAST_WINDOW_DAYS * 86400000;

    const all = [
      ...FESTIVALS.map(normaliseFestival),
      ...MELAS.map(normaliseMela),
      ...EVENTS.map(normaliseEvent),
    ].sort((a, b) => a.date.localeCompare(b.date));

    const upcoming = all.filter(
      (i) => new Date(i.date + 'T00:00:00').getTime() >= todayMs,
    );
    const past = all
      .filter((i) => {
        const t = new Date(i.date + 'T00:00:00').getTime();
        return t < todayMs && t >= pastCutoffMs;
      })
      .reverse();

    const presentTypes = new Set([...upcoming, ...past].map((i) => i.type));

    return { upcoming, past, presentTypes };
  }, []);

  const visibleUpcoming = useMemo(() => {
    const filtered = filter === 'all' ? upcoming : upcoming.filter((i) => i.type === filter);
    return filtered.slice(0, MAX_UPCOMING);
  }, [upcoming, filter]);

  const visiblePast = useMemo(() => {
    const filtered = filter === 'all' ? past : past.filter((i) => i.type === filter);
    return filtered.slice(0, MAX_PAST);
  }, [past, filter]);

  if (upcoming.length === 0 && past.length === 0) return null;

  // Build the filter pills in a stable order, only for types that exist.
  const filterOrder = ['all', 'festival', 'mela', 'theatre', 'music', 'fashion', 'art', 'literary'];
  const filters = filterOrder.filter((k) => k === 'all' || presentTypes.has(k));
  const filterLabel = (k) => (k === 'all' ? 'सब' : TYPES[k].label);

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h2 className="section-header">
          🎉 <span className="gradient-text">उत्तराखण्ड मा आणे वाला</span>
        </h2>
        <NotifyButton />
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
        {filters.map((key) => {
          const isActive = filter === key;
          const tag = TYPES[key];
          const label = filterLabel(key);
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 text-[11px] font-bold px-3 py-1 rounded-full transition-colors ${
                isActive
                  ? key === 'all'
                    ? 'bg-white text-dark-950'
                    : `${tag.cls} text-white`
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="scroll-row -mx-4 px-4 sm:mx-0 sm:px-0">
        {visibleUpcoming.map((i) => (
          <HappeningCard key={i.id} item={i} isPast={false} onClick={setSelectedItem} />
        ))}
        {visiblePast.map((i) => (
          <HappeningCard key={i.id} item={i} isPast={true} onClick={setSelectedItem} />
        ))}
      </div>

      {selectedItem && (
        <HappeningModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
}
