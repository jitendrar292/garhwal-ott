import { useState } from 'react';
import LYRICS from '../data/lyrics';

export default function LyricsSection({ videoId }) {
  const [expanded, setExpanded] = useState(true);
  const data = LYRICS[videoId];

  if (!data) return null;

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
            <p className="text-sm font-bold text-white">{data.title}</p>
            <p className="text-xs text-gray-400">{data.artist} &nbsp;·&nbsp; <span className="text-primary-400">{data.language}</span></p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Lyrics body */}
      {expanded && (
        <div className="px-5 pb-6 pt-1 border-t border-dark-500">
          <pre className="whitespace-pre-wrap font-sans text-gray-200 text-base leading-8 tracking-wide">
            {data.lyrics}
          </pre>
        </div>
      )}
    </div>
  );
}
