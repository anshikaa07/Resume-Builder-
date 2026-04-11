/**
 * public/js/design.js
 * Manages the Design tab:
 *   - Template picker (4 templates)
 *   - Accent color swatches (10 colors)
 *   - UI theme cards (5 themes)
 *   - Resume font selector (3 fonts)
 */

const Design = (() => {

  // Comprehensive color palette with various hues and shades
  const COLOR_PALETTE = [
    // Reds
    '#dc2626','#ef4444','#f87171','#fca5a5','#fecaca',
    // Oranges
    '#ea580c','#f97316','#fb923c','#fdba74','#fed7aa',
    // Ambers
    '#d97706','#f59e0b','#fbbf24','#fcd34d','#fde68a',
    // Yellows
    '#ca8a04','#eab308','#facc15','#fde047','#fef08a',
    // Limes
    '#65a30d','#84cc16','#a3e635','#bef264','#d9f99d',
    // Greens
    '#16a34a','#22c55e','#4ade80','#86efac','#bbf7d0',
    // Emeralds
    '#047857','#10b981','#34d399','#6ee7b7','#a7f3d0',
    // Teals
    '#0d9488','#14b8a6','#2dd4bf','#5eead4','#99f6e4',
    // Cyans
    '#0891b2','#06b6d4','#22d3ee','#67e8f9','#a5f3fc',
    // Sky blues
    '#0284c7','#0ea5e9','#38bdf8','#7dd3fc','#bae6fd',
    // Blues
    '#1e40af','#2563eb','#3b82f6','#60a5fa','#93c5fd',
    // Indigos
    '#4f46e5','#6366f1','#818cf8','#a5b4fc','#c7d2fe',
    // Violets
    '#7c3aed','#8b5cf6','#a78bfa','#c4b5fd','#ddd6fe',
    // Purples
    '#6d28d9','#7c3aed','#9333ea','#a855f7','#c084fc',
    // Fuchsias
    '#a21caf','#c026d3','#d946ef','#e879f9','#f0abfc',
    // Pinks
    '#db2777','#ec4899','#f472b6','#f9a8d4','#fbcfe8',
    // Roses
    '#be123c','#e11d48','#f43f5e','#fb7185','#fda4af',
    // Grays
    '#171717','#262626','#404040','#525252','#737373',
    '#a3a3a3','#d4d4d4','#e5e5e5','#f5f5f5','#fafafa',
    // Neutral tones
    '#1a1a22','#374151','#4b5563','#6b7280','#9ca3af',
    '#d1d5db','#e5e7eb','#f3f4f6','#f9fafb','#ffffff'
  ];

  const THEMES = [
    { id:'dark',   label:'Dark',   swatch:'linear-gradient(135deg,#1a1a22,#f0c040)' },
    { id:'light',  label:'Light',  swatch:'linear-gradient(135deg,#f4f2ec,#c0392b)' },
    { id:'ocean',  label:'Ocean',  swatch:'linear-gradient(135deg,#07151e,#38d8e8)' },
    { id:'forest', label:'Forest', swatch:'linear-gradient(135deg,#0b150f,#7adb78)' },
    { id:'rose',   label:'Rose',   swatch:'linear-gradient(135deg,#f9f0f2,#c0396c)' },
  ];

  const FONTS = [
    { id:'serif', label:'Serif',  preview:'Aa', css:"'Playfair Display', serif" },
    { id:'sans',  label:'Sans',   preview:'Aa', css:"'Lato', sans-serif" },
    { id:'mono',  label:'Mono',   preview:'Aa', css:"'Fira Code', monospace" },
  ];

  const TEMPLATES = [
    {
      id: 'classic', label: 'Classic',
      thumb: `<div style="height:100%;display:flex;flex-direction:column">
        <div style="background:#1a1a22;height:26px;display:flex;align-items:center;justify-content:center">
          <div style="width:55%;height:5px;background:rgba(255,255,255,0.6);border-radius:2px"></div>
        </div>
        <div style="padding:6px 7px;flex:1;display:flex;flex-direction:column;gap:3px">
          <div style="height:3px;width:75%;background:rgba(0,0,0,0.15);border-radius:1px"></div>
          <div style="height:3px;width:55%;background:rgba(0,0,0,0.09);border-radius:1px"></div>
          <div style="height:3px;width:85%;background:rgba(0,0,0,0.07);border-radius:1px;margin-top:3px"></div>
          <div style="height:3px;width:65%;background:rgba(0,0,0,0.07);border-radius:1px"></div>
        </div>
      </div>`
    },
    {
      id: 'modern', label: 'Modern',
      thumb: `<div style="height:100%;display:grid;grid-template-columns:35% 1fr">
        <div style="background:#1a1a22;padding:5px;display:flex;flex-direction:column;gap:3px">
          <div style="height:4px;width:75%;background:rgba(255,255,255,0.5);border-radius:1px"></div>
          <div style="height:3px;width:55%;background:rgba(255,255,255,0.28);border-radius:1px"></div>
          <div style="height:2px;width:80%;background:rgba(255,255,255,0.15);border-radius:1px;margin-top:3px"></div>
          <div style="height:2px;width:70%;background:rgba(255,255,255,0.12);border-radius:1px"></div>
        </div>
        <div style="padding:5px 6px;display:flex;flex-direction:column;gap:3px">
          <div style="height:3px;width:80%;background:rgba(0,0,0,0.12);border-radius:1px"></div>
          <div style="height:3px;width:60%;background:rgba(0,0,0,0.08);border-radius:1px"></div>
          <div style="height:3px;width:90%;background:rgba(0,0,0,0.06);border-radius:1px;margin-top:3px"></div>
          <div style="height:3px;width:70%;background:rgba(0,0,0,0.06);border-radius:1px"></div>
        </div>
      </div>`
    },
    {
      id: 'minimal', label: 'Minimal',
      thumb: `<div style="height:100%;display:flex;flex-direction:column;padding:7px">
        <div style="height:6px;width:65%;background:rgba(0,0,0,0.22);border-radius:1px;margin-bottom:3px"></div>
        <div style="height:2px;width:38%;background:rgba(0,0,0,0.1);border-radius:1px;margin-bottom:9px"></div>
        <div style="padding-left:6px;border-left:2px solid rgba(0,0,0,0.18);display:flex;flex-direction:column;gap:2px">
          <div style="height:3px;width:75%;background:rgba(0,0,0,0.14);border-radius:1px"></div>
          <div style="height:3px;width:55%;background:rgba(0,0,0,0.08);border-radius:1px"></div>
          <div style="height:3px;width:85%;background:rgba(0,0,0,0.06);border-radius:1px"></div>
        </div>
      </div>`
    },
    {
      id: 'bold', label: 'Bold',
      thumb: `<div style="height:100%;display:flex;flex-direction:column;padding:7px;border-left:4px solid #c0392b">
        <div style="height:7px;width:70%;background:rgba(0,0,0,0.22);border-radius:1px;margin-bottom:3px"></div>
        <div style="height:3px;width:42%;background:#c0392b;border-radius:1px;opacity:0.7;margin-bottom:9px"></div>
        <div style="height:3px;width:80%;background:rgba(0,0,0,0.1);border-radius:1px"></div>
        <div style="height:3px;width:60%;background:rgba(0,0,0,0.07);border-radius:1px;margin-top:2px"></div>
        <div style="height:3px;width:75%;background:rgba(0,0,0,0.07);border-radius:1px;margin-top:2px"></div>
      </div>`
    }
  ];

  function init(savedState) {
    renderTemplates(savedState.template);
    renderAccents(savedState.accent);
    renderThemeCards(savedState.uiTheme);
    renderFonts(savedState.resumeFont || 'serif');
    applyUITheme(savedState.uiTheme);
    bindTopbarThemeDots(savedState.uiTheme);
  }

  /* ── Templates ───────────────────────────────────────── */
  function renderTemplates(active) {
    const grid = document.getElementById('tmpl-grid');
    if (!grid) return;
    grid.innerHTML = '';
    TEMPLATES.forEach(t => {
      const card = document.createElement('div');
      card.className = 'tmpl-card' + (t.id === active ? ' sel' : '');
      card.innerHTML = `<div class="tmpl-thumb">${t.thumb}</div><div class="tmpl-label">${t.label}</div>`;
      card.addEventListener('click', () => {
        document.querySelectorAll('.tmpl-card').forEach(c => c.classList.remove('sel'));
        card.classList.add('sel');
        State.set({ template: t.id });
        Render.render();
      });
      grid.appendChild(card);
    });
  }

  /* ── Accent swatches ──────────────────────────────────── */
  function renderAccents(active) {
    const row = document.getElementById('accent-row');
    if (!row) return;
    row.innerHTML = '';
    
    // Add custom color picker at the beginning
    const customColorContainer = document.createElement('div');
    customColorContainer.className = 'custom-color-container';
    
    const customColorInput = document.createElement('input');
    customColorInput.type = 'color';
    customColorInput.className = 'custom-color-input';
    customColorInput.value = active && !COLOR_PALETTE.includes(active) ? active : '#c0392b';
    customColorInput.title = 'Custom color';
    
    const customColorLabel = document.createElement('div');
    customColorLabel.className = 'custom-color-label';
    customColorLabel.textContent = 'Custom';
    
    customColorContainer.appendChild(customColorInput);
    customColorContainer.appendChild(customColorLabel);
    
    customColorInput.addEventListener('input', (e) => {
      const color = e.target.value;
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('sel'));
      State.set({ accent: color });
      Render.render();
    });
    
    row.appendChild(customColorContainer);
    
    // Add color palette grid
    const colorGrid = document.createElement('div');
    colorGrid.className = 'color-grid';
    
    COLOR_PALETTE.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch' + (color === active ? ' sel' : '');
      swatch.style.background = color;
      swatch.title = color;
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('sel'));
        swatch.classList.add('sel');
        State.set({ accent: color });
        Render.render();
      });
      colorGrid.appendChild(swatch);
    });
    
    row.appendChild(colorGrid);
  }

  /* ── Theme cards ─────────────────────────────────────── */
  function renderThemeCards(active) {
    const container = document.getElementById('theme-cards');
    if (!container) return;
    container.innerHTML = '';
    THEMES.forEach(t => {
      const card = document.createElement('div');
      card.className = 'theme-card' + (t.id === active ? ' sel' : '');
      card.innerHTML = `<div class="theme-swatch" style="background:${t.swatch}"></div><div class="theme-nm">${t.label}</div>`;
      card.addEventListener('click', () => {
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('sel'));
        card.classList.add('sel');
        State.set({ uiTheme: t.id });
        applyUITheme(t.id);
        bindTopbarThemeDots(t.id);
      });
      container.appendChild(card);
    });
  }

  /* ── Font options ────────────────────────────────────── */
  function renderFonts(active) {
    const container = document.getElementById('font-options');
    if (!container) return;
    container.innerHTML = '';
    FONTS.forEach(f => {
      const card = document.createElement('div');
      card.className = 'font-card' + (f.id === active ? ' sel' : '');
      card.innerHTML = `<div class="font-preview" style="font-family:${f.css}">${f.preview}</div><div class="font-name">${f.label}</div>`;
      card.addEventListener('click', () => {
        document.querySelectorAll('.font-card').forEach(c => c.classList.remove('sel'));
        card.classList.add('sel');
        State.set({ resumeFont: f.id });
        applyResumeFont(f.id);
        Render.render();
      });
      container.appendChild(card);
    });
    applyResumeFont(active);
  }

  /* ── Apply UI theme to <html> ────────────────────────── */
  function applyUITheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? '' : theme);
  }

  /* ── Apply resume paper font ─────────────────────────── */
  function applyResumeFont(font) {
    const paper = document.getElementById('resume-paper');
    if (!paper) return;
    paper.className = 'resume-paper rfont-' + font;
  }

  /* ── Sync topbar dots ────────────────────────────────── */
  function bindTopbarThemeDots(active) {
    document.querySelectorAll('.tdot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === active);
      dot.addEventListener('click', () => {
        const theme = dot.dataset.theme;
        document.querySelectorAll('.tdot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        State.set({ uiTheme: theme });
        applyUITheme(theme);
        // Sync Design tab cards too
        document.querySelectorAll('.theme-card').forEach(c => {
          c.classList.toggle('sel', c.dataset && c.querySelector('.theme-nm')?.textContent.toLowerCase() === theme);
        });
      });
    });
  }

  return { init };
})();
