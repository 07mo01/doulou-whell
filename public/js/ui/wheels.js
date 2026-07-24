// Wheel-related UI and interaction logic extracted from app.js

const wheelRuntime = window.WheelRuntime || (window.WheelRuntime = {});

// Year event wheel globals
let yearEventWheelData = null;
let yearEventWheelSpinning = false;
let yearEventWheelCallback = null;
let yearEventResult = null;
let timelineCharWheelData = null;
let timelineCharWheelSpinning = false;
let timelineCharWheelCallback = null;

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
  if (resultArea.innerHTML === '' || wheelRuntime.miniWheelSpinning) return;
  if (loverWheelSpinning || enemyWheelSpinning || wheelRuntime.oppWheelSpinning || yearEventWheelSpinning || timelineCharWheelSpinning || wheelRuntime.spiritSoulWheelSpinning) return;

  // Find the ONE active callback (most recently set takes priority)
  let activeCb = null;
  if (wheelRuntime.spiritSoulWheelCallback) activeCb = wheelRuntime.spiritSoulWheelCallback;
  else if (yearEventWheelCallback) activeCb = yearEventWheelCallback;
  else if (timelineCharWheelCallback) activeCb = timelineCharWheelCallback;
  else if (enemyWheelCallback) activeCb = enemyWheelCallback;
  else if (loverWheelCallback) activeCb = loverWheelCallback;
  else if (wheelRuntime.oppWheelCallback) activeCb = wheelRuntime.oppWheelCallback;
  else if (wheelRuntime.miniWheelCallback) activeCb = wheelRuntime.miniWheelCallback;

  // Clear ALL state BEFORE firing callback (prevents cascade bugs)
  let cb = activeCb;
  wheelRuntime.miniWheelCallback = null;
  loverWheelCallback = null;
  enemyWheelCallback = null;
  wheelRuntime.oppWheelCallback = null;
  yearEventWheelCallback = null;
  timelineCharWheelCallback = null;
  wheelRuntime.spiritSoulWheelCallback = null;
  wheelRuntime.miniWheelSpinning = false;
  yearEventWheelSpinning = false;
  timelineCharWheelSpinning = false;
  wheelRuntime.spiritSoulWheelSpinning = false;
  wheelRuntime.oppWheelSpinning = false;
  overlay.classList.remove('active');

  // Now fire the callback - it can safely set up a new wheel
  if (cb) cb();
}

function openYearEventWheelAsync() {
  return new Promise(resolve => {
    openYearEventWheel(resolve);
  });
}

function openTimelineCharacterWheelAsync() {
  return new Promise(resolve => {
    openTimelineCharacterWheel(resolve);
  });
}

