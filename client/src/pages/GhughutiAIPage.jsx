import { useState, useRef, useEffect, useCallback } from 'react';
import SEO from '../components/SEO';
import { toGarhwaliSpeech, pickPahadiVoice, PAHADI_RATE, PAHADI_PITCH } from '../utils/garhwaliTone';

// Chat history is intentionally NOT persisted in the browser — Redis is the
// only store and the server already logs Q→A pairs server-side
// (logChatExchange in server/src/services/store.js). The visible chat in this
// page resets on full reload by design.
const MAX_HISTORY = 30; // keep last 30 messages in memory

const SUGGESTIONS = [
  'नमस्कार! तुम कन छन?',
  'गढ़वाली खाना का बारा मा बता',
  'हरेला त्योहार क्या च?',
  'नरेंद्र सिंह नेगी जी का बारा मा बता',
  'केदारनाथ कख च?',
  'एक छोटी गढ़वाली कविता लिख',
];

// Topic cards shown on the empty/landing state. Each card is a colored tile
// with an emoji illustration, a Garhwali label, and a "Start Conversation"
// button that seeds the chat with the matching SUGGESTIONS prompt.
const TOPIC_CARDS = [
  { emoji: '🙏',  label: 'नमस्कार!\nतुम कन छन?',     bg: 'bg-sky-600',     prompt: SUGGESTIONS[0] },
  { emoji: '🍛',  label: 'गढ़वाली\nखाना',           bg: 'bg-amber-600',   prompt: SUGGESTIONS[1] },
  { emoji: '🪔',  label: 'हरेला\nत्योहार',          bg: 'bg-red-700',     prompt: SUGGESTIONS[2] },
  { emoji: '🥁',  label: 'नरेन्द्र\nसिंह नेगी',     bg: 'bg-amber-800',   prompt: SUGGESTIONS[3] },
  { emoji: '🛕',  label: 'केदारनाथ',                bg: 'bg-teal-600',    prompt: SUGGESTIONS[4] },
  { emoji: '📖',  label: 'गढ़वाली\nकविता',         bg: 'bg-emerald-700', prompt: SUGGESTIONS[5] },
  { emoji: '📚',  label: 'नया\nशब्द सिखा',         bg: 'bg-indigo-700',  prompt: 'मीं कुछ नया गढ़वळि शब्द सिखाओ — रोजमर्रा का प्रयोग वाला 5 शब्द हिन्दी अर्थ का साथ।' },
  { emoji: '🎯',  label: 'सांस्कृतिक\nक्विज़',     bg: 'bg-fuchsia-700', prompt: 'गढ़वाली संस्कृति का बारा मा एक मजेदार सवाल पूछा — चार विकल्प सहित।' },
  { emoji: '🛤️',  label: 'यात्रा\nसवाल',           bg: 'bg-rose-700',    prompt: 'मीं उत्तराखंड की यात्रा करण चांदु — चार धाम, हेमकुण्ड, औली, फूलों की घाटी जना ठिकाणा का बारा मा बता: कब जाण, कन पौंछण, अर क्या-क्या देखण।' },
];

const CHARACTERS = [
  {
    id: 'boda',
    name: 'पहाड़ी बोड़ा',
    subtitle: 'बुजुर्ग की समझदारी',
    emoji: '🧔',
    avatar: '/characters/pahadi-boda.png',
    tone: 'wise',
  },
  {
    id: 'bhula',
    name: 'पहाड़ी भुला',
    subtitle: 'मजेदार अंदाज़',
    emoji: '😎',
    avatar: '/characters/pahadi-bhula.png',
    tone: 'funny',
  },
];

