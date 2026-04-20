import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['general', 'politics', 'culture', 'sports', 'weather', 'development'];

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
  const formRef = useRef(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
    setImageDirty(true);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">News Admin</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={sendTestPush}
            className="text-sm px-3 py-1.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25"
            title="Send a test push notification to every subscribed device"
          >
            🔔 Send test push
          </button>
          <button
            onClick={() => { setAuthenticated(false); setKey(''); resetForm(); }}
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
