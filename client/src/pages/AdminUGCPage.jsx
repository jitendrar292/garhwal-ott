import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

const STATUS_COLORS = {
  pending:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default function AdminUGCPage() {
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');   // all | pending | approved | recipe | story
  const [expanded, setExpanded] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSubmissions = useCallback(async (adminToken) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ugc/admin/submissions', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load submissions');
      setSubmissions(data.submissions || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    await fetchSubmissions(token.trim());
  }

  async function doApprove(id) {
    setActionLoading(id + '_approve');
    try {
      const res = await fetch(`/api/ugc/admin/submissions/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Approve failed');
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'approved', approvedAt: new Date().toISOString() } : s))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  async function doDelete(id) {
    if (!window.confirm('Delete this submission? This cannot be undone.')) return;
    setActionLoading(id + '_delete');
    try {
      const res = await fetch(`/api/ugc/admin/submissions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = submissions.filter((s) => {
    if (filter === 'pending') return s.status === 'pending';
    if (filter === 'approved') return s.status === 'approved';
    if (filter === 'recipe') return s.type === 'recipe';
    if (filter === 'story') return s.type === 'story';
    return true;
  });

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    recipe: submissions.filter((s) => s.type === 'recipe').length,
    story: submissions.filter((s) => s.type === 'story').length,
  };

  return (
    <>
      <SEO title="UGC Admin — PahadiTube" description="Admin panel for reviewing community submissions." keywords="" />
      <div className="min-h-screen bg-dark-950 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">🛡️ Community Submissions Admin</h1>

          {/* Login */}
          {!authenticated && (
            <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-4">
              <p className="text-white/60 text-sm text-center">Enter your admin key to view submissions.</p>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Admin key…"
                autoComplete="current-password"
                className="w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-white/30 outline-none text-white text-sm px-3 py-2.5 placeholder:text-white/25"
              />
              {error && <p className="text-rose-400 text-xs text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !token.trim()}
                className="w-full py-2.5 rounded-full bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition-all"
              >
                {loading ? 'Checking…' : 'Login →'}
              </button>
            </form>
          )}

          {/* Submissions panel */}
          {authenticated && (
            <>
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['recipe', 'Recipes'], ['story', 'Stories']].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      filter === k
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30'
                    }`}
                  >
                    {label} ({counts[k]})
                  </button>
                ))}
                <button
                  onClick={() => fetchSubmissions(token)}
                  className="ml-auto px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 text-white/40 hover:border-white/30 transition-all"
                >
                  ↻ Refresh
                </button>
              </div>

              {error && <p className="text-rose-400 text-sm mb-4">{error}</p>}

              {loading && <p className="text-white/40 text-sm text-center py-8">Loading…</p>}

              {!loading && filtered.length === 0 && (
                <p className="text-white/25 text-sm text-center py-12">No submissions in this category.</p>
              )}

              <div className="space-y-3">
                {filtered.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
                  >
                    {/* Header row */}
                    <button
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                      className="w-full text-left px-5 py-4 flex items-start gap-3"
                    >
                      <span className="text-xl shrink-0">{s.type === 'recipe' ? '🍲' : '🏘️'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate max-w-[300px]">{s.title}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${STATUS_COLORS[s.status] || 'bg-white/10 text-white/40'}`}>
                            {s.status}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/35 border border-white/10">
                            {s.type}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">
                          {s.submitterName}{s.region ? ` · ${s.region}` : ''} · {new Date(s.submittedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <span className="text-white/25 shrink-0">{expanded === s.id ? '▲' : '▼'}</span>
                    </button>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {expanded === s.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-white/[0.07]"
                        >
                          <div className="px-5 py-5 space-y-4">
                            {/* Contact */}
                            {s.contact && (
                              <p className="text-xs text-white/50">
                                <span className="text-white/30 font-semibold">Contact: </span>
                                <a href={`mailto:${s.contact}`} className="text-primary-400 hover:underline">{s.contact}</a>
                              </p>
                            )}
                            {s.district && (
                              <p className="text-xs text-white/50"><span className="text-white/30 font-semibold">District: </span>{s.district}</p>
                            )}

                            {/* Ingredients (recipe) */}
                            {s.ingredients && (
                              <div>
                                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Ingredients</p>
                                <pre className="text-xs text-white/60 whitespace-pre-wrap font-sans leading-relaxed bg-white/[0.03] rounded-lg p-3">
                                  {s.ingredients}
                                </pre>
                              </div>
                            )}

                            {/* Content */}
                            <div>
                              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">
                                {s.type === 'recipe' ? 'Method' : 'Story'}
                              </p>
                              <div className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap bg-white/[0.03] rounded-lg p-3 max-h-60 overflow-y-auto">
                                {s.content}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                              {s.status === 'pending' && (
                                <button
                                  onClick={() => doApprove(s.id)}
                                  disabled={actionLoading === s.id + '_approve'}
                                  className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold hover:bg-green-500/30 disabled:opacity-50 transition-all"
                                >
                                  {actionLoading === s.id + '_approve' ? 'Approving…' : '✓ Approve'}
                                </button>
                              )}
                              <button
                                onClick={() => doDelete(s.id)}
                                disabled={!!actionLoading}
                                className="px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 disabled:opacity-50 transition-all"
                              >
                                {actionLoading === s.id + '_delete' ? 'Deleting…' : '✕ Delete'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
