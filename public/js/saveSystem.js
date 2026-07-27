let GameState = {};

function loadSaves(){
  let saved = localStorage.getItem('douluo_saves');
  if(saved){
    try{return JSON.parse(saved);}catch(e){return [];}
  }
  return [];
}

function saveSaves(saves){
  localStorage.setItem('douluo_saves', JSON.stringify(saves));
}

async function apiRequest(url, options = {}){
  try{
    let response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : null,
      ...options
    });
    let data = await response.json();
    return data;
  }catch(e){
    console.error('API Request failed:', e);
    return {success: false, message: e.message};
  }
}

async function saveCurrentGame(){
  let summary = {
    id: G.id || Date.now().toString(),
    name: G.Name || '未命名角色',
    avatar: G.Avatar || '',
    level: G.soulPower,
    age: G.Age,
    timeline: G.timeline?.name || '斗罗大陆',
    identity: G.identity,
    identityType: G.identityType,
    martialSoul: G.martialSoul?.name || '',
    createdAt: G.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if(!G.id) G.id = summary.id;
  if(!G.createdAt) G.createdAt = summary.createdAt;
  
  let saves = loadSaves();
  let filtered = saves.filter(s => s.id !== summary.id);
  filtered.unshift(summary);
  saveSaves(filtered);
  
  let result = await apiRequest('/api/saves', {
    method: 'POST',
    body: {summary, fullData: G}
  });
  
  return result;
}

async function loadGame(id){
  let result = await apiRequest(`/api/saves/${id}`);
  if(result.success && result.data){
    G = result.data;
    return true;
  }
  return false;
}

async function deleteGame(id){
  let result = await apiRequest(`/api/saves/${id}`, {method: 'DELETE'});
  if(result.success){
    let saves = loadSaves();
    saveSaves(saves.filter(s => s.id !== id));
  }
  return result;
}

async function loadSavesList(){
  let result = await apiRequest('/api/saves');
  if(result.success){
    return result.data;
  }
  return loadSaves();
}