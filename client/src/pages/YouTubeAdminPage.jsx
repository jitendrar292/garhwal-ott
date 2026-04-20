import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function YouTubeAdminPage() {
  const [key, setKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // status: { [category]: { state: 'idle'|'refreshing'|'ok'|'err', count?, message?, at? } }
  const [status, setStatus] = useState({});

  const fetchCategories = useCallback(async (adminKey) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/youtube/admin/categories?key=${encodeURIComponent(adminKey)}`);
      if (res.status === 401) throw new Error('Invalid admin key');
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data.categories || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err.message);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!key.trim()) return;
    fetchCategories(key.trim());
  };

  const refreshOne = async (category) => {
    setStatus((s) => ({ ...s, [category]: { state: 'refreshing' } }));
    try {
      const res = await fetch(
        `/api/youtube/admin/refresh?key=${encodeURIComponent(key)}&category=${encodeURIComponent(category)}`,
        { method: 'POST' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setStatus((s) => ({
        ...s,
        [category]: {
          state: 'ok',
          count: data.count,
          at: new Date().toLocaleTimeString(),
        },
      }));
    } catch (err) {
      setStatus((s) => ({
        ...s,
        [category]: { state: 'err', message: err.message },
      }));
    }
  };

  const refreshAll = async () => {
    setStatus((s) => ({ ...s, __all: { state: 'refreshing' } }));
    try {
      const res = await fetch(
        `/api/youtube/admin/refresh?key=${encodeURIComponent(key)}&category=all`,
        { method: 'POST' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setStatus((s) => ({
        ...s,
        __all: { state: 'ok', at: new Date().toLocaleTimeString() },
      }));
    } catch (err) {
      setStatus((s) => ({
        ...s,
        __all: { state: 'err', message: err.message },
      }));
    }
  };

  useEffect(() => {
    // No-op: auth happens on submit. Hook reserved for future preferences.
  }, []);

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Link to="/" className="text-sm text-gray-400 hover:text-white">← Home</Link>
        <h1 className="text-2xl font-bold mt-4 mb-6">YouTube Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-600 text-white focus:outline-none focus:border-primary-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Login'}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    );
  }

  const allStatus = status.__all;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/" className="text-sm text-gray-400 hover:text-white">← Home</Link>
          <h1 className="text-2xl font-bold mt-2">YouTube Content Refresh</h1>
          <p className="text-sm text-gray-400 mt-1">
            Force-refetch the latest videos for any category. Bypasses the 24h cache.
          </p>
        </div>
      </div>

      {/* Refresh All */}
      <div className="bg-dark-800 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Refresh trending bundle</h2>
          <p className="text-xs text-gray-400 mt-1">
            Re-warms music tabs + key categories (movies, songs, comedy, devotional, shorts, trending).
          </p>
          {allStatus?.state === 'ok' && (
            <p className="text-xs text-green-400 mt-1">✓ Refreshed at {allStatus.at}</p>
          )}
          {allStatus?.state === 'err' && (
            <p className="text-xs text-red-400 mt-1">✗ {allStatus.message}</p>
          )}
        </div>
        <button
          onClick={refreshAll}
          disabled={allStatus?.state === 'refreshing'}
          className="btn-primary disabled:opacity-50 shrink-0"
        >
          {allStatus?.state === 'refreshing' ? 'Refreshing…' : 'Refresh All'}
        </button>
      </div>

      {/* Per-category list */}
      <h2 className="text-lg font-semibold mb-3">Per-category refresh</h2>
      <div className="space-y-2">
        {categories.map((cat) => {
          const st = status[cat];
          return (
            <div
              key={cat}
              className="flex items-center justify-between gap-3 bg-dark-800/60 hover:bg-dark-800 rounded-lg px-4 py-3 border border-white/[0.04]"
            >
              <div className="min-w-0">
                <p className="font-medium capitalize">{cat}</p>
                {st?.state === 'ok' && (
                  <p className="text-xs text-green-400">
                    ✓ {st.count} videos · {st.at}
                  </p>
                )}
                {st?.state === 'err' && (
                  <p className="text-xs text-red-400 truncate">✗ {st.message}</p>
                )}
                {st?.state === 'refreshing' && (
                  <p className="text-xs text-gray-400">Refreshing…</p>
                )}
              </div>
              <button
                onClick={() => refreshOne(cat)}
                disabled={st?.state === 'refreshing'}
                className="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium disabled:opacity-50 shrink-0"
              >
                {st?.state === 'refreshing' ? '…' : 'Refresh'}
              </button>
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
    </div>
  );
}
