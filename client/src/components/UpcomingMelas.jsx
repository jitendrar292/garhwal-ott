import { useMemo } from 'react';
import MELAS from '../data/melas';

// Show the next N upcoming melas (>= today). Mirrors UpcomingFestivals
// styling so the home page reads as a consistent series of cards.
const MAX_CARDS = 8;

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

function countdownLabel(days) {
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow';
  if (days <= 30) return `in ${days} days`;
  const weeks = Math.round(days / 7);
  if (days <= 90) return `in ${weeks} weeks`;
  const months = Math.round(days / 30);
  return `in ${months} months`;
}

export default function UpcomingMelas() {
  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return MELAS
      .filter((m) => new Date(m.date + 'T00:00:00') >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, MAX_CARDS);
  }, []);

  if (upcoming.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-bold text-white">
          🎪 Upcoming Melas
        </h2>
        <span className="text-xs sm:text-sm text-white/50">
          Garhwal · Kumaon · Jaunsar
        </span>
      </div>

      <div className="scroll-row -mx-4 px-4 sm:mx-0 sm:px-0">
        {upcoming.map((m) => {
          const days = daysUntil(m.date);
          return (
            <article
              key={m.id}
              className={`w-[260px] sm:w-[280px] rounded-2xl bg-gradient-to-br ${m.bg} p-4 shadow-lg shadow-black/30 ring-1 ring-white/10 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-4xl drop-shadow">{m.emoji}</div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-white/80 bg-black/25 rounded-full px-2 py-0.5">
                    {countdownLabel(days)}
                  </div>
                  <div className="mt-1 text-[11px] text-white/85">
                    {formatDate(m.date)}
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-white leading-tight">
                {m.name}
              </h3>
              <div className="text-sm text-white/90 font-medium">
                {m.nameLocal}
              </div>
              <div className="mt-1 text-[11px] text-white/70 font-medium">
                📍 {m.region}
              </div>
              <p className="mt-2 text-[12px] text-white/85 leading-snug line-clamp-4">
                {m.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
