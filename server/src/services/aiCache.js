const NodeCache = require('node-cache');
const crypto = require('crypto');
const glossary = require('../data/garhwali-glossary');
const grammarRef = require('../data/viewuttarakhand-grammar');
const himlingo = require('../data/himlingo-dictionary');
const garhwaliiVocab = require('../data/garhwalii-vocab');
const himlingoPhrases = require('../data/himlingo-phrases');
const himlingoFolkStories = require('../data/himlingo-folkstories');
const himlingoLessons = require('../data/himlingo-lessons');
const fewshot = require('../data/garhwali-fewshot');
const { generateAll: generateFewShotPairs } = require('../data/garhwali-fewshot-generator');

// ===== Response cache =====
// Caches assistant replies keyed by a hash of the conversation tail.
// TTL 24h. Saves Groq tokens for repeated/similar questions.
const responseCache = new NodeCache({
  stdTTL: 24 * 60 * 60,
  checkperiod: 60 * 60,
  maxKeys: 1000,
});

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Collapse repeated Latin letters so romanized Garhwali variants match a
// single canonical tag. People type the same word many ways:
//   "duur" / "dur" / "duuur"           -> दूर
//   "bhujji" / "bhujjii" / "bhuji"     -> भुज्जि
//   "namaste" / "namaaste"             -> नमस्ते
// We fold any run of the same a-z letter down to one occurrence and apply
// the same fold to both the glossary index and the user's query, so all of
// those spellings hit the same row. Devanagari is left untouched.
function collapseRoman(text) {
  return String(text || '').toLowerCase().replace(/([a-z])\1+/g, '$1');
}

function hashConversation(messages) {
  // Hash last user message + last 2 turns of context for stability.
  const tail = messages.slice(-5).map((m) => `${m.role}:${normalize(m.content)}`).join('|');
  return crypto.createHash('sha256').update(tail).digest('hex');
}

function getCached(messages) {
  return responseCache.get(hashConversation(messages));
}

function setCached(messages, reply) {
  if (!reply || reply.length < 5) return;
  responseCache.set(hashConversation(messages), reply);
}

// ===== Glossary RAG =====
// Token-aware keyword retrieval. Each entry is pre-tokenized into per-field
// token sets so we can score *how* a query token matches, not just whether
// it appears as a substring anywhere. Three things this fixes vs. the old
// `entry.looseText.includes(tok)` approach:
//
//   1. Short/common tokens like "ka", "se", "है" no longer drag in dozens
//      of unrelated entries via accidental substring overlap (e.g. "ka"
//      matching "kapa", "kaka", "akash"). Tokens < 3 chars now require an
//      exact whole-token match.
//   2. Whole-token matches in the curated `tags` field score 5× higher than
//      a substring hit deep inside a `note`. Tags ARE the search keywords,
//      so a hit there is the strongest possible signal.
//   3. Coverage matters: an entry matching 3 distinct query tokens beats
//      one matching the same token 3 times. Stops a single common word
//      from dominating the ranking.
//
// Two tiers are merged into one index:
//   1. Curated `glossary` — hand-written entries with hi + en + tags + notes.
//   2. Bulk `himlingo` — ~4,200 EN→GW pairs scraped from himlingo.com.
//      Used as a fallback (lower source weight) when curated has no hit.

