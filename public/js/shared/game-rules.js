// Shared helpers and game rules extracted from app.js

// ============================================================
// BASE HELPERS
// ============================================================
function weightedRandom(items, weightKey = 'weight') {
  let total = items.reduce((sum, item) => sum + item[weightKey], 0);
  let roll = Math.random() * total;
  for (let item of items) {
    roll -= item[weightKey];
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function formatYears(years) {
  if (years === 0) return '幼年期';
  if (years < 100) return years + '年（成长期）';
  if (years >= 1000000) return (years / 10000).toFixed(0) + '万年';
  if (years >= 10000) return (years / 10000).toFixed(years % 10000 === 0 ? 0 : 1) + '万年';
  if (years >= 1000) return (years / 1000).toFixed(years % 1000 === 0 ? 0 : 1) + '千年';
  if (years >= 100) return (years / 100).toFixed(years % 100 === 0 ? 0 : 1) + '百年';
  return years + '年';
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

// ============================================================
// MARTIAL SOUL / SOUL RING RULES
// ============================================================
function checkSoulEvolution() {
  if (!G || !G.martialSoul || !G.martialSoul.name) return null;
  if (G.martialSoul.isDual || G.martialSoul.id === 'multi') return null;
  let baseName = G.martialSoul._baseName || G.martialSoul.name;
  let evo = SOUL_EVOLUTIONS[baseName];
  if (!evo) {
    let type = G.martialSoul.type;
    if (type === '器武魂') evo = SOUL_EVOLUTIONS._DEFAULT_WEAPON_;
    else if (type === '兽武魂') evo = SOUL_EVOLUTIONS._DEFAULT_BEAST_;
    else if (type === '变异武魂') evo = SOUL_EVOLUTIONS._DEFAULT_MUTANT_;
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
      let attrs = SOUL_CORE_ATTRS;
      let attr1 = attrs[Math.floor(Math.random() * attrs.length)];
      let attr2 = attrs[Math.floor(Math.random() * attrs.length)];
      return {
        text: `<b style="color:var(--gold);">【魂核形成】</b> 在${soulName}的引导下，你成功凝聚出第一魂核——<span style="color:#88aa88;">普通魂核</span>！${attr1}+10%，${attr2}+5%！`,
        core: { level: 1, type: '普通', color: '#88aa88', attrs: { [attr1]: 0.1, [attr2]: 0.05 } },
        sp: 2
      };
    }
    if (currentCore === 1 && G.soulPower >= 80) {
      let attrs = SOUL_CORE_ATTRS;
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
      let attrs = SOUL_CORE_ATTRS;
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
    let type = martialSoul.type;
    if (type === '器武魂') evo = SOUL_EVOLUTIONS._DEFAULT_WEAPON_;
    else if (type === '兽武魂') evo = SOUL_EVOLUTIONS._DEFAULT_BEAST_;
    else if (type === '变异武魂') evo = SOUL_EVOLUTIONS._DEFAULT_MUTANT_;
  }
  if (!evo) return null;
  let last = evo.stages[evo.stages.length - 1];
  let finalForm = evo.type === 'replace' ? last : (evo.type === 'prefix' ? last + baseName : baseName + last);
  return `可进化 ${evo.stages.length} 次，最终形态：${finalForm}`;
}

function getRingLimit(ringNum) {
  let base = BASE_RING_LIMITS[ringNum] || 100000;
  let quality = G.martialSoul?.quality || '普通';
  let multiplier = RING_QUALITY_MULTIPLIERS[quality] || 1.0;
  let evolutionStage = G.martialSoul?.evolutionStage || 0;
  multiplier += evolutionStage * 0.2;
  return Math.floor(base * multiplier);
}

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

function getLevelName(level) {
  for (let soulLevel of SOUL_LEVELS) {
    if (level >= soulLevel.min && level <= soulLevel.max) return soulLevel.name;
  }
  return '未知';
}

// ============================================================
// COMBAT POWER SYSTEM
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
    G.soulRings.forEach((ring, index) => {
      let years = ring.years || 0;
      let ringMultiplier = 1 + index * 0.2;
      if (years >= 1000000) ringBonus += 1200 * ringMultiplier;
      else if (years >= 100000) ringBonus += 500 * ringMultiplier;
      else if (years >= 10000) ringBonus += 200 * ringMultiplier;
      else if (years >= 1000) ringBonus += 60 * ringMultiplier;
      else if (years >= 100) ringBonus += 20 * ringMultiplier;
      else ringBonus += 5 * ringMultiplier;
      if (ring.skills && ring.skills.length) {
        ring.skills.forEach(skill => {
          let skillBonus = skill.type === 'control' ? 100 : (skill.type === 'attack' ? 90 : (skill.type === 'defense' ? 80 : (skill.type === 'boost' ? 150 : 70)));
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
    G.customSkills.forEach(skill => {
      let type = skill.type || 'attack';
      if (type === 'control') customSkillBonus += 200;
      else if (type === 'attack') customSkillBonus += 180;
      else if (type === 'defense') customSkillBonus += 150;
      else if (type === 'boost') customSkillBonus += 120;
      else customSkillBonus += 100;
    });
  }

  let qualityBonus = 1;
  if (G.martialSoul?.quality) {
    let quality = G.martialSoul.quality;
    if (quality.includes('顶级')) qualityBonus = 1.6;
    else if (quality.includes('变异')) qualityBonus = 1.35;
    else if (quality.includes('优秀')) qualityBonus = 1.15;
    else if (quality.includes('双生')) qualityBonus = 2.2;
  }

  let bloodlineBonus = G.bloodline ? 1.3 : 1;
  let bloodlineAttrBonus = 1;
  if (G.bloodline?.attr) {
    let attrs = G.bloodline.attr;
    if (typeof attrs.power === 'number') bloodlineAttrBonus *= attrs.power;
    if (typeof attrs.defense === 'number') bloodlineAttrBonus *= 1 + (attrs.defense - 1) * 0.5;
    if (typeof attrs.speed === 'number') bloodlineAttrBonus *= 1 + (attrs.speed - 1) * 0.3;
    if (typeof attrs.control === 'number') bloodlineAttrBonus *= 1 + (attrs.control - 1) * 0.4;
    if (typeof attrs.heal === 'number') bloodlineAttrBonus *= 1 + (attrs.heal - 1) * 0.2;
    if (typeof attrs.space === 'number') bloodlineAttrBonus *= attrs.space;
    if (typeof attrs.time === 'number') bloodlineAttrBonus *= attrs.time;
    if (typeof attrs.devour === 'number') bloodlineAttrBonus *= attrs.devour;
  }

  let birthplaceBonus = 1;
  if (G.birthplace?.attr) {
    let attrs = G.birthplace.attr;
    if (typeof attrs.power === 'number') birthplaceBonus *= attrs.power;
    if (typeof attrs.risk === 'number') birthplaceBonus *= 1 + (attrs.risk - 1) * 0.3;
    if (typeof attrs.secret === 'number') birthplaceBonus *= 1 + (attrs.secret - 1) * 0.4;
    if (typeof attrs.divine === 'number') birthplaceBonus *= attrs.divine;
    if (typeof attrs.tech === 'number') birthplaceBonus *= 1 + (attrs.tech - 1) * 0.5;
    if (typeof attrs.spirit === 'number') birthplaceBonus *= 1 + (attrs.spirit - 1) * 0.6;
    if (typeof attrs.alien === 'number') birthplaceBonus *= 1 + (attrs.alien - 1) * 0.5;
  }

  let soulCoreBonus = 1;
  if (G.soulCore >= 1) soulCoreBonus = 1.35;
  if (G.soulCore >= 2) soulCoreBonus = 1.7;
  if (G.soulCore >= 3) soulCoreBonus = 2.2;

  let coreAttrBonus = 1;
  if (Array.isArray(G.soulCores)) {
    G.soulCores.forEach(core => {
      if (core.attrs) {
        Object.values(core.attrs).forEach(value => {
          if (typeof value === 'number') coreAttrBonus *= 1 + value;
        });
      }
    });
  }

  let divineSkillBonus = 1;
  if ((G.identityType === 'god' || G.identityType === 'divine_beast') && Array.isArray(G.divineSkills)) {
    divineSkillBonus = 1 + G.divineSkills.length * 0.15;
  }

  return Math.floor((base + ringBonus + boneBonus + customSkillBonus) * qualityBonus * bloodlineBonus * bloodlineAttrBonus * birthplaceBonus * soulCoreBonus * coreAttrBonus * divineSkillBonus);
}

function getCombatPowerRating(combatPower) {
  if (combatPower >= 50000) return { name: '超神级', color: '#ff0000' };
  if (combatPower >= 30000) return { name: '神级', color: '#ffdd44' };
  if (combatPower >= 15000) return { name: '极限斗罗级', color: '#ff6644' };
  if (combatPower >= 8000) return { name: '封号斗罗级', color: '#aa66ff' };
  if (combatPower >= 4000) return { name: '魂斗罗级', color: '#44ddaa' };
  if (combatPower >= 2000) return { name: '魂圣级', color: '#4488ff' };
  if (combatPower >= 1000) return { name: '魂帝级', color: '#88aaff' };
  if (combatPower >= 500) return { name: '魂王级', color: '#aaddaa' };
  if (combatPower >= 200) return { name: '魂宗级', color: '#cccc66' };
  if (combatPower >= 100) return { name: '魂尊级', color: '#aaaaaa' };
  return { name: '魂士级', color: '#888888' };
}