const fs = require('fs');
const path = require('path');

const locks = new Map();

function acquireLock(key, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (!locks.has(key)) {
        locks.set(key, true);
        resolve(() => locks.delete(key));
        return;
      }
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for lock: ${key}`));
        return;
      }
      setTimeout(check, 50);
    };
    check();
  });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJsonFile(filePath, defaultValue = null) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return defaultValue;
  }
}

function writeJsonFile(filePath, data, indent = 2) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, indent), 'utf8');
}

function createBackup(filePath, backupDir, maxBackups = 3) {
  if (!fs.existsSync(filePath)) return;
  
  ensureDir(backupDir);
  const fileName = path.basename(filePath);
  const timestamp = Date.now();
  const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
  
  fs.copyFileSync(filePath, backupPath);
  
  const backups = fs.readdirSync(backupDir)
    .filter(f => f.startsWith(`${fileName}.`))
    .sort((a, b) => b.localeCompare(a))
    .slice(maxBackups);
  
  backups.forEach(f => {
    fs.unlinkSync(path.join(backupDir, f));
  });
}

module.exports = {
  acquireLock,
  ensureDir,
  readJsonFile,
  writeJsonFile,
  createBackup
};