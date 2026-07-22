// Rendering and DOM composition helpers extracted from app.js

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  let el = document.getElementById(id);
  if (el) el.classList.add('active');
  else console.error('Screen not found:', id);
}

// ============================================================
// GAME FLOW
// ============================================================
// ============================================================
// QUICK RANDOM SYSTEM

function renderRandomCharCard(c, idx) {
  let typeLabel = c.identityType === 'soul_beast' ? '🐾 魂兽' : '⚔️ 魂师';
  let typeColor = c.identityType === 'soul_beast' ? 'var(--cyan)' : 'var(--gold)';
  let mainColor = c.identityType === 'soul_beast' ? (c.bloodline?.color || 'var(--cyan)') : (c.martialSoul?.qColor || 'var(--gold)');

  let infoRows = '';
  infoRows += `<div class="review-info-row"><span class="review-info-label">时代</span><span class="review-info-value" style="color:${c.timeline?.eraColor || '#888'}">${c.timeline?.name || '未知'}</span></div>`;
  infoRows += `<div class="review-info-row"><span class="review-info-label">身份</span><span class="review-info-value">${c.identity?.name || '未知'}</span></div>`;

  if (c.identityType === 'soul_beast') {
    infoRows += `<div class="review-info-row"><span class="review-info-label">血脉</span><span class="review-info-value" style="color:${c.bloodline?.color || '#888'}">${c.bloodline?.name || '未知'}</span></div>`;
    infoRows += `<div class="review-info-row"><span class="review-info-label">出生地</span><span class="review-info-value">${c.birthplace?.name || '未知'}</span></div>`;
  } else {
    infoRows += `<div class="review-info-row"><span class="review-info-label">性别</span><span class="review-info-value">${c.gender?.name || '未知'}</span></div>`;
    if (c.martialSoul?.isDual) {
      let s1 = c.martialSoul?.souls?.[0]?.name || '?';
      let s2 = c.martialSoul?.souls?.[1]?.name || '?';
      infoRows += `<div class="review-info-row"><span class="review-info-label">武魂</span><span class="review-info-value" style="color:#ff4444">${s1} / ${s2}</span></div>`;
    } else {
      infoRows += `<div class="review-info-row"><span class="review-info-label">武魂</span><span class="review-info-value" style="color:${c.martialSoul?.qColor || '#888'}">${c.martialSoul?.name || '未知'}</span></div>`;
    }
    infoRows += `<div class="review-info-row"><span class="review-info-label">先天魂力</span><span class="review-info-value" style="color:${c.innateRatingColor || '#888'}">${c.innateRating || '未知'}</span></div>`;
  }

  infoRows += `<div class="review-info-row"><span class="review-info-label">性格</span><span class="review-info-value">${c.personality?.name || '未知'}</span></div>`;
  infoRows += `<div class="review-info-row"><span class="review-info-label">外貌</span><span class="review-info-value">${c.appearance?.name || '未知'}</span></div>`;

  return `
  <div style="background:var(--card);border:2px solid ${mainColor};border-radius:12px;padding:20px;margin-bottom:15px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="color:${typeColor};font-size:18px;">${typeLabel}</h3>
      <span style="color:var(--gray);font-size:12px;"># ${idx + 1}</span>
    </div>
    ${infoRows}
  </div>`;
}

let _quickRandomHuman = null;
let _quickRandomBeast = null;

function startQuickRandom() {
  _quickRandomHuman = generateRandomCharacter('human');
  _quickRandomBeast = generateRandomCharacter('soul_beast');
  renderQuickRandom();
}

