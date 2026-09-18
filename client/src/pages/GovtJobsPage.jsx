// GovtJobsPage — dedicated page listing all govt jobs
// /jobs route

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import GOVT_JOBS from '../data/govtJobs';
import WhatsAppShareBtn from '../components/WhatsAppShareBtn';
import { useToast } from '../components/ui/Toast';

function daysUntil(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso + 'T00:00:00') - today) / 86400000);
}

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const CATEGORIES = [
  { id: 'all', label: 'सभी', emoji: '📋' },
  { id: 'state', label: 'राज्य', emoji: '🏛️' },
  { id: 'central', label: 'केंद्र', emoji: '🇮🇳' },
  { id: 'police', label: 'पुलिस', emoji: '👮' },
  { id: 'defence', label: 'रक्षा', emoji: '🎖️' },
  { id: 'teaching', label: 'शिक्षा', emoji: '📚' },
  { id: 'psu', label: 'PSU', emoji: '🏭' },
];

const MSME_ROJGAR_MODELS = [
  {
    id: 'kiwi-plantation',
    emoji: '🥝',
    title: 'कीवी बागवानी (औद्यान) यूनिट',
    detail: 'कीवी बागवानी मॉडल: T-bar/pergola training के साथ 4m x 5-6m spacing, फलन 4-5 साल में शुरू और 7-8 साल में व्यावसायिक उत्पादन; औसत ~25 टन/हेक्टेयर तक उपज संभव है।',
    investment: '1 एकड़ बागवानी (ट्रेलिस + ड्रिप + बाड़ + रोपण) के लिए NHB one-acre model में आधार लागत लगभग ₹2.5 लाख बताई गई है; वास्तविक लागत स्थान और सामग्री के अनुसार अधिक भी हो सकती है।',
    support: 'बागवानी विभाग + NHB/MIDH लिंकिंग, ड्रिप सिंचाई सब्सिडी, गुणवत्ता वाले रोपण सामग्री और ट्रेलिस/बाग स्थापना के लिए बैंक योग्य परियोजना सहायता।',
  },
  {
    id: 'matsya-palan',
    emoji: '🐟',
    title: 'मत्स्य पालन (मछली पालन)',
    detail: 'टैंक/तालाब आधारित मत्स्य पालन से ग्रामीण परिवारों को नियमित आय और SHG आधारित रोजगार अवसर मिलते हैं।',
    investment: 'स्टार्टर मॉडल: लगभग ₹2-8 लाख',
    support: 'मत्स्य विभाग का प्रशिक्षण, तालाब विकास सहायता, फ़ीड मार्गदर्शन।',
  },
  {
    id: 'dairy-unit',
    emoji: '🥛',
    title: 'डेयरी और दूध संग्रह माइक्रो यूनिट',
    detail: 'डेयरी पशुपालन, दूध संग्रह, दही/घी जैसी मूल्य-वर्धित इकाई से गाँव स्तर पर रोजगार मिलता है।',
    investment: 'माइक्रो डेयरी: लगभग ₹4-12 लाख',
    support: 'पशुपालन लिंकिंग, पशुचिकित्सा सहायता, कूलिंग/संग्रह नेटवर्क।',
  },
  {
    id: 'mushroom-beekeeping',
    emoji: '🍄',
    title: 'मशरूम + मधुमक्खी पालन सहायक मॉडल',
    detail: 'कम जगह में मशरूम उत्पादन और मधुमक्खी पालन के साथ ड्यूल इनकम मॉडल, महिलाओं/युवाओं के लिए उपयुक्त है।',
    investment: 'प्रारंभिक सेटअप: लगभग ₹1-5 लाख',
    support: 'कौशल प्रशिक्षण, क्लस्टर आधारित विपणन, सहकारी खरीद।',
  },
  {
    id: 'pmegp',
    emoji: '🏭',
    title: 'पीएमईजीपी (प्रधानमंत्री रोजगार निर्माण कार्यक्रम)',
    detail: 'नए माइक्रो उद्यम शुरू करने के लिए KVIC/KVIB/DIC मार्ग से विनिर्माण और सेवा इकाइयों को सहायता दी जाती है। ग्रामीण/पहाड़ी युवाओं के लिए लोकप्रिय स्वरोजगार योजना है।',
    investment: 'परियोजना लागत: विनिर्माण तक ₹50 लाख, सेवा तक ₹20 लाख (नवीनतम PMEGP नियमों के अनुसार)।',
    support: 'मार्जिन मनी सब्सिडी (श्रेणी/स्थान के आधार पर), EDP प्रशिक्षण, बैंक-लिंक्ड लोन सुविधा।',
  },
  {
    id: 'pmfme-odop',
    emoji: '🍯',
    title: 'पीएमएफएमई (ODOP खाद्य प्रसंस्करण सहायता)',
    detail: 'One District One Product मॉडल के तहत आचार, मंडुआ, पहाड़ी मसाला, शहद, फलों के प्रसंस्करण जैसी माइक्रो फूड इकाइयों को व्यवस्थित और बढ़ाने के लिए योजना।',
    investment: 'योग्य माइक्रो फूड उद्यमों के लिए परियोजना-लिंक्ड सहायता; सामान्यतः क्रेडिट-लिंक्ड कैपिटल सब्सिडी उपलब्ध होती है।',
    support: '35% तक क्रेडिट-लिंक्ड कैपिटल सब्सिडी (योजना नियम), ब्रांडिंग/पैकेजिंग, FSSAI सहायता, SHG/FPO हैंडहोल्डिंग।',
  },
  {
    id: 'mudra-loan',
    emoji: '💳',
    title: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
    detail: 'छोटे व्यवसायों के लिए collateral-light कार्यशील पूंजी/टर्म लोन सहायता। किराना, सिलाई, मरम्मत, परिवहन, डेयरी, फूड कार्ट जैसे छोटे उद्यमों के लिए उपयोगी।',
    investment: 'शिशु, किशोर, तरुण श्रेणियों में व्यवसाय स्तर के अनुसार लोन स्लैब; संशोधित उच्च स्लैब के लिए बैंक नियम लागू होते हैं।',
    support: 'बैंक/NBFC मार्ग से वित्तपोषण, कम-लागत उद्यम शुरू करने की सहायता, महिलाओं और पहली बार उद्यमियों के लिए बेहतर पहुँच।',
  },
  {
    id: 'standup-india',
    emoji: '📈',
    title: 'स्टैंड-अप इंडिया (महिला/SC/ST उद्यमी)',
    detail: 'ग्रीनफील्ड उद्यम शुरू करने के लिए महिलाओं और SC/ST उद्यमियों को संस्थागत क्रेडिट प्रदान करने का प्रयास; विनिर्माण, व्यापार और सेवा क्षेत्रों में उपयोगी।',
    investment: 'लोन रेंज सामान्यतः ₹10 लाख से ₹1 करोड़ (बैंक मूल्यांकन और व्यवहार्यता के आधार पर)।',
    support: 'हैंडहोल्डिंग सहायता, परियोजना तैयार करने की मार्गदर्शिका, स्टैंड-अप इंडिया ढांचे के तहत बैंक लोन सुविधा।',
  },
];

