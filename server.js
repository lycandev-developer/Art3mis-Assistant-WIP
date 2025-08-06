const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-70B-chat',
      messages: { role: 'system', content: 'You are a helpful assistant.' },
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response from model.';
    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Error communicating with Together.ai.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
