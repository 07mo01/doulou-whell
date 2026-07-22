const CROSS_SKILLS = [
  { source: '火影忍者', skills: ['写轮眼', '忍术', '仙人模式'], effect: '觉醒为特殊瞳类武魂或查克拉辅助体系', color: '#ff4444' },
  { source: '海贼王', skills: ['恶魔果实', '霸气', '悬赏金'], effect: '恶魔果实作为变异武魂，霸气转化为魂力技巧', color: '#ffaa00' },
  { source: '死神', skills: ['斩魄刀', '鬼道', '卍解'], effect: '斩魄刀作为器武魂，鬼道作为魂技', color: '#4444ff' },
  { source: '进击的巨人', skills: ['巨人之力', '硬质化', '始祖之力'], effect: '巨人变身作为武魂真身特殊形态', color: '#88aa44' },
  { source: '咒术回战', skills: ['术式', '领域展开', '反转术式'], effect: '术式作为自创魂技，领域展开为领域魂技', color: '#6644aa' },
  { source: '鬼灭之刃', skills: ['呼吸法', '斑纹', '通透世界'], effect: '呼吸法融入魂力运转，斑纹为爆发技能', color: '#44aaaa' }
];

const ACHIEVEMENTS = [
  // 实力类
  { id: 'title_soulshi', name: '初入魂道', cat: '实力', desc: '达到10级', icon: '🌱', check: s => s.soulPower >= 10 },
  { id: 'title_soulshi2', name: '魂师之路', cat: '实力', desc: '达到20级', icon: '⭐', check: s => s.soulPower >= 20 },
  { id: 'title_hunzun', name: '魂尊之威', cat: '实力', desc: '达到30级', icon: '💪', check: s => s.soulPower >= 30 },
  { id: 'title_hunzong', name: '魂宗之名', cat: '实力', desc: '达到50级', icon: '🏆', check: s => s.soulPower >= 50 },
  { id: 'title_hunsheng', name: '魂圣之境', cat: '实力', desc: '达到70级', icon: '🔥', check: s => s.soulPower >= 70 },
  { id: 'title_hundouluo', name: '魂斗罗', cat: '实力', desc: '达到80级', icon: '⚡', check: s => s.soulPower >= 80 },
  { id: 'title_fenghao', name: '封号斗罗', cat: '实力', desc: '达到90级以上', icon: '⚔️', check: s => s.soulPower >= 90 },
  { id: 'title_chaoji', name: '超级斗罗', cat: '实力', desc: '达到96级', icon: '🔥', check: s => s.soulPower >= 96 },
  { id: 'title_jixian', name: '极限斗罗', cat: '实力', desc: '达到99级', icon: '👑', check: s => s.soulPower >= 99 },
  { id: 'title_god', name: '神祇之路', cat: '实力', desc: '继承神位或达到100级', icon: '✨', check: s => s.soulPower >= 100 || s.isGod },
  { id: 'title_truegod', name: '真神之境', cat: '实力', desc: '达到110级', icon: '🌟', check: s => s.soulPower >= 110 },
  { id: 'title_chaoshen', name: '超神之境', cat: '实力', desc: '达到120级', icon: '💫', check: s => s.soulPower >= 120 },
  { id: 'title_shenwang', name: '神王之力', cat: '实力', desc: '达到150级', icon: '🌈', check: s => s.soulPower >= 150 },
  // 魂兽类
  { id: 'beast_bainian', name: '百年灵兽', cat: '魂兽', desc: '魂兽达到百年', icon: '🐾', check: s => s.identityType === 'soul_beast' && (s.beastYears || 0) >= 100 },
  { id: 'beast_qiannian', name: '千年大妖', cat: '魂兽', desc: '魂兽达到千年', icon: '🐺', check: s => s.identityType === 'soul_beast' && (s.beastYears || 0) >= 1000 },
  { id: 'beast_wannian', name: '万年霸主', cat: '魂兽', desc: '魂兽达到万年', icon: '🐉', check: s => s.identityType === 'soul_beast' && s.soulPower >= 21 },
  { id: 'beast_shiwan', name: '十万年凶兽', cat: '魂兽', desc: '魂兽达到十万年', icon: '👹', check: s => s.identityType === 'soul_beast' && (s.beastYears || 0) >= 100000 },
  { id: 'beast_xiongshou', name: '凶兽之尊', cat: '魂兽', desc: '达到二十万年凶兽', icon: '🐲', check: s => s.identityType === 'soul_beast' && s.soulPower >= 96 },
  { id: 'beast_baiwan', name: '百万年传说', cat: '魂兽', desc: '魂兽达到百万年', icon: '✨', check: s => s.identityType === 'soul_beast' && (s.beastYears || 0) >= 1000000 },
  { id: 'beast_transform', name: '化形大道', cat: '魂兽', desc: '成功化形为人类', icon: '🦋', check: s => s.transformed },
  { id: 'beast_escape', name: '死里逃生', cat: '魂兽', desc: '魂兽从人类猎杀中成功逃脱', icon: '🏃', check: s => s.enemies?.some(e => e.escaped) },
  // 生存类
  { id: 'survive_50', name: '半百之寿', cat: '生存', desc: '存活超过50岁', icon: '🗓️', check: s => s.age >= 50 },
  { id: 'survive_100', name: '百岁老人', cat: '生存', desc: '存活超过100岁', icon: '🎂', check: s => s.age >= 100 },
  { id: 'survive_200', name: '长寿之星', cat: '生存', desc: '存活超过200岁', icon: '🏛️', check: s => s.age >= 200 },
  { id: 'survive_500', name: '不死之身', cat: '生存', desc: '存活超过500岁', icon: '🛡️', check: s => s.age >= 500 },
  { id: 'survive_death', name: '九死一生', cat: '生存', desc: '从濒死边缘存活下来', icon: '💀', check: s => s.yearEvents?.some(e => e.text?.includes('濒死') || e.text?.includes('重伤')) && s.alive },
  // 剧情类
  { id: 'fate_lover', name: '宿命姻缘', cat: '剧情', desc: '拥有道侣', icon: '💘', check: s => s.hasSpouse },
  { id: 'fate_nemesis', name: '宿命之敌', cat: '剧情', desc: '击败5个以上的强敌', icon: '⚔️', check: s => s.enemies?.length >= 5 },
  { id: 'fate_rich', name: '富甲天下', cat: '剧情', desc: '拥有1000以上金魂币', icon: '💰', check: s => (s.gold || 0) >= 1000 },
  { id: 'fate_famous', name: '名震大陆', cat: '剧情', desc: '名声达到100', icon: '📜', check: s => (s.merit || 0) >= 100 },
  { id: 'fate_master', name: '名师指点', cat: '剧情', desc: '拜入名师门下', icon: '🏛️', check: s => s.hasMaster },
  { id: 'fate_companion', name: '结伴同行', cat: '剧情', desc: '拥有3位以上伙伴', icon: '👥', check: s => s.companions?.length >= 3 },
  // 稀有类
  { id: 'dual_soul', name: '双生武魂', cat: '稀有', desc: '觉醒双生武魂', icon: '🔱', check: s => s.martialSoul?.id === 'dual' },
  { id: 'gold_ring', name: '神级魂环', cat: '稀有', desc: '获得金色魂环', icon: '💫', check: s => s.soulRings?.some(r => r.css === 'g') },
  { id: 'innate_10', name: '先天满魂力', cat: '稀有', desc: '先天魂力达到10级', icon: '🔥', check: s => s.innatePower >= 10 },
  { id: 'innate_20', name: '先天二十', cat: '稀有', desc: '先天魂力达到20级', icon: '☄️', check: s => s.innatePower >= 20 },
  { id: 'all_rings', name: '九环大满贯', cat: '稀有', desc: '集齐九个魂环', icon: '🎯', check: s => s.soulRings?.length >= 9 },
  { id: 'six_bones', name: '六骨斗罗', cat: '稀有', desc: '集齐六块不同位置魂骨（全骨覆盖）', icon: '🦴', check: s => s.soulBones?.length >= 6 },
  { id: 'beast_seventh', name: '武魂真身', cat: '稀有', desc: '获得第七魂环·武魂真身', icon: '🔄', check: s => s.soulRings?.length >= 7 },
  { id: 'custom_title', name: '自封封号', cat: '稀有', desc: '达到封号斗罗并自选封号', icon: '🛡️', check: s => s.customTitle && s.soulPower >= 90 },
  { id: 'bloodline_skill', name: '血脉觉醒', cat: '稀有', desc: '觉醒血脉技能', icon: '🩸', check: s => s.bloodlineSkills?.length > 0 },
  // 时代类
  { id: 'era_douluo1', name: '斗罗风云', cat: '时代', desc: '在斗罗1时代达到封号斗罗', icon: '📖', check: s => s.timeline?.id === 'douluo1' && s.soulPower >= 90 },
  { id: 'era_douluo2', name: '绝世传奇', cat: '时代', desc: '在绝世唐门时代达到封号斗罗', icon: '📖', check: s => s.timeline?.id === 'douluo2' && s.soulPower >= 90 },
  { id: 'era_douluo3', name: '龙王传颂', cat: '时代', desc: '在龙王传说时代达到封号斗罗', icon: '📖', check: s => s.timeline?.id === 'douluo3' && s.soulPower >= 90 },
  { id: 'era_douluo4', name: '终极传说', cat: '时代', desc: '在终极斗罗时代达到封号斗罗', icon: '📖', check: s => s.timeline?.id === 'douluo4' && s.soulPower >= 90 },
  { id: 'era_god', name: '神界传说', cat: '时代', desc: '在神界时代达到神王', icon: '📖', check: s => s.timeline?.id === 'godrealm' && s.soulPower >= 150 },
  { id: 'era_witness', name: '历史见证者', cat: '时代', desc: '经历时代关键事件', icon: '📜', check: s => s._triggeredProgress?.length >= 3 },
  {
    id: 'era_allwitness', name: '时代的亲历者', cat: '时代', desc: '经历全部原著剧情事件', icon: '📚', check: s => {
      let p = TIMELINE_PROGRESS[s?.timeline?.id];
      return !!(p && s && s._triggeredProgress && s._triggeredProgress.length >= p.length);
    }
  },
  // 快速随机
  { id: 'quick_start', name: '快速转世', cat: '特殊', desc: '使用快速随机开始游戏', icon: '⚡', check: s => s._quickStart }
];

const JUSTICE_EVENT_POOLS = {
  douluo1: [
    { text: '路见不平，你看到一位老人被武魂殿的魂师欺负，挺身而出！', winChance: 0.8, rewards: { merit: 5, soulPower: 1 } },
    { text: '你发现一群邪魂师在屠戮村庄，义无反顾地出手相助！', winChance: 0.6, rewards: { merit: 10, soulPower: 2 } },
    { text: '一位少女被魂兽追杀，你拔刀相助！', winChance: 0.7, rewards: { merit: 8, soulPower: 1 } },
    { text: '你撞见武魂殿的人在欺压平民，仗义执言！', winChance: 0.5, rewards: { merit: 15, soulPower: 2 } },
    { text: '一伙强盗劫掠商队，你出手相救！', winChance: 0.9, rewards: { merit: 3, soulPower: 1 } }
  ],
  douluo2: [
    { text: '你看到一位平民被日月帝国的魂导师欺压，挺身而出！', winChance: 0.8, rewards: { merit: 5, soulPower: 1 } },
    { text: '你发现一群邪魂师在袭击村庄，义无反顾地出手相助！', winChance: 0.6, rewards: { merit: 10, soulPower: 2 } },
    { text: '一位少女被魂兽追杀，你拔刀相助！', winChance: 0.7, rewards: { merit: 8, soulPower: 1 } },
    { text: '你撞见圣灵教的人在抓捕平民进行邪恶实验，仗义执言！', winChance: 0.5, rewards: { merit: 15, soulPower: 2 } },
    { text: '一伙强盗劫掠商队，你出手相救！', winChance: 0.9, rewards: { merit: 3, soulPower: 1 } }
  ],
  douluo3: [
    { text: '你看到一位平民被传灵塔的执事欺压，挺身而出！', winChance: 0.8, rewards: { merit: 5, soulPower: 1 } },
    { text: '你发现一群邪魂师在屠戮村庄，义无反顾地出手相助！', winChance: 0.6, rewards: { merit: 10, soulPower: 2 } },
    { text: '一位少女被魂兽追杀，你拔刀相助！', winChance: 0.7, rewards: { merit: 8, soulPower: 1 } },
    { text: '你撞见圣灵教的人在抓捕平民进行邪恶实验，仗义执言！', winChance: 0.5, rewards: { merit: 15, soulPower: 2 } },
    { text: '一伙强盗劫掠商队，你出手相救！', winChance: 0.9, rewards: { merit: 3, soulPower: 1 } }
  ],
  douluo4: [
    { text: '你看到一位平民被星际海盗欺压，挺身而出！', winChance: 0.8, rewards: { merit: 5, soulPower: 1 } },
    { text: '你发现一群深红之域的生物在袭击殖民地，义无反顾地出手相助！', winChance: 0.6, rewards: { merit: 10, soulPower: 2 } },
    { text: '一位少女被外星魂兽追杀，你拔刀相助！', winChance: 0.7, rewards: { merit: 8, soulPower: 1 } },
    { text: '你撞见天龙星的龙族在欺压人类移民，仗义执言！', winChance: 0.5, rewards: { merit: 15, soulPower: 2 } },
    { text: '一伙星际强盗劫掠商船，你出手相救！', winChance: 0.9, rewards: { merit: 3, soulPower: 1 } }
  ],
  godrealm: [
    { text: '你看到一位神官被神兽欺负，挺身而出！', winChance: 0.8, rewards: { merit: 5, soulPower: 1 } },
    { text: '你发现一群叛逆神兽在破坏神界秩序，义无反顾地出手相助！', winChance: 0.6, rewards: { merit: 10, soulPower: 2 } },
    { text: '一位神官被流放神兽追杀，你拔刀相助！', winChance: 0.7, rewards: { merit: 8, soulPower: 1 } },
    { text: '你撞见毁灭之神的部下在欺压弱小神祇，仗义执言！', winChance: 0.5, rewards: { merit: 15, soulPower: 2 } },
    { text: '一伙神界流民劫掠集市，你出手相救！', winChance: 0.9, rewards: { merit: 3, soulPower: 1 } }
  ],
  default: [
    { text: '路见不平，你看到一位老人被魂师欺负，挺身而出！', winChance: 0.8, rewards: { merit: 5, soulPower: 1 } },
    { text: '你发现一群邪魂师在屠戮村庄，义无反顾地出手相助！', winChance: 0.6, rewards: { merit: 10, soulPower: 2 } },
    { text: '一位少女被魂兽追杀，你拔刀相助！', winChance: 0.7, rewards: { merit: 8, soulPower: 1 } },
    { text: '你撞见邪恶势力在欺压平民，仗义执言！', winChance: 0.5, rewards: { merit: 15, soulPower: 2 } },
    { text: '一伙强盗劫掠商队，你出手相救！', winChance: 0.9, rewards: { merit: 3, soulPower: 1 } }
  ]
};

const AUCTION_EVENT_POOLS = {
  douluo1: [
    { name: '千年魂骨碎片', cost: 50, rewards: { soulPower: 1 }, resultText: '吸收了碎片中的魂力，魂力+1级' },
    { name: '稀有药草·龙血参', cost: 80, rewards: { soulPower: 2 }, resultText: '服用后魂力暴涨，魂力+2级' },
    { name: '上古暗器图谱残卷', cost: 60, rewards: { soulPower: 1 }, resultText: '领悟了上古暗器的皮毛，魂力+1级' },
    { name: '上古武魂秘典', cost: 100, rewards: { soulPower: 3 }, resultText: '领悟了上古修炼法门，魂力+3级' },
    { name: '仙品药草·绮罗郁金香', cost: 50, rewards: { charm: 1 }, resultText: '服用后容貌提升，魅力+1' }
  ],
  douluo2: [
    { name: '千年魂骨碎片', cost: 50, rewards: { soulPower: 1 }, resultText: '吸收了碎片中的魂力，魂力+1级' },
    { name: '稀有药草·龙血参', cost: 80, rewards: { soulPower: 2 }, resultText: '服用后魂力暴涨，魂力+2级' },
    { name: '日月帝国魂导器图纸', cost: 60, minBattleArmor: 1, resultText: '掌握了魂导器制作技术' },
    { name: '上古武魂秘典', cost: 100, rewards: { soulPower: 3 }, resultText: '领悟了上古修炼法门，魂力+3级' },
    { name: '魂导美容仪', cost: 50, rewards: { charm: 1 }, resultText: '使用后容貌提升，魅力+1' }
  ],
  douluo3: [
    { name: '千年魂骨碎片', cost: 50, rewards: { soulPower: 1 }, resultText: '吸收了碎片中的魂力，魂力+1级' },
    { name: '有灵合金配方', cost: 80, minBattleArmor: 2, resultText: '掌握了有灵合金技术' },
    { name: '一字斗铠设计图', cost: 60, minBattleArmor: 1, resultText: '获得了一字斗铠设计图' },
    { name: '上古武魂秘典', cost: 100, rewards: { soulPower: 3 }, resultText: '领悟了上古修炼法门，魂力+3级' },
    { name: '传灵塔美容魂导器', cost: 50, rewards: { charm: 1 }, resultText: '使用后容貌提升，魅力+1' }
  ],
  douluo4: [
    { name: '千年魂骨碎片', cost: 50, rewards: { soulPower: 1 }, resultText: '吸收了碎片中的魂力，魂力+1级' },
    { name: '龙力结晶', cost: 80, rewards: { soulPower: 2 }, resultText: '吸收龙力后魂力暴涨，魂力+2级' },
    { name: '星际魂导器核心', cost: 60, minBattleArmor: 2, resultText: '获得了星际魂导器技术' },
    { name: '上古武魂秘典', cost: 100, rewards: { soulPower: 3 }, resultText: '领悟了上古修炼法门，魂力+3级' },
    { name: '天龙星养颜秘方', cost: 50, rewards: { charm: 1 }, resultText: '使用后容貌提升，魅力+1' }
  ],
  godrealm: [
    { name: '神骨碎片', cost: 50, rewards: { soulPower: 1 }, resultText: '吸收了神骨碎片中的神力，魂力+1级' },
    { name: '神赐药草', cost: 80, rewards: { soulPower: 2 }, resultText: '服用后神力暴涨，魂力+2级' },
    { name: '神器残片', cost: 60, rewards: { soulPower: 1 }, resultText: '领悟了神器中的法则，魂力+1级' },
    { name: '神界秘典', cost: 100, rewards: { soulPower: 3 }, resultText: '领悟了神界法则，魂力+3级' },
    { name: '生命精华', cost: 50, rewards: { charm: 1 }, resultText: '使用后容貌提升，魅力+1' }
  ],
  default: [
    { name: '千年魂骨碎片', cost: 50, rewards: { soulPower: 1 }, resultText: '吸收了碎片中的魂力，魂力+1级' },
    { name: '稀有药草·龙血参', cost: 80, rewards: { soulPower: 2 }, resultText: '服用后魂力暴涨，魂力+2级' },
    { name: '魂导器图纸', cost: 60, minBattleArmor: 1, resultText: '掌握了魂导器制作技术' },
    { name: '上古武魂秘典', cost: 100, rewards: { soulPower: 3 }, resultText: '领悟了上古修炼法门，魂力+3级' },
    { name: '美容养颜丹', cost: 50, rewards: { charm: 1 }, resultText: '服用后容貌提升，魅力+1' }
  ]
};

