import { useRef, useState } from 'react';

const PAHADI_URL = 'https://www.pahadi.ai/chat';
const PAHADI_HOME = 'https://www.pahadi.ai/';

export default function PahadiAIPage() {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-primary-500/10 ring-1 ring-primary-500/30">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs font-medium text-primary-300">Powered by Pahadi.AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            पहाड़ी AI · Garhwali Chat
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            गढ़वळि भाषा मा AI दगड़ी बच्या — सवाल पुछा, अनुवाद करा, या कविता लिखा।
            Chat with an AI that understands and replies in Garhwali.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={PAHADI_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            About Pahadi.AI
          </a>
          <a
            href={PAHADI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
          >
            Open in new tab ↗
          </a>
        </div>
      </div>

      {/* Chat container — white bg so the light-themed Pahadi.AI UI is visible while loading */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-white shadow-xl shadow-black/40"
        style={{ height: 'calc(100vh - 280px)', minHeight: '520px' }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10 pointer-events-none">
            <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Loading Pahadi.AI…</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={PAHADI_URL}
          title="Pahadi.AI Chat"
          onLoad={() => setLoaded(true)}
          className="w-full h-full border-0 bg-white"
          allow="microphone; clipboard-read; clipboard-write; autoplay"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Helper actions below */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-dark-900/60 border border-white/5">
        <p className="text-xs text-gray-400 text-center sm:text-left">
          Not seeing the chat? Some browsers block embedded third-party sites.
          Try reloading or open Pahadi.AI directly.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setLoaded(false);
              setIframeKey((k) => k + 1);
            }}
            className="px-4 py-2 text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            ↻ Reload
          </button>
          <a
            href={PAHADI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
          >
            Open Pahadi.AI ↗
          </a>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 mt-3 text-center">
        Pahadi.AI is an independent service. PahadiTube is not affiliated with Pahadi.AI.
      </p>
    </div>
  );
}
