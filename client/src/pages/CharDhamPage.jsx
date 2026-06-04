import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import CHAR_DHAM, { YATRA_TIPS, HELICOPTER_SERVICES } from '../data/charDham';

export default function CharDhamPage() {
  const [activeDham, setActiveDham] = useState('kedarnath');
  const [activeTab, setActiveTab] = useState('route');

  const dham = CHAR_DHAM.find((d) => d.id === activeDham);

  return (
    <div className="w-full text-white">
      <SEO
        title="चार धाम यात्रा गाइड 2025 — केदारनाथ, बद्रीनाथ, गंगोत्री, यमुनोत्री"
        description="चार धाम यात्रा की सम्पूर्ण जानकारी हिंदी में — रूट, खर्च, पंजीकरण, हेलीकॉप्टर, रहने की व्यवस्था। केदारनाथ यात्रा गाइड, बद्रीनाथ मार्गदर्शिका, गंगोत्री-यमुनोत्री टिप्स।"
        path="/chardham-yatra"
        keywords="char dham yatra guide, kedarnath yatra, badrinath yatra, gangotri yatra, yamunotri yatra, chardham registration, kedarnath helicopter booking, chardham yatra cost, uttarakhand pilgrimage"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-8 p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #11284b 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div className="text-5xl mb-3">🛕</div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            चार धाम यात्रा गाइड 2025
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mb-4">
            उत्तराखंड के चार पवित्र धाम — यमुनोत्री, गंगोत्री, केदारनाथ और बद्रीनाथ — की सम्पूर्ण
            यात्रा जानकारी। रूट, खर्च, पंजीकरण और जरूरी टिप्स।
          </p>
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full">📅 मई–नवम्बर यात्रा सीजन</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">📝 Online पंजीकरण अनिवार्य</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🚁 हेलीकॉप्टर सेवा उपलब्ध</span>
          </div>
        </motion.div>

        {/* Dham Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {CHAR_DHAM.map((d) => (
            <button
              key={d.id}
              onClick={() => { setActiveDham(d.id); setActiveTab('route'); }}
              className={`rounded-xl p-4 text-center transition-all border-2 ${
                activeDham === d.id
                  ? 'border-primary-500 bg-surface-2 shadow-lg shadow-primary-500/20'
                  : 'border-white/10 bg-surface-1 hover:border-white/30'
              }`}
            >
              <div className="text-3xl mb-1">{d.emoji}</div>
              <div className="font-semibold text-sm">{d.name}</div>
              <div className="text-xs text-gray-400">{d.district}</div>
              <div className="text-xs text-gray-400 mt-1">{d.altitude}</div>
            </button>
          ))}
        </div>

        {/* Dham Detail */}
        <AnimatePresence mode="wait">
          {dham && (
            <motion.div
              key={dham.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mb-10"
            >
              {/* Dham Header */}
              <div className={`rounded-2xl p-6 mb-4 bg-gradient-to-r ${dham.color}`}>
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{dham.emoji}</span>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">{dham.name}</h2>
                    <p className="text-sm text-white/80">{dham.deity} • {dham.district} • {dham.altitude}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/70">
                      <span>🗓️ खुलता: {dham.openMonth}</span>
                      <span>🗓️ बंद होता: {dham.closeMonth}</span>
                      <span>🥾 ट्रेक: {dham.trekDistance}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/90 leading-relaxed">{dham.significance}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {[
                  { id: 'route', label: '🗺️ रूट' },
                  { id: 'cost', label: '💰 खर्च' },
                  { id: 'tips', label: '📋 टिप्स' },
                  { id: 'stay', label: '🏨 रहना' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === t.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface-1 text-gray-300 hover:bg-surface-2'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'route' && (
                    <div className="bg-surface-1 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-surface-2 text-gray-300">
                            <th className="text-left p-3">से</th>
                            <th className="text-left p-3">तक</th>
                            <th className="text-left p-3 hidden sm:table-cell">दूरी</th>
                            <th className="text-left p-3">समय</th>
                            <th className="text-left p-3 hidden sm:table-cell">साधन</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dham.route.map((r, i) => (
                            <tr key={i} className="border-t border-white/5">
                              <td className="p-3 font-medium">{r.from}</td>
                              <td className="p-3 text-primary-300">{r.to}</td>
                              <td className="p-3 text-gray-400 hidden sm:table-cell">{r.km}</td>
                              <td className="p-3 text-gray-400">{r.time}</td>
                              <td className="p-3 text-gray-400 hidden sm:table-cell">{r.mode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'cost' && (
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="bg-surface-1 rounded-xl p-4 border border-white/5">
                        <div className="text-lg font-bold text-green-400 mb-1">💚 बजट यात्रा</div>
                        <div className="text-2xl font-bold mb-2">{dham.cost.budget}</div>
                        <p className="text-xs text-gray-400">सरकारी बस + धर्मशाला</p>
                      </div>
                      <div className="bg-surface-1 rounded-xl p-4 border border-white/5">
                        <div className="text-lg font-bold text-yellow-400 mb-1">💛 मध्यम यात्रा</div>
                        <div className="text-2xl font-bold mb-2">{dham.cost.moderate}</div>
                        <p className="text-xs text-gray-400">टैक्सी + मध्यम होटल</p>
                      </div>
                      <div className="bg-surface-1 rounded-xl p-4 border border-white/5">
                        <div className="text-lg font-bold text-orange-400 mb-1">🧡 आरामदायक</div>
                        <div className="text-2xl font-bold mb-2">{dham.cost.comfortable}</div>
                        <p className="text-xs text-gray-400">हेलीकॉप्टर + बेहतर होटल</p>
                      </div>
                      <div className="sm:col-span-3 bg-surface-1 rounded-xl p-4 border border-yellow-500/20">
                        <p className="text-sm text-yellow-300">ℹ️ {dham.cost.notes}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tips' && (
                    <ul className="space-y-3">
                      {dham.tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 bg-surface-1 rounded-xl p-4 border border-white/5">
                          <span className="text-primary-400 font-bold text-lg">{i + 1}.</span>
                          <span className="text-sm leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'stay' && (
                    <div className="bg-surface-1 rounded-xl p-5 border border-white/5">
                      <h3 className="font-semibold text-primary-300 mb-2">🏨 रहने की व्यवस्था</h3>
                      <p className="text-sm leading-relaxed text-gray-200">{dham.accommodation}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* General Yatra Tips */}
        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">📌 यात्रा के महत्वपूर्ण सुझाव</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(YATRA_TIPS).map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-surface-1 rounded-xl p-4 border border-white/5"
              >
                <div className="text-2xl mb-2">{tip.icon}</div>
                <h3 className="font-semibold text-primary-300 mb-2">{tip.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{tip.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Helicopter Services */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">🚁 हेलीकॉप्टर सेवाएं</h2>
          <div className="bg-surface-1 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-2 text-gray-300">
                  <th className="text-left p-3">धाम</th>
                  <th className="text-left p-3">उड़ान बेस</th>
                  <th className="text-left p-3">किराया</th>
                  <th className="text-left p-3 hidden sm:table-cell">अवधि</th>
                  <th className="text-left p-3 hidden sm:table-cell">बुकिंग</th>
                </tr>
              </thead>
              <tbody>
                {HELICOPTER_SERVICES.map((h, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="p-3 font-medium">{h.dham}</td>
                    <td className="p-3 text-gray-300">{h.bases.join(', ')}</td>
                    <td className="p-3 text-primary-300">{h.price}</td>
                    <td className="p-3 text-gray-400 hidden sm:table-cell">{h.duration}</td>
                    <td className="p-3 text-gray-400 hidden sm:table-cell">{h.booking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * हेलीकॉप्टर किराया वर्ष और ऑपरेटर के अनुसार बदलता है। आधिकारिक booking के लिए
            IRCTC या GMVN वेबसाइट देखें।
          </p>
        </div>

        {/* Registration CTA */}
        <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #0f3460, #16213e)' }}>
          <div className="text-4xl mb-2">📝</div>
          <h3 className="text-lg font-bold mb-2">यात्रा पंजीकरण अनिवार्य</h3>
          <p className="text-sm text-gray-300 mb-4">
            चार धाम यात्रा पर जाने से पहले Online Registration जरूरी है। निःशुल्क पंजीकरण।
          </p>
          <a
            href="https://registrationandtouristcare.uk.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-500 hover:bg-primary-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            🛕 अभी रजिस्ट्रेशन करें
          </a>
        </div>
      </div>
    </div>
  );
}
