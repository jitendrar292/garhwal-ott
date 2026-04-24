// GovtJobsRow — displays recent govt job postings on homepage
// Fetches from /api/jobs if available, falls back to local data

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GOVT_JOBS from '../data/govtJobs';

function daysUntil(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso + 'T00:00:00') - today) / 86400000);
}

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function JobCard({ job }) {
  const daysLeft = daysUntil(job.lastDate);
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const isExpired = daysLeft < 0;

  const categoryColors = {
    state: 'from-blue-600 to-indigo-700',
    central: 'from-orange-500 to-red-600',
    psu: 'from-teal-500 to-cyan-600',
    defence: 'from-green-600 to-emerald-700',
    police: 'from-slate-600 to-gray-700',
    teaching: 'from-purple-600 to-violet-700',
  };

  const categoryLabels = {
    state: 'राज्य',
    central: 'केंद्र',
    psu: 'PSU',
    defence: 'रक्षा',
    police: 'पुलिस',
    teaching: 'शिक्षा',
  };

  return (
    <div
      className={`relative flex-shrink-0 w-72 sm:w-80 rounded-xl overflow-hidden bg-gradient-to-br ${
        categoryColors[job.category] || 'from-gray-600 to-slate-700'
      } shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
    >
      {/* Urgent badge */}
      {isUrgent && !isExpired && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
          ⏰ {daysLeft} दिन बाकी
        </div>
      )}
      {isExpired && (
        <div className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          समाप्त
        </div>
      )}

      <div className="p-4">
        {/* Category + Emoji */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{job.emoji}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80 bg-white/20 px-2 py-0.5 rounded">
            {categoryLabels[job.category] || job.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm leading-snug mb-1 line-clamp-2">
          {job.titleLocal || job.title}
        </h3>
        <p className="text-white/70 text-xs mb-2 line-clamp-1">{job.department}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] text-white/80 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {job.vacancies} पद
          </span>
        </div>

        {/* Last date */}
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-white/70">
            अंतिम तिथि: <span className="font-semibold text-white">{formatDate(job.lastDate)}</span>
          </div>
          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] font-semibold text-white bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
            >
              आवेदन →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GovtJobsRow() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        } else {
          // Fallback to local data
          setJobs(GOVT_JOBS);
        }
      } catch {
        // Fallback to local data
        setJobs(GOVT_JOBS);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Filter to show only featured jobs with valid last date (not expired > 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  const displayJobs = jobs
    .filter((j) => {
      const lastDateMs = new Date(j.lastDate + 'T00:00:00').getTime();
      // Show if not expired more than 3 days
      return lastDateMs >= todayMs - 3 * 86400000;
    })
    .sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate))
    .slice(0, 8);

  if (loading) {
    return (
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            💼 सरकारी नौकरी · Govt Jobs
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 h-40 rounded-xl bg-white/10 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (displayJobs.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          💼 सरकारी नौकरी · Govt Jobs
        </h2>
        <Link
          to="/jobs"
          className="text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          सब देखा →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {displayJobs.map((job) => (
          <Link key={job.id} to={`/jobs#${job.id}`}>
            <JobCard job={job} />
          </Link>
        ))}
      </div>
    </section>
  );
}
