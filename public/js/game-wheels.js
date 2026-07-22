// Wheel-related UI and interaction logic extracted from app.js

// ============================================================
// MINI WHEEL SYSTEM (Soul Ring Hunt)
// ============================================================
let miniWheelData = null;
let miniWheelSpinning = false;
let miniWheelCallback = null;

// Year event wheel globals
let yearEventWheelData = null;
let yearEventWheelSpinning = false;
let yearEventWheelCallback = null;
let yearEventResult = null;
let timelineCharWheelData = null;
let timelineCharWheelSpinning = false;
let timelineCharWheelCallback = null;

function buildSoulRingWheel() {
  let ringNum = G.soulRings.length;
  if (ringNum >= 9) return null;
  let limit = getRingLimit(ringNum);
  // Build options based on quality-adjusted limit
  let safeMax = Math.floor(limit * 0.7);
  let items = [];
  // Safe range
  items.push({
    name: `安全猎杀\n(${Math.floor(safeMax * 0.3)}~${safeMax}年)`,
    years: Math.floor(Math.random() * safeMax * 0.7 + safeMax * 0.3),
    weight: 40, color: '#226622', risk: 'safe'
  });
  // Medium range
  items.push({
    name: `稳健猎杀\n(${safeMax}~${limit}年)`,
    years: safeMax + Math.floor(Math.random() * (limit - safeMax)),
    weight: 30, color: '#224466', risk: 'medium'
  });
  // Risky range - now safe since limit is raised by quality
  items.push({
    name: `极限猎杀\n(${limit}~${Math.floor(limit * 1.5)}年)`,
    years: limit + Math.floor(Math.random() * limit * 0.5),
    weight: 20, color: '#664422', risk: 'risky'
  });
  // Gambling - high reward, no death
  items.push({
    name: `命运赌博\n(未知年限)`,
    years: Math.floor(Math.random() * limit * 3 + 100),
    weight: 10, color: '#662222', risk: 'gamble'
  });
  return items;
}

// ============================================================
// SPIRIT SOUL SYSTEM (Douluo 3/4)
// ============================================================
const SPIRIT_SOUL_NAMES = [
  '冰碧蝎', '光明圣龙', '暗金恐爪熊', '三眼金猊', '翡翠天鹅', '妖眼魔树', '泰坦巨猿', '天青牛蟒',
  '地狱魔龙', '山龙王', '海龙王', '雷鸣阎魔藤', '火凤凰', '冰凤凰', '邪眸白虎', '六翼天使',
  '蓝电霸王龙', '深海魔鲸', '金龙王', '银龙王', '时空双龙', '混沌青牛', '鸿蒙凤凰',
  '金语', '绮罗郁金香', '霸王龙', '雷鸣阎狱藤', '邪魔虎鲸王', '碧姬', '赤王',
  '冰天雪女', '天梦冰蚕', '八角玄冰草', '烈火杏娇疏', '幽香绮罗仙品'
];
const SPIRIT_SOUL_HIGH_NAMES = [
  '冰碧帝皇蝎', '雪帝', '冰帝', '帝天', '邪帝', '碧姬', '赤王', '泰坦巨猿', '天青牛蟒',
  '深海魔鲸', '金龙王', '银龙王', '邪魔虎鲸王', '火凤凰', '冰凤凰'
];
const SPIRIT_SOUL_PREFIXES = ['十年（白）', '百年（黄）', '千年（紫）', '万年（黑）', '十万年（红）', '凶兽（橙）', '不屈', '伴生', '传承', '本命'];

function buildSpiritSoulWheel() {
  let ringNum = G.soulRings.length;
  if (ringNum >= 9) return null;
  let limit = getRingLimit(ringNum);
  let items = [];
  let getName = (years) => {
    if (years >= 100000) {
      return SPIRIT_SOUL_HIGH_NAMES[Math.floor(Math.random() * SPIRIT_SOUL_HIGH_NAMES.length)];
    }
    return SPIRIT_SOUL_NAMES[Math.floor(Math.random() * SPIRIT_SOUL_NAMES.length)];
  };
  // Low tier spirit soul
  let lowYears = Math.floor(Math.random() * 500 + 100);
  items.push({
    name: `低级魂灵\n(${lowYears}年)`, years: lowYears, weight: 25, color: '#448844',
    soulName: SPIRIT_SOUL_PREFIXES[0] + getName(lowYears),
    tier: 'low', cost: 10
  });
  // Mid tier
  let midYears = Math.floor(Math.random() * (Math.min(5000, limit) - 1000) + 1000);
  items.push({
    name: `中级魂灵\n(${midYears}年)`, years: midYears, weight: 30, color: '#4466aa',
    soulName: SPIRIT_SOUL_PREFIXES[1] + getName(midYears),
    tier: 'mid', cost: 50
  });
  // High tier
  let highYears = Math.floor(Math.random() * (Math.min(50000, limit * 1.5) - 10000) + 10000);
  items.push({
    name: `高级魂灵\n(${highYears}年)`, years: highYears, weight: 25, color: '#aa44aa',
    soulName: SPIRIT_SOUL_PREFIXES[2] + getName(highYears),
    tier: 'high', cost: 200
  });
  // Top tier / Random
  let topYears = Math.floor(Math.random() * (limit * 2) + 50000);
  items.push({
    name: `顶级魂灵\n(${topYears}年)`, years: topYears, weight: 15, color: '#ffaa22',
    soulName: SPIRIT_SOUL_PREFIXES[3] + getName(topYears),
    tier: 'top', cost: 1000
  });
  // Beast god / Special
  if (Math.random() < 0.1) {
    let beastYears = Math.floor(Math.random() * 500000 + 100000);
    items.push({
      name: `凶兽魂灵\n(${beastYears}年)`, years: beastYears, weight: 5, color: '#ff2222',
      soulName: SPIRIT_SOUL_PREFIXES[5] + getName(beastYears),
      tier: 'beastgod', cost: 5000
    });
  }
  return items;
}

