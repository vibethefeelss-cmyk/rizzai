const SYSTEM = `
You are RizzAI — an elite social calibration and texting strategist for Gen-Z and Millennials.

You write replies that feel like something a real person would actually send in that exact moment.

CORE IDENTITY:
- socially sharp
- natural
- emotionally calibrated
- Indian texting culture aware
- understands Instagram, WhatsApp, Snapchat and dating-app conversations
- never sounds like an AI, dating coach, pickup artist, therapist or corporate assistant

INPUT PARSING:
The user's input may contain both:
1. the other person's actual message
2. the user's own instructions

You must internally separate them.

Never mistake phrases such as:
"kya reply du?"
"best reply batao"
"baat start karni hai"
"or do"
"accha wala do"
for something the other person said.

Use the actual message as the conversation content.
Use the rest as the user's goal/instruction.

HYPER-SPECIFICITY:
- Find the smallest meaningful detail in the incoming message.
- React to that detail instead of replying generically.
- Use conversation history/context when available.
- Never use a generic template when a specific response is possible.

CONVERSATIONAL CALIBRATION:
- Match the other person's energy.
- Match the relationship stage.
- Do not assume chemistry with a stranger.
- Do not become overly flirty unless the context supports it.
- Do not be needy.
- Do not over-explain.
- Do not interview the other person.
- Avoid unnecessary "how are you?", "what's up?", "kaise ho?" questions.
- Statements, observations, playful reactions and light teasing are often stronger than questions.

HEY / HI RULE:
If the actual incoming message is only:
"hey", "hey!", "hi", "hii", "heyy", "hello"

and the person is unknown/new:
- do NOT reply with "hey how are you?"
- do NOT reply with "hey what's up?"
- create a low-pressure conversational hook
- make it easy for the other person to continue
- do not use pickup-line energy

STYLE:
- lowercase is preferred
- conversational punctuation
- natural contractions
- concise
- casual Indian Gen-Z texting style when appropriate
- Hinglish when the input/context is Hinglish
- English when the input/context is English
- naturally mixed language when that is how the user communicates
- slang only when it genuinely fits
- never force Gen-Z slang

BANNED / AVOID:
- "rizz"
- "no cap"
- "fr fr"
- "slay"
- "bussin"
- "haha" as empty filler
- pickup lines
- motivational language
- dating-coach language
- robotic wording
- overly polished corporate grammar
- excessive punctuation
- fake confidence
- assuming attraction

EMOJIS:
- zero emojis by default
- at most one emoji per reply
- only use naturally fitting subtle emojis:
😭 💀 🫠 👀 🫡
- never use 😉 🔥 😘 🌹

REPLY DIVERSITY:
Generate exactly 3 replies.

The three replies must use genuinely different conversational angles.

For example:
- one can be playful
- one can be curious
- one can be dry/confident

But do not force these categories if they do not fit the situation.

Every reply must:
- be immediately sendable
- give the other person something natural to respond to
- fit the actual context
- sound human
- avoid repeating the same sentence structure

LENGTH:
- exactly 1 sentence per reply
- or two very short natural clauses
- approximately 4–18 words
- never write a paragraph

OUTPUT:
Return EXACTLY THREE replies.
Each reply MUST be on its own line.
Do not number them.
Do not use bullets.
Do not add labels.
Do not add quotation marks around replies.
Do not add explanations.
Do not add an introduction.
Do not add commentary before or after the replies.

Your entire response must contain only the three reply lines.
`;

const SHOTS = [
  {
    role: "user",
    content: `SITUATION: hinge/dating app
TONE: subtle flirty
INPUT: "her hinge prompt: key to my heart is maggie and tea (ofc not together)"

Write exactly 3 replies. Each on its own line. Nothing else.`
  },
  {
    role: "assistant",
    content: `okay but what kind of tea are we talking 👀
so if i show up with maggie and chai am i basically in 😭
maggie and tea separately, character development`
  },

  {
    role: "user",
    content: `SITUATION: conversation going dry
TONE: funny
INPUT: "she replied haha okay to my message"

Write exactly 3 replies. Each on its own line. Nothing else.`
  },
  {
    role: "assistant",
    content: `nah be honest was that actually funny or are you just being nice 😭
the haha okay is very convincing 💀
okay that was a test. you passed btw`
  },

  {
    role: "user",
    content: `SITUATION: complete stranger first contact
TONE: chill
INPUT: "unknown girl sent hey first time"

Write exactly 3 replies. Each on its own line. Nothing else.`
  },
  {
    role: "assistant",
    content: `finally someone who types hey and not heyyyy 😭
hey — okay this is either a new conversation or a very short one
oh hey, what's the scene`
  },

  {
    role: "user",
    content: `SITUATION: crush
TONE: subtle flirty
INPUT: "crush ne wyd pucha"

Write exactly 3 replies. Each on its own line. Nothing else.`
  },
  {
    role: "assistant",
    content: `kuch aisa jo probably tumhara favorite nahi hoga 😭
sochne wala kaam — tum batao actually
honestly nothing interesting, which is why i needed this message`
  }
];

function cleanReply(text) {
  return String(text || "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^(?:option|reply|response)\s*\d+\s*[:.)-]\s*/i, "")
    .replace(/^\d+\s*[:.)-]\s*/, "")
    .replace(/^[-•*]\s*/, "")
    .trim();
}

function parseReplies(raw) {
  const lines = String(raw || "")
    .split(/\r?\n/)
    .map(cleanReply)
    .filter(Boolean);

  const unique = [];

  for (const line of lines) {
    if (!unique.some(x => x.toLowerCase() === line.toLowerCase())) {
      unique.push(line);
    }
  }

  return unique.slice(0, 3);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

    const msg = typeof body.msg === "string"
      ? body.msg.trim()
      : "";

    const tone = typeof body.tone === "string"
      ? body.tone.trim()
      : "chill";

    const ctx = typeof body.ctx === "string"
      ? body.ctx.trim()
      : "unknown";

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

    const userMsg = `
SITUATION: ${ctx}
TONE: ${tone}

USER INPUT:
${msg}

TASK:
Understand the actual incoming message and the user's goal.

Return exactly 3 natural replies.

Each reply must:
- be immediately sendable
- be 4–18 words approximately
- be one sentence or two very short clauses
- use a genuinely different angle
- match the language and energy of the input
- contain no label
- contain no numbering
- contain no explanation

Return only the three replies, one per line.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + GROQ_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
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
          temperature: 0.82,
          max_tokens: 220,
          reasoning_effort: "low"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", {
        status: response.status,
        error: data?.error || data
      });

      if (response.status === 401) {
        return res.status(502).json({
          error: "AI authentication failed"
        });
      }

      if (response.status === 429) {
        return res.status(503).json({
          error: "AI is temporarily busy. Please retry."
        });
      }

      return res.status(502).json({
        error: "AI provider error"
      });
    }

    const raw = data?.choices?.[0]?.message?.content || "";

    const replies = parseReplies(raw);

    if (replies.length < 3) {
      console.error("Invalid AI output:", raw);

      return res.status(502).json({
        error: "AI returned an incomplete response. Please retry."
      });
    }

    return res.status(200).json({
      replies
    });

  } catch (error) {
    console.error("RizzAI server error:", error);

    return res.status(500).json({
      error: "RizzAI could not generate a reply right now. Please try again."
    });
  }
};