function renderQuickRandom() {
  let content = document.getElementById('quick-random-content');
  content.innerHTML = `
    <h2 style="color:var(--gold);text-align:center;margin:20px 0 5px;">⚡ 快速随机预览</h2>
    <p style="color:var(--gray);text-align:center;margin-bottom:20px;font-size:13px;">同时随机一个魂师和一个魂兽，选择你心仪的开始游戏</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
      ${renderRandomCharCard(_quickRandomHuman, 0)}
      ${renderRandomCharCard(_quickRandomBeast, 1)}
    </div>
    <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
      <button class="btn" onclick="rerollQuickRandom()">🎲 不满意，重新随机</button>
      <button class="btn btn-blue" onclick="startGameFromQuick('human')">⚔️ 以这个魂师开始</button>
      <button class="btn btn-blue" style="border-color:var(--cyan);color:var(--cyan);" onclick="startGameFromQuick('soul_beast')">🐾 以这个魂兽开始</button>
    </div>
  `;
  showScreen('screen-quick-random');
}

function renderSidebar() {
  const sb = document.getElementById('life-sidebar');
  let levelName = getLevelName(G.soulPower);
  let maxForBar = G.timeline?.id === 'douluo4' ? 150 : G.timeline?.id === 'godrealm' ? 200 : 99;
  let pct = Math.min(G.soulPower / maxForBar * 100, 100);

  let ringsHtml = '<div class="ring-slots">';
  for (let i = 0; i < 9; i++) {
    if (Array.isArray(G.soulRings) && i < G.soulRings.length) {
      let r = G.soulRings[i];
      let tip = r.divine ? '神赐魂环' : `${r.years}年`;
      let skillTip = r.skills ? r.skills.map(s => s.name).join(', ') : '';
      ringsHtml += `<div class="ring-slot ${r.css}" title="${tip} - ${r.color}${skillTip ? ' | ' + skillTip : ''}"></div>`;
    } else {
      ringsHtml += `<div class="ring-slot empty" title="空"></div>`;
    }
  }
  ringsHtml += '</div>';
  // Show skills list for all rings
  let allSkillsHtml = '';
  if (Array.isArray(G.soulRings) && G.soulRings.some(r => r.skills)) {
    allSkillsHtml = '<div style="margin-top:6px;max-height:120px;overflow-y:auto;">';
    G.soulRings.forEach((r, i) => {
      if (r.skills) {
        r.skills.forEach(s => {
          allSkillsHtml += `<div style="font-size:11px;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="color:${r.bg};">第${i + 1}环</span> <span style="color:var(--gold)">${s.name}</span></div>`;
        });
      }
    });
    allSkillsHtml += '</div>';
  }

  let bonesHtml = G.soulBones.length > 0 ? G.soulBones.map(b => `<span style="color:var(--gold);font-size:12px;">${b}</span>`).join(' ') : '<span style="color:var(--gray);font-size:12px;">无</span>';

  let armorName = '';
  if (G.battleArmor > 0) {
    let names = ['', '一字', '二字', '三字', '四字', '五字', '六字'];
    armorName = names[G.battleArmor] + '斗铠';
  }

  sb.innerHTML = `
    <div class="sidebar-title">${G.timeline.name}</div>
    <div class="sidebar-section">
      <h4>基本信息</h4>
      <div style="font-size:13px;line-height:1.8;">
        <div>年龄：<span style="color:var(--gold)">${G.age}岁</span>${G.transformed ? `<span style="color:var(--gray);font-size:11px;">（化形前：${formatYears(G.transformedBeastYears || 0)}）</span>` : ''}</div>
        <div>身份：<span style="color:var(--cyan)">${G.identity.name}</span></div>
        ${G.identityType === 'god' && G.godPosition ? `<div>神位：<span style="color:${G.godPosition.color || 'var(--gold)'};font-weight:bold;">✦ ${G.godPosition.name}</span></div>` : ''}
        ${G.identityType === 'god' && G.godArtifact ? `<div>神器：<span style="color:${G.godArtifact.color || 'var(--gold)'}">${G.godArtifact.name}</span></div>` : ''}
        ${G.identityType !== 'soul_beast' ? `<div>性别：${G.gender.name}</div>` : ''}
        ${G.personality ? `<div>性格：<span style="color:${G.personality.color}">${G.personality.name}</span></div>` : ''}
        ${G.appearance ? `<div>外貌：<span style="color:${G.appearance.color}">${G.appearance.name}</span></div>` : ''}
        ${G.faction ? `<div>势力：<span style="color:var(--blue)">${G.faction}</span></div>` : ''}
        ${G.hasSpouse && G.spouse ? `<div>道侣：<span style="color:#ff88aa;">${G.spouse.name}</span></div>` : G.hasSpouse ? '<div style="color:#ff88aa;">有情缘</div>' : ''}
        ${G.bloodline ? `<div>血脉：<span style="color:${G.bloodline.color || 'var(--purple)'}">${G.bloodline.name || G.bloodline}</span></div>` : ''}
        ${G.birthplace ? `<div>降生地：<span style="color:${G.birthplace.color || 'var(--green)'}">${G.birthplace.name || G.birthplace}</span></div>` : ''}
        ${G.identityType === 'soul_beast' && G.beastYears !== undefined ? `<div>年限：<span style="color:var(--gold)">${formatYears(G.beastYears)}</span></div>` : ''}
        ${G.customTitle && G.soulPower >= 90 ? `<div>封号：<span style="color:var(--gold);font-weight:bold;">${G.customTitle}斗罗</span></div>` : ''}
        ${G.chosenPath === 'family' ? `<div>道路：<span style="color:#ff66aa;">成家立业</span></div>` : G.chosenPath === 'god' ? `<div>道路：<span style="color:var(--gold);">追求神位</span></div>` : ''}
      </div>
    </div>
    <div class="sidebar-section">
      <h4>${G.identityType === 'soul_beast' ? '修为年限' : '魂力等级'}</h4>
      <div style="font-size:13px;">
        ${G.identityType === 'soul_beast' ? `
          <span style="color:var(--gold);font-size:16px;font-weight:bold;">${formatYears(G.beastYears || 0)}</span>
          <span style="color:var(--gray);margin-left:8px;font-size:12px;">≈人类${G.soulPower}级</span>
        `: `
          <span style="color:var(--gold);font-size:18px;font-weight:bold;">${G.soulPower}级</span>
          <span style="color:var(--gray);margin-left:8px;">${levelName}</span>
        `}
        ${G.transformed ? `<div style="color:var(--cyan);font-size:11px;margin-top:2px;">🦋 化形修为：${formatYears(G.transformedBeastYears || 0)}（已化形）</div>` : ''}
      </div>
      ${G.identityType !== 'soul_beast' ? `<div class="sp-bar"><div class="sp-fill" style="width:${pct}%" data-text="${G.soulPower}/${maxForBar}"></div></div>` : ''}
    </div>
    <div class="sidebar-section">
      <h4>战力评估</h4>
      <div style="font-size:13px;">
        ${(() => { let cp = calculateCombatPower(G, false); let rating = getCombatPowerRating(cp); return `<span style="color:${rating.color};font-size:16px;font-weight:bold;">${cp}</span><span style="color:var(--gray);margin-left:8px;font-size:12px;">${rating.name}</span>`; })()}
      </div>
    </div>
    ${G.isGod ? `<div class="sidebar-section"><h4>神位</h4><div style="color:var(--gold);font-size:15px;font-weight:bold;">✦ ${G.godTitle}</div></div>` : ''}
    ${G.identityType !== 'soul_beast' ? `
    <div class="sidebar-section">
      <h4>武魂</h4>
      <div style="font-size:13px;">
        ${G.martialSoul?.souls && G.martialSoul.souls.length > 1 ? G.martialSoul.souls.map((s, i) => `
          <div style="margin-bottom:4px;${i === (G.martialSoul.activeIndex || 0) ? '' : 'opacity:0.4'}">
            <span style="color:${i === (G.martialSoul.activeIndex || 0) ? (s.qColor || '#ff4444') : '#888'};cursor:pointer;" onclick="switchActiveSoul(${i})" title="点击切换">[${i === (G.martialSoul.activeIndex || 0) ? '●' : '○'}] ${s.name}</span>
            ${s.evolutionStage ? `<span style="color:var(--gold);font-size:10px;margin-left:2px;">阶</span>` : ''}
          </div>
        `).join('') : `
        <span style="color:${G.martialSoul?.qColor || '#888'}">${G.martialSoul?.example || '未知'}</span>
        `}
        <span style="color:var(--gray);font-size:11px;"> ${G.martialSoul?.quality || ''}</span>
        ${(getActiveSoul()?.evolutionStage) ? `<span style="color:var(--gold);font-size:11px;margin-left:4px;">[第${getActiveSoul().evolutionStage}阶]</span>` : ''}
      </div>
      ${(() => { let as = getActiveSoul(); return as && as._baseName && as._baseName !== as.name ? `<div style="font-size:11px;color:var(--cyan);margin-top:2px;">${as._baseName} → ${as.name}</div>` : '' })()}
    </div>
    `: ''}
    ${G.identityType !== 'soul_beast' ? `
    <div class="sidebar-section">
      <h4>魂环 (${G.soulRings.length}/9) ${G.martialSoul?.souls && G.martialSoul.souls.length > 1 ? `<span style="font-size:10px;color:var(--gray);">[${getActiveSoul()?.name || ''}]</span>` : ''}</h4>
      ${ringsHtml}
      ${allSkillsHtml}
    </div>
    <div class="sidebar-section">
      <h4>魂骨 (${G.soulBones.length}/6)</h4>
      ${bonesHtml}
    </div>
    ${(G.soulCore || 0) > 0 ? `<div class="sidebar-section"><h4>魂核 (${G.soulCore}/3)</h4><div style="font-size:12px;">${Array.isArray(G.soulCores) ? G.soulCores.map(c => `<div><span style="color:${c.color || '#88aa88'}">${c.type}</span>${c.attrs ? ' · ' + Object.entries(c.attrs).map(([k, v]) => k + '+' + (v * 100) + '%').join(', ') : ''}</div>`).join('') : '魂核已激活'}</div></div>` : ''}
    ${(G.identityType === 'god' || G.identityType === 'divine_beast') ? `<div class="sidebar-section"><h4>神力技能 (${G.divineSkillsUnlocked || 0}/${G.divineSkillsTotal || 20})</h4><div style="font-size:12px;">${(G.divineSkills && G.divineSkills.length > 0) ? G.divineSkills.map(s => `<div><span style="color:var(--cyan);">${s.name}</span><span style="color:var(--gray);font-size:11px;"> - ${s.desc}</span></div>`).join('') : '<span style="color:var(--gray);">尚未觉醒神力技能</span>'}</div></div>` : ''}
    `: ''}
    ${armorName && G.identityType !== 'soul_beast' ? `<div class="sidebar-section"><h4>斗铠</h4><div style="color:var(--cyan);font-size:13px;">${armorName}</div></div>` : ''}
    ${G.customSkills && G.customSkills.length > 0 ? `<div class="sidebar-section"><h4>自创魂技 (${G.customSkills.length})</h4><div style="font-size:12px;">${G.customSkills.map(s => { let t = s.type || 'attack'; let c = { attack: '#ff4444', defense: '#4488ff', control: '#aa66ff', boost: '#22aa44' }[t] || '#ff4444'; let n = s.name || s; return `<span style="color:${c};">${n}</span>`; }).join('<br>')}</div></div>` : ''}
    ${G.crossSkills?.length > 0 ? `<div class="sidebar-section"><h4>跨界技能</h4><div>${G.crossSkills.map(s => `<span style="color:var(--purple);font-size:12px;">[${s.source}] ${s.skill}</span>`).join('<br>')}</div></div>` : ''}
    <div class="sidebar-section">
      <h4>伙伴 (${G.companions?.length || 0})</h4>
      <div style="font-size:12px;color:var(--gray);">${(G.companions?.length > 0) ? G.companions.join('、') : '暂无'}</div>
    </div>
    ${G.enemies && G.enemies.length > 0 ? `<div class="sidebar-section">
      <h4>强敌 (${G.enemies.length})</h4>
      <div style="font-size:12px;">${G.enemies.slice(0, 5).map(e => `<div style="color:var(--red);margin:2px 0;">${e.name}（${e.level}级）${e.defeated ? ' ☠' : ''}</div>`).join('')}${G.enemies.length > 5 ? '<div style="color:var(--gray);">...共' + G.enemies.length + '位</div>' : ''}</div>
    </div>`: ''}
    <div class="sidebar-section">
      <h4>资源</h4>
      <div style="font-size:13px;">
        <div>金魂币：<span style="color:var(--gold)">${G.gold}</span></div>
        ${G.merit ? `<div>功勋：<span style="color:var(--blue)">${G.merit}</span></div>` : ''}
      </div>
    </div>
  `;
}

