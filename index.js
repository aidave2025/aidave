const express = require('express');
const app = express();

// Cloud Run listens on process.env.PORT (default 8080)
const PORT = process.env.PORT || 8080;

// Basic health endpoint for Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

// Placeholder AI Dave endpoint
app.get('/', (req, res) => {
  res.send('AI Dave is online and ready. This is the starter service running on Cloud Run.');
});

app.listen(PORT, () => {
  console.log(`AI Dave service listening on port ${PORT}`);
});
