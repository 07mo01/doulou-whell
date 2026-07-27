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
  G.Age = 6;
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

function startNewGame(){
  clearAllTimers();
  G=createDefaultState();
  wheelIndex=0;

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

      let remaining = (G._awakenCount || 1) - (G._awakenedSouls?.length || 0);
      if(remaining > 0){
        hint.textContent=`还有${remaining}个武魂待觉醒...`;
        let nextQualityItems = buildQualityWheel();
        pushNextWheel('soul_quality', '抽取武魂品质', '品', nextQualityItems);
      }else{
        hint.textContent='所有武魂已觉醒，接下来抽取性格...';
        pushNextWheel('personality', '抽取性格', '性', PERSONALITIES);
      }
      break;
    case 'personality':
      G.personality=item;
      area.innerHTML=`<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='性格已定，接下来抽取外貌...';
      pushNextWheel('appearance', '抽取外貌', '貌', APPEARANCES);
      break;
    case 'appearance':
      G.appearance=item;
      area.innerHTML=`<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
      hint.textContent='一切就绪，即将开始你的斗罗之路...';
      break;
  }

  document.getElementById('wheel-spin-btn').style.display='none';
  document.getElementById('wheel-continue-btn').style.display='';
}

function nextWheelStep(){
  wheelIndex++;
  if(wheelIndex >= wheelQueue.length){
    finalizeCharacter();
    return;
  }
  setupNextWheel();
  document.getElementById('wheel-spin-btn').style.display='';
  document.getElementById('wheel-continue-btn').style.display='none';
}

function finalizeCharacter(){
  if(G.identityType === 'human'){
    G.Age = 6;
    G.alive = true;
    
    if(G._awakenedSouls && G._awakenedSouls.length > 0){
      G.martialSoul = G._awakenedSouls[0];
      if(G._awakenedSouls.length > 1){
        G.secondMartialSoul = G._awakenedSouls[1];
      }
    }
    
    G.innatePower = Math.floor(Math.random() * 10) + 1;
    G.soulPower = G.innatePower;
    G.maxLevel = 99;
    G.maxAge = 150;
  }
  
  if(G.timeline.id === 'douluo4'){G.maxLevel = 150; G.maxAge = 200;}
  else if(G.timeline.id === 'godrealm'){G.maxLevel = 200; G.maxAge = 999;}
  
  showAwakening();
}

function checkRingMilestone(){
  if(G.identityType === 'soul_beast' || G.identityType === 'god' || G.identityType === 'divine_beast') return null;
  if(G.soulRings.length >= 9) return null;
  
  let nextRingLevel = RING_MILESTONES[G.soulRings.length];
  if(G.soulPower >= nextRingLevel){
    return {
      type: 'fortune',
      text: `<b style="color:var(--gold);">【突破】</b> 魂力达到${G.soulPower}级，突破瓶颈！需要猎杀第${G.soulRings.length+1}魂环...`,
      ringMilestone: true
    };
  }
  
  return null;
}

function checkDouluoPath(){
  if(G.soulPower < 91 || G.chosenPath) return null;
  if(G.identityType === 'soul_beast' || G.identityType === 'god' || G.identityType === 'divine_beast') return null;
  
  return {
    type: 'fortune',
    text: '<b style="color:var(--gold);">【封号斗罗】</b> 你的修为突破90级，成为封号斗罗！是时候选择未来的道路了...'
  };
}

function checkGodhood(){
  if(G.soulPower < G.maxLevel || G.isGod) return null;
  if(G.identityType === 'soul_beast' || G.identityType === 'god' || G.identityType === 'divine_beast') return null;
  if(G.chosenPath === 'family') return null;
  
  return {
    type: 'fortune',
    text: '<b style="color:var(--gold);">【成神之路】</b> 你的修为已达到当前位面的极限，感应到了神位的召唤...'
  };
}

function enterLife(){
  showScreen('screen-life');
  renderSidebar();
  renderLifeMain();
}

function nextYear(){
  if(G.autoMode) stopAutoMode();
  if(!G.alive) return;

  let step = getYearStep();
  let targetAge = Math.min(G.Age + step, G.maxAge);
  let events = [];
  let hasRingMilestone = false;

  processYearChain(0, targetAge - G.Age, events, () => {
    finishYearAdvance(events, hasRingMilestone);
  });
}

