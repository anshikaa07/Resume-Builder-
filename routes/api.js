/**
 * routes/api.js
 * REST API endpoints:
 *   POST /api/ai-summary   – generates a professional summary via Anthropic
 *   GET  /api/health       – health check
 */

const express = require('express');
const router  = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/ai-summary
 * Body: { name, title, skills, exp[] }
 * Returns: { summary: string }
 *
 * Calls the Anthropic Messages API (claude-sonnet-4-20250514).
 * Requires ANTHROPIC_API_KEY env var in production.
 * In the browser-only version the front-end calls Anthropic directly;
 * this route is provided for server-side usage.
 */
router.post('/ai-summary', async (req, res) => {
  const { name, title, skills, exp } = req.body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback: tell client to call directly
    return res.status(503).json({
      error: 'ANTHROPIC_API_KEY not configured on server. Use client-side AI generation.'
    });
  }

  const expText = (exp || [])
    .map(e => `- ${e.role} at ${e.company} (${e.dates}): ${e.desc}`)
    .join('\n');

  const prompt = `Write a concise, professional resume summary (3–4 sentences) for:
Name: ${name}
Title: ${title}
Skills: ${skills}
Experience:
${expText || 'Not provided'}

Return ONLY the summary paragraph, no preamble.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':            'application/json',
        'x-api-key':               apiKey,
        'anthropic-version':       '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages:   [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    const summary = data?.content?.[0]?.text?.trim() || '';
    res.json({ summary });
  } catch (err) {
    console.error('[AI summary error]', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

module.exports = router;
