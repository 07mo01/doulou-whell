// ============================================================
// GAME STATE
// ============================================================
let G = null; // Current game state
let wheelQueue = [];
let wheelIndex = 0;
let currentWheelData = null;
let isSpinning = false;

// ============================================================
// PARTICLES
// ============================================================
function initParticles() {
  const c = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
    c.appendChild(p);
  }
}

// ============================================================
// SCREEN MANAGEMENT
// ============================================================
function createDefaultState() {
  return {
    timeline: null, innatePower: 0, innateRating: '', innateRatingColor: '#888',
    identity: null, identityType: 'human', gender: { name: '男' },
    personality: null, appearance: null,
    martialSoul: null, soulPower: 0, age: 0, maxAge: 120, maxLevel: 99,
    soulRings: [], soulBones: [], battleArmor: 0, customSkills: [], crossSkills: [],
    companions: [], faction: '', factionReputation: 0, hasMaster: false, masterBonus: false,
    hasSpouse: false, spouse: null, enemies: [],
    transformed: false, bloodline: null, birthplace: null, bloodlineSkills: [],
    alive: true, events: [], keyEvents: [], achievementsEarned: [], gold: 0, merit: 0,
    yearEvents: [], autoMode: false, soulCore: 0, soulCores: [],
    divineSkillsTotal: 0, divineSkills: [], divineSkillsUnlocked: 0
  };
}

function startNewGame() {
  G = createDefaultState();
  wheelIndex = 0;

  wheelQueue = CharacterCreationFlow.buildInitialQueue();

  showScreen('screen-wheel');
  document.getElementById('wheel-spin-btn').style.display = '';
  setupNextWheel();
}

function setupNextWheel() {
  const step = wheelQueue[wheelIndex];
  const canvas = document.getElementById('wheel-canvas');
  document.getElementById('wheel-step').textContent = `第 ${wheelIndex + 1}/${wheelQueue.length} 次抽取`;
  document.getElementById('wheel-label').textContent = step.label;
  document.getElementById('wheel-result-area').innerHTML = '';
  document.getElementById('wheel-center').textContent = step.centerText || '转';
  currentWheelData = step.items;
  drawWheel(currentWheelData, step.labelKey || 'name', step.colorKey || 'eraColor');
  void canvas.offsetWidth;
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
}

function onWheelResult(item) {
  CharacterCreationFlow.applyWheelResult(item);
}

function nextWheelStep() {
  const canvas = document.getElementById('wheel-canvas');
  const hint = document.getElementById('wheel-hint');
  document.getElementById('wheel-next-btn').style.display = 'none';

  wheelIndex++;
  if (wheelIndex < wheelQueue.length) {
    canvas.style.transition = 'none';
    canvas.style.transform = 'rotate(0deg)';
    void canvas.offsetWidth;
    setupNextWheel();
    document.getElementById('wheel-spin-btn').style.display = '';
  } else {
    hint.textContent = '';
    setTimeout(() => showAwakening(), 500);
  }
}

function getActiveSoul() {
  if (!G.martialSoul) return null;
  if (G.martialSoul.souls && G.martialSoul.souls.length > 0) {
    return G.martialSoul.souls[G.martialSoul.activeIndex || 0];
  }
  return G.martialSoul;
}

function getActiveRings() {
  let soul = getActiveSoul();
  if (!soul) return G.soulRings || [];
  if (!soul.rings) soul.rings = [];
  return soul.rings;
}

function switchActiveSoul(index) {
  if (!G.martialSoul || !G.martialSoul.souls || G.martialSoul.souls.length <= 1) return;
  if (index < 0 || index >= G.martialSoul.souls.length) return;
  // Save current rings back to active soul
  let currentSoul = getActiveSoul();
  if (currentSoul && Array.isArray(G.soulRings)) {
    currentSoul.rings = [...G.soulRings];
  }
  // Switch to new soul
  G.martialSoul.activeIndex = index;
  // Load new soul's rings into G.soulRings
  let newSoul = G.martialSoul.souls[index];
  G.soulRings = newSoul.rings || [];
  renderSidebar();
  renderGameLog();
}

