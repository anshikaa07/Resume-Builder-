/**
 * routes/resume.js
 * Serves the main builder page and handles session-based resume persistence.
 */

const express = require('express');
const path    = require('path');
const router  = express.Router();

// Default empty resume state
const defaultState = () => ({
  uiTheme:  'dark',
  template: 'classic',
  accent:   '#c0392b',
  name: '', title: '', summary: '',
  email: '', phone: '', location: '', website: '',
  photo: '',
  skills: '', langs: '', certs: '',
  exp: [],
  edu: []
});

// GET / – serve the builder shell
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// GET /state – return saved state from session (used on page load)
router.get('/state', (req, res) => {
  if (!req.session.resume) req.session.resume = defaultState();
  res.json({ ok: true, state: req.session.resume });
});

// POST /state – save full state to session
router.post('/state', (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'Invalid body' });
  }
  req.session.resume = { ...defaultState(), ...incoming };
  res.json({ ok: true });
});

// DELETE /state – reset / start fresh
router.delete('/state', (req, res) => {
  req.session.resume = defaultState();
  res.json({ ok: true });
});

module.exports = router;
