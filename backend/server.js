const { GoogleGenerativeAI } = require('@google/generative-ai');


require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });



app.get('/', (req, res) => {
  res.send('👋 Welcome to the Smart Presenter Hub backend!');
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      result: text,
      source: "gemini-api"
    });
  } catch (err) {
    console.error("Gemini API error:", err.message || err);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
