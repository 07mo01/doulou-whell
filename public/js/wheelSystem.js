let wheelState = {
  spinning: false,
  data: null,
  callback: null
};

let pendingTimers = [];

function managedTimeout(fn, delay) {
  const timer = setTimeout(fn, delay);
  pendingTimers.push(timer);
  return timer;
}

function clearAllTimers() {
  pendingTimers.forEach(t => clearTimeout(t));
  pendingTimers = [];
}

function buildSoulRingWheel(){
  let items = [];
  let weights = [
    {min:0,max:1000,weight:15,label:'百年'},
    {min:1001,max:5000,weight:20,label:'千年'},
    {min:5001,max:10000,weight:15,label:'万年'},
    {min:10001,max:50000,weight:10,label:'五万年'},
    {min:50001,max:100000,weight:8,label:'十万年'},
    {min:100001,max:500000,weight:5,label:'五十万年'},
    {min:500001,max:999999,weight:3,label:'百万年'},
    {min:1000000,max:9999999,weight:2,label:'凶兽'}
  ];
  weights.forEach(w => {
    let count = Math.floor(Math.random()*3)+1;
    for(let i=0;i<count;i++){
      let years = Math.floor(Math.random()*(w.max-w.min+1)) + w.min;
      items.push({
        name: `${w.label}`,
        years: years,
        weight: w.weight / count,
        color: SOUL_RING_COLORS.find(c => years <= c.max)?.bg || '#333'
      });
    }
  });
  return items;
}

function buildSpiritSoulWheel(){
  let items = [];
  let weights = [
    {tier:'common',weight:30,label:'普通'},
    {tier:'rare',weight:25,label:'百年'},
    {tier:'epic',weight:20,label:'千年'},
    {tier:'legendary',weight:15,label:'万年'},
    {tier:'mythic',weight:8,label:'十万年'},
    {tier:'beast',weight:2,label:'凶兽'}
  ];
  weights.forEach(w => {
    let count = Math.floor(Math.random()*2)+1;
    for(let i=0;i<count;i++){
      let names = SPIRIT_SOUL_NAMES[w.tier] || ['未知魂灵'];
      let soulName = names[Math.floor(Math.random()*names.length)];
      let years = getSpiritSoulYears(w.tier);
      items.push({
        name: `${w.label}·${soulName}`,
        soulName: soulName,
        tier: w.tier,
        years: years,
        weight: w.weight / count,
        color: SOUL_RING_COLORS.find(c => years <= c.max)?.bg || '#333'
      });
    }
  });
  return items;
}

function getSpiritSoulYears(tier){
  switch(tier){
    case 'common': return Math.floor(Math.random()*500)+100;
    case 'rare': return Math.floor(Math.random()*1500)+1000;
    case 'epic': return Math.floor(Math.random()*4000)+5000;
    case 'legendary': return Math.floor(Math.random()*50000)+10000;
    case 'mythic': return Math.floor(Math.random()*50000)+100000;
    case 'beast': return Math.floor(Math.random()*900000)+1000000;
    default: return 100;
  }
}

