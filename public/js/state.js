/**
 * public/js/state.js
 * Central application state.
 * Persists to server session (via /state endpoint) and localStorage as fallback.
 * Exposes: State, State.get(), State.set(), State.save(), State.load(), State.reset()
 */

const State = (() => {
  const LS_KEY = 'resumeforge_v2';

  const defaults = () => ({
    uiTheme:   'dark',
    template:  'classic',
    accent:    '#c0392b',
    resumeFont:'serif',
    name: '', title: '', summary: '',
    email: '', phone: '', location: '', website: '',
    skills: '', langs: '', certs: '', interests: '',
    exp: [],
    edu: []
  });

  let _state = defaults();
  let _saveTimer = null;
  let _saveCallbacks = [];

  /** Register a callback to be called after any state change */
  function onChange(fn) { _saveCallbacks.push(fn); }

  /** Internal: notify listeners */
  function _notify() { _saveCallbacks.forEach(fn => fn(_state)); }

  /** Get a copy of the full state, or a single key */
  function get(key) {
    return key ? _state[key] : { ..._state };
  }

  /** Merge partial updates into state and schedule a save */
  function set(partial) {
    _state = { ..._state, ...partial };
    scheduleSave();
    _notify();
  }

  /** Debounced save: writes to server + localStorage */
  function scheduleSave() {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(saveNow, 600);
    _emit('saving');
  }

  async function saveNow() {
    const payload = { ..._state };
    try {
      // Primary: server session
      await fetch('/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      // Fallback: localStorage
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
      _emit('saved');
    } catch {
      // Server unavailable: use localStorage only
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
      _emit('saved');
    }
  }

  /** Load state from server, fall back to localStorage */
  async function load() {
    try {
      const res = await fetch('/state');
      if (res.ok) {
        const data = await res.json();
        if (data.state && typeof data.state === 'object') {
          _state = { ...defaults(), ...data.state };
          _emit('saved');
          return _state;
        }
      }
    } catch { /* fall through */ }

    // Fallback: localStorage
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        _state = { ...defaults(), ...JSON.parse(raw) };
        _emit('saved');
        return _state;
      }
    } catch { /* ignore */ }

    _emit('unsaved');
    return _state;
  }

  /** Reset to defaults and persist */
  async function reset() {
    _state = defaults();
    try {
      await fetch('/state', { method: 'DELETE' });
    } catch { /* ignore */ }
    localStorage.removeItem(LS_KEY);
    _emit('unsaved');
    _notify();
    return _state;
  }

  /** Emit save status to the UI badge */
  function _emit(status) {
    const badge = document.getElementById('save-status');
    const label = badge?.querySelector('.save-label');
    if (!badge) return;
    badge.className = 'save-status ' + status;
    const map = { saving: 'Saving…', saved: 'All saved', unsaved: 'Unsaved', error: 'Save failed' };
    if (label) label.textContent = map[status] || status;
  }

  return { get, set, load, reset, onChange };
})();
