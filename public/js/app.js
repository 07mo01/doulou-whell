function checkSoulEvolution() {
  if (!G || !G.martialSoul || !G.martialSoul.name) return null;
  if (G.martialSoul.isDual || G.martialSoul.id === 'multi') return null;
  let baseName = G.martialSoul._baseName || G.martialSoul.name;
  let evo = SOUL_EVOLUTIONS[baseName];
  if (!evo) {
    let t = G.martialSoul.type;
    if (t === '器武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_WEAPON_'];
    else if (t === '兽武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_BEAST_'];
    else if (t === '变异武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_MUTANT_'];
  }
  if (!evo) return null;
  let stage = G.martialSoul.evolutionStage || 0;
  if (stage >= evo.stages.length) return null;
  if (G.soulPower >= evo.levels[stage] && G.age >= evo.ages[stage]) {
    let newName;
    if (evo.type === 'replace') newName = evo.stages[stage];
    else if (evo.type === 'prefix') newName = evo.stages[stage] + baseName;
    else newName = baseName + evo.stages[stage];
    return { stage: stage + 1, newName: newName, bonusPower: evo.powers[stage], desc: evo.descs[stage] };
  }
  return null;
}

function checkSoulCoreFormation() {
  if (!G || !G.martialSoul) return null;
  let currentCore = G.soulCore || 0;
  let soulName = G.martialSoul.name || '';

  if (G.timeline?.id === 'douluo2') {
    if (currentCore === 0 && G.soulPower >= 60) {
      let attrs = ['力量', '速度', '精神', '魂力', '防御', '攻击'];
      let attr1 = attrs[Math.floor(Math.random() * attrs.length)];
      let attr2 = attrs[Math.floor(Math.random() * attrs.length)];
      return {
        text: `<b style="color:var(--gold);">【魂核形成】</b> 在${soulName}的引导下，你成功凝聚出第一魂核——<span style="color:#88aa88;">普通魂核</span>！${attr1}+10%，${attr2}+5%！`,
        core: { level: 1, type: '普通', color: '#88aa88', attrs: { [attr1]: 0.1, [attr2]: 0.05 } },
        sp: 2
      };
    }
    if (currentCore === 1 && G.soulPower >= 80) {
      let attrs = ['力量', '速度', '精神', '魂力', '防御', '攻击'];
      let attr1 = attrs[Math.floor(Math.random() * attrs.length)];
      let attr2 = attrs[Math.floor(Math.random() * attrs.length)];
      while (attr2 === attr1) attr2 = attrs[Math.floor(Math.random() * attrs.length)];
      return {
        text: `<b style="color:var(--gold);">【魂核进化】</b> 第一魂核蜕变，进化为<span style="color:#aa88ff;">暗金魂核</span>！${attr1}+20%，${attr2}+10%，全属性+5%！`,
        core: { level: 2, type: '暗金', color: '#aa88ff', attrs: { [attr1]: 0.2, [attr2]: 0.1, 全属性: 0.05 } },
        sp: 3
      };
    }
    if (currentCore === 2 && G.soulPower >= 90) {
      let attrs = ['力量', '速度', '精神', '魂力', '防御', '攻击'];
      let attr1 = attrs[Math.floor(Math.random() * attrs.length)];
      return {
        text: `<b style="color:var(--gold);">【极致魂核】</b> 暗金魂核突破极限，进化为<span style="color:#ff8844;">极致魂核</span>！${attr1}+50%，全属性+20%，战力大幅飞跃！`,
        core: { level: 3, type: '极致', color: '#ff8844', attrs: { [attr1]: 0.5, 全属性: 0.2 } },
        sp: 5
      };
    }
  } else {
    if (currentCore === 0 && G.soulPower >= 60) {
      return {
        text: `<b style="color:var(--gold);">【魂核形成】</b> 在${soulName}的引导下，你成功凝聚出第一魂核！精神力大幅提升，战力+35%！`,
        core: { level: 1, type: '魂核', color: '#88aa88' },
        sp: 2
      };
    }
    if (currentCore === 1 && G.soulPower >= 80) {
      return {
        text: `<b style="color:var(--gold);">【双魂核】</b> 你成功凝聚出第二魂核！双核共振产生强大的精神力增幅，战力+70%！`,
        core: { level: 2, type: '双魂核', color: '#aa88ff' },
        sp: 3
      };
    }
    if (currentCore === 2 && G.soulPower >= 90) {
      return {
        text: `<b style="color:var(--gold);">【三魂核】</b> 极致的精神力突破，第三魂核凝聚成功！三核归一，战力+120%！`,
        core: { level: 3, type: '三魂核', color: '#ff8844' },
        sp: 5
      };
    }
  }
  return null;
}

function getEvolutionPotential(martialSoul) {
  if (!martialSoul || martialSoul.isDual || martialSoul.id === 'multi') return null;
  let baseName = martialSoul._baseName || martialSoul.name;
  let evo = SOUL_EVOLUTIONS[baseName];
  if (!evo) {
    let t = martialSoul.type;
    if (t === '器武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_WEAPON_'];
    else if (t === '兽武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_BEAST_'];
    else if (t === '变异武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_MUTANT_'];
  }
  if (!evo) return null;
  let last = evo.stages[evo.stages.length - 1];
  let finalForm = evo.type === 'replace' ? last : (evo.type === 'prefix' ? last + baseName : baseName + last);
  return `可进化 ${evo.stages.length} 次，最终形态：${finalForm}`;
}

// Get identity-adjusted quality weights
function getQualityWeightsForIdentity(identity, identityType) {
  let base = { common: 45, good: 35, mutant: 12, top: 7, dual: 1 };
  if (identityType === 'soul_beast') {
    // Beast: based on years (stored in G.beastYears)
    let yrs = G ? (G.beastYears || 0) : 0;
    if (yrs >= 200000) return { common: 5, good: 15, mutant: 30, top: 45, dual: 5 };
    if (yrs >= 100000) return { common: 10, good: 25, mutant: 30, top: 30, dual: 5 };
    if (yrs >= 10000) return { common: 20, good: 35, mutant: 25, top: 18, dual: 2 };
    if (yrs >= 1000) return { common: 35, good: 40, mutant: 15, top: 9, dual: 1 };
    return { common: 50, good: 35, mutant: 10, top: 4, dual: 1 };
  }
  if (identityType === 'god') {
    return { common: 0, good: 5, mutant: 15, top: 70, dual: 10 };
  }
  // Human: based on identity
  switch (identity.id) {
    case 'commoner': return { common: 55, good: 32, mutant: 8, top: 4, dual: 1 };
    case 'orphan': return { common: 45, good: 30, mutant: 15, top: 8, dual: 2 };
    case 'rogue': return { common: 40, good: 35, mutant: 15, top: 8, dual: 2 };
    case 'sect_disciple': return { common: 30, good: 42, mutant: 15, top: 11, dual: 2 };
    case 'noble': return { common: 20, good: 40, mutant: 18, top: 18, dual: 4 };
    case 'family_child': return { common: 10, good: 30, mutant: 22, top: 30, dual: 8 };
    default: return base;
  }
}

// Build quality-tier wheel items based on identity
function buildQualityWheel() {
  let weights = getQualityWeightsForIdentity(G.identity, G.identityType);
  let items = [
    { name: '普通武魂', tier: 'common', weight: weights.common, color: '#888888', desc: '铜铁之类，随处可见。' },
    { name: '优秀武魂', tier: 'good', weight: weights.good, color: '#4488ff', desc: '材质上佳，战力不俗。' },
    { name: '变异武魂', tier: 'mutant', weight: weights.mutant, color: '#aa66ff', desc: '基因异变，祸福难料。' },
    { name: '顶级武魂', tier: 'top', weight: weights.top, color: '#ffdd44', desc: '世界顶尖，天生神级。' },
    { name: '双生武魂', tier: 'dual', weight: weights.dual, color: '#ff4444', desc: '极其罕见，双魂觉醒。' }
  ];
  return items.filter(i => i.weight > 0);
}

