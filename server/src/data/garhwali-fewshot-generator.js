// Programmatic Hindi → Garhwali few-shot generator.
// Uses small grammar tables (subjects × verbs × places/objects) to produce
// hundreds of grammatically-consistent training pairs without hand-writing each.
//
// Output shape: [{ hi, gw }, ...]  — same as garhwali-fewshot.js
//
// Why this matters: the more concrete subject↔verb↔auxiliary patterns the LLM
// sees, the less it falls back to Hindi morphology like "है / करते हैं / के साथ".

// ===== 1. Subjects with their Hindi + Garhwali forms =====
// Each subject carries the auxiliary form for "be" (है/हूँ/हो) and the
// continuous-aspect particle ("रहा हूँ" / "रौ छूं") so we can compose verbs.
const SUBJECTS = [
  // pronoun, hi, gw, hi_aux_present_continuous, gw_aux_present_continuous
  { hi: 'मैं',  gw: 'मै',  hiCont: 'रहा हूँ',  gwCont: 'रौ छूं', hiSimple: 'हूँ', gwSimple: 'छूं' },
  { hi: 'तुम',  gw: 'तु',  hiCont: 'रहे हो',   gwCont: 'रौ छ',  hiSimple: 'हो',  gwSimple: 'छ'   },
  { hi: 'वह',   gw: 'उ',   hiCont: 'रहा है',   gwCont: 'रौ छ',  hiSimple: 'है',  gwSimple: 'छ'   },
  { hi: 'हम',   gw: 'हम',  hiCont: 'रहे हैं',  gwCont: 'रौं छां',gwSimple: 'छां', hiSimple: 'हैं' },
];

// ===== 2. Verbs (action stems) with their continuous & habitual conjugations =====
// hi: stem used in "X रहा है" — e.g. "जा" → "जा रहा है"
// gw: stem used in "X रौ छ" — e.g. "जां" → "जां रौ छ"
const VERBS = [
  { hiStem: 'जा',  gwStem: 'जां',     hiHabit: 'जाता', gwHabit: 'जांदा',  meaning: 'go'   },
  { hiStem: 'खा',  gwStem: 'खां',     hiHabit: 'खाता', gwHabit: 'खांदा',  meaning: 'eat'  },
  { hiStem: 'कर',  gwStem: 'करण',     hiHabit: 'करता', gwHabit: 'करदा',   meaning: 'do'   },
  { hiStem: 'देख', gwStem: 'देखण',   hiHabit: 'देखता', gwHabit: 'देखदा',  meaning: 'see'  },
  { hiStem: 'सुन', gwStem: 'सुणण',   hiHabit: 'सुनता', gwHabit: 'सुणदा',  meaning: 'hear' },
  { hiStem: 'बोल', gwStem: 'बोलण',   hiHabit: 'बोलता', gwHabit: 'बोल्दा', meaning: 'speak'},
  { hiStem: 'पढ़', gwStem: 'पढ़ण',   hiHabit: 'पढ़ता', gwHabit: 'पढ़दा',  meaning: 'read' },
  { hiStem: 'लिख', gwStem: 'लिखण',   hiHabit: 'लिखता', gwHabit: 'लिखदा', meaning: 'write'},
];

// ===== 3. Places / objects (with locative postposition) =====
// hi uses "में"; Garhwali uses "म".
const PLACES = [
  { hi: 'घर',     gw: 'घर'     },
  { hi: 'बाजार',  gw: 'बजार'   },
  { hi: 'खेत',    gw: 'खेत'    },
  { hi: 'स्कूल',  gw: 'स्कूल'  },
  { hi: 'मंदिर',  gw: 'मंदिर'  },
  { hi: 'गाँव',    gw: 'गाँव'   },
  { hi: 'जंगल',   gw: 'जंगल'   },
];

// Generic objects for verbs that take direct objects (खा / देख / पढ़ / लिख)
const OBJECTS = [
  { hi: 'खाना',    gw: 'खाण',    forVerbs: ['खा'] },
  { hi: 'रोटी',    gw: 'रोटी',   forVerbs: ['खा'] },
  { hi: 'फल',      gw: 'फल',     forVerbs: ['खा'] },
  { hi: 'किताब',   gw: 'किताब',  forVerbs: ['पढ़', 'देख', 'लिख'] },
  { hi: 'गीत',     gw: 'गीत',    forVerbs: ['सुन', 'बोल'] },
  { hi: 'समाचार',  gw: 'समाचार', forVerbs: ['सुन', 'देख', 'पढ़'] },
];

