/**
 * public/js/editor.js
 * Manages the editor panel:
 *   - Tab switching
 *   - Form ↔ State sync (pull / push)
 *   - Experience & Education entry cards (add / delete / edit)
 *   - AI summary button
 */

const Editor = (() => {

  /* ── Helpers ─────────────────────────────────────────── */
  const $  = id => document.getElementById(id);
  const esc = s => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* Photo handling */
  function readPhotoAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ── Tab switching ───────────────────────────────────── */
  function initTabs() {
    document.querySelectorAll('.tab[data-panel]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        $(`panel-${btn.dataset.panel}`)?.classList.add('active');
      });
    });
  }

  /* ── Pull values from DOM → State ────────────────────── */
  function pullFromDOM() {
    State.set({
      name:      $('f-name')?.value     || '',
      title:     $('f-title')?.value    || '',
      summary:   $('f-summary')?.value  || '',
      email:     $('f-email')?.value    || '',
      phone:     $('f-phone')?.value    || '',
      location:  $('f-location')?.value || '',
      website:   $('f-website')?.value  || '',
      photo:     State.get().photo || '', // Photo is handled separately
      skills:    $('f-skills')?.value   || '',
      langs:     $('f-langs')?.value    || '',
      certs:     $('f-certs')?.value    || '',
      interests: $('f-interests')?.value || '',
    });
  }

  /* ── Push State values → DOM ─────────────────────────── */
  function pushToDOM(s) {
    const set = (id, val) => { const el=$(id); if(el) el.value = val||''; };
    set('f-name',      s.name);
    set('f-title',     s.title);
    set('f-summary',   s.summary);
    set('f-email',     s.email);
    set('f-phone',     s.phone);
    set('f-location',  s.location);
    set('f-website',   s.website);
    set('f-skills',    s.skills);
    set('f-langs',     s.langs);
    set('f-certs',     s.certs);
    set('f-interests', s.interests);
    
    // Handle photo display
    renderPhotoPreview(s.photo);
  }

  /* ── Bind personal fields ────────────────────────────── */
  function bindPersonalFields() {
    const ids = ['f-name','f-title','f-summary','f-email','f-phone','f-location','f-website',
                 'f-skills','f-langs','f-certs','f-interests'];
    ids.forEach(id => {
      $(id)?.addEventListener('input', pullFromDOM);
    });
  }

  /* ── Experience entries ──────────────────────────────── */
  function addExp() {
    const s = State.get();
    s.exp.push({ id: uid(), role:'', company:'', dates:'', desc:'' });
    State.set({ exp: s.exp });
    renderExpList();
  }

  function deleteExp(id) {
    const s = State.get();
    State.set({ exp: s.exp.filter(e => e.id !== id) });
    renderExpList();
  }

  function renderExpList() {
    const list = $('exp-list');
    if (!list) return;
    const s = State.get();
    list.innerHTML = '';
    s.exp.forEach((e, i) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-name" id="exp-name-${e.id}">${esc(e.role) || 'New Position'}</span>
          <button class="btn-del" aria-label="Delete entry" data-id="${e.id}">✕</button>
        </div>
        <div class="row-2">
          <div>
            <label class="field-label">Job title</label>
            <input type="text" class="field" value="${esc(e.role)}" placeholder="Product Manager" data-field="role" data-idx="${i}" />
          </div>
          <div>
            <label class="field-label">Company</label>
            <input type="text" class="field" value="${esc(e.company)}" placeholder="Acme Corp" data-field="company" data-idx="${i}" />
          </div>
        </div>
        <label class="field-label">Dates</label>
        <input type="text" class="field" value="${esc(e.dates)}" placeholder="Jan 2020 – Present" data-field="dates" data-idx="${i}" />
        <label class="field-label">Description</label>
        <textarea class="field" rows="3" placeholder="Key achievements and responsibilities…" data-field="desc" data-idx="${i}">${esc(e.desc)}</textarea>
      `;
      list.appendChild(card);

      // Bind delete
      card.querySelector('.btn-del').addEventListener('click', () => deleteExp(e.id));

      // Bind field inputs
      card.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('input', () => {
          const s2 = State.get();
          const idx = parseInt(input.dataset.idx);
          s2.exp[idx][input.dataset.field] = input.value;
          if (input.dataset.field === 'role') {
            document.getElementById(`exp-name-${s2.exp[idx].id}`).textContent = input.value || 'New Position';
          }
          State.set({ exp: s2.exp });
        });
      });
    });
  }

  /* ── Education entries ───────────────────────────────── */
  function addEdu() {
    const s = State.get();
    s.edu.push({ id: uid(), degree:'', school:'', dates:'', desc:'' });
    State.set({ edu: s.edu });
    renderEduList();
  }

  function deleteEdu(id) {
    const s = State.get();
    State.set({ edu: s.edu.filter(e => e.id !== id) });
    renderEduList();
  }

  function renderEduList() {
    const list = $('edu-list');
    if (!list) return;
    const s = State.get();
    list.innerHTML = '';
    s.edu.forEach((e, i) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-name" id="edu-name-${e.id}">${esc(e.degree) || 'New Degree'}</span>
          <button class="btn-del" aria-label="Delete entry" data-id="${e.id}">✕</button>
        </div>
        <div class="row-2">
          <div>
            <label class="field-label">Degree / Program</label>
            <input type="text" class="field" value="${esc(e.degree)}" placeholder="BSc Computer Science" data-field="degree" data-idx="${i}" />
          </div>
          <div>
            <label class="field-label">School / University</label>
            <input type="text" class="field" value="${esc(e.school)}" placeholder="MIT" data-field="school" data-idx="${i}" />
          </div>
        </div>
        <label class="field-label">Dates</label>
        <input type="text" class="field" value="${esc(e.dates)}" placeholder="2016 – 2020" data-field="dates" data-idx="${i}" />
        <label class="field-label">Notes (GPA, honors…)</label>
        <textarea class="field" rows="2" placeholder="Graduated with Honors, 3.9 GPA…" data-field="desc" data-idx="${i}">${esc(e.desc)}</textarea>
      `;
      list.appendChild(card);

      card.querySelector('.btn-del').addEventListener('click', () => deleteEdu(e.id));

      card.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('input', () => {
          const s2 = State.get();
          const idx = parseInt(input.dataset.idx);
          s2.edu[idx][input.dataset.field] = input.value;
          if (input.dataset.field === 'degree') {
            document.getElementById(`edu-name-${s2.edu[idx].id}`).textContent = input.value || 'New Degree';
          }
          State.set({ edu: s2.edu });
        });
      });
    });
  }

  /* ── Photo upload functions */
  function renderPhotoPreview(photoData) {
    const preview = $('photo-preview');
    const uploadBtn = $('btn-photo-upload');
    const removeBtn = $('btn-photo-remove');
    
    if (!preview || !uploadBtn || !removeBtn) return;
    
    if (photoData) {
      preview.innerHTML = `<img src="${photoData}" alt="Profile photo" />`;
      uploadBtn.textContent = 'Change photo';
      removeBtn.hidden = false;
    } else {
      preview.innerHTML = `
        <div class="photo-placeholder">
          <span class="photo-icon">+</span>
          <span class="photo-text">Add photo</span>
        </div>
      `;
      uploadBtn.textContent = 'Choose photo';
      removeBtn.hidden = true;
    }
  }

  function bindPhotoUpload() {
    const fileInput = $('f-photo');
    const uploadBtn = $('btn-photo-upload');
    const removeBtn = $('btn-photo-remove');
    
    if (!fileInput || !uploadBtn || !removeBtn) return;
    
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        Toast.show('Please select an image file', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Toast.show('Image size must be less than 5MB', 'error');
        return;
      }
      
      try {
        const photoData = await readPhotoAsDataURL(file);
        State.set({ photo: photoData });
        renderPhotoPreview(photoData);
        Toast.show('Photo uploaded successfully', 'success');
      } catch (err) {
        Toast.show('Failed to upload photo', 'error');
        console.error('[Photo upload error]', err);
      }
      
      // Clear the file input
      fileInput.value = '';
    });
    
    removeBtn.addEventListener('click', () => {
      State.set({ photo: '' });
      renderPhotoPreview('');
      Toast.show('Photo removed', 'success');
    });
    
    // Also handle clicking on preview to change photo
    $('photo-preview').addEventListener('click', () => {
      if (State.get().photo) {
        uploadBtn.click();
      } else {
        fileInput.click();
      }
    });
  }

  /* ── AI Summary button ───────────────────────────────── */
  function bindAIButton() {
    const btn = $('btn-ai-summary');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const s = State.get();
      btn.disabled = true;
      btn.classList.add('loading');
      btn.textContent = 'Generating';

      try {
        const summary = await API.generateSummary({
          name:   s.name,
          title:  s.title,
          skills: s.skills,
          exp:    s.exp
        });
        $('f-summary').value = summary;
        State.set({ summary });
        Toast.show('Summary generated!', 'success');
      } catch (err) {
        if (err.message === 'NO_KEY') {
          const key = prompt('Enter your Anthropic API key to use AI generation:');
          if (key) {
            sessionStorage.setItem('rf_ak', key.trim());
            btn.click(); // retry
            return;
          }
        } else {
          Toast.show('AI generation failed. Check console.', 'error');
          console.error('[AI]', err);
        }
      } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.textContent = 'Generate with AI';
      }
    });
  }

  /* ── Public init ─────────────────────────────────────── */
  function init(savedState) {
    initTabs();
    pushToDOM(savedState);
    bindPersonalFields();
    bindPhotoUpload();
    renderExpList();
    renderEduList();
    bindAIButton();

    $('btn-add-exp')?.addEventListener('click', addExp);
    $('btn-add-edu')?.addEventListener('click', addEdu);
  }

  function refresh() {
    const s = State.get();
    renderExpList();
    renderEduList();
    pushToDOM(s);
  }

  return { init, refresh, renderExpList, renderEduList };
})();