function showAwakening() {
  showScreen('screen-awakening');

  // 神界传说：神与神兽出生年龄均为1岁；其他时间线人类/魂兽默认6岁
  if (G.timeline.id === 'godrealm') {
    G.age = 1;
  } else {
    G.age = 6;
  }

  // Set max level and age based on timeline
  if (G.timeline.id === 'douluo4') { G.maxLevel = 150; G.maxAge = 200; }
  else if (G.timeline.id === 'godrealm') { G.maxLevel = 200; G.maxAge = 999; }
  else { G.maxLevel = 99; G.maxAge = 150; }

  // Soul beast: no innate power, no martial soul, use bloodline as starting power
  if (G.identityType === 'soul_beast') {
    G.beastYears = 0;
    // 降生地点影响初始年限
    let birthAttr = G.birthplace?.attr || {};
    let initYears = 0;
    if (birthAttr.power >= 1.3) initYears += 20;  // 高危地区起步年限更高
    if (birthAttr.risk >= 1.3) initYears += 15;
    if (birthAttr.secret >= 1.3) initYears += 10; // 神秘地区给予起步奖励
    G.beastYears = initYears;
    syncBeastSoulPower();
    G.innatePower = 0;
    G.innateRating = '无';
    G.innateRatingColor = '#888';
    G.soulRings = [];
    G.soulBones = [];
    // 初始化血脉技能数组
    G.bloodlineSkills = G.bloodlineSkills || [];
  } else if (G.identityType === 'divine_beast') {
    // 神兽：类似魂兽，但无年限系统，直接用神力等级
    G.soulPower = 1;
    G.innatePower = 0;
    G.innateRating = '神兽天赋';
    G.innateRatingColor = '#ff8800';
    G.soulRings = [];
    G.soulBones = [];
    G.bloodlineSkills = G.bloodlineSkills || [];
    // 神兽默认20个技能槽位，随修炼解锁
    G.divineSkillsTotal = 20;
    G.divineSkills = []; // 已解锁技能
    G.divineSkillsUnlocked = 0;
  } else if (G.identityType === 'god') {
    // 神祇：没有魂环，默认20个技能随修炼解锁，出生1岁
    G.innatePower = 0;
    G.innateRating = '神祇天赋';
    G.innateRatingColor = '#ffdd44';
    G.soulRings = [];
    G.soulBones = [];
    G.martialSoul = null;
    // 神默认20个技能槽位，随修炼解锁
    G.divineSkillsTotal = 20;
    G.divineSkills = []; // 已解锁技能
    G.divineSkillsUnlocked = 0;
  } else {
    // Human/God: set soul power based on innate
    G.soulPower = G.innatePower;
    // Initialize soulRings for multi-soul
    if (G.martialSoul?.souls && G.martialSoul.souls.length > 0) {
      G.martialSoul.activeIndex = G.martialSoul.activeIndex || 0;
      G.soulRings = G.martialSoul.souls[G.martialSoul.activeIndex].rings || [];
    } else if (G.martialSoul) {
      G.martialSoul.rings = G.martialSoul.rings || [];
      G.soulRings = G.martialSoul.rings;
    }
  }

  // God initial level (神祇按神位等级决定初始神力)
  if (G.identityType === 'god') {
    if (G.identity.id.includes('king')) G.soulPower = 150;
    else if (G.identity.id.includes('_1')) G.soulPower = 120;
    else if (G.identity.id.includes('_2')) G.soulPower = 110;
    else if (G.identity.id.includes('_3')) G.soulPower = 100;
    else G.soulPower = 95;
  }

  // Assign faction for human
  if (G.identityType === 'human' && G.timeline.factions) {
    if (G.identity.id === 'sect_disciple' || G.identity.id === 'family_child') {
      G.faction = G.timeline.factions[Math.floor(Math.random() * G.timeline.factions.length)];
    }
  }

  let levelName = getLevelName(G.soulPower);
  let html = `
    <div class="awakening-attrs">
      <div class="attr-item"><div class="attr-label">时代</div><div class="attr-value gold">${G.timeline.name}</div></div>
      <div class="attr-item"><div class="attr-label">身份</div><div class="attr-value">${G.identity.name}</div></div>
      ${G.identityType !== 'soul_beast' ? `<div class="attr-item"><div class="attr-label">性别</div><div class="attr-value">${G.gender.name}</div></div>` : ''}
      ${G.identityType === 'god' && G.godPosition ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">神位</div><div class="attr-value" style="color:${G.godPosition.color || 'var(--gold)'};font-weight:bold;">✦ ${G.godPosition.name}</div></div>` : ''}
      ${G.identityType === 'god' && G.godArtifact ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">神器</div><div class="attr-value" style="color:${G.godArtifact.color || 'var(--gold)'}">${G.godArtifact.name}</div></div>` : ''}
      ${G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast' ? `<div class="attr-item"><div class="attr-label">先天魂力</div><div class="attr-value" style="color:${G.innateRatingColor}">${G.innatePower}级 ${G.innateRating}</div></div>` : ''}
      ${(G.identityType === 'god' || G.identityType === 'divine_beast') ? `<div class="attr-item"><div class="attr-label">天赋</div><div class="attr-value" style="color:${G.innateRatingColor}">${G.innateRating}</div></div>` : ''}
      ${G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast' && G.martialSoul ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">武魂/血脉</div><div class="attr-value" style="color:${G.martialSoul.qColor || '#888'}">${G.martialSoul.example || '未知武魂'}（${G.martialSoul.type || '未知'}）品质：${G.martialSoul.quality || '未知'}</div></div>` : ''}
      ${G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast' && G.martialSoul && getEvolutionPotential(G.martialSoul) ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">进化潜力</div><div class="attr-value" style="color:var(--cyan);">${getEvolutionPotential(G.martialSoul)}</div></div>` : ''}
      ${(G.identityType === 'soul_beast' || G.identityType === 'divine_beast') && G.bloodline ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">血脉</div><div class="attr-value" style="color:${G.bloodline.color}">${G.bloodline.name}血脉${G.bloodline.attr ? `（战力×${G.bloodline.attr.power || 1}）` : ''}</div></div>` : ''}
      ${G.identityType === 'soul_beast' && G.beastYears !== undefined ? `<div class="attr-item"><div class="attr-label">年限</div><div class="attr-value" style="color:var(--gold)">${formatYears(G.beastYears)}</div></div>` : ''}
      ${G.identityType === 'soul_beast' && G.bloodlineSkills && G.bloodlineSkills.length > 0 ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">血脉技能</div><div class="attr-value" style="color:var(--cyan);">${G.bloodlineSkills.join('、')}</div></div>` : ''}
      ${(G.identityType === 'god' || G.identityType === 'divine_beast') ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">神力技能</div><div class="attr-value" style="color:var(--cyan);">0 / ${G.divineSkillsTotal || 20}（随修炼解锁）</div></div>` : ''}
      ${G.birthplace ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">降生地</div><div class="attr-value" style="color:${G.birthplace.color || 'var(--green)'}">${G.birthplace.name}${G.birthplace.attr ? `（战力×${G.birthplace.attr.power || 1}${G.birthplace.attr.risk ? `，风险×${G.birthplace.attr.risk}` : ''}）` : ''}</div></div>` : ''}
      ${G.faction ? `<div class="attr-item" style="grid-column:1/-1"><div class="attr-label">所属势力</div><div class="attr-value cyan">${G.faction}</div></div>` : ''}
      <div class="attr-item"><div class="attr-label">${G.identityType === 'soul_beast' ? '当前修为' : (G.identityType === 'god' || G.identityType === 'divine_beast') ? '神力等级' : '当前魂力'}</div><div class="attr-value">${G.soulPower}级（${levelName}）</div></div>
      <div class="attr-item"><div class="attr-label">年龄</div><div class="attr-value">${G.age}岁</div></div>
    </div>
    <p style="text-align:center;color:var(--gray);margin-top:15px;font-size:13px;">
      ${G.identityType === 'soul_beast' ? '你以' + (G.bloodline ? G.bloodline.name : '') + (G.identity?.name || '魂兽') + '之身降临' + G.timeline.name + '，在' + (G.birthplace?.name || '未知之地') + '中诞生了。弱肉强食，唯有不断修炼才能生存。' : G.identityType === 'god' ? '你以' + G.godPosition?.name + '之身降临神界，手持' + G.godArtifact?.name + '，神力浩瀚无边。神界秩序初定，唐三尚未飞升，属于你的神界传说就此开启。' : G.identityType === 'divine_beast' ? '你以' + (G.bloodline ? G.bloodline.name + '血脉' : '') + (G.identity?.name || '神兽') + '之身降临神界，在' + (G.birthplace?.name || '神界之地') + '中诞生。神兽天赋异禀，修炼有成可化形成神。' : '你降临在' + G.timeline.era + '，武魂觉醒的仪式刚刚结束。'}<br>
      ${G.identityType === 'soul_beast' ? '你的人生，从这里开始。' : G.identityType === 'god' ? '神生漫漫，前方是未知的神界旅程。20个神力技能将随修炼逐一解锁。' : G.identityType === 'divine_beast' ? '神兽之路漫长，修炼有成可化形为神。20个神力技能将随修炼逐一解锁。' : G.innatePower >= 10 ? '你的天赋引起了在场所有人的注意...' : G.innatePower === 0 ? '你似乎无法修炼...但也许机缘会改变一切。' : '你的人生，从这里开始。'}
    </p>
  `;
  document.getElementById('awakening-content').innerHTML = html;
}

function rerollAll() {
  showScreen('screen-title');
  G = null;
}

// ============================================================
// LIFE SYSTEM
// ============================================================
function enterLife() {
  showScreen('screen-life');
  renderSidebar();
  renderControls();
  // Add awakening event
  let beastName = G.bloodline ? `${G.bloodline.name}${G.identity?.name || '魂兽'}` : '无名魂兽';
  let awakeningText;
  if (G.identityType === 'soul_beast') {
    let initYears = G.beastYears > 0 ? `，初始年限${formatYears(G.beastYears)}` : '';
    awakeningText = `你作为${beastName}在${G.timeline.name}的世界中诞生了。降生于${G.birthplace?.name || '未知之地'}${initYears}，当前修为：${getLevelName(G.soulPower)}。弱肉强食是魂兽的法则，唯有不断修炼才能生存。十万年后可选择化形为人，年限越高化形天赋越强！`;
  } else if (G.identityType === 'god') {
    let posName = G.godPosition?.name || G.identity?.name || '未知神位';
    let artName = G.godArtifact?.name || '无神器';
    let facName = G.faction || '散修';
    awakeningText = `你在神界觉醒了<b style="color:var(--gold)">「${posName}」</b>神位，持有${artName}，隶属于<b>${facName}</b>。神力等级：${G.identity?.name}。`;
  } else {
    awakeningText = `你在武魂觉醒仪式上觉醒了「${G.martialSoul?.example || '未知武魂'}」，先天魂力${G.innatePower}级。${G.innatePower >= 10 ? '震惊四座！' : ''}`;
  }
  addEventLog(6, 'cultivate', awakeningText, true);
}

// How many years to advance per click (3-7 random)
function getYearStep() {
  let base = 3 + Math.floor(Math.random() * 5); // 3~7
  // More events when young, fewer when old
  if (G.age >= 60) base = Math.min(base, 3);
  if (G.age >= 80) base = Math.min(base, 2);
  return base;
}

// ============================================================
// NEW EVENT SYSTEM - 6 main event types
// ============================================================
function rollYearEvent() {
  // Event weights (total = 100)
  // Partner 15, Enemy 20, Justice 20, Auction 10, Fortune 25
  let roll = Math.random() * 100;
  let cum = 0;

  // Partner event (15%) - only if has spouse
  cum += 15;
  if (roll < cum && G.hasSpouse) return 'partner';

  // Enemy event (20%)
  cum += 20;
  if (roll < cum) return 'enemy';

  // Justice event (20%) - only if soulPower < 70
  cum += 20;
  if (roll < cum && G.soulPower < 70) return 'justice';

  // Auction event (10%) - only if gold >= 50
  cum += 10;
  if (roll < cum && (G.gold || 0) >= 50) return 'auction';

  // Fortune event (25%)
  cum += 25;
  if (roll < cum) return 'fortune';

  // Fallback to normal
  return 'normal';
}

function processPartnerEvent() {
  let spouse = G.spouse;
  if (!spouse) return null;
  let timelineId = G.timeline?.id || 'douluo1';
  let scenarios = getTimelineEventPool(PARTNER_EVENT_POOLS, timelineId);
  let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  let renderedText = renderEventTemplate(scenario.text, { spouseName: spouse.name });
  let result = resolveScenarioOutcome(scenario);
  return { type: 'social', text: `<b style="color:#ff88aa;">【伴侣】</b> ${renderedText}<br><span style="color:var(--gold)">【${result}】</span>` };
}

function processJusticeEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  let scenarios = getTimelineEventPool(JUSTICE_EVENT_POOLS, timelineId);
  let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  return resolveTimedOutcomeEvent({
    title: '路见不平',
    successType: 'fortune',
    failureType: 'crisis',
    successTitleColor: 'var(--cyan)',
    failureTitleColor: 'var(--red)',
    scenario: scenario,
    failureRewards: { soulPower: -1 },
    successSummary: applied => `你成功救下了对方！${formatAppliedRewards(applied)}`,
    failureSummary: () => '你实力不足，未能阻止恶行，反而受了伤。魂力-1级'
  });
}

function processAuctionEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  let items = getTimelineEventPool(AUCTION_EVENT_POOLS, timelineId);
  let item = items[Math.floor(Math.random() * items.length)];
  if ((G.gold || 0) < item.cost) {
    return { type: 'fortune', text: `<b style="color:var(--gold);">【拍卖会】</b> 你看中了一件宝贝，但囊中羞涩...<br><span style="color:var(--gray)">【下次再来吧】</span>` };
  }

  let result = executeAuctionPurchase(item);
  return { type: 'fortune', text: `<b style="color:var(--gold);">【拍卖会】</b> 你在拍卖会上以${item.cost}金魂币拍得<b>${item.name}</b>！<br><span style="color:var(--gold)">【${result}】</span>` };
}

function getTimelineEventPool(pools, timelineId) {
  return pools[timelineId] || pools.default || pools.douluo1 || [];
}

function renderEventTemplate(template, variables) {
  if (!template) return '';
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    let value = variables && Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : '';
    return value == null ? '' : String(value);
  });
}

function applyRewardBundle(rewards) {
  let applied = { soulPower: 0, beastYears: 0, gold: 0, merit: 0, charm: 0, battleArmor: 0, battleArmorLevel: G.battleArmor || 0 };

  if (!rewards) return applied;

  if (typeof rewards.beastYears === 'number' && rewards.beastYears !== 0) {
    addBeastYears(rewards.beastYears);
    applied.beastYears = rewards.beastYears;
  }
  if (typeof rewards.soulPower === 'number' && rewards.soulPower !== 0) {
    let before = G.soulPower || 0;
    G.soulPower = Math.max(1, Math.min((G.soulPower || 0) + rewards.soulPower, G.maxLevel));
    applied.soulPower = G.soulPower - before;
  }
  if (typeof rewards.gold === 'number' && rewards.gold !== 0) {
    G.gold = (G.gold || 0) + rewards.gold;
    applied.gold = rewards.gold;
  }
  if (typeof rewards.merit === 'number' && rewards.merit !== 0) {
    G.merit = (G.merit || 0) + rewards.merit;
    applied.merit = rewards.merit;
  }
  if (typeof rewards.charm === 'number' && rewards.charm !== 0 && G.appearance) {
    G.appearance = {
      ...G.appearance,
      attr: { ...G.appearance.attr, charm: (G.appearance.attr?.charm || 5) + rewards.charm }
    };
    applied.charm = rewards.charm;
  }
  if (typeof rewards.minBattleArmor === 'number') {
    let before = G.battleArmor || 0;
    G.battleArmor = Math.max(before, rewards.minBattleArmor);
    applied.battleArmor = G.battleArmor - before;
    applied.battleArmorLevel = G.battleArmor;
  }

  return applied;
}

function formatAppliedRewards(applied) {
  let parts = [];
  if (applied.merit > 0) parts.push(`名声+${applied.merit}`);
  if (applied.soulPower > 0) parts.push(`魂力+${applied.soulPower}级`);
  else if (applied.soulPower < 0) parts.push(`魂力${applied.soulPower}级`);
  if (applied.gold > 0) parts.push(`获得${applied.gold}金魂币`);
  else if (applied.gold < 0) parts.push(`金魂币${applied.gold}`);
  if (applied.charm > 0) parts.push(`魅力+${applied.charm}`);
  else if (applied.charm < 0) parts.push(`魅力${applied.charm}`);
  if (applied.beastYears > 0) parts.push(`年限+${formatYears(applied.beastYears)}`);
  else if (applied.beastYears < 0) parts.push(`年限-${formatYears(Math.abs(applied.beastYears))}`);
  if (applied.battleArmor > 0) parts.push(`斗铠提升至${applied.battleArmorLevel}阶`);
  return parts.join(' ');
}

function resolveRewardOutcome(outcome) {
  let applied = applyRewardBundle({ ...(outcome.rewards || {}), minBattleArmor: outcome.minBattleArmor });
  return outcome.resultText || formatAppliedRewards(applied) || '平淡地度过了这一年。';
}

function resolveScenarioOutcome(scenario) {
  if (!scenario.check) {
    return resolveRewardOutcome(scenario);
  }
  let succeeded = Math.random() < scenario.check.winChance;
  return resolveRewardOutcome(succeeded ? scenario.check.success : scenario.check.failure);
}

function resolveTimedOutcomeEvent(config) {
  let win = Math.random() < config.scenario.winChance;
  if (win) {
    let applied = applyRewardBundle(config.scenario.rewards || {});
    let summary = config.successSummary(applied, config.scenario);
    return {
      type: config.successType,
      text: `<b style="color:${config.successTitleColor};">【${config.title}】</b> ${config.scenario.text}<br><span style="color:var(--gold)">【${summary}】</span>`
    };
  }

  if (config.failureRewards) {
    applyRewardBundle(config.failureRewards);
  }
  return {
    type: config.failureType,
    text: `<b style="color:${config.failureTitleColor};">【${config.title}】</b> ${config.scenario.text}<br><span style="color:${config.failureTitleColor}">【${config.failureSummary(config.scenario)}】</span>`
  };
}

function executeAuctionPurchase(item) {
  G.gold = Math.max((G.gold || 0) - item.cost, 0);
  let applied = applyRewardBundle({ ...(item.rewards || {}), minBattleArmor: item.minBattleArmor });
  return item.resultText || formatAppliedRewards(applied) || '拍得了心仪之物。';
}

function pickRandomItem(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function rollRewardValue(spec) {
  if (typeof spec === 'number') return spec;
  if (!spec || typeof spec !== 'object') return 0;
  let min = Number(spec.min) || 0;
  let max = Number(spec.max ?? min);
  if (max < min) {
    let temp = min;
    min = max;
    max = temp;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

function resolveRewardSpec(rewardSpec) {
  let resolved = {};
  if (!rewardSpec) return resolved;
  Object.keys(rewardSpec).forEach(key => {
    let value = rewardSpec[key];
    if (typeof value === 'number') resolved[key] = value;
    else if (value && typeof value === 'object') resolved[key] = rollRewardValue(value);
  });
  return resolved;
}

function applySpecialEventEffects(special) {
  let details = [];
  if (!special) return details;
  if (typeof special.latestRingYearsMultiplier === 'number' && Array.isArray(G.soulRings) && G.soulRings.length > 0) {
    let lastRing = G.soulRings[G.soulRings.length - 1];
    if (lastRing && typeof lastRing.years === 'number') {
      lastRing.years = Math.floor(lastRing.years * special.latestRingYearsMultiplier);
      let percent = Math.round((special.latestRingYearsMultiplier - 1) * 100);
      details.push(`魂灵年份提升${percent}%`);
    }
  }
  return details;
}

function executeSchemaRewardOutcome(definition, fallbackText) {
  let applied = applyRewardBundle({ ...resolveRewardSpec(definition.rewards), minBattleArmor: definition.minBattleArmor });
  let extraDetails = applySpecialEventEffects(definition.special);
  let summary = definition.resultText || [formatAppliedRewards(applied), ...extraDetails].filter(Boolean).join('，') || fallbackText || '平淡地度过了这一年。';
  return { applied: applied, summary: summary, extraDetails: extraDetails };
}

function getSoulBeastCultivationSynergy() {
  let bloodId = G.bloodline?.id || 'fire';
  let birthId = G.birthplace?.id || '';
  if ((bloodId === 'fire' && birthId === 'volcano') ||
    (bloodId === 'ice' && (birthId === 'jibei' || birthId === 'god_ice')) ||
    (bloodId === 'water' && (birthId === 'deep_sea' || birthId === 'god_sea')) ||
    (bloodId === 'dragon' && (birthId === 'dragon_valley' || birthId === 'dragon_world')) ||
    (bloodId === 'poison' && birthId === 'swamp') ||
    (bloodId === 'earth' && birthId === 'mountain') ||
    (bloodId === 'dark' && (birthId === 'cave' || birthId === 'abyss' || birthId === 'god_abyss')) ||
    (bloodId === 'spirit' && birthId === 'spirit_tower') ||
    (bloodId === 'wood' && (birthId === 'luori' || birthId === 'god_forest')) ||
    (bloodId === 'light' && (birthId === 'god_realm' || birthId === 'god_beast'))) {
    return { multiplier: 1.5, text: '（血脉与降生地契合，修炼效率+50%）' };
  }
  return { multiplier: 1, text: '' };
}

function resolveFortuneBoneEvent(text, rule) {
  let boneType = pickRandomItem(rule.boneTypes) || '头部魂骨';
  if (!G.soulBones.includes(boneType)) {
    G.soulBones.push(boneType);
    let applied = applyRewardBundle(G.identityType === 'soul_beast' ? resolveRewardSpec(rule.beastRewards) : {});
    return {
      type: 'fortune',
      text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【获得${boneType}！${applied.beastYears ? ` · 年限+${formatYears(applied.beastYears)}` : ''}】</span>`
    };
  }

  let applied = applyRewardBundle(resolveRewardSpec(rule.duplicateRewards));
  let summary = formatAppliedRewards(applied) || '获得了一笔财富';
  return {
    type: 'fortune',
    text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【已有同类魂骨，出售${summary}】</span>`
  };
}

function processFortuneEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  let poolGroup = G.identityType === 'soul_beast' ? FORTUNE_EVENT_POOLS.soul_beast : FORTUNE_EVENT_POOLS.human;
  let textPool = getTimelineEventPool(poolGroup, timelineId);
  let type = pickRandomItem(FORTUNE_EVENT_RULES.types) || 'sp';
  let rule = FORTUNE_EVENT_RULES[type] || FORTUNE_EVENT_RULES.sp;
  let textOptions = textPool[type] || textPool.sp || [];

  if (type === 'appearance' && G.identityType === 'soul_beast' && !G.appearance) {
    textOptions = textPool.sp || textOptions;
  }

  let text = pickRandomItem(textOptions) || '你遇到了一场意外的机缘。';
  if (type === 'bone') {
    return resolveFortuneBoneEvent(text, rule);
  }

  let rewardSpec = type === 'appearance' && !G.appearance ? rule.fallbackRewards : rule.rewards;
  let resolvedRewards = resolveRewardSpec(rewardSpec);
  if (G.identityType === 'soul_beast' && rule.beastRewards) {
    Object.assign(resolvedRewards, resolveRewardSpec(rule.beastRewards));
  }
  let applied = applyRewardBundle(resolvedRewards);
  let summary = formatAppliedRewards(applied) || '你从中受益匪浅。';
  return { type: 'fortune', text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【${summary}】</span>` };
}

function processSchoolEvent() {
  if (G.identityType === 'soul_beast') {
    return processNormalEvent();
  }
  let timelineId = G.timeline?.id || 'douluo1';
  let school = SCHOOL_EVENTS[timelineId];
  if (!school) school = SCHOOL_EVENTS.douluo1;
  let event = pickRandomItem(school.events);
  let outcome = executeSchemaRewardOutcome(event, '学院修行让你有所成长。');
  return { type: 'cultivate', text: `<b style="color:var(--cyan);">【${school.name}】</b> ${event.text}<br><span style="color:var(--gold)">【${outcome.summary}】</span>` };
}

function processNormalEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  if (G.identityType === 'soul_beast') {
    let event = pickRandomItem(getTimelineEventPool(NORMAL_EVENT_POOLS.soul_beast, timelineId));
    let synergy = getSoulBeastCultivationSynergy();
    let resolvedRewards = resolveRewardSpec(event.rewards);
    resolvedRewards.beastYears = Math.floor((resolvedRewards.beastYears || 0) * synergy.multiplier);
    if (synergy.multiplier > 1) {
      resolvedRewards.soulPower = Math.max(resolvedRewards.soulPower || 1, 2);
    }
    let applied = applyRewardBundle(resolvedRewards);
    return { type: 'cultivate', text: `<b style="color:var(--green);">【修炼】</b> ${event.text}<br><span style="color:var(--gold)">【年限+${formatYears(applied.beastYears)}${synergy.text}】</span>` };
  }

  if (G.identityType === 'divine_beast') {
    let event = pickRandomItem(getTimelineEventPool(NORMAL_EVENT_POOLS.divine_beast, timelineId));
    let outcome = executeSchemaRewardOutcome(event, '神力有所精进。');
    return { type: 'cultivate', text: `<b style="color:var(--gold);">【神兽修炼】</b> ${event.text}<br><span style="color:var(--gold)">【${outcome.summary}】</span>` };
  }

  if (G.identityType === 'god') {
    let event = pickRandomItem(getTimelineEventPool(NORMAL_EVENT_POOLS.god, timelineId));
    let outcome = executeSchemaRewardOutcome(event, '神力有所精进。');
    return { type: 'cultivate', text: `<b style="color:var(--gold);">【神祇修炼】</b> ${event.text}<br><span style="color:var(--gold)">【${outcome.summary}】</span>` };
  }

  let event = pickRandomItem(getTimelineEventPool(NORMAL_EVENT_POOLS.human, timelineId));
  let outcome = executeSchemaRewardOutcome(event, '修炼有所收获。');
  return { type: 'cultivate', text: `<b style="color:var(--green);">【修炼】</b> ${event.text}<br><span style="color:var(--gold)">【${outcome.summary}】</span>` };
}

function nextYear() {
  if (!G.alive || G._processing) return;
  void advanceYearsWithStateMachine().catch(err => {
    console.error('年限推进失败:', err);
    G._processing = false;
    showSaveToast('推进失败，请重试', 'var(--red)');
  });
}

const YEAR_ADVANCE_STOP = {
  death: 'death',
  ring: 'ring',
  douluoPath: 'douluo_path',
  godhood: 'godhood'
};

function createYearStepState() {
  return { events: [], stopReason: null, yearResolved: false };
}

function getCurrentMaxAge() {
  let maxAge = G.maxAge;
  if (G.soulPower >= 91) maxAge += 100;
  if (G.soulPower >= 99) maxAge += 200;
  if (G.soulPower >= 120) maxAge += 500;
  return maxAge;
}

function applyYearAgeAdvance() {
  G.age++;
}

function handleAnnualDeathCheck(step) {
  if (G.age <= getCurrentMaxAge()) return false;
  G.alive = false;
  G.deathReason = '寿终正寝';
  step.stopReason = YEAR_ADVANCE_STOP.death;
  step.yearResolved = true;
  return true;
}

function handleLateAwakeningCheck(step) {
  if (!(G.innatePower === 0 && G.age === 12 && Math.random() < 0.1)) return false;
  G.innatePower = 3;
  G.innateRating = '普通';
  G.innateRatingColor = '#aaa';
  step.events.push({ age: G.age, type: 'fortune', text: '<b style="color:var(--gold);">【觉醒】</b> 在一次意外中，你突然感受到了魂力的存在！后天觉醒成功，先天魂力3级！' });
  step.yearResolved = true;
  return true;
}

function handleRingMilestoneCheck(step) {
  if (G.identityType === 'soul_beast' || G.identityType === 'god' || G.identityType === 'divine_beast' || G.soulRings.length >= 9) return false;
  let nextRingLevel = RING_MILESTONES[G.soulRings.length];
  if (G.soulPower < nextRingLevel) return false;
  step.events.push({ age: G.age, type: 'fortune', text: `<b style="color:var(--gold);">【突破】</b> 魂力达到${G.soulPower}级，突破瓶颈！需要猎杀第${G.soulRings.length + 1}魂环...`, ringMilestone: true });
  step.stopReason = YEAR_ADVANCE_STOP.ring;
  step.yearResolved = true;
  return true;
}

function processSoulCoreStep(step) {
  if (G.identityType === 'soul_beast' || G.identityType === 'god' || G.identityType === 'divine_beast' || !G.martialSoul) return;
  let soulCoreEvent = checkSoulCoreFormation();
  if (!soulCoreEvent) return;
  step.events.push({ age: G.age, type: 'fortune', text: soulCoreEvent.text });
  G.soulCore++;
  if (soulCoreEvent.core) {
    if (!Array.isArray(G.soulCores)) G.soulCores = [];
    G.soulCores.push(soulCoreEvent.core);
  }
  if (soulCoreEvent.sp) {
    G.soulPower = Math.min(G.soulPower + soulCoreEvent.sp, G.maxLevel);
  }
  renderSidebar();
  checkAchievements();
  if (!G.alive) {
    step.stopReason = YEAR_ADVANCE_STOP.death;
    step.yearResolved = true;
  }
}

function processDivineSkillUnlockStep(step) {
  if ((G.identityType !== 'god' && G.identityType !== 'divine_beast') || !G.divineSkillsTotal) return;
  G.divineSkillsUnlocked = G.divineSkillsUnlocked || 0;
  G.divineSkills = G.divineSkills || [];
  let targetUnlocked = 0;
  for (let lv of DIVINE_SKILL_UNLOCK_THRESHOLDS) {
    if (G.soulPower >= lv) targetUnlocked++;
    else break;
  }
  targetUnlocked = Math.min(targetUnlocked, G.divineSkillsTotal);
  if (targetUnlocked <= G.divineSkillsUnlocked) return;

  let newlyUnlocked = targetUnlocked - G.divineSkillsUnlocked;

  for (let i = 0; i < newlyUnlocked; i++) {
    let availableSkills = DIVINE_SKILL_POOL.filter(s => !G.divineSkills.some(ds => ds.name === s.name));
    if (availableSkills.length === 0) break;
    let newSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    G.divineSkills.push(newSkill);
    G.divineSkillsUnlocked++;
    step.events.push({ age: G.age, type: 'fortune', text: `<b style="color:var(--gold);">【神力觉醒】</b> 神力突破瓶颈，觉醒新技能：<b style="color:var(--cyan);">${newSkill.name}</b>！${newSkill.desc}。(${G.divineSkillsUnlocked}/${G.divineSkillsTotal})` });
  }
  renderSidebar();
}

function handleTimelineProgressCheck(step) {
  let progressEvent = getTimelineProgressEvent();
  if (!progressEvent) return false;
  step.events.push({ age: G.age, type: 'fortune', text: progressEvent.text });
  if (progressEvent.sp) {
    G.soulPower = Math.min(G.soulPower + progressEvent.sp, G.maxLevel);
  }
  if (progressEvent.merit) {
    G.merit = (G.merit || 0) + progressEvent.merit;
  }
  renderSidebar();
  checkAchievements();
  if (!G.alive) {
    step.stopReason = YEAR_ADVANCE_STOP.death;
  }
  step.yearResolved = true;
  return true;
}

async function resolveYearEventStep(step) {
  let result = await openYearEventWheelAsync();
  if (result && result.event) {
    step.events.push({ age: G.age, ...result.event });
  }
  if (result && result.subWheel === 'enemy') {
    await openEnemyWheelAsync();
    renderSidebar();
    checkAchievements();
    if (!G.alive) {
      step.stopReason = YEAR_ADVANCE_STOP.death;
      step.yearResolved = true;
    }
    return;
  }
  if (result && result.subWheel === 'timeline') {
    await openTimelineCharacterWheelAsync();
    renderSidebar();
    checkAchievements();
    if (!G.alive) {
      step.stopReason = YEAR_ADVANCE_STOP.death;
      step.yearResolved = true;
    }
  }
}

function processPostYearEvolutionStep(step) {
  let evoResult = checkSoulEvolution();
  if (evoResult) {
    G.martialSoul.name = evoResult.newName;
    G.martialSoul.example = evoResult.newName;
    G.martialSoul.evolutionStage = evoResult.stage;
    G.soulPower = Math.min(G.soulPower + evoResult.bonusPower, G.maxLevel);
    step.events.push({ age: G.age, type: 'fortune', text: `<b style="color:var(--gold);">【武魂进化】</b> ${evoResult.desc} 武魂进化为「${evoResult.newName}」！魂力+${evoResult.bonusPower}级！` });
  }
  renderSidebar();
  checkAchievements();
  if (!G.alive) {
    step.stopReason = YEAR_ADVANCE_STOP.death;
    step.yearResolved = true;
  }
}

function handleHighLevelChoiceStop(step) {
  if (G.soulPower >= 91 && !G.chosenPath && G.identityType !== 'soul_beast') {
    step.events.push({ age: G.age, type: 'fortune', text: '<b style="color:var(--gold);">【封号斗罗】</b> 你的修为突破90级，成为封号斗罗！是时候选择未来的道路了...' });
    step.stopReason = YEAR_ADVANCE_STOP.douluoPath;
    step.yearResolved = true;
    return true;
  }
  if (G.soulPower >= G.maxLevel && !G.isGod && G.identityType !== 'soul_beast' && G.chosenPath !== 'family') {
    step.events.push({ age: G.age, type: 'fortune', text: '<b style="color:var(--gold);">【成神之路】</b> 你的修为已达到当前位面的极限，感应到了神位的召唤...' });
    step.stopReason = YEAR_ADVANCE_STOP.godhood;
    step.yearResolved = true;
    return true;
  }
  return false;
}

async function processSingleYearStateMachine() {
  let step = createYearStepState();
  applyYearAgeAdvance();
  if (handleAnnualDeathCheck(step)) return step;
  if (handleLateAwakeningCheck(step)) return step;
  if (handleRingMilestoneCheck(step)) return step;

  processSoulCoreStep(step);
  if (step.stopReason) return step;
  processDivineSkillUnlockStep(step);
  if (handleTimelineProgressCheck(step)) return step;

  await resolveYearEventStep(step);
  if (step.stopReason) return step;
  processPostYearEvolutionStep(step);
  if (step.stopReason) return step;
  if (handleHighLevelChoiceStop(step)) return step;

  step.yearResolved = true;
  return step;
}

async function advanceYearsWithStateMachine() {
  let yearsToAdvance = getYearStep();
  let eventsThisRound = [];
  let stopReason = null;
  G._processing = true;

  for (let idx = 0; idx < yearsToAdvance && G.alive; idx++) {
    let step = await processSingleYearStateMachine();
    if (step.events.length > 0) {
      eventsThisRound.push(...step.events);
    }
    if (step.stopReason) {
      stopReason = step.stopReason;
      break;
    }
  }

  await finishYearAdvanceAsync(eventsThisRound, stopReason);
}

function openGodhoodChoice() {
  document.getElementById('godhood-panel').style.display = 'block';
  document.getElementById('godhood-result').style.display = 'none';
  document.getElementById('godhood-result').innerHTML = '';
}

function chooseGodhood(type) {
  let success = false;
  let resultText = '';
  let resultColor = '';

  if (type === 'inherit') {
    success = Math.random() < 0.7;
    if (success) {
      let godName = GODHOOD_INHERIT_GODS[Math.floor(Math.random() * GODHOOD_INHERIT_GODS.length)];
      G.isGod = true;
      G.godTitle = godName;
      G.maxLevel += 50;
      G.soulPower = Math.min(G.soulPower + 10, G.maxLevel);
      G.maxAge += 500;
      resultText = `成功继承「${godName}」神位！神力灌注，修为突破位面极限！<br><span style="color:var(--gold)">等级上限+50 | 寿命+500年 | 魂力+10级</span>`;
      resultColor = 'var(--gold)';
    } else {
      G.soulPower = Math.max(G.soulPower - 10, 1);
      resultText = '继承神位失败...神位残留的神力反噬了你。<br><span style="color:var(--red)">魂力-10级</span>';
      resultColor = 'var(--red)';
    }
  } else {
    success = Math.random() < 0.4;
    if (success) {
      let godName = GODHOOD_CUSTOM_TITLES[Math.floor(Math.random() * GODHOOD_CUSTOM_TITLES.length)];
      G.isGod = true;
      G.godTitle = godName;
      G.maxLevel += 100;
      G.soulPower = Math.min(G.soulPower + 20, G.maxLevel);
      G.maxAge += 1000;
      resultText = `以自身为根基，成功创造「${godName}」神位！天地共鸣，万界臣服！<br><span style="color:var(--gold)">等级上限+100 | 寿命+1000年 | 魂力+20级</span>`;
      resultColor = 'var(--gold)';
    } else {
      if (Math.random() < 0.3) {
        G.alive = false;
        G.deathReason = '自创神位失败，肉身崩解';
        resultText = '自创神位失败...你的肉身无法承受创造神位的反噬，在光芒中消散...<br><span style="color:var(--red)">魂飞魄散</span>';
        resultColor = 'var(--red)';
      } else {
        G.soulPower = Math.max(G.soulPower - 20, 1);
        resultText = '自创神位失败...神位雏形崩溃，修为大幅倒退。<br><span style="color:var(--red)">魂力-20级</span>';
        resultColor = 'var(--red)';
      }
    }
  }

  let resultDiv = document.getElementById('godhood-result');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `<div style="color:${resultColor};font-size:16px;margin-bottom:10px;">${resultText}</div><button class="btn" onclick="closeGodhoodChoice()">继续</button>`;
}

function closeGodhoodChoice() {
  document.getElementById('godhood-panel').style.display = 'none';
  renderSidebar(); checkAchievements();
  if (!G.alive) {
    showReview();
  }
}

function openDouluoPathChoice() {
  document.getElementById('douluo-path-panel').style.display = 'block';
  // Show "飞升神界" button if in douluo2 (绝世唐门) and soulPower >= 100
  let godrealmBtn = document.getElementById('btn-godrealm-path');
  if (godrealmBtn) {
    godrealmBtn.style.display = (G.timeline?.id === 'douluo2' && G.soulPower >= 100) ? 'block' : 'none';
  }
}

function chooseDouluoPath(path) {
  let input = document.getElementById('custom-title-input');
  let customTitle = input.value.trim();
  if (customTitle) {
    G.customTitle = customTitle;
  }
  G.chosenPath = path;
  document.getElementById('douluo-path-panel').style.display = 'none';

  if (path === 'family') {
    // Unlock romance system
    G.romanceUnlocked = true;
    // Auto-set a spouse if not already married
    if (!G.hasSpouse) {
      G.hasSpouse = true;
      let romanceChars = getRomanceCandidates();
      if (romanceChars.length > 0) {
        let candidate = romanceChars[Math.floor(Math.random() * romanceChars.length)];
        G.spouse = candidate;
        addEventLog(G.age, 'fortune', `<b style="color:#ff66aa;">【结缘】</b> 你与${candidate.name}相识相知，最终携手共度余生。`);
      }
    }
  } else if (path === 'godrealm') {
    // Switch to godrealm timeline
    G.timeline = TIMELINES.find(t => t.id === 'godrealm');
    G.maxLevel = G.timeline.maxLevel;
    G.maxAge = Math.max(G.maxAge || 100, 999);
    addEventLog(G.age, 'fortune', `<b style="color:#ffdd44;">【飞升神界】</b> 你的魂力突破百级，绝世唐门的位面已经无法容纳你的力量！在神祇的接引下，你打破位面壁垒，飞升神界，进入神界传说时代！`);
  }

  renderSidebar();
  checkAchievements();
}

function getRomanceCandidates() {
  let timelineId = G.timeline?.id || 'douluo1';
  let chars = TIMELINE_CHARACTERS[timelineId] || [];
  // Filter out married/main characters and same gender if needed
  return chars.filter(c => {
    let name = c.name;
    // Exclude main male chars for female player, main female chars for male player
    let isMale = G.gender?.id === 'male';
    let targetNames = isMale ? ROMANCE_CHARACTER_NAME_POOLS.malePlayerTargets : ROMANCE_CHARACTER_NAME_POOLS.femalePlayerTargets;
    return targetNames.some(target => name.includes(target));
  }).map(c => ({ name: c.name, soul: c.soul, color: c.color }));
}

function renderYearAdvanceEvents(events) {
  let log = document.getElementById('event-log');
  log.innerHTML = '';
  events.forEach((ev, idx) => {
    let entry = document.createElement('div');
    entry.className = 'event-entry';
    entry.style.animationDelay = (idx * 0.1) + 's';
    entry.innerHTML = `
      <div class="event-year">${G.timeline.name} · ${ev.age}岁</div>
      <span class="event-type ${ev.type}">${EVENT_TYPE_LABELS[ev.type] || ev.type}</span>
      <div class="event-text">${ev.text}</div>
    `;
    log.appendChild(entry);
    G.yearEvents = G.yearEvents || [];
    G.yearEvents.unshift({ age: ev.age, type: ev.type, text: ev.text });
  });
}

async function finishYearAdvanceAsync(events, stopReason) {
  renderYearAdvanceEvents(events);
  checkAchievements();
  renderSidebar();

  if (stopReason === YEAR_ADVANCE_STOP.ring && G.alive) {
    let ringSuccess = await openSoulRingWheelAsync();
    if (!G.alive) {
      G._processing = false;
      renderSidebar();
      triggerDeath('猎杀魂环时陨落');
      return;
    }
    renderSidebar();
    checkAchievements();
    if (ringSuccess) {
      await openOpportunityWheelAsync();
      renderSidebar();
      checkAchievements();
    }
    G._processing = false;
    if (!G.alive) triggerDeath('遭遇不测');
    return;
  }

  G._processing = false;
  if (!G.alive || stopReason === YEAR_ADVANCE_STOP.death) {
    triggerDeath(G.deathReason || '遭遇不测');
    return;
  }
  if (stopReason === YEAR_ADVANCE_STOP.douluoPath) {
    setTimeout(() => openDouluoPathChoice(), 600);
    return;
  }
  if (stopReason === YEAR_ADVANCE_STOP.godhood) {
    setTimeout(() => openGodhoodChoice(), 600);
  }
}


function makeChoice(idx) {
  const modal = document.getElementById('modal-event');
  modal.classList.remove('active');

  let choice = window._currentChoices[idx];
  let result = choice.effect(G);

  // Cross-skill special display
  let crossHtml = '';
  if (G.crossSkills && G.crossSkills.length > 0) {
    let last = G.crossSkills[G.crossSkills.length - 1];
    crossHtml = `<div class="cross-skill-display"><h4>🌀 跨界融合！</h4><p>来源：${last.source} | 技能：${last.skill}</p><p style="font-size:12px;color:var(--gray);margin-top:4px;">${last.effect}</p></div>`;
  }

  addEventLog(G.age, window._currentEventType, `【选择：${choice.text}】<br>${result}${crossHtml}`);
  checkAchievements();
  renderSidebar();

  if (!G.alive) {
    triggerDeath('遭遇不测');
  }
}

// ============================================================
// AUTO MODE
// ============================================================
let autoTimer = null;
function toggleAuto() {
  G.autoMode = !G.autoMode;
  document.getElementById('auto-btn').textContent = G.autoMode ? '⏹ 停止推演' : '自动推演';
  // Show/hide overlay stop button
  let overlayStop = document.getElementById('mini-auto-stop-btn');
  if (overlayStop) overlayStop.style.display = G.autoMode ? '' : 'none';
  if (G.autoMode) {
    autoTimer = setInterval(() => {
      if (!G.alive) { clearInterval(autoTimer); G.autoMode = false; document.getElementById('auto-btn').textContent = '自动推演'; let ob = document.getElementById('mini-auto-stop-btn'); if (ob) ob.style.display = 'none'; return; }
      // Check if modal or mini wheel is open
      if (document.getElementById('modal-event').classList.contains('active')) return;
      if (document.getElementById('mini-wheel-overlay').classList.contains('active')) return;
      if (G._processing) return;
      nextYear();
    }, 1500);
  } else {
    clearInterval(autoTimer);
    // Close any open overlay when stopping auto
    let overlay = document.getElementById('mini-wheel-overlay');
    if (overlay && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      G._processing = false;
      yearEventWheelSpinning = false;
      enemyWheelSpinning = false;
      timelineCharWheelSpinning = false;
    }
  }
}

// ============================================================
// DEATH & REVIEW
// ============================================================
function triggerDeath(reason) {
  G.alive = false;
  G.deathReason = reason;
  G.deathAge = G.age;
  if (autoTimer) clearInterval(autoTimer);
  G.autoMode = false;

  setTimeout(() => showReview(), 1500);
}

function endGameEarly() {
  if (G.alive) {
    G.alive = false;
    G.deathReason = '主动结束';
    G.deathAge = G.age;
    if (autoTimer) clearInterval(autoTimer);
    G.autoMode = false;
    showReview();
  }
}

function getProtagonistStatus(timelineId, playerAge) {
  // Returns protagonist age and status based on timeline and player age
  let p = PROTAGONIST_STATUS_MAP[timelineId];
  if (!p) return null;

  let pAge = playerAge + p.birthOffset;
  if (pAge < 0) return { name: p.name, age: 0, status: '尚未出生' };

  let status = '在斗罗大陆历练';
  for (let m of p.milestones) {
    if (pAge >= m.age) status = m.status;
  }
  return { name: p.name, age: pAge, status: status };
}

function generateTitle(soul) {
  if (G.customTitle && G.soulPower >= 90) {
    return G.customTitle + '斗罗';
  }
  if (!soul || !soul.example) return '无名者';
  let name = soul.example;
  if (G.soulPower >= 90) {
    let prefix = name.substring(0, Math.min(2, name.length));
    return prefix + '斗罗';
  }
  if (G.soulPower >= 70) return name.substring(0, 2) + '圣者';
  if (G.soulPower >= 50) return name.substring(0, 2) + '尊者';
  return name.substring(0, 2) + '魂师';
}
function generateDomain() {
  if (G.identityType === 'soul_beast') {
    return SOUL_BEAST_DOMAIN_MAP[G.bloodline?.type] || '兽王领域';
  }
  return MARTIAL_SOUL_DOMAIN_MAP[G.martialSoul?.type] || '武魂领域';
}
function generateFateSeed() {
  let seeds = [];
  if (G.soulPower >= 99) seeds.push({ name: '神之种', icon: '✦', desc: '触及神级的潜质，命运因你而颤抖' });
  if (G.martialSoul?.quality === '双生') seeds.push({ name: '双生之种', icon: '◈', desc: '双武魂共鸣，命运双线交织' });
  if (G.identityType === 'god') seeds.push({ name: '神域之种', icon: '❋', desc: '神界血脉，凌驾众生之上' });
  if (G.identityType === 'soul_beast') seeds.push({ name: '荒古之种', icon: '◉', desc: '远古魂兽的血脉记忆' });
  if (Array.isArray(G.soulRings) && G.soulRings.length >= 9 && G.soulRings.some(r => r.years >= 100000)) seeds.push({ name: '十万年之种', icon: '✹', desc: '承载十万年魂环的沉重命运' });
  if (G.deathReason === '寿终正寝') seeds.push({ name: '善终之种', icon: '❀', desc: '圆满一生，安详离世' });
  if (G.deathReason && G.deathReason.includes('猎杀')) seeds.push({ name: '轮回之种', icon: '↻', desc: '魂环之路的轮回宿命' });
  if (G.achievementsEarned?.length >= 5) seeds.push({ name: '传奇之种', icon: '★', desc: '诸多成就加身，命运铭记' });
  if (seeds.length === 0) seeds.push({ name: '平凡之种', icon: '●', desc: '普普通通，却也独一无二' });
  return seeds[Math.floor(Math.random() * seeds.length)];
}


function leaveLegacy() {
  localStorage.setItem('dl_legacy', JSON.stringify({
    martialSoul: G.martialSoul,
    bloodline: G.bloodline,
    soulPower: G.soulPower,
    timeline: G.timeline.name,
    innateBonus: Math.floor(G.innatePower * 0.3)
  }));
  alert('传承已留下！下次转世时将获得继承加成。');
}

// ============================================================

function viewSave(idx) {
  let saves = loadSaves();
  if (!Array.isArray(saves)) return;
  let s = saves[idx];
  if (!s) return;
  const modal = document.getElementById('modal-event');
  const box = document.getElementById('modal-event-box');
  let ratingColor = SAVE_RATING_COLORS[s.rating] || '#888888';
  box.innerHTML = `
    <div style="text-align:center;margin-bottom:15px;">
      <div style="font-size:13px;color:var(--gray);margin-bottom:4px;">${escapeHtml(s.timeline || '未知时间线')}</div>
      <div style="font-size:22px;color:var(--gold);letter-spacing:3px;">命运终章</div>
      <div style="font-size:48px;font-weight:bold;color:${ratingColor};text-shadow:0 0 20px ${ratingColor}40;margin:10px 0;">${s.rating || '?'}</div>
    </div>
    <div style="background:var(--bg2);border-radius:10px;padding:14px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;">
        <span style="color:var(--gray);">身份</span><span style="color:var(--white);font-weight:bold;">${escapeHtml(s.identity || '未知')}${s.identityType === 'soul_beast' && s.beastYears != null ? ' · ' + formatYears(s.beastYears) : ''}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;">
        <span style="color:var(--gray);">${s.identityType === 'soul_beast' ? '血脉' : '武魂/血脉'}</span><span style="color:var(--gold);font-weight:bold;">${escapeHtml(s.martialSoul || '魂兽')}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;">
        <span style="color:var(--gray);">先天魂力</span><span style="color:var(--white);font-weight:bold;">${s.innatePower != null ? s.innatePower : '?'}级</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;">
        <span style="color:var(--gray);">最高魂力</span><span style="color:var(--gold);font-weight:bold;">${s.soulPower != null ? s.soulPower : '?'}级</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;">
        <span style="color:var(--gray);">魂环 / 魂骨</span><span style="color:var(--white);font-weight:bold;">${s.rings != null ? s.rings : '?'}环 / ${s.bones != null ? s.bones : '?'}骨</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;">
        <span style="color:var(--gray);">享年</span><span style="color:var(--white);font-weight:bold;">${s.age != null ? s.age : '?'}岁</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;">
        <span style="color:var(--gray);">死因</span><span style="color:var(--red);font-weight:bold;">${escapeHtml(s.deathReason || '未知')}</span>
      </div>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--dark);border-radius:8px;padding:14px;text-align:center;font-size:14px;color:var(--gray);font-style:italic;margin-bottom:15px;">
      ${escapeHtml(s.epitaph || '无言的结局。')}
    </div>
    <div style="text-align:center;">
      <button class="btn btn-sm" onclick="closeSaveModal()">关闭</button>
    </div>
  `;
  modal.classList.add('active');
}

function closeSaveModal() {
  document.getElementById('modal-event').classList.remove('active');
}

async function deleteSave(idx) {
  let result = await SaveService.deleteSaveByIndex(idx);
  if (!result.ok) {
    showSaveToast(result.error || '删除存档失败', 'var(--red)');
    return;
  }
  renderSaves();
}

function saveCurrentGame() {
  let result = SaveService.saveCurrentGameState(G);
  if (!result.ok) {
    console.error('存档保存失败', result.error);
    showSaveToast(result.message || '存档保存失败', 'var(--red)');
    return;
  }

  if (result.warningMessage) {
    showSaveToast(result.warningMessage, 'var(--orange)');
  }
  if (result.fullOk) {
    showSaveToast('存档成功！进度已保存');
    addEventLog(G.age, 'fortune', '<b style="color:var(--green);">【存档成功】</b> 游戏进度已保存。');
  }

  SaveService.syncSaveToBackend(result.summary, result.fullData).catch(() => { });
}

async function loadSaveGame(idx) {
  let result = await SaveService.loadSaveGameState(idx, createDefaultState);
  if (!result.ok) {
    alert(result.error);
    return;
  }

  G = result.gameState;
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  let ob = document.getElementById('mini-auto-stop-btn'); if (ob) ob.style.display = 'none';
  showScreen('screen-life');
  renderSidebar();
  let log = document.getElementById('event-log');
  if (G.yearEvents && G.yearEvents.length > 0) {
    log.innerHTML = G.yearEvents.map(e => `<div class="event-entry"><div class="event-year">${e.age}岁</div><div class="event-text">${e.text}</div></div>`).join('');
  } else {
    log.innerHTML = '<div class="event-entry"><div class="event-year">存档已加载</div><div class="event-text"><b style="color:var(--gold);">【读档成功】</b>继续你的传奇之路...</div></div>';
  }
  renderControls();
}

// ============================================================
// INIT
// ============================================================
loadGlobalAchievements();
initParticles();
// Mini wheel click-to-close
document.getElementById('mini-wheel-overlay').addEventListener('click', function (e) {
  if (e.target.id !== 'mini-wheel-spin-btn' && !e.target.closest('#mini-wheel-spin-btn')) {
    closeMiniWheel();
  }
});

