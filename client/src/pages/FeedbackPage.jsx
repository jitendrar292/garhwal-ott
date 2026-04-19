import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg('Name and message are required.');
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit');
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
        Share Your Feedback
      </h1>
      <p className="text-gray-400 mb-8">
        We&apos;d love to hear from you! Tell us what you think about PahadiTube.
      </p>

      {status === 'success' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd" />
          </svg>
          <p className="text-green-400 font-medium">Thank you! Your feedback has been submitted.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 font-medium">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            maxLength={100}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-white
                       placeholder-gray-500 focus:outline-none focus:border-primary-500
                       focus:ring-1 focus:ring-primary-500 transition-all"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
            Email <span className="text-gray-600">(optional)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            maxLength={200}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-white
                       placeholder-gray-500 focus:outline-none focus:border-primary-500
                       focus:ring-1 focus:ring-primary-500 transition-all"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            maxLength={2000}
            rows={5}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-white
                       placeholder-gray-500 focus:outline-none focus:border-primary-500
                       focus:ring-1 focus:ring-primary-500 transition-all resize-none"
            placeholder="What do you think about PahadiTube? Any suggestions?"
          />
          <p className="text-xs text-gray-600 mt-1 text-right">{form.message.length}/2000</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                  strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit Feedback
            </>
          )}
        </button>
      </form>

      {/* Contact / Connect */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-dark-800/60 to-dark-900/60 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
          Contact Us
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          Prefer email or social? Reach out directly — we'd love to connect.
        </p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <a
            href="mailto:jitendrar292@gmail.com"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>jitendrar292@gmail.com</span>
          </a>

          <a
            href="https://www.linkedin.com/in/jitendrar-singh-rawat/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-[#0A66C2]/15 hover:border-[#0A66C2]/40 hover:text-white transition-all"
          >
            <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span>LinkedIn — Jitendrar Singh Rawat</span>
          </a>

          <a
            href="https://www.instagram.com/pahaditube.323/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-[#FA7E1E]/15 hover:to-[#D62976]/15 hover:border-[#D62976]/40 hover:text-white transition-all"
          >
            <svg className="w-4 h-4 text-[#D62976]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span>Instagram — @pahaditube.323</span>
          </a>
        </div>
      </div>
    </div>
  );
}