const PARTNER_EVENT_POOLS = {
  douluo1: [
    { text: '你与{{spouseName}}在星斗大森林中历练，两人并肩作战，默契大增。', rewards: { soulPower: 2 } },
    { text: '{{spouseName}}为你寻来了一株相思断肠红（仿品），助你稳固魂力。', rewards: { soulPower: 3 } },
    { text: '你和{{spouseName}}一同前往海神岛朝圣，在海神之光下共同修炼。', rewards: { soulPower: 2, merit: 5 } },
    {
      text: '{{spouseName}}遭遇武魂殿余孽的袭击，你奋不顾身前去相救！',
      check: {
        winChance: 0.8,
        success: { rewards: { soulPower: 1 }, resultText: '成功救出！两人感情更加深厚，魂力+1级' },
        failure: { rewards: { soulPower: -2 }, resultText: '营救过程中受伤，魂力-2级' }
      }
    },
    { text: '你和{{spouseName}}在索托城散步，享受难得的宁静时光。', resultText: '平淡而幸福的一年。' }
  ],
  douluo2: [
    { text: '你与{{spouseName}}在海神湖畔漫步，黄金树的见证下感情升温。', rewards: { soulPower: 2 } },
    { text: '{{spouseName}}亲手为你制作了一件二级魂导器作为礼物。', rewards: { gold: 20 }, minBattleArmor: 1, resultText: '掌握魂导基础，获得20金魂币' },
    { text: '你和{{spouseName}}参加了海神缘相亲大会后的庆典，羡煞旁人。', rewards: { soulPower: 2, merit: 8 } },
    {
      text: '{{spouseName}}在监察团任务中遇险，你火速赶往救援！',
      check: {
        winChance: 0.75,
        success: { rewards: { soulPower: 1 }, resultText: '成功救出！两人感情更加深厚，魂力+1级' },
        failure: { rewards: { soulPower: -2 }, resultText: '营救过程中受伤，魂力-2级' }
      }
    },
    { text: '你和{{spouseName}}一起研究魂导器到深夜，虽然疲惫但很充实。', resultText: '平淡而幸福的一年。' }
  ],
  douluo3: [
    { text: '你与{{spouseName}}在史莱克学院的斗铠工坊一起制作合金，默契十足。', rewards: { soulPower: 2 } },
    { text: '{{spouseName}}陪你去传灵塔升灵台修炼，两人在虚拟世界中并肩作战。', rewards: { soulPower: 2 } },
    { text: '你和{{spouseName}}一同前往龙谷秘境探险，在龙骨山脉中许下了誓言。', rewards: { soulPower: 3 }, resultText: '魂力+3级（龙骨见证）' },
    {
      text: '{{spouseName}}被圣灵教的人盯上，你挺身而出保护爱人！',
      check: {
        winChance: 0.7,
        success: { rewards: { soulPower: 1, merit: 5 }, resultText: '成功击退敌人！名声+5，魂力+1级' },
        failure: { rewards: { soulPower: -2 }, resultText: '不敌邪魂师，受伤后魂力-2级' }
      }
    },
    { text: '你和{{spouseName}}在东海城的海边散步，谈论着未来的斗铠设计。', resultText: '平淡而幸福的一年。' }
  ],
  douluo4: [
    { text: '你与{{spouseName}}在天龙星的龙族花园中约会，外星球的浪漫别有一番风味。', rewards: { soulPower: 2 } },
    { text: '{{spouseName}}驾驶飞船带你游览了斗罗联邦的星际疆域。', rewards: { gold: 40 }, resultText: '获得40金魂币' },
    { text: '你和{{spouseName}}一同探索了龙界遗迹，在龙神的气息中感情升华。', rewards: { soulPower: 3 } },
    {
      text: '{{spouseName}}在深红之域的探索中失联，你冒着生命危险前去寻找！',
      check: {
        winChance: 0.7,
        success: { rewards: { soulPower: 2 }, resultText: '成功找到！两人在生死之间更加珍惜彼此，魂力+2级' },
        failure: { rewards: { soulPower: -3 }, resultText: '遭遇深红生物袭击，重伤后魂力-3级' }
      }
    },
    { text: '你和{{spouseName}}在精灵星的栖息地露营，欣赏着外星球的星空。', resultText: '平淡而幸福的一年。' }
  ],
  godrealm: [
    { text: '你与{{spouseName}}在神界花园中漫步，神界的景色万年不变但身边有你足矣。', rewards: { soulPower: 3 } },
    { text: '{{spouseName}}用生命之力为你洗涤神魂，你的神力更加纯粹。', rewards: { soulPower: 4 }, resultText: '魂力+4级（神魂洗涤）' },
    { text: '你和{{spouseName}}一同参加了神界委员会举办的论道大会，在诸神面前展示了你们的默契。', rewards: { soulPower: 3, merit: 10 } },
    {
      text: '{{spouseName}}在神界深渊巡查时遇险，你冲入深渊营救！',
      check: {
        winChance: 0.8,
        success: { rewards: { soulPower: 2 }, resultText: '成功救出！两人在神界也是令人羡慕的神仙眷侣，魂力+2级' },
        failure: { rewards: { soulPower: -2 }, resultText: '被神界乱流所伤，魂力-2级' }
      }
    },
    { text: '你和{{spouseName}}在神界天河旁静修，数万年的陪伴让你们的感情愈发深厚。', resultText: '平淡而幸福的一年。' }
  ],
  default: [
    { text: '你与{{spouseName}}一同修炼，两人相辅相成，魂力精进。', rewards: { soulPower: 2 } },
    { text: '{{spouseName}}为你寻来一株稀有药草，助你突破瓶颈。', rewards: { soulPower: 3 } },
    { text: '你和{{spouseName}}共同游历大陆，增长见闻。', rewards: { gold: 50 }, resultText: '获得50金魂币' },
    {
      text: '{{spouseName}}遭遇危险，你奋不顾身前去相救！',
      check: {
        winChance: 0.7,
        success: { resultText: '成功救出！两人感情更加深厚。' },
        failure: { rewards: { soulPower: -2 }, resultText: '营救过程中受伤，魂力-2级' }
      }
    },
    { text: '你和{{spouseName}}感情平淡但温馨，携手走过这一年。', resultText: '平淡而幸福的一年。' }
  ]
};

const FORTUNE_EVENT_POOLS = {
  human: {
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
    },
    default: {
      sp: ['你在一处隐秘之地发现了前人遗留的修炼资源，修为有所精进。'],
      gold: ['你偶然得到了一笔意外之财。'],
      appearance: ['你得到了一份改善体质与气质的机缘。'],
      bone: ['你在探险中发现了一块珍贵魂骨！']
    }
  },
  soul_beast: {
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
    },
    default: {
      sp: ['你在天地灵气汇聚之地修炼，修为稳步提升。'],
      gold: ['你从人类遗迹中翻出了一些有价值的财物。'],
      appearance: ['你吸收灵气后体魄与气势更上一层楼。'],
      bone: ['你在荒野中发现了一份强者遗留的本源精华！']
    }
  }
};

const FORTUNE_EVENT_RULES = {
  types: ['sp', 'gold', 'appearance', 'bone'],
  sp: {
    rewards: { soulPower: { min: 1, max: 3 } },
    beastRewards: { beastYears: { min: 100, max: 500 } }
  },
  gold: {
    rewards: { gold: { min: 20, max: 99 } }
  },
  appearance: {
    rewards: { charm: 1 },
    fallbackRewards: { soulPower: 1 }
  },
  bone: {
    boneTypes: ['头部魂骨', '躯干魂骨', '左臂骨', '右臂骨', '左腿骨', '右腿骨'],
    duplicateRewards: { gold: 100 },
    beastRewards: { beastYears: { min: 200, max: 500 } }
  }
};

const NORMAL_EVENT_POOLS = {
  soul_beast: {
    douluo1: [
      { text: '你在星斗大森林深处吸收月华之力，修为稳步增长。', rewards: { soulPower: 1, beastYears: 25 } },
      { text: '你发现了一处灵泉，畅饮之后浑身舒畅，本源之力有所增强。', rewards: { soulPower: 1, beastYears: 35 } },
      { text: '你与同族切磋斗技，在战斗中磨练了本能。', rewards: { soulPower: 2, beastYears: 20 } },
      { text: '你吞噬了一只入侵领地的小型魂兽，获得了额外的能量。', rewards: { soulPower: 1, beastYears: 45 } },
      { text: '你在瀑布下淬炼肉身，皮毛/鳞甲变得更加坚韧。', rewards: { soulPower: 1, beastYears: 25 } },
      { text: '你感应到了森林深处某位十万年魂兽的气息，受到启发。', rewards: { soulPower: 2, beastYears: 20 } },
      { text: '你在冰火两仪眼附近修炼，极致能量让你的血脉更加纯粹。', rewards: { soulPower: 2, beastYears: 40 } },
      { text: '平静的一年，你安心修炼，无惊无险。', rewards: { soulPower: 1, beastYears: 18 } }
    ],
    douluo2: [
      { text: '你在森林中吸收天地灵气，黄金树的气息让修炼事半功倍。', rewards: { soulPower: 1, beastYears: 25 } },
      { text: '你发现了一片被人类遗弃的药田，吞食了几株灵草。', rewards: { soulPower: 1, beastYears: 35 } },
      { text: '你与其他魂兽争夺领地，胜利后吞噬了对方的残余能量。', rewards: { soulPower: 2, beastYears: 30 } },
      { text: '你避开了人类监察团的巡逻，在隐秘山谷中安心修炼。', rewards: { soulPower: 1, beastYears: 18 } },
      { text: '你在冰原上修炼，极寒环境淬炼了你的意志。', rewards: { soulPower: 1, beastYears: 25 } },
      { text: '你吞噬了一只邪魂师留下的邪恶魂兽，获得了诡异的能量。', rewards: { soulPower: 2, beastYears: 35 } },
      { text: '你感受到日月帝国魂导器的能量波动，从中汲取了一丝变异之力。', rewards: { soulPower: 2, beastYears: 30 } }
    ],
    douluo3: [
      { text: '你在龙谷秘境边缘感应到龙族气息，血脉微微沸腾。', rewards: { soulPower: 1, beastYears: 25 } },
      { text: '你发现了一处地下灵脉，汲取其中的能量修炼。', rewards: { soulPower: 2, beastYears: 35 } },
      { text: '你击败了一只挑战你的深渊生物，吞噬了它的核心。', rewards: { soulPower: 2, beastYears: 45 } },
      { text: '你在传灵塔外围的森林中躲避人类的目光，默默修炼。', rewards: { soulPower: 1, beastYears: 18 } },
      { text: '你吞噬了一只重伤的同类，虽然残忍但弱肉强食是法则。', rewards: { soulPower: 1, beastYears: 35 } },
      { text: '你在斗铠碎片遗迹中感悟远古力量，修为精进。', rewards: { soulPower: 2, beastYears: 40 } },
      { text: '平静的一年，你在隐秘洞穴中沉睡修炼。', rewards: { soulPower: 1, beastYears: 25 } }
    ],
    douluo4: [
      { text: '你在天龙星的原始森林中吸收龙力，修为有所提升。', rewards: { soulPower: 1, beastYears: 25 } },
      { text: '你发现了一颗蕴含能量的陨石碎片，吞噬后获得了异域能量。', rewards: { soulPower: 2, beastYears: 45 } },
      { text: '你躲避星际猎魂师的追捕，在荒星上艰难求生。', rewards: { soulPower: 1, beastYears: 18 } },
      { text: '你在深红之域边缘吸收了一丝奇异能量，修为大涨。', rewards: { soulPower: 2, beastYears: 35 } },
      { text: '你在精灵星的生命古树下修炼，感受到了宇宙本源之力。', rewards: { soulPower: 2, beastYears: 35 } },
      { text: '你在龙马星系吸收异星法则，血脉产生微妙变化。', rewards: { soulPower: 2, beastYears: 40 } },
      { text: '平静的一年，你在洞穴中沉睡，吸收天地精华。', rewards: { soulPower: 1, beastYears: 25 } }
    ],
    godrealm: [
      { text: '你在神界森林中吸收神性精华，本源之力变得更加纯粹。', rewards: { soulPower: 2, beastYears: 50 } },
      { text: '你吞噬了一只叛逆神兽的神性本源，修为大增。', rewards: { soulPower: 2, beastYears: 60 } },
      { text: '你在神界天河中洗涤肉身，去除了体内的杂质。', rewards: { soulPower: 1, beastYears: 40 } },
      { text: '你观摩了神界法则的运转，对天地大道有了新的感悟。', rewards: { soulPower: 2, beastYears: 50 } },
      { text: '你在神兽领域边缘感悟神兽本源，血脉之力沸腾。', rewards: { soulPower: 2, beastYears: 55 } },
      { text: '平静的一年，你在神界隐秘角落中安心修炼。', rewards: { soulPower: 1, beastYears: 35 } }
    ],
    default: [
      { text: '你闭关苦修，感悟天地之力。', rewards: { soulPower: 1, beastYears: 18 } },
      { text: '你在森林中吸收日月精华，修为稳步增长。', rewards: { soulPower: 1, beastYears: 25 } },
      { text: '平静的一年，你安心修炼，无惊无险。', rewards: { soulPower: 1, beastYears: 18 } }
    ]
  },
  divine_beast: {
    godrealm: [
      { text: '你在神界天河中沐浴，神性精华浸润全身，神力大增。', rewards: { soulPower: 2 } },
      { text: '你观摩神界法则流转，对天地大道有了新的感悟。', rewards: { soulPower: 2 } },
      { text: '你在神兽领域与其他神兽切磋，磨练了本能。', rewards: { soulPower: 1 } },
      { text: '你吞噬了一缕散落的神性本源，神力更加凝实。', rewards: { soulPower: 2 } },
      { text: '你在神界古树下修炼，吸收远古神力。', rewards: { soulPower: 1 } },
      { text: '你感悟了血脉深处的远古记忆，神力觉醒。', rewards: { soulPower: 2 } },
      { text: '你在神界灵山之巅吐纳，云雾化作神力涌入体内。', rewards: { soulPower: 1 } },
      { text: '平静的一年，你在神界隐秘之地安心修炼。', rewards: { soulPower: 1 } }
    ],
    default: [
      { text: '你在神域之中安心修炼，神力稳步增长。', rewards: { soulPower: 1 } }
    ]
  },
  god: {
    godrealm: [
      { text: '你在神殿中冥想，神格更加凝实，神力提升。', rewards: { soulPower: 2 } },
      { text: '你观摩神界委员会的法则会议，对神道有了新的领悟。', rewards: { soulPower: 2 } },
      { text: '你巡视所掌管的领域，神力在职责中精进。', rewards: { soulPower: 1 } },
      { text: '你与其他神祇论道，交流修炼心得。', rewards: { soulPower: 1 } },
      { text: '你感悟了远古神祇遗留的修炼印记，神力大涨。', rewards: { soulPower: 2 } },
      { text: '你在神界天河畔修炼，天河之力助你凝练神格。', rewards: { soulPower: 1 } },
      { text: '你参悟了一件远古神器的使用之法，神力有所提升。', rewards: { soulPower: 2 } },
      { text: '平静的一年，你在神殿中安心修炼。', rewards: { soulPower: 1 } }
    ],
    default: [
      { text: '你在神界法则之下静修，神力缓慢凝实。', rewards: { soulPower: 1 } }
    ]
  },
  human: {
    douluo1: [
      { text: '你在瀑布下苦修，如当年唐三修炼玄天功一般，肉体与精神同步提升。', rewards: { soulPower: 2 } },
      { text: '你进入猎魂森林历练，与低阶魂兽交手，实战经验大增。', rewards: { soulPower: 1 } },
      { text: '你在宗门藏经阁读到上古暗器图谱，虽不能制作但开阔了眼界。', rewards: { soulPower: 1 } },
      { text: '你参加了一场魂师友谊赛，在切磋中发现了自己武魂的新用法。', rewards: { soulPower: 2 } },
      { text: '你跟随师长前往星斗大森林外围，远远感受到了十万年魂兽的恐怖气息。', rewards: { soulPower: 1 } },
      { text: '你在索托城的大斗魂场观战，被魂师们的热血战斗所感染。', rewards: { soulPower: 1 } }
    ],
    douluo2: [
      { text: '你在海神湖畔冥想，黄金树的力量潜移默化地滋养着你的武魂。', rewards: { soulPower: 1 } },
      { text: '你研究了一件一级魂导器的构造，对魂导科技的理解更深了一层。', rewards: { soulPower: 1 } },
      { text: '你尝试用精神探测感知周围环境，精神力如同霍雨浩那般缓慢增长。', rewards: { soulPower: 2 } },
      { text: '你在史莱克学院的训练场上挥洒汗水，外院弟子的日常就是如此充实。', rewards: { soulPower: 1 } },
      { text: '你阅读了唐门暗器与魂导器结合的论文，对两个时代的融合有了新的认识。', rewards: { soulPower: 1 } },
      { text: '你参与了一场模拟魂导对抗赛，体验了日月帝国魂导师的战斗方式。', rewards: { soulPower: 2 } }
    ],
    douluo3: [
      { text: '你在锻造台上挥汗如雨，千锻一品的目标让你不断突破自我。', rewards: { soulPower: 1 } },
      { text: '你在升灵台中进行虚拟实战，魂灵在战斗中成长，你的操作也更加娴熟。', rewards: { soulPower: 2 } },
      { text: '你研究了一块有灵合金的配方，斗铠制作的道路漫长但充满诱惑。', rewards: { soulPower: 1 } },
      { text: '你在史莱克学院的图书馆查阅万年前的史料，对比今昔感慨万千。', rewards: { soulPower: 1 } },
      { text: '你尝试将血脉之力与魂技融合，如同唐舞麟那般寻找属于自己的战斗方式。', rewards: { soulPower: 2 } },
      { text: '你在传灵塔参观魂灵培育中心，看到濒临灭绝的魂兽被悉心照料。', rewards: { soulPower: 1 } }
    ],
    douluo4: [
      { text: '你在精灵星的原始森林中冥想，外星球的能量与斗罗星截然不同。', rewards: { soulPower: 1 } },
      { text: '你驾驶小型宇宙飞船进行了一次短途航行，星际时代的魂师需要掌握的技能真多。', rewards: { soulPower: 1 } },
      { text: '你在天龙星的龙族遗迹中修炼，龙神血脉的气息让你修炼速度有所提升。', rewards: { soulPower: 2 } },
      { text: '你参加了一场星际魂师对抗赛，见识了来自不同星球的魂师强者。', rewards: { soulPower: 1 } },
      { text: '你学习了古武与魂技结合的新流派，娜娜老师的理论让你受益匪浅。', rewards: { soulPower: 2 } },
      { text: '你在龙源星猎杀了一只小型龙族生物，获取了珍贵的龙力结晶。', rewards: { soulPower: 1 } }
    ],
    godrealm: [
      { text: '你在神界法则之下修炼，神力与魂力截然不同，需要重新适应。', rewards: { soulPower: 2 } },
      { text: '你观摩了神界中枢的运转，对宇宙法则有了更深层次的感悟。', rewards: { soulPower: 2 } },
      { text: '你在神界森林中狩猎神兽，这里的“魂兽”都散发着神性的光辉。', rewards: { soulPower: 1 } },
      { text: '你参加了一场神祇之间的论道，虽然只是旁听但收获颇丰。', rewards: { soulPower: 1 } },
      { text: '你在神界天河中洗涤肉身，神力的杂质被一一清除。', rewards: { soulPower: 2 } },
      { text: '你尝试凝聚神位，虽然失败但为未来的突破积累了经验。', rewards: { soulPower: 1 } }
    ],
    default: [
      { text: '你闭关苦修，感悟天地之力。', rewards: { soulPower: 1 } },
      { text: '你在宗门藏经阁阅读典籍，有所感悟。', rewards: { soulPower: 1 } },
      { text: '平静的一年，你安心修炼，无惊无险。', rewards: { soulPower: 1 } }
    ]
  }
};

