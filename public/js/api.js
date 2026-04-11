/**
 * public/js/api.js
 * Handles AI-powered summary generation.
 * Tries the server route first (/api/ai-summary).
 * Falls back to direct Anthropic browser call if server has no API key.
 *
 * NOTE: For production, always use the server route with a server-side key.
 * The direct browser call is a developer convenience only.
 */

const API = (() => {

  /**
   * Generate a professional summary.
   * @param {object} data  - { name, title, skills, exp[] }
   * @returns {Promise<string>} - generated summary text
   */
  async function generateSummary(data) {
    // 1. Try server route
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.summary) return json.summary;
      if (json.error && !json.error.includes('ANTHROPIC_API_KEY')) throw new Error(json.error);
    } catch (err) {
      if (!err.message?.includes('ANTHROPIC_API_KEY')) throw err;
    }

    // 2. Fallback: direct Anthropic call (requires key in UI — see below)
    return await _directCall(data);
  }

  async function _directCall(data) {
    // In a real deployment this key comes from a server env var.
    // Here we check if one was stored in sessionStorage by the user.
    const key = sessionStorage.getItem('rf_ak');
    if (!key) {
      throw new Error('NO_KEY');
    }

    const expText = (data.exp || [])
      .map(e => `- ${e.role} at ${e.company} (${e.dates}): ${e.desc}`)
      .join('\n');

    const prompt = `Write a concise, professional resume summary (3–4 sentences) for:
Name: ${data.name}
Title: ${data.title}
Skills: ${data.skills}
Experience:\n${expText || 'Not provided'}

Return ONLY the summary paragraph.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const json = await res.json();
    const text = json?.content?.[0]?.text?.trim();
    if (!text) throw new Error('Empty AI response');
    return text;
  }

  return { generateSummary };
})();