// Pick N random names from a tier pool for the name wheel display
function pickNameWheelItems(tier, count) {
  let pool = buildSoulNamePool();
  let source = pool[tier] || pool.common;
  // Shuffle and pick
  let shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Randomly select one name from tier pool
function randomSoulName(tier) {
  let pool = buildSoulNamePool();
  let source = pool[tier] || pool.common;
  return source[Math.floor(Math.random() * source.length)];
}

const SOUL_LEVELS = [
  { min: 1, max: 10, name: '魂士' }, { min: 11, max: 20, name: '魂师' }, { min: 21, max: 30, name: '大魂师' },
  { min: 31, max: 40, name: '魂尊' }, { min: 41, max: 50, name: '魂宗' }, { min: 51, max: 60, name: '魂王' },
  { min: 61, max: 70, name: '魂帝' }, { min: 71, max: 80, name: '魂圣' }, { min: 81, max: 90, name: '魂斗罗' },
  { min: 91, max: 95, name: '封号斗罗' }, { min: 96, max: 98, name: '超级斗罗' }, { min: 99, max: 99, name: '极限斗罗' },
  { min: 100, max: 109, name: '神阶' }, { min: 110, max: 119, name: '真神级' }, { min: 120, max: 149, name: '超神级' },
  { min: 150, max: 200, name: '神王级' }
];

const BASE_RING_LIMITS = [423, 764, 1760, 5000, 12000, 20000, 30000, 50000, 100000];
const RING_QUALITY_MULTIPLIERS = { 普通: 1.0, 优秀: 1.3, 变异: 1.6, 顶级: 2.0, 双生: 3.0, '优秀~顶级': 1.8 };
function getRingLimit(ringNum) {
  let base = BASE_RING_LIMITS[ringNum] || 100000;
  let quality = G.martialSoul?.quality || '普通';
  let mult = RING_QUALITY_MULTIPLIERS[quality] || 1.0;
  // Evolution bonus: each stage adds 20% more
  let evoStage = G.martialSoul?.evolutionStage || 0;
  mult += evoStage * 0.2;
  return Math.floor(base * mult);
}
const SOUL_RING_COLORS = [
  { max: 9, color: 'white', cn: '白色', css: 'w', bg: '#cccccc' },
  { max: 999, color: 'yellow', cn: '黄色', css: 'y', bg: '#dddd00' },
  { max: 9999, color: 'purple', cn: '紫色', css: 'p', bg: '#aa00ff' },
  { max: 99999, color: 'black', cn: '黑色', css: 'b', bg: '#333333' },
  { max: 999999, color: 'red', cn: '红色', css: 'r', bg: '#ff0000' },
  { max: Infinity, color: 'gold', cn: '橙金色', css: 'g', bg: '#ffaa00' }
];

const TEN_FEROCIOUS = [
  { rank: 1, name: '帝天', title: '金眼黑龙王', age: 89, attr: '极致黑暗' },
  { rank: 2, name: '邪帝', title: '邪眼暴君主宰', age: 79, attr: '极致之恶' },
  { rank: 3, name: '雪帝', title: '冰天雪女', age: 70, attr: '极致之冰' },
  { rank: 4, name: '碧姬', title: '翡翠天鹅', age: 58, attr: '治愈之王' },
  { rank: 5, name: '万妖王', title: '妖眼魔树', age: 55, attr: '植物系之王' },
  { rank: 6, name: '熊君', title: '暗金恐爪熊', age: 48, attr: '强攻系之王' },
  { rank: 7, name: '冰帝', title: '冰碧帝皇蝎', age: 40, attr: '极致之冰' },
  { rank: 8, name: '赤王', title: '三头赤魔獒', age: 35, attr: '帝天部下' },
  { rank: 9, name: '妖灵', title: '邪眼暴君', age: 30, attr: '邪帝之子' },
  { rank: 10, name: '泰坦雪魔王', title: '泰坦雪魔', age: 25, attr: '极北天王之三' }
];

// ============================================================
// COMBAT POWER SYSTEM (战力系统)
// ============================================================
function calculateCombatPower(entity, isEnemy = false) {
  if (isEnemy) {
    let level = entity.level || 1;
    let power = entity.power || 1;
    return Math.floor(level * 100 * power);
  }
  let base = (G.soulPower || 0) * 200;
  let ringBonus = 0;
  if (Array.isArray(G.soulRings) && G.soulRings.length > 0) {
    G.soulRings.forEach((r, idx) => {
      let years = r.years || 0;
      let ringMultiplier = 1 + idx * 0.2;
      if (years >= 1000000) ringBonus += 1200 * ringMultiplier;
      else if (years >= 100000) ringBonus += 500 * ringMultiplier;
      else if (years >= 10000) ringBonus += 200 * ringMultiplier;
      else if (years >= 1000) ringBonus += 60 * ringMultiplier;
      else if (years >= 100) ringBonus += 20 * ringMultiplier;
      else ringBonus += 5 * ringMultiplier;
      if (r.skills && r.skills.length) {
        r.skills.forEach(s => {
          let skillBonus = s.type === 'control' ? 100 : (s.type === 'attack' ? 90 : (s.type === 'defense' ? 80 : (s.type === 'boost' ? 150 : 70)));
          ringBonus += skillBonus;
        });
      }
    });
  }
  let boneBonus = 0;
  if (G.soulBones && G.soulBones.length > 0) {
    boneBonus = G.soulBones.length * 300;
    if (G.soulBones.length >= 4) boneBonus += 500;
    if (G.soulBones.length >= 6) boneBonus += 1000;
  }
  let customSkillBonus = 0;
  if (G.customSkills && G.customSkills.length > 0) {
    G.customSkills.forEach(s => {
      let type = s.type || 'attack';
      if (type === 'control') customSkillBonus += 200;
      else if (type === 'attack') customSkillBonus += 180;
      else if (type === 'defense') customSkillBonus += 150;
      else if (type === 'boost') customSkillBonus += 120;
      else customSkillBonus += 100;
    });
  }
  let qualityBonus = 1;
  if (G.martialSoul?.quality) {
    let q = G.martialSoul.quality;
    if (q.includes('顶级')) qualityBonus = 1.6;
    else if (q.includes('变异')) qualityBonus = 1.35;
    else if (q.includes('优秀')) qualityBonus = 1.15;
    else if (q.includes('双生')) qualityBonus = 2.2;
  }
  let bloodlineBonus = G.bloodline ? 1.3 : 1;
  // 血脉属性精细化加成
  let bloodlineAttrBonus = 1;
  if (G.bloodline?.attr) {
    let ba = G.bloodline.attr;
    if (typeof ba.power === 'number') bloodlineAttrBonus *= ba.power;
    if (typeof ba.defense === 'number') bloodlineAttrBonus *= (1 + (ba.defense - 1) * 0.5);
    if (typeof ba.speed === 'number') bloodlineAttrBonus *= (1 + (ba.speed - 1) * 0.3);
    if (typeof ba.control === 'number') bloodlineAttrBonus *= (1 + (ba.control - 1) * 0.4);
    if (typeof ba.heal === 'number') bloodlineAttrBonus *= (1 + (ba.heal - 1) * 0.2);
    if (typeof ba.space === 'number') bloodlineAttrBonus *= ba.space;
    if (typeof ba.time === 'number') bloodlineAttrBonus *= ba.time;
    if (typeof ba.devour === 'number') bloodlineAttrBonus *= ba.devour;
  }
  // 降生地点属性加成
  let birthplaceBonus = 1;
  if (G.birthplace?.attr) {
    let ba = G.birthplace.attr;
    if (typeof ba.power === 'number') birthplaceBonus *= ba.power;
    if (typeof ba.risk === 'number') birthplaceBonus *= (1 + (ba.risk - 1) * 0.3);
    if (typeof ba.secret === 'number') birthplaceBonus *= (1 + (ba.secret - 1) * 0.4);
    if (typeof ba.divine === 'number') birthplaceBonus *= ba.divine;
    if (typeof ba.tech === 'number') birthplaceBonus *= (1 + (ba.tech - 1) * 0.5);
    if (typeof ba.spirit === 'number') birthplaceBonus *= (1 + (ba.spirit - 1) * 0.6);
    if (typeof ba.alien === 'number') birthplaceBonus *= (1 + (ba.alien - 1) * 0.5);
  }
  let soulCoreBonus = 1;
  if (G.soulCore >= 1) soulCoreBonus = 1.35;
  if (G.soulCore >= 2) soulCoreBonus = 1.7;
  if (G.soulCore >= 3) soulCoreBonus = 2.2;
  let coreAttrBonus = 1;
  if (Array.isArray(G.soulCores)) {
    G.soulCores.forEach(core => {
      if (core.attrs) {
        Object.values(core.attrs).forEach(v => {
          if (typeof v === 'number') coreAttrBonus *= (1 + v);
        });
      }
    });
  }
  // 神力技能加成（神和神兽专属）
  let divineSkillBonus = 1;
  if ((G.identityType === 'god' || G.identityType === 'divine_beast') && Array.isArray(G.divineSkills)) {
    divineSkillBonus = 1 + G.divineSkills.length * 0.15;
  }
  let total = Math.floor((base + ringBonus + boneBonus + customSkillBonus) * qualityBonus * bloodlineBonus * bloodlineAttrBonus * birthplaceBonus * soulCoreBonus * coreAttrBonus * divineSkillBonus);
  return total;
}

function getCombatPowerRating(cp) {
  if (cp >= 50000) return { name: '超神级', color: '#ff0000' };
  if (cp >= 30000) return { name: '神级', color: '#ffdd44' };
  if (cp >= 15000) return { name: '极限斗罗级', color: '#ff6644' };
  if (cp >= 8000) return { name: '封号斗罗级', color: '#aa66ff' };
  if (cp >= 4000) return { name: '魂斗罗级', color: '#44ddaa' };
  if (cp >= 2000) return { name: '魂圣级', color: '#4488ff' };
  if (cp >= 1000) return { name: '魂帝级', color: '#88aaff' };
  if (cp >= 500) return { name: '魂王级', color: '#aaddaa' };
  if (cp >= 200) return { name: '魂宗级', color: '#cccc66' };
  if (cp >= 100) return { name: '魂尊级', color: '#aaaaaa' };
  return { name: '魂士级', color: '#888888' };
}

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

  // Adjust weights based on personality
  let items = pool.map(e => {
    let w = e.weight * playerEnemyTrait;
    // Fierce appearance attracts more enemies
    if (G.appearance?.id === 'fierce') w *= 1.3;
    if (G.appearance?.id === 'divine') w *= 1.5; // divine beauty attracts jealousy
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
    // Determine enemy power relative to player
    let enemyLevel = Math.max(1, Math.round(G.soulPower * selected.power + (Math.random() * 10 - 5)));
    let stronger = enemyLevel > G.soulPower;

    // Beast-specific: human enemies can be escaped
    let isBeast = G.identityType === 'soul_beast';
    let isHumanEnemy = selected.type === 'human' || selected.type === 'evil_human';
    let canEscape = isBeast && isHumanEnemy;

    // Appearance/gender effects on battle (define BEFORE using)
    let charm = G.appearance?.attr?.charm || 5;
    let isFemale = G.gender?.id === 'female';
    let isFierce = G.appearance?.id === 'fierce';
    let isDivine = G.appearance?.id === 'divine';
    let isEvil = selected.type === 'evil' || selected.type === 'evil_human';

    // Battle outcome (combat power system)
    let playerCP = calculateCombatPower(G, false);
    let enemyCP = calculateCombatPower({ level: enemyLevel, power: selected.power }, true);
    let cpDiff = playerCP - enemyCP;
    let cpRatio = cpDiff / Math.max(enemyCP, 1);

    let win = false;
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
    win = Math.random() < winChance;

    let playerCPRating = getCombatPowerRating(playerCP);
    let enemyCPRating = getCombatPowerRating(enemyCP);
    let cpDisplay = `<p style="font-size:12px;color:var(--gray);margin-top:6px;">我方战力：<span style="color:${playerCPRating.color};">${playerCP}</span>（${playerCPRating.name}） | 敌方战力：<span style="color:${enemyCPRating.color};">${enemyCP}</span>（${enemyCPRating.name}）</p>`;

    let area = document.getElementById('mini-wheel-result-area');
    let enemyInfo = { name: selected.name, level: enemyLevel, type: selected.type, cp: enemyCP };

    if (canEscape && !win) {
      // Beast vs human: escape option on defeat
      let escapeChance = 0.3 + (G.bloodline?.attr?.speed || 0) * 0.1;
      let escaped = Math.random() < escapeChance;
      if (escaped) {
        let lossYears = 1 + Math.floor(Math.random() * 3);
        G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
        syncBeastSoulPower();
        G.enemies.push({ ...enemyInfo, escaped: true });
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--green)">成功逃脱！</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc ? `<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>` : ''}${cpDisplay}<p>你察觉到危险，凭借魂兽的本能迅速逃离了人类的猎杀范围！</p><p style="color:var(--gold);margin-top:8px;">逃脱成功，仅损失${lossYears}年修为</p></div>`;
      } else {
        // Failed to escape, fight and lose
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
        // Beast wins: gain years instead of soul power
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
      // Evil soul masters drain more soul power
      let lossCap = isEvil ? 10 : 5;
      let loss = Math.min(Math.floor(enemyLevel * 0.3), lossCap);

      if (isBeast) {
        // Beast defeat: lose years
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

        // Special evil master interactions based on gender/appearance
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
// GAME STATE
// ============================================================
let G = null; // Current game state
let wheelQueue = [];
let wheelIndex = 0;
let currentWheelData = null;
let isSpinning = false;
let globalAchievements = [];

function loadGlobalAchievements() {
  try { globalAchievements = JSON.parse(localStorage.getItem('dl_achievements')) || []; } catch (e) { globalAchievements = []; }
}
function saveGlobalAchievements() {
  localStorage.setItem('dl_achievements', JSON.stringify(globalAchievements));
}
function loadSaves() {
  try { return JSON.parse(localStorage.getItem('dl_saves')) || []; } catch (e) { return []; }
}
function saveSaves(saves) {
  localStorage.setItem('dl_saves', JSON.stringify(saves));
}

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
// ============================================================
function generateRandomCharacter(forceType) {
  // forceType: 'human' or 'soul_beast'
  let c = {};
  c.timeline = weightedRandom(TIMELINES);
  c.identityType = forceType;

  if (forceType === 'human') {
    c.identity = weightedRandom(HUMAN_BACKGROUNDS);
    let genderPool = GENDERS.filter(g => g.id !== 'none');
    c.gender = weightedRandom(genderPool);
    c.personality = weightedRandom(PERSONALITIES);
    c.appearance = weightedRandom(APPEARANCES);
    // Generate martial soul
    let tempG = { identity: c.identity, identityType: 'human' };
    let oldG = G;
    G = tempG;
    let qItems = buildQualityWheel();
    let q = weightedRandom(qItems);
    if (q.tier === 'dual') {
      let s1 = randomSoulName('top');
      let s2 = randomSoulName('top');
      c.martialSoul = {
        name: '双生武魂', type: '双生武魂', quality: '顶级+', qColor: '#ff4444',
        example: `${s1.name} / ${s2.name}`, isDual: true, activeIndex: 0,
        souls: [
          { ...s1, rings: [], skills: [], _baseName: s1.name, evolutionStage: 0 },
          { ...s2, rings: [], skills: [], _baseName: s2.name, evolutionStage: 0 }
        ]
      };
    } else {
      let s = randomSoulName(q.tier);
      c.martialSoul = { ...s, example: s.name, rings: [], skills: [], _baseName: s.name, evolutionStage: 0 };
    }
    // Innate power based on quality
    let inatePools = [
      { name: '先天魂力0级', min: 0, max: 0, weight: 20, ratingColor: '#888' },
      { name: '先天魂力1~5级', min: 1, max: 5, weight: 50, ratingColor: '#4488ff' },
      { name: '先天魂力6~9级', min: 6, max: 9, weight: 25, ratingColor: '#ffdd44' },
      { name: '先天满魂力（10级）', min: 10, max: 10, weight: 5, ratingColor: '#ff4444' }
    ];
    if (q.tier === 'top' || q.tier === 'dual') inatePools[3].weight = 40;
    else if (q.tier === 'mutant') inatePools[2].weight = 45;
    else if (q.tier === 'good') inatePools[1].weight = 65;
    let innate = weightedRandom(inatePools);
    c.innatePower = innate.min === innate.max ? innate.min : innate.min + Math.floor(Math.random() * (innate.max - innate.min + 1));
    c.innateRating = innate.name.replace('先天', '');
    c.innateRatingColor = innate.ratingColor;
    G = oldG;
    c.soulPower = c.innatePower;
  } else {
    // Soul beast
    c.identity = weightedRandom(BEAST_RACES);
    c.bloodline = weightedRandom(BEAST_BLOODLINES);
    // Birthplace filtered by timeline
    let bps = getBeastBirthplaces(c.timeline.id);
    c.birthplace = bps.length > 0 ? weightedRandom(bps) : { name: '未知之地', desc: '一片未知的区域。' };
    c.personality = weightedRandom(PERSONALITIES);
    c.appearance = weightedRandom(APPEARANCES);
    c.beastYears = 0;
    c.martialSoul = null;
    c.innatePower = 0;
    c.innateRating = '无';
    c.innateRatingColor = '#888';
    let bp = c.bloodline?.attr?.power || 1.0;
    c.soulPower = 1 + Math.floor((bp - 1.0) * 5);
  }
  return c;
}


function rerollQuickRandom() {
  _quickRandomHuman = generateRandomCharacter('human');
  _quickRandomBeast = generateRandomCharacter('soul_beast');
  renderQuickRandom();
}

function startGameFromQuick(type) {
  let c = type === 'human' ? _quickRandomHuman : _quickRandomBeast;
  G = createDefaultState();
  G.timeline = c.timeline;
  G.identityType = c.identityType;
  G.identity = c.identity;
  G.gender = c.gender || { name: '男' };
  G.martialSoul = c.martialSoul;
  G.soulRings = c.martialSoul?.rings || [];
  G.soulBones = [];
  G.innatePower = c.innatePower || 0;
  G.innateRating = c.innateRating || '无';
  G.innateRatingColor = c.innateRatingColor || '#888';
  G.soulPower = c.soulPower || 1;
  G.personality = c.personality;
  G.appearance = c.appearance;
  G.alive = true;
  G.age = 6;
  G.events = [];
  G.keyEvents = [];
  G.yearEvents = [];
  G.companions = [];
  G.enemies = [];
  G.gold = 0;
  G.merit = 0;

  if (type === 'soul_beast') {
    G.bloodline = c.bloodline;
    G.birthplace = c.birthplace;
    G.beastYears = 0;
    syncBeastSoulPower();
  }

  if (G.timeline.id === 'douluo4') { G.maxLevel = 150; G.maxAge = 200; }
  else if (G.timeline.id === 'godrealm') { G.maxLevel = 200; G.maxAge = 999; }
  else { G.maxLevel = 99; G.maxAge = 150; }

  showAwakening();
}

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

  // Build wheel queue - start with timeline only, others added dynamically
  wheelQueue = [
    { type: 'timeline', label: '抽取时间线', centerText: '时', items: TIMELINES, labelKey: 'name', colorKey: 'eraColor' }
  ];

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
  const area = document.getElementById('wheel-result-area');
  const hint = document.getElementById('wheel-hint');
  const canvas = document.getElementById('wheel-canvas');

  switch (wheelQueue[wheelIndex].type) {
    case 'timeline':
      G = { ...createDefaultState(), timeline: item };
      area.innerHTML = `<div class="wheel-result"><h3>${item.name}</h3><p>${item.era}</p><p style="margin-top:8px;color:var(--gray)">${item.desc}</p></div>`;
      hint.textContent = '时代已确定，接下来抽取身份种族...';
      // Build identity type wheel: human/beast for normal, god/divine_beast for godrealm
      let idTypePool;
      if (item.id === 'godrealm') { idTypePool = [...IDENTITY_TYPES.god, ...IDENTITY_TYPES.divine_beast]; }
      else { idTypePool = [...IDENTITY_TYPES.human, ...IDENTITY_TYPES.soul_beast]; }
      idTypePool.forEach((it, i) => { it.eraColor = it.color || `hsl(${(i / idTypePool.length) * 280 + 120},50%,30%)`; });
      wheelQueue.push({ type: 'identity_type', label: '抽取种族', centerText: '族', items: idTypePool, labelKey: 'name', colorKey: 'color' });
      break;
    case 'identity_type':
      G.identityType = item.id;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      if (item.id === 'human') {
        hint.textContent = '你是人类，接下来抽取出身背景...';
        HUMAN_BACKGROUNDS.forEach((it, i) => { it.eraColor = `hsl(${(i / HUMAN_BACKGROUNDS.length) * 200 + 200},50%,30%)`; });
        wheelQueue.push({ type: 'background', label: '抽取背景', centerText: '出', items: HUMAN_BACKGROUNDS, labelKey: 'name', colorKey: null });
      } else if (item.id === 'soul_beast') {
        hint.textContent = '你是魂兽，接下来抽取种族年限...';
        BEAST_RACES.forEach((it, i) => { it.eraColor = `hsl(${(i / BEAST_RACES.length) * 60},50%,30%)`; });
        wheelQueue.push({ type: 'beast_race', label: '抽取种族', centerText: '族', items: BEAST_RACES, labelKey: 'name', colorKey: null });
      } else if (item.id === 'god') {
        hint.textContent = '你是神祇，接下来抽取神位...';
        GOD_TIERS.forEach((it, i) => { it.eraColor = `hsl(${(i / GOD_TIERS.length) * 60 + 40},50%,30%)`; });
        wheelQueue.push({ type: 'god_tier', label: '抽取神位', centerText: '神', items: GOD_TIERS, labelKey: 'name', colorKey: null });
      } else if (item.id === 'divine_beast') {
        hint.textContent = '你是神兽，接下来抽取神兽种族...';
        DIVINE_BEAST_RACES.forEach((it, i) => { it.eraColor = `hsl(${(i / DIVINE_BEAST_RACES.length) * 80 + 20},50%,35%)`; });
        wheelQueue.push({ type: 'divine_beast_race', label: '抽取神兽种族', centerText: '兽', items: DIVINE_BEAST_RACES, labelKey: 'name', colorKey: 'color' });
      }
      break;
    case 'background':
      G.identity = item;
      area.innerHTML = `<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent = '背景已定，接下来抽取性别...';
      let bgGenderItems = GENDERS.filter(g => g.id !== 'none');
      wheelQueue.push({ type: 'gender', label: '抽取性别', centerText: '性', items: bgGenderItems, labelKey: 'name', colorKey: null });
      bgGenderItems.forEach((g, i) => { g.eraColor = `hsl(${(i / bgGenderItems.length) * 280},50%,30%)`; });
      break;
    case 'beast_race':
      G.identity = item;
      G.gender = Math.random() < 0.5 ? { id: 'male', name: '雄', desc: '' } : { id: 'female', name: '雌', desc: '' };
      area.innerHTML = `<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent = '种族已定，接下来抽取血脉系...';
      BEAST_BLOODLINES.forEach((it, i) => { it.eraColor = it.color; });
      wheelQueue.push({ type: 'beast_bloodline', label: '抽取血脉系', centerText: '脉', items: BEAST_BLOODLINES, labelKey: 'name', colorKey: 'color' });
      break;
    case 'divine_beast_race':
      G.identity = item;
      G.gender = Math.random() < 0.5 ? { id: 'male', name: '雄', desc: '' } : { id: 'female', name: '雌', desc: '' };
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent = '神兽种族已定，接下来抽取神兽血脉...';
      BEAST_BLOODLINES.forEach((it, i) => { it.eraColor = it.color; });
      wheelQueue.push({ type: 'beast_bloodline', label: '抽取神兽血脉', centerText: '脉', items: BEAST_BLOODLINES, labelKey: 'name', colorKey: 'color' });
      break;
    case 'god_tier':
      G.identity = item;
      area.innerHTML = `<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent = '神位等级已定，接下来抽取神位名称...';
      let posPool = GOD_POSITIONS[item.id] || GOD_POSITIONS.god_official;
      posPool = posPool.map((p, i) => ({ ...p, weight: 1, eraColor: p.color }));
      wheelQueue.push({ type: 'god_position', label: '抽取神位名称', centerText: '神', items: posPool, labelKey: 'name', colorKey: 'eraColor' });
      break;
    case 'god_position':
      G.godPosition = item;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent = '神位已定，接下来抽取神器...';
      let artPool = GOD_ARTIFACTS[G.identity?.id] || GOD_ARTIFACTS.god_official;
      artPool = artPool.map((a, i) => ({ ...a, weight: 1, eraColor: a.color }));
      wheelQueue.push({ type: 'god_artifact', label: '抽取神器', centerText: '器', items: artPool, labelKey: 'name', colorKey: 'eraColor' });
      break;
    case 'god_artifact':
      G.godArtifact = item;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent = '神器已定，接下来抽取神界势力...';
      GOD_FACTIONS_POOL.forEach((f, i) => { f.eraColor = f.color; });
      wheelQueue.push({ type: 'god_faction', label: '抽取神界势力', centerText: '势', items: GOD_FACTIONS_POOL, labelKey: 'name', colorKey: 'eraColor' });
      break;
    case 'god_faction':
      G.faction = item.name;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent = '势力已定，接下来抽取性别...';
      let godGenderItems2 = GENDERS.filter(g => g.id !== 'none');
      godGenderItems2.forEach((g, i) => { g.eraColor = `hsl(${(i / godGenderItems2.length) * 280},50%,30%)`; });
      wheelQueue.push({ type: 'gender', label: '抽取性别', centerText: '性', items: godGenderItems2, labelKey: 'name', colorKey: null });
      break;
    case 'gender':
      G.gender = item;
      area.innerHTML = `<div class="wheel-result"><h3>性别：${item.name}</h3><p>${item.desc}</p></div>`;
      if (G.identityType === 'soul_beast') {
        hint.textContent = '接下来抽取血脉系...';
        BEAST_BLOODLINES.forEach((it, i) => { it.eraColor = it.color; });
        wheelQueue.push({ type: 'beast_bloodline', label: '抽取血脉系', centerText: '脉', items: BEAST_BLOODLINES, labelKey: 'name', colorKey: 'color' });
      } else if (G.identityType === 'god') {
        hint.textContent = '神祇无需武魂觉醒，接下来抽取性格...';
        wheelQueue.push({ type: 'personality', label: '抽取性格', centerText: '性', items: PERSONALITIES, labelKey: 'name', colorKey: 'color' });
      } else {
        if (G.timeline.factions && (G.identity.id === 'sect_disciple' || G.identity.id === 'family_child' || G.identity.id === 'noble')) {
          G.faction = G.timeline.factions[Math.floor(Math.random() * G.timeline.factions.length)];
          area.innerHTML += `<p style="color:var(--cyan);margin-top:8px;">所属势力：<b>${G.faction}</b></p>`;
        }
        hint.textContent = '接下来抽取觉醒个数...';
        let awItems = AWAKENING_COUNT.map(a => ({ ...a }));
        if (G.identity.id === 'family_child') { awItems[1].weight = 40; awItems[2].weight = 18; awItems[3].weight = 7; }
        if (G.identity.id === 'noble') { awItems[1].weight = 35; awItems[2].weight = 15; awItems[3].weight = 5; }
        awItems.forEach((a, i) => { a.eraColor = a.color; });
        wheelQueue.push({ type: 'awaken_count', label: '抽取觉醒个数', centerText: '觉', items: awItems, labelKey: 'name', colorKey: 'color' });
      }
      break;
    case 'beast_bloodline':
      G.bloodline = item;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}血脉</h3><p>${item.desc}</p></div>`;
      hint.textContent = '血脉已定，抽取降生地点...';
      let birthplaces = getBeastBirthplaces(G.timeline.id);
      birthplaces.forEach((it, i) => { it.eraColor = it.color; });
      wheelQueue.push({ type: 'beast_birthplace', label: '抽取降生地点', centerText: '地', items: birthplaces, labelKey: 'name', colorKey: 'color' });
      break;
    case 'beast_birthplace':
      G.birthplace = item;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent = '降生地点已定，接下来抽取性格...';
      wheelQueue.push({ type: 'personality', label: '抽取性格', centerText: '性', items: PERSONALITIES, labelKey: 'name', colorKey: 'color' });
      break;
    case 'awaken_count':
      G._awakenCount = item.count;
      G._awakenedSouls = [];
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      // First soul: if has faction, use faction soul directly (skip quality wheel)
      if (G.faction && FACTION_SOULS[G.faction]) {
        let factionSouls = FACTION_SOULS[G.faction];
        let fSoulName = factionSouls[Math.floor(Math.random() * factionSouls.length)];
        G._awakenedSouls.push({ name: fSoulName, source: 'faction', faction: G.faction });
        area.innerHTML += `<p style="color:var(--cyan);margin-top:8px;">势力专属武魂：<b>${fSoulName}</b>（${G.faction}）</p>`;
        hint.textContent = '第一个是势力专属武魂，继续抽取品质...';
      } else {
        hint.textContent = '接下来抽取武魂品质...';
      }
      let qualityItems = buildQualityWheel();
      wheelQueue.push({ type: 'soul_quality', label: '抽取武魂品质', centerText: '品', items: qualityItems, labelKey: 'name', colorKey: 'color' });
      break;
    case 'soul_quality':
      G._soulQualityTier = item.tier;
      G._soulQualityName = item.name;
      G._soulQualityColor = item.color;
      let soulIdx = (G._awakenedSouls || []).length + 1;
      let totalSouls = G._awakenCount || 1;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">第${soulIdx}个武魂品质：${item.name}</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gray);">身份影响概率：${G.identity.name}（${soulIdx}/${totalSouls}）</p></div>`;
      hint.textContent = '品质已定，从千种武魂中觉醒...';
      let nameItems = pickNameWheelItems(item.tier, 12);
      nameItems.forEach(n => { n.weight = 1; });
      wheelQueue.push({ type: 'soul_name', label: `第${soulIdx}个武魂（千中选一）`, centerText: '魂', items: nameItems, labelKey: 'name', colorKey: 'qColor', tier: item.tier });
      break;
    case 'soul_name':
      let tier = wheelQueue[wheelIndex].tier;
      let actualSoul = randomSoulName(tier);
      let isDual = (tier === 'dual');

      if (isDual) {
        let soul1 = randomSoulName('top');
        let soul2 = randomSoulName('top');
        G._awakenedSouls = G._awakenedSouls || [];
        G._awakenedSouls.push({
          name: `${soul1.name} + ${soul2.name}`, type: '双生武魂', quality: '顶级+', qColor: '#ff4444',
          isDual: true, soul1: { ...soul1 }, soul2: { ...soul2 }
        });
        area.innerHTML = `<div class="wheel-result"><h3 style="color:#ff4444;">双生武魂觉醒！</h3><p>第一武魂：<span style="color:${soul1.qColor}">${soul1.name}</span>（${soul1.type}）</p><p>第二武魂：<span style="color:${soul2.qColor}">${soul2.name}</span>（${soul2.type}）</p></div>`;
      } else {
        G._awakenedSouls = G._awakenedSouls || [];
        G._awakenedSouls.push({ ...actualSoul });
        area.innerHTML = `<div class="wheel-result"><h3 style="color:${actualSoul.qColor}">武魂：${actualSoul.name}</h3><p>类型：${actualSoul.type} | 品质：<span style="color:${actualSoul.qColor}">${actualSoul.quality}</span></p></div>`;
      }

      // Check if more souls to awaken
      let soulsDone = G._awakenedSouls.length;
      let hasFactionSoul = G._awakenedSouls.some(s => s.source === 'faction');
      let soulsTarget = (hasFactionSoul ? 1 : 0) + (G._awakenCount || 1);

      if (soulsDone < soulsTarget && !isDual) {
        hint.textContent = `还有${soulsTarget - soulsDone}个武魂要觉醒...`;
        let qualityItems = buildQualityWheel();
        wheelQueue.push({ type: 'soul_quality', label: '抽取武魂品质', centerText: '品', items: qualityItems, labelKey: 'name', colorKey: 'color' });
      } else {
        // All done - compile final martial soul
        let hasDualEntry = G._awakenedSouls.some(s => s.isDual);
        if (G._awakenedSouls.length === 1 && !hasDualEntry) {
          // Single soul
          let s = G._awakenedSouls[0];
          G.martialSoul = {
            ...s, example: s.name, rings: [], skills: [], _baseName: s.name, evolutionStage: 0
          };
        } else if (hasDualEntry) {
          // Dual soul - store both with independent rings
          let entry = G._awakenedSouls.find(s => s.isDual);
          G.martialSoul = {
            id: 'dual', name: '双生武魂', type: '双生武魂', quality: '顶级+', qColor: '#ff4444',
            example: `${entry.soul1.name} / ${entry.soul2.name}`,
            isDual: true, activeIndex: 0,
            souls: [
              { ...entry.soul1, rings: [], skills: [], _baseName: entry.soul1.name, evolutionStage: 0 },
              { ...entry.soul2, rings: [], skills: [], _baseName: entry.soul2.name, evolutionStage: 0 }
            ]
          };
          area.innerHTML += `<p style="color:var(--gold);margin-top:8px;">双生武魂觉醒完毕：${entry.soul1.name} + ${entry.soul2.name}</p>`;
        } else {
          // Multiple non-dual souls
          let soulNames = G._awakenedSouls.map(s => s.name).join(' + ');
          let bestQuality = '普通'; let bestColor = '#888';
          G._awakenedSouls.forEach(s => {
            if (s.quality === '顶级+') { bestQuality = '顶级+'; bestColor = '#ff4444'; }
            else if (s.quality === '顶级' && bestQuality !== '顶级+') { bestQuality = '顶级'; bestColor = '#ffdd44'; }
            else if (s.quality === '优秀~顶级' && bestQuality !== '顶级' && bestQuality !== '顶级+') { bestQuality = '优秀~顶级'; bestColor = '#aa66ff'; }
            else if (s.quality === '优秀' && bestQuality === '普通') { bestQuality = '优秀'; bestColor = '#4488ff'; }
          });
          G.martialSoul = {
            id: 'multi', name: G._awakenedSouls.length + '武魂觉醒',
            type: G._awakenedSouls.length > 1 ? '多武魂' : '器武魂',
            quality: bestQuality, qColor: bestColor,
            example: soulNames,
            souls: G._awakenedSouls.map(s => ({ ...s, rings: [], skills: [], _baseName: s.name, evolutionStage: 0 })),
            activeIndex: 0
          };
          area.innerHTML += `<p style="color:var(--gold);margin-top:8px;">所有武魂觉醒完毕：${soulNames}</p>`;
        }
        hint.textContent = '武魂已定，接下来抽取先天魂力...';
        wheelQueue.push({ type: 'innate', label: '抽取先天魂力', centerText: '魂', items: INNATE_POWER, labelKey: 'name', colorKey: 'ratingColor' });
      }
      break;
    case 'innate':
      let innateValue = item.min === item.max ? item.min : item.min + Math.floor(Math.random() * (item.max - item.min + 1));

      // Soul quality bonus: better quality = higher starting level
      // Common: no bonus, Good: +1, Mutant: +2, Top: +3, Dual: +5
      // Soul beast: bloodline bonus instead
      let soulBonus = 0;
      let soulBonusNote = '';
      if (G.identityType === 'soul_beast' && G.bloodline) {
        // Bloodline power determines bonus: 1.0 = +0, 1.4 = +4, etc.
        let bp = G.bloodline.attr?.power || 1.0;
        soulBonus = Math.floor((bp - 1.0) * 10);
        if (soulBonus > 0) soulBonusNote = `${G.bloodline.name}血脉加成+${soulBonus}`;
      } else if (G.martialSoul) {
        let q = G.martialSoul.quality;
        if (q === '普通') { soulBonus = 0; }
        else if (q === '优秀') { soulBonus = 1; soulBonusNote = '优秀武魂加成+1'; }
        else if (q === '优秀~顶级') { soulBonus = 2; soulBonusNote = '变异武魂加成+2'; }
        else if (q === '顶级') { soulBonus = 3; soulBonusNote = '顶级武魂加成+3'; }
        else if (q === '顶级+') { soulBonus = 5; soulBonusNote = '双生武魂加成+5'; }
      }
      innateValue = Math.min(innateValue + soulBonus, 20);

      // Guarantee: 顶级武魂保底8级, 双生武魂保底10级
      let isDualSoul = G.martialSoul && (G.martialSoul.type === '双生武魂' || G.martialSoul.id === 'dual');
      let isTopSoul = G.martialSoul && (G.martialSoul.quality === '顶级' || G.martialSoul.quality === '顶级+');
      if (isDualSoul && innateValue < 10) innateValue = 10;
      else if (isTopSoul && innateValue < 8) innateValue = 8;
      G.innatePower = innateValue;
      // Re-evaluate rating based on actual value
      let actualRating = INNATE_POWER.find(r => innateValue >= r.min && innateValue <= r.max);
      G.innateRating = actualRating ? actualRating.rating : item.rating;
      G.innateRatingColor = actualRating ? actualRating.ratingColor : item.ratingColor;
      let guaranteeNote = '';
      if (isDualSoul && (innateValue - soulBonus) < 10) guaranteeNote = '<br><span style="color:var(--gold)">【双生武魂保底：先天魂力提升至10级！】</span>';
      else if (isTopSoul && (innateValue - soulBonus) < 8) guaranteeNote = '<br><span style="color:var(--gold)">【顶级武魂保底：先天魂力提升至8级！】</span>';
      if (soulBonusNote) guaranteeNote = '<br><span style="color:var(--cyan)">【' + soulBonusNote + '】</span>' + guaranteeNote;
      area.innerHTML = `<div class="wheel-result"><h3>先天魂力：${G.innatePower}级</h3><p style="color:${G.innateRatingColor}">${G.innateRating}</p><p style="margin-top:4px">${actualRating ? actualRating.desc : item.desc}</p>${guaranteeNote}</div>`;
      hint.textContent = '天赋已定，接下来抽取性格...';
      wheelQueue.push({ type: 'personality', label: '抽取性格', centerText: '性', items: PERSONALITIES, labelKey: 'name', colorKey: 'color' });
      break;
    case 'personality':
      G.personality = item;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gray);">社交：${Math.round(item.traits.social * 100)}% | 情缘：${Math.round(item.traits.romance * 100)}% | 强敌：${Math.round(item.traits.enemy * 100)}%</p></div>`;
      hint.textContent = '性格已定，接下来抽取外貌...';
      wheelQueue.push({ type: 'appearance', label: '抽取外貌', centerText: '貌', items: APPEARANCES, labelKey: 'name', colorKey: 'color' });
      break;
    case 'appearance':
      G.appearance = item;
      let charm = item.attr?.charm || 5;
      area.innerHTML = `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}容貌</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gold);">魅力值：${charm}/10</p></div>`;
      hint.textContent = '';
      break;
  }

  // Hide spin button, show next step button
  document.getElementById('wheel-spin-btn').style.display = 'none';
  let nextBtn = document.getElementById('wheel-next-btn');
  nextBtn.style.display = '';
  if (wheelIndex >= wheelQueue.length - 1) {
    nextBtn.textContent = '进入斗罗大陆';
  } else {
    nextBtn.textContent = '下一步';
  }
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

function getLevelName(level) {
  for (let l of SOUL_LEVELS) { if (level >= l.min && level <= l.max) return l.name; } return '未知';
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
  let outcomes = [];

  switch (timelineId) {
    case 'douluo1':
      outcomes = [
        { text: `你与${spouse.name}在星斗大森林中历练，两人并肩作战，默契大增。`, effect: () => { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '魂力+2级'; } },
        { text: `${spouse.name}为你寻来了一株相思断肠红（仿品），助你稳固魂力。`, effect: () => { G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '魂力+3级'; } },
        { text: `你和${spouse.name}一同前往海神岛朝圣，在海神之光下共同修炼。`, effect: () => { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); G.merit = (G.merit || 0) + 5; return '魂力+2级，名声+5'; } },
        { text: `${spouse.name}遭遇武魂殿余孽的袭击，你奋不顾身前去相救！`, effect: () => { if (Math.random() < 0.8) { G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '成功救出！两人感情更加深厚，魂力+1级'; } else { G.soulPower = Math.max(G.soulPower - 2, 1); return '营救过程中受伤，魂力-2级'; } } },
        { text: `你和${spouse.name}在索托城散步，享受难得的宁静时光。`, effect: () => { return '平淡而幸福的一年。'; } }
      ];
      break;
    case 'douluo2':
      outcomes = [
        { text: `你与${spouse.name}在海神湖畔漫步，黄金树的见证下感情升温。`, effect: () => { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '魂力+2级'; } },
        { text: `${spouse.name}亲手为你制作了一件二级魂导器作为礼物。`, effect: () => { G.battleArmor = Math.max(G.battleArmor || 0, 1); G.gold = (G.gold || 0) + 20; return '掌握魂导基础，获得20金魂币'; } },
        { text: `你和${spouse.name}参加了海神缘相亲大会后的庆典，羡煞旁人。`, effect: () => { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); G.merit = (G.merit || 0) + 8; return '魂力+2级，名声+8'; } },
        { text: `${spouse.name}在监察团任务中遇险，你火速赶往救援！`, effect: () => { if (Math.random() < 0.75) { G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '成功救出！两人感情更加深厚，魂力+1级'; } else { G.soulPower = Math.max(G.soulPower - 2, 1); return '营救过程中受伤，魂力-2级'; } } },
        { text: `你和${spouse.name}一起研究魂导器到深夜，虽然疲惫但很充实。`, effect: () => { return '平淡而幸福的一年。'; } }
      ];
      break;
    case 'douluo3':
      outcomes = [
        { text: `你与${spouse.name}在史莱克学院的斗铠工坊一起制作合金，默契十足。`, effect: () => { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '魂力+2级'; } },
        { text: `${spouse.name}陪你去传灵塔升灵台修炼，两人在虚拟世界中并肩作战。`, effect: () => { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '魂力+2级'; } },
        { text: `你和${spouse.name}一同前往龙谷秘境探险，在龙骨山脉中许下了誓言。`, effect: () => { G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '魂力+3级（龙骨见证）'; } },
        { text: `${spouse.name}被圣灵教的人盯上，你挺身而出保护爱人！`, effect: () => { if (Math.random() < 0.7) { G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); G.merit = (G.merit || 0) + 5; return '成功击退敌人！名声+5，魂力+1级'; } else { G.soulPower = Math.max(G.soulPower - 2, 1); return '不敌邪魂师，受伤后魂力-2级'; } } },
        { text: `你和${spouse.name}在东海城的海边散步，谈论着未来的斗铠设计。`, effect: () => { return '平淡而幸福的一年。'; } }
      ];
      break;
    case 'douluo4':
      outcomes = [
        { text: `你与${spouse.name}在天龙星的龙族花园中约会，外星球的浪漫别有一番风味。`, effect: () => { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '魂力+2级'; } },
        { text: `${spouse.name}驾驶飞船带你游览了斗罗联邦的星际疆域。`, effect: () => { G.gold = (G.gold || 0) + 40; return '获得40金魂币'; } },
        { text: `你和${spouse.name}一同探索了龙界遗迹，在龙神的气息中感情升华。`, effect: () => { G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '魂力+3级'; } },
        { text: `${spouse.name}在深红之域的探索中失联，你冒着生命危险前去寻找！`, effect: () => { if (Math.random() < 0.7) { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '成功找到！两人在生死之间更加珍惜彼此，魂力+2级'; } else { G.soulPower = Math.max(G.soulPower - 3, 1); return '遭遇深红生物袭击，重伤后魂力-3级'; } } },
        { text: `你和${spouse.name}在精灵星的栖息地露营，欣赏着外星球的星空。`, effect: () => { return '平淡而幸福的一年。'; } }
      ];
      break;
    case 'godrealm':
      outcomes = [
        { text: `你与${spouse.name}在神界花园中漫步，神界的景色万年不变但身边有你足矣。`, effect: () => { G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '魂力+3级'; } },
        { text: `${spouse.name}用生命之力为你洗涤神魂，你的神力更加纯粹。`, effect: () => { G.soulPower = Math.min(G.soulPower + 4, G.maxLevel); return '魂力+4级（神魂洗涤）'; } },
        { text: `你和${spouse.name}一同参加了神界委员会举办的论道大会，在诸神面前展示了你们的默契。`, effect: () => { G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); G.merit = (G.merit || 0) + 10; return '魂力+3级，名声+10'; } },
        { text: `${spouse.name}在神界深渊巡查时遇险，你冲入深渊营救！`, effect: () => { if (Math.random() < 0.8) { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '成功救出！两人在神界也是令人羡慕的神仙眷侣，魂力+2级'; } else { G.soulPower = Math.max(G.soulPower - 2, 1); return '被神界乱流所伤，魂力-2级'; } } },
        { text: `你和${spouse.name}在神界天河旁静修，数万年的陪伴让你们的感情愈发深厚。`, effect: () => { return '平淡而幸福的一年。'; } }
      ];
      break;
    default:
      outcomes = [
        { text: `你与${spouse.name}一同修炼，两人相辅相成，魂力精进。`, effect: () => { G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '魂力+2级'; } },
        { text: `${spouse.name}为你寻来一株稀有药草，助你突破瓶颈。`, effect: () => { G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '魂力+3级'; } },
        { text: `你和${spouse.name}共同游历大陆，增长见闻。`, effect: () => { G.gold = (G.gold || 0) + 50; return '获得50金魂币'; } },
        { text: `${spouse.name}遭遇危险，你奋不顾身前去相救！`, effect: () => { if (Math.random() < 0.7) { return '成功救出！两人感情更加深厚。'; } else { G.soulPower = Math.max(G.soulPower - 2, 1); return '营救过程中受伤，魂力-2级'; } } },
        { text: `你和${spouse.name}感情平淡但温馨，携手走过这一年。`, effect: () => { return '平淡而幸福的一年。'; } }
      ];
  }

  let o = outcomes[Math.floor(Math.random() * outcomes.length)];
  let result = o.effect();
  return { type: 'social', text: `<b style="color:#ff88aa;">【伴侣】</b> ${o.text}<br><span style="color:var(--gold)">【${result}】</span>` };
}

function processJusticeEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  let scenarios = [];

  switch (timelineId) {
    case 'douluo1':
      scenarios = [
        { text: '路见不平，你看到一位老人被武魂殿的魂师欺负，挺身而出！', winChance: 0.8, reward: { rep: 5, sp: 1 } },
        { text: '你发现一群邪魂师在屠戮村庄，义无反顾地出手相助！', winChance: 0.6, reward: { rep: 10, sp: 2 } },
        { text: '一位少女被魂兽追杀，你拔刀相助！', winChance: 0.7, reward: { rep: 8, sp: 1 } },
        { text: '你撞见武魂殿的人在欺压平民，仗义执言！', winChance: 0.5, reward: { rep: 15, sp: 2 } },
        { text: '一伙强盗劫掠商队，你出手相救！', winChance: 0.9, reward: { rep: 3, sp: 1 } }
      ];
      break;
    case 'douluo2':
      scenarios = [
        { text: '你看到一位平民被日月帝国的魂导师欺压，挺身而出！', winChance: 0.8, reward: { rep: 5, sp: 1 } },
        { text: '你发现一群邪魂师在袭击村庄，义无反顾地出手相助！', winChance: 0.6, reward: { rep: 10, sp: 2 } },
        { text: '一位少女被魂兽追杀，你拔刀相助！', winChance: 0.7, reward: { rep: 8, sp: 1 } },
        { text: '你撞见圣灵教的人在抓捕平民进行邪恶实验，仗义执言！', winChance: 0.5, reward: { rep: 15, sp: 2 } },
        { text: '一伙强盗劫掠商队，你出手相救！', winChance: 0.9, reward: { rep: 3, sp: 1 } }
      ];
      break;
    case 'douluo3':
      scenarios = [
        { text: '你看到一位平民被传灵塔的执事欺压，挺身而出！', winChance: 0.8, reward: { rep: 5, sp: 1 } },
        { text: '你发现一群邪魂师在屠戮村庄，义无反顾地出手相助！', winChance: 0.6, reward: { rep: 10, sp: 2 } },
        { text: '一位少女被魂兽追杀，你拔刀相助！', winChance: 0.7, reward: { rep: 8, sp: 1 } },
        { text: '你撞见圣灵教的人在抓捕平民进行邪恶实验，仗义执言！', winChance: 0.5, reward: { rep: 15, sp: 2 } },
        { text: '一伙强盗劫掠商队，你出手相救！', winChance: 0.9, reward: { rep: 3, sp: 1 } }
      ];
      break;
    case 'douluo4':
      scenarios = [
        { text: '你看到一位平民被星际海盗欺压，挺身而出！', winChance: 0.8, reward: { rep: 5, sp: 1 } },
        { text: '你发现一群深红之域的生物在袭击殖民地，义无反顾地出手相助！', winChance: 0.6, reward: { rep: 10, sp: 2 } },
        { text: '一位少女被外星魂兽追杀，你拔刀相助！', winChance: 0.7, reward: { rep: 8, sp: 1 } },
        { text: '你撞见天龙星的龙族在欺压人类移民，仗义执言！', winChance: 0.5, reward: { rep: 15, sp: 2 } },
        { text: '一伙星际强盗劫掠商船，你出手相救！', winChance: 0.9, reward: { rep: 3, sp: 1 } }
      ];
      break;
    case 'godrealm':
      scenarios = [
        { text: '你看到一位神官被神兽欺负，挺身而出！', winChance: 0.8, reward: { rep: 5, sp: 1 } },
        { text: '你发现一群叛逆神兽在破坏神界秩序，义无反顾地出手相助！', winChance: 0.6, reward: { rep: 10, sp: 2 } },
        { text: '一位神官被流放神兽追杀，你拔刀相助！', winChance: 0.7, reward: { rep: 8, sp: 1 } },
        { text: '你撞见毁灭之神的部下在欺压弱小神祇，仗义执言！', winChance: 0.5, reward: { rep: 15, sp: 2 } },
        { text: '一伙神界流民劫掠集市，你出手相救！', winChance: 0.9, reward: { rep: 3, sp: 1 } }
      ];
      break;
    default:
      scenarios = [
        { text: '路见不平，你看到一位老人被魂师欺负，挺身而出！', winChance: 0.8, reward: { rep: 5, sp: 1 } },
        { text: '你发现一群邪魂师在屠戮村庄，义无反顾地出手相助！', winChance: 0.6, reward: { rep: 10, sp: 2 } },
        { text: '一位少女被魂兽追杀，你拔刀相助！', winChance: 0.7, reward: { rep: 8, sp: 1 } },
        { text: '你撞见邪恶势力在欺压平民，仗义执言！', winChance: 0.5, reward: { rep: 15, sp: 2 } },
        { text: '一伙强盗劫掠商队，你出手相救！', winChance: 0.9, reward: { rep: 3, sp: 1 } }
      ];
  }

  let s = scenarios[Math.floor(Math.random() * scenarios.length)];
  let win = Math.random() < s.winChance;
  if (win) {
    G.soulPower = Math.min(G.soulPower + s.reward.sp, G.maxLevel);
    G.merit = (G.merit || 0) + s.reward.rep;
    return { type: 'fortune', text: `<b style="color:var(--cyan);">【路见不平】</b> ${s.text}<br><span style="color:var(--gold)">【你成功救下了对方！名声+${s.reward.rep} 魂力+${s.reward.sp}级】</span>` };
  } else {
    G.soulPower = Math.max(G.soulPower - 1, 1);
    return { type: 'crisis', text: `<b style="color:var(--red);">【路见不平】</b> ${s.text}<br><span style="color:var(--red)">【你实力不足，未能阻止恶行，反而受了伤。魂力-1级】</span>` };
  }
}

function processAuctionEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  let items = [];

  switch (timelineId) {
    case 'douluo1':
      items = [
        { name: '千年魂骨碎片', cost: 50, effect: () => { G.gold -= 50; G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '吸收了碎片中的魂力，魂力+1级'; } },
        { name: '稀有药草·龙血参', cost: 80, effect: () => { G.gold -= 80; G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '服用后魂力暴涨，魂力+2级'; } },
        { name: '上古暗器图谱残卷', cost: 60, effect: () => { G.gold -= 60; G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '领悟了上古暗器的皮毛，魂力+1级'; } },
        { name: '上古武魂秘典', cost: 100, effect: () => { G.gold -= 100; G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '领悟了上古修炼法门，魂力+3级'; } },
        { name: '仙品药草·绮罗郁金香', cost: 50, effect: () => { G.gold -= 50; if (G.appearance) { G.appearance = { ...G.appearance, attr: { ...G.appearance.attr, charm: (G.appearance.attr?.charm || 5) + 1 } }; } return '服用后容貌提升，魅力+1'; } }
      ];
      break;
    case 'douluo2':
      items = [
        { name: '千年魂骨碎片', cost: 50, effect: () => { G.gold -= 50; G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '吸收了碎片中的魂力，魂力+1级'; } },
        { name: '稀有药草·龙血参', cost: 80, effect: () => { G.gold -= 80; G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '服用后魂力暴涨，魂力+2级'; } },
        { name: '日月帝国魂导器图纸', cost: 60, effect: () => { G.gold -= 60; G.battleArmor = Math.max(G.battleArmor, 1); return '掌握了魂导器制作技术'; } },
        { name: '上古武魂秘典', cost: 100, effect: () => { G.gold -= 100; G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '领悟了上古修炼法门，魂力+3级'; } },
        { name: '魂导美容仪', cost: 50, effect: () => { G.gold -= 50; if (G.appearance) { G.appearance = { ...G.appearance, attr: { ...G.appearance.attr, charm: (G.appearance.attr?.charm || 5) + 1 } }; } return '使用后容貌提升，魅力+1'; } }
      ];
      break;
    case 'douluo3':
      items = [
        { name: '千年魂骨碎片', cost: 50, effect: () => { G.gold -= 50; G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '吸收了碎片中的魂力，魂力+1级'; } },
        { name: '有灵合金配方', cost: 80, effect: () => { G.gold -= 80; G.battleArmor = Math.max(G.battleArmor, 2); return '掌握了有灵合金技术'; } },
        { name: '一字斗铠设计图', cost: 60, effect: () => { G.gold -= 60; G.battleArmor = Math.max(G.battleArmor, 1); return '获得了一字斗铠设计图'; } },
        { name: '上古武魂秘典', cost: 100, effect: () => { G.gold -= 100; G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '领悟了上古修炼法门，魂力+3级'; } },
        { name: '传灵塔美容魂导器', cost: 50, effect: () => { G.gold -= 50; if (G.appearance) { G.appearance = { ...G.appearance, attr: { ...G.appearance.attr, charm: (G.appearance.attr?.charm || 5) + 1 } }; } return '使用后容貌提升，魅力+1'; } }
      ];
      break;
    case 'douluo4':
      items = [
        { name: '千年魂骨碎片', cost: 50, effect: () => { G.gold -= 50; G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '吸收了碎片中的魂力，魂力+1级'; } },
        { name: '龙力结晶', cost: 80, effect: () => { G.gold -= 80; G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '吸收龙力后魂力暴涨，魂力+2级'; } },
        { name: '星际魂导器核心', cost: 60, effect: () => { G.gold -= 60; G.battleArmor = Math.max(G.battleArmor, 2); return '获得了星际魂导器技术'; } },
        { name: '上古武魂秘典', cost: 100, effect: () => { G.gold -= 100; G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '领悟了上古修炼法门，魂力+3级'; } },
        { name: '天龙星养颜秘方', cost: 50, effect: () => { G.gold -= 50; if (G.appearance) { G.appearance = { ...G.appearance, attr: { ...G.appearance.attr, charm: (G.appearance.attr?.charm || 5) + 1 } }; } return '使用后容貌提升，魅力+1'; } }
      ];
      break;
    case 'godrealm':
      items = [
        { name: '神骨碎片', cost: 50, effect: () => { G.gold -= 50; G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '吸收了神骨碎片中的神力，魂力+1级'; } },
        { name: '神赐药草', cost: 80, effect: () => { G.gold -= 80; G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '服用后神力暴涨，魂力+2级'; } },
        { name: '神器残片', cost: 60, effect: () => { G.gold -= 60; G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '领悟了神器中的法则，魂力+1级'; } },
        { name: '神界秘典', cost: 100, effect: () => { G.gold -= 100; G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '领悟了神界法则，魂力+3级'; } },
        { name: '生命精华', cost: 50, effect: () => { G.gold -= 50; if (G.appearance) { G.appearance = { ...G.appearance, attr: { ...G.appearance.attr, charm: (G.appearance.attr?.charm || 5) + 1 } }; } return '使用后容貌提升，魅力+1'; } }
      ];
      break;
    default:
      items = [
        { name: '千年魂骨碎片', cost: 50, effect: () => { G.gold -= 50; G.soulPower = Math.min(G.soulPower + 1, G.maxLevel); return '吸收了碎片中的魂力，魂力+1级'; } },
        { name: '稀有药草·龙血参', cost: 80, effect: () => { G.gold -= 80; G.soulPower = Math.min(G.soulPower + 2, G.maxLevel); return '服用后魂力暴涨，魂力+2级'; } },
        { name: '魂导器图纸', cost: 60, effect: () => { G.gold -= 60; G.battleArmor = Math.max(G.battleArmor, 1); return '掌握了魂导器制作技术'; } },
        { name: '上古武魂秘典', cost: 100, effect: () => { G.gold -= 100; G.soulPower = Math.min(G.soulPower + 3, G.maxLevel); return '领悟了上古修炼法门，魂力+3级'; } },
        { name: '美容养颜丹', cost: 50, effect: () => { G.gold -= 50; if (G.appearance) { G.appearance = { ...G.appearance, attr: { ...G.appearance.attr, charm: (G.appearance.attr?.charm || 5) + 1 } }; } return '服用后容貌提升，魅力+1'; } }
      ];
  }

  let item = items[Math.floor(Math.random() * items.length)];
  if ((G.gold || 0) >= item.cost) {
    let result = item.effect();
    return { type: 'fortune', text: `<b style="color:var(--gold);">【拍卖会】</b> 你在拍卖会上以${item.cost}金魂币拍得<b>${item.name}</b>！<br><span style="color:var(--gold)">【${result}】</span>` };
  } else {
    return { type: 'fortune', text: `<b style="color:var(--gold);">【拍卖会】</b> 你看中了一件宝贝，但囊中羞涩...<br><span style="color:var(--gray)">【下次再来吧】</span>` };
  }
}

function processFortuneEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  let types = ['sp', 'gold', 'appearance', 'bone'];
  let type = types[Math.floor(Math.random() * types.length)];

  // 按时间线定义贴合原著的机遇文本池（人类视角）
  let texts = {
    douluo1: {
      sp: ['你在一处隐秘山谷发现了一株万年灵芝，服用后魂力大涨！', '你在猎魂森林深处发现了一处前人遗留的洞府，获得了一本上古修炼笔记。', '一位游历的魂师看你资质不错，赠送了你一枚珍贵的魂骨碎片。', '你在索托城偶遇一位神秘的封号斗罗，他随手指点了几句就让你茅塞顿开。', '你参加了一场地下拍卖会，意外以低价拍下了一株龙血参。'],
      gold: ['你意外发现了一处被魂兽守护的宝藏！', '你帮助了一位商人，他赠予你大量金魂币作为谢礼。', '你在斗魂场下注赢了，获得了丰厚的回报。', '你在瀑布下修炼时发现水底有一道暗门，里面藏着前辈魂师留下的金币。'],
      appearance: ['你服用了某种神奇的天材地宝，容貌发生了变化...', '你修炼了一种养颜功法，气质越发出众。', '你在冰火两仪眼附近采摘到一株仙品药草，不仅提升了修为，容貌也变得更加出众。'],
      bone: ['你在秘境探险中意外发现了一块魂骨！', '你猎杀了一只罕见魂兽，它竟然产出了一块魂骨！', '你在星斗大森林核心区边缘捡到了一块前人遗留的魂骨！']
    },
    douluo2: {
      sp: ['你在海神湖畔捡到一块奇特的魂导核心，里面蕴含着远古魂导技术！', '你的精神探测意外触碰到黄金树的意识，获得了短暂的精神力洗礼。', '你在日月帝国的边境发现了一处魂导师遗迹，获得了一本失传的修炼手册。', '你遇到了一只濒死的天梦冰蚕（幼体），它自愿将部分精神力赠与你。'],
      gold: ['你制作了一件魂导器并出售，赚了不少钱。', '你在日月帝国的边境贸易中获利颇丰。', '你发现了一批日月帝国流出的稀有金属，卖了个好价钱。'],
      appearance: ['你使用了一款新型魂导美容仪，效果显著。', '你修炼了唐门的玄天功，气质越发超凡脱俗。', '海神湖畔的灵气洗涤了你的肌肤，魅力提升。'],
      bone: ['你在监察团任务中发现了一块魂骨！', '你在海神阁的藏宝库中获得了一块传承魂骨！', '你剿灭邪魂师据点时，意外发现了一块被掠夺的魂骨！']
    },
    douluo3: {
      sp: ['你在升灵台中意外触发了一个隐藏区域，魂灵获得了额外的成长能量！', '你锻造时意外进入了一种奇妙的境界，魂力随之突破。', '你在龙谷秘境的边缘捡到了一块龙骨碎片，龙族气息让你血脉沸腾。', '你的魂灵在传灵塔的特殊培育舱中发生了良性变异。'],
      gold: ['你锻造的一件合金作品被高价买走。', '你在传灵塔的悬赏任务中获得了丰厚奖励。', '你发现了一种新型稀有金属矿脉，联邦给予了奖励。'],
      appearance: ['你使用了传灵塔最新研发的美容魂导器。', '你的武魂二次觉醒，连带容貌也变得更加出众。', '你在生命古树的树荫下修炼，生命能量让你的气质更加出众。'],
      bone: ['你在古战场遗址中发现了一块上古魂骨！', '你击杀了一只深渊生物，它掉落了一块奇特的魂骨！', '你在龙谷秘境中找到了一块龙骨化成的魂骨！']
    },
    douluo4: {
      sp: ['你在天龙星的龙族祭坛附近修炼，意外吸收了一丝纯净的龙力！', '你在深红之域的边缘发现了一种奇异的能量晶体，对修炼大有裨益。', '你探索龙界遗迹时，龙神的气息灌入体内，修为大增。', '你在精灵星的生命古树下冥想，感受到了宇宙本源的生命能量。'],
      gold: ['你发现了一颗富含稀有金属的小行星，获得了联邦的奖励。', '你参加星际魂师大赛获得了高额奖金。', '你帮龙马星系的商人解决了一个难题，获得了丰厚报酬。'],
      appearance: ['你吸收了精灵星的生命能量，容貌变得更加完美。', '你的龙神血脉觉醒了一丝，连带外貌也发生了变化。', '你使用了天龙星龙族特有的养颜秘方，效果惊人。'],
      bone: ['你在龙界遗迹中发现了一块龙族魂骨！', '你探索未知星域时获得了一块外星生物的魂骨！', '你在深红之域击败了一只强大的深红生物，获得了一块变异魂骨！']
    },
    godrealm: {
      sp: ['你获得了一道神赐神力，修为突飞猛进！', '你在神界法则中感悟到了宇宙的奥秘。', '你吸收了一只神兽的神性精华。', '唐三路过你的修炼之地，随口指点了一句就让你豁然开朗。'],
      gold: ['你在神界集市中出售了一件多余的神器。', '你完成了一项神界任务，获得了丰厚奖励。', '你在神界天河中捡到了一块神金，价值连城。'],
      appearance: ['生命女神赐予你一滴生命精华，你的容貌变得完美无瑕。', '你在神光中洗涤肉身，气质变得超凡脱俗。', '神界的法则之力重塑了你的形体，魅力提升。'],
      bone: ['你在神界深渊中发现了一块神骨！', '你在神域秘境中获得了一块传承神骨！', '你协助神界委员会剿灭叛逆神兽，获得了一块神兽魂骨！']
    }
  };

  // 魂兽专属机遇文本池
  let beastTexts = {
    douluo1: {
      sp: ['你发现了一株散发着浓郁灵气的万年灵芝，毫不犹豫地一口吞下，修为大涨！', '你闯入了一处前人遗留的洞府，里面残留的能量被你尽数吸收。', '一只重伤的千年魂兽倒在你面前，你本能地吞噬了它的魂力。', '你在瀑布下发现了隐藏的灵泉，喝了几口后浑身舒畅。'],
      gold: ['你发现了一处被遗弃的洞穴，里面散落着人类魂师留下的金币。', '你在森林中捡到了一枚人类掉落的储物戒指，里面有一些金魂币。', '你守护了一片药田，主人感激地赠予你财宝。'],
      appearance: ['你吞噬了一颗奇异的果实，身上的毛发变得更加光亮...', '你吸收了一缕月华之力，气质变得越发威严。', '你在灵泉中泡了一晚，体型变得更加矫健威武。'],
      bone: ['你发现了一只强大魂兽的遗骸，吞噬了它残留的能量精华！', '你在洞穴深处发现了一块能量结晶，里面蕴含着浓郁的天地灵气！', '你击败了一只入侵你领地的魂兽，吞噬了它的本源之力！']
    },
    douluo2: {
      sp: ['你在海神湖畔发现了一块蕴含能量的魂导核心碎片，一口咬碎吞了下去！', '黄金树的气息让你浑身舒泰，不自觉地靠近吸收了不少能量。', '你在边境发现了一处废弃的魂导师实验室，里面残留的能量被你尽数吞噬。', '你遇到了一只濒死的天梦冰蚕（幼体），本能地吞噬了它的精神力。'],
      gold: ['你在人类城镇外围的废墟中发现了不少散落的金魂币。', '你帮一只受伤的魂兽找到回家的路，它的族群赠予你一些人类金币作为谢礼。'],
      appearance: ['你吸收了一缕海神湖畔的灵气，身上的鳞片/毛发变得更加鲜艳。', '你吞噬了一种奇异的灵果，体型更加威武霸气。'],
      bone: ['你发现了一处人类监察团的遗物，里面有一块蕴含能量的结晶！', '你在海底发现了一枚遗落的魂导器核心，吞噬后获得了额外的能量！']
    },
    douluo3: {
      sp: ['你在龙谷秘境边缘发现了一块龙骨碎片，龙族的气息让你血脉沸腾！', '你在森林深处发现了一处灵泉，畅饮之后修为大涨。', '你的血脉在月光下发生了微妙的共鸣，仿佛有远古的力量在觉醒。', '你吞噬了一只闯入你领地的深渊生物，它的能量让你实力大增。'],
      gold: ['你发现了一处人类采矿队遗弃的营地，里面有不少值钱的金属。', '你在传灵塔外围的废墟中找到了一些人类掉落的金币。'],
      appearance: ['你的生命能量得到了升华，外表变得更加威严霸气。', '你的血脉之力微微觉醒，身上的气息变得更加慑人。'],
      bone: ['你在古战场发现了一只远古魂兽的完整遗骸，吞噬后获得了巨大的能量！', '你击败了一只挑战你的深渊生物，吞噬了它的核心！']
    },
    douluo4: {
      sp: ['你在天龙星的龙族祭坛附近修炼，意外吸收了一丝纯净的龙力！', '你在深红之域的边缘发现了一种奇异的能量晶体，一口咬碎吞了下去。', '你探索龙界遗迹时，龙神的气息灌入体内，修为大增。', '你在精灵星的生命古树下冥想，感受到了宇宙本源的生命能量。'],
      gold: ['你发现了一颗小行星上人类遗落的物资，里面有不少值钱的东西。', '你在星际港口附近捡到了一些人类掉落的货币。'],
      appearance: ['你吸收了精灵星的生命能量，外表变得更加完美威严。', '你的龙神血脉觉醒了一丝，体型变得更加庞大威武。'],
      bone: ['你在龙界遗迹中发现了一只远古龙族的遗骸，吞噬后获得了龙族传承之力！', '你在深红之域击败了一只强大的深红生物，吞噬了它的能量核心！']
    },
    godrealm: {
      sp: ['你获得了一道神赐神力，修为突飞猛进！', '你在神界法则中感悟到了宇宙的奥秘。', '你吞噬了一只叛逆神兽的神性精华。', '生命女神路过你的修炼之地，随手洒下了一滴生命甘露。'],
      gold: ['你在神界森林中发现了前人遗留的神金。', '你完成了一项神界任务，获得了丰厚奖励。', '你在神界天河中捡到了一块蕴含神力的结晶。'],
      appearance: ['生命女神赐予你一滴生命精华，你的外表变得完美无瑕。', '你在神光中洗涤肉身，气质变得超凡脱俗。', '神界的法则之力重塑了你的形体，魅力提升。'],
      bone: ['你在神界深渊中发现了一只陨落神兽的遗骸，吞噬后获得了神性精华！', '你协助神界委员会剿灭叛逆神兽，吞噬了它的神性本源！']
    }
  };

  let textPool = G.identityType === 'soul_beast' ? (beastTexts[timelineId] || beastTexts.douluo1) : (texts[timelineId] || texts.douluo1);
  let t = textPool[type];
  // 魂兽没有appearance时fallback到sp文本
  if (G.identityType === 'soul_beast' && type === 'appearance' && !G.appearance) {
    t = textPool['sp'];
  }
  let text = t[Math.floor(Math.random() * t.length)];

  switch (type) {
    case 'sp':
      let gain = 1 + Math.floor(Math.random() * 3);
      G.soulPower = Math.min(G.soulPower + gain, G.maxLevel);
      let yearText = '';
      if (G.identityType === 'soul_beast') {
        let gained = 100 + Math.floor(Math.random() * 401);
        yearText = addBeastYears(gained);
      }
      return { type: 'fortune', text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【魂力+${gain}级${yearText}】</span>` };
    case 'gold':
      let goldGain = 20 + Math.floor(Math.random() * 80);
      G.gold = (G.gold || 0) + goldGain;
      return { type: 'fortune', text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【获得${goldGain}金魂币】</span>` };
    case 'appearance':
      if (G.appearance) {
        G.appearance = { ...G.appearance, attr: { ...G.appearance.attr, charm: (G.appearance.attr?.charm || 5) + 1 } };
        return { type: 'fortune', text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【魅力+1】</span>` };
      }
      G.soulPower = Math.min(G.soulPower + 1, G.maxLevel);
      return { type: 'fortune', text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【魂力+1级】</span>` };
    case 'bone':
      let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
      let bt = boneTypes[Math.floor(Math.random() * boneTypes.length)];
      if (!G.soulBones.includes(bt)) {
        G.soulBones.push(bt);
        let yearText2 = '';
        if (G.identityType === 'soul_beast') {
          let gained = 200 + Math.floor(Math.random() * 301);
          yearText2 = addBeastYears(gained);
        }
        return { type: 'fortune', text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【获得${bt}！${yearText2}】</span>` };
      }
      G.gold = (G.gold || 0) + 100;
      return { type: 'fortune', text: `<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【已有同类魂骨，出售获得100金魂币】</span>` };
  }
}

function processSchoolEvent() {
  if (G.identityType === 'soul_beast') {
    return processNormalEvent();
  }
  let timelineId = G.timeline?.id || 'douluo1';
  let school = SCHOOL_EVENTS[timelineId];
  if (!school) school = SCHOOL_EVENTS.douluo1;
  let event = school.events[Math.floor(Math.random() * school.events.length)];
  let effectText = event.effect(G);
  return { type: 'cultivate', text: `<b style="color:var(--cyan);">【${school.name}】</b> ${event.text}<br><span style="color:var(--gold)">【${effectText}】</span>` };
}

function processNormalEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  let events = [];

  // Soul beast exclusive training events
  if (G.identityType === 'soul_beast') {
    // 计算血脉与降生地的契合度加成
    let bloodId = G.bloodline?.id || 'fire';
    let birthId = G.birthplace?.id || '';
    let synergy = 1.0;
    let synergyText = '';
    // 血脉与降生地契合加成
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
      synergy = 1.5;
      synergyText = '（血脉与降生地契合，修炼效率+50%）';
    }
    switch (timelineId) {
      case 'douluo1':
        events = [
          { text: '你在星斗大森林深处吸收月华之力，修为稳步增长。', sp: 1, years: 25 },
          { text: '你发现了一处灵泉，畅饮之后浑身舒畅，本源之力有所增强。', sp: 1, years: 35 },
          { text: '你与同族切磋斗技，在战斗中磨练了本能。', sp: 2, years: 20 },
          { text: '你吞噬了一只入侵领地的小型魂兽，获得了额外的能量。', sp: 1, years: 45 },
          { text: '你在瀑布下淬炼肉身，皮毛/鳞甲变得更加坚韧。', sp: 1, years: 25 },
          { text: '你感应到了森林深处某位十万年魂兽的气息，受到启发。', sp: 2, years: 20 },
          { text: '你在冰火两仪眼附近修炼，极致能量让你的血脉更加纯粹。', sp: 2, years: 40 },
          { text: '平静的一年，你安心修炼，无惊无险。', sp: 1, years: 18 }
        ];
        break;
      case 'douluo2':
        events = [
          { text: '你在森林中吸收天地灵气，黄金树的气息让修炼事半功倍。', sp: 1, years: 25 },
          { text: '你发现了一片被人类遗弃的药田，吞食了几株灵草。', sp: 1, years: 35 },
          { text: '你与其他魂兽争夺领地，胜利后吞噬了对方的残余能量。', sp: 2, years: 30 },
          { text: '你避开了人类监察团的巡逻，在隐秘山谷中安心修炼。', sp: 1, years: 18 },
          { text: '你在冰原上修炼，极寒环境淬炼了你的意志。', sp: 1, years: 25 },
          { text: '你吞噬了一只邪魂师留下的邪恶魂兽，获得了诡异的能量。', sp: 2, years: 35 },
          { text: '你感受到日月帝国魂导器的能量波动，从中汲取了一丝变异之力。', sp: 2, years: 30 }
        ];
        break;
      case 'douluo3':
        events = [
          { text: '你在龙谷秘境边缘感应到龙族气息，血脉微微沸腾。', sp: 1, years: 25 },
          { text: '你发现了一处地下灵脉，汲取其中的能量修炼。', sp: 2, years: 35 },
          { text: '你击败了一只挑战你的深渊生物，吞噬了它的核心。', sp: 2, years: 45 },
          { text: '你在传灵塔外围的森林中躲避人类的目光，默默修炼。', sp: 1, years: 18 },
          { text: '你吞噬了一只重伤的同类，虽然残忍但弱肉强食是法则。', sp: 1, years: 35 },
          { text: '你在斗铠碎片遗迹中感悟远古力量，修为精进。', sp: 2, years: 40 },
          { text: '平静的一年，你在隐秘洞穴中沉睡修炼。', sp: 1, years: 25 }
        ];
        break;
      case 'douluo4':
        events = [
          { text: '你在天龙星的原始森林中吸收龙力，修为有所提升。', sp: 1, years: 25 },
          { text: '你发现了一颗蕴含能量的陨石碎片，吞噬后获得了异域能量。', sp: 2, years: 45 },
          { text: '你躲避星际猎魂师的追捕，在荒星上艰难求生。', sp: 1, years: 18 },
          { text: '你在深红之域边缘吸收了一丝奇异能量，修为大涨。', sp: 2, years: 35 },
          { text: '你在精灵星的生命古树下修炼，感受到了宇宙本源之力。', sp: 2, years: 35 },
          { text: '你在龙马星系吸收异星法则，血脉产生微妙变化。', sp: 2, years: 40 },
          { text: '平静的一年，你在洞穴中沉睡，吸收天地精华。', sp: 1, years: 25 }
        ];
        break;
      case 'godrealm':
        events = [
          { text: '你在神界森林中吸收神性精华，本源之力变得更加纯粹。', sp: 2, years: 50 },
          { text: '你吞噬了一只叛逆神兽的神性本源，修为大增。', sp: 2, years: 60 },
          { text: '你在神界天河中洗涤肉身，去除了体内的杂质。', sp: 1, years: 40 },
          { text: '你观摩了神界法则的运转，对天地大道有了新的感悟。', sp: 2, years: 50 },
          { text: '你在神兽领域边缘感悟神兽本源，血脉之力沸腾。', sp: 2, years: 55 },
          { text: '平静的一年，你在神界隐秘角落中安心修炼。', sp: 1, years: 35 }
        ];
        break;
      default:
        events = [
          { text: '你闭关苦修，感悟天地之力。', sp: 1, years: 18 },
          { text: '你在森林中吸收日月精华，修为稳步增长。', sp: 1, years: 25 },
          { text: '平静的一年，你安心修炼，无惊无险。', sp: 1, years: 18 }
        ];
    }
    let e = events[Math.floor(Math.random() * events.length)];
    // 应用血脉与降生地契合度加成
    let finalYears = Math.floor((e.years || 10) * synergy);
    let yearText = addBeastYears(finalYears);
    let spGain = e.sp || 1;
    if (synergy > 1) spGain = Math.max(spGain, 2);
    G.soulPower = Math.min((G.soulPower || 0) + spGain, G.maxLevel);
    return { type: 'cultivate', text: `<b style="color:var(--green);">【修炼】</b> ${e.text}<br><span style="color:var(--gold)">【年限+${finalYears}年${yearText}${synergyText}】</span>` };
  }

  // 神兽专属修炼事件（神界传说）
  if (G.identityType === 'divine_beast') {
    let divineEvents = [
      { text: '你在神界天河中沐浴，神性精华浸润全身，神力大增。', sp: 2 },
      { text: '你观摩神界法则流转，对天地大道有了新的感悟。', sp: 2 },
      { text: '你在神兽领域与其他神兽切磋，磨练了本能。', sp: 1 },
      { text: '你吞噬了一缕散落的神性本源，神力更加凝实。', sp: 2 },
      { text: '你在神界古树下修炼，吸收远古神力。', sp: 1 },
      { text: '你感悟了血脉深处的远古记忆，神力觉醒。', sp: 2 },
      { text: '你在神界灵山之巅吐纳，云雾化作神力涌入体内。', sp: 1 },
      { text: '平静的一年，你在神界隐秘之地安心修炼。', sp: 1 }
    ];
    let de = divineEvents[Math.floor(Math.random() * divineEvents.length)];
    G.soulPower = Math.min((G.soulPower || 0) + de.sp, G.maxLevel);
    return { type: 'cultivate', text: `<b style="color:var(--gold);">【神兽修炼】</b> ${de.text}<br><span style="color:var(--gold)">【神力+${de.sp}级】</span>` };
  }

  // 神祇专属修炼事件（神界传说）
  if (G.identityType === 'god') {
    let godEvents = [
      { text: '你在神殿中冥想，神格更加凝实，神力提升。', sp: 2 },
      { text: '你观摩神界委员会的法则会议，对神道有了新的领悟。', sp: 2 },
      { text: '你巡视所掌管的领域，神力在职责中精进。', sp: 1 },
      { text: '你与其他神祇论道，交流修炼心得。', sp: 1 },
      { text: '你感悟了远古神祇遗留的修炼印记，神力大涨。', sp: 2 },
      { text: '你在神界天河畔修炼，天河之力助你凝练神格。', sp: 1 },
      { text: '你参悟了一件远古神器的使用之法，神力有所提升。', sp: 2 },
      { text: '平静的一年，你在神殿中安心修炼。', sp: 1 }
    ];
    let ge = godEvents[Math.floor(Math.random() * godEvents.length)];
    G.soulPower = Math.min((G.soulPower || 0) + ge.sp, G.maxLevel);
    return { type: 'cultivate', text: `<b style="color:var(--gold);">【神祇修炼】</b> ${ge.text}<br><span style="color:var(--gold)">【神力+${ge.sp}级】</span>` };
  }

  // Human training events
  switch (timelineId) {
    case 'douluo1':
      events = [
        { text: '你在瀑布下苦修，如当年唐三修炼玄天功一般，肉体与精神同步提升。', sp: 2 },
        { text: '你进入猎魂森林历练，与低阶魂兽交手，实战经验大增。', sp: 1 },
        { text: '你在宗门藏经阁读到上古暗器图谱，虽不能制作但开阔了眼界。', sp: 1 },
        { text: '你参加了一场魂师友谊赛，在切磋中发现了自己武魂的新用法。', sp: 2 },
        { text: '你跟随师长前往星斗大森林外围，远远感受到了十万年魂兽的恐怖气息。', sp: 1 },
        { text: '你在索托城的大斗魂场观战，被魂师们的热血战斗所感染。', sp: 1 }
      ];
      break;
    case 'douluo2':
      events = [
        { text: '你在海神湖畔冥想，黄金树的力量潜移默化地滋养着你的武魂。', sp: 1 },
        { text: '你研究了一件一级魂导器的构造，对魂导科技的理解更深了一层。', sp: 1 },
        { text: '你尝试用精神探测感知周围环境，精神力如同霍雨浩那般缓慢增长。', sp: 2 },
        { text: '你在史莱克学院的训练场上挥洒汗水，外院弟子的日常就是如此充实。', sp: 1 },
        { text: '你阅读了唐门暗器与魂导器结合的论文，对两个时代的融合有了新的认识。', sp: 1 },
        { text: '你参与了一场模拟魂导对抗赛，体验了日月帝国魂导师的战斗方式。', sp: 2 }
      ];
      break;
    case 'douluo3':
      events = [
        { text: '你在锻造台上挥汗如雨，千锻一品的目标让你不断突破自我。', sp: 1 },
        { text: '你在升灵台中进行虚拟实战，魂灵在战斗中成长，你的操作也更加娴熟。', sp: 2 },
        { text: '你研究了一块有灵合金的配方，斗铠制作的道路漫长但充满诱惑。', sp: 1 },
        { text: '你在史莱克学院的图书馆查阅万年前的史料，对比今昔感慨万千。', sp: 1 },
        { text: '你尝试将血脉之力与魂技融合，如同唐舞麟那般寻找属于自己的战斗方式。', sp: 2 },
        { text: '你在传灵塔参观魂灵培育中心，看到濒临灭绝的魂兽被悉心照料。', sp: 1 }
      ];
      break;
    case 'douluo4':
      events = [
        { text: '你在精灵星的原始森林中冥想，外星球的能量与斗罗星截然不同。', sp: 1 },
        { text: '你驾驶小型宇宙飞船进行了一次短途航行，星际时代的魂师需要掌握的技能真多。', sp: 1 },
        { text: '你在天龙星的龙族遗迹中修炼，龙神血脉的气息让你修炼速度有所提升。', sp: 2 },
        { text: '你参加了一场星际魂师对抗赛，见识了来自不同星球的魂师强者。', sp: 1 },
        { text: '你学习了古武与魂技结合的新流派，娜娜老师的理论让你受益匪浅。', sp: 2 },
        { text: '你在龙源星猎杀了一只小型龙族生物，获取了珍贵的龙力结晶。', sp: 1 }
      ];
      break;
    case 'godrealm':
      events = [
        { text: '你在神界法则之下修炼，神力与魂力截然不同，需要重新适应。', sp: 2 },
        { text: '你观摩了神界中枢的运转，对宇宙法则有了更深层次的感悟。', sp: 2 },
        { text: '你在神界森林中狩猎神兽，这里的"魂兽"都散发着神性的光辉。', sp: 1 },
        { text: '你参加了一场神祇之间的论道，虽然只是旁听但收获颇丰。', sp: 1 },
        { text: '你在神界天河中洗涤肉身，神力的杂质被一一清除。', sp: 2 },
        { text: '你尝试凝聚神位，虽然失败但为未来的突破积累了经验。', sp: 1 }
      ];
      break;
    default:
      events = [
        { text: '你闭关苦修，感悟天地之力。', sp: 1 },
        { text: '你在宗门藏经阁阅读典籍，有所感悟。', sp: 1 },
        { text: '平静的一年，你安心修炼，无惊无险。', sp: 1 }
      ];
  }
  let e = events[Math.floor(Math.random() * events.length)];
  G.soulPower = Math.min(G.soulPower + e.sp, G.maxLevel);
  return { type: 'cultivate', text: `<b style="color:var(--green);">【修炼】</b> ${e.text}<br><span style="color:var(--gold)">【魂力+${e.sp}级】</span>` };
}

function nextYear() {
  if (!G.alive || G._processing) return;
  let yearsToAdvance = getYearStep();
  G._processing = true;
  let eventsThisRound = [];
  processYearChain(0, yearsToAdvance, eventsThisRound);
}

function processYearChain(idx, total, events) {
  if (idx >= total || !G.alive) {
    finishYearAdvance(events);
    return;
  }
  G.age++;
  // Death check
  let maxAge = G.maxAge;
  if (G.soulPower >= 91) maxAge += 100;
  if (G.soulPower >= 99) maxAge += 200;
  if (G.soulPower >= 120) maxAge += 500;
  if (G.age > maxAge) {
    G.alive = false; G.deathReason = '寿终正寝';
    finishYearAdvance(events);
    return;
  }
  // Innate 0 special
  if (G.innatePower === 0 && G.age === 12 && Math.random() < 0.1) {
    G.innatePower = 3; G.innateRating = '普通'; G.innateRatingColor = '#aaa';
    events.push({ age: G.age, type: 'fortune', text: '<b style="color:var(--gold);">【觉醒】</b> 在一次意外中，你突然感受到了魂力的存在！后天觉醒成功，先天魂力3级！' });
    processYearChain(idx + 1, total, events);
    return;
  }
  // Soul ring milestone check（神和神兽没有魂环系统）
  if (G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast' && G.soulRings.length < 9) {
    let nextRingLevel = RING_MILESTONES[G.soulRings.length];
    if (G.soulPower >= nextRingLevel) {
      events.push({ age: G.age, type: 'fortune', text: `<b style="color:var(--gold);">【突破】</b> 魂力达到${G.soulPower}级，突破瓶颈！需要猎杀第${G.soulRings.length + 1}魂环...`, ringMilestone: true });
      finishYearAdvance(events, true);
      return;
    }
  }
  // Soul core formation check (绝世唐门特有魂核系统)
  if (G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast' && G.martialSoul) {
    let soulCoreEvent = checkSoulCoreFormation();
    if (soulCoreEvent) {
      events.push({ age: G.age, type: 'fortune', text: soulCoreEvent.text });
      G.soulCore++;
      if (soulCoreEvent.core) {
        if (!Array.isArray(G.soulCores)) G.soulCores = [];
        G.soulCores.push(soulCoreEvent.core);
      }
      if (soulCoreEvent.sp) {
        G.soulPower = Math.min(G.soulPower + soulCoreEvent.sp, G.maxLevel);
      }
      renderSidebar(); checkAchievements();
      if (!G.alive) { finishYearAdvance(events); return; }
    }
  }
  // 神力技能解锁（神和神兽专属）
  if ((G.identityType === 'god' || G.identityType === 'divine_beast') && G.divineSkillsTotal) {
    G.divineSkillsUnlocked = G.divineSkillsUnlocked || 0;
    G.divineSkills = G.divineSkills || [];
    let unlockThresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
    let targetUnlocked = 0;
    for (let lv of unlockThresholds) {
      if (G.soulPower >= lv) targetUnlocked++;
      else break;
    }
    targetUnlocked = Math.min(targetUnlocked, G.divineSkillsTotal);
    if (targetUnlocked > G.divineSkillsUnlocked) {
      let newlyUnlocked = targetUnlocked - G.divineSkillsUnlocked;
      let divineSkillPool = [
        { name: '神光斩', desc: '凝聚神力化作的锋锐光斩，可斩裂虚空' },
        { name: '神域降临', desc: '展开神域，领域内自身战力倍增' },
        { name: '法则掌控', desc: '掌控一种天地法则，随心所欲' },
        { name: '神罚天降', desc: '召唤天罚之力，毁灭性打击' },
        { name: '神体蜕变', desc: '神体进一步蜕变，防御与速度倍增' },
        { name: '神识探查', desc: '神识扫过万里，洞察一切隐匿' },
        { name: '神威压制', desc: '释放神威，弱者直接臣服' },
        { name: '神力灌注', desc: '神力灌注全身，战力暴涨' },
        { name: '神格凝聚', desc: '神格更加凝实，神力上限提升' },
        { name: '神通觉醒', desc: '觉醒一项远古神通，威力无穷' },
        { name: '神界召唤', desc: '召唤神界之力助战' },
        { name: '神之审判', desc: '以神之名审判罪人，无可抵挡' },
        { name: '神之庇护', desc: '获得神之庇护，免疫一次致命伤害' },
        { name: '神之契约', desc: '可与生灵缔结神之契约' },
        { name: '神之创造', desc: '掌握创造之力，可化虚为实' },
        { name: '神之毁灭', desc: '掌握毁灭之力，可湮灭万物' },
        { name: '神之时空', desc: '操控时空法则，自由穿梭' },
        { name: '神之命运', desc: '窥探命运之线，预知未来' },
        { name: '神之轮回', desc: '领悟轮回法则，生死转换' },
        { name: '神之本源', desc: '触及神之本源，近乎全能' }
      ];
      for (let i = 0; i < newlyUnlocked; i++) {
        let availableSkills = divineSkillPool.filter(s => !G.divineSkills.some(ds => ds.name === s.name));
        if (availableSkills.length === 0) break;
        let newSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        G.divineSkills.push(newSkill);
        G.divineSkillsUnlocked++;
        events.push({ age: G.age, type: 'fortune', text: `<b style="color:var(--gold);">【神力觉醒】</b> 神力突破瓶颈，觉醒新技能：<b style="color:var(--cyan);">${newSkill.name}</b>！${newSkill.desc}。(${G.divineSkillsUnlocked}/${G.divineSkillsTotal})` });
      }
      renderSidebar();
    }
  }
  // Timeline progress event check - original story events by age
  let progressEvent = getTimelineProgressEvent();
  if (progressEvent) {
    events.push({ age: G.age, type: 'fortune', text: progressEvent.text });
    if (progressEvent.sp) {
      G.soulPower = Math.min(G.soulPower + progressEvent.sp, G.maxLevel);
    }
    if (progressEvent.merit) {
      G.merit = (G.merit || 0) + progressEvent.merit;
    }
    renderSidebar(); checkAchievements();
    if (!G.alive) { finishYearAdvance(events); return; }
    processYearChain(idx + 1, total, events);
    return;
  }
  // Year event wheel
  openYearEventWheel(function (result) {
    if (result && result.event) {
      events.push({ age: G.age, ...result.event });
    }
    function continueNext() {
      // Soul evolution check
      let evoResult = checkSoulEvolution();
      if (evoResult) {
        G.martialSoul.name = evoResult.newName;
        G.martialSoul.example = evoResult.newName;
        G.martialSoul.evolutionStage = evoResult.stage;
        G.soulPower = Math.min(G.soulPower + evoResult.bonusPower, G.maxLevel);
        events.push({ age: G.age, type: 'fortune', text: `<b style="color:var(--gold);">【武魂进化】</b> ${evoResult.desc} 武魂进化为「${evoResult.newName}」！魂力+${evoResult.bonusPower}级！` });
      }
      renderSidebar(); checkAchievements();
      if (!G.alive) { finishYearAdvance(events); return; }
      // Douluo (90+) path choice check
      if (G.soulPower >= 91 && !G.chosenPath && G.identityType !== 'soul_beast') {
        events.push({ age: G.age, type: 'fortune', text: '<b style="color:var(--gold);">【封号斗罗】</b> 你的修为突破90级，成为封号斗罗！是时候选择未来的道路了...' });
        finishYearAdvance(events);
        setTimeout(() => openDouluoPathChoice(), 600);
        return;
      }
      // Godhood check (only for those who chose god path or haven't chosen yet)
      if (G.soulPower >= G.maxLevel && !G.isGod && G.identityType !== 'soul_beast' && G.chosenPath !== 'family') {
        events.push({ age: G.age, type: 'fortune', text: '<b style="color:var(--gold);">【成神之路】</b> 你的修为已达到当前位面的极限，感应到了神位的召唤...' });
        finishYearAdvance(events);
        setTimeout(() => openGodhoodChoice(), 600);
        return;
      }
      processYearChain(idx + 1, total, events);
    }
    if (result && result.subWheel === 'enemy') {
      openEnemyWheel(function () {
        renderSidebar(); checkAchievements();
        if (!G.alive) { finishYearAdvance(events); return; }
        continueNext();
      });
    } else if (result && result.subWheel === 'timeline') {
      openTimelineCharacterWheel(function () {
        renderSidebar(); checkAchievements();
        if (!G.alive) { finishYearAdvance(events); return; }
        continueNext();
      });
    } else {
      continueNext();
    }
  });
}

function openGodhoodChoice() {
  document.getElementById('godhood-panel').style.display = 'block';
  document.getElementById('godhood-result').style.display = 'none';
  document.getElementById('godhood-result').innerHTML = '';
}

function chooseGodhood(type) {
  const inheritGods = ['海神', '火神', '水神', '风神', '雷神', '战神', '速度之神', '食神'];
  let success = false;
  let resultText = '';
  let resultColor = '';

  if (type === 'inherit') {
    success = Math.random() < 0.7;
    if (success) {
      let godName = inheritGods[Math.floor(Math.random() * inheritGods.length)];
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
      let customTitles = ['毁灭与创造之神', '时空主宰', '命运编织者', '元素帝君', '灵魂至高神'];
      let godName = customTitles[Math.floor(Math.random() * customTitles.length)];
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
    let femaleChars = ['小舞', '宁荣荣', '朱竹清', '千仞雪', '唐舞桐', '古月娜', '白秀秀', '冻千秋', '生命女神', '圣灵斗罗雅莉'];
    let maleChars = ['唐三', '戴沐白', '奥斯卡', '马红俊', '唐昊', '独孤博', '比比东', '霍雨浩', '贝贝', '和菜头', '玄老', '穆老', '唐舞麟', '谢邂', '蓝轩宇', '唐乐', '钱磊', '海神唐三', '情绪之神霍雨浩', '唐舞麟（金龙王）', '毁灭之神', '善良之神', '邪恶之神', '七原罪神·贪食之神', '七元素神·火神'];
    if (isMale) return femaleChars.some(fc => name.includes(fc));
    return maleChars.some(mc => name.includes(mc));
  }).map(c => ({ name: c.name, soul: c.soul, color: c.color }));
}

function finishYearAdvance(events, hasRingMilestone) {
  let log = document.getElementById('event-log');
  log.innerHTML = '';
  let typeNames = { cultivate: '修炼', social: '社交', battle: '战斗', fortune: '机缘', crisis: '危机' };
  events.forEach((ev, idx) => {
    let entry = document.createElement('div');
    entry.className = 'event-entry';
    entry.style.animationDelay = (idx * 0.1) + 's';
    entry.innerHTML = `
      <div class="event-year">${G.timeline.name} · ${ev.age}岁</div>
      <span class="event-type ${ev.type}">${typeNames[ev.type] || ev.type}</span>
      <div class="event-text">${ev.text}</div>
    `;
    log.appendChild(entry);
    G.yearEvents = G.yearEvents || [];
    G.yearEvents.unshift({ age: ev.age, type: ev.type, text: ev.text });
  });
  checkAchievements();
  renderSidebar();
  // Ring milestone
  if (hasRingMilestone && G.alive) {
    let lastRingEvent = events.find(e => e.ringMilestone);
    if (lastRingEvent) {
      openSoulRingWheel(function (ringSuccess) {
        if (!G.alive) { G._processing = false; renderSidebar(); triggerDeath('猎杀魂环时陨落'); return; }
        renderSidebar(); checkAchievements();
        if (ringSuccess) {
          openOpportunityWheel(function () {
            G._processing = false; renderSidebar(); checkAchievements();
            if (!G.alive) triggerDeath('遭遇不测');
          });
        } else {
          G._processing = false;
          if (!G.alive) triggerDeath('遭遇不测');
        }
      });
      return;
    }
  }
  G._processing = false;
  if (!G.alive) triggerDeath(G.deathReason || '遭遇不测');
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
  let protagonists = {
    douluo1: {
      name: '唐三', birthOffset: 0, milestones: [
        { age: 6, status: '武魂觉醒，先天满魂力' },
        { age: 12, status: '进入诺丁学院，结识小舞' },
        { age: 14, status: '进入史莱克学院' },
        { age: 16, status: '魂师大赛夺冠，武魂殿初现敌意' },
        { age: 20, status: '建立唐门，准备对抗武魂殿' },
        { age: 25, status: '海神岛传承，成为海神' },
        { age: 30, status: '击败比比东，升入神界' }
      ]
    },
    douluo2: {
      name: '霍雨浩', birthOffset: -10, milestones: [
        { age: 6, status: '觉醒灵眸武魂' },
        { age: 11, status: '进入史莱克学院' },
        { age: 14, status: '魂导师修炼，结识唐舞桐' },
        { age: 17, status: '极限单兵计划' },
        { age: 20, status: '继承情绪之神神位' },
        { age: 26, status: '升入神界' }
      ]
    },
    douluo3: {
      name: '唐舞麟', birthOffset: -20, milestones: [
        { age: 6, status: '觉醒蓝银草武魂' },
        { age: 10, status: '进入东海学院' },
        { age: 14, status: '史莱克学院学员' },
        { age: 18, status: '一字斗铠师' },
        { age: 22, status: '与古月娜相爱相杀' },
        { age: 28, status: '金龙王之力觉醒' }
      ]
    },
    douluo4: {
      name: '蓝轩宇', birthOffset: -30, milestones: [
        { age: 6, status: '觉醒金银龙王血脉' },
        { age: 12, status: '进入史莱克学院' },
        { age: 16, status: '龙变历练' },
        { age: 20, status: '创造龙神神位' }
      ]
    },
    godrealm: {
      name: '唐三', birthOffset: 0, milestones: [
        { age: 100, status: '神界执法者' },
        { age: 300, status: '大神圈创立者' }
      ]
    }
  };

  let p = protagonists[timelineId];
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
    let domains = { '火系': '烈焰领域', '冰系': '极寒领域', '雷系': '雷霆领域', '风系': '风暴领域', '土系': '大地领域', '水系': '深海领域', '木系': '生命之域', '暗系': '暗影领域', '光系': '光明领域', '毒系': '万毒领域', '精神系': '精神领域', '龙系': '龙威领域', '空间系': '虚空领域', '时间系': '时光领域', '吞噬系': '吞噬领域' };
    return domains[G.bloodline?.type] || '兽王领域';
  }
  let domains = { '攻击': '杀神领域', '防御': '不动领域', '控制': '幻境领域', '辅助': '祝福领域', '敏攻': '极速领域', '强攻': '战魂领域' };
  return domains[G.martialSoul?.type] || '武魂领域';
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
// ACHIEVEMENTS
// ============================================================
function checkAchievements() {
  if (!G) return;
  ACHIEVEMENTS.forEach(a => {
    if (!globalAchievements.includes(a.id) && a.check(G)) {
      globalAchievements.push(a.id);
      saveGlobalAchievements();
      // Show achievement notification
      showAchievementNotification(a);
    }
  });
}

function showAchievementNotification(ach) {
  let n = document.createElement('div');
  n.style.cssText = 'position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#2a2a6e,#1a1a4e);border:2px solid var(--gold);border-radius:12px;padding:15px 25px;z-index:200;animation:fadeUp .5s;font-size:14px;';
  n.innerHTML = `<div style="color:var(--gold);font-weight:bold;">🏆 成就解锁！</div><div style="margin-top:4px;">${ach.icon} ${ach.name}</div><div style="color:var(--gray);font-size:12px;">${ach.desc}</div>`;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

// ============================================================

function syncBeastSoulPower() {
  if (G.identityType === 'soul_beast' && G.beastYears !== undefined) {
    G.soulPower = beastYearsToLevel(G.beastYears);
  }
}

function addBeastYears(amount) {
  if (G.identityType !== 'soul_beast' || G.beastYears === undefined) return '';
  G.beastYears += amount;
  syncBeastSoulPower();
  return ` · 年限+${formatYears(amount)}`;
}

function viewSave(idx) {
  let saves = loadSaves();
  if (!Array.isArray(saves)) return;
  let s = saves[idx];
  if (!s) return;
  const modal = document.getElementById('modal-event');
  const box = document.getElementById('modal-event-box');
  let ratingColors = { SS: '#ffdd44', S: '#ff8844', A: '#44dd88', B: '#4488ff', C: '#aaaaaa', D: '#888888' };
  let ratingColor = ratingColors[s.rating] || '#888888';
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
  let saves = loadSaves();
  let id = saves[idx]?.id;
  // Also delete full game state if exists
  if (id) {
    try { localStorage.removeItem('dl_save_full_' + id); } catch (e) { }
    await apiDeleteGame(id);
  }
  saves.splice(idx, 1);
  saveSaves(saves);
  renderSaves();
}

function saveCurrentGame() {
  if (!G || !G.timeline) { showSaveToast('无法保存：游戏未开始', 'var(--red)'); return; }
  // 复用已有存档ID，避免读档后保存产生重复记录
  let saveId = G._saveId || Date.now();
  G._saveId = saveId;
  let soulName = G.martialSoul?.example || (G.bloodline ? `${G.bloodline.name}魂兽` : '未知');
  let summary = {
    id: saveId,
    timeline: G.timeline?.name || '未知',
    identity: G.identity?.name || '未知',
    identityType: G.identityType || 'human',
    martialSoul: soulName,
    soulPower: G.soulPower || 0,
    age: G.age || 0,
    rating: G.alive ? '进行中' : '',
    epitaph: '...',
    rings: (G.soulRings || []).length,
    bones: (G.soulBones || []).length,
    deathReason: G.alive ? '进行中' : (G.deathReason || '未知'),
    innatePower: G.innatePower || 0,
    beastYears: G.beastYears,
    date: new Date().toLocaleString('zh-CN'),
    isSave: true
  };
  let fullOk = false;
  try {
    const seen = new WeakSet();
    let dataStr = JSON.stringify(G, function (key, val) {
      if (typeof val === 'function') return undefined;
      if (val instanceof HTMLElement) return undefined;
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    });
    if (dataStr.length > 4 * 1024 * 1024) {
      showSaveToast('存档过大(>4MB)，仅保存摘要', 'var(--orange)');
    } else {
      localStorage.setItem('dl_save_full_' + saveId, dataStr);
      fullOk = true;
    }
  } catch (e) {
    console.error('存档序列化失败', e);
    showSaveToast('完整存档保存失败：' + e.message, 'var(--red)');
  }
  try {
    let saves = loadSaves();
    // 查找是否已存在同ID的存档，存在则更新，不存在则新增
    let existIdx = saves.findIndex(s => s.id === saveId);
    if (existIdx >= 0) {
      saves[existIdx] = summary;
    } else {
      saves.unshift(summary);
      if (saves.length > 20) saves = saves.slice(0, 20);
    }
    saveSaves(saves);
  } catch (e) {
    showSaveToast('存档列表保存失败', 'var(--red)');
    return;
  }
  if (fullOk) {
    showSaveToast('存档成功！进度已保存');
    addEventLog(G.age, 'fortune', '<b style="color:var(--green);">【存档成功】</b> 游戏进度已保存。');
  }
  // Sync to backend (non-blocking)
  try {
    let fullData = null;
    const seen = new WeakSet();
    let dataStr = JSON.stringify(G, function (key, val) {
      if (typeof val === 'function') return undefined;
      if (val instanceof HTMLElement) return undefined;
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    });
    if (dataStr.length <= 4 * 1024 * 1024) {
      fullData = JSON.parse(dataStr);
    }
    apiSaveGame(summary, fullData).then(r => {
      if (r.ok && r.source === 'api') {
        console.log('存档已同步到服务器');
      }
    }).catch(e => { });
  } catch (e) { }
}

async function loadSaveGame(idx) {
  let saves = loadSaves();
  let s = saves[idx];
  if (!s) return;
  if (s.deathReason !== '进行中') {
    alert('该角色已死亡，无法继续游戏。');
    return;
  }
  // Try API first, fallback to localStorage
  let result = await apiLoadGame(s.id);
  let fullData = null;
  if (result.ok && result.data) {
    fullData = result.data;
  } else {
    let fullKey = 'dl_save_full_' + s.id;
    try {
      fullData = JSON.parse(localStorage.getItem(fullKey));
    } catch (e) {
      console.error('读取完整存档失败', e);
    }
  }
  if (!fullData) {
    alert('完整存档数据丢失，无法继续游戏。');
    return;
  }
  G = fullData;
  G._processing = false;
  G.autoMode = false;
  // 记录当前存档ID，保存时复用，避免产生重复记录
  G._saveId = s.id;
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  let ob = document.getElementById('mini-auto-stop-btn'); if (ob) ob.style.display = 'none';
  let defaults = createDefaultState();
  for (let k in defaults) {
    if (G[k] === undefined || G[k] === null) { G[k] = defaults[k]; continue; }
    if (Array.isArray(defaults[k]) && !Array.isArray(G[k])) { G[k] = defaults[k]; continue; }
    if (typeof defaults[k] === 'object' && !Array.isArray(defaults[k]) && defaults[k] !== null) {
      if (typeof G[k] !== 'object' || G[k] === null) { G[k] = defaults[k]; }
    }
  }
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

