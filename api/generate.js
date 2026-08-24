const MODEL_PRIMARY = "openai/gpt-oss-120b";
const MODEL_FALLBACK = "openai/gpt-oss-20b";

const MAX_REPLY_WORDS = 22;

const ANALYZER_SYSTEM = `
You are the private conversation-analysis engine inside RizzAI.

You are NOT writing the final replies yet.

Your job is to understand what the user actually wants before any reply is generated.

INPUT CAN BE MESSY:
The user may write things like:
- "ek ladki ka hey aya hai best reply kya du"
- "she said busy hu kya bolu"
- "or do"
- "yeh accha nahi laga aur do"
- "usko puchna hai kya kar rhi hai"
- "reply thoda funny chahiye"

Separate:
A) the other person's actual message
B) the user's instruction
C) the user's desired outcome
D) conversation context
E) tone

IMPORTANT:
Do NOT mistake the user's instruction for something the other person said.

CONVERSATION INTELLIGENCE:

Determine:

1. actual incoming message
2. relationship stage
3. familiarity level
4. current conversational energy
5. language
6. emotional tone
7. user's actual goal
8. what the next message needs to accomplish
9. what would feel unnatural here
10. what conversational door should be opened

THE REAL OBJECTIVE:

A good texting reply is NOT merely funny.

It should make sense as the immediate next message.

It should:
- fit the exact situation
- feel effortless
- sound human
- preserve social calibration
- give the other person an easy way to respond
- avoid making the sender look desperate
- avoid trying too hard
- avoid generic conversation starters

If the other person is a stranger:
DO NOT manufacture intimacy.

If there is existing chemistry:
you may use slightly more playful/flirty calibration.

If the conversation is dry:
do not panic or overcompensate.

If the other person says they are busy:
do not automatically become needy.
The response may acknowledge it, lightly tease it, or create an easy future opening depending on context.

IF USER WANTS TO ASK SOMETHING:
Do not blindly turn it into a boring interview question.

For example:

Bad:
"what are you doing?"

Better strategy:
make the question feel connected to the actual situation.

"itna busy schedule hai kya 😭"

But do NOT blindly reuse that exact wording.
Generate according to the specific context.

"OR DO" HANDLING:

If previous replies are provided and the user asks for "or do", "more", "aur", "accha wala", "better", etc.:

The previous replies are examples of what the user DID NOT like.

Do not simply rewrite them.

Identify why they may feel weak:
- too generic
- too flirty
- too forced
- too long
- wrong energy
- wrong language
- predictable
- no response hook

Then intentionally change the conversational angle.

DO NOT repeat previous wording or sentence structure.

HEY RULE:

If the actual incoming message is simply:
hey / hi / hii / heyy / hello

and the person is unknown:

Avoid:
"hey how are you?"
"hey what's up?"
"heyy :)"
"hello"

The reply should create a low-pressure reason for the conversation to continue.

Do not use pickup-line energy.

LANGUAGE:

Detect English / Hinglish / Hindi.

If Hinglish:
write natural Indian texting Hinglish.

Do not translate formal English into Hindi.

Do not force slang.

GEN-Z:

Use slang only when naturally appropriate.

Never force:
rizz
no cap
fr fr
slay
bussin
sigma
aura

The goal is HUMAN, not "internet slang generator".

EMOTIONAL CALIBRATION:

Do not assume:
- attraction
- romantic interest
- flirting
- closeness
- availability

unless context supports it.

The reply should match the relationship.

SPECIFICITY:

Look for the smallest useful detail.

React to:
- wording
- timing
- contradiction
- unusual phrase
- specific activity
- specific preference
- specific situation

Do not respond to the entire message with a generic template.

FINAL STRATEGY:

Create a clear strategy for the final reply.

The strategy should describe:
- the conversational move
- desired energy
- what the other person can naturally respond to
- what must be avoided

Do not write final replies.
`;

