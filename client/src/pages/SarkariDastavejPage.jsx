import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SARKARI_DASTAVEJ, { DOC_CATEGORIES, IMPORTANT_PORTALS } from '../data/sarkariDastavej';

export default function SarkariDastavejPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState({});

  const visible = useMemo(() => {
    if (activeCategory === 'all') return SARKARI_DASTAVEJ;
    return SARKARI_DASTAVEJ.filter((d) => d.category === activeCategory);
  }, [activeCategory]);

  const getTab = (id) => activeTab[id] || 'online';
  const setTab = (id, tab) => setActiveTab((prev) => ({ ...prev, [id]: tab }));

  return (
    <div className="w-full text-white">
      <SEO
        title="उत्तराखंड सरकारी दस्तावेज गाइड — जाति प्रमाण पत्र, भूलेख, निवास, राशन कार्ड"
        description="उत्तराखंड में जाति प्रमाण पत्र, मूल निवास, आय प्रमाण, भूलेख, राशन कार्ड कैसे बनाएं — ऑनलाइन प्रक्रिया, जरूरी दस्तावेज, शुल्क और सरकारी वेबसाइट की पूरी जानकारी हिंदी में।"
        path="/sarkari-dastavej"
        keywords="uttarakhand jati praman patra, mool niwas praman patra uk, bhulekh uk, edistrict uk, ration card uttarakhand, income certificate uttarakhand, birth certificate uttarakhand, pension uttarakhand"
      />

      <div className="max-w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-8 p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, #0c1445 0%, #1a3a6b 50%, #0f2847 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div className="text-5xl mb-3">🏛️</div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            उत्तराखंड सरकारी दस्तावेज गाइड
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mb-4">
            जाति प्रमाण पत्र, निवास प्रमाण, भूलेख, राशन कार्ड, पेंशन — सभी दस्तावेज ऑनलाइन
            कैसे बनाएं, क्या लगेगा, कितना समय लगेगा — सम्पूर्ण हिंदी गाइड।
          </p>
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full">💻 Online आवेदन</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🆓 अधिकतर निःशुल्क</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">📋 Step-by-Step गाइड</span>
          </div>
        </motion.div>

        {/* Important Portals */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-200 mb-3">🔗 महत्वपूर्ण सरकारी वेबसाइटें</h2>
          <div className="flex flex-wrap gap-2">
            {IMPORTANT_PORTALS.map((p) => (
              <a
                key={p.url}
                href={`https://${p.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-surface-1 hover:bg-surface-2 border border-white/10 rounded-lg px-3 py-2 text-xs transition-all hover:border-primary-500/40"
              >
                <span>{p.icon}</span>
                <span className="text-gray-200">{p.name}</span>
                <span className="text-gray-500">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {DOC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-surface-1 text-gray-300 hover:bg-surface-2'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {visible.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-1 rounded-2xl border border-white/5 overflow-hidden"
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/5 transition-colors"
              >
                <div
                  className={`rounded-xl p-3 bg-gradient-to-br ${doc.color} flex-shrink-0`}
                >
                  <span className="text-2xl">{doc.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg">{doc.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{doc.description}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    <span>⏱️ {doc.timeframe}</span>
                    <span>💳 {doc.fees}</span>
                  </div>
                </div>
                <span className={`text-gray-400 text-xl flex-shrink-0 transition-transform ${expandedId === doc.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === doc.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/5">
                      {/* Process Tabs */}
                      <div className="flex gap-2 mt-4 mb-4">
                        <button
                          onClick={() => setTab(doc.id, 'online')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${getTab(doc.id) === 'online' ? 'bg-primary-500 text-white' : 'bg-surface-2 text-gray-300'}`}
                        >
                          💻 Online प्रक्रिया
                        </button>
                        <button
                          onClick={() => setTab(doc.id, 'docs')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${getTab(doc.id) === 'docs' ? 'bg-primary-500 text-white' : 'bg-surface-2 text-gray-300'}`}
                        >
                          📋 दस्तावेज
                        </button>
                        <button
                          onClick={() => setTab(doc.id, 'info')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${getTab(doc.id) === 'info' ? 'bg-primary-500 text-white' : 'bg-surface-2 text-gray-300'}`}
                        >
                          ℹ️ जरूरी बातें
                        </button>
                      </div>

                      {getTab(doc.id) === 'online' && (
                        <div className="space-y-3">
                          {doc.onlineProcess.map((step) => (
                            <div key={step.step} className="flex gap-3">
                              <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-xs font-bold text-primary-300 flex-shrink-0">
                                {step.step}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-200">{step.title}</div>
                                <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{step.detail}</div>
                              </div>
                            </div>
                          ))}
                          {doc.offlineProcess && (
                            <div className="mt-3 p-3 bg-surface-2 rounded-lg">
                              <div className="text-xs font-semibold text-amber-300 mb-1">🏢 Offline विकल्प</div>
                              <p className="text-xs text-gray-400">{doc.offlineProcess}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {getTab(doc.id) === 'docs' && (
                        <ul className="space-y-2">
                          {doc.documents.map((d, idx) => (
                            <li key={idx} className="flex gap-2 text-sm">
                              <span className="text-primary-400 flex-shrink-0">✓</span>
                              <span className="text-gray-300">{d}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {getTab(doc.id) === 'info' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-surface-2 rounded-lg p-3">
                              <div className="text-xs text-gray-400">⏱️ समय</div>
                              <div className="text-sm font-medium mt-1">{doc.timeframe}</div>
                            </div>
                            <div className="bg-surface-2 rounded-lg p-3">
                              <div className="text-xs text-gray-400">💳 शुल्क</div>
                              <div className="text-sm font-medium mt-1">{doc.fees}</div>
                            </div>
                            <div className="bg-surface-2 rounded-lg p-3">
                              <div className="text-xs text-gray-400">📅 वैधता</div>
                              <div className="text-sm font-medium mt-1">{doc.validity}</div>
                            </div>
                            <div className="bg-surface-2 rounded-lg p-3">
                              <div className="text-xs text-gray-400">🌐 वेबसाइट</div>
                              <a href={`https://${doc.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-400 hover:underline mt-1 block">{doc.website} ↗</a>
                            </div>
                          </div>
                          {doc.importantNote && (
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <p className="text-xs text-yellow-300"><strong>⚠️ जरूरी:</strong> {doc.importantNote}</p>
                            </div>
                          )}
                          {doc.usefulFor && (
                            <div>
                              <div className="text-xs text-gray-400 mb-2">📌 किस काम आता है:</div>
                              <div className="flex flex-wrap gap-2">
                                {doc.usefulFor.map((u, idx) => (
                                  <span key={idx} className="bg-surface-2 text-xs px-2 py-1 rounded-full text-gray-300">{u}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Helpline */}
        <div className="mt-8 rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #1a3a6b, #0c1445)' }}>
          <div className="text-3xl mb-2">📞</div>
          <h3 className="font-bold text-lg mb-2">सरकारी हेल्पलाइन</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <span>📱 उत्तराखंड CM हेल्पलाइन: <strong className="text-white">1905</strong></span>
            <span>📱 e-District सहायता: <strong className="text-white">1800-180-4188</strong></span>
            <span>📱 भूलेख हेल्पलाइन: <strong className="text-white">0135-2669765</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
