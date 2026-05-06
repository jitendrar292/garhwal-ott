import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import FESTIVALS from '../data/festivals';
import MELAS from '../data/melas';
import EVENTS from '../data/events';

const CATEGORIES = ['general', 'politics', 'culture', 'sports', 'weather', 'development'];

// Pick the next upcoming entry across festivals + melas + events. Returns
// a normalised { type, name, date, location, description } or null when
// nothing is upcoming.
function nextHappening() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const all = [
    ...FESTIVALS.map((f) => ({ type: 'Festival', name: f.name, nameLocal: f.nameLocal, date: f.date, location: f.region, description: f.description, emoji: f.emoji })),
    ...MELAS.map((m) => ({ type: 'Mela', name: m.name, nameLocal: m.nameLocal, date: m.date, location: m.region || m.location, description: m.description, emoji: m.emoji })),
    ...EVENTS.map((e) => ({ type: e.category === 'theatre' ? 'Theatre' : e.category === 'music' ? 'Music' : e.category === 'fashion' ? 'Fashion' : e.category === 'art' ? 'Art' : e.category === 'literary' ? 'Literary' : 'Event', name: e.name, nameLocal: e.nameLocal, date: e.date, location: e.location, description: e.description, emoji: e.emoji })),
  ]
    .filter((i) => new Date(i.date + 'T00:00:00').getTime() >= todayMs)
    .sort((a, b) => a.date.localeCompare(b.date));
  return all[0] || null;
}

function daysUntil(iso) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso + 'T00:00:00') - today) / 86400000);
}

function whenLabel(d) {
  if (d === 0) return 'aaj';
  if (d === 1) return 'kal';
  if (d <= 30) return `${d} din me`;
  const w = Math.round(d / 7);
  if (d <= 90) return `${w} hafte me`;
  const m = Math.round(d / 30);
  return `${m} mahine me`;
}

