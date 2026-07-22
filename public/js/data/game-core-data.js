// GAME DATA
// ============================================================
const TIMELINES = [
  { id: 'godrealm', name: '神界传说', era: '唐三成神前的神界时代', desc: '唐三尚未飞升神界，神界秩序初定。神祇与神兽并存，法则运转，万灵共生。', weight: 10, factions: ['神界委员会', '海神阁', '毁灭之神阵营', '生命女神阵营'], soulRingMode: 'divine', maxLevel: 150, eraColor: '#ffdd44' },
  { id: 'douluo1', name: '斗罗大陆 I', era: '唐三时代（约万年前）', desc: '武魂殿势力庞大，三足鼎立。武魂觉醒、魂师大赛盛行，魂导器尚未普及。', weight: 30, factions: ['武魂殿', '昊天宗', '七宝琉璃宗', '蓝电霸王龙家族', '史莱克学院', '天斗帝国', '星罗帝国'], soulRingMode: 'hunt', maxLevel: 99, eraColor: '#4488ff' },
  { id: 'douluo2', name: '绝世唐门', era: '霍雨浩时代（斗一万年后）', desc: '武魂殿已灭亡，日月大陆碰撞合并。魂导器崛起，末期传灵塔初创。', weight: 25, factions: ['史莱克学院', '唐门', '日月皇室', '天魂帝国', '斗灵帝国', '传灵塔(末期)'], soulRingMode: 'hunt', maxLevel: 99, eraColor: '#44ddaa' },
  { id: 'douluo3', name: '龙王传说', era: '唐舞麟时代（斗二万年后）', desc: '魂导科技高度发达，魂兽濒临灭绝。传灵塔崛起，斗铠成为主流。', weight: 20, factions: ['传灵塔', '史莱克学院', '唐门', '圣灵教', '天魂帝国', '斗灵帝国', '星罗帝国'], soulRingMode: 'spirit', maxLevel: 99, eraColor: '#aa66ff' },
  { id: 'douluo4', name: '终极斗罗', era: '蓝轩宇时代（斗三万年后）', desc: '斗罗联邦成立，星际殖民时代。魂力上限突破120级，龙马星系接触。', weight: 15, factions: ['斗罗联邦军方', '史莱克学院', '传灵塔', '唐门', '太空家族'], soulRingMode: 'spirit', maxLevel: 150, eraColor: '#ff6644' }
];

const INNATE_POWER = [
  { min: 0, max: 0, name: '0级', rating: '废武魂', ratingColor: '#888', weight: 8, desc: '武魂觉醒但无魂力，无法修炼' },
  { min: 1, max: 3, name: '1-3级', rating: '普通', ratingColor: '#aaa', weight: 25, desc: '大多数平民的水平，修炼较慢' },
  { min: 4, max: 6, name: '4-6级', rating: '良好', ratingColor: '#4488ff', weight: 28, desc: '具备一定天赋，可进入主流宗门' },
  { min: 7, max: 9, name: '7-9级', rating: '优秀', ratingColor: '#44ddaa', weight: 20, desc: '天赋出众，修炼速度快' },
  { min: 10, max: 10, name: '10级', rating: '先天满魂力', ratingColor: '#ffdd44', weight: 12, desc: '顶级天赋，各大宗门争抢对象' },
  { min: 11, max: 19, name: '11-19级', rating: '超出极限', ratingColor: '#aa66ff', weight: 5, desc: '极为罕见，觉醒即可附加第二魂环' },
  { min: 20, max: 20, name: '20级', rating: '神级天赋', ratingColor: '#ff4444', weight: 2, desc: '史上仅有，觉醒即可附加两个魂环' }
];

const IDENTITY_TYPES = {
  human: [{ id: 'human', name: '人类', weight: 50, color: '#4488ff', desc: '万物之灵，拥有无限可能的种族。' }],
  soul_beast: [{ id: 'soul_beast', name: '魂兽', weight: 50, color: '#aa4444', desc: '大自然的宠儿，天生拥有强悍肉身。' }],
  god: [{ id: 'god', name: '神祇', weight: 60, color: '#ffdd44', desc: '神界之灵，掌控法则的至高存在。' }],
  divine_beast: [{ id: 'divine_beast', name: '神兽', weight: 40, color: '#ff8800', desc: '神界孕育的灵兽，天赋异禀，可修炼成神。' }]
};

const HUMAN_BACKGROUNDS = [
  { id: 'commoner', name: '普通平民', weight: 30, desc: '出身平凡，凭借自身努力闯荡大陆。' },
  { id: 'noble', name: '帝国贵族', weight: 15, desc: '生来便拥有资源与地位，修炼起步更高。' },
  { id: 'sect_disciple', name: '宗门弟子', weight: 20, desc: '自幼在宗门长大，有名师指导。' },
  { id: 'family_child', name: '魂师世家子弟', weight: 15, desc: '家族传承，血脉中流淌着强大的力量。' },
  { id: 'rogue', name: '散修', weight: 15, desc: '无门无派，自由自在，但也无人庇护。' },
  { id: 'orphan', name: '孤儿', weight: 5, desc: '自幼流浪，命途多舛，但也可能遇到奇遇。' }
];

const BEAST_RACES = [
  { id: 'beast_wolf', name: '疾风狼', weight: 12, desc: '速度极快的狼形魂兽，群居猎食，擅长围攻。' },
  { id: 'beast_tiger', name: '暗金恐爪熊', weight: 8, desc: '力量型魂兽，暗金色的利爪可撕裂空间。' },
  { id: 'beast_snake', name: '碧磷蛇皇', weight: 10, desc: '剧毒蛇类魂兽，独孤博的武魂原型。' },
  { id: 'beast_eagle', name: '苍穹之鹰', weight: 10, desc: '天空霸主，锐利的目光可看穿一切伪装。' },
  { id: 'beast_bear', name: '泰坦巨猿', weight: 8, desc: '力量恐怖的巨猿，一拳可碎山岳，天青牛蟒的挚友。' },
  { id: 'beast_dragon', name: '蓝电霸王龙', weight: 6, desc: '龙族血脉的霸王龙，雷霆之力覆盖全身。' },
  { id: 'beast_phoenix', name: '邪火凤凰', weight: 7, desc: '拥有邪火的凤凰，攻守兼备但需要控制邪火。' },
  { id: 'beast_turtle', name: '玄冰龟', weight: 10, desc: '防御极强的龟类魂兽，冰系能力让敌人寸步难行。' },
  { id: 'beast_rabbit', name: '柔骨魅兔', weight: 8, desc: '敏捷极高的兔类魂兽，近身肉搏不输任何对手。' },
  { id: 'beast_scorpion', name: '冰碧帝皇蝎', weight: 5, desc: '冰系顶级魂兽，拥有极致之冰与剧毒双重能力。' },
  { id: 'beast_whale', name: '深海魔鲸', weight: 4, desc: '海洋霸主，体型巨大，魂力深不可测。' },
  { id: 'beast_lion', name: '烈焰雄狮', weight: 8, desc: '火系狮形魂兽，烈焰鬃毛中蕴含恐怖的火焰之力。' },
  { id: 'beast_fox', name: '九尾灵狐', weight: 6, desc: '拥有九条尾巴的灵狐，精神力极强，擅长幻术。' },
  { id: 'beast_crocodile', name: '暗影鳄王', weight: 8, desc: '潜伏暗处的鳄鱼魂兽，咬合力惊人。' },
  { id: 'beast_peacock', name: '七彩神孔雀', weight: 5, desc: '美丽的孔雀魂兽，尾羽中蕴含七种元素之力。' },
  { id: 'beast_spider', name: '人面魔蛛', weight: 7, desc: '面如人形的恐怖蜘蛛，蛛丝坚不可摧。' },
  { id: 'beast_deer', name: '三眼金猊', weight: 3, desc: '传说中的命运之兽，三只眼睛可看透命运。' },
  { id: 'beast_horse', name: '幽冥白虎', weight: 4, desc: '暗属性虎形魂兽，幽冥之力可吞噬一切。' },
  { id: 'beast_cat', name: '幽冥灵猫', weight: 8, desc: '暗影中潜行的猫类魂兽，速度与暗杀并重。' },
  { id: 'beast_leech', name: '天梦冰蚕', weight: 3, desc: '精神系冰蚕，百万年级别的存在，拥有无与伦比的精神力。' }
];

