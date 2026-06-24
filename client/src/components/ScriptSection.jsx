import { useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

function normalizeCaptionText(captions = []) {
  return captions
    .map((c) => (c?.text || '')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/<[^>]+>/g, '')
      .trim())
    .filter(Boolean)
    .join('\n');
}

function extractTopTerms(text, max = 8) {
  const STOP = new Set([
    'the', 'and', 'for', 'that', 'with', 'this', 'from', 'have', 'you', 'your',
    'hai', 'main', 'mera', 'meri', 'kya', 'nahi', 'are', 'was', 'were', 'into',
    'का', 'की', 'के', 'में', 'और', 'है', 'हैं', 'से', 'पर', 'को', 'एक', 'था', 'थे', 'तो',
  ]);
  const counts = new Map();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP.has(w));

  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([term]) => term);
}

export default function ScriptSection({ videoId }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [lang, setLang] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [isCached, setIsCached] = useState(false);

  const hasScript = useMemo(() => scriptText.trim().length > 0, [scriptText]);
  const filteredScript = useMemo(() => {
    if (!hasScript) return '';
    if (!searchTerm.trim()) return scriptText;
    const q = searchTerm.toLowerCase().trim();
    return scriptText
      .split('\n')
      .filter((line) => line.toLowerCase().includes(q))
      .join('\n');
  }, [scriptText, hasScript, searchTerm]);

  const stats = useMemo(() => {
    if (!hasScript) return null;
    const lines = scriptText.split('\n').filter((l) => l.trim().length > 0).length;
    const words = scriptText.trim().split(/\s+/).filter(Boolean).length;
    const chars = scriptText.length;
    const readMins = Math.max(1, Math.round(words / 180));
    const topTerms = extractTopTerms(scriptText);
    return { lines, words, chars, readMins, topTerms };
  }, [scriptText, hasScript]);

  const fetchScript = async () => {
    if (loading || hasScript) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/captions/${encodeURIComponent(videoId)}`);
      if (!res.ok) throw new Error('No script found for this video');
      const data = await res.json();
      const text = normalizeCaptionText(data?.captions || []);
      if (!text) throw new Error('No script found for this video');
      setScriptText(text);
      setLang(data?.lang || '');
      setSavedAt(data?.savedAt || '');
      setIsCached(Boolean(data?.cached));
      setExpanded(true);
    } catch (err) {
      setError(err?.message || 'Failed to fetch script');
      setExpanded(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl bg-dark-700 border border-dark-500 overflow-hidden">
      <div className="w-full flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">📝</span>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Script (Text)</p>
            <p className="text-xs text-gray-400">
              {lang
                ? `Captions language: ${lang}${isCached ? ' · loaded from DB cache' : ' · fetched live'}`
                : 'Click to fetch video script from captions'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchScript}
            disabled={loading || hasScript}
            className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold text-white transition-colors"
          >
            {loading ? 'Fetching...' : hasScript ? 'Loaded' : 'Get Script'}
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
            aria-label="Toggle script panel"
            title="Toggle script"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-6 pt-1 border-t border-dark-500">
          {loading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-4 skeleton rounded ${i % 3 === 2 ? 'w-1/2' : 'w-full'}`} />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-gray-400">{error}</p>
          ) : hasScript ? (
            <>
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  <div className="rounded-lg bg-dark-600 px-3 py-2">
                    <p className="text-[11px] text-gray-400">Lines</p>
                    <p className="text-sm font-semibold text-white">{stats.lines}</p>
                  </div>
                  <div className="rounded-lg bg-dark-600 px-3 py-2">
                    <p className="text-[11px] text-gray-400">Words</p>
                    <p className="text-sm font-semibold text-white">{stats.words}</p>
                  </div>
                  <div className="rounded-lg bg-dark-600 px-3 py-2">
                    <p className="text-[11px] text-gray-400">Characters</p>
                    <p className="text-sm font-semibold text-white">{stats.chars}</p>
                  </div>
                  <div className="rounded-lg bg-dark-600 px-3 py-2">
                    <p className="text-[11px] text-gray-400">Read Time</p>
                    <p className="text-sm font-semibold text-white">~{stats.readMins} min</p>
                  </div>
                </div>
              )}

              {savedAt && (
                <p className="text-xs text-gray-500 mb-3">Saved: {new Date(savedAt).toLocaleString()}</p>
              )}

              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-4">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in script..."
                  className="flex-1 px-3 py-2 rounded-lg bg-dark-600 border border-dark-500 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(scriptText).catch(() => {})}
                    className="px-3 py-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-xs font-semibold text-white transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${videoId}-script.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-xs font-semibold text-white transition-colors"
                  >
                    Download .txt
                  </button>
                </div>
              </div>

              {stats?.topTerms?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {stats.topTerms.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSearchTerm(t)}
                      className="px-2.5 py-1 rounded-full text-xs bg-dark-600 hover:bg-dark-500 text-gray-200 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              <pre className="whitespace-pre-wrap font-sans text-gray-200 text-sm leading-7 tracking-wide max-h-[420px] overflow-auto pr-1">
                {filteredScript || 'No lines match your search.'}
              </pre>
            </>
          ) : (
            <p className="text-sm text-gray-400">Click Get Script to load the text script for this video.</p>
          )}
        </div>
      )}
    </div>
  );
}