// ============================================================
// EVENT POOLS
// ============================================================
const EVENTS = {
  cultivate: [
    { text: '闭关修炼一年，魂力稳步提升。', type: 'cultivate', effect: s => { let g = 1 + Math.floor(Math.random() * 2); if (s.innatePower >= 10) g += 1; s.soulPower = Math.min(s.soulPower + g, s.maxLevel); s.events.push(`魂力+${g}级`); return `魂力+${g}级`; } },
    { text: '获得珍贵修炼资源，修炼速度大幅提升！', type: 'cultivate', effect: s => { let g = 3 + Math.floor(Math.random() * 3); s.soulPower = Math.min(s.soulPower + g, s.maxLevel); return `魂力+${g}级！`; } },
    {
      text: '修炼遇到瓶颈，尝试突破中...', type: 'cultivate', choices: [
        { text: '全力突破', effect: s => { if (Math.random() < 0.4) { s.soulPower = Math.min(s.soulPower + 5, s.maxLevel); return '突破成功！魂力+5级！'; } else { s.soulPower = Math.max(s.soulPower - 1, 1); return '突破失败，魂力-1级。'; } } },
        { text: '稳扎稳打', effect: s => { s.soulPower = Math.min(s.soulPower + 1, s.maxLevel); return '稳扎稳打，魂力+1级。'; } }
      ]
    },
    { text: '自创魂技的灵感涌现。', type: 'cultivate', condition: s => s.soulPower >= 51, effect: s => { if (Math.random() < 0.15) { let names = ['破灭之刃', '天罡护盾', '幻影步', '雷霆万钧', '冰封万里', '灵魂震荡', '星辰坠落']; s.customSkills.push(names[Math.floor(Math.random() * names.length)]); return `成功自创魂技！`; } return '灵光一闪但未能成形。'; } },
    { text: '斗铠锻造取得进展。', type: 'cultivate', condition: s => ['douluo3', 'douluo4'].includes(s.timeline?.id), effect: s => { let cur = s.battleArmor || 0; let newLv = cur + 1; if (Math.random() < 0.5 && newLv <= 4) { s.battleArmor = newLv; let names = ['', '一字', '二字', '三字', '四字', '五字', '六字']; return `${names[newLv]}斗铠锻造成功！`; } return '锻造未能取得突破。'; } }
  ],
  social: [
    { text: '在旅途中结识了一位志同道合的伙伴。', type: 'social', effect: s => { let companions = ['热血少年', '冷静谋士', '活泼少女', '神秘老者', '豪爽战士']; s.companions.push(companions[Math.floor(Math.random() * companions.length)]); return '结识了新伙伴！'; } },
    {
      text: '一位前辈看中了你的天赋，愿意收你为徒。', type: 'social', choices: [
        { text: '拜师学艺', effect: s => { s.hasMaster = true; s.masterBonus = true; return '拜入名师门下，修炼速度大幅提升！后续修炼事件效果翻倍。'; } },
        { text: '婉言谢绝', effect: s => { return '婉言谢绝，继续独自修炼。'; } }
      ]
    },
    { text: '命运的邂逅——你遇到了一位令人心动的人...', type: 'social', condition: s => !s.hasSpouse && s.age >= 18 && (s.soulPower || 0) >= 40, wheel: 'lover' },
    {
      text: '所属势力发生了内部争斗，你需要选择立场。', type: 'social', condition: s => s.faction, choices: [
        { text: '支持现任掌权者', effect: s => { if (Math.random() < 0.5) { s.factionReputation = (s.factionReputation || 0) + 10; return '选择正确，在势力中声望大增！'; } else { s.faction = ''; return '站错队，被驱逐出势力。'; } } },
        { text: '支持挑战者', effect: s => { if (Math.random() < 0.3) { s.factionReputation = (s.factionReputation || 0) + 15; return '挑战者胜出，你成为新势力核心成员！'; } else { s.faction = ''; return '挑战者失败，你受到牵连。'; } } },
        { text: '保持中立', effect: s => { return '明哲保身，静观其变。'; } }
      ]
    },
    {
      text: '宗门之间提议联姻。', type: 'social', condition: s => s.faction && s.age >= 18 && s.age <= 40, choices: [
        { text: '接受联姻', effect: s => { s.hasSpouse = true; s.factionReputation = (s.factionReputation || 0) + 5; return '联姻成功，两大势力关系更加紧密。'; } },
        { text: '拒绝联姻', effect: s => { return '拒绝了联姻提议，保持自由身。'; } }
      ]
    }
  ],
  battle: [
    {
      text: '全大陆高级魂师大赛开始了！', type: 'battle', condition: s => s.age >= 12 && s.age <= 25, choices: [
        { text: '全力参赛', effect: s => { if (s.soulPower >= 30 && Math.random() < 0.3) { s.achievementsEarned = s.achievementsEarned || []; s.achievementsEarned.push('champion'); s.soulPower = Math.min(s.soulPower + 3, s.maxLevel); return '一路过关斩将，夺得大赛冠军！名震大陆！'; } else if (Math.random() < 0.5) { s.soulPower = Math.min(s.soulPower + 1, s.maxLevel); return '表现不错，但未能夺冠，获得了一些经验和资源。'; } else { return '遗憾落败，但积累了宝贵的战斗经验。'; } } },
        { text: '观赛学习', effect: s => { s.soulPower = Math.min(s.soulPower + 1, s.maxLevel); return '在观众席观摩高手对决，有所感悟，魂力+1级。'; } }
      ]
    },
    { text: '宿命的对决——一位强敌挡在了你的面前！', type: 'battle', condition: s => s.age >= 15, wheel: 'enemy' },
    {
      text: '在野外遭遇强敌袭击！', type: 'battle', choices: [
        { text: '迎头痛击', effect: s => { if (Math.random() < 0.5) { s.soulPower = Math.min(s.soulPower + 2, s.maxLevel); return '成功击退强敌，实力有所提升！'; } else { if (Math.random() < 0.2) { s.alive = false; return '不敌强敌，命陨当场...'; } return '战斗失败但侥幸逃脱，身受重伤。'; } } },
        { text: '撤退逃跑', effect: s => { if (Math.random() < 0.7) { return '成功逃离，虽然狼狈但保住了性命。'; } else { return '逃跑失败，被追上痛殴一顿，但保住了命。'; } } }
      ]
    },
    {
      text: '两大帝国之间爆发了战争！', type: 'battle', choices: [
        { text: '投身战场', effect: s => { if (Math.random() < 0.4) { s.soulPower = Math.min(s.soulPower + 3, s.maxLevel); s.merit = (s.merit || 0) + 10; return '在战场上大放异彩，立下赫赫战功！'; } else { if (Math.random() < 0.25) { s.alive = false; return '战场上刀剑无眼，你倒在了冲锋的路上...'; } return '战争中九死一生，侥幸存活。'; } } },
        { text: '远离战火', effect: s => { return '选择避开战场，在后方安静修炼。'; } }
      ]
    },
    { text: '在斗魂场接受挑战。', type: 'battle', effect: s => { if (Math.random() < 0.6) { s.soulPower = Math.min(s.soulPower + 1, s.maxLevel); s.gold = (s.gold || 0) + 100; return '斗魂胜利！获得100金魂币和声望。'; } else { return '斗魂失败，但积累了经验。'; } } }
  ],
  fortune: [
    { text: '在深山中发现了稀世仙草！', type: 'fortune', effect: s => { let herbs = ['八角玄冰草', '望穿秋水露', '绮罗郁金香', '蓝银皇草', '鸡冠凤凰葵', '海神之光碎片']; let herb = herbs[Math.floor(Math.random() * herbs.length)]; s.soulPower = Math.min(s.soulPower + 3, s.maxLevel); return `获得仙草「${herb}」，魂力+3级！`; } },
    {
      text: '偶然发现了一处远古遗迹！', type: 'fortune', choices: [
        { text: '深入探索', effect: s => { if (Math.random() < 0.4) { s.soulPower = Math.min(s.soulPower + 5, s.maxLevel); s.keyEvents = s.keyEvents || []; s.keyEvents.push('发现远古遗迹'); return '在遗迹中获得了一位远古强者的传承！魂力+5级！'; } else if (Math.random() < 0.5) { return '遗迹中机关重重，虽然受伤但找到了一些宝物。'; } else { s.alive = false; return '触发了遗迹的终极禁制，命丧于此...'; } } },
        { text: '标记位置后离开', effect: s => { return '谨慎起见，标记后离开，日后再来。'; } }
      ]
    },
    {
      text: '武魂在特殊环境下发生了变异！', type: 'fortune', choices: [
        { text: '引导变异', effect: s => { if (Math.random() < 0.5) { s.martialSoul = { ...s.martialSoul, quality: '顶级', qColor: '#ffdd44' }; return '武魂正向变异！品质提升为顶级！'; } else { return '变异失控，武魂品质下降...'; } } },
        { text: '压制变异', effect: s => { return '强行压制了变异，武魂保持不变。'; } }
      ]
    },
    { text: '体内沉睡的血脉被激活了！', type: 'fortune', effect: s => { let bloodlines = ['龙神血脉', '天使血脉', '海神血脉', '修罗血脉', '生命女神血脉']; let bl = bloodlines[Math.floor(Math.random() * bloodlines.length)]; s.bloodline = bl; s.soulPower = Math.min(s.soulPower + 5, s.maxLevel); return `觉醒了「${bl}」！魂力+5级，潜力大幅提升！`; } },
    {
      text: '天空出现了异界裂缝！', type: 'fortune', effect: s => {
        if (Math.random() < 0.15) { let cs = CROSS_SKILLS[Math.floor(Math.random() * CROSS_SKILLS.length)]; let skill = cs.skills[Math.floor(Math.random() * cs.skills.length)]; s.crossSkills = s.crossSkills || []; s.crossSkills.push({ source: cs.source, skill: skill, effect: cs.effect, color: cs.color }); return `穿越异界裂缝！获得「${cs.source}」技能——${skill}！`; }
        return '异界裂缝一闪而过，你来不及做出反应。';
      }
    },
    { text: '神级传承的气息从天而降！', type: 'fortune', condition: s => s.soulPower >= 80, effect: s => { if (Math.random() < 0.3) { s.soulPower = Math.min(s.soulPower + 10, s.maxLevel); s.keyEvents = s.keyEvents || []; s.keyEvents.push('获得神级传承'); return '成功接受神级传承！魂力+10级！'; } return '传承的气息太过强大，你无力承受。'; } }
  ],
  crisis: [
    {
      text: '遭遇了远超自身实力的强敌！', type: 'crisis', choices: [
        { text: '拼死一战', effect: s => { if (Math.random() < 0.2) { s.soulPower = Math.min(s.soulPower + 5, s.maxLevel); return '绝境中爆发，反杀强敌！魂力+5级！'; } else { s.alive = false; return '实力差距太大，命陨当场...'; } } },
        { text: '请求援军', effect: s => { if (s.companions.length > 0 || s.faction) { return '在同伴/势力的帮助下脱离险境。'; } else { return '孤立无援，只能独自面对...'; } } },
        { text: '献宝求饶', effect: s => { if (s.gold >= 100) { s.gold -= 100; return '献出珍贵物品，换回一条命。'; } else { s.alive = false; return '身无分文，无路可退...'; } } }
      ]
    },
    {
      text: '修炼时走火入魔！', type: 'crisis', choices: [
        { text: '强行压制', effect: s => { if (Math.random() < 0.5) { return '凭借意志力强行压制了暴走的魂力。'; } else { s.soulPower = Math.max(s.soulPower - 5, 1); return '压制失败，魂力倒退5级...'; } } },
        { text: '停止修炼疗伤', effect: s => { return '及时停止修炼，花了一年时间疗伤恢复。'; } }
      ]
    },
    {
      text: '所属势力遭到了攻击！', type: 'crisis', condition: s => s.faction, choices: [
        { text: '誓死守护', effect: s => { if (Math.random() < 0.5) { s.factionReputation = (s.factionReputation || 0) + 20; return '在保卫战中英勇作战，声望大增！'; } else { s.faction = ''; if (Math.random() < 0.2) s.alive = false; return '势力覆灭，你被迫流亡...'; } } },
        { text: '及时撤离', effect: s => { s.faction = ''; return '提前撤离，保住了性命，但失去了势力庇护。'; } }
      ]
    },
    { text: '天劫降临！', type: 'crisis', condition: s => s.identityType === 'soul_beast', effect: s => { if (Math.random() < 0.4) { s.soulPower = Math.min(s.soulPower + 5, s.maxLevel); return '成功渡劫！魂力+5级，实力暴涨！'; } else { s.alive = false; return '天劫太过强大，魂飞魄散...'; } } },
    {
      text: '被全大陆通缉！', type: 'crisis', choices: [
        { text: '洗清冤屈', effect: s => { if (Math.random() < 0.4) { return '经过努力，终于洗清了冤屈。'; } else { return '洗冤失败，只能继续逃亡。'; } } },
        { text: '隐姓埋名', effect: s => { s.faction = ''; return '隐姓埋名，在偏远之地重新开始。'; } }
      ]
    }
  ]
};

