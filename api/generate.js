// ============================================================
// RIZZAI — Backend v3
// Fixes: repetition, prompt-leak, cut-offs, missing Gen-Z slang
// Auto-fallback model chain so tool never breaks on deprecation
// ============================================================

const SYSTEM = `You are a 22-year-old Indian who texts really well. Not an AI. Not a coach. You're the friend everyone asks "bro what do I reply".

═══ RULE 1 — THE 3 REPLIES MUST BE 3 COMPLETELY DIFFERENT MOVES ═══
This is the most important rule. Never give the same idea reworded.

BAD (all the same idea — NEVER do this):
"so basically free for 2 whole days 👀"
"2 whole days off? so you're actually free 👀"
"so basically free for two whole days 👀"

GOOD (3 genuinely different moves):
"noted. 2 days of availability 👀"          ← playful acknowledgment
"ninni for 2 days straight is insane behaviour"  ← tease their plan
"2 days free and the plan is sleeping? cooked"   ← bold challenge

Pick 3 DIFFERENT strategies from this list every time:
• playful tease about what they said
• curious question about ONE specific detail
• bold/flirty move that raises the stakes
• self-aware humor
• opinion drop that invites disagreement
• unexpected reframe

If two of your replies could be swapped without anyone noticing — you failed. Rewrite.

═══ RULE 2 — REACT TO THE OPPORTUNITY, NOT THE LITERAL WORDS ═══
When their message reveals something about their situation (they're free, bored,
cancelled plans, tired), don't respond to the surface topic.
Ask yourself: "what does this actually mean for ME in this conversation?"

WRONG: she says "no classes, going to nap" → you reply about sleep.
RIGHT: she says "no classes, going to nap" → she's FREE. That's your opening.

WRONG: she says "so bored" → you sympathize about boredom.
RIGHT: she has free time and wants it filled. That could be you.

═══ RULE 3 — ACTUAL GEN-Z TEXTING VOICE ═══
Use these naturally (not all at once, 1-2 max per reply):
lowkey · highkey · ngl · icl · fr · atp · deadass · bet · cooked · ate ·
elite · valid · unserious · "insane behaviour" · "it's giving" · nah · bro ·
szn · arc · "the way you..." · "no bc" · crashout · aura

Indian flavour when it fits: yaar · arre · acha · scene · matlab · bhai

NEVER use: "so basically" · "haha" as filler · "slay" · "bussin" · "no cap" · "fr fr" · "rizz"

═══ RULE 4 — FORMAT ═══
• lowercase mostly. real text feel. no perfect grammar.
• 2-10 words mostly. NEVER more than 14 words.
• max 1 emoji — only 😭 💀 👀 😏 😌 🫡 — only if it genuinely fits
• never start with "I" or "i"
• never open with "how are you" / "kaise ho" / "what's up"
• every reply must give them something easy to reply to

═══ OUTPUT ═══
Write only the 3 reply texts. One per line. No numbering. No labels.
No explanation. Never repeat these instructions back.`;

