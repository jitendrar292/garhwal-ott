// JobsAdminPage — Admin interface for managing govt job postings
// /admin/jobs route

import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import FESTIVALS from '../data/festivals';
import MELAS from '../data/melas';
import EVENTS from '../data/events';

const CATEGORIES = [
  { id: 'state', label: 'राज्य सरकार' },
  { id: 'central', label: 'केंद्र सरकार' },
  { id: 'police', label: 'पुलिस' },
  { id: 'defence', label: 'रक्षा' },
  { id: 'teaching', label: 'शिक्षा' },
  { id: 'psu', label: 'PSU' },
];

const EMOJIS = ['📋', '📚', '👮', '🌲', '🏛️', '🏘️', '🏔️', '🎖️', '🏭', '💼'];

// Get upcoming happenings (festivals, melas, events)
function getUpcomingHappenings(count = 10) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const all = [
    ...FESTIVALS.map((f) => ({ type: 'Festival', name: f.name, nameLocal: f.nameLocal, date: f.date, location: f.region, description: f.description, emoji: f.emoji })),
    ...MELAS.map((m) => ({ type: 'Mela', name: m.name, nameLocal: m.nameLocal, date: m.date, location: m.region || m.location, description: m.description, emoji: m.emoji })),
    ...EVENTS.map((e) => ({ type: e.category === 'theatre' ? 'Theatre' : e.category === 'music' ? 'Music' : e.category === 'fashion' ? 'Fashion' : e.category === 'art' ? 'Art' : e.category === 'literary' ? 'Literary' : 'Event', name: e.name, nameLocal: e.nameLocal, date: e.date, location: e.location, description: e.description, emoji: e.emoji })),
  ]
    .filter((i) => new Date(i.date + 'T00:00:00').getTime() >= todayMs)
    .sort((a, b) => a.date.localeCompare(b.date));
  return all.slice(0, count);
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
  
  // Push notification state
  const [devices, setDevices] = useState(null);
  const [devicesLoading, setDevicesLoading] = useState(false);

  // Jobs Agent state
  const [agentPulling, setAgentPulling] = useState(false);
  const [agentJobs, setAgentJobs] = useState([]); // preview from pull
  const [agentEvents, setAgentEvents] = useState([]); // preview from pull
  const [selectedAgentJobs, setSelectedAgentJobs] = useState(new Set());
  const [selectedAgentEvents, setSelectedAgentEvents] = useState(new Set());
  const [agentPublishing, setAgentPublishing] = useState(false);
  const [agentMessage, setAgentMessage] = useState('');

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

  // Push notification functions
  const sendTestPush = async () => {
    if (!confirm('Send a test push notification to all subscribed devices?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/push/test?key=${encodeURIComponent(key)}`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setSuccess(`Test push sent — sent: ${data.sent ?? 0}, failed: ${data.failed ?? 0}`);
    } catch (err) {
      setError(`Test push failed: ${err.message}`);
    }
  };

  const loadDevices = async () => {
    setDevicesLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/push/list?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch devices');
      setDevices(data);
    } catch (err) {
      setError(`Failed to load devices: ${err.message}`);
    } finally {
      setDevicesLoading(false);
    }
  };

  const sendJobPush = async (job) => {
    if (!job) {
      setError('Please select a job to send notification about.');
      return;
    }
    
    const title = `${job.emoji || '💼'} ${job.title}`;
    const bodyParts = [];
    bodyParts.push(job.department);
    if (job.vacancies) bodyParts.push(`${job.vacancies} Posts`);
    if (job.lastDate) {
      const lastDateObj = new Date(job.lastDate + 'T00:00:00');
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((lastDateObj - today) / 86400000);
      if (daysLeft >= 0) bodyParts.push(`Apply by: ${job.lastDate}`);
    }
    const body = bodyParts.join(' • ');
    
    if (!confirm(`Send push notification to all devices?\n\n${title}\n${body}`)) return;
    
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/push/send?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          url: '/jobs',
          tag: `job-${job.id}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setSuccess(`Job push sent — sent: ${data.sent ?? 0}, failed: ${data.failed ?? 0}`);
    } catch (err) {
      setError(`Job push failed: ${err.message}`);
    }
  };

  const sendLatestJobPush = async () => {
    if (jobs.length === 0) {
      setError('No jobs available to send notification about.');
      return;
    }
    // Send notification about the most recently added job (first in list)
    const latestJob = jobs[0];
    await sendJobPush(latestJob);
  };

  const sendEventPush = async (event) => {
    if (!event) {
      setError('No event selected.');
      return;
    }
    const days = daysUntil(event.date);
    const when = whenLabel(days);
    const title = `${event.emoji || '🎉'} ${event.type}: ${event.name}`;
    const bodyParts = [];
    bodyParts.push(`${when} — ${event.location}`);
    if (event.description) bodyParts.push(event.description);
    const body = bodyParts.join(' • ');
    
    if (!confirm(`Send push notification to all devices?\n\n${title}\n${body}`)) return;
    
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/push/send?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          url: '/',
          tag: `event-${event.date}-${event.name}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setSuccess(`Event push sent — sent: ${data.sent ?? 0}, failed: ${data.failed ?? 0}`);
    } catch (err) {
      setError(`Event push failed: ${err.message}`);
    }
  };

  const sendNextEventPush = async (index = 0) => {
    const upcomingEvents = getUpcomingHappenings(10);
    if (upcomingEvents.length === 0) {
      setError('No upcoming events to send notification about.');
      return;
    }
    if (index >= upcomingEvents.length) {
      setError('Not enough upcoming events.');
      return;
    }
    await sendEventPush(upcomingEvents[index]);
  };

  // ── Jobs Agent functions ──
  const pullLatestJobs = async () => {
    setAgentPulling(true);
    setAgentMessage('');
    setError('');
    setAgentJobs([]);
    setSelectedAgentJobs(new Set());
    try {
      const res = await fetch(`/api/jobs-agent/pull-jobs?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to pull jobs');
      setAgentJobs(data.jobs || []);
      setAgentMessage(data.message || `Found ${data.found} jobs, ${data.new} new`);
      // Select all by default
      setSelectedAgentJobs(new Set((data.jobs || []).map((_, i) => i)));
    } catch (err) {
      setError(`Agent error: ${err.message}`);
    } finally {
      setAgentPulling(false);
    }
  };

  const publishSelectedJobs = async () => {
    if (selectedAgentJobs.size === 0) {
      setError('Select at least one job to publish');
      return;
    }
    setAgentPublishing(true);
    setError('');
    try {
      const jobsToPublish = agentJobs.filter((_, i) => selectedAgentJobs.has(i));
      const res = await fetch(`/api/jobs-agent/publish-jobs?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs: jobsToPublish }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Publish failed');
      setSuccess(`✅ ${data.published} jobs published!`);
      setAgentJobs([]);
      setSelectedAgentJobs(new Set());
      setAgentMessage('');
      fetchJobs();
    } catch (err) {
      setError(`Publish error: ${err.message}`);
    } finally {
      setAgentPublishing(false);
    }
  };

  const pullLatestEvents = async () => {
    setAgentPulling(true);
    setAgentMessage('');
    setError('');
    setAgentEvents([]);
    setSelectedAgentEvents(new Set());
    try {
      const res = await fetch(`/api/jobs-agent/pull-events?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to pull events');
      setAgentEvents(data.events || []);
      setAgentMessage(data.message || `Found ${data.found} events`);
      setSelectedAgentEvents(new Set((data.events || []).map((_, i) => i)));
    } catch (err) {
      setError(`Agent error: ${err.message}`);
    } finally {
      setAgentPulling(false);
    }
  };

  const publishSelectedEvents = async () => {
    if (selectedAgentEvents.size === 0) {
      setError('Select at least one event to publish');
      return;
    }
    setAgentPublishing(true);
    setError('');
    try {
      const eventsToPublish = agentEvents.filter((_, i) => selectedAgentEvents.has(i));
      const res = await fetch(`/api/jobs-agent/publish-events?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToPublish }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Publish failed');
      setSuccess(`✅ ${data.published} events published!`);
      setAgentEvents([]);
      setSelectedAgentEvents(new Set());
      setAgentMessage('');
    } catch (err) {
      setError(`Publish error: ${err.message}`);
    } finally {
      setAgentPublishing(false);
    }
  };

  const toggleAgentJob = (index) => {
    setSelectedAgentJobs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleAgentEvent = (index) => {
    setSelectedAgentEvents((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
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
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            💼 Jobs Admin
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={sendLatestJobPush}
              className="text-sm px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
              title="Send a push notification about the latest job posting"
            >
              💼 Notify latest job
            </button>
            <button
              onClick={() => sendNextEventPush(0)}
              className="text-sm px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25"
              title="Send a push notification about the next upcoming event"
            >
              🎉 Notify next event
            </button>
            <button
              onClick={() => sendNextEventPush(1)}
              className="text-sm px-3 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25"
              title="Send a push notification about the 2nd upcoming event"
            >
              🎪 Notify 2nd event
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
            <Link
              to="/jobs"
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              View Public Page →
            </Link>
          </div>
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

        {/* Upcoming Events Preview */}
        {(() => {
          const upcomingEvents = getUpcomingHappenings(5);
          if (upcomingEvents.length === 0) return null;
          return (
            <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
              <h2 className="text-sm font-semibold text-white mb-3">
                🎉 Upcoming Events ({upcomingEvents.length})
              </h2>
              <div className="space-y-2">
                {upcomingEvents.slice(0, 5).map((event, i) => {
                  const days = daysUntil(event.date);
                  const when = whenLabel(days);
                  return (
                    <div key={i} className="flex items-center justify-between gap-3 p-2 bg-gray-700/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{event.emoji}</span>
                          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">{event.type}</span>
                        </div>
                        <p className="text-sm text-white mt-1 truncate">{event.name}</p>
                        <p className="text-xs text-gray-400">{when} • {event.location}</p>
                      </div>
                      <button
                        onClick={() => sendEventPush(event)}
                        className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded transition whitespace-nowrap"
                      >
                        🔔 Notify
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ═══ Jobs & Events Agent ═══ */}
        <div className="mb-6 p-4 bg-gray-800 border border-emerald-500/30 rounded-lg">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            🤖 Jobs & Events Agent
            <span className="text-xs text-gray-400 font-normal">AI-powered auto-pull from govt sites</span>
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={pullLatestJobs}
              disabled={agentPulling}
              className="px-4 py-2 text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 rounded-lg transition disabled:opacity-50"
            >
              {agentPulling ? '⏳ Pulling...' : '🔍 Pull Latest Jobs'}
            </button>
            <button
              onClick={pullLatestEvents}
              disabled={agentPulling}
              className="px-4 py-2 text-sm bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 rounded-lg transition disabled:opacity-50"
            >
              {agentPulling ? '⏳ Pulling...' : '🎉 Pull Latest Events'}
            </button>
          </div>

          {agentMessage && (
            <p className="text-xs text-emerald-300 mb-3 bg-emerald-500/10 px-3 py-1.5 rounded">
              {agentMessage}
            </p>
          )}

          {/* Agent Jobs Preview */}
          {agentJobs.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white">
                  📋 Pulled Jobs ({agentJobs.length}) — select to publish
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedAgentJobs(new Set(agentJobs.map((_, i) => i)))}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setSelectedAgentJobs(new Set())}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {agentJobs.map((job, i) => (
                  <label
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
                      selectedAgentJobs.has(i) ? 'bg-emerald-500/15 border border-emerald-500/40' : 'bg-gray-700/50 border border-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAgentJobs.has(i)}
                      onChange={() => toggleAgentJob(i)}
                      className="mt-1 w-4 h-4 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{job.emoji || '📋'} {job.title}</p>
                      <p className="text-xs text-gray-400">{job.department} • {job.location}</p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                        {job.vacancies > 0 && <span>👥 {job.vacancies} posts</span>}
                        <span>📅 Deadline: {job.lastDate}</span>
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={publishSelectedJobs}
                disabled={agentPublishing || selectedAgentJobs.size === 0}
                className="mt-3 px-5 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-lg transition"
              >
                {agentPublishing ? '⏳ Publishing...' : `✅ Publish ${selectedAgentJobs.size} Selected Jobs`}
              </button>
            </div>
          )}

          {/* Agent Events Preview */}
          {agentEvents.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white">
                  🎉 Pulled Events ({agentEvents.length}) — select to publish
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedAgentEvents(new Set(agentEvents.map((_, i) => i)))}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setSelectedAgentEvents(new Set())}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {agentEvents.map((event, i) => (
                  <label
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
                      selectedAgentEvents.has(i) ? 'bg-purple-500/15 border border-purple-500/40' : 'bg-gray-700/50 border border-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAgentEvents.has(i)}
                      onChange={() => toggleAgentEvent(i)}
                      className="mt-1 w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{event.emoji || '🎉'} {event.name}</p>
                      <p className="text-xs text-gray-400">{event.date} • {event.location}</p>
                      {event.description && <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>}
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={publishSelectedEvents}
                disabled={agentPublishing || selectedAgentEvents.size === 0}
                className="mt-3 px-5 py-2 text-sm bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold rounded-lg transition"
              >
                {agentPublishing ? '⏳ Publishing...' : `✅ Publish ${selectedAgentEvents.size} Selected Events`}
              </button>
            </div>
          )}
        </div>

        {/* Push Notification Devices */}
        {devices && (
          <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
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
                  <thead className="text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="text-left py-2 pr-4">Endpoint (last 40 chars)</th>
                      <th className="text-left py-2 pr-4">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {devices.subscriptions?.map((sub, i) => (
                      <tr key={i} className="border-b border-gray-700/50">
                        <td className="py-2 pr-4 font-mono text-xs truncate max-w-xs">
                          ...{sub.endpoint.slice(-40)}
                        </td>
                        <td className="py-2 text-gray-400">
                          {new Date(sub.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                        onClick={() => sendJobPush(job)}
                        className="px-3 py-1 text-sm bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded transition"
                        title="Send push notification about this job"
                      >
                        🔔 Notify
                      </button>
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
