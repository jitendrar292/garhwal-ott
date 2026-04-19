import { useState, useRef, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pahadi-ai-chat-history';
const MAX_HISTORY = 30; // keep last 30 messages

const SUGGESTIONS = [
  'नमस्कार! तुम कन छन?',
  'गढ़वाली खाना का बारा मा बता',
  'हरेला त्योहार क्या च?',
  'नरेंद्र सिंह नेगी जी का बारा मा बता',
  'केदारनाथ कख च?',
  'एक छोटी गढ़वाली कविता लिख',
];

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
  } catch {
    /* storage full / disabled */
  }
}

export default function PahadiAIPage() {
  const [messages, setMessages] = useState(() => loadHistory());
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(-1);
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Web Speech API capability checks
  const SpeechRecognition = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  // iOS Safari + iOS PWA do not implement SpeechRecognition reliably.
  // It exists on the prototype but throws or never resolves. Detect & disable.
  const isIOS = typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  const isStandalonePWA = typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true);

  const speechSupported = !!SpeechRecognition && !isIOS;
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* noop */ }
      }
      if (ttsSupported) window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

  // Persist on every change
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // Auto-scroll on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [input]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError('');
    const userMsg = { role: 'user', content: trimmed };
    const next = [...messages, userMsg, { role: 'assistant', content: '' }];
    setMessages(next);
    setInput('');
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const data = t.slice(5).trim();
          if (data === '[DONE]') break;
          try {
            const json = JSON.parse(data);
            if (json.delta) {
              assistantText += json.delta;
              setMessages((prev) => {
                const copy = prev.slice();
                copy[copy.length - 1] = { role: 'assistant', content: assistantText };
                return copy;
              });
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Something went wrong');
      setMessages((prev) => {
        const copy = prev.slice();
        // Drop the empty assistant placeholder if it was never filled
        if (copy.length && copy[copy.length - 1].role === 'assistant' && !copy[copy.length - 1].content) {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [messages, streaming]);

  const stop = () => {
    if (abortRef.current) abortRef.current.abort();
  };

  const startListening = () => {
    if (!speechSupported || listening || streaming) return;
    setError('');
    const rec = new SpeechRecognition();
    rec.lang = 'hi-IN'; // Hindi — closest match for Garhwali
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    let finalText = '';
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      setInput((finalText + interim).trim());
    };
    rec.onerror = (e) => {
      const errMap = {
        'not-allowed': 'Mic permission denied. Enable it in your browser settings.',
        'service-not-allowed': 'Voice input is not available on this device/browser.',
        'audio-capture': 'No microphone found.',
        'network': 'Voice input needs internet — check your connection.',
        'language-not-supported': 'Hindi voice input is not installed on this device.',
      };
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        setError(errMap[e.error] || `Mic error: ${e.error}`);
      }
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      rec.start();
      recognitionRef.current = rec;
      setListening(true);
    } catch (err) {
      setError(err.message || 'Could not start microphone');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* noop */ }
    }
    setListening(false);
  };

  const speak = (text, idx) => {
    if (!ttsSupported || !text) return;
    window.speechSynthesis.cancel();
    if (speakingIdx === idx) {
      setSpeakingIdx(-1);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'hi-IN';
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onend = () => setSpeakingIdx((cur) => (cur === idx ? -1 : cur));
    utter.onerror = () => setSpeakingIdx(-1);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utter);
  };

  const clearChat = () => {
    if (streaming) stop();
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeakingIdx(-1);
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;
  const showHero = isEmpty && !streaming;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ===== Background: pahadi sunset + mountains ===== */}
      <div className="absolute inset-0 -z-10">
        {/* warm sunset gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, #ffb347 0%, #ff8c42 18%, #d96f3a 32%, #5d8a6b 60%, #1f3a2e 100%)',
          }}
        />
        {/* sun glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] -translate-y-1/3 rounded-full bg-yellow-300/40 blur-3xl" />
        {/* far mountain silhouette */}
        <svg
          className="absolute bottom-0 w-full h-[55%] opacity-90"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d6855" />
              <stop offset="100%" stopColor="#1d3528" />
            </linearGradient>
            <linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a4d3a" />
              <stop offset="100%" stopColor="#0d1f17" />
            </linearGradient>
          </defs>
          <path
            d="M0,400 L120,300 L240,360 L360,240 L520,340 L680,200 L840,320 L980,260 L1140,360 L1280,280 L1440,360 L1440,600 L0,600 Z"
            fill="url(#mt-far)"
          />
          <path
            d="M0,500 L160,420 L320,470 L480,380 L640,460 L800,400 L960,470 L1120,410 L1280,470 L1440,420 L1440,600 L0,600 Z"
            fill="url(#mt-near)"
          />
        </svg>
        {/* subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* ===== Content ===== */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-32 flex flex-col" style={{ minHeight: '100vh' }}>
        {/* Brand header */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative">
            <img
              src="/logo.png"
              alt="PahadiTube"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl shadow-2xl shadow-orange-900/40 ring-4 ring-white/20"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold text-orange-900 bg-yellow-300/90 rounded-full shadow">
              पहाड़ी AI
            </span>
          </div>
          <p className="mt-5 text-xs sm:text-sm text-white/85 font-medium drop-shadow">
            गढ़वळि भाषा मा बच्या · Powered by Llama 3.3
          </p>
        </div>

        {/* Glass chat panel */}
        <div
          className="relative flex-1 rounded-[28px] border border-white/30 bg-white/15 backdrop-blur-xl shadow-2xl shadow-emerald-950/40 overflow-hidden"
          style={{
            boxShadow:
              '0 20px 60px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          {/* Decorative top border pattern */}
          <div
            className="h-2 w-full"
            style={{
              background:
                'repeating-linear-gradient(90deg, transparent 0 6px, rgba(255,255,255,0.25) 6px 10px)',
            }}
          />

          {/* Clear button — floating top-right */}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="absolute top-3 right-3 z-10 px-3 py-1 text-[11px] font-medium text-white/90 hover:text-white bg-black/20 hover:bg-red-500/40 rounded-full backdrop-blur transition-colors"
            >
              ✕ Clear
            </button>
          )}

          <div
            ref={scrollRef}
            className="overflow-y-auto px-4 sm:px-6 py-5 space-y-4"
            style={{ maxHeight: '55vh', minHeight: '320px' }}
          >
            {showHero ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="text-4xl mb-2">🙏</div>
                <h2 className="text-lg font-bold text-white drop-shadow mb-1">
                  ज्यू रौ, ज्यू बचि रौ
                </h2>
                <p className="text-[13px] text-white/85 max-w-md mb-5 drop-shadow">
                  गढ़वळि मा कुछ भि पुछा — खाना, गीत, त्योहार, यात्रा या कविता।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left px-3 py-2.5 text-[13px] text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <MessageBubble
                  key={i}
                  role={m.role}
                  content={m.content}
                  isStreaming={streaming && i === messages.length - 1 && m.role === 'assistant'}
                  onSpeak={ttsSupported && m.role === 'assistant' && m.content ? () => speak(m.content, i) : null}
                  isSpeaking={speakingIdx === i}
                  timeLabel={formatTime(i, messages.length)}
                />
              ))
            )}

            {/* "Thinking" bubble while waiting for first token */}
            {streaming && messages.length > 0 &&
              messages[messages.length - 1].role === 'assistant' &&
              !messages[messages.length - 1].content && (
                <div className="flex gap-3">
                  <Avatar isUser={false} />
                  <div className="px-4 py-2.5 rounded-2xl bg-white/15 border border-white/25 backdrop-blur text-white/90 text-sm flex items-center gap-2">
                    <span className="text-base">✨</span>
                    <span>सोचणु रा छ…</span>
                    <TypingDots />
                  </div>
                </div>
            )}

            {error && (
              <div className="p-3 text-sm text-white bg-red-500/40 border border-red-300/40 rounded-xl backdrop-blur">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Bottom decorative pattern */}
          <div
            className="h-2 w-full"
            style={{
              background:
                'repeating-linear-gradient(90deg, transparent 0 6px, rgba(255,255,255,0.2) 6px 10px)',
            }}
          />
        </div>

        {/* ===== Big mic + input ===== */}
        <div className="mt-6 flex flex-col items-center">
          {/* Big mic button (or stop button while streaming) */}
          <button
            onClick={() => {
              if (streaming) return stop();
              if (listening) return stopListening();
              if (speechSupported) return startListening();
              textareaRef.current?.focus();
            }}
            className={`group relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${
              listening
                ? 'bg-gradient-to-br from-red-500 to-red-700 scale-110'
                : streaming
                  ? 'bg-gradient-to-br from-orange-500 to-red-600'
                  : 'bg-gradient-to-br from-teal-500 to-emerald-700 hover:scale-105'
            }`}
            style={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5), 0 0 40px rgba(45, 212, 191, 0.4)' }}
            aria-label={listening ? 'Stop' : streaming ? 'Stop generating' : 'Tap to speak'}
          >
            {/* Pulse rings */}
            {listening && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-white/60 animate-ping" />
                <span className="absolute -inset-3 rounded-full border-2 border-white/30 animate-ping" style={{ animationDelay: '0.4s' }} />
              </>
            )}
            {streaming ? (
              <svg className="w-7 h-7 relative" fill="currentColor" viewBox="0 0 20 20">
                <rect x="5" y="5" width="10" height="10" rx="2" />
              </svg>
            ) : (
              <svg className="w-9 h-9 relative" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
                <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V20H8a1 1 0 100 2h8a1 1 0 100-2h-3v-2.08A7 7 0 0019 11z" />
              </svg>
            )}
          </button>
          <p className="mt-3 text-base sm:text-lg font-semibold text-white drop-shadow tracking-wide">
            {listening ? 'सुणणु छां…' : streaming ? 'रुक्या तनिक…' : 'बोल पहाड़ी में'}
          </p>

          {/* Text input row (collapsed by default — opens on focus) */}
          <div className="mt-4 w-full max-w-2xl">
            <div className="flex items-end gap-2 p-2 bg-white/15 border border-white/30 rounded-2xl backdrop-blur-xl focus-within:border-white/60 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={listening ? '🎙️ बोला…' : 'या यखा लिख्या…'}
                rows={1}
                maxLength={4000}
                disabled={streaming}
                className="flex-1 bg-transparent text-white placeholder-white/60 px-3 py-2 text-sm resize-none outline-none disabled:opacity-60"
                style={{ maxHeight: '160px' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || streaming}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white text-emerald-700 hover:bg-yellow-300 disabled:bg-white/30 disabled:text-white/50 transition-colors shadow"
                aria-label="Send"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* No Ads pill */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 bg-black/30 border border-white/20 rounded-full text-white text-sm font-medium backdrop-blur">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" />
              <path d="M5 5l14 14" strokeLinecap="round" />
            </svg>
            No Ads
          </div>

          <p className="mt-4 text-[10px] text-white/70 text-center max-w-md drop-shadow">
            AI जवाब हमेशा सटीक नि होंदा — महत्वपूर्ण जानकारी सत्यापित कर्या।
            {isIOS && (
              <>
                <br />
                Voice input isn't supported on iOS{isStandalonePWA ? ' (installed app)' : ''}. Type your question instead.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// Render a HH:MM time label for each message based on its index/recency.
// Uses local time. We don't store timestamps in localStorage (yet) so this
// is best-effort: only the most recent few get times; older are blank.
function formatTime(idx, total) {
  if (idx < total - 4) return '';
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function Avatar({ isUser }) {
  if (isUser) {
    return (
      <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center text-base shadow ring-2 ring-white/30">
        🙋
      </div>
    );
  }
  return (
    <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden ring-2 ring-yellow-300/70 shadow bg-emerald-700">
      <img src="/logo.png" alt="" className="w-full h-full object-cover" />
    </div>
  );
}

function MessageBubble({ role, content, isStreaming, onSpeak, isSpeaking, timeLabel }) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar isUser={isUser} />
      <div className={`flex flex-col gap-1 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-3xl text-[14px] leading-relaxed whitespace-pre-wrap shadow-md backdrop-blur ${
            isUser
              ? 'bg-emerald-600/85 text-white rounded-br-md border border-emerald-300/30'
              : 'bg-white/20 text-white rounded-bl-md border border-white/30'
          }`}
        >
          {content || (isStreaming ? <TypingDots /> : '')}
          {isStreaming && content && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-white animate-pulse align-middle" />
          )}
        </div>
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          {timeLabel && (
            <span className="text-[10px] text-white/70">{timeLabel}</span>
          )}
          {onSpeak && !isStreaming && (
            <button
              onClick={onSpeak}
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full transition-colors ${
                isSpeaking
                  ? 'text-white bg-emerald-500/40'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              aria-label={isSpeaking ? 'Stop speaking' : 'Speak this reply'}
            >
              {isSpeaking ? (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <rect x="5" y="5" width="10" height="10" rx="1" />
                  </svg>
                  Stop
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.05A4.5 4.5 0 0016.5 12zM14 3.23v2.06a7 7 0 010 13.42v2.06A9 9 0 0023 12 9 9 0 0014 3.23z" />
                  </svg>
                  Listen
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}