function renderControls() {
  const ctrl = document.getElementById('life-controls');
  let autoBtn = G.autoMode
    ? `<button class="btn btn-sm btn-red" onclick="toggleAuto()" id="auto-btn">⏹ 停止推演</button>`
    : `<button class="btn btn-sm btn-blue" onclick="toggleAuto()" id="auto-btn">自动推演</button>`;
  ctrl.innerHTML = `
    <button class="btn" onclick="nextYear()" ${!G.alive ? 'style="display:none"' : ''}>推进数年（随机3~7年）</button>
    ${autoBtn}
    <button class="btn btn-sm" onclick="endGameEarly()">结束人生</button>
    <button class="btn btn-sm btn-red" onclick="saveCurrentGame()">保存存档</button>
    <button class="btn btn-sm btn-green" onclick="showScreen('screen-title');G=null;">返回主界面</button>
  `;
}

function addEventLog(age, type, text, isInit) {
  const log = document.getElementById('event-log');
  const typeNames = { cultivate: '修炼', social: '社交', battle: '战斗', fortune: '机缘', crisis: '危机' };

  // Save to history for review
  G.yearEvents = G.yearEvents || [];
  G.yearEvents.unshift({ age, type, text, time: new Date().toISOString() });

  // Clear previous record for non-init events (show only current year)
  if (!isInit) {
    log.innerHTML = '';
  }

  const entry = document.createElement('div');
  entry.className = 'event-entry';
  entry.innerHTML = `
    <div class="event-year">${G.timeline.name} · ${age}岁</div>
    <span class="event-type ${type}">${typeNames[type] || type}</span>
    <div class="event-text">${text}</div>
  `;
  log.appendChild(entry);
}