// Soul beast events
const BEAST_EVENTS = [
  { text: '在森林深处找到了一处灵气充裕的栖息地。', type: 'cultivate', effect: s => { s.soulPower = Math.min(s.soulPower + 3, s.maxLevel); return '灵气充裕，修炼加速！魂力+3级。'; } },
  {
    text: '遭遇猎魂师的追杀！', type: 'crisis', choices: [
      { text: '正面迎战', effect: s => { if (Math.random() < 0.4) { s.soulPower = Math.min(s.soulPower + 2, s.maxLevel); return '击退猎魂师，吸收对方魂力！'; } else { s.alive = false; return '不敌猎魂师，命丧黄泉...'; } } },
      { text: '逃入深林', effect: s => { return '凭借对地形的熟悉成功逃脱。'; } }
    ]
  },
  { text: '觉醒了一项血脉技能！', type: 'fortune', effect: s => { let skills = ['暗影突袭', '雷霆之怒', '冰封领域', '烈焰风暴', '精神冲击', '龙息']; s.bloodlineSkills = s.bloodlineSkills || []; s.bloodlineSkills.push(skills[Math.floor(Math.random() * skills.length)]); return '血脉觉醒，获得新技能！'; } },
  { text: '天劫即将降临，必须突破年限！', type: 'crisis', effect: s => { if (Math.random() < 0.5) { s.soulPower = Math.min(s.soulPower + 5, s.maxLevel); return '成功渡劫！实力大增！'; } else { s.alive = false; return '天劫失败，魂飞魄散...'; } } },
  {
    text: '十万年大关已到，可以选择化形。', type: 'fortune', condition: s => s.beastYears >= 100000 && s.identityType === 'soul_beast' && !s.transformed, choices: [
      {
        text: '化形为人', effect: s => {
          s.transformed = true;
          s.transformedBeastYears = s.beastYears;
          s.identityType = 'human';
          s.age = 6;
          // 根据原魂兽年限决定化形后武魂品质与先天魂力
          let years = s.transformedBeastYears;
          let quality, qColor, innatePower, innateRating, innateRatingColor, bonusText;
          if (years >= 1000000) {
            quality = '双生'; qColor = '#ff4444'; innatePower = 15;
            innateRating = '神级先天魂力'; innateRatingColor = '#ff4444';
            bonusText = '百万年本源觉醒双生武魂，神级天赋震撼天地';
          } else if (years >= 200000) {
            quality = '顶级+'; qColor = '#ff8800'; innatePower = 12;
            innateRating = '超凡先天魂力'; innateRatingColor = '#ff8800';
            bonusText = '二十万年本源凝练，超凡天赋冠绝同辈';
          } else {
            quality = '顶级'; qColor = '#ffdd44'; innatePower = 10;
            innateRating = '先天满魂力'; innateRatingColor = '#ffdd44';
            bonusText = '十万年本源觉醒，先天满魂力';
          }
          s.innatePower = innatePower;
          s.innateRating = innateRating;
          s.innateRatingColor = innateRatingColor;
          s.soulPower = Math.min(s.soulPower + innatePower, s.maxLevel);
          // 基于原魂兽生成武魂
          let beastName = s.identity?.name?.replace(/（.*）/, '') || s.identity?.name || '未知';
          // 根据血脉属性自动决定武魂类型
          let bloodlineAttrs = s.bloodline?.attr || {};
          let soulType = '强攻系';
          if (bloodlineAttrs.control >= 1.3) soulType = '控制系';
          else if (bloodlineAttrs.heal >= 1.3) soulType = '辅助系';
          else if (bloodlineAttrs.defense >= 1.3) soulType = '防御系';
          else if (bloodlineAttrs.speed >= 1.3) soulType = '敏攻系';
          else soulType = '强攻系';
          // 保留血脉技能并转化为武魂基础魂技
          let baseSkills = [];
          if (Array.isArray(s.bloodlineSkills) && s.bloodlineSkills.length > 0) {
            s.bloodlineSkills.forEach(skillName => {
              let sType = 'attack';
              if (skillName.includes('冰封') || skillName.includes('束缚') || skillName.includes('精神')) sType = 'control';
              else if (skillName.includes('盾') || skillName.includes('防御')) sType = 'defense';
              else if (skillName.includes('增幅') || skillName.includes('真身')) sType = 'boost';
              baseSkills.push({
                name: skillName + '（血脉传承）',
                type: sType,
                desc: skillName + '：源自血脉的传承之力，化形后仍可发挥原本的魂兽本能。'
              });
            });
          }
          s.martialSoul = {
            name: beastName, type: soulType, quality: quality, qColor: qColor,
            example: beastName, rings: [], skills: baseSkills, _baseName: beastName, evolutionStage: 0
          };
          s.soulRings = s.martialSoul.rings;
          // 保留血脉作为天赋属性加成（不清除 s.bloodline）
          let bloodlineName = s.bloodline?.name || '未知';
          return '成功化形为人类！' + bonusText + '，觉醒' + quality + '武魂「' + beastName + '」（' + soulType + '），获得' + innatePower + '级' + innateRating + '，以6岁孩童之姿开启全新修炼之路！血脉之力仍存，可发挥' + bloodlineName + '血脉特性。（原魂兽修为：' + formatYears(s.transformedBeastYears) + '）';
        }
      },
      {
        text: '保持兽身', effect: s => {
          let bonus = s.beastYears >= 1000000 ? 30000 : (s.beastYears >= 200000 ? 20000 : 10000);
          s.soulPower = Math.min(s.soulPower + 8, s.maxLevel);
          s.beastYears += bonus;
          return '选择保持魂兽之身继续修炼，年限+' + formatYears(bonus) + '，实力更上一层楼。未来仍可选择化形，且年限越高化形后天赋越强！';
        }
      }
    ]
  },
  // 新增：修炼瓶颈事件（魂兽专属，鼓励冲刺高年限）
  {
    text: '感受到修为即将突破，闭关冲击年限！', type: 'fortune', condition: s => s.identityType === 'soul_beast' && !s.transformed && s.beastYears >= 10000 && s.beastYears < 100000, choices: [
      {
        text: '冲击十万年大关', effect: s => {
          if (Math.random() < 0.6) {
            s.beastYears += 50000;
            syncBeastSoulPower();
            return '突破成功！年限大涨五万年，距离十万年化形更近一步！';
          } else {
            s.beastYears += 10000;
            syncBeastSoulPower();
            return '冲击未完全成功，但修为仍增长了一万年。';
          }
        }
      },
      {
        text: '稳扎稳打修炼', effect: s => {
          s.beastYears += 8000;
          syncBeastSoulPower();
          return '稳步修炼，年限+八千年，根基更加稳固。';
        }
      }
    ]
  },
  // 新增：血脉觉醒事件（基于血脉系触发）
  {
    text: '血脉之力涌动，潜藏的能力即将觉醒！', type: 'fortune', condition: s => s.identityType === 'soul_beast' && !s.transformed && s.beastYears >= 50000, effect: s => {
      s.bloodlineSkills = s.bloodlineSkills || [];
      let bloodlineId = s.bloodline?.id || 'fire';
      let skillsByBlood = {
        fire: ['烈焰焚天', '凤凰涅槃', '三昧真火'],
        ice: ['绝对零度', '极寒领域', '九幽寒冰'],
        thunder: ['雷霆万钧', '紫电狂雷', '雷神之怒'],
        wind: ['疾风骤雨', '龙卷风暴', '灭世风刃'],
        earth: ['大地之盾', '山崩地裂', '大地之怒'],
        water: ['深海领域', '沧海横流', '碧波万顷'],
        wood: ['生命祝福', '生生不息', '荆棘缠绕'],
        dark: ['暗影潜行', '黑暗天幕', '永夜降临'],
        light: ['圣光审判', '神圣冲击', '天照'],
        poison: ['万毒噬心', '碧磷蛇毒', '十香软筋散'],
        spirit: ['精神幻境', '精神控制', '灵魂碾压'],
        dragon: ['龙息', '龙吟九天', '逆鳞之怒'],
        space: ['空间禁锢', '空间撕裂', '虚空之刃'],
        time: ['时间凝滞', '因果逆转', '时光回溯'],
        devour: ['吞噬领域', '万物归虚', '深渊之口']
      };
      let pool = skillsByBlood[bloodlineId] || skillsByBlood.fire;
      let newSkill = pool[Math.floor(Math.random() * pool.length)];
      if (s.bloodlineSkills.includes(newSkill)) {
        return '血脉涌动，但已有该技能，力量反而更加精纯。魂力+5级。';
      }
      s.bloodlineSkills.push(newSkill);
      s.soulPower = Math.min(s.soulPower + 3, s.maxLevel);
      return '血脉觉醒，获得新技能「' + newSkill + '」！该技能将在化形后转化为武魂基础魂技。';
    }
  },
  // 新增：天材地宝事件
  {
    text: '在领地中发现了一处天材地宝！', type: 'fortune', condition: s => s.identityType === 'soul_beast' && !s.transformed, effect: s => {
      let bonus = Math.floor(s.beastYears * 0.1) + 5000;
      s.beastYears += bonus;
      syncBeastSoulPower();
      return '发现天材地宝，吞噬后年限+' + formatYears(bonus) + '，修为大涨！';
    }
  }
];

// ============================================================
// SOUL RING SKILL GENERATION
// ============================================================
const SKILL_TEMPLATES = {
  attack: [
    { prefix: '雷', skills: ['雷鸣', '雷霆万钧', '紫电狂雷', '天雷斩', '万雷天牢引', '雷神之怒'] },
    { prefix: '火', skills: ['烈焰冲击', '炎爆术', '焚天烈焰', '凤凰涅槃', '三昧真火', '天火燎原'] },
    { prefix: '冰', skills: ['寒冰箭', '冰封千里', '绝对零度', '极寒领域', '冰天雪女', '九幽寒冰'] },
    { prefix: '风', skills: ['风刃', '疾风骤雨', '龙卷风暴', '天罡风', '裂空斩', '灭世风刃'] },
    { prefix: '暗', skills: ['暗影突袭', '暗影潜行', '黑暗天幕', '修罗暗影', '吞噬之暗', '永夜降临'] },
    { prefix: '光', skills: ['圣光审判', '光明之火', '神圣冲击', '圣光壁垒', '天照', '神圣毁灭'] },
    { prefix: '金', skills: ['金刃斩', '金刚不坏', '万剑归宗', '剑气纵横', '破灭之刃', '天罡剑阵'] },
    { prefix: '水', skills: ['水龙弹', '海浪冲击', '怒海狂涛', '碧波万顷', '深海领域', '沧海横流'] },
    { prefix: '土', skills: ['岩石崩裂', '大地之盾', '山崩地裂', '地裂天崩', '厚土之力', '大地之怒'] },
    { prefix: '毒', skills: ['毒雾弥漫', '剧毒侵蚀', '万毒噬心', '碧磷蛇毒', '十香软筋散', '天下第一毒'] }
  ],
  defense: [
    { prefix: '防御', skills: ['铁壁', '金刚盾', '不动明王', '绝对防御', '圣光护盾', '神之庇护'] },
    { prefix: '恢复', skills: ['生命之光', '治愈之泉', '生命祝福', '起死回生', '生命女神的恩赐', '不死之身'] }
  ],
  control: [
    { prefix: '精神', skills: ['精神干扰', '精神冲击', '灵魂震慑', '精神幻境', '精神控制', '灵魂碾压'] },
    { prefix: '束缚', skills: ['缠绕', '蛛网束缚', '定身术', '空间禁锢', '天地锁', '万法归一'] }
  ],
  boost: [
    { prefix: '增幅', skills: ['力量增幅', '速度倍增', '全属性提升', '战意高昂', '武魂真身', '九宝无敌神光'] }
  ]
};

