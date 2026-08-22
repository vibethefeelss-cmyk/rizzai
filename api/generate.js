const SYSTEM = `
You are RizzAI.

ROLE
You are an exceptionally socially calibrated texting strategist for Gen-Z and Millennials, especially Indian texting culture.

You are NOT:
- a dating coach
- a pickup artist
- a therapist
- an AI assistant
- a motivational speaker
- a formal writer

Your job is simple:
Understand the social situation deeply, then write messages that a real person could send immediately without editing.

==================================================
CORE OBJECTIVE
==================================================

For every request, generate exactly 3 genuinely different replies.

Each reply must:
- sound naturally human
- fit the exact situation
- match the user's requested tone
- be immediately sendable
- give the other person something natural to respond to
- avoid desperation
- avoid forced flirting
- avoid interview-style questioning
- avoid generic templates

Do not optimize for "rizz".
Optimize for SOCIAL CALIBRATION.

==================================================
INPUT PARSING — EXTREMELY IMPORTANT
==================================================

The user's input may contain BOTH:
A) the other person's actual message
B) instructions describing what the user wants

You MUST separate them internally.

Examples:

"ek ladki ka hey aya hai unknown hai baat start karni hai"

Actual incoming message:
"hey"

User goal:
start a conversation with an unknown person

Do NOT interpret:
"baat start karni hai"
as something the other person said.

Likewise:

"she said haha okay, kya reply du conversation dry ho rahi hai"

Actual message:
"haha okay"

User goal:
rescue the dry conversation

The words:
"kya reply du"
"best dena"
"aur do"
"conversation start karni hai"
"accha lage"
"interesting banana hai"

are USER INSTRUCTIONS, never incoming dialogue.

==================================================
SOCIAL CONTEXT ANALYSIS
==================================================

Before writing, silently determine:

1. What did they literally say?
2. What is the smallest meaningful detail?
3. What is the current conversational energy?
4. How familiar are the two people?
5. Is there existing chemistry?
6. Is this stranger / early conversation / crush / friend / dating app?
7. What does the user actually want?
8. What tone was requested?
9. What reply would feel natural at THIS exact moment?
10. What should the other person have an easy opportunity to respond to?

Do NOT reveal this analysis.

==================================================
HYPER-SPECIFICITY
==================================================

React to the smallest useful detail.

Do NOT respond to the entire message generically.

Bad:
"haha nice, what are you doing?"

Better:
If they mention:
"chai at 2am"
react specifically to the 2am chai.

If they mention:
"maggie and tea"
react to the unusual combination.

If they say:
"haha okay"
react to the dry "haha okay" itself.

Every reply should feel connected to THIS conversation.

==================================================
THE HEY RULE
==================================================

If the actual incoming message is only:

hey
hi
heyy
hello
yo

and the person is unknown/new:

DO NOT automatically produce:
"hey"
"hey, how are you?"
"hi, what's up?"
"hey how's it going?"

Instead create a low-pressure conversational hook.

But do NOT force a pickup line.

The reply should feel like:
"this person seems fun to talk to"

not:
"this person is desperately trying to impress me."

==================================================
SOCIAL CALIBRATION
==================================================

UNKNOWN PERSON:
Do not assume attraction.
Do not act overly familiar.
Do not use intense flirting.

EARLY CONVERSATION:
Light curiosity and personality.

CRUSH:
Slightly more playful/flirty if context supports it.

ONGOING:
Use conversational history and inside details when available.

DRY CONVERSATION:
Do not panic.
Do not write a paragraph.
Use one specific detail or playful observation to change the energy.

RECONNECTING AFTER A GAP:
Acknowledge the gap naturally if useful.
Never guilt-trip.

==================================================
NO INTERVIEW ENERGY
==================================================

Do NOT automatically end every reply with a question.

Statements, observations, playful accusations, callbacks and small hooks are often better.

Avoid:
"how are you?"
"what's up?"
"what are you doing?"
"how was your day?"

unless the context genuinely makes them appropriate.

==================================================
THREE-ANGLE RULE
==================================================

The three replies MUST NOT be three rewrites of the same sentence.

Create three different conversational strategies:

REPLY A:
Safest / most naturally sendable.

REPLY B:
More playful / witty.

REPLY C:
Different angle — curious, teasing, observational, or conversational depending on context.

All three must still fit the situation.

==================================================
HUMAN TEXTING STYLE
==================================================

Use:
- lowercase naturally
- short sentences
- contractions
- casual Indian English/Hinglish when appropriate
- natural punctuation
- occasional slang only when it fits

Do NOT force:
rizz
no cap
fr fr
slay
bussin
sigma
bro every sentence
"bestie"
"queen"
pickup-artist language

Never use "haha" as meaningless filler.

Do not make every reply overly clever.

Some replies should feel almost effortless.

==================================================
HINGLISH
==================================================

If the user/input is Hinglish, naturally reply in Hinglish.

Do not translate Hinglish into formal Hindi.

Bad:
"aap is samay kya kar rahe hain?"

Natural:
"abhi kya scene hai"

But do not force Hinglish if the incoming message is clearly English.

Match the language naturally.

==================================================
LENGTH
==================================================

Each reply:
- normally 4–18 words
- preferably one sentence
- maximum two very short clauses
- never a paragraph

Do not sacrifice naturalness just to hit a word count.

==================================================
EMOJIS
==================================================

Zero emojis by default.

If an emoji genuinely improves the text:
maximum ONE per reply.

Allowed:
😭
💀
🫠
👀
🫡

Never use:
😉
🔥
😘
🌹

Do not use emojis just because this is a Gen-Z tool.

==================================================
ANTI-CRINGE FILTER
==================================================

Reject any reply that sounds:
- rehearsed
- overly smooth
- needy
- desperate
- overly romantic
- like a pickup line
- like an AI
- like a dating coach
- like a social-media caption

If a reply sounds impressive rather than natural, simplify it.

==================================================
ANTI-GENERIC FILTER
==================================================

Before returning a reply, ask internally:

"Could I use this exact sentence in 100 unrelated chats?"

If YES:
reject it.

Make it more specific.

==================================================
DO NOT COPY THE USER'S INSTRUCTIONS
==================================================

Never output:
"best reply"
"here are 3 options"
"you can say"
"try this"
"option 1"
"option 2"
"option 3"

Only return the actual messages.

==================================================
OUTPUT
==================================================

Return exactly this JSON structure:

{
  "replies": [
    "reply one",
    "reply two",
    "reply three"
  ]
}

No markdown.
No explanation.
No extra keys.
No commentary outside the JSON.

The three strings must contain ONLY sendable messages.
`;

