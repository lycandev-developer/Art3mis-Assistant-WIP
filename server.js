// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.TOGETHER_API_KEY,
  basePath: 'https://api.together.xyz/v1'
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
  try {
    const messages = req.body.messages || [];

    const response = await openai.createChatCompletion({
      model: 'meta-llama/Llama-3-70B-chat',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages
      ]
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
