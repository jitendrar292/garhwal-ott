// Upstash Vector wrapper for true semantic similarity search.
// When UPSTASH_VECTOR_REST_URL + UPSTASH_VECTOR_REST_TOKEN are set, past
// chat exchanges get embedded server-side and queried by cosine similarity.
// Gracefully no-ops when env vars are missing — caller falls back to keyword search.
//
// Recommended Upstash Vector index: any model with a multilingual embedder
// (e.g. mixedbread-ai/mxbai-embed-large-v1 or BAAI/bge-m3). Selected when
// you create the index in the Upstash console.

const VECTOR_URL = process.env.UPSTASH_VECTOR_REST_URL;
const VECTOR_TOKEN = process.env.UPSTASH_VECTOR_REST_TOKEN;
const VECTOR_ENABLED = !!(VECTOR_URL && VECTOR_TOKEN);
const NAMESPACE = 'pahadi-chat'; // logical partition inside the index

function isVectorEnabled() {
  return VECTOR_ENABLED;
}

async function vectorRequest(endpoint, body) {
  const res = await fetch(`${VECTOR_URL}/${endpoint}/${NAMESPACE}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VECTOR_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upstash Vector ${endpoint} ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Upsert a chat exchange into the vector index.
 * The `data` field is what gets embedded — we embed the user question only,
 * keeping the answer in metadata so we can return it on retrieval.
 */
async function upsertExchange(id, question, answer, extraMeta = {}) {
  if (!VECTOR_ENABLED) return false;
  if (!question || !answer) return false;
  try {
    await vectorRequest('upsert-data', {
      id: String(id),
      data: String(question).slice(0, 1500),
      metadata: {
        q: String(question).slice(0, 1000),
        a: String(answer).slice(0, 2000),
        at: extraMeta.at || new Date().toISOString(),
      },
    });
    return true;
  } catch (err) {
    console.error('[vector] upsert error:', err.message);
    return false;
  }
}

/**
 * Semantic retrieval — finds past exchanges most similar to `query`.
 * Returns [{ id, score, q, a, at }] ordered by descending similarity.
 * `minScore` filters out weak matches (Upstash returns cosine-similarity-like floats 0..1).
 */
async function querySimilar(query, { topK = 3, minScore = 0.72 } = {}) {
  if (!VECTOR_ENABLED || !query) return [];
  try {
    const json = await vectorRequest('query-data', {
      data: String(query).slice(0, 1500),
      topK,
      includeMetadata: true,
    });
    const matches = json.result || [];
    return matches
      .filter((m) => typeof m.score === 'number' && m.score >= minScore)
      .map((m) => ({
        id: m.id,
        score: m.score,
        q: m.metadata?.q || '',
        a: m.metadata?.a || '',
        at: m.metadata?.at || '',
      }));
  } catch (err) {
    console.error('[vector] query error:', err.message);
    return [];
  }
}

/**
 * Return basic info about the vector index (count, dimension, similarityFunction).
 * Useful for the /api/chat/memory debug endpoint.
 */
async function vectorInfo() {
  if (!VECTOR_ENABLED) return { enabled: false };
  try {
    const res = await fetch(`${VECTOR_URL}/info`, {
      headers: { Authorization: `Bearer ${VECTOR_TOKEN}` },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`info ${res.status}`);
    const json = await res.json();
    return { enabled: true, namespace: NAMESPACE, ...(json.result || json) };
  } catch (err) {
    return { enabled: true, error: err.message };
  }
}

module.exports = {
  isVectorEnabled,
  upsertExchange,
  querySimilar,
  vectorInfo,
};