function openSpiritSoulWheel(callback){
  GameState.spiritSoulWheel = {data: buildSpiritSoulWheel(), callback};
  let ringNum = G.soulRings.length + 1;
  let eraName = G.timeline.id === 'douluo4' ? '传灵塔/联邦' : '传灵塔';
  document.getElementById('mini-wheel-label').textContent = `第${ringNum}魂环 · ${eraName}魂灵契约`;
  document.getElementById('mini-wheel-hint').textContent = '魂兽濒临灭绝，通过传灵塔契约魂灵获取魂环';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinSpiritSoulWheel;
  drawMiniWheel(GameState.spiritSoulWheel.data);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinSpiritSoulWheel(){
  if(GameState.spiritSoulWheel.spinning) return;
  GameState.spiritSoulWheel.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  try{
    let total = GameState.spiritSoulWheel.data.reduce((s,i) => s + i.weight, 0);
    let selected = weightedRandom(GameState.spiritSoulWheel.data);
    let selectedIdx = GameState.spiritSoulWheel.data.indexOf(selected);
    if(selectedIdx < 0) selectedIdx = 0;
    let cumWeight = 0;
    for(let i = 0; i < selectedIdx; i++) cumWeight += GameState.spiritSoulWheel.data[i].weight;
    let sectorAngle = (selected.weight / total) * 360;
    let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
    let finalAngle = 360 * 6 + (360 - targetCenter + 270);
    canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
    canvas.style.transform = `rotate(${finalAngle}deg)`;
    managedTimeout(() => {
      try{
        GameState.spiritSoulWheel.spinning = false;
        btn.classList.remove('btn-disabled');
        let ringNum = G.soulRings.length;
        let limit = getRingLimit(ringNum);
        let area = document.getElementById('mini-wheel-result-area');
        let target = selected.years;
        let color = SOUL_RING_COLORS.find(c => target <= c.max) || SOUL_RING_COLORS[SOUL_RING_COLORS.length-1];

        let skills = generateRingSkills(ringNum, target, G.martialSoul);
        G.soulRings.push({
          years: target, color: color.cn, css: color.css, bg: color.bg,
          skills: skills, spiritSoul: {name: selected.soulName, tier: selected.tier}
        });
        G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);

        let boneHtml = '';
        if(target >= 1000000){
          let allBones = ['头部魂骨','躯干魂骨','左臂骨','右臂骨','左腿骨','右腿骨'];
          allBones.forEach(b => {if(!G.soulBones.includes(b)) G.soulBones.push(b);});
          boneHtml = `<br><span style="color:var(--gold)">【凶兽魂灵附赠：全套六块魂骨！】</span>`;
        }else if(target >= 100000){
          let boneTypes = ['头部魂骨','躯干魂骨','左臂骨','右臂骨','左腿骨','右腿骨'];
          let available = boneTypes.filter(b => !G.soulBones.includes(b));
          if(available.length > 0){
            let bt = available[Math.floor(Math.random()*available.length)];
            G.soulBones.push(bt);
            boneHtml = `<br><span style="color:var(--gold)">【顶级魂灵附赠：${bt}！】</span>`;
          }
        }

        let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">魂灵契约成功！</h3><p>在传灵塔与 <strong style="color:${selected.color}">${selected.soulName}</strong> 签订契约</p><p>获得 <span style="color:${color.bg}">${color.cn}魂环</span>（第${ringNum+1}环 · ${selected.tier}级魂灵 · ${target}年）</p><p>魂力+2级${boneHtml}</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
        document.getElementById('mini-wheel-spin-btn').style.display = 'none';
        document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
      }catch(e){
        GameState.spiritSoulWheel.spinning = false;
        btn.classList.remove('btn-disabled');
        document.getElementById('mini-wheel-result-area').innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘处理异常，请关闭后重试。</p></div>';
      }
    }, 2500);
  }catch(e){
    GameState.spiritSoulWheel.spinning = false;
    btn.classList.remove('btn-disabled');
    document.getElementById('mini-wheel-result-area').innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘初始化异常，请重试。</p></div>';
  }
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
  ctx.beginPath();
  ctx.arc(cx, cy, r + ringGap, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,215,0,0.5)';
  ctx.lineWidth = ringWidth;
  ctx.stroke();
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
    G.soulRings.push({
      years: 0, color: divineColor.cn, css: divineColor.css, bg: divineColor.bg,
      skills: skills, isDivine: true
    });
    G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);
    
    let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');
    showEventModal(G.age, 'fortune', `<b style="color:var(--gold);">【神赐魂环】</b> 神界之力降临！\n获得第${ringNum}个神赐魂环\n${divineColor.cn}品质，随等级成长`, [
      {text:'接受神赐',effect:(g)=>{return '';}}
    ]);
    setTimeout(()=>{
      document.getElementById('mini-wheel-result-area').innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">神赐魂环降临！</h3><p>神界之力为你凝聚第${ringNum}魂环</p><p>获得 <span style="color:${divineColor.bg}">${divineColor.cn}神赐魂环</span></p><p style="margin-top:8px;color:var(--cyan)">魂环随等级提升而自动成长</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
      document.getElementById('mini-wheel-spin-btn').style.display = 'none';
      callback(G.soulRings[G.soulRings.length-1]);
    }, 500);
    return;
  }

  if(G.timeline?.id === 'douluo3' || G.timeline?.id === 'douluo4'){
    openSpiritSoulWheel(callback);
    return;
  }

  GameState.miniWheel = {data: buildSoulRingWheel(), callback};
  let ringNum = G.soulRings.length + 1;
  document.getElementById('mini-wheel-label').textContent = `第${ringNum}魂环 · 魂兽猎杀`;
  document.getElementById('mini-wheel-hint').textContent = '猎杀魂兽获取魂环，承受极限由武魂品质决定';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinMiniWheel;
  drawMiniWheel(GameState.miniWheel.data);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinMiniWheel(){
  if(GameState.miniWheel.spinning) return;
  GameState.miniWheel.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  try{
    let total = GameState.miniWheel.data.reduce((s,i) => s + i.weight, 0);
    let selected = weightedRandom(GameState.miniWheel.data);
    let selectedIdx = GameState.miniWheel.data.indexOf(selected);
    if(selectedIdx < 0) selectedIdx = 0;
    let cumWeight = 0;
    for(let i = 0; i < selectedIdx; i++) cumWeight += GameState.miniWheel.data[i].weight;
    let sectorAngle = (selected.weight / total) * 360;
    let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
    let finalAngle = 360 * 6 + (360 - targetCenter + 270);
    canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
    canvas.style.transform = `rotate(${finalAngle}deg)`;
    managedTimeout(() => {
      try{
        GameState.miniWheel.spinning = false;
        btn.classList.remove('btn-disabled');
        let ringNum = G.soulRings.length;
        let limit = getRingLimit(ringNum);
        let area = document.getElementById('mini-wheel-result-area');
        let target = selected.years;
        let color = SOUL_RING_COLORS.find(c => target <= c.max) || SOUL_RING_COLORS[SOUL_RING_COLORS.length-1];

        let skills = generateRingSkills(ringNum, target, G.martialSoul);
        G.soulRings.push({
          years: target, color: color.cn, css: color.css, bg: color.bg,
          skills: skills
        });
        G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);

        let boneHtml = '';
        if(target >= 1000000){
          let allBones = ['头部魂骨','躯干魂骨','左臂骨','右臂骨','左腿骨','右腿骨'];
          allBones.forEach(b => {if(!G.soulBones.includes(b)) G.soulBones.push(b);});
          boneHtml = `<br><span style="color:var(--gold)">【百万年魂兽：获得全套六块魂骨！】</span>`;
        }else if(target >= 100000){
          let boneTypes = ['头部魂骨','躯干魂骨','左臂骨','右臂骨','左腿骨','右腿骨'];
          let available = boneTypes.filter(b => !G.soulBones.includes(b));
          if(available.length > 0){
            let bt = available[Math.floor(Math.random()*available.length)];
            G.soulBones.push(bt);
            boneHtml = `<br><span style="color:var(--gold)">【十万年魂兽保底掉落：${bt}！】</span>`;
          }
        }else if(Math.random() < 0.15){
          let boneTypes = ['头部魂骨','躯干魂骨','左臂骨','右臂骨','左腿骨','右腿骨'];
          let available = boneTypes.filter(b => !G.soulBones.includes(b));
          if(available.length > 0){
            let bt = available[Math.floor(Math.random()*available.length)];
            G.soulBones.push(bt);
            boneHtml = `<br><span style="color:var(--gold)">【额外掉落：${bt}！】</span>`;
          }
        }

        let skillCountText = skills.length > 1 ? `（${skills.length}个魂技）` : '';
        let overLimitHtml = '';
        if(target > limit){
          overLimitHtml = `<p style="color:var(--gold);font-size:12px;">(${G.martialSoul?.quality || '普通'}武魂，承受极限${limit}年，你凭借强悍身体素质强行吸收！)</p>`;
        }
        let skillsHtml = skills.map(s => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${s.name}</span><br><span style="font-size:12px;color:var(--gray)">${s.desc}</span></div>`).join('');
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">猎杀成功！</h3><p>成功击杀 <strong>${target}年</strong> 魂兽</p><p>获得 <span style="color:${color.bg}">${color.cn}魂环</span>（第${ringNum+1}环）${skillCountText}</p>${overLimitHtml}<p>魂力+2级${boneHtml}</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
        document.getElementById('mini-wheel-spin-btn').style.display = 'none';
        document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
      }catch(e){
        GameState.miniWheel.spinning = false;
        btn.classList.remove('btn-disabled');
        document.getElementById('mini-wheel-result-area').innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘处理异常，请关闭后重试。</p></div>';
      }
    }, 2500);
  }catch(e){
    GameState.miniWheel.spinning = false;
    btn.classList.remove('btn-disabled');
    document.getElementById('mini-wheel-result-area').innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘初始化异常，请重试。</p></div>';
  }
}

function buildYearEventWheel(){
  let items = [];
  let eventTypes = YEAR_EVENT_WHEEL;
  eventTypes.forEach(e => {
    if(e.id === 'school' && G.identityType === 'soul_beast') return;
    if(e.id === 'justice' && (G.soulPower < 30 || G.soulPower >= 70 || G.Age < 20)) return;
    if(e.id === 'auction' && ((G.gold || 0) + (G.familyWealth || 0) < 50)) return;
    if(e.id === 'godrealm' && G.timeline?.id !== 'godrealm') return;
    if(e.id === 'partner' && G.identityType === 'soul_beast') return;
    if(e.id === 'timeline' && !TIMELINE_CHARACTERS[G.timeline?.id]) return;
    items.push(e);
  });
  return items;
}

function openYearEventWheel(callback){
  GameState.yearEventWheel = {data: buildYearEventWheel(), callback};
  document.getElementById('mini-wheel-label').textContent = `${G.Age}岁 · 年度事件`;
  document.getElementById('mini-wheel-hint').textContent = '命运的齿轮开始转动...';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinYearEventWheel;
  drawMiniWheel(GameState.yearEventWheel.data);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinYearEventWheel(){
  if(GameState.yearEventWheel.spinning) return;
  GameState.yearEventWheel.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = GameState.yearEventWheel.data.reduce((s,i) => s + i.weight, 0);
  let selected = weightedRandom(GameState.yearEventWheel.data);
  let selectedIdx = GameState.yearEventWheel.data.indexOf(selected);
  let cumWeight = 0;
  for(let i = 0; i < selectedIdx; i++) cumWeight += GameState.yearEventWheel.data[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    GameState.yearEventWheel.spinning = false;
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
        GameState.yearEventWheel.spinning=false;
        GameState.yearEventWheel.data = buildYearEventWheel().filter(s => s.id !== 'reroll');
        let canvasEl = document.getElementById('mini-wheel-canvas');
        canvasEl.style.transition='none';
        canvasEl.style.transform='rotate(0deg)';
        void canvasEl.offsetWidth;
        drawMiniWheel(GameState.yearEventWheel.data);
        return;
      }
    }
    GameState.yearEventWheel.result = result;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 2500);
}

function buildTimelineCharacterWheel(){
  let timelineId = G.timeline?.id || 'douluo1';
  let chars = TIMELINE_CHARACTERS[timelineId] || TIMELINE_CHARACTERS.douluo1;
  let items = chars.map(c => ({
    name: c.name,
    char: c,
    weight: c.weight || 1,
    color: c.color || '#aa66ff'
  }));
  return items;
}

function openTimelineCharacterWheel(callback){
  GameState.timelineCharWheel = {data: buildTimelineCharacterWheel(), callback};
  document.getElementById('mini-wheel-label').textContent = '原著角色相遇';
  document.getElementById('mini-wheel-hint').textContent = '命运让你与某位原著角色相遇...';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinTimelineCharacterWheel;
  drawMiniWheel(GameState.timelineCharWheel.data);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinTimelineCharacterWheel(){
  if(GameState.timelineCharWheel.spinning) return;
  GameState.timelineCharWheel.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = GameState.timelineCharWheel.data.reduce((s,i) => s + i.weight, 0);
  let selected = weightedRandom(GameState.timelineCharWheel.data);
  let selectedIdx = GameState.timelineCharWheel.data.indexOf(selected);
  let cumWeight = 0;
  for(let i = 0; i < selectedIdx; i++) cumWeight += GameState.timelineCharWheel.data[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    GameState.timelineCharWheel.spinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let char = selected.char;
    
    if(char.sp) G.soulPower = Math.min(G.soulPower + char.sp, G.maxLevel);
    if(char.merit) G.merit = (G.merit||0) + char.merit;
    if(char.gold) G.gold = (G.gold||0) + char.gold;
    if(char.skill) G.customSkills = (G.customSkills||[]).concat(char.skill);
    if(char.bone && !G.soulBones.includes(char.bone)) G.soulBones.push(char.bone);
    
    let effectParts = [];
    if(char.sp) effectParts.push(`魂力+${char.sp}级`);
    if(char.merit) effectParts.push(`名声+${char.merit}`);
    if(char.gold) effectParts.push(`获得${char.gold}金魂币`);
    if(char.skill) effectParts.push(`获得技能：${char.skill.name}`);
    if(char.bone) effectParts.push(`获得魂骨：${char.bone}`);
    
    area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">${char.name}</h3><p>${char.desc}</p><p style="color:var(--gold);margin-top:8px;">${effectParts.join(' · ') || '无特殊效果'}</p></div>`;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 2500);
}

function closeMiniWheel(){
  document.getElementById('mini-wheel-overlay').classList.remove('active');
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  document.getElementById('mini-wheel-hint').textContent = '';
  document.getElementById('mini-auto-stop-btn').style.display = 'none';
  if(GameState.miniWheel?.callback){
    GameState.miniWheel.callback();
    GameState.miniWheel = null;
  }
}

const RING_OPPORTUNITY = [
  {name:'神赐魂环',color:'#ffdd44',weight:15},
  {name:'魂骨',color:'#aa66ff',weight:20},
  {name:'魂灵',color:'#44ddff',weight:20},
  {name:'仙品药草',color:'#44ff88',weight:25},
  {name:'特殊技能',color:'#ff4488',weight:20}
];

const CUSTOM_SKILL_PREFIX = {
  attack: ['斩', '破', '裂', '灭', '弑', '碎'],
  defense: ['盾', '御', '护', '壁', '甲', '障'],
  control: ['封', '禁', '缚', '定', '锁', '困'],
  boost: ['增', '强', '霸', '威', '怒', '狂'],
  healing: ['愈', '复', '生', '回', '活', '救'],
  special: ['神', '魔', '妖', '鬼', '圣', '仙']
};

function generateCustomSkillName(){
  let types = ['attack','defense','control','boost','healing','special'];
  let type = types[Math.floor(Math.random()*types.length)];
  let prefix = CUSTOM_SKILL_PREFIX[type][Math.floor(Math.random()*CUSTOM_SKILL_PREFIX[type].length)];
  let suffixes = ['天击','地裂','龙啸','凤舞','神雷','鬼火','冰封','烈焰','星辰','月影'];
  let suffix = suffixes[Math.floor(Math.random()*suffixes.length)];
  return {name:prefix+suffix, type};
}

function openOpportunityWheel(callback){
  GameState.opportunityWheel = {data: RING_OPPORTUNITY, callback};
  document.getElementById('mini-wheel-label').textContent = '魂环突破机遇';
  document.getElementById('mini-wheel-hint').textContent = '命运赐予你一次特殊机遇...';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinOpportunityWheel;
  drawMiniWheel(RING_OPPORTUNITY);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinOpportunityWheel(){
  if(GameState.opportunityWheel.spinning) return;
  GameState.opportunityWheel.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = GameState.opportunityWheel.data.reduce((s,i) => s + i.weight, 0);
  let selected = weightedRandom(GameState.opportunityWheel.data);
  let selectedIdx = GameState.opportunityWheel.data.indexOf(selected);
  let cumWeight = 0;
  for(let i = 0; i < selectedIdx; i++) cumWeight += GameState.opportunityWheel.data[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    GameState.opportunityWheel.spinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let result = {type: selected.name, data: null};
    
    switch(selected.name){
      case '神赐魂环':{
        let ringNum = G.soulRings.length + 1;
        if(ringNum <= 9){
          let divineColor = SOUL_RING_COLORS[Math.min(ringNum-1, SOUL_RING_COLORS.length-1)];
          let skills = generateRingSkills(ringNum, G.soulPower * 5000, G.martialSoul);
          G.soulRings.push({
            years: 0, color: divineColor.cn, css: divineColor.css, bg: divineColor.bg,
            skills: skills, isDivine: true
          });
          result.data = {ringNum, color: divineColor, skills};
        }
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">神赐魂环</h3><p>神界之力为你凝聚了一枚神赐魂环！</p></div>`;
        break;
      }
      case '魂骨':{
        let boneTypes = ['头部魂骨','躯干魂骨','左臂骨','右臂骨','左腿骨','右腿骨'];
        let available = boneTypes.filter(b => !G.soulBones.includes(b));
        if(available.length > 0){
          let bt = available[Math.floor(Math.random()*available.length)];
          G.soulBones.push(bt);
          result.data = {bone: bt};
        }
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">魂骨</h3><p>你获得了一块珍贵的${result.data?.bone || '魂骨'}！</p></div>`;
        break;
      }
      case '魂灵':{
        let names = SPIRIT_SOUL_NAMES.rare || ['未知魂灵'];
        let soulName = names[Math.floor(Math.random()*names.length)];
        let years = Math.floor(Math.random()*5000)+1000;
        let color = SOUL_RING_COLORS.find(c => years <= c.max) || SOUL_RING_COLORS[1];
        let skills = generateRingSkills(G.soulRings.length + 1, years, G.martialSoul);
        G.soulRings.push({
          years: years, color: color.cn, css: color.css, bg: color.bg,
          skills: skills, spiritSoul: {name: soulName, tier: 'rare'}
        });
        result.data = {soulName, years, color};
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">魂灵</h3><p>你契约了一只${soulName}（${years}年）！</p></div>`;
        break;
      }
      case '仙品药草':{
        let herbs = ['八角玄冰草','烈火杏娇疏','奇茸通天菊','望穿秋水露','水晶血龙参','相思断肠红'];
        let herb = herbs[Math.floor(Math.random()*herbs.length)];
        let spBonus = Math.floor(Math.random()*3)+2;
        G.soulPower = Math.min(G.soulPower + spBonus, G.maxLevel);
        result.data = {herb, spBonus};
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">仙品药草</h3><p>你服用了${herb}，魂力大幅提升！（+${spBonus}级）</p></div>`;
        break;
      }
      case '特殊技能':{
        let skill = generateCustomSkillName();
        G.customSkills = (G.customSkills||[]).concat({name: skill.name, type: skill.type, desc:'特殊技能'});
        result.data = {skill};
        area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">特殊技能</h3><p>你领悟了新技能：${skill.name}！</p></div>`;
        break;
      }
    }
    
    GameState.opportunityWheel.result = result;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 2500);
}

function buildLoverWheel(){
  let candidates = getRomanceCandidates();
  let items = candidates.map(c => ({
    name: c.name,
    char: c,
    weight: c.weight || 1,
    color: c.color || '#ff66aa'
  }));
  return items;
}

function openLoverWheel(callback){
  GameState.loverWheel = {data: buildLoverWheel(), callback};
  document.getElementById('mini-wheel-label').textContent = '缘分天注定';
  document.getElementById('mini-wheel-hint').textContent = '寻找你的另一半...';
  document.getElementById('mini-wheel-result-area').innerHTML = '';
  let spinBtn = document.getElementById('mini-wheel-spin-btn');
  spinBtn.style.display = '';
  spinBtn.classList.remove('btn-disabled');
  spinBtn.onclick = spinLoverWheel;
  drawMiniWheel(GameState.loverWheel.data);
  let canvas = document.getElementById('mini-wheel-canvas');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  void canvas.offsetWidth;
  document.getElementById('mini-wheel-overlay').classList.add('active');
}

function spinLoverWheel(){
  if(GameState.loverWheel.spinning) return;
  GameState.loverWheel.spinning = true;
  let btn = document.getElementById('mini-wheel-spin-btn');
  btn.classList.add('btn-disabled');
  let canvas = document.getElementById('mini-wheel-canvas');
  let total = GameState.loverWheel.data.reduce((s,i) => s + i.weight, 0);
  let selected = weightedRandom(GameState.loverWheel.data);
  let selectedIdx = GameState.loverWheel.data.indexOf(selected);
  let cumWeight = 0;
  for(let i = 0; i < selectedIdx; i++) cumWeight += GameState.loverWheel.data[i].weight;
  let sectorAngle = (selected.weight / total) * 360;
  let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
  let finalAngle = 360 * 6 + (360 - targetCenter + 270);
  canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
  canvas.style.transform = `rotate(${finalAngle}deg)`;
  managedTimeout(() => {
    GameState.loverWheel.spinning = false;
    btn.classList.remove('btn-disabled');
    let area = document.getElementById('mini-wheel-result-area');
    let char = selected.char;
    
    G.partner = char;
    G.relationship = 'lover';
    if(char.spBonus) G.soulPower = Math.min(G.soulPower + char.spBonus, G.maxLevel);
    if(char.skill) G.customSkills = (G.customSkills||[]).concat(char.skill);
    
    let effectParts = [];
    if(char.spBonus) effectParts.push(`魂力+${char.spBonus}级`);
    if(char.skill) effectParts.push(`获得技能：${char.skill.name}`);
    
    area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:${selected.color}">💕 ${char.name}</h3><p>${char.desc}</p><p style="color:var(--gold);margin-top:8px;">${effectParts.join(' · ') || '心意相通'}</p></div>`;
    document.getElementById('mini-wheel-spin-btn').style.display = 'none';
    document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
  }, 2500);
}

function drawWheel(items,labelKey,colorKey){
  const canvas=document.getElementById('wheel-canvas');
  canvas.style.transition='none';
  canvas.style.transform='rotate(0deg)';
  void canvas.offsetWidth;
  let targetSize=window.innerWidth<=480?360:(window.innerWidth<=768?480:720);
  if(canvas.width!==targetSize){canvas.width=targetSize;canvas.height=targetSize;}
  const ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height;
  const cx=w/2,cy=h/2;
  const r=Math.min(w,h)*0.47;
  const fontSize=Math.max(14,Math.min(w,h)*0.03);
  ctx.clearRect(0,0,w,h);
  let total=items.reduce((s,i)=>s+i.weight,0);
  let startAngle=0;
  items.forEach((item,i)=>{
    let sliceAngle=(item.weight/total)*Math.PI*2;
    let endAngle=startAngle+sliceAngle;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,startAngle,endAngle);
    ctx.closePath();
    let color=item[colorKey]||`hsl(${(i/items.length)*360},60%,30%)`;
    ctx.fillStyle=color;
    ctx.fill();
    ctx.strokeStyle='rgba(255,215,0,0.3)';
    ctx.lineWidth=1;
    ctx.stroke();
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(startAngle+sliceAngle/2);
    ctx.textAlign='right';
    ctx.fillStyle='#fff';
    ctx.font=`bold ${fontSize}px Microsoft YaHei`;
    ctx.shadowColor='rgba(0,0,0,0.8)';
    ctx.shadowBlur=4;
    let label=item[labelKey];
    if(label.length>8)label=label.substring(0,8)+'…';
    ctx.fillText(label,r-r*0.06,fontSize*0.3);
    ctx.restore();
    startAngle=endAngle;
  });
  ctx.beginPath();
  ctx.arc(cx,cy,r+5,0,Math.PI*2);
  ctx.strokeStyle='rgba(255,215,0,0.5)';
  ctx.lineWidth=4;
  ctx.stroke();
  for(let i=0;i<items.length;i++){
    let angle=(i/items.length)*Math.PI*2;
    ctx.beginPath();
    ctx.arc(cx,cy,r+5,angle,angle+0.02);
    ctx.strokeStyle='rgba(255,215,0,0.8)';
    ctx.lineWidth=6;
    ctx.stroke();
  }
}

function spinWheel(){
  if(wheelState.spinning) return;
  wheelState.spinning = true;
  const btn = document.getElementById('wheel-spin-btn');
  btn.classList.add('btn-disabled');
  const canvas = document.getElementById('wheel-canvas');
  try{
    const items = currentWheelData;
    const total = items.reduce((s,i) => s + i.weight, 0);
    const selected = weightedRandom(items);
    const selectedIdx = items.indexOf(selected);
    let cumWeight = 0;
    for(let i = 0; i < selectedIdx; i++) cumWeight += items[i].weight;
    const sectorAngle = (selected.weight / total) * 360;
    const targetCenter = cumWeight / total * 360 + sectorAngle / 2;
    const spinCount = window.innerWidth <= 480 ? 4 : 6;
    const duration = window.innerWidth <= 480 ? '3.5s' : '5s';
    const finalAngle = 360 * spinCount + (360 - targetCenter + 270);
    canvas.style.transition = `transform ${duration} cubic-bezier(0.17,0.67,0.12,0.99)`;
    canvas.style.transform = `rotate(${finalAngle}deg)`;
    managedTimeout(() => {
      try{
        wheelState.spinning = false;
        btn.classList.remove('btn-disabled');
        onWheelResult(selected);
      }catch(e){
        wheelState.spinning = false;
        btn.classList.remove('btn-disabled');
        document.getElementById('wheel-result-area').innerHTML = '<div class="wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘处理异常，请重试。</p></div>';
      }
    }, window.innerWidth <= 480 ? 3500 : 5000);
  }catch(e){
    wheelState.spinning = false;
    btn.classList.remove('btn-disabled');
    document.getElementById('wheel-result-area').innerHTML = '<div class="wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘初始化异常，请重试。</p></div>';
  }
}