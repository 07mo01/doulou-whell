let G = null;
let wheelQueue = [];
let wheelIndex = 0;
let currentWheelData = null;
let globalAchievements = [];

function loadGlobalAchievements(){
  let saved = localStorage.getItem('douluo_global_achievements');
  if(saved){
    try{globalAchievements = JSON.parse(saved);}catch(e){globalAchievements=[];}
  }
}

function saveGlobalAchievements(){
  localStorage.setItem('douluo_global_achievements', JSON.stringify(globalAchievements));
}

function weightedRandom(items,weightKey='weight'){
  let total = items.reduce((s,i) => s + (i[weightKey]||1), 0);
  let r = Math.random() * total;
  let cum = 0;
  for(let i of items){
    cum += i[weightKey]||1;
    if(r < cum) return i;
  }
  return items[items.length-1];
}

function getRingLimit(ringNum){
  let base = [0,423,1750,7140,28570,114280,457140,1828570,7314280];
  let mult = 1.0;
  if(G.martialSoul){
    switch(G.martialSoul.quality){
      case '优秀': mult = 1.3; break;
      case '变异': mult = 1.6; break;
      case '顶级': mult = 2.0; break;
      case '双生': mult = 3.0; break;
    }
    if(G.martialSoul.evolveLevel) mult *= Math.pow(1.2, G.martialSoul.evolveLevel);
  }
  return Math.floor(base[ringNum] * mult);
}

function getLevelName(level){
  if(level >= 100) return '封号斗罗';
  if(level >= 90) return '封号斗罗';
  if(level >= 80) return '魂斗罗';
  if(level >= 70) return '魂圣';
  if(level >= 60) return '魂帝';
  if(level >= 50) return '魂王';
  if(level >= 40) return '魂宗';
  if(level >= 30) return '魂尊';
  if(level >= 20) return '大魂师';
  if(level >= 10) return '魂师';
  return '魂士';
}

function getActiveSoul(){
  if(G.identityType === 'soul_beast') return null;
  if(!G.martialSoul) return null;
  if(!G.secondMartialSoul) return G.martialSoul;
  return G.activeSoul === 0 ? G.martialSoul : G.secondMartialSoul;
}

function switchActiveSoul(index){
  if(!G.secondMartialSoul) return;
  G.activeSoul = index;
}

function rerollAll(){
  document.getElementById('wheel-canvas').style.transition = 'none';
  document.getElementById('wheel-canvas').style.transform = 'rotate(0deg)';
  setTimeout(() => {
    startNewGame();
  }, 50);
}

function checkSoulEvolution(){
  if(!G.martialSoul || G.identityType === 'soul_beast') return null;
  let evo = MARTIAL_SOUL_EVOLUTION.find(e => e.id === G.martialSoul.id);
  if(!evo) return null;
  let currentStage = evo.path.find(p => p.id === G.martialSoul.currentEvolution);
  if(!currentStage) currentStage = evo.path[0];
  let nextStage = evo.path[evo.path.indexOf(currentStage) + 1];
  if(!nextStage) return null;
  
  let metRequirements = nextStage.requirements.every(req => {
    if(req.type === 'level') return G.soulPower >= req.value;
    if(req.type === 'age') return G.Age >= req.value;
    if(req.type === 'merit') return (G.merit || 0) >= req.value;
    if(req.type === 'gold') return (G.gold || 0) >= req.value;
    if(req.type === 'timeline') return G.timeline.id === req.value;
    if(req.type === 'bone') return (G.soulBones || []).length >= req.value;
    if(req.type === 'ring') return (G.soulRings || []).length >= req.value;
    return true;
  });
  
  if(metRequirements){
    return {currentStage, nextStage};
  }
  return null;
}

function getCachedCombatPower(){
  let key = `${G.soulPower}-${G.soulRings.length}-${G.identityType}-${G.martialSoul?.quality}`;
  if(_combatPowerCacheKey === key) return _combatPowerCache;
  let cp = calculateCombatPower(G);
  _combatPowerCache = cp;
  _combatPowerCacheKey = key;
  return cp;
}

function checkSoulCoreFormation(){
  if(G.soulPower < 90) return null;
  if(G.hasSoulCore) return null;
  if(G.soulRings.length < 9) return null;
  
  let hasNineRings = G.soulRings.length >= 9;
  let hasEnoughBones = (G.soulBones || []).length >= 3;
  let hasHighQualityRing = G.soulRings.some(r => r.years >= 100000);
  
  if(hasNineRings && (hasEnoughBones || hasHighQualityRing)){
    return {
      canForm: true,
      hasEnoughBones,
      hasHighQualityRing
    };
  }
  return null;
}

