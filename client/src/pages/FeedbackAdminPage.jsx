import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function FeedbackAdminPage() {
  const [key, setKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFeedback = useCallback(async (adminKey) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/feedback?key=${encodeURIComponent(adminKey)}`);
      if (res.status === 401) {
        setError('Invalid admin key');
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFeedback(data.feedback || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (key.trim()) {
      fetchFeedback(key.trim());
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/feedback/${id}?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setError('Failed to delete feedback');
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!authenticated || !key) return;
    const timer = setInterval(() => fetchFeedback(key), 30000);
    return () => clearInterval(timer);
  }, [authenticated, key, fetchFeedback]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
        Feedback Dashboard
      </h1>

      {!authenticated ? (
        <div className="max-w-md mx-auto">
          <div className="bg-dark-700 rounded-2xl p-8 border border-dark-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Admin Access</h2>
              <p className="text-gray-400 text-sm mt-1">Enter admin key to view feedback</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Admin key"
                className="w-full bg-dark-800 border border-dark-500 rounded-xl px-4 py-3 text-white
                           placeholder-gray-500 focus:outline-none focus:border-primary-500
                           focus:ring-1 focus:ring-primary-500 transition-all"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading ? 'Verifying...' : 'View Feedback'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              <span className="text-white font-bold text-xl">{feedback.length}</span> feedback{feedback.length !== 1 ? 's' : ''} received
            </p>
            <button
              onClick={() => fetchFeedback(key)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {feedback.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No feedback yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...feedback].reverse().map((item) => (
                <div
                  key={item.id}
                  className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-500/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-primary-400 font-bold text-sm">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{item.name}</p>
                          {item.email && (
                            <p className="text-xs text-gray-500">{item.email}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {item.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-3">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      title="Delete feedback"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