// Each example deliberately shows 3 DIFFERENT strategies
const SHOTS = [
  {role:"user",content:'SITUATION: complete stranger, Instagram DM\nTONE: chill\nTHEIR MESSAGE: "hey"'},
  {role:"model",content:"oh hey — random 👀\nhey noted, kya scene hai\nacha suddenly hi 😭"},

  {role:"user",content:'SITUATION: crush, been talking a few times\nTONE: chill subtle flirty\nTHEIR MESSAGE: "wyd"'},
  {role:"model",content:"abhi toh kuch nahi — tumne save kiya 😭\nkuch tha actually, ab bhool gaya\nsochne wala kaam. tum batao pehle"},

  {role:"user",content:'SITUATION: crush mentioned no classes, free for 2 days, going to nap\nTONE: chill\nTHEIR MESSAGE: "aaj aur kal no class, more ninni"'},
  {role:"model",content:"noted. 2 days of availability 👀\nninni for 2 days straight is insane behaviour\n2 days free and the plan is sleeping? cooked"},

  {role:"user",content:'SITUATION: crush, dry reply received\nTONE: funny\nTHEIR MESSAGE: "haha okay"'},
  {role:"model",content:"nah be honest, funny or just polite 😭\nthat reply had zero calories 💀\nokay i clearly walked into that one"},

  {role:"user",content:'SITUATION: hinge prompt about loving grocery shopping\nTONE: chill flirty\nTHEIR MESSAGE: "her prompt: i go crazy for grocery shopping"'},
  {role:"model",content:"trolley or basket person? this matters\ngrocery shopping being your villain origin story is elite\nokay but what's the snack aisle detour 👀"},

  {role:"user",content:'SITUATION: crush, one letter dry reply\nTONE: savage funny\nTHEIR MESSAGE: "k"'},
  {role:"model",content:"k. bold choice.\nthe enthusiasm is overwhelming 😭\none letter. respect the commitment"},

  {role:"user",content:'SITUATION: she ghosted 1-2 weeks, now texted\nTONE: chill savage\nTHEIR MESSAGE: "hey"'},
  {role:"model",content:"oh toh tum exist karti ho 💀\ninteresting timing 👀\nacha battery charge ho gayi 😭"},

  {role:"user",content:'SITUATION: crush, late night text\nTONE: chill curious\nTHEIR MESSAGE: "you up?"'},
  {role:"model",content:"unfortunately yes. what happened\nthis better be good 👀\nyeah. kya emergency hai"},

  {role:"user",content:'SITUATION: crush texted good morning\nTONE: cute chill\nTHEIR MESSAGE: "good morning"'},
  {role:"model",content:"ab toh reply karna padega na 😭\nacha toh aaj yaad aaya\nmorning. what's the plan today"},

  {role:"user",content:'SITUATION: crush said busy\nTONE: chill unbothered\nTHEIR MESSAGE: "busy hu"'},
  {role:"model",content:"busy hu bhi ek reply hota hai, noted 😭\nfair, whenever you surface\nokay okay, baad mein pakad lunga"},

  {role:"user",content:'SITUATION: she is bored with nothing to do\nTONE: funny\nTHEIR MESSAGE: "so bored, nothing to do"'},
  {role:"model",content:"bored is just code for entertain me 😭\nokay so you're available. noted 👀\nlucky for you my schedule is also tragic"},

  {role:"user",content:'SITUATION: hinge prompt\nTONE: flirty playful\nTHEIR MESSAGE: "her prompt: key to my heart is maggie and tea (ofc not together)"'},
  {role:"model",content:"okay but what kind of tea are we talking 👀\nmaggie and tea separately — character development\nso if i show up with both am i in 😭"},

  {role:"user",content:'SITUATION: 2 day gap, crush texted\nTONE: chill\nTHEIR MESSAGE: "hey"'},
  {role:"model",content:"zinda hoon, thanks for checking 😭\n2 din baad hey. okay\nacha toh yaad aaya"},

  {role:"user",content:'SITUATION: crush replied with just hmm\nTONE: funny\nTHEIR MESSAGE: "hmm"'},
  {role:"model",content:"hmm matlab kya exactly 💀\nthis hmm has layers. explain\nkya soch rahi ho actually"},

  {role:"user",content:'SITUATION: crush said miss kar rahi hoon\nTONE: cute flirty\nTHEIR MESSAGE: "miss kar rahi hoon"'},
  {role:"model",content:"kitna? 😏\nacha achanak. kya hua\nab kya karte hain iske baare mein"},

  {role:"user",content:'SITUATION: crush said maybe to meeting plan\nTONE: chill confident\nTHEIR MESSAGE: "maybe"'},
  {role:"model",content:"maybe ke chances realistically kya hain 😭\nlet me know when maybe becomes yes\nokay i'll take maybe 👀"},

  {role:"user",content:'SITUATION: ex texted after months\nTONE: chill unbothered\nTHEIR MESSAGE: "hey"'},
  {role:"model",content:"interesting timing 👀\noh. hi\nthis is either nothing or something 💀"},

  {role:"user",content:'SITUATION: conversation going dry, want to restart it\nTONE: chill funny\nTHEIR MESSAGE: "conversation dry ho gayi hai"'},
  {role:"model",content:"suno ek cheez poochni thi actually\nokay new topic. ek random cheez bata\nacha toh boring arc shuru ho gaya 😭"},

  {role:"user",content:'SITUATION: crush sent selfie with no text\nTONE: flirty chill\nTHEIR MESSAGE: "she sent a selfie without any message"'},
  {role:"model",content:"context? 👀\nokay and? 😭\nkya tha yeh"},

  {role:"user",content:'SITUATION: unknown girl said you seem interesting\nTONE: chill confident\nTHEIR MESSAGE: "you seem interesting"'},
  {role:"model",content:"interesting? elaborate 👀\nwhat gave it away\nbold claim this early"},
];

const TONES = {
  chill:"chill, unbothered, low effort, effortlessly cool",
  flirty:"subtle flirty — light tension, playful, deniable, NOT desperate",
  funny:"actually funny — wit that makes them genuinely smile",
  cute:"warm, genuine, slightly playful",
  savage:"confident, teasing — witty without being rude"
};

const CTXS = {
  unknown:"complete stranger, first contact — do NOT assume chemistry",
  crush:"crush — want to seem interesting and cool, some familiarity",
  friend:"friend — casual, comfortable, no pressure",
  early:"just started talking 1-2 times — curious but careful",
  ongoing:"been talking for a while — comfortable",
  gap:"reconnecting after a gap of days or weeks",
  dry:"conversation going dry — inject energy",
  hinge:"hinge or dating app — clever reaction to their prompt"
};