export default function NewsAdminPage() {
  const [key, setKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('general');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); // data URI or existing /api/news/:id/image URL
  const [imageDirty, setImageDirty] = useState(false); // user changed image during edit
  const [submitting, setSubmitting] = useState(false);
  const [devices, setDevices] = useState(null); // { count, enabled, subscriptions } | null
  const [devicesLoading, setDevicesLoading] = useState(false);
  const formRef = useRef(null);

  // News Agent state
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentStatus, setAgentStatus] = useState(null);
  const [selectedNews, setSelectedNews] = useState(new Set());
  const [translatedPreviews, setTranslatedPreviews] = useState([]); // Garhwali previews
  const [translating, setTranslating] = useState(false);
  const [publishingTranslated, setPublishingTranslated] = useState(false);
  const [selectedTranslated, setSelectedTranslated] = useState(new Set());
  const [editingPreviewIndex, setEditingPreviewIndex] = useState(null);
  const [previewEditData, setPreviewEditData] = useState({});

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/news?all=true&key=${encodeURIComponent(key)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (key.trim()) {
      setAuthenticated(true);
      fetchArticles();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2 MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImageDirty(true); // set dirty only after data URI is ready
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSummary('');
    setBody('');
    setCategory('general');
    setImageFile(null);
    setImagePreview('');
    setImageDirty(false);
  };

  const startEdit = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/news/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load article');
      const { article } = await res.json();
      setEditingId(article.id);
      setTitle(article.title || '');
      setSummary(article.summary || '');
      setBody(article.body || '');
      setCategory(article.category || 'general');
      setImageFile(null);
      setImagePreview(article.imageUrl || ''); // existing URL (not a data: URI)
      setImageDirty(false);
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      body: body.trim(),
      category,
    };

    if (editingId == null) {
      // Create: send image only if user picked one.
      if (imagePreview && imagePreview.startsWith('data:')) {
        payload.image = imagePreview;
      }
    } else {
      // Update: only send `image` if the user touched it.
      //   - new file picked → data URI
      //   - removed image    → '' (server treats as remove)
      //   - untouched        → omit (server keeps existing)
      if (imageDirty) {
        payload.image = imagePreview && imagePreview.startsWith('data:') ? imagePreview : '';
      }
    }

    try {
      const url = editingId == null
        ? `/api/news?key=${encodeURIComponent(key)}`
        : `/api/news/${editingId}?key=${encodeURIComponent(key)}`;
      const res = await fetch(url, {
        method: editingId == null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        setError('Invalid admin key');
        setAuthenticated(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }
      setSuccess(editingId == null ? 'Article published!' : 'Article updated!');
      resetForm();
      fetchArticles();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/news/${id}?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (res.status === 401) {
        setError('Invalid admin key');
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to delete');
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setSuccess('Article deleted');
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6 text-center">News Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter admin key"
            className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors"
          >
            Login
          </button>
        </form>
        <Link to="/news" className="block text-center mt-4 text-gray-400 hover:text-white text-sm">
          ← Back to News
        </Link>
      </div>
    );
  }

  const isEditing = editingId != null;

  // ── Admin dashboard ──
  const sendTestPush = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/push/test?key=${encodeURIComponent(key)}`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setSuccess(`Test push sent — sent: ${data.sent ?? 0}, removed: ${data.removed ?? 0}, failed: ${data.failed ?? 0}`);
    } catch (err) {
      setError(`Push test failed: ${err.message}`);
    }
  };

  const loadDevices = async () => {
    setError('');
    setDevicesLoading(true);
    try {
      const res = await fetch(`/api/push/list?key=${encodeURIComponent(key)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setDevices(data);
    } catch (err) {
      setError(`Could not load devices: ${err.message}`);
    } finally {
      setDevicesLoading(false);
    }
  };

  // ── News Agent functions ──
  const runNewsAgent = async (dryRun = false) => {
    setError('');
    setSuccess('');
    setAgentRunning(true);
    setSelectedNews(new Set());
    try {
      const res = await fetch(`/api/news-agent/run?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxPerFeed: 5, maxAge: 24, maxArticles: 15, dryRun }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setSuccess(`News agent started${dryRun ? ' (dry run)' : ''}! Check status for results.`);
      // Poll status every 5s until done
      const poll = setInterval(async () => {
        try {
          const sr = await fetch(`/api/news-agent/status?key=${encodeURIComponent(key)}`);
          const sd = await sr.json();
          setAgentStatus(sd.lastRun);
          if (sd.lastRun.status !== 'running') {
            clearInterval(poll);
            setAgentRunning(false);
            if (sd.lastRun.status === 'completed') {
              setSuccess(`Agent done! Found: ${sd.lastRun.articlesFound}, New: ${sd.lastRun.articlesNew}, Translated: ${sd.lastRun.articlesTranslated}, Published: ${sd.lastRun.articlesPublished}`);
              fetchArticles(); // refresh article list
            } else if (sd.lastRun.status === 'error') {
              setError(`Agent error: ${sd.lastRun.errors?.join(', ')}`);
            }
          }
        } catch { /* ignore poll errors */ }
      }, 5000);
    } catch (err) {
      setError(`Agent failed: ${err.message}`);
      setAgentRunning(false);
    }
  };

  const fetchAgentStatus = async () => {
    try {
      const res = await fetch(`/api/news-agent/status?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      setAgentStatus(data.lastRun);
    } catch { /* ignore */ }
  };

  const toggleNewsSelection = (idx) => {
    setSelectedNews((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const selectAllNews = () => {
    if (!agentStatus?.preview) return;
    if (selectedNews.size === agentStatus.preview.length) {
      setSelectedNews(new Set());
    } else {
      setSelectedNews(new Set(agentStatus.preview.map((_, i) => i)));
    }
  };

  const publishSelectedNews = async () => {
    if (!agentStatus?.preview || selectedNews.size === 0) return;
    const chosen = agentStatus.preview.filter((_, i) => selectedNews.has(i));
    setError('');
    setSuccess('');
    setTranslating(true);
    setTranslatedPreviews([]);
    setSelectedTranslated(new Set());
    try {
      // Step 2: Translate selected articles and show preview (don't publish yet)
      const res = await fetch(`/api/news-agent/translate-preview?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: chosen }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      if (data.translated && data.translated.length > 0) {
        setTranslatedPreviews(data.translated);
        setSelectedTranslated(new Set(data.translated.map((_, i) => i)));
        setSuccess(`✅ Translated ${data.translated.length} articles to Garhwali! Review below and publish.`);
      } else {
        setError('Translation returned no results. Try again or check API keys.');
      }
    } catch (err) {
      setError(`Translation failed: ${err.message}`);
    } finally {
      setTranslating(false);
    }
  };

  // Step 3: Publish the reviewed translations
  const publishTranslatedNews = async () => {
    if (translatedPreviews.length === 0 || selectedTranslated.size === 0) return;
    const chosen = translatedPreviews.filter((_, i) => selectedTranslated.has(i));
    setError('');
    setSuccess('');
    setPublishingTranslated(true);
    try {
      const res = await fetch(`/api/news-agent/publish-translated?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: chosen }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setSuccess(`🎉 Published ${data.published || chosen.length} Garhwali articles!`);
      setTranslatedPreviews([]);
      setSelectedTranslated(new Set());
      setSelectedNews(new Set());
      fetchArticles();
    } catch (err) {
      setError(`Publish failed: ${err.message}`);
    } finally {
      setPublishingTranslated(false);
    }
  };

  const toggleTranslatedSelection = (idx) => {
    setSelectedTranslated((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const selectAllTranslated = () => {
    if (selectedTranslated.size === translatedPreviews.length) {
      setSelectedTranslated(new Set());
    } else {
      setSelectedTranslated(new Set(translatedPreviews.map((_, i) => i)));
    }
  };

  const startEditingPreview = (index) => {
    const item = translatedPreviews[index];
    setEditingPreviewIndex(index);
    setPreviewEditData({
      title: item.title || '',
      summary: item.summary || '',
      body: item.body || '',
      category: item.category || 'general',
      imageFile: null,
      imagePreview: item.imageUrl || '',
      imageDirty: false,
    });
  };

  const cancelEditingPreview = () => {
    setEditingPreviewIndex(null);
    setPreviewEditData({});
  };

  const saveEditedPreview = () => {
    if (editingPreviewIndex === null) return;
    const updated = [...translatedPreviews];
    updated[editingPreviewIndex] = {
      ...updated[editingPreviewIndex],
      title: previewEditData.title,
      summary: previewEditData.summary,
      body: previewEditData.body,
      category: previewEditData.category,
      image: previewEditData.imageDirty && previewEditData.imagePreview?.startsWith('data:') 
        ? previewEditData.imagePreview 
        : undefined,
      imageUrl: !previewEditData.imageDirty ? previewEditData.imagePreview : undefined,
    };
    setTranslatedPreviews(updated);
    cancelEditingPreview();
  };

  const handlePreviewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewEditData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result,
        imageDirty: true,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePreviewImage = () => {
    setPreviewEditData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: '',
      imageDirty: true,
    }));
  };

  const sendHappeningPush = async () => {
    setError('');
    setSuccess('');
    const item = nextHappening();
    if (!item) {
      setError('No upcoming happenings to notify about.');
      return;
    }
    const days = daysUntil(item.date);
    const when = whenLabel(days);
    const title = `${item.emoji || '🎉'} ${item.type}: ${item.name}`;
    const bodyParts = [];
    bodyParts.push(`${when} — ${item.location}`);
    if (item.description) bodyParts.push(item.description);
    const body = bodyParts.join(' • ');
    if (!confirm(`Send push to all devices?\n\n${title}\n${body}`)) return;
    try {
      const res = await fetch(`/api/push/send?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          url: '/',
          tag: `happening-${item.date}-${item.name}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setSuccess(`Happening push sent — sent: ${data.sent ?? 0}, failed: ${data.failed ?? 0}`);
    } catch (err) {
      setError(`Happening push failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">News Admin</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={sendHappeningPush}
            className="text-sm px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
            title="Send a push about the next upcoming festival/mela/event"
          >
            🎉 Notify next happening
          </button>
          <button
            onClick={sendTestPush}
            className="text-sm px-3 py-1.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25"
            title="Send a test push notification to every subscribed device"
          >
            🔔 Send test push
          </button>
          <button
            onClick={loadDevices}
            disabled={devicesLoading}
            className="text-sm px-3 py-1.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 disabled:opacity-50"
            title="View devices currently subscribed to push notifications"
          >
            {devicesLoading ? '…' : `📱 ${devices ? `Refresh (${devices.count})` : 'View devices'}`}
          </button>
          <button
            onClick={() => { setAuthenticated(false); setKey(''); resetForm(); setDevices(null); }}
            className="text-sm text-gray-400 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
          {success}
        </div>
      )}

      {devices && (
        <div className="mb-6 p-4 bg-dark-800 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">
              📱 Registered devices ({devices.count})
            </h2>
            <button
              onClick={() => setDevices(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Hide
            </button>
          </div>
          {!devices.enabled && (
            <p className="text-xs text-amber-300 mb-2">
              Push is not enabled on the server (VAPID keys missing).
            </p>
          )}
          {devices.subscriptions?.length === 0 ? (
            <p className="text-xs text-gray-400">No devices subscribed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="text-left py-2 pr-3 font-medium">Browser</th>
                    <th className="text-left py-2 pr-3 font-medium">Push host</th>
                    <th className="text-left py-2 pr-3 font-medium">Subscribed</th>
                    <th className="text-left py-2 font-medium">ID</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {devices.subscriptions.map((d) => (
                    <tr key={d.endpointHash} className="border-b border-white/5 last:border-0">
                      <td className="py-2 pr-3">{d.browser}</td>
                      <td className="py-2 pr-3 text-gray-400">{d.host}</td>
                      <td className="py-2 pr-3 text-gray-400">
                        {d.addedAt ? new Date(d.addedAt).toLocaleString('en-IN') : '—'}
                      </td>
                      <td className="py-2 font-mono text-[10px] text-gray-500">{d.endpointHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* News Agent Panel */}
      <div className="mb-6 p-4 bg-dark-800 border border-indigo-500/30 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">🤖 News Agent — Pull → Translate → Preview → Publish</h2>
          <button
            onClick={fetchAgentStatus}
            className="text-xs text-gray-400 hover:text-white"
          >
            Refresh status
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Step 1: Pull news from Uttarakhand RSS feeds. Step 2: Select & translate to Garhwali. Step 3: Review preview & publish.
        </p>
        <div className="flex gap-2 mb-3 flex-wrap">
          <button
            onClick={() => runNewsAgent(true)}
            disabled={agentRunning || translating}
            className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {agentRunning ? '⏳ Pulling...' : '📥 Step 1: Pull News'}
          </button>
          <button
            onClick={() => runNewsAgent(false)}
            disabled={agentRunning || translating}
            className="text-sm px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Skip preview — directly translate and publish (use with caution)"
          >
            {agentRunning ? '⏳ Running...' : '⚡ Auto-Publish (Skip Preview)'}
          </button>
        </div>
        {agentStatus && (
          <div className="text-xs space-y-1 p-3 bg-black/30 rounded-lg">
            <div className="flex gap-4 flex-wrap">
              <span>Status: <span className={`font-medium ${agentStatus.status === 'completed' ? 'text-green-400' : agentStatus.status === 'error' ? 'text-red-400' : agentStatus.status === 'running' ? 'text-yellow-400' : 'text-gray-400'}`}>{agentStatus.status}</span></span>
              <span>Found: {agentStatus.articlesFound}</span>
              <span>New: {agentStatus.articlesNew}</span>
              <span>Translated: {agentStatus.articlesTranslated}</span>
              <span>Published: {agentStatus.articlesPublished}</span>
            </div>
            {agentStatus.startedAt && (
              <div className="text-gray-500">
                Started: {new Date(agentStatus.startedAt).toLocaleString('en-IN')}
                {agentStatus.completedAt && ` · Completed: ${new Date(agentStatus.completedAt).toLocaleString('en-IN')}`}
              </div>
            )}
            {agentStatus.errors?.length > 0 && (
              <div className="text-red-400 mt-1">Errors: {agentStatus.errors.join(', ')}</div>
            )}
            {agentStatus.preview && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-indigo-300 font-medium">📰 Step 2: Select articles to translate to Garhwali:</div>
                  <button
                    onClick={selectAllNews}
                    className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                  >
                    {selectedNews.size === agentStatus.preview.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                {agentStatus.preview.map((p, i) => (
                  <label key={i} className={`mb-2 p-2 bg-dark-700 rounded flex gap-3 cursor-pointer border transition-colors ${selectedNews.has(i) ? 'border-indigo-500/60 bg-indigo-950/30' : 'border-transparent'}`}>
                    <input
                      type="checkbox"
                      checked={selectedNews.has(i)}
                      onChange={() => toggleNewsSelection(i)}
                      className="mt-1 accent-indigo-500 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-white">{p.title}</div>
                      <div className="text-gray-400">{p.summary}</div>
                      <div className="text-gray-500 mt-1 flex gap-3 flex-wrap">
                        <span>📰 {p.source}</span>
                        <span>🌐 {p.lang === 'hi' ? 'Hindi' : 'English'}</span>
                        {p.pubDate && <span>🕐 {new Date(p.pubDate).toLocaleString('en-IN')}</span>}
                      </div>
                    </div>
                  </label>
                ))}
                {selectedNews.size > 0 && (
                  <button
                    onClick={publishSelectedNews}
                    disabled={translating}
                    className="mt-2 w-full text-sm px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {translating ? '⏳ Translating to Garhwali...' : `🔄 Translate ${selectedNews.size} Selected → Preview in Garhwali`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Garhwali Translation Preview */}
        {translatedPreviews.length > 0 && (
          <div className="mt-4 p-4 bg-green-950/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-green-300">✅ Step 3: Review Garhwali Preview & Publish</h3>
              <button
                onClick={selectAllTranslated}
                className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30"
              >
                {selectedTranslated.size === translatedPreviews.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Review the Garhwali translations below. Uncheck any you don't want to publish.</p>
            <div className="space-y-3">
              {translatedPreviews.map((t, i) => {
                const isEditing = editingPreviewIndex === i;
                return isEditing ? (
                  // Edit mode
                  <div key={i} className="block p-4 rounded-lg border border-amber-500/50 bg-amber-950/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-amber-300">✏️ Editing Preview #{i + 1}</h4>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveEditedPreview}
                          className="text-xs px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
                        >
                          ✓ Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditingPreview}
                          className="text-xs px-3 py-1 rounded bg-dark-700 hover:bg-dark-600 text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={previewEditData.title || ''}
                        onChange={(e) => setPreviewEditData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Title *"
                        maxLength={300}
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      <input
                        type="text"
                        value={previewEditData.summary || ''}
                        onChange={(e) => setPreviewEditData((prev) => ({ ...prev, summary: e.target.value }))}
                        placeholder="Summary"
                        maxLength={1000}
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      <textarea
                        value={previewEditData.body || ''}
                        onChange={(e) => setPreviewEditData((prev) => ({ ...prev, body: e.target.value }))}
                        placeholder="Full article body *"
                        rows={8}
                        maxLength={20000}
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y text-sm"
                      />
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select
                          value={previewEditData.category || 'general'}
                          onChange={(e) => setPreviewEditData((prev) => ({ ...prev, category: e.target.value }))}
                          className="px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                          ))}
                        </select>
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-gray-300 hover:text-white text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs">
                            {previewEditData.imageFile
                              ? previewEditData.imageFile.name
                              : previewEditData.imagePreview
                                ? 'Replace image'
                                : 'Add image (max 2MB)'}
                          </span>
                          <input type="file" accept="image/*" onChange={handlePreviewImageChange} className="hidden" />
                        </label>
                      </div>
                      {previewEditData.imagePreview && (
                        <div className="relative inline-block">
                          <img src={previewEditData.imagePreview} alt="Preview" className="h-24 rounded-lg object-cover" />
                          <button
                            type="button"
                            onClick={removePreviewImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div key={i} className={`block p-3 rounded-lg border transition-all ${selectedTranslated.has(i) ? 'border-green-500/50 bg-green-950/30' : 'border-dark-600 bg-dark-800/50 opacity-60'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedTranslated.has(i)}
                        onChange={() => toggleTranslatedSelection(i)}
                        className="mt-1 accent-green-500 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-bold text-white text-sm">{t.title}</div>
                            <div className="text-green-200/80 text-xs mt-1">{t.summary}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => startEditingPreview(i)}
                            className="text-xs px-2 py-1 rounded bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 flex items-center gap-1 shrink-0"
                            title="Edit this preview"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                        <div className="mt-2 p-2 bg-dark-900/70 rounded text-xs text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                          {t.body}
                        </div>
                        {(t.imageUrl || t.image) && (
                          <img 
                            src={t.image || t.imageUrl} 
                            alt={t.title} 
                            className="mt-2 h-24 rounded-lg object-cover" 
                          />
                        )}
                        <div className="text-[10px] text-gray-500 mt-2 flex gap-3 flex-wrap">
                          <span>📁 {t.category}</span>
                          {t.source && <span>📰 {t.source}</span>}
                          {t.sourceUrl && <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">🔗 Original</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedTranslated.size > 0 && (
              <button
                onClick={publishTranslatedNews}
                disabled={publishingTranslated}
                className="mt-3 w-full text-sm px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {publishingTranslated ? '⏳ Publishing...' : `🚀 Publish ${selectedTranslated.size} Garhwali Article${selectedTranslated.size > 1 ? 's' : ''}`}
              </button>
            )}
            <button
              onClick={() => { 
                setTranslatedPreviews([]); 
                setSelectedTranslated(new Set()); 
                setEditingPreviewIndex(null);
                setPreviewEditData({});
              }}
              className="mt-2 w-full text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
            >
              ✕ Discard translations
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Article Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`mb-10 p-6 rounded-xl border space-y-4 ${
          isEditing ? 'bg-amber-950/20 border-amber-700/60' : 'bg-dark-800 border-dark-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEditing ? `Editing Article #${editingId}` : 'Publish New Article'}
          </h2>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs px-3 py-1 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300"
            >
              Cancel edit
            </button>
          )}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title *"
          maxLength={300}
          className="w-full px-4 py-2 rounded-lg bg-dark-900 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summary (optional, short description)"
          maxLength={1000}
          className="w-full px-4 py-2 rounded-lg bg-dark-900 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Full article body *"
          rows={6}
          maxLength={20000}
          className="w-full px-4 py-2 rounded-lg bg-dark-900 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-dark-900 border border-dark-600 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg bg-dark-900 border border-dark-600 text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">
              {imageFile
                ? imageFile.name
                : isEditing && imagePreview
                  ? 'Replace image (max 2MB)'
                  : 'Add image (max 2MB)'}
            </span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {imagePreview && (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-24 rounded-lg object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full sm:w-auto px-8 py-2.5 rounded-lg font-semibold transition-colors disabled:bg-gray-600 ${
            isEditing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {submitting
            ? (isEditing ? 'Updating...' : 'Publishing...')
            : (isEditing ? 'Update Article' : 'Publish Article')}
        </button>
      </form>

      {/* Articles List */}
      <h2 className="text-lg font-semibold mb-4">Published Articles ({articles.length})</h2>
      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="space-y-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className={`flex items-start justify-between gap-3 p-4 rounded-lg border ${
              editingId === article.id
                ? 'bg-amber-950/30 border-amber-700/60'
                : 'bg-dark-800 border-dark-700'
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{article.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                <span className="inline-block px-2 py-0.5 bg-dark-700 rounded text-xs mr-2">{article.category}</span>
                {new Date(article.createdAt).toLocaleDateString('hi-IN')}
              </p>
            </div>
            {article.imageUrl && (
              <img src={article.imageUrl} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
            )}
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={() => startEdit(article.id)}
                className="px-3 py-1.5 text-xs bg-blue-700 hover:bg-blue-600 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(article.id)}
                className="px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && articles.length === 0 && (
          <p className="text-gray-500 text-center py-8">No articles yet. Publish your first one above!</p>
        )}
      </div>

      <Link to="/news" className="block text-center mt-8 text-gray-400 hover:text-white text-sm">
        ← Back to News Page
      </Link>
    </div>
  );
}
