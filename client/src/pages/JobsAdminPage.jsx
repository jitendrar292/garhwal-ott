// JobsAdminPage — Admin interface for managing govt job postings
// /admin/jobs route

import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'state', label: 'राज्य सरकार' },
  { id: 'central', label: 'केंद्र सरकार' },
  { id: 'police', label: 'पुलिस' },
  { id: 'defence', label: 'रक्षा' },
  { id: 'teaching', label: 'शिक्षा' },
  { id: 'psu', label: 'PSU' },
];

const EMOJIS = ['📋', '📚', '👮', '🌲', '🏛️', '🏘️', '🏔️', '🎖️', '🏭', '💼'];

export default function JobsAdminPage() {
  const [key, setKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [titleLocal, setTitleLocal] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('Uttarakhand');
  const [vacancies, setVacancies] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [salary, setSalary] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [category, setCategory] = useState('state');
  const [link, setLink] = useState('');
  const [emoji, setEmoji] = useState('📋');
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/jobs?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setJobs(data.jobs || []);
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
      fetchJobs();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setTitleLocal('');
    setDepartment('');
    setLocation('Uttarakhand');
    setVacancies('');
    setLastDate('');
    setSalary('');
    setEligibility('');
    setCategory('state');
    setLink('');
    setEmoji('📋');
    setFeatured(false);
  };

  const handleEdit = (job) => {
    setEditingId(job.id);
    setTitle(job.title || '');
    setTitleLocal(job.titleLocal || '');
    setDepartment(job.department || '');
    setLocation(job.location || 'Uttarakhand');
    setVacancies(String(job.vacancies || ''));
    setLastDate(job.lastDate || '');
    setSalary(job.salary || '');
    setEligibility(job.eligibility || '');
    setCategory(job.category || 'state');
    setLink(job.link || '');
    setEmoji(job.emoji || '📋');
    setFeatured(job.featured || false);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !department.trim() || !lastDate) {
      setError('Title, Department, and Last Date are required');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      title: title.trim(),
      titleLocal: titleLocal.trim(),
      department: department.trim(),
      location: location.trim(),
      vacancies: parseInt(vacancies) || 0,
      lastDate,
      salary: salary.trim(),
      eligibility: eligibility.trim(),
      category,
      link: link.trim(),
      emoji,
      featured,
    };

    try {
      const url = editingId
        ? `/api/jobs/${editingId}?key=${encodeURIComponent(key)}`
        : `/api/jobs?key=${encodeURIComponent(key)}`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      setSuccess(editingId ? 'Job updated!' : 'Job created!');
      resetForm();
      fetchJobs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setSuccess('Job deleted');
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl max-w-sm w-full">
          <h1 className="text-xl font-bold text-white mb-4 text-center">
            💼 Jobs Admin
          </h1>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            💼 Jobs Admin
          </h1>
          <Link
            to="/jobs"
            className="text-sm text-amber-400 hover:text-amber-300"
          >
            View Public Page →
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-xl p-5 mb-8 border border-gray-700"
        >
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? '✏️ Edit Job' : '➕ Add New Job'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title (English)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="UKPSC RO/ARO Recruitment 2026"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title (Hindi/Garhwali)</label>
              <input
                type="text"
                value={titleLocal}
                onChange={(e) => setTitleLocal(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="उत्तराखंड लोक सेवा आयोग भर्ती"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Uttarakhand Public Service Commission"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Vacancies</label>
              <input
                type="number"
                value={vacancies}
                onChange={(e) => setVacancies(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Date</label>
              <input
                type="date"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Salary</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="₹44,900 - ₹1,42,400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Official Link</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://psc.uk.gov.in"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Eligibility</label>
            <textarea
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Graduate from recognized university, Age 21-42 years"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Emoji</label>
              <div className="flex gap-1">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`w-8 h-8 text-lg rounded ${
                      emoji === e ? 'bg-amber-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-300">Featured on Homepage</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-lg transition"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Job' : 'Add Job'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Jobs list */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold">📋 All Jobs ({jobs.length})</h2>
            <button
              onClick={fetchJobs}
              disabled={loading}
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              {loading ? 'Loading...' : '🔄 Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No jobs yet</div>
          ) : (
            <div className="divide-y divide-gray-700">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-gray-700/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{job.emoji}</span>
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">{job.category}</span>
                        {job.featured && (
                          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Featured</span>
                        )}
                      </div>
                      <h3 className="font-medium text-white truncate">{job.title}</h3>
                      <p className="text-sm text-gray-400">{job.department}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                        <span>📍 {job.location}</span>
                        <span>👥 {job.vacancies} posts</span>
                        <span>📅 Last: {job.lastDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="px-3 py-1 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