function getEvolutionPotential(martialSoul){
  if(!martialSoul) return {level: 0, name: '未知', power: 0};
  let evo = MARTIAL_SOUL_EVOLUTION.find(e => e.id === martialSoul.id);
  if(!evo) return {level: 0, name: '普通', power: 5};
  
  let currentStage = evo.path.find(p => p.id === martialSoul.currentEvolution);
  if(!currentStage) currentStage = evo.path[0];
  
  let stageIndex = evo.path.indexOf(currentStage);
  let maxIndex = evo.path.length - 1;
  
  return {
    level: stageIndex + 1,
    maxLevel: maxIndex + 1,
    name: currentStage.name,
    power: currentStage.power,
    canEvolve: stageIndex < maxIndex,
    nextStage: stageIndex < maxIndex ? evo.path[stageIndex + 1] : null
  };
}

function getQualityWeightsForIdentity(identity, identityType){
  if(identityType === 'god'){
    return [
      {value:'顶级',weight:50},
      {value:'变异',weight:30},
      {value:'优秀',weight:15},
      {value:'普通',weight:5}
    ];
  }
  if(identity === 'soul_beast'){
    return [
      {value:'普通',weight:45},
      {value:'优秀',weight:30},
      {value:'变异',weight:18},
      {value:'顶级',weight:7}
    ];
  }
  return [
    {value:'普通',weight:40},
    {value:'优秀',weight:30},
    {value:'变异',weight:20},
    {value:'顶级',weight:10}
  ];
}

function buildQualityWheel(){
  let weights = getQualityWeightsForIdentity(G.identity, G.identityType);
  return weights.map(w => ({name: w.value, weight: w.weight, color: QUALITY_COLORS[w.value] || '#888'}));
}

function pickNameWheelItems(tier, count){
  let names = MARTIAL_SOUL_NAMES[tier] || [];
  let selected = [];
  for(let i=0;i<count;i++){
    if(names.length === 0) break;
    let idx = Math.floor(Math.random()*names.length);
    selected.push(names[idx]);
    names.splice(idx,1);
  }
  return selected;
}

function randomSoulName(tier){
  let names = MARTIAL_SOUL_NAMES[tier] || MARTIAL_SOUL_NAMES.common;
  return names[Math.floor(Math.random()*names.length)];
}

function generateRingSkills(ringNum, years, martialSoul){
  let baseCount = 1;
  if(years >= 1000000) baseCount = 4;
  else if(years >= 100000) baseCount = 2;
  else if(Math.random() < 0.3) baseCount = 2;
  
  let skills = [];
  let skillTypes = martialSoul?.skillTypes || ['attack'];
  
  for(let i=0;i<baseCount;i++){
    let type = skillTypes[Math.floor(Math.random()*skillTypes.length)];
    let name = generateSkillDesc(type, ringNum, years);
    skills.push({name: name.name, desc: name.desc, type});
  }
  
  return skills;
}

function generateSkillDesc(name, type, ringNum, years){
  let tier = '';
  if(years >= 1000000) tier = '神级';
  else if(years >= 100000) tier = '十万年';
  else if(years >= 10000) tier = '万年';
  else if(years >= 1000) tier = '千年';
  else tier = '百年';
  
  let effects = {
    attack: ['攻击力提升', '破甲效果', '范围伤害', '暴击率提升'],
    defense: ['防御力提升', '反弹伤害', '护盾效果', '减伤效果'],
    control: ['眩晕效果', '定身效果', '减速效果', '禁锢效果'],
    boost: ['速度提升', '魂力恢复', '全属性提升', '爆发伤害'],
    healing: ['生命恢复', '解除异常', '持续恢复', '复活效果']
  };
  
  let effect = effects[type] || effects.attack;
  let effectText = effect[Math.floor(Math.random()*effect.length)];
  
  return {name: `${name}`, desc: `${tier}魂技，${effectText}，威力随魂环年限增长`};
}

function getTimelineProgressEvent(){
  let events = TIMELINE_PROGRESS_EVENTS[G.timeline.id];
  if(!events) return null;
  
  let eligibleEvents = events.filter(e => {
    if(e.minLevel && G.soulPower < e.minLevel) return false;
    if(e.maxLevel && G.soulPower > e.maxLevel) return false;
    if(e.minAge && G.Age < e.minAge) return false;
    return true;
  });
  
  if(eligibleEvents.length === 0) return null;
  
  return weightedRandom(eligibleEvents);
}

