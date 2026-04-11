# ResumeForge v2

A full-featured, production-ready resume builder built with **Express.js** + vanilla JS.

## Features

- ✅ **4 Resume templates** — Classic, Modern (sidebar), Minimal, Bold
- ✅ **5 UI themes** — Dark, Light, Ocean, Forest, Rose
- ✅ **10 accent colors** for resume personalization
- ✅ **3 resume font styles** — Serif, Sans, Mono
- ✅ **Live preview** — updates instantly as you type
- ✅ **Persistent progress** — saved to server session + localStorage fallback
- ✅ **AI summary generator** — powered by Claude (Anthropic API)
- ✅ **PDF export** — html2canvas + jsPDF, supports multi-page
- ✅ **Reset / start fresh** with confirmation modal
- ✅ Fully accessible (ARIA roles, keyboard nav, focus rings)

---

## Project Structure

```
resumeforge/
├── server.js               # Express entry point
├── package.json
├── routes/
│   ├── resume.js           # Page serving + session state API
│   └── api.js              # AI summary endpoint
└── public/
    ├── index.html          # App shell (HTML only, no logic)
    ├── 404.html
    ├── css/
    │   ├── reset.css       # CSS reset & base
    │   ├── themes.css      # All 5 UI theme variables
    │   ├── layout.css      # Topbar, shell grid, modal, toast
    │   ├── editor.css      # Left editor panel
    │   ├── preview.css     # Right preview panel
    │   ├── templates.css   # All 4 resume template styles
    │   └── components.css  # Design tab pickers
    └── js/
        ├── state.js        # Central state + server/LS persistence
        ├── api.js          # Anthropic AI integration
        ├── editor.js       # Tabs, form sync, entry cards
        ├── design.js       # Template/theme/color/font pickers
        ├── render.js       # Resume HTML rendering (all templates)
        ├── pdf.js          # PDF export
        └── app.js          # Bootstrapper + Toast utility
```

---

## Quick Start

### 1. Install dependencies
```bash
cd resumeforge
npm install
```

### 2. (Optional) Add your Anthropic API key for AI summaries
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Start the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

---

## AI Summary Generation

- If `ANTHROPIC_API_KEY` is set in the server environment, AI generation runs server-side via `/api/ai-summary`.
- Without a server key, clicking "Generate with AI" will prompt you for your API key in the browser (stored in `sessionStorage` — not persisted).
- The AI generates a 3–4 sentence professional summary based on your name, title, skills, and work experience.

---

## PDF Export

Click **"⬇ Download PDF"** in the top bar. The export:
- Renders the live preview at 2× resolution
- Supports multi-page resumes automatically
- Saves as `yourname_resume.pdf`

---

## Session Persistence

Your resume data is saved:
1. **Server session** — survives page refreshes (7-day cookie)
2. **localStorage** — fallback if server is unreachable

The save indicator in the top bar shows: `Saving…` → `All saved`.

---

## Environment Variables

| Variable           | Default                    | Description                    |
|--------------------|----------------------------|--------------------------------|
| `PORT`             | `3000`                     | Server port                    |
| `SESSION_SECRET`   | `resumeforge-secret-key`   | Express session secret         |
| `ANTHROPIC_API_KEY`| _(none)_                   | Enables server-side AI summary |

---

## Extending

| Want to add...         | Edit this file             |
|------------------------|----------------------------|
| New resume template    | `css/templates.css` + `js/render.js` |
| New UI theme           | `css/themes.css` + `js/design.js`    |
| New editor field       | `public/index.html` + `js/editor.js` + `js/render.js` |
| Photo upload           | `routes/api.js` + `js/editor.js`    |
| Database persistence   | `routes/resume.js` (replace session store) |
