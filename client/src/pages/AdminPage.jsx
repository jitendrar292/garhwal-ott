import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'overview', label: 'Overview', emoji: '📊' },
  { id: 'users', label: 'Users', emoji: '👥' },
  { id: 'youtube', label: 'YouTube', emoji: '📺' },
  { id: 'feedback', label: 'Feedback', emoji: '💬' },
  { id: 'news', label: 'News', emoji: '📰' },
];

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Overview stats
  const [stats, setStats] = useState(null);

  // Users
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  // YouTube
  const [categories, setCategories] = useState([]);
  const [ytStatus, setYtStatus] = useState({});

  // Feedback
  const [feedback, setFeedback] = useState([]);

  // Persist key in session
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_key');
    if (saved) {
      setKey(saved);
      handleAuth(saved);
    }
  }, []);

  const handleAuth = async (adminKey) => {
    setLoading(true);
    setError('');
    try {
      // Test auth with YouTube admin endpoint
      const res = await fetch(`/api/youtube/admin/categories?key=${encodeURIComponent(adminKey)}`);
      if (res.status === 401) throw new Error('Invalid admin key');
      if (!res.ok) throw new Error('Auth failed');
      
      sessionStorage.setItem('admin_key', adminKey);
      setAuthenticated(true);
      
      // Load initial data
      loadOverview(adminKey);
      loadCategories(adminKey);
    } catch (err) {
      setError(err.message);
      sessionStorage.removeItem('admin_key');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (key.trim()) handleAuth(key.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_key');
    setAuthenticated(false);
    setKey('');
    setStats(null);
    setUsers([]);
    setCategories([]);
    setFeedback([]);
  };

  // =====================================================================
  // Overview
  // =====================================================================
  const loadOverview = async (adminKey) => {
    try {
      const [visitsRes, authRes] = await Promise.all([
        fetch('/api/visits'),
        fetch(`/api/auth/admin/stats?key=${encodeURIComponent(adminKey)}`),
      ]);
      const visits = await visitsRes.json();
      const auth = authRes.ok ? await authRes.json() : { totalSignups: 0 };
      
      setStats({
        visits: visits.count || 0,
        opens: visits.opens || 0,
        signups: auth.totalSignups || 0,
        storageType: auth.storageType || 'memory',
      });
    } catch (err) {
      console.error('Failed to load overview:', err);
    }
  };

  // =====================================================================
  // Users
  // =====================================================================
  const loadUsers = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/admin/users?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data.users || []);
      setUserCount(data.count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  // =====================================================================
  // YouTube
  // =====================================================================
  const loadCategories = async (adminKey) => {
    try {
      const res = await fetch(`/api/youtube/admin/categories?key=${encodeURIComponent(adminKey)}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const refreshYouTube = async (category) => {
    setYtStatus((s) => ({ ...s, [category]: { state: 'refreshing' } }));
    try {
      const res = await fetch(
        `/api/youtube/admin/refresh?key=${encodeURIComponent(key)}&category=${encodeURIComponent(category)}`,
        { method: 'POST' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setYtStatus((s) => ({
        ...s,
        [category]: { state: 'ok', count: data.count, at: new Date().toLocaleTimeString() },
      }));
    } catch (err) {
      setYtStatus((s) => ({ ...s, [category]: { state: 'err', message: err.message } }));
    }
  };

  const refreshAllYouTube = async () => {
    setYtStatus((s) => ({ ...s, __all: { state: 'refreshing' } }));
    try {
      const res = await fetch(
        `/api/youtube/admin/refresh?key=${encodeURIComponent(key)}&category=all`,
        { method: 'POST' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setYtStatus((s) => ({ ...s, __all: { state: 'ok', at: new Date().toLocaleTimeString() } }));
    } catch (err) {
      setYtStatus((s) => ({ ...s, __all: { state: 'err', message: err.message } }));
    }
  };

  // =====================================================================
  // Feedback
  // =====================================================================
  const loadFeedback = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/feedback?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('Failed to load feedback');
      const data = await res.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const deleteFeedback = async (id) => {
    try {
      const res = await fetch(`/api/feedback/${id}?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (!authenticated) return;
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'feedback') loadFeedback();
    if (activeTab === 'overview') loadOverview(key);
  }, [activeTab, authenticated, key, loadUsers, loadFeedback]);

  // =====================================================================
  // Render
  // =====================================================================

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Link to="/" className="text-sm text-gray-400 hover:text-white mb-4 inline-block">← Home</Link>
          
          <div className="bg-dark-800 rounded-2xl p-8 border border-white/5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Enter admin key to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Admin key"
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Verifying...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/" className="text-sm text-gray-400 hover:text-white">← Home</Link>
          <h1 className="text-2xl font-bold mt-2">Admin Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scroll-row">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500/15 text-primary-300 ring-1 ring-primary-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-300 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-dark-800/50 rounded-2xl border border-white/5 p-6">
        {activeTab === 'overview' && <OverviewTab stats={stats} loading={loading} />}
        {activeTab === 'users' && <UsersTab users={users} count={userCount} loading={loading} onRefresh={loadUsers} />}
        {activeTab === 'youtube' && (
          <YouTubeTab
            categories={categories}
            status={ytStatus}
            onRefresh={refreshYouTube}
            onRefreshAll={refreshAllYouTube}
          />
        )}
        {activeTab === 'feedback' && (
          <FeedbackTab feedback={feedback} loading={loading} onDelete={deleteFeedback} onRefresh={loadFeedback} />
        )}
        {activeTab === 'news' && <NewsTab adminKey={key} />}
      </div>
    </div>
  );
}

