// Shared utility helpers extracted from app.js

// ============================================================
// WEIGHTED RANDOM
// ============================================================
function weightedRandom(items, weightKey = 'weight') {
  let total = items.reduce((s, i) => s + i[weightKey], 0);
  let r = Math.random() * total;
  for (let item of items) { r -= item[weightKey]; if (r <= 0) return item; }
  return items[items.length - 1];
}


function formatYears(y) {
  if (y === 0) return '幼年期';
  if (y < 100) return y + '年（成长期）';
  if (y >= 1000000) return (y / 10000).toFixed(0) + '万年';
  if (y >= 10000) return (y / 10000).toFixed(y % 10000 === 0 ? 0 : 1) + '万年';
  if (y >= 1000) return (y / 1000).toFixed(y % 1000 === 0 ? 0 : 1) + '千年';
  if (y >= 100) return (y / 100).toFixed(y % 100 === 0 ? 0 : 1) + '百年';
  return y + '年';
}

function beastYearsToLevel(years) {
  if (years < 10) return 1;
  if (years < 100) return Math.floor(1 + years / 10);
  if (years < 1000) return Math.floor(10 + years / 100);
  if (years < 10000) return Math.floor(20 + years / 1000);
  if (years < 100000) return Math.floor(30 + years / 2500);
  return Math.min(99, Math.floor(70 + years / 10000));
}


function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