function openEnemyWheelAsync() {
  return new Promise(resolve => {
    openEnemyWheel(resolve);
  });
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

function buildEnemyWheel() {
  let pool;
  if (G.identityType === 'soul_beast') {
    pool = BEAST_ENEMY_POOL.filter(e => {
      // 天劫雷罚只有十万年未化形的魂兽才会触发
      if (e.type === 'heaven') return (G.beastYears >= 100000 && !G.transformed);
      return true;
    });
  } else {
    let timelineId = G.timeline?.id || 'douluo1';
    pool = ENEMY_POOL[timelineId] || ENEMY_POOL.douluo1;
    pool = [...pool];
  }
  let playerEnemyTrait = G.personality?.traits?.enemy || 1;

  let items = pool.map(e => {
    let w = e.weight * playerEnemyTrait;
    if (G.appearance?.id === 'fierce') w *= 1.3;
    if (G.appearance?.id === 'divine') w *= 1.5;
    return { ...e, weight: Math.round(w) };
  });

  let colors = ['#aa2222', '#662222', '#222266', '#226622', '#662266', '#ff4444', '#aa44aa', '#444444'];
  items.forEach((it, i) => { it.color = colors[i % colors.length]; });
  return items;
}

function openEnemyWheel(callback) {
  enemyWheelData = buildEnemyWheel();
  enemyWheelCallback = callback;
  document.getElementById('mini-wheel-label').textContent = (G.timeline?.id === 'godrealm') ? '神界动乱！' : '强敌来袭！';
  document.getElementById('mini-wheel-hint').textContent = '命运的转盘在转动，你的对手是谁？';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  document.getElementById('mini-wheel-spin-btn').style.display = '';
  document.getElementById('mini-wheel-spin-btn').classList.remove('btn-disabled');
  document.getElementById('mini-wheel-spin-btn').onclick = spinEnemyWheel;
  drawMiniWheel(enemyWheelData);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinEnemyWheel() {
  if (enemyWheelSpinning) return;
  enemyWheelSpinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = enemyWheelData.reduce((s, i) => s + i.weight, 0);
  let selected = weightedRandom(enemyWheelData);
  let selectedIdx = enemyWheelData.indexOf(selected);
  let cumWeight = 0;
  for (let i = 0; i < selectedIdx; i++) cumWeight += enemyWheelData[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  setTimeout(() => {
    enemyWheelSpinning = false;
    btn.classList.remove('btn-disabled');
    let enemyLevel = Math.max(1, Math.round(G.soulPower * selected.power + (Math.random() * 10 - 5)));

    let isBeast = G.identityType === 'soul_beast';
    let isHumanEnemy = selected.type === 'human' || selected.type === 'evil_human';
    let canEscape = isBeast && isHumanEnemy;

    let charm = G.appearance?.attr?.charm || 5;
    let isFemale = G.gender?.id === 'female';
    let isFierce = G.appearance?.id === 'fierce';
    let isDivine = G.appearance?.id === 'divine';
    let isEvil = selected.type === 'evil' || selected.type === 'evil_human';

    let playerCP = calculateCombatPower(G, false);
    let enemyCP = calculateCombatPower({ level: enemyLevel, power: selected.power }, true);
    let cpDiff = playerCP - enemyCP;
    let cpRatio = cpDiff / Math.max(enemyCP, 1);

    let diff = G.soulPower - enemyLevel;
    let winChance = 0.5 + diff * 0.02 + cpRatio * 0.3;

    let hasControlSkill = (G.customSkills || []).some(s => s.type === 'control');
    let hasBoostSkill = (G.customSkills || []).some(s => s.type === 'boost');
    let hasDefenseSkill = (G.customSkills || []).some(s => s.type === 'defense');
    let numRings = (G.soulRings || []).length;
    let numBones = (G.soulBones || []).length;
    if (hasControlSkill && enemyLevel <= G.soulPower + 5) winChance += 0.08;
    if (hasBoostSkill) winChance += 0.05;
    if (hasDefenseSkill && diff < 0) winChance += 0.06;
    if (numBones >= 4) winChance += 0.05;
    if (numRings >= 7) winChance += 0.04;

    if (isFierce) winChance += 0.03;
    if (isDivine && isEvil) winChance += 0.06;
    winChance = Math.max(0.05, Math.min(0.95, winChance));
    let win = Math.random() < winChance;

    let playerCPRating = getCombatPowerRating(playerCP);
    let enemyCPRating = getCombatPowerRating(enemyCP);
    let cpDisplay = `<p style="font-size:12px;color:var(--gray);margin-top:6px;">我方战力：<span style="color:${playerCPRating.color};">${playerCP}</span>（${playerCPRating.name}） | 敌方战力：<span style="color:${enemyCPRating.color};">${enemyCP}</span>（${enemyCPRating.name}）</p>`;

    let area = document.getElementById('mini-wheel-result-area');
    let enemyInfo = { name: selected.name, level: enemyLevel, type: selected.type, cp: enemyCP };

    if (canEscape && !win) {
      let escapeChance = 0.3 + (G.bloodline?.attr?.speed || 0) * 0.1;
      let escaped = Math.random() < escapeChance;
      if (escaped) {
        let lossYears = 1 + Math.floor(Math.random() * 3);
        G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
        syncBeastSoulPower();
        G.enemies.push({ ...enemyInfo, escaped: true });
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--green)">成功逃脱！</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你察觉到危险，凭借魂兽的本能迅速逃离了人类的猎杀范围！</p><p style="color:var(--gold);margin-top:8px;">逃脱成功，仅损失${lossYears}年修为</p></div>`;
      } else {
        let lossCap = isEvil ? 10 : 5;
        let loss = Math.min(Math.floor(enemyLevel * 0.3), lossCap);
        let lossYears = Math.floor(loss * 10 + Math.random() * 20);
        G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
        syncBeastSoulPower();
        G.enemies.push({ ...enemyInfo, defeated: true });
        if (Math.random() < 0.15 * selected.power) {
          G.alive = false;
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">命丧猎魂师之手</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你试图逃跑但失败了，最终被人类猎魂师击杀，成为了他们的魂环...</p><p style="color:var(--red);margin-top:8px;">年限-${lossYears}年</p></div>`;
        } else {
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">逃脱失败</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你没能成功逃脱，被人类重创后勉强挣脱...</p><p style="color:var(--red);margin-top:8px;">年限-${lossYears}年</p></div>`;
        }
      }
    } else if (win) {
      let reward = Math.min(Math.floor(enemyLevel * 0.5), 10);
      if (isBeast) {
        let gainYears = 100 + Math.floor(Math.random() * 200);
        G.beastYears = (G.beastYears || 0) + gainYears;
        syncBeastSoulPower();
        G.gold = (G.gold || 0) + Math.floor(enemyLevel * 5);
        G.enemies.push(enemyInfo);
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">战斗胜利！</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你成功击败了入侵者，吞噬了对方的能量！</p><p style="color:var(--green);margin-top:8px;">年限+${gainYears}年 | 获得${Math.floor(enemyLevel * 5)}金魂币</p></div>`;
      } else {
        G.soulPower = Math.min(G.soulPower + reward, G.maxLevel);
        G.gold = (G.gold || 0) + Math.floor(enemyLevel * 10);
        G.enemies.push(enemyInfo);
        let extraText = '';
        if (isFierce) extraText = '<br><span style="color:var(--cyan);font-size:12px;">你的凶相让敌人心生畏惧，战斗更加顺利。</span>';
        if (hasControlSkill) extraText += '<br><span style="color:var(--purple);font-size:12px;">你用控制系自创魂技牵制了敌人，占据了上风！</span>';
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">战斗胜利！</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你成功击败了对手！</p><p style="color:var(--green);margin-top:8px;">魂力+${reward}级 | 获得${Math.floor(enemyLevel * 10)}金魂币</p>${extraText}</div>`;
      }
    } else {
      let lossCap = isEvil ? 10 : 5;
      let loss = Math.min(Math.floor(enemyLevel * 0.3), lossCap);

      if (isBeast) {
        let lossYears = Math.floor(loss * 10 + Math.random() * 20);
        G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
        syncBeastSoulPower();
        G.enemies.push({ ...enemyInfo, defeated: true });
        if (Math.random() < 0.15 * selected.power) {
          G.alive = false;
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">陨落</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>实力差距太大，你倒在了强敌的爪下...</p><p style="color:var(--red);margin-top:8px;">年限-${lossYears}年</p></div>`;
        } else {
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">战斗失败</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你被击败了，身受重伤...</p><p style="color:var(--red);margin-top:8px;">年限-${lossYears}年</p></div>`;
        }
      } else {
        G.soulPower = Math.max(G.soulPower - loss, 1);
        G.enemies.push({ ...enemyInfo, defeated: true });

        let specialResult = false;
        if (isEvil && isFemale && charm >= 8 && Math.random() < 0.3) {
          let drainExtra = Math.min(Math.floor(enemyLevel * 0.2), 5);
          G.soulPower = Math.max(G.soulPower - drainExtra, 1);
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">邪魂师的觊觎</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>邪魂师被你的容貌所吸引，没有直接杀你，而是用邪术大量吸取了你的魂力，欲将你掳走修炼...</p><p style="color:var(--red);margin-top:8px;">魂力-${loss + drainExtra}级（被吸取）</p></div>`;
          specialResult = true;
        } else if (isEvil && isDivine && Math.random() < 0.2) {
          let recover = Math.min(3, loss);
          G.soulPower = Math.min(G.soulPower + recover, G.maxLevel);
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">神辉护体！</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你身上散发的神辉让邪魂师痛苦不堪，他的邪术被净化了大半！</p><p style="color:var(--gold);margin-top:8px;">魂力-${loss}级，但神辉净化后恢复${recover}级</p></div>`;
          specialResult = true;
        } else if (isEvil) {
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">邪魂侵蚀</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你被邪魂师击败，邪术侵蚀了你的经脉，大量魂力被吸取...</p><p style="color:var(--red);margin-top:8px;">魂力-${loss}级</p></div>`;
        }

        if (!specialResult) {
          if (Math.random() < 0.15 * selected.power) {
            G.alive = false;
            if (isEvil) {
              area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">魂飞魄散</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>邪魂师将你彻底吞噬，连灵魂都没有留下...</p><p style="color:var(--red);margin-top:8px;">魂力-${loss}级</p></div>`;
            } else {
              area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">命丧敌手！</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>实力差距太大，你倒在了血泊之中...</p><p style="color:var(--red);margin-top:8px;">魂力-${loss}级</p></div>`;
            }
          } else {
            if (isFierce) {
              area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">战斗失败</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你被击败了，但你的凶相让敌人不敢追击，得以保全性命。</p><p style="color:var(--red);margin-top:8px;">魂力-${loss}级</p></div>`;
            } else {
              area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--red)">战斗失败</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你被击败了，身受重伤...</p><p style="color:var(--red);margin-top:8px;">魂力-${loss}级</p></div>`;
            }
          }
        }
      }
    }
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 4800);
}


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