function showEventModal(age, type, text, choices) {
  const modal = document.getElementById('modal-event');
  const box = document.getElementById('modal-event-box');
  const typeNames = { cultivate: '修炼', social: '社交', battle: '战斗', fortune: '机缘', crisis: '危机' };

  let choicesHtml = choices.map((c, i) => `<button class="choice-btn" onclick="makeChoice(${i})">${c.text}</button>`).join('');

  box.innerHTML = `
    <div class="modal-title">${typeNames[type] || type}事件</div>
    <div style="font-size:12px;color:var(--gold);margin-bottom:10px;">${G.timeline.name} · ${age}岁</div>
    <div class="modal-body">${text}</div>
    <div class="modal-choices">${choicesHtml}</div>
  `;
  modal.classList.add('active');

  // Store current choices for callback
  window._currentChoices = choices;
  window._currentEventType = type;
}

function showReview() {
  showScreen('screen-review');

  // Calculate rating
  let score = 0;
  score += Math.min(G.soulPower, 150);
  score += G.age / 5;
  score += G.soulRings.length * 10;
  score += G.soulBones.length * 15;
  score += (G.companions || []).length * 5;
  score += (G.customSkills || []).length * 8;
  if (G.crossSkills?.length) score += 30;
  if (G.hasSpouse) score += 5;
  if (G.bloodline) score += 15;
  if (G.battleArmor) score += G.battleArmor * 10;
  if (G.achievementsEarned) score += G.achievementsEarned.length * 10;

  let rating = 'D';
  if (score >= 500) rating = 'SS';
  else if (score >= 350) rating = 'S';
  else if (score >= 250) rating = 'A';
  else if (score >= 150) rating = 'B';
  else if (score >= 80) rating = 'C';

  let ratingColors = { SS: '#ffdd44', S: '#ff8844', A: '#44dd88', B: '#4488ff', C: '#aaaaaa', D: '#888888' };

  // Generate epitaph
  let epitaphs = {
    SS: `${G.timeline.name}的传说——${G.martialSoul?.example || G.beastName || '无名者'}。以${getLevelName(G.soulPower)}之境，${G.deathAge}岁之龄，留下了不可磨灭的印记。后人传颂，万世不灭。`,
    S: `${G.identity.name}${G.martialSoul?.example || G.beastName || ''}，一生波澜壮阔，在${G.timeline.name}书写了属于自己的传奇。`,
    A: `${G.martialSoul?.example || G.beastName || '一位魂师'}，在${G.timeline.name}中历经风雨，终成一方强者。`,
    B: `${G.identity.name}的一生，虽有遗憾，但也有精彩。在斗罗大陆留下了自己的足迹。`,
    C: `在${G.timeline.name}中默默无闻地度过了一生。`,
    D: `${G.deathReason === '寿终正寝' ? '安详地' : G.deathReason}离开了这个世界，未能实现心中的理想。`
  };

  // Collect key events for timeline from saved history
  let keyEventsHtml = '';
  let events = G.yearEvents || [];
  for (let i = 0; i < Math.min(events.length, 12); i++) {
    let ev = events[i];
    keyEventsHtml += `<div class="review-node"><div class="year">${G.timeline.name} · ${ev.age}岁</div><div class="desc">${ev.text}</div></div>`;
  }

  // Save to saves
  let saves = loadSaves();
  saves.unshift({
    id: Date.now(),
    timeline: G.timeline.name,
    identity: G.identity.name,
    martialSoul: G.martialSoul?.example || G.beastName || '',
    soulPower: G.soulPower,
    age: G.deathAge,
    rating: rating,
    epitaph: epitaphs[rating],
    rings: G.soulRings.length,
    bones: G.soulBones.length,
    deathReason: G.deathReason,
    innatePower: G.innatePower,
    date: new Date().toLocaleString('zh-CN')
  });
  if (saves.length > 20) saves = saves.slice(0, 20);
  saveSaves(saves);

  // Check and save achievements
  checkAchievements();

  let seed = generateFateSeed();
  let isBeast = G.identityType === 'soul_beast';
  let routeLabel = isBeast ? '魂兽路线' : '人类路线';
  let beastYearStr = isBeast && G.beastYears !== undefined ? ` · ${formatYears(G.beastYears)}` : '';
  let routeValue = isBeast ? `${G.identity?.name || '未知种族'}${beastYearStr} · ${G.birthplace?.name || '未知之地'}` : `${G.identity?.name || '未知身份'}`;
  let nameLabel = isBeast ? '魂兽名号' : '觉醒武魂';
  let nameValue = isBeast ? (G.bloodline ? `${G.bloodline.name}${G.identity?.name || '魂兽'}（${formatYears(G.beastYears || 0)}）` : '无名魂兽') : (G.martialSoul?.example || '未知');
  let bloodlineValue = G.bloodline ? (G.bloodline.name || G.bloodline.type) : '无';
  let title = generateTitle(G.martialSoul);
  let domain = generateDomain();

  let container = document.getElementById('review-container');
  container.innerHTML = `
    <div class="review-header">
      <div class="review-fate-title">命运终章</div>
      <div class="review-fate-sub">${G.timeline.name} · ${routeLabel}</div>
    </div>
    <div class="review-rating">
      <div style="font-size:14px;color:var(--gray);margin-bottom:8px;">人生评价</div>
      <div class="rating-letter" style="color:${ratingColors[rating]}">${rating}</div>
    </div>
    <div class="review-layout">
      <div class="review-left">
        <div class="review-panel">
          <div class="review-panel-title">角色档案</div>
          <div class="review-info-row"><span class="review-info-label">角色路线</span><span class="review-info-value">${routeValue}</span></div>
          <div class="review-info-row"><span class="review-info-label">${nameLabel}</span><span class="review-info-value gold">${nameValue}</span></div>
          <div class="review-info-row"><span class="review-info-label">血脉</span><span class="review-info-value cyan">${bloodlineValue}</span></div>
          <div class="review-info-row"><span class="review-info-label">称号</span><span class="review-info-value">${title}</span></div>
          <div class="review-info-row"><span class="review-info-label">领域</span><span class="review-info-value">${domain}</span></div>
          ${G.martialSoul?.evolutionStage ? `
          <div class="review-info-row"><span class="review-info-label">最终形态</span><span class="review-info-value" style="color:var(--gold);">${G.martialSoul.name}（第${G.martialSoul.evolutionStage}阶进化）</span></div>
          <div class="review-info-row"><span class="review-info-label">进化路线</span><span class="review-info-value cyan">${G.martialSoul._baseName} → ${G.martialSoul.name}</span></div>
          ` : ''}
        </div>
        <div class="review-panel">
          <div class="review-panel-title">最终状态</div>
          <div class="review-info-row"><span class="review-info-label">最终年龄</span><span class="review-info-value">${G.deathAge}岁${G.transformed ? `（化形前${formatYears(G.transformedBeastYears || 0)}）` : ''}</span></div>
          <div class="review-info-row"><span class="review-info-label">最终修为</span><span class="review-info-value gold">${G.soulPower}级 · ${getLevelName(G.soulPower)}</span></div>
          <div class="review-info-row"><span class="review-info-label">最终状态</span><span class="review-info-value red">${G.deathReason}</span></div>
          <div class="review-info-row"><span class="review-info-label">魂环/魂骨</span><span class="review-info-value">${G.soulRings.length}环 / ${G.soulBones.length}骨</span></div>
          <div class="review-info-row"><span class="review-info-label">先天魂力</span><span class="review-info-value">${G.innatePower}级</span></div>
        </div>
        <div class="review-seed">
          <div class="review-seed-icon">${seed.icon}</div>
          <div>
            <div class="review-seed-name">${seed.name}</div>
            <div class="review-seed-desc">${seed.desc}</div>
          </div>
        </div>
      </div>
      <div class="review-right">
        <div class="review-panel" style="flex:1;">
          <div class="review-panel-title">人生轨迹</div>
          <div class="review-timeline" style="margin:0;padding-left:24px;border-left-color:rgba(255,215,0,.2);">${keyEventsHtml}</div>
        </div>
      </div>
    </div>
    <div class="review-epitaph">${epitaphs[rating]}</div>
    ${G.soulPower >= 91 || isBeast && G.soulPower >= 91 ? `
    <div class="legacy-options">
      <h3 style="color:var(--gold);margin-bottom:10px;font-size:16px;">传承选项</h3>
      <p style="font-size:13px;color:var(--gray);margin-bottom:10px;">你达到了${G.soulPower >= 99 ? '极限斗罗' : '封号斗罗'}级别，可以留下传承供后人继承。</p>
      <button class="btn btn-sm" onclick="leaveLegacy()">留下传承</button>
    </div>`: ''}
    <div style="margin-top:20px;text-align:center;">
      <button class="btn" onclick="startNewGame()">再次转世</button>
      <button class="btn btn-blue" onclick="showScreen('screen-title');G=null;" style="margin-left:10px;">返回主界面</button>
    </div>
  `;
}

