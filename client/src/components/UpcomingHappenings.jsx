import { useMemo, useState } from 'react';
import EVENTS from '../data/events';
import FESTIVALS from '../data/festivals';
import MELAS from '../data/melas';

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
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow';
  if (days <= 30) return `in ${days} days`;
  const weeks = Math.round(days / 7);
  if (days <= 90) return `in ${weeks} weeks`;
  const months = Math.round(days / 30);
  return `in ${months} months`;
}

function pastLabel(days) {
  const d = -days;
  if (d <= 1) return 'Yesterday';
  if (d <= 30) return `${d} days ago`;
  const weeks = Math.round(d / 7);
  if (d <= 90) return `${weeks} weeks ago`;
  const months = Math.round(d / 30);
  return `${months} months ago`;
}

// Unified type system. Keys are stable; labels + colours drive the UI.
const TYPES = {
  festival: { label: 'Festival', cls: 'bg-amber-600/85' },
  mela:     { label: 'Mela',     cls: 'bg-lime-600/85' },
  theatre:  { label: 'Theatre',  cls: 'bg-purple-600/85' },
  music:    { label: 'Music',    cls: 'bg-emerald-600/85' },
  fashion:  { label: 'Fashion',  cls: 'bg-pink-600/85' },
  art:      { label: 'Art',      cls: 'bg-cyan-600/85' },
  literary: { label: 'Literary', cls: 'bg-yellow-600/85' },
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

async function notifyHappening(item) {
  let key = localStorage.getItem('pahadi_admin_key') || '';
  if (!key) {
    key = window.prompt('Enter admin key to send notification:') || '';
    if (!key) return;
    localStorage.setItem('pahadi_admin_key', key);
  }
  const tag = TYPES[item.type];
  const days = daysUntil(item.date);
  const when = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
  const title = `${item.emoji || '🎉'} ${item.name}`;
  const body = `${tag ? tag.label + ' · ' : ''}${item.location || 'Uttarakhand'} · ${when}`;
  try {
    const res = await fetch(`/api/push/send?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.slice(0, 80),
        body: body.slice(0, 200),
        url: '/',
        tag: `happening-${item.id}`,
      }),
    });
    if (res.status === 401) {
      localStorage.removeItem('pahadi_admin_key');
      alert('Wrong admin key. Try again.');
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert('Failed to send: ' + (data.error || res.status));
      return;
    }
    alert(`Sent to ${data.sent ?? '?'} device(s)${data.failed ? `, ${data.failed} failed` : ''}.`);
  } catch (err) {
    alert('Network error: ' + err.message);
  }
}

function HappeningCard({ item, isPast }) {
  const days = daysUntil(item.date);
  const tag = TYPES[item.type];
  const dateLabel = formatRange(item.date, item.endDate);
  const timeLabel = isPast ? pastLabel(days) : countdownLabel(days);
  const isAdmin = typeof window !== 'undefined' && !!localStorage.getItem('pahadi_admin_key');

  return (
    <article
      className={`w-[270px] sm:w-[290px] rounded-2xl bg-gradient-to-br ${item.bg} p-4 shadow-lg shadow-black/30 ring-1 ring-white/10 hover:scale-[1.02] transition-transform ${isPast ? 'opacity-80' : ''}`}
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="text-4xl drop-shadow">{item.emoji}</div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider font-bold text-white/85 bg-black/30 rounded-full px-2 py-0.5">
            {timeLabel}
          </div>
          <div className="mt-1 text-[11px] text-white/85">{dateLabel}</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        {tag && (
          <span className={`text-[9px] uppercase tracking-wider font-bold text-white px-2 py-0.5 rounded-full ${tag.cls}`}>
            {tag.label}
          </span>
        )}
        {isPast && (
          <span className="text-[9px] uppercase tracking-wider font-bold text-white/90 px-2 py-0.5 rounded-full bg-black/40">
            Recent
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-white leading-tight">{item.name}</h3>
      {item.nameLocal && (
        <div className="text-sm text-white/90 font-medium">{item.nameLocal}</div>
      )}
      {item.location && (
        <div className="mt-1 text-[11px] text-white/75 font-medium">📍 {item.location}</div>
      )}
      {item.organizer && (
        <div className="text-[11px] text-white/65">{item.organizer}</div>
      )}
      <p className="mt-2 text-[12px] text-white/85 leading-snug line-clamp-3">
        {item.description}
      </p>
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[11px] font-semibold text-white/95 underline underline-offset-2 hover:text-white"
        >
          Learn more →
        </a>
      )}
      {!isPast && (
        <button
          type="button"
          onClick={() => notifyHappening(item)}
          className="mt-3 w-full text-[11px] font-bold uppercase tracking-wider text-white bg-black/35 hover:bg-black/55 rounded-full px-3 py-1.5 ring-1 ring-white/20 transition-colors"
          title={isAdmin ? 'Send push notification to all devices' : 'Admin only — will ask for key'}
        >
          🔔 Notify {isAdmin ? '' : '(admin)'}
        </button>
      )}
    </article>
  );
}

export default function UpcomingHappenings() {
  const [filter, setFilter] = useState('all');

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

  return (
    <section className="my-8">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-bold text-white">
          🎉 Upcoming in Uttarakhand
        </h2>
        <span className="text-xs sm:text-sm text-white/50">
          Festivals · Melas · Theatre · Events
        </span>
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
        {filters.map((key) => {
          const isActive = filter === key;
          const tag = TYPES[key];
          const label = key === 'all' ? 'All' : tag.label;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full transition-colors ${
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
          <HappeningCard key={i.id} item={i} isPast={false} />
        ))}
        {visiblePast.map((i) => (
          <HappeningCard key={i.id} item={i} isPast={true} />
        ))}
      </div>
    </section>
  );
}
