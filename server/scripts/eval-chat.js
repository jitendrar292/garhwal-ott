#!/usr/bin/env node
/**
 * PahadiAI golden-test runner.
 *
 *   Usage:
 *     # Against locally running server (default):
 *     npm run eval
 *
 *     # Against deployed instance:
 *     CHAT_URL=https://pahaditube.in/api/chat npm run eval
 *
 *     # Filter by category or id:
 *     EVAL_FILTER=cuisine npm run eval
 *     EVAL_FILTER=food-kafuli-veg npm run eval
 *
 *     # JSON output (for CI):
 *     EVAL_FORMAT=json npm run eval
 *
 * Behaviour:
 *   - POSTs each test case to the chat endpoint as a single-message conversation.
 *   - Reads the SSE stream, concatenates `delta` payloads into the full reply.
 *   - Runs assertions (mustContain, mustNotContain, maxChars, minChars).
 *   - Prints per-case pass/fail and a summary table by category.
 *   - Exits non-zero on any failure (CI-friendly).
 */

const path = require('path');
const cases = require(path.resolve(__dirname, '../src/data/garhwali-eval'));

const CHAT_URL = process.env.CHAT_URL || 'http://localhost:5001/api/chat';
const FILTER = (process.env.EVAL_FILTER || '').toLowerCase();
const FORMAT = process.env.EVAL_FORMAT || 'pretty';
const REQUEST_TIMEOUT_MS = Number(process.env.EVAL_TIMEOUT_MS || 60_000);
const CONCURRENCY = Math.max(1, Number(process.env.EVAL_CONCURRENCY || 2));
// Admin key bypasses the per-IP rate limiter on /api/chat so a 30-case
// run doesn't get HTTP 429'd after the 8th request. Falls back to the
// in-code default ('pahadi2026') matching server/src/routes/chat.js.
const ADMIN_KEY = process.env.FEEDBACK_ADMIN_KEY || process.env.EVAL_ADMIN_KEY || 'pahadi2026';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};
const c = (color, s) => (process.stdout.isTTY ? `${COLORS[color]}${s}${COLORS.reset}` : s);

// ── SSE reader ────────────────────────────────────────────────────────
async function streamReply(query) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_KEY,
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: query }] }),
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.body) throw new Error('no response body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let reply = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE messages are separated by blank lines.
    let idx;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const event = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') return reply;
        try {
          const obj = JSON.parse(payload);
          if (typeof obj.delta === 'string') reply += obj.delta;
        } catch { /* ignore malformed */ }
      }
    }
  }
  return reply;
}

// ── Assertion engine ──────────────────────────────────────────────────
function evaluate(testCase, reply) {
  const failures = [];

  const matches = (needle) =>
    needle instanceof RegExp ? needle.test(reply) : reply.includes(needle);

  for (const need of testCase.mustContain || []) {
    if (!matches(need)) failures.push(`mustContain ${needle(need)}`);
  }
  for (const avoid of testCase.mustNotContain || []) {
    if (matches(avoid)) failures.push(`mustNotContain ${needle(avoid)} (found)`);
  }
  if (testCase.maxChars && reply.length > testCase.maxChars) {
    failures.push(`maxChars ${testCase.maxChars} (got ${reply.length})`);
  }
  if (testCase.minChars && reply.length < testCase.minChars) {
    failures.push(`minChars ${testCase.minChars} (got ${reply.length})`);
  }

  return failures;
}
const needle = (n) => (n instanceof RegExp ? n.toString() : `"${n}"`);

// ── Concurrency-limited runner ────────────────────────────────────────
async function runAll(selected) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= selected.length) return;
      const tc = selected[i];
      const start = Date.now();
      let reply = '';
      let err = null;
      try {
        reply = await streamReply(tc.query);
      } catch (e) {
        err = e.message || String(e);
      }
      const elapsed = Date.now() - start;
      const failures = err ? [`request error: ${err}`] : evaluate(tc, reply);
      results[i] = { tc, reply, failures, elapsed, err };
      if (FORMAT === 'pretty') printCase(tc, reply, failures, elapsed);
    }
  });
  await Promise.all(workers);
  return results;
}

function printCase(tc, reply, failures, elapsed) {
  const status = failures.length === 0 ? c('green', 'PASS') : c('red', 'FAIL');
  console.log(`${status} ${c('cyan', tc.id.padEnd(28))} ${c('dim', `(${elapsed}ms, ${reply.length}c)`)} — ${tc.query}`);
  if (failures.length) {
    for (const f of failures) console.log(`     ${c('red', '×')} ${f}`);
    const snippet = reply.slice(0, 240).replace(/\n/g, ' ');
    console.log(`     ${c('dim', 'reply:')} ${snippet}${reply.length > 240 ? '…' : ''}`);
  }
}

function printSummary(results) {
  const total = results.length;
  const passed = results.filter((r) => r.failures.length === 0).length;
  const byCat = {};
  for (const r of results) {
    const cat = r.tc.category || 'other';
    byCat[cat] ??= { pass: 0, fail: 0 };
    if (r.failures.length === 0) byCat[cat].pass++; else byCat[cat].fail++;
  }
  console.log('\n' + c('bold', '── Summary ──'));
  for (const [cat, s] of Object.entries(byCat).sort()) {
    const ratio = `${s.pass}/${s.pass + s.fail}`;
    const colored = s.fail === 0 ? c('green', ratio) : c('yellow', ratio);
    console.log(`  ${cat.padEnd(15)} ${colored}`);
  }
  const overall = `${passed}/${total}`;
  const finalColor = passed === total ? 'green' : 'red';
  console.log(`  ${c('bold', 'TOTAL'.padEnd(15))} ${c(finalColor, overall)}\n`);
  return passed === total;
}

// ── Main ──────────────────────────────────────────────────────────────
(async () => {
  const selected = cases.filter((tc) => {
    if (!FILTER) return true;
    return tc.id.toLowerCase().includes(FILTER) || (tc.category || '').toLowerCase().includes(FILTER);
  });

  if (selected.length === 0) {
    console.error(c('red', `No test cases match filter "${FILTER}"`));
    process.exit(2);
  }

  console.log(c('bold', `\nPahadiAI eval — ${selected.length} cases against ${CHAT_URL}`));
  console.log(c('dim', `(concurrency=${CONCURRENCY}, timeout=${REQUEST_TIMEOUT_MS}ms)\n`));

  const results = await runAll(selected);

  if (FORMAT === 'json') {
    console.log(JSON.stringify(
      results.map((r) => ({
        id: r.tc.id,
        category: r.tc.category,
        query: r.tc.query,
        passed: r.failures.length === 0,
        failures: r.failures,
        elapsed_ms: r.elapsed,
        reply_chars: r.reply.length,
      })),
      null,
      2,
    ));
  }

  const allPassed = printSummary(results);
  process.exit(allPassed ? 0 : 1);
})().catch((err) => {
  console.error(c('red', 'eval crashed:'), err);
  process.exit(2);
});
