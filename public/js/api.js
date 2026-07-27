// ============================================================
// API CLIENT - Frontend to Backend communication
// Fallback to localStorage if server unavailable
// ============================================================
const API_BASE = '/api';
let _apiAvailable = null;

async function apiRequest(method, path, body = null) {
  let opts = { method, headers: { 'Content-Type': 'application/json' } };
  try { opts.signal = AbortSignal.timeout(2000); } catch(e) {}
  if (body) opts.body = JSON.stringify(body);
  let res = await fetch(API_BASE + path, opts);
  if (!res.ok) throw new Error(`API ${method} ${path} failed: ${res.status}`);
  return res.json();
}

async function checkApi() {
  if (_apiAvailable !== null) return _apiAvailable;
  if (location.protocol === 'file:') { _apiAvailable = false; return false; }
  try {
    await apiRequest('GET', '/health');
    _apiAvailable = true;
    return true;
  } catch (e) {
    _apiAvailable = false;
    return false;
  }
}

// Archive (saves) APIs
async function apiGetSaves() {
  if (await checkApi()) {
    try {
      const json = await apiRequest('GET', '/saves');
      if (json.success) return json.data || [];
    } catch (e) { console.warn('API getSaves failed, fallback to localStorage', e); }
  }
  // fallback
  try { return JSON.parse(localStorage.getItem('dl_saves')) || []; }
  catch (e) { return []; }
}

async function apiSaveGame(summary, fullData) {
  if (await checkApi()) {
    try {
      const json = await apiRequest('POST', '/saves', { summary, fullData });
      if (json.success) return { ok: true, source: 'api' };
    } catch (e) { console.warn('API save failed, fallback to localStorage', e); }
  }
  // fallback
  try {
    let saves = JSON.parse(localStorage.getItem('dl_saves')) || [];
    saves = saves.filter(s => s.id !== summary.id);
    saves.unshift(summary);
    if (saves.length > 20) saves = saves.slice(0, 20);
    localStorage.setItem('dl_saves', JSON.stringify(saves));
    if (fullData) {
      const dataStr = JSON.stringify(fullData, (k, v) => {
        if (typeof v === 'function') return undefined;
        if (v instanceof HTMLElement) return undefined;
        return v;
      });
      localStorage.setItem('dl_save_full_' + summary.id, dataStr);
    }
    return { ok: true, source: 'local' };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function apiLoadGame(id) {
  if (await checkApi()) {
    try {
      const json = await apiRequest('GET', '/saves/' + id);
      if (json.success) return { ok: true, data: json.data };
    } catch (e) { console.warn('API load failed, fallback to localStorage', e); }
  }
  // fallback
  try {
    const data = JSON.parse(localStorage.getItem('dl_save_full_' + id));
    if (data) return { ok: true, data };
  } catch (e) {}
  return { ok: false, error: '存档不存在' };
}

async function apiDeleteGame(id) {
  if (await checkApi()) {
    try {
      const json = await apiRequest('DELETE', '/saves/' + id);
      if (json.success) return { ok: true };
    } catch (e) { console.warn('API delete failed, fallback to localStorage', e); }
  }
  // fallback
  try {
    let saves = JSON.parse(localStorage.getItem('dl_saves')) || [];
    saves = saves.filter(s => s.id !== id);
    localStorage.setItem('dl_saves', JSON.stringify(saves));
    localStorage.removeItem('dl_save_full_' + id);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
