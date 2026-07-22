const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SAVES_DIR = path.join(__dirname, 'saves');
const LIST_FILE = path.join(__dirname, 'save-list.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ensure saves directory exists
if (!fs.existsSync(SAVES_DIR)) {
  fs.mkdirSync(SAVES_DIR, { recursive: true });
}

function loadSaveList() {
  try {
    return JSON.parse(fs.readFileSync(LIST_FILE, 'utf8')) || [];
  } catch (e) {
    return [];
  }
}

function saveSaveList(list) {
  fs.writeFileSync(LIST_FILE, JSON.stringify(list, null, 2), 'utf8');
}

// GET /api/saves - 存档列表
app.get('/api/saves', (req, res) => {
  const list = loadSaveList();
  res.json({ success: true, data: list });
});

// POST /api/saves - 保存存档
app.post('/api/saves', (req, res) => {
  const { summary, fullData } = req.body;
  if (!summary || !summary.id) {
    return res.status(400).json({ success: false, message: '缺少存档摘要' });
  }

  const list = loadSaveList();
  // Remove existing entry with same id
  const filtered = list.filter(s => s.id !== summary.id);
  filtered.unshift(summary);
  // Keep max 50 saves
  const trimmed = filtered.slice(0, 50);
  saveSaveList(trimmed);

  // Save full data
  if (fullData) {
    const savePath = path.join(SAVES_DIR, `${summary.id}.json`);
    fs.writeFileSync(savePath, JSON.stringify(fullData, null, 2), 'utf8');
  }

  res.json({ success: true, message: '存档成功', id: summary.id });
});

// GET /api/saves/:id - 读取完整存档
app.get('/api/saves/:id', (req, res) => {
  const savePath = path.join(SAVES_DIR, `${req.params.id}.json`);
  try {
    const data = JSON.parse(fs.readFileSync(savePath, 'utf8'));
    res.json({ success: true, data });
  } catch (e) {
    res.status(404).json({ success: false, message: '存档不存在或已损坏' });
  }
});

// DELETE /api/saves/:id - 删除存档
app.delete('/api/saves/:id', (req, res) => {
  const list = loadSaveList();
  const filtered = list.filter(s => s.id !== req.params.id);
  saveSaveList(filtered);

  const savePath = path.join(SAVES_DIR, `${req.params.id}.json`);
  if (fs.existsSync(savePath)) {
    fs.unlinkSync(savePath);
  }

  res.json({ success: true, message: '删除成功' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`斗罗大陆转盘服务器已启动: http://localhost:${PORT}`);
});