function generateRingSkills(ringNum, years, martialSoul) {
  // 7th ring is always Wu Hun Zhen Shen (Martial Soul True Body)
  if (ringNum === 7) {
    let soulName = martialSoul?.name || '武魂';
    return [{ name: '武魂真身', type: 'boost', desc: `第七魂技·武魂真身。将${soulName}发挥到极致，全属性大幅提升，是封号斗罗的标志性能力。` }];
  }

  let skillCount = 1;
  // 100k+ years: guarantee 2 skills + 1 bone
  // 1m+ years: guarantee 4 skills
  if (years >= 1000000) skillCount = 4;
  else if (years >= 100000) skillCount = 2;

  let skills = [];
  let usedTypes = new Set();
  // Determine skill types based on martial soul
  let isWeapon = martialSoul?.type === '器武魂';
  let isBeast = martialSoul?.type === '兽武魂';

  for (let i = 0; i < skillCount; i++) {
    let type, pool;
    if (i === 0) {
      // First skill always matches soul type
      type = isWeapon ? 'attack' : (isBeast ? 'attack' : 'attack');
    } else if (i === 1) {
      // Second: defense or control
      type = Math.random() < 0.5 ? 'defense' : 'control';
    } else if (i === 2) {
      // Third: boost or another attack
      type = Math.random() < 0.6 ? 'boost' : 'attack';
    } else {
      // Fourth: rare type
      type = ['attack', 'defense', 'control', 'boost'][Math.floor(Math.random() * 4)];
    }
    pool = SKILL_TEMPLATES[type] || SKILL_TEMPLATES.attack;
    // Pick a random template from the pool
    let template = pool[Math.floor(Math.random() * pool.length)];
    if (!template || !template.skills) {
      skills.push({ name: `第${ringNum}魂技`, type: type, desc: `第${ringNum}魂技，${quality}魂兽之力凝聚的${type}技能。` });
      continue;
    }
    let skillName = template.skills[Math.floor(Math.random() * template.skills.length)];
    // Add ring number prefix for flavor
    let finalName = skillName;
    if (years >= 100000) {
      finalName += '（十万年魂技）';
    }
    if (years >= 1000000) {
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

function generateSkillDesc(name, type, ringNum, years) {
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
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================
// SOUL RING LEVEL MILESTONES
// ============================================================
const RING_MILESTONES = [10, 20, 30, 40, 50, 60, 70, 80, 90]; // 9 rings at levels 10,20,...,90

// ============================================================
// YEAR EVENT WHEEL SYSTEM
// ============================================================
const YEAR_EVENT_WHEEL = [
  { id: 'normal', name: '普通修炼', weight: 12, color: '#44aa66', desc: '闭关苦修，感悟天地之力，实力稳步提升。', eventType: 'normal' },
  { id: 'school', name: '学院修炼', weight: 15, color: '#4488ff', desc: '在学院中刻苦学习，与同学切磋交流，实力稳步提升。', eventType: 'school', condition: (g) => g.identityType !== 'soul_beast' && g.timeline?.soulRingMode !== 'divine' && (g.age >= 6 && g.age <= 25) },
  { id: 'partner', name: '伴侣共修', weight: 12, color: '#ff66aa', desc: '与道侣共同修炼，两人相辅相成，魂力精进。', eventType: 'partner', condition: (g) => g.hasSpouse === true },
  { id: 'enemy', name: '强敌来袭', nameOverride: { godrealm: '神界动乱' }, weight: 8, color: '#ff4444', desc: '宿命的对决——一位强敌挡在了你的面前！', eventType: 'enemy', subWheel: 'enemy', condition: (g) => (g.soulPower || 0) >= 10 && g.age >= 18 },
  { id: 'justice', name: '路见不平', weight: 12, color: '#44ddff', desc: '路见不平，拔刀相助！你的选择将改变命运。', eventType: 'justice', condition: (g) => g.age >= 18 && (g.soulPower || 0) >= 30 && (g.soulPower || 0) < 70 },
  { id: 'auction', name: '拍卖会', weight: 10, color: '#ffdd44', desc: '拍卖会上宝物云集，你能否拍得心仪之物？', eventType: 'auction', condition: (g) => (g.gold || 0) >= 50 },
  { id: 'fortune', name: '天赐机遇', weight: 18, color: '#aa66ff', desc: '天赐机缘，奇遇连连，命运的馈赠悄然降临。', eventType: 'fortune' },
  { id: 'timeline', name: '时间线奇缘', weight: 8, color: '#ff8800', desc: '命运的丝线将你与某位原著角色交织在一起...', eventType: 'timeline', subWheel: 'timeline' },
  { id: 'reroll', name: '再来一次', weight: 5, color: '#00ff88', desc: '命运的齿轮再次转动，你将获得一次重新选择的机会！', eventType: 'reroll' }
];

// School/Academy events per timeline
const SCHOOL_EVENTS = {
  douluo1: {
    name: '史莱克学院',
    desc: '弗兰德院长在索托城创办的怪物学院，只招收真正的天才，口号是"只收怪物不收普通人"。',
    events: [
      { text: '弗兰德院长亲自对你进行魔鬼训练，负重跑、瀑布下冥想，你的身体极限被不断突破。', rewards: { soulPower: 2 } },
      { text: '大师玉小刚的理论课让你茅塞顿开——原来武魂之间还有如此精妙的配合之道！', rewards: { soulPower: 3 } },
      { text: '柳二龙副院长带你去星斗大森林外围猎杀魂兽，实战经验大幅提升。', rewards: { soulPower: 2, merit: 3 } },
      { text: '你与史莱克七怪进行团队对战演练，唐三的战术指挥让你受益匪浅。', rewards: { soulPower: 1, merit: 5 } },
      { text: '学院食堂的大香肠让你永生难忘——虽然味道奇怪但恢复效果惊人。', rewards: { gold: 10 }, resultText: '获得10金魂币' },
      { text: '赵无极老师亲自测试你的实力，在不动明王的威压下你的战斗意志更加坚定。', rewards: { soulPower: 2 } }
    ]
  },
  douluo2: {
    name: '史莱克学院',
    desc: '大陆第一学院，外院与内院并存，汇聚天下英才。海神阁是学院最高权力机构。',
    events: [
      { text: '周漪老师的新生考核异常严格，你在高压下突破了自身极限。', rewards: { soulPower: 2 } },
      { text: '帆羽老师带你进入魂导系实验室，你第一次亲手制作出一件一级魂导器。', rewards: { gold: 15 }, minBattleArmor: 1, resultText: '掌握魂导基础，获得15金魂币' },
      { text: '你成功考入史莱克内院，言少哲院长亲自为你颁发内院徽章。', rewards: { soulPower: 3, merit: 8 } },
      { text: '穆老在黄金树下的授课让你对光明与生命有了新的感悟。', rewards: { soulPower: 2 } },
      { text: '玄老带你执行监察团任务，铲除邪魂师的行动让你明白强者的责任。', rewards: { soulPower: 2, merit: 6 } },
      { text: '你在海神湖畔冥想，黄金树的力量洗涤你的心灵。', rewards: { soulPower: 1 } }
    ]
  },
  douluo3: {
    name: '史莱克学院',
    desc: '斗罗大陆最顶尖的魂师学院。在魂兽濒临灭绝的时代，传灵塔与学院共同培养新一代魂师。',
    events: [
      { text: '舞长空老师对你进行了冷傲但严格的指导，你的剑法/身法精进不少。', rewards: { soulPower: 2 } },
      { text: '你在传灵塔的升灵台中进行虚拟实战，魂灵在战斗中获得了成长。', rewards: { soulPower: 1 }, special: { latestRingYearsMultiplier: 1.2 }, resultText: '魂灵年份提升20%，魂力+1级' },
      { text: '枫无羽长老亲自指点你锻造，作为圣匠的他让你的锻造技艺突飞猛进。', rewards: { gold: 30 }, resultText: '获得30金魂币' },
      { text: '浊世长老的赤龙九式虽然只是演示，但让你明白了力量与技巧的结合。', rewards: { soulPower: 2 } },
      { text: '你在斗铠工坊成功制作出第一件有灵合金，向一字斗铠迈出了第一步。', minBattleArmor: 2, resultText: '掌握斗铠基础' },
      { text: '参加学院组织的星斗大森林实战，你第一次感受到濒临灭绝的魂兽们的悲哀。', rewards: { soulPower: 1, merit: 4 } },
      { text: '云冥阁主亲自授课，擎天枪的枪意让你明白了什么是"一枪擎天"。', rewards: { soulPower: 3 }, resultText: '魂力+3级（阁主指点）' }
    ]
  },
  douluo4: {
    name: '史莱克学院',
    desc: '星际时代最顶尖的魂师学院，拥有精灵星、天龙星等外星分院，是联邦的中流砥柱。',
    events: [
      { text: '唐震华老师带你进行星际航行实训，你第一次驾驶宇宙飞船。', rewards: { soulPower: 2 } },
      { text: '在精灵星的魂兽栖息地，你与一只强大的外星魂兽建立了友谊。', rewards: { soulPower: 1, merit: 5 } },
      { text: '参加龙源星实战演练，你第一次与龙族生物交手，经验宝贵。', rewards: { soulPower: 2, merit: 5 } },
      { text: '娜娜老师教导你古武技巧，她的教学方式独特而高效。', rewards: { soulPower: 2 } },
      { text: '在天龙星的龙族秘境中，你感受到龙神血脉的召唤。', rewards: { soulPower: 1 } },
      { text: '参加史莱克七怪选拔赛，你的表现让评委们眼前一亮。', rewards: { soulPower: 3, merit: 8 } },
      { text: '唐乐（唐舞麟）在学院举办音乐会，金龙王的旋律中你领悟了力量与美的融合。', rewards: { soulPower: 2 } }
    ]
  }
};

// ============================================================
// TIMELINE PROGRESS - Original Story Events by Age
// ============================================================
const TIMELINE_PROGRESS = {
  douluo1: [
    { age: 6, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐三在圣魂村觉醒双生武魂，蓝银草与昊天锤横空出世，斗罗大陆新一代天才崛起。天下魂师为之震动，新的时代即将开启。', sp: 1 },
    { age: 8, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐三在诺丁学院遇到大师玉小刚，两人一见如故。玉小刚发现了唐三蓝银草的隐藏特性，收他为徒，开始系统的武魂理论研究。', sp: 1 },
    { age: 10, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐三在猎魂森林获得第一魂环——四百年的曼陀罗蛇，蓝银草缠绕能力初显锋芒。', sp: 1 },
    { age: 12, text: '<b style="color:var(--gold);">【原著剧情】</b> 史莱克学院迎来新一届招生，唐三、小舞、戴沐白、奥斯卡、马红俊、宁荣荣、朱竹清七人齐聚，史莱克七怪正式成形！', sp: 2 },
    { age: 14, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐三在落日森林遇到毒斗罗独孤博，以毒攻毒救治其孙女独孤雁，获引至冰火两仪眼。唐三采摘仙草为七怪量身定制提升方案，宁荣荣七宝琉璃塔进化为九宝琉璃塔，马红俊邪火凤凰纯化为火凤凰。', sp: 2, merit: 5 },
    { age: 15, text: '<b style="color:var(--gold);">【原著剧情】</b> 全大陆高级魂师学院大赛正式开幕！史莱克七怪一路过关斩将，击败武魂殿黄金一代的武魂融合技"妖魅"，震惊整个魂师界。', sp: 2 },
    { age: 16, text: '<b style="color:var(--red);">【原著剧情】</b> 大赛决赛上，小舞十万年魂兽身份暴露！比比东下令活捉，唐昊从天而降以一己之力救走唐三与小舞，昊天斗罗之名再次响彻大陆。', sp: 1, merit: 5 },
    { age: 18, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐三与小舞在天斗城大斗魂场以"千手修罗"之名参加斗魂，连续胜利引发广泛关注。', sp: 1, merit: 3 },
    { age: 20, text: '<b style="color:var(--red);">【原著剧情】</b> 小舞献祭！为救唐三，十万年柔骨兔献祭自身，唐三获得十万年魂环与魂骨，悲痛欲绝。', sp: 3, merit: 10 },
    { age: 21, text: '<b style="color:var(--red);">【原著剧情】</b> 天斗宫变！千仞雪伪装成大皇子雪清河二十年的阴谋被唐三识破，天使领域笼罩天斗皇宫，一场惊天大战爆发。', sp: 2, merit: 8 },
    { age: 22, text: '<b style="color:var(--gold);">【原著剧情】</b> 海神岛现世！唐三带领史莱克七怪前往海神岛接受海神考核，海神之光笼罩全岛，海神九考正式启动。', sp: 3, merit: 10 },
    { age: 24, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐三在海神岛通过海神九考，获得海神三叉戟与海神神位传承，实力达到半神境界。', sp: 3, merit: 12 },
    { age: 25, text: '<b style="color:var(--gold);">【原著剧情】</b> 嘉陵关大战！唐三继承海神与修罗神双神位，击败罗刹神比比东与天使之神千仞雪，斗罗大陆迎来新的和平时代。', sp: 5, merit: 20 }
  ],
  douluo2: [
    { age: 11, text: '<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩离开公爵府，在星斗大森林遇到百万年魂兽天梦冰蚕，获得史上第一个百万年魂环。随后冰碧帝皇蝎冰帝献祭自身，化为霍雨浩的第二武魂，双生武魂觉醒！', sp: 2 },
    { age: 12, text: '<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩进入史莱克学院，与女扮男装的唐舞桐（王冬）成为室友。新生考核中两人武魂融合技"浩冬之力"首次亮相，震惊史莱克学院。', sp: 1 },
    { age: 13, text: '<b style="color:var(--red);">【原著剧情】</b> 霍雨浩在星斗大森林遇险时，体内沉睡的伊莱克斯神识苏醒，以死灵之力击退万年魂兽。伊莱克斯从此成为霍雨浩的精神导师，但神识在逐渐消散。', sp: 2 },
    { age: 14, text: '<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩作为交换生前往日月帝国明德堂学习魂导科技，接触到大陆最前沿的魂导器技术，眼界大开。', sp: 2 },
    { age: 16, text: '<b style="color:var(--gold);">【原著剧情】</b> 全大陆高级魂师学院大赛激战正酣！霍雨浩带领史莱克七怪击败日月帝国战队，捍卫了史莱克的荣耀。', sp: 2, merit: 8 },
    { age: 18, text: '<b style="color:var(--red);">【原著剧情】</b> 圣灵教现世！邪魂师肆虐大陆，玄老带领史莱克监察团前往明斗山脉剿匪，遭遇惨烈伏击，邪魂师的恐怖令全大陆震动。', sp: 1, merit: 5 },
    { age: 20, text: '<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩在极北之地找到雪帝残魂，将冰帝的消息传递给她，雪帝残魂融入霍雨浩体内，极致之冰发生质变。', sp: 2, merit: 8 },
    { age: 22, text: '<b style="color:var(--gold);">【原著剧情】</b> 帝天发动星斗大森林兽潮！霍雨浩与帝天谈判，最终达成魂灵契约，建立传灵塔，开创魂兽与人类共存的新纪元。', sp: 3, merit: 10 },
    { age: 24, text: '<b style="color:var(--red);">【原著剧情】</b> 乾坤问情谷！霍雨浩与王冬儿（唐舞桐）的感情经历生死考验，王冬儿为救霍雨浩陷入沉睡。', sp: 2, merit: 8 },
    { age: 26, text: '<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩自创情绪之神神位，七色光环加身。与唐舞桐在史莱克城上空一同飞升神界，传灵塔射出七色光柱为其送行。', sp: 5, merit: 20 }
  ],
  douluo3: [
    { age: 6, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟在红山学院觉醒蓝银草武魂，同时右手化为金色龙爪，金龙王封印初现端倪。', sp: 1 },
    { age: 8, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟在傲来城师从邙天学习锻造，金龙王血脉在反复锻打中逐渐松动，展现出惊人的锻造天赋。', sp: 1 },
    { age: 9, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟在前往东海城的列车上遇到古月，古月的"元素掌控"武魂令所有人震惊——那是龙族的本命神通。', sp: 1 },
    { age: 10, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟进入东海学院零班，班主任舞长空以近乎残酷的训练方式磨练这群少年，唐舞麟在极限训练中飞速成长。', sp: 1 },
    { age: 12, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟通过考核进入史莱克学院，与谢邂、古月、许小言、叶星澜、徐笠智、原恩夜辉、乐正宇组成新一代史莱克七怪。', sp: 2, merit: 5 },
    { age: 16, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟锻造水平达到六级灵锻师，金龙王封印不知不觉松动了八道，身体素质已达封号斗罗级别。', sp: 2 },
    { age: 17, text: '<b style="color:var(--red);">【原著剧情】</b> 史莱克城大爆炸！圣灵教暗中袭击史莱克城，海神阁阁主云冥为守护学院而陨落，唐舞麟与古月的关系面临巨大考验。', sp: 2, merit: 8 },
    { age: 18, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟成为一字斗铠师，四字斗铠"金龙月语"初具雏形，金龙王血脉在战斗中逐渐觉醒。', sp: 2 },
    { age: 20, text: '<b style="color:var(--red);">【原著剧情】</b> 深渊位面入侵！血神军团死守防线，唐舞麟作为第九血神参战，深渊生物的恐怖让全大陆陷入危机。', sp: 2, merit: 8 },
    { age: 25, text: '<b style="color:var(--red);">【原著剧情】</b> 唐舞麟体内金龙王封印大部分解除，银龙王古月娜的真实身份暴露，两人立场对立。', sp: 3, merit: 10 },
    { age: 28, text: '<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟金龙王之力完全觉醒，与古月娜合力对抗深渊圣君，最终为大陆和平双双冰封于极北之地，龙王传说画上悲壮句号。', sp: 5, merit: 20 }
  ],
  douluo4: [
    { age: 7, text: '<b style="color:var(--gold);">【原著剧情】</b> 蓝轩宇在天罗星紫萝城觉醒中心觉醒水元素掌控武魂，当晚胸口金色鳞片发光，体内金银龙王两股力量初次涌动。', sp: 1 },
    { age: 9, text: '<b style="color:var(--gold);">【原著剧情】</b> 蓝轩宇被神秘的银发老师娜娜收为弟子，她教导蓝轩宇用意志直接操控元素——一种远超当代魂师界认知的修炼方式。', sp: 1 },
    { age: 13, text: '<b style="color:var(--gold);">【原著剧情】</b> 蓝轩宇以优异成绩考入史莱克学院，在入学考核中结识白秀秀（天蓝龙），组建"三十三天翼"小队，新七怪核心成型。', sp: 2, merit: 5 },
    { age: 15, text: '<b style="color:var(--gold);">【原著剧情】</b> 蓝轩宇在升龙台遭遇远古龙魂，金银龙王血脉融合，左金右银双翼展开，龙魂臣服，踏出龙神之路第一步。', sp: 3, merit: 10 },
    { age: 18, text: '<b style="color:var(--red);">【原著剧情】</b> 蓝轩宇化名"金龙公主"潜入天龙星执行间谍计划，从杂役做到天龙商会副会长，在龙族社会中寻找龙神神力碎片。', sp: 2, merit: 8 },
    { age: 19, text: '<b style="color:var(--gold);">【原著剧情】</b> 龙神九考！天龙提出龙神遗留的最终试炼，蓝轩宇在前六考中承受金银龙力冲击，第四至六考进入龙族历史长河，第七考"斩断羁绊"中他拒绝放弃情感，龙神残存意志改变了考核内容。', sp: 3, merit: 10 },
    { age: 21, text: '<b style="color:var(--red);">【原著剧情】</b> 深红之母率领蟊虫舰队全面入侵斗罗星系！天龙身负重伤，蓝轩宇在升龙台完成最后融合，龙神真身觉醒，白金龙翼遮天蔽日。', sp: 3, merit: 12 },
    { age: 22, text: '<b style="color:var(--gold);">【原著剧情】</b> 龙神蓝轩宇在虚空中与深红之母决战三天三夜，以毁灭与生命合力击碎其核心。战后开辟新神界，三十三天翼各自获得神位。唐舞麟与古月从万年龙茧中苏醒，一家三口在新神界团聚。', sp: 5, merit: 20 }
  ],
  godrealm: [
    { age: 50, text: '<b style="color:var(--red);">【原著剧情】</b> 毁灭之神联合七大原罪神发动政变，夺取神界中枢控制权，唐三被软禁于海神神殿，小舞被单独关押。', sp: 1, merit: 5 },
    { age: 100, text: '<b style="color:var(--red);">【原著剧情】</b> 霍雨浩联合七大元素神在神禁之地与毁灭之神决战。生命女神为净化毁灭之神献祭自身，毁灭之神失去妻子后心灰意冷，自愿消散。', sp: 2, merit: 15 },
    { age: 200, text: '<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩继承情绪之神神位，唐舞桐继承蝶神神位，两人成为神界新一代双神王搭档，与唐三、小舞共同守护神界。', sp: 3, merit: 10 },
    { age: 300, text: '<b style="color:var(--red);">【原著剧情】</b> 时空乱流来袭！大神圈被卷入黑洞，众神合力脱困，神界格局再次发生巨变。', sp: 3, merit: 15 }
  ]
};

function getTimelineProgressEvent() {
  let timelineId = G.timeline?.id || 'douluo1';
  let progress = TIMELINE_PROGRESS[timelineId];
  if (!progress) return null;
  let age = G.age;
  // Check if we already triggered this age's event
  if (G._triggeredProgress && G._triggeredProgress.includes(age)) return null;
  let event = progress.find(e => e.age === age);
  if (!event) return null;
  // Mark as triggered
  G._triggeredProgress = G._triggeredProgress || [];
  G._triggeredProgress.push(age);
  return event;
}

const TIMELINE_CHARACTERS = {
  douluo1: [
    {
      name: '唐三', soul: '蓝银草 / 昊天锤', desc: '斗罗大陆的主角，双生武魂拥有者，史莱克七怪之首，唐门创始人。', color: '#4488ff', weight: 12, ageRange: [6, 30], events: [
        { text: '你在诺丁学院遇到了正在修炼玄天功的唐三，他主动教你紫极魔瞳的入门方法。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return '魂力+1级'; } },
        { text: '唐三邀请你加入史莱克七怪的特训，在大师玉小刚的魔鬼训练下，你的实战能力突飞猛进。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '你在天斗城偶遇唐三，他刚创建唐门，送你一枚唐门暗器"龙须针"图纸。', effect: (g) => { g.gold = (g.gold || 0) + 50; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return '获得50金魂币，魂力+1级'; } },
        { text: '唐三在落日森林修炼暗器，你旁观了他用"暗器百解"击落树上百步穿杨，对暗器之道有了新领悟。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+2级，名声+5'; } },
        { text: '海神岛上，唐三正在接受海神九考，海神之光的余波让你受益匪浅。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return '魂力+3级'; } }
      ]
    },
    {
      name: '小舞', soul: '柔骨魅兔', desc: '十万年魂兽化形，唐三的挚爱，拥有柔骨绝技与虚无、爆杀八段摔。', color: '#ff66aa', weight: 10, ageRange: [6, 30], events: [
        { text: '小舞在星斗大森林外围采灵草时遇到了你，她教你柔技中的腰弓入门。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return '魂力+1级'; } },
        { text: '史莱克学院的操场上，小舞展示了她那令人惊叹的瞬移和无敌金身，你从中领悟了闪避的奥义。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '你偶遇正在卖烤兔腿的小舞，她请你吃了一顿，兔肉中蕴含的魂力让你精神一振。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.gold = (g.gold || 0) + 10; return '魂力+1级，获得10金魂币'; } },
        { text: '小舞在月光下独舞，柔骨魅兔的天赋之美让你武魂产生共鸣。', effect: (g) => { if (g.appearance) { g.appearance = { ...g.appearance, attr: { ...g.appearance.attr, charm: (g.appearance.attr?.charm || 5) + 1 } }; } return '魅力+1'; } }
      ]
    },
    {
      name: '戴沐白', soul: '邪眸白虎', desc: '星罗帝国皇子，史莱克七怪老大，强攻系战魂师，后继承太子之位。', color: '#ffdd44', weight: 8, ageRange: [12, 28], events: [
        { text: '戴沐白正在大斗魂场以"邪眸白虎"之名战斗，你观战后对白虎金刚变有了新的理解。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '戴沐白带你进入星罗帝国的皇家猎场，与朱竹清联手展示幽冥白虎融合技，震撼全场。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+2级，名声+5'; } },
        { text: '戴沐白请你喝酒，酒醉后讲述他逃离星罗皇宫的往事，你对皇权斗争有了警惕。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    },
    {
      name: '奥斯卡', soul: '香肠', desc: '史莱克七怪中的食物系魂师，先天满魂力的天才，第一位食物系封号斗罗。', color: '#44ddff', weight: 8, ageRange: [12, 40], events: [
        { text: '奥斯卡递给你一根恢复大香肠，味道虽然一言难尽但效果惊人，你的魂力迅速恢复。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.gold = (g.gold || 0) + 20; return '魂力+1级，获得20金魂币'; } },
        { text: '奥斯卡展示了他的第六魂技——镜像肠，你看到了复制的奇妙力量。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return '魂力+1级'; } },
        { text: '奥斯卡正在研究新食谱，请你试吃亢奋粉红肠，全属性提升的感觉让你大呼过瘾。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } }
      ]
    },
    {
      name: '马红俊', soul: '邪火凤凰', desc: '史莱克七怪之一，拥有变异武魂邪火凤凰，后净化为十首火凤凰。', color: '#ff4444', weight: 8, ageRange: [12, 28], events: [
        { text: '马红俊的邪火失控暴走，你帮忙用冰属性魂力压制，事后他感激地传授你凤凰火线的修炼方法。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '马红俊带你去天斗城最好的酒楼"聚宝阁"大吃一顿，席间吹嘘他追白沉香的浪漫经历。', effect: (g) => { g.gold = (g.gold || 0) + 20; return '获得20金魂币'; } },
        { text: '马红俊展示了武魂进化后的七首火凤凰之力，凤凰领域让你感受到近乎不死的重生之力。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+2级，名声+5'; } }
      ]
    },
    {
      name: '宁荣荣', soul: '七宝琉璃塔', desc: '七宝琉璃宗小公主，辅助系魂师，奥斯卡的恋人，九层宝塔的强力辅助。', color: '#ffaa44', weight: 8, ageRange: [12, 28], events: [
        { text: '宁荣荣用九宝琉璃塔为你施展全属性增幅，增幅效果让你惊叹不已。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '宁荣荣的七宝琉璃塔在战斗中突然进化为九宝琉璃塔，进化之光波及到你，你的武魂品质有所提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return '魂力+3级'; } },
        { text: '宁荣荣请你喝下午茶，席间讲述了七宝琉璃宗与武魂殿的恩怨。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    },
    {
      name: '朱竹清', soul: '幽冥灵猫', desc: '星罗帝国贵族，速度型敏攻系魂师，戴沐白的未婚妻。', color: '#aa66ff', weight: 7, ageRange: [12, 28], events: [
        { text: '朱竹清在夜间独自修炼幽冥百爪，你暗中观摩她那快如闪电的暗杀技巧。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return '魂力+1级'; } },
        { text: '朱竹清带你进行夜行训练，幽冥灵猫的隐匿身法让你对潜行有了全新认识。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+1级，名声+5'; } },
        { text: '朱竹清讲述了她逃离星罗帝国朱家的经历，你对自由与家族的抉择有了更深理解。', effect: (g) => { g.merit = (g.merit || 0) + 6; return '名声+6'; } }
      ]
    },
    {
      name: '唐昊', soul: '昊天锤', desc: '昊天斗罗，唐三之父，大陆最年轻的封号斗罗，曾为救阿银独战武魂殿。', color: '#444444', weight: 7, ageRange: [10, 50], events: [
        { text: '你在圣魂村的铁匠铺遇到了醉醺醺的唐昊，他随手一锤展示的昊天锤之力让你震撼不已。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return '魂力+3级'; } },
        { text: '唐昊在瀑布下用大须弥锤法特训唐三，你在远处观摩，对昊天锤的炸环奥义有了初步领悟。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+2级，名声+5'; } },
        { text: '唐昊讲述了他与阿银的故事，以及武魂殿的罪行，你对这个世界的残酷有了更深的认识。', effect: (g) => { g.merit = (g.merit || 0) + 10; return '名声+10'; } }
      ]
    },
    {
      name: '独孤博', soul: '碧磷蛇皇', desc: '毒斗罗，以毒冠绝天下，后成为史莱克学院的客卿长老。', color: '#44ff44', weight: 6, ageRange: [8, 60], events: [
        { text: '独孤博带你前往冰火两仪眼，那里的仙草让你的体质大幅改善。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+2级，名声+5'; } },
        { text: '独孤博教你辨识天下奇毒，你学会了碧磷蛇毒的基础运用。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 6; return '魂力+1级，名声+6'; } },
        { text: '独孤博展示了碧磷蛇皇的恐怖群攻——毒气通过土地蔓延，方圆百米寸草不生。你对他避之不及的同时也学到了大规模杀伤的思路。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 3; return '魂力+1级，名声+3'; } }
      ]
    },
    {
      name: '比比东', soul: '死亡蛛皇 / 噬魂蛛皇', desc: '武魂殿教皇，双生武魂拥有者，当世巅峰强者之一，罗刹神传承者。', color: '#ff4444', weight: 6, ageRange: [15, 40], events: [
        { text: '比比东在武魂城召见你，对你的天赋产生了兴趣，赐予你一枚武魂殿特制魂骨碎片。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return '魂力+3级'; } },
        { text: '你拒绝了比比东的招揽，她冷冷地放你离开，但你守住了本心，内心更加坚定。', effect: (g) => { g.merit = (g.merit || 0) + 15; return '名声+15'; } },
        { text: '比比东展示了她双生武魂的恐怖——死亡蛛皇和噬魂蛛皇同时释放，黑暗气息笼罩全场。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } }
      ]
    },
    {
      name: '千仞雪', soul: '六翼天使', desc: '武魂殿少主，天使神传承者，拥有神圣而强大的力量。', color: '#ffdd88', weight: 6, ageRange: [9, 30], events: [
        { text: '你在天斗皇宫遇到了"大皇子雪清河"，她的天使之光让你感到温暖。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '千仞雪在武魂殿释放天使领域，天空为之变色，你在领域余波中感受到圣洁之力的洗礼。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+2级，名声+5'; } },
        { text: '千仞雪跪在天使神殿前祈祷108天，你目睹了这一幕，被她的虔诚所震撼。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    },
    {
      name: '波赛西', soul: '海神', desc: '海神岛大祭司，九十九级绝世斗罗，海神在人间的代言人。', color: '#4488ff', weight: 5, ageRange: [18, 35], events: [
        { text: '波赛西引导你感受海神之光，海神的气息让你的精神力得到淬炼。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return '魂力+3级'; } },
        { text: '波赛西带你潜入海神岛深海，海神岛的海底遗迹让你领悟了海洋之力的奥秘。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+2级，名声+5'; } },
        { text: '波赛西讲述她与唐晨的故事，你感受到了跨越百年的爱情与执念。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    },
    {
      name: '玉小刚', soul: '罗三炮', desc: '武魂理论界的大师，变异武魂罗三炮终身无法突破三十级，但提出"武魂十大核心竞争力"理论，唐三的启蒙恩师。', color: '#aa8844', weight: 6, ageRange: [30, 55], events: [
        { text: '玉小刚向你讲解武魂十大核心竞争力，你对武魂本质的理解豁然开朗。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return '魂力+1级，名声+5'; } },
        { text: '玉小刚带你观察唐三的双生武魂，详细分析武魂兼容性的理论。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '玉小刚讲述他与比比东的往事，你被这段跨越身份与仇恨的师生情深深触动。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    },
    {
      name: '弗兰德', soul: '四眼猫鹰', desc: '史莱克学院院长，武魂四眼猫鹰，七十八级敏攻系魂圣，以"只收怪物不收普通人"闻名。', color: '#4488aa', weight: 6, ageRange: [35, 55], events: [
        { text: '弗兰德院长亲自对你进行速度测试，四眼猫鹰的敏锐感知让你对战斗节奏有了新领悟。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '弗兰德带你参观史莱克学院的怪物训练营，那些训练方式让你大开眼界。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.gold = (g.gold || 0) + 30; return '魂力+1级，获得30金魂币'; } },
        { text: '弗兰德讲述史莱克学院从无到有的创业史，你感受到了一位老院长对教育的热忱。', effect: (g) => { g.merit = (g.merit || 0) + 6; return '名声+6'; } }
      ]
    },
    {
      name: '柳二龙', soul: '火龙', desc: '蓝电霸王龙家族旁支，变异武魂火龙，玉小刚的恋人，史莱克学院创始人之一，脾气暴躁但重情重义。', color: '#ff4444', weight: 6, ageRange: [30, 50], events: [
        { text: '柳二龙在训练中暴怒，火龙武魂的烈焰险些烧到你的衣角，但你从中感受到了极致火焰的力量。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '柳二龙在月下独自饮酒，向你倾诉她与玉小刚跨越二十年的感情纠葛。', effect: (g) => { g.merit = (g.merit || 0) + 7; return '名声+7'; } },
        { text: '柳二龙以火龙之力为你淬炼体魄，高温灼烧后的经脉变得更加坚韧。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.maxLevel = Math.min(g.maxLevel + 1, 150); return '魂力+2级，魂力上限+1'; } }
      ]
    },
    {
      name: '赵无极', soul: '大力金刚熊', desc: '史莱克学院副院长，武魂大力金刚熊，七十六级强攻系魂圣，以强悍的防御和力量著称。', color: '#664422', weight: 6, ageRange: [30, 50], events: [
        { text: '赵无极以大力金刚熊的熊掌对你进行力量测试，你切身体会到了什么叫"不动明王"。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '魂力+2级'; } },
        { text: '赵无极在斗魂场示范重力控制技巧，你学到了如何在重压下保持身体平衡。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 4; return '魂力+1级，名声+4'; } },
        { text: '赵无极讲述当年被唐昊暴打三天三夜的经历，那位昊天斗罗的恐怖让你不寒而栗。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    }
  ],
  douluo2: [
    {
      name: '霍雨浩', soul: '灵眸 / 冰碧帝皇蝎', desc: '绝世唐门主角，精神系与冰系双生武魂的天才魂师，情绪之神传承者。', color: '#44ddff', weight: 12, ageRange: [11, 26], events: [
        { text: '霍雨浩在星斗大森林用精神探测与你共享视野，极北之地的极致冰寒也影响到了你，但你受益匪浅。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '霍雨浩带你去明德堂参观魂导器，十级魂导师的杰作让你对魂导科技大开眼界。', effect: (g) => { g.battleArmor = Math.max(g.battleArmor || 0, 1); g.gold = (g.gold || 0) + 40; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'battleArmor+1, gold+40, sp+1'; } },
        { text: '霍雨浩的天梦冰蚕与你交流精神力的运用，你感到精神之海在缓缓扩大。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } }
      ]
    },
    {
      name: '唐舞桐', soul: '光明龙神蝶 / 昊天锤', desc: '唐三与小舞之女，拥有光明女神蝶与昊天锤双生武魂，后继承蝶神神位。', color: '#ff66aa', weight: 10, ageRange: [10, 26], events: [
        { text: '唐舞桐（王冬儿）带你翱翔天际，光明龙神蝶的光辉让你魂力产生奇异共鸣。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '唐舞桐用昊天锤为你演示乱披风锤法，那是唐门绝学的精髓。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+2, merit+5'; } },
        { text: '唐舞桐在海神缘上展露女儿身，光明女神蝶的美丽让你为之倾倒，你的武魂因之振奋。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } }
      ]
    },
    {
      name: '贝贝', soul: '光明圣龙', desc: '唐门大师兄，史莱克七怪队长，拥有光明圣龙武魂，后成为龙神斗罗。', color: '#ffdd44', weight: 8, ageRange: [12, 26], events: [
        { text: '贝贝以史莱克七怪队长身份指点你修炼，龙皇破邪裂的龙族威压让你受益匪浅。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '贝贝带你参观重建中的唐门，讲述了唐门万年的兴衰史。', effect: (g) => { g.merit = (g.merit || 0) + 8; g.gold = (g.gold || 0) + 20; return 'merit+8, gold+20'; } },
        { text: '贝贝传授你唐门绝学中的控鹤擒龙手，这招近身格斗技在实战中极为实用。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } }
      ]
    },
    {
      name: '马小桃', soul: '邪火凤凰', desc: '史莱克内院弟子，拥有邪火凤凰武魂，后净化为黑凤凰，成为凤凰斗罗。', color: '#ff4444', weight: 8, ageRange: [14, 26], events: [
        { text: '马小桃的凤凰穿云击在你面前划破长空，极致之火的热浪让你的武魂为之震动。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '马小桃在邪火失控时你帮忙用冰水泼醒她，事后她对你心存感激，教你修炼火系魂技。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+2, merit+5'; } },
        { text: '马小桃展示了武魂进化后的黑凤凰之力，凤凰涅槃的壮观景象让你震撼。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 3; return 'sp+1, merit+3'; } }
      ]
    },
    {
      name: '和菜头', soul: '雪茄', desc: '日月帝国前太子，后成为唐门成员，食物系魂导师。', color: '#44aa44', weight: 7, ageRange: [12, 26], events: [
        { text: '和菜头送你几枚自制的定装魂导炮弹，"当食物系魂师也能火力全开"。', effect: (g) => { g.gold = (g.gold || 0) + 35; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'gold+35, sp+1'; } },
        { text: '和菜头教你制作基础魂导器，日月帝国的魂导技术果然精妙。', effect: (g) => { g.battleArmor = Math.max(g.battleArmor || 0, 1); return 'battleArmor+1'; } },
        { text: '和菜头向你坦白了他的真实身份——日月帝国前太子徐和，你被他的隐忍所感动。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } }
      ]
    },
    {
      name: '玄老', soul: '饕餮神牛', desc: '史莱克学院海神阁宿老，后成为海神阁阁主，九十九级极限斗罗。', color: '#aa8844', weight: 7, ageRange: [8, 60], events: [
        { text: '玄老一边啃鸡腿一边指点你修炼，饕餮神牛的力量灌入你体内，魂力暴涨。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return 'sp+3'; } },
        { text: '玄老带你前往明斗山脉剿灭邪魂师盗匪，实战中的饕餮之怒让你见识了封号斗罗的恐怖。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+2, merit+5'; } },
        { text: '玄老在兽潮中凭一己之力战平帝天，你远观此战后对封号斗罗的境界有了全新认知。', effect: (g) => { g.merit = (g.merit || 0) + 10; return 'merit+10'; } }
      ]
    },
    {
      name: '穆老', soul: '光明圣龙', desc: '史莱克学院海神阁前阁主，龙神斗罗穆恩，九十九级极限斗罗。', color: '#ffdd88', weight: 6, ageRange: [8, 60], events: [
        { text: '穆老在黄金树下为你灌顶，光明圣龙之力洗涤你的身心，邪气尽消。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return 'sp+3'; } },
        { text: '穆老传授你自创战技"君临天下"的入门心法，物理与精神攻击融合的奥义让你大开眼界。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 8; return 'sp+2, merit+8'; } },
        { text: '穆老讲述了百年前与龙逍遥、叶夕水的三角往事，你对那个时代的爱恨纠葛感慨万千。', effect: (g) => { g.merit = (g.merit || 0) + 10; return 'merit+10'; } }
      ]
    },
    {
      name: '王冬', soul: '昊天锤', desc: '霍雨浩的室友兼挚友，唐舞桐的女扮男装身份，拥有昊天锤武魂。', color: '#ff88aa', weight: 8, ageRange: [11, 26], events: [
        { text: '王冬在宿舍中与你切磋，昊天锤的霸道力量让你印象深刻。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '王冬带你到海神湖畔，施展昊天锤乱披风锤法，你的武魂根基得到巩固。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '王冬与你并肩作战，双人武魂融合技的雏形让你们之间的默契大增。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } }
      ]
    },
    {
      name: '王秋儿', soul: '黄金龙枪', desc: '十万年魂兽黄金龙化形，拥有强大的龙族血脉，对霍雨浩情深意重。', color: '#ffdd44', weight: 8, ageRange: [14, 26], events: [
        { text: '王秋儿以黄金龙枪横扫战场，金龙之力的霸道让你热血沸腾。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '王秋儿教你黄金龙枪的基础运用，龙族秘技的力量让你受益匪浅。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+2, merit+5'; } },
        { text: '王秋儿讲述了她对霍雨浩的感情，那份不求回报的付出让你感动不已。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } }
      ]
    },
    {
      name: '徐三石', soul: '玄冥龟', desc: '史莱克七怪之一，防御型魂师，拥有玄冥龟武魂，后进化为玄武。', color: '#44aa44', weight: 7, ageRange: [12, 26], events: [
        { text: '徐三石展示玄冥龟的绝对防御，玄武之盾的坚固让你叹为观止。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '徐三石教你玄冥龟的防御技巧，你的抗击打能力大幅提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '徐三石讲述他与江楠楠之间的感情故事，厚脸皮的追爱方式让你忍俊不禁。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '江楠楠', soul: '柔骨魅兔', desc: '史莱克七怪之一，敏攻系魂师，徐三石的恋人，拥有柔骨魅兔武魂。', color: '#ff66aa', weight: 7, ageRange: [12, 26], events: [
        { text: '江楠楠以柔骨魅兔的灵动身法为你演示闪避技巧，速度与柔韧的结合让你大开眼界。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '江楠楠教你柔技中的腰弓入门，腰腹力量得到显著提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 3; return 'sp+1, merit+3'; } },
        { text: '江楠楠分享了她在史莱克学院的成长经历，激励你不断前进。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '萧萧', soul: '九凤来仪箫 / 三生镇魂鼎', desc: '史莱克七怪之一，双生武魂拥有者，辅助与控制兼备的全面型魂师。', color: '#aa66ff', weight: 7, ageRange: [11, 26], events: [
        { text: '萧萧以九凤来仪箫吹奏一曲，悦耳的箫声中魂力缓缓流淌，你的精神力得到滋养。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '萧萧展示三生镇魂鼎的镇压之力，一鼎镇三生的气势让你震撼。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '萧萧与你合奏一曲，音律与魂力的共鸣让你们对武魂的理解更加深刻。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 4; return 'sp+1, merit+4'; } }
      ]
    },
    {
      name: '橘子', soul: '光明女神蝶', desc: '日月帝国太子妃，拥有光明女神蝶武魂，才华横溢的战术家和魂导师。', color: '#ff8844', weight: 7, ageRange: [14, 28], events: [
        { text: '橘子向你展示日月帝国的魂导科技，她对魂导器的理解让你大开眼界。', effect: (g) => { g.gold = (g.gold || 0) + 30; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'gold+30, sp+1'; } },
        { text: '橘子讲述她在日月帝国宫廷中的经历，你对权力斗争的残酷有了更深的理解。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } },
        { text: '橘子以光明女神蝶的领域之力为你加持，暖金色的光芒中你的魂力活跃起来。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } }
      ]
    },
    {
      name: '戴华斌', soul: '邪眸白虎', desc: '星罗帝国皇子，戴沐白的后裔，拥有邪眸白虎武魂，性格高傲。', color: '#ffdd44', weight: 6, ageRange: [12, 26], events: [
        { text: '戴华斌以邪眸白虎的威压挑衅你，一场激战后你们互相认可了对方的实力。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '戴华斌展示白虎金刚变，白虎之力让你感受到星罗皇室血脉的强大。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '戴华斌放下高傲与你交谈，讲述了他对星罗帝国的责任感。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '王冬儿', soul: '光明女神蝶', desc: '唐舞桐的化名，以女儿身行走大陆时使用的身份，与霍雨浩有着不解之缘。', color: '#ff88aa', weight: 7, ageRange: [12, 26], events: [
        { text: '王冬儿以光明女神蝶的绚丽光彩吸引你的目光，蝶翼翩翩中你的武魂产生共鸣。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '王冬儿教你光明女神蝶的光系魂技基础运用，你对光元素的理解大幅提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '王冬儿与你分享她的心事，那份隐藏身份的无奈让你心生同情。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '轩梓文', soul: '九级魂导核心', desc: '明德堂首席魂导师，九级魂导师，魂导器领域的巅峰人物。', color: '#44aaff', weight: 6, ageRange: [18, 50], events: [
        { text: '轩梓文向你展示九级魂导器的威力，魂导科技的巅峰之作让你叹为观止。', effect: (g) => { g.gold = (g.gold || 0) + 50; g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'gold+50, sp+2'; } },
        { text: '轩梓文教你魂导核心的制作原理，你对魂导器的理解更加深入。', effect: (g) => { g.battleArmor = Math.max(g.battleArmor || 0, 1); return 'battleArmor+1'; } },
        { text: '轩梓文讲述了他与霍雨浩在魂导研究上的合作经历，天才的碰撞让你深受启发。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 4; return 'sp+1, merit+4'; } }
      ]
    },
    {
      name: '张乐萱', soul: '月神', desc: '史莱克学院内院弟子，日辰斗罗，拥有月神武魂，史莱克七怪之一。', color: '#88aaff', weight: 6, ageRange: [14, 28], events: [
        { text: '张乐萱以月神之力为你展示月华之光，清冷的月光中你的魂力更加精纯。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '张乐萱指导你如何在夜间修炼，月华之力对魂力的滋养效果极佳。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '张乐萱讲述了她与贝贝之间的感情，那份含蓄而深沉的爱让你感动。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '梦红尘', soul: '红尘眷恋', desc: '日月帝国公主，笑红尘的妹妹，拥有红尘眷恋武魂，天性活泼。', color: '#ff6688', weight: 6, ageRange: [14, 26], events: [
        { text: '梦红尘用红尘眷恋向你施展魅惑之力，你险些沦陷在她的风情之中。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '梦红尘带你参观日月皇宫，帝国的繁华让你大开眼界。', effect: (g) => { g.gold = (g.gold || 0) + 30; return 'gold+30'; } },
        { text: '梦红尘讲述她与哥哥笑红尘在日月帝国的成长经历，皇室子女的酸甜苦辣让你感慨。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '笑红尘', soul: '火龙王', desc: '日月帝国皇子，梦红尘的哥哥，拥有火龙王武魂，天才魂导师。', color: '#ff4444', weight: 6, ageRange: [14, 26], events: [
        { text: '笑红尘以火龙王之力向你展示火龙咆哮，烈焰滔天中你感受到龙族的威严。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '笑红尘与你切磋魂导器实战运用，日月帝国的魂导战术让你受益匪浅。', effect: (g) => { g.gold = (g.gold || 0) + 25; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'gold+25, sp+1'; } },
        { text: '笑红尘讲述了他们兄妹的野心与抱负，你对日月帝国的未来有了新的认识。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '娜娜', soul: '冰元素', desc: '来自极北之地的冰系魂师，拥有强大的冰元素掌控力，后成为传灵塔高层。', color: '#88ddff', weight: 5, ageRange: [16, 30], events: [
        { text: '娜娜以极北冰原的冰元素之力为你淬炼体魄，极寒之气让你的意志更加坚定。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '娜娜教你冰系魂技的进阶运用，冰元素在你手中变得更加得心应手。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '娜娜讲述了她来自极北之地的身世，那份孤独与坚韧让你心生敬意。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    }
  ],
  douluo3: [
    {
      name: '唐舞麟', soul: '蓝银草 / 金龙王', desc: '龙王传说主角，表面武魂为蓝银草，实际体内封印金龙王之力，拥有恐怖的肉身力量，后继承海神与毁灭神位。', color: '#4488ff', weight: 12, ageRange: [6, 28], events: [
        { text: '唐舞麟在锻造台上挥汗如雨，九级神匠的手艺让你叹为观止，他送你一块有灵合金。', effect: (g) => { g.gold = (g.gold || 0) + 50; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'gold+50, sp+1'; } },
        { text: '唐舞麟展示金龙九式，金龙王血脉的力量让你感受到龙族的威压与荣耀。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '唐舞麟邀请你加入血神军团，在血神大阵中修炼，你的魂力在阵法加持下大幅提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return 'sp+3'; } }
      ]
    },
    {
      name: '古月娜', soul: '银龙王 / 元素掌控', desc: '魂兽共主银龙王化形，拥有掌控元素的恐怖能力，后分裂为古月和娜儿两个人格，唐舞麟的恋人。', color: '#aa66ff', weight: 10, ageRange: [10, 28], events: [
        { text: '古月娜向你展示了七元素同时操控的恐怖能力，火水风土光暗空间在你面前交织。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '古月娜带你前往传灵塔参观魂灵体系，你对魂兽与人类的共存方式有了新的认识。', effect: (g) => { g.merit = (g.merit || 0) + 8; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'merit+8, sp+1'; } },
        { text: '古月娜与唐舞麟施展武魂融合技"龙神变"，金银双色龙神之力让你血脉沸腾。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return 'sp+3'; } }
      ]
    },
    {
      name: '谢邂', soul: '光龙匕 / 影龙匕', desc: '唐舞麟的挚友，双生器武魂拥有者，敏攻系魂师，时空之龙传承者。', color: '#44ddff', weight: 8, ageRange: [10, 28], events: [
        { text: '谢邂用光龙匕和影龙匕的融合技"双龙风暴"为你演示敏攻系的速度极限。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '谢邂教你唐门敏堂的隐匿身法，鬼影迷踪步的精妙让你受益匪浅。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '谢邂在北方军团的实战中展示了进化后的时空之龙之力，穿越刺的瞬间移动让你叹为观止。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } }
      ]
    },
    {
      name: '原恩夜辉', soul: '泰坦巨猿 / 堕落天使', desc: '史莱克七怪之一，双生武魂，拥有强大的力量和黑暗属性。', color: '#662266', weight: 8, ageRange: [14, 28], events: [
        { text: '原恩夜辉以泰坦巨猿之拳震碎大地，泰坦神拳的刚猛让你感受到力量型魂师的霸道。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '原恩夜辉展示了堕落天使的恶魔之眼领域，黑暗与光明的双重属性让你武魂产生共鸣。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '原恩夜辉讲述了泰坦巨猿二明与母亲的故事，你对魂兽与人类的跨界之恋感慨万千。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } }
      ]
    },
    {
      name: '云冥', soul: '擎天枪', desc: '史莱克学院海神阁阁主，擎天斗罗，当世最强者之一。', color: '#ffdd44', weight: 7, ageRange: [8, 50], events: [
        { text: '云冥以擎天枪为你演示"一枪擎天"的绝技，准神级的战力让你感受到天地的震颤。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return 'sp+3'; } },
        { text: '云冥讲述史莱克学院万年传承的历史，你的心中涌起一股莫名的使命感。', effect: (g) => { g.merit = (g.merit || 0) + 10; return 'merit+10'; } },
        { text: '云冥在圣灵教袭击中用擎天枪硬挡九级定装魂导炮弹，枪杆断裂的瞬间你感受到了他守护学院的决意。', effect: (g) => { g.merit = (g.merit || 0) + 12; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'merit+12, sp+1'; } }
      ]
    },
    {
      name: '圣灵斗罗雅莉', soul: '祈愿天使', desc: '史莱克学院海神阁副阁主，大陆最强治疗系魂师。', color: '#ffddff', weight: 6, ageRange: [8, 50], events: [
        { text: '雅莉用祈愿天使的力量为你治愈暗伤，第九魂技"群体祈愿天使"的光辉让你焕然一新。', effect: (g) => { g.maxAge = (g.maxAge || 100) + 15; g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'maxAge+15, sp+2'; } },
        { text: '雅莉讲述了她为云冥守候百年的故事，你对纯粹的爱情充满敬意。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } },
        { text: '雅莉教你感知生命之力的方法，你对魂力运行的理解更加深入。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } }
      ]
    },
    {
      name: '许小言', soul: '星辰锁链', desc: '史莱克七怪之一，控制系魂师，拥有星辰锁链武魂，擅长星象之力。', color: '#8888ff', weight: 7, ageRange: [10, 26], events: [
        { text: '许小言以星辰锁链向你展示星象占卜，星辰之力对你的命运产生了微妙影响。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '许小言教你利用星辰之力修炼，夜空下的冥想让你的魂力更加精纯。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '许小言为你占卜未来，模糊的星象中你看到了自己命运的蛛丝马迹。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } }
      ]
    },
    {
      name: '叶星澜', soul: '星神剑', desc: '史莱克七怪之一，强攻系魂师，拥有星神剑武魂，星辰剑法出神入化。', color: '#aaccff', weight: 7, ageRange: [12, 26], events: [
        { text: '叶星澜以星神剑施展星辰剑法，星光璀璨中剑气纵横，让你对剑道有了新的领悟。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '叶星澜指导你剑法基础，一招一式中蕴含着星辰的轨迹。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '叶星澜讲述她在星罗村的童年往事，那段艰苦的修炼岁月让你深受触动。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '徐笠智', soul: '包子', desc: '史莱克七怪之一，食物系魂师，拥有包子武魂，性格憨厚老实。', color: '#44aa44', weight: 6, ageRange: [12, 26], events: [
        { text: '徐笠智递给你一个热腾腾的恢复大包子，食物中蕴含的魂力让你精神大振。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.gold = (g.gold || 0) + 10; return 'sp+1, gold+10'; } },
        { text: '徐笠智展示了他的包子武魂的多种效果，食物系魂师的辅助能力让你叹为观止。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '徐笠智与你分享他的人生哲学，知足常乐的心态让你在修行路上更加从容。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '乐正宇', soul: '神圣天使', desc: '史莱克七怪之一，拥有神圣天使武魂，来自神圣家族，拥有强大的光明之力。', color: '#ffdd88', weight: 7, ageRange: [12, 26], events: [
        { text: '乐正宇以神圣天使的光明之力为你洗礼，圣光驱散了你体内的杂质。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '乐正宇展示神圣天使的审判之剑，光明与正义的力量让你心生敬畏。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '乐正宇讲述神圣家族的使命，那份守护光明的责任让你感动。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '龙跃', soul: '山龙王', desc: '史莱克学院内院弟子，拥有山龙王武魂，力量型魂师，史莱克七怪之一。', color: '#44aa44', weight: 6, ageRange: [14, 28], events: [
        { text: '龙跃以山龙王之力震碎大地，恐怖的肉身力量让你感受到龙族的霸道。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '龙跃教你山龙王的防御技巧，你的身体强度得到显著提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '龙跃讲述他与原恩夜辉之间的羁绊，那份跨越武魂对立的情感让你动容。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '戴云儿', soul: '灵眸', desc: '星罗帝国公主，拥有灵眸武魂，精神系魂师，性格活泼可爱。', color: '#ff88aa', weight: 6, ageRange: [12, 24], events: [
        { text: '戴云儿以灵眸之力与你进行精神交流，精神力的碰撞让你对精神魂技有了新的认识。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '戴云儿带你游览星罗皇宫，帝国的繁华与底蕴让你大开眼界。', effect: (g) => { g.gold = (g.gold || 0) + 30; return 'gold+30'; } },
        { text: '戴云儿讲述她与唐舞麟在星罗帝国的往事，那段充满欢笑的回忆让你心情愉悦。', effect: (g) => { g.merit = (g.merit || 0) + 4; return 'merit+4'; } }
      ]
    },
    {
      name: '司马金驰', soul: '魔剑', desc: '史莱克学院海神阁成员，拥有魔剑武魂，九十八级超级斗罗。', color: '#6644aa', weight: 6, ageRange: [18, 50], events: [
        { text: '司马金驰以魔剑演示剑意，凌厉的剑气让你对剑道有了全新的理解。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '司马金驰指导你实战剑术，一招一式皆是杀伐之道。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '司马金驰讲述他追随唐舞麟征战四方的经历，那段热血岁月让你心驰神往。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } }
      ]
    },
    {
      name: '陈瑛', soul: '碧磷蛇', desc: '史莱克学院内院弟子，用毒高手，拥有碧磷蛇武魂，独孤博的传人。', color: '#44ff44', weight: 5, ageRange: [14, 26], events: [
        { text: '陈瑛教你辨识天下奇毒，碧磷蛇的毒功虽然凶险但极为实用。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '陈瑛展示了碧磷蛇的毒雾领域，你从中领悟了以毒攻毒的战斗思路。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '陈瑛讲述她与毒打交道的经历，那份在毒中求生的坚韧让你敬佩。', effect: (g) => { g.merit = (g.merit || 0) + 4; return 'merit+4'; } }
      ]
    },
    {
      name: '舞长空', soul: '冰霜龙', desc: '史莱克学院外院教师，谢邂的导师，拥有冰霜龙武魂，冷傲而强大。', color: '#88ddff', weight: 6, ageRange: [18, 40], events: [
        { text: '舞长空以冰霜龙之力为你演示冰系魂技，极寒之气让你对冰元素有了更深的理解。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '舞长空指导你剑法修炼，他冷傲的教学风格虽严格但效果显著。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '舞长空讲述了他与圣灵教的恩怨，那份刻骨铭心的仇恨让你对邪魂师更加警惕。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } }
      ]
    },
    {
      name: '圣灵教教主', soul: '死神', desc: '圣灵教最高领袖，九十九级极限斗罗，拥有死神武魂，斗罗大陆的黑暗面。', color: '#442222', weight: 5, ageRange: [20, 60], events: [
        { text: '圣灵教教主以死神之力笼罩四野，死亡的阴影让你感受到前所未有的压迫感。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '你与圣灵教教主交手，虽然不敌但侥幸逃脱，生死边缘的感悟让魂力突破。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); g.merit = (g.merit || 0) + 10; return 'sp+3, merit+10'; } },
        { text: '圣灵教教主向你展示死神镰刀的恐怖，那毁灭一切的力量让你心有余悸。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } }
      ]
    },
    {
      name: '冻千秋', soul: '魔魂大白鲨', desc: '来自精灵星的魂兽公主，魔魂大白鲨化形，蓝轩宇的红颜知己。', color: '#44aaff', weight: 7, ageRange: [8, 25], events: [
        { text: '冻千秋带你游览精灵星的深海，魔魂大白鲨领地中的美景让你流连忘返。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '冻千秋教你冰系魂技的海洋运用，海与冰的融合之力让你大开眼界。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '冻千秋讲述她与蓝轩宇在精灵星的初遇，那段跨越种族的缘分让你感动。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '蓝佛子', soul: '蓝魔龙', desc: '龙族强者，拥有蓝魔龙武魂，唐舞麟在龙谷中结识的伙伴。', color: '#4488ff', weight: 5, ageRange: [20, 60], events: [
        { text: '蓝佛子以蓝魔龙之力为你展示龙族秘技，龙族的传承让你对力量有了新的理解。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '蓝佛子讲述龙谷的历史，龙族的辉煌与衰落让你感慨万千。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } },
        { text: '蓝佛子教你龙族语言的入门，龙语中的力量密码让你受益匪浅。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } }
      ]
    },
    {
      name: '阿如恒', soul: '泰坦巨猿', desc: '泰坦巨猿一族的强者，继承泰坦血脉，拥有恐怖的肉身力量。', color: '#886644', weight: 5, ageRange: [18, 50], events: [
        { text: '阿如恒以泰坦巨猿之力与你角力，纯力量的碰撞让你热血沸腾。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '阿如恒教你泰坦一族的炼体术，你的肉身强度得到显著提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '阿如恒讲述泰坦巨猿一族的传承，那份对力量的执着让你深受启发。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '韩泽', soul: '破魂枪', desc: '史莱克学院内院弟子，拥有破魂枪武魂，强攻系魂师，性格坚毅。', color: '#8866aa', weight: 5, ageRange: [14, 26], events: [
        { text: '韩泽以破魂枪演示枪法，枪出如龙的气势让你对枪道有了新的认识。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '韩泽与你切磋枪法，实战中的经验教训让你的战斗技巧更加纯熟。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 4; return 'sp+1, merit+4'; } },
        { text: '韩泽讲述他在史莱克学院的求学经历，那份坚持不懈的精神让你敬佩。', effect: (g) => { g.merit = (g.merit || 0) + 4; return 'merit+4'; } }
      ]
    }
  ],
  douluo4: [
    {
      name: '蓝轩宇', soul: '水元素掌控 / 金银龙王双血脉', desc: '终极斗罗主角，觉醒水元素掌控，后续觉醒金银龙王双血脉，龙神血脉继承者，天龙首座之子，拥有创造与毁灭的双重力量。', color: '#4488ff', weight: 12, ageRange: [6, 25], events: [
        { text: '蓝轩宇的金银双色龙神血脉与你产生共鸣，九元素之力在你体内隐隐涌动。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return 'sp+3'; } },
        { text: '蓝轩宇带你参观史莱克学院母星的战舰，星际时代的科技让你大开眼界。', effect: (g) => { g.gold = (g.gold || 0) + 40; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'gold+40, sp+1'; } },
        { text: '蓝轩宇展示"元素剥离"魂技，你亲眼看到敌人的元素护罩被一层层剥离。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+2, merit+5'; } }
      ]
    },
    {
      name: '白秀秀', soul: '深渊冰魔龙', desc: '蓝轩宇的伴侣，由魔魂大白鲨化形为深渊冰魔龙，后天龙族成员。', color: '#44ddff', weight: 10, ageRange: [8, 25], events: [
        { text: '白秀秀带你潜入深海的魔魂大白鲨领地，冰潮魂技在海底爆发，美丽而致命。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '白秀秀与蓝轩宇施展武魂融合技"深蓝凝视"，万年暗黑魔虎级别的强敌被瞬间冻结。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+2, merit+5'; } },
        { text: '白秀秀讲述她从魔魂大白鲨化形的经历，你对魂兽化形有了更深的理解。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '唐乐', soul: '金龙王', desc: '蓝轩宇之父，实为唐舞麟失忆后的身份，星际时代的传奇歌手与强者。', color: '#ffdd44', weight: 10, ageRange: [10, 40], events: [
        { text: '唐乐在你面前弹奏那首"灵魂歌神"级别的曲子，金龙王的记忆碎片在旋律中涌动。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return 'sp+3'; } },
        { text: '唐乐教你锻造之术，九级神匠的技法让你受益匪浅。', effect: (g) => { g.gold = (g.gold || 0) + 50; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'gold+50, sp+1'; } },
        { text: '唐乐带你去星际演唱会，全场观众在他的歌声中魂力共振，你也受益匪浅。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } }
      ]
    },
    {
      name: '娜娜', soul: '银龙王', desc: '蓝轩宇之母，实为古月娜失忆后的身份，古武系教师。', color: '#aa66ff', weight: 9, ageRange: [10, 40], events: [
        { text: '娜娜用元素掌控力教你基础古武，她的教学方法与传统截然不同，效果却极好。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '娜娜在教导你时银色蝎子辫微微发光，银龙王残留的元素之力让你武魂产生共鸣。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '娜娜讲述了她模糊记忆中关于"重要的人"的碎片，你感受到她内心深处的牵挂。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '钱磊', soul: '召唤金钱', desc: '蓝轩宇的挚友，拥有召唤武魂，能召唤强大的魂兽作战。', color: '#ffaa22', weight: 7, ageRange: [8, 25], events: [
        { text: '钱磊开启召唤之门，冻千秋的冰系力量从门中涌出，你第一次见到召唤系的实战威力。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '钱磊向你展示第二魂技"复刻"，完美复制了你的一个魂技并反手释放。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '钱磊请你吃了一顿大餐，席间讲述他在天罗初等学院垫底的糗事。', effect: (g) => { g.gold = (g.gold || 0) + 20; g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'gold+20, sp+1'; } }
      ]
    },
    {
      name: '冻千秋', soul: '魔魂大白鲨', desc: '蓝轩宇最初的伙伴之一，魔魂大白鲨公主，后成为白秀秀的一部分。', color: '#44aaff', weight: 7, ageRange: [8, 25], events: [
        { text: '冻千秋带你游览天斗星的冰原，极寒环境中的冰系魂技修炼让她游刃有余。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '冻千秋讲述她失去记忆后在人类世界的孤独，你对她产生了同情。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } },
        { text: '冻千秋教你冰系魂技的基础运用，你对冰元素的控制有了初步掌握。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } }
      ]
    },
    {
      name: '刘锋', soul: '白龙枪', desc: '蓝轩宇的挚友，拥有白龙枪武魂，敏攻系魂师，史莱克七怪之一。', color: '#4488ff', weight: 7, ageRange: [8, 25], events: [
        { text: '刘锋以白龙枪展示枪法，银龙枪出如流星，速度与精准的结合让你大开眼界。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '刘锋教你白龙枪的刺击技巧，你的枪法基础得到巩固。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 4; return 'sp+1, merit+4'; } },
        { text: '刘锋讲述他与蓝轩宇在天罗初等学院相识的往事，真挚的友情让你感动。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '原恩辉辉', soul: '泰坦巨猿 / 堕落天使', desc: '原恩夜辉的后代，拥有泰坦巨猿与堕落天使双武魂，天赋异禀。', color: '#662266', weight: 7, ageRange: [10, 28], events: [
        { text: '原恩辉辉以泰坦巨猿之拳展示力量，大地震颤中你感受到泰坦血脉的霸道。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '原恩辉辉展示堕落天使的黑暗之力，光与暗的交织让你对武魂属性有了新的理解。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '原恩辉辉讲述家族传承的故事，那份跨越万年的血脉羁绊让你感慨。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '蓝梦琴', soul: '玉凰琴', desc: '蓝轩宇的伙伴，拥有玉凰琴武魂，辅助系魂师，琴音中蕴含治愈与攻击之力。', color: '#88ddff', weight: 6, ageRange: [8, 25], events: [
        { text: '蓝梦琴以玉凰琴弹奏一曲，优美的琴音中你的魂力得到滋养。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '蓝梦琴展示玉凰琴的治愈之力，琴音所到之处伤势尽愈。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } },
        { text: '蓝梦琴与你合奏，音律与魂力的共鸣让你对武魂的理解更加深刻。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 3; return 'sp+1, merit+3'; } }
      ]
    },
    {
      name: '唐雨格', soul: '五行龙', desc: '蓝轩宇的伙伴，拥有五行龙武魂，能掌控五行元素，天赋卓绝。', color: '#ffaa44', weight: 7, ageRange: [10, 25], events: [
        { text: '唐雨格以五行龙之力展示五行轮转，金木水火土的循环让你对元素法则有了新的领悟。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '唐雨格教你五行相生相克之理，你对元素的理解更加全面。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 5; return 'sp+1, merit+5'; } },
        { text: '唐雨格讲述她与蓝轩宇在龙马星系的冒险，星际探险的故事让你心驰神往。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '唐震华', soul: '星际战舰', desc: '史莱克学院星际系教师，蓝轩宇的导师，顶尖的星际战术家。', color: '#4488cc', weight: 6, ageRange: [20, 50], events: [
        { text: '唐震华带你进行星际航行模拟训练，你对星际战舰的操作有了初步了解。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '唐震华讲授星际战术，太空中的战斗方式与传统魂师对决截然不同。', effect: (g) => { g.merit = (g.merit || 0) + 8; return 'merit+8'; } },
        { text: '唐震华讲述他在联邦军方的经历，星际时代的战争残酷让你深思。', effect: (g) => { g.merit = (g.merit || 0) + 6; return 'merit+6'; } }
      ]
    },
    {
      name: '肖启', soul: '天圣裂渊', desc: '史莱克学院教师，蓝轩宇的班主任，拥有天圣裂渊武魂，深不可测。', color: '#8866aa', weight: 6, ageRange: [20, 45], events: [
        { text: '肖启以天圣裂渊之力为你展示剑法，剑意滔天中你感受到他的强大。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '肖启指导你修炼基础，他的教学方式严谨而高效。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '肖启讲述他作为教师的理念，那份对学生的责任心让你感动。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '白凌霜', soul: '冰霜巨龙', desc: '白秀秀的族人，拥有冰霜巨龙武魂，龙族强者，性格冷傲。', color: '#88ddff', weight: 5, ageRange: [18, 40], events: [
        { text: '白凌霜以冰霜巨龙之力展示龙族冰系魂技，极寒龙息让你对冰元素有了更深的理解。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '白凌霜教你龙族冰系秘法，你的冰系魂技威力大增。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '白凌霜讲述龙族在星际时代的生存之道，种族的存续让你深思。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '李娜', soul: '银月', desc: '史莱克学院教师，古武系导师，拥有银月武魂，擅长近身格斗。', color: '#aaaaff', weight: 5, ageRange: [18, 40], events: [
        { text: '李娜以银月之力展示古武技巧，月华般的拳法让你对近身战斗有了新的认识。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '李娜指导你古武基础，一招一式皆是实战精华。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); g.merit = (g.merit || 0) + 4; return 'sp+1, merit+4'; } },
        { text: '李娜讲述她在史莱克学院的教学生涯，那份对古武传承的热爱让你敬佩。', effect: (g) => { g.merit = (g.merit || 0) + 4; return 'merit+4'; } }
      ]
    },
    {
      name: '羽沐曦', soul: '神圣天使', desc: '史莱克学院内院弟子，拥有神圣天使武魂，光明系魂师，乐正宇的后裔。', color: '#ffdd88', weight: 5, ageRange: [12, 26], events: [
        { text: '羽沐曦以神圣天使之光为你洗礼，光明的力量驱散了你体内的暗伤。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '羽沐曦展示神圣天使的治愈之力，圣光所至万物复苏。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } },
        { text: '羽沐曦讲述神圣家族的传承使命，那份守护光明的责任让你动容。', effect: (g) => { g.merit = (g.merit || 0) + 4; return 'merit+4'; } }
      ]
    },
    {
      name: '凌梓晨', soul: '时空之龙', desc: '史莱克学院内院天才，拥有时空之龙武魂，掌控时间与空间之力。', color: '#aa66ff', weight: 5, ageRange: [12, 26], events: [
        { text: '凌梓晨以时空之龙之力展示时间减速，时空的扭曲让你对法则之力有了初步认识。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '凌梓晨教你时空之力的基础运用，你对空间的理解更加深入。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '凌梓晨讲述她与时空之龙武魂的渊源，那份掌控时空的使命感让你敬佩。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    },
    {
      name: '龙当当', soul: '龙神变', desc: '龙族后裔，拥有龙神变武魂，龙族血脉纯正，实力强大。', color: '#ffdd44', weight: 5, ageRange: [14, 30], events: [
        { text: '龙当当以龙神变之力展示龙族秘技，龙神血脉的威压让你感受到龙族的强大。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return 'sp+2'; } },
        { text: '龙当当教你龙族炼体术，你的肉身强度得到显著提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 1, g.maxLevel); return 'sp+1'; } },
        { text: '龙当当讲述龙族的历史与荣耀，那份对龙族复兴的渴望让你感动。', effect: (g) => { g.merit = (g.merit || 0) + 5; return 'merit+5'; } }
      ]
    }
  ],
  godrealm: [
    {
      name: '海神唐三', soul: '海神三叉戟 / 修罗神', desc: '已飞升神界的唐三，海神与修罗神双神位拥有者，神界执法者。', color: '#4488ff', weight: 12, events: [
        { text: '海神唐三亲自指点你，神界法则的力量让你脱胎换骨。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 5, g.maxLevel); return '魂力+5级（神之指点）'; } },
        { text: '唐三向你展示海神三叉戟的十大能力，每一件都足以毁天灭地。', effect: (g) => { g.merit = (g.merit || 0) + 15; return '名声+15'; } }
      ]
    },
    {
      name: '小舞（神后）', soul: '修罗剑鞘', desc: '与唐三共用神位的神后，温柔而强大的存在，修罗神的剑鞘。', color: '#ff66aa', weight: 10, events: [
        { text: '神后小舞以生命之力为你治愈暗伤，你的修为更加稳固。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return '魂力+3级'; } },
        { text: '小舞讲述她与唐三在神界的日常，神界也有温馨的一面。', effect: (g) => { g.maxAge = (g.maxAge || 100) + 10; return '寿命+10年'; } }
      ]
    },
    {
      name: '善良之神', soul: '善良之心', desc: '神界五大神王之一，掌控善良法则的至高存在，与邪恶之神共同管理神界。', color: '#ffdd88', weight: 7, events: [
        { text: '善良之神赐予你一丝善良之力，你的内心变得更加纯粹。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); g.merit = (g.merit || 0) + 10; return '魂力+3级，名声+10'; } },
        { text: '善良之神向你展示神界的美好面，万物生长、生机盎然。', effect: (g) => { g.maxAge = (g.maxAge || 100) + 15; return '寿命+15年'; } }
      ]
    },
    {
      name: '邪恶之神', soul: '审判天平', desc: '神界五大神王之一，掌控邪恶与审判的至高存在，性格桀骜不驯。', color: '#664488', weight: 7, events: [
        { text: '邪恶之神考验你的意志，在审判天平前你证明了自己的价值。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 4, g.maxLevel); return '魂力+4级（通过考验）'; } },
        { text: '邪恶之神向你展示神界的黑暗面，弱肉强食是永恒的法则。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    },
    {
      name: '毁灭之神', soul: '毁灭权杖', desc: '神界五大神王之一，掌控毁灭法则的至高存在，与生命女神为伴侣。', color: '#aa2288', weight: 8, events: [
        { text: '毁灭之神向你展示了毁灭的真谛，力量与毁灭仅在一念之间。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 4, g.maxLevel); return '魂力+4级'; } },
        { text: '你卷入了毁灭之神与唐三的权力纷争，险些成为牺牲品。', effect: (g) => { if (Math.random() < 0.5) { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '侥幸脱身，魂力+2级'; } else { g.soulPower = Math.max(g.soulPower - 2, 1); return '被波及受伤，魂力-2级'; } } }
      ]
    },
    {
      name: '生命女神', soul: '生命之树', desc: '神界五大神王之一，掌控生命法则的至高存在，毁灭之神的妻子。', color: '#44ff88', weight: 8, events: [
        { text: '生命女神赐予你生命精华，你的生命力得到极大提升。', effect: (g) => { g.maxAge = (g.maxAge || 100) + 20; g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); return '寿命+20年，魂力+2级'; } },
        { text: '生命女神讲述她与毁灭之神的爱情故事，神界也有温情。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    },
    {
      name: '情绪之神霍雨浩', soul: '情绪之神', desc: '已飞升神界的霍雨浩，一级神祇情绪之神，唐三的女婿。', color: '#44ddff', weight: 8, events: [
        { text: '情绪之神以七种情绪之力为你洗礼，你的精神力达到新的高度。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 4, g.maxLevel); return '魂力+4级'; } },
        { text: '霍雨浩讲述他在神界与舞桐的生活，以及岳父唐三的"关照"。', effect: (g) => { g.merit = (g.merit || 0) + 10; return '名声+10'; } }
      ]
    },
    {
      name: '唐舞麟（金龙王）', soul: '金龙王 / 海神', desc: '已飞升神界的唐舞麟，海神与毁灭神双神位拥有者，蓝轩宇之父。', color: '#ffdd44', weight: 7, events: [
        { text: '唐舞麟以金龙王之力为你淬炼肉身，你的身体强度堪比神兽。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 4, g.maxLevel); return '魂力+4级'; } },
        { text: '唐舞麟讲述他与古月娜在神界的重逢，万年等待终有回报。', effect: (g) => { g.maxAge = (g.maxAge || 100) + 15; return '寿命+15年'; } }
      ]
    },
    {
      name: '七原罪神·贪食之神', soul: '饕餮之胃', desc: '毁灭之神麾下七大原罪神之一，代表贪食的原罪。', color: '#aa6644', weight: 5, events: [
        { text: '贪食之神邀请你品尝神界珍馐，食物中蕴含的神力让你修为大涨。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 2, g.maxLevel); g.gold = (g.gold || 0) + 50; return '魂力+2级，金币+50'; } },
        { text: '贪食之神的饕餮之胃险些将你也吞进去！', effect: (g) => { if (Math.random() < 0.7) { return '侥幸逃脱'; } else { g.soulPower = Math.max(g.soulPower - 2, 1); return '被吞噬部分神力，魂力-2级'; } } }
      ]
    },
    {
      name: '七元素神·火神', soul: '火焰神格', desc: '神界七大元素神之首，掌控火焰元素的一级神祇。', color: '#ff4422', weight: 5, events: [
        { text: '火神以神火为你淬炼神格，你的火系能力大幅提升。', effect: (g) => { g.soulPower = Math.min(g.soulPower + 3, g.maxLevel); return '魂力+3级'; } },
        { text: '火神与你切磋，火焰的力量让你对元素法则有了更深的理解。', effect: (g) => { g.merit = (g.merit || 0) + 8; return '名声+8'; } }
      ]
    }
  ]
};