// =====================================================================
// Tab Components
// =====================================================================

function OverviewTab({ stats, loading }) {
  if (loading || !stats) {
    return <div className="text-center py-8 text-gray-400">Loading stats...</div>;
  }

  const cards = [
    { label: 'Total Visits', value: stats.visits.toLocaleString(), emoji: '👀', color: 'blue' },
    { label: 'Page Opens', value: stats.opens.toLocaleString(), emoji: '📱', color: 'green' },
    { label: 'Signups', value: stats.signups.toLocaleString(), emoji: '👥', color: 'purple' },
    { label: 'Storage', value: stats.storageType, emoji: '💾', color: 'amber' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Site Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-dark-700/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <span>{card.emoji}</span>
              {card.label}
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ users, count, loading, onRefresh }) {
  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading users...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Registered Users ({count})</h2>
        <button onClick={onRefresh} className="text-sm text-primary-400 hover:text-primary-300">
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No users registered yet</p>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
              {user.picture ? (
                <img src={user.picture} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-300 font-medium">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YouTubeTab({ categories, status, onRefresh, onRefreshAll }) {
  const allStatus = status.__all;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">YouTube Content Refresh</h2>
      
      {/* Refresh All */}
      <div className="bg-dark-700/50 rounded-xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="font-medium">Refresh All Categories</p>
          <p className="text-xs text-gray-400 mt-1">
            Re-warms music tabs + key categories
          </p>
          {allStatus?.state === 'ok' && (
            <p className="text-xs text-green-400 mt-1">✓ Done at {allStatus.at}</p>
          )}
          {allStatus?.state === 'err' && (
            <p className="text-xs text-red-400 mt-1">✗ {allStatus.message}</p>
          )}
        </div>
        <button
          onClick={onRefreshAll}
          disabled={allStatus?.state === 'refreshing'}
          className="btn-primary disabled:opacity-50"
        >
          {allStatus?.state === 'refreshing' ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>

      {/* Per-category */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const st = status[cat];
          return (
            <div key={cat} className="flex items-center justify-between gap-3 p-3 bg-dark-700/30 rounded-lg">
              <div>
                <p className="font-medium capitalize">{cat}</p>
                {st?.state === 'ok' && (
                  <p className="text-xs text-green-400">✓ {st.count} videos · {st.at}</p>
                )}
                {st?.state === 'err' && (
                  <p className="text-xs text-red-400">✗ {st.message}</p>
                )}
                {st?.state === 'refreshing' && (
                  <p className="text-xs text-gray-400">Refreshing...</p>
                )}
              </div>
              <button
                onClick={() => onRefresh(cat)}
                disabled={st?.state === 'refreshing'}
                className="px-3 py-1.5 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-sm font-medium disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeedbackTab({ feedback, loading, onDelete, onRefresh }) {
  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading feedback...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Feedback ({feedback.length})</h2>
        <button onClick={onRefresh} className="text-sm text-primary-400 hover:text-primary-300">
          Refresh
        </button>
      </div>

      {feedback.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No feedback yet</p>
      ) : (
        <div className="space-y-3">
          {feedback.map((f) => (
            <div key={f.id} className="p-4 bg-dark-700/50 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{f.name}</span>
                    {f.email && <span className="text-xs text-gray-500">{f.email}</span>}
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{f.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(f.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(f.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsTab({ adminKey }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">News Management</h2>
      <p className="text-gray-400 mb-4">
        For full news management features (create, edit, delete articles), use the dedicated news admin page.
      </p>
      <Link
        to="/news/admin"
        className="inline-flex items-center gap-2 btn-primary"
      >
        Open News Admin
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </Link>
    </div>
  );
}
