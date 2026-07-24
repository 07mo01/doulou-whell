(function (global) {
  const MAX_SAVE_SIZE = 4 * 1024 * 1024;

  function loadSaves() {
    try {
      return JSON.parse(localStorage.getItem('dl_saves')) || [];
    } catch (error) {
      return [];
    }
  }

  function saveSaves(saves) {
    localStorage.setItem('dl_saves', JSON.stringify(saves));
  }

  function serializeGameState(gameState) {
    try {
      const seen = new WeakSet();
      const dataStr = JSON.stringify(gameState, function (key, value) {
        if (typeof value === 'function') return undefined;
        if (value instanceof HTMLElement) return undefined;
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
        }
        return value;
      });
      return { ok: true, dataStr: dataStr };
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  function buildSaveSummary(gameState) {
    const saveId = gameState._saveId || Date.now();
    gameState._saveId = saveId;
    const soulName = gameState.martialSoul?.example || (gameState.bloodline ? `${gameState.bloodline.name}魂兽` : '未知');
    return {
      id: saveId,
      timeline: gameState.timeline?.name || '未知',
      identity: gameState.identity?.name || '未知',
      identityType: gameState.identityType || 'human',
      martialSoul: soulName,
      soulPower: gameState.soulPower || 0,
      age: gameState.age || 0,
      rating: gameState.alive ? '进行中' : '',
      epitaph: '...',
      rings: (gameState.soulRings || []).length,
      bones: (gameState.soulBones || []).length,
      deathReason: gameState.alive ? '进行中' : (gameState.deathReason || '未知'),
      innatePower: gameState.innatePower || 0,
      beastYears: gameState.beastYears,
      date: new Date().toLocaleString('zh-CN'),
      isSave: true
    };
  }

  function upsertSaveSummary(summary) {
    let saves = loadSaves();
    let existIdx = saves.findIndex(save => save.id === summary.id);
    if (existIdx >= 0) {
      saves[existIdx] = summary;
    } else {
      saves.unshift(summary);
      if (saves.length > 20) saves = saves.slice(0, 20);
    }
    saveSaves(saves);
    return saves;
  }

  function saveFullDataToLocal(saveId, dataStr) {
    if (dataStr.length > MAX_SAVE_SIZE) {
      return { ok: false, tooLarge: true, message: '存档过大(>4MB)，仅保存摘要' };
    }
    localStorage.setItem('dl_save_full_' + saveId, dataStr);
    return { ok: true };
  }

  function parseBackendFullData(dataStr) {
    if (!dataStr || dataStr.length > MAX_SAVE_SIZE) return null;
    try {
      return JSON.parse(dataStr);
    } catch (error) {
      return null;
    }
  }

  function saveCurrentGameState(gameState) {
    if (!gameState || !gameState.timeline) {
      return { ok: false, message: '无法保存：游戏未开始' };
    }

    const summary = buildSaveSummary(gameState);
    const serialized = serializeGameState(gameState);
    if (!serialized.ok) {
      return { ok: false, message: '完整存档保存失败：' + serialized.error.message, error: serialized.error };
    }

    let fullOk = false;
    let warningMessage = '';
    try {
      const localResult = saveFullDataToLocal(summary.id, serialized.dataStr);
      fullOk = localResult.ok;
      if (localResult.tooLarge) warningMessage = localResult.message;
    } catch (error) {
      return { ok: false, message: '完整存档保存失败：' + error.message, error: error };
    }

    try {
      upsertSaveSummary(summary);
    } catch (error) {
      return { ok: false, message: '存档列表保存失败', error: error };
    }

    return {
      ok: true,
      saveId: summary.id,
      summary: summary,
      fullOk: fullOk,
      warningMessage: warningMessage,
      fullData: parseBackendFullData(serialized.dataStr)
    };
  }

  function syncSaveToBackend(summary, fullData) {
    return apiSaveGame(summary, fullData).then(result => {
      if (result.ok && result.source === 'api') {
        console.log('存档已同步到服务器');
      }
      return result;
    });
  }

  async function deleteSaveByIndex(idx) {
    let saves = loadSaves();
    let save = saves[idx];
    if (!save) return { ok: false, error: '存档不存在' };
    let id = save.id;
    if (id) {
      try {
        localStorage.removeItem('dl_save_full_' + id);
      } catch (error) { }
      let apiResult = await apiDeleteGame(id);
      if (!apiResult.ok) return apiResult;
    }
    saves.splice(idx, 1);
    saveSaves(saves);
    return { ok: true };
  }

  function normalizeLoadedGameState(gameState, createDefaultState, saveId) {
    gameState._processing = false;
    gameState.autoMode = false;
    gameState._saveId = saveId;
    let defaults = createDefaultState();
    for (let key in defaults) {
      if (gameState[key] === undefined || gameState[key] === null) {
        gameState[key] = defaults[key];
        continue;
      }
      if (Array.isArray(defaults[key]) && !Array.isArray(gameState[key])) {
        gameState[key] = defaults[key];
        continue;
      }
      if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key]) && defaults[key] !== null) {
        if (typeof gameState[key] !== 'object' || gameState[key] === null) {
          gameState[key] = defaults[key];
        }
      }
    }
    return gameState;
  }

  async function loadSaveGameState(idx, createDefaultState) {
    let saves = loadSaves();
    let summary = saves[idx];
    if (!summary) return { ok: false, error: '存档不存在。' };
    if (summary.deathReason !== '进行中') {
      return { ok: false, error: '该角色已死亡，无法继续游戏。' };
    }

    let result = await apiLoadGame(summary.id);
    if (!result.ok || !result.data) {
      return { ok: false, error: '完整存档数据丢失，无法继续游戏。' };
    }

    return {
      ok: true,
      summary: summary,
      gameState: normalizeLoadedGameState(result.data, createDefaultState, summary.id)
    };
  }

  global.SaveService = {
    loadSaves: loadSaves,
    saveSaves: saveSaves,
    buildSaveSummary: buildSaveSummary,
    saveCurrentGameState: saveCurrentGameState,
    syncSaveToBackend: syncSaveToBackend,
    deleteSaveByIndex: deleteSaveByIndex,
    loadSaveGameState: loadSaveGameState,
    normalizeLoadedGameState: normalizeLoadedGameState
  };

  global.loadSaves = loadSaves;
  global.saveSaves = saveSaves;
})(window);