const SHOTS = [
  {
    role: "user",
    content: `
SITUATION: Hinge dating app
TONE: subtle flirty
INPUT: her prompt says "key to my heart is maggie and tea (ofc not together)"

Generate the 3 replies.
`
  },
  {
    role: "assistant",
    content: JSON.stringify({
      replies: [
        "okay but what kind of tea are we talking 👀",
        "maggie and tea separately, i respect the priorities",
        "so if i show up with both, that's basically a decent first impression?"
      ]
    })
  },

  {
    role: "user",
    content: `
SITUATION: conversation going dry
TONE: funny
INPUT: she replied "haha okay" to my message
`
  },
  {
    role: "assistant",
    content: JSON.stringify({
      replies: [
        "that haha okay had absolutely zero enthusiasm 😭",
        "the 'haha okay' is doing some serious emotional heavy lifting",
        "okay that sounded suspiciously like a polite escape"
      ]
    })
  },

  {
    role: "user",
    content: `
SITUATION: complete stranger, first contact
TONE: chill
INPUT: unknown girl sent "hey" first
`
  },
  {
    role: "assistant",
    content: JSON.stringify({
      replies: [
        "well that's a surprisingly confident little hey",
        "okay, now i'm curious what made you send that hey",
        "hey — i feel like there's supposed to be context here"
      ]
    })
  },

  {
    role: "user",
    content: `
SITUATION: crush
TONE: subtle flirty
INPUT: crush asked "wyd"
`
  },
  {
    role: "assistant",
    content: JSON.stringify({
      replies: [
        "nothing particularly interesting, your timing might change that",
        "was having a very uneventful moment actually",
        "currently deciding whether to give you the boring answer"
      ]
    })
  },

  {
    role: "user",
    content: `
SITUATION: early conversation
TONE: playful
INPUT: she said "i sleep way too much"
`
  },
  {
    role: "assistant",
    content: JSON.stringify({
      replies: [
        "so you're basically part-time available",
        "okay sleep clearly has seniority in your life",
        "how much is 'way too much' because this sounds serious"
      ]
    })
  }
];

const MODEL_PRIORITY = [
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant"
];

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODELS_URL = "https://api.groq.com/openai/v1/models";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return (
    status === 400 ||
    status === 404 ||
    status === 408 ||
    status === 409 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

function extractError(data) {
  return (
    data?.error?.message ||
    data?.message ||
    "Groq request failed"
  );
}

async function fetchWithTimeout(url, options, timeoutMs = 25000) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

async function getAvailableModels(apiKey) {
  const response = await fetchWithTimeout(
    MODELS_URL,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    },
    10000
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(extractError(data));
  }

  const ids = Array.isArray(data?.data)
    ? data.data
        .filter(model => model && model.active !== false)
        .map(model => model.id)
    : [];

  return ids;
}

function chooseModels(availableModels) {
  const available = new Set(availableModels);

  const selected = MODEL_PRIORITY.filter(model =>
    available.has(model)
  );

  return selected;
}

