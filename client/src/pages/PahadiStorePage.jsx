import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PAHADI_INGREDIENTS from '../data/pahadiIngredients';

export default function PahadiStorePage() {
  const [search, setSearch] = useState('');

  const visible = search.trim()
    ? PAHADI_INGREDIENTS.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.nameEn.toLowerCase().includes(search.toLowerCase()) ||
          i.desc.toLowerCase().includes(search.toLowerCase())
      )
    : PAHADI_INGREDIENTS;

  return (
    <div className="w-full text-white">
      <SEO
        title="पहाड़ी सामग्री – Where to Buy Pahadi Ingredients"
        description="गहत, भट्ट, मंडुवा, जखिया, जम्बू जैसी पहाड़ी सामग्री ऑनलाइन या अपने नज़दीकी बाज़ार से खरीदें।"
        path="/pahadi-store"
        keywords="pahadi ingredients buy online, gehat dal, bhatt dal, mandua flour, jakhiya, jambu, uttarakhand food online"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16">

        {/* Hero */}
        <div
          className="relative rounded-2xl overflow-hidden mb-6 p-6"
          style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #2d1f0e 50%, #1a1a2e 100%)' }}
        >
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 select-none">🛒</div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🏔️</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">पहाड़ी सामग्री</h1>
                <p className="text-amber-300 font-bold text-sm">Pahadi Ingredient Store</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm max-w-xl">
              गहत, भट्ट, मंडुवा, जखिया जैसी देसी सामग्री — ऑनलाइन ख़रीदें या पास के पहाड़ी बाज़ार में ढूँढें।
            </p>
            <Link
              to="/pahadi-khano"
              className="mt-3 inline-block text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2"
            >
              ← पहाड़ी रेसिपी देखें
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="गहत, भट्ट, मंडुवा... सर्च करें"
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400/60 transition-colors"
          />
        </div>

        {/* Ingredients grid */}
        {visible.length === 0 ? (
          <p className="text-center text-slate-400 py-12">कोई सामग्री नहीं मिली।</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visible.map((ing) => (
              <div
                key={ing.id}
                className="rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/30 p-4 transition-all"
              >
                {/* header */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{ing.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-black text-white leading-tight">{ing.name}</h2>
                    <p className="text-[11px] text-amber-300 font-semibold">{ing.nameEn}</p>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{ing.desc}</p>
                  </div>
                </div>

                {/* online links */}
                <div className="mb-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1.5 font-bold">
                    ऑनलाइन खरीदें
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ing.online.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-400/30 transition-colors"
                      >
                        🔗 {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* local note */}
                <div className="bg-black/30 rounded-lg px-3 py-2 border border-white/5">
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <span className="text-amber-400 font-bold">📍 पास के बाज़ार में: </span>
                    {ing.localNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center">
          <p className="text-xs text-slate-400">
            ये affiliate links हैं — आपकी खरीद से PahadiTube को छोटा-सा support मिलता है, आपको कोई अतिरिक्त खर्च नहीं।
          </p>
        </div>
      </div>
    </div>
  );
}