function createDefaultState(){
  return {
    Name: '',
    Avatar: '',
    Age: 6,
    gender: '男',
    identity: '',
    identityType: '',
    martialSoul: null,
    secondMartialSoul: null,
    activeSoul: 0,
    soulPower: 1,
    maxLevel: 99,
    soulRings: [],
    soulBones: [],
    customSkills: [],
    soulCore: null,
    hasSoulCore: false,
    spiritSoul: null,
    timeline: {id: 'douluo1', name: '斗罗大陆'},
    gold: 0,
    familyWealth: 0,
    merit: 0,
    relationship: '',
    partner: null,
    children: [],
    achievements: [],
    eventLog: [],
    school: null,
    schoolYears: 0,
    godhood: null,
    godPower: 0,
    divineDomain: '',
    divineName: '',
    timelineCharacters: [],
    battleRecord: {wins: 0, losses: 0, draws: 0},
    evolutionPotential: 0,
    currentEvolution: '',
    partnerEvents: [],
    justiceEvents: [],
    auctionEvents: [],
    fortuneEvents: [],
    schoolEvents: [],
    normalEvents: [],
    autoMode: false,
    autoSpeed: 1,
    isDead: false,
    deathReason: ''
  };
}

function initParticles(){
  let container=document.getElementById('particles');
  if(!container)return;
  container.innerHTML='';
  for(let i=0;i<50;i++){
    let p=document.createElement('div');
    p.className='particle';
    p.style.left=Math.random()*100+'%';
    p.style.top=Math.random()*100+'%';
    p.style.animationDelay=Math.random()*5+'s';
    p.style.width=Math.random()*4+2+'px';
    p.style.height=p.style.width;
    container.appendChild(p);
  }
}