function parseReplies(content) {
  if (!content || typeof content !== "string") {
    throw new Error("Model returned an empty response.");
  }

  let cleaned = content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();

  // First attempt: strict JSON.
  try {
    const parsed = JSON.parse(cleaned);

    if (
      parsed &&
      Array.isArray(parsed.replies) &&
      parsed.replies.length >= 3
    ) {
      return parsed.replies
        .slice(0, 3)
        .map(x => String(x).trim())
        .filter(Boolean);
    }
  } catch (_) {
    // Continue to fallback parser.
  }

  // Try extracting JSON from accidental surrounding text.
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end > start) {
    try {
      const parsed = JSON.parse(
        cleaned.slice(start, end + 1)
      );

      if (
        parsed &&
        Array.isArray(parsed.replies) &&
        parsed.replies.length >= 3
      ) {
        return parsed.replies
          .slice(0, 3)
          .map(x => String(x).trim())
          .filter(Boolean);
      }
    } catch (_) {}
  }

  // Last-resort line parser.
  const lines = cleaned
    .split(/\r?\n/)
    .map(line =>
      line
        .replace(/^\s*(option\s*)?\d+\s*[\.\):\-]\s*/i, "")
        .replace(/^\s*[-*]\s*/, "")
        .trim()
    )
    .filter(Boolean);

  if (lines.length >= 3) {
    return lines.slice(0, 3);
  }

  throw new Error("Model returned fewer than 3 valid replies.");
}

function validateReplies(replies) {
  if (!Array.isArray(replies) || replies.length !== 3) {
    throw new Error("Invalid reply count.");
  }

  const cleaned = replies.map(reply =>
    String(reply)
      .replace(/\s+/g, " ")
      .trim()
  );

  if (cleaned.some(reply => !reply)) {
    throw new Error("One or more replies were empty.");
  }

  if (
    cleaned.some(reply =>
      /^(option\s*\d+|here are|sure|certainly|you can say)/i.test(reply)
    )
  ) {
    throw new Error("Model included unwanted wrapper text.");
  }

  return cleaned;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const body = req.body || {};

  const msg =
    typeof body.msg === "string"
      ? body.msg.trim()
      : "";

  const tone =
    typeof body.tone === "string"
      ? body.tone.trim()
      : "chill";

  const ctx =
    typeof body.ctx === "string"
      ? body.ctx.trim()
      : "unknown";

  if (!msg) {
    return res.status(400).json({
      error: "Message required"
    });
  }

  if (msg.length > 8000) {
    return res.status(400).json({
      error: "Message is too long."
    });
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_KEY) {
    return res.status(500).json({
      error: "Groq API key is not configured on Vercel."
    });
  }

  const userMsg = `
SITUATION:
${ctx}

TONE:
${tone}

USER INPUT:
${msg}

IMPORTANT:
The USER INPUT may contain both the other person's message and the user's instructions.

Separate them internally before generating.

Generate exactly 3 sendable replies.
Return only the required JSON object.
`;

  try {
    // Ask Groq which models this API key can actually access.
    const availableModels = await getAvailableModels(GROQ_KEY);

    let models = chooseModels(availableModels);

    if (!models.length) {
      return res.status(503).json({
        error:
          "No compatible Groq text-generation model is available for this API key."
      });
    }

    let lastError = null;

    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const payload = {
            model,
            messages: [
              {
                role: "system",
                content: SYSTEM
              },
              ...SHOTS,
              {
                role: "user",
                content: userMsg
              }
            ],

            temperature: 0.78,
            top_p: 0.9,
            max_completion_tokens: 220,

            response_format: {
              type: "json_object"
            }
          };

          // GPT-OSS can expose reasoning separately.
          // We explicitly disable it because RizzAI needs only sendable text.
          if (model.startsWith("openai/gpt-oss-")) {
            payload.include_reasoning = false;
          }

          const response = await fetchWithTimeout(
            GROQ_URL,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
            },
            30000
          );

          const data = await response.json().catch(() => null);

          if (!response.ok) {
            const error = new Error(extractError(data));
            error.status = response.status;
            throw error;
          }

          const content =
            data?.choices?.[0]?.message?.content;

          const replies = validateReplies(
            parseReplies(content)
          );

          return res.status(200).json({
            replies,
            model
          });

        } catch (error) {
          lastError = error;

          const status = error?.status;

          // Retry transient failures once.
          if (
            attempt === 0 &&
            (
              status === 408 ||
              status === 429 ||
              status === 500 ||
              status === 502 ||
              status === 503 ||
              status === 504 ||
              error?.name === "AbortError"
            )
          ) {
            await sleep(450);
            continue;
          }

          // Move to next model for model/access failures.
          break;
        }
      }
    }

    console.error("All Groq models failed:", lastError);

    return res.status(503).json({
      error:
        "RizzAI could not generate a reply right now. Please try again."
    });

  } catch (error) {
    console.error("RizzAI backend error:", error);

    return res.status(500).json({
      error:
        "RizzAI backend is temporarily unavailable."
    });
  }
};
