const NodeCache = require('node-cache');
const crypto = require('crypto');
const glossary = require('../data/garhwali-glossary');

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
const INDEX = glossary.map((entry) => ({
  ...entry,
  searchText: normalize(
    [entry.gw, entry.hi, entry.en, ...(entry.tags || [])].filter(Boolean).join(' ')
  ),
}));

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

  const scored = [];
  for (const entry of INDEX) {
    let score = 0;
    for (const tok of tokens) {
      if (entry.searchText.includes(tok)) score += 1;
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
  return responseCache.getStats();
}

module.exports = {
  getCached,
  setCached,
  retrieveGlossary,
  formatGlossaryContext,
  getCacheStats,
};
