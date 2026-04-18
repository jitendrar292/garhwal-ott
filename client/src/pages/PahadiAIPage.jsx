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
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

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

  const clearChat = () => {
    if (streaming) stop();
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col" style={{ minHeight: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xl shadow-lg shadow-primary-500/20">
            🏔️
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">पहाड़ी AI</h1>
            <p className="text-[11px] sm:text-xs text-gray-400">गढ़वळि भाषा मा बच्या · Powered by Llama 3.3</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-full transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-white/5 bg-dark-900/40 p-4 sm:p-6 space-y-4"
        style={{ minHeight: '400px' }}
      >
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="text-5xl mb-3">👋</div>
            <h2 className="text-lg font-semibold text-white mb-1">
              ज्यू रौ, ज्यू बचि रौ
            </h2>
            <p className="text-sm text-gray-400 max-w-md mb-6">
              गढ़वळि भाषा मा कुछ भि पुछा — खाना, गीत, त्योहार, यात्रा, या कविता।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-3 text-sm text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 rounded-xl transition-colors"
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
            />
          ))
        )}

        {error && (
          <div className="p-3 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-3 sm:mt-4">
        <div className="relative flex items-end gap-2 p-2 bg-dark-800/80 border border-white/10 rounded-2xl focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/30 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="यखा गढ़वळि मा लिखा... (Shift+Enter for new line)"
            rows={1}
            maxLength={4000}
            disabled={streaming}
            className="flex-1 bg-transparent text-white placeholder-gray-500 px-3 py-2 text-sm resize-none outline-none disabled:opacity-60"
            style={{ maxHeight: '160px' }}
          />
          {streaming ? (
            <button
              onClick={stop}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
              aria-label="Stop"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="5" y="5" width="10" height="10" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 disabled:bg-white/5 disabled:text-gray-600 text-white transition-colors"
              aria-label="Send"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          AI जवाब हमेशा सटीक नि होंदा — महत्वपूर्ण जानकारी सत्यापित कर्या।
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ role, content, isStreaming }) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser ? 'bg-primary-500/20 text-primary-300' : 'bg-white/10 text-white'
        }`}
      >
        {isUser ? '🙋' : '🏔️'}
      </div>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-primary-500 text-white rounded-br-sm'
            : 'bg-white/5 text-gray-100 rounded-bl-sm'
        }`}
      >
        {content || (isStreaming ? <TypingDots /> : '')}
        {isStreaming && content && (
          <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary-300 animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}