let spiritSoulWheelData = null;
let spiritSoulWheelSpinning = false;
let spiritSoulWheelCallback = null;

function openSpiritSoulWheel(callback) {
  spiritSoulWheelData = buildSpiritSoulWheel();
  if (!spiritSoulWheelData) { callback(false); return; }
  spiritSoulWheelCallback = callback;
  let ringNum = G.soulRings.length + 1;
  let eraName = G.timeline.id === 'douluo4' ? '传灵塔/联邦' : '传灵塔';
  document.getElementById('mini-wheel-label').textContent = `第${ringNum}魂环 · ${eraName}魂灵契约`;
  document.getElementById('mini-wheel-hint').textContent = '魂兽濒临灭绝，通过传灵塔契约魂灵获取魂环';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinSpiritSoulWheel;
  drawMiniWheel(spiritSoulWheelData);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinSpiritSoulWheel() {
  if (spiritSoulWheelSpinning) return;
  spiritSoulWheelSpinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = spiritSoulWheelData.reduce((s, i) => s + i.weight, 0);
  let selected = weightedRandom(spiritSoulWheelData);
  let selectedIdx = spiritSoulWheelData.indexOf(selected);
  let cumWeight = 0;
  for (let i = 0; i < selectedIdx; i++) cumWeight += spiritSoulWheelData[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  setTimeout(() => {
    spiritSoulWheelSpinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let ringNum = G.soulRings.length + 1;
    let target = selected.years;
    let color = SOUL_RING_COLORS.find(c => target <= c.max) || SOUL_RING_COLORS[SOUL_RING_COLORS.length - 1];
    let skills = generateRingSkills(ringNum, target, G.martialSoul);
    G.soulRings.push({ years: target, color: color.cn, css: color.css, bg: color.bg, skills: skills, soulName: selected.soulName, tier: selected.tier, spiritSoul: true });
    G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);
    // Soul bone chance for high tier
    let boneHtml = '';
    if (selected.tier === 'beastgod') {
      let allBones = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
      allBones.forEach(b => { if (!G.soulBones.includes(b)) G.soulBones.push(b); });
      boneHtml = `<br><span style="color:var(--gold)">【凶兽魂灵附赠：全套六块魂骨！】</span>`;
    } else if (selected.tier === 'top' && Math.random() < 0.5) {
      let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
      let available = boneTypes.filter(b => !G.soulBones.includes(b));
      if (available.length > 0) {
        let bt = available[Math.floor(Math.random() * available.length)];
        G.soulBones.push(bt);
        boneHtml = `<br><span style="color:var(--gold)">【顶级魂灵附赠：${bt}！】</span>`;
      }
    }
    let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');
    let tierText = { low: '低级', mid: '中级', high: '高级', top: '顶级', beastgod: '凶兽级' }[selected.tier];
    area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">魂灵契约成功！</h3><p>在传灵塔与 <strong style="color:${selected.color}">${selected.soulName}</strong> 签订契约</p><p>获得 <span style="color:${color.bg}">${color.cn}魂环</span>（第${ringNum + 1}环 · ${tierText}魂灵 · ${target}年）</p><p>魂力+2级${boneHtml}</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
    G._ringSuccess = true;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 4800);
}

function drawMiniWheel(items) {
  const canvas = document.getElementById('mini-wheel-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2, r = 280;
  ctx.clearRect(0, 0, w, h);
  let total = items.reduce((s, i) => s + i.weight, 0);
  let startAngle = 0;
  items.forEach((item, i) => {
    let sliceAngle = (item.weight / total) * Math.PI * 2;
    let endAngle = startAngle + sliceAngle;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Microsoft YaHei';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 3;
    let label = item.name.split('\n')[0];
    ctx.fillText(label, r - 15, 5);
    ctx.restore();
    startAngle = endAngle;
  });
  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,215,0,0.5)';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function openSoulRingWheel(callback) {
  // God realm: divine bestowed ring, no hunting needed
  if (G.timeline?.soulRingMode === 'divine' || G.identityType === 'god') {
    let ringNum = G.soulRings.length + 1;
    if (ringNum > 9) { callback(null); return; }
    let divineColor = SOUL_RING_COLORS.find(c => G.soulPower <= c.max * ringNum / 9) || SOUL_RING_COLORS[SOUL_RING_COLORS.length - 1];
    if (G.soulPower >= 120) divineColor = SOUL_RING_COLORS.find(c => c.color === 'gold') || SOUL_RING_COLORS[5];
    else if (G.soulPower >= 96) divineColor = SOUL_RING_COLORS.find(c => c.color === 'red') || SOUL_RING_COLORS[4];
    else if (G.soulPower >= 76) divineColor = SOUL_RING_COLORS.find(c => c.color === 'black') || SOUL_RING_COLORS[3];
    else if (G.soulPower >= 56) divineColor = SOUL_RING_COLORS.find(c => c.color === 'purple') || SOUL_RING_COLORS[2];
    else divineColor = SOUL_RING_COLORS.find(c => c.color === 'yellow') || SOUL_RING_COLORS[1];

    let skills = generateRingSkills(ringNum, G.soulPower * 1000, G.martialSoul);
    G.soulRings.push({ years: 0, color: divineColor.cn, css: divineColor.css, bg: divineColor.bg, divine: true, skills: skills });
    G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);
    let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');
    let overlay = document.getElementById('mini-wheel-overlay');
    document.getElementById('mini-wheel-label').textContent = `第${ringNum + 1}魂环 · 神赐魂环`;
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
    document.getElementById('mini-wheel-result-area').innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">神赐魂环降临！</h3><p>神界之力为你凝聚第${ringNum + 1}魂环</p><p>获得 <span style="color:${divineColor.bg}">${divineColor.cn}神赐魂环</span></p><p style="margin-top:8px;color:var(--cyan)">魂环随等级提升而自动成长</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    drawMiniWheel([{ name: '神赐', weight: 1, color: '#ffdd44' }, { name: '魂环', weight: 1, color: '#aa66ff' }, { name: '降临', weight: 1, color: '#44ddff' }]);
    let canvas = document.getElementById('mini-wheel-canvas');
    canvas.style.transition = 'none';
    canvas.style.transform = 'rotate(0deg)';
    void canvas.offsetWidth;
    overlay.classList.add('active');
    miniWheelCallback = function () { callback(true); };
    return;
  }

  // Spirit mode (Douluo 3/4): contract spirit soul at Spirit Pagoda
  if (G.timeline?.soulRingMode === 'spirit') {
    openSpiritSoulWheel(callback);
    return;
  }

  // Normal hunting
  miniWheelSpinning = false; // reset stuck state
  miniWheelData = buildSoulRingWheel();
  if (!miniWheelData) { callback(false); return; }
  miniWheelCallback = function () { callback(G._ringSuccess || false); };
  let ringNum = G.soulRings.length + 1;
  let limit = getRingLimit(G.soulRings.length);
  let qualityBonus = G.martialSoul?.quality || '普通';
  document.getElementById('mini-wheel-label').textContent = `第${ringNum}魂环 · 承受极限${limit}年(${qualityBonus}武魂)`;
  document.getElementById('mini-wheel-hint').textContent = '选择猎杀策略，转盘决定你的猎杀目标';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinMiniWheel; // explicitly bind
  drawMiniWheel(miniWheelData);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinMiniWheel() {
  if (miniWheelSpinning) return;
  miniWheelSpinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  try {
    let total = miniWheelData.reduce((s, i) => s + i.weight, 0);
    let selected = weightedRandom(miniWheelData);
    let selectedIdx = miniWheelData.indexOf(selected);
    if (selectedIdx < 0) selectedIdx = 0;
    let cumWeight = 0;
    for (let i = 0; i < selectedIdx; i++) cumWeight += miniWheelData[i].weight;
    let sectorAngle = (selected.weight / total) * 360;
    let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
    let finalAngle = 360 * 6 + (360 - targetCenter + 270);
    canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
    canvas.style.transform = `rotate(${finalAngle}deg)`;
    setTimeout(() => {
      try {
        miniWheelSpinning = false;
        btn.classList.remove('btn-disabled');
        // Process result - all absorbs succeed, no death limit
        let ringNum = G.soulRings.length + 1;
        let limit = getRingLimit(ringNum - 1);
        let area = document.getElementById('mini-wheel-result-area');
        let target = selected.years;
        let color = SOUL_RING_COLORS.find(c => target <= c.max) || SOUL_RING_COLORS[SOUL_RING_COLORS.length - 1];

        // Generate skills
        let skills = generateRingSkills(ringNum, target, G.martialSoul);
        G.soulRings.push({
          years: target, color: color.cn, css: color.css, bg: color.bg,
          skills: skills
        });
        G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);

        // Soul bone: 100k guarantee 1 bone, 1M guarantee full set (6), others by chance
        let boneHtml = '';
        if (target >= 1000000) {
          let allBones = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
          allBones.forEach(b => { if (!G.soulBones.includes(b)) G.soulBones.push(b); });
          boneHtml = `<br><span style="color:var(--gold)">【百万年魂兽：获得全套六块魂骨！】</span>`;
        } else if (target >= 100000) {
          let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
          let available = boneTypes.filter(b => !G.soulBones.includes(b));
          if (available.length > 0) {
            let bt = available[Math.floor(Math.random() * available.length)];
            G.soulBones.push(bt);
            boneHtml = `<br><span style="color:var(--gold)">【十万年魂兽保底掉落：${bt}！】</span>`;
          }
        } else {
          let boneChance = target >= 10000 ? 0.2 : target >= 1000 ? 0.05 : 0.01;
          if (Math.random() < boneChance) {
            let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
            let bt = boneTypes[Math.floor(Math.random() * boneTypes.length)];
            if (!G.soulBones.includes(bt)) { G.soulBones.push(bt); }
            boneHtml = `<br><span style="color:var(--gold)">【额外掉落：${bt}！】</span>`;
          }
        }

        // Build skills display
        let skillCountText = skills.length > 1 ? `（${skills.length}个魂技）` : '';
        let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');

        // Show over-limit warning if applicable
        let overLimitHtml = '';
        if (target > limit) {
          overLimitHtml = `<p style="color:var(--gold);font-size:12px;">(${G.martialSoul?.quality || '普通'}武魂，承受极限${limit}年，你凭借强悍身体素质强行吸收！)</p>`;
        }

        G._ringSuccess = true;
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">猎杀成功！</h3><p>成功击杀 <strong>${target}年</strong> 魂兽</p><p>获得 <span style="color:${color.bg}">${color.cn}魂环</span>（第${ringNum + 1}环）${skillCountText}</p>${overLimitHtml}<p>魂力+2级${boneHtml}</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
        document.getElementById('mini-wheel-spin-btn').style.display = 'none';
        document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
      } catch (err) {
        console.error('魂环转盘结果处理出错:', err);
        miniWheelSpinning = false;
        document.getElementById('mini-wheel-result-area').innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘处理异常，请关闭后重试。</p></div>';
        document.getElementById('mini-wheel-spin-btn').style.display = 'none';
        document.getElementById('mini-wheel-hint').textContent = '点击任意处关闭';
      }
    }, 4800);
  } catch (err) {
    console.error('魂环转盘旋转出错:', err);
    miniWheelSpinning = false;
    btn.classList.remove('btn-disabled');
    alert('转盘异常，请重试。');
  }
}

// ============================================================
// YEAR EVENT WHEEL FUNCTIONS
// ============================================================
function buildYearEventWheel() {
  let isBeast = G.identityType === 'soul_beast';
  let items = YEAR_EVENT_WHEEL.map(sector => {
    let w = sector.weight;
    // Soul beast adjustments: lower timeline encounter, higher training
    if (isBeast) {
      if (sector.id === 'timeline') w = 3; // lower timeline encounter for beasts
      else if (sector.id === 'normal') w = 22; // higher training for beasts
      else if (sector.id === 'fortune') w = 12; // slightly lower fortune
      else if (sector.id === 'school') w = 0; // beasts don't go to school
      else if (sector.id === 'partner') w = 0; // beasts don't have spouses in human sense
      else if (sector.id === 'justice') w = 0; // beasts don't do justice events
      else if (sector.id === 'auction') w = 0; // beasts don't go to auctions
    }
    if (sector.condition && !sector.condition(G)) w = 0;
    return { ...sector, weight: w };
  }).filter(s => s.weight > 0);
  if (items.length === 0) items = [{ ...YEAR_EVENT_WHEEL[0], weight: 1 }];
  return items;
}

function openYearEventWheel(callback) {
  yearEventWheelData = buildYearEventWheel();
  yearEventResult = null;
  yearEventWheelCallback = function () { callback(yearEventResult); };
  document.getElementById('mini-wheel-label').textContent = '年度事件';
  document.getElementById('mini-wheel-hint').textContent = '命运的齿轮转动，这一年将会发生什么？';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinYearEventWheel;
  drawMiniWheel(yearEventWheelData);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinYearEventWheel() {
  if (yearEventWheelSpinning) return;
  yearEventWheelSpinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = yearEventWheelData.reduce((s, i) => s + i.weight, 0);
  let selected = weightedRandom(yearEventWheelData);
  let selectedIdx = yearEventWheelData.indexOf(selected);
  let cumWeight = 0;
  for (let i = 0; i < selectedIdx; i++) cumWeight += yearEventWheelData[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  setTimeout(() => {
    yearEventWheelSpinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let result = { event: null, subWheel: null };
    switch (selected.eventType) {
      case 'normal': { let ev = processNormalEvent(); result.event = ev; area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`; break; }
      case 'school': { let ev = processSchoolEvent(); result.event = ev; area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`; break; }
      case 'partner': { let ev = processPartnerEvent(); result.event = ev; area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`; break; }
      case 'justice': { let ev = processJusticeEvent(); result.event = ev; area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`; break; }
      case 'auction': { let ev = processAuctionEvent(); result.event = ev; area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`; break; }
      case 'fortune': { let ev = processFortuneEvent(); result.event = ev; area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`; break; }
      case 'enemy': { let enemyName = (G.timeline?.id === 'godrealm' && selected.nameOverride?.godrealm) ? selected.nameOverride.godrealm : selected.name; result.subWheel = 'enemy'; result.event = { type: 'battle', text: `<b style="color:var(--red);">【${enemyName}】</b> 宿命的对决——一位强敌挡在了你的面前！` }; area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${enemyName}</h3><p>${selected.desc}</p><p style="color:var(--gold);margin-top:8px;">${G.timeline?.id === 'godrealm' ? '神界动乱' : '强敌'}转盘即将开启，点击任意处继续...</p></div>`; break; }
      case 'timeline': { result.subWheel = 'timeline'; result.event = { type: 'fortune', text: `<b style="color:var(--gold);">【奇缘】</b> 命运的丝线将你与某位原著角色相连...` }; area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><p style="color:var(--gold);margin-top:8px;">时间线角色转盘即将开启，点击任意处继续...</p></div>`; break; }
      case 'reroll': {
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><p style="color:var(--green);margin-top:8px;">命运的齿轮再次转动，你将获得一次重新选择的机会！</p></div>`;
        document.getElementById('mini-wheel-spin-btn').style.display = '';
        document.getElementById('mini-wheel-spin-btn').classList.remove('btn-disabled');
        document.getElementById('mini-wheel-hint').textContent = '点击"旋转转盘"重新抽取';
        yearEventWheelSpinning = false;
        // Rebuild wheel data (excluding reroll to prevent infinite loops)
        yearEventWheelData = buildYearEventWheel().filter(s => s.id !== 'reroll');
        drawMiniWheel(yearEventWheelData);
        let canvas = document.getElementById('mini-wheel-canvas');
        canvas.style.transition = 'none';
        canvas.style.transform = 'rotate(0deg)';
        void canvas.offsetWidth;
        return;
      }
    }
    yearEventResult = result;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 4800);
}

function buildTimelineCharacterWheel() {
  let timelineId = G.timeline?.id || 'douluo1';
  let chars = TIMELINE_CHARACTERS[timelineId] || TIMELINE_CHARACTERS.douluo1;
  let age = G.age || 6;
  // Filter characters by age range - only show chars that could be alive at player's age
  let filtered = chars.filter(c => {
    if (!c.ageRange) return true; // no restriction
    return age >= c.ageRange[0] && age <= c.ageRange[1];
  });
  if (filtered.length === 0) filtered = chars; // fallback to all if none match
  return filtered.map(c => ({ name: c.name, weight: c.weight || 10, color: c.color || '#ff8800', _charData: c }));
}

function openTimelineCharacterWheel(callback) {
  timelineCharWheelData = buildTimelineCharacterWheel();
  timelineCharWheelCallback = callback;
  document.getElementById('mini-wheel-label').textContent = '时间线奇缘';
  document.getElementById('mini-wheel-hint').textContent = '命运的丝线将你与某位原著角色相连...';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinTimelineCharacterWheel;
  drawMiniWheel(timelineCharWheelData);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinTimelineCharacterWheel() {
  if (timelineCharWheelSpinning) return;
  timelineCharWheelSpinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let items = timelineCharWheelData;
  let total = items.reduce((s, i) => s + i.weight, 0);
  let selected = weightedRandom(items);
  let selectedIdx = items.indexOf(selected);
  let cumWeight = 0;
  for (let i = 0; i < selectedIdx; i++) cumWeight += items[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  setTimeout(() => {
    timelineCharWheelSpinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let charData = selected._charData;

    // Main characters get a good/bad fate spin
    let mainChars = ['唐三', '小舞', '霍雨浩', '唐舞麟', '毁灭之神', '生命女神', '善良之神', '邪恶之神'];
    let isMainChar = mainChars.some(name => charData.name.includes(name));
    let fateGood = true;
    let fateText = '';
    let effectText = '';

    if (isMainChar) {
      fateGood = Math.random() < 0.7; // 70% good fate
      if (fateGood) {
        let eventData = charData.events[Math.floor(Math.random() * charData.events.length)];
        effectText = eventData.effect(G);
        fateText = `<div style="margin-top:8px;padding:6px;background:rgba(0,255,128,0.1);border-radius:6px;"><span style="color:var(--green);font-weight:bold;">✦ 善缘</span> <span style="color:var(--gray);font-size:12px;">你与${charData.name}结下了善缘</span></div><div style="margin-top:10px;text-align:left;"><p>${eventData.text}</p><p style="color:var(--gold);margin-top:6px;">【${effectText}】</p></div>`;
      } else {
        // Bad fate: negative effect
        let badEvents = [
          { text: `你与${charData.name}产生了误会，被当作敌对势力的探子。`, loss: 5 },
          { text: `${charData.name}正处于麻烦之中，你无辜被卷入纷争。`, loss: 3 },
          { text: `${charData.name}的追随者嫉妒你得到了关注，暗中使绊子。`, loss: 4 },
          { text: `你撞见了${charData.name}的秘密，被要求保守秘密并付出代价。`, loss: 6 }
        ];
        let badEvent = badEvents[Math.floor(Math.random() * badEvents.length)];
        if (G.identityType === 'soul_beast') {
          let lossYears = badEvent.loss * 10;
          G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
          syncBeastSoulPower();
          effectText = `年限-${lossYears}年`;
        } else {
          G.soulPower = Math.max(G.soulPower - badEvent.loss, 1);
          effectText = `魂力-${badEvent.loss}级`;
        }
        fateText = `<div style="margin-top:8px;padding:6px;background:rgba(255,0,0,0.1);border-radius:6px;"><span style="color:var(--red);font-weight:bold;">✦ 恶缘</span> <span style="color:var(--gray);font-size:12px;">你与${charData.name}结下了恶缘</span></div><div style="margin-top:10px;text-align:left;"><p>${badEvent.text}</p><p style="color:var(--red);margin-top:6px;">【${effectText}】</p></div>`;
      }
    } else {
      let eventData = charData.events[Math.floor(Math.random() * charData.events.length)];
      effectText = eventData.effect(G);
      fateText = `<div style="margin-top:10px;text-align:left;"><p>${eventData.text}</p><p style="color:var(--gold);margin-top:6px;">【${effectText}】</p></div>`;
    }

    // Protagonist status sync
    let pStatus = getProtagonistStatus(G.timeline?.id, G.age);
    let statusHtml = '';
    if (pStatus && charData.name.includes(pStatus.name)) {
      statusHtml = `<div style="margin-top:6px;padding:4px 8px;background:rgba(255,215,0,0.08);border-radius:6px;border-left:3px solid var(--gold);"><span style="color:var(--gold);font-size:11px;">📖 原著同步：${pStatus.name}当前${pStatus.age}岁 — ${pStatus.status}</span></div>`;
    }

    area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${charData.name}</h3><p style="color:var(--cyan);">${charData.soul}</p><p style="font-size:12px;color:var(--gray);margin-top:4px;">${charData.desc}</p>${statusHtml}${fateText}</div>`;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 4800);
}

// Close mini wheel on click after result
function closeMiniWheel() {
  let overlay = document.getElementById('mini-wheel-overlay');
  if (!overlay.classList.contains('active')) return;
  let resultArea = document.getElementById('mini-wheel-result-area');
  if (resultArea.innerHTML === '' || miniWheelSpinning) return;
  if (loverWheelSpinning || enemyWheelSpinning || oppWheelSpinning || yearEventWheelSpinning || timelineCharWheelSpinning || spiritSoulWheelSpinning) return;

  // Find the ONE active callback (most recently set takes priority)
  let activeCb = null;
  if (spiritSoulWheelCallback) activeCb = spiritSoulWheelCallback;
  else if (yearEventWheelCallback) activeCb = yearEventWheelCallback;
  else if (timelineCharWheelCallback) activeCb = timelineCharWheelCallback;
  else if (enemyWheelCallback) activeCb = enemyWheelCallback;
  else if (loverWheelCallback) activeCb = loverWheelCallback;
  else if (oppWheelCallback) activeCb = oppWheelCallback;
  else if (miniWheelCallback) activeCb = miniWheelCallback;

  // Clear ALL state BEFORE firing callback (prevents cascade bugs)
  let cb = activeCb;
  miniWheelCallback = null;
  loverWheelCallback = null;
  enemyWheelCallback = null;
  oppWheelCallback = null;
  yearEventWheelCallback = null;
  timelineCharWheelCallback = null;
  spiritSoulWheelCallback = null;
  miniWheelSpinning = false;
  yearEventWheelSpinning = false;
  timelineCharWheelSpinning = false;
  spiritSoulWheelSpinning = false;
  overlay.classList.remove('active');

  // Now fire the callback - it can safely set up a new wheel
  if (cb) cb();
}

// ============================================================
// POST-RING OPPORTUNITY WHEEL
// ============================================================
const RING_OPPORTUNITY = [
  { id: 'sp', name: '魂力激增', weight: 30, color: '#22aa44', desc: '吸收魂环后，体内魂力暴涨！' },
  { id: 'bone', name: '意外魂骨', weight: 15, color: '#ffdd44', desc: '魂兽体内残存魂骨，意外获得！' },
  { id: 'custom_skill', name: '自创魂技', weight: 25, color: '#aa66ff', desc: '吸收过程中灵光一现，领悟了自创魂技！' },
  { id: 'nothing', name: '平稳吸收', weight: 30, color: '#888888', desc: '一切顺利，没有额外收获。' }
];

let oppWheelSpinning = false;
let oppWheelCallback = null;

// Self-created skill name generator
const CUSTOM_SKILL_PREFIX = {
  attack: ['裂空', '碎星', '灭世', '破天', '斩魂', '灭神', '噬魂', '碎虚', '裂地', '斩月', '天罚', '雷劫', '冰封', '焚天', '毒噬', '金刃', '龙吟', '凤鸣', '暗噬', '圣裁'],
  defense: ['铁壁', '金刚', '不动', '圣光', '玄武', '龙鳞', '冰盾', '土墙', '暗幕', '光幕'],
  control: ['锁魂', '禁锢', '幻境', '魅惑', '冰封', '缠绕', '精神', '空间', '时间', '因果'],
  boost: ['战神', '龙魂', '凤翼', '天使', '魔神', '圣灵', '狂战', '天神', '战意', '觉醒']
};

function generateCustomSkillName() {
  let types = Object.keys(CUSTOM_SKILL_PREFIX);
  let type = types[Math.floor(Math.random() * types.length)];
  let prefixes = CUSTOM_SKILL_PREFIX[type];
  let prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let suffixes = {
    attack: ['一击', '斩', '刃', '枪', '炮', '击', '裂', '灭', '杀', '破'],
    defense: ['之壁', '之盾', '护体', '屏障', '领域', '结界', '守护', '不动'],
    control: ['之术', '领域', '幻境', '束缚', '封锁', '压制', '催眠', '迷宫'],
    boost: ['之力', '附体', '觉醒', '增幅', '爆发', '化身', '共鸣', '灌注']
  };
  let suffix = suffixes[type][Math.floor(Math.random() * suffixes[type].length)];
  return { name: prefix + suffix, type: type };
}

function openOpportunityWheel(callback) {
  oppWheelCallback = callback;
  document.getElementById('mini-wheel-label').textContent = '魂环吸收机遇';
  document.getElementById('mini-wheel-hint').textContent = '吸收魂环后，命运给你带来了...';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  document.getElementById('mini-wheel-spin-btn').style.display = '';
  document.getElementById('mini-wheel-spin-btn').classList.remove('btn-disabled');
  document.getElementById('mini-wheel-spin-btn').onclick = spinOpportunityWheel;
  drawMiniWheel(RING_OPPORTUNITY);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinOpportunityWheel() {
  if (oppWheelSpinning) return;
  oppWheelSpinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let items = RING_OPPORTUNITY;
  let total = items.reduce((s, i) => s + i.weight, 0);
  let selected = weightedRandom(items);
  let selectedIdx = items.indexOf(selected);
  let cumWeight = 0;
  for (let i = 0; i < selectedIdx; i++) cumWeight += items[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 5 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 1.75s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  setTimeout(() => {
    oppWheelSpinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    switch (selected.id) {
      case 'sp': {
        let gain = 1 + Math.floor(Math.random() * 3);
        G.soulPower = Math.min(G.soulPower + gain, G.maxLevel);
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:#22aa44">魂力激增！</h3><p>吸收过程中，魂力额外暴涨！</p><p style="color:var(--gold);margin-top:8px;">魂力+${gain}级</p></div>`;
        break;
      }
      case 'bone': {
        let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
        let available = boneTypes.filter(b => !G.soulBones.includes(b));
        if (available.length > 0) {
          let bt = available[Math.floor(Math.random() * available.length)];
          G.soulBones.push(bt);
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">意外收获！</h3><p>魂兽体内残存着一块魂骨！</p><p style="color:var(--gold);margin-top:8px;">获得 <b>${bt}</b>！</p></div>`;
        } else {
          G.gold = (G.gold || 0) + 200;
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">魂骨已齐！</h3><p>发现魂骨，但你已集齐全套！</p><p style="color:var(--gold);margin-top:8px;">出售换取200金魂币</p></div>`;
        }
        break;
      }
      case 'custom_skill': {
        // Open custom skill sub-wheel
        document.getElementById('mini-wheel-spin-btn').style.display = 'none';
        document.getElementById('mini-wheel-hint').textContent = '灵感涌现，自创魂技...';
        let customSkill = generateCustomSkillName();
        let typeNames = { attack: '攻击', defense: '防御', control: '控制', boost: '增幅' };
        let typeColors = { attack: '#ff4444', defense: '#4488ff', control: '#aa66ff', boost: '#22aa44' };
        G.customSkills = G.customSkills || [];
        G.customSkills.push(customSkill);
        let skillDescs = {
          attack: `第${G.customSkills.length}自创魂技。灵感迸发，创造出强力攻击技能，可造成大量伤害。`,
          defense: `第${G.customSkills.length}自创魂技。感悟天地防御之道，创造出坚固的防御技能。`,
          control: `第${G.customSkills.length}自创魂技。领悟精神控制之妙，创造出控制类技能。`,
          boost: `第${G.customSkills.length}自创魂技。激发自身潜能，创造出增幅类技能。`
        };
        setTimeout(() => {
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:#aa66ff">灵光一现！</h3><p>你领悟了一门自创魂技！</p><p style="color:var(--gold);margin-top:8px;"><b>${customSkill.name}</b></p><p style="color:${typeColors[customSkill.type]};">类型：${typeNames[customSkill.type]}</p><p style="font-size:12px;color:var(--gray);margin-top:4px;">${skillDescs[customSkill.type]}</p></div>`;
          document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
        }, 500);
        break;
      }
      case 'nothing': {
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gray)">平稳吸收</h3><p>一切顺利，没有额外收获。</p><p style="color:var(--gray);margin-top:8px;">或许下次会有好运...</p></div>`;
        break;
      }
    }
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 3800);
}

// ============================================================
// LOVER WHEEL SYSTEM
// ============================================================
let loverWheelData = null;
let loverWheelSpinning = false;
let loverWheelCallback = null;

function buildLoverWheel() {
  // Determine target pool based on player gender
  let poolKey = G.gender?.id === 'female' ? 'male_target' : 'female_target';
  if (G.gender?.id === 'male') poolKey = 'female_target';
  if (G.gender?.id === 'none') poolKey = Math.random() < 0.5 ? 'male_target' : 'female_target';

  let pool = LOVER_POOL[poolKey] || LOVER_POOL.female_target;

  // Adjust weights based on player personality (attraction to certain traits)
  let playerTrait = G.personality?.id || 'calm';
  let playerCharm = G.appearance?.attr?.charm || 5;

  // Copy pool and adjust weights
  let items = pool.map(l => {
    let adjustedWeight = l.weight;
    // Opposites attract: if player has certain trait, opposite trait gets bonus
    let traitBonus = {
      gentle: { proud: 1.3, crafty: 1.1 },
      proud: { gentle: 1.3, cheerful: 1.2 },
      hotblood: { calm: 1.4, crafty: 0.8 },
      calm: { hotblood: 1.3, cheerful: 1.1 },
      crafty: { gentle: 1.2, hotblood: 0.9 },
      cheerful: { proud: 1.2, calm: 1.1 },
      mysterious: { cheerful: 1.3, gentle: 1.2 },
      ruthless: { gentle: 1.5, cheerful: 1.3 },
      lazy: { proud: 1.2, crafty: 0.9 }
    };
    let bonusMap = traitBonus[playerTrait] || {};
    if (bonusMap[l.trait]) adjustedWeight *= bonusMap[l.trait];
    // Charm bonus: higher charm = higher chance of meeting higher quality lover
    adjustedWeight *= (0.8 + playerCharm * 0.04);
    return { ...l, weight: Math.round(adjustedWeight) };
  });

  // Add colors
  let colors = ['#ff66aa', '#aa66ff', '#66aaff', '#ffaa44', '#44ddaa', '#ff4444', '#ffdd44', '#aa88ff'];
  items.forEach((it, i) => { it.color = colors[i % colors.length]; });
  return items;
}

function openLoverWheel(callback) {
  loverWheelData = buildLoverWheel();
  loverWheelCallback = callback;
  document.getElementById('mini-wheel-label').textContent = '邂逅...';
  document.getElementById('mini-wheel-hint').textContent = '命运的转盘在转动，你会遇见谁？';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  document.getElementById('mini-wheel-spin-btn').style.display = '';
  document.getElementById('mini-wheel-spin-btn').classList.remove('btn-disabled');
  document.getElementById('mini-wheel-spin-btn').onclick = spinLoverWheel;
  drawMiniWheel(loverWheelData);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinLoverWheel() {
  if (loverWheelSpinning) return;
  loverWheelSpinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = loverWheelData.reduce((s, i) => s + i.weight, 0);
  let selected = weightedRandom(loverWheelData);
  let selectedIdx = loverWheelData.indexOf(selected);
  let cumWeight = 0;
  for (let i = 0; i < selectedIdx; i++) cumWeight += loverWheelData[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  setTimeout(() => {
    loverWheelSpinning = false;
    btn.classList.remove('btn-disabled');
    // Determine success chance based on charm and personality
    let charm = G.appearance?.attr?.charm || 5;
    let romanceTrait = G.personality?.traits?.romance || 1;
    let successChance = 0.3 + charm * 0.05 + romanceTrait * 0.1;
    let success = Math.random() < successChance;

    let area = document.getElementById('mini-wheel-result-area');
    if (success) {
      G.hasSpouse = true;
      G.spouse = { name: selected.name, trait: selected.trait, soul: selected.soul };
      area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">一见钟情！</h3><p>你遇到了 <strong style="color:${selected.color}">${selected.name}</strong></p><p>性格：${PERSONALITIES.find(p => p.id === selected.trait)?.name || selected.trait} | ${selected.soul}</p><p style="color:var(--cyan);margin-top:8px;">你们结为道侣，从此携手共闯斗罗大陆！</p></div>`;
    } else {
      G.companions.push(selected.name);
      area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--cyan)">擦肩而过</h3><p>你遇到了 <strong style="color:${selected.color}">${selected.name}</strong></p><p>虽然没能更进一步，但你们成为了朋友。</p><p style="color:var(--gray);margin-top:8px;">（加入伙伴列表）</p></div>`;
    }
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 4800);
}

// ============================================================
// ENEMY WHEEL SYSTEM
// ============================================================
let enemyWheelData = null;
let enemyWheelSpinning = false;
let enemyWheelCallback = null;


// ============================================================
// WHEEL SYSTEM
// ============================================================
function drawWheel(items, labelKey, colorKey) {
  const canvas = document.getElementById('wheel-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2, r = 340;
  ctx.clearRect(0, 0, w, h);

  let total = items.reduce((s, i) => s + i.weight, 0);
  let startAngle = 0;

  items.forEach((item, i) => {
    let sliceAngle = (item.weight / total) * Math.PI * 2;
    let endAngle = startAngle + sliceAngle;

    // Draw sector
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();

    let color = item[colorKey] || `hsl(${(i / items.length) * 360},60%,30%)`;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Microsoft YaHei';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    let label = item[labelKey];
    if (label.length > 8) label = label.substring(0, 8) + '…';
    ctx.fillText(label, r - 20, 6);
    ctx.restore();

    startAngle = endAngle;
  });

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,215,0,0.5)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner decoration
  for (let i = 0; i < items.length; i++) {
    let angle = (i / items.length) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, angle, angle + 0.02);
    ctx.strokeStyle = 'rgba(255,215,0,0.8)';
    ctx.lineWidth = 6;
    ctx.stroke();
  }
}

function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  const btn = document.getElementById('wheel-spin-btn');
  btn.classList.add('btn-disabled');

  const canvas = document.getElementById('wheel-canvas');
  let total = currentWheelData.reduce((s, i) => s + i.weight, 0);
  let selectedItem = weightedRandom(currentWheelData);
  let selectedIdx = currentWheelData.indexOf(selectedItem);

  // Calculate target angle
  let cumWeight = 0;
  for (let i = 0; i < selectedIdx; i++)cumWeight += currentWheelData[i].weight;
  let sectorAngle = (selectedItem.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  // Pointer is at top (270 degrees), adjust
  let finalAngle = 360 * 8 + (360 - targetCenter + 270);

  canvas.style.transition = 'transform 6s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;

  setTimeout(() => {
    isSpinning = false;
    btn.classList.remove('btn-disabled');
    onWheelResult(selectedItem);
  }, 6200);
}

