const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  SAVES_DIR: path.join(__dirname, '../../saves'),
  LIST_FILE: path.join(__dirname, '../../save-list.json'),
  BACKUP_DIR: path.join(__dirname, '../../backups'),
  MAX_SAVES: 50,
  BACKUP_COUNT: 3,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  JSON_INDENT: 2
};