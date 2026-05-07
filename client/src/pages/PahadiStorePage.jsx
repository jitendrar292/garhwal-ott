import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PAHADI_INGREDIENTS from '../data/pahadiIngredients';
import useNearbyStores from '../hooks/useNearbyStores';

export default function PahadiStorePage() {
  const [search, setSearch] = useState('');
  const { status, store, city, distKm, isUttarakhand, detect } = useNearbyStores();

  const visible = search.trim()
    ? PAHADI_INGREDIENTS.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.nameEn.toLowerCase().includes(search.toLowerCase()) ||
          i.desc.toLowerCase().includes(search.toLowerCase())
      )
    : PAHADI_INGREDIENTS;

  const inUK = isUttarakhand || store?.state === 'Uttarakhand';

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
          className="relative rounded-2xl overflow-hidden mb-4 p-5"
          style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #2d1f0e 50%, #1a1a2e 100%)' }}
        >
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 select-none">🛒</div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-4xl">🏔️</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">पहाड़ी सामग्री</h1>
                <p className="text-amber-300 font-bold text-sm">Pahadi Ingredient Store</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm max-w-xl">
              गहत, भट्ट, मंडुवा, जखिया — ऑनलाइन खरीदें या नज़दीकी बाज़ार में ढूँढें।
            </p>
            <Link to="/pahadi-khano" className="mt-2 inline-block text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2">
              ← पहाड़ी रेसिपी देखें
            </Link>
          </div>
        </div>

        {/* ── Location panel ── */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          {status === 'idle' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-bold text-white">📍 नज़दीकी दुकान खोजें</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  अपनी location share करें — हम आपके शहर के पहाड़ी बाज़ार suggest करेंगे।
                </p>
              </div>
              <button
                onClick={detect}
                className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl transition-colors"
              >
                📍 Location Share करें
              </button>
            </div>
          )}

          {status === 'locating' && (
            <div className="flex items-center gap-3 text-sm text-amber-300">
              <span className="animate-spin text-lg">🔄</span>
              <span>आपकी location ढूँढी जा रही है…</span>
            </div>
          )}

          {status === 'denied' && (
            <p className="text-sm text-red-300">
              ⚠️ Location permission नहीं मिली। Browser settings में enable करें, या नीचे ऑनलाइन links से खरीदें।
            </p>
          )}

          {status === 'error' && (
            <p className="text-sm text-slate-400">
              📍 Location detect नहीं हो सका — नीचे ऑनलाइन links से खरीदें।
            </p>
          )}

          {status === 'found' && store && (
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    📍 आप {city || store.city} के पास हैं
                    {distKm != null && <span className="text-slate-400 font-normal"> (~{distKm} km)</span>}
                  </p>
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">
                    {inUK
                      ? '✅ आप उत्तराखंड में हैं — ताज़ी पहाड़ी सामग्री पास में ही मिलेगी!'
                      : `💡 ${store.city} के बाज़ार आपसे सबसे नज़दीक हैं`}
                  </p>
                </div>
                <button onClick={detect} className="text-[10px] text-slate-400 hover:text-white underline shrink-0">
                  बदलें
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {store.markets.map((m) => (
                  <a
                    key={m.nameEn}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 rounded-xl bg-black/30 border border-white/10 hover:border-amber-400/40 p-3 transition-all group"
                  >
                    <span className="text-xl mt-0.5">🏪</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {m.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{m.nameEn} · {store.cityHi}</p>
                      <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">{m.desc}</p>
                      <span className="mt-1.5 inline-block text-[10px] font-bold text-amber-400 group-hover:text-amber-300">
                        Google Maps पर देखें →
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {store.nearestUK && (
                <p className="mt-2.5 text-[10px] text-slate-400 leading-relaxed">
                  💡 उत्तराखंड जाने पर <span className="text-amber-300 font-semibold">{store.nearestUK}</span> के बाज़ारों से भरपूर पहाड़ी सामग्री ले आएं — बेहद सस्ती और ताज़ी।
                </p>
              )}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-5">
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
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{ing.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-black text-white leading-tight">{ing.name}</h2>
                    <p className="text-[11px] text-amber-300 font-semibold">{ing.nameEn}</p>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{ing.desc}</p>
                  </div>
                </div>

                {/* Location-aware: if nearby store found, show Maps link for this ingredient */}
                {status === 'found' && store && (
                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-widest text-amber-400/80 mb-1.5 font-bold">
                      📍 {store.cityHi} में खरीदें
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {store.markets.slice(0, 2).map((m) => (
                        <a
                          key={m.nameEn}
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ing.nameEn} ${m.mapsQuery}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/20 hover:bg-green-500/40 text-green-200 border border-green-400/30 transition-colors"
                        >
                          📍 {m.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Online links — shown always; de-prioritised (smaller) when nearby store found */}
                <div className={status === 'found' && store ? 'mb-3' : 'mb-3'}>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1.5 font-bold">
                    🛒 ऑनलाइन खरीदें
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

                {/* Local note */}
                <div className="bg-black/30 rounded-lg px-3 py-2 border border-white/5">
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <span className="text-amber-400 font-bold">📍 बाज़ार टिप: </span>
                    {ing.localNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center">
          <p className="text-xs text-slate-400">
            ये affiliate links हैं — आपकी खरीद से PahadiTube को छोटा-सा support मिलता है, आपको कोई अतिरिक्त खर्च नहीं।
          </p>
        </div>
      </div>
    </div>
  );
}


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