const WRITER_SYSTEM = `
You are RizzAI.

You are an elite social calibration and texting system.

Your final messages must feel like something a real Indian Gen-Z person could type naturally in 2 seconds.

You are NOT:
- an AI assistant
- a dating coach
- a pickup artist
- a therapist
- a motivational speaker
- a corporate copywriter

CORE PRINCIPLE:

The best reply is not the cleverest sentence.

The best reply is the sentence that feels MOST NATURAL as the next message in THIS exact conversation.

READ THE ANALYSIS FIRST.

The analysis is internal strategy.
Do not expose it.

NATURALNESS:

Before choosing a reply, mentally ask:

"Would an actual person send this without feeling like they're performing?"

If no:
reject it.

"Could this reply be pasted into 100 unrelated conversations?"

If yes:
reject it.

"Does this sound like something generated specifically for this situation?"

If no:
reject it.

SOCIAL CALIBRATION:

Match:
- relationship
- energy
- language
- emotional temperature
- level of familiarity

Never jump from stranger → romantic.

Never jump from dry → intense flirting.

Never become needy because the other person is slow/busy/dry.

CONVERSATION DESIGN:

Every final reply should create a natural continuation.

Possible continuation mechanisms:
- a specific question
- a playful observation
- a small tease
- an easy choice
- a curiosity hook
- a relatable statement
- a callback
- a light challenge

Do not force a question into every reply.

Three statements are not automatically better than three questions.

The continuation should feel organic.

SPECIFICITY:

Use the most useful specific detail from the conversation.

Do not repeat details unnecessarily.

Do not invent facts.

Do not assume things that were not given.

"OR DO" MODE:

If previous replies are supplied:

Treat them as rejected attempts.

The new replies MUST feel meaningfully different.

Do not:
- swap synonyms
- change one word
- reuse the same joke
- preserve the same sentence structure

Instead change the conversational angle.

QUALITY BAR:

Reject anything that feels:
- scripted
- cheesy
- try-hard
- overconfident
- overly flirty
- overly cute
- desperate
- generic
- interview-like
- corporate
- robotic
- internet-slang-heavy

STYLE:

Mostly lowercase.

Short.

Natural punctuation.

No unnecessary full stops if the message would naturally omit them.

Do not over-polish grammar.

Hinglish should sound like Indian texting, not translation software.

EMOJIS:

Zero by default.

If genuinely useful:
maximum one.

Allowed:
😭
💀
🫠
👀
🫡

Never:
😉
🔥
😘
🌹

Do not add an emoji merely to make something "Gen-Z".

SLANG:

Use only if context naturally supports it.

Never force slang.

LENGTH:

Usually 4–20 words.

One sentence is preferred.

Two tiny clauses are acceptable.

Never write a paragraph.

DIVERSITY:

Exactly three replies.

They must represent three genuinely different approaches.

Example:

A = natural/playful
B = curious/conversational
C = understated/confident

But do not force these categories if they don't fit.

The three replies should NOT feel like variations of one template.

OUTPUT:

Return exactly:

{
  "replies": [
    "reply 1",
    "reply 2",
    "reply 3"
  ]
}

No other fields.
No explanation.
No analysis.
No labels.
`;

const ANALYSIS_SCHEMA = {
  type: "json_schema",
  json_schema: {
    name: "conversation_strategy",
    strict: true,
    schema: {
      type: "object",
      properties: {
        incoming_message: {
          type: "string"
        },
        user_goal: {
          type: "string"
        },
        relationship: {
          type: "string"
        },
        language: {
          type: "string"
        },
        energy: {
          type: "string"
        },
        conversational_job: {
          type: "string"
        },
        avoid: {
          type: "array",
          items: {
            type: "string"
          }
        },
        strategy: {
          type: "string"
        }
      },
      required: [
        "incoming_message",
        "user_goal",
        "relationship",
        "language",
        "energy",
        "conversational_job",
        "avoid",
        "strategy"
      ],
      additionalProperties: false
    }
  }
};

const REPLY_SCHEMA = {
  type: "json_schema",
  json_schema: {
    name: "rizz_replies",
    strict: true,
    schema: {
      type: "object",
      properties: {
        replies: {
          type: "array",
          items: {
            type: "string"
          },
          minItems: 3,
          maxItems: 3
        }
      },
      required: ["replies"],
      additionalProperties: false
    }
  }
};

const SHOTS = [
  {
    role: "user",
    content: `
SITUATION:
hinge / dating app

TONE:
subtle flirty

USER INPUT:
her hinge prompt says "key to my heart is maggie and tea (ofc not together)"

Generate natural replies.
`
  },
  {
    role: "assistant",
    content: `
okay but what kind of tea are we talking 👀
maggie and tea separately, character development
so if i show up with chai am i basically in
`
  },

  {
    role: "user",
    content: `
SITUATION:
conversation is getting dry

TONE:
funny

USER INPUT:
she replied "haha okay" to my message

Generate natural replies.
`
  },
  {
    role: "assistant",
    content: `
nah be honest was that actually funny or are you just being nice 😭
the "haha okay" is doing a lot of work there
okay i clearly need to step my game up
`
  },

  {
    role: "user",
    content: `
SITUATION:
complete stranger

TONE:
chill

USER INPUT:
unknown girl sent "hey" for the first time

Generate natural replies.
`
  },
  {
    role: "assistant",
    content: `
hey, what made you text me today
hey, i'll take that as your opening move
hey, okay i'm curious now
`
  },

  {
    role: "user",
    content: `
SITUATION:
crush

TONE:
subtle flirty

USER INPUT:
crush asked "wyd"

Generate natural replies.
`
  },
  {
    role: "assistant",
    content: `
doing something mildly interesting, surprisingly
nothing too exciting, your timing is decent tho
was about to get bored actually
`
  }
];