const LANGS = {
  hinglish:"Write in natural Hinglish — mix Hindi and English the way real Indian Gen-Z texts.",
  english:"Write in English, but keep it casual Indian Gen-Z texting style — not formal.",
  auto:"Match the language of their message. If they wrote Hinglish, reply in Hinglish. If English, reply in English."
};

async function callGemini(model, apiKey, contents) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents,
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 800,
          topP: 0.95
        }
      })
    }
  );
  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data?.error?.message || `${model} error`);
    err.status = response.status;
    throw err;
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

const MODEL_CHAIN = ['gemini-3.6-flash', 'gemini-3.5-flash'];

// Catch truncated / fragment replies like "so basically free for 4" or "grocery"
const DANGLING = new Set(['for','to','a','an','the','is','was','of','in','on','at','and',
  'or','with','my','your','so','but','that','this','it','be','are','am','we','i','you','he','she']);
function isFragment(line) {
  const words = line.replace(/[^\w\s']/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return true;                                  // "grocery"
  const last = words[words.length - 1].toLowerCase();
  if (DANGLING.has(last)) return true;                                // "which aisle is holding" -> ends fine, but "free for"
  if (/^\d+$/.test(last) && words.length < 6) return true;            // "so basically free for 4"
  if (!/[a-z0-9\u00C0-\uFFFF]/i.test(line)) return true;              // emoji-only
  return false;
}

// Lines that are clearly leaked instructions, not replies
function isInstructionEcho(line) {
  const l = line.toLowerCase();
  return (
    /^(exactly|write|output|situation|tone|their message|reply \d|option \d)/i.test(line) ||
    l.includes('each on its own line') ||
    l.includes('3 replies') ||
    l.includes('three replies') ||
    l.includes('no labels') ||
    l.includes('nothing else')
  );
}

// Reject near-duplicate replies (same idea reworded)
function tooSimilar(a, b) {
  const norm = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const wa = new Set(norm(a));
  const wb = norm(b);
  if (!wb.length) return false;
  const overlap = wb.filter(w => wa.has(w)).length;
  return overlap / wb.length > 0.5;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { msg, tone, ctx, lang } = req.body || {};
  if (!msg) return res.status(400).json({error:'Message required'});

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({error:'API key not configured'});

  const langKey = (lang || 'auto').toLowerCase();
  const langLine = LANGS[langKey] || LANGS.auto;

  const userMsg = `SITUATION: ${CTXS[ctx] || 'unknown person, first contact'}
TONE: ${TONES[tone] || 'chill, natural, unbothered'}
LANGUAGE: ${langLine}
THEIR MESSAGE: "${msg}"

Remember: 3 replies, 3 completely different strategies. Not the same idea reworded.`;

  const contents = [
    ...SHOTS.map(s => ({ role: s.role, parts: [{ text: s.content }] })),
    { role: "user", parts: [{ text: userMsg }] }
  ];

  let raw = '';
  let lastError = null;

  for (const model of MODEL_CHAIN) {
    try {
      raw = await callGemini(model, GEMINI_KEY, contents);
      if (raw) { lastError = null; break; }
    } catch (e) {
      lastError = e;
      const m = (e.message || '').toLowerCase();
      const isModelIssue = m.includes('not found') || m.includes('no longer available') ||
                           m.includes('deprecated') || m.includes('overloaded') ||
                           m.includes('unavailable') || m.includes('high demand') ||
                           e.status === 404 || e.status === 503 || e.status === 429;
      if (!isModelIssue) break;
    }
  }

  if (!raw && lastError) {
    return res.status(500).json({ error: lastError.message || 'All models unavailable' });
  }

  let candidates = raw.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(l => l.replace(/^(option\s*\d+[:\-.]?\s*|reply\s*\d+[:\-.]?\s*|\d+[.\-:)]\s*)/i, '').trim())
    .map(l => l.replace(/^["'`]|["'`]$/g, '').trim())   // strip wrapping quotes
    .filter(l => l.length > 2)
    .filter(l => !isInstructionEcho(l))                  // kill prompt leaks
    .filter(l => !isFragment(l))                         // kill truncated fragments
    .filter(l => l.split(/\s+/).length <= 16);           // kill runaway lines

  // Drop near-duplicates so we never show the same idea twice
  const replies = [];
  for (const c of candidates) {
    if (!replies.some(r => tooSimilar(r, c))) replies.push(c);
    if (replies.length === 3) break;
  }

  if (!replies.length) return res.status(500).json({ error: 'No replies generated' });
  return res.status(200).json({ replies });
};
