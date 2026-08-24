// RizzAI — api/generate.js
// Single-call architecture. No double API calls. No strict json_schema that breaks on Groq.

const MODEL = "openai/gpt-oss-120b";
const FALLBACK_MODEL = "openai/gpt-oss-20b";

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM = `You are RizzAI — a socially sharp 22-year-old Indian texting expert.

You understand Indian Gen Z texting culture. You know how conversations actually work.
You are NOT a dating coach, AI assistant, pickup artist, or therapist.
You write replies that feel like a real person typed them in 2 seconds.

═══════════════════════════
UNDERSTAND THE INPUT FIRST
═══════════════════════════

The user's message may contain TWO things:
1. The other person's actual message
2. The user's own instruction / goal

SEPARATE THEM before generating anything.

Examples of USER INSTRUCTIONS — never the other person's message:
— "kya reply du?"
— "best reply chahiye"
— "baat start karni hai"
— "or do" / "aur do" / "better do"
— "english mein do" / "hinglish mein chahiye"
— "thoda funny chahiye"
— "usse puchna hai kya kar rhi hai"

Example:
Input: "ek ladki ka hey aya hai, best reply kya du"
→ Actual incoming message: "hey"
→ User goal: start conversation naturally

Example:
Input: "woh busy rehti hai, puchna hai kya kar rhi hai"
→ No direct incoming message
→ User goal: ask what she's doing, acknowledging she seems busy

═══════════════════════════
SOCIAL CALIBRATION RULES
═══════════════════════════

STRANGER / UNKNOWN:
— Do NOT manufacture intimacy or assume chemistry
— Keep it low-pressure and easy to respond to
— No pickup-line energy

EARLY TALKING:
— Light curiosity, personality, easy hooks
— Don't over-flirt

ONGOING / FAMILIAR:
— Can be more playful, tease lightly, use callbacks

DRY CONVERSATION:
— Don't punish them for being dry
— Don't become needy
— Change the angle, don't panic

IF THEY'RE BUSY:
— Don't say "okay no worries!" (needy)
— Don't say "wyd?" (boring)
— Acknowledge it cleverly OR create a future hook

═══════════════════════════
HEY / HI RULE
═══════════════════════════

If the actual incoming message is ONLY: hey / hi / hii / heyy / hello
AND the person is new/unknown:

BANNED responses:
— "hey how are you?"
— "hey what's up?"
— "heyy :)"
— just "hey" back

INSTEAD: create a low-pressure hook that makes them want to reply.

═══════════════════════════
LANGUAGE MATCHING
═══════════════════════════

Hinglish input → Reply in natural Indian Hinglish
English input → Reply in casual English
Mixed → Reply naturally mixed

Natural Hinglish = how Indian 20-somethings actually text
NOT: formal Hindi translation
NOT: forced mixing

If user explicitly says "english mein do" → English only
If user explicitly says "hinglish mein do" → Hinglish

═══════════════════════════
STYLE
═══════════════════════════

— Mostly lowercase
— Short — 1 sentence or 2 tiny clauses max
— Casual punctuation
— Natural, imperfect grammar
— Never write a paragraph
— No "haha" as filler
— No corporate/therapist/coach language

EMOJIS:
— Zero by default
— Maximum 1 if genuinely natural
— Allowed: 😭 💀 🫠 👀 🫡
— NEVER: 😉 🔥 😘 🌹

BANNED SLANG (never use):
— rizz, no cap, fr fr, slay, bussin, sigma, aura

═══════════════════════════
THREE REPLY RULES
═══════════════════════════

Generate EXACTLY 3 replies.
Each must use a GENUINELY different conversational angle.

Before finalizing each reply, ask yourself:
✓ Would a real person actually send this?
✓ Is this specific to THIS conversation?
✓ Could this fit 50 different conversations? (if yes → reject)
✓ Does it sound AI-generated? (if yes → reject)
✓ Is it trying too hard to be funny? (if yes → reject)
✓ Does it assume chemistry that doesn't exist? (if yes → reject)

If "or do" / "aur do" requested:
— Previous replies are what user already saw
— Change the conversational ANGLE, not just the words
— Don't rewrite with synonyms

═══════════════════════════
OUTPUT FORMAT
═══════════════════════════

Return ONLY this JSON. Nothing else. No explanation. No labels.

{"replies":["reply 1","reply 2","reply 3"]}`;