function JobCard({ job, isHighlighted }) {
  const { toast } = useToast();
  const daysLeft = daysUntil(job.lastDate);
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const isExpired = daysLeft < 0;

  const categoryColors = {
    state: 'border-blue-500/50 bg-blue-900/20',
    central: 'border-orange-500/50 bg-orange-900/20',
    psu: 'border-teal-500/50 bg-teal-900/20',
    defence: 'border-green-500/50 bg-green-900/20',
    police: 'border-slate-500/50 bg-slate-800/30',
    teaching: 'border-purple-500/50 bg-purple-900/20',
  };

  const categoryLabels = {
    state: 'राज्य सरकार',
    central: 'केंद्र सरकार',
    psu: 'PSU',
    defence: 'रक्षा',
    police: 'पुलिस',
    teaching: 'शिक्षा',
  };

  return (
    <div
      id={job.id}
      className={`relative rounded-xl border ${
        categoryColors[job.category] || 'border-white/20 bg-white/5'
      } ${isHighlighted ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0a1228]' : ''} p-5 hover:bg-white/10 transition-colors`}
    >
      {/* Urgent/Expired badge */}
      {isUrgent && !isExpired && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
          ⏰ {daysLeft === 0 ? 'आज' : daysLeft === 1 ? 'कल' : `${daysLeft} दिन`}
        </div>
      )}
      {isExpired && (
        <div className="absolute top-3 right-3 bg-gray-700 text-white/80 text-xs font-medium px-2 py-1 rounded-full">
          समाप्त
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{job.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/60 bg-white/10 px-2 py-0.5 rounded">
              {categoryLabels[job.category] || job.category}
            </span>
            {job.featured && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                ⭐ विशेष
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-base sm:text-lg leading-snug">
            {job.titleLocal || job.title}
          </h3>
          {job.titleLocal && job.title !== job.titleLocal && (
            <p className="text-white/60 text-xs">{job.title}</p>
          )}
        </div>
      </div>

      {/* Department */}
      <p className="text-white/70 text-sm mb-3">{job.department}</p>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 mb-0.5">📍 स्थान</div>
          <div className="text-white font-medium">{job.location}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 mb-0.5">👥 पद</div>
          <div className="text-white font-medium">{job.vacancies}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 mb-0.5">💰 वेतन</div>
          <div className="text-white font-medium text-[11px]">{job.salary || 'N/A'}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 mb-0.5">📅 अंतिम तिथि</div>
          <div className={`font-medium ${isUrgent ? 'text-red-400' : isExpired ? 'text-gray-400' : 'text-white'}`}>
            {formatDate(job.lastDate)}
          </div>
        </div>
      </div>

      {/* Eligibility */}
      {job.eligibility && (
        <div className="text-xs text-white/60 mb-4">
          <span className="font-semibold text-white/80">योग्यता:</span> {job.eligibility}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] text-white/50">
          पोस्ट: {formatDate(job.postedDate)}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/jobs#${job.id}`;
              const text = `${job.titleLocal || job.title}\n${job.department}\nपद: ${job.vacancies} | अंतिम तिथि: ${formatDate(job.lastDate)}\n\nआवेदन: ${url}`;
              if (navigator.share) {
                navigator.share({ title: job.titleLocal || job.title, text, url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(text)
                  .then(() => toast.success('विवरण कॉपी हो गया — अपने समूह में साझा करें!', 2400))
                  .catch(() => toast.error('कॉपी नहीं हो सका', 2500));
              }
            }}
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg transition-colors"
            title="साझा करें"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            साझा करें
          </button>
          <WhatsAppShareBtn
            title={job.titleLocal || job.title}
            text={`${job.department}\nपद: ${job.vacancies} | अंतिम तिथि: ${formatDate(job.lastDate)}`}
            url={`${window.location.origin}/jobs#${job.id}`}
            compact
          />
          {job.link && !isExpired && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2 rounded-lg transition-all shadow-lg shadow-amber-500/20"
            >
              आवेदन करा
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GovtJobsPage() {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    // Filter out expired jobs (lastDate in the past)
    const filterExpired = (list) => {
      const today = new Date().toISOString().slice(0, 10);
      return list.filter((j) => !j.lastDate || j.lastDate >= today);
    };

    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          const list = data.jobs || [];
          setJobs(filterExpired(list.length > 0 ? list : GOVT_JOBS));
        } else {
          setJobs(filterExpired(GOVT_JOBS));
        }
      } catch {
        setJobs(filterExpired(GOVT_JOBS));
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Handle hash navigation (highlight specific job)
  useEffect(() => {
    const hash = location.hash?.slice(1);
    if (hash) {
      setHighlightedId(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [location.hash, loading]);

  // Sort: upcoming first (by lastDate), then expired
  const sortedJobs = [...jobs].sort((a, b) => {
    const aDate = new Date(a.lastDate);
    const bDate = new Date(b.lastDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aExpired = aDate < today;
    const bExpired = bDate < today;
    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;
    return aDate - bDate;
  });

  const filteredJobs = filter === 'all' 
    ? sortedJobs 
    : sortedJobs.filter((j) => j.category === filter);

  // Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeJobs = jobs.filter((j) => new Date(j.lastDate) >= today);
  const totalVacancies = activeJobs.reduce((sum, j) => sum + (j.vacancies || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a1228] text-white">
      <SEO
        title="सरकारी नौकरी · उत्तराखंड की सरकारी नौकरियाँ | PahadiTube"
        description="उत्तराखंड और देशभर की सरकारी नौकरियों की जानकारी — UKPSC, UKSSSC, पुलिस, वन, शिक्षा और अन्य भर्ती पदों की ताज़ा सूची।"
        path="/jobs"
        keywords="सरकारी नौकरी उत्तराखंड, sarkari naukri, UKPSC, UKSSSC, uttarakhand police recruitment, forest ranger jobs"
      />

      <div className="max-w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="page-header mb-2 flex items-center justify-center gap-3">
            <img src="/art/naukri-chakri.png" alt="Jobs" className="w-8 h-8 object-contain" /> <span className="gradient-text">सरकारी नौकरी</span>
          </h1>
          <p className="text-white/60 text-sm">
            उत्तराखंड और केंद्र सरकार की नौकरी के मौके · ताज़ा सरकारी नौकरी
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 mb-6 text-sm">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-amber-400">{activeJobs.length}</div>
            <div className="text-white/60 text-xs">सक्रिय नौकरियाँ</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-green-400">{totalVacancies.toLocaleString()}</div>
            <div className="text-white/60 text-xs">कुल पद</div>
          </div>
        </div>

        {/* MSME / Self-employment details */}
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-900/15 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-blue-100">एमएसएमई रोजगार विकल्प</h2>
              <p className="text-xs sm:text-sm text-white/70 mt-1">
                सिर्फ सरकारी भर्ती ही नहीं, स्वरोजगार में भी मौके हैं — कीवी जूस, मत्स्य पालन, डेयरी और सहायक मॉडल।
              </p>
            </div>
            <a
              href="/yojana"
              className="shrink-0 text-xs sm:text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
            >
              योजनाएँ देखें
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MSME_ROJGAR_MODELS.map((item) => (
              <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-2">{item.detail}</p>
                <p className="text-xs text-amber-300 mb-1"><strong>निवेश:</strong> {item.investment}</p>
                <p className="text-xs text-white/60"><strong>सहायता:</strong> {item.support}</p>
              </article>
            ))}
          </div>

          <p className="text-[11px] text-white/50 mt-4">
            नोट: निवेश/सहायता के आंकड़े संकेतात्मक हैं और जिले, पात्रता और वर्तमान नीति अधिसूचना के अनुसार बदल सकते हैं।
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === cat.id
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Jobs list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-white/60">कोई नौकरी नी मिली इस श्रेणी मा</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                isHighlighted={highlightedId === job.id}
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-12 text-center text-xs text-white/40 border-t border-white/10 pt-6">
          <p className="mb-2">
            ⚠️ यो जानकारी सिर्फ मदद कु लिए च। आधिकारिक notification जरूर देखा।
          </p>
          <p>
            कुई नौकरी add करणी च? <a href="mailto:info@pahaditube.in" className="text-amber-400 hover:underline">संपर्क करा</a>
          </p>
        </div>
      </div>
    </div>
  );
}
