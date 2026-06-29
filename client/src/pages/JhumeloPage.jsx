import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import SEO from '../components/SEO';
import WhatsAppShareBtn from '../components/WhatsAppShareBtn';

// Deterministic string hash
function hashStr(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  return h;
}

// Multi-dimension compatibility — deterministic, same inputs → same scores
function calcCompatibility({ myName, gfName, myRegion = '', gfRegion = '', myBirthdate = '', gfBirthdate = '', favSong = '', favFood = '' }) {
  const base = (myName + gfName).toLowerCase().replace(/\s/g, '');
  const culture = 60 + (hashStr(base + (myRegion + gfRegion).toLowerCase()) % 38);
  const humor   = 55 + (hashStr(base + 'humor') % 43);
  const music   = 58 + (hashStr(base + favSong.toLowerCase().replace(/\s/g, '') + favFood.toLowerCase().replace(/\s/g, '')) % 40);
  const travel  = 56 + (hashStr(base + (myBirthdate + gfBirthdate).replace(/-/g, '')) % 42);
  const overall = Math.round((culture + humor + music + travel) / 4);
  return { culture, humor, music, travel, overall };
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
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [nativeVillage, setNativeVillage] = useState('');
  const [occupation, setOccupation] = useState('');
  const [interests, setInterests] = useState([]);
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [purpose, setPurpose] = useState('');
  const [favSong, setFavSong] = useState('');
  const [favDish, setFavDish] = useState('');
  const [funFact, setFunFact] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (item) =>
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );

  // Compatibility checker
  const [compMyName, setCompMyName] = useState('');
  const [compGfName, setCompGfName] = useState('');
  const [compMyRegion, setCompMyRegion] = useState('');
  const [compGfRegion, setCompGfRegion] = useState('');
  const [compMyBirthdate, setCompMyBirthdate] = useState('');
  const [compGfBirthdate, setCompGfBirthdate] = useState('');
  const [compFavSong, setCompFavSong] = useState('');
  const [compFavFood, setCompFavFood] = useState('');
  const [compResult, setCompResult] = useState(null);
  const [compLoading, setCompLoading] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const [displayScores, setDisplayScores] = useState({ culture: 0, humor: 0, music: 0, travel: 0, overall: 0 });

  const handleCompatibility = async (e) => {
    e.preventDefault();
    const scores = calcCompatibility({
      myName: compMyName, gfName: compGfName,
      myRegion: compMyRegion, gfRegion: compGfRegion,
      myBirthdate: compMyBirthdate, gfBirthdate: compGfBirthdate,
      favSong: compFavSong, favFood: compFavFood,
    });
    setDisplayScores({ culture: 0, humor: 0, music: 0, travel: 0, overall: 0 });
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 1200);
    setCompResult({ ...scores, myName: compMyName, gfName: compGfName });
    // store in backend (fire-and-forget)
    setCompLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || '';
      await fetch(`${base}/api/byo/compatibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myName: compMyName, gfName: compGfName, score: scores.overall }),
      });
    } catch { /* silent */ }
    setCompLoading(false);
  };

  // Count-up animation + confetti
  useEffect(() => {
    if (!compResult) return;
    setDisplayScores({ culture: 0, humor: 0, music: 0, travel: 0, overall: 0 });
    const targets = {
      culture: compResult.culture,
      humor:   compResult.humor,
      music:   compResult.music,
      travel:  compResult.travel,
      overall: compResult.overall,
    };
    const steps = 40;
    const interval = 1200 / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      setDisplayScores({
        culture: Math.round(targets.culture * progress),
        humor:   Math.round(targets.humor   * progress),
        music:   Math.round(targets.music   * progress),
        travel:  Math.round(targets.travel  * progress),
        overall: Math.round(targets.overall * progress),
      });
      if (step >= steps) {
        setDisplayScores(targets);
        clearInterval(timer);
        if (targets.overall >= 85) {
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.65 },
            colors: ['#f472b6', '#fb7185', '#f43f5e', '#ff69b4', '#fda4af', '#fbbf24'],
          });
        }
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
        body: JSON.stringify({
            name, instagram, age, region, currentCity, nativeVillage,
            occupation, interests, relationshipStatus, purpose,
            favSong, favDish, funFact,
          }),
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
                <p className="text-sm text-white/50 text-center mb-4">Tell us about yourself — we'll match you better</p>
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Name */}
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />

                  {/* Instagram */}
                  <input
                    type="text"
                    required
                    placeholder="@your_instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />

                  {/* Age */}
                  <input
                    type="number"
                    min="16"
                    max="99"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />

                  {/* Region */}
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 appearance-none"
                  >
                    <option value="" className="bg-dark-900">Region</option>
                    <option value="Garhwal" className="bg-dark-900">Garhwal</option>
                    <option value="Kumaon" className="bg-dark-900">Kumaon</option>
                    <option value="Jaunsar" className="bg-dark-900">Jaunsar</option>
                    <option value="Himachal" className="bg-dark-900">Himachal</option>
                    <option value="Nepal" className="bg-dark-900">Nepal</option>
                    <option value="Other" className="bg-dark-900">Other</option>
                  </select>

                  {/* Current City */}
                  <input
                    type="text"
                    placeholder="Current City"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />

                  {/* Native Village */}
                  <input
                    type="text"
                    placeholder="Native Village"
                    value={nativeVillage}
                    onChange={(e) => setNativeVillage(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />

                  {/* Occupation */}
                  <input
                    type="text"
                    placeholder="Occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />

                  {/* Interests */}
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Interests</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Trekking','Folk Music','Content Creation','Photography','Travel','Business','Coding','Books','Food'].map((item) => (
                        <label
                          key={item}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm
                            ${ interests.includes(item)
                              ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                              : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30' }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={interests.includes(item)}
                            onChange={() => toggleInterest(item)}
                          />
                          <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            interests.includes(item) ? 'bg-pink-500 border-pink-500' : 'border-white/30'
                          }`}>
                            {interests.includes(item) && <span className="text-white text-xs leading-none">✓</span>}
                          </span>
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Relationship Status */}
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Relationship Status <span className="normal-case font-normal">(optional)</span></p>
                    <select
                      value={relationshipStatus}
                      onChange={(e) => setRelationshipStatus(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 appearance-none"
                    >
                      <option value="" className="bg-dark-900">Prefer not to say</option>
                      <option value="Single" className="bg-dark-900">Single</option>
                      <option value="In a relationship" className="bg-dark-900">In a relationship</option>
                      <option value="Married" className="bg-dark-900">Married</option>
                    </select>
                  </div>

                  {/* What brings you here? */}
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">What brings you here?</p>
                    <div className="space-y-2">
                      {['Friends','Networking','Collaboration','Someone Special','Community'].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm
                            ${ purpose === opt
                              ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                              : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30' }`}
                        >
                          <input
                            type="radio"
                            name="purpose"
                            className="sr-only"
                            value={opt}
                            checked={purpose === opt}
                            onChange={() => setPurpose(opt)}
                          />
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            purpose === opt ? 'border-pink-500' : 'border-white/30'
                          }`}>
                            {purpose === opt && <span className="w-2 h-2 rounded-full bg-pink-500 block" />}
                          </span>
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Favourite Pahadi Song */}
                  <input
                    type="text"
                    placeholder="Favourite Pahadi Song"
                    value={favSong}
                    onChange={(e) => setFavSong(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />

                  {/* Favourite Dish */}
                  <input
                    type="text"
                    placeholder="Favourite Pahadi Dish"
                    value={favDish}
                    onChange={(e) => setFavDish(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />

                  {/* Fun Fact */}
                  <textarea
                    placeholder="One fun fact about you ✨"
                    rows={2}
                    value={funFact}
                    onChange={(e) => setFunFact(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50 resize-none"
                  />

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
                <p className="text-white/70 text-sm mb-4 tracking-wide">
                  {compResult.myName}
                  <span className="text-pink-400 mx-2">❤️</span>
                  {compResult.gfName}
                </p>

                {/* Dimension bars */}
                <div className="space-y-3 mb-5 text-left">
                  {[
                    { key: 'culture', icon: '❤️', label: 'Culture' },
                    { key: 'humor',   icon: '😂', label: 'Humor' },
                    { key: 'music',   icon: '🎵', label: 'Music' },
                    { key: 'travel',  icon: '🌄', label: 'Travel' },
                  ].map(({ key, icon, label }) => (
                    <div key={key}>
                      <div className="flex justify-between items-center text-sm mb-1.5">
                        <span className="text-white/70">{icon} {label}</span>
                        <span className="font-bold text-white tabular-nums">{displayScores[key]}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${compResult[key]}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall */}
                <div className="bg-white/5 border border-white/10 rounded-2xl py-5 mb-5 text-center">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Overall</p>
                  <p className="text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent tabular-nums">
                    {displayScores.overall}%
                  </p>
                  <p className={`text-sm font-bold mt-2 ${compatLabel(compResult.overall).color}`}>
                    {compatLabel(compResult.overall).text}
                  </p>
                  <p className="text-xs text-white/40 mt-1">{compatLabel(compResult.overall).desc}</p>
                </div>

                {/* Share + Reset */}
                <div className="flex flex-col gap-2">
                  <WhatsAppShareBtn
                    title="Check Your Compatibility 💘"
                    text={`${compResult.myName} ❤️ ${compResult.gfName} = ${compResult.overall}% overall match! Check yours on Jhumelo by PahadiTube 🏔️`}
                    compact={false}
                    className="w-full justify-center"
                  />
                  <button
                    onClick={() => {
                      setCompResult(null);
                      setCompMyName(''); setCompGfName('');
                      setCompMyRegion(''); setCompGfRegion('');
                      setCompMyBirthdate(''); setCompGfBirthdate('');
                      setCompFavSong(''); setCompFavFood('');
                      setDisplayScores({ culture: 0, humor: 0, music: 0, travel: 0, overall: 0 });
                    }}
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
                {/* Your Name */}
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={compMyName}
                  onChange={(e) => setCompMyName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />

                {/* Pulsing heart divider */}
                <div className="flex justify-center">
                  <motion.span
                    className="text-2xl select-none"
                    animate={heartPulse
                      ? { scale: [1, 1.7, 1, 1.5, 1], rotate: [0, -12, 12, -6, 0] }
                      : { scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >❤️</motion.span>
                </div>

                {/* Their Name */}
                <input
                  type="text"
                  required
                  placeholder="Their Name"
                  value={compGfName}
                  onChange={(e) => setCompGfName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />

                {/* Both Regions */}
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={compMyRegion}
                    onChange={(e) => setCompMyRegion(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-pink-500/50 appearance-none text-sm"
                  >
                    <option value="" className="bg-dark-900">Your Region</option>
                    <option value="Garhwal" className="bg-dark-900">Garhwal</option>
                    <option value="Kumaon" className="bg-dark-900">Kumaon</option>
                    <option value="Jaunsar" className="bg-dark-900">Jaunsar</option>
                    <option value="Himachal" className="bg-dark-900">Himachal</option>
                    <option value="Nepal" className="bg-dark-900">Nepal</option>
                    <option value="Other" className="bg-dark-900">Other</option>
                  </select>
                  <select
                    value={compGfRegion}
                    onChange={(e) => setCompGfRegion(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-pink-500/50 appearance-none text-sm"
                  >
                    <option value="" className="bg-dark-900">Their Region</option>
                    <option value="Garhwal" className="bg-dark-900">Garhwal</option>
                    <option value="Kumaon" className="bg-dark-900">Kumaon</option>
                    <option value="Jaunsar" className="bg-dark-900">Jaunsar</option>
                    <option value="Himachal" className="bg-dark-900">Himachal</option>
                    <option value="Nepal" className="bg-dark-900">Nepal</option>
                    <option value="Other" className="bg-dark-900">Other</option>
                  </select>
                </div>

                {/* Both Birthdates (optional) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="relative">
                    <input
                      type="date"
                      value={compMyBirthdate}
                      onChange={(e) => setCompMyBirthdate(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white/70 text-sm focus:outline-none focus:border-pink-500/50"
                    />
                    <p className="absolute -top-2.5 left-2 text-[10px] text-white/30 bg-dark-950 px-1">Your DOB</p>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={compGfBirthdate}
                      onChange={(e) => setCompGfBirthdate(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white/70 text-sm focus:outline-none focus:border-pink-500/50"
                    />
                    <p className="absolute -top-2.5 left-2 text-[10px] text-white/30 bg-dark-950 px-1">Their DOB</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/25 text-center -mt-1">Birthdates optional — affect Travel score</p>

                {/* Favourite Song */}
                <input
                  type="text"
                  placeholder="🎵 Favourite Pahadi Song"
                  value={compFavSong}
                  onChange={(e) => setCompFavSong(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />

                {/* Favourite Food */}
                <input
                  type="text"
                  placeholder="🍽️ Favourite Pahadi Dish"
                  value={compFavFood}
                  onChange={(e) => setCompFavFood(e.target.value)}
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
