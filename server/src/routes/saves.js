const express = require('express');
const router = express.Router();
const saveService = require('../services/saveService');

router.get('/', async (req, res) => {
  try {
    const list = await saveService.getSaveList();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { summary, fullData } = req.body;
    if (!summary || !summary.id) {
      return res.status(400).json({ success: false, message: '缺少存档摘要' });
    }
    
    const id = await saveService.saveGame(summary, fullData);
    res.json({ success: true, message: '存档成功', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await saveService.loadGame(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await saveService.deleteGame(req.params.id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;