// 神兽种族（神界传说专用）
const DIVINE_BEAST_RACES = [
  { id: 'divine_dragon', name: '青龙', weight: 10, color: '#44aa44', desc: '东方七宿之神，掌管生机与雷霆，神兽之首。' },
  { id: 'divine_phoenix', name: '凤凰', weight: 8, color: '#ff4422', desc: '不死神鸟，涅槃重生，南明离火焚尽邪祟。' },
  { id: 'divine_tiger', name: '白虎', weight: 8, color: '#dddddd', desc: '西方镇守之神，杀伐果断，金庚之气锐不可当。' },
  { id: 'divine_tortoise', name: '玄武', weight: 8, color: '#2244aa', desc: '北方镇守之神，龟蛇合体，防御与水法无双。' },
  { id: 'divine_qilin', name: '麒麟', weight: 7, color: '#ffaa44', desc: '祥瑞之兽，仁慈之主，踏火而行，福泽苍生。' },
  { id: 'divine_kunpeng', name: '鲲鹏', weight: 5, color: '#226688', desc: '北冥之鱼，化而为鸟，扶摇直上九万里。' },
  { id: 'divine_dijiang', name: '帝江', weight: 4, color: '#664466', desc: '混沌神兽，无面目而识歌舞，空间之主。' },
  { id: 'divine_zhenming', name: '真明鸟', weight: 6, color: '#ffdd44', desc: '神界使者，鸣声如钟，一鸣则天下大白。' },
  { id: 'divine_bixie', name: '辟邪', weight: 7, color: '#aa8844', desc: '镇宅神兽，食虎豹，辟邪祟，正气凛然。' },
  { id: 'divine_baize', name: '白泽', weight: 6, color: '#eeeeee', desc: '知万物之情貌，通晓天下鬼神之事，智慧神兽。' },
  { id: 'divine_jian', name: '毕方', weight: 5, color: '#ff6622', desc: '火灾之兆，单足神鸟，其鸣自呼，见则有火。' },
  { id: 'divine_chongming', name: '重明鸟', weight: 5, color: '#ffdd88', desc: '双瞳神鸟，能退妖恶，状如鸡而鸣似凤。' }
];

const GOD_TIERS = [
  { id: 'god_official', name: '无神位神官', weight: 35, desc: '神界的基层存在，拥有神力但无神位。' },
  { id: 'god_3', name: '三级神祇', weight: 30, desc: '掌管一方小域的初级神祇。' },
  { id: 'god_2', name: '二级神祇', weight: 20, desc: '实力强大的中层神祇。' },
  { id: 'god_1', name: '一级神祇', weight: 12, desc: '神界核心战力，掌控重要法则。' },
  { id: 'god_king', name: '神王', weight: 3, desc: '至高存在，神界最强者。' }
];

// ============================================================
// GOD EXCLUSIVE WHEEL DATA
// ============================================================
const GOD_POSITIONS = {
  god_king: [
    { name: '修罗神', desc: '神界执法者，执掌杀戮与审判，战力无双。', color: '#aa2222' },
    { name: '善良之神', desc: '神界两大神王之一，掌控善良法则。', color: '#ffdd44' },
    { name: '邪恶之神', desc: '神界两大神王之一，掌控邪恶法则。', color: '#6622aa' },
    { name: '毁灭之神', desc: '神界执法者，执掌毁灭与破坏。', color: '#444444' },
    { name: '生命女神', desc: '神界执法者，执掌生命与创造。', color: '#22aa44' }
  ],
  god_1: [
    { name: '海神', desc: '大海的主宰，掌控海洋之力。', color: '#4488ff' },
    { name: '罗刹神', desc: '执掌怨念与杀戮的黑暗神祇。', color: '#aa2266' },
    { name: '天使神', desc: '光明与神圣的化身，六翼天使之力。', color: '#ffdd44' },
    { name: '火神', desc: '火焰的主宰，焚尽万物的炽热之力。', color: '#ff4422' },
    { name: '水神', desc: '柔水之力，润泽万物。', color: '#22aaff' },
    { name: '风神', desc: '执掌风暴与疾风，速度无双。', color: '#44ddaa' },
    { name: '雷神', desc: '天罚之雷，威震九天。', color: '#aa88ff' },
    { name: '黑暗之神', desc: '深渊暗影，吞噬光明。', color: '#333355' },
    { name: '光明之神', desc: '驱散黑暗，普照大地。', color: '#ffee88' },
    { name: '龙神（残魂）', desc: '远古至高存在的一缕残魂，仍有惊天之力。', color: '#ffaa00' }
  ],
  god_2: [
    { name: '食神', desc: '掌控美食与治愈之力。', color: '#ffaa66' },
    { name: '九彩神女', desc: '九彩光芒，辅助无双。', color: '#ff66aa' },
    { name: '速度之神', desc: '极致速度，瞬息万里。', color: '#44ddff' },
    { name: '战神', desc: '战斗本能，越战越勇。', color: '#ff4444' },
    { name: '凤凰之神', desc: '涅槃重生，不死火焰。', color: '#ff6622' },
    { name: '白虎之神', desc: '白虎煞气，刚猛无俦。', color: '#aaaaaa' },
    { name: '玄武之神', desc: '坚不可摧，防御无双。', color: '#2266aa' },
    { name: '朱雀之神', desc: '南明离火，焚天煮海。', color: '#ff2222' },
    { name: '大力神', desc: '神力无穷，力拔山兮。', color: '#aa6622' },
    { name: '智慧之神', desc: '洞察万物，算无遗策。', color: '#66aaff' }
  ],
  god_3: [
    { name: '花神', desc: '百花之主，操控植物。', color: '#ff66aa' },
    { name: '月神', desc: '月光之力，清冷幽远。', color: '#aaccff' },
    { name: '星神', desc: '星辰之力，命运推演。', color: '#4444ff' },
    { name: '山神', desc: '山脉之灵，厚重沉稳。', color: '#886644' },
    { name: '河神', desc: '江河之灵，川流不息。', color: '#22aaff' },
    { name: '匠神', desc: '锻造神器，鬼斧神工。', color: '#aa8844' },
    { name: '医神', desc: '治愈万物，妙手回春。', color: '#44ff88' },
    { name: '乐神', desc: '音律之力，摄人心魄。', color: '#ff88cc' },
    { name: '酒神', desc: '醉意朦胧，千杯不醉。', color: '#ccaa44' },
    { name: '猎神', desc: '追踪猎杀，百发百中。', color: '#44aa44' }
  ],
  god_official: [
    { name: '巡猎者', desc: '神界巡逻兵，维护秩序。', color: '#8888aa' },
    { name: '神界侍从', desc: '侍奉神祇的基层人员。', color: '#aaaaaa' },
    { name: '神域守卫', desc: '守卫神域入口的战士。', color: '#666688' },
    { name: '天神巡猎者', desc: '巡查下界的天神使者。', color: '#7788aa' },
    { name: '神界文员', desc: '处理神界事务的文职人员。', color: '#9999bb' }
  ]
};

const GOD_ARTIFACTS = {
  god_king: [
    { name: '修罗魔剑', desc: '超神器，修罗神专属，杀戮之力可斩天地。', color: '#aa0000' },
    { name: '善良之心', desc: '超神器，善良神王专属，净化一切邪恶。', color: '#ffdd00' },
    { name: '邪恶之剑', desc: '超神器，邪恶神王专属，腐蚀万物灵魂。', color: '#6600aa' },
    { name: '毁灭权杖', desc: '超神器，毁灭神王专属，一念灭世。', color: '#333333' },
    { name: '生命古树', desc: '超神器，生命女神专属，生生不息。', color: '#00aa44' }
  ],
  god_1: [
    { name: '海神三叉戟', desc: '伪超神器，大海权柄的象征。', color: '#4488ff' },
    { name: '天使圣剑', desc: '伪超神器，光明与审判之力。', color: '#ffdd44' },
    { name: '罗刹魔镰', desc: '伪超神器，收割灵魂的死亡之镰。', color: '#aa2266' },
    { name: '烈焰神剑', desc: '伪超神器，焚尽八荒的火焰之剑。', color: '#ff4422' },
    { name: '玄冰神枪', desc: '伪超神器，冻结万物的寒冰之枪。', color: '#22aaff' },
    { name: '雷神之锤', desc: '伪超神器，天雷汇聚的毁灭之锤。', color: '#aa88ff' }
  ],
  god_2: [
    { name: '神器·食神鼎', desc: '神器，烹煮万物的神鼎。', color: '#ffaa66' },
    { name: '神器·九彩绫', desc: '神器，九彩光芒化作的绫带。', color: '#ff66aa' },
    { name: '神器·疾风靴', desc: '神器，穿上可御风而行。', color: '#44ddff' },
    { name: '神器·战神铠', desc: '神器，百战不灭的战神铠甲。', color: '#ff4444' },
    { name: '神器·凤凰翎', desc: '神器，蕴含涅槃之力的凤羽。', color: '#ff6622' },
    { name: '神器·玄武盾', desc: '神器，坚如磐石的神盾。', color: '#2266aa' }
  ],
  god_3: [
    { name: '伪神器·花神杖', desc: '伪神器，操控百花的花杖。', color: '#ff66aa' },
    { name: '伪神器·月华镜', desc: '伪神器，映照月光的宝镜。', color: '#aaccff' },
    { name: '伪神器·星罗盘', desc: '伪神器，推演星辰的罗盘。', color: '#4444ff' },
    { name: '伪神器·山河图', desc: '伪神器，内蕴山河的画卷。', color: '#886644' },
    { name: '伪神器·流水琴', desc: '伪神器，弹奏江河之音的古琴。', color: '#22aaff' }
  ],
  god_official: [
    { name: '无神器', desc: '神官尚未获得神器认可。', color: '#888888' },
    { name: '神官佩剑', desc: '普通神兵，仅有些许神力加持。', color: '#aaaaaa' },
    { name: '巡猎令牌', desc: '身份象征，可调用微量神力。', color: '#999999' }
  ]
};