function generateRandomCharacter(forceType){
  let identity = forceType || ['human','soul_beast'][Math.floor(Math.random()*2)];
  let identityType = identity === 'human' ? 'human' : 'soul_beast';
  
  if(identity === 'human'){
    let qualities = getQualityWeightsForIdentity(identity, identityType);
    let qualityWheel = qualities.map(q => ({name: q.value, weight: q.weight, color: QUALITY_COLORS[q.value] || '#888'}));
    let quality = weightedRandom(qualityWheel);
    
    let tier = '';
    if(quality.name === '顶级') tier = 'legendary';
    else if(quality.name === '变异') tier = 'rare';
    else if(quality.name === '优秀') tier = 'common';
    else tier = 'common';
    
    let names = pickNameWheelItems(tier, 6);
    if(names.length === 0) names = ['昊天锤','蓝银草','白虎','幽冥灵猫','七宝琉璃塔','邪眸白虎'];
    
    let isTwin = Math.random() < (quality.name === '顶级' ? 0.3 : 0.1);
    
    let firstSoul = {
      name: names[0],
      quality: quality.name,
      id: names[0],
      currentEvolution: names[0],
      evolveLevel: 0,
      skillTypes: getSkillTypesForSoul(names[0]),
      power: quality.name === '顶级' ? 9 : quality.name === '变异' ? 7 : quality.name === '优秀' ? 5 : 3
    };
    
    let secondSoul = null;
    if(isTwin && names.length > 1){
      secondSoul = {
        name: names[1],
        quality: quality.name,
        id: names[1],
        currentEvolution: names[1],
        evolveLevel: 0,
        skillTypes: getSkillTypesForSoul(names[1]),
        power: quality.name === '顶级' ? 9 : quality.name === '变异' ? 7 : quality.name === '优秀' ? 5 : 3
      };
    }
    
    let innatePower = 1;
    if(quality.name === '顶级') innatePower = Math.floor(Math.random()*2)+8;
    else if(quality.name === '变异') innatePower = Math.floor(Math.random()*3)+6;
    else if(quality.name === '优秀') innatePower = Math.floor(Math.random()*4)+4;
    else innatePower = Math.floor(Math.random()*5)+1;
    
    if(isTwin) innatePower = 10;
    
    let familyWealth = Math.floor(Math.random()*200);
    
    return {
      Name: '',
      Avatar: '',
      Age: 6,
      gender: ['男','女'][Math.floor(Math.random()*2)],
      identity: 'human',
      identityType: 'human',
      martialSoul: firstSoul,
      secondMartialSoul: secondSoul,
      activeSoul: 0,
      soulPower: innatePower,
      maxLevel: 99,
      soulRings: [],
      soulBones: [],
      customSkills: [],
      soulCore: null,
      hasSoulCore: false,
      spiritSoul: null,
      timeline: {id: 'douluo1', name: '斗罗大陆'},
      gold: familyWealth > 100 ? Math.floor(Math.random()*100)+50 : 0,
      familyWealth: familyWealth,
      merit: 0,
      relationship: '',
      partner: null,
      children: [],
      achievements: [],
      eventLog: [],
      school: null,
      schoolYears: 0,
      godhood: null,
      godPower: 0,
      divineDomain: '',
      divineName: '',
      timelineCharacters: [],
      battleRecord: {wins: 0, losses: 0, draws: 0},
      evolutionPotential: getEvolutionPotential(firstSoul).power,
      currentEvolution: firstSoul.name,
      partnerEvents: [],
      justiceEvents: [],
      auctionEvents: [],
      fortuneEvents: [],
      schoolEvents: [],
      normalEvents: [],
      autoMode: false,
      autoSpeed: 1,
      isDead: false,
      deathReason: '',
      tempNames: names.slice(0,6),
      tempQuality: quality,
      tempIdentity: 'human'
    };
  } else {
    let tiers = ['common','rare','epic','legendary','mythic','beast'];
    let weights = [35,25,20,12,5,3];
    let tierWheel = tiers.map((t,i) => ({name: t, weight: weights[i]}));
    let tier = weightedRandom(tierWheel);
    
    let names = SPIRIT_SOUL_NAMES[tier.name] || ['未知魂兽'];
    let soulName = names[Math.floor(Math.random()*names.length)];
    
    let years = 0;
    let color = SOUL_RING_COLORS[0];
    switch(tier.name){
      case 'common': years = Math.floor(Math.random()*500)+100; color = SOUL_RING_COLORS[0]; break;
      case 'rare': years = Math.floor(Math.random()*1500)+1000; color = SOUL_RING_COLORS[0]; break;
      case 'epic': years = Math.floor(Math.random()*4000)+5000; color = SOUL_RING_COLORS[1]; break;
      case 'legendary': years = Math.floor(Math.random()*50000)+10000; color = SOUL_RING_COLORS[2]; break;
      case 'mythic': years = Math.floor(Math.random()*50000)+100000; color = SOUL_RING_COLORS[3]; break;
      case 'beast': years = Math.floor(Math.random()*900000)+1000000; color = SOUL_RING_COLORS[4]; break;
    }
    
    let skills = [];
    let skillCount = tier.name === 'beast' ? 4 : tier.name === 'mythic' ? 3 : tier.name === 'legendary' ? 2 : 1;
    for(let i=0;i<skillCount;i++){
      let skillTypes = ['attack','defense','control','boost'];
      let type = skillTypes[Math.floor(Math.random()*skillTypes.length)];
      let name = generateSkillDesc(soulName+'·技能', type, 0, years);
      skills.push({name: name.name, desc: name.desc, type});
    }
    
    return {
      Name: soulName,
      Avatar: '',
      Age: Math.floor(years / 100) + 1,
      gender: Math.random() < 0.5 ? '雄' : '雌',
      identity: 'soul_beast',
      identityType: 'soul_beast',
      martialSoul: null,
      secondMartialSoul: null,
      activeSoul: 0,
      soulPower: Math.floor(Math.log10(years)) + 1,
      maxLevel: 99,
      soulRings: [],
      soulBones: [],
      customSkills: skills,
      soulCore: null,
      hasSoulCore: false,
      spiritSoul: null,
      timeline: {id: 'douluo1', name: '斗罗大陆'},
      gold: 0,
      familyWealth: 0,
      merit: 0,
      relationship: '',
      partner: null,
      children: [],
      achievements: [],
      eventLog: [],
      school: null,
      schoolYears: 0,
      godhood: null,
      godPower: 0,
      divineDomain: '',
      divineName: '',
      timelineCharacters: [],
      battleRecord: {wins: 0, losses: 0, draws: 0},
      evolutionPotential: tier.name === 'beast' ? 10 : tier.name === 'mythic' ? 8 : tier.name === 'legendary' ? 6 : 4,
      currentEvolution: soulName,
      partnerEvents: [],
      justiceEvents: [],
      auctionEvents: [],
      fortuneEvents: [],
      schoolEvents: [],
      normalEvents: [],
      autoMode: false,
      autoSpeed: 1,
      isDead: false,
      deathReason: '',
      beastYears: years,
      beastTier: tier.name,
      beastSkills: skills,
      tempNames: [soulName],
      tempQuality: {name: tier.name, weight: 100},
      tempIdentity: 'soul_beast'
    };
  }
}

function getSkillTypesForSoul(name){
  if(name.includes('锤') || name.includes('剑') || name.includes('刀')) return ['attack','boost'];
  if(name.includes('塔') || name.includes('鼎') || name.includes('炉')) return ['boost','healing'];
  if(name.includes('猫') || name.includes('狐') || name.includes('蛛')) return ['attack','control'];
  if(name.includes('草') || name.includes('花') || name.includes('树')) return ['control','healing'];
  if(name.includes('龙') || name.includes('虎') || name.includes('熊')) return ['attack','defense'];
  if(name.includes('眸') || name.includes('眼') || name.includes('瞳')) return ['control','attack'];
  return ['attack','defense'];
}

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