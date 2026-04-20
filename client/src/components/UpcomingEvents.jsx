import { useMemo } from 'react';
import EVENTS from '../data/events';

// Show upcoming events first, then a few recent past ones (kept for context).
// Mirrors the styling of UpcomingFestivals / UpcomingMelas.
const MAX_UPCOMING = 8;
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
  // Same month → "12–14 May 2026"
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

const CATEGORY_BADGES = {
  theatre: { label: 'Theatre', cls: 'bg-purple-600/80' },
  music: { label: 'Music', cls: 'bg-emerald-600/80' },
  fashion: { label: 'Fashion', cls: 'bg-pink-600/80' },
  fest: { label: 'Festival', cls: 'bg-amber-600/80' },
  art: { label: 'Art', cls: 'bg-cyan-600/80' },
  literary: { label: 'Literary', cls: 'bg-yellow-600/80' },
};

function EventCard({ event, isPast }) {
  const days = daysUntil(event.date);
  const cat = CATEGORY_BADGES[event.category];
  const dateLabel = formatRange(event.date, event.endDate);
  const timeLabel = isPast ? pastLabel(days) : countdownLabel(days);

  return (
    <article
      className={`w-[270px] sm:w-[290px] rounded-2xl bg-gradient-to-br ${event.bg} p-4 shadow-lg shadow-black/30 ring-1 ring-white/10 hover:scale-[1.02] transition-transform ${isPast ? 'opacity-80' : ''}`}
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="text-4xl drop-shadow">{event.emoji}</div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider font-bold text-white/85 bg-black/30 rounded-full px-2 py-0.5">
            {timeLabel}
          </div>
          <div className="mt-1 text-[11px] text-white/85">{dateLabel}</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        {cat && (
          <span className={`text-[9px] uppercase tracking-wider font-bold text-white px-2 py-0.5 rounded-full ${cat.cls}`}>
            {cat.label}
          </span>
        )}
        {isPast && (
          <span className="text-[9px] uppercase tracking-wider font-bold text-white/90 px-2 py-0.5 rounded-full bg-black/40">
            Recent
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-white leading-tight">{event.name}</h3>
      {event.nameLocal && (
        <div className="text-sm text-white/90 font-medium">{event.nameLocal}</div>
      )}
      <div className="mt-1 text-[11px] text-white/75 font-medium">📍 {event.location}</div>
      {event.organizer && (
        <div className="text-[11px] text-white/65">{event.organizer}</div>
      )}
      <p className="mt-2 text-[12px] text-white/85 leading-snug line-clamp-3">
        {event.description}
      </p>
      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[11px] font-semibold text-white/95 underline underline-offset-2 hover:text-white"
        >
          Learn more →
        </a>
      )}
    </article>
  );
}

export default function UpcomingEvents() {
  const { upcoming, past } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const pastCutoffMs = todayMs - PAST_WINDOW_DAYS * 86400000;

    const sorted = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
    const upcoming = sorted
      .filter((e) => new Date(e.date + 'T00:00:00').getTime() >= todayMs)
      .slice(0, MAX_UPCOMING);
    const past = sorted
      .filter((e) => {
        const t = new Date(e.date + 'T00:00:00').getTime();
        return t < todayMs && t >= pastCutoffMs;
      })
      .reverse() // most recent first
      .slice(0, MAX_PAST);

    return { upcoming, past };
  }, []);

  if (upcoming.length === 0 && past.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          🎭 Theatre · Art · Music Events
        </h2>
        <span className="text-xs sm:text-sm text-white/50">
          Universities · Local fests
        </span>
      </div>

      <div className="scroll-row -mx-4 px-4 sm:mx-0 sm:px-0">
        {upcoming.map((e) => (
          <EventCard key={e.id} event={e} isPast={false} />
        ))}
        {past.map((e) => (
          <EventCard key={e.id} event={e} isPast={true} />
        ))}
      </div>
    </section>
  );
}
