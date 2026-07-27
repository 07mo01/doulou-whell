function checkSoulEvolution(){
  if(!G || !G.martialSoul || !G.martialSoul.name) return null;
  if(G.martialSoul.isDual || G.martialSoul.id === 'multi') return null;
  let baseName = G.martialSoul._baseName || G.martialSoul.name;
  let evo = SOUL_EVOLUTIONS[baseName];
  if(!evo){
    let t = G.martialSoul.type;
    if(t === '器武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_WEAPON_'];
    else if(t === '兽武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_BEAST_'];
    else if(t === '变异武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_MUTANT_'];
  }
  if(!evo) return null;
  let stage = G.martialSoul.evolutionStage || 0;
  if(stage >= evo.stages.length) return null;
  if(G.soulPower >= evo.levels[stage] && G.age >= evo.ages[stage]){
    let newName;
    if(evo.type === 'replace') newName = evo.stages[stage];
    else if(evo.type === 'prefix') newName = evo.stages[stage] + baseName;
    else newName = baseName + evo.stages[stage];
    return {stage: stage + 1, newName: newName, bonusPower: evo.powers[stage], desc: evo.descs[stage]};
  }
  return null;
}

// 战力缓存（避免renderSidebar每次都重新计算）
let _combatPowerCache = null;
let _combatPowerCacheKey = '';
function getCachedCombatPower(){
  if(!G) return 0;
  let key = [G.soulPower, G.identityType, G.martialSoul?.quality, G.martialSoul?.evolutionStage,
    (G.soulRings||[]).length, (G.soulBones||[]).length, (G.customSkills||[]).length,
    G.soulCore, (G.divineSkills||[]).length, G.bloodline?.id, G.birthplace?.id,
    Array.isArray(G.soulCores) ? G.soulCores.length : 0
  ].join('|');
  if(key !== _combatPowerCacheKey){
    _combatPowerCache = calculateCombatPower(G, false);
    _combatPowerCacheKey = key;
  }
  return _combatPowerCache;
}

function checkSoulCoreFormation(){
  if(!G || !G.martialSoul) return null;
  let currentCore = G.soulCore || 0;
  let soulName = G.martialSoul.name || '';
  
  if(G.timeline?.id === 'douluo2'){
    if(currentCore === 0 && G.soulPower >= 60){
      let attrs = ['力量','速度','精神','魂力','防御','攻击'];
      let attr1 = attrs[Math.floor(Math.random()*attrs.length)];
      let attr2 = attrs[Math.floor(Math.random()*attrs.length)];
      return {
        text:`<b style="color:var(--gold);">【魂核形成】</b> 在${soulName}的引导下，你成功凝聚出第一魂核——<span style="color:#88aa88;">普通魂核</span>！${attr1}+10%，${attr2}+5%！`,
        core:{level:1, type:'普通', color:'#88aa88', attrs:{[attr1]:0.1, [attr2]:0.05}},
        sp:2
      };
    }
    if(currentCore === 1 && G.soulPower >= 80){
      let attrs = ['力量','速度','精神','魂力','防御','攻击'];
      let attr1 = attrs[Math.floor(Math.random()*attrs.length)];
      let attr2 = attrs[Math.floor(Math.random()*attrs.length)];
      while(attr2 === attr1) attr2 = attrs[Math.floor(Math.random()*attrs.length)];
      return {
        text:`<b style="color:var(--gold);">【魂核进化】</b> 第一魂核蜕变，进化为<span style="color:#aa88ff;">暗金魂核</span>！${attr1}+20%，${attr2}+10%，全属性+5%！`,
        core:{level:2, type:'暗金', color:'#aa88ff', attrs:{[attr1]:0.2, [attr2]:0.1, 全属性:0.05}},
        sp:3
      };
    }
    if(currentCore === 2 && G.soulPower >= 90){
      let attrs = ['力量','速度','精神','魂力','防御','攻击'];
      let attr1 = attrs[Math.floor(Math.random()*attrs.length)];
      return {
        text:`<b style="color:var(--gold);">【极致魂核】</b> 暗金魂核突破极限，进化为<span style="color:#ff8844;">极致魂核</span>！${attr1}+50%，全属性+20%，战力大幅飞跃！`,
        core:{level:3, type:'极致', color:'#ff8844', attrs:{[attr1]:0.5, 全属性:0.2}},
        sp:5
      };
    }
  }else{
    if(currentCore === 0 && G.soulPower >= 60){
      return {
        text:`<b style="color:var(--gold);">【魂核形成】</b> 在${soulName}的引导下，你成功凝聚出第一魂核！精神力大幅提升，战力+35%！`,
        core:{level:1, type:'魂核', color:'#88aa88'},
        sp:2
      };
    }
    if(currentCore === 1 && G.soulPower >= 80){
      return {
        text:`<b style="color:var(--gold);">【双魂核】</b> 你成功凝聚出第二魂核！双核共振产生强大的精神力增幅，战力+70%！`,
        core:{level:2, type:'双魂核', color:'#aa88ff'},
        sp:3
      };
    }
    if(currentCore === 2 && G.soulPower >= 90){
      return {
        text:`<b style="color:var(--gold);">【三魂核】</b> 极致的精神力突破，第三魂核凝聚成功！三核归一，战力+120%！`,
        core:{level:3, type:'三魂核', color:'#ff8844'},
        sp:5
      };
    }
  }
  return null;
}

function getEvolutionPotential(martialSoul){
  if(!martialSoul || martialSoul.isDual || martialSoul.id === 'multi') return null;
  let baseName = martialSoul._baseName || martialSoul.name;
  let evo = SOUL_EVOLUTIONS[baseName];
  if(!evo){
    let t = martialSoul.type;
    if(t === '器武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_WEAPON_'];
    else if(t === '兽武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_BEAST_'];
    else if(t === '变异武魂') evo = SOUL_EVOLUTIONS['_DEFAULT_MUTANT_'];
  }
  if(!evo) return null;
  let last = evo.stages[evo.stages.length - 1];
  let finalForm = evo.type === 'replace' ? last : (evo.type === 'prefix' ? last + baseName : baseName + last);
  return `可进化 ${evo.stages.length} 次，最终形态：${finalForm}`;
}

// Get identity-adjusted quality weights
function getQualityWeightsForIdentity(identity, identityType){
  let base = {common:45,good:35,mutant:12,top:7,dual:1};
  if(identityType === 'soul_beast'){
    // Beast: based on years (stored in G.beastYears)
    let yrs = G ? (G.beastYears || 0) : 0;
    if(yrs >= 200000) return {common:5,good:15,mutant:30,top:45,dual:5};
    if(yrs >= 100000) return {common:10,good:25,mutant:30,top:30,dual:5};
    if(yrs >= 10000) return {common:20,good:35,mutant:25,top:18,dual:2};
    if(yrs >= 1000) return {common:35,good:40,mutant:15,top:9,dual:1};
    return {common:50,good:35,mutant:10,top:4,dual:1};
  }
  if(identityType === 'god'){
    return {common:0,good:5,mutant:15,top:70,dual:10};
  }
  // Human: based on identity
  switch(identity.id){
    case 'commoner': return {common:55,good:32,mutant:8,top:4,dual:1};
    case 'orphan': return {common:45,good:30,mutant:15,top:8,dual:2};
    case 'rogue': return {common:40,good:35,mutant:15,top:8,dual:2};
    case 'sect_disciple': return {common:30,good:42,mutant:15,top:11,dual:2};
    case 'noble': return {common:20,good:40,mutant:18,top:18,dual:4};
    case 'family_child': return {common:10,good:30,mutant:22,top:30,dual:8};
    default: return base;
  }
}

// Build quality-tier wheel items based on identity
function buildQualityWheel(){
  let weights = getQualityWeightsForIdentity(G.identity, G.identityType);
  let items = [
    {name:'普通武魂',tier:'common',weight:weights.common,color:'#888888',desc:'铜铁之类，随处可见。'},
    {name:'优秀武魂',tier:'good',weight:weights.good,color:'#4488ff',desc:'材质上佳，战力不俗。'},
    {name:'变异武魂',tier:'mutant',weight:weights.mutant,color:'#aa66ff',desc:'基因异变，祸福难料。'},
    {name:'顶级武魂',tier:'top',weight:weights.top,color:'#ffdd44',desc:'世界顶尖，天生神级。'},
    {name:'双生武魂',tier:'dual',weight:weights.dual,color:'#ff4444',desc:'极其罕见，双魂觉醒。'}
  ];
  return items.filter(i => i.weight > 0);
}

// Pick N random names from a tier pool for the name wheel display
function pickNameWheelItems(tier, count){
  let pool = buildSoulNamePool();
  let source = pool[tier] || pool.common;
  // Shuffle and pick
  let shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Randomly select one name from tier pool
function randomSoulName(tier){
  let pool = buildSoulNamePool();
  let source = pool[tier] || pool.common;
  return source[Math.floor(Math.random() * source.length)];
}

function generateRingSkills(ringNum, years, martialSoul){
  // 7th ring is always Wu Hun Zhen Shen (Martial Soul True Body)
  if(ringNum === 7){
    let soulName = martialSoul?.name || '武魂';
    return [{name:'武魂真身', type:'boost', desc:`第七魂技·武魂真身。将${soulName}发挥到极致，全属性大幅提升，是封号斗罗的标志性能力。`}];
  }

  let skillCount = 1;
  // 100k+ years: guarantee 2 skills + 1 bone
  // 1m+ years: guarantee 4 skills
  if(years >= 1000000) skillCount = 4;
  else if(years >= 100000) skillCount = 2;

  let skills = [];
  let usedTypes = new Set();
  // Determine skill types based on martial soul
  let isWeapon = martialSoul?.type === '器武魂';
  let isBeast = martialSoul?.type === '兽武魂';

  for(let i = 0; i < skillCount; i++){
    let type, pool;
    if(i === 0){
      // First skill always matches soul type
      type = isWeapon ? 'attack' : (isBeast ? 'attack' : 'attack');
    } else if(i === 1){
      // Second: defense or control
      type = Math.random() < 0.5 ? 'defense' : 'control';
    } else if(i === 2){
      // Third: boost or another attack
      type = Math.random() < 0.6 ? 'boost' : 'attack';
    } else {
      // Fourth: rare type
      type = ['attack','defense','control','boost'][Math.floor(Math.random()*4)];
    }
    pool = SKILL_TEMPLATES[type] || SKILL_TEMPLATES.attack;
    // Pick a random template from the pool
    let template = pool[Math.floor(Math.random()*pool.length)];
    if(!template || !template.skills){
      skills.push({name:`第${ringNum}魂技`,type:type,desc:`第${ringNum}魂技，${quality}魂兽之力凝聚的${type}技能。`});
      continue;
    }
    let skillName = template.skills[Math.floor(Math.random()*template.skills.length)];
    // Add ring number prefix for flavor
    let finalName = skillName;
    if(years >= 100000){
      finalName += '（十万年魂技）';
    }
    if(years >= 1000000){
      finalName += '（百万年魂技）';
    }
    skills.push({
      name: finalName,
      type: type,
      desc: generateSkillDesc(finalName, type, ringNum, years)
    });
  }
  return skills;
}

function generateSkillDesc(name, type, ringNum, years){
  let quality = years >= 1000000 ? '百万年' : years >= 100000 ? '十万年' : years >= 10000 ? '万年' : years >= 1000 ? '千年' : '百年';
  let descs = {
    attack: [
      `第${ringNum}魂技。由${quality}魂兽之力凝聚而成的强力攻击技能，造成巨大范围伤害。`,
      `第${ringNum}魂技。以自身魂力催动，爆发出毁灭性的攻击力量，足以撕裂空间。`,
      `第${ringNum}魂技。将${quality}魂兽的本源之力注入武魂，化为锋锐无匹的攻击。`
    ],
    defense: [
      `第${ringNum}魂技。凝聚${quality}魂兽的防御本能，在周身形成坚固护盾。`,
      `第${ringNum}魂技。以魂力构建防御屏障，可抵御同级别甚至越级攻击。`
    ],
    control: [
      `第${ringNum}魂技。${quality}魂兽的精神力化作无形枷锁，束缚敌人行动。`,
      `第${ringNum}魂技。释放强大的精神波动，干扰敌人感知，使其陷入短暂失控。`
    ],
    boost: [
      `第${ringNum}魂技。激发${quality}魂兽体内沉睡的力量，大幅提升自身属性。`,
      `第${ringNum}魂技。在短时间内获得${quality}魂兽的部分能力加持，战力倍增。`
    ]
  };
  let pool = descs[type] || descs.attack;
  return pool[Math.floor(Math.random()*pool.length)];
}

function getTimelineProgressEvent(){
  let timelineId = G.timeline?.id || 'douluo1';
  let progress = TIMELINE_PROGRESS[timelineId];
  if(!progress) return null;
  let age = G.age;
  // Check if we already triggered this age's event
  if(G._triggeredProgress && G._triggeredProgress.includes(age)) return null;
  let event = progress.find(e => e.age === age);
  if(!event) return null;
  // Mark as triggered
  G._triggeredProgress = G._triggeredProgress || [];
  G._triggeredProgress.push(age);
  return event;
}

let pendingTimers = [];
function managedTimeout(fn, delay) {
  let id = setTimeout(() => {
    pendingTimers = pendingTimers.filter(t => t !== id);
    fn();
  }, delay);
  pendingTimers.push(id);
  return id;
}
function clearAllTimers() {
  pendingTimers.forEach(id => clearTimeout(id));
  pendingTimers = [];
}

function buildSoulRingWheel(){
  let ringNum = G.soulRings.length;
  if(ringNum >= 9) return null;
  let limit = getRingLimit(ringNum);
  // Build options based on quality-adjusted limit
  let safeMax = Math.floor(limit * 0.7);
  let items = [];
  // Safe range
  items.push({
    name: `安全猎杀\n(${Math.floor(safeMax*0.3)}~${safeMax}年)`,
    years: Math.floor(Math.random()*safeMax*0.7 + safeMax*0.3),
    weight: 40, color: '#226622', risk: 'safe'
  });
  // Medium range
  items.push({
    name: `稳健猎杀\n(${safeMax}~${limit}年)`,
    years: safeMax + Math.floor(Math.random()*(limit - safeMax)),
    weight: 30, color: '#224466', risk: 'medium'
  });
  // Risky range - now safe since limit is raised by quality
  items.push({
    name: `极限猎杀\n(${limit}~${Math.floor(limit*1.5)}年)`,
    years: limit + Math.floor(Math.random()*limit*0.5),
    weight: 20, color: '#664422', risk: 'risky'
  });
  // Gambling - high reward, no death
  items.push({
    name: `命运赌博\n(未知年限)`,
    years: Math.floor(Math.random()*limit*3 + 100),
    weight: 10, color: '#662222', risk: 'gamble'
  });
  return items;
}

function buildSpiritSoulWheel(){
  let ringNum = G.soulRings.length;
  if(ringNum >= 9) return null;
  let limit = getRingLimit(ringNum);
  let items = [];
  let getName = (years) => {
    if(years >= 100000){
      return SPIRIT_SOUL_HIGH_NAMES[Math.floor(Math.random()*SPIRIT_SOUL_HIGH_NAMES.length)];
    }
    return SPIRIT_SOUL_NAMES[Math.floor(Math.random()*SPIRIT_SOUL_NAMES.length)];
  };
  // Low tier spirit soul
  let lowYears = Math.floor(Math.random()*500 + 100);
  items.push({
    name: `低级魂灵\n(${lowYears}年)`, years: lowYears, weight: 25, color: '#448844',
    soulName: SPIRIT_SOUL_PREFIXES[0] + getName(lowYears),
    tier: 'low', cost: 10
  });
  // Mid tier
  let midYears = Math.floor(Math.random()*(Math.min(5000,limit)-1000) + 1000);
  items.push({
    name: `中级魂灵\n(${midYears}年)`, years: midYears, weight: 30, color: '#4466aa',
    soulName: SPIRIT_SOUL_PREFIXES[1] + getName(midYears),
    tier: 'mid', cost: 50
  });
  // High tier
  let highYears = Math.floor(Math.random()*(Math.min(50000,limit*1.5)-10000) + 10000);
  items.push({
    name: `高级魂灵\n(${highYears}年)`, years: highYears, weight: 25, color: '#aa44aa',
    soulName: SPIRIT_SOUL_PREFIXES[2] + getName(highYears),
    tier: 'high', cost: 200
  });
  // Top tier / Random
  let topYears = Math.floor(Math.random()*(limit*2) + 50000);
  items.push({
    name: `顶级魂灵\n(${topYears}年)`, years: topYears, weight: 15, color: '#ffaa22',
    soulName: SPIRIT_SOUL_PREFIXES[3] + getName(topYears),
    tier: 'top', cost: 1000
  });
  // Beast god / Special
  if(Math.random() < 0.1){
    let beastYears = Math.floor(Math.random()*500000 + 100000);
    items.push({
      name: `凶兽魂灵\n(${beastYears}年)`, years: beastYears, weight: 5, color: '#ff2222',
      soulName: SPIRIT_SOUL_PREFIXES[5] + getName(beastYears),
      tier: 'beastgod', cost: 5000
    });
  }
  return items;
}



function openSpiritSoulWheel(callback){
  wheelState.data = buildSpiritSoulWheel();
  if(!wheelState.data){callback(false);return;}
  wheelState.callback = callback;
  wheelState.type = 'spirit';
  let ringNum = G.soulRings.length + 1;
  let eraName = G.timeline.id === 'douluo4' ? '传灵塔/联邦' : '传灵塔';
  openWheelBase(`第${ringNum}魂环 · ${eraName}魂灵契约`, '魂兽濒临灭绝，通过传灵塔契约魂灵获取魂环', wheelState.data, spinSpiritSoulWheel);
}

function spinSpiritSoulWheel(){
  if(wheelState.spinning) return;
  wheelState.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let { selected, finalAngle } = calcWheelSpinResult(wheelState.data);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    wheelState.spinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let ringNum = G.soulRings.length + 1;
    let target = selected.years;
    let color = SOUL_RING_COLORS.find(c => target <= c.max) || SOUL_RING_COLORS[SOUL_RING_COLORS.length-1];
    let skills = generateRingSkills(ringNum, target, G.martialSoul);
    G.soulRings.push({years:target,color:color.cn,css:color.css,bg:color.bg,skills:skills,soulName:selected.soulName,tier:selected.tier,spiritSoul:true});
    G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);
    // Soul bone chance for high tier
    let boneHtml = '';
    if(selected.tier === 'beastgod'){
      let allBones = BONE_TYPES;
      allBones.forEach(b => {if(!G.soulBones.includes(b)) G.soulBones.push(b);});
      boneHtml = `<br><span style="color:var(--gold)">【凶兽魂灵附赠：全套六块魂骨！】</span>`;
    }else if(selected.tier === 'top' && Math.random() < 0.5){
      let boneTypes = BONE_TYPES;
      let available = boneTypes.filter(b => !G.soulBones.includes(b));
      if(available.length > 0){
        let bt = available[Math.floor(Math.random()*available.length)];
        G.soulBones.push(bt);
        boneHtml = `<br><span style="color:var(--gold)">【顶级魂灵附赠：${bt}！】</span>`;
      }
    }
    let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');
    let tierText = {low:'低级',mid:'中级',high:'高级',top:'顶级',beastgod:'凶兽级'}[selected.tier];
    area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">魂灵契约成功！</h3><p>在传灵塔与 <strong style="color:${selected.color}">${selected.soulName}</strong> 签订契约</p><p>获得 <span style="color:${color.bg}">${color.cn}魂环</span>（第${ringNum+1}环 · ${tierText}魂灵 · ${target}年）</p><p>魂力+2级${boneHtml}</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
    G._ringSuccess = true;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 4800);
}