function normalize(value) {
  return String(value || "").trim();
}

function uniqueReplies(replies) {
  const seen = new Set();
  const output = [];

  for (const reply of replies || []) {
    const clean = normalize(reply)
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!clean) continue;

    const key = clean.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      output.push(clean);
    }
  }

  return output.slice(0, 3);
}

function similarity(a, b) {
  const A = new Set(
    normalize(a)
      .toLowerCase()
      .split(/\s+/)
      .filter(x => x.length > 2)
  );

  const B = new Set(
    normalize(b)
      .toLowerCase()
      .split(/\s+/)
      .filter(x => x.length > 2)
  );

  if (!A.size || !B.size) return 0;

  let intersection = 0;

  for (const word of A) {
    if (B.has(word)) intersection++;
  }

  return intersection / Math.max(A.size, B.size);
}

function qualityFilter(replies, previousReplies = []) {
  const banned = [
    "rizz",
    "no cap",
    "fr fr",
    "slay",
    "bussin",
    "sigma",
    "aura"
  ];

  const output = [];

  for (const reply of replies) {
    const text = normalize(reply);

    if (!text) continue;

    const lower = text.toLowerCase();

    if (banned.some(word => lower.includes(word))) {
      continue;
    }

    if (
      lower.includes("😉") ||
      lower.includes("🔥") ||
      lower.includes("😘") ||
      lower.includes("🌹")
    ) {
      continue;
    }

    if (text.length > 150) continue;

    const words = text.split(/\s+/);

    if (words.length > 24) continue;

    let tooSimilar = false;

    for (const existing of output) {
      if (similarity(text, existing) > 0.72) {
        tooSimilar = true;
        break;
      }
    }

    if (tooSimilar) continue;

    let rejectedForPrevious = false;

    for (const old of previousReplies) {
      if (similarity(text, old) > 0.82) {
        rejectedForPrevious = true;
        break;
      }
    }

    if (rejectedForPrevious) continue;

    output.push(text);

    if (output.length === 3) break;
  }

  return output;
}

async function groqRequest({
  apiKey,
  model,
  messages,
  response_format,
  temperature = 0.7,
  max_tokens = 500,
  reasoning_effort = "medium"
}) {
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
        temperature,
        max_tokens,
        reasoning_effort,
        response_format
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || "Groq request failed"
    );

    error.status = response.status;
    error.provider = data?.error || data;

    throw error;
  }

  return data;
}

async function callWithFallback({
  apiKey,
  messages,
  response_format,
  temperature,
  max_tokens,
  reasoning_effort
}) {
  const models = [
    MODEL_PRIMARY,
    MODEL_FALLBACK
  ];

  let lastError = null;

  for (const model of models) {
    try {
      return await groqRequest({
        apiKey,
        model,
        messages,
        response_format,
        temperature,
        max_tokens,
        reasoning_effort
      });
    } catch (error) {
      lastError = error;

      console.error(`Groq model failed: ${model}`, {
        status: error.status,
        message: error.message
      });

      /*
       * For production resilience:
       * try the fallback model on provider errors,
       * rate limits, temporary failures and model access issues.
       */
      continue;
    }
  }

  throw lastError || new Error("All AI models failed");
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
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const body = req.body || {};

    const msg = normalize(body.msg);
    const tone = normalize(body.tone) || "chill";
    const ctx = normalize(body.ctx) || "unknown";

    const previousReplies = Array.isArray(body.previousReplies)
      ? body.previousReplies
          .filter(x => typeof x === "string")
          .map(normalize)
          .filter(Boolean)
          .slice(0, 10)
      : [];

    const isMoreRequest =
      body.more === true ||
      /\b(or do|aur do|more|another|better|accha wala|acche wale|aur)\b/i.test(msg);

    if (!msg) {
      return res.status(400).json({
        error: "Message required"
      });
    }

    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_KEY) {
      console.error("GROQ_API_KEY is missing");

      return res.status(500).json({
        error: "AI service is not configured"
      });
    }

    /*
     * ============================================================
     * PHASE 1 — UNDERSTAND THE CONVERSATION
     * ============================================================
     */

    const analysisInput = `
USER INPUT:
${msg}

SELECTED TONE:
${tone}

RELATIONSHIP / CONTEXT:
${ctx}

PREVIOUS GENERATED REPLIES:
${
  previousReplies.length
    ? previousReplies.map((x, i) => `${i + 1}. ${x}`).join("\n")
    : "none"
}

USER REQUEST MODE:
${isMoreRequest ? "MORE / REGENERATE" : "FIRST GENERATION"}

Analyze what is actually happening.

Remember:
the user's wording may contain both the other person's message and instructions.

Do NOT write final replies.
`;

    const analysisData = await callWithFallback({
      apiKey: GROQ_KEY,
      messages: [
        {
          role: "system",
          content: ANALYZER_SYSTEM
        },
        {
          role: "user",
          content: analysisInput
        }
      ],
      response_format: ANALYSIS_SCHEMA,
      temperature: 0.25,
      max_tokens: 700,
      reasoning_effort: "high"
    });

    let analysis;

    try {
      analysis = JSON.parse(
        analysisData?.choices?.[0]?.message?.content || "{}"
      );
    } catch (error) {
      console.error("Analysis JSON parse error", error);

      return res.status(502).json({
        error: "AI analysis failed. Please retry."
      });
    }

    /*
     * ============================================================
     * PHASE 2 — GENERATE USING THE ANALYSIS
     * ============================================================
     */

    const generationInput = `
CONVERSATION INPUT:
${msg}

SELECTED TONE:
${tone}

CONTEXT:
${ctx}

PRIVATE CONVERSATION ANALYSIS:
${JSON.stringify(analysis, null, 2)}

${
  isMoreRequest
    ? `
