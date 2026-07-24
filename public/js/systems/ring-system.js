(function (global) {
  const wheelRuntime = global.WheelRuntime || (global.WheelRuntime = {
    miniWheelData: null,
    miniWheelSpinning: false,
    miniWheelCallback: null,
    spiritSoulWheelData: null,
    spiritSoulWheelSpinning: false,
    spiritSoulWheelCallback: null,
    oppWheelSpinning: false,
    oppWheelCallback: null
  });

  function buildSoulRingWheel() {
    let ringNum = G.soulRings.length;
    if (ringNum >= 9) return null;
    let limit = getRingLimit(ringNum);
    let safeMax = Math.floor(limit * 0.7);
    let items = [];
    items.push({
      name: `安全猎杀\n(${Math.floor(safeMax * 0.3)}~${safeMax}年)`,
      years: Math.floor(Math.random() * safeMax * 0.7 + safeMax * 0.3),
      weight: 40, color: '#226622', risk: 'safe'
    });
    items.push({
      name: `稳健猎杀\n(${safeMax}~${limit}年)`,
      years: safeMax + Math.floor(Math.random() * (limit - safeMax)),
      weight: 30, color: '#224466', risk: 'medium'
    });
    items.push({
      name: `极限猎杀\n(${limit}~${Math.floor(limit * 1.5)}年)`,
      years: limit + Math.floor(Math.random() * limit * 0.5),
      weight: 20, color: '#664422', risk: 'risky'
    });
    items.push({
      name: '命运赌博\n(未知年限)',
      years: Math.floor(Math.random() * limit * 3 + 100),
      weight: 10, color: '#662222', risk: 'gamble'
    });
    return items;
  }

  const SPIRIT_SOUL_NAMES = [
    '冰碧蝎', '光明圣龙', '暗金恐爪熊', '三眼金猊', '翡翠天鹅', '妖眼魔树', '泰坦巨猿', '天青牛蟒',
    '地狱魔龙', '山龙王', '海龙王', '雷鸣阎魔藤', '火凤凰', '冰凤凰', '邪眸白虎', '六翼天使',
    '蓝电霸王龙', '深海魔鲸', '金龙王', '银龙王', '时空双龙', '混沌青牛', '鸿蒙凤凰',
    '金语', '绮罗郁金香', '霸王龙', '雷鸣阎狱藤', '邪魔虎鲸王', '碧姬', '赤王',
    '冰天雪女', '天梦冰蚕', '八角玄冰草', '烈火杏娇疏', '幽香绮罗仙品'
  ];
  const SPIRIT_SOUL_HIGH_NAMES = [
    '冰碧帝皇蝎', '雪帝', '冰帝', '帝天', '邪帝', '碧姬', '赤王', '泰坦巨猿', '天青牛蟒',
    '深海魔鲸', '金龙王', '银龙王', '邪魔虎鲸王', '火凤凰', '冰凤凰'
  ];
  const SPIRIT_SOUL_PREFIXES = ['十年（白）', '百年（黄）', '千年（紫）', '万年（黑）', '十万年（红）', '凶兽（橙）', '不屈', '伴生', '传承', '本命'];

  function buildSpiritSoulWheel() {
    let ringNum = G.soulRings.length;
    if (ringNum >= 9) return null;
    let limit = getRingLimit(ringNum);
    let items = [];
    let getName = years => {
      if (years >= 100000) {
        return SPIRIT_SOUL_HIGH_NAMES[Math.floor(Math.random() * SPIRIT_SOUL_HIGH_NAMES.length)];
      }
      return SPIRIT_SOUL_NAMES[Math.floor(Math.random() * SPIRIT_SOUL_NAMES.length)];
    };
    let lowYears = Math.floor(Math.random() * 500 + 100);
    items.push({
      name: `低级魂灵\n(${lowYears}年)`, years: lowYears, weight: 25, color: '#448844',
      soulName: SPIRIT_SOUL_PREFIXES[0] + getName(lowYears),
      tier: 'low', cost: 10
    });
    let midYears = Math.floor(Math.random() * (Math.min(5000, limit) - 1000) + 1000);
    items.push({
      name: `中级魂灵\n(${midYears}年)`, years: midYears, weight: 30, color: '#4466aa',
      soulName: SPIRIT_SOUL_PREFIXES[1] + getName(midYears),
      tier: 'mid', cost: 50
    });
    let highYears = Math.floor(Math.random() * (Math.min(50000, limit * 1.5) - 10000) + 10000);
    items.push({
      name: `高级魂灵\n(${highYears}年)`, years: highYears, weight: 25, color: '#aa44aa',
      soulName: SPIRIT_SOUL_PREFIXES[2] + getName(highYears),
      tier: 'high', cost: 200
    });
    let topYears = Math.floor(Math.random() * (limit * 2) + 50000);
    items.push({
      name: `顶级魂灵\n(${topYears}年)`, years: topYears, weight: 15, color: '#ffaa22',
      soulName: SPIRIT_SOUL_PREFIXES[3] + getName(topYears),
      tier: 'top', cost: 1000
    });
    if (Math.random() < 0.1) {
      let beastYears = Math.floor(Math.random() * 500000 + 100000);
      items.push({
        name: `凶兽魂灵\n(${beastYears}年)`, years: beastYears, weight: 5, color: '#ff2222',
        soulName: SPIRIT_SOUL_PREFIXES[5] + getName(beastYears),
        tier: 'beastgod', cost: 5000
      });
    }
    return items;
  }

  function openSpiritSoulWheel(callback) {
    wheelRuntime.spiritSoulWheelData = buildSpiritSoulWheel();
    if (!wheelRuntime.spiritSoulWheelData) { callback(false); return; }
    wheelRuntime.spiritSoulWheelCallback = callback;
    let ringNum = G.soulRings.length + 1;
    let eraName = G.timeline.id === 'douluo4' ? '传灵塔/联邦' : '传灵塔';
    document.getElementById('mini-wheel-label').textContent = `第${ringNum}魂环 · ${eraName}魂灵契约`;
    document.getElementById('mini-wheel-hint').textContent = '魂兽濒临灭绝，通过传灵塔契约魂灵获取魂环';
    document.getElementById('mini-wheel-result-area').innerHTML = '';
    let spinBtn = document.getElementById('mini-wheel-spin-btn');
    spinBtn.style.display = '';
    spinBtn.classList.remove('btn-disabled');
    spinBtn.onclick = spinSpiritSoulWheel;
    drawMiniWheel(wheelRuntime.spiritSoulWheelData);
    let canvas = document.getElementById('mini-wheel-canvas');
    canvas.style.transition = 'none';
    canvas.style.transform = 'rotate(0deg)';
    void canvas.offsetWidth;
    document.getElementById('mini-wheel-overlay').classList.add('active');
  }

  function spinSpiritSoulWheel() {
    if (wheelRuntime.spiritSoulWheelSpinning) return;
    wheelRuntime.spiritSoulWheelSpinning = true;
    let btn = document.getElementById('mini-wheel-spin-btn');
    btn.classList.add('btn-disabled');
    let canvas = document.getElementById('mini-wheel-canvas');
    let total = wheelRuntime.spiritSoulWheelData.reduce((sum, item) => sum + item.weight, 0);
    let selected = weightedRandom(wheelRuntime.spiritSoulWheelData);
    let selectedIdx = wheelRuntime.spiritSoulWheelData.indexOf(selected);
    let cumWeight = 0;
    for (let idx = 0; idx < selectedIdx; idx++) cumWeight += wheelRuntime.spiritSoulWheelData[idx].weight;
    let sectorAngle = (selected.weight / total) * 360;
    let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
    let finalAngle = 360 * 6 + (360 - targetCenter + 270);
    canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
    canvas.style.transform = `rotate(${finalAngle}deg)`;
    setTimeout(() => {
      wheelRuntime.spiritSoulWheelSpinning = false;
      btn.classList.remove('btn-disabled');
      let area = document.getElementById('mini-wheel-result-area');
      let ringNum = G.soulRings.length + 1;
      let target = selected.years;
      let color = SOUL_RING_COLORS.find(entry => target <= entry.max) || SOUL_RING_COLORS[SOUL_RING_COLORS.length - 1];
      let skills = generateRingSkills(ringNum, target, G.martialSoul);
      G.soulRings.push({ years: target, color: color.cn, css: color.css, bg: color.bg, skills: skills, soulName: selected.soulName, tier: selected.tier, spiritSoul: true });
      G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);
      let boneHtml = '';
      if (selected.tier === 'beastgod') {
        let allBones = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
        allBones.forEach(bone => { if (!G.soulBones.includes(bone)) G.soulBones.push(bone); });
        boneHtml = '<br><span style="color:var(--gold)">【凶兽魂灵附赠：全套六块魂骨！】</span>';
      } else if (selected.tier === 'top' && Math.random() < 0.5) {
        let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
        let available = boneTypes.filter(bone => !G.soulBones.includes(bone));
        if (available.length > 0) {
          let boneType = available[Math.floor(Math.random() * available.length)];
          G.soulBones.push(boneType);
          boneHtml = `<br><span style="color:var(--gold)">【顶级魂灵附赠：${boneType}！】</span>`;
        }
      }
      let skillsHtml = skills.map(skill => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${skill.name}</span><br><span style="font-size:12px;color:var(--gray)">${skill.desc}</span></div>`).join('');
      let tierText = { low: '低级', mid: '中级', high: '高级', top: '顶级', beastgod: '凶兽级' }[selected.tier];
      area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">魂灵契约成功！</h3><p>在传灵塔与 <strong style="color:${selected.color}">${selected.soulName}</strong> 签订契约</p><p>获得 <span style="color:${color.bg}">${color.cn}魂环</span>（第${ringNum + 1}环 · ${tierText}魂灵 · ${target}年）</p><p>魂力+2级${boneHtml}</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
      G._ringSuccess = true;
      document.getElementById('mini-wheel-spin-btn').style.display = 'none';
      document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
    }, 4800);
  }

  function openSoulRingWheel(callback) {
    if (G.timeline?.soulRingMode === 'divine' || G.identityType === 'god') {
      let ringNum = G.soulRings.length + 1;
      if (ringNum > 9) { callback(null); return; }
      let divineColor = SOUL_RING_COLORS.find(entry => G.soulPower <= entry.max * ringNum / 9) || SOUL_RING_COLORS[SOUL_RING_COLORS.length - 1];
      if (G.soulPower >= 120) divineColor = SOUL_RING_COLORS.find(entry => entry.color === 'gold') || SOUL_RING_COLORS[5];
      else if (G.soulPower >= 96) divineColor = SOUL_RING_COLORS.find(entry => entry.color === 'red') || SOUL_RING_COLORS[4];
      else if (G.soulPower >= 76) divineColor = SOUL_RING_COLORS.find(entry => entry.color === 'black') || SOUL_RING_COLORS[3];
      else if (G.soulPower >= 56) divineColor = SOUL_RING_COLORS.find(entry => entry.color === 'purple') || SOUL_RING_COLORS[2];
      else divineColor = SOUL_RING_COLORS.find(entry => entry.color === 'yellow') || SOUL_RING_COLORS[1];

      let skills = generateRingSkills(ringNum, G.soulPower * 1000, G.martialSoul);
      G.soulRings.push({ years: 0, color: divineColor.cn, css: divineColor.css, bg: divineColor.bg, divine: true, skills: skills });
      G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);
      let skillsHtml = skills.map(skill => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${skill.name}</span><br><span style="font-size:12px;color:var(--gray)">${skill.desc}</span></div>`).join('');
      let overlay = document.getElementById('mini-wheel-overlay');
      document.getElementById('mini-wheel-label').textContent = `第${ringNum + 1}魂环 · 神赐魂环`;
      document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
      document.getElementById('mini-wheel-result-area').innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">神赐魂环降临！</h3><p>神界之力为你凝聚第${ringNum + 1}魂环</p><p>获得 <span style="color:${divineColor.bg}">${divineColor.cn}神赐魂环</span></p><p style="margin-top:8px;color:var(--cyan)">魂环随等级提升而自动成长</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
      document.getElementById('mini-wheel-spin-btn').style.display = 'none';
      drawMiniWheel([{ name: '神赐', weight: 1, color: '#ffdd44' }, { name: '魂环', weight: 1, color: '#aa66ff' }, { name: '降临', weight: 1, color: '#44ddff' }]);
      let canvas = document.getElementById('mini-wheel-canvas');
      canvas.style.transition = 'none';
      canvas.style.transform = 'rotate(0deg)';
      void canvas.offsetWidth;
      overlay.classList.add('active');
      wheelRuntime.miniWheelCallback = function () { callback(true); };
      return;
    }

    if (G.timeline?.soulRingMode === 'spirit') {
      openSpiritSoulWheel(callback);
      return;
    }

    wheelRuntime.miniWheelSpinning = false;
    wheelRuntime.miniWheelData = buildSoulRingWheel();
    if (!wheelRuntime.miniWheelData) { callback(false); return; }
    wheelRuntime.miniWheelCallback = function () { callback(G._ringSuccess || false); };
    let ringNum = G.soulRings.length + 1;
    let limit = getRingLimit(G.soulRings.length);
    let qualityBonus = G.martialSoul?.quality || '普通';
    document.getElementById('mini-wheel-label').textContent = `第${ringNum}魂环 · 承受极限${limit}年(${qualityBonus}武魂)`;
    document.getElementById('mini-wheel-hint').textContent = '选择猎杀策略，转盘决定你的猎杀目标';
    document.getElementById('mini-wheel-result-area').innerHTML = '';
    let spinBtn = document.getElementById('mini-wheel-spin-btn');
    spinBtn.style.display = '';
    spinBtn.classList.remove('btn-disabled');
    spinBtn.onclick = spinMiniWheel;
    drawMiniWheel(wheelRuntime.miniWheelData);
    let canvas = document.getElementById('mini-wheel-canvas');
    canvas.style.transition = 'none';
    canvas.style.transform = 'rotate(0deg)';
    void canvas.offsetWidth;
    document.getElementById('mini-wheel-overlay').classList.add('active');
  }

  function spinMiniWheel() {
    if (wheelRuntime.miniWheelSpinning) return;
    wheelRuntime.miniWheelSpinning = true;
    let btn = document.getElementById('mini-wheel-spin-btn');
    btn.classList.add('btn-disabled');
    let canvas = document.getElementById('mini-wheel-canvas');
    try {
      let total = wheelRuntime.miniWheelData.reduce((sum, item) => sum + item.weight, 0);
      let selected = weightedRandom(wheelRuntime.miniWheelData);
      let selectedIdx = wheelRuntime.miniWheelData.indexOf(selected);
      if (selectedIdx < 0) selectedIdx = 0;
      let cumWeight = 0;
      for (let idx = 0; idx < selectedIdx; idx++) cumWeight += wheelRuntime.miniWheelData[idx].weight;
      let sectorAngle = (selected.weight / total) * 360;
      let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
      let finalAngle = 360 * 6 + (360 - targetCenter + 270);
      canvas.style.transition = 'transform 2.25s cubic-bezier(0.17,0.67,0.12,0.99)';
      canvas.style.transform = `rotate(${finalAngle}deg)`;
      setTimeout(() => {
        try {
          wheelRuntime.miniWheelSpinning = false;
          btn.classList.remove('btn-disabled');
          let ringNum = G.soulRings.length + 1;
          let limit = getRingLimit(ringNum - 1);
          let area = document.getElementById('mini-wheel-result-area');
          let target = selected.years;
          let color = SOUL_RING_COLORS.find(entry => target <= entry.max) || SOUL_RING_COLORS[SOUL_RING_COLORS.length - 1];
          let skills = generateRingSkills(ringNum, target, G.martialSoul);
          G.soulRings.push({ years: target, color: color.cn, css: color.css, bg: color.bg, skills: skills });
          G.soulPower = Math.min(G.soulPower + 2, G.maxLevel);

          let boneHtml = '';
          if (target >= 1000000) {
            let allBones = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
            allBones.forEach(bone => { if (!G.soulBones.includes(bone)) G.soulBones.push(bone); });
            boneHtml = '<br><span style="color:var(--gold)">【百万年魂兽：获得全套六块魂骨！】</span>';
          } else if (target >= 100000) {
            let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
            let available = boneTypes.filter(bone => !G.soulBones.includes(bone));
            if (available.length > 0) {
              let boneType = available[Math.floor(Math.random() * available.length)];
              G.soulBones.push(boneType);
              boneHtml = `<br><span style="color:var(--gold)">【十万年魂兽保底掉落：${boneType}！】</span>`;
            }
          } else {
            let boneChance = target >= 10000 ? 0.2 : target >= 1000 ? 0.05 : 0.01;
            if (Math.random() < boneChance) {
              let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
              let boneType = boneTypes[Math.floor(Math.random() * boneTypes.length)];
              if (!G.soulBones.includes(boneType)) G.soulBones.push(boneType);
              boneHtml = `<br><span style="color:var(--gold)">【额外掉落：${boneType}！】</span>`;
            }
          }

          let skillCountText = skills.length > 1 ? `（${skills.length}个魂技）` : '';
          let skillsHtml = skills.map(skill => `<div style="text-align:left;padding:4px 0;border-bottom:1px solid var(--dark)"><span style="color:var(--gold)">${skill.name}</span><br><span style="font-size:12px;color:var(--gray)">${skill.desc}</span></div>`).join('');
          let overLimitHtml = '';
          if (target > limit) {
            overLimitHtml = `<p style="color:var(--gold);font-size:12px;">(${G.martialSoul?.quality || '普通'}武魂，承受极限${limit}年，你凭借强悍身体素质强行吸收！)</p>`;
          }

          G._ringSuccess = true;
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">猎杀成功！</h3><p>成功击杀 <strong>${target}年</strong> 魂兽</p><p>获得 <span style="color:${color.bg}">${color.cn}魂环</span>（第${ringNum + 1}环）${skillCountText}</p>${overLimitHtml}<p>魂力+2级${boneHtml}</p><div style="margin-top:10px;text-align:left">${skillsHtml}</div></div>`;
          document.getElementById('mini-wheel-spin-btn').style.display = 'none';
          document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
        } catch (err) {
          console.error('魂环转盘结果处理出错:', err);
          wheelRuntime.miniWheelSpinning = false;
          document.getElementById('mini-wheel-result-area').innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--red)">出错</h3><p>转盘处理异常，请关闭后重试。</p></div>';
          document.getElementById('mini-wheel-spin-btn').style.display = 'none';
          document.getElementById('mini-wheel-hint').textContent = '点击任意处关闭';
        }
      }, 4800);
    } catch (err) {
      console.error('魂环转盘旋转出错:', err);
      wheelRuntime.miniWheelSpinning = false;
      btn.classList.remove('btn-disabled');
      alert('转盘异常，请重试。');
    }
  }

  const RING_OPPORTUNITY = [
    { id: 'sp', name: '魂力激增', weight: 30, color: '#22aa44', desc: '吸收魂环后，体内魂力暴涨！' },
    { id: 'bone', name: '意外魂骨', weight: 15, color: '#ffdd44', desc: '魂兽体内残存魂骨，意外获得！' },
    { id: 'custom_skill', name: '自创魂技', weight: 25, color: '#aa66ff', desc: '吸收过程中灵光一现，领悟了自创魂技！' },
    { id: 'nothing', name: '平稳吸收', weight: 30, color: '#888888', desc: '一切顺利，没有额外收获。' }
  ];

  const CUSTOM_SKILL_PREFIX = {
    attack: ['裂空', '碎星', '灭世', '破天', '斩魂', '灭神', '噬魂', '碎虚', '裂地', '斩月', '天罚', '雷劫', '冰封', '焚天', '毒噬', '金刃', '龙吟', '凤鸣', '暗噬', '圣裁'],
    defense: ['铁壁', '金刚', '不动', '圣光', '玄武', '龙鳞', '冰盾', '土墙', '暗幕', '光幕'],
    control: ['锁魂', '禁锢', '幻境', '魅惑', '冰封', '缠绕', '精神', '空间', '时间', '因果'],
    boost: ['战神', '龙魂', '凤翼', '天使', '魔神', '圣灵', '狂战', '天神', '战意', '觉醒']
  };

  function generateCustomSkillName() {
    let types = Object.keys(CUSTOM_SKILL_PREFIX);
    let type = types[Math.floor(Math.random() * types.length)];
    let prefixes = CUSTOM_SKILL_PREFIX[type];
    let prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let suffixes = {
      attack: ['一击', '斩', '刃', '枪', '炮', '击', '裂', '灭', '杀', '破'],
      defense: ['之壁', '之盾', '护体', '屏障', '领域', '结界', '守护', '不动'],
      control: ['之术', '领域', '幻境', '束缚', '封锁', '压制', '催眠', '迷宫'],
      boost: ['之力', '附体', '觉醒', '增幅', '爆发', '化身', '共鸣', '灌注']
    };
    let suffix = suffixes[type][Math.floor(Math.random() * suffixes[type].length)];
    return { name: prefix + suffix, type: type };
  }

  function openOpportunityWheel(callback) {
    wheelRuntime.oppWheelCallback = callback;
    document.getElementById('mini-wheel-label').textContent = '魂环吸收机遇';
    document.getElementById('mini-wheel-hint').textContent = '吸收魂环后，命运给你带来了...';
    document.getElementById('mini-wheel-result-area').innerHTML = '';
    document.getElementById('mini-wheel-spin-btn').style.display = '';
    document.getElementById('mini-wheel-spin-btn').classList.remove('btn-disabled');
    document.getElementById('mini-wheel-spin-btn').onclick = spinOpportunityWheel;
    drawMiniWheel(RING_OPPORTUNITY);
    let canvas = document.getElementById('mini-wheel-canvas');
    canvas.style.transition = 'none';
    canvas.style.transform = 'rotate(0deg)';
    void canvas.offsetWidth;
    document.getElementById('mini-wheel-overlay').classList.add('active');
  }

  function spinOpportunityWheel() {
    if (wheelRuntime.oppWheelSpinning) return;
    wheelRuntime.oppWheelSpinning = true;
    let btn = document.getElementById('mini-wheel-spin-btn');
    btn.classList.add('btn-disabled');
    let canvas = document.getElementById('mini-wheel-canvas');
    let items = RING_OPPORTUNITY;
    let total = items.reduce((sum, item) => sum + item.weight, 0);
    let selected = weightedRandom(items);
    let selectedIdx = items.indexOf(selected);
    let cumWeight = 0;
    for (let idx = 0; idx < selectedIdx; idx++) cumWeight += items[idx].weight;
    let sectorAngle = (selected.weight / total) * 360;
    let targetCenter = cumWeight / total * 360 + sectorAngle / 2;
    let finalAngle = 360 * 5 + (360 - targetCenter + 270);
    canvas.style.transition = 'transform 1.75s cubic-bezier(0.17,0.67,0.12,0.99)';
    canvas.style.transform = `rotate(${finalAngle}deg)`;
    setTimeout(() => {
      wheelRuntime.oppWheelSpinning = false;
      btn.classList.remove('btn-disabled');
      let area = document.getElementById('mini-wheel-result-area');
      switch (selected.id) {
        case 'sp': {
          let gain = 1 + Math.floor(Math.random() * 3);
          G.soulPower = Math.min(G.soulPower + gain, G.maxLevel);
          area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:#22aa44">魂力激增！</h3><p>吸收过程中，魂力额外暴涨！</p><p style="color:var(--gold);margin-top:8px;">魂力+${gain}级</p></div>`;
          break;
        }
        case 'bone': {
          let boneTypes = ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'];
          let available = boneTypes.filter(bone => !G.soulBones.includes(bone));
          if (available.length > 0) {
            let boneType = available[Math.floor(Math.random() * available.length)];
            G.soulBones.push(boneType);
            area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:var(--gold)">意外收获！</h3><p>魂兽体内残存着一块魂骨！</p><p style="color:var(--gold);margin-top:8px;">获得 <b>${boneType}</b>！</p></div>`;
          } else {
            G.gold = (G.gold || 0) + 200;
            area.innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--gold)">魂骨已齐！</h3><p>发现魂骨，但你已集齐全套！</p><p style="color:var(--gold);margin-top:8px;">出售换取200金魂币</p></div>';
          }
          break;
        }
        case 'custom_skill': {
          document.getElementById('mini-wheel-spin-btn').style.display = 'none';
          document.getElementById('mini-wheel-hint').textContent = '灵感涌现，自创魂技...';
          let customSkill = generateCustomSkillName();
          let typeNames = { attack: '攻击', defense: '防御', control: '控制', boost: '增幅' };
          let typeColors = { attack: '#ff4444', defense: '#4488ff', control: '#aa66ff', boost: '#22aa44' };
          G.customSkills = G.customSkills || [];
          G.customSkills.push(customSkill);
          let skillDescs = {
            attack: `第${G.customSkills.length}自创魂技。灵感迸发，创造出强力攻击技能，可造成大量伤害。`,
            defense: `第${G.customSkills.length}自创魂技。感悟天地防御之道，创造出坚固的防御技能。`,
            control: `第${G.customSkills.length}自创魂技。领悟精神控制之妙，创造出控制类技能。`,
            boost: `第${G.customSkills.length}自创魂技。激发自身潜能，创造出增幅类技能。`
          };
          setTimeout(() => {
            area.innerHTML = `<div class="mini-wheel-result"><h3 style="color:#aa66ff">灵光一现！</h3><p>你领悟了一门自创魂技！</p><p style="color:var(--gold);margin-top:8px;"><b>${customSkill.name}</b></p><p style="color:${typeColors[customSkill.type]};">类型：${typeNames[customSkill.type]}</p><p style="font-size:12px;color:var(--gray);margin-top:4px;">${skillDescs[customSkill.type]}</p></div>`;
            document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
          }, 500);
          break;
        }
        case 'nothing': {
          area.innerHTML = '<div class="mini-wheel-result"><h3 style="color:var(--gray)">平稳吸收</h3><p>一切顺利，没有额外收获。</p><p style="color:var(--gray);margin-top:8px;">或许下次会有好运...</p></div>';
          break;
        }
      }
      document.getElementById('mini-wheel-spin-btn').style.display = 'none';
      document.getElementById('mini-wheel-hint').textContent = '点击任意处继续';
    }, 3800);
  }

  function openSoulRingWheelAsync() {
    return new Promise(resolve => {
      openSoulRingWheel(resolve);
    });
  }

  function openOpportunityWheelAsync() {
    return new Promise(resolve => {
      openOpportunityWheel(resolve);
    });
  }

  global.openSoulRingWheel = openSoulRingWheel;
  global.openSoulRingWheelAsync = openSoulRingWheelAsync;
  global.openOpportunityWheel = openOpportunityWheel;
  global.openOpportunityWheelAsync = openOpportunityWheelAsync;
})(window);