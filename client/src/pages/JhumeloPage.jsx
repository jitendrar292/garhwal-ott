import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

// Deterministic compatibility score — same names always give same result
function calcCompatibility(a, b) {
  const str = (a + b).toLowerCase().replace(/\s/g, '');
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  return 42 + (h % 55); // range 42–96
}

function compatLabel(score) {
  if (score >= 85) return { text: 'Soulmates! 💘', color: 'text-pink-400' };
  if (score >= 70) return { text: 'Strong vibes! 🔥', color: 'text-rose-400' };
  if (score >= 55) return { text: 'Good chemistry ✨', color: 'text-orange-400' };
  return { text: 'Thoda aur koshish karo 😄', color: 'text-yellow-400' };
}

const VIBES = [
  { icon: '💬', text: 'flirting' },
  { icon: '🤝', text: 'friendship' },
  { icon: '🎬', text: 'creators' },
  { icon: '🪷', text: 'culture' },
  { icon: '🎶', text: 'music' },
  { icon: '🌄', text: 'nostalgia' },
  { icon: '🏔️', text: 'mountain identity' },
];

export default function JhumeloPage() {
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Compatibility checker
  const [compMyName, setCompMyName] = useState('');
  const [compGfName, setCompGfName] = useState('');
  const [compResult, setCompResult] = useState(null);
  const [compLoading, setCompLoading] = useState(false);

  const handleCompatibility = async (e) => {
    e.preventDefault();
    const score = calcCompatibility(compMyName, compGfName);
    setCompResult({ score, myName: compMyName, gfName: compGfName });
    // store in backend (fire-and-forget)
    setCompLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || '';
      await fetch(`${base}/api/byo/compatibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myName: compMyName, gfName: compGfName, score }),
      });
    } catch { /* silent */ }
    setCompLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const base = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${base}/api/byo/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, instagram, gender, region }),
      });
      const data = await res.json();
      if (res.ok || data.alreadyExists) {
        setSubmitted(true);
      } else {
        setError(data.error || 'कुछ गलत हो गया');
      }
    } catch {
      setError('Network error — कृपया फिर कोशिश करें');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Jhumelo ❤️ — Find Your Pahadi Tribe | PahadiTube"
        description="Not matrimony. Not dating. Find your pahadi internet tribe — flirting, friendship, creators, culture, music, nostalgia & mountain identity. Coming soon on PahadiTube."
        keywords="jhumelo, pahadi vibe, garhwali connections, kumaoni people, uttarakhand social, pahadi community, pahadi tribe"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-16 flex flex-col items-center justify-center">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent mb-6">
            Jhumelo ❤️
          </h1>

          <p className="text-2xl sm:text-3xl text-white font-semibold mb-4">
            Find your pahadi internet tribe.
          </p>
          <div className="space-y-2 mb-10">
            <p className="text-lg text-white/70">Not matrimony.</p>
            <p className="text-lg text-white/70">Not dating.</p>
            <p className="text-xl text-white font-semibold">Just pahadi vibes.</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-10"
          >
            <p className="text-white/80 text-lg mb-6 font-medium">A space for:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VIBES.map((v, i) => (
                <motion.div
                  key={v.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4"
                >
                  <span className="text-2xl">{v.icon}</span>
                  <span className="text-white/90 text-lg">{v.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-block bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-full px-8 py-4 mb-10"
          >
            <p className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Coming soon on PahadiTube.
            </p>
          </motion.div>

          {/* Early Access Registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="w-full max-w-sm mx-auto bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            {submitted ? (
              <div className="text-center py-4">
                <span className="text-3xl block mb-2">✨</span>
                <h3 className="text-lg font-bold text-green-400">You're on the list!</h3>
                <p className="text-white/60 text-sm mt-2">We'll DM you when Jhumelo launches 🏔️</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white text-center mb-1">Get Early Access</h2>
                <p className="text-sm text-white/50 text-center mb-4">Tell us about yourself — we'll notify you first</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />
                  <input
                    type="text"
                    required
                    placeholder="@your_instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 appearance-none"
                  >
                    <option value="" className="bg-dark-900">Gender</option>
                    <option value="Male" className="bg-dark-900">Male</option>
                    <option value="Female" className="bg-dark-900">Female</option>
                    <option value="Other" className="bg-dark-900">Other</option>
                  </select>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 appearance-none"
                  >
                    <option value="" className="bg-dark-900">Region</option>
                    <option value="Garhwal" className="bg-dark-900">Garhwal</option>
                    <option value="Kumaon" className="bg-dark-900">Kumaon</option>
                    <option value="Jaunsar" className="bg-dark-900">Jaunsar</option>
                    <option value="Other" className="bg-dark-900">Other</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Joining...' : 'Join Waitlist 🚀'}
                  </button>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Compatibility Checker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-sm mx-auto mt-8 bg-white/5 border border-pink-500/20 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white text-center mb-1">💑 Check Your Compatibility</h2>
          <p className="text-xs text-white/40 text-center mb-5">Enter your names to see your vibe score</p>

          <AnimatePresence mode="wait">
            {compResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-white/70 text-sm mb-1">{compResult.myName} ❤️ {compResult.gfName}</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                  {compResult.score}%
                </p>
                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-3 mb-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${compResult.score}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
                  />
                </div>
                <p className={`text-base font-semibold mb-4 ${compatLabel(compResult.score).color}`}>
                  {compatLabel(compResult.score).text}
                </p>
                <button
                  onClick={() => { setCompResult(null); setCompMyName(''); setCompGfName(''); }}
                  className="text-xs text-white/40 hover:text-white/70 underline"
                >
                  Try another pair
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleCompatibility}
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={compMyName}
                  onChange={(e) => setCompMyName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />
                <div className="text-center text-pink-400 text-xl">❤️</div>
                <input
                  type="text"
                  required
                  placeholder="Her Name"
                  value={compGfName}
                  onChange={(e) => setCompGfName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />
                <button
                  type="submit"
                  disabled={compLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {compLoading ? 'Checking...' : 'Check Compatibility 💘'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/30 mt-14 max-w-md mx-auto">
          Jhumelo by PahadiTube — connecting pahadi people through vibes, not bios.
        </p>
      </div>
    </>
  );
}
