import { useState, useEffect } from 'react';
import LYRICS from '../data/lyrics';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function LyricsSection({ videoId }) {
  const [expanded, setExpanded] = useState(true);
  const [ytCaptions, setYtCaptions] = useState(null); // array of {start, dur, text}
  const [loading, setLoading] = useState(false);
  const [ytFailed, setYtFailed] = useState(false);

  const staticData = LYRICS[videoId];

  useEffect(() => {
    setYtCaptions(null);
    setYtFailed(false);
    setLoading(true);
    fetch(`${API_BASE}/api/captions/${encodeURIComponent(videoId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => setYtCaptions(data.captions))
      .catch(() => setYtFailed(true))
      .finally(() => setLoading(false));
  }, [videoId]);

  // Nothing to show
  if (!loading && ytFailed && !staticData) return null;

  // Format YouTube captions: join text, strip HTML tags, deduplicate blank lines
  const formattedYT = ytCaptions
    ? ytCaptions
        .map((c) => c.text.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
        .join('\n')
    : null;

  const lyricsText = formattedYT || staticData?.lyrics;
  const label = formattedYT
    ? 'YouTube Captions'
    : staticData
    ? 'Lyrics (Garhwali)'
    : null;

  if (!lyricsText && !loading) return null;

  return (
    <div className="mt-6 rounded-2xl bg-dark-700 border border-dark-500 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-dark-600 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🎵</span>
          <div className="text-left">
            {staticData && !formattedYT ? (
              <>
                <p className="text-sm font-bold text-white">{staticData.title}</p>
                <p className="text-xs text-gray-400">
                  {staticData.artist}&nbsp;·&nbsp;
                  <span className="text-primary-400">{staticData.language}</span>
                </p>
              </>
            ) : (
              <p className="text-sm font-bold text-white">{label || 'Lyrics'}</p>
            )}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-6 pt-1 border-t border-dark-500">
          {loading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-4 skeleton rounded ${i % 3 === 2 ? 'w-1/2' : 'w-full'}`} />
              ))}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-gray-200 text-base leading-8 tracking-wide">
              {lyricsText}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