// ===== 4. Adjective patterns (X is Y) =====
const ADJECTIVES = [
  { hiThing: 'पानी',   gwThing: 'पाणी',   hiAdj: 'ठंडा',     gwAdj: 'ठंडो'    },
  { hiThing: 'खाना',   gwThing: 'खाण',    hiAdj: 'स्वादिष्ट', gwAdj: 'स्वादिष्ट' },
  { hiThing: 'मौसम',   gwThing: 'मौसम',   hiAdj: 'अच्छा',    gwAdj: 'बढ़िया'   },
  { hiThing: 'दिन',    gwThing: 'दिन',    hiAdj: 'सुंदर',    gwAdj: 'सुंदर'    },
  { hiThing: 'गाँव',    gwThing: 'गाँव',    hiAdj: 'शांत',     gwAdj: 'शांत'     },
  { hiThing: 'बच्चा',  gwThing: 'छोरु',   hiAdj: 'खुश',      gwAdj: 'खुश'      },
  { hiThing: 'काम',    gwThing: 'काम',    hiAdj: 'मुश्किल',  gwAdj: 'मुश्किल'  },
  { hiThing: 'रास्ता', gwThing: 'रस्तो',  hiAdj: 'लंबा',     gwAdj: 'लाम्बो'   },
];

// ===== 5. Generators =====

// Verbs that make sense with a *place* (locative). Only motion / activity
// verbs go here — "बाजार खाना" or "स्कूल बोलना" makes no sense.
const PLACE_COMPATIBLE_VERBS = new Set(['जा', 'कर', 'देख']);

/** Subject + Place + Verb (continuous) — "मैं घर जा रहा हूँ" → "मै घर जां रौ छूं" */
function genContinuous() {
  const out = [];
  for (const s of SUBJECTS) {
    for (const v of VERBS) {
      if (!PLACE_COMPATIBLE_VERBS.has(v.hiStem)) continue;
      for (const p of PLACES) {
        out.push({
          hi: `${s.hi} ${p.hi} ${v.hiStem} ${s.hiCont}।`,
          gw: `${s.gw} ${p.gw} ${v.gwStem} ${s.gwCont}।`,
        });
      }
    }
  }
  return out;
}

/** Subject + Object + Verb (continuous) — "मैं किताब पढ़ रहा हूँ" → "मै किताब पढ़ण रौ छूं" */
function genObjectContinuous() {
  const out = [];
  for (const s of SUBJECTS) {
    for (const v of VERBS) {
      const objs = OBJECTS.filter((o) => o.forVerbs.includes(v.hiStem));
      for (const o of objs) {
        out.push({
          hi: `${s.hi} ${o.hi} ${v.hiStem} ${s.hiCont}।`,
          gw: `${s.gw} ${o.gw} ${v.gwStem} ${s.gwCont}।`,
        });
      }
    }
  }
  return out;
}

/** Subject + Place + Verb (habitual) — "मैं घर जाता हूँ" → "मै घर जांदा छूं" */
function genHabitual() {
  const out = [];
  for (const s of SUBJECTS) {
    for (const v of VERBS) {
      if (!PLACE_COMPATIBLE_VERBS.has(v.hiStem)) continue;
      for (const p of PLACES) {
        out.push({
          hi: `${s.hi} ${p.hi} ${v.hiHabit} ${s.hiSimple}।`,
          gw: `${s.gw} ${p.gw} ${v.gwHabit} ${s.gwSimple}।`,
        });
      }
    }
  }
  return out;
}

/** Adjectival sentences — "यह पानी ठंडा है" → "यो पाणी ठंडो छ" */
function genAdjective() {
  return ADJECTIVES.map((a) => ({
    hi: `यह ${a.hiThing} ${a.hiAdj} है।`,
    gw: `यो ${a.gwThing} ${a.gwAdj} छ।`,
  }));
}

/** Negation pattern — "मैं घर नहीं जा रहा हूँ" → "मै घर नि जां रौ छूं" */
function genNegation() {
  const out = [];
  for (const s of SUBJECTS) {
    for (const v of VERBS) {
      if (!PLACE_COMPATIBLE_VERBS.has(v.hiStem)) continue;
      for (const p of PLACES.slice(0, 4)) {
        out.push({
          hi: `${s.hi} ${p.hi} नहीं ${v.hiStem} ${s.hiCont}।`,
          gw: `${s.gw} ${p.gw} नि ${v.gwStem} ${s.gwCont}।`,
        });
      }
    }
  }
  return out;
}

// Deduplicate by `hi` (different generators can produce the same Hindi)
function dedupe(pairs) {
  const seen = new Set();
  const out = [];
  for (const p of pairs) {
    if (seen.has(p.hi)) continue;
    seen.add(p.hi);
    out.push(p);
  }
  return out;
}

function generateAll() {
  return dedupe([
    ...genContinuous(),
    ...genObjectContinuous(),
    ...genHabitual(),
    ...genAdjective(),
    ...genNegation(),
  ]);
}

module.exports = {
  generateAll,
  // Exported for tests / inspection
  genContinuous,
  genObjectContinuous,
  genHabitual,
  genAdjective,
  genNegation,
  SUBJECTS,
  VERBS,
  PLACES,
  OBJECTS,
};
