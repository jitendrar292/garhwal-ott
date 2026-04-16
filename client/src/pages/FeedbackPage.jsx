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
    </div>
  );
}
