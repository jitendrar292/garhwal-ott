import { motion } from 'framer-motion';
import { Disclosure, Transition } from '@headlessui/react';

const FAQ_ITEMS = [
  {
    question: '🎬 क्या मिलेगा आपको?',
    answer: [
      'नई और पुरानी पहाड़ी फिल्में',
      'Trending Garhwali & Kumaoni songs',
      'Comedy videos (हँसते रहो 😄)',
      'Bhakti & devotional content',
    ],
  },
  {
    question: '❤️ क्यों चुनें PahadiTube?',
    answer: [
      'अगर आप पहाड़ से जुड़े हैं या अपनी भाषा और संस्कृति से प्यार करते हैं, तो PahadiTube आपके लिए है।',
      'Apni bhasha, apna entertainment!',
      'Enjoy the best of Pahadi content — बिना किसी रुकावट के।',
    ],
  },
];

export default function AboutSection() {
  return (
    <motion.section
      className="mb-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-700/30 via-primary-600/15 to-emerald-700/20 px-6 py-5 sm:px-8 sm:py-6 animated-gradient">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            <span className="gradient-text">PahadiTube</span> — सब पहाड़ी मनोरंजन एकठ्या <span className="inline-block">📺🏔️</span>
          </h2>
          <p className="text-gray-300 mt-2 text-sm sm:text-base leading-relaxed">
            अब देखो अपने पसंदीदा Garhwali, Kumaoni और Pahadi वीडियो एक ही ऐप में!
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {/* Features grid */}
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">🔥</span> <span className="gradient-text">Features</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: '⚡', label: 'Fast video streaming' },
              { icon: '🆕', label: 'Daily new content' },
              { icon: '🔍', label: 'Easy search & categories' },
              { icon: '💨', label: 'Lightweight & smooth' },
              { icon: '🚫', label: 'बिल्कुल Ad-Free अनुभव', highlight: true },
              { icon: '📱', label: 'Mobile friendly' },
              { icon: '🤖', label: 'Ghughuti AI Chat' },
              { icon: '📰', label: 'पहाड़ी News in Garhwali' },
              { icon: '💼', label: 'Govt Jobs & Alerts' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.04, y: -2 }}
                className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm transition-all duration-300
                  ${feat.highlight
                    ? 'bg-green-500/10 border border-green-500/20 text-green-300 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                    : 'glass-card-light text-gray-300 hover:text-white'
                  }`}
              >
                <span className="text-lg shrink-0">{feat.icon}</span>
                {feat.label}
              </motion.div>
            ))}
          </div>

          {/* Accordion FAQ sections */}
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <Disclosure key={idx} defaultOpen={idx === 0}>
                {({ open }) => (
                  <div className={`glass-card-light rounded-xl overflow-hidden transition-all duration-300 ${open ? 'ring-1 ring-primary-500/20' : ''}`}>
                    <Disclosure.Button className="flex items-center justify-between w-full px-5 py-4 text-left text-sm font-semibold text-white hover:bg-white/5 transition-colors">
                      <span>{item.question}</span>
                      <motion.svg
                        className="w-5 h-5 text-primary-400 shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-200 ease-out"
                      enterFrom="opacity-0 -translate-y-2"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition duration-150 ease-in"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-2"
                    >
                      <Disclosure.Panel className="px-5 pb-4">
                        <ul className="space-y-2">
                          {item.answer.map((line, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                              <span className="text-primary-400 mt-0.5 shrink-0">•</span>
                              {line}
                            </li>
                          ))}
                        </ul>
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <motion.div
            className="bg-gradient-to-r from-primary-700/20 via-primary-600/10 to-rose-700/10 rounded-xl p-5 border border-primary-500/15 animated-gradient"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <p className="text-primary-300 font-bold text-base">
              👉 Apni bhasha, apna entertainment!
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Enjoy the best of Pahadi content — बिना किसी रुकावट के।
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