function processYearChain(idx, total, events, callback){
  if(idx >= total){
    callback();
    return;
  }

  G.Age++;

  let yearlyEvent = null;
  if(G.Age % 5 === 0){
    yearlyEvent = processNormalEvent();
    events.push(yearlyEvent);
    addEventLog(G.Age, 'yearly', yearlyEvent.text);
  }else if(Math.random() < 0.3){
    yearlyEvent = processNormalEvent();
    events.push(yearlyEvent);
    addEventLog(G.Age, 'random', yearlyEvent.text);
  }

  let ringMilestone = checkRingMilestone();
  if(ringMilestone){
    events.push(ringMilestone);
    addEventLog(G.Age, 'milestone', ringMilestone.text);
  }

  let evolutionEvent = checkSoulEvolution();
  if(evolutionEvent){
    events.push(evolutionEvent);
    addEventLog(G.Age, 'evolution', evolutionEvent.text);
  }

  if(G.identityType === 'soul_beast'){
    addBeastYears(100);
  }

  if(G.Age >= 18 && G.soulPower >= 10 && G.timeline.id !== 'godrealm'){
    let pathChoice = checkDouluoPath();
    if(pathChoice){
      events.push(pathChoice);
      addEventLog(G.Age, 'path', pathChoice.text);
    }
  }

  if(G.soulPower >= 95 && !G.godhood){
    let godhoodChoice = checkGodhood();
    if(godhoodChoice){
      events.push(godhoodChoice);
      addEventLog(G.Age, 'godhood', godhoodChoice.text);
    }
  }

  managedTimeout(() => {
    processYearChain(idx + 1, total, events, callback);
  }, 1000 / G.autoSpeed);
}

function finishYearAdvance(events, hasRingMilestone){
  renderSidebar();
  renderLifeMain();

  if(events.length > 0){
    let eventTexts = events.map(e => e.text).join('\n\n');
    showEventModal(G.Age, 'year', eventTexts, []);
  }

  if(G.Age >= G.maxAge){
    triggerDeath('寿终正寝');
  }

  saveCurrentGame();
}

function openGodhoodChoice(){
  document.getElementById('godhood-overlay').classList.add('active');
}

function chooseGodhood(type){
  G.godhood = type;
  G.maxLevel = 200;
  G.maxAge = 999;

  closeGodhoodChoice();

  if(type === 'new'){
    showEventModal(G.Age, 'godhood', '你选择了自创神位！\n你的魂力上限提升至200级，寿命无限！', []);
  }else if(type === 'inherit'){
    showEventModal(G.Age, 'godhood', '你选择了继承神位！\n你的魂力上限提升至200级，获得传承技能！', []);
  }
}

function closeGodhoodChoice(){
  document.getElementById('godhood-overlay').classList.remove('active');
}

function openDouluoPathChoice(){
  document.getElementById('douluo-path-overlay').classList.add('active');
}

function chooseDouluoPath(path){
  G.douluoPath = path;
  closeDouluoPathChoice();

  let effects = {
    combat: {text:'你选择了战魂师之路！攻击力永久提升！', bonus:{attack:1.1}},
    control: {text:'你选择了控制系魂师之路！控制力永久提升！', bonus:{control:1.1}},
    assist: {text:'你选择了辅助系魂师之路！治疗力永久提升！', bonus:{healing:1.1}},
    agile: {text:'你选择了敏攻系魂师之路！速度永久提升！', bonus:{speed:1.1}},
    food: {text:'你选择了食物系魂师之路！魂力恢复提升！', bonus:{recovery:1.1}}
  };

  let effect = effects[path] || effects.combat;
  showEventModal(G.Age, 'path', effect.text, []);
  G.pathBonus = effect.bonus;
}

function getRomanceCandidates(){
  let candidates = [];
  
  let timelineChars = TIMELINE_CHARACTERS[G.timeline.id] || [];
  timelineChars.forEach(c => {
    if(c.isFemale || c.isMale){
      candidates.push({
        name: c.name,
        desc: c.desc,
        color: c.color || '#ff66aa',
        weight: c.weight || 1,
        spBonus: c.sp || 0,
        skill: c.skill || null
      });
    }
  });

  let defaultCandidates = [
    {name: '神秘少女', desc: '一位神秘的少女出现在你面前...', color: '#ff66aa', weight: 2},
    {name: '青梅竹马', desc: '你的青梅竹马来找你了...', color: '#aa66ff', weight: 2},
    {name: '学院同学', desc: '学院里的同学向你示好...', color: '#66aaff', weight: 2}
  ];

  return [...candidates, ...defaultCandidates];
}

let autoTimer=null;
function stopAutoMode(){
  if(autoTimer){clearTimeout(autoTimer);autoTimer=null;}
  G.autoMode=false;
  document.getElementById('auto-btn').textContent='开启自动';
}

function toggleAuto(){
  if(G.autoMode){
    stopAutoMode();
    return;
  }
  G.autoMode=true;
  document.getElementById('auto-btn').textContent='停止自动';
  runAuto();
}

function runAuto(){
  if(!G.autoMode || !G.alive)return;
  nextYear();
  autoTimer=setTimeout(runAuto,2000);
}

function triggerDeath(reason){
  G.alive=false;
  G.isDead=true;
  G.deathReason=reason;
  stopAutoMode();
  showScreen('screen-review');
  renderReview();
}