function showAchievementNotification(ach) {
  let n = document.createElement('div');
  n.style.cssText = 'position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#2a2a6e,#1a1a4e);border:2px solid var(--gold);border-radius:12px;padding:15px 25px;z-index:200;animation:fadeUp .5s;font-size:14px;';
  n.innerHTML = `<div style="color:var(--gold);font-weight:bold;">🏆 成就解锁！</div><div style="margin-top:4px;">${ach.icon} ${ach.name}</div><div style="color:var(--gray);font-size:12px;">${ach.desc}</div>`;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

// ============================================================
// ACHIEVEMENTS

function renderAchievements() {
  loadGlobalAchievements();
  const grid = document.getElementById('ach-grid');
  grid.innerHTML = ACHIEVEMENTS.map(a => {
    let unlocked = globalAchievements.includes(a.id);
    return `<div class="ach-card ${unlocked ? 'unlocked' : 'locked'}">
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-name">${a.name}</div>
      <div class="ach-desc">${a.desc}</div>
      <div class="ach-cat">${a.cat}</div>
    </div>`;
  }).join('');
}

// ============================================================
// SAVE/LOAD

async function renderSaves() {
  let saves = loadSaves();
  const slots = document.getElementById('save-slots');
  if (!Array.isArray(saves) || saves.length === 0) {
    slots.innerHTML = '<div style="text-align:center;color:var(--gray);padding:40px;">暂无历史记录，完成一局游戏后即可在此查看。</div>';
  } else {
    _renderSaveSlots(saves, slots);
  }
  // Try to fetch from API and refresh
  try {
    let apiSaves = await apiGetSaves();
    if (apiSaves.length > 0) {
      // Merge: API saves take priority, keep local ones not in API
      let apiIds = new Set(apiSaves.map(s => s.id));
      let merged = [...apiSaves];
      for (let s of saves) {
        if (!apiIds.has(s.id)) merged.push(s);
      }
      merged.sort((a, b) => (b.id || 0) - (a.id || 0));
      if (merged.length > 20) merged = merged.slice(0, 20);
      saveSaves(merged);
      _renderSaveSlots(merged, slots);
    }
  } catch (e) { }
}

function _renderSaveSlots(saves, slots) {
  if (!Array.isArray(saves) || saves.length === 0) {
    slots.innerHTML = '<div style="text-align:center;color:var(--gray);padding:40px;">暂无历史记录，完成一局游戏后即可在此查看。</div>';
    return;
  }
  slots.innerHTML = saves.map((s, i) => {
    let timeline = s.timeline || '未知时间线';
    let identity = s.identity || '未知身份';
    let martial = s.martialSoul || '魂兽';
    let age = s.age != null ? s.age : '?';
    let power = s.soulPower != null ? s.soulPower : '?';
    let rings = s.rings != null ? s.rings : '?';
    let bones = s.bones != null ? s.bones : '?';
    let rating = s.rating || '?';
    let date = s.date || '';
    let isAlive = s.deathReason === '进行中';
    let isBeast = s.identityType === 'soul_beast';
    let extraInfo = isBeast && s.beastYears != null ? formatYears(s.beastYears) : `${rings}环${bones}骨`;
    return `
    <div class="save-slot" onclick="${isAlive ? '' : 'viewSave(' + i + ')'}">
      <div class="save-slot-info">
        <h4>${escapeHtml(timeline)} · ${escapeHtml(identity)} · ${escapeHtml(martial)} ${isAlive ? '<span style="color:var(--green);font-size:12px;">[进行中]</span>' : ''}</h4>
        <p>${age}岁 | ${power}级 | ${extraInfo} | ${isAlive ? '状态：进行中' : '评价：' + rating}</p>
        <p style="font-size:11px;color:var(--dark);margin-top:2px;">${date}</p>
      </div>
      <div class="save-slot-actions">
        ${isAlive ? `<button class="btn btn-sm btn-green" onclick="event.stopPropagation();loadSaveGame(${i})">继续游戏</button>` : ''}
        <button class="btn btn-sm btn-red" onclick="event.stopPropagation();deleteSave(${i})">删除</button>
      </div>
    </div>`;
  }).join('');
}

function showSaveToast(msg, color) {
  let t = document.createElement('div');
  t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;padding:12px 28px;border-radius:8px;color:#fff;font-size:15px;font-weight:bold;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.5s;background:' + (color || 'var(--green)');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 600); }, 2000);
}

