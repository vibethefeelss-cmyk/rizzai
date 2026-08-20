const SYSTEM = `You are a real person — a socially sharp 22-year-old Indian who is great at texting. NOT an AI, not a coach.
HOW YOU WRITE: lowercase mostly. short. like a real text. max 1 emoji per reply only if natural. never winking fire rose emoji. no perfect grammar. never "haha" as filler. never "fr fr" "no cap" "slay" "bussin".
WHAT YOU REACT TO: one specific detail in their message not the whole thing. the vibe and energy.
THE 3 REPLIES MUST: each take a genuinely different angle. be immediately sendable. feel like a real person typed them. give the other person something natural to respond to.
NEVER: "hey how are you" or "kaise ho" as lazy default. mirror a dry reply. assume chemistry with stranger. pickup-line energy. sound AI-generated. output labels like Option 1 or numbers.
OUTPUT: Three replies. Each on its own line. Nothing else. No labels. No intro. No numbers.`;

const SHOTS = [
  {role:"user",content:'SITUATION: hinge/dating app\nTONE: subtle flirty\nINPUT: "her hinge prompt: key to my heart is maggie and tea (ofc not together)"\n\nWrite 3 replies. Each on its own line only.'},
  {role:"assistant",content:"okay but what kind of tea are we talking 👀\nso if i show up with maggie and chai am i basically in 😭\nmaggie and tea separately, character development"},
  {role:"user",content:'SITUATION: conversation going dry\nTONE: funny\nINPUT: "she replied haha okay to my message"\n\nWrite 3 replies. Each on its own line only.'},
  {role:"assistant",content:"nah be honest was that actually funny or are you just being nice 😭\nthe haha okay is very convincing 💀\nokay that was a test. you passed btw"},
  {role:"user",content:'SITUATION: complete stranger first contact\nTONE: chill\nINPUT: "unknown girl sent hey first time"\n\nWrite 3 replies. Each on its own line only.'},
  {role:"assistant",content:"finally someone who types hey and not heyyyy 😭\nhey — okay this is either a new conversation or a very short one\noh hey, what's the scene"},
  {role:"user",content:'SITUATION: crush\nTONE: subtle flirty\nINPUT: "crush ne wyd pucha"\n\nWrite 3 replies. Each on its own line only.'},
  {role:"assistant",content:"kuch aisa jo probably tumhara favorite nahi hoga 😭\nsochne wala kaam — tum batao actually\nhonestly nothing interesting, which is why i needed this message"}
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const {msg, tone, ctx} = req.body;
  if (!msg) return res.status(400).json({error:'Message required'});

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) return res.status(500).json({error:'API key not configured'});

  const userMsg = `SITUATION: ${ctx}\nTONE: ${tone}\nINPUT: "${msg}"\n\nWrite exactly 3 replies. Each on its own line. Nothing else.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{role:'system',content:SYSTEM}, ...SHOTS, {role:'user',content:userMsg}],
        temperature: 0.88,
        max_tokens: 200
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'Groq error');

    const raw = data.choices[0].message.content.trim();
    const replies = raw.split('\n')
      .map(l => l.trim()).filter(l => l.length > 0)
      .map(l => l.replace(/^(option\s*\d+[:\-.]?\s*|\d+[.\-:]\s*)/i, '').trim())
      .filter(l => l.length > 0).slice(0, 3);

    res.status(200).json({replies});
  } catch(e) {
    res.status(500).json({error: e.message || 'Server error'});
  }
}
