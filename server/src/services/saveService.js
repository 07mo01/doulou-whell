const fs = require('fs');
const path = require('path');
const config = require('../config');
const { acquireLock, ensureDir, readJsonFile, writeJsonFile, createBackup } = require('../utils/fsUtils');

ensureDir(config.SAVES_DIR);
ensureDir(config.BACKUP_DIR);

async function getSaveList() {
  const unlock = await acquireLock('save-list');
  try {
    return readJsonFile(config.LIST_FILE, []);
  } finally {
    unlock();
  }
}

async function updateSaveList(list) {
  const unlock = await acquireLock('save-list');
  try {
    createBackup(config.LIST_FILE, config.BACKUP_DIR, config.BACKUP_COUNT);
    writeJsonFile(config.LIST_FILE, list.slice(0, config.MAX_SAVES), config.JSON_INDENT);
  } finally {
    unlock();
  }
}

async function saveGame(summary, fullData) {
  const list = await getSaveList();
  const filtered = list.filter(s => s.id !== summary.id);
  filtered.unshift(summary);
  
  await updateSaveList(filtered);
  
  if (fullData) {
    const savePath = path.join(config.SAVES_DIR, `${summary.id}.json`);
    const unlock = await acquireLock(`save-${summary.id}`);
    try {
      createBackup(savePath, config.BACKUP_DIR, config.BACKUP_COUNT);
      writeJsonFile(savePath, fullData, config.JSON_INDENT);
    } finally {
      unlock();
    }
  }
  
  return summary.id;
}

async function loadGame(id) {
  const savePath = path.join(config.SAVES_DIR, `${id}.json`);
  const unlock = await acquireLock(`save-${id}`);
  try {
    const data = readJsonFile(savePath);
    if (!data) {
      throw new Error('存档不存在');
    }
    return data;
  } finally {
    unlock();
  }
}

async function deleteGame(id) {
  const list = await getSaveList();
  const filtered = list.filter(s => s.id !== id);
  await updateSaveList(filtered);
  
  const savePath = path.join(config.SAVES_DIR, `${id}.json`);
  const unlock = await acquireLock(`save-${id}`);
  try {
    if (fs.existsSync(savePath)) {
      fs.unlinkSync(savePath);
    }
  } finally {
    unlock();
  }
}

module.exports = {
  getSaveList,
  saveGame,
  loadGame,
  deleteGame
};