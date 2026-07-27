const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const savesRouter = require('./routes/saves');

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/api/saves', savesRouter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

app.listen(config.PORT, () => {
  console.log(`斗罗大陆转盘服务器已启动: http://localhost:${config.PORT}`);
});