export default function GhughutiAIPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(-1);
  const [activeCharacter, setActiveCharacter] = useState('boda');
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

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

  // ElevenLabs TTS: true when the server endpoint is available
  // (we assume it is; if not, we gracefully fall back to Web Speech)
  const elevenLabsSupported = true;
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* noop */ }
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (ttsSupported) window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

  // Cap in-memory history so the UI doesn't grow unbounded across long
  // conversations. No persistence \u2014 see header comment.
  useEffect(() => {
    if (messages.length > MAX_HISTORY) {
      setMessages((prev) => prev.slice(-MAX_HISTORY));
    }
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
          character: activeCharacter,
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
  }, [messages, streaming, activeCharacter]);

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

  const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const ELEVEN_VOICE   = import.meta.env.VITE_ELEVENLABS_VOICE_ID  || 'pNInz6obpgDQGcFmaJgB';
  const ELEVEN_MODEL   = import.meta.env.VITE_ELEVENLABS_MODEL_ID  || 'eleven_turbo_v2_5';

  const speak = async (text, idx) => {
    if (!text) return;

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (ttsSupported) window.speechSynthesis.cancel();

    // Toggle off if already speaking this message
    if (speakingIdx === idx) {
      setSpeakingIdx(-1);
      return;
    }

    setSpeakingIdx(idx);

    // --- Try ElevenLabs directly from the browser (free tier works from real user IPs) ---
    if (ELEVEN_API_KEY) {
      try {
        const res = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(ELEVEN_VOICE)}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVEN_API_KEY,
              'Content-Type': 'application/json',
              Accept: 'audio/mpeg',
            },
            body: JSON.stringify({
              text: text.slice(0, 5000),
              model_id: ELEVEN_MODEL,
              voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.2, use_speaker_boost: true },
            }),
          }
        );
        if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setSpeakingIdx((cur) => (cur === idx ? -1 : cur));
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setSpeakingIdx(-1);
          URL.revokeObjectURL(url);
        };
        audio.play();
        return;
      } catch (err) {
        console.warn('ElevenLabs TTS failed, falling back to Web Speech:', err.message);
      }
    }

    // --- Fallback: Web Speech API ---
    if (!ttsSupported) { setSpeakingIdx(-1); return; }
    const spoken = toGarhwaliSpeech(text);
    const utter = new SpeechSynthesisUtterance(spoken);
    utter.lang = 'hi-IN';
    utter.rate = PAHADI_RATE;
    utter.pitch = PAHADI_PITCH;
    const voice = pickPahadiVoice();
    if (voice) utter.voice = voice;
    utter.onend = () => setSpeakingIdx((cur) => (cur === idx ? -1 : cur));
    utter.onerror = () => setSpeakingIdx(-1);
    if (!voice && window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const v = pickPahadiVoice();
        if (v) utter.voice = v;
        window.speechSynthesis.speak(utter);
        window.speechSynthesis.onvoiceschanged = null;
      };
      return;
    }
    window.speechSynthesis.speak(utter);
  };

  const clearChat = () => {
    if (streaming) stop();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeakingIdx(-1);
    setMessages([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;
  const showHero = isEmpty && !streaming;
  const characterMeta = CHARACTERS.find((c) => c.id === activeCharacter) || CHARACTERS[0];

  return (
    <div className="relative min-h-screen text-white">
      <SEO
        title="Ghughuti AI - Garhwali Chatbot & Language Assistant"
        description="Ghughuti AI is a Garhwali-speaking chatbot — ask about Uttarakhand culture, festivals, food, travel, folk songs and learn new Garhwali words with everyday examples."
        path="/ghughuti-ai"
        noindex={true}
        keywords="Ghughuti AI, Garhwali chatbot, Garhwali AI, Uttarakhand AI, learn Garhwali, Garhwali language, Pahadi assistant"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Ghughuti AI',
          url: 'https://pahaditube.in/ghughuti-ai',
          applicationCategory: 'EducationalApplication',
          inLanguage: ['hi', 'gbm'],
          description: 'A Garhwali-speaking AI chatbot for Uttarakhand culture, language and travel questions.',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
        }}
      />
      {/* ===== Background: deep navy + mandala (fixed so it never scrolls) ===== */}
      <div className="fixed inset-0 -z-10 bg-[#0a1228]">
        {/* radial accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] -translate-y-1/3 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/10 blur-3xl" />
        {/* mandala SVG pattern */}
        <svg
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.06]"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <g fill="none" stroke="#fbbf24" strokeWidth="0.4">
            {[20, 40, 60, 80, 95].map((r) => (
              <circle key={r} cx="100" cy="100" r={r} />
            ))}
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * 360) / 24;
              const rad = (a * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={100 + 95 * Math.cos(rad)}
                  y2={100 + 95 * Math.sin(rad)}
                />
              );
            })}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 360) / 12;
              const rad = (a * Math.PI) / 180;
              return (
                <circle
                  key={`p-${i}`}
                  cx={100 + 60 * Math.cos(rad)}
                  cy={100 + 60 * Math.sin(rad)}
                  r="6"
                />
              );
            })}
          </g>
        </svg>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* ===== Content ===== */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-4 pb-40 flex flex-col">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="/ghughuti-ai-logo.png"
            alt="घुघुती AI"
            className="w-64 sm:w-80 h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          />
          <p className="mt-2 text-xs sm:text-sm text-white/70 font-medium">
            गढ़वळि भाषा मा बच्या · Powered by Llama 3.3
          </p>
          <button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}/ghughuti-ai`;
              const shareData = {
                title: 'घुघुती AI · PahadiTube',
                text: 'गढ़वळि भाषा मा बच्या करा — Ghughuti AI try karein!',
                url,
              };
              if (navigator.share) {
                navigator.share(shareData).catch(() => {});
              } else {
                navigator.clipboard
                  .writeText(url)
                  .then(() => alert('Link copied!'))
                  .catch(() => {});
              }
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border border-amber-300/40 shadow-md shadow-orange-900/30 rounded-full px-3.5 py-1.5 transition-colors"
            aria-label="Share Ghughuti AI"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Ghughuti AI
          </button>
        </div>

        {/* Greeting (only when chat empty) */}
        {showHero && (
          <div className="mt-2 mb-5 text-center">
            <div className="text-5xl mb-2">🙏</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              नमस्कार, ज्यूँ रै, जियाण रै, खुश रै।
            </h2>
            <p className="mt-2 text-base sm:text-lg text-amber-200/90 font-medium">
              नमस्कार! घुघुती ऐआई मा त्वांकु स्वागत छ. मी त्वांकु गढ़वळि भाषा सहायक छू. मैं दगड़ि बात करणा मा क्या मदद चोंद?
            </p>
            <p className="mt-1 text-sm text-white/70">
              गढ़वळि मा कुछ भि पुछा — खाना, गीत, त्योहार, यात्रा या कविता।
            </p>
          </div>
        )}

        {/* Initial character row: Bheji + funny Bhula */}
        <div className="mb-5">
          <p className="text-xs text-white/70 text-center mb-2">कैं दगड़ी बात करणी छ?</p>
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {CHARACTERS.map((c) => {
              const selected = c.id === activeCharacter;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCharacter(c.id)}
                  className={`rounded-2xl p-3 border transition-all text-left ${
                    selected
                      ? 'bg-amber-500/20 border-amber-300/80 ring-2 ring-amber-300/40'
                      : 'bg-white/5 border-white/15 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/20 shrink-0">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/ghughuti-ai-logo.png';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {c.emoji} {c.name}
                      </p>
                      <p className="text-xs text-white/70">{c.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* === Topic cards (when empty) OR Chat panel === */}
        {showHero ? (
          <div className="mt-6">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {TOPIC_CARDS.map((card) => (
                <button
                  key={card.label}
                  onClick={() => sendMessage(card.prompt)}
                  className={`group relative ${card.bg} rounded-lg p-1.5 text-center shadow-md shadow-black/30 ring-1 ring-white/10 hover:scale-[1.03] hover:ring-white/30 transition-all overflow-hidden`}
                >
                  {/* subtle pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 20%, #fff 1px, transparent 1px)',
                      backgroundSize: '10px 10px',
                    }}
                  />
                  <div className="relative flex flex-col items-center justify-center gap-0.5 min-h-[68px]">
                    <div className="text-xl drop-shadow">{card.emoji}</div>
                    <div className="text-white font-semibold text-[9px] sm:text-[10px] leading-tight whitespace-pre-line drop-shadow">
                      {card.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 relative rounded-3xl border border-amber-300/20 bg-[#0f1a36]/80 backdrop-blur shadow-2xl shadow-black/40 overflow-hidden">
            <div
              className="h-1.5 w-full"
              style={{
                background:
                  'repeating-linear-gradient(90deg, transparent 0 6px, rgba(251,191,36,0.5) 6px 10px)',
              }}
            />
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="absolute top-3 right-3 z-10 px-3 py-1 text-[11px] font-medium text-white/80 hover:text-white bg-white/10 hover:bg-red-500/40 border border-white/15 rounded-full transition-colors"
              >
                ✕ Clear
              </button>
            )}
            <div
              ref={scrollRef}
              className="overflow-y-auto px-4 sm:px-6 py-5 space-y-4"
              style={{ maxHeight: 'calc(100svh - 300px)', minHeight: '260px' }}
            >
              {messages.map((m, i) => (
                <MessageBubble
                  key={i}
                  role={m.role}
                  content={m.content}
                  isStreaming={streaming && i === messages.length - 1 && m.role === 'assistant'}
                  onSpeak={(elevenLabsSupported || ttsSupported) && m.role === 'assistant' && m.content ? () => speak(m.content, i) : null}
                  isSpeaking={speakingIdx === i}
                  timeLabel={formatTime(i, messages.length)}
                />
              ))}
              {streaming && messages.length > 0 &&
                messages[messages.length - 1].role === 'assistant' &&
                !messages[messages.length - 1].content && (
                  <div className="flex gap-3">
                    <Avatar isUser={false} />
                    <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white/90 text-sm flex items-center gap-2">
                      <span className="text-base">✨</span>
                      <span>सोचणु रा छ…</span>
                      <TypingDots />
                    </div>
                  </div>
              )}
              {error && (
                <div className="p-3 text-sm text-white bg-red-500/30 border border-red-300/30 rounded-xl">
                  ⚠️ {error}
                </div>
              )}
            </div>
            <div className="px-4 sm:px-6 pb-4 -mt-1 text-[11px] text-white/65">
              Active character: <span className="text-amber-300 font-semibold">{characterMeta.name}</span>
            </div>
          </div>
        )}

        {/* Ornate input bar (fixed above bottom nav so it stays visible while chat scrolls) */}
        <div className="fixed left-0 right-0 bottom-20 sm:bottom-24 z-30 px-4 sm:px-6 pointer-events-none">
          <div className="relative mx-auto w-full max-w-2xl pointer-events-auto">
          <div
            className="rounded-2xl p-[2px]"
            style={{
              background:
                'linear-gradient(135deg, #fbbf24 0%, #b45309 25%, #fbbf24 50%, #b45309 75%, #fbbf24 100%)',
            }}
          >
            <div className="rounded-[14px] bg-[#0f1a36] border border-amber-300/20 flex items-end gap-2 p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={listening ? '🎙️ बोला…' : 'गढ़वळि मा यखा लिख्या या बोला…'}
                rows={1}
                maxLength={4000}
                disabled={streaming}
                className="flex-1 bg-transparent text-white placeholder-white/50 px-3 py-2 text-sm resize-none outline-none disabled:opacity-60"
                style={{ maxHeight: '160px' }}
              />
              <button
                onClick={() => {
                  if (listening) return stopListening();
                  if (speechSupported) return startListening();
                  textareaRef.current?.focus();
                }}
                className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                  listening
                    ? 'bg-red-500/30 text-red-200 ring-1 ring-red-300/50'
                    : 'text-amber-300 hover:bg-amber-300/10'
                }`}
                aria-label="Voice input"
                title="Tap to speak"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
                  <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V20H8a1 1 0 100 2h8a1 1 0 100-2h-3v-2.08A7 7 0 0019 11z" />
                </svg>
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || streaming}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-400 text-amber-950 hover:bg-amber-300 disabled:bg-transparent disabled:text-amber-300/40 disabled:shadow-none transition-colors shadow"
                aria-label="Send"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-[10px] text-white/50 text-center max-w-md mx-auto">
          AI जवाब हमेशा सटीक नि होंदा — महत्वपूर्ण जानकारी सत्यापित कर्या।
          {isIOS && (
            <>
              <br />
              Voice input isn't supported on iOS{isStandalonePWA ? ' (installed app)' : ''}. Type instead.
            </>
          )}
        </p>
      </div>

      {/* ===== Bottom action dock (sticky above BottomNav) ===== */}
      {/* Bottom dock removed — Learn Words / Cultural Quiz are now topic cards; mic lives in the input bar. */}
    </div>
  );
}

// Render a HH:MM time label for each message based on its index/recency.
// Uses local time. Timestamps aren't persisted (no browser storage), so this
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
    <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden ring-2 ring-yellow-300/70 shadow bg-white flex items-center justify-center">
      <img src="/ghughuti-ai-logo.png" alt="" className="w-full h-full object-contain" />
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
              : 'bg-slate-700/80 text-white rounded-bl-md border border-white/15'
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
                  : 'text-white/80 hover:text-white hover:bg-white/10'
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
