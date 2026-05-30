import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import SEO from '../components/SEO';
import WhatsAppShareBtn from '../components/WhatsAppShareBtn';

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
  if (score >= 85) return {
    text: 'Tu Meri Jaan Chhai! 💘',
    color: 'text-pink-400',
    icon: '💘',
    desc: 'Matlab perfect match — filmy wali love story! 🎬',
    tier: '85–96% • Top tier 🏆',
  };
  if (score >= 70) return {
    text: 'Dil se Judey Chhau! 🔥',
    color: 'text-rose-400',
    icon: '🔥',
    desc: 'Strong vibes — ek baar milao zaroor! ✨',
    tier: '70–84% • 🔥 Hot connection',
  };
  if (score >= 55) return {
    text: 'Bhalai Rista Chha ✨',
    color: 'text-orange-400',
    icon: '✨',
    desc: 'Good chemistry, thoda aur time do! 😊',
    tier: '55–69% • Warming up ☀️',
  };
  return {
    text: 'Thoda Mehnat Karrau 😄',
    color: 'text-yellow-400',
    icon: '💪',
    desc: 'Love ko time lagda hai… koshish karo! 💪',
    tier: '42–54% • Early days 🌱',
  };
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
  const [heartPulse, setHeartPulse] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const handleCompatibility = async (e) => {
    e.preventDefault();
    const score = calcCompatibility(compMyName, compGfName);
    setDisplayScore(0);
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 1200);
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

  // Count-up animation + confetti
  useEffect(() => {
    if (!compResult) return;
    setDisplayScore(0);
    const target = compResult.score;
    const steps = 40;
    const interval = 1200 / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setDisplayScore(target);
        clearInterval(timer);
        if (target >= 85) {
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.65 },
            colors: ['#f472b6', '#fb7185', '#f43f5e', '#ff69b4', '#fda4af', '#fbbf24'],
          });
        }
      } else {
        setDisplayScore(Math.round(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [compResult]);

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
          {/* Header */}
          <div className="text-center mb-5">
            <motion.span
              className="text-3xl block"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >💑</motion.span>
            <h2 className="text-lg font-bold text-white mt-1">Check Your Compatibility</h2>
            <p className="text-xs text-white/40 mt-1">Dono ke naam daalo — pyaar ka score dekho!</p>
          </div>

          <AnimatePresence mode="wait">
            {compResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="text-center"
              >
                {/* Names row */}
                <p className="text-white/70 text-sm mb-3 tracking-wide">
                  {compResult.myName}
                  <span className="text-pink-400 mx-2">❤️</span>
                  {compResult.gfName}
                </p>

                {/* Score count-up */}
                <p className="text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent mb-1 tabular-nums">
                  {displayScore}%
                </p>

                {/* Garhwali label */}
                <p className={`text-base font-bold mb-4 ${compatLabel(compResult.score).color}`}>
                  {compatLabel(compResult.score).text}
                </p>

                {/* Upgraded love meter */}
                <div className="relative w-full h-5 bg-white/10 rounded-full mb-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${compResult.score}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute top-0 left-0 h-5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400"
                  />
                  <motion.span
                    initial={{ left: '0%' }}
                    animate={{ left: `${Math.max(compResult.score - 5, 0)}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute -top-1 text-base pointer-events-none"
                    style={{ position: 'absolute' }}
                  >💗</motion.span>
                </div>
                <div className="flex justify-between text-xs text-white/25 mb-5 px-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>

                {/* Breakdown card */}
                <div className="bg-white/5 rounded-xl px-4 py-3 mb-5 text-left">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Matlab kya hai?</p>
                  <p className="text-sm text-white/85">
                    {compatLabel(compResult.score).icon} {compatLabel(compResult.score).desc}
                  </p>
                  <p className="text-xs text-white/35 mt-2">{compatLabel(compResult.score).tier}</p>
                </div>

                {/* Share + Reset */}
                <div className="flex flex-col gap-2">
                  <WhatsAppShareBtn
                    title="Check Your Compatibility 💘"
                    text={`${compResult.myName} ❤️ ${compResult.gfName} = ${compResult.score}% match! Check yours on Jhumelo by PahadiTube 🏔️`}
                    compact={false}
                    className="w-full justify-center"
                  />
                  <button
                    onClick={() => { setCompResult(null); setCompMyName(''); setCompGfName(''); setDisplayScore(0); }}
                    className="text-xs text-white/40 hover:text-white/70 underline mt-1"
                  >
                    Try another pair
                  </button>
                </div>
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
                {/* Pulsing heart between inputs */}
                <div className="flex justify-center">
                  <motion.span
                    className="text-2xl select-none"
                    animate={heartPulse
                      ? { scale: [1, 1.7, 1, 1.5, 1], rotate: [0, -12, 12, -6, 0] }
                      : { scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >❤️</motion.span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Their Name"
                  value={compGfName}
                  onChange={(e) => setCompGfName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />
                <button
                  type="submit"
                  disabled={compLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
                >
                  {compLoading ? '✨ Checking...' : '💘 Check Compatibility'}
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
