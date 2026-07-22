(function (global) {
  const CREATION_STEP_CATALOG = {
    timeline: { label: '抽取时间线', centerText: '时', labelKey: 'name', colorKey: 'eraColor' },
    identity_type: { label: '抽取种族', centerText: '族', labelKey: 'name', colorKey: 'color' },
    background: { label: '抽取背景', centerText: '出', labelKey: 'name', colorKey: null },
    beast_race: { label: '抽取种族', centerText: '族', labelKey: 'name', colorKey: null },
    divine_beast_race: { label: '抽取神兽种族', centerText: '兽', labelKey: 'name', colorKey: 'color' },
    god_tier: { label: '抽取神位', centerText: '神', labelKey: 'name', colorKey: null },
    god_position: { label: '抽取神位名称', centerText: '神', labelKey: 'name', colorKey: 'eraColor' },
    god_artifact: { label: '抽取神器', centerText: '器', labelKey: 'name', colorKey: 'eraColor' },
    god_faction: { label: '抽取神界势力', centerText: '势', labelKey: 'name', colorKey: 'eraColor' },
    gender: { label: '抽取性别', centerText: '性', labelKey: 'name', colorKey: null },
    beast_bloodline: { label: '抽取血脉系', centerText: '脉', labelKey: 'name', colorKey: 'color' },
    beast_birthplace: { label: '抽取降生地点', centerText: '地', labelKey: 'name', colorKey: 'color' },
    awaken_count: { label: '抽取觉醒个数', centerText: '觉', labelKey: 'name', colorKey: 'color' },
    soul_quality: { label: '抽取武魂品质', centerText: '品', labelKey: 'name', colorKey: 'color' },
    soul_name: { label: '武魂觉醒', centerText: '魂', labelKey: 'name', colorKey: 'qColor' },
    innate: { label: '抽取先天魂力', centerText: '魂', labelKey: 'name', colorKey: 'ratingColor' },
    personality: { label: '抽取性格', centerText: '性', labelKey: 'name', colorKey: 'color' },
    appearance: { label: '抽取外貌', centerText: '貌', labelKey: 'name', colorKey: 'color' }
  };

  function queueCreationStep(type, overrides = {}) {
    return { ...CREATION_STEP_CATALOG[type], type, ...overrides };
  }

  function cloneWheelItems(items, decorate) {
    return items.map((item, index) => ({ ...item, ...(decorate ? decorate(item, index) : {}) }));
  }

  function buildIdentityTypePool(timeline) {
    let source = timeline.id === 'godrealm'
      ? [...IDENTITY_TYPES.god, ...IDENTITY_TYPES.divine_beast]
      : [...IDENTITY_TYPES.human, ...IDENTITY_TYPES.soul_beast];
    return cloneWheelItems(source, (item, index) => ({ color: item.color, eraColor: item.color || `hsl(${(index / source.length) * 280 + 120},50%,30%)` }));
  }

  function buildBackgroundPool() {
    return cloneWheelItems(HUMAN_BACKGROUNDS, (_, index) => ({ eraColor: `hsl(${(index / HUMAN_BACKGROUNDS.length) * 200 + 200},50%,30%)` }));
  }

  function buildBeastRacePool() {
    return cloneWheelItems(BEAST_RACES, (_, index) => ({ eraColor: `hsl(${(index / BEAST_RACES.length) * 60},50%,30%)` }));
  }

  function buildDivineBeastRacePool() {
    return cloneWheelItems(DIVINE_BEAST_RACES, (_, index) => ({ eraColor: `hsl(${(index / DIVINE_BEAST_RACES.length) * 80 + 20},50%,35%)` }));
  }

  function buildGodTierPool() {
    return cloneWheelItems(GOD_TIERS, (_, index) => ({ eraColor: `hsl(${(index / GOD_TIERS.length) * 60 + 40},50%,30%)` }));
  }

  function buildGenderPool() {
    let genders = GENDERS.filter(gender => gender.id !== 'none');
    return cloneWheelItems(genders, (_, index) => ({ eraColor: `hsl(${(index / genders.length) * 280},50%,30%)` }));
  }

  function buildBloodlinePool() {
    return cloneWheelItems(BEAST_BLOODLINES, item => ({ eraColor: item.color }));
  }

  function buildGodPositionPool(identityId) {
    let source = GOD_POSITIONS[identityId] || GOD_POSITIONS.god_official;
    return cloneWheelItems(source, item => ({ weight: 1, eraColor: item.color }));
  }

  function buildGodArtifactPool(identityId) {
    let source = GOD_ARTIFACTS[identityId] || GOD_ARTIFACTS.god_official;
    return cloneWheelItems(source, item => ({ weight: 1, eraColor: item.color }));
  }

  function buildGodFactionPool() {
    return cloneWheelItems(GOD_FACTIONS_POOL, item => ({ eraColor: item.color }));
  }

  function buildAwakeningCountPool() {
    let items = AWAKENING_COUNT.map(entry => ({ ...entry }));
    if (G.identity.id === 'family_child') {
      items[1].weight = 40;
      items[2].weight = 18;
      items[3].weight = 7;
    }
    if (G.identity.id === 'noble') {
      items[1].weight = 35;
      items[2].weight = 15;
      items[3].weight = 5;
    }
    return items.map(item => ({ ...item, eraColor: item.color }));
  }

  function buildBirthplacePool() {
    return cloneWheelItems(getBeastBirthplaces(G.timeline.id), item => ({ eraColor: item.color }));
  }

  function buildSoulQualityStep() {
    return queueCreationStep('soul_quality', { items: buildQualityWheel() });
  }

  function buildSoulNameStep(tier, soulIndex) {
    let nameItems = pickNameWheelItems(tier, 12).map(item => ({ ...item, weight: 1 }));
    return queueCreationStep('soul_name', {
      label: `第${soulIndex}个武魂（千中选一）`,
      items: nameItems,
      tier: tier
    });
  }

  function buildPersonalityStep() {
    return queueCreationStep('personality', { items: PERSONALITIES });
  }

  function buildAppearanceStep() {
    return queueCreationStep('appearance', { items: APPEARANCES });
  }

  function buildInnateStep() {
    return queueCreationStep('innate', { items: INNATE_POWER });
  }

  function rollBeastGender() {
    return Math.random() < 0.5
      ? { id: 'male', name: '雄', desc: '' }
      : { id: 'female', name: '雌', desc: '' };
  }

  function ensureFactionAssignment() {
    if (!G.timeline.factions) return '';
    if (G.identity.id !== 'sect_disciple' && G.identity.id !== 'family_child' && G.identity.id !== 'noble') return '';
    G.faction = G.timeline.factions[Math.floor(Math.random() * G.timeline.factions.length)];
    return `<p style="color:var(--cyan);margin-top:8px;">所属势力：<b>${G.faction}</b></p>`;
  }

  function initializeAwakeningState(count) {
    G._awakenCount = count;
    G._awakenedSouls = [];
  }

  function applyFactionSoulBonus() {
    if (!G.faction || !FACTION_SOULS[G.faction]) return '';
    let factionSouls = FACTION_SOULS[G.faction];
    let factionSoulName = factionSouls[Math.floor(Math.random() * factionSouls.length)];
    G._awakenedSouls.push({ name: factionSoulName, source: 'faction', faction: G.faction });
    return `<p style="color:var(--cyan);margin-top:8px;">势力专属武魂：<b>${factionSoulName}</b>（${G.faction}）</p>`;
  }

  function addAwakenedSoulFromTier(tier) {
    let isDual = tier === 'dual';
    if (isDual) {
      let soul1 = randomSoulName('top');
      let soul2 = randomSoulName('top');
      G._awakenedSouls = G._awakenedSouls || [];
      G._awakenedSouls.push({
        name: `${soul1.name} + ${soul2.name}`,
        type: '双生武魂',
        quality: '顶级+',
        qColor: '#ff4444',
        isDual: true,
        soul1: { ...soul1 },
        soul2: { ...soul2 }
      });
      return {
        isDual: true,
        html: `<div class="wheel-result"><h3 style="color:#ff4444;">双生武魂觉醒！</h3><p>第一武魂：<span style="color:${soul1.qColor}">${soul1.name}</span>（${soul1.type}）</p><p>第二武魂：<span style="color:${soul2.qColor}">${soul2.name}</span>（${soul2.type}）</p></div>`
      };
    }

    let actualSoul = randomSoulName(tier);
    G._awakenedSouls = G._awakenedSouls || [];
    G._awakenedSouls.push({ ...actualSoul });
    return {
      isDual: false,
      html: `<div class="wheel-result"><h3 style="color:${actualSoul.qColor}">武魂：${actualSoul.name}</h3><p>类型：${actualSoul.type} | 品质：<span style="color:${actualSoul.qColor}">${actualSoul.quality}</span></p></div>`
    };
  }

  function getAwakeningProgress() {
    let soulsDone = (G._awakenedSouls || []).length;
    let hasFactionSoul = (G._awakenedSouls || []).some(soul => soul.source === 'faction');
    let soulsTarget = (hasFactionSoul ? 1 : 0) + (G._awakenCount || 1);
    return { soulsDone, soulsTarget, remaining: soulsTarget - soulsDone };
  }

  function getBestSoulQuality(souls) {
    let bestQuality = '普通';
    let bestColor = '#888';
    souls.forEach(soul => {
      if (soul.quality === '顶级+') {
        bestQuality = '顶级+';
        bestColor = '#ff4444';
      } else if (soul.quality === '顶级' && bestQuality !== '顶级+') {
        bestQuality = '顶级';
        bestColor = '#ffdd44';
      } else if (soul.quality === '优秀~顶级' && bestQuality !== '顶级' && bestQuality !== '顶级+') {
        bestQuality = '优秀~顶级';
        bestColor = '#aa66ff';
      } else if (soul.quality === '优秀' && bestQuality === '普通') {
        bestQuality = '优秀';
        bestColor = '#4488ff';
      }
    });
    return { bestQuality, bestColor };
  }

  function compileMartialSoul() {
    let awakenedSouls = G._awakenedSouls || [];
    let dualEntry = awakenedSouls.find(soul => soul.isDual);
    if (awakenedSouls.length === 1 && !dualEntry) {
      let soul = awakenedSouls[0];
      G.martialSoul = { ...soul, example: soul.name, rings: [], skills: [], _baseName: soul.name, evolutionStage: 0 };
      return '';
    }

    if (dualEntry) {
      G.martialSoul = {
        id: 'dual',
        name: '双生武魂',
        type: '双生武魂',
        quality: '顶级+',
        qColor: '#ff4444',
        example: `${dualEntry.soul1.name} / ${dualEntry.soul2.name}`,
        isDual: true,
        activeIndex: 0,
        souls: [
          { ...dualEntry.soul1, rings: [], skills: [], _baseName: dualEntry.soul1.name, evolutionStage: 0 },
          { ...dualEntry.soul2, rings: [], skills: [], _baseName: dualEntry.soul2.name, evolutionStage: 0 }
        ]
      };
      return `<p style="color:var(--gold);margin-top:8px;">双生武魂觉醒完毕：${dualEntry.soul1.name} + ${dualEntry.soul2.name}</p>`;
    }

    let soulNames = awakenedSouls.map(soul => soul.name).join(' + ');
    let quality = getBestSoulQuality(awakenedSouls);
    G.martialSoul = {
      id: 'multi',
      name: awakenedSouls.length + '武魂觉醒',
      type: awakenedSouls.length > 1 ? '多武魂' : '器武魂',
      quality: quality.bestQuality,
      qColor: quality.bestColor,
      example: soulNames,
      souls: awakenedSouls.map(soul => ({ ...soul, rings: [], skills: [], _baseName: soul.name, evolutionStage: 0 })),
      activeIndex: 0
    };
    return `<p style="color:var(--gold);margin-top:8px;">所有武魂觉醒完毕：${soulNames}</p>`;
  }

  function resolveInnatePower(item) {
    let innateValue = item.min === item.max ? item.min : item.min + Math.floor(Math.random() * (item.max - item.min + 1));
    let soulBonus = 0;
    let soulBonusNote = '';

    if (G.identityType === 'soul_beast' && G.bloodline) {
      let bloodlinePower = G.bloodline.attr?.power || 1.0;
      soulBonus = Math.floor((bloodlinePower - 1.0) * 10);
      if (soulBonus > 0) soulBonusNote = `${G.bloodline.name}血脉加成+${soulBonus}`;
    } else if (G.martialSoul) {
      let quality = G.martialSoul.quality;
      if (quality === '优秀') {
        soulBonus = 1;
        soulBonusNote = '优秀武魂加成+1';
      } else if (quality === '优秀~顶级') {
        soulBonus = 2;
        soulBonusNote = '变异武魂加成+2';
      } else if (quality === '顶级') {
        soulBonus = 3;
        soulBonusNote = '顶级武魂加成+3';
      } else if (quality === '顶级+') {
        soulBonus = 5;
        soulBonusNote = '双生武魂加成+5';
      }
    }

    innateValue = Math.min(innateValue + soulBonus, 20);
    let isDualSoul = G.martialSoul && (G.martialSoul.type === '双生武魂' || G.martialSoul.id === 'dual');
    let isTopSoul = G.martialSoul && (G.martialSoul.quality === '顶级' || G.martialSoul.quality === '顶级+');
    if (isDualSoul && innateValue < 10) innateValue = 10;
    else if (isTopSoul && innateValue < 8) innateValue = 8;

    G.innatePower = innateValue;
    let actualRating = INNATE_POWER.find(entry => innateValue >= entry.min && innateValue <= entry.max);
    G.innateRating = actualRating ? actualRating.rating : item.rating;
    G.innateRatingColor = actualRating ? actualRating.ratingColor : item.ratingColor;

    let guaranteeNote = '';
    if (isDualSoul && (innateValue - soulBonus) < 10) {
      guaranteeNote = '<br><span style="color:var(--gold)">【双生武魂保底：先天魂力提升至10级！】</span>';
    } else if (isTopSoul && (innateValue - soulBonus) < 8) {
      guaranteeNote = '<br><span style="color:var(--gold)">【顶级武魂保底：先天魂力提升至8级！】</span>';
    }
    if (soulBonusNote) {
      guaranteeNote = '<br><span style="color:var(--cyan)">【' + soulBonusNote + '】</span>' + guaranteeNote;
    }

    return {
      actualRating,
      html: `<div class="wheel-result"><h3>先天魂力：${G.innatePower}级</h3><p style="color:${G.innateRatingColor}">${G.innateRating}</p><p style="margin-top:4px">${actualRating ? actualRating.desc : item.desc}</p>${guaranteeNote}</div>`
    };
  }

  function applyCreationOutcome(area, hint, outcome) {
    if (!outcome) return;
    if (Object.prototype.hasOwnProperty.call(outcome, 'html')) {
      area.innerHTML = outcome.html;
    }
    if (outcome.appendHtml) {
      area.innerHTML += outcome.appendHtml;
    }
    if (outcome.hint !== undefined) {
      hint.textContent = outcome.hint;
    }
    if (Array.isArray(outcome.nextSteps) && outcome.nextSteps.length > 0) {
      wheelQueue.push(...outcome.nextSteps);
    }
  }

  function finishCreationStep() {
    document.getElementById('wheel-spin-btn').style.display = 'none';
    let nextButton = document.getElementById('wheel-next-btn');
    nextButton.style.display = '';
    nextButton.textContent = wheelIndex >= wheelQueue.length - 1 ? '进入斗罗大陆' : '下一步';
  }

  const CREATION_STEP_HANDLERS = {
    timeline(item) {
      G = { ...createDefaultState(), timeline: item };
      return {
        html: `<div class="wheel-result"><h3>${item.name}</h3><p>${item.era}</p><p style="margin-top:8px;color:var(--gray)">${item.desc}</p></div>`,
        hint: '时代已确定，接下来抽取身份种族...',
        nextSteps: [queueCreationStep('identity_type', { items: buildIdentityTypePool(item) })]
      };
    },
    identity_type(item) {
      G.identityType = item.id;
      let nextStep = null;
      let hint = '';
      if (item.id === 'human') {
        hint = '你是人类，接下来抽取出身背景...';
        nextStep = queueCreationStep('background', { items: buildBackgroundPool() });
      } else if (item.id === 'soul_beast') {
        hint = '你是魂兽，接下来抽取种族年限...';
        nextStep = queueCreationStep('beast_race', { items: buildBeastRacePool() });
      } else if (item.id === 'god') {
        hint = '你是神祇，接下来抽取神位...';
        nextStep = queueCreationStep('god_tier', { items: buildGodTierPool() });
      } else if (item.id === 'divine_beast') {
        hint = '你是神兽，接下来抽取神兽种族...';
        nextStep = queueCreationStep('divine_beast_race', { items: buildDivineBeastRacePool() });
      }
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`,
        hint: hint,
        nextSteps: nextStep ? [nextStep] : []
      };
    },
    background(item) {
      G.identity = item;
      return {
        html: `<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`,
        hint: '背景已定，接下来抽取性别...',
        nextSteps: [queueCreationStep('gender', { items: buildGenderPool() })]
      };
    },
    beast_race(item) {
      G.identity = item;
      G.gender = rollBeastGender();
      return {
        html: `<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`,
        hint: '种族已定，接下来抽取血脉系...',
        nextSteps: [queueCreationStep('beast_bloodline', { items: buildBloodlinePool() })]
      };
    },
    divine_beast_race(item) {
      G.identity = item;
      G.gender = rollBeastGender();
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`,
        hint: '神兽种族已定，接下来抽取神兽血脉...',
        nextSteps: [queueCreationStep('beast_bloodline', { label: '抽取神兽血脉', items: buildBloodlinePool() })]
      };
    },
    god_tier(item) {
      G.identity = item;
      return {
        html: `<div class="wheel-result"><h3>${item.name}</h3><p>${item.desc}</p></div>`,
        hint: '神位等级已定，接下来抽取神位名称...',
        nextSteps: [queueCreationStep('god_position', { items: buildGodPositionPool(item.id) })]
      };
    },
    god_position(item) {
      G.godPosition = item;
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`,
        hint: '神位已定，接下来抽取神器...',
        nextSteps: [queueCreationStep('god_artifact', { items: buildGodArtifactPool(G.identity?.id) })]
      };
    },
    god_artifact(item) {
      G.godArtifact = item;
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`,
        hint: '神器已定，接下来抽取神界势力...',
        nextSteps: [queueCreationStep('god_faction', { items: buildGodFactionPool() })]
      };
    },
    god_faction(item) {
      G.faction = item.name;
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`,
        hint: '势力已定，接下来抽取性别...',
        nextSteps: [queueCreationStep('gender', { items: buildGenderPool() })]
      };
    },
    gender(item) {
      G.gender = item;
      if (G.identityType === 'soul_beast') {
        return {
          html: `<div class="wheel-result"><h3>性别：${item.name}</h3><p>${item.desc}</p></div>`,
          hint: '接下来抽取血脉系...',
          nextSteps: [queueCreationStep('beast_bloodline', { items: buildBloodlinePool() })]
        };
      }

      if (G.identityType === 'god') {
        return {
          html: `<div class="wheel-result"><h3>性别：${item.name}</h3><p>${item.desc}</p></div>`,
          hint: '神祇无需武魂觉醒，接下来抽取性格...',
          nextSteps: [buildPersonalityStep()]
        };
      }

      return {
        html: `<div class="wheel-result"><h3>性别：${item.name}</h3><p>${item.desc}</p></div>`,
        appendHtml: ensureFactionAssignment(),
        hint: '接下来抽取觉醒个数...',
        nextSteps: [queueCreationStep('awaken_count', { items: buildAwakeningCountPool() })]
      };
    },
    beast_bloodline(item) {
      G.bloodline = item;
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}血脉</h3><p>${item.desc}</p></div>`,
        hint: '血脉已定，抽取降生地点...',
        nextSteps: [queueCreationStep('beast_birthplace', { items: buildBirthplacePool() })]
      };
    },
    beast_birthplace(item) {
      G.birthplace = item;
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`,
        hint: '降生地点已定，接下来抽取性格...',
        nextSteps: [buildPersonalityStep()]
      };
    },
    awaken_count(item) {
      initializeAwakeningState(item.count);
      let factionSoulHtml = applyFactionSoulBonus();
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p></div>`,
        appendHtml: factionSoulHtml,
        hint: factionSoulHtml ? '第一个是势力专属武魂，继续抽取品质...' : '接下来抽取武魂品质...',
        nextSteps: [buildSoulQualityStep()]
      };
    },
    soul_quality(item) {
      G._soulQualityTier = item.tier;
      G._soulQualityName = item.name;
      G._soulQualityColor = item.color;
      let soulIndex = (G._awakenedSouls || []).length + 1;
      let totalSouls = G._awakenCount || 1;
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">第${soulIndex}个武魂品质：${item.name}</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gray);">身份影响概率：${G.identity.name}（${soulIndex}/${totalSouls}）</p></div>`,
        hint: '品质已定，从千种武魂中觉醒...',
        nextSteps: [buildSoulNameStep(item.tier, soulIndex)]
      };
    },
    soul_name(item, step) {
      let outcome = addAwakenedSoulFromTier(step.tier || item.tier);
      let progress = getAwakeningProgress();
      if (progress.soulsDone < progress.soulsTarget && !outcome.isDual) {
        return {
          html: outcome.html,
          hint: `还有${progress.remaining}个武魂要觉醒...`,
          nextSteps: [buildSoulQualityStep()]
        };
      }

      return {
        html: outcome.html,
        appendHtml: compileMartialSoul(),
        hint: '武魂已定，接下来抽取先天魂力...',
        nextSteps: [buildInnateStep()]
      };
    },
    innate(item) {
      let outcome = resolveInnatePower(item);
      return {
        html: outcome.html,
        hint: '天赋已定，接下来抽取性格...',
        nextSteps: [buildPersonalityStep()]
      };
    },
    personality(item) {
      G.personality = item;
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gray);">社交：${Math.round(item.traits.social * 100)}% | 情缘：${Math.round(item.traits.romance * 100)}% | 强敌：${Math.round(item.traits.enemy * 100)}%</p></div>`,
        hint: '性格已定，接下来抽取外貌...',
        nextSteps: [buildAppearanceStep()]
      };
    },
    appearance(item) {
      G.appearance = item;
      let charm = item.attr?.charm || 5;
      return {
        html: `<div class="wheel-result"><h3 style="color:${item.color}">${item.name}容貌</h3><p>${item.desc}</p><p style="margin-top:4px;color:var(--gold);">魅力值：${charm}/10</p></div>`,
        hint: ''
      };
    }
  };

  const CharacterCreationFlow = {
    buildInitialQueue() {
      return [queueCreationStep('timeline', { items: TIMELINES })];
    },
    applyWheelResult(item) {
      let area = document.getElementById('wheel-result-area');
      let hint = document.getElementById('wheel-hint');
      let step = wheelQueue[wheelIndex];
      let handler = CREATION_STEP_HANDLERS[step.type];
      if (!handler) {
        throw new Error('Unknown creation step: ' + step.type);
      }
      let outcome = handler(item, step);
      applyCreationOutcome(area, hint, outcome);
      finishCreationStep();
    }
  };

  global.CharacterCreationFlow = CharacterCreationFlow;
})(window);