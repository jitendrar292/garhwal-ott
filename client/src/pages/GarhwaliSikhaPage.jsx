// GarhwaliSikhaPage — Learn Garhwali language
// /garhwali-sikha route

import { useState, useMemo } from 'react';
import SEO from '../components/SEO';
import PHRASES, { LEARN_CATEGORIES } from '../data/garhwaliLearn';

// Word of the day — deterministic pick based on day of year
function getWordOfDay() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return PHRASES[day % PHRASES.length];
}

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Flashcard ──
function FlashCard({ phrase, showHindi }) {
  const [flipped, setFlipped] = useState(false);
  // reset when phrase changes
  useMemo(() => setFlipped(false), [phrase.id]);

  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '180px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-indigo-500/40 p-6 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-3xl font-bold text-white mb-3">{phrase.garhwali}</p>
          <p className="text-sm text-indigo-300 font-mono">🔊 {phrase.pronunciation}</p>
          <p className="text-xs text-gray-500 mt-4">Tap to reveal meaning</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-900/80 to-teal-900/80 border border-emerald-500/40 p-6 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {showHindi && <p className="text-2xl font-bold text-white mb-1">{phrase.hindi}</p>}
          <p className={`${showHindi ? 'text-lg text-emerald-300' : 'text-2xl font-bold text-white'}`}>
            {phrase.english}
          </p>
          <p className="text-xs text-gray-400 mt-3 font-mono">🔊 {phrase.pronunciation}</p>
          <p className="text-xs text-gray-500 mt-2">Tap to flip back</p>
        </div>
      </div>
    </div>
  );
}

