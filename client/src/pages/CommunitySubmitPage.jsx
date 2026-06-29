import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

const TABS = [
  { id: 'recipe', label: 'Community Recipe', emoji: '🍲', description: 'Share a traditional pahadi dish with the community.' },
  { id: 'story', label: 'Village Story', emoji: '🏘️', description: 'Write about your village, your people, or your journey.' },
];

const REGIONS = ['Garhwal', 'Kumaon', 'Jaunsar-Bawar', 'Haridwar', 'Dehradun', 'Diaspora / Outside Uttarakhand', 'Other'];

const INITIAL_RECIPE = { title: '', region: '', district: '', ingredients: '', content: '', submitterName: '', contact: '' };
const INITIAL_STORY  = { title: '', region: '', content: '', submitterName: '', contact: '' };

function CharCount({ value, max, warn = 0.8 }) {
  const pct = value.length / max;
  return (
    <span className={`text-[10px] ${pct > warn ? 'text-amber-400' : 'text-white/25'}`}>
      {value.length}/{max}
    </span>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-xs font-semibold text-white/70">{label}</label>
        {hint && <span className="text-[10px] text-white/30">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

const inputCls = 'w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-white/30 focus:bg-white/[0.09] outline-none text-white text-sm px-3 py-2.5 placeholder:text-white/25 transition-all resize-none';

export default function CommunitySubmitPage() {
  const [tab, setTab] = useState('recipe');
  const [recipeForm, setRecipeForm] = useState(INITIAL_RECIPE);
  const [storyForm, setStoryForm] = useState(INITIAL_STORY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  const form = tab === 'recipe' ? recipeForm : storyForm;
  const setForm = tab === 'recipe' ? setRecipeForm : setStoryForm;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const next = { ...e }; delete next[field]; return next; });
  }

  function validate() {
    const errs = {};
    if (!form.title?.trim() || form.title.trim().length < 3) errs.title = 'Title is required (min 3 characters)';
    if (tab === 'recipe' && (!form.ingredients?.trim() || form.ingredients.trim().length < 5)) {
      errs.ingredients = 'Please list at least the main ingredients';
    }
    if (!form.content?.trim() || form.content.trim().length < 20) {
      errs.content = tab === 'recipe' ? 'Method is required (min 20 characters)' : 'Story is required (min 20 characters)';
    }
    if (!form.submitterName?.trim() || form.submitterName.trim().length < 2) errs.submitterName = 'Your name is required';
    if (form.contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.trim())) {
      errs.contact = 'Must be a valid email address';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    setServerError('');

    try {
      const res = await fetch('/api/ugc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: tab, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerError(err.message);
    }
  }

  function resetForm() {
    setForm(tab === 'recipe' ? INITIAL_RECIPE : INITIAL_STORY);
    setErrors({});
    setStatus('idle');
    setServerError('');
  }

  return (
    <>
      <SEO
        title="Share with the Community — PahadiTube"
        description="Submit a traditional pahadi recipe or share your village story. Community content reviewed and published on PahadiTube."
        keywords="pahadi recipe, village story, garhwali food, uttarakhand community, submit recipe"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-12">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-5xl block mb-3">🏔️</span>
            <h1 className="text-3xl font-extrabold text-white mb-2">Share with the Community</h1>
            <p className="text-white/55 text-sm max-w-md mx-auto">
              Your recipes and stories are the living archive of pahadi culture. Approved submissions appear on PahadiTube.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setErrors({}); setStatus('idle'); }}
                className={`flex-1 rounded-2xl border py-4 px-3 text-left transition-all ${
                  tab === t.id
                    ? 'border-primary-500/50 bg-primary-500/10 text-white'
                    : 'border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20'
                }`}
              >
                <span className="text-2xl block mb-1">{t.emoji}</span>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-xs opacity-70 mt-0.5 line-clamp-1">{t.description}</p>
              </button>
            ))}
          </div>

          {/* Success state */}
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center"
              >
                <span className="text-5xl block mb-4">🙏</span>
                <h2 className="text-xl font-bold text-white mb-2">Dhanyavaad! Thank you.</h2>
                <p className="text-white/60 text-sm mb-6">
                  Your {tab === 'recipe' ? 'recipe' : 'story'} has been received and will appear on PahadiTube after review — usually within 48 hours.
                </p>
                <button
                  onClick={resetForm}
                  className="px-5 py-2 rounded-full bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key={tab}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5"
                noValidate
              >
                {/* Title */}
                <Field label={tab === 'recipe' ? 'Recipe Name *' : 'Title / Headline *'} hint={<CharCount value={form.title || ''} max={120} />} error={errors.title}>
                  <input
                    type="text"
                    value={form.title || ''}
                    onChange={(e) => set('title', e.target.value)}
                    maxLength={120}
                    placeholder={tab === 'recipe' ? 'e.g. Kafali ki Sabzi, Bhatt ki Churkani' : 'e.g. The year my village became a ghost town'}
                    className={inputCls}
                  />
                </Field>

                {/* Region */}
                <Field label="Region / District">
                  <div className="flex gap-2">
                    <select
                      value={form.region || ''}
                      onChange={(e) => set('region', e.target.value)}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="">Select region…</option>
                      {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input
                      type="text"
                      value={form.district || ''}
                      onChange={(e) => set('district', e.target.value)}
                      maxLength={80}
                      placeholder="District (optional)"
                      className={`${inputCls} flex-1`}
                    />
                  </div>
                </Field>

                {/* Ingredients — recipe only */}
                {tab === 'recipe' && (
                  <Field label="Ingredients *" hint={<CharCount value={form.ingredients || ''} max={2000} />} error={errors.ingredients}>
                    <textarea
                      value={form.ingredients || ''}
                      onChange={(e) => set('ingredients', e.target.value)}
                      maxLength={2000}
                      rows={4}
                      placeholder={'List ingredients, one per line:\n• 200g gahat (horse gram)\n• 2 tbsp ghee\n• 1 tsp jakhiya …'}
                      className={inputCls}
                    />
                  </Field>
                )}

                {/* Content */}
                <Field
                  label={tab === 'recipe' ? 'Method / Recipe *' : 'Your Story *'}
                  hint={<CharCount value={form.content || ''} max={8000} />}
                  error={errors.content}
                >
                  <textarea
                    value={form.content || ''}
                    onChange={(e) => set('content', e.target.value)}
                    maxLength={8000}
                    rows={tab === 'recipe' ? 6 : 10}
                    placeholder={
                      tab === 'recipe'
                        ? 'Step-by-step method. Include cooking tips, serving suggestions, and the story behind the dish.'
                        : 'Write in Hindi, Garhwali, Kumaoni or English. Share your village memory, migration experience, or pahadi life story.'
                    }
                    className={inputCls}
                  />
                </Field>

                {/* Submitter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Your Name *" error={errors.submitterName}>
                    <input
                      type="text"
                      value={form.submitterName || ''}
                      onChange={(e) => set('submitterName', e.target.value)}
                      maxLength={80}
                      placeholder="How should we credit you?"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email (optional)" hint="for update notifications" error={errors.contact}>
                    <input
                      type="email"
                      value={form.contact || ''}
                      onChange={(e) => set('contact', e.target.value)}
                      maxLength={120}
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Server error */}
                {status === 'error' && serverError && (
                  <p className="text-sm text-rose-400 text-center">{serverError}</p>
                )}

                <p className="text-xs text-white/25 text-center leading-relaxed">
                  All submissions are reviewed before publication. We do not share your email address.
                  Content must be your own original writing.
                </p>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {status === 'loading' ? 'Sending…' : `Submit ${tab === 'recipe' ? 'Recipe' : 'Story'} →`}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
