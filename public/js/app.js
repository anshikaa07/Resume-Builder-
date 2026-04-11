/**
 * public/js/app.js
 * Application bootstrapper.
 * Loads saved state, initialises all modules, binds global UI events.
 */

const Toast = (() => {
  let _timer = null;
  function show(msg, type = '') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(_timer);
    _timer = setTimeout(() => { el.classList.remove('show'); }, 3000);
  }
  return { show };
})();

async function boot() {
  // 1. Load persisted state
  const savedState = await State.load();

  // 2. Initialise modules
  Design.init(savedState);
  Editor.init(savedState);

  // 3. First render
  Render.render();

  // 4. Re-render on every state change
  State.onChange(() => Render.render());

  // 5. Download PDF button
  document.getElementById('btn-download')
    ?.addEventListener('click', () => PDF.download());

  // 6. Reset button + modal
  const modal   = document.getElementById('modal-reset');
  const btnReset  = document.getElementById('btn-reset');
  const btnCancel = document.getElementById('modal-cancel');
  const btnConfirm= document.getElementById('modal-confirm');

  btnReset?.addEventListener('click', () => { modal.hidden = false; });
  btnCancel?.addEventListener('click', () => { modal.hidden = true; });
  btnConfirm?.addEventListener('click', async () => {
    modal.hidden = true;
    await State.reset();
    Editor.refresh();
    Design.init(State.get());
    Render.render();
    Toast.show('Resumed cleared. Starting fresh!');
  });

  // Close modal on backdrop click
  modal?.addEventListener('click', e => {
    if (e.target === modal) modal.hidden = true;
  });

  // Close modal on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal?.hidden) modal.hidden = true;
  });

  console.log('[ResumeForge] Ready.');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