// Tokenize a string into normalized whole tokens (length ≥ 2).
// Devanagari is left alone (collapseRoman only touches a-z); Latin tokens
// also get a "loose" copy with doubled letters folded so "duur"/"dur"/"duuur"
// share a key.
function tokenize(text) {
  if (!text) return [];
  const norm = normalize(text);
  return norm
    .split(/[\s,.!?;:()"'\-—–\/]+/)
    .filter((t) => t.length >= 2);
}

// Build per-entry indexes. We keep one big Set (every distinct token across
// all fields) for cheap "any field?" checks, plus per-field Sets so the
// scorer can apply field-specific weights.
function buildEntryIndex(fields) {
  const all = new Set();
  const allLoose = new Set();
  const perField = {};
  for (const [name, text] of Object.entries(fields)) {
    const toks = tokenize(text);
    perField[name] = new Set(toks);
    for (const t of toks) {
      all.add(t);
      allLoose.add(collapseRoman(t));
    }
  }
  return { all, allLoose, perField };
}

const INDEX = [
  ...glossary.map((entry) => ({
    ...entry,
    _source: 'curated',
    _idx: buildEntryIndex({
      gw: entry.gw,
      hi: entry.hi,
      en: entry.en,
      tags: (entry.tags || []).join(' '),
      note: entry.note || '',
    }),
  })),
  // Grammar reference scraped from viewuttarakhand.blogspot.com (pronouns,
  // copula, cases, numerals). Same shape as `glossary`, treated as curated.
  ...grammarRef.map((entry) => ({
    ...entry,
    _source: 'grammar-ref',
    _idx: buildEntryIndex({
      gw: entry.gw,
      hi: entry.hi,
      en: entry.en,
      tags: (entry.tags || []).join(' '),
      note: entry.note || '',
    }),
  })),
  ...himlingo.map((entry) => ({
    gw: entry.gw,
    hi: '',
    en: entry.en,
    note: entry.gloss || '',
    _source: 'himlingo',
    _dialect: entry.dialect || '',
    _idx: buildEntryIndex({
      gw: entry.gw,
      en: entry.en,
      // Treat a himlingo gloss as note-tier evidence (weakest field weight).
      note: entry.gloss || '',
    }),
  })),
  // Curated entries from garhwalii.com — the gloss is the Hindi meaning, so
  // we surface it as `hi` (gets the same field weight as `en`/`gw`) instead
  // of a weaker `note`. Source priority sits between curated and himlingo.
  ...garhwaliiVocab.map((entry) => ({
    gw: entry.gw,
    hi: entry.gloss || '',
    en: entry.en || '',
    note: '',
    _source: 'garhwalii',
    _dialect: entry.dialect || '',
    _idx: buildEntryIndex({
      gw: entry.gw,
      hi: entry.gloss || '',
      en: entry.en || '',
    }),
  })),
];

// Field weights for token-position scoring. Tags are curated search keys
// (the strongest signal); a note hit is the weakest because notes are prose.
const FIELD_WEIGHTS = { tags: 5, gw: 3, hi: 3, en: 3, note: 1 };
// Source priority bonus added once per entry that has any match.
const SOURCE_BONUS = { curated: 1, 'grammar-ref': 0.5, garhwalii: 0.25, himlingo: 0 };
// Drop entries that didn't reach this minimum total. Empirically tuned to
// cut the long tail of weak prefix-only hits (a single 1-pt match) without
// losing meaningful single-word lookups (which always reach ≥3 via tags/gw).
const MIN_GLOSSARY_SCORE = 2;

/**
 * Score a single (entry, queryToken) pair across all fields.
 *
 * Match tiers, in descending order:
 *   - Whole-token match (token ∈ field's token set)        → field weight × 1.0
 *   - Loose whole-token match (collapseRoman variant)      → field weight × 0.8
 *   - Prefix match for tokens ≥ 4 chars                    → field weight × 0.4
 *   - Substring containment, only when query token ≥ 4    → field weight × 0.2
 *
 * Tokens shorter than 3 chars require an exact whole-token match — they're
 * too noisy to allow prefix/substring expansion.
 */
function scoreTokenAgainstEntry(token, entryIdx) {
  const tokLoose = collapseRoman(token);
  let best = 0;
  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    const set = entryIdx.perField[field];
    if (!set || set.size === 0) continue;
    if (set.has(token)) { best = Math.max(best, weight); continue; }
    if (token.length < 3) continue; // short tokens: exact only
    let fieldBest = 0;
    // Iterate the entry's tokens (small set) instead of scanning all fields.
    for (const entryToken of set) {
      const entryLoose = collapseRoman(entryToken);
      if (entryLoose === tokLoose) { fieldBest = Math.max(fieldBest, weight * 0.8); continue; }
      if (token.length >= 4 && entryToken.startsWith(token)) {
        fieldBest = Math.max(fieldBest, weight * 0.4);
      } else if (token.length >= 4 && entryToken.includes(token)) {
        fieldBest = Math.max(fieldBest, weight * 0.2);
      }
    }
    best = Math.max(best, fieldBest);
  }
  return best;
}

/**
 * Find glossary entries relevant to the user's query.
 * Returns at most `limit` entries scored by token-position match strength.
 */
function retrieveGlossary(query, limit = 6) {
  const q = normalize(query);
  if (!q) return [];

  const tokens = Array.from(new Set(
    q.split(/[\s,.!?;:()"'\-—–\/]+/).filter((t) => t.length >= 2)
  ));
  if (tokens.length === 0) return [];

  const scored = [];
  for (const entry of INDEX) {
    let total = 0;
    let matchedTokens = 0;
    for (const tok of tokens) {
      const s = scoreTokenAgainstEntry(tok, entry._idx);
      if (s > 0) { total += s; matchedTokens += 1; }
    }
    if (matchedTokens === 0) continue;

    // Coverage bonus: matching N distinct tokens beats matching one token
    // N times. Multiplicative so a single weak hit can't compound into noise.
    if (matchedTokens > 1) total *= 1 + 0.4 * (matchedTokens - 1);

    // Source bonus added last so it can break ties between equally-strong
    // hits across tiers (curated > grammar-ref > himlingo).
    total += SOURCE_BONUS[entry._source] || 0;

    if (total < MIN_GLOSSARY_SCORE) continue;
    scored.push({ entry, score: total });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}

/**
 * Format retrieved entries as a compact reference block to inject in the system prompt.
 */
function formatGlossaryContext(entries) {
  if (!entries || entries.length === 0) return '';
  const lines = entries.map((e) => {
    if (e._source === 'himlingo') {
      // Bulk dictionary entry — just gw + English headword (+ optional gloss).
      const gloss = e.note ? ` — ${e.note}` : '';
      return `• ${e.gw} (English: ${e.en})${gloss}`;
    }
    const note = e.note ? ` — ${e.note}` : '';
    return `• ${e.gw} (हिंदी: ${e.hi}; English: ${e.en})${note}`;
  });
  return [
    '',
    '=== संदर्भ शब्दकोश (Reference vocabulary — use these authentic Garhwali terms when relevant) ===',
    ...lines,
    '=== अंत ===',
    '',
  ].join('\n');
}

function getCacheStats() {
  return {
    ...responseCache.getStats(),
    fewShotPairs: FEWSHOT_INDEX.length,
    glossaryEntries: INDEX.length,
    glossaryCurated: INDEX.filter((e) => e._source === 'curated').length,
    glossaryGrammarRef: INDEX.filter((e) => e._source === 'grammar-ref').length,
    glossaryHimlingo: INDEX.filter((e) => e._source === 'himlingo').length,
    phraseExamples: PHRASE_INDEX.length,
    folkStories: FOLK_INDEX.length,
  };
}

// ===== Few-shot translation examples =====
// Pre-index Hindi side for keyword search; pick the most relevant pairs
// for the current query so the LLM sees concrete Hindi→Garhwali mappings.
// Combines hand-curated pairs with programmatically-generated grammar drills.
const _allFewShot = (() => {
  const generated = generateFewShotPairs();
  const seen = new Set(fewshot.map((p) => p.hi));
  const merged = [...fewshot];
  for (const p of generated) {
    if (!seen.has(p.hi)) {
      seen.add(p.hi);
      merged.push(p);
    }
  }
  return merged;
})();

// Few-shot pairs are searched by their Hindi side. We index Hindi tokens
// (Devanagari) plus also tokenize the Garhwali (gw) side so a query that
// includes a Garhwali keyword (e.g. "ब्योह", "मैत") can still find a
// related pair even when the user phrased their question in Garhwali.
const FEWSHOT_INDEX = _allFewShot.map((p) => ({
  ...p,
  _hiTokens: new Set(tokenize(p.hi)),
  _gwTokens: new Set(tokenize(p.gw)),
}));

// Scoring tiers for few-shot. Tighter than glossary because we have many
// hundreds of pairs and a single weak match easily out-competes a strong one.
const FEWSHOT_MIN_SCORE = 2;
function scoreFewShotToken(token, pair) {
  const tokLoose = collapseRoman(token);
  let best = 0;
  for (const set of [pair._hiTokens, pair._gwTokens]) {
    if (set.has(token)) { best = Math.max(best, 3); continue; }
    if (token.length < 3) continue;
    for (const entryToken of set) {
      if (collapseRoman(entryToken) === tokLoose) { best = Math.max(best, 2.4); continue; }
      if (token.length >= 4 && entryToken.startsWith(token)) {
        best = Math.max(best, 1.2);
      }
    }
  }
  return best;
}

function retrieveFewShot(query, limit = 6) {
  const q = normalize(query);
  if (!q) return pickRandomFewShot(limit);
  const tokens = Array.from(new Set(
    q.split(/[\s,.!?;:()"'\-—–\/]+/).filter((t) => t.length >= 2)
  ));
  if (tokens.length === 0) return pickRandomFewShot(limit);

  const scored = [];
  for (const p of FEWSHOT_INDEX) {
    let total = 0;
    let matched = 0;
    for (const tok of tokens) {
      const s = scoreFewShotToken(tok, p);
      if (s > 0) { total += s; matched += 1; }
    }
    if (matched === 0) continue;
    if (matched > 1) total *= 1 + 0.4 * (matched - 1);
    if (total < FEWSHOT_MIN_SCORE) continue;
    scored.push({ p, score: total });
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit).map((s) => s.p);
  // Pad with a few diverse random samples if we don't have enough matches
  if (top.length < limit) {
    const need = limit - top.length;
    const seen = new Set(top.map((p) => p.hi));
    const extras = pickRandomFewShot(need + 4).filter((p) => !seen.has(p.hi)).slice(0, need);
    top.push(...extras);
  }
  return top;
}

function pickRandomFewShot(n) {
  const pool = [...FEWSHOT_INDEX];
  const out = [];
  for (let i = 0; i < n && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function formatFewShotContext(pairs) {
  if (!pairs || pairs.length === 0) return '';
  const lines = pairs.map((p) => `हिंदी: ${p.hi}\nगढ़वळि: ${p.gw}`);
  return [
    '',
    '=== Hindi → Garhwali अनुवाद उदाहरण (इन्हीं शैली मा जवाब लिख — सरल, शुद्ध गढ़वळि) ===',
    lines.join('\n\n'),
    '=== अंत ===',
    '',
  ].join('\n');
}

// ===== Phrase examples (Himlingo) =====
// Curated EN ↔ Romanized-Garhwali phrases scraped from himlingo.com/phrases.
// Kept in a SEPARATE pool from few-shots because:
//   1. The pairs are English (not Hindi) → so they're useful when the user
//      query is English, but they'd dilute Hindi-keyed retrieval if mixed in.
//   2. The Garhwali side is in Roman/Latin script — the LLM must transliterate
//      to Devanagari before answering. The formatter labels this explicitly
//      so the model doesn't echo Roman script back.
const PHRASE_INDEX = (himlingoPhrases || []).map((p) => ({
  ...p,
  _enTokens: new Set(tokenize(p.en)),
  _gwTokens: new Set(tokenize(p.gwRoman || '')),
}));

function retrievePhrases(query, limit = 4) {
  const q = normalize(query);
  if (!q || PHRASE_INDEX.length === 0) return [];
  const tokens = Array.from(new Set(
    q.split(/[\s,.!?;:()"'\-—–\/]+/).filter((t) => t.length >= 3)
  ));
  if (tokens.length === 0) return [];

  const scored = [];
  for (const p of PHRASE_INDEX) {
    let total = 0;
    let matched = 0;
    for (const tok of tokens) {
      const tokLoose = collapseRoman(tok);
      let best = 0;
      for (const set of [p._enTokens, p._gwTokens]) {
        if (set.has(tok)) { best = Math.max(best, 3); continue; }
        for (const entryToken of set) {
          if (collapseRoman(entryToken) === tokLoose) { best = Math.max(best, 2.4); continue; }
          if (tok.length >= 4 && entryToken.startsWith(tok)) {
            best = Math.max(best, 1.2);
          }
        }
      }
      if (best > 0) { total += best; matched += 1; }
    }
    if (matched === 0 || total < 2) continue;
    if (matched > 1) total *= 1 + 0.4 * (matched - 1);
    scored.push({ p, score: total });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => ({ en: s.p.en, gwRoman: s.p.gwRoman }));
}

function formatPhraseContext(phrases) {
  if (!phrases || phrases.length === 0) return '';
  const lines = phrases.map((p) => `English: ${p.en}\nGarhwali (Roman): ${p.gwRoman}`);
  return [
    '',
    '=== English → Garhwali वाक्यांश (Roman script — output mei pehle Devanagari mein convert kar) ===',
    'NOTE: यो उदाहरण Roman/Latin अक्षरों मा छन — तू अपणु जवाब हमेसा देवनागरी मा दे।',
    '',
    lines.join('\n\n'),
    '=== अंत ===',
    '',
  ].join('\n');
}

// ===== Folk stories (Himlingo) =====
// Full Devanagari Garhwali narratives of cultural touchstones — Jagdev
// Panwar, Jeetu Bagdwal, Kalu Bhandari, Tilu Rauteli, Ranu Rout. Used so
// the AI can recognise & summarise these when asked.
//
// Bodies are LONG (2-4 KB each), so we only inject the top single match,
// trimmed to the first ~1500 chars (≈ first half of the story) to keep the
// system prompt within Groq's TPM budget. Mention them by title in any
// lower-priority retrieval channel and the LLM can fall back to its own
// general knowledge for further detail.
const FOLK_INDEX = (himlingoFolkStories || []).map((s) => {
  const titleText = normalize(`${s.title} ${s.slug.replace(/-/g, ' ')}`);
  const bodyText = normalize(s.body);
  return {
    ...s,
    // Title + slug carry the proper-noun keys (जगदेव पंवार, "jeetu bagdwal"
    // etc.). Body adds depth so a question about a specific scene or line
    // can still score. Loose copies fold doubled Latin letters so romanized
    // queries like "jeetu" → "jetu" still hit "jeetu-bagdwal".
    titleLoose: collapseRoman(titleText),
    bodyLoose: collapseRoman(bodyText),
  };
});

function retrieveFolkStory(query, limit = 1) {
  const q = normalize(query);
  if (!q || FOLK_INDEX.length === 0) return [];
  const tokens = Array.from(new Set(
    q.split(/[\s,.!?;:()"'\-—–\/]+/).filter((t) => t.length >= 3)
  ));
  if (tokens.length === 0) return [];
  const looseTokens = Array.from(new Set(tokens.map(collapseRoman)));

  // Skip pure stop-words / generic Garhwali nouns that match every story.
  // These would otherwise drag in a random tale for any Garhwali question.
  const STOPS = new Set(['the', 'and', 'who', 'what', 'about', 'tell', 'story', 'kahani', 'गढ़वाली', 'बारे', 'बताओ', 'kaun', 'kaise', 'kya']);

  const scored = [];
  for (const s of FOLK_INDEX) {
    let score = 0;
    for (const tok of looseTokens) {
      if (STOPS.has(tok)) continue;
      // Title/slug hits are worth 3× a body hit — a single proper-noun
      // match (e.g. "rauteli", "panwar") is enough to surface the right
      // story even when the user's romanization differs from the slug.
      if (s.titleLoose.includes(tok)) score += 3;
      else if (s.bodyLoose.includes(tok)) score += 1;
    }
    if (score >= 2) scored.push({ s, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.s);
}

function formatFolkStoryContext(stories, maxBodyChars = 1500) {
  if (!stories || stories.length === 0) return '';
  const blocks = stories.map((s) => {
    const trimmed = s.body.length > maxBodyChars
      ? `${s.body.slice(0, maxBodyChars)}…\n\n[गाथा अधूरी — पूरा पाठ: ${s.url}]`
      : s.body;
    return `### ${s.title}\n\n${trimmed}`;
  });
  return [
    '',
    '=== गढ़वाली लोक-गाथा (Folk-tale reference — use to ground your answer; cite by title, do not paste verbatim) ===',
    blocks.join('\n\n---\n\n'),
    '=== अंत ===',
    '',
  ].join('\n');
}

// ===== Lessons (Himlingo "Learn Basic Garhwali in 10 Days") =====
// Structured 10-day curriculum: phonology, pronouns, greetings, question
// words, numbers, present/past/future verb forms, everyday phrases,
// dialects, cultural context. Each entry has its own keyword tag list so
// concept queries ("how do I say hello", "garhwali numbers", "dialects",
// "past tense") surface the right lesson even when the user's wording
// doesn't appear verbatim in the body.
const LESSON_INDEX = (himlingoLessons || []).map((l) => {
  const titleText = normalize(`${l.topic} day ${l.day}`);
  const bodyText = normalize(l.body);
  const kwText = normalize((l.keywords || []).join(' '));
  return {
    ...l,
    titleLoose: collapseRoman(titleText),
    bodyLoose: collapseRoman(bodyText),
    keywordLoose: collapseRoman(kwText),
  };
});

function retrieveLesson(query, limit = 2) {
  const q = normalize(query);
  if (!q || LESSON_INDEX.length === 0) return [];
  const tokens = Array.from(new Set(
    q.split(/[\s,.!?;:()"'\-—–\/]+/).filter((t) => t.length >= 3)
  ));
  if (tokens.length === 0) return [];
  const looseTokens = Array.from(new Set(tokens.map(collapseRoman)));

  // Generic fillers we don't want dragging in every lesson.
  const STOPS = new Set(['the', 'and', 'for', 'with', 'about', 'tell', 'kya',
    'kaise', 'kaun', 'mein', 'garhwali', 'गढ़वाली', 'बारे', 'बताओ', 'सिखाओ', 'सीखना']);

  const scored = [];
  for (const l of LESSON_INDEX) {
    let score = 0;
    for (const tok of looseTokens) {
      if (STOPS.has(tok)) continue;
      // Curated keyword hit > title hit > body hit.
      if (l.keywordLoose.includes(tok)) score += 4;
      else if (l.titleLoose.includes(tok)) score += 3;
      else if (l.bodyLoose.includes(tok)) score += 1;
    }
    if (score >= 3) scored.push({ l, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => ({
    day: x.l.day,
    topic: x.l.topic,
    body: x.l.body,
    url: x.l.url,
  }));
}

function formatLessonContext(lessons) {
  if (!lessons || lessons.length === 0) return '';
  const blocks = lessons.map((l) => l.body);
  return [
    '',
    '=== Garhwali learning notes (Himlingo “Learn Basic Garhwali in 10 Days”) ===',
    'Use as ground truth for vocabulary, pronouns, greetings, numbers, verb tenses and dialects. Quote Devanagari forms exactly; cite as Himlingo when relevant.',
    '',
    blocks.join('\n\n---\n\n'),
    '=== अंत ===',
    '',
  ].join('\n');
}

function flushResponseCache() {
  const before = responseCache.keys().length;
  responseCache.flushAll();
  return { cleared: before };
}

// ===== Conversation memory (long-term) =====
// Holds an in-memory mirror of recent chat history (loaded from Redis once
// per CONV_REFRESH_MS) and provides keyword-based similarity retrieval.
const CONV_REFRESH_MS = 5 * 60 * 1000; // refresh mirror every 5 min
let convMirror = []; // [{ id, q, a, at, qNorm }]
let convLastLoaded = 0;
let convLoading = null;

function indexConversations(rawHistory) {
  return (rawHistory || [])
    .filter((h) => h && h.q && h.a)
    .map((h) => ({ ...h, qNorm: normalize(h.q) }));
}

// Lazy refresh — non-blocking. Caller may use whatever's currently in memory.
function refreshConversationMirror(loader) {
  if (convLoading) return convLoading;
  convLoading = (async () => {
    try {
      const history = await loader();
      convMirror = indexConversations(history);
      convLastLoaded = Date.now();
    } catch (err) {
      console.error('[aiCache] refreshConversationMirror error:', err.message);
    } finally {
      convLoading = null;
    }
  })();
  return convLoading;
}

async function ensureConversationMirror(loader) {
  if (Date.now() - convLastLoaded > CONV_REFRESH_MS || convMirror.length === 0) {
    await refreshConversationMirror(loader);
  }
}

/**
 * Append a freshly-completed exchange to the in-memory mirror so it's
 * retrievable immediately (without waiting for the next Redis refresh).
 */
function noteConversationLocally(userMsg, assistantMsg) {
  if (!userMsg || !assistantMsg) return;
  convMirror.unshift({
    id: Date.now(),
    q: String(userMsg).slice(0, 1000),
    a: String(assistantMsg).slice(0, 2000),
    at: new Date().toISOString(),
    qNorm: normalize(userMsg),
  });
  if (convMirror.length > 600) convMirror.length = 600;
}

/**
 * Find past exchanges most similar to the current user query.
 * Token-overlap scoring on past `q` text. Returns top `limit` pairs.
 */
function retrieveSimilarConversations(query, limit = 3) {
  const q = normalize(query);
  if (!q || convMirror.length === 0) return [];
  const tokens = Array.from(new Set(
    q.split(/[\s,.!?;:()"'\-—–\/]+/).filter((t) => t.length >= 3)
  ));
  if (tokens.length === 0) return [];

  const scored = [];
  for (const c of convMirror) {
    // Skip exact same question — that's already handled by responseCache
    if (c.qNorm === q) continue;
    let score = 0;
    for (const tok of tokens) {
      if (c.qNorm.includes(tok)) score += 1;
    }
    // At least one meaningful token must overlap. Sorting + limit handles ranking.
    if (score >= 1) scored.push({ c, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.c);
}

function formatConversationContext(pairs) {
  if (!pairs || pairs.length === 0) return '';
  const lines = pairs.map((p, i) => {
    // Trim assistant reply to keep prompt compact
    const a = p.a.length > 400 ? p.a.slice(0, 400) + '…' : p.a;
    return `${i + 1}. प्रश्न: ${p.q}\n   उत्तर: ${a}`;
  });
  return [
    '',
    '=== पुरानी बातचीत (Past conversations — reference only; do not repeat verbatim, but stay consistent with these answers) ===',
    ...lines,
    '=== अंत ===',
    '',
  ].join('\n');
}

module.exports = {
  getCached,
  setCached,
  retrieveGlossary,
  formatGlossaryContext,
  retrieveFewShot,
  formatFewShotContext,
  retrievePhrases,
  formatPhraseContext,
  retrieveFolkStory,
  formatFolkStoryContext,
  retrieveLesson,
  formatLessonContext,
  getCacheStats,
  flushResponseCache,
  ensureConversationMirror,
  refreshConversationMirror,
  noteConversationLocally,
  retrieveSimilarConversations,
  formatConversationContext,
};