const GOD_FACTIONS_POOL = [
  { name: '神界委员会', desc: '神界最高权力机构，五大神王共治。', weight: 15, color: '#ffdd44' },
  { name: '海神阁', desc: '海神一脉的势力，掌控海洋法则。', weight: 18, color: '#4488ff' },
  { name: '修罗神殿', desc: '修罗神直属，执掌杀戮与审判。', weight: 12, color: '#aa2222' },
  { name: '生命神殿', desc: '生命女神麾下，守护万物生灵。', weight: 15, color: '#22aa44' },
  { name: '毁灭阵营', desc: '毁灭之神派系，主张变革与破坏。', weight: 12, color: '#444444' },
  { name: '散修神祇', desc: '不隶属于任何势力的自由神祇。', weight: 28, color: '#8888aa' }
];

// Faction signature martial souls
const FACTION_SOULS = {
  '武魂殿': ['六翼天使', '天使圣剑', '圣光权杖', '审判之锤', '神圣之盾', '光之翼', '圣裁十字', '天使之环'],
  '昊天宗': ['昊天锤', '昊天锤（变异）', '破天枪', '裂地锤', '震天环', '昊天九绝'],
  '七宝琉璃宗': ['七宝琉璃塔', '九宝琉璃塔', '琉璃圣杖', '七宝神灯', '琉璃镜', '七宝琴'],
  '蓝电霸王龙家族': ['蓝电霸王龙', '雷龙之枪', '紫电双龙', '雷霆之翼', '蓝电长戟', '雷龙之爪'],
  '史莱克学院': ['蓝银草（强化）', '光明圣龙', '碧磷蛇皇', '幽冥灵猫', '邪火凤凰', '柔骨魅兔', '冰碧帝皇蝎'],
  '唐门': ['唐门暗器', '鬼影迷踪', '玄天功', '紫极魔瞳', '玄玉手', '控鹤擒龙', '蓝银草', '昊天锤'],
  '日月皇室': ['日月凤凰', '光明圣龙', '太阳天使', '月光天使', '日月光环', '日月之翼'],
  '天魂帝国': ['冰天雪女', '寒冰凤凰', '冰碧蛇', '极光龙', '霜冻巨熊', '冰晶龙'],
  '斗灵帝国': ['灵眸白虎', '幽冥白虎', '灵猫', '暗金恐爪熊', '灵眼金蟒'],
  '传灵塔': ['灵冰塔', '光明之塔', '审判之塔', '灵眸圣光', '传灵神光', '灵塔圣剑'],
  '圣灵教': ['黑暗圣龙', '死神之镰', '暗影魔龙', '堕落天使', '黑暗之塔', '圣灵圣剑'],
  '斗罗联邦军方': ['联邦战甲', '星际之枪', '光明圣龙', '雷霆之枪', '光能圣剑'],
  '太空家族': ['星辰圣龙', '宇宙之翼', '星际战锤', '银河长戟', '太空圣弓'],
  '神界委员会': ['神之审判', '法则之书', '创世之锤', '命运之轮', '混沌之矛'],
  '海神阁': ['海神三叉戟', '海神之盾', '碧波圣剑', '海龙之枪', '海神之心', '潮汐之环'],
  '毁灭之神阵营': ['毁灭之刃', '毁灭之锤', '毁灭圣剑', '末日之枪', '虚无之盾'],
  '生命女神阵营': ['生命之树', '治愈圣杖', '生命之泉', '翡翠之盾', '自然之弓']
};

function getFactionSoulPool(factionName, quality) {
  let factionSouls = FACTION_SOULS[factionName];
  if (!factionSouls) return null;
  let pool = buildSoulNamePool();
  // Map faction souls to the appropriate quality tier
  let results = factionSouls.map(name => {
    if (quality === 'common') return { name, type: '器武魂', quality: '普通', qColor: '#888' };
    if (quality === 'good') return { name, type: '器武魂', quality: '优秀', qColor: '#4488ff' };
    if (quality === 'mutant') return { name, type: '变异武魂', quality: '优秀~顶级', qColor: '#aa66ff' };
    if (quality === 'top') return { name, type: '器武魂', quality: '顶级', qColor: '#ffdd44' };
    if (quality === 'dual') return { name, type: '双生武魂', quality: '顶级+', qColor: '#ff4444' };
    return { name, type: '器武魂', quality: quality, qColor: '#888' };
  });
  return results;
}