THIS IS A "MORE" REQUEST.

The previous replies were not good enough.

Previous replies:
${previousReplies.map((x, i) => `${i + 1}. ${x}`).join("\n")}

Do NOT rewrite these.

Change the conversational approach.
The new replies must feel fresh.
`
    : ""
}

TASK:

Generate exactly three high-quality replies.

Think carefully about the actual conversational moment before producing them.

The replies should feel like natural next messages, not clever examples.

Return only the required JSON object.
`;

    const generationMessages = [
      {
        role: "system",
        content: WRITER_SYSTEM
      },
      ...SHOTS,
      {
        role: "user",
        content: generationInput
      }
    ];

    const generationData = await callWithFallback({
      apiKey: GROQ_KEY,
      messages: generationMessages,
      response_format: REPLY_SCHEMA,
      temperature: 0.78,
      max_tokens: 500,
      reasoning_effort: "high"
    });

    let generated;

    try {
      generated = JSON.parse(
        generationData?.choices?.[0]?.message?.content || "{}"
      );
    } catch (error) {
      console.error("Generation JSON parse error", error);

      return res.status(502).json({
        error: "AI generated an invalid response. Please retry."
      });
    }

    let replies = qualityFilter(
      generated?.replies,
      previousReplies
    );

    /*
     * ============================================================
     * PHASE 3 — SAFETY / QUALITY FALLBACK
     * ============================================================
     */

    if (replies.length < 3) {
      console.warn(
        "Quality filter rejected too many replies:",
        generated?.replies
      );

      /*
       * One controlled regeneration.
       * This is intentionally different from simply retrying
       * the same request.
       */

      const recoveryInput = `
The previous generation did not pass the quality filter.

ORIGINAL USER INPUT:
${msg}

TONE:
${tone}

CONTEXT:
${ctx}

ANALYSIS:
${JSON.stringify(analysis)}

PREVIOUS CANDIDATES:
${(generated?.replies || []).join("\n")}

Generate three completely fresh replies.

Hard requirements:
- natural human texting
- context-specific
- no generic filler
- no forced slang
- no pickup-line energy
- no banned emojis
- no repetition
- no rewriting the previous candidates
- each reply must use a different conversational angle

Return only the JSON object.
`;

      const recoveryData = await callWithFallback({
        apiKey: GROQ_KEY,
        messages: [
          {
            role: "system",
            content: WRITER_SYSTEM
          },
          {
            role: "user",
            content: recoveryInput
          }
        ],
        response_format: REPLY_SCHEMA,
        temperature: 0.84,
        max_tokens: 500,
        reasoning_effort: "high"
      });

      try {
        const recovery = JSON.parse(
          recoveryData?.choices?.[0]?.message?.content || "{}"
        );

        replies = qualityFilter(
          recovery?.replies,
          previousReplies
        );
      } catch (error) {
        console.error("Recovery parse failed:", error);
      }
    }

    if (replies.length < 3) {
      return res.status(502).json({
        error:
          "RizzAI could not produce three high-quality replies. Please try again."
      });
    }

    return res.status(200).json({
      replies: replies.slice(0, 3)
    });

  } catch (error) {
    console.error("RizzAI server error:", error);

    const status = error?.status;

    if (status === 401) {
      return res.status(502).json({
        error: "AI authentication failed"
      });
    }

    if (status === 429) {
      return res.status(503).json({
        error: "AI is temporarily busy. Please retry."
      });
    }

    return res.status(500).json({
      error:
        "RizzAI could not generate a reply right now. Please try again."
    });
  }
};
