// index.js – AI Dave Cloud Run backend

// Core imports
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Express app
const app = express();
app.use(express.json());
app.use(cors());

// Cloud Run listens on process.env.PORT (default 8080)
const PORT = process.env.PORT || 8080;

// --- Health + status endpoints ---------------------------------------------

// Basic health check for Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Human-readable status page
app.get('/', (req, res) => {
  res
    .status(200)
    .send('AI Dave backend is online and ready. HTTP API is running on Cloud Run.');
});

// --- OpenAI client setup ---------------------------------------------------

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Core system prompt for AI Dave
const SYSTEM_PROMPT = `
You are AI Dave, the autonomous operations and sales assistant for Precision Greens.
You:
- Answer customers clearly and confidently.
- Focus on artificial grass, custom putting greens, and related services.
- Ask clarifying questions before giving quotes.
- Never invent pricing; if exact numbers are needed, say you'll send a detailed quote.
- Keep responses concise, friendly, and professional.
`;

// --- AI Chat endpoint ------------------------------------------------------

// POST /ai/chat
// Body: { message: string, history?: [{role, content}] }
app.post('/ai/chat', async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing "message" string in request body.' });
    }

    // Build conversation
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history : []),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages,
      temperature: 0.6,
      max_tokens: 600,
    });

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      'Sorry, I could not generate a response.';

    return res.status(200).json({
      reply,
      usage: completion?.usage || null,
    });
  } catch (err) {
    console.error('Error in /ai/chat:', err?.response?.data || err.message || err);
    return res.status(500).json({
      error: 'AI Dave encountered an error while generating a response.',
    });
  }
});

// --- Stubs for future integrations ----------------------------------------

// POST /ai/voice – placeholder for ElevenLabs integration
app.post('/ai/voice', async (req, res) => {
  // Later: call ElevenLabs with text and voice ID, return audio URL or stream
  return res.status(501).json({ error: 'Voice endpoint not implemented yet.' });
});

// POST /ai/avatar – placeholder for HeyGen integration
app.post('/ai/avatar', async (req, res) => {
  // Later: call HeyGen to trigger or control avatar sessions
  return res.status(501).json({ error: 'Avatar endpoint not implemented yet.' });
});

// --- Start server ----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`AI Dave backend listening on port ${PORT}`);
});