// ============================================================
// AWARDENING COUNT WHEEL
// ============================================================
const AWAKENING_COUNT = [
  { id: 'one', name: '觉醒1个武魂', weight: 55, desc: '只有一个武魂，但可以更专注地修炼。', count: 1, color: '#4488ff' },
  { id: 'two', name: '觉醒2个武魂', weight: 30, desc: '双武魂同时觉醒，能力更加全面。', count: 2, color: '#aa66ff' },
  { id: 'three', name: '觉醒3个武魂', weight: 12, desc: '三武魂觉醒，极为罕见！', count: 3, color: '#ffdd44' },
  { id: 'four', name: '觉醒4个武魂', weight: 3, desc: '四武魂觉醒，万中无一的奇迹！', count: 4, color: '#ff4444' }
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

const SOUL_CORE_ATTRS = ['力量', '速度', '精神', '魂力', '防御', '攻击'];

const SOUL_LEVELS = [
  { min: 1, max: 10, name: '魂士' }, { min: 11, max: 20, name: '魂师' }, { min: 21, max: 30, name: '大魂师' },
  { min: 31, max: 40, name: '魂尊' }, { min: 41, max: 50, name: '魂宗' }, { min: 51, max: 60, name: '魂王' },
  { min: 61, max: 70, name: '魂帝' }, { min: 71, max: 80, name: '魂圣' }, { min: 81, max: 90, name: '魂斗罗' },
  { min: 91, max: 95, name: '封号斗罗' }, { min: 96, max: 98, name: '超级斗罗' }, { min: 99, max: 99, name: '极限斗罗' },
  { min: 100, max: 109, name: '神阶' }, { min: 110, max: 119, name: '真神级' }, { min: 120, max: 149, name: '超神级' },
  { min: 150, max: 200, name: '神王级' }
];

const QUICK_RANDOM_INNATE_POOLS = [
  { name: '先天魂力0级', min: 0, max: 0, weight: 20, ratingColor: '#888' },
  { name: '先天魂力1~5级', min: 1, max: 5, weight: 50, ratingColor: '#4488ff' },
  { name: '先天魂力6~9级', min: 6, max: 9, weight: 25, ratingColor: '#ffdd44' },
  { name: '先天满魂力（10级）', min: 10, max: 10, weight: 5, ratingColor: '#ff4444' }
];

const BASE_RING_LIMITS = [423, 764, 1760, 5000, 12000, 20000, 30000, 50000, 100000];

const RING_QUALITY_MULTIPLIERS = { 普通: 1.0, 优秀: 1.3, 变异: 1.6, 顶级: 2.0, 双生: 3.0, '优秀~顶级': 1.8 };

const SOUL_RING_COLORS = [
  { max: 9, color: 'white', cn: '白色', css: 'w', bg: '#cccccc' },
  { max: 999, color: 'yellow', cn: '黄色', css: 'y', bg: '#dddd00' },
  { max: 9999, color: 'purple', cn: '紫色', css: 'p', bg: '#aa00ff' },
  { max: 99999, color: 'black', cn: '黑色', css: 'b', bg: '#333333' },
  { max: 999999, color: 'red', cn: '红色', css: 'r', bg: '#ff0000' },
  { max: Infinity, color: 'gold', cn: '橙金色', css: 'g', bg: '#ffaa00' }
];

const GODHOOD_INHERIT_GODS = ['海神', '火神', '水神', '风神', '雷神', '战神', '速度之神', '食神'];

const GODHOOD_CUSTOM_TITLES = ['毁灭与创造之神', '时空主宰', '命运编织者', '元素帝君', '灵魂至高神'];

const ROMANCE_CHARACTER_NAME_POOLS = {
  malePlayerTargets: ['小舞', '宁荣荣', '朱竹清', '千仞雪', '唐舞桐', '古月娜', '白秀秀', '冻千秋', '生命女神', '圣灵斗罗雅莉'],
  femalePlayerTargets: ['唐三', '戴沐白', '奥斯卡', '马红俊', '唐昊', '独孤博', '比比东', '霍雨浩', '贝贝', '和菜头', '玄老', '穆老', '唐舞麟', '谢邂', '蓝轩宇', '唐乐', '钱磊', '海神唐三', '情绪之神霍雨浩', '唐舞麟（金龙王）', '毁灭之神', '善良之神', '邪恶之神', '七原罪神·贪食之神', '七元素神·火神']
};

const EVENT_TYPE_LABELS = { cultivate: '修炼', social: '社交', battle: '战斗', fortune: '机缘', crisis: '危机' };

const SAVE_RATING_COLORS = { SS: '#ffdd44', S: '#ff8844', A: '#44dd88', B: '#4488ff', C: '#aaaaaa', D: '#888888' };

const PROTAGONIST_STATUS_MAP = {
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

const DIVINE_SKILL_UNLOCK_THRESHOLDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

const DIVINE_SKILL_POOL = [
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

const SOUL_BEAST_DOMAIN_MAP = {
  火系: '烈焰领域', 冰系: '极寒领域', 雷系: '雷霆领域', 风系: '风暴领域', 土系: '大地领域',
  水系: '深海领域', 木系: '生命之域', 暗系: '暗影领域', 光系: '光明领域', 毒系: '万毒领域',
  精神系: '精神领域', 龙系: '龙威领域', 空间系: '虚空领域', 时间系: '时光领域', 吞噬系: '吞噬领域'
};

const MARTIAL_SOUL_DOMAIN_MAP = {
  攻击: '杀神领域', 防御: '不动领域', 控制: '幻境领域', 辅助: '祝福领域', 敏攻: '极速领域', 强攻: '战魂领域'
};

// Keep IDENTITIES for backwards compatibility in other code
const IDENTITIES = {
  human: HUMAN_BACKGROUNDS,
  soul_beast: BEAST_RACES,
  god: GOD_TIERS
};

// ============================================================
// SOUL BEAST BLOODLINES (血脉系)
// ============================================================
const BEAST_BLOODLINES = [
  { id: 'fire', name: '火系', weight: 15, color: '#ff4444', desc: '炎阳之力，烈焰焚天，极致之火可焚尽万物。', attr: { power: 1.2, defense: 0.9 } },
  { id: 'ice', name: '冰系', weight: 12, color: '#44ddff', desc: '极寒之冰，冰封千里，极致之冰可冻结时空。', attr: { power: 1.1, defense: 1.1 } },
  { id: 'thunder', name: '雷系', weight: 12, color: '#ffdd44', desc: '雷霆万钧，电光火石，速度与力量并存。', attr: { power: 1.15, defense: 0.95 } },
  { id: 'wind', name: '风系', weight: 10, color: '#88ff88', desc: '疾风之速，无影无踪，天下武功唯快不破。', attr: { power: 0.9, defense: 0.8, speed: 1.3 } },
  { id: 'earth', name: '土系', weight: 10, color: '#aa8844', desc: '厚土之德，稳如泰山，防御力超群。', attr: { power: 0.8, defense: 1.4 } },
  { id: 'water', name: '水系', weight: 8, color: '#4488ff', desc: '上善若水，变化万千，可攻可守可治愈。', attr: { power: 0.9, defense: 1.0, heal: 1.2 } },
  { id: 'wood', name: '木系', weight: 6, color: '#44aa44', desc: '生命之木，生生不息，拥有强大的恢复能力。', attr: { power: 0.7, defense: 0.8, heal: 1.5 } },
  { id: 'dark', name: '暗系', weight: 10, color: '#8844aa', desc: '幽冥之暗，吞噬一切，令人恐惧的力量。', attr: { power: 1.25, defense: 0.85 } },
  { id: 'light', name: '光系', weight: 8, color: '#ffdd88', desc: '圣光普照，驱散黑暗，神圣不可侵犯。', attr: { power: 1.1, defense: 1.0, heal: 1.1 } },
  { id: 'poison', name: '毒系', weight: 6, color: '#44aa66', desc: '万毒之体，剧毒侵蚀，沾之即死。', attr: { power: 1.15, defense: 0.75 } },
  { id: 'spirit', name: '精神系', weight: 5, color: '#dd88ff', desc: '精神之力，无形无相，掌控心灵。', attr: { power: 1.0, defense: 0.7, control: 1.4 } },
  { id: 'dragon', name: '龙系', weight: 5, color: '#ff8800', desc: '龙族血脉，万兽之王，天生霸主。', attr: { power: 1.4, defense: 1.2 } },
  { id: 'space', name: '空间系', weight: 3, color: '#66aaff', desc: '空间之力，撕裂虚空，神出鬼没。', attr: { power: 1.1, defense: 0.8, space: 1.5 } },
  { id: 'time', name: '时间系', weight: 2, color: '#ff66aa', desc: '时间法则，操控因果，最为稀有的血脉。', attr: { power: 1.3, defense: 0.6, time: 1.8 } },
  { id: 'devour', name: '吞噬系', weight: 3, color: '#662266', desc: '吞噬万物，化为己用，永无止境。', attr: { power: 1.3, defense: 0.9, devour: 1.5 } }
];

// ============================================================
// SOUL BEAST BIRTHPLACES - Filtered by Timeline
// ============================================================
function getBeastBirthplaces(timelineId) {
  // Base locations (available in most timelines)
  let base = [
    { id: 'xingdou_core', name: '星斗大森林核心区', weight: 15, color: '#228844', desc: '魂兽圣地，十万年魂兽栖息之地，机遇与危险并存。', attr: { power: 1.3, risk: 1.3 } },
    { id: 'xingdou_edge', name: '星斗大森林外围', weight: 20, color: '#44aa66', desc: '魂兽天堂，资源丰富，但强者众多。', attr: { power: 1.1, risk: 1.0 } },
    { id: 'jibei', name: '极北之地', weight: 12, color: '#88ccff', desc: '冰天雪地，极致之冰的发源地，冰系魂兽的乐园。', attr: { power: 1.2, ice: 1.4 } },
    { id: 'luori', name: '落日森林', weight: 15, color: '#aa8844', desc: '温暖湿润，植被茂密，适合各类魂兽繁衍。', attr: { power: 1.0, risk: 0.8 } },
    { id: 'deep_sea', name: '深海', weight: 8, color: '#2244aa', desc: '神秘莫测的海底世界，蕴藏着远古的力量。', attr: { power: 1.15, secret: 1.3 } },
    { id: 'cave', name: '地底洞穴', weight: 6, color: '#664422', desc: '黑暗幽深的地下迷宫，隐藏着古老的宝藏。', attr: { power: 1.1, secret: 1.4 } },
    { id: 'volcano', name: '火山地带', weight: 8, color: '#ff6622', desc: '烈焰之地，火系魂兽的天然修炼场。', attr: { power: 1.2, fire: 1.3 } },
    { id: 'swamp', name: '迷雾沼泽', weight: 6, color: '#668844', desc: '毒雾弥漫，危机四伏，毒系魂兽的温床。', attr: { power: 1.0, poison: 1.4 } },
    { id: 'mountain', name: '魂兽山脉', weight: 10, color: '#886644', desc: '连绵起伏的山脉，力量型魂兽的聚集地。', attr: { power: 1.15, risk: 0.9 } }
  ];

  switch (timelineId) {
    case 'douluo1': // 唐三时代 - 星斗大森林最繁盛
      return base.map(b => {
        if (b.id === 'xingdou_core') { b.weight = 18; b.desc = '万年前的星斗大森林，生命之湖能量充沛，百万年魂兽潜伏。'; }
        if (b.id === 'xingdou_edge') { b.weight = 22; }
        if (b.id === 'luori') { b.weight = 15; b.desc = '冰火两仪眼仍在，植被茂密，各类魂兽繁衍生息。'; }
        if (b.id === 'swamp') { b.weight = 6; }
        return b;
      });

    case 'douluo2': // 绝世唐门 - 日月大陆碰撞
      return base.map(b => {
        if (b.id === 'xingdou_core') { b.weight = 12; b.desc = '星斗大森林核心区缩小，生命之湖仍是魂兽圣地。'; }
        if (b.id === 'xingdou_edge') { b.weight = 15; b.desc = '魂兽因人类扩张而减少，外围危险度降低。'; }
        if (b.id === 'jibei') { b.weight = 15; b.desc = '极北之地仍为冰系魂兽乐园，冰碧帝皇蝎的领地。'; }
        if (b.id === 'luori') { b.weight = 10; b.desc = '落日森林因人类开发而逐渐缩小。'; }
        if (b.id === 'mountain') { b.weight = 8; }
        return b;
      }).concat([
        { id: 'mingdu', name: '明都山脉', weight: 8, color: '#662200', desc: '日月帝国首都附近的山脉，魂导器影响下魂兽变异频发。', attr: { power: 1.1, tech: 1.3 } }
      ]);

    case 'douluo3': // 龙王传说 - 魂兽濒临灭绝
      return base.filter(b => b.id !== 'xingdou_core' && b.id !== 'xingdou_edge')
        .map(b => {
          if (b.id === 'luori') { b.weight = 8; b.desc = '落日森林几乎消失，魂兽数量锐减。'; }
          if (b.id === 'jibei') { b.weight = 10; b.desc = '极北之地冰川融化，冰系魂兽濒危。'; }
          if (b.id === 'deep_sea') { b.weight = 12; b.desc = '深海成为魂兽最后避难所，龙谷藏于海底。'; }
          if (b.id === 'cave') { b.weight = 12; b.desc = '地底洞穴成为隐藏魂兽的庇护所，暗藏龙族遗迹。'; }
          if (b.id === 'mountain') { b.weight = 8; }
          return b;
        }).concat([
          { id: 'spirit_tower', name: '传灵塔', weight: 15, color: '#44aaff', desc: '传灵塔人造魂灵诞生地，魂兽新形态的摇篮。', attr: { power: 1.0, spirit: 1.5 } },
          { id: 'dragon_valley', name: '龙谷秘境', weight: 8, color: '#ff8800', desc: '隐藏的龙族栖息地，龙系魂兽的最后净土。', attr: { power: 1.5, secret: 1.6 } }
        ]);

    case 'douluo4': // 终极斗罗 - 星际时代
      return [
        { id: 'douluo_star', name: '斗罗母星', weight: 20, color: '#44aa66', desc: '人类的母星，魂兽生态保护区仅存少量。', attr: { power: 0.8, risk: 0.5 } },
        { id: 'dragon_world', name: '龙界', weight: 15, color: '#ff8800', desc: '龙族独立空间，龙系魂兽的终极家园。', attr: { power: 1.4, risk: 1.1 } },
        { id: 'spirit_star', name: '精灵星', weight: 18, color: '#88dd44', desc: '魂兽迁徙后的新家园，生态完整。', attr: { power: 1.1, secret: 1.2 } },
        { id: 'longma', name: '龙马星系', weight: 15, color: '#dd44ff', desc: '外星魂兽聚集地，拥有独特的外星魂兽种族。', attr: { power: 1.2, alien: 1.5 } },
        { id: 'abyss', name: '深渊通道', weight: 12, color: '#442266', desc: '深渊生物入侵的通道，深渊魂兽的巢穴。', attr: { power: 1.5, risk: 1.8 } },
        { id: 'deep_sea', name: '深海', weight: 10, color: '#2244aa', desc: '深海魂兽仍存在，但面临人类科技的威胁。', attr: { power: 1.1, secret: 1.2 } },
        { id: 'space', name: '太空领域', weight: 5, color: '#222266', desc: '星际空间，存在稀有的宇宙级魂兽。', attr: { power: 1.5, space: 1.6 } },
        { id: 'cave', name: '地底遗迹', weight: 5, color: '#664422', desc: '远古地底遗迹，埋藏着上古魂兽的秘密。', attr: { power: 1.2, secret: 1.5 } }
      ];

    case 'godrealm': // 神界传说 - 神界时代
      return [
        { id: 'god_forest', name: '神界森林', weight: 25, color: '#44dd88', desc: '神界生态区，魂兽在此受神界法则庇护，可修炼成神兽。', attr: { power: 1.2, divine: 1.3 } },
        { id: 'god_abyss', name: '神界深渊', weight: 15, color: '#6644aa', desc: '神界边缘的深渊区域，暗属性魂兽聚集。', attr: { power: 1.3, secret: 1.4 } },
        { id: 'god_realm', name: '神域秘境', weight: 20, color: '#ffdd44', desc: '神界遗留的远古秘境，异兽横行。', attr: { power: 1.4, divine: 1.5 } },
        { id: 'god_beast', name: '神兽领域', weight: 20, color: '#ff8844', desc: '神兽专属领地，只有最强大的魂兽才能踏足。', attr: { power: 1.6, divine: 1.6 } },
        { id: 'god_sea', name: '神界天河', weight: 10, color: '#4488ff', desc: '神界天河之水，水系神兽的栖息地。', attr: { power: 1.1, divine: 1.2 } },
        { id: 'god_ice', name: '神界冰原', weight: 10, color: '#88ddff', desc: '神界极寒之地，冰系神兽的修炼圣地。', attr: { power: 1.2, divine: 1.1 } }
      ];

    default:
      return base;
  }
}

const GENDERS = [
  { id: 'male', name: '男', weight: 50, desc: '标准男性身份，适用所有男性向剧情与势力。' },
  { id: 'female', name: '女', weight: 48, desc: '标准女性身份，适用所有女性向剧情与势力。' },
  { id: 'none', name: '无', weight: 2, desc: '仅魂兽可选，不受部分情缘限制。' }
];

const PERSONALITIES = [
  { id: 'gentle', name: '温柔善良', weight: 15, color: '#ffaaaa', desc: '待人温和，心地善良，容易获得他人好感。', traits: { social: 1.2, romance: 1.3, enemy: 0.8 } },
  { id: 'proud', name: '高傲冷艳', weight: 12, color: '#8888ff', desc: '性格高傲，不易接近，但实力往往不凡。', traits: { social: 0.9, romance: 1.1, enemy: 1.3 } },
  { id: 'hotblood', name: '热血冲动', weight: 15, color: '#ff4444', desc: '热血奔放，行事果决，朋友众多但也容易树敌。', traits: { social: 1.1, romance: 1.0, enemy: 1.2 } },
  { id: 'calm', name: '冷静沉稳', weight: 15, color: '#4488dd', desc: '遇事冷静，思维缜密，擅长布局。', traits: { social: 1.0, romance: 0.9, enemy: 1.1 } },
  { id: 'crafty', name: '腹黑狡黠', weight: 10, color: '#aa44aa', desc: '心机深沉，喜怒不形于色，善于算计。', traits: { social: 0.8, romance: 0.9, enemy: 1.4 } },
  { id: 'cheerful', name: '开朗活泼', weight: 12, color: '#ffcc44', desc: '阳光开朗，充满活力，走到哪里都能带来欢笑。', traits: { social: 1.3, romance: 1.2, enemy: 0.7 } },
  { id: 'mysterious', name: '神秘莫测', weight: 8, color: '#6644aa', desc: '来历神秘，性格难以捉摸，自带独特魅力。', traits: { social: 0.7, romance: 1.2, enemy: 1.0 } },
  { id: 'ruthless', name: '杀伐果断', weight: 8, color: '#aa2222', desc: '冷酷无情，行事狠辣，敌人闻风丧胆。', traits: { social: 0.6, romance: 0.7, enemy: 1.5 } },
  { id: 'lazy', name: '慵懒随性', weight: 5, color: '#88aa88', desc: '性格懒散，随遇而安，但关键时刻绝不掉链子。', traits: { social: 1.0, romance: 1.1, enemy: 0.6 } }
];

const APPEARANCES = [
  { id: 'common', name: '普通', weight: 25, color: '#aaaaaa', desc: '平凡无奇的容貌，扔进人堆里就找不到了。', attr: { charm: 3 } },
  { id: 'good', name: '清秀', weight: 25, color: '#88ccff', desc: '五官端正，眉眼清秀，看着很舒服。', attr: { charm: 6 } },
  { id: 'handsome', name: '俊朗', weight: 20, color: '#44aaff', desc: '英俊帅气，气质出众，走到哪里都有人回头。', attr: { charm: 8 } },
  { id: 'beautiful', name: '绝色', weight: 12, color: '#ff66aa', desc: '容貌绝世，倾国倾城，令人一见难忘。', attr: { charm: 9 } },
  { id: 'divine', name: '神颜', weight: 5, color: '#ffdd44', desc: '不似凡间所有的完美容貌，自带神辉。', attr: { charm: 10 } },
  { id: 'fierce', name: '凶相', weight: 5, color: '#aa4444', desc: '面目狰狞，气场逼人，小孩见了都要哭。', attr: { charm: 2, intimidate: 8 } },
  { id: 'weird', name: '怪异', weight: 3, color: '#66aa66', desc: '容貌奇特，或有胎记异瞳，辨识度极高。', attr: { charm: 4, unique: 8 } },
  { id: 'weak', name: '体弱', weight: 5, color: '#aaaaaa', desc: '面色苍白，体弱多病，我见犹怜。', attr: { charm: 7, weak: 1 } }
];

// 情侣候选池（根据玩家性别和性格筛选）
const LOVER_POOL = {
  male_target: [
    { name: '温柔师姐', trait: 'gentle', soul: '辅助系', weight: 20 },
    { name: '冷艳魔女', trait: 'proud', soul: '强攻系', weight: 15 },
    { name: '活泼少女', trait: 'cheerful', soul: '敏攻系', weight: 18 },
    { name: '腹黑谋士', trait: 'crafty', soul: '控制系', weight: 12 },
    { name: '神秘御姐', trait: 'mysterious', soul: '未知', weight: 10 },
    { name: '霸道女王', trait: 'ruthless', soul: '强攻系', weight: 8 },
    { name: '邻家小妹', trait: 'gentle', soul: '食物系', weight: 10 },
    { name: '高冷圣女', trait: 'proud', soul: '辅助系', weight: 7 }
  ],
  female_target: [
    { name: '温润师兄', trait: 'gentle', soul: '强攻系', weight: 20 },
    { name: '冰山男神', trait: 'proud', soul: '控制系', weight: 15 },
    { name: '阳光少年', trait: 'cheerful', soul: '敏攻系', weight: 18 },
    { name: '腹黑阁主', trait: 'crafty', soul: '辅助系', weight: 12 },
    { name: '神秘来客', trait: 'mysterious', soul: '未知', weight: 10 },
    { name: '霸道少主', trait: 'ruthless', soul: '强攻系', weight: 8 },
    { name: '暖心学长', trait: 'gentle', soul: '食物系', weight: 10 },
    { name: '高冷宗主', trait: 'proud', soul: '控制系', weight: 7 }
  ]
};

// 强敌候选池（按时间线定制·原著人物）
const ENEMY_POOL = {
  douluo1: [
    { name: '赵无极', power: 0.9, weight: 18, type: 'official', desc: '史莱克学院副院长，大力金刚熊武魂，力大无穷。' },
    { name: '玉天恒', power: 1.0, weight: 15, type: 'fate', desc: '蓝电霸王龙家族天才，蓝电霸王龙武魂。' },
    { name: '独孤博', power: 1.2, weight: 10, type: 'evil', desc: '碧磷蛇皇武魂，封号毒斗罗，亦正亦邪。' },
    { name: '菊斗罗月关', power: 1.4, weight: 6, type: 'official', desc: '武魂殿封号斗罗，奇茸通天菊武魂。' },
    { name: '鬼斗罗鬼魅', power: 1.4, weight: 5, type: 'evil', desc: '武魂殿封号斗罗，鬼魅武魂，与菊斗罗有融合技。' },
    { name: '比比东', power: 1.8, weight: 2, type: 'cult', desc: '武魂殿教皇，双生武魂罗刹神继承人。' },
    { name: '千寻疾', power: 1.6, weight: 3, type: 'official', desc: '前武魂殿教皇，六翼天使武魂。' },
    { name: '时年', power: 0.8, weight: 15, type: 'evil', desc: '苍晖学院老师，残梦武魂，擅长精神攻击。' },
    { name: '邪月', power: 1.1, weight: 8, type: 'official', desc: '武魂殿黄金一代，月刃武魂。' },
    { name: '胡列娜', power: 1.0, weight: 8, type: 'fate', desc: '武魂殿圣女，妖狐武魂，魅惑能力极强。' }
  ],
  douluo2: [
    { name: '戴华斌', power: 0.9, weight: 18, type: 'fate', desc: '白虎公爵府嫡子，白虎武魂，霍雨浩的宿敌。' },
    { name: '笑红尘', power: 1.0, weight: 15, type: 'official', desc: '日月帝国魂导师天才，三足金蟾武魂。' },
    { name: '梦红尘', power: 1.0, weight: 12, type: 'official', desc: '笑红尘的妹妹，冰蚕武魂。' },
    { name: '橘子', power: 1.1, weight: 8, type: 'fate', desc: '日月帝国皇后，霍雨浩的故人，极富谋略。' },
    { name: '圣灵教教主', power: 1.5, weight: 5, type: 'evil', desc: '圣灵教教主，邪魂师之首。' },
    { name: '钟离乌', power: 1.3, weight: 8, type: 'evil', desc: '圣灵教教主，死灵圣法神伊莱克斯的敌人。' },
    { name: '帝天', power: 1.8, weight: 3, type: 'beast', desc: '魂兽共主，金眼黑龙王，兽神。' },
    { name: '邪魂师', power: 0.8, weight: 15, type: 'evil', desc: '修炼邪魂术的魂师，以吞噬他人魂力提升。' },
    { name: '镜红尘', power: 1.2, weight: 6, type: 'official', desc: '日月帝国明德堂堂主，九级魂导师。' },
    { name: '张鹏', power: 1.0, weight: 10, type: 'betray', desc: '史莱克学院叛徒，暗中投靠圣灵教。' }
  ],
  douluo3: [
    { name: '圣灵教教主', power: 1.3, weight: 12, type: 'evil', desc: '圣灵教教主，深渊位面的代理人。' },
    { name: '魔皇', power: 1.6, weight: 4, type: 'evil', desc: '圣灵教教主，深海魔鲸王之妻。' },
    { name: '龙跃', power: 1.1, weight: 10, type: 'fate', desc: '星罗帝国龙跃，山龙王武魂。' },
    { name: '戴云儿', power: 1.0, weight: 12, type: 'fate', desc: '星罗帝国公主，幽冥灵猫武魂。' },
    { name: '传灵塔叛徒', power: 0.9, weight: 15, type: 'betray', desc: '传灵塔中的叛徒，暗中与圣灵教勾结。' },
    { name: '深渊君主', power: 1.5, weight: 5, type: 'beast', desc: '深渊位面的君主，实力恐怖。' },
    { name: '冥帝', power: 1.7, weight: 3, type: 'evil', desc: '圣灵教二帝之一，冥界掌控者。' },
    { name: '枫无羽', power: 1.2, weight: 6, type: 'official', desc: '传灵塔高层，野心勃勃。' },
    { name: '圣灵教使徒', power: 1.0, weight: 15, type: 'official', desc: '圣灵教的核心成员，实力强大。' },
    { name: '恩慈', power: 1.4, weight: 5, type: 'cult', desc: '星罗帝国国师，本体宗宗主。' }
  ],
  douluo4: [
    { name: '天龙星首座', power: 1.6, weight: 5, type: 'official', desc: '天龙星的最强者，龙族至尊。' },
    { name: '天马星首座', power: 1.5, weight: 6, type: 'official', desc: '天马星的最强者，与天龙星首座齐名。' },
    { name: '深红之母', power: 1.8, weight: 3, type: 'evil', desc: '深红之域的主宰，吞噬一切的存在。' },
    { name: '皇元朗', power: 1.1, weight: 12, type: 'fate', desc: '天龙星金龙公主的追求者，火龙族。' },
    { name: '星际海盗', power: 0.9, weight: 18, type: 'betray', desc: '星际间的掠夺者，作恶多端。' },
    { name: '叛徒神祇', power: 1.3, weight: 8, type: 'cult', desc: '背叛斗罗联邦的神祇，投靠深红之域。' },
    { name: '深红之域生物', power: 1.0, weight: 15, type: 'evil', desc: '深红之域的入侵生物，数量庞大。' },
    { name: '龙骑士', power: 1.2, weight: 8, type: 'official', desc: '天龙星的龙骑士，战力极强。' },
    { name: '蓝佛子', power: 1.0, weight: 10, type: 'fate', desc: '深海魔鲸王的女儿，亦正亦邪。' },
    { name: '依子尘', power: 1.1, weight: 5, type: 'fate', desc: '史莱克学院极限斗罗，与凌梓晨相伴。' }
  ],
  godrealm: [
    { name: '毁灭之神', power: 1.8, weight: 5, type: 'official', desc: '神界执法者，执掌毁灭与破坏，神界委员会成员。' },
    { name: '七原罪神', power: 1.5, weight: 8, type: 'cult', desc: '毁灭之神麾下，七大原罪神，各有神通。' },
    { name: '龙神残魂', power: 2.0, weight: 2, type: 'fate', desc: '远古龙神的一缕残魂，仍有毁天灭地之力。' },
    { name: '神界叛逆', power: 1.2, weight: 12, type: 'god', desc: '神界的叛逆神祇，野心勃勃。' },
    { name: '时空乱流生物', power: 1.6, weight: 5, type: 'fate', desc: '时空乱流中的恐怖生物，侵蚀神界。' },
    { name: '深渊位面侵蚀者', power: 1.4, weight: 8, type: 'evil', desc: '深渊位面的入侵者，试图吞噬神界。' },
    { name: '流放神兽', power: 1.3, weight: 10, type: 'beast', desc: '被神界流放的神兽，心怀怨恨。' },
    { name: '心魔劫', power: 1.1, weight: 15, type: 'inner', desc: '修炼中的心魔，最难以对付的敌人。' },
    { name: '金龙王', power: 1.9, weight: 3, type: 'fate', desc: '龙神的一半，力量的化身，被封印于神界。' },
    { name: '银龙王', power: 1.9, weight: 2, type: 'fate', desc: '龙神的一半，精神的化身，魂兽共主。' }
  ]
};

// 魂兽专属敌人池（原著魂兽）
const BEAST_ENEMY_POOL = [
  { name: '二明', power: 1.4, weight: 8, type: 'beast_king', desc: '泰坦巨猿，星斗大森林的霸主之一，力大无穷。' },
  { name: '大明', power: 1.6, weight: 5, type: 'beast_king', desc: '天青牛蟒，星斗大森林真正的王者，十万年魂兽。' },
  { name: '小舞父亲', power: 1.3, weight: 8, type: 'beast', desc: '柔骨兔一族的强者，十万年魂兽。' },
  { name: '蓝电霸王龙', power: 1.2, weight: 12, type: 'beast', desc: '龙族血脉的兽武魂魂兽，雷霆之力覆盖全身。' },
  { name: '人类猎魂师', power: 0.9, weight: 15, type: 'human', desc: '前来猎杀魂兽获取魂环的人类魂师' },
  { name: '邪魂师猎手', power: 1.1, weight: 10, type: 'evil_human', desc: '用邪术猎杀魂师的邪魂师，对魂兽也极具威胁' },
  { name: '天劫雷罚', power: 1.3, weight: 8, type: 'heaven', desc: '修为突破引发的天地雷劫' },
  { name: '暗魔邪神虎', power: 1.5, weight: 4, type: 'beast', desc: '邪恶而强大的魂兽，拥有时空之力。' },
  { name: '人面魔蛛', power: 1.0, weight: 15, type: 'beast', desc: '剧毒蜘蛛形魂兽，人面蛛身，极度危险。' },
  { name: '冰碧帝皇蝎', power: 1.4, weight: 5, type: 'beast', desc: '极北三大天王之一，极致之冰的主宰。' },
  { name: '魂兽叛徒', power: 1.0, weight: 10, type: 'traitor', desc: '投靠人类的堕落魂兽' },
  { name: '心魔侵蚀', power: 0.8, weight: 10, type: 'inner', desc: '修炼中产生的凶性反噬' }
];

const MARTIAL_SOULS = [
  { id: 'common_weapon', name: '普通器武魂', type: '器武魂', quality: '普通', qColor: '#888', weight: 25, desc: '如铜锤、菜刀等常见器物武魂。', examples: ['铜锤', '铁剑', '木盾', '长枪'] },
  { id: 'common_beast', name: '普通兽武魂', type: '兽武魂', quality: '普通', qColor: '#888', weight: 20, desc: '如灰狼、野猪等常见兽武魂。', examples: ['灰狼', '野猪', '黑熊', '猎鹰'] },
  { id: 'good_weapon', name: '优秀器武魂', type: '器武魂', quality: '优秀', qColor: '#4488ff', weight: 15, desc: '如宝剑、法杖等较为强力的器武魂。', examples: ['七星剑', '玄铁盾', '紫电笔', '天罗伞'] },
  { id: 'good_beast', name: '优秀兽武魂', type: '兽武魂', quality: '优秀', qColor: '#4488ff', weight: 12, desc: '如烈焰狮、寒冰蛇等强力兽武魂。', examples: ['烈焰狮', '寒冰蛇', '雷鹰', '风狼'] },
  { id: 'mutant', name: '变异武魂', type: '变异武魂', quality: '优秀~顶级', qColor: '#aa66ff', weight: 10, desc: '基因突变产生的异变武魂，可能更强或更弱。', examples: ['变异蓝银草', '火属性白虎', '暗影凤凰'] },
  { id: 'top_weapon', name: '顶级器武魂', type: '器武魂', quality: '顶级', qColor: '#ffdd44', weight: 6, desc: '世界顶尖器武魂，天生成就神级。', examples: ['昊天锤', '七宝琉璃塔', '天罡斧', '末日之刃'] },
  { id: 'top_beast', name: '顶级兽武魂', type: '兽武魂', quality: '顶级', qColor: '#ffdd44', weight: 6, desc: '世界顶尖兽武魂，战力惊人。', examples: ['蓝电霸王龙', '六翼天使', '邪眸白虎', '火凤凰'] },
  { id: 'dual', name: '双生武魂', type: '双生武魂', quality: '顶级+', qColor: '#ff4444', weight: 1, desc: '极其罕见，同时觉醒两种武魂，如唐三。', examples: ['蓝银草+昊天锤'] }
];

// ============================================================
// MARTIAL SOUL NAME POOL (1000+ names)
// ============================================================
let SOUL_NAME_POOL = null;

function buildSoulNamePool() {
  if (SOUL_NAME_POOL) return SOUL_NAME_POOL;
  let pool = { common: [], good: [], mutant: [], top: [], dual: [] };

  // Element/material prefixes (trimmed for 900 total)
  let elements = ['烈焰', '寒冰', '狂雷', '疾风', '暗影', '圣光', '金刚', '碧水', '厚土', '猛毒'];
  let materials = ['玄铁', '紫金', '碧玉', '寒冰', '烈焰', '雷晶', '风灵', '暗影', '圣光', '龙骨'];
  let animals = ['狼', '狮', '虎', '豹', '熊', '鹰', '蛇', '龙', '凤', '龟', '蟒', '蝎', '蛛', '蝠', '隼', '鹿', '猫', '犬', '猿', '象'];
  let weapons = ['剑', '刀', '枪', '戟', '斧', '锤', '鞭', '盾', '伞', '笛', '扇', '鼎', '镜', '笔', '琴', '针', '环', '戈', '棍', '刺'];

  // Common: 50 weapons + 50 beasts = 100
  let commonW = ['铜锤', '铁剑', '木盾', '长枪', '菜刀', '扫帚', '锄头', '镰刀', '斧头', '匕首', '铁棍', '木弓', '石锤', '短刀', '铁鞭', '铜镜', '算盘', '毛笔', '折扇', '茶壶', '扁担', '锅铲', '铁钳', '石斧', '骨针', '木槌', '铜锣', '铁锏', '石刀', '骨剑', '飞镖', '弹弓', '木矛', '铜戟', '铁叉', '石棍', '骨棒', '木锤', '皮甲', '布袋', '铜鼎', '铁锅', '木碗', '石碗', '铜勺', '铁筷子', '木梳', '铜簪', '铁环', '石珠'];
  commonW.forEach(n => pool.common.push({ name: n, type: '器武魂', quality: '普通', qColor: '#888' }));
  let commonB = ['灰狼', '野猪', '黑熊', '猎鹰', '野猫', '狐狸', '兔子', '鹿', '蛇', '蜘蛛', '蝎子', '蜈蚣', '老鼠', '蝙蝠', '乌鸦', '麻雀', '青蛙', '蜥蜴', '蜜蜂', '蚂蚁', '土狗', '山羊', '公鸡', '鸭子', '鹅', '奶牛', '黄牛', '驴子', '骡子', '刺猬', '松鼠', '花栗鼠', '鼹鼠', '穿山甲', '犰狳', '水獭', '海豹', '企鹅', '鸵鸟', '火鸡', '鸽子', '鹦鹉', '金丝雀', '燕子', '喜鹊', '乌鸦', '猫头鹰', '啄木鸟', '鸳鸯', '鹌鹑'];
  commonB.forEach(n => pool.common.push({ name: n, type: '兽武魂', quality: '普通', qColor: '#888' }));

  // Good: 10 materials x 20 weapons = 200 + 10 elements x 20 animals = 200 = 400
  materials.forEach(m => {
    weapons.forEach(w => {
      pool.good.push({ name: m + w, type: '器武魂', quality: '优秀', qColor: '#4488ff' });
    });
  });
  elements.forEach(e => {
    animals.forEach(a => {
      pool.good.push({ name: e + a, type: '兽武魂', quality: '优秀', qColor: '#4488ff' });
    });
  });

  // Mutant: 18 prefixes x 10 animals = 180 + 20 bases = 200
  let mutantBases = ['变异蓝银草', '火属性白虎', '暗影凤凰', '冰火双头蛇', '雷暗双属性狼', '血瞳魔狼', '幽冥紫豹', '圣光金龙', '暗金恐爪熊', '三眼金猊', '赤金玄武', '暗影裂空座', '光明圣龙', '黑暗魔龙', '时空双龙', '混沌青牛', '鸿蒙凤凰', '太虚甲龙', '乾坤斗罗', '星海鲸鲨'];
  let mutantPrefixes = ['变异', '暗金', '圣灵', '幽冥', '混沌', '太虚', '鸿蒙', '乾坤', '星海', '血瞳', '天启', '末日', '创世', '灭世', '永恒', '虚无', '深渊', '苍穹'];
  mutantPrefixes.forEach(p => {
    animals.slice(0, 10).forEach(a => {
      pool.mutant.push({ name: p + a, type: '变异武魂', quality: '优秀~顶级', qColor: '#aa66ff' });
    });
  });
  mutantBases.forEach(n => pool.mutant.push({ name: n, type: '变异武魂', quality: '优秀~顶级', qColor: '#aa66ff' }));

  // Top: 30 weapons + 20 beasts + 10 prefixes x 15 animals = 30 + 20 + 150 = 200
  let topW = ['昊天锤', '七宝琉璃塔', '天罡斧', '末日之刃', '轩辕剑', '盘古斧', '崆峒印', '昆仑镜', '神农鼎', '伏羲琴', '女娲石', '东皇钟', '诛仙剑', '戮仙剑', '陷仙剑', '绝仙剑', '盘古幡', '太极图', '混沌钟', '乾坤鼎', '造化玉碟', '十二品莲台', '山河社稷图', '炼妖壶', '昆仑剑', '天帝剑', '九幽镰', '星陨锤', '龙皇戟', '凤鸣琴'];
  topW.forEach(n => pool.top.push({ name: n, type: '器武魂', quality: '顶级', qColor: '#ffdd44' }));
  let topB = ['蓝电霸王龙', '六翼天使', '邪眸白虎', '火凤凰', '冰凤凰', '金龙王', '银龙王', '深海魔鲸', '天青牛蟒', '泰坦巨猿', '暗金恐爪熊', '三眼金猊', '地狱魔龙', '光明圣龙', '冰碧蝎', '极北之主', '翡翠天鹅', '妖眼魔树', '山龙王', '海龙王'];
  let topElements = ['九彩', '十首', '万年', '百万年', '远古', '上古', '太古', '洪荒', '混沌', '天命'];
  topElements.forEach(te => {
    animals.slice(0, 15).forEach(a => {
      pool.top.push({ name: te + a + '王', type: '兽武魂', quality: '顶级', qColor: '#ffdd44' });
    });
  });
  topB.forEach(n => pool.top.push({ name: n, type: '兽武魂', quality: '顶级', qColor: '#ffdd44' }));

  // Dual: handled specially
  pool.dual = null;

  SOUL_NAME_POOL = pool;
  return pool;
}

// ============================================================
// SOUL EVOLUTION SYSTEM
// ============================================================
const SOUL_EVOLUTIONS = {
  '蓝银草': { type: 'replace', stages: ['蓝银皇', '蓝银帝皇'], levels: [50, 90], ages: [20, 35], powers: [5, 10], descs: ['蓝银草觉醒皇者血脉，生命力大幅增强', '蓝银皇进化为帝皇，掌控万千蓝银草'] },
  '昊天锤': { type: 'replace', stages: ['昊天霸锤', '昊天神锤'], levels: [70, 95], ages: [25, 40], powers: [8, 10], descs: ['昊天锤威力更胜，一锤定音', '昊天锤进化为神级，天地变色'] },
  '邪眸白虎': { type: 'replace', stages: ['幽冥白虎', '白虎战神'], levels: [60, 90], ages: [25, 40], powers: [8, 10], descs: ['白虎与幽冥融合，威力倍增', '白虎进化为战神，统御战场'] },
  '火凤凰': { type: 'replace', stages: ['不死凤凰', '九首凤凰'], levels: [60, 90], ages: [25, 40], powers: [8, 10], descs: ['凤凰涅槃，获得不死之力', '凤凰进化为九首，焚尽万物'] },
  '冰凤凰': { type: 'replace', stages: ['极寒冰凤', '冰霜神凰'], levels: [60, 90], ages: [25, 40], powers: [8, 10], descs: ['冰凤凝聚极寒之力', '冰凤进化为神凰，冰封天地'] },
  '六翼天使': { type: 'replace', stages: ['八翼天使', '十二翼天使'], levels: [70, 95], ages: [25, 40], powers: [8, 10], descs: ['天使之翼增加，神圣之力提升', '天使进化为神级，光芒普照'] },
  '七宝琉璃塔': { type: 'replace', stages: ['九宝琉璃塔', '十二宝琉璃塔'], levels: [60, 90], ages: [25, 40], powers: [8, 10], descs: ['琉璃塔层数增加，辅助能力大增', '琉璃塔进化为神级，万法不侵'] },
  '蓝电霸王龙': { type: 'replace', stages: ['雷霆霸王龙', '雷神霸王龙'], levels: [60, 90], ages: [25, 40], powers: [8, 10], descs: ['霸王龙掌控雷霆之力', '霸王龙进化为雷神，万雷臣服'] },
  '金龙王': { type: 'replace', stages: ['龙神金身', '不灭龙神'], levels: [80, 100], ages: [30, 50], powers: [10, 10], descs: ['金龙王凝聚龙神之躯', '金龙王达到不灭之境'] },
  '银龙王': { type: 'replace', stages: ['元素龙皇', '元素神龙王'], levels: [80, 100], ages: [30, 50], powers: [10, 10], descs: ['银龙王掌控全元素', '银龙王进化为元素之神'] },
  '深海魔鲸': { type: 'replace', stages: ['深海魔鲸王', '深海魔鲸皇'], levels: [60, 90], ages: [25, 40], powers: [8, 10], descs: ['魔鲸统御深海', '魔鲸皇威震海洋'] },
  '轩辕剑': { type: 'replace', stages: ['轩辕圣剑', '轩辕神剑'], levels: [70, 95], ages: [25, 40], powers: [8, 10], descs: ['轩辕剑觉醒圣道之力', '轩辕剑进化为神级，斩妖除魔'] },
  '诛仙剑': { type: 'replace', stages: ['诛仙阵剑', '诛仙神剑'], levels: [70, 95], ages: [25, 40], powers: [8, 10], descs: ['诛仙剑蕴含阵道之力', '诛仙剑进化为神级，诛灭仙神'] },
  '变异蓝银草': { type: 'replace', stages: ['变异蓝银皇', '混沌蓝银帝'], levels: [50, 90], ages: [20, 35], powers: [6, 10], descs: ['变异蓝银草觉醒皇者之力', '进化为混沌蓝银帝，掌控生死'] },
  '暗影凤凰': { type: 'replace', stages: ['幽冥凤凰', '暗影神凰'], levels: [60, 90], ages: [25, 40], powers: [8, 10], descs: ['暗影凤凰掌控幽冥之火', '进化为暗影神凰，焚尽灵魂'] },
  '暗金恐爪熊': { type: 'replace', stages: ['暗金熊王', '暗金熊皇'], levels: [60, 90], ages: [25, 40], powers: [8, 10], descs: ['恐爪熊觉醒王血', '进化为熊皇，撕裂空间'] },
  '三眼金猊': { type: 'replace', stages: ['命运金猊', '命运神兽'], levels: [70, 95], ages: [25, 40], powers: [8, 10], descs: ['三眼金猊掌控命运之力', '进化为命运神兽，窥视天机'] },
  '_DEFAULT_WEAPON_': { type: 'prefix', stages: ['灵·', '圣·', '神·'], levels: [25, 50, 80], ages: [18, 30, 45], powers: [2, 5, 10], descs: ['器武魂经魂力蕴养，灵性初开', '器武魂进化为圣器，威力倍增', '器武魂进化为神器，毁天灭地'] },
  '_DEFAULT_BEAST_': { type: 'suffix', stages: ['王', '皇', '帝'], levels: [25, 50, 80], ages: [18, 30, 45], powers: [2, 5, 10], descs: ['兽武魂血脉觉醒，进化为王者', '兽武魂王血沸腾，进化为皇者', '兽武魂达到帝级，统御一方'] },
  '_DEFAULT_MUTANT_': { type: 'suffix', stages: ['·觉醒', '·完全体', '·神话'], levels: [30, 60, 90], ages: [20, 35, 50], powers: [3, 6, 10], descs: ['变异武魂基因稳定，展现真正力量', '变异武魂达到完全体，潜力全部释放', '变异武魂进化为神话级，超越极限'] }
};

