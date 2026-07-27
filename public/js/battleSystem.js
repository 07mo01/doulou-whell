function calculateCombatPower(entity, isEnemy = false){
  if(!entity) return 0;
  
  let base = 10;
  if(entity.soulPower){
    base = Math.pow(1.2, entity.soulPower - 1) * 10;
  }
  
  let ringBonus = 0;
  if(entity.soulRings && entity.soulRings.length > 0){
    entity.soulRings.forEach((ring, idx) => {
      let yearMult = 1;
      if(ring.years >= 1000000) yearMult = 5;
      else if(ring.years >= 100000) yearMult = 3;
      else if(ring.years >= 10000) yearMult = 2;
      else if(ring.years >= 1000) yearMult = 1.5;
      
      let slotBonus = 1 + idx * 0.1;
      ringBonus += ring.years * yearMult * slotBonus / 1000;
    });
  }
  
  let boneBonus = 0;
  if(entity.soulBones && entity.soulBones.length > 0){
    entity.soulBones.forEach(bone => {
      let boneVal = 1000;
      if(bone.includes('躯干')) boneVal = 5000;
      else if(bone.includes('头部')) boneVal = 3000;
      else boneVal = 2000;
      boneBonus += boneVal;
    });
  }
  
  let soulBonus = 1;
  if(entity.martialSoul){
    switch(entity.martialSoul.quality){
      case '普通': soulBonus = 1.0; break;
      case '优秀': soulBonus = 1.2; break;
      case '变异': soulBonus = 1.5; break;
      case '顶级': soulBonus = 2.0; break;
      case '双生': soulBonus = 3.0; break;
    }
    if(entity.martialSoul.evolveLevel){
      soulBonus *= Math.pow(1.15, entity.martialSoul.evolveLevel);
    }
  }
  
  let skillBonus = 0;
  if(entity.customSkills && entity.customSkills.length > 0){
    skillBonus = entity.customSkills.length * 500;
  }
  
  if(entity.secondMartialSoul){
    soulBonus *= 1.5;
  }
  
  if(entity.hasSoulCore){
    soulBonus *= 1.3;
  }
  
  if(entity.godhood){
    soulBonus *= 2.0;
    base *= 10;
  }
  
  if(entity.identityType === 'soul_beast'){
    let years = entity.beastYears || 0;
    base = Math.pow(1.1, Math.log10(years)) * 100;
    ringBonus = years / 100;
  }
  
  if(isEnemy){
    let enemyMult = 0.8 + Math.random() * 0.6;
    return Math.floor((base + ringBonus + boneBonus + skillBonus) * soulBonus * enemyMult);
  }
  
  return Math.floor((base + ringBonus + boneBonus + skillBonus) * soulBonus);
}

function getCombatPowerRating(cp){
  if(cp >= 1000000) return {level: 9, name: '神级', color: '#ffdd44'};
  if(cp >= 100000) return {level: 8, name: '封号斗罗', color: '#aa66ff'};
  if(cp >= 50000) return {level: 7, name: '魂斗罗', color: '#ff66aa'};
  if(cp >= 20000) return {level: 6, name: '魂圣', color: '#66ffaa'};
  if(cp >= 10000) return {level: 5, name: '魂帝', color: '#66aaff'};
  if(cp >= 5000) return {level: 4, name: '魂王', color: '#aa66ff'};
  if(cp >= 2000) return {level: 3, name: '魂宗', color: '#ffaa66'};
  if(cp >= 1000) return {level: 2, name: '魂尊', color: '#aaaaaa'};
  if(cp >= 500) return {level: 1, name: '大魂师', color: '#888888'};
  return {level: 0, name: '魂师', color: '#666666'};
}

function buildEnemyWheel(){
  let enemyList = ENEMY_POOL;
  
  let filtered = enemyList.filter(e => {
    let targetLevel = e.minLevel;
    if(!targetLevel) targetLevel = G.soulPower - 5;
    return targetLevel <= G.soulPower + 5;
  });
  
  if(filtered.length === 0) filtered = enemyList.slice(0, 6);
  
  let wheelItems = filtered.slice(0, 8).map(e => ({
    name: e.name,
    enemy: e,
    weight: e.weight || 1,
    color: e.color || '#cc4444'
  }));
  
  return wheelItems;
}

