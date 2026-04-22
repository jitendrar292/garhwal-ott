// Golden evaluation set for PahadiAI quality regression tests.
//
// Each case represents a known failure mode or a behaviour we want to lock in.
// Run via:  npm run eval         (from server/)
//
// Assertion fields (all optional except `query`):
//   query        — the user message to send
//   category     — short label for grouping in the report
//   lang         — expected reply language: 'gw' | 'hi' | 'en' (informational)
//   mustContain  — array of substrings or RegExp that MUST appear in reply
//   mustNotContain — array of substrings or RegExp that MUST NOT appear
//   maxChars     — soft cap on reply length (greetings should be short)
//   minChars     — soft floor (factual answers should not be one-liners)
//   notes        — human-readable description of why this case matters
//
// Add new cases when you find a regression in production. The scoring is
// strict (any failed assertion = case fails) so we surface real issues fast.

module.exports = [
  // ── Greetings (must stay SHORT, 1–2 lines, in Garhwali) ──────────────
  {
    id: 'greet-namaste',
    query: 'नमस्कार',
    category: 'greeting',
    lang: 'gw',
    maxChars: 200,
    mustNotContain: [/केदारनाथ/, /बद्रीनाथ/, /हरेला/, /चार धाम/],
    notes: 'Greeting only — no extra cultural info dumps.',
  },
  {
    id: 'greet-hello-en',
    query: 'hello',
    category: 'greeting',
    lang: 'gw',
    maxChars: 200,
    mustContain: [/नमस्कार|राम-राम|जय/],
    mustNotContain: [/केदारनाथ/, /हरेला/, /Negi/],
  },
  {
    id: 'greet-kaise-ho',
    query: 'tum kaise ho',
    category: 'greeting',
    lang: 'gw',
    maxChars: 250,
    mustContain: [/छां|छूं|छौं/],
    mustNotContain: [/केदारनाथ/, /हरेला/, /फूलदेई/],
  },

  // ── Cuisine — कापा/काफुली MUST be vegetarian (CRITICAL) ─────────────
  {
    id: 'food-kafuli-veg',
    query: 'काफुली कैसे बनती है?',
    category: 'cuisine',
    lang: 'gw',
    mustContain: [/पालक|मेथि|हरि|पत्तेदार|मंडुवा|गेहूं|शाकाहारी/],
    // Same rationale as food-kapa-veg: a correct answer may legitimately say
    // "मांस सी कभी नी बण्दु". Catch only unambiguously wrong claims.
    mustNotContain: [/(?<!\s)(मटन|चिकन|बकरा का मांस|चिकन से बण|मटन से बण)/],
    notes: 'काफुली is strictly vegetarian — green leaves + flour, never meat.',
  },
  {
    id: 'food-kapa-veg',
    query: 'kapa kaise banaye',
    category: 'cuisine',
    lang: 'gw',
    // Positive evidence: must affirm vegetarian or list veg ingredients.
    // We don't ban /मांस/ outright because a correct answer often says
    // "मांस सी कभी नी बण्दु" (never made with meat) — that's the right answer.
    mustContain: [/शाकाहारी|पालक|मेथि|हरी|पत्तेदार|मंडुवा|गेहूं/],
    mustNotContain: [/(?<!नी |कभी नी |नहीं |without )(मटन|चिकन|बकर[ेा] का मांस)/],
  },
  {
    id: 'food-phaanu',
    query: 'फाणू क्या है',
    category: 'cuisine',
    lang: 'gw',
    mustContain: [/उड़द|दाल/],
  },
  {
    id: 'food-mandwa',
    query: 'mandwa ki roti ke baare mein bata',
    category: 'cuisine',
    lang: 'gw',
    mustContain: [/मंडुवा|कोदु|मंडवा/],
  },

  // ── News intent — MUST refuse politely if no news in context ────────
  {
    id: 'news-no-fabrication',
    query: 'aaj kal uttarakhand mein kya ho raha hai',
    category: 'news',
    mustContain: [/News|समाचार|खबर|\/news/],
    mustNotContain: [/केदारनाथ डोली/, /तुंगनाथ डोली/, /भूस्खलन/, /चुनाव/, /मरने/],
    notes: 'Without real news context, must refuse. Never fabricate events.',
  },
  {
    id: 'news-latest',
    query: 'koi taza khabar bata',
    category: 'news',
    mustNotContain: [/2024/, /2025/, /\d{1,2} (जनवरी|फरवरी|मार्च|अप्रैल|मई)/, /प्रधानमंत्री.*दौरा/],
    notes: 'Must not invent specific dates/events.',
  },

  // ── Translation intent — Garhwali output regardless of input lang ───
  {
    id: 'trans-en-to-gw-1',
    query: 'how do you say "I am going to the village" in garhwali',
    category: 'translate',
    lang: 'gw',
    mustContain: [/गाँव|गौं/, /जां|जौं/],
  },
  {
    id: 'trans-hi-to-gw-1',
    query: 'translate to garhwali: मैं ठीक हूँ',
    category: 'translate',
    lang: 'gw',
    mustContain: [/छूं|छौं/],
  },
  {
    id: 'trans-thanks',
    query: 'thank you in garhwali',
    category: 'translate',
    lang: 'gw',
    mustContain: [/धन्यवाद|आभार/],
  },

  // ── Roman-Garhwali detection → must reply in Devanagari Garhwali ────
  {
    id: 'roman-gw-1',
    query: 'duur ka matlab kya hai',
    category: 'roman-detect',
    lang: 'gw',
    mustContain: [/दूर/],
  },
  {
    id: 'roman-gw-2',
    query: 'kakh ja rou che',
    category: 'roman-detect',
    lang: 'gw',
    mustContain: [/कख|कं/],
  },

  // ── Pronoun correctness (तू / तैं / तैर — not तुम / तुम्हें / तुम्हारा) ──
  {
    id: 'pronoun-tu',
    query: 'तुम कैसे हो garhwali mein',
    category: 'grammar',
    lang: 'gw',
    mustContain: [/तु|तू/],
    mustNotContain: [/तुम कैसे हो/],
  },

  // ── Folk-tale knowledge (ground truth from himlingo corpus) ─────────
  {
    id: 'folk-jeetu-bagdwal',
    query: 'जीतू बगडवाल कौन था?',
    category: 'folk-story',
    minChars: 80,
    mustContain: [/जीतू|बगडवाल|बगड्वाल/],
  },
  {
    id: 'folk-tilu-rauteli',
    query: 'tilu rauteli ke baare mein bata',
    category: 'folk-story',
    minChars: 80,
    mustContain: [/तीलू|तिलू|रौतेली|रौतेलि/],
  },

  // ── Refuse to fabricate facts about specific people / places ─────────
  {
    id: 'refuse-unknown-person',
    query: 'pahaditube ke ceo kaun hain',
    category: 'refuse',
    maxChars: 400,
    mustNotContain: [/(?:सीईओ|CEO).*(?:जी|श्री|डॉ)/],
    notes: 'Should not invent a name for the CEO.',
  },

  // ── Festivals (real, well-known — model SHOULD know these) ──────────
  {
    id: 'festival-harela',
    query: 'हरेला त्योहार के बारे में बताओ',
    category: 'festival',
    lang: 'gw',
    minChars: 100,
    mustContain: [/हरेला/, /पेड़|बृक्ष|पौध/],
  },
  {
    id: 'festival-phooldei',
    query: 'phooldei festival kya hai',
    category: 'festival',
    minChars: 80,
    mustContain: [/फूलदेई|फूल/],
  },

  // ── Music / culture (Negi ji, jagar, etc.) ───────────────────────────
  {
    id: 'music-negi',
    query: 'narendra singh negi ke baare mein bata',
    category: 'music',
    minChars: 100,
    mustContain: [/नेगी/, /गायक|गीत|संगीत/],
  },
  {
    id: 'music-jagar',
    query: 'जागर क्या होता है?',
    category: 'music',
    minChars: 60,
    mustContain: [/जागर/],
  },

  // ── Scope discipline — short Q must get short A ──────────────────────
  {
    id: 'scope-short-yes-no',
    query: 'क्या आज बारिश होगी?',
    category: 'scope',
    maxChars: 400,
    notes: 'Should not weather-forecast (no real-time data) — short refusal.',
  },

  // ── Out-of-scope (programming question — should redirect politely) ──
  {
    id: 'oos-programming',
    query: 'how do I write a python loop',
    category: 'out-of-scope',
    maxChars: 400,
    mustNotContain: [/```/, /for i in range/, /def /],
    notes: 'PahadiAI is for Garhwali culture, not coding help.',
  },

  // ── Identity ─────────────────────────────────────────────────────────
  {
    id: 'identity-name',
    query: 'tumhara naam kya hai',
    category: 'identity',
    lang: 'gw',
    mustContain: [/पहाड़ी AI|पहाड़ी ai/i],
  },

  // ── Grammar: future tense ───────────────────────────────────────────
  {
    id: 'grammar-future',
    query: 'translate to garhwali: कल हम स्कूल जाएंगे',
    category: 'grammar',
    lang: 'gw',
    mustContain: [/भोळ|कल/, /जौंला|जांला|जाला/],
  },

  // ── Family kinship (Garhwali terms, not Hindi) ──────────────────────
  {
    id: 'family-mother',
    query: 'maa ko garhwali mein kya kehte hain',
    category: 'kinship',
    mustContain: [/ब्वे|ईजा|आमा/],
  },
  {
    id: 'family-elder-brother',
    query: 'bade bhai ko garhwali mein',
    category: 'kinship',
    mustContain: [/दज्यु|दादा/],
  },

  // ── Time words ──────────────────────────────────────────────────────
  {
    id: 'time-tomorrow',
    query: 'kal (future) garhwali mein',
    category: 'time',
    mustContain: [/भोळ/],
  },
  {
    id: 'time-yesterday',
    query: 'kal (beeta hua) garhwali mein',
    category: 'time',
    mustContain: [/ब्याळि/],
  },
];
