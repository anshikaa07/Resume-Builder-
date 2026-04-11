/**
 * ResumeForge – server.js
 * Main Express application entry point.
 * Mounts all route modules and serves static assets.
 */

const express = require('express');
const session = require('express-session');
const path    = require('path');

const resumeRoutes = require('./routes/resume');
const apiRoutes    = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'resumeforge-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

// ── Routes ────────────────────────────────────────────────────
app.use('/',    resumeRoutes);
app.use('/api', apiRoutes);

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 ResumeForge running at http://localhost:${PORT}\n`);
});

module.exports = app;
