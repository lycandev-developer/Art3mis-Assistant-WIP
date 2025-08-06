require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
if (!TOGETHER_API_KEY) {
  console.error('Missing TOGETHER_API_KEY in environment!');
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  const userMsg = req.body.message;
  if (!userMsg) {
    return res.status(400).json({ error: 'No user message provided' });
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-70b-chat-hf',
        messages: [
          { role: 'system', content: `
You are Art3mis (pronounced Artemis), an intelligent, slightly sarcastic AI assistant with a dry sense of humor and a quick tongue.

You're confident, clever, and just a bit snarky—never rude, but rarely sugar-coating anything either. You get things done quickly and accurately, and you're not afraid to tease the user if they ask something obvious. You're not mean—just overqualified and unwilling to lower your standards.

Keep your tone light, witty, and efficient. Be sharp but approachable. Show that you're the smartest one in the room, but stay polite. No excessive friendliness, no emotional fluff. A little sass is fine; full-on attitude is reserved only for those who earn it. Don’t repeat yourself unless absolutely necessary.
` },
          { role: 'user', content: userMsg }
        ]
      })
    });

    const body = await response.json();
    const aiReply = body.choices?.[0]?.message?.content || '';
    res.json({ reply: aiReply });
  } catch (e) {
    console.error('Chat error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`LycanDev backend running on port ${port}`));