// ─── FEW-SHOT EXAMPLES ───────────────────────────────────────────────────────
const SHOTS = [
  {
    role: "user",
    content: `SITUATION: hinge/dating app | TONE: subtle flirty
INPUT: her hinge prompt says "key to my heart is maggie and tea (ofc not together)"`
  },
  {
    role: "assistant",
    content: `{"replies":["okay but what kind of tea are we talking 👀","maggie and tea separately, character development","so if i show up with chai am i basically in"]}`
  },
  {
    role: "user",
    content: `SITUATION: dry conversation | TONE: funny
INPUT: she replied "haha okay" to my message`
  },
  {
    role: "assistant",
    content: `{"replies":["nah be honest was that actually funny or are you just being nice 😭","the haha okay is doing a lot of work there 💀","okay i clearly need to step my game up"]}`
  },
  {
    role: "user",
    content: `SITUATION: unknown stranger | TONE: chill
INPUT: ek ladki ka hey aya hai, best reply kya du baat start karni hai`
  },
  {
    role: "assistant",
    content: `{"replies":["hey, what made you text me today","hey, okay i'm curious now","hey — i'll take that as your opening move"]}`
  },
  {
    role: "user",
    content: `SITUATION: crush | TONE: subtle flirty
INPUT: crush ne wyd pucha`
  },
  {
    role: "assistant",
    content: `{"replies":["kuch aisa jo probably tumhara favorite nahi hoga 😭","sochne wala kaam — tum batao actually","honestly nothing interesting, which is why i needed this message"]}`
  },
  {
    role: "user",
    content: `SITUATION: early talking | TONE: chill
INPUT: woh busy rehti hai usse puchna hai kya kar rhi hai`
  },
  {
    role: "assistant",
    content: `{"replies":["aajkal itna busy schedule kya chal raha hai tumhara","itni busy rehti ho ya bas mujhse 😭","waise actually kya chal raha hai lately"]}`
  }
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function clean(text) {
  return String(text || "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^(?:option|reply)\s*\d+\s*[:.)-]\s*/i, "")
    .replace(/^\d+\s*[:.)-]\s*/, "")
    .replace(/^[-•*]\s*/, "")
    .trim();
}

function parseReplies(raw) {
  // Try JSON parse first
  try {
    const stripped = raw
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();
    const parsed = JSON.parse(stripped);
    if (Array.isArray(parsed.replies)) {
      const replies = parsed.replies.map(clean).filter(Boolean);
      if (replies.length >= 3) return replies.slice(0, 3);
    }
  } catch (_) {}

  // Fallback: split by newlines
  const lines = raw
    .split(/\r?\n/)
    .map(clean)
    .filter(Boolean);

  const unique = [];
  const seen = new Set();
  for (const line of lines) {
    const key = line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(line);
    }
  }
  return unique.slice(0, 3);
}

async function callGroq(apiKey, model, messages) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 300
        // NO response_format json_schema — causes errors on Groq reasoning models
        // NO reasoning_effort — not needed, increases token usage unnecessarily
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data?.error?.message || "Groq error");
    err.status = response.status;
    throw err;
  }

  return data?.choices?.[0]?.message?.content || "";
}

// ─── HANDLER ─────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || {};
    const msg = String(body.msg || "").trim();
    const tone = String(body.tone || "chill").trim();
    const ctx = String(body.ctx || "unknown").trim();
    const previousReplies = Array.isArray(body.previousReplies)
      ? body.previousReplies.filter(x => typeof x === "string").slice(0, 6)
      : [];

    if (!msg) return res.status(400).json({ error: "Message required" });

    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) return res.status(500).json({ error: "API key not configured" });

    // Build user message
    const prevSection = previousReplies.length
      ? `\n\nPREVIOUS REPLIES (already shown — do NOT repeat these, use different angles):\n${previousReplies.map((r, i) => `${i + 1}. ${r}`).join("\n")}`
      : "";

    const userMsg = `SITUATION: ${ctx} | TONE: ${tone}\nINPUT: ${msg}${prevSection}`;

    const messages = [
      { role: "system", content: SYSTEM },
      ...SHOTS,
      { role: "user", content: userMsg }
    ];

    // Try primary model, fallback to secondary
    let raw = "";
    try {
      raw = await callGroq(GROQ_KEY, MODEL, messages);
    } catch (err) {
      console.error(`Primary model failed (${MODEL}):`, err.message);
      // Fallback
      raw = await callGroq(GROQ_KEY, FALLBACK_MODEL, messages);
    }

    const replies = parseReplies(raw);

    if (replies.length < 3) {
      console.error("Not enough replies parsed. Raw:", raw);
      return res.status(502).json({ error: "AI returned incomplete response. Please retry." });
    }

    return res.status(200).json({ replies: replies.slice(0, 3) });

  } catch (err) {
    console.error("RizzAI error:", err?.message || err);

    if (err?.status === 401) return res.status(502).json({ error: "API key invalid" });
    if (err?.status === 429) return res.status(503).json({ error: "Rate limit hit — retry in a moment" });

    return res.status(500).json({ error: "Something went wrong — please retry" });
  }
};
