// GovtJobsPage — dedicated page listing all govt jobs
// /jobs route

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import GOVT_JOBS from '../data/govtJobs';

function daysUntil(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso + 'T00:00:00') - today) / 86400000);
}

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const CATEGORIES = [
  { id: 'all', label: 'सभी', emoji: '📋' },
  { id: 'state', label: 'राज्य', emoji: '🏛️' },
  { id: 'central', label: 'केंद्र', emoji: '🇮🇳' },
  { id: 'police', label: 'पुलिस', emoji: '👮' },
  { id: 'defence', label: 'रक्षा', emoji: '🎖️' },
  { id: 'teaching', label: 'शिक्षा', emoji: '📚' },
  { id: 'psu', label: 'PSU', emoji: '🏭' },
];

function JobCard({ job, isHighlighted }) {
  const daysLeft = daysUntil(job.lastDate);
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const isExpired = daysLeft < 0;

  const categoryColors = {
    state: 'border-blue-500/50 bg-blue-900/20',
    central: 'border-orange-500/50 bg-orange-900/20',
    psu: 'border-teal-500/50 bg-teal-900/20',
    defence: 'border-green-500/50 bg-green-900/20',
    police: 'border-slate-500/50 bg-slate-800/30',
    teaching: 'border-purple-500/50 bg-purple-900/20',
  };

  const categoryLabels = {
    state: 'राज्य सरकार',
    central: 'केंद्र सरकार',
    psu: 'PSU',
    defence: 'रक्षा',
    police: 'पुलिस',
    teaching: 'शिक्षा',
  };

  return (
    <div
      id={job.id}
      className={`relative rounded-xl border ${
        categoryColors[job.category] || 'border-white/20 bg-white/5'
      } ${isHighlighted ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0a1228]' : ''} p-5 hover:bg-white/10 transition-colors`}
    >
      {/* Urgent/Expired badge */}
      {isUrgent && !isExpired && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
          ⏰ {daysLeft === 0 ? 'आज' : daysLeft === 1 ? 'कल' : `${daysLeft} दिन`}
        </div>
      )}
      {isExpired && (
        <div className="absolute top-3 right-3 bg-gray-700 text-white/80 text-xs font-medium px-2 py-1 rounded-full">
          समाप्त
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{job.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/60 bg-white/10 px-2 py-0.5 rounded">
              {categoryLabels[job.category] || job.category}
            </span>
            {job.featured && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                ⭐ Featured
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-base sm:text-lg leading-snug">
            {job.titleLocal || job.title}
          </h3>
          {job.titleLocal && job.title !== job.titleLocal && (
            <p className="text-white/60 text-xs">{job.title}</p>
          )}
        </div>
      </div>

      {/* Department */}
      <p className="text-white/70 text-sm mb-3">{job.department}</p>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 mb-0.5">📍 स्थान</div>
          <div className="text-white font-medium">{job.location}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 mb-0.5">👥 पद</div>
          <div className="text-white font-medium">{job.vacancies}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 mb-0.5">💰 वेतन</div>
          <div className="text-white font-medium text-[11px]">{job.salary || 'N/A'}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 mb-0.5">📅 अंतिम तिथि</div>
          <div className={`font-medium ${isUrgent ? 'text-red-400' : isExpired ? 'text-gray-400' : 'text-white'}`}>
            {formatDate(job.lastDate)}
          </div>
        </div>
      </div>

      {/* Eligibility */}
      {job.eligibility && (
        <div className="text-xs text-white/60 mb-4">
          <span className="font-semibold text-white/80">योग्यता:</span> {job.eligibility}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] text-white/50">
          पोस्ट: {formatDate(job.postedDate)}
        </div>
        {job.link && !isExpired && (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2 rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            आवेदन करा
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function GovtJobsPage() {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          const list = data.jobs || [];
          setJobs(list.length > 0 ? list : GOVT_JOBS);
        } else {
          setJobs(GOVT_JOBS);
        }
      } catch {
        setJobs(GOVT_JOBS);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Handle hash navigation (highlight specific job)
  useEffect(() => {
    const hash = location.hash?.slice(1);
    if (hash) {
      setHighlightedId(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [location.hash, loading]);

  // Sort: upcoming first (by lastDate), then expired
  const sortedJobs = [...jobs].sort((a, b) => {
    const aDate = new Date(a.lastDate);
    const bDate = new Date(b.lastDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aExpired = aDate < today;
    const bExpired = bDate < today;
    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;
    return aDate - bDate;
  });

  const filteredJobs = filter === 'all' 
    ? sortedJobs 
    : sortedJobs.filter((j) => j.category === filter);

  // Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeJobs = jobs.filter((j) => new Date(j.lastDate) >= today);
  const totalVacancies = activeJobs.reduce((sum, j) => sum + (j.vacancies || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a1228] text-white">
      <SEO
        title="सरकारी नौकरी · Govt Jobs in Uttarakhand | PahadiTube"
        description="उत्तराखंड मा नौकरी का मौका — UKPSC, UKSSSC, Police, Forest, Teaching अर होर सरकारी भर्ती कि जानकारी।"
        path="/jobs"
        keywords="govt jobs uttarakhand, sarkari naukri, UKPSC, UKSSSC, uttarakhand police recruitment, forest ranger jobs"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="page-header mb-2 flex items-center justify-center gap-3">
            💼 <span className="gradient-text">सरकारी नौकरी</span>
            <span className="text-lg sm:text-xl font-normal text-white/60">Govt Jobs</span>
          </h1>
          <p className="text-white/60 text-sm">
            उत्तराखंड अर केंद्र सरकार कि नौकरी कु मौका · Latest Sarkari Naukri
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 mb-6 text-sm">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-amber-400">{activeJobs.length}</div>
            <div className="text-white/60 text-xs">Active Jobs</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-green-400">{totalVacancies.toLocaleString()}</div>
            <div className="text-white/60 text-xs">Total Vacancies</div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === cat.id
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Jobs list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-white/60">कोई नौकरी नी मिली इस श्रेणी मा</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                isHighlighted={highlightedId === job.id}
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-12 text-center text-xs text-white/40 border-t border-white/10 pt-6">
          <p className="mb-2">
            ⚠️ यो जानकारी सिर्फ मदद कु लिए च। आधिकारिक notification जरूर देखा।
          </p>
          <p>
            कुई नौकरी add करणी च? <a href="mailto:info@pahaditube.in" className="text-amber-400 hover:underline">संपर्क करा</a>
          </p>
        </div>
      </div>
    </div>
  );
}
