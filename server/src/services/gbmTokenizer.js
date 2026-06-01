// GBM Tokenizer — Node.js wrapper for the Python sidecar process.
//
// Spawns `scripts/gbm_tokenizer_server.py` once at first use; all subsequent
// tokenize() calls are fast stdin/stdout IPC (no per-call process spawn,
// no model reload).
//
// Graceful degradation: if Python is not installed, sentencepiece is missing,
// or the .model file is absent, tokenize() returns null and the caller falls
// back to the whitespace-based pipeline.  No crash, no error surfaced to user.
//
// Environment
//   GBM_MODEL_PATH   Absolute or server-relative path to gbm_tokenizer.model
//                    Defaults to: server/data/gbm_tokenizer.model
//   GBM_PYTHON       Python executable (default: python3)

const { spawn } = require('child_process');
const path = require('path');
const crypto = require('crypto');

const SCRIPT_PATH = path.resolve(__dirname, '../../scripts/gbm_tokenizer_server.py');
const PYTHON_BIN = process.env.GBM_PYTHON || 'python3';
const REQUEST_TIMEOUT_MS = 500; // graceful degradation on slow sidecar

let sidecar = null;   // ChildProcess | null
let ready = false;    // true once the sidecar emits {"ready":true}
let lineBuf = '';     // incomplete stdout line accumulator
const pending = new Map(); // requestId → { resolve, reject, timer }

// ---------------------------------------------------------------------------
// Sidecar lifecycle
// ---------------------------------------------------------------------------

function startSidecar() {
  let proc;
  try {
    proc = spawn(PYTHON_BIN, [SCRIPT_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (err) {
    // python3 not found — degrade silently
    return;
  }

  proc.stdout.on('data', (chunk) => {
    lineBuf += chunk.toString('utf8');
    const lines = lineBuf.split('\n');
    lineBuf = lines.pop(); // keep the incomplete tail
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      let msg;
      try { msg = JSON.parse(line); } catch (_) { continue; }

      if (msg.ready === true) {
        ready = true;
        return;
      }
      if (msg.ready === false) {
        // Sidecar reported it cannot start (missing model / sentencepiece)
        proc.kill();
        return;
      }

      const entry = pending.get(msg.id);
      if (!entry) continue;
      clearTimeout(entry.timer);
      pending.delete(msg.id);
      if (msg.error) {
        entry.resolve(null); // degrade, don't reject
      } else {
        entry.resolve({ stems: msg.stems || [] });
      }
    }
  });

  proc.stderr.on('data', (d) => {
    if (process.env.NODE_ENV !== 'production') {
      process.stderr.write(`[gbm-sidecar] ${d}`);
    }
  });

  const cleanup = () => {
    sidecar = null;
    ready = false;
    // Resolve all pending with null (graceful degradation)
    for (const [id, entry] of pending) {
      clearTimeout(entry.timer);
      entry.resolve(null);
    }
    pending.clear();
  };

  proc.on('error', cleanup);
  proc.on('exit', cleanup);

  sidecar = proc;
}

function ensureSidecar() {
  if (!sidecar) startSidecar();
}

// Shut down cleanly on process exit so the Python child doesn't become orphaned
process.once('exit', () => { try { sidecar?.kill(); } catch (_) {} });
process.once('SIGTERM', () => { try { sidecar?.kill(); } catch (_) {} });

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Tokenize `text` using the GBM SentencePiece model.
 *
 * Returns { stems: string[] } where `stems` is the list of word-initial
 * subword pieces (▁-prefix stripped) — these are natural Garhwali/Devanagari
 * word roots suitable for embedding / cache-key normalization.
 *
 * Returns null if the sidecar is unavailable (Python missing, model not
 * found, or timeout).  Callers should fall back to whitespace tokenization.
 *
 * @param {string} text
 * @returns {Promise<{stems: string[]} | null>}
 */
function tokenize(text) {
  return new Promise((resolve) => {
    ensureSidecar();

    if (!sidecar || !ready) {
      return resolve(null);
    }

    const id = crypto.randomBytes(8).toString('hex');

    const timer = setTimeout(() => {
      pending.delete(id);
      resolve(null); // timeout — degrade gracefully
    }, REQUEST_TIMEOUT_MS);

    pending.set(id, { resolve, timer });

    try {
      sidecar.stdin.write(JSON.stringify({ id, text }) + '\n');
    } catch (_) {
      clearTimeout(timer);
      pending.delete(id);
      resolve(null);
    }
  });
}

module.exports = { tokenize };