function openWheelBase(label, hint, data, spinHandler) {
  document.getElementById('mini-wheel-label').textContent = label;
  document.getElementById('mini-wheel-hint').textContent = hint;
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinHandler;
  drawMiniWheel(data);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function calcWheelSpinResult(items, spins = 6) {
  let total = items.reduce((s,i) => s + i.weight, 0);
  let selected = weightedRandom(items);
  let selectedIdx = items.indexOf(selected);
  let cumWeight = 0;
  for(let i = 0; i < selectedIdx; i++) cumWeight += items[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * spins + (360 - targetCenter + 270);
  return { selected, selectedIdx, total, finalAngle };
}

function drawWheelCanvas(canvas, items, options = {}){
  const { labelKey='name', colorKey=null, radius=280, fontSize=18, textX=15, textY=5, ringGap=4, ringWidth=3, decoration=false, maxLabel=0 } = options;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w/2, cy = h/2, r = radius;
  ctx.clearRect(0,0,w,h);
  let total = items.reduce((s,i) => s + i.weight, 0);
  let startAngle = 0;
  items.forEach((item, i) => {
    let sliceAngle = (item.weight / total) * Math.PI * 2;
    let endAngle = startAngle + sliceAngle;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    let color = colorKey ? (item[colorKey] || `hsl(${(i/items.length)*360},60%,30%)`) : item.color;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + sliceAngle/2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${fontSize}px Microsoft YaHei`;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = fontSize > 20 ? 4 : 3;
    let label = item[labelKey] ? item[labelKey].split('\n')[0] : '';
    if(maxLabel && label.length > maxLabel) label = label.substring(0, maxLabel) + '…';
    ctx.fillText(label, r - textX, textY);
    ctx.restore();
    startAngle = endAngle;
  });
  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r + ringGap, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,215,0,0.5)';
  ctx.lineWidth = ringWidth;
  ctx.stroke();
  // Inner decoration
  if(decoration){
    for(let i=0;i<items.length;i++){
      let angle=(i/items.length)*Math.PI*2;
      ctx.beginPath();
      ctx.arc(cx,cy,r+ringGap,angle,angle+0.02);
      ctx.strokeStyle='rgba(255,215,0,0.8)';
      ctx.lineWidth=6;
      ctx.stroke();
    }
  }
}

function drawMiniWheel(items){
  drawWheelCanvas(document.getElementById('mini-wheel-canvas'), items);
}

function openSoulRingWheel(callback){
  // God realm: divine bestowed ring, no hunting needed
  if(G.timeline?.soulRingMode === 'divine' || G.identityType === 'god'){
    let ringNum = G.soulRings.length + 1;
    if(ringNum > 9){callback(null);return;}
    let divineColor = SOUL_RING_COLORS.find(c => G.soulPower <= c.max * ringNum/9) || SOUL_RING_COLORS[SOUL_RING_COLORS.length-1];
    if(G.soulPower >= 120) divineColor = SOUL_RING_COLORS.find(c=>c.color==='gold') || SOUL_RING_COLORS[5];
    else if(G.soulPower >= 96) divineColor = SOUL_RING_COLORS.find(c=>c.color==='red') || SOUL_RING_COLORS[4];
    else if(G.soulPower >= 76) divineColor = SOUL_RING_COLORS.find(c=>c.color==='black') || SOUL_RING_COLORS[3];
    else if(G.soulPower >= 56) divineColor = SOUL_RING_COLORS.find(c=>c.color==='purple') || SOUL_RING_COLORS[2];
    else divineColor = SOUL_RING_COLORS.find(c=>c.color==='yellow') || SOUL_RING_COLORS[1];

    let skills = generateRingSkills(ringNum, G.soulPower * 1000, G.martialSoul);
    G.soulRings.push({years:0,color:divineColor.cn,css:divineColor.css,bg:divineColor.bg,divine:true,skills:skills});
    G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);
    let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');
    let wheelData = [{name:'神赐',weight:1,color:'#ffdd44'},{name:'魂环',weight:1,color:'#aa66ff'},{name:'降临',weight:1,color:'#44ddff'}];
    wheelState.type = 'mini';
    wheelState.callback = function(){ callback(true); };
    openWheelBase(`第${ringNum+1}魂环 · 神赐魂环`, '点击任意处继续', wheelData, null);
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-result-area').innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">神赐魂环降临！</h3><p>神界之力为你凝聚第${ringNum+1}魂环</p><p>获得 <span style="color:${divineColor.bg}">${divineColor.cn}神赐魂环</span></p><p style="margin-top:8px;color:var(--cyan)">魂环随等级提升而自动成长</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
    return;
  }

  // Spirit mode (Douluo 3/4): contract spirit soul at Spirit Pagoda
  if(G.timeline?.soulRingMode === 'spirit'){
    openSpiritSoulWheel(callback);
    return;
  }

  // Normal hunting
  wheelState.spinning = false;
  wheelState.data = buildSoulRingWheel();
  if(!wheelState.data){callback(false);return;}
  wheelState.callback = function(){ callback(G._ringSuccess || false); };
  wheelState.type = 'mini';
  let ringNum = G.soulRings.length + 1;
  let limit = getRingLimit(G.soulRings.length);
  let qualityBonus = G.martialSoul?.quality || '普通';
  openWheelBase(`第${ringNum}魂环 · 承受极限${limit}年(${qualityBonus}武魂)`, '选择猎杀策略，转盘决定你的猎杀目标', wheelState.data, spinMiniWheel);
}

function spinMiniWheel(){
  if(wheelState.spinning) return;
  wheelState.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  try{
    let { selected, finalAngle } = calcWheelSpinResult(wheelState.data);
    canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
    canvas.style.transform = `rotate(${finalAngle}deg)`;
    managedTimeout(() => {
      try{
        wheelState.spinning = false;
        btn.classList.remove('btn-disabled');
        // Process result - all absorbs succeed, no death limit
        let ringNum = G.soulRings.length + 1;
        let limit = getRingLimit(ringNum - 1);
        let area = document.getElementById('mini-wheel-result-area');
        let target = selected.years;
        let color = SOUL_RING_COLORS.find(c => target <= c.max) || SOUL_RING_COLORS[SOUL_RING_COLORS.length-1];

        // Generate skills
        let skills = generateRingSkills(ringNum, target, G.martialSoul);
        G.soulRings.push({
          years: target, color: color.cn, css: color.css, bg: color.bg,
          skills: skills
        });
        G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);

        // Soul bone: 100k guarantee 1 bone, 1M guarantee full set (6), others by chance
        let boneHtml = '';
        if(target >= 1000000){
          let allBones = BONE_TYPES;
          allBones.forEach(b => {if(!G.soulBones.includes(b)) G.soulBones.push(b);});
          boneHtml = `<br><span style="color:var(--gold)">【百万年魂兽：获得全套六块魂骨！】</span>`;
        }else if(target >= 100000){
          let boneTypes = BONE_TYPES;
          let available = boneTypes.filter(b => !G.soulBones.includes(b));
          if(available.length > 0){
            let bt = available[Math.floor(Math.random()*available.length)];
            G.soulBones.push(bt);
            boneHtml = `<br><span style="color:var(--gold)">【十万年魂兽保底掉落：${bt}！】</span>`;
          }
        }else{
          let boneChance = target >= 10000 ? 0.2 : target >= 1000 ? 0.05 : 0.01;
          if(Math.random() < boneChance){
            let boneTypes = BONE_TYPES;
            let bt = boneTypes[Math.floor(Math.random()*boneTypes.length)];
            if(!G.soulBones.includes(bt)){G.soulBones.push(bt);}
            boneHtml = `<br><span style="color:var(--gold)">【额外掉落：${bt}！】</span>`;
          }
        }

        // Build skills display
        let skillCountText = skills.length > 1 ? `（${skills.length}个魂技）` : '';
        let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');

        // Show over-limit warning if applicable
        let overLimitHtml = '';
        if(target > limit){
          overLimitHtml = `<p style="color:var(--gold);font-size:12px;">(${G.martialSoul?.quality || '普通'}武魂，承受极限${limit}年，你凭借强悍身体素质强行吸收！)</p>`;
        }

        G._ringSuccess = true;
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">猎杀成功！</h3><p>成功击杀 <strong>${target}年</strong> 魂兽</p><p>获得 <span style="color:${color.bg}">${color.cn}魂环</span>（第${ringNum+1}环）${skillCountText}</p>${overLimitHtml}<p>魂力+2级${boneHtml}</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
        }catch(err){
          console.error('魂环转盘结果处理出错:',err);
          wheelState.spinning = false;
          document.getElementById('mini-wheel-result-area').innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘处理异常，请关闭后重试。</p></div>';
          document.getElementById('mini-wheel-spin-btn').style.display = 'none';
          document.getElementById('mini-wheel-hint').textContent = '点击任意处关闭';
        }
      }, 4800);
    }catch(err){
      console.error('魂环转盘旋转出错:',err);
      wheelState.spinning = false;
      btn.classList.remove('btn-disabled');
      alert('转盘异常，请重试。');
    }
  }

// ============================================================
// YEAR EVENT WHEEL FUNCTIONS
// ============================================================
function buildYearEventWheel(){
  let isBeast = G.identityType === 'soul_beast';
  let items = YEAR_EVENT_WHEEL.map(sector => {
    let w = sector.weight;
    // Soul beast adjustments: lower timeline encounter, higher training
    if(isBeast){
      if(sector.id === 'timeline') w = 3; // lower timeline encounter for beasts
      else if(sector.id === 'normal') w = 22; // higher training for beasts
      else if(sector.id === 'fortune') w = 12; // slightly lower fortune
      else if(sector.id === 'school') w = 0; // beasts don't go to school
      else if(sector.id === 'partner') w = 0; // beasts don't have spouses in human sense
      else if(sector.id === 'justice') w = 0; // beasts don't do justice events
      else if(sector.id === 'auction') w = 0; // beasts don't go to auctions
    }
    if(sector.condition && !sector.condition(G)) w = 0;
    return {...sector, weight: w};
  }).filter(s => s.weight > 0);
  if(items.length === 0) items = [{...YEAR_EVENT_WHEEL[0], weight: 1}];
  return items;
}

function openYearEventWheel(callback){
  wheelState.data = buildYearEventWheel();
  wheelState.extra = null;
  wheelState.callback = function(){ callback(wheelState.extra); };
  wheelState.type = 'year';
  openWheelBase('年度事件', '命运的齿轮转动，这一年将会发生什么？', wheelState.data, spinYearEventWheel);
}

function spinYearEventWheel(){
  if(wheelState.spinning) return;
  wheelState.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let { selected, finalAngle } = calcWheelSpinResult(wheelState.data);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    wheelState.spinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let result = {event: null, subWheel: null};
    switch(selected.eventType){
      case 'normal':{let ev=processNormalEvent();result.event=ev;area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p>${ev._hasChoices?'<p style="color:var(--gold);margin-top:8px;">请在弹窗中做出选择...</p>':'<div style="margin-top:8px;">'+ev.text+'</div>'}</div>`;break;}
      case 'school':{let ev=processSchoolEvent();result.event=ev;area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`;break;}
      case 'partner':{let ev=processPartnerEvent();result.event=ev;area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`;break;}
      case 'justice':{let ev=processJusticeEvent();result.event=ev;area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`;break;}
      case 'auction':{let ev=processAuctionEvent();result.event=ev;area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`;break;}
      case 'fortune':{let ev=processFortuneEvent();result.event=ev;area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><div style="margin-top:8px;">${ev.text}</div></div>`;break;}
      case 'enemy':{let enemyName = (G.timeline?.id === 'godrealm' && selected.nameOverride?.godrealm) ? selected.nameOverride.godrealm : selected.name;result.subWheel='enemy';result.event={type:'battle',text:`<b style="color:var(--red);">【${enemyName}】</b> 宿命的对决——一位强敌挡在了你的面前！`};area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${enemyName}</h3><p>${selected.desc}</p><p style="color:var(--gold);margin-top:8px;">${G.timeline?.id === 'godrealm' ? '神界动乱' : '强敌'}转盘即将开启，点击任意处继续...</p></div>`;break;}
      case 'timeline':{result.subWheel='timeline';result.event={type:'fortune',text:`<b style="color:var(--gold);">【奇缘】</b> 命运的丝线将你与某位原著角色相连...`};area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><p style="color:var(--gold);margin-top:8px;">时间线角色转盘即将开启，点击任意处继续...</p></div>`;break;}
      case 'reroll':{
        area.innerHTML=`<div class="mini-wheel-result"><h3 style="color:${selected.color}">${selected.name}</h3><p>${selected.desc}</p><p style="color:var(--green);margin-top:8px;">命运的齿轮再次转动，你将获得一次重新选择的机会！</p></div>`;
        document.getElementById('mini-wheel-spin-btn').style.display='';
        document.getElementById('mini-wheel-spin-btn').classList.remove('btn-disabled');
        document.getElementById('mini-wheel-hint').textContent='点击"旋转转盘"重新抽取';
        wheelState.spinning=false;
        wheelState.data = buildYearEventWheel().filter(s => s.id !== 'reroll');
        drawMiniWheel(wheelState.data);
        let canvas = document.getElementById('mini-wheel-canvas');
        canvas.style.transition='none';
        canvas.style.transform='rotate(0deg)';
        void canvas.offsetWidth;
        return;
      }
    }
    wheelState.extra = result;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 4800);
}

function buildTimelineCharacterWheel(){
  let timelineId = G.timeline?.id || 'douluo1';
  let chars = TIMELINE_CHARACTERS[timelineId] || TIMELINE_CHARACTERS.douluo1;
  let age = G.age || 6;
  // Filter characters by age range - only show chars that could be alive at player's age
  let filtered = chars.filter(c => {
    if(!c.ageRange) return true; // no restriction
    return age >= c.ageRange[0] && age <= c.ageRange[1];
  });
  if(filtered.length === 0) filtered = chars; // fallback to all if none match
  return filtered.map(c => ({name:c.name,weight:c.weight||10,color:c.color||'#ff8800',_charData:c}));
}

function openTimelineCharacterWheel(callback){
  wheelState.data = buildTimelineCharacterWheel();
  wheelState.callback = callback;
  wheelState.type = 'char';
  openWheelBase('时间线奇缘', '命运的丝线将你与某位原著角色相连...', wheelState.data, spinTimelineCharacterWheel);
}

function spinTimelineCharacterWheel(){
  if(wheelState.spinning) return;
  wheelState.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let { selected, finalAngle } = calcWheelSpinResult(wheelState.data);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    wheelState.spinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let charData = selected._charData;

    // Main characters get a good/bad fate spin
    let mainChars = ['唐三','小舞','霍雨浩','唐舞麟','毁灭之神','生命女神','善良之神','邪恶之神'];
    let isMainChar = mainChars.some(name => charData.name.includes(name));
    let fateGood = true;
    let fateText = '';
    let effectText = '';

    if(isMainChar){
      fateGood = Math.random() < 0.7; // 70% good fate
      if(fateGood){
        let eventData = charData.events[Math.floor(Math.random()*charData.events.length)];
        effectText = eventData.effect(G);
        fateText = `<div style="margin-top:8px;padding:6px;background:rgba(0,255,128,0.1);border-radius:6px;"><span style="color:var(--green);font-weight:bold;">✦ 善缘</span> <span style="color:var(--gray);font-size:12px;">你与${charData.name}结下了善缘</span></div><div style="margin-top:10px;text-align:left;"><p>${eventData.text}</p><p style="color:var(--gold);margin-top:6px;">【${effectText}】</p></div>`;
      }else{
        // Bad fate: negative effect
        let badEvents = [
          {text:`你与${charData.name}产生了误会，被当作敌对势力的探子。`, loss:5},
          {text:`${charData.name}正处于麻烦之中，你无辜被卷入纷争。`, loss:3},
          {text:`${charData.name}的追随者嫉妒你得到了关注，暗中使绊子。`, loss:4},
          {text:`你撞见了${charData.name}的秘密，被要求保守秘密并付出代价。`, loss:6}
        ];
        let badEvent = badEvents[Math.floor(Math.random()*badEvents.length)];
        if(G.identityType === 'soul_beast'){
          let lossYears = badEvent.loss * 10;
          G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
          syncBeastSoulPower();
          effectText = `年限-${lossYears}年`;
        }else{
          G.soulPower = Math.max(G.soulPower - badEvent.loss, 1);
          effectText = `魂力-${badEvent.loss}级`;
        }
        fateText = `<div style="margin-top:8px;padding:6px;background:rgba(255,0,0,0.1);border-radius:6px;"><span style="color:var(--red);font-weight:bold;">✦ 恶缘</span> <span style="color:var(--gray);font-size:12px;">你与${charData.name}结下了恶缘</span></div><div style="margin-top:10px;text-align:left;"><p>${badEvent.text}</p><p style="color:var(--red);margin-top:6px;">【${effectText}】</p></div>`;
      }
    }else{
      let eventData = charData.events[Math.floor(Math.random()*charData.events.length)];
      effectText = eventData.effect(G);
      fateText = `<div style="margin-top:10px;text-align:left;"><p>${eventData.text}</p><p style="color:var(--gold);margin-top:6px;">【${effectText}】</p></div>`;
    }

    // Protagonist status sync
    let pStatus = getProtagonistStatus(G.timeline?.id, G.age);
    let statusHtml = '';
    if(pStatus && charData.name.includes(pStatus.name)){
      statusHtml = `<div style="margin-top:6px;padding:4px 8px;background:rgba(255,215,0,0.08);border-radius:6px;border-left:3px solid var(--gold);"><span style="color:var(--gold);font-size:11px;">📖 原著同步：${pStatus.name}当前${pStatus.age}岁 — ${pStatus.status}</span></div>`;
    }

    area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${charData.name}</h3><p style="color:var(--cyan);">${charData.soul}</p><p style="font-size:12px;color:var(--gray);margin-top:4px;">${charData.desc}</p>${statusHtml}${fateText}</div>`;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 4800);
}

// Close mini wheel on click after result
function closeMiniWheel(){
  let overlay = document.getElementById('mini-wheel-overlay');
  if(!overlay.classList.contains('active')) return;
  let resultArea = document.getElementById('mini-wheel-result-area');
  if(resultArea.innerHTML === '' || wheelState.spinning) return;

  let cb = wheelState.callback;
  wheelState.data = null;
  wheelState.spinning = false;
  wheelState.callback = null;
  wheelState.type = null;
  wheelState.extra = null;
  overlay.classList.remove('active');

  if(cb) cb();
}

// ============================================================
// POST-RING OPPORTUNITY WHEEL
// ============================================================
const RING_OPPORTUNITY = [
  {id:'sp',name:'魂力激增',weight:30,color:'#22aa44',desc:'吸收魂环后，体内魂力暴涨！'},
  {id:'bone',name:'意外魂骨',weight:15,color:'#ffdd44',desc:'魂兽体内残存魂骨，意外获得！'},
  {id:'custom_skill',name:'自创魂技',weight:25,color:'#aa66ff',desc:'吸收过程中灵光一现，领悟了自创魂技！'},
  {id:'nothing',name:'平稳吸收',weight:30,color:'#888888',desc:'一切顺利，没有额外收获。'}
];



// Self-created skill name generator
const CUSTOM_SKILL_PREFIX = {
  attack:['裂空','碎星','灭世','破天','斩魂','灭神','噬魂','碎虚','裂地','斩月','天罚','雷劫','冰封','焚天','毒噬','金刃','龙吟','凤鸣','暗噬','圣裁'],
  defense:['铁壁','金刚','不动','圣光','玄武','龙鳞','冰盾','土墙','暗幕','光幕'],
  control:['锁魂','禁锢','幻境','魅惑','冰封','缠绕','精神','空间','时间','因果'],
  boost:['战神','龙魂','凤翼','天使','魔神','圣灵','狂战','天神','战意','觉醒']
};

function generateCustomSkillName(){
  let types = Object.keys(CUSTOM_SKILL_PREFIX);
  let type = types[Math.floor(Math.random()*types.length)];
  let prefixes = CUSTOM_SKILL_PREFIX[type];
  let prefix = prefixes[Math.floor(Math.random()*prefixes.length)];
  let suffixes = {
    attack:['一击','斩','刃','枪','炮','击','裂','灭','杀','破'],
    defense:['之壁','之盾','护体','屏障','领域','结界','守护','不动'],
    control:['之术','领域','幻境','束缚','封锁','压制','催眠','迷宫'],
    boost:['之力','附体','觉醒','增幅','爆发','化身','共鸣','灌注']
  };
  let suffix = suffixes[type][Math.floor(Math.random()*suffixes[type].length)];
  return {name: prefix+suffix, type:type};
}

function openOpportunityWheel(callback){
  wheelState.callback = callback;
  wheelState.type = 'opp';
  wheelState.data = RING_OPPORTUNITY;
  openWheelBase('魂环吸收机遇', '吸收魂环后，命运给你带来了...', RING_OPPORTUNITY, spinOpportunityWheel);
}

function spinOpportunityWheel(){
  if(wheelState.spinning) return;
  wheelState.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let { selected, finalAngle } = calcWheelSpinResult(RING_OPPORTUNITY, 5);
  canvas.style.transition = 'transform 1.75s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    wheelState.spinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    switch(selected.id){
      case 'sp': {
        let gain = 1 + Math.floor(Math.random()*3);
        G.soulPower = Math.min(G.soulPower + gain, G.maxLevel);
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:#22aa44">魂力激增！</h3><p>吸收过程中，魂力额外暴涨！</p><p style="color:var(--gold);margin-top:8px;">魂力+${gain}级</p></div>`;
        break;
      }
      case 'bone': {
        let boneTypes = BONE_TYPES;
        let available = boneTypes.filter(b => !G.soulBones.includes(b));
        if(available.length > 0){
          let bt = available[Math.floor(Math.random()*available.length)];
          G.soulBones.push(bt);
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">意外收获！</h3><p>魂兽体内残存着一块魂骨！</p><p style="color:var(--gold);margin-top:8px;">获得 <b>${bt}</b>！</p></div>`;
        }else{
          G.gold = (G.gold||0) + 200;
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">魂骨已齐！</h3><p>发现魂骨，但你已集齐全套！</p><p style="color:var(--gold);margin-top:8px;">出售换取200金魂币</p></div>`;
        }
        break;
      }
      case 'custom_skill': {
        // Open custom skill sub-wheel
        document.getElementById('mini-wheel-spin-btn').style.display = 'none';
        document.getElementById('mini-wheel-hint').textContent = '灵感涌现，自创魂技...';
        let customSkill = generateCustomSkillName();
        let typeNames = {attack:'攻击',defense:'防御',control:'控制',boost:'增幅'};
        let typeColors = {attack:'#ff4444',defense:'#4488ff',control:'#aa66ff',boost:'#22aa44'};
        G.customSkills = G.customSkills || [];
        G.customSkills.push(customSkill);
        let skillDescs = {
          attack:`第${G.customSkills.length}自创魂技。灵感迸发，创造出强力攻击技能，可造成大量伤害。`,
          defense:`第${G.customSkills.length}自创魂技。感悟天地防御之道，创造出坚固的防御技能。`,
          control:`第${G.customSkills.length}自创魂技。领悟精神控制之妙，创造出控制类技能。`,
          boost:`第${G.customSkills.length}自创魂技。激发自身潜能，创造出增幅类技能。`
        };
        managedTimeout(() => {
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


function buildLoverWheel(){
  // Determine target pool based on player gender
  let poolKey = G.gender?.id === 'female' ? 'male_target' : 'female_target';
  if(G.gender?.id === 'male') poolKey = 'female_target';
  if(G.gender?.id === 'none') poolKey = Math.random() < 0.5 ? 'male_target' : 'female_target';

  let pool = LOVER_POOL[poolKey] || LOVER_POOL.female_target;

  // Adjust weights based on player personality (attraction to certain traits)
  let playerTrait = G.personality?.id || 'calm';
  let playerCharm = G.appearance?.attr?.charm || 5;

  // Copy pool and adjust weights
  let items = pool.map(l => {
    let adjustedWeight = l.weight;
    // Opposites attract: if player has certain trait, opposite trait gets bonus
    let traitBonus = {
      gentle: {proud: 1.3, crafty: 1.1},
      proud: {gentle: 1.3, cheerful: 1.2},
      hotblood: {calm: 1.4, crafty: 0.8},
      calm: {hotblood: 1.3, cheerful: 1.1},
      crafty: {gentle: 1.2, hotblood: 0.9},
      cheerful: {proud: 1.2, calm: 1.1},
      mysterious: {cheerful: 1.3, gentle: 1.2},
      ruthless: {gentle: 1.5, cheerful: 1.3},
      lazy: {proud: 1.2, crafty: 0.9}
    };
    let bonusMap = traitBonus[playerTrait] || {};
    if(bonusMap[l.trait]) adjustedWeight *= bonusMap[l.trait];
    // Charm bonus: higher charm = higher chance of meeting higher quality lover
    adjustedWeight *= (0.8 + playerCharm * 0.04);
    return {...l, weight: Math.round(adjustedWeight)};
  });

  // Add colors
  let colors = ['#ff66aa','#aa66ff','#66aaff','#ffaa44','#44ddaa','#ff4444','#ffdd44','#aa88ff'];
  items.forEach((it,i) => {it.color = colors[i % colors.length];});
  return items;
}

function openLoverWheel(callback){
  wheelState.data = buildLoverWheel();
  wheelState.callback = callback;
  wheelState.type = 'lover';
  openWheelBase('邂逅...', '命运的转盘在转动，你会遇见谁？', wheelState.data, spinLoverWheel);
}

function spinLoverWheel(){
  if(wheelState.spinning) return;
  wheelState.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let { selected, finalAngle } = calcWheelSpinResult(wheelState.data);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    wheelState.spinning = false;
    btn.classList.remove('btn-disabled');
    // Determine success chance based on charm and personality
    let charm = G.appearance?.attr?.charm || 5;
    let romanceTrait = G.personality?.traits?.romance || 1;
    let successChance = 0.3 + charm * 0.05 + romanceTrait * 0.1;
    let success = Math.random() < successChance;

    let area = document.getElementById('mini-wheel-result-area');
    if(success){
      G.hasSpouse = true;
      G.spouse = {name: selected.name, trait: selected.trait, soul: selected.soul};
      area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">一见钟情！</h3><p>你遇到了 <strong style="color:${selected.color}">${selected.name}</strong></p><p>性格：${PERSONALITIES.find(p=>p.id===selected.trait)?.name||selected.trait} | ${selected.soul}</p><p style="color:var(--cyan);margin-top:8px;">你们结为道侣，从此携手共闯斗罗大陆！</p></div>`;
    }else{
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


// ============================================================
// COMBAT POWER SYSTEM (战力系统)
// ============================================================
function calculateCombatPower(entity, isEnemy = false){
  if(isEnemy){
    let level = entity.level || 1;
    let power = entity.power || 1;
    return Math.floor(level * 100 * power);
  }
  let base = (G.soulPower || 0) * 200;
  let ringBonus = 0;
  if(Array.isArray(G.soulRings) && G.soulRings.length > 0){
    G.soulRings.forEach((r, idx) => {
      let years = r.years || 0;
      let ringMultiplier = 1 + idx * 0.2;
      if(years >= 1000000) ringBonus += 1200 * ringMultiplier;
      else if(years >= 100000) ringBonus += 500 * ringMultiplier;
      else if(years >= 10000) ringBonus += 200 * ringMultiplier;
      else if(years >= 1000) ringBonus += 60 * ringMultiplier;
      else if(years >= 100) ringBonus += 20 * ringMultiplier;
      else ringBonus += 5 * ringMultiplier;
      if(r.skills && r.skills.length){
        r.skills.forEach(s => {
          let skillBonus = s.type === 'control' ? 100 : (s.type === 'attack' ? 90 : (s.type === 'defense' ? 80 : (s.type === 'boost' ? 150 : 70)));
          ringBonus += skillBonus;
        });
      }
    });
  }
  let boneBonus = 0;
  if(G.soulBones && G.soulBones.length > 0){
    boneBonus = G.soulBones.length * 300;
    if(G.soulBones.length >= 4) boneBonus += 500;
    if(G.soulBones.length >= 6) boneBonus += 1000;
  }
  let customSkillBonus = 0;
  if(G.customSkills && G.customSkills.length > 0){
    G.customSkills.forEach(s => {
      let type = s.type || 'attack';
      if(type === 'control') customSkillBonus += 200;
      else if(type === 'attack') customSkillBonus += 180;
      else if(type === 'defense') customSkillBonus += 150;
      else if(type === 'boost') customSkillBonus += 120;
      else customSkillBonus += 100;
    });
  }
  let qualityBonus = 1;
  if(G.martialSoul?.quality){
    let q = G.martialSoul.quality;
    if(q.includes('顶级')) qualityBonus = 1.6;
    else if(q.includes('变异')) qualityBonus = 1.35;
    else if(q.includes('优秀')) qualityBonus = 1.15;
    else if(q.includes('双生')) qualityBonus = 2.2;
  }
  let bloodlineBonus = G.bloodline ? 1.3 : 1;
  // 血脉属性精细化加成
  let bloodlineAttrBonus = 1;
  if(G.bloodline?.attr){
    let ba = G.bloodline.attr;
    if(typeof ba.power === 'number') bloodlineAttrBonus *= ba.power;
    if(typeof ba.defense === 'number') bloodlineAttrBonus *= (1 + (ba.defense - 1) * 0.5);
    if(typeof ba.speed === 'number') bloodlineAttrBonus *= (1 + (ba.speed - 1) * 0.3);
    if(typeof ba.control === 'number') bloodlineAttrBonus *= (1 + (ba.control - 1) * 0.4);
    if(typeof ba.heal === 'number') bloodlineAttrBonus *= (1 + (ba.heal - 1) * 0.2);
    if(typeof ba.space === 'number') bloodlineAttrBonus *= ba.space;
    if(typeof ba.time === 'number') bloodlineAttrBonus *= ba.time;
    if(typeof ba.devour === 'number') bloodlineAttrBonus *= ba.devour;
  }
  // 降生地点属性加成
  let birthplaceBonus = 1;
  if(G.birthplace?.attr){
    let ba = G.birthplace.attr;
    if(typeof ba.power === 'number') birthplaceBonus *= ba.power;
    if(typeof ba.risk === 'number') birthplaceBonus *= (1 + (ba.risk - 1) * 0.3);
    if(typeof ba.secret === 'number') birthplaceBonus *= (1 + (ba.secret - 1) * 0.4);
    if(typeof ba.divine === 'number') birthplaceBonus *= ba.divine;
    if(typeof ba.tech === 'number') birthplaceBonus *= (1 + (ba.tech - 1) * 0.5);
    if(typeof ba.spirit === 'number') birthplaceBonus *= (1 + (ba.spirit - 1) * 0.6);
    if(typeof ba.alien === 'number') birthplaceBonus *= (1 + (ba.alien - 1) * 0.5);
  }
  let soulCoreBonus = 1;
  if(G.soulCore >= 1) soulCoreBonus = 1.35;
  if(G.soulCore >= 2) soulCoreBonus = 1.7;
  if(G.soulCore >= 3) soulCoreBonus = 2.2;
  let coreAttrBonus = 1;
  if(Array.isArray(G.soulCores)){
    G.soulCores.forEach(core => {
      if(core.attrs){
        Object.values(core.attrs).forEach(v => {
          if(typeof v === 'number') coreAttrBonus *= (1 + v);
        });
      }
    });
  }
  // 神力技能加成（神和神兽专属）
  let divineSkillBonus = 1;
  if((G.identityType === 'god' || G.identityType === 'divine_beast') && Array.isArray(G.divineSkills)){
    divineSkillBonus = 1 + G.divineSkills.length * 0.15;
  }
  let total = Math.floor((base + ringBonus + boneBonus + customSkillBonus) * qualityBonus * bloodlineBonus * bloodlineAttrBonus * birthplaceBonus * soulCoreBonus * coreAttrBonus * divineSkillBonus);
  return total;
}

function getCombatPowerRating(cp){
  if(cp >= 50000) return {name:'超神级',color:'#ff0000'};
  if(cp >= 30000) return {name:'神级',color:'#ffdd44'};
  if(cp >= 15000) return {name:'极限斗罗级',color:'#ff6644'};
  if(cp >= 8000) return {name:'封号斗罗级',color:'#aa66ff'};
  if(cp >= 4000) return {name:'魂斗罗级',color:'#44ddaa'};
  if(cp >= 2000) return {name:'魂圣级',color:'#4488ff'};
  if(cp >= 1000) return {name:'魂帝级',color:'#88aaff'};
  if(cp >= 500) return {name:'魂王级',color:'#aaddaa'};
  if(cp >= 200) return {name:'魂宗级',color:'#cccc66'};
  if(cp >= 100) return {name:'魂尊级',color:'#aaaaaa'};
  return {name:'魂士级',color:'#888888'};
}

function buildEnemyWheel(){
  let pool;
  if(G.identityType === 'soul_beast'){
    pool = BEAST_ENEMY_POOL.filter(e => {
      // 天劫雷罚只有十万年未化形的魂兽才会触发
      if(e.type === 'heaven') return (G.beastYears >= 100000 && !G.transformed);
      return true;
    });
  }else{
    let timelineId = G.timeline?.id || 'douluo1';
    pool = ENEMY_POOL[timelineId] || ENEMY_POOL.douluo1;
    pool = [...pool];
  }
  let playerEnemyTrait = G.personality?.traits?.enemy || 1;

  // Adjust weights based on personality
  let items = pool.map(e => {
    let w = e.weight * playerEnemyTrait;
    // Fierce appearance attracts more enemies
    if(G.appearance?.id === 'fierce') w *= 1.3;
    if(G.appearance?.id === 'divine') w *= 1.5; // divine beauty attracts jealousy
    return {...e, weight: Math.round(w)};
  });

  let colors = ['#aa2222','#662222','#222266','#226622','#662266','#ff4444','#aa44aa','#444444'];
  items.forEach((it,i) => {it.color = colors[i % colors.length];});
  return items;
}

function openEnemyWheel(callback){
  wheelState.data = buildEnemyWheel();
  wheelState.callback = callback;
  wheelState.type = 'enemy';
  let label = (G.timeline?.id === 'godrealm') ? '神界动乱！' : '强敌来袭！';
  openWheelBase(label, '命运的转盘在转动，你的对手是谁？', wheelState.data, spinEnemyWheel);
}

function renderEnemyResult(title, titleColor, selected, enemyLevel, cpDisplay, bodyText, effectText, effectColor, extraHtml){
  let area = document.getElementById('mini-wheel-result-area');
  area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${titleColor}">${title}</h3><p>强敌：<strong style="color:${selected.color}">${selected.name}</strong>（${enemyLevel}级）</p>${selected.desc?`<p style="font-size:12px;color:var(--gray);">${selected.desc}</p>`:''}${cpDisplay}<p>${bodyText}</p><p style="color:${effectColor};margin-top:8px;">${effectText}</p>${extraHtml||''}</div>`;
}

function spinEnemyWheel(){
  if(wheelState.spinning) return;
  wheelState.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let { selected, finalAngle } = calcWheelSpinResult(wheelState.data);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    wheelState.spinning = false;
    btn.classList.remove('btn-disabled');
    // Determine enemy power relative to player
    let enemyLevel = Math.max(1, Math.round(G.soulPower * selected.power + (Math.random()*10 - 5)));
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
    let enemyCP = calculateCombatPower({level: enemyLevel, power: selected.power}, true);
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
    if(hasControlSkill && enemyLevel <= G.soulPower + 5) winChance += 0.08;
    if(hasBoostSkill) winChance += 0.05;
    if(hasDefenseSkill && diff < 0) winChance += 0.06;
    if(numBones >= 4) winChance += 0.05;
    if(numRings >= 7) winChance += 0.04;

    if(isFierce) winChance += 0.03;
    if(isDivine && isEvil) winChance += 0.06;
    winChance = Math.max(0.05, Math.min(0.95, winChance));
    win = Math.random() < winChance;

    let playerCPRating = getCombatPowerRating(playerCP);
    let enemyCPRating = getCombatPowerRating(enemyCP);
    let cpDisplay = `<p style="font-size:12px;color:var(--gray);margin-top:6px;">我方战力：<span style="color:${playerCPRating.color};">${playerCP}</span>（${playerCPRating.name}） | 敌方战力：<span style="color:${enemyCPRating.color};">${enemyCP}</span>（${enemyCPRating.name}）</p>`;

    let enemyInfo = {name: selected.name, level: enemyLevel, type: selected.type, cp: enemyCP};

    if(canEscape && !win){
      // Beast vs human: escape option on defeat
      let escapeChance = 0.3 + (G.bloodline?.attr?.speed || 0) * 0.1;
      let escaped = Math.random() < escapeChance;
      if(escaped){
        let lossYears = 1 + Math.floor(Math.random() * 3);
        G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
        syncBeastSoulPower();
        G.enemies.push({...enemyInfo, escaped: true});
        renderEnemyResult('成功逃脱！','var(--green)',selected,enemyLevel,cpDisplay,'你察觉到危险，凭借魂兽的本能迅速逃离了人类的猎杀范围！',`逃脱成功，仅损失${lossYears}年修为`,'var(--gold)');
      }else{
        // Failed to escape, fight and lose
        let lossCap = isEvil ? 10 : 5;
        let loss = Math.min(Math.floor(enemyLevel * 0.3), lossCap);
        let lossYears = Math.floor(loss * 10 + Math.random() * 20);
        G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
        syncBeastSoulPower();
        G.enemies.push({...enemyInfo, defeated: true});
        if(Math.random() < 0.15 * selected.power){
          G.alive = false;
          renderEnemyResult('命丧猎魂师之手','var(--red)',selected,enemyLevel,cpDisplay,'你试图逃跑但失败了，最终被人类猎魂师击杀，成为了他们的魂环...',`年限-${lossYears}年`,'var(--red)');
        }else{
          renderEnemyResult('逃脱失败','var(--red)',selected,enemyLevel,cpDisplay,'你没能成功逃脱，被人类重创后勉强挣脱...',`年限-${lossYears}年`,'var(--red)');
        }
      }
    }else if(win){
      let reward = Math.min(Math.floor(enemyLevel * 0.5), 10);
      if(isBeast){
        // Beast wins: gain years instead of soul power
        let gainYears = 100 + Math.floor(Math.random() * 200);
        G.beastYears = (G.beastYears || 0) + gainYears;
        syncBeastSoulPower();
        G.gold = (G.gold||0) + Math.floor(enemyLevel * 5);
        G.enemies.push(enemyInfo);
        renderEnemyResult('战斗胜利！','var(--gold)',selected,enemyLevel,cpDisplay,'你成功击败了入侵者，吞噬了对方的能量！',`年限+${gainYears}年 | 获得${Math.floor(enemyLevel*5)}金魂币`,'var(--green)');
      }else{
        G.soulPower = Math.min(G.soulPower + reward, G.maxLevel);
        G.gold = (G.gold||0) + Math.floor(enemyLevel * 10);
        G.enemies.push(enemyInfo);
        let extraText = '';
        if(isFierce) extraText = '<br><span style="color:var(--cyan);font-size:12px;">你的凶相让敌人心生畏惧，战斗更加顺利。</span>';
        if(hasControlSkill) extraText += '<br><span style="color:var(--purple);font-size:12px;">你用控制系自创魂技牵制了敌人，占据了上风！</span>';
        renderEnemyResult('战斗胜利！','var(--gold)',selected,enemyLevel,cpDisplay,'你成功击败了对手！',`魂力+${reward}级 | 获得${Math.floor(enemyLevel*10)}金魂币`,'var(--green)',extraText);
      }
    }else{
      // Evil soul masters drain more soul power
      let lossCap = isEvil ? 10 : 5;
      let loss = Math.min(Math.floor(enemyLevel * 0.3), lossCap);

      if(isBeast){
        // Beast defeat: lose years
        let lossYears = Math.floor(loss * 10 + Math.random() * 20);
        G.beastYears = Math.max((G.beastYears || 0) - lossYears, 0);
        syncBeastSoulPower();
        G.enemies.push({...enemyInfo, defeated: true});
        if(Math.random() < 0.15 * selected.power){
          G.alive = false;
          renderEnemyResult('陨落','var(--red)',selected,enemyLevel,cpDisplay,'实力差距太大，你倒在了强敌的爪下...',`年限-${lossYears}年`,'var(--red)');
        }else{
          renderEnemyResult('战斗失败','var(--red)',selected,enemyLevel,cpDisplay,'你被击败了，身受重伤...',`年限-${lossYears}年`,'var(--red)');
        }
      }else{
        G.soulPower = Math.max(G.soulPower - loss, 1);
        G.enemies.push({...enemyInfo, defeated: true});

        // Special evil master interactions based on gender/appearance
        let specialResult = false;
        if(isEvil && isFemale && charm >= 8 && Math.random() < 0.3){
          let drainExtra = Math.min(Math.floor(enemyLevel * 0.2), 5);
          G.soulPower = Math.max(G.soulPower - drainExtra, 1);
          renderEnemyResult('邪魂师的觊觎','var(--red)',selected,enemyLevel,cpDisplay,'邪魂师被你的容貌所吸引，没有直接杀你，而是用邪术大量吸取了你的魂力，欲将你掳走修炼...',`魂力-${loss + drainExtra}级（被吸取）`,'var(--red)');
          specialResult = true;
        }else if(isEvil && isDivine && Math.random() < 0.2){
          let recover = Math.min(3, loss);
          G.soulPower = Math.min(G.soulPower + recover, G.maxLevel);
          renderEnemyResult('神辉护体！','var(--gold)',selected,enemyLevel,cpDisplay,'你身上散发的神辉让邪魂师痛苦不堪，他的邪术被净化了大半！',`魂力-${loss}级，但神辉净化后恢复${recover}级`,'var(--gold)');
          specialResult = true;
        }else if(isEvil){
          renderEnemyResult('邪魂侵蚀','var(--red)',selected,enemyLevel,cpDisplay,'你被邪魂师击败，邪术侵蚀了你的经脉，大量魂力被吸取...',`魂力-${loss}级`,'var(--red)');
        }

        if(!specialResult){
          if(Math.random() < 0.15 * selected.power){
            G.alive = false;
            if(isEvil){
              renderEnemyResult('魂飞魄散','var(--red)',selected,enemyLevel,cpDisplay,'邪魂师将你彻底吞噬，连灵魂都没有留下...',`魂力-${loss}级`,'var(--red)');
            }else{
              renderEnemyResult('命丧敌手！','var(--red)',selected,enemyLevel,cpDisplay,'实力差距太大，你倒在了血泊之中...',`魂力-${loss}级`,'var(--red)');
            }
          }else{
            if(isFierce){
              renderEnemyResult('战斗失败','var(--red)',selected,enemyLevel,cpDisplay,'你被击败了，但你的凶相让敌人不敢追击，得以保全性命。',`魂力-${loss}级`,'var(--red)');
            }else{
              renderEnemyResult('战斗失败','var(--red)',selected,enemyLevel,cpDisplay,'你被击败了，身受重伤...',`魂力-${loss}级`,'var(--red)');
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
let globalAchievements = [];

function loadGlobalAchievements(){
  try{globalAchievements=JSON.parse(localStorage.getItem('dl_achievements'))||[];}catch(e){globalAchievements=[];}
}
function saveGlobalAchievements(){
  localStorage.setItem('dl_achievements',JSON.stringify(globalAchievements));
}
function loadSaves(){
  try{return JSON.parse(localStorage.getItem('dl_saves'))||[];}catch(e){return[];}
}
function saveSaves(saves){
  localStorage.setItem('dl_saves',JSON.stringify(saves));
}

// ============================================================
// PARTICLES
// ============================================================
function initParticles(){
  const c=document.getElementById('particles');
  for(let i=0;i<30;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.left=Math.random()*100+'%';
    p.style.animationDuration=(8+Math.random()*12)+'s';
    p.style.animationDelay=Math.random()*10+'s';
    p.style.width=p.style.height=(1+Math.random()*2)+'px';
    c.appendChild(p);
  }
}

// ============================================================
// SCREEN MANAGEMENT
// ============================================================

// ============================================================
// WEIGHTED RANDOM
// ============================================================
function weightedRandom(items,weightKey='weight'){
  if(!items||items.length===0)return null;
  let total=items.reduce((s,i)=>s+i[weightKey],0);
  if(total<=0)return null;
  let r=Math.random()*total;
  for(let item of items){r-=item[weightKey];if(r<=0)return item;}
  return items[items.length-1];
}

// ============================================================
// WHEEL SYSTEM
// ============================================================
function drawWheel(items,labelKey,colorKey){
  drawWheelCanvas(document.getElementById('wheel-canvas'), items, {
    labelKey, colorKey, radius:340, fontSize:22, textX:20, textY:6, ringGap:5, ringWidth:4, decoration:true, maxLabel:8
  });
}

// ============================================================
// GAME FLOW
// ============================================================
// ============================================================
// QUICK RANDOM SYSTEM
// ============================================================
function generateRandomCharacter(forceType){
  // forceType: 'human' or 'soul_beast'
  let c = {};
  c.timeline = weightedRandom(TIMELINES);
  c.identityType = forceType;

  if(forceType === 'human'){
    c.identity = weightedRandom(HUMAN_BACKGROUNDS);
    let genderPool = GENDERS.filter(g=>g.id!=='none');
    c.gender = weightedRandom(genderPool);
    c.personality = weightedRandom(PERSONALITIES);
    c.appearance = weightedRandom(APPEARANCES);
    // Generate martial soul
    let tempG = {identity:c.identity, identityType:'human'};
    let oldG = G;
    G = tempG;
    let qItems = buildQualityWheel();
    let q = weightedRandom(qItems);
    if(q.tier === 'dual'){
      let s1 = randomSoulName('top');
      let s2 = randomSoulName('top');
      c.martialSoul = {
        name:'双生武魂', type:'双生武魂', quality:'顶级+', qColor:'#ff4444',
        example:`${s1.name} / ${s2.name}`, isDual:true, activeIndex:0,
        souls:[
          {...s1, rings:[], skills:[], _baseName:s1.name, evolutionStage:0},
          {...s2, rings:[], skills:[], _baseName:s2.name, evolutionStage:0}
        ]
      };
    }else{
      let s = randomSoulName(q.tier);
      c.martialSoul = {...s, example:s.name, rings:[], skills:[], _baseName:s.name, evolutionStage:0};
    }
    // Innate power based on quality
    let inatePools = [
      {name:'先天魂力0级',min:0,max:0,weight:20,ratingColor:'#888'},
      {name:'先天魂力1~5级',min:1,max:5,weight:50,ratingColor:'#4488ff'},
      {name:'先天魂力6~9级',min:6,max:9,weight:25,ratingColor:'#ffdd44'},
      {name:'先天满魂力（10级）',min:10,max:10,weight:5,ratingColor:'#ff4444'}
    ];
    if(q.tier==='top'||q.tier==='dual') inatePools[3].weight=40;
    else if(q.tier==='mutant') inatePools[2].weight=45;
    else if(q.tier==='good') inatePools[1].weight=65;
    let innate = weightedRandom(inatePools);
    c.innatePower = innate.min===innate.max ? innate.min : innate.min+Math.floor(Math.random()*(innate.max-innate.min+1));
    c.innateRating = innate.name.replace('先天','');
    c.innateRatingColor = innate.ratingColor;
    G = oldG;
    c.soulPower = c.innatePower;
  }else{
    // Soul beast
    c.identity = weightedRandom(BEAST_RACES);
    c.bloodline = weightedRandom(BEAST_BLOODLINES);
    // Birthplace filtered by timeline
    let bps = getBeastBirthplaces(c.timeline.id);
    c.birthplace = bps.length > 0 ? weightedRandom(bps) : {name:'未知之地',desc:'一片未知的区域。'};
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

let _quickRandomHuman = null;
let _quickRandomBeast = null;

function startQuickRandom(){
  _quickRandomHuman = generateRandomCharacter('human');
  _quickRandomBeast = generateRandomCharacter('soul_beast');
  renderQuickRandom();
}

function rerollQuickRandom(){
  _quickRandomHuman = generateRandomCharacter('human');
  _quickRandomBeast = generateRandomCharacter('soul_beast');
  renderQuickRandom();
}

function startGameFromQuick(type){
  let c = type === 'human' ? _quickRandomHuman : _quickRandomBeast;
  G = createDefaultState();
  G.timeline = c.timeline;
  G.identityType = c.identityType;
  G.identity = c.identity;
  G.gender = c.gender || {name:'男'};
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

  if(type === 'soul_beast'){
    G.bloodline = c.bloodline;
    G.birthplace = c.birthplace;
    G.beastYears = 0;
    syncBeastSoulPower();
  }

  if(G.timeline.id==='douluo4'){G.maxLevel=150;G.maxAge=200;}
  else if(G.timeline.id==='godrealm'){G.maxLevel=200;G.maxAge=999;}
  else{G.maxLevel=99;G.maxAge=150;}

  showAwakening();
}

function createDefaultState(){
  return {
    timeline:null,innatePower:0,innateRating:'',innateRatingColor:'#888',
    identity:null,identityType:'human',gender:{name:'男'},
    personality:null,appearance:null,
    martialSoul:null,soulPower:0,age:0,maxAge:120,maxLevel:99,
    soulRings:[],soulBones:[],battleArmor:0,customSkills:[],crossSkills:[],
    companions:[],faction:'',factionReputation:0,hasMaster:false,masterBonus:false,
    hasSpouse:false,spouse:null,enemies:[],
    transformed:false,bloodline:null,birthplace:null,bloodlineSkills:[],
    alive:true,events:[],keyEvents:[],achievementsEarned:[],gold:0,merit:0,
    yearEvents:[],autoMode:false,soulCore:0,soulCores:[],
    divineSkillsTotal:0,divineSkills:[],divineSkillsUnlocked:0
  };
}

function startNewGame(){
  clearAllTimers();
  G=createDefaultState();
  wheelIndex=0;

  // Build wheel queue - start with timeline only, others added dynamically
  wheelQueue=[
    {type:'timeline',label:'抽取时间线',centerText:'时',items:TIMELINES,labelKey:'name',colorKey:'eraColor'}
  ];

  showScreen('screen-wheel');
  document.getElementById('wheel-spin-btn').style.display='';
  setupNextWheel();
}

function setupNextWheel(){
  const step=wheelQueue[wheelIndex];
  const canvas=document.getElementById('wheel-canvas');
  document.getElementById('wheel-step').textContent=`第 ${wheelIndex+1}/${wheelQueue.length} 次抽取`;
  document.getElementById('wheel-label').textContent=step.label;
  document.getElementById('wheel-result-area').innerHTML='';
  document.getElementById('wheel-center').textContent=step.centerText||'转';
  currentWheelData=step.items;
  drawWheel(currentWheelData,step.labelKey||'name',step.colorKey||'eraColor');
  void canvas.offsetWidth;
  canvas.style.transition='none';
  canvas.style.transform='rotate(0deg)';
}

function pushNextWheel(type, label, centerText, items, options = {}) {
  const { labelKey = 'name', colorKey = 'color', colorFn = null, extra = null } = options;
  items.forEach((it, i) => {
    if (colorFn) {
      it.eraColor = colorFn(it, i, items.length);
    } else if (colorKey && it[colorKey]) {
      it.eraColor = it[colorKey];
    } else {
      it.eraColor = `hsl(${(i / items.length) * 280}, 50%, 30%)`;
    }
  });
  const entry = { type, label, centerText, items, labelKey, colorKey: 'eraColor' };
  if (extra) Object.assign(entry, extra);
  wheelQueue.push(entry);
}

function onWheelResult(item){
  const area=document.getElementById('wheel-result-area');
  const hint=document.getElementById('wheel-hint');
  const canvas=document.getElementById('wheel-canvas');

  switch(wheelQueue[wheelIndex].type){
    case 'timeline':
      G={...createDefaultState(),timeline:item};
      area.innerHTML=`<div class="wheel-result"><h3>${item.name}</h3><p>${item.era}</p><p style="margin-top:8px;color:var(--gray)">${item.desc}</p></div>`;
      hint.textContent='时代已确定，接下来抽取身份种族...';
      // Build identity type wheel: human/beast for normal, god/divine_beast for godrealm
      let idTypePool;
      if(item.id==='godrealm'){idTypePool=[...IDENTITY_TYPES.god, ...IDENTITY_TYPES.divine_beast];}
      else{idTypePool=[...IDENTITY_TYPES.human,...IDENTITY_TYPES.soul_beast];}
      pushNextWheel('identity_type', '抽取种族', '族', idTypePool, {
        colorFn: (it, i, len) => it.color || `hsl(${(i/len)*280+120},50%,30%)`
      });
      break;
    case 'identity_type':
      G.identityType=item.id;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      if(item.id==='human'){
        hint.textContent='你是人类，接下来抽取出身背景...';
        pushNextWheel('background', '抽取背景', '出', HUMAN_BACKGROUNDS, {
          colorFn: (it, i, len) => `hsl(${(i/len)*200+200},50%,30%)`
        });
      }else if(item.id==='soul_beast'){
        hint.textContent='你是魂兽，接下来抽取种族年限...';
        pushNextWheel('beast_race', '抽取种族', '族', BEAST_RACES, {
          colorFn: (it, i, len) => `hsl(${(i/len)*60},50%,30%)`
        });
      }else if(item.id==='god'){
        hint.textContent='你是神祇，接下来抽取神位...';
        pushNextWheel('god_tier', '抽取神位', '神', GOD_TIERS, {
          colorFn: (it, i, len) => `hsl(${(i/len)*60+40},50%,30%)`
        });
      }else if(item.id==='divine_beast'){
        hint.textContent='你是神兽，接下来抽取神兽种族...';
        pushNextWheel('divine_beast_race', '抽取神兽种族', '兽', DIVINE_BEAST_RACES, {
          colorFn: (it, i, len) => `hsl(${(i/len)*80+20},50%,35%)`
        });
      }
      break;
    case 'background':
      G.identity=item;
      area.innerHTML=`<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='背景已定，接下来抽取性别...';
      let bgGenderItems = GENDERS.filter(g=>g.id!=='none');
      pushNextWheel('gender', '抽取性别', '性', bgGenderItems);
      break;
    case 'beast_race':
      G.identity=item;
      G.gender = Math.random()<0.5 ? {id:'male',name:'雄',desc:''} : {id:'female',name:'雌',desc:''};
      area.innerHTML=`<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='种族已定，接下来抽取血脉系...';
      pushNextWheel('beast_bloodline', '抽取血脉系', '脉', BEAST_BLOODLINES);
      break;
    case 'divine_beast_race':
      G.identity=item;
      G.gender = Math.random()<0.5 ? {id:'male',name:'雄',desc:''} : {id:'female',name:'雌',desc:''};
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='神兽种族已定，接下来抽取神兽血脉...';
      pushNextWheel('beast_bloodline', '抽取神兽血脉', '脉', BEAST_BLOODLINES);
      break;
    case 'god_tier':
      G.identity=item;
      area.innerHTML=`<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='神位等级已定，接下来抽取神位名称...';
      let posPool = GOD_POSITIONS[item.id] || GOD_POSITIONS.god_official;
      posPool = posPool.map((p,i)=>({...p, weight: 1}));
      pushNextWheel('god_position', '抽取神位名称', '神', posPool);
      break;
    case 'god_position':
      G.godPosition = item;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='神位已定，接下来抽取神器...';
      let artPool = GOD_ARTIFACTS[G.identity?.id] || GOD_ARTIFACTS.god_official;
      artPool = artPool.map((a,i)=>({...a, weight: 1}));
      pushNextWheel('god_artifact', '抽取神器', '器', artPool);
      break;
    case 'god_artifact':
      G.godArtifact = item;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='神器已定，接下来抽取神界势力...';
      pushNextWheel('god_faction', '抽取神界势力', '势', GOD_FACTIONS_POOL);
      break;
    case 'god_faction':
      G.faction = item.name;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='势力已定，接下来抽取性别...';
      let godGenderItems2 = GENDERS.filter(g=>g.id!=='none');
      pushNextWheel('gender', '抽取性别', '性', godGenderItems2);
      break;
    case 'gender':
      G.gender=item;
      area.innerHTML=`<div class="wheel-result"><h3>性别：${item.name}</h3><p>${item.desc}</p></div>`;
      if(G.identityType==='soul_beast'){
        hint.textContent='接下来抽取血脉系...';
        pushNextWheel('beast_bloodline', '抽取血脉系', '脉', BEAST_BLOODLINES);
      }else if(G.identityType==='god'){
        hint.textContent='神祇无需武魂觉醒，接下来抽取性格...';
        pushNextWheel('personality', '抽取性格', '性', PERSONALITIES);
      }else{
        if(G.timeline.factions && (G.identity.id==='sect_disciple'||G.identity.id==='family_child'||G.identity.id==='noble')){
          G.faction=G.timeline.factions[Math.floor(Math.random()*G.timeline.factions.length)];
          area.innerHTML+=`<p style="color:var(--cyan);margin-top:8px;">所属势力：<b>${G.faction}</b></p>`;
        }
        hint.textContent='接下来抽取觉醒个数...';
        let awItems = AWAKENING_COUNT.map(a => ({...a}));
        if(G.identity.id==='family_child'){awItems[1].weight=40;awItems[2].weight=18;awItems[3].weight=7;}
        if(G.identity.id==='noble'){awItems[1].weight=35;awItems[2].weight=15;awItems[3].weight=5;}
        pushNextWheel('awaken_count', '抽取觉醒个数', '觉', awItems);
      }
      break;
    case 'beast_bloodline':
      G.bloodline = item;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}血脉</h3><p>${item.desc}</p></div>`;
      hint.textContent='血脉已定，抽取降生地点...';
      let birthplaces = getBeastBirthplaces(G.timeline.id);
      pushNextWheel('beast_birthplace', '抽取降生地点', '地', birthplaces);
      break;
    case 'beast_birthplace':
      G.birthplace = item;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='降生地点已定，接下来抽取性格...';
      pushNextWheel('personality', '抽取性格', '性', PERSONALITIES);
      break;
    case 'awaken_count':
      G._awakenCount = item.count;
      G._awakenedSouls = [];
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`;
      // First soul: if has faction, use faction soul directly (skip quality wheel)
      if(G.faction && FACTION_SOULS[G.faction]){
        let factionSouls = FACTION_SOULS[G.faction];
        let fSoulName = factionSouls[Math.floor(Math.random()*factionSouls.length)];
        G._awakenedSouls.push({name:fSoulName, source:'faction', faction:G.faction});
        area.innerHTML+=`<p style="color:var(--cyan);margin-top:8px;">势力专属武魂：<b>${fSoulName}</b>（${G.faction}）</p>`;
        hint.textContent='第一个是势力专属武魂，继续抽取品质...';
      }else{
        hint.textContent='接下来抽取武魂品质...';
      }
      let qualityItems = buildQualityWheel();
      pushNextWheel('soul_quality', '抽取武魂品质', '品', qualityItems);
      break;
    case 'soul_quality':
      G._soulQualityTier = item.tier;
      G._soulQualityName = item.name;
      G._soulQualityColor = item.color;
      let soulIdx = (G._awakenedSouls||[]).length + 1;
      let totalSouls = G._awakenCount || 1;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">第${soulIdx}个武魂品质：${item.name}</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gray);">身份影响概率：${G.identity.name}（${soulIdx}/${totalSouls}）</p></div>`;
      hint.textContent='品质已定，从千种武魂中觉醒...';
      let nameItems = pickNameWheelItems(item.tier, 12);
      nameItems.forEach(n => {n.weight = 1;});
      pushNextWheel('soul_name', `第${soulIdx}个武魂（千中选一）`, '魂', nameItems, {
        colorKey: 'qColor',
        extra: { tier: item.tier }
      });
      break;
    case 'soul_name':
      let tier = wheelQueue[wheelIndex].tier;
      let actualSoul = randomSoulName(tier);
      let isDual = (tier === 'dual');

      if(isDual){
        let soul1 = randomSoulName('top');
        let soul2 = randomSoulName('top');
        G._awakenedSouls = G._awakenedSouls || [];
        G._awakenedSouls.push({
          name:`${soul1.name} + ${soul2.name}`, type:'双生武魂', quality:'顶级+', qColor:'#ff4444',
          isDual:true, soul1:{...soul1}, soul2:{...soul2}
        });
        area.innerHTML=`<div class="wheel-result"><h3 style="color:#ff4444;">双生武魂觉醒！</h3><p>第一武魂：<span style="color:${soul1.qColor}">${soul1.name}</span>（${soul1.type}）</p><p>第二武魂：<span style="color:${soul2.qColor}">${soul2.name}</span>（${soul2.type}）</p></div>`;
      }else{
        G._awakenedSouls = G._awakenedSouls || [];
        G._awakenedSouls.push({...actualSoul});
        area.innerHTML=`<div class="wheel-result"><h3 style="color:${actualSoul.qColor}">武魂：${actualSoul.name}</h3><p>类型：${actualSoul.type} | 品质：<span style="color:${actualSoul.qColor}">${actualSoul.quality}</span></p></div>`;
      }

      // Check if more souls to awaken
      let soulsDone = G._awakenedSouls.length;
      let hasFactionSoul = G._awakenedSouls.some(s=>s.source==='faction');
      let soulsTarget = (hasFactionSoul ? 1 : 0) + (G._awakenCount || 1);

      if(soulsDone < soulsTarget && !isDual){
        hint.textContent=`还有${soulsTarget - soulsDone}个武魂要觉醒...`;
        let qualityItems = buildQualityWheel();
        pushNextWheel('soul_quality', '抽取武魂品质', '品', qualityItems);
      }else{
        // All done - compile final martial soul
        let hasDualEntry = G._awakenedSouls.some(s=>s.isDual);
        if(G._awakenedSouls.length === 1 && !hasDualEntry){
          // Single soul
          let s = G._awakenedSouls[0];
          G.martialSoul = {
            ...s, example:s.name, rings:[], skills:[], _baseName:s.name, evolutionStage:0
          };
        }else if(hasDualEntry){
          // Dual soul - store both with independent rings
          let entry = G._awakenedSouls.find(s=>s.isDual);
          G.martialSoul = {
            id:'dual', name:'双生武魂', type:'双生武魂', quality:'顶级+', qColor:'#ff4444',
            example:`${entry.soul1.name} / ${entry.soul2.name}`,
            isDual:true, activeIndex:0,
            souls:[
              {...entry.soul1, rings:[], skills:[], _baseName:entry.soul1.name, evolutionStage:0},
              {...entry.soul2, rings:[], skills:[], _baseName:entry.soul2.name, evolutionStage:0}
            ]
          };
          area.innerHTML+=`<p style="color:var(--gold);margin-top:8px;">双生武魂觉醒完毕：${entry.soul1.name} + ${entry.soul2.name}</p>`;
        }else{
          // Multiple non-dual souls
          let soulNames = G._awakenedSouls.map(s=>s.name).join(' + ');
          let bestQuality = '普通'; let bestColor = '#888';
          G._awakenedSouls.forEach(s=>{
            if(s.quality==='顶级+'){bestQuality='顶级+';bestColor='#ff4444';}
            else if(s.quality==='顶级'&&bestQuality!=='顶级+'){bestQuality='顶级';bestColor='#ffdd44';}
            else if(s.quality==='优秀~顶级'&&bestQuality!=='顶级'&&bestQuality!=='顶级+'){bestQuality='优秀~顶级';bestColor='#aa66ff';}
            else if(s.quality==='优秀'&&bestQuality==='普通'){bestQuality='优秀';bestColor='#4488ff';}
          });
          G.martialSoul = {
            id:'multi', name:G._awakenedSouls.length+'武魂觉醒',
            type:G._awakenedSouls.length>1?'多武魂':'器武魂',
            quality:bestQuality, qColor:bestColor,
            example:soulNames,
            souls:G._awakenedSouls.map(s=>({...s, rings:[], skills:[], _baseName:s.name, evolutionStage:0})),
            activeIndex:0
          };
          area.innerHTML+=`<p style="color:var(--gold);margin-top:8px;">所有武魂觉醒完毕：${soulNames}</p>`;
        }
        hint.textContent='武魂已定，接下来抽取先天魂力...';
        pushNextWheel('innate', '抽取先天魂力', '魂', INNATE_POWER, { colorKey: 'ratingColor' });
      }
      break;
    case 'innate':
      let innateValue=item.min===item.max?item.min:item.min+Math.floor(Math.random()*(item.max-item.min+1));

      // Soul quality bonus: better quality = higher starting level
      // Common: no bonus, Good: +1, Mutant: +2, Top: +3, Dual: +5
      // Soul beast: bloodline bonus instead
      let soulBonus = 0;
      let soulBonusNote = '';
      if(G.identityType==='soul_beast' && G.bloodline){
        // Bloodline power determines bonus: 1.0 = +0, 1.4 = +4, etc.
        let bp = G.bloodline.attr?.power || 1.0;
        soulBonus = Math.floor((bp - 1.0) * 10);
        if(soulBonus>0) soulBonusNote = `${G.bloodline.name}血脉加成+${soulBonus}`;
      }else if(G.martialSoul){
        let q = G.martialSoul.quality;
        if(q==='普通') {soulBonus=0;}
        else if(q==='优秀') {soulBonus=1; soulBonusNote='优秀武魂加成+1';}
        else if(q==='优秀~顶级') {soulBonus=2; soulBonusNote='变异武魂加成+2';}
        else if(q==='顶级') {soulBonus=3; soulBonusNote='顶级武魂加成+3';}
        else if(q==='顶级+') {soulBonus=5; soulBonusNote='双生武魂加成+5';}
      }
      innateValue = Math.min(innateValue + soulBonus, 20);

      // Guarantee: 顶级武魂保底8级, 双生武魂保底10级
      let isDualSoul = G.martialSoul && (G.martialSoul.type==='双生武魂' || G.martialSoul.id==='dual');
      let isTopSoul = G.martialSoul && (G.martialSoul.quality==='顶级' || G.martialSoul.quality==='顶级+');
      if(isDualSoul && innateValue<10) innateValue=10;
      else if(isTopSoul && innateValue<8) innateValue=8;
      G.innatePower=innateValue;
      // Re-evaluate rating based on actual value
      let actualRating=INNATE_POWER.find(r=>innateValue>=r.min&&innateValue<=r.max);
      G.innateRating=actualRating?actualRating.rating:item.rating;
      G.innateRatingColor=actualRating?actualRating.ratingColor:item.ratingColor;
      let guaranteeNote='';
      if(isDualSoul && (innateValue-soulBonus)<10) guaranteeNote='<br><span style="color:var(--gold)">【双生武魂保底：先天魂力提升至10级！】</span>';
      else if(isTopSoul && (innateValue-soulBonus)<8) guaranteeNote='<br><span style="color:var(--gold)">【顶级武魂保底：先天魂力提升至8级！】</span>';
      if(soulBonusNote) guaranteeNote='<br><span style="color:var(--cyan)">【'+soulBonusNote+'】</span>'+guaranteeNote;
      area.innerHTML=`<div class="wheel-result"><h3>先天魂力：${G.innatePower}级</h3><p style="color:${G.innateRatingColor}">${G.innateRating}</p><p style="margin-top:4px">${actualRating?actualRating.desc:item.desc}</p>${guaranteeNote}</div>`;
      hint.textContent='天赋已定，接下来抽取性格...';
      pushNextWheel('personality', '抽取性格', '性', PERSONALITIES);
      break;
    case 'personality':
      G.personality=item;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gray);">社交：${Math.round(item.traits.social*100)}% | 情缘：${Math.round(item.traits.romance*100)}% | 强敌：${Math.round(item.traits.enemy*100)}%</p></div>`;
      hint.textContent='性格已定，接下来抽取外貌...';
      pushNextWheel('appearance', '抽取外貌', '貌', APPEARANCES);
      break;
    case 'appearance':
      G.appearance=item;
      let charm = item.attr?.charm || 5;
      area.innerHTML=`<div class="wheel-result"><h3 style="color:${item.color}">${item.name}容貌</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gold);">魅力值：${charm}/10</p></div>`;
      hint.textContent='';
      break;
  }

  // Hide spin button, show next step button
  document.getElementById('wheel-spin-btn').style.display='none';
  let nextBtn = document.getElementById('wheel-next-btn');
  nextBtn.style.display='';
  if(wheelIndex >= wheelQueue.length - 1){
    nextBtn.textContent = '进入斗罗大陆';
  }else{
    nextBtn.textContent = '下一步';
  }
}

function nextWheelStep(){
  const canvas=document.getElementById('wheel-canvas');
  const hint=document.getElementById('wheel-hint');
  document.getElementById('wheel-next-btn').style.display='none';

  wheelIndex++;
  if(wheelIndex<wheelQueue.length){
    canvas.style.transition='none';
    canvas.style.transform='rotate(0deg)';
    void canvas.offsetWidth;
    setupNextWheel();
    document.getElementById('wheel-spin-btn').style.display='';
  }else{
    hint.textContent='';
    managedTimeout(()=>showAwakening(),500);
  }
}

function getActiveSoul(){
  if(!G.martialSoul) return null;
  if(G.martialSoul.souls && G.martialSoul.souls.length > 0){
    return G.martialSoul.souls[G.martialSoul.activeIndex || 0];
  }
  return G.martialSoul;
}

function switchActiveSoul(index){
  if(!G.martialSoul || !G.martialSoul.souls || G.martialSoul.souls.length <= 1) return;
  if(index < 0 || index >= G.martialSoul.souls.length) return;
  // Save current rings back to active soul
  let currentSoul = getActiveSoul();
  if(currentSoul && Array.isArray(G.soulRings)){
    currentSoul.rings = [...G.soulRings];
  }
  // Switch to new soul
  G.martialSoul.activeIndex = index;
  // Load new soul's rings into G.soulRings
  let newSoul = G.martialSoul.souls[index];
  G.soulRings = newSoul.rings || [];
  renderSidebar();
}

function rerollAll(){
  clearAllTimers();
  showScreen('screen-title');
  G=null;
}

function getLevelName(level){
  for(let l of SOUL_LEVELS){if(level>=l.min&&level<=l.max)return l.name;}return '未知';
}

// ============================================================
// LIFE SYSTEM
// ============================================================
function enterLife(){
  showScreen('screen-life');
  renderSidebar();
  renderControls();
  // Add awakening event
  let beastName = G.bloodline?`${G.bloodline.name}${G.identity?.name||'魂兽'}`:'无名魂兽';
  let awakeningText;
  if(G.identityType==='soul_beast'){
    let initYears = G.beastYears > 0 ? `，初始年限${formatYears(G.beastYears)}` : '';
    awakeningText = `你作为${beastName}在${G.timeline.name}的世界中诞生了。降生于${G.birthplace?.name||'未知之地'}${initYears}，当前修为：${getLevelName(G.soulPower)}。弱肉强食是魂兽的法则，唯有不断修炼才能生存。十万年后可选择化形为人，年限越高化形天赋越强！`;
  }else if(G.identityType==='god'){
    let posName = G.godPosition?.name || G.identity?.name || '未知神位';
    let artName = G.godArtifact?.name || '无神器';
    let facName = G.faction || '散修';
    awakeningText = `你在神界觉醒了<b style="color:var(--gold)">「${posName}」</b>神位，持有${artName}，隶属于<b>${facName}</b>。神力等级：${G.identity?.name}。`;
  }else{
    awakeningText = `你在武魂觉醒仪式上觉醒了「${G.martialSoul?.example||'未知武魂'}」，先天魂力${G.innatePower}级。${G.innatePower>=10?'震惊四座！':''}`;
  }
  addEventLog(6,'cultivate',awakeningText,true);
}

function addEventLog(age,type,text,isInit){
  const log=document.getElementById('event-log');
  const typeNames={cultivate:'修炼',social:'社交',battle:'战斗',fortune:'机缘',crisis:'危机'};

  // Save to history for review
  G.yearEvents=G.yearEvents||[];
  G.yearEvents.unshift({age,type,text,time:new Date().toISOString()});

  // Clear previous record for non-init events (show only current year)
  if(!isInit){
    log.innerHTML='';
  }

  const entry=document.createElement('div');
  entry.className='event-entry';
  entry.innerHTML=`
    <div class="event-year">${G.timeline.name} · ${age}岁</div>
    <span class="event-type ${type}">${typeNames[type]||type}</span>
    <div class="event-text">${text}</div>
  `;
  log.appendChild(entry);
}

// How many years to advance per click (3-7 random)
function getYearStep(){
  let base = 3 + Math.floor(Math.random()*5); // 3~7
  // More events when young, fewer when old
  if(G.age >= 60) base = Math.min(base, 3);
  if(G.age >= 80) base = Math.min(base, 2);
  return base;
}

// ============================================================
// NEW EVENT SYSTEM - 6 main event types
// ============================================================
function rollYearEvent(){
  // Event weights (total = 100)
  // Partner 15, Enemy 20, Justice 20, Auction 10, Fortune 25
  let roll = Math.random() * 100;
  let cum = 0;
  
  // Partner event (15%) - only if has spouse
  cum += 15;
  if(roll < cum && G.hasSpouse) return 'partner';
  
  // Enemy event (20%)
  cum += 20;
  if(roll < cum) return 'enemy';
  
  // Justice event (20%) - only if soulPower < 70
  cum += 20;
  if(roll < cum && G.soulPower < 70) return 'justice';
  
  // Auction event (10%) - only if gold >= 50
  cum += 10;
  if(roll < cum && (G.gold||0) >= 50) return 'auction';
  
  // Fortune event (25%)
  cum += 25;
  if(roll < cum) return 'fortune';
  
  // Fallback to normal
  return 'normal';
}

function processPartnerEvent(){
  let spouse = G.spouse;
  if(!spouse) return null;
  let timelineId = G.timeline?.id || 'douluo1';
  let outcomes = PARTNER_OUTCOMES[timelineId] || PARTNER_OUTCOMES.default;
  let o = outcomes[Math.floor(Math.random()*outcomes.length)];
  let text = o.text.replace(/\{spouse\}/g, spouse.name);
  let effectText = '';
  if(o.rescueChance !== undefined){
    if(Math.random() < o.rescueChance){
      if(o.spWin > 0) G.soulPower = Math.min(G.soulPower + o.spWin, G.maxLevel);
      if(o.repWin) G.merit = (G.merit||0) + o.repWin;
      effectText = o.winText || ('成功救出！两人感情更加深厚' + (o.spWin > 0 ? '，魂力+' + o.spWin + '级' : '。'));
    }else{
      G.soulPower = Math.max(G.soulPower - o.spLose, 1);
      effectText = o.loseText || ('营救过程中受伤，魂力-' + o.spLose + '级');
    }
  }else if(o.effectType === 'battleArmor'){
    G.battleArmor = Math.max(G.battleArmor||0, o.battleArmor);
    G.gold = (G.gold||0) + o.gold;
    effectText = '掌握魂导基础，获得' + o.gold + '金魂币';
  }else if(o.sp > 0){
    G.soulPower = Math.min(G.soulPower + o.sp, G.maxLevel);
    effectText = '魂力+' + o.sp + '级';
    if(o.spLabel) effectText += '（' + o.spLabel + '）';
    if(o.rep){ G.merit=(G.merit||0)+o.rep; effectText += '，名声+' + o.rep; }
    if(o.gold){ G.gold=(G.gold||0)+o.gold; effectText += '，获得' + o.gold + '金魂币'; }
  }else if(o.gold){
    G.gold = (G.gold||0) + o.gold;
    effectText = '获得' + o.gold + '金魂币';
  }else{
    effectText = '平淡而幸福的一年。';
  }
  return {type:'social',text:`<b style="color:#ff88aa;">【伴侣】</b> ${text}<br><span style="color:var(--gold)">【${effectText}】</span>`};
}

function processJusticeEvent(){
  let timelineId = G.timeline?.id || 'douluo1';
  let scenarios = JUSTICE_SCENARIOS[timelineId] || JUSTICE_SCENARIOS.default;

  let s = scenarios[Math.floor(Math.random()*scenarios.length)];
  let win = Math.random() < s.winChance;
  if(win){
    G.soulPower = Math.min(G.soulPower + s.reward.sp, G.maxLevel);
    G.merit = (G.merit||0) + s.reward.rep;
    return {type:'fortune',text:`<b style="color:var(--cyan);">【路见不平】</b> ${s.text}<br><span style="color:var(--gold)">【你成功救下了对方！名声+${s.reward.rep} 魂力+${s.reward.sp}级】</span>`};
  }else{
    G.soulPower = Math.max(G.soulPower - 1, 1);
    return {type:'crisis',text:`<b style="color:var(--red);">【路见不平】</b> ${s.text}<br><span style="color:var(--red)">【你实力不足，未能阻止恶行，反而受了伤。魂力-1级】</span>`};
  }
}

function processAuctionEvent(){
  let timelineId = G.timeline?.id || 'douluo1';
  let items = AUCTION_ITEMS[timelineId] || AUCTION_ITEMS.default;
  let item = items[Math.floor(Math.random()*items.length)];
  if((G.gold||0) >= item.cost){
    G.gold -= item.cost;
    switch(item.effectType){
      case 'sp':
        G.soulPower = Math.min(G.soulPower + item.sp, G.maxLevel);
        break;
      case 'battleArmor':
        G.battleArmor = Math.max(G.battleArmor, item.battleArmor);
        break;
      case 'charm':
        if(G.appearance){
          G.appearance = {...G.appearance, attr:{...G.appearance.attr, charm:(G.appearance.attr?.charm||5)+1}};
        }
        break;
    }
    return {type:'fortune',text:`<b style="color:var(--gold);">【拍卖会】</b> 你在拍卖会上以${item.cost}金魂币拍得<b>${item.name}</b>！<br><span style="color:var(--gold)">【${item.desc}】</span>`};
  }else{
    return {type:'fortune',text:`<b style="color:var(--gold);">【拍卖会】</b> 你看中了一件宝贝，但囊中羞涩...<br><span style="color:var(--gray)">【下次再来吧】</span>`};
  }
}

function processFortuneEvent(){
  let timelineId = G.timeline?.id || 'douluo1';
  let types = ['sp','gold','appearance','bone'];
  let type = types[Math.floor(Math.random()*types.length)];

  let textPool = G.identityType === 'soul_beast' ? (FORTUNE_BEAST_TEXTS[timelineId] || FORTUNE_BEAST_TEXTS.douluo1) : (FORTUNE_TEXTS[timelineId] || FORTUNE_TEXTS.douluo1);
  let t = textPool[type];
  // 魂兽没有appearance时fallback到sp文本
  if(G.identityType === 'soul_beast' && type === 'appearance' && !G.appearance){
    t = textPool['sp'];
  }
  let text = t[Math.floor(Math.random()*t.length)];

  switch(type){
    case 'sp':
      let gain = 1 + Math.floor(Math.random()*3);
      G.soulPower = Math.min(G.soulPower + gain, G.maxLevel);
      let yearText = '';
      if(G.identityType === 'soul_beast'){
        let gained = 100 + Math.floor(Math.random()*401);
        yearText = addBeastYears(gained);
      }
      return {type:'fortune',text:`<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【魂力+${gain}级${yearText}】</span>`};
    case 'gold':
      let goldGain = 20 + Math.floor(Math.random()*80);
      G.gold = (G.gold||0) + goldGain;
      return {type:'fortune',text:`<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【获得${goldGain}金魂币】</span>`};
    case 'appearance':
      if(G.appearance){
        G.appearance = {...G.appearance, attr:{...G.appearance.attr, charm:(G.appearance.attr?.charm||5)+1}};
        return {type:'fortune',text:`<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【魅力+1】</span>`};
      }
      G.soulPower = Math.min(G.soulPower + 1, G.maxLevel);
      return {type:'fortune',text:`<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【魂力+1级】</span>`};
    case 'bone':
      let boneTypes = BONE_TYPES;
      let bt = boneTypes[Math.floor(Math.random()*boneTypes.length)];
      if(!G.soulBones.includes(bt)){
        G.soulBones.push(bt);
        let yearText2 = '';
        if(G.identityType === 'soul_beast'){
          let gained = 200 + Math.floor(Math.random()*301);
          yearText2 = addBeastYears(gained);
        }
        return {type:'fortune',text:`<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【获得${bt}！${yearText2}】</span>`};
      }
      G.gold = (G.gold||0) + 100;
      return {type:'fortune',text:`<b style="color:var(--gold);">【机遇】</b> ${text}<br><span style="color:var(--gold)">【已有同类魂骨，出售获得100金魂币】</span>`};
  }
}

function processSchoolEvent(){
  if(G.identityType === 'soul_beast'){
    return processNormalEvent();
  }
  let timelineId = G.timeline?.id || 'douluo1';
  let school = SCHOOL_EVENTS[timelineId];
  if(!school) school = SCHOOL_EVENTS.douluo1;
  let event = school.events[Math.floor(Math.random()*school.events.length)];
  let effectText = event.effect(G);
  return {type:'cultivate',text:`<b style="color:var(--cyan);">【${school.name}】</b> ${event.text}<br><span style="color:var(--gold)">【${effectText}】</span>`};
}

function processNormalEvent(){
  let timelineId = G.timeline?.id || 'douluo1';

  // Soul beast exclusive training events
  if(G.identityType === 'soul_beast'){
    // 计算血脉与降生地的契合度加成
    let bloodId = G.bloodline?.id || 'fire';
    let birthId = G.birthplace?.id || '';
    let synergy = 1.0;
    let synergyText = '';
    // 血脉与降生地契合加成
    if((bloodId === 'fire' && birthId === 'volcano') ||
       (bloodId === 'ice' && (birthId === 'jibei' || birthId === 'god_ice')) ||
       (bloodId === 'water' && (birthId === 'deep_sea' || birthId === 'god_sea')) ||
       (bloodId === 'dragon' && (birthId === 'dragon_valley' || birthId === 'dragon_world')) ||
       (bloodId === 'poison' && birthId === 'swamp') ||
       (bloodId === 'earth' && birthId === 'mountain') ||
       (bloodId === 'dark' && (birthId === 'cave' || birthId === 'abyss' || birthId === 'god_abyss')) ||
       (bloodId === 'spirit' && birthId === 'spirit_tower') ||
       (bloodId === 'wood' && (birthId === 'luori' || birthId === 'god_forest')) ||
       (bloodId === 'light' && (birthId === 'god_realm' || birthId === 'god_beast'))){
      synergy = 1.5;
      synergyText = '（血脉与降生地契合，修炼效率+50%）';
    }
    let beastSet = TIMELINE_BEAST_EVENTS[timelineId];
    if(!beastSet) beastSet = TIMELINE_BEAST_EVENTS.douluo1;
    // 从事件集中随机选择一个事件类型
    let types = ['cultivate','social','battle','fortune','crisis'];
    let typeWeights = [35,15,20,15,15]; // 修炼权重最高
    let roll = Math.random() * 100;
    let cum = 0;
    let selectedType = 'cultivate';
    for(let i = 0; i < types.length; i++){
      cum += typeWeights[i];
      if(roll < cum){ selectedType = types[i]; break; }
    }
    let pool = beastSet[selectedType] || beastSet.cultivate;
    // 过滤条件事件
    pool = pool.filter(e => !e.condition || e.condition(G));
    if(pool.length === 0) pool = beastSet.cultivate;
    let e = pool[Math.floor(Math.random()*pool.length)];
    // 处理带选项的事件
    if(e.choices){
      let typeLabels = {cultivate:'修炼',social:'社交',battle:'战斗',fortune:'机缘',crisis:'危机'};
      let typeColors = {cultivate:'var(--green)',social:'#88aaff',battle:'var(--red)',fortune:'var(--gold)',crisis:'#ff6600'};
      let choices = e.choices.map(c => {
        return {
          text: c.text,
          effect: (g) => {
            let effectText = '';
            // 带有随机胜负的选项
            if(c.spWin !== undefined && c.winChance !== undefined){
              if(Math.random() < c.winChance){
                let spGain = c.spWin;
                if(synergy > 1) spGain = Math.max(spGain, 2);
                g.soulPower = Math.min((g.soulPower||0) + spGain, g.maxLevel);
                let yearsGain = c.yearsWin ? Math.floor(c.yearsWin * synergy) : 0;
                let yearText = yearsGain > 0 ? addBeastYears(yearsGain) : '';
                effectText = (c.winText || '成功！') + (spGain > 0 ? ' 魂力+' + spGain + '级' : '') + yearText + synergyText;
              }else{
                if(c.spLose) g.soulPower = Math.max(g.soulPower + c.spLose, 1);
                let yearsLose = c.yearsLose || 0;
                let yearText = yearsLose > 0 ? addBeastYears(-yearsLose) : '';
                effectText = (c.loseText || '失败...') + (c.spLose ? ' 魂力' + c.spLose + '级' : '') + yearText;
              }
            }else if(c.deathChance && Math.random() < c.deathChance){
              g.alive = false; g.deathReason = c.deathText || '不幸陨落';
              effectText = c.deathText || '不幸陨落...';
            }else{
              // 确定性选项
              let spGain = c.sp || 0;
              if(synergy > 1 && spGain > 0) spGain = Math.max(spGain, 2);
              if(spGain) g.soulPower = Math.min((g.soulPower||0) + spGain, g.maxLevel);
              let yearsVal = c.years || 0;
              if(c.yearsLose) yearsVal = -c.yearsLose;
              let yearText = yearsVal !== 0 ? addBeastYears(Math.floor(yearsVal * synergy)) : '';
              effectText = (spGain > 0 ? '魂力+' + spGain + '级' : '') + yearText + synergyText;
              if(c.rep){ g.merit = (g.merit||0) + c.rep; effectText += ' 名声' + (c.rep > 0 ? '+' : '') + c.rep; }
              if(c.gold){ g.gold = (g.gold||0) + c.gold; effectText += ' 获得' + c.gold + '金魂币'; }
            }
            return effectText;
          }
        };
      });
      showEventModal(G.age, selectedType, `<b style="color:${typeColors[selectedType]||'var(--green)'};">【${typeLabels[selectedType]||selectedType}】</b> ${e.text}`, choices);
      return {type:selectedType, text:`<b style="color:${typeColors[selectedType]||'var(--green)'};">【${typeLabels[selectedType]||selectedType}】</b> ${e.text}`, _hasChoices:true};
    }
    // 无选项事件：直接处理
    let finalYears = Math.floor((e.years || 10) * synergy);
    let yearText = finalYears !== 0 ? addBeastYears(finalYears) : '';
    let spGain = e.sp || 1;
    if(synergy > 1) spGain = Math.max(spGain, 2);
    G.soulPower = Math.min((G.soulPower || 0) + spGain, G.maxLevel);
    let effectParts = [];
    if(spGain) effectParts.push('魂力+' + spGain + '级');
    if(finalYears) effectParts.push('年限' + (finalYears > 0 ? '+' : '') + finalYears + '年');
    effectParts.push(yearText);
    if(synergyText) effectParts.push(synergyText);
    if(e.rep){ G.merit = (G.merit||0) + e.rep; effectParts.push('名声+' + e.rep); }
    if(e.gold){ G.gold = (G.gold||0) + e.gold; effectParts.push('获得' + e.gold + '金魂币'); }
    let typeLabels = {cultivate:'修炼',social:'社交',battle:'战斗',fortune:'机缘',crisis:'危机'};
    let typeColors = {cultivate:'var(--green)',social:'#88aaff',battle:'var(--red)',fortune:'var(--gold)',crisis:'#ff6600'};
    return {type:selectedType,text:`<b style="color:${typeColors[selectedType]||'var(--green)'};">【${typeLabels[selectedType]||selectedType}】</b> ${e.text}<br><span style="color:var(--gold)">【${effectParts.filter(Boolean).join(' ')}】</span>`};
  }

  // 神兽专属修炼事件（神界传说）
  if(G.identityType === 'divine_beast'){
    let divineEvents = [
      {text:'你在神界天河中沐浴，神性精华浸润全身，神力大增。',sp:2},
      {text:'你观摩神界法则流转，对天地大道有了新的感悟。',sp:2},
      {text:'你在神兽领域与其他神兽切磋，磨练了本能。',sp:1},
      {text:'你吞噬了一缕散落的神性本源，神力更加凝实。',sp:2},
      {text:'你在神界古树下修炼，吸收远古神力。',sp:1},
      {text:'你感悟了血脉深处的远古记忆，神力觉醒。',sp:2},
      {text:'你在神界灵山之巅吐纳，云雾化作神力涌入体内。',sp:1},
      {text:'平静的一年，你在神界隐秘之地安心修炼。',sp:1}
    ];
    let de = divineEvents[Math.floor(Math.random()*divineEvents.length)];
    G.soulPower = Math.min((G.soulPower || 0) + de.sp, G.maxLevel);
    return {type:'cultivate',text:`<b style="color:var(--gold);">【神兽修炼】</b> ${de.text}<br><span style="color:var(--gold)">【神力+${de.sp}级】</span>`};
  }

  // 神祇专属修炼事件（神界传说）
  if(G.identityType === 'god'){
    let godEvents = [
      {text:'你在神殿中冥想，神格更加凝实，神力提升。',sp:2},
      {text:'你观摩神界委员会的法则会议，对神道有了新的领悟。',sp:2},
      {text:'你巡视所掌管的领域，神力在职责中精进。',sp:1},
      {text:'你与其他神祇论道，交流修炼心得。',sp:1},
      {text:'你感悟了远古神祇遗留的修炼印记，神力大涨。',sp:2},
      {text:'你在神界天河畔修炼，天河之力助你凝练神格。',sp:1},
      {text:'你参悟了一件远古神器的使用之法，神力有所提升。',sp:2},
      {text:'平静的一年，你在神殿中安心修炼。',sp:1}
    ];
    let ge = godEvents[Math.floor(Math.random()*godEvents.length)];
    G.soulPower = Math.min((G.soulPower || 0) + ge.sp, G.maxLevel);
    return {type:'cultivate',text:`<b style="color:var(--gold);">【神祇修炼】</b> ${ge.text}<br><span style="color:var(--gold)">【神力+${ge.sp}级】</span>`};
  }

  // 人类事件：从时间线专属事件集中获取
  let humanSet = TIMELINE_SPECIFIC_EVENTS[timelineId];
  if(!humanSet) humanSet = TIMELINE_SPECIFIC_EVENTS.douluo1;
  // 从事件集中随机选择一个事件类型
  let types = ['cultivate','social','battle','fortune','crisis'];
  let typeWeights = [35,15,20,15,15]; // 修炼权重最高
  let roll = Math.random() * 100;
  let cum = 0;
  let selectedType = 'cultivate';
  for(let i = 0; i < types.length; i++){
    cum += typeWeights[i];
    if(roll < cum){ selectedType = types[i]; break; }
  }
  let pool = humanSet[selectedType] || humanSet.cultivate;
  // 过滤条件事件
  pool = pool.filter(e => !e.condition || e.condition(G));
  if(pool.length === 0) pool = humanSet.cultivate;
  let e = pool[Math.floor(Math.random()*pool.length)];
  // 处理带选项的事件
  if(e.choices){
    let typeLabels = {cultivate:'修炼',social:'社交',battle:'战斗',fortune:'机缘',crisis:'危机'};
    let typeColors = {cultivate:'var(--green)',social:'#88aaff',battle:'var(--red)',fortune:'var(--gold)',crisis:'#ff6600'};
    let choices = e.choices.map(c => {
      return {
        text: c.text,
        effect: (g) => {
          let effectText = '';
          // 带有随机胜负的选项
          if(c.spWin !== undefined && c.winChance !== undefined){
            if(Math.random() < c.winChance){
              g.soulPower = Math.min(g.soulPower + c.spWin, g.maxLevel);
              effectText = (c.winText || '成功！') + (c.spWin > 0 ? ' 魂力+' + c.spWin + '级' : '');
              if(c.rep){ g.merit = (g.merit||0) + c.rep; effectText += ' 名声+' + c.rep; }
              if(c.gold){ g.gold = (g.gold||0) + c.gold; effectText += ' 获得' + c.gold + '金魂币'; }
            }else{
              if(c.spLose) g.soulPower = Math.max(g.soulPower + c.spLose, 1);
              effectText = (c.loseText || '失败...') + (c.spLose ? ' 魂力' + c.spLose + '级' : '');
            }
          }else if(c.deathChance && Math.random() < c.deathChance){
            g.alive = false; g.deathReason = c.deathText || '不幸陨落';
            effectText = c.deathText || '不幸陨落...';
          }else{
            // 确定性选项
            if(c.sp) g.soulPower = Math.min(g.soulPower + c.sp, g.maxLevel);
            effectText = c.sp > 0 ? '魂力+' + c.sp + '级' : '';
            if(c.rep){ g.merit = (g.merit||0) + c.rep; effectText += ' 名声' + (c.rep > 0 ? '+' : '') + c.rep; }
            if(c.gold){ g.gold = (g.gold||0) + c.gold; effectText += ' 获得' + c.gold + '金魂币'; }
          }
          return effectText;
        }
      };
    });
    showEventModal(G.age, selectedType, `<b style="color:${typeColors[selectedType]||'var(--green)'};">【${typeLabels[selectedType]||selectedType}】</b> ${e.text}`, choices);
    return {type:selectedType, text:`<b style="color:${typeColors[selectedType]||'var(--green)'};">【${typeLabels[selectedType]||selectedType}】</b> ${e.text}`, _hasChoices:true};
  }
  // 无选项事件：直接处理
  let effectParts = [];
  if(e.sp){ G.soulPower = Math.min(G.soulPower + e.sp, G.maxLevel); effectParts.push('魂力+' + e.sp + '级'); }
  if(e.rep){ G.merit = (G.merit||0) + e.rep; effectParts.push('名声' + (e.rep > 0 ? '+' : '') + e.rep); }
  if(e.gold){ G.gold = (G.gold||0) + e.gold; effectParts.push((e.gold > 0 ? '获得' : '花费') + Math.abs(e.gold) + '金魂币'); }
  let typeLabels = {cultivate:'修炼',social:'社交',battle:'战斗',fortune:'机缘',crisis:'危机'};
  let typeColors = {cultivate:'var(--green)',social:'#88aaff',battle:'var(--red)',fortune:'var(--gold)',crisis:'#ff6600'};
  return {type:selectedType,text:`<b style="color:${typeColors[selectedType]||'var(--green)'};">【${typeLabels[selectedType]||selectedType}】</b> ${e.text}<br><span style="color:var(--gold)">【${effectParts.join(' ') || '平安无事'}】</span>`};
}

function nextYear(){
  if(!G.alive || G._processing) return;
  let yearsToAdvance = getYearStep();
  G._processing = true;
  let eventsThisRound = [];
  processYearChain(0, yearsToAdvance, eventsThisRound);
}

function processYearChain(idx, total, events){
  if(idx >= total || !G.alive){
    finishYearAdvance(events);
    return;
  }
  G.age++;
  // Death check
  let maxAge = G.maxAge;
  if(G.soulPower >= 91) maxAge += 100;
  if(G.soulPower >= 99) maxAge += 200;
  if(G.soulPower >= 120) maxAge += 500;
  if(G.age > maxAge){
    G.alive = false; G.deathReason = '寿终正寝';
    finishYearAdvance(events);
    return;
  }
  // Innate 0 special
  if(G.innatePower === 0 && G.age === 12 && Math.random() < 0.1){
    G.innatePower = 3; G.innateRating = '普通'; G.innateRatingColor = '#aaa';
    events.push({age:G.age, type:'fortune', text:'<b style="color:var(--gold);">【觉醒】</b> 在一次意外中，你突然感受到了魂力的存在！后天觉醒成功，先天魂力3级！'});
    processYearChain(idx + 1, total, events);
    return;
  }
  // Soul ring milestone check（神和神兽没有魂环系统）
  if(G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast' && G.soulRings.length < 9){
    let nextRingLevel = RING_MILESTONES[G.soulRings.length];
    if(G.soulPower >= nextRingLevel){
      events.push({age:G.age, type:'fortune', text:`<b style="color:var(--gold);">【突破】</b> 魂力达到${G.soulPower}级，突破瓶颈！需要猎杀第${G.soulRings.length+1}魂环...`, ringMilestone:true});
      finishYearAdvance(events, true);
      return;
    }
  }
  // Soul core formation check (绝世唐门特有魂核系统)
  if(G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast' && G.martialSoul){
    let soulCoreEvent = checkSoulCoreFormation();
    if(soulCoreEvent){
      events.push({age:G.age, type:'fortune', text:soulCoreEvent.text});
      G.soulCore++;
      if(soulCoreEvent.core){
        if(!Array.isArray(G.soulCores)) G.soulCores = [];
        G.soulCores.push(soulCoreEvent.core);
      }
      if(soulCoreEvent.sp){
        G.soulPower = Math.min(G.soulPower + soulCoreEvent.sp, G.maxLevel);
      }
      renderSidebar(); checkAchievements();
      if(!G.alive){ finishYearAdvance(events); return; }
    }
  }
  // 神力技能解锁（神和神兽专属）
  if((G.identityType === 'god' || G.identityType === 'divine_beast') && G.divineSkillsTotal){
    G.divineSkillsUnlocked = G.divineSkillsUnlocked || 0;
    G.divineSkills = G.divineSkills || [];
    let unlockThresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
    let targetUnlocked = 0;
    for(let lv of unlockThresholds){
      if(G.soulPower >= lv) targetUnlocked++;
      else break;
    }
    targetUnlocked = Math.min(targetUnlocked, G.divineSkillsTotal);
    if(targetUnlocked > G.divineSkillsUnlocked){
      let newlyUnlocked = targetUnlocked - G.divineSkillsUnlocked;
      for(let i = 0; i < newlyUnlocked; i++){
        let availableSkills = DIVINE_SKILL_POOL.filter(s => !G.divineSkills.some(ds => ds.name === s.name));
        if(availableSkills.length === 0) break;
        let newSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        G.divineSkills.push(newSkill);
        G.divineSkillsUnlocked++;
        events.push({age:G.age, type:'fortune', text:`<b style="color:var(--gold);">【神力觉醒】</b> 神力突破瓶颈，觉醒新技能：<b style="color:var(--cyan);">${newSkill.name}</b>！${newSkill.desc}。(${G.divineSkillsUnlocked}/${G.divineSkillsTotal})`});
      }
      renderSidebar();
    }
  }
  // Timeline progress event check - original story events by age
  let progressEvent = getTimelineProgressEvent();
  if(progressEvent){
    events.push({age:G.age, type:'fortune', text:progressEvent.text});
    if(progressEvent.sp){
      G.soulPower = Math.min(G.soulPower + progressEvent.sp, G.maxLevel);
    }
    if(progressEvent.merit){
      G.merit = (G.merit || 0) + progressEvent.merit;
    }
    renderSidebar(); checkAchievements();
    if(!G.alive){ finishYearAdvance(events); return; }
    processYearChain(idx + 1, total, events);
    return;
  }
  // Year event wheel
  openYearEventWheel(function(result){
    if(result && result.event){
      events.push({age:G.age, ...result.event});
    }
    function continueNext(){
      // Soul evolution check（神和神兽无武魂，跳过）
      if(G.martialSoul){
        let evoResult = checkSoulEvolution();
        if(evoResult){
          G.martialSoul.name = evoResult.newName;
          G.martialSoul.example = evoResult.newName;
          G.martialSoul.evolutionStage = evoResult.stage;
          G.soulPower = Math.min(G.soulPower + evoResult.bonusPower, G.maxLevel);
          events.push({age:G.age, type:'fortune', text:`<b style="color:var(--gold);">【武魂进化】</b> ${evoResult.desc} 武魂进化为「${evoResult.newName}」！魂力+${evoResult.bonusPower}级！`});
        }
      }
      renderSidebar(); checkAchievements();
      if(!G.alive){ finishYearAdvance(events); return; }
      // Douluo (90+) path choice check（神和神兽不触发）
      if(G.soulPower >= 91 && !G.chosenPath && G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast'){
        events.push({age:G.age, type:'fortune', text:'<b style="color:var(--gold);">【封号斗罗】</b> 你的修为突破90级，成为封号斗罗！是时候选择未来的道路了...'});
        finishYearAdvance(events);
        managedTimeout(()=>openDouluoPathChoice(), 600);
        return;
      }
      // Godhood check (only for those who chose god path or haven't chosen yet，神和神兽不触发)
      if(G.soulPower >= G.maxLevel && !G.isGod && G.identityType !== 'soul_beast' && G.identityType !== 'god' && G.identityType !== 'divine_beast' && G.chosenPath !== 'family'){
        events.push({age:G.age, type:'fortune', text:'<b style="color:var(--gold);">【成神之路】</b> 你的修为已达到当前位面的极限，感应到了神位的召唤...'});
        finishYearAdvance(events);
        managedTimeout(()=>openGodhoodChoice(), 600);
        return;
      }
      processYearChain(idx + 1, total, events);
    }
    if(result && result.subWheel === 'enemy'){
      openEnemyWheel(function(){
        renderSidebar(); checkAchievements();
        if(!G.alive){ finishYearAdvance(events); return; }
        continueNext();
      });
    }else if(result && result.subWheel === 'timeline'){
      openTimelineCharacterWheel(function(){
        renderSidebar(); checkAchievements();
        if(!G.alive){ finishYearAdvance(events); return; }
        continueNext();
      });
    }else{
      continueNext();
    }
  });
}

function openGodhoodChoice(){
  document.getElementById('godhood-panel').style.display='block';
  document.getElementById('godhood-result').style.display='none';
  document.getElementById('godhood-result').innerHTML='';
}

function chooseGodhood(type){
  const inheritGods = ['海神','火神','水神','风神','雷神','战神','速度之神','食神'];
  let success = false;
  let resultText = '';
  let resultColor = '';

  if(type === 'inherit'){
    success = Math.random() < 0.7;
    if(success){
      let godName = inheritGods[Math.floor(Math.random()*inheritGods.length)];
      G.isGod = true;
      G.godTitle = godName;
      G.maxLevel += 50;
      G.soulPower = Math.min(G.soulPower + 10, G.maxLevel);
      G.maxAge += 500;
      resultText = `成功继承「${godName}」神位！神力灌注，修为突破位面极限！<br><span style="color:var(--gold)">等级上限+50 | 寿命+500年 | 魂力+10级</span>`;
      resultColor = 'var(--gold)';
    }else{
      G.soulPower = Math.max(G.soulPower - 10, 1);
      resultText = '继承神位失败...神位残留的神力反噬了你。<br><span style="color:var(--red)">魂力-10级</span>';
      resultColor = 'var(--red)';
    }
  }else{
    success = Math.random() < 0.4;
    if(success){
      let customTitles = ['毁灭与创造之神','时空主宰','命运编织者','元素帝君','灵魂至高神'];
      let godName = customTitles[Math.floor(Math.random()*customTitles.length)];
      G.isGod = true;
      G.godTitle = godName;
      G.maxLevel += 100;
      G.soulPower = Math.min(G.soulPower + 20, G.maxLevel);
      G.maxAge += 1000;
      resultText = `以自身为根基，成功创造「${godName}」神位！天地共鸣，万界臣服！<br><span style="color:var(--gold)">等级上限+100 | 寿命+1000年 | 魂力+20级</span>`;
      resultColor = 'var(--gold)';
    }else{
      if(Math.random() < 0.3){
        G.alive = false;
        G.deathReason = '自创神位失败，肉身崩解';
        resultText = '自创神位失败...你的肉身无法承受创造神位的反噬，在光芒中消散...<br><span style="color:var(--red)">魂飞魄散</span>';
        resultColor = 'var(--red)';
      }else{
        G.soulPower = Math.max(G.soulPower - 20, 1);
        resultText = '自创神位失败...神位雏形崩溃，修为大幅倒退。<br><span style="color:var(--red)">魂力-20级</span>';
        resultColor = 'var(--red)';
      }
    }
  }

  let resultDiv = document.getElementById('godhood-result');
  resultDiv.style.display='block';
  resultDiv.innerHTML = `<div style="color:${resultColor};font-size:16px;margin-bottom:10px;">${resultText}</div><button class="btn" onclick="closeGodhoodChoice()">继续</button>`;
}

function closeGodhoodChoice(){
  document.getElementById('godhood-panel').style.display='none';
  renderSidebar(); checkAchievements();
  if(!G.alive){
    showReview();
  }
}

function openDouluoPathChoice(){
  document.getElementById('douluo-path-panel').style.display='block';
  // Show "飞升神界" button if in douluo2 (绝世唐门) and soulPower >= 100
  let godrealmBtn = document.getElementById('btn-godrealm-path');
  if(godrealmBtn){
    godrealmBtn.style.display = (G.timeline?.id === 'douluo2' && G.soulPower >= 100) ? 'block' : 'none';
  }
}

function chooseDouluoPath(path){
  let input = document.getElementById('custom-title-input');
  let customTitle = input.value.trim();
  if(customTitle){
    G.customTitle = customTitle;
  }
  G.chosenPath = path;
  document.getElementById('douluo-path-panel').style.display='none';

  if(path === 'family'){
    // Unlock romance system
    G.romanceUnlocked = true;
    // Auto-set a spouse if not already married
    if(!G.hasSpouse){
      G.hasSpouse = true;
      let romanceChars = getRomanceCandidates();
      if(romanceChars.length > 0){
        let candidate = romanceChars[Math.floor(Math.random() * romanceChars.length)];
        G.spouse = candidate;
        addEventLog(G.age, 'fortune', `<b style="color:#ff66aa;">【结缘】</b> 你与${candidate.name}相识相知，最终携手共度余生。`);
      }
    }
  }else if(path === 'godrealm'){
    // Switch to godrealm timeline
    G.timeline = TIMELINES.find(t=>t.id==='godrealm');
    G.maxLevel = G.timeline.maxLevel;
    G.maxAge = Math.max(G.maxAge || 100, 999);
    addEventLog(G.age, 'fortune', `<b style="color:#ffdd44;">【飞升神界】</b> 你的魂力突破百级，绝世唐门的位面已经无法容纳你的力量！在神祇的接引下，你打破位面壁垒，飞升神界，进入神界传说时代！`);
  }

  renderSidebar();
  checkAchievements();
}

function getRomanceCandidates(){
  let timelineId = G.timeline?.id || 'douluo1';
  let chars = TIMELINE_CHARACTERS[timelineId] || [];
  // Filter out married/main characters and same gender if needed
  return chars.filter(c => {
    let name = c.name;
    // Exclude main male chars for female player, main female chars for male player
    let isMale = G.gender?.id === 'male';
    let femaleChars = ['小舞','宁荣荣','朱竹清','千仞雪','唐舞桐','古月娜','白秀秀','冻千秋','生命女神','圣灵斗罗雅莉'];
    let maleChars = ['唐三','戴沐白','奥斯卡','马红俊','唐昊','独孤博','比比东','霍雨浩','贝贝','和菜头','玄老','穆老','唐舞麟','谢邂','蓝轩宇','唐乐','钱磊','海神唐三','情绪之神霍雨浩','唐舞麟（金龙王）','毁灭之神','善良之神','邪恶之神','七原罪神·贪食之神','七元素神·火神'];
    if(isMale) return femaleChars.some(fc => name.includes(fc));
    return maleChars.some(mc => name.includes(mc));
  }).map(c => ({name:c.name, soul:c.soul, color:c.color}));
}

function finishYearAdvance(events, hasRingMilestone){
  let log = document.getElementById('event-log');
  log.innerHTML = '';
  let typeNames = {cultivate:'修炼', social:'社交', battle:'战斗', fortune:'机缘', crisis:'危机'};
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
    G.yearEvents.unshift({age: ev.age, type: ev.type, text: ev.text});
  });
  checkAchievements();
  renderSidebar();
  // Ring milestone
  if(hasRingMilestone && G.alive){
    let lastRingEvent = events.find(e => e.ringMilestone);
    if(lastRingEvent){
      openSoulRingWheel(function(ringSuccess){
        if(!G.alive){ G._processing = false; renderSidebar(); triggerDeath('猎杀魂环时陨落'); return; }
        renderSidebar(); checkAchievements();
        if(ringSuccess){
          openOpportunityWheel(function(){
            G._processing = false; renderSidebar(); checkAchievements();
            if(!G.alive) triggerDeath('遭遇不测');
          });
        }else{
          G._processing = false;
          if(!G.alive) triggerDeath('遭遇不测');
        }
      });
      return;
    }
  }
  G._processing = false;
  if(!G.alive) triggerDeath(G.deathReason || '遭遇不测');
}

function makeChoice(idx){
  const modal=document.getElementById('modal-event');
  modal.classList.remove('active');

  let choice=window._currentChoices[idx];
  let result=choice.effect(G);

  // Cross-skill special display
  let crossHtml='';
  if(G.crossSkills&&G.crossSkills.length>0){
    let last=G.crossSkills[G.crossSkills.length-1];
    crossHtml=`<div class="cross-skill-display"><h4>🌀 跨界融合！</h4><p>来源：${last.source} | 技能：${last.skill}</p><p style="font-size:12px;color:var(--gray);margin-top:4px;">${last.effect}</p></div>`;
  }

  addEventLog(G.age,window._currentEventType,`【选择：${choice.text}】<br>${result}${crossHtml}`);
  checkAchievements();
  renderSidebar();

  if(!G.alive){
    triggerDeath('遭遇不测');
  }
}

// ============================================================
// AUTO MODE
// ============================================================
let autoTimer=null;
function stopAutoMode(){
  if(autoTimer){
    clearInterval(autoTimer);
    autoTimer=null;
  }
  G.autoMode=false;
}
function toggleAuto(){
  G.autoMode=!G.autoMode;
  document.getElementById('auto-btn').textContent=G.autoMode?'⏹ 停止推演':'自动推演';
  // Show/hide overlay stop button
  let overlayStop = document.getElementById('mini-auto-stop-btn');
  if(overlayStop) overlayStop.style.display = G.autoMode ? '' : 'none';
  if(G.autoMode){
    autoTimer=setInterval(()=>{
      if(!G.alive){stopAutoMode();document.getElementById('auto-btn').textContent='自动推演';let ob=document.getElementById('mini-auto-stop-btn');if(ob)ob.style.display='none';return;}
      // Check if modal or mini wheel is open
      if(document.getElementById('modal-event').classList.contains('active'))return;
      if(document.getElementById('mini-wheel-overlay').classList.contains('active'))return;
      if(G._processing)return;
      nextYear();
    },1500);
  }else{
    stopAutoMode();
    // Close any open overlay when stopping auto
    let overlay = document.getElementById('mini-wheel-overlay');
    if(overlay && overlay.classList.contains('active')){
      overlay.classList.remove('active');
      G._processing = false;
      wheelState.spinning = false;
    }
  }
}

// ============================================================
// DEATH & REVIEW
// ============================================================
function triggerDeath(reason){
  G.alive=false;
  G.deathReason=reason;
  G.deathAge=G.age;
  stopAutoMode();
  clearAllTimers();

  managedTimeout(()=>showReview(),1500);
}

function endGameEarly(){
  if(G.alive){
    G.alive=false;
    G.deathReason='主动结束';
    G.deathAge=G.age;
    stopAutoMode();
    showReview();
  }
}

function getProtagonistStatus(timelineId, playerAge){
  // Returns protagonist age and status based on timeline and player age
  let protagonists = {
    douluo1: {name:'唐三', birthOffset:0, milestones:[
      {age:6, status:'武魂觉醒，先天满魂力'},
      {age:12, status:'进入诺丁学院，结识小舞'},
      {age:14, status:'进入史莱克学院'},
      {age:16, status:'魂师大赛夺冠，武魂殿初现敌意'},
      {age:20, status:'建立唐门，准备对抗武魂殿'},
      {age:25, status:'海神岛传承，成为海神'},
      {age:30, status:'击败比比东，升入神界'}
    ]},
    douluo2: {name:'霍雨浩', birthOffset:-10, milestones:[
      {age:6, status:'觉醒灵眸武魂'},
      {age:11, status:'进入史莱克学院'},
      {age:14, status:'魂导师修炼，结识唐舞桐'},
      {age:17, status:'极限单兵计划'},
      {age:20, status:'继承情绪之神神位'},
      {age:26, status:'升入神界'}
    ]},
    douluo3: {name:'唐舞麟', birthOffset:-20, milestones:[
      {age:6, status:'觉醒蓝银草武魂'},
      {age:10, status:'进入东海学院'},
      {age:14, status:'史莱克学院学员'},
      {age:18, status:'一字斗铠师'},
      {age:22, status:'与古月娜相爱相杀'},
      {age:28, status:'金龙王之力觉醒'}
    ]},
    douluo4: {name:'蓝轩宇', birthOffset:-30, milestones:[
      {age:6, status:'觉醒金银龙王血脉'},
      {age:12, status:'进入史莱克学院'},
      {age:16, status:'龙变历练'},
      {age:20, status:'创造龙神神位'}
    ]},
    godrealm: {name:'唐三', birthOffset:0, milestones:[
      {age:100, status:'神界执法者'},
      {age:300, status:'大神圈创立者'}
    ]}
  };

  let p = protagonists[timelineId];
  if(!p) return null;

  let pAge = playerAge + p.birthOffset;
  if(pAge < 0) return {name:p.name, age:0, status:'尚未出生'};

  let status = '在斗罗大陆历练';
  for(let m of p.milestones){
    if(pAge >= m.age) status = m.status;
  }
  return {name:p.name, age:pAge, status:status};
}

function generateTitle(soul){
  if(G.customTitle && G.soulPower>=90){
    return G.customTitle+'斗罗';
  }
  if(!soul||!soul.example)return '无名者';
  let name=soul.example;
  if(G.soulPower>=90){
    let prefix=name.substring(0,Math.min(2,name.length));
    return prefix+'斗罗';
  }
  if(G.soulPower>=70)return name.substring(0,2)+'圣者';
  if(G.soulPower>=50)return name.substring(0,2)+'尊者';
  return name.substring(0,2)+'魂师';
}
function generateDomain(){
  if(G.identityType==='soul_beast'){
    let domains={'火系':'烈焰领域','冰系':'极寒领域','雷系':'雷霆领域','风系':'风暴领域','土系':'大地领域','水系':'深海领域','木系':'生命之域','暗系':'暗影领域','光系':'光明领域','毒系':'万毒领域','精神系':'精神领域','龙系':'龙威领域','空间系':'虚空领域','时间系':'时光领域','吞噬系':'吞噬领域'};
    return domains[G.bloodline?.type]||'兽王领域';
  }
  let domains={'攻击':'杀神领域','防御':'不动领域','控制':'幻境领域','辅助':'祝福领域','敏攻':'极速领域','强攻':'战魂领域'};
  return domains[G.martialSoul?.type]||'武魂领域';
}
function generateFateSeed(){
  let seeds=[];
  if(G.soulPower>=99)seeds.push({name:'神之种',icon:'✦',desc:'触及神级的潜质，命运因你而颤抖'});
  if(G.martialSoul?.quality==='双生')seeds.push({name:'双生之种',icon:'◈',desc:'双武魂共鸣，命运双线交织'});
  if(G.identityType==='god')seeds.push({name:'神域之种',icon:'❋',desc:'神界血脉，凌驾众生之上'});
  if(G.identityType==='soul_beast')seeds.push({name:'荒古之种',icon:'◉',desc:'远古魂兽的血脉记忆'});
  if(Array.isArray(G.soulRings)&&G.soulRings.length>=9&&G.soulRings.some(r=>r.years>=100000))seeds.push({name:'十万年之种',icon:'✹',desc:'承载十万年魂环的沉重命运'});
  if(G.deathReason==='寿终正寝')seeds.push({name:'善终之种',icon:'❀',desc:'圆满一生，安详离世'});
  if(G.deathReason&&G.deathReason.includes('猎杀'))seeds.push({name:'轮回之种',icon:'↻',desc:'魂环之路的轮回宿命'});
  if(G.achievementsEarned?.length>=5)seeds.push({name:'传奇之种',icon:'★',desc:'诸多成就加身，命运铭记'});
  if(seeds.length===0)seeds.push({name:'平凡之种',icon:'●',desc:'普普通通，却也独一无二'});
  return seeds[Math.floor(Math.random()*seeds.length)];
}

function leaveLegacy(){
  localStorage.setItem('dl_legacy',JSON.stringify({
    martialSoul:G.martialSoul,
    bloodline:G.bloodline,
    soulPower:G.soulPower,
    timeline:G.timeline.name,
    innateBonus:Math.floor(G.innatePower*0.3)
  }));
  alert('传承已留下！下次转世时将获得继承加成。');
}

function calculateReviewRating(G){
  let score=0;
  score+=Math.min(G.soulPower,150);
  score+=G.age/5;
  score+=G.soulRings.length*10;
  score+=G.soulBones.length*15;
  score+=(G.companions||[]).length*5;
  score+=(G.customSkills||[]).length*8;
  if(G.crossSkills?.length)score+=30;
  if(G.hasSpouse)score+=5;
  if(G.bloodline)score+=15;
  if(G.battleArmor)score+=G.battleArmor*10;
  if(G.achievementsEarned)score+=G.achievementsEarned.length*10;

  let rating='D';
  if(score>=500)rating='SS';
  else if(score>=350)rating='S';
  else if(score>=250)rating='A';
  else if(score>=150)rating='B';
  else if(score>=80)rating='C';

  let ratingColors={SS:'#ffdd44',S:'#ff8844',A:'#44dd88',B:'#4488ff',C:'#aaaaaa',D:'#888888'};

  let epitaphs={
    SS:`${G.timeline.name}的传说——${G.martialSoul?.example||G.beastName||'无名者'}。以${getLevelName(G.soulPower)}之境，${G.deathAge}岁之龄，留下了不可磨灭的印记。后人传颂，万世不灭。`,
    S:`${G.identity.name}${G.martialSoul?.example||G.beastName||''}，一生波澜壮阔，在${G.timeline.name}书写了属于自己的传奇。`,
    A:`${G.martialSoul?.example||G.beastName||'一位魂师'}，在${G.timeline.name}中历经风雨，终成一方强者。`,
    B:`${G.identity.name}的一生，虽有遗憾，但也有精彩。在斗罗大陆留下了自己的足迹。`,
    C:`在${G.timeline.name}中默默无闻地度过了一生。`,
    D:`${G.deathReason==='寿终正寝'?'安详地':G.deathReason}离开了这个世界，未能实现心中的理想。`
  };

  let keyEventsHtml='';
  let events=G.yearEvents||[];
  for(let i=0;i<Math.min(events.length,12);i++){
    let ev=events[i];
    keyEventsHtml+=`<div class="review-node"><div class="year">${G.timeline.name} · ${ev.age}岁</div><div class="desc">${ev.text}</div></div>`;
  }

  return {
    score: score,
    rating: rating,
    ratingColors: ratingColors,
    epitaph: epitaphs[rating],
    keyEventsHtml: keyEventsHtml
  };
}

function saveGameResult(G, rating, epitaph){
  let saves=loadSaves();
  saves.unshift({
    id:Date.now(),
    timeline:G.timeline.name,
    identity:G.identity.name,
    martialSoul:G.martialSoul?.example||G.beastName||'',
    soulPower:G.soulPower,
    age:G.deathAge,
    rating:rating,
    epitaph:epitaph,
    rings:G.soulRings.length,
    bones:G.soulBones.length,
    deathReason:G.deathReason,
    innatePower:G.innatePower,
    date:new Date().toLocaleString('zh-CN')
  });
  if(saves.length>20)saves=saves.slice(0,20);
  saveSaves(saves);

  checkAchievements();
}

function generateFateSeedData(G){
  let seed=generateFateSeed();
  let isBeast=G.identityType==='soul_beast';
  let routeLabel=isBeast?'魂兽路线':'人类路线';
  let beastYearStr = isBeast && G.beastYears!==undefined ? ` · ${formatYears(G.beastYears)}` : '';
  let routeValue=isBeast?`${G.identity?.name||'未知种族'}${beastYearStr} · ${G.birthplace?.name||'未知之地'}`:`${G.identity?.name||'未知身份'}`;
  let nameLabel=isBeast?'魂兽名号':'觉醒武魂';
  let nameValue=isBeast?(G.bloodline?`${G.bloodline.name}${G.identity?.name||'魂兽'}（${formatYears(G.beastYears||0)}）`:'无名魂兽'):(G.martialSoul?.example||'未知');
  let bloodlineValue=G.bloodline?(G.bloodline.name||G.bloodline.type):'无';
  let title=generateTitle(G.martialSoul);
  let domain=generateDomain();

  return {
    seed: seed,
    routeLabel: routeLabel,
    routeValue: routeValue,
    nameLabel: nameLabel,
    nameValue: nameValue,
    bloodlineValue: bloodlineValue,
    title: title,
    domain: domain
  };
}

// ============================================================
// ACHIEVEMENTS
// ============================================================
function checkAchievements(){
  if(!G)return;
  ACHIEVEMENTS.forEach(a=>{
    if(!globalAchievements.includes(a.id)&&a.check(G)){
      globalAchievements.push(a.id);
      saveGlobalAchievements();
      // Show achievement notification
      showAchievementNotification(a);
    }
  });
}

// ============================================================
// SAVE/LOAD
// ============================================================

function formatYears(y){
  if(y === 0) return '幼年期';
  if(y < 100) return y+'年（成长期）';
  if(y >= 1000000) return (y/10000).toFixed(0)+'万年';
  if(y >= 10000) return (y/10000).toFixed(y%10000===0?0:1)+'万年';
  if(y >= 1000) return (y/1000).toFixed(y%1000===0?0:1)+'千年';
  if(y >= 100) return (y/100).toFixed(y%100===0?0:1)+'百年';
  return y+'年';
}

function beastYearsToLevel(years){
  if(years < 10) return 1;
  if(years < 100) return Math.floor(1 + years / 10);
  if(years < 1000) return Math.floor(10 + years / 100);
  if(years < 10000) return Math.floor(20 + years / 1000);
  if(years < 100000) return Math.floor(30 + years / 2500);
  return Math.min(99, Math.floor(70 + years / 10000));
}

function syncBeastSoulPower(){
  if(G.identityType === 'soul_beast' && G.beastYears !== undefined){
    G.soulPower = beastYearsToLevel(G.beastYears);
  }
}

function addBeastYears(amount){
  if(G.identityType !== 'soul_beast' || G.beastYears === undefined) return '';
  G.beastYears += amount;
  syncBeastSoulPower();
  return ` · 年限${amount >= 0 ? '+' : ''}${formatYears(amount)}`;
}

function escapeHtml(str){
  if(str==null)return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

async function deleteSave(idx){
  let saves=loadSaves();
  let id = saves[idx]?.id;
  // Also delete full game state if exists
  if(id){
    try{localStorage.removeItem('dl_save_full_'+id);}catch(e){}
    await apiDeleteGame(id);
  }
  saves.splice(idx,1);
  saveSaves(saves);
  renderSaves();
}

function saveCurrentGame(){
  if(!G || !G.timeline){ showSaveToast('无法保存：游戏未开始','var(--red)'); return; }
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
  let dataStr = null;
  try{
    const seen = new WeakSet();
    dataStr = JSON.stringify(G, function(key,val){
      if(typeof val === 'function') return undefined;
      if(val instanceof HTMLElement) return undefined;
      if(typeof val === 'object' && val !== null){
        if(seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    });
    if(dataStr.length > 4 * 1024 * 1024){
      showSaveToast('存档过大(>4MB)，仅保存摘要','var(--orange)');
    } else {
      localStorage.setItem('dl_save_full_'+saveId, dataStr);
      fullOk = true;
    }
  }catch(e){
    console.error('存档序列化失败', e);
    showSaveToast('完整存档保存失败：'+e.message, 'var(--red)');
  }
  try{
    let saves = loadSaves();
    // 查找是否已存在同ID的存档，存在则更新，不存在则新增
    let existIdx = saves.findIndex(s => s.id === saveId);
    if(existIdx >= 0){
      saves[existIdx] = summary;
    }else{
      saves.unshift(summary);
      if(saves.length > 20) saves = saves.slice(0, 20);
    }
    saveSaves(saves);
  }catch(e){
    showSaveToast('存档列表保存失败','var(--red)');
    return;
  }
  if(fullOk){
    showSaveToast('存档成功！进度已保存');
    addEventLog(G.age, 'fortune', '<b style="color:var(--green);">【存档成功】</b> 游戏进度已保存。');
  }
  // Sync to backend (non-blocking, reuse dataStr)
  try{
    let fullData = null;
    if(dataStr && dataStr.length <= 4 * 1024 * 1024){
      fullData = JSON.parse(dataStr);
    }
    apiSaveGame(summary, fullData).then(r => {
      if(r.ok && r.source === 'api'){
        console.log('存档已同步到服务器');
      }
    }).catch(e => {});
  }catch(e){}
}

async function loadSaveGame(idx){
  let saves = loadSaves();
  let s = saves[idx];
  if(!s) return;
  if(s.deathReason !== '进行中'){
    alert('该角色已死亡，无法继续游戏。');
    return;
  }
  // Try API first, fallback to localStorage
  let result = await apiLoadGame(s.id);
  let fullData = null;
  if(result.ok && result.data){
    fullData = result.data;
  }else{
    let fullKey = 'dl_save_full_' + s.id;
    try{
      fullData = JSON.parse(localStorage.getItem(fullKey));
    }catch(e){
      console.error('读取完整存档失败', e);
    }
  }
  if(!fullData){
    alert('完整存档数据丢失，无法继续游戏。');
    return;
  }
  G = fullData;
  G._processing = false;
  G.autoMode = false;
  // 记录当前存档ID，保存时复用，避免产生重复记录
  G._saveId = s.id;
  stopAutoMode();
  clearAllTimers();
  let ob=document.getElementById('mini-auto-stop-btn');if(ob)ob.style.display='none';
  let defaults=createDefaultState();
  for(let k in defaults){
    if(G[k]===undefined||G[k]===null){G[k]=defaults[k];continue;}
    if(Array.isArray(defaults[k])&&!Array.isArray(G[k])){G[k]=defaults[k];continue;}
    if(typeof defaults[k]==='object'&&!Array.isArray(defaults[k])&&defaults[k]!==null){
      if(typeof G[k]!=='object'||G[k]===null){G[k]=defaults[k];}
    }
  }
  showScreen('screen-life');
  renderSidebar();
  let log = document.getElementById('event-log');
  if(G.yearEvents && G.yearEvents.length > 0){
    log.innerHTML = G.yearEvents.map(e => `<div class="event-entry"><div class="event-year">${e.age}岁</div><div class="event-text">${e.text}</div></div>`).join('');
  }else{
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
document.getElementById('mini-wheel-overlay').addEventListener('click', function(e){
  if(e.target.id !== 'mini-wheel-spin-btn' && !e.target.closest('#mini-wheel-spin-btn')){
    closeMiniWheel();
  }
});