// ── Quiz ──
function Quiz({ phrases, onExit }) {
  const [queue] = useState(() => shuffle(phrases).slice(0, Math.min(10, phrases.length)));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null); // null | 'correct' | 'wrong'
  const [done, setDone] = useState(false);

  const current = queue[idx];

  // Build 4 options (1 correct + 3 random wrong)
  const options = useMemo(() => {
    if (!current) return [];
    const wrongs = shuffle(phrases.filter((p) => p.id !== current.id)).slice(0, 3);
    return shuffle([current, ...wrongs]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const pick = (p) => {
    if (chosen) return;
    const correct = p.id === current.id;
    setChosen(correct ? 'correct' : 'wrong');
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= queue.length) {
        setDone(true);
      } else {
        setIdx((i) => i + 1);
        setChosen(null);
      }
    }, 900);
  };

  if (done) {
    const pct = Math.round((score / queue.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <h2 className="text-2xl font-bold text-white">
          {pct >= 80 ? 'शाबाश! बहुत भलो!' : pct >= 50 ? 'भलो कोशिश!' : 'अभ्यास करते रहो!'}
        </h2>
        <p className="text-gray-400">
          {score} / {queue.length} सही ({pct}%)
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onExit}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            वापस जाओ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
            style={{ width: `${((idx) / queue.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{idx + 1}/{queue.length}</span>
        <span className="text-xs text-emerald-400">✓ {score}</span>
      </div>

      {/* Question */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 p-8 text-center">
        <p className="text-xs text-indigo-300 uppercase tracking-widest mb-3">इस गढ़वाली शब्द का मतलब क्या है?</p>
        <p className="text-4xl font-bold text-white">{current.garhwali}</p>
        <p className="text-sm text-indigo-300 font-mono mt-2">🔊 {current.pronunciation}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let cls = 'rounded-xl border p-3 text-sm font-medium text-center transition-all cursor-pointer ';
          if (!chosen) {
            cls += 'border-dark-600 bg-dark-800 text-white hover:border-indigo-500 hover:bg-indigo-900/30';
          } else if (opt.id === current.id) {
            cls += 'border-emerald-500 bg-emerald-900/40 text-emerald-300';
          } else if (chosen === 'wrong' && opt.id !== current.id) {
            cls += 'border-red-500/30 bg-red-900/20 text-gray-500';
          } else {
            cls += 'border-dark-600 bg-dark-800 text-gray-500';
          }
          return (
            <button key={opt.id} className={cls} onClick={() => pick(opt)}>
              <div className="font-bold">{opt.hindi}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.english}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ──
export default function GarhwaliSikhaPage() {
  const [activeCategory, setActiveCategory] = useState('greetings');
  const [showHindi, setShowHindi] = useState(true);
  const [cardIdx, setCardIdx] = useState(0);
  const [mode, setMode] = useState('browse'); // 'browse' | 'flashcard' | 'quiz'
  const [search, setSearch] = useState('');

  const wordOfDay = useMemo(() => getWordOfDay(), []);

  const categoryPhrases = useMemo(
    () => PHRASES.filter((p) => p.category === activeCategory),
    [activeCategory],
  );

  const filteredPhrases = useMemo(() => {
    if (!search.trim()) return categoryPhrases;
    const q = search.toLowerCase();
    return PHRASES.filter(
      (p) =>
        p.garhwali.toLowerCase().includes(q) ||
        p.hindi.toLowerCase().includes(q) ||
        p.english.toLowerCase().includes(q),
    );
  }, [search, categoryPhrases]);

  const currentPhrase = categoryPhrases[cardIdx] || categoryPhrases[0];

  const prevCard = () => setCardIdx((i) => (i > 0 ? i - 1 : categoryPhrases.length - 1));
  const nextCard = () => setCardIdx((i) => (i < categoryPhrases.length - 1 ? i + 1 : 0));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <SEO
        title="गढ़वाली सीखा - Learn Garhwali Language"
        description="Learn Garhwali language with flashcards, quiz, and everyday phrases. Greetings, numbers, family, food and more in Garhwali."
        path="/garhwali-sikha"
        keywords="learn Garhwali, Garhwali language, Garhwali phrases, Garhwali vocabulary, Pahadi language"
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl">
          📖
        </div>
        <div>
          <h1 className="page-header">गढ़वाली <span className="gradient-text">सीखा</span></h1>
          <p className="text-sm text-gray-400">Learn Garhwali — Your Pahadi Language</p>
        </div>
      </div>

      {/* Word of the Day */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-500/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">✨ आज का शब्द</span>
          <span className="text-xs text-amber-400/60">Word of the Day</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-2xl font-bold text-white">{wordOfDay.garhwali}</p>
            <p className="text-sm text-amber-300 font-mono mt-0.5">🔊 {wordOfDay.pronunciation}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-white">{wordOfDay.hindi}</p>
            <p className="text-sm text-gray-400">{wordOfDay.english}</p>
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'browse',    label: '📚 Browse',     },
          { id: 'flashcard', label: '🃏 Flashcards', },
          { id: 'quiz',      label: '🎯 Quiz',       },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setCardIdx(0); setSearch(''); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === m.id
                ? 'bg-white text-black shadow-md'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scroll-row">
        {LEARN_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setCardIdx(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            <span>{cat.emoji}</span>{cat.label}
          </button>
        ))}
      </div>

      {/* ── FLASHCARD MODE ── */}
      {mode === 'flashcard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{cardIdx + 1} / {categoryPhrases.length}</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <span>Show Hindi</span>
              <div
                onClick={() => setShowHindi((v) => !v)}
                className={`relative w-9 h-5 rounded-full transition-colors ${showHindi ? 'bg-amber-500' : 'bg-dark-600'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showHindi ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>
          <FlashCard phrase={currentPhrase} showHindi={showHindi} />
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={prevCard}
              className="w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-white transition-colors"
            >
              ←
            </button>
            <span className="text-xs text-gray-500">Tap card to flip</span>
            <button
              onClick={nextCard}
              className="w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-white transition-colors"
            >
              →
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1 flex-wrap mt-2">
            {categoryPhrases.map((_, i) => (
              <button
                key={i}
                onClick={() => setCardIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === cardIdx ? 'bg-amber-400 w-4' : 'bg-dark-600'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── QUIZ MODE ── */}
      {mode === 'quiz' && (
        <Quiz
          phrases={categoryPhrases}
          onExit={() => setMode('browse')}
        />
      )}

      {/* ── BROWSE MODE ── */}
      {mode === 'browse' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Garhwali / Hindi / English..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-800 border border-dark-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >✕</button>
            )}
          </div>

          <p className="text-xs text-gray-500">{filteredPhrases.length} phrases</p>

          <div className="space-y-2">
            {filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="rounded-xl bg-dark-800 border border-dark-700 hover:border-amber-500/40 transition-colors p-4"
              >
                {phrase.meaning ? (
                  /* औखाण / muhavare — full-width stacked layout */
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-lg font-bold text-white leading-snug">{phrase.garhwali}</p>
                      <p className="text-sm font-semibold text-white shrink-0 text-right">{phrase.hindi}</p>
                    </div>
                    <p className="text-sm text-amber-300 font-mono mt-1">🔊 {phrase.pronunciation}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{phrase.english}</p>
                    <p className="text-xs text-gray-400 mt-2 italic leading-relaxed border-t border-white/5 pt-2">
                      💬 {phrase.meaning}
                    </p>
                  </div>
                ) : (
                  /* regular vocab — side-by-side layout */
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-white">{phrase.garhwali}</p>
                      <p className="text-sm text-amber-300 font-mono mt-0.5">🔊 {phrase.pronunciation}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-semibold text-white">{phrase.hindi}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{phrase.english}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredPhrases.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-400">No phrases found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
