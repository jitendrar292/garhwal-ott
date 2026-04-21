const NodeCache = require('node-cache');
const crypto = require('crypto');
const glossary = require('../data/garhwali-glossary');
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
// Lightweight keyword retrieval. Fast, deterministic, no embeddings needed.
// Pre-build a flat searchable index once.
const INDEX = glossary.map((entry) => {
  const searchText = normalize(
    [entry.gw, entry.hi, entry.en, ...(entry.tags || [])].filter(Boolean).join(' ')
  );
  return {
    ...entry,
    searchText,
    // Romanized form with repeated letters collapsed — see collapseRoman().
    looseText: collapseRoman(searchText),
  };
});

/**
 * Find glossary entries relevant to the user's query.
 * Returns at most `limit` entries scored by token-match count.
 */
function retrieveGlossary(query, limit = 6) {
  const q = normalize(query);
  if (!q) return [];

  // Tokenize: keep words 2+ chars, dedupe
  const tokens = Array.from(new Set(
    q.split(/[\s,.!?;:()"'\-—–\/]+/).filter((t) => t.length >= 2)
  ));
  if (tokens.length === 0) return [];

  // Romanized variants of each token (e.g. "duur" -> "dur", "bhujjii" -> "bhuji")
  // so users typing English-script Garhwali still hit the right glossary row.
  // Devanagari tokens are unchanged (collapseRoman only touches a-z), so this
  // is strictly a recall boost — never loses verbatim Devanagari matches.
  const looseTokens = Array.from(new Set(tokens.map(collapseRoman)));

  const scored = [];
  for (const entry of INDEX) {
    let score = 0;
    for (const tok of looseTokens) {
      if (entry.looseText.includes(tok)) score += 1;
    }
    if (score > 0) scored.push({ entry, score });
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

const FEWSHOT_INDEX = _allFewShot.map((p) => ({
  ...p,
  hiNorm: normalize(p.hi),
  hiLoose: collapseRoman(normalize(p.hi)),
}));

function retrieveFewShot(query, limit = 6) {
  const q = normalize(query);
  if (!q) return pickRandomFewShot(limit);
  const tokens = Array.from(new Set(
    q.split(/[\s,.!?;:()"'\-—–\/]+/).filter((t) => t.length >= 2)
  ));
  if (tokens.length === 0) return pickRandomFewShot(limit);

  const looseTokens = Array.from(new Set(tokens.map(collapseRoman)));

  const scored = [];
  for (const p of FEWSHOT_INDEX) {
    let score = 0;
    for (const tok of looseTokens) {
      if (p.hiLoose.includes(tok)) score += 1;
    }
    if (score > 0) scored.push({ p, score });
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
  getCacheStats,
  flushResponseCache,
  ensureConversationMirror,
  refreshConversationMirror,
  noteConversationLocally,
  retrieveSimilarConversations,
  formatConversationContext,
};
