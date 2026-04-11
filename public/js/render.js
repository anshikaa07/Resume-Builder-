/**
 * public/js/render.js
 * Builds the live resume HTML from State and injects it into #resume-paper.
 * One render() function that switches between all 4 templates.
 */

const Render = (() => {

  const esc = s => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /* ── Shared HTML builders ────────────────────────────── */
  function contacts(s, cls) {
    return [s.email, s.phone, s.location, s.website]
      .filter(Boolean)
      .map(c => `<span class="${cls}">${esc(c)}</span>`)
      .join('');
  }

  function items(list, cls = '') {
    return list.map(e => `
      <div class="rv-item">
        <div class="rv-item-hd">
          <span class="rv-item-title">${esc(e.role || e.degree)}</span>
          <span class="rv-item-date">${esc(e.dates)}</span>
        </div>
        <div class="rv-item-sub">${esc(e.company || e.school)}</div>
        ${e.desc ? `<div class="rv-item-desc">${esc(e.desc)}</div>` : ''}
      </div>`).join('');
  }

  function skillTags(s, cls) {
    return (s.skills || '')
      .split(',')
      .map(sk => sk.trim())
      .filter(Boolean)
      .map(sk => `<span class="${cls}">${esc(sk)}</span>`)
      .join('');
  }

  function section(title, content, tmplClass) {
    if (!content) return '';
    return `<div class="rv-section">
      <div class="rv-sec-title">${title}</div>
      ${content}
    </div>`;
  }

  /* ── CLASSIC ─────────────────────────────────────────── */
  function renderClassic(s) {
    const expHTML  = s.exp.length  ? section('Experience',    items(s.exp))  : '';
    const eduHTML  = s.edu.length  ? section('Education',     items(s.edu))  : '';
    const skillHTML = s.skills     ? section('Skills', `<div class="rv-skills">${skillTags(s,'rv-skill')}</div>`) : '';
    const langHTML  = s.langs      ? section('Languages',     `<div class="rv-summary">${esc(s.langs)}</div>`)   : '';
    const certHTML  = s.certs      ? section('Certifications',`<div class="rv-summary">${esc(s.certs)}</div>`)   : '';
    const intHTML   = s.interests  ? section('Interests',     `<div class="rv-summary">${esc(s.interests)}</div>`) : '';
    const sumHTML   = s.summary    ? section('Summary',       `<div class="rv-summary">${esc(s.summary)}</div>`) : '';

    return `<div class="t-classic" style="--rv-accent:${s.accent}">
      <div class="rv-header">
        ${s.photo ? `<div class="rv-photo"><img src="${s.photo}" alt="${esc(s.name || 'Profile photo')}" /></div>` : ''}
        <div class="rv-header-text">
          <div class="rv-name">${esc(s.name || 'Your Name')}</div>
          <div class="rv-title">${esc(s.title || 'Professional Title')}</div>
          <div class="rv-contacts">${contacts(s,'rv-c')}</div>
        </div>
      </div>
      <div class="rv-body">
        ${sumHTML}${expHTML}${eduHTML}${skillHTML}${langHTML}${certHTML}${intHTML}
      </div>
    </div>`;
  }

  /* ── MODERN SIDEBAR ──────────────────────────────────── */
  function renderModern(s) {
    const sideContacts = [s.email, s.phone, s.location, s.website]
      .filter(Boolean)
      .map(c => `<div class="rv-c">${esc(c)}</div>`)
      .join('');

    const expHTML  = s.exp.length ? section('Experience', items(s.exp)) : '';
    const eduHTML  = s.edu.length ? section('Education',  items(s.edu)) : '';
    const sumHTML  = s.summary    ? section('Summary', `<div class="rv-summary">${esc(s.summary)}</div>`) : '';

    return `<div class="t-modern" style="--rv-accent:${s.accent}">
      <div class="rv-sidebar">
        ${s.photo ? `<div class="rv-photo"><img src="${s.photo}" alt="${esc(s.name || 'Profile photo')}" /></div>` : ''}
        <div>
          <div class="rv-name">${esc(s.name || 'Your Name')}</div>
          <div class="rv-title">${esc(s.title || 'Professional Title')}</div>
        </div>
        ${sideContacts ? `<div class="rv-ss"><div class="rv-ss-label">Contact</div>${sideContacts}</div>` : ''}
        ${s.skills ? `<div class="rv-ss"><div class="rv-ss-label">Skills</div><div class="rv-skills">${skillTags(s,'rv-skill')}</div></div>` : ''}
        ${s.langs  ? `<div class="rv-ss"><div class="rv-ss-label">Languages</div><div class="rv-c">${esc(s.langs)}</div></div>` : ''}
        ${s.certs  ? `<div class="rv-ss"><div class="rv-ss-label">Certifications</div><div class="rv-c">${esc(s.certs)}</div></div>` : ''}
        ${s.interests ? `<div class="rv-ss"><div class="rv-ss-label">Interests</div><div class="rv-c">${esc(s.interests)}</div></div>` : ''}
      </div>
      <div class="rv-main">
        ${sumHTML}${expHTML}${eduHTML}
      </div>
    </div>`;
  }

  /* ── MINIMAL ─────────────────────────────────────────── */
  function renderMinimal(s) {
    const expHTML  = s.exp.length ? section('Experience',     items(s.exp)) : '';
    const eduHTML  = s.edu.length ? section('Education',      items(s.edu)) : '';
    const skillHTML = s.skills    ? section('Skills', `<div class="rv-skills">${skillTags(s,'rv-skill')}</div>`) : '';
    const langHTML  = s.langs     ? section('Languages',      `<div class="rv-summary">${esc(s.langs)}</div>`) : '';
    const certHTML  = s.certs     ? section('Certifications', `<div class="rv-summary">${esc(s.certs)}</div>`) : '';
    const intHTML   = s.interests ? section('Interests',      `<div class="rv-summary">${esc(s.interests)}</div>`) : '';
    const sumHTML   = s.summary   ? section('Summary',        `<div class="rv-summary">${esc(s.summary)}</div>`) : '';

    return `<div class="t-minimal" style="--rv-accent:${s.accent}">
      <div class="rv-header">
        ${s.photo ? `<div class="rv-photo"><img src="${s.photo}" alt="${esc(s.name || 'Profile photo')}" /></div>` : ''}
        <div class="rv-header-text">
          <div class="rv-name">${esc(s.name || 'Your Name')}</div>
          <div class="rv-title">${esc(s.title || 'Professional Title')}</div>
          <div class="rv-contacts">${contacts(s,'rv-c')}</div>
        </div>
      </div>
      <div class="rv-body">
        ${sumHTML}${expHTML}${eduHTML}${skillHTML}${langHTML}${certHTML}${intHTML}
      </div>
    </div>`;
  }

  /* ── BOLD ────────────────────────────────────────────── */
  function renderBold(s) {
    const expHTML  = s.exp.length ? section('Experience',     items(s.exp)) : '';
    const eduHTML  = s.edu.length ? section('Education',      items(s.edu)) : '';
    const skillHTML = s.skills    ? section('Skills', `<div class="rv-skills">${skillTags(s,'rv-skill')}</div>`) : '';
    const langHTML  = s.langs     ? section('Languages',      `<div class="rv-summary">${esc(s.langs)}</div>`) : '';
    const certHTML  = s.certs     ? section('Certifications', `<div class="rv-summary">${esc(s.certs)}</div>`) : '';
    const intHTML   = s.interests ? section('Interests',      `<div class="rv-summary">${esc(s.interests)}</div>`) : '';
    const sumHTML   = s.summary   ? section('Summary',        `<div class="rv-summary">${esc(s.summary)}</div>`) : '';

    return `<div class="t-bold" style="--rv-accent:${s.accent}">
      <div class="rv-header">
        ${s.photo ? `<div class="rv-photo"><img src="${s.photo}" alt="${esc(s.name || 'Profile photo')}" /></div>` : ''}
        <div class="rv-header-text">
          <div class="rv-name">${esc(s.name || 'Your Name')}</div>
          <div class="rv-title">${esc(s.title || 'Professional Title')}</div>
          <div class="rv-contacts">${contacts(s,'rv-c')}</div>
        </div>
      </div>
      <div class="rv-body">
        ${sumHTML}${expHTML}${eduHTML}${skillHTML}${langHTML}${certHTML}${intHTML}
      </div>
    </div>`;
  }

  /* ── Main render entry ───────────────────────────────── */
  function render() {
    const s = State.get();
    const paper = document.getElementById('resume-paper');
    if (!paper) return;

    const map = {
      classic: renderClassic,
      modern:  renderModern,
      minimal: renderMinimal,
      bold:    renderBold,
    };
    const fn = map[s.template] || renderClassic;
    paper.innerHTML = fn(s);
  }

  return { render };
})();