function openEnemyWheel(callback){
  GameState.enemyWheel = {data: buildEnemyWheel(), callback};
  document.getElementById('mini-wheel-label').textContent = '强敌降临';
  document.getElementById('mini-wheel-hint').textContent = '一位强敌挡在了你的面前！';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinEnemyWheel;
  drawMiniWheel(GameState.enemyWheel.data);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function renderEnemyResult(title, titleColor, selected, enemyLevel, cpDisplay, bodyText, effectText, effectColor, extraHtml){
  return `<div class="mini-wheel-result">
    <h3 style="color:${titleColor}">${title}</h3>
    <p>${bodyText}</p>
    <p style="margin-top:8px;font-size:14px;">等级：${enemyLevel}级 | 战力：<span style="color:${cpDisplay.color}">${cpDisplay.name}</span></p>
    <div style="margin-top:12px;padding:10px;background:rgba(0,0,0,0.3);border-radius:6px;border-left:3px solid ${effectColor}">
      <p style="font-size:14px;color:${effectColor}">${effectText}</p>
      ${extraHtml || ''}
    </div>
  </div>`;
}

function spinEnemyWheel(){
  if(GameState.enemyWheel.spinning) return;
  GameState.enemyWheel.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = GameState.enemyWheel.data.reduce((s,i) => s + i.weight, 0);
  let selected = weightedRandom(GameState.enemyWheel.data);
  let selectedIdx = GameState.enemyWheel.data.indexOf(selected);
  let cumWeight = 0;
  for(let i = 0; i < selectedIdx; i++) cumWeight += GameState.enemyWheel.data[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    GameState.enemyWheel.spinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let enemy = selected.enemy;
    
    let enemyLevel = enemy.minLevel || G.soulPower + Math.floor(Math.random()*5) - 2;
    let enemyCP = calculateCombatPower({soulPower: enemyLevel}, true);
    let playerCP = calculateCombatPower(G);
    let cpDisplay = getCombatPowerRating(enemyCP);
    
    let result = '';
    let effectText = '';
    let effectColor = '';
    let extraHtml = '';
    
    let winChance = playerCP / (playerCP + enemyCP);
    let isWin = Math.random() < winChance;
    
    if(isWin){
      effectText = '战斗胜利！';
      effectColor = 'var(--green)';
      G.battleRecord.wins = (G.battleRecord.wins || 0) + 1;
      
      let spGain = Math.floor(Math.random()*2)+1;
      G.soulPower = Math.min(G.soulPower + spGain, G.maxLevel);
      
      if(Math.random() < 0.2){
        let boneTypes = ['头部魂骨','躯干魂骨','左臂骨','右臂骨','左腿骨','右腿骨'];
        let available = boneTypes.filter(b => !G.soulBones.includes(b));
        if(available.length > 0){
          let bt = available[Math.floor(Math.random()*available.length)];
          G.soulBones.push(bt);
          extraHtml = `<p style="color:var(--gold);margin-top:8px;">掉落魂骨：${bt}</p>`;
        }
      }
      
      if(Math.random() < 0.3){
        let goldGain = Math.floor(Math.random()*100)+50;
        G.gold = (G.gold || 0) + goldGain;
        if(!extraHtml) extraHtml = '';
        extraHtml += `<p style="color:var(--gold);margin-top:8px;">获得${goldGain}金魂币</p>`;
      }
      
      result = renderEnemyResult(selected.name, selected.color, selected, enemyLevel, cpDisplay, `你战胜了${selected.name}！`, effectText, effectColor, extraHtml + `<p style="color:var(--green);margin-top:8px;">魂力+${spGain}</p>`);
    } else {
      effectText = '战斗失败！';
      effectColor = 'var(--red)';
      G.battleRecord.losses = (G.battleRecord.losses || 0) + 1;
      
      let spLoss = Math.floor(Math.random()*2)+1;
      G.soulPower = Math.max(G.soulPower - spLoss, 1);
      
      if(Math.random() < 0.1){
        triggerDeath(`被${selected.name}击杀`);
        result = renderEnemyResult(selected.name, selected.color, selected, enemyLevel, cpDisplay, `你被${selected.name}击败...`, '死亡', '#ff0000', '<p style="color:#ff0000;font-weight:bold;">你已死亡，游戏结束</p>');
      } else {
        result = renderEnemyResult(selected.name, selected.color, selected, enemyLevel, cpDisplay, `你不敌${selected.name}，重伤逃脱。`, effectText, effectColor, `<p style="color:var(--red);margin-top:8px;">魂力-${spLoss}</p>`);
      }
    }
    
    area.innerHTML = result;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 2500);
}