// ============================================================
// DATA MODULE - All game data lists and constants
// Extracted from app.js for separation of concerns
// Depends on: G (global game state)
// ============================================================

// ============================================================
// GAME DATA - Core Constants
// ============================================================
const TIMELINES = [
  {id:'godrealm',name:'神界传说',era:'唐三成神前的神界时代',desc:'唐三尚未飞升神界，神界秩序初定。神祇与神兽并存，法则运转，万灵共生。',weight:10,factions:['神界委员会','海神阁','毁灭之神阵营','生命女神阵营'],soulRingMode:'divine',maxLevel:150,eraColor:'#ffdd44'},
  {id:'douluo1',name:'斗罗大陆 I',era:'唐三时代（约万年前）',desc:'武魂殿势力庞大，三足鼎立。武魂觉醒、魂师大赛盛行，魂导器尚未普及。',weight:30,factions:['武魂殿','昊天宗','七宝琉璃宗','蓝电霸王龙家族','史莱克学院','天斗帝国','星罗帝国'],soulRingMode:'hunt',maxLevel:99,eraColor:'#4488ff'},
  {id:'douluo2',name:'绝世唐门',era:'霍雨浩时代（斗一万年后）',desc:'武魂殿已灭亡，日月大陆碰撞合并。魂导器崛起，末期传灵塔初创。',weight:25,factions:['史莱克学院','唐门','日月皇室','天魂帝国','斗灵帝国','传灵塔(末期)'],soulRingMode:'hunt',maxLevel:99,eraColor:'#44ddaa'},
  {id:'douluo3',name:'龙王传说',era:'唐舞麟时代（斗二万年后）',desc:'魂导科技高度发达，魂兽濒临灭绝。传灵塔崛起，斗铠成为主流。',weight:20,factions:['传灵塔','史莱克学院','唐门','圣灵教','天魂帝国','斗灵帝国','星罗帝国'],soulRingMode:'spirit',maxLevel:99,eraColor:'#aa66ff'},
  {id:'douluo4',name:'终极斗罗',era:'蓝轩宇时代（斗三万年后）',desc:'斗罗联邦成立，星际殖民时代。魂力上限突破120级，龙马星系接触。',weight:15,factions:['斗罗联邦军方','史莱克学院','传灵塔','唐门','太空家族'],soulRingMode:'spirit',maxLevel:150,eraColor:'#ff6644'}
];

const INNATE_POWER = [
  {min:0,max:0,name:'0级',rating:'废武魂',ratingColor:'#888',weight:8,desc:'武魂觉醒但无魂力，无法修炼'},
  {min:1,max:3,name:'1-3级',rating:'普通',ratingColor:'#aaa',weight:25,desc:'大多数平民的水平，修炼较慢'},
  {min:4,max:6,name:'4-6级',rating:'良好',ratingColor:'#4488ff',weight:28,desc:'具备一定天赋，可进入主流宗门'},
  {min:7,max:9,name:'7-9级',rating:'优秀',ratingColor:'#44ddaa',weight:20,desc:'天赋出众，修炼速度快'},
  {min:10,max:10,name:'10级',rating:'先天满魂力',ratingColor:'#ffdd44',weight:12,desc:'顶级天赋，各大宗门争抢对象'},
  {min:11,max:19,name:'11-19级',rating:'超出极限',ratingColor:'#aa66ff',weight:5,desc:'极为罕见，觉醒即可附加第二魂环'},
  {min:20,max:20,name:'20级',rating:'神级天赋',ratingColor:'#ff4444',weight:2,desc:'史上仅有，觉醒即可附加两个魂环'}
];

const IDENTITY_TYPES = {
  human:[{id:'human',name:'人类',weight:50,color:'#4488ff',desc:'万物之灵，拥有无限可能的种族。'}],
  soul_beast:[{id:'soul_beast',name:'魂兽',weight:50,color:'#aa4444',desc:'大自然的宠儿，天生拥有强悍肉身。'}],
  god:[{id:'god',name:'神祇',weight:60,color:'#ffdd44',desc:'神界之灵，掌控法则的至高存在。'}],
  divine_beast:[{id:'divine_beast',name:'神兽',weight:40,color:'#ff8800',desc:'神界孕育的灵兽，天赋异禀，可修炼成神。'}]
};

const HUMAN_BACKGROUNDS = [
  {id:'commoner',name:'普通平民',weight:30,desc:'出身平凡，凭借自身努力闯荡大陆。'},
  {id:'noble',name:'帝国贵族',weight:15,desc:'生来便拥有资源与地位，修炼起步更高。'},
  {id:'sect_disciple',name:'宗门弟子',weight:20,desc:'自幼在宗门长大，有名师指导。'},
  {id:'family_child',name:'魂师世家子弟',weight:15,desc:'家族传承，血脉中流淌着强大的力量。'},
  {id:'rogue',name:'散修',weight:15,desc:'无门无派，自由自在，但也无人庇护。'},
  {id:'orphan',name:'孤儿',weight:5,desc:'自幼流浪，命途多舛，但也可能遇到奇遇。'}
];

const BEAST_RACES = [
  {id:'beast_wolf',name:'疾风狼',weight:12,desc:'速度极快的狼形魂兽，群居猎食，擅长围攻。'},
  {id:'beast_tiger',name:'暗金恐爪熊',weight:8,desc:'力量型魂兽，暗金色的利爪可撕裂空间。'},
  {id:'beast_snake',name:'碧磷蛇皇',weight:10,desc:'剧毒蛇类魂兽，独孤博的武魂原型。'},
  {id:'beast_eagle',name:'苍穹之鹰',weight:10,desc:'天空霸主，锐利的目光可看穿一切伪装。'},
  {id:'beast_bear',name:'泰坦巨猿',weight:8,desc:'力量恐怖的巨猿，一拳可碎山岳，天青牛蟒的挚友。'},
  {id:'beast_dragon',name:'蓝电霸王龙',weight:6,desc:'龙族血脉的霸王龙，雷霆之力覆盖全身。'},
  {id:'beast_phoenix',name:'邪火凤凰',weight:7,desc:'拥有邪火的凤凰，攻守兼备但需要控制邪火。'},
  {id:'beast_turtle',name:'玄冰龟',weight:10,desc:'防御极强的龟类魂兽，冰系能力让敌人寸步难行。'},
  {id:'beast_rabbit',name:'柔骨魅兔',weight:8,desc:'敏捷极高的兔类魂兽，近身肉搏不输任何对手。'},
  {id:'beast_scorpion',name:'冰碧帝皇蝎',weight:5,desc:'冰系顶级魂兽，拥有极致之冰与剧毒双重能力。'},
  {id:'beast_whale',name:'深海魔鲸',weight:4,desc:'海洋霸主，体型巨大，魂力深不可测。'},
  {id:'beast_lion',name:'烈焰雄狮',weight:8,desc:'火系狮形魂兽，烈焰鬃毛中蕴含恐怖的火焰之力。'},
  {id:'beast_fox',name:'九尾灵狐',weight:6,desc:'拥有九条尾巴的灵狐，精神力极强，擅长幻术。'},
  {id:'beast_crocodile',name:'暗影鳄王',weight:8,desc:'潜伏暗处的鳄鱼魂兽，咬合力惊人。'},
  {id:'beast_peacock',name:'七彩神孔雀',weight:5,desc:'美丽的孔雀魂兽，尾羽中蕴含七种元素之力。'},
  {id:'beast_spider',name:'人面魔蛛',weight:7,desc:'面如人形的恐怖蜘蛛，蛛丝坚不可摧。'},
  {id:'beast_deer',name:'三眼金猊',weight:3,desc:'传说中的命运之兽，三只眼睛可看透命运。'},
  {id:'beast_horse',name:'幽冥白虎',weight:4,desc:'暗属性虎形魂兽，幽冥之力可吞噬一切。'},
  {id:'beast_cat',name:'幽冥灵猫',weight:8,desc:'暗影中潜行的猫类魂兽，速度与暗杀并重。'},
  {id:'beast_leech',name:'天梦冰蚕',weight:3,desc:'精神系冰蚕，百万年级别的存在，拥有无与伦比的精神力。'}
];

const DIVINE_BEAST_RACES = [
  {id:'divine_dragon',name:'青龙',weight:10,color:'#44aa44',desc:'东方七宿之神，掌管生机与雷霆，神兽之首。'},
  {id:'divine_phoenix',name:'凤凰',weight:8,color:'#ff4422',desc:'不死神鸟，涅槃重生，南明离火焚尽邪祟。'},
  {id:'divine_tiger',name:'白虎',weight:8,color:'#dddddd',desc:'西方镇守之神，杀伐果断，金庚之气锐不可当。'},
  {id:'divine_tortoise',name:'玄武',weight:8,color:'#2244aa',desc:'北方镇守之神，龟蛇合体，防御与水法无双。'},
  {id:'divine_qilin',name:'麒麟',weight:7,color:'#ffaa44',desc:'祥瑞之兽，仁慈之主，踏火而行，福泽苍生。'},
  {id:'divine_kunpeng',name:'鲲鹏',weight:5,color:'#226688',desc:'北冥之鱼，化而为鸟，扶摇直上九万里。'},
  {id:'divine_dijiang',name:'帝江',weight:4,color:'#664466',desc:'混沌神兽，无面目而识歌舞，空间之主。'},
  {id:'divine_zhenming',name:'真明鸟',weight:6,color:'#ffdd44',desc:'神界使者，鸣声如钟，一鸣则天下大白。'},
  {id:'divine_bixie',name:'辟邪',weight:7,color:'#aa8844',desc:'镇宅神兽，食虎豹，辟邪祟，正气凛然。'},
  {id:'divine_baize',name:'白泽',weight:6,color:'#eeeeee',desc:'知万物之情貌，通晓天下鬼神之事，智慧神兽。'},
  {id:'divine_jian',name:'毕方',weight:5,color:'#ff6622',desc:'火灾之兆，单足神鸟，其鸣自呼，见则有火。'},
  {id:'divine_chongming',name:'重明鸟',weight:5,color:'#ffdd88',desc:'双瞳神鸟，能退妖恶，状如鸡而鸣似凤。'}
];

const GOD_TIERS = [
  {id:'god_official',name:'无神位神官',weight:35,desc:'神界的基层存在，拥有神力但无神位。'},
  {id:'god_3',name:'三级神祇',weight:30,desc:'掌管一方小域的初级神祇。'},
  {id:'god_2',name:'二级神祇',weight:20,desc:'实力强大的中层神祇。'},
  {id:'god_1',name:'一级神祇',weight:12,desc:'神界核心战力，掌控重要法则。'},
  {id:'god_king',name:'神王',weight:3,desc:'至高存在，神界最强者。'}
];

// ============================================================
// GOD EXCLUSIVE WHEEL DATA
// ============================================================
const GOD_POSITIONS = {
  god_king: [
    {name:'修罗神',desc:'神界执法者，执掌杀戮与审判，战力无双。',color:'#aa2222'},
    {name:'善良之神',desc:'神界两大神王之一，掌控善良法则。',color:'#ffdd44'},
    {name:'邪恶之神',desc:'神界两大神王之一，掌控邪恶法则。',color:'#6622aa'},
    {name:'毁灭之神',desc:'神界执法者，执掌毁灭与破坏。',color:'#444444'},
    {name:'生命女神',desc:'神界执法者，执掌生命与创造。',color:'#22aa44'}
  ],
  god_1: [
    {name:'海神',desc:'大海的主宰，掌控海洋之力。',color:'#4488ff'},
    {name:'罗刹神',desc:'执掌怨念与杀戮的黑暗神祇。',color:'#aa2266'},
    {name:'天使神',desc:'光明与神圣的化身，六翼天使之力。',color:'#ffdd44'},
    {name:'火神',desc:'火焰的主宰，焚尽万物的炽热之力。',color:'#ff4422'},
    {name:'水神',desc:'柔水之力，润泽万物。',color:'#22aaff'},
    {name:'风神',desc:'执掌风暴与疾风，速度无双。',color:'#44ddaa'},
    {name:'雷神',desc:'天罚之雷，威震九天。',color:'#aa88ff'},
    {name:'黑暗之神',desc:'深渊暗影，吞噬光明。',color:'#333355'},
    {name:'光明之神',desc:'驱散黑暗，普照大地。',color:'#ffee88'},
    {name:'龙神（残魂）',desc:'远古至高存在的一缕残魂，仍有惊天之力。',color:'#ffaa00'}
  ],
  god_2: [
    {name:'食神',desc:'掌控美食与治愈之力。',color:'#ffaa66'},
    {name:'九彩神女',desc:'九彩光芒，辅助无双。',color:'#ff66aa'},
    {name:'速度之神',desc:'极致速度，瞬息万里。',color:'#44ddff'},
    {name:'战神',desc:'战斗本能，越战越勇。',color:'#ff4444'},
    {name:'凤凰之神',desc:'涅槃重生，不死火焰。',color:'#ff6622'},
    {name:'白虎之神',desc:'白虎煞气，刚猛无俦。',color:'#aaaaaa'},
    {name:'玄武之神',desc:'坚不可摧，防御无双。',color:'#2266aa'},
    {name:'朱雀之神',desc:'南明离火，焚天煮海。',color:'#ff2222'},
    {name:'大力神',desc:'神力无穷，力拔山兮。',color:'#aa6622'},
    {name:'智慧之神',desc:'洞察万物，算无遗策。',color:'#66aaff'}
  ],
  god_3: [
    {name:'花神',desc:'百花之主，操控植物。',color:'#ff66aa'},
    {name:'月神',desc:'月光之力，清冷幽远。',color:'#aaccff'},
    {name:'星神',desc:'星辰之力，命运推演。',color:'#4444ff'},
    {name:'山神',desc:'山脉之灵，厚重沉稳。',color:'#886644'},
    {name:'河神',desc:'江河之灵，川流不息。',color:'#22aaff'},
    {name:'匠神',desc:'锻造神器，鬼斧神工。',color:'#aa8844'},
    {name:'医神',desc:'治愈万物，妙手回春。',color:'#44ff88'},
    {name:'乐神',desc:'音律之力，摄人心魄。',color:'#ff88cc'},
    {name:'酒神',desc:'醉意朦胧，千杯不醉。',color:'#ccaa44'},
    {name:'猎神',desc:'追踪猎杀，百发百中。',color:'#44aa44'}
  ],
  god_official: [
    {name:'巡猎者',desc:'神界巡逻兵，维护秩序。',color:'#8888aa'},
    {name:'神界侍从',desc:'侍奉神祇的基层人员。',color:'#aaaaaa'},
    {name:'神域守卫',desc:'守卫神域入口的战士。',color:'#666688'},
    {name:'天神巡猎者',desc:'巡查下界的天神使者。',color:'#7788aa'},
    {name:'神界文员',desc:'处理神界事务的文职人员。',color:'#9999bb'}
  ]
};

const GOD_ARTIFACTS = {
  god_king: [
    {name:'修罗魔剑',desc:'超神器，修罗神专属，杀戮之力可斩天地。',color:'#aa0000'},
    {name:'善良之心',desc:'超神器，善良神王专属，净化一切邪恶。',color:'#ffdd00'},
    {name:'邪恶之剑',desc:'超神器，邪恶神王专属，腐蚀万物灵魂。',color:'#6600aa'},
    {name:'毁灭权杖',desc:'超神器，毁灭神王专属，一念灭世。',color:'#333333'},
    {name:'生命古树',desc:'超神器，生命女神专属，生生不息。',color:'#00aa44'}
  ],
  god_1: [
    {name:'海神三叉戟',desc:'伪超神器，大海权柄的象征。',color:'#4488ff'},
    {name:'天使圣剑',desc:'伪超神器，光明与审判之力。',color:'#ffdd44'},
    {name:'罗刹魔镰',desc:'伪超神器，收割灵魂的死亡之镰。',color:'#aa2266'},
    {name:'烈焰神剑',desc:'伪超神器，焚尽八荒的火焰之剑。',color:'#ff4422'},
    {name:'玄冰神枪',desc:'伪超神器，冻结万物的寒冰之枪。',color:'#22aaff'},
    {name:'雷神之锤',desc:'伪超神器，天雷汇聚的毁灭之锤。',color:'#aa88ff'}
  ],
  god_2: [
    {name:'神器·食神鼎',desc:'神器，烹煮万物的神鼎。',color:'#ffaa66'},
    {name:'神器·九彩绫',desc:'神器，九彩光芒化作的绫带。',color:'#ff66aa'},
    {name:'神器·疾风靴',desc:'神器，穿上可御风而行。',color:'#44ddff'},
    {name:'神器·战神铠',desc:'神器，百战不灭的战神铠甲。',color:'#ff4444'},
    {name:'神器·凤凰翎',desc:'神器，蕴含涅槃之力的凤羽。',color:'#ff6622'},
    {name:'神器·玄武盾',desc:'神器，坚如磐石的神盾。',color:'#2266aa'}
  ],
  god_3: [
    {name:'伪神器·花神杖',desc:'伪神器，操控百花的花杖。',color:'#ff66aa'},
    {name:'伪神器·月华镜',desc:'伪神器，映照月光的宝镜。',color:'#aaccff'},
    {name:'伪神器·星罗盘',desc:'伪神器，推演星辰的罗盘。',color:'#4444ff'},
    {name:'伪神器·山河图',desc:'伪神器，内蕴山河的画卷。',color:'#886644'},
    {name:'伪神器·流水琴',desc:'伪神器，弹奏江河之音的古琴。',color:'#22aaff'}
  ],
  god_official: [
    {name:'无神器',desc:'神官尚未获得神器认可。',color:'#888888'},
    {name:'神官佩剑',desc:'普通神兵，仅有些许神力加持。',color:'#aaaaaa'},
    {name:'巡猎令牌',desc:'身份象征，可调用微量神力。',color:'#999999'}
  ]
};

const GOD_FACTIONS_POOL = [
  {name:'神界委员会',desc:'神界最高权力机构，五大神王共治。',weight:15,color:'#ffdd44'},
  {name:'海神阁',desc:'海神一脉的势力，掌控海洋法则。',weight:18,color:'#4488ff'},
  {name:'修罗神殿',desc:'修罗神直属，执掌杀戮与审判。',weight:12,color:'#aa2222'},
  {name:'生命神殿',desc:'生命女神麾下，守护万物生灵。',weight:15,color:'#22aa44'},
  {name:'毁灭阵营',desc:'毁灭之神派系，主张变革与破坏。',weight:12,color:'#444444'},
  {name:'散修神祇',desc:'不隶属于任何势力的自由神祇。',weight:28,color:'#8888aa'}
];

const FACTION_SOULS = {
  '武魂殿':['六翼天使','天使圣剑','圣光权杖','审判之锤','神圣之盾','光之翼','圣裁十字','天使之环'],
  '昊天宗':['昊天锤','昊天锤（变异）','破天枪','裂地锤','震天环','昊天九绝'],
  '七宝琉璃宗':['七宝琉璃塔','九宝琉璃塔','琉璃圣杖','七宝神灯','琉璃镜','七宝琴'],
  '蓝电霸王龙家族':['蓝电霸王龙','雷龙之枪','紫电双龙','雷霆之翼','蓝电长戟','雷龙之爪'],
  '史莱克学院':['蓝银草（强化）','光明圣龙','碧磷蛇皇','幽冥灵猫','邪火凤凰','柔骨魅兔','冰碧帝皇蝎'],
  '唐门':['唐门暗器','鬼影迷踪','玄天功','紫极魔瞳','玄玉手','控鹤擒龙','蓝银草','昊天锤'],
  '日月皇室':['日月凤凰','光明圣龙','太阳天使','月光天使','日月光环','日月之翼'],
  '天魂帝国':['冰天雪女','寒冰凤凰','冰碧蛇','极光龙','霜冻巨熊','冰晶龙'],
  '斗灵帝国':['灵眸白虎','幽冥白虎','灵猫','暗金恐爪熊','灵眼金蟒'],
  '传灵塔':['灵冰塔','光明之塔','审判之塔','灵眸圣光','传灵神光','灵塔圣剑'],
  '圣灵教':['黑暗圣龙','死神之镰','暗影魔龙','堕落天使','黑暗之塔','圣灵圣剑'],
  '斗罗联邦军方':['联邦战甲','星际之枪','光明圣龙','雷霆之枪','光能圣剑'],
  '太空家族':['星辰圣龙','宇宙之翼','星际战锤','银河长戟','太空圣弓'],
  '神界委员会':['神之审判','法则之书','创世之锤','命运之轮','混沌之矛'],
  '海神阁':['海神三叉戟','海神之盾','碧波圣剑','海龙之枪','海神之心','潮汐之环'],
  '毁灭之神阵营':['毁灭之刃','毁灭之锤','毁灭圣剑','末日之枪','虚无之盾'],
  '生命女神阵营':['生命之树','治愈圣杖','生命之泉','翡翠之盾','自然之弓']
};

function getFactionSoulPool(factionName, quality){
  let factionSouls = FACTION_SOULS[factionName];
  if(!factionSouls) return null;
  let pool = buildSoulNamePool();
  let results = factionSouls.map(name => {
    if(quality === 'common') return {name, type:'器武魂', quality:'普通', qColor:'#888'};
    if(quality === 'good') return {name, type:'器武魂', quality:'优秀', qColor:'#4488ff'};
    if(quality === 'mutant') return {name, type:'变异武魂', quality:'优秀~顶级', qColor:'#aa66ff'};
    if(quality === 'top') return {name, type:'器武魂', quality:'顶级', qColor:'#ffdd44'};
    if(quality === 'dual') return {name, type:'双生武魂', quality:'顶级+', qColor:'#ff4444'};
    return {name, type:'器武魂', quality:quality, qColor:'#888'};
  });
  return results;
}

const AWAKENING_COUNT = [
  {id:'one',name:'觉醒1个武魂',weight:55,desc:'只有一个武魂，但可以更专注地修炼。',count:1,color:'#4488ff'},
  {id:'two',name:'觉醒2个武魂',weight:30,desc:'双武魂同时觉醒，能力更加全面。',count:2,color:'#aa66ff'},
  {id:'three',name:'觉醒3个武魂',weight:12,desc:'三武魂觉醒，极为罕见！',count:3,color:'#ffdd44'},
  {id:'four',name:'觉醒4个武魂',weight:3,desc:'四武魂觉醒，万中无一的奇迹！',count:4,color:'#ff4444'}
];

const IDENTITIES = {
  human:HUMAN_BACKGROUNDS,
  soul_beast:BEAST_RACES,
  god:GOD_TIERS
};

// ============================================================
// SOUL BEAST DATA
// ============================================================
const BEAST_BLOODLINES = [
  {id:'fire',name:'火系',weight:15,color:'#ff4444',desc:'炎阳之力，烈焰焚天，极致之火可焚尽万物。',attr:{power:1.2,defense:0.9}},
  {id:'ice',name:'冰系',weight:12,color:'#44ddff',desc:'极寒之冰，冰封千里，极致之冰可冻结时空。',attr:{power:1.1,defense:1.1}},
  {id:'thunder',name:'雷系',weight:12,color:'#ffdd44',desc:'雷霆万钧，电光火石，速度与力量并存。',attr:{power:1.15,defense:0.95}},
  {id:'wind',name:'风系',weight:10,color:'#88ff88',desc:'疾风之速，无影无踪，天下武功唯快不破。',attr:{power:0.9,defense:0.8,speed:1.3}},
  {id:'earth',name:'土系',weight:10,color:'#aa8844',desc:'厚土之德，稳如泰山，防御力超群。',attr:{power:0.8,defense:1.4}},
  {id:'water',name:'水系',weight:8,color:'#4488ff',desc:'上善若水，变化万千，可攻可守可治愈。',attr:{power:0.9,defense:1.0,heal:1.2}},
  {id:'wood',name:'木系',weight:6,color:'#44aa44',desc:'生命之木，生生不息，拥有强大的恢复能力。',attr:{power:0.7,defense:0.8,heal:1.5}},
  {id:'dark',name:'暗系',weight:10,color:'#8844aa',desc:'幽冥之暗，吞噬一切，令人恐惧的力量。',attr:{power:1.25,defense:0.85}},
  {id:'light',name:'光系',weight:8,color:'#ffdd88',desc:'圣光普照，驱散黑暗，神圣不可侵犯。',attr:{power:1.1,defense:1.0,heal:1.1}},
  {id:'poison',name:'毒系',weight:6,color:'#44aa66',desc:'万毒之体，剧毒侵蚀，沾之即死。',attr:{power:1.15,defense:0.75}},
  {id:'spirit',name:'精神系',weight:5,color:'#dd88ff',desc:'精神之力，无形无相，掌控心灵。',attr:{power:1.0,defense:0.7,control:1.4}},
  {id:'dragon',name:'龙系',weight:5,color:'#ff8800',desc:'龙族血脉，万兽之王，天生霸主。',attr:{power:1.4,defense:1.2}},
  {id:'space',name:'空间系',weight:3,color:'#66aaff',desc:'空间之力，撕裂虚空，神出鬼没。',attr:{power:1.1,defense:0.8,space:1.5}},
  {id:'time',name:'时间系',weight:2,color:'#ff66aa',desc:'时间法则，操控因果，最为稀有的血脉。',attr:{power:1.3,defense:0.6,time:1.8}},
  {id:'devour',name:'吞噬系',weight:3,color:'#662266',desc:'吞噬万物，化为己用，永无止境。',attr:{power:1.3,defense:0.9,devour:1.5}}
];

function getBeastBirthplaces(timelineId){
  let base = [
    {id:'xingdou_core',name:'星斗大森林核心区',weight:15,color:'#228844',desc:'魂兽圣地，十万年魂兽栖息之地，机遇与危险并存。',attr:{power:1.3,risk:1.3}},
    {id:'xingdou_edge',name:'星斗大森林外围',weight:20,color:'#44aa66',desc:'魂兽天堂，资源丰富，但强者众多。',attr:{power:1.1,risk:1.0}},
    {id:'jibei',name:'极北之地',weight:12,color:'#88ccff',desc:'冰天雪地，极致之冰的发源地，冰系魂兽的乐园。',attr:{power:1.2,ice:1.4}},
    {id:'luori',name:'落日森林',weight:15,color:'#aa8844',desc:'温暖湿润，植被茂密，适合各类魂兽繁衍。',attr:{power:1.0,risk:0.8}},
    {id:'deep_sea',name:'深海',weight:8,color:'#2244aa',desc:'神秘莫测的海底世界，蕴藏着远古的力量。',attr:{power:1.15,secret:1.3}},
    {id:'cave',name:'地底洞穴',weight:6,color:'#664422',desc:'黑暗幽深的地下迷宫，隐藏着古老的宝藏。',attr:{power:1.1,secret:1.4}},
    {id:'volcano',name:'火山地带',weight:8,color:'#ff6622',desc:'烈焰之地，火系魂兽的天然修炼场。',attr:{power:1.2,fire:1.3}},
    {id:'swamp',name:'迷雾沼泽',weight:6,color:'#668844',desc:'毒雾弥漫，危机四伏，毒系魂兽的温床。',attr:{power:1.0,poison:1.4}},
    {id:'mountain',name:'魂兽山脉',weight:10,color:'#886644',desc:'连绵起伏的山脉，力量型魂兽的聚集地。',attr:{power:1.15,risk:0.9}}
  ];
  switch(timelineId){
    case 'douluo1':
      return base.map(b => {
        if(b.id==='xingdou_core'){b.weight=18;b.desc='万年前的星斗大森林，生命之湖能量充沛，百万年魂兽潜伏。';}
        if(b.id==='xingdou_edge'){b.weight=22;}
        if(b.id==='luori'){b.weight=15;b.desc='冰火两仪眼仍在，植被茂密，各类魂兽繁衍生息。';}
        if(b.id==='swamp'){b.weight=6;}
        return b;
      });
    case 'douluo2':
      return base.map(b => {
        if(b.id==='xingdou_core'){b.weight=12;b.desc='星斗大森林核心区缩小，生命之湖仍是魂兽圣地。';}
        if(b.id==='xingdou_edge'){b.weight=15;b.desc='魂兽因人类扩张而减少，外围危险度降低。';}
        if(b.id==='jibei'){b.weight=15;b.desc='极北之地仍为冰系魂兽乐园，冰碧帝皇蝎的领地。';}
        if(b.id==='luori'){b.weight=10;b.desc='落日森林因人类开发而逐渐缩小。';}
        if(b.id==='mountain'){b.weight=8;}
        return b;
      }).concat([{id:'mingdu',name:'明都山脉',weight:8,color:'#662200',desc:'日月帝国首都附近的山脉，魂导器影响下魂兽变异频发。',attr:{power:1.1,tech:1.3}}]);
    case 'douluo3':
      return base.filter(b => b.id!=='xingdou_core' && b.id!=='xingdou_edge')
        .map(b => {
          if(b.id==='luori'){b.weight=8;b.desc='落日森林几乎消失，魂兽数量锐减。';}
          if(b.id==='jibei'){b.weight=10;b.desc='极北之地冰川融化，冰系魂兽濒危。';}
          if(b.id==='deep_sea'){b.weight=12;b.desc='深海成为魂兽最后避难所，龙谷藏于海底。';}
          if(b.id==='cave'){b.weight=12;b.desc='地底洞穴成为隐藏魂兽的庇护所，暗藏龙族遗迹。';}
          if(b.id==='mountain'){b.weight=8;}
          return b;
        }).concat([
          {id:'spirit_tower',name:'传灵塔',weight:15,color:'#44aaff',desc:'传灵塔人造魂灵诞生地，魂兽新形态的摇篮。',attr:{power:1.0,spirit:1.5}},
          {id:'dragon_valley',name:'龙谷秘境',weight:8,color:'#ff8800',desc:'隐藏的龙族栖息地，龙系魂兽的最后净土。',attr:{power:1.5,secret:1.6}}
        ]);
    case 'douluo4':
      return [
        {id:'douluo_star',name:'斗罗母星',weight:20,color:'#44aa66',desc:'人类的母星，魂兽生态保护区仅存少量。',attr:{power:0.8,risk:0.5}},
        {id:'dragon_world',name:'龙界',weight:15,color:'#ff8800',desc:'龙族独立空间，龙系魂兽的终极家园。',attr:{power:1.4,risk:1.1}},
        {id:'spirit_star',name:'精灵星',weight:18,color:'#88dd44',desc:'魂兽迁徙后的新家园，生态完整。',attr:{power:1.1,secret:1.2}},
        {id:'longma',name:'龙马星系',weight:15,color:'#dd44ff',desc:'外星魂兽聚集地，拥有独特的外星魂兽种族。',attr:{power:1.2,alien:1.5}},
        {id:'abyss',name:'深渊通道',weight:12,color:'#442266',desc:'深渊生物入侵的通道，深渊魂兽的巢穴。',attr:{power:1.5,risk:1.8}},
        {id:'deep_sea',name:'深海',weight:10,color:'#2244aa',desc:'深海魂兽仍存在，但面临人类科技的威胁。',attr:{power:1.1,secret:1.2}},
        {id:'space',name:'太空领域',weight:5,color:'#222266',desc:'星际空间，存在稀有的宇宙级魂兽。',attr:{power:1.5,space:1.6}},
        {id:'cave',name:'地底遗迹',weight:5,color:'#664422',desc:'远古地底遗迹，埋藏着上古魂兽的秘密。',attr:{power:1.2,secret:1.5}}
      ];
    case 'godrealm':
      return [
        {id:'god_forest',name:'神界森林',weight:25,color:'#44dd88',desc:'神界生态区，魂兽在此受神界法则庇护，可修炼成神兽。',attr:{power:1.2,divine:1.3}},
        {id:'god_abyss',name:'神界深渊',weight:15,color:'#6644aa',desc:'神界边缘的深渊区域，暗属性魂兽聚集。',attr:{power:1.3,secret:1.4}},
        {id:'god_realm',name:'神域秘境',weight:20,color:'#ffdd44',desc:'神界遗留的远古秘境，异兽横行。',attr:{power:1.4,divine:1.5}},
        {id:'god_beast',name:'神兽领域',weight:20,color:'#ff8844',desc:'神兽专属领地，只有最强大的魂兽才能踏足。',attr:{power:1.6,divine:1.6}},
        {id:'god_sea',name:'神界天河',weight:10,color:'#4488ff',desc:'神界天河之水，水系神兽的栖息地。',attr:{power:1.1,divine:1.2}},
        {id:'god_ice',name:'神界冰原',weight:10,color:'#88ddff',desc:'神界极寒之地，冰系神兽的修炼圣地。',attr:{power:1.2,divine:1.1}}
      ];
    default:
      return base;
  }
}

const GENDERS = [
  {id:'male',name:'男',weight:50,desc:'标准男性身份，适用所有男性向剧情与势力。'},
  {id:'female',name:'女',weight:48,desc:'标准女性身份，适用所有女性向剧情与势力。'},
  {id:'none',name:'无',weight:2,desc:'仅魂兽可选，不受部分情缘限制。'}
];

const PERSONALITIES = [
  {id:'gentle',name:'温柔善良',weight:15,color:'#ffaaaa',desc:'待人温和，心地善良，容易获得他人好感。',traits:{social:1.2,romance:1.3,enemy:0.8}},
  {id:'proud',name:'高傲冷艳',weight:12,color:'#8888ff',desc:'性格高傲，不易接近，但实力往往不凡。',traits:{social:0.9,romance:1.1,enemy:1.3}},
  {id:'hotblood',name:'热血冲动',weight:15,color:'#ff4444',desc:'热血奔放，行事果决，朋友众多但也容易树敌。',traits:{social:1.1,romance:1.0,enemy:1.2}},
  {id:'calm',name:'冷静沉稳',weight:15,color:'#4488dd',desc:'遇事冷静，思维缜密，擅长布局。',traits:{social:1.0,romance:0.9,enemy:1.1}},
  {id:'crafty',name:'腹黑狡黠',weight:10,color:'#aa44aa',desc:'心机深沉，喜怒不形于色，善于算计。',traits:{social:0.8,romance:0.9,enemy:1.4}},
  {id:'cheerful',name:'开朗活泼',weight:12,color:'#ffcc44',desc:'阳光开朗，充满活力，走到哪里都能带来欢笑。',traits:{social:1.3,romance:1.2,enemy:0.7}},
  {id:'mysterious',name:'神秘莫测',weight:8,color:'#6644aa',desc:'来历神秘，性格难以捉摸，自带独特魅力。',traits:{social:0.7,romance:1.2,enemy:1.0}},
  {id:'ruthless',name:'杀伐果断',weight:8,color:'#aa2222',desc:'冷酷无情，行事狠辣，敌人闻风丧胆。',traits:{social:0.6,romance:0.7,enemy:1.5}},
  {id:'lazy',name:'慵懒随性',weight:5,color:'#88aa88',desc:'性格懒散，随遇而安，但关键时刻绝不掉链子。',traits:{social:1.0,romance:1.1,enemy:0.6}}
];

const APPEARANCES = [
  {id:'common',name:'普通',weight:25,color:'#aaaaaa',desc:'平凡无奇的容貌，扔进人堆里就找不到了。',attr:{charm:3}},
  {id:'good',name:'清秀',weight:25,color:'#88ccff',desc:'五官端正，眉眼清秀，看着很舒服。',attr:{charm:6}},
  {id:'handsome',name:'俊朗',weight:20,color:'#44aaff',desc:'英俊帅气，气质出众，走到哪里都有人回头。',attr:{charm:8}},
  {id:'beautiful',name:'绝色',weight:12,color:'#ff66aa',desc:'容貌绝世，倾国倾城，令人一见难忘。',attr:{charm:9}},
  {id:'divine',name:'神颜',weight:5,color:'#ffdd44',desc:'不似凡间所有的完美容貌，自带神辉。',attr:{charm:10}},
  {id:'fierce',name:'凶相',weight:5,color:'#aa4444',desc:'面目狰狞，气场逼人，小孩见了都要哭。',attr:{charm:2,intimidate:8}},
  {id:'weird',name:'怪异',weight:3,color:'#66aa66',desc:'容貌奇特，或有胎记异瞳，辨识度极高。',attr:{charm:4,unique:8}},
  {id:'weak',name:'体弱',weight:5,color:'#aaaaaa',desc:'面色苍白，体弱多病，我见犹怜。',attr:{charm:7,weak:1}}
];

// ============================================================
// PARTNER & ENEMY POOLS
// ============================================================
const LOVER_POOL = {
  male_target: [
    {name:'温柔师姐',trait:'gentle',soul:'辅助系',weight:20},
    {name:'冷艳魔女',trait:'proud',soul:'强攻系',weight:15},
    {name:'活泼少女',trait:'cheerful',soul:'敏攻系',weight:18},
    {name:'腹黑谋士',trait:'crafty',soul:'控制系',weight:12},
    {name:'神秘御姐',trait:'mysterious',soul:'未知',weight:10},
    {name:'霸道女王',trait:'ruthless',soul:'强攻系',weight:8},
    {name:'邻家小妹',trait:'gentle',soul:'食物系',weight:10},
    {name:'高冷圣女',trait:'proud',soul:'辅助系',weight:7}
  ],
  female_target: [
    {name:'温润师兄',trait:'gentle',soul:'强攻系',weight:20},
    {name:'冰山男神',trait:'proud',soul:'控制系',weight:15},
    {name:'阳光少年',trait:'cheerful',soul:'敏攻系',weight:18},
    {name:'腹黑阁主',trait:'crafty',soul:'辅助系',weight:12},
    {name:'神秘来客',trait:'mysterious',soul:'未知',weight:10},
    {name:'霸道少主',trait:'ruthless',soul:'强攻系',weight:8},
    {name:'暖心学长',trait:'gentle',soul:'食物系',weight:10},
    {name:'高冷宗主',trait:'proud',soul:'控制系',weight:7}
  ]
};

const ENEMY_POOL = {
  douluo1: [
    {name:'赵无极',power:0.9,weight:18,type:'official',desc:'史莱克学院副院长，大力金刚熊武魂，力大无穷。'},
    {name:'玉天恒',power:1.0,weight:15,type:'fate',desc:'蓝电霸王龙家族天才，蓝电霸王龙武魂。'},
    {name:'独孤博',power:1.2,weight:10,type:'evil',desc:'碧磷蛇皇武魂，封号毒斗罗，亦正亦邪。'},
    {name:'菊斗罗月关',power:1.4,weight:6,type:'official',desc:'武魂殿封号斗罗，奇茸通天菊武魂。'},
    {name:'鬼斗罗鬼魅',power:1.4,weight:5,type:'evil',desc:'武魂殿封号斗罗，鬼魅武魂，与菊斗罗有融合技。'},
    {name:'比比东',power:1.8,weight:2,type:'cult',desc:'武魂殿教皇，双生武魂罗刹神继承人。'},
    {name:'千寻疾',power:1.6,weight:3,type:'official',desc:'前武魂殿教皇，六翼天使武魂。'},
    {name:'时年',power:0.8,weight:15,type:'evil',desc:'苍晖学院老师，残梦武魂，擅长精神攻击。'},
    {name:'邪月',power:1.1,weight:8,type:'official',desc:'武魂殿黄金一代，月刃武魂。'},
    {name:'胡列娜',power:1.0,weight:8,type:'fate',desc:'武魂殿圣女，妖狐武魂，魅惑能力极强。'}
  ],
  douluo2: [
    {name:'戴华斌',power:0.9,weight:18,type:'fate',desc:'白虎公爵府嫡子，白虎武魂，霍雨浩的宿敌。'},
    {name:'笑红尘',power:1.0,weight:15,type:'official',desc:'日月帝国魂导师天才，三足金蟾武魂。'},
    {name:'梦红尘',power:1.0,weight:12,type:'official',desc:'笑红尘的妹妹，冰蚕武魂。'},
    {name:'橘子',power:1.1,weight:8,type:'fate',desc:'日月帝国皇后，霍雨浩的故人，极富谋略。'},
    {name:'圣灵教教主',power:1.5,weight:5,type:'evil',desc:'圣灵教教主，邪魂师之首。'},
    {name:'钟离乌',power:1.3,weight:8,type:'evil',desc:'圣灵教教主，死灵圣法神伊莱克斯的敌人。'},
    {name:'帝天',power:1.8,weight:3,type:'beast',desc:'魂兽共主，金眼黑龙王，兽神。'},
    {name:'邪魂师',power:0.8,weight:15,type:'evil',desc:'修炼邪魂术的魂师，以吞噬他人魂力提升。'},
    {name:'镜红尘',power:1.2,weight:6,type:'official',desc:'日月帝国明德堂堂主，九级魂导师。'},
    {name:'张鹏',power:1.0,weight:10,type:'betray',desc:'史莱克学院叛徒，暗中投靠圣灵教。'}
  ],
  douluo3: [
    {name:'圣灵教教主',power:1.3,weight:12,type:'evil',desc:'圣灵教教主，深渊位面的代理人。'},
    {name:'魔皇',power:1.6,weight:4,type:'evil',desc:'圣灵教教主，深海魔鲸王之妻。'},
    {name:'龙跃',power:1.1,weight:10,type:'fate',desc:'星罗帝国龙跃，山龙王武魂。'},
    {name:'戴云儿',power:1.0,weight:12,type:'fate',desc:'星罗帝国公主，幽冥灵猫武魂。'},
    {name:'传灵塔叛徒',power:0.9,weight:15,type:'betray',desc:'传灵塔中的叛徒，暗中与圣灵教勾结。'},
    {name:'深渊君主',power:1.5,weight:5,type:'beast',desc:'深渊位面的君主，实力恐怖。'},
    {name:'冥帝',power:1.7,weight:3,type:'evil',desc:'圣灵教二帝之一，冥界掌控者。'},
    {name:'枫无羽',power:1.2,weight:6,type:'official',desc:'传灵塔高层，野心勃勃。'},
    {name:'圣灵教使徒',power:1.0,weight:15,type:'official',desc:'圣灵教的核心成员，实力强大。'},
    {name:'恩慈',power:1.4,weight:5,type:'cult',desc:'星罗帝国国师，本体宗宗主。'}
  ],
  douluo4: [
    {name:'天龙星首座',power:1.6,weight:5,type:'official',desc:'天龙星的最强者，龙族至尊。'},
    {name:'天马星首座',power:1.5,weight:6,type:'official',desc:'天马星的最强者，与天龙星首座齐名。'},
    {name:'深红之母',power:1.8,weight:3,type:'evil',desc:'深红之域的主宰，吞噬一切的存在。'},
    {name:'皇元朗',power:1.1,weight:12,type:'fate',desc:'天龙星金龙公主的追求者，火龙族。'},
    {name:'星际海盗',power:0.9,weight:18,type:'betray',desc:'星际间的掠夺者，作恶多端。'},
    {name:'叛徒神祇',power:1.3,weight:8,type:'cult',desc:'背叛斗罗联邦的神祇，投靠深红之域。'},
    {name:'深红之域生物',power:1.0,weight:15,type:'evil',desc:'深红之域的入侵生物，数量庞大。'},
    {name:'龙骑士',power:1.2,weight:8,type:'official',desc:'天龙星的龙骑士，战力极强。'},
    {name:'蓝佛子',power:1.0,weight:10,type:'fate',desc:'深海魔鲸王的女儿，亦正亦邪。'},
    {name:'依子尘',power:1.1,weight:5,type:'fate',desc:'史莱克学院极限斗罗，与凌梓晨相伴。'}
  ],
  godrealm: [
    {name:'毁灭之神',power:1.8,weight:5,type:'official',desc:'神界执法者，执掌毁灭与破坏，神界委员会成员。'},
    {name:'七原罪神',power:1.5,weight:8,type:'cult',desc:'毁灭之神麾下，七大原罪神，各有神通。'},
    {name:'龙神残魂',power:2.0,weight:2,type:'fate',desc:'远古龙神的一缕残魂，仍有毁天灭地之力。'},
    {name:'神界叛逆',power:1.2,weight:12,type:'god',desc:'神界的叛逆神祇，野心勃勃。'},
    {name:'时空乱流生物',power:1.6,weight:5,type:'fate',desc:'时空乱流中的恐怖生物，侵蚀神界。'},
    {name:'深渊位面侵蚀者',power:1.4,weight:8,type:'evil',desc:'深渊位面的入侵者，试图吞噬神界。'},
    {name:'流放神兽',power:1.3,weight:10,type:'beast',desc:'被神界流放的神兽，心怀怨恨。'},
    {name:'心魔劫',power:1.1,weight:15,type:'inner',desc:'修炼中的心魔，最难以对付的敌人。'},
    {name:'金龙王',power:1.9,weight:3,type:'fate',desc:'龙神的一半，力量的化身，被封印于神界。'},
    {name:'银龙王',power:1.9,weight:2,type:'fate',desc:'龙神的一半，精神的化身，魂兽共主。'}
  ]
};

const BEAST_ENEMY_POOL = [
  {name:'二明',power:1.4,weight:8,type:'beast_king',desc:'泰坦巨猿，星斗大森林的霸主之一，力大无穷。'},
  {name:'大明',power:1.6,weight:5,type:'beast_king',desc:'天青牛蟒，星斗大森林真正的王者，十万年魂兽。'},
  {name:'小舞父亲',power:1.3,weight:8,type:'beast',desc:'柔骨兔一族的强者，十万年魂兽。'},
  {name:'蓝电霸王龙',power:1.2,weight:12,type:'beast',desc:'龙族血脉的兽武魂魂兽，雷霆之力覆盖全身。'},
  {name:'人类猎魂师',power:0.9,weight:15,type:'human',desc:'前来猎杀魂兽获取魂环的人类魂师'},
  {name:'邪魂师猎手',power:1.1,weight:10,type:'evil_human',desc:'用邪术猎杀魂师的邪魂师，对魂兽也极具威胁'},
  {name:'天劫雷罚',power:1.3,weight:8,type:'heaven',desc:'修为突破引发的天地雷劫'},
  {name:'暗魔邪神虎',power:1.5,weight:4,type:'beast',desc:'邪恶而强大的魂兽，拥有时空之力。'},
  {name:'人面魔蛛',power:1.0,weight:15,type:'beast',desc:'剧毒蜘蛛形魂兽，人面蛛身，极度危险。'},
  {name:'冰碧帝皇蝎',power:1.4,weight:5,type:'beast',desc:'极北三大天王之一，极致之冰的主宰。'},
  {name:'魂兽叛徒',power:1.0,weight:10,type:'traitor',desc:'投靠人类的堕落魂兽'},
  {name:'心魔侵蚀',power:0.8,weight:10,type:'inner',desc:'修炼中产生的凶性反噬'}
];

// ============================================================
// MARTIAL SOUL SYSTEM
// ============================================================
const MARTIAL_SOULS = [
  {id:'common_weapon',name:'普通器武魂',type:'器武魂',quality:'普通',qColor:'#888',weight:25,desc:'如铜锤、菜刀等常见器物武魂。',examples:['铜锤','铁剑','木盾','长枪']},
  {id:'common_beast',name:'普通兽武魂',type:'兽武魂',quality:'普通',qColor:'#888',weight:20,desc:'如灰狼、野猪等常见兽武魂。',examples:['灰狼','野猪','黑熊','猎鹰']},
  {id:'good_weapon',name:'优秀器武魂',type:'器武魂',quality:'优秀',qColor:'#4488ff',weight:15,desc:'如宝剑、法杖等较为强力的器武魂。',examples:['七星剑','玄铁盾','紫电笔','天罗伞']},
  {id:'good_beast',name:'优秀兽武魂',type:'兽武魂',quality:'优秀',qColor:'#4488ff',weight:12,desc:'如烈焰狮、寒冰蛇等强力兽武魂。',examples:['烈焰狮','寒冰蛇','雷鹰','风狼']},
  {id:'mutant',name:'变异武魂',type:'变异武魂',quality:'优秀~顶级',qColor:'#aa66ff',weight:10,desc:'基因突变产生的异变武魂，可能更强或更弱。',examples:['变异蓝银草','火属性白虎','暗影凤凰']},
  {id:'top_weapon',name:'顶级器武魂',type:'器武魂',quality:'顶级',qColor:'#ffdd44',weight:6,desc:'世界顶尖器武魂，天生成就神级。',examples:['昊天锤','七宝琉璃塔','天罡斧','末日之刃']},
  {id:'top_beast',name:'顶级兽武魂',type:'兽武魂',quality:'顶级',qColor:'#ffdd44',weight:6,desc:'世界顶尖兽武魂，战力惊人。',examples:['蓝电霸王龙','六翼天使','邪眸白虎','火凤凰']},
  {id:'dual',name:'双生武魂',type:'双生武魂',quality:'顶级+',qColor:'#ff4444',weight:1,desc:'极其罕见，同时觉醒两种武魂，如唐三。',examples:['蓝银草+昊天锤']}
];

let SOUL_NAME_POOL = null;
function buildSoulNamePool(){
  if(SOUL_NAME_POOL) return SOUL_NAME_POOL;
  let pool = {common:[],good:[],mutant:[],top:[],dual:[]};
  let elements = ['烈焰','寒冰','狂雷','疾风','暗影','圣光','金刚','碧水','厚土','猛毒'];
  let materials = ['玄铁','紫金','碧玉','寒冰','烈焰','雷晶','风灵','暗影','圣光','龙骨'];
  let animals = ['狼','狮','虎','豹','熊','鹰','蛇','龙','凤','龟','蟒','蝎','蛛','蝠','隼','鹿','猫','犬','猿','象'];
  let weapons = ['剑','刀','枪','戟','斧','锤','鞭','盾','伞','笛','扇','鼎','镜','笔','琴','针','环','戈','棍','刺'];
  let commonW = ['铜锤','铁剑','木盾','长枪','菜刀','扫帚','锄头','镰刀','斧头','匕首','铁棍','木弓','石锤','短刀','铁鞭','铜镜','算盘','毛笔','折扇','茶壶','扁担','锅铲','铁钳','石斧','骨针','木槌','铜锣','铁锏','石刀','骨剑','飞镖','弹弓','木矛','铜戟','铁叉','石棍','骨棒','木锤','皮甲','布袋','铜鼎','铁锅','木碗','石碗','铜勺','铁筷子','木梳','铜簪','铁环','石珠'];
  commonW.forEach(n => pool.common.push({name:n,type:'器武魂',quality:'普通',qColor:'#888'}));
  let commonB = ['灰狼','野猪','黑熊','猎鹰','野猫','狐狸','兔子','鹿','蛇','蜘蛛','蝎子','蜈蚣','老鼠','蝙蝠','乌鸦','麻雀','青蛙','蜥蜴','蜜蜂','蚂蚁','土狗','山羊','公鸡','鸭子','鹅','奶牛','黄牛','驴子','骡子','刺猬','松鼠','花栗鼠','鼹鼠','穿山甲','犰狳','水獭','海豹','企鹅','鸵鸟','火鸡','鸽子','鹦鹉','金丝雀','燕子','喜鹊','乌鸦','猫头鹰','啄木鸟','鸳鸯','鹌鹑'];
  commonB.forEach(n => pool.common.push({name:n,type:'兽武魂',quality:'普通',qColor:'#888'}));
  materials.forEach(m => {
    weapons.forEach(w => {
      pool.good.push({name:m+w,type:'器武魂',quality:'优秀',qColor:'#4488ff'});
    });
  });
  elements.forEach(e => {
    animals.forEach(a => {
      pool.good.push({name:e+a,type:'兽武魂',quality:'优秀',qColor:'#4488ff'});
    });
  });
  let mutantBases = ['变异蓝银草','火属性白虎','暗影凤凰','冰火双头蛇','雷暗双属性狼','血瞳魔狼','幽冥紫豹','圣光金龙','暗金恐爪熊','三眼金猊','赤金玄武','暗影裂空座','光明圣龙','黑暗魔龙','时空双龙','混沌青牛','鸿蒙凤凰','太虚甲龙','乾坤斗罗','星海鲸鲨'];
  let mutantPrefixes = ['变异','暗金','圣灵','幽冥','混沌','太虚','鸿蒙','乾坤','星海','血瞳','天启','末日','创世','灭世','永恒','虚无','深渊','苍穹'];
  mutantPrefixes.forEach(p => {
    animals.slice(0,10).forEach(a => {
      pool.mutant.push({name:p+a,type:'变异武魂',quality:'优秀~顶级',qColor:'#aa66ff'});
    });
  });
  mutantBases.forEach(n => pool.mutant.push({name:n,type:'变异武魂',quality:'优秀~顶级',qColor:'#aa66ff'}));
  let topW = ['昊天锤','七宝琉璃塔','天罡斧','末日之刃','轩辕剑','盘古斧','崆峒印','昆仑镜','神农鼎','伏羲琴','女娲石','东皇钟','诛仙剑','戮仙剑','陷仙剑','绝仙剑','盘古幡','太极图','混沌钟','乾坤鼎','造化玉碟','十二品莲台','山河社稷图','炼妖壶','昆仑剑','天帝剑','九幽镰','星陨锤','龙皇戟','凤鸣琴'];
  topW.forEach(n => pool.top.push({name:n,type:'器武魂',quality:'顶级',qColor:'#ffdd44'}));
  let topB = ['蓝电霸王龙','六翼天使','邪眸白虎','火凤凰','冰凤凰','金龙王','银龙王','深海魔鲸','天青牛蟒','泰坦巨猿','暗金恐爪熊','三眼金猊','地狱魔龙','光明圣龙','冰碧蝎','极北之主','翡翠天鹅','妖眼魔树','山龙王','海龙王'];
  let topElements = ['九彩','十首','万年','百万年','远古','上古','太古','洪荒','混沌','天命'];
  topElements.forEach(te => {
    animals.slice(0,15).forEach(a => {
      pool.top.push({name:te+a+'王',type:'兽武魂',quality:'顶级',qColor:'#ffdd44'});
    });
  });
  topB.forEach(n => pool.top.push({name:n,type:'兽武魂',quality:'顶级',qColor:'#ffdd44'}));
  pool.dual = null;
  SOUL_NAME_POOL = pool;
  return pool;
}

const SOUL_EVOLUTIONS = {
  '蓝银草':{type:'replace',stages:['蓝银皇','蓝银帝皇'],levels:[50,90],ages:[20,35],powers:[5,10],descs:['蓝银草觉醒皇者血脉，生命力大幅增强','蓝银皇进化为帝皇，掌控万千蓝银草']},
  '昊天锤':{type:'replace',stages:['昊天霸锤','昊天神锤'],levels:[70,95],ages:[25,40],powers:[8,10],descs:['昊天锤威力更胜，一锤定音','昊天锤进化为神级，天地变色']},
  '邪眸白虎':{type:'replace',stages:['幽冥白虎','白虎战神'],levels:[60,90],ages:[25,40],powers:[8,10],descs:['白虎与幽冥融合，威力倍增','白虎进化为战神，统御战场']},
  '火凤凰':{type:'replace',stages:['不死凤凰','九首凤凰'],levels:[60,90],ages:[25,40],powers:[8,10],descs:['凤凰涅槃，获得不死之力','凤凰进化为九首，焚尽万物']},
  '冰凤凰':{type:'replace',stages:['极寒冰凤','冰霜神凰'],levels:[60,90],ages:[25,40],powers:[8,10],descs:['冰凤凝聚极寒之力','冰凤进化为神凰，冰封天地']},
  '六翼天使':{type:'replace',stages:['八翼天使','十二翼天使'],levels:[70,95],ages:[25,40],powers:[8,10],descs:['天使之翼增加，神圣之力提升','天使进化为神级，光芒普照']},
  '七宝琉璃塔':{type:'replace',stages:['九宝琉璃塔','十二宝琉璃塔'],levels:[60,90],ages:[25,40],powers:[8,10],descs:['琉璃塔层数增加，辅助能力大增','琉璃塔进化为神级，万法不侵']},
  '蓝电霸王龙':{type:'replace',stages:['雷霆霸王龙','雷神霸王龙'],levels:[60,90],ages:[25,40],powers:[8,10],descs:['霸王龙掌控雷霆之力','霸王龙进化为雷神，万雷臣服']},
  '金龙王':{type:'replace',stages:['龙神金身','不灭龙神'],levels:[80,100],ages:[30,50],powers:[10,10],descs:['金龙王凝聚龙神之躯','金龙王达到不灭之境']},
  '银龙王':{type:'replace',stages:['元素龙皇','元素神龙王'],levels:[80,100],ages:[30,50],powers:[10,10],descs:['银龙王掌控全元素','银龙王进化为元素之神']},
  '深海魔鲸':{type:'replace',stages:['深海魔鲸王','深海魔鲸皇'],levels:[60,90],ages:[25,40],powers:[8,10],descs:['魔鲸统御深海','魔鲸皇威震海洋']},
  '轩辕剑':{type:'replace',stages:['轩辕圣剑','轩辕神剑'],levels:[70,95],ages:[25,40],powers:[8,10],descs:['轩辕剑觉醒圣道之力','轩辕剑进化为神级，斩妖除魔']},
  '诛仙剑':{type:'replace',stages:['诛仙阵剑','诛仙神剑'],levels:[70,95],ages:[25,40],powers:[8,10],descs:['诛仙剑蕴含阵道之力','诛仙剑进化为神级，诛灭仙神']},
  '变异蓝银草':{type:'replace',stages:['变异蓝银皇','混沌蓝银帝'],levels:[50,90],ages:[20,35],powers:[6,10],descs:['变异蓝银草觉醒皇者之力','进化为混沌蓝银帝，掌控生死']},
  '暗影凤凰':{type:'replace',stages:['幽冥凤凰','暗影神凰'],levels:[60,90],ages:[25,40],powers:[8,10],descs:['暗影凤凰掌控幽冥之火','进化为暗影神凰，焚尽灵魂']},
  '暗金恐爪熊':{type:'replace',stages:['暗金熊王','暗金熊皇'],levels:[60,90],ages:[25,40],powers:[8,10],descs:['恐爪熊觉醒王血','进化为熊皇，撕裂空间']},
  '三眼金猊':{type:'replace',stages:['命运金猊','命运神兽'],levels:[70,95],ages:[25,40],powers:[8,10],descs:['三眼金猊掌控命运之力','进化为命运神兽，窥视天机']},
  '_DEFAULT_WEAPON_':{type:'prefix',stages:['灵·','圣·','神·'],levels:[25,50,80],ages:[18,30,45],powers:[2,5,10],descs:['器武魂经魂力蕴养，灵性初开','器武魂进化为圣器，威力倍增','器武魂进化为神器，毁天灭地']},
  '_DEFAULT_BEAST_':{type:'suffix',stages:['王','皇','帝'],levels:[25,50,80],ages:[18,30,45],powers:[2,5,10],descs:['兽武魂血脉觉醒，进化为王者','兽武魂王血沸腾，进化为皇者','兽武魂达到帝级，统御一方']},
  '_DEFAULT_MUTANT_':{type:'suffix',stages:['·觉醒','·完全体','·神话'],levels:[30,60,90],ages:[20,35,50],powers:[3,6,10],descs:['变异武魂基因稳定，展现真正力量','变异武魂达到完全体，潜力全部释放','变异武魂进化为神话级，超越极限']}
};

// ============================================================
// DIVINE SKILL SYSTEM
// ============================================================
const DIVINE_SKILL_POOL = [
  {name:'神光斩',desc:'凝聚神力化作的锋锐光斩，可斩裂虚空'},
  {name:'神域降临',desc:'展开神域，领域内自身战力倍增'},
  {name:'法则掌控',desc:'掌控一种天地法则，随心所欲'},
  {name:'神罚天降',desc:'召唤天罚之力，毁灭性打击'},
  {name:'神体蜕变',desc:'神体进一步蜕变，防御与速度倍增'},
  {name:'神识探查',desc:'神识扫过万里，洞察一切隐匿'},
  {name:'神威压制',desc:'释放神威，弱者直接臣服'},
  {name:'神力灌注',desc:'神力灌注全身，战力暴涨'},
  {name:'神格凝聚',desc:'神格更加凝实，神力上限提升'},
  {name:'神通觉醒',desc:'觉醒一项远古神通，威力无穷'},
  {name:'神界召唤',desc:'召唤神界之力助战'},
  {name:'神之审判',desc:'以神之名审判罪人，无可抵挡'},
  {name:'神之庇护',desc:'获得神之庇护，免疫一次致命伤害'},
  {name:'神之契约',desc:'可与生灵缔结神之契约'},
  {name:'神之创造',desc:'掌握创造之力，可化虚为实'},
  {name:'神之毁灭',desc:'掌握毁灭之力，可湮灭万物'},
  {name:'神之时空',desc:'操控时空法则，自由穿梭'},
  {name:'神之命运',desc:'窥探命运之线，预知未来'},
  {name:'神之轮回',desc:'领悟轮回法则，生死转换'},
  {name:'神之本源',desc:'触及神之本源，近乎全能'}
];

// ============================================================
// SOUL LEVEL SYSTEM
// ============================================================
const SOUL_LEVELS = [
  {min:1,max:10,name:'魂士'},{min:11,max:20,name:'魂师'},{min:21,max:30,name:'大魂师'},
  {min:31,max:40,name:'魂尊'},{min:41,max:50,name:'魂宗'},{min:51,max:60,name:'魂王'},
  {min:61,max:70,name:'魂帝'},{min:71,max:80,name:'魂圣'},{min:81,max:90,name:'魂斗罗'},
  {min:91,max:95,name:'封号斗罗'},{min:96,max:98,name:'超级斗罗'},{min:99,max:99,name:'极限斗罗'},
  {min:100,max:109,name:'神阶'},{min:110,max:119,name:'真神级'},{min:120,max:149,name:'超神级'},
  {min:150,max:200,name:'神王级'}
];

const BASE_RING_LIMITS = [423,764,1760,5000,12000,20000,30000,50000,100000];
const RING_QUALITY_MULTIPLIERS = {普通:1.0,优秀:1.3,变异:1.6,顶级:2.0,双生:3.0,'优秀~顶级':1.8};

function getRingLimit(ringNum){
  let base = BASE_RING_LIMITS[ringNum] || 100000;
  let quality = G.martialSoul?.quality || '普通';
  let mult = RING_QUALITY_MULTIPLIERS[quality] || 1.0;
  let evoStage = G.martialSoul?.evolutionStage || 0;
  mult += evoStage * 0.2;
  return Math.floor(base * mult);
}

const SOUL_RING_COLORS = [
  {max:9,color:'white',cn:'白色',css:'w',bg:'#cccccc'},
  {max:999,color:'yellow',cn:'黄色',css:'y',bg:'#dddd00'},
  {max:9999,color:'purple',cn:'紫色',css:'p',bg:'#aa00ff'},
  {max:99999,color:'black',cn:'黑色',css:'b',bg:'#333333'},
  {max:999999,color:'red',cn:'红色',css:'r',bg:'#ff0000'},
  {max:Infinity,color:'gold',cn:'橙金色',css:'g',bg:'#ffaa00'}
];

const TEN_FEROCIOUS = [
  {rank:1,name:'帝天',title:'金眼黑龙王',age:89,attr:'极致黑暗'},
  {rank:2,name:'邪帝',title:'邪眼暴君主宰',age:79,attr:'极致之恶'},
  {rank:3,name:'雪帝',title:'冰天雪女',age:70,attr:'极致之冰'},
  {rank:4,name:'碧姬',title:'翡翠天鹅',age:58,attr:'治愈之王'},
  {rank:5,name:'万妖王',title:'妖眼魔树',age:55,attr:'植物系之王'},
  {rank:6,name:'熊君',title:'暗金恐爪熊',age:48,attr:'强攻系之王'},
  {rank:7,name:'冰帝',title:'冰碧帝皇蝎',age:40,attr:'极致之冰'},
  {rank:8,name:'赤王',title:'三头赤魔獒',age:35,attr:'帝天部下'},
  {rank:9,name:'妖灵',title:'邪眼暴君',age:30,attr:'邪帝之子'},
  {rank:10,name:'泰坦雪魔王',title:'泰坦雪魔',age:25,attr:'极北天王之三'}
];

const CROSS_SKILLS = [
  {source:'火影忍者',skills:['写轮眼','忍术','仙人模式'],effect:'觉醒为特殊瞳类武魂或查克拉辅助体系',color:'#ff4444'},
  {source:'海贼王',skills:['恶魔果实','霸气','悬赏金'],effect:'恶魔果实作为变异武魂，霸气转化为魂力技巧',color:'#ffaa00'},
  {source:'死神',skills:['斩魄刀','鬼道','卍解'],effect:'斩魄刀作为器武魂，鬼道作为魂技',color:'#4444ff'},
  {source:'进击的巨人',skills:['巨人之力','硬质化','始祖之力'],effect:'巨人变身作为武魂真身特殊形态',color:'#88aa44'},
  {source:'咒术回战',skills:['术式','领域展开','反转术式'],effect:'术式作为自创魂技，领域展开为领域魂技',color:'#6644aa'},
  {source:'鬼灭之刃',skills:['呼吸法','斑纹','通透世界'],effect:'呼吸法融入魂力运转，斑纹为爆发技能',color:'#44aaaa'}
];

// ============================================================
// ACHIEVEMENTS
// ============================================================
const ACHIEVEMENTS = [
  {id:'title_soulshi',name:'初入魂道',cat:'实力',desc:'达到10级',icon:'🌱',check:s=>s.soulPower>=10},
  {id:'title_soulshi2',name:'魂师之路',cat:'实力',desc:'达到20级',icon:'⭐',check:s=>s.soulPower>=20},
  {id:'title_hunzun',name:'魂尊之威',cat:'实力',desc:'达到30级',icon:'💪',check:s=>s.soulPower>=30},
  {id:'title_hunzong',name:'魂宗之名',cat:'实力',desc:'达到50级',icon:'🏆',check:s=>s.soulPower>=50},
  {id:'title_hunsheng',name:'魂圣之境',cat:'实力',desc:'达到70级',icon:'🔥',check:s=>s.soulPower>=70},
  {id:'title_hundouluo',name:'魂斗罗',cat:'实力',desc:'达到80级',icon:'⚡',check:s=>s.soulPower>=80},
  {id:'title_fenghao',name:'封号斗罗',cat:'实力',desc:'达到90级以上',icon:'⚔️',check:s=>s.soulPower>=90},
  {id:'title_chaoji',name:'超级斗罗',cat:'实力',desc:'达到96级',icon:'🔥',check:s=>s.soulPower>=96},
  {id:'title_jixian',name:'极限斗罗',cat:'实力',desc:'达到99级',icon:'👑',check:s=>s.soulPower>=99},
  {id:'title_god',name:'神祇之路',cat:'实力',desc:'继承神位或达到100级',icon:'✨',check:s=>s.soulPower>=100||s.isGod},
  {id:'title_truegod',name:'真神之境',cat:'实力',desc:'达到110级',icon:'🌟',check:s=>s.soulPower>=110},
  {id:'title_chaoshen',name:'超神之境',cat:'实力',desc:'达到120级',icon:'💫',check:s=>s.soulPower>=120},
  {id:'title_shenwang',name:'神王之力',cat:'实力',desc:'达到150级',icon:'🌈',check:s=>s.soulPower>=150},
  {id:'beast_bainian',name:'百年灵兽',cat:'魂兽',desc:'魂兽达到百年',icon:'🐾',check:s=>s.identityType==='soul_beast'&&(s.beastYears||0)>=100},
  {id:'beast_qiannian',name:'千年大妖',cat:'魂兽',desc:'魂兽达到千年',icon:'🐺',check:s=>s.identityType==='soul_beast'&&(s.beastYears||0)>=1000},
  {id:'beast_wannian',name:'万年霸主',cat:'魂兽',desc:'魂兽达到万年',icon:'🐉',check:s=>s.identityType==='soul_beast'&&s.soulPower>=21},
  {id:'beast_shiwan',name:'十万年凶兽',cat:'魂兽',desc:'魂兽达到十万年',icon:'👹',check:s=>s.identityType==='soul_beast'&&(s.beastYears||0)>=100000},
  {id:'beast_xiongshou',name:'凶兽之尊',cat:'魂兽',desc:'达到二十万年凶兽',icon:'🐲',check:s=>s.identityType==='soul_beast'&&s.soulPower>=96},
  {id:'beast_baiwan',name:'百万年传说',cat:'魂兽',desc:'魂兽达到百万年',icon:'✨',check:s=>s.identityType==='soul_beast'&&(s.beastYears||0)>=1000000},
  {id:'beast_transform',name:'化形大道',cat:'魂兽',desc:'成功化形为人类',icon:'🦋',check:s=>s.transformed},
  {id:'beast_escape',name:'死里逃生',cat:'魂兽',desc:'魂兽从人类猎杀中成功逃脱',icon:'🏃',check:s=>s.enemies?.some(e=>e.escaped)},
  {id:'survive_50',name:'半百之寿',cat:'生存',desc:'存活超过50岁',icon:'🗓️',check:s=>s.age>=50},
  {id:'survive_100',name:'百岁老人',cat:'生存',desc:'存活超过100岁',icon:'🎂',check:s=>s.age>=100},
  {id:'survive_200',name:'长寿之星',cat:'生存',desc:'存活超过200岁',icon:'🏛️',check:s=>s.age>=200},
  {id:'survive_500',name:'不死之身',cat:'生存',desc:'存活超过500岁',icon:'🛡️',check:s=>s.age>=500},
  {id:'survive_death',name:'九死一生',cat:'生存',desc:'从濒死边缘存活下来',icon:'💀',check:s=>s.yearEvents?.some(e=>e.text?.includes('濒死')||e.text?.includes('重伤'))&&s.alive},
  {id:'fate_lover',name:'宿命姻缘',cat:'剧情',desc:'拥有道侣',icon:'💘',check:s=>s.hasSpouse},
  {id:'fate_nemesis',name:'宿命之敌',cat:'剧情',desc:'击败5个以上的强敌',icon:'⚔️',check:s=>s.enemies?.length>=5},
  {id:'fate_rich',name:'富甲天下',cat:'剧情',desc:'拥有1000以上金魂币',icon:'💰',check:s=>(s.gold||0)>=1000},
  {id:'fate_famous',name:'名震大陆',cat:'剧情',desc:'名声达到100',icon:'📜',check:s=>(s.merit||0)>=100},
  {id:'fate_master',name:'名师指点',cat:'剧情',desc:'拜入名师门下',icon:'🏛️',check:s=>s.hasMaster},
  {id:'fate_companion',name:'结伴同行',cat:'剧情',desc:'拥有3位以上伙伴',icon:'👥',check:s=>s.companions?.length>=3},
  {id:'dual_soul',name:'双生武魂',cat:'稀有',desc:'觉醒双生武魂',icon:'🔱',check:s=>s.martialSoul?.id==='dual'},
  {id:'gold_ring',name:'神级魂环',cat:'稀有',desc:'获得金色魂环',icon:'💫',check:s=>s.soulRings?.some(r=>r.css==='g')},
  {id:'innate_10',name:'先天满魂力',cat:'稀有',desc:'先天魂力达到10级',icon:'🔥',check:s=>s.innatePower>=10},
  {id:'innate_20',name:'先天二十',cat:'稀有',desc:'先天魂力达到20级',icon:'☄️',check:s=>s.innatePower>=20},
  {id:'all_rings',name:'九环大满贯',cat:'稀有',desc:'集齐九个魂环',icon:'🎯',check:s=>s.soulRings?.length>=9},
  {id:'six_bones',name:'六骨斗罗',cat:'稀有',desc:'集齐六块不同位置魂骨（全骨覆盖）',icon:'🦴',check:s=>s.soulBones?.length>=6},
  {id:'beast_seventh',name:'武魂真身',cat:'稀有',desc:'获得第七魂环·武魂真身',icon:'🔄',check:s=>s.soulRings?.length>=7},
  {id:'custom_title',name:'自封封号',cat:'稀有',desc:'达到封号斗罗并自选封号',icon:'🛡️',check:s=>s.customTitle&&s.soulPower>=90},
  {id:'bloodline_skill',name:'血脉觉醒',cat:'稀有',desc:'觉醒血脉技能',icon:'🩸',check:s=>s.bloodlineSkills?.length>0},
  {id:'era_douluo1',name:'斗罗风云',cat:'时代',desc:'在斗罗1时代达到封号斗罗',icon:'📖',check:s=>s.timeline?.id==='douluo1'&&s.soulPower>=90},
  {id:'era_douluo2',name:'绝世传奇',cat:'时代',desc:'在绝世唐门时代达到封号斗罗',icon:'📖',check:s=>s.timeline?.id==='douluo2'&&s.soulPower>=90},
  {id:'era_douluo3',name:'龙王传颂',cat:'时代',desc:'在龙王传说时代达到封号斗罗',icon:'📖',check:s=>s.timeline?.id==='douluo3'&&s.soulPower>=90},
  {id:'era_douluo4',name:'终极传说',cat:'时代',desc:'在终极斗罗时代达到封号斗罗',icon:'📖',check:s=>s.timeline?.id==='douluo4'&&s.soulPower>=90},
  {id:'era_god',name:'神界传说',cat:'时代',desc:'在神界时代达到神王',icon:'📖',check:s=>s.timeline?.id==='godrealm'&&s.soulPower>=150},
  {id:'era_witness',name:'历史见证者',cat:'时代',desc:'经历时代关键事件',icon:'📜',check:s=>s._triggeredProgress?.length>=3},
  {id:'era_allwitness',name:'时代的亲历者',cat:'时代',desc:'经历全部原著剧情事件',icon:'📚',check:s=>{
    let p=TIMELINE_PROGRESS[s?.timeline?.id];
    return !!(p && s && s._triggeredProgress && s._triggeredProgress.length >= p.length);
  }},
  {id:'quick_start',name:'快速转世',cat:'特殊',desc:'使用快速随机开始游戏',icon:'⚡',check:s=>s._quickStart}
];

// ============================================================
// EVENT POOLS
// ============================================================
const EVENTS = {
  cultivate:[
    {text:'闭关修炼一年，魂力稳步提升。',type:'cultivate',effect:s=>{let g=1+Math.floor(Math.random()*2);if(s.innatePower>=10)g+=1;s.soulPower=Math.min(s.soulPower+g,s.maxLevel);s.events.push(`魂力+${g}级`);return `魂力+${g}级`;}},
    {text:'获得珍贵修炼资源，修炼速度大幅提升！',type:'cultivate',effect:s=>{let g=3+Math.floor(Math.random()*3);s.soulPower=Math.min(s.soulPower+g,s.maxLevel);return `魂力+${g}级！`;}},
    {text:'修炼遇到瓶颈，尝试突破中...',type:'cultivate',choices:[
      {text:'全力突破',effect:s=>{if(Math.random()<0.4){s.soulPower=Math.min(s.soulPower+5,s.maxLevel);return '突破成功！魂力+5级！';}else{s.soulPower=Math.max(s.soulPower-1,1);return '突破失败，魂力-1级。';}}},
      {text:'稳扎稳打',effect:s=>{s.soulPower=Math.min(s.soulPower+1,s.maxLevel);return '稳扎稳打，魂力+1级。';}}
    ]},
    {text:'自创魂技的灵感涌现。',type:'cultivate',condition:s=>s.soulPower>=51,effect:s=>{if(Math.random()<0.15){let names=['破灭之刃','天罡护盾','幻影步','雷霆万钧','冰封万里','灵魂震荡','星辰坠落'];s.customSkills.push(names[Math.floor(Math.random()*names.length)]);return `成功自创魂技！`;}return '灵光一闪但未能成形。';}},
    {text:'斗铠锻造取得进展。',type:'cultivate',condition:s=>['douluo3','douluo4'].includes(s.timeline?.id),effect:s=>{let cur=s.battleArmor||0;let newLv=cur+1;if(Math.random()<0.5&&newLv<=4){s.battleArmor=newLv;let names=['','一字','二字','三字','四字','五字','六字'];return `${names[newLv]}斗铠锻造成功！`;}return '锻造未能取得突破。';}}
  ],
  social:[
    {text:'在旅途中结识了一位志同道合的伙伴。',type:'social',effect:s=>{let companions=['热血少年','冷静谋士','活泼少女','神秘老者','豪爽战士'];s.companions.push(companions[Math.floor(Math.random()*companions.length)]);return '结识了新伙伴！';}},
    {text:'一位前辈看中了你的天赋，愿意收你为徒。',type:'social',choices:[
      {text:'拜师学艺',effect:s=>{s.hasMaster=true;s.masterBonus=true;return '拜入名师门下，修炼速度大幅提升！后续修炼事件效果翻倍。';}},
      {text:'婉言谢绝',effect:s=>{return '婉言谢绝，继续独自修炼。';}}
    ]},
    {text:'命运的邂逅——你遇到了一位令人心动的人...',type:'social',condition:s=>!s.hasSpouse&&s.age>=18&&(s.soulPower||0)>=40,wheel:'lover'},
    {text:'所属势力发生了内部争斗，你需要选择立场。',type:'social',condition:s=>s.faction,choices:[
      {text:'支持现任掌权者',effect:s=>{if(Math.random()<0.5){s.factionReputation=(s.factionReputation||0)+10;return '选择正确，在势力中声望大增！';}else{s.faction='';return '站错队，被驱逐出势力。';}}},
      {text:'支持挑战者',effect:s=>{if(Math.random()<0.3){s.factionReputation=(s.factionReputation||0)+15;return '挑战者胜出，你成为新势力核心成员！';}else{s.faction='';return '挑战者失败，你受到牵连。';}}},
      {text:'保持中立',effect:s=>{return '明哲保身，静观其变。';}}
    ]},
    {text:'宗门之间提议联姻。',type:'social',condition:s=>s.faction&&s.age>=18&&s.age<=40,choices:[
      {text:'接受联姻',effect:s=>{s.hasSpouse=true;s.factionReputation=(s.factionReputation||0)+5;return '联姻成功，两大势力关系更加紧密。';}},
      {text:'拒绝联姻',effect:s=>{return '拒绝了联姻提议，保持自由身。';}}
    ]}
  ],
  battle:[
    {text:'全大陆高级魂师大赛开始了！',type:'battle',condition:s=>s.age>=12&&s.age<=25,choices:[
      {text:'全力参赛',effect:s=>{if(s.soulPower>=30&&Math.random()<0.3){s.achievementsEarned=s.achievementsEarned||[];s.achievementsEarned.push('champion');s.soulPower=Math.min(s.soulPower+3,s.maxLevel);return '一路过关斩将，夺得大赛冠军！名震大陆！';}else if(Math.random()<0.5){s.soulPower=Math.min(s.soulPower+1,s.maxLevel);return '表现不错，但未能夺冠，获得了一些经验和资源。';}else{return '遗憾落败，但积累了宝贵的战斗经验。';}}},
      {text:'观赛学习',effect:s=>{s.soulPower=Math.min(s.soulPower+1,s.maxLevel);return '在观众席观摩高手对决，有所感悟，魂力+1级。';}}
    ]},
    {text:'宿命的对决——一位强敌挡在了你的面前！',type:'battle',condition:s=>s.age>=15,wheel:'enemy'},
    {text:'在野外遭遇强敌袭击！',type:'battle',choices:[
      {text:'迎头痛击',effect:s=>{if(Math.random()<0.5){s.soulPower=Math.min(s.soulPower+2,s.maxLevel);return '成功击退强敌，实力有所提升！';}else{if(Math.random()<0.2){s.alive=false;return '不敌强敌，命陨当场...';}return '战斗失败但侥幸逃脱，身受重伤。';}}},
      {text:'撤退逃跑',effect:s=>{if(Math.random()<0.7){return '成功逃离，虽然狼狈但保住了性命。';}else{return '逃跑失败，被追上痛殴一顿，但保住了命。';}}}
    ]},
    {text:'两大帝国之间爆发了战争！',type:'battle',choices:[
      {text:'投身战场',effect:s=>{if(Math.random()<0.4){s.soulPower=Math.min(s.soulPower+3,s.maxLevel);s.merit=(s.merit||0)+10;return '在战场上大放异彩，立下赫赫战功！';}else{if(Math.random()<0.25){s.alive=false;return '战场上刀剑无眼，你倒在了冲锋的路上...';}return '战争中九死一生，侥幸存活。';}}},
      {text:'远离战火',effect:s=>{return '选择避开战场，在后方安静修炼。';}}
    ]},
    {text:'在斗魂场接受挑战。',type:'battle',effect:s=>{if(Math.random()<0.6){s.soulPower=Math.min(s.soulPower+1,s.maxLevel);s.gold=(s.gold||0)+100;return '斗魂胜利！获得100金魂币和声望。';}else{return '斗魂失败，但积累了经验。';}}}
  ],
  fortune:[
    {text:'在深山中发现了稀世仙草！',type:'fortune',effect:s=>{let herbs=['八角玄冰草','望穿秋水露','绮罗郁金香','蓝银皇草','鸡冠凤凰葵','海神之光碎片'];let herb=herbs[Math.floor(Math.random()*herbs.length)];s.soulPower=Math.min(s.soulPower+3,s.maxLevel);return `获得仙草「${herb}」，魂力+3级！`;}},
    {text:'偶然发现了一处远古遗迹！',type:'fortune',choices:[
      {text:'深入探索',effect:s=>{if(Math.random()<0.4){s.soulPower=Math.min(s.soulPower+5,s.maxLevel);s.keyEvents=s.keyEvents||[];s.keyEvents.push('发现远古遗迹');return '在遗迹中获得了一位远古强者的传承！魂力+5级！';}else if(Math.random()<0.5){return '遗迹中机关重重，虽然受伤但找到了一些宝物。';}else{s.alive=false;return '触发了遗迹的终极禁制，命丧于此...';}}},
      {text:'标记位置后离开',effect:s=>{return '谨慎起见，标记后离开，日后再来。';}}
    ]},
    {text:'武魂在特殊环境下发生了变异！',type:'fortune',choices:[
      {text:'引导变异',effect:s=>{if(Math.random()<0.5){s.martialSoul={...s.martialSoul,quality:'顶级',qColor:'#ffdd44'};return '武魂正向变异！品质提升为顶级！';}else{return '变异失控，武魂品质下降...';}}},
      {text:'压制变异',effect:s=>{return '强行压制了变异，武魂保持不变。';}}
    ]},
    {text:'体内沉睡的血脉被激活了！',type:'fortune',effect:s=>{let bloodlines=['龙神血脉','天使血脉','海神血脉','修罗血脉','生命女神血脉'];let bl=bloodlines[Math.floor(Math.random()*bloodlines.length)];s.bloodline=bl;s.soulPower=Math.min(s.soulPower+5,s.maxLevel);return `觉醒了「${bl}」！魂力+5级，潜力大幅提升！`;}},
    {text:'天空出现了异界裂缝！',type:'fortune',effect:s=>{if(Math.random()<0.15){let cs=CROSS_SKILLS[Math.floor(Math.random()*CROSS_SKILLS.length)];let skill=cs.skills[Math.floor(Math.random()*cs.skills.length)];s.crossSkills=s.crossSkills||[];s.crossSkills.push({source:cs.source,skill:skill,effect:cs.effect,color:cs.color});return `穿越异界裂缝！获得「${cs.source}」技能——${skill}！`;}return '异界裂缝一闪而过，你来不及做出反应。';}},
    {text:'神级传承的气息从天而降！',type:'fortune',condition:s=>s.soulPower>=80,effect:s=>{if(Math.random()<0.3){s.soulPower=Math.min(s.soulPower+10,s.maxLevel);s.keyEvents=s.keyEvents||[];s.keyEvents.push('获得神级传承');return '成功接受神级传承！魂力+10级！';}return '传承的气息太过强大，你无力承受。';}}
  ],
  crisis:[
    {text:'遭遇了远超自身实力的强敌！',type:'crisis',choices:[
      {text:'拼死一战',effect:s=>{if(Math.random()<0.2){s.soulPower=Math.min(s.soulPower+5,s.maxLevel);return '绝境中爆发，反杀强敌！魂力+5级！';}else{s.alive=false;return '实力差距太大，命陨当场...';}}},
      {text:'请求援军',effect:s=>{if(s.companions.length>0||s.faction){return '在同伴/势力的帮助下脱离险境。';}else{return '孤立无援，只能独自面对...';}}},
      {text:'献宝求饶',effect:s=>{if(s.gold>=100){s.gold-=100;return '献出珍贵物品，换回一条命。';}else{s.alive=false;return '身无分文，无路可退...';}}}
    ]},
    {text:'修炼时走火入魔！',type:'crisis',choices:[
      {text:'强行压制',effect:s=>{if(Math.random()<0.5){return '凭借意志力强行压制了暴走的魂力。';}else{s.soulPower=Math.max(s.soulPower-5,1);return '压制失败，魂力倒退5级...';}}},
      {text:'停止修炼疗伤',effect:s=>{return '及时停止修炼，花了一年时间疗伤恢复。';}}
    ]},
    {text:'所属势力遭到了攻击！',type:'crisis',condition:s=>s.faction,choices:[
      {text:'誓死守护',effect:s=>{if(Math.random()<0.5){s.factionReputation=(s.factionReputation||0)+20;return '在保卫战中英勇作战，声望大增！';}else{s.faction='';if(Math.random()<0.2)s.alive=false;return '势力覆灭，你被迫流亡...';}}},
      {text:'及时撤离',effect:s=>{s.faction='';return '提前撤离，保住了性命，但失去了势力庇护。';}}
    ]},
    {text:'天劫降临！',type:'crisis',condition:s=>s.identityType==='soul_beast',effect:s=>{if(Math.random()<0.4){s.soulPower=Math.min(s.soulPower+5,s.maxLevel);return '成功渡劫！魂力+5级，实力暴涨！';}else{s.alive=false;return '天劫太过强大，魂飞魄散...';}}},
    {text:'被全大陆通缉！',type:'crisis',choices:[
      {text:'洗清冤屈',effect:s=>{if(Math.random()<0.4){return '经过努力，终于洗清了冤屈。';}else{return '洗冤失败，只能继续逃亡。';}}},
      {text:'隐姓埋名',effect:s=>{s.faction='';return '隐姓埋名，在偏远之地重新开始。';}}
    ]}
  ]
};

// Soul beast events
const BEAST_EVENTS = [
  {text:'在森林深处找到了一处灵气充裕的栖息地。',type:'cultivate',effect:s=>{s.soulPower=Math.min(s.soulPower+3,s.maxLevel);return '灵气充裕，修炼加速！魂力+3级。';}},
  {text:'遭遇猎魂师的追杀！',type:'crisis',choices:[
    {text:'正面迎战',effect:s=>{if(Math.random()<0.4){s.soulPower=Math.min(s.soulPower+2,s.maxLevel);return '击退猎魂师，吸收对方魂力！';}else{s.alive=false;return '不敌猎魂师，命丧黄泉...';}}},
    {text:'逃入深林',effect:s=>{return '凭借对地形的熟悉成功逃脱。';}}
  ]},
  {text:'觉醒了一项血脉技能！',type:'fortune',effect:s=>{let skills=['暗影突袭','雷霆之怒','冰封领域','烈焰风暴','精神冲击','龙息'];s.bloodlineSkills=s.bloodlineSkills||[];s.bloodlineSkills.push(skills[Math.floor(Math.random()*skills.length)]);return '血脉觉醒，获得新技能！';}},
  {text:'天劫即将降临，必须突破年限！',type:'crisis',effect:s=>{if(Math.random()<0.5){s.soulPower=Math.min(s.soulPower+5,s.maxLevel);return '成功渡劫！实力大增！';}else{s.alive=false;return '天劫失败，魂飞魄散...';}}},
  {text:'十万年大关已到，可以选择化形。',type:'fortune',condition:s=>s.beastYears>=100000&&s.identityType==='soul_beast'&&!s.transformed,choices:[
    {text:'化形为人',effect:s=>{
      s.transformed=true;
      s.transformedBeastYears = s.beastYears;
      s.identityType='human';
      s.age = 6;
      // 根据原魂兽年限决定化形后武魂品质与先天魂力
      let years = s.transformedBeastYears;
      let quality, qColor, innatePower, innateRating, innateRatingColor, bonusText;
      if(years >= 1000000){
        quality='双生'; qColor='#ff4444'; innatePower=15;
        innateRating='神级先天魂力'; innateRatingColor='#ff4444';
        bonusText='百万年本源觉醒双生武魂，神级天赋震撼天地';
      }else if(years >= 200000){
        quality='顶级+'; qColor='#ff8800'; innatePower=12;
        innateRating='超凡先天魂力'; innateRatingColor='#ff8800';
        bonusText='二十万年本源凝练，超凡天赋冠绝同辈';
      }else{
        quality='顶级'; qColor='#ffdd44'; innatePower=10;
        innateRating='先天满魂力'; innateRatingColor='#ffdd44';
        bonusText='十万年本源觉醒，先天满魂力';
      }
      s.innatePower = innatePower;
      s.innateRating = innateRating;
      s.innateRatingColor = innateRatingColor;
      s.soulPower = Math.min(s.soulPower + innatePower, s.maxLevel);
      // 基于原魂兽生成武魂
      let beastName = s.identity?.name?.replace(/（.*）/,'') || s.identity?.name || '未知';
      // 根据血脉属性自动决定武魂类型
      let bloodlineAttrs = s.bloodline?.attr || {};
      let soulType = '强攻系';
      if(bloodlineAttrs.control >= 1.3) soulType = '控制系';
      else if(bloodlineAttrs.heal >= 1.3) soulType = '辅助系';
      else if(bloodlineAttrs.defense >= 1.3) soulType = '防御系';
      else if(bloodlineAttrs.speed >= 1.3) soulType = '敏攻系';
      else soulType = '强攻系';
      // 保留血脉技能并转化为武魂基础魂技
      let baseSkills = [];
      if(Array.isArray(s.bloodlineSkills) && s.bloodlineSkills.length > 0){
        s.bloodlineSkills.forEach(skillName => {
          let sType = 'attack';
          if(skillName.includes('冰封') || skillName.includes('束缚') || skillName.includes('精神')) sType = 'control';
          else if(skillName.includes('盾') || skillName.includes('防御')) sType = 'defense';
          else if(skillName.includes('增幅') || skillName.includes('真身')) sType = 'boost';
          baseSkills.push({
            name: skillName + '（血脉传承）',
            type: sType,
            desc: skillName + '：源自血脉的传承之力，化形后仍可发挥原本的魂兽本能。'
          });
        });
      }
      s.martialSoul = {
        name:beastName, type:soulType, quality:quality, qColor:qColor,
        example:beastName, rings:[], skills:baseSkills, _baseName:beastName, evolutionStage:0
      };
      s.soulRings = s.martialSoul.rings;
      // 保留血脉作为天赋属性加成（不清除 s.bloodline）
      let bloodlineName = s.bloodline?.name || '未知';
      return '成功化形为人类！'+bonusText+'，觉醒'+quality+'武魂「'+beastName+'」（'+soulType+'），获得'+innatePower+'级'+innateRating+'，以6岁孩童之姿开启全新修炼之路！血脉之力仍存，可发挥'+bloodlineName+'血脉特性。（原魂兽修为：'+formatYears(s.transformedBeastYears)+'）';
    }},
    {text:'保持兽身',effect:s=>{
      let bonus = s.beastYears >= 1000000 ? 30000 : (s.beastYears >= 200000 ? 20000 : 10000);
      s.soulPower = Math.min(s.soulPower + 8, s.maxLevel);
      s.beastYears += bonus;
      return '选择保持魂兽之身继续修炼，年限+'+formatYears(bonus)+'，实力更上一层楼。未来仍可选择化形，且年限越高化形后天赋越强！';
    }}
  ]},
  // 新增：修炼瓶颈事件（魂兽专属，鼓励冲刺高年限）
  {text:'感受到修为即将突破，闭关冲击年限！',type:'fortune',condition:s=>s.identityType==='soul_beast'&&!s.transformed&&s.beastYears>=10000&&s.beastYears<100000,choices:[
    {text:'冲击十万年大关',effect:s=>{
      if(Math.random() < 0.6){
        s.beastYears += 50000;
        syncBeastSoulPower();
        return '突破成功！年限大涨五万年，距离十万年化形更近一步！';
      }else{
        s.beastYears += 10000;
        syncBeastSoulPower();
        return '冲击未完全成功，但修为仍增长了一万年。';
      }
    }},
    {text:'稳扎稳打修炼',effect:s=>{
      s.beastYears += 8000;
      syncBeastSoulPower();
      return '稳步修炼，年限+八千年，根基更加稳固。';
    }}
  ]},
  // 新增：血脉觉醒事件（基于血脉系触发）
  {text:'血脉之力涌动，潜藏的能力即将觉醒！',type:'fortune',condition:s=>s.identityType==='soul_beast'&&!s.transformed&&s.beastYears>=50000,effect:s=>{
    s.bloodlineSkills = s.bloodlineSkills || [];
    let bloodlineId = s.bloodline?.id || 'fire';
    let skillsByBlood = {
      fire:['烈焰焚天','凤凰涅槃','三昧真火'],
      ice:['绝对零度','极寒领域','九幽寒冰'],
      thunder:['雷霆万钧','紫电狂雷','雷神之怒'],
      wind:['疾风骤雨','龙卷风暴','灭世风刃'],
      earth:['大地之盾','山崩地裂','大地之怒'],
      water:['深海领域','沧海横流','碧波万顷'],
      wood:['生命祝福','生生不息','荆棘缠绕'],
      dark:['暗影潜行','黑暗天幕','永夜降临'],
      light:['圣光审判','神圣冲击','天照'],
      poison:['万毒噬心','碧磷蛇毒','十香软筋散'],
      spirit:['精神幻境','精神控制','灵魂碾压'],
      dragon:['龙息','龙吟九天','逆鳞之怒'],
      space:['空间禁锢','空间撕裂','虚空之刃'],
      time:['时间凝滞','因果逆转','时光回溯'],
      devour:['吞噬领域','万物归虚','深渊之口']
    };
    let pool = skillsByBlood[bloodlineId] || skillsByBlood.fire;
    let newSkill = pool[Math.floor(Math.random() * pool.length)];
    if(s.bloodlineSkills.includes(newSkill)){
      return '血脉涌动，但已有该技能，力量反而更加精纯。魂力+5级。';
    }
    s.bloodlineSkills.push(newSkill);
    s.soulPower = Math.min(s.soulPower + 3, s.maxLevel);
    return '血脉觉醒，获得新技能「'+newSkill+'」！该技能将在化形后转化为武魂基础魂技。';
  }},
  // 新增：天材地宝事件
  {text:'在领地中发现了一处天材地宝！',type:'fortune',condition:s=>s.identityType==='soul_beast'&&!s.transformed,effect:s=>{
    let bonus = Math.floor(s.beastYears * 0.1) + 5000;
    s.beastYears += bonus;
    syncBeastSoulPower();
    return '发现天材地宝，吞噬后年限+'+formatYears(bonus)+'，修为大涨！';
  }}
];

// ============================================================
// SOUL RING SKILL GENERATION
// ============================================================
const SKILL_TEMPLATES = {
  attack: [
    {prefix:'雷',skills:['雷鸣','雷霆万钧','紫电狂雷','天雷斩','万雷天牢引','雷神之怒']},
    {prefix:'火',skills:['烈焰冲击','炎爆术','焚天烈焰','凤凰涅槃','三昧真火','天火燎原']},
    {prefix:'冰',skills:['寒冰箭','冰封千里','绝对零度','极寒领域','冰天雪女','九幽寒冰']},
    {prefix:'风',skills:['风刃','疾风骤雨','龙卷风暴','天罡风','裂空斩','灭世风刃']},
    {prefix:'暗',skills:['暗影突袭','暗影潜行','黑暗天幕','修罗暗影','吞噬之暗','永夜降临']},
    {prefix:'光',skills:['圣光审判','光明之火','神圣冲击','圣光壁垒','天照','神圣毁灭']},
    {prefix:'金',skills:['金刃斩','金刚不坏','万剑归宗','剑气纵横','破灭之刃','天罡剑阵']},
    {prefix:'水',skills:['水龙弹','海浪冲击','怒海狂涛','碧波万顷','深海领域','沧海横流']},
    {prefix:'土',skills:['岩石崩裂','大地之盾','山崩地裂','地裂天崩','厚土之力','大地之怒']},
    {prefix:'毒',skills:['毒雾弥漫','剧毒侵蚀','万毒噬心','碧磷蛇毒','十香软筋散','天下第一毒']}
  ],
  defense: [
    {prefix:'防御',skills:['铁壁','金刚盾','不动明王','绝对防御','圣光护盾','神之庇护']},
    {prefix:'恢复',skills:['生命之光','治愈之泉','生命祝福','起死回生','生命女神的恩赐','不死之身']}
  ],
  control: [
    {prefix:'精神',skills:['精神干扰','精神冲击','灵魂震慑','精神幻境','精神控制','灵魂碾压']},
    {prefix:'束缚',skills:['缠绕','蛛网束缚','定身术','空间禁锢','天地锁','万法归一']}
  ],
  boost: [
    {prefix:'增幅',skills:['力量增幅','速度倍增','全属性提升','战意高昂','武魂真身','九宝无敌神光']}
  ]
};

const RING_MILESTONES = [10,20,30,40,50,60,70,80,90];

// ============================================================
// YEAR EVENT WHEEL SYSTEM
// ============================================================
const YEAR_EVENT_WHEEL = [
  {id:'normal',name:'普通修炼',weight:12,color:'#44aa66',desc:'闭关苦修，感悟天地之力，实力稳步提升。',eventType:'normal'},
  {id:'school',name:'学院修炼',weight:15,color:'#4488ff',desc:'在学院中刻苦学习，与同学切磋交流，实力稳步提升。',eventType:'school',condition:(g)=>g.identityType!=='soul_beast'&&g.timeline?.soulRingMode!=='divine'&&(g.age>=6&&g.age<=25)},
  {id:'partner',name:'伴侣共修',weight:12,color:'#ff66aa',desc:'与道侣共同修炼，两人相辅相成，魂力精进。',eventType:'partner',condition:(g)=>g.hasSpouse===true},
  {id:'enemy',name:'强敌来袭',nameOverride:{godrealm:'神界动乱'},weight:8,color:'#ff4444',desc:'宿命的对决——一位强敌挡在了你的面前！',eventType:'enemy',subWheel:'enemy',condition:(g)=>(g.soulPower||0)>=10&&g.age>=18},
  {id:'justice',name:'路见不平',weight:12,color:'#44ddff',desc:'路见不平，拔刀相助！你的选择将改变命运。',eventType:'justice',condition:(g)=>g.age>=18&&(g.soulPower||0)>=30&&(g.soulPower||0)<70},
  {id:'auction',name:'拍卖会',weight:10,color:'#ffdd44',desc:'拍卖会上宝物云集，你能否拍得心仪之物？',eventType:'auction',condition:(g)=>(g.gold||0)>=50},
  {id:'fortune',name:'天赐机遇',weight:18,color:'#aa66ff',desc:'天赐机缘，奇遇连连，命运的馈赠悄然降临。',eventType:'fortune'},
  {id:'timeline',name:'时间线奇缘',weight:8,color:'#ff8800',desc:'命运的丝线将你与某位原著角色交织在一起...',eventType:'timeline',subWheel:'timeline'},
  {id:'reroll',name:'再来一次',weight:5,color:'#00ff88',desc:'命运的齿轮再次转动，你将获得一次重新选择的机会！',eventType:'reroll'}
];

// ============================================================
// SCHOOL EVENTS
// ============================================================
const SCHOOL_EVENTS = {
  douluo1: {
    name: '史莱克学院',
    desc: '弗兰德院长在索托城创办的怪物学院，只招收真正的天才，口号是"只收怪物不收普通人"。',
    events: [
      {text: '弗兰德院长亲自对你进行魔鬼训练，负重跑、瀑布下冥想，你的身体极限被不断突破。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text: '大师玉小刚的理论课让你茅塞顿开——原来武魂之间还有如此精妙的配合之道！', effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级';}},
      {text: '柳二龙副院长带你去星斗大森林外围猎杀魂兽，实战经验大幅提升。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+3;return '魂力+2级，名声+3';}},
      {text: '你与史莱克七怪进行团队对战演练，唐三的战术指挥让你受益匪浅。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+1级，名声+5';}},
      {text: '学院食堂的大香肠让你永生难忘——虽然味道奇怪但恢复效果惊人。', effect:(g)=>{g.gold=(g.gold||0)+10;return '获得10金魂币';}},
      {text: '赵无极老师亲自测试你的实力，在不动明王的威压下你的战斗意志更加坚定。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}}
    ]
  },
  douluo2: {
    name: '史莱克学院',
    desc: '大陆第一学院，外院与内院并存，汇聚天下英才。海神阁是学院最高权力机构。',
    events: [
      {text: '周漪老师的新生考核异常严格，你在高压下突破了自身极限。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text: '帆羽老师带你进入魂导系实验室，你第一次亲手制作出一件一级魂导器。', effect:(g)=>{g.battleArmor=Math.max(g.battleArmor||0,1);g.gold=(g.gold||0)+15;return '掌握魂导基础，获得15金魂币';}},
      {text: '你成功考入史莱克内院，言少哲院长亲自为你颁发内院徽章。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);g.merit=(g.merit||0)+8;return '魂力+3级，名声+8';}},
      {text: '穆老在黄金树下的授课让你对光明与生命有了新的感悟。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text: '玄老带你执行监察团任务，铲除邪魂师的行动让你明白强者的责任。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+6;return '魂力+2级，名声+6';}},
      {text: '你在海神湖畔冥想，黄金树的力量洗涤你的心灵。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return '魂力+1级';}}
    ]
  },
  douluo3: {
    name: '史莱克学院',
    desc: '斗罗大陆最顶尖的魂师学院。在魂兽濒临灭绝的时代，传灵塔与学院共同培养新一代魂师。',
    events: [
      {text: '舞长空老师对你进行了冷傲但严格的指导，你的剑法/身法精进不少。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text: '你在传灵塔的升灵台中进行虚拟实战，魂灵在战斗中获得了成长。', effect:(g)=>{if(g.soulRings&&g.soulRings.length>0){let last=g.soulRings[g.soulRings.length-1];last.years=Math.floor(last.years*1.2);}g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return '魂灵年份提升20%，魂力+1级';}},
      {text: '枫无羽长老亲自指点你锻造，作为圣匠的他让你的锻造技艺突飞猛进。', effect:(g)=>{g.gold=(g.gold||0)+30;return '获得30金魂币';}},
      {text: '浊世长老的赤龙九式虽然只是演示，但让你明白了力量与技巧的结合。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text: '你在斗铠工坊成功制作出第一件有灵合金，向一字斗铠迈出了第一步。', effect:(g)=>{g.battleArmor=Math.max(g.battleArmor||0,2);return '掌握斗铠基础';}},
      {text: '参加学院组织的星斗大森林实战，你第一次感受到濒临灭绝的魂兽们的悲哀。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+4;return '魂力+1级，名声+4';}},
      {text: '云冥阁主亲自授课，擎天枪的枪意让你明白了什么是"一枪擎天"。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级（阁主指点）';}}
    ]
  },
  douluo4: {
    name: '史莱克学院',
    desc: '星际时代最顶尖的魂师学院，拥有精灵星、天龙星等外星分院，是联邦的中流砥柱。',
    events: [
      {text: '唐震华老师带你进行星际航行实训，你第一次驾驶宇宙飞船。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text: '在精灵星的魂兽栖息地，你与一只强大的外星魂兽建立了友谊。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+1级，名声+5';}},
      {text: '参加龙源星实战演练，你第一次与龙族生物交手，经验宝贵。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+2级，名声+5';}},
      {text: '娜娜老师教导你古武技巧，她的教学方式独特而高效。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text: '在天龙星的龙族秘境中，你感受到龙神血脉的召唤。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return '魂力+1级';}},
      {text: '参加史莱克七怪选拔赛，你的表现让评委们眼前一亮。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);g.merit=(g.merit||0)+8;return '魂力+3级，名声+8';}},
      {text: '唐乐（唐舞麟）在学院举办音乐会，金龙王的旋律中你领悟了力量与美的融合。', effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}}
    ]
  }
};

// ============================================================
// TIMELINE PROGRESS
// ============================================================
const TIMELINE_PROGRESS = {
  douluo1: [
    {age:6, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐三在圣魂村觉醒双生武魂，蓝银草与昊天锤横空出世，斗罗大陆新一代天才崛起。天下魂师为之震动，新的时代即将开启。', sp:1},
    {age:8, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐三在诺丁学院遇到大师玉小刚，两人一见如故。玉小刚发现了唐三蓝银草的隐藏特性，收他为徒，开始系统的武魂理论研究。', sp:1},
    {age:10, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐三在猎魂森林获得第一魂环——四百年的曼陀罗蛇，蓝银草缠绕能力初显锋芒。', sp:1},
    {age:12, text:'<b style="color:var(--gold);">【原著剧情】</b> 史莱克学院迎来新一届招生，唐三、小舞、戴沐白、奥斯卡、马红俊、宁荣荣、朱竹清七人齐聚，史莱克七怪正式成形！', sp:2},
    {age:14, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐三在落日森林遇到毒斗罗独孤博，以毒攻毒救治其孙女独孤雁，获引至冰火两仪眼。唐三采摘仙草为七怪量身定制提升方案，宁荣荣七宝琉璃塔进化为九宝琉璃塔，马红俊邪火凤凰纯化为火凤凰。', sp:2, merit:5},
    {age:15, text:'<b style="color:var(--gold);">【原著剧情】</b> 全大陆高级魂师学院大赛正式开幕！史莱克七怪一路过关斩将，击败武魂殿黄金一代的武魂融合技"妖魅"，震惊整个魂师界。', sp:2},
    {age:16, text:'<b style="color:var(--red);">【原著剧情】</b> 大赛决赛上，小舞十万年魂兽身份暴露！比比东下令活捉，唐昊从天而降以一己之力救走唐三与小舞，昊天斗罗之名再次响彻大陆。', sp:1, merit:5},
    {age:18, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐三与小舞在天斗城大斗魂场以"千手修罗"之名参加斗魂，连续胜利引发广泛关注。', sp:1, merit:3},
    {age:20, text:'<b style="color:var(--red);">【原著剧情】</b> 小舞献祭！为救唐三，十万年柔骨兔献祭自身，唐三获得十万年魂环与魂骨，悲痛欲绝。', sp:3, merit:10},
    {age:21, text:'<b style="color:var(--red);">【原著剧情】</b> 天斗宫变！千仞雪伪装成大皇子雪清河二十年的阴谋被唐三识破，天使领域笼罩天斗皇宫，一场惊天大战爆发。', sp:2, merit:8},
    {age:22, text:'<b style="color:var(--gold);">【原著剧情】</b> 海神岛现世！唐三带领史莱克七怪前往海神岛接受海神考核，海神之光笼罩全岛，海神九考正式启动。', sp:3, merit:10},
    {age:24, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐三在海神岛通过海神九考，获得海神三叉戟与海神神位传承，实力达到半神境界。', sp:3, merit:12},
    {age:25, text:'<b style="color:var(--gold);">【原著剧情】</b> 嘉陵关大战！唐三继承海神与修罗神双神位，击败罗刹神比比东与天使之神千仞雪，斗罗大陆迎来新的和平时代。', sp:5, merit:20}
  ],
  douluo2: [
    {age:11, text:'<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩离开公爵府，在星斗大森林遇到百万年魂兽天梦冰蚕，获得史上第一个百万年魂环。随后冰碧帝皇蝎冰帝献祭自身，化为霍雨浩的第二武魂，双生武魂觉醒！', sp:2},
    {age:12, text:'<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩进入史莱克学院，与女扮男装的唐舞桐（王冬）成为室友。新生考核中两人武魂融合技"浩冬之力"首次亮相，震惊史莱克学院。', sp:1},
    {age:13, text:'<b style="color:var(--red);">【原著剧情】</b> 霍雨浩在星斗大森林遇险时，体内沉睡的伊莱克斯神识苏醒，以死灵之力击退万年魂兽。伊莱克斯从此成为霍雨浩的精神导师，但神识在逐渐消散。', sp:2},
    {age:14, text:'<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩作为交换生前往日月帝国明德堂学习魂导科技，接触到大陆最前沿的魂导器技术，眼界大开。', sp:2},
    {age:16, text:'<b style="color:var(--gold);">【原著剧情】</b> 全大陆高级魂师学院大赛激战正酣！霍雨浩带领史莱克七怪击败日月帝国战队，捍卫了史莱克的荣耀。', sp:2, merit:8},
    {age:18, text:'<b style="color:var(--red);">【原著剧情】</b> 圣灵教现世！邪魂师肆虐大陆，玄老带领史莱克监察团前往明斗山脉剿匪，遭遇惨烈伏击，邪魂师的恐怖令全大陆震动。', sp:1, merit:5},
    {age:20, text:'<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩在极北之地找到雪帝残魂，将冰帝的消息传递给她，雪帝残魂融入霍雨浩体内，极致之冰发生质变。', sp:2, merit:8},
    {age:22, text:'<b style="color:var(--gold);">【原著剧情】</b> 帝天发动星斗大森林兽潮！霍雨浩与帝天谈判，最终达成魂灵契约，建立传灵塔，开创魂兽与人类共存的新纪元。', sp:3, merit:10},
    {age:24, text:'<b style="color:var(--red);">【原著剧情】</b> 乾坤问情谷！霍雨浩与王冬儿（唐舞桐）的感情经历生死考验，王冬儿为救霍雨浩陷入沉睡。', sp:2, merit:8},
    {age:26, text:'<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩自创情绪之神神位，七色光环加身。与唐舞桐在史莱克城上空一同飞升神界，传灵塔射出七色光柱为其送行。', sp:5, merit:20}
  ],
  douluo3: [
    {age:6, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟在红山学院觉醒蓝银草武魂，同时右手化为金色龙爪，金龙王封印初现端倪。', sp:1},
    {age:8, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟在傲来城师从邙天学习锻造，金龙王血脉在反复锻打中逐渐松动，展现出惊人的锻造天赋。', sp:1},
    {age:9, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟在前往东海城的列车上遇到古月，古月的"元素掌控"武魂令所有人震惊——那是龙族的本命神通。', sp:1},
    {age:10, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟进入东海学院零班，班主任舞长空以近乎残酷的训练方式磨练这群少年，唐舞麟在极限训练中飞速成长。', sp:1},
    {age:12, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟通过考核进入史莱克学院，与谢邂、古月、许小言、叶星澜、徐笠智、原恩夜辉、乐正宇组成新一代史莱克七怪。', sp:2, merit:5},
    {age:16, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟锻造水平达到六级灵锻师，金龙王封印不知不觉松动了八道，身体素质已达封号斗罗级别。', sp:2},
    {age:17, text:'<b style="color:var(--red);">【原著剧情】</b> 史莱克城大爆炸！圣灵教暗中袭击史莱克城，海神阁阁主云冥为守护学院而陨落，唐舞麟与古月的关系面临巨大考验。', sp:2, merit:8},
    {age:18, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟成为一字斗铠师，四字斗铠"金龙月语"初具雏形，金龙王血脉在战斗中逐渐觉醒。', sp:2},
    {age:20, text:'<b style="color:var(--red);">【原著剧情】</b> 深渊位面入侵！血神军团死守防线，唐舞麟作为第九血神参战，深渊生物的恐怖让全大陆陷入危机。', sp:2, merit:8},
    {age:25, text:'<b style="color:var(--red);">【原著剧情】</b> 唐舞麟体内金龙王封印大部分解除，银龙王古月娜的真实身份暴露，两人立场对立。', sp:3, merit:10},
    {age:28, text:'<b style="color:var(--gold);">【原著剧情】</b> 唐舞麟金龙王之力完全觉醒，与古月娜合力对抗深渊圣君，最终为大陆和平双双冰封于极北之地，龙王传说画上悲壮句号。', sp:5, merit:20}
  ],
  douluo4: [
    {age:7, text:'<b style="color:var(--gold);">【原著剧情】</b> 蓝轩宇在天罗星紫萝城觉醒中心觉醒水元素掌控武魂，当晚胸口金色鳞片发光，体内金银龙王两股力量初次涌动。', sp:1},
    {age:9, text:'<b style="color:var(--gold);">【原著剧情】</b> 蓝轩宇被神秘的银发老师娜娜收为弟子，她教导蓝轩宇用意志直接操控元素——一种远超当代魂师界认知的修炼方式。', sp:1},
    {age:13, text:'<b style="color:var(--gold);">【原著剧情】</b> 蓝轩宇以优异成绩考入史莱克学院，在入学考核中结识白秀秀（天蓝龙），组建"三十三天翼"小队，新七怪核心成型。', sp:2, merit:5},
    {age:15, text:'<b style="color:var(--gold);">【原著剧情】</b> 蓝轩宇在升龙台遭遇远古龙魂，金银龙王血脉融合，左金右银双翼展开，龙魂臣服，踏出龙神之路第一步。', sp:3, merit:10},
    {age:18, text:'<b style="color:var(--red);">【原著剧情】</b> 蓝轩宇化名"金龙公主"潜入天龙星执行间谍计划，从杂役做到天龙商会副会长，在龙族社会中寻找龙神神力碎片。', sp:2, merit:8},
    {age:19, text:'<b style="color:var(--gold);">【原著剧情】</b> 龙神九考！天龙提出龙神遗留的最终试炼，蓝轩宇在前六考中承受金银龙力冲击，第四至六考进入龙族历史长河，第七考"斩断羁绊"中他拒绝放弃情感，龙神残存意志改变了考核内容。', sp:3, merit:10},
    {age:21, text:'<b style="color:var(--red);">【原著剧情】</b> 深红之母率领蟊虫舰队全面入侵斗罗星系！天龙身负重伤，蓝轩宇在升龙台完成最后融合，龙神真身觉醒，白金龙翼遮天蔽日。', sp:3, merit:12},
    {age:22, text:'<b style="color:var(--gold);">【原著剧情】</b> 龙神蓝轩宇在虚空中与深红之母决战三天三夜，以毁灭与生命合力击碎其核心。战后开辟新神界，三十三天翼各自获得神位。唐舞麟与古月从万年龙茧中苏醒，一家三口在新神界团聚。', sp:5, merit:20}
  ],
  godrealm: [
    {age:50, text:'<b style="color:var(--red);">【原著剧情】</b> 毁灭之神联合七大原罪神发动政变，夺取神界中枢控制权，唐三被软禁于海神神殿，小舞被单独关押。', sp:1, merit:5},
    {age:100, text:'<b style="color:var(--red);">【原著剧情】</b> 霍雨浩联合七大元素神在神禁之地与毁灭之神决战。生命女神为净化毁灭之神献祭自身，毁灭之神失去妻子后心灰意冷，自愿消散。', sp:2, merit:15},
    {age:200, text:'<b style="color:var(--gold);">【原著剧情】</b> 霍雨浩继承情绪之神神位，唐舞桐继承蝶神神位，两人成为神界新一代双神王搭档，与唐三、小舞共同守护神界。', sp:3, merit:10},
    {age:300, text:'<b style="color:var(--red);">【原著剧情】</b> 时空乱流来袭！大神圈被卷入黑洞，众神合力脱困，神界格局再次发生巨变。', sp:3, merit:15}
  ]
};

const TIMELINE_CHARACTERS = {
  douluo1:[
    {name:'唐三',soul:'蓝银草 / 昊天锤',desc:'斗罗大陆的主角，双生武魂拥有者，史莱克七怪之首，唐门创始人。',color:'#4488ff',weight:12,ageRange:[6,30],events:[
      {text:'你在诺丁学院遇到了正在修炼玄天功的唐三，他主动教你紫极魔瞳的入门方法。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return '魂力+1级';}},
      {text:'唐三邀请你加入史莱克七怪的特训，在大师玉小刚的魔鬼训练下，你的实战能力突飞猛进。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'你在天斗城偶遇唐三，他刚创建唐门，送你一枚唐门暗器"龙须针"图纸。',effect:(g)=>{g.gold=(g.gold||0)+50;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return '获得50金魂币，魂力+1级';}},
      {text:'唐三在落日森林修炼暗器，你旁观了他用"暗器百解"击落树上百步穿杨，对暗器之道有了新领悟。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+2级，名声+5';}},
      {text:'海神岛上，唐三正在接受海神九考，海神之光的余波让你受益匪浅。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级';}}
    ]},
    {name:'小舞',soul:'柔骨魅兔',desc:'十万年魂兽化形，唐三的挚爱，拥有柔骨绝技与虚无、爆杀八段摔。',color:'#ff66aa',weight:10,ageRange:[6,30],events:[
      {text:'小舞在星斗大森林外围采灵草时遇到了你，她教你柔技中的腰弓入门。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return '魂力+1级';}},
      {text:'史莱克学院的操场上，小舞展示了她那令人惊叹的瞬移和无敌金身，你从中领悟了闪避的奥义。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'你偶遇正在卖烤兔腿的小舞，她请你吃了一顿，兔肉中蕴含的魂力让你精神一振。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.gold=(g.gold||0)+10;return '魂力+1级，获得10金魂币';}},
      {text:'小舞在月光下独舞，柔骨魅兔的天赋之美让你武魂产生共鸣。',effect:(g)=>{if(g.appearance){g.appearance={...g.appearance,attr:{...g.appearance.attr,charm:(g.appearance.attr?.charm||5)+1}};}return '魅力+1';}}
    ]},
    {name:'戴沐白',soul:'邪眸白虎',desc:'星罗帝国皇子，史莱克七怪老大，强攻系战魂师，后继承太子之位。',color:'#ffdd44',weight:8,ageRange:[12,28],events:[
      {text:'戴沐白正在大斗魂场以"邪眸白虎"之名战斗，你观战后对白虎金刚变有了新的理解。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'戴沐白带你进入星罗帝国的皇家猎场，与朱竹清联手展示幽冥白虎融合技，震撼全场。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+2级，名声+5';}},
      {text:'戴沐白请你喝酒，酒醉后讲述他逃离星罗皇宫的往事，你对皇权斗争有了警惕。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]},
    {name:'奥斯卡',soul:'香肠',desc:'史莱克七怪中的食物系魂师，先天满魂力的天才，第一位食物系封号斗罗。',color:'#44ddff',weight:8,ageRange:[12,40],events:[
      {text:'奥斯卡递给你一根恢复大香肠，味道虽然一言难尽但效果惊人，你的魂力迅速恢复。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.gold=(g.gold||0)+20;return '魂力+1级，获得20金魂币';}},
      {text:'奥斯卡展示了他的第六魂技——镜像肠，你看到了复制的奇妙力量。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return '魂力+1级';}},
      {text:'奥斯卡正在研究新食谱，请你试吃亢奋粉红肠，全属性提升的感觉让你大呼过瘾。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}}
    ]},
    {name:'马红俊',soul:'邪火凤凰',desc:'史莱克七怪之一，拥有变异武魂邪火凤凰，后净化为十首火凤凰。',color:'#ff4444',weight:8,ageRange:[12,28],events:[
      {text:'马红俊的邪火失控暴走，你帮忙用冰属性魂力压制，事后他感激地传授你凤凰火线的修炼方法。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'马红俊带你去天斗城最好的酒楼"聚宝阁"大吃一顿，席间吹嘘他追白沉香的浪漫经历。',effect:(g)=>{g.gold=(g.gold||0)+20;return '获得20金魂币';}},
      {text:'马红俊展示了武魂进化后的七首火凤凰之力，凤凰领域让你感受到近乎不死的重生之力。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+2级，名声+5';}}
    ]},
    {name:'宁荣荣',soul:'七宝琉璃塔',desc:'七宝琉璃宗小公主，辅助系魂师，奥斯卡的恋人，九层宝塔的强力辅助。',color:'#ffaa44',weight:8,ageRange:[12,28],events:[
      {text:'宁荣荣用九宝琉璃塔为你施展全属性增幅，增幅效果让你惊叹不已。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'宁荣荣的七宝琉璃塔在战斗中突然进化为九宝琉璃塔，进化之光波及到你，你的武魂品质有所提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级';}},
      {text:'宁荣荣请你喝下午茶，席间讲述了七宝琉璃宗与武魂殿的恩怨。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]},
    {name:'朱竹清',soul:'幽冥灵猫',desc:'星罗帝国贵族，速度型敏攻系魂师，戴沐白的未婚妻。',color:'#aa66ff',weight:7,ageRange:[12,28],events:[
      {text:'朱竹清在夜间独自修炼幽冥百爪，你暗中观摩她那快如闪电的暗杀技巧。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return '魂力+1级';}},
      {text:'朱竹清带你进行夜行训练，幽冥灵猫的隐匿身法让你对潜行有了全新认识。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+1级，名声+5';}},
      {text:'朱竹清讲述了她逃离星罗帝国朱家的经历，你对自由与家族的抉择有了更深理解。',effect:(g)=>{g.merit=(g.merit||0)+6;return '名声+6';}}
    ]},
    {name:'唐昊',soul:'昊天锤',desc:'昊天斗罗，唐三之父，大陆最年轻的封号斗罗，曾为救阿银独战武魂殿。',color:'#444444',weight:7,ageRange:[10,50],events:[
      {text:'你在圣魂村的铁匠铺遇到了醉醺醺的唐昊，他随手一锤展示的昊天锤之力让你震撼不已。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级';}},
      {text:'唐昊在瀑布下用大须弥锤法特训唐三，你在远处观摩，对昊天锤的炸环奥义有了初步领悟。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+2级，名声+5';}},
      {text:'唐昊讲述了他与阿银的故事，以及武魂殿的罪行，你对这个世界的残酷有了更深的认识。',effect:(g)=>{g.merit=(g.merit||0)+10;return '名声+10';}}
    ]},
    {name:'独孤博',soul:'碧磷蛇皇',desc:'毒斗罗，以毒冠绝天下，后成为史莱克学院的客卿长老。',color:'#44ff44',weight:6,ageRange:[8,60],events:[
      {text:'独孤博带你前往冰火两仪眼，那里的仙草让你的体质大幅改善。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+2级，名声+5';}},
      {text:'独孤博教你辨识天下奇毒，你学会了碧磷蛇毒的基础运用。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+6;return '魂力+1级，名声+6';}},
      {text:'独孤博展示了碧磷蛇皇的恐怖群攻——毒气通过土地蔓延，方圆百米寸草不生。你对他避之不及的同时也学到了大规模杀伤的思路。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+3;return '魂力+1级，名声+3';}}
    ]},
    {name:'比比东',soul:'死亡蛛皇 / 噬魂蛛皇',desc:'武魂殿教皇，双生武魂拥有者，当世巅峰强者之一，罗刹神传承者。',color:'#ff4444',weight:6,ageRange:[15,40],events:[
      {text:'比比东在武魂城召见你，对你的天赋产生了兴趣，赐予你一枚武魂殿特制魂骨碎片。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级';}},
      {text:'你拒绝了比比东的招揽，她冷冷地放你离开，但你守住了本心，内心更加坚定。',effect:(g)=>{g.merit=(g.merit||0)+15;return '名声+15';}},
      {text:'比比东展示了她双生武魂的恐怖——死亡蛛皇和噬魂蛛皇同时释放，黑暗气息笼罩全场。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}}
    ]},
    {name:'千仞雪',soul:'六翼天使',desc:'武魂殿少主，天使神传承者，拥有神圣而强大的力量。',color:'#ffdd88',weight:6,ageRange:[9,30],events:[
      {text:'你在天斗皇宫遇到了"大皇子雪清河"，她的天使之光让你感到温暖。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'千仞雪在武魂殿释放天使领域，天空为之变色，你在领域余波中感受到圣洁之力的洗礼。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+2级，名声+5';}},
      {text:'千仞雪跪在天使神殿前祈祷108天，你目睹了这一幕，被她的虔诚所震撼。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]},
    {name:'波赛西',soul:'海神',desc:'海神岛大祭司，九十九级绝世斗罗，海神在人间的代言人。',color:'#4488ff',weight:5,ageRange:[18,35],events:[
      {text:'波赛西引导你感受海神之光，海神的气息让你的精神力得到淬炼。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级';}},
      {text:'波赛西带你潜入海神岛深海，海神岛的海底遗迹让你领悟了海洋之力的奥秘。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+2级，名声+5';}},
      {text:'波赛西讲述她与唐晨的故事，你感受到了跨越百年的爱情与执念。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]},
    {name:'玉小刚',soul:'罗三炮',desc:'武魂理论界的大师，变异武魂罗三炮终身无法突破三十级，但提出"武魂十大核心竞争力"理论，唐三的启蒙恩师。',color:'#aa8844',weight:6,ageRange:[30,55],events:[
      {text:'玉小刚向你讲解武魂十大核心竞争力，你对武魂本质的理解豁然开朗。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return '魂力+1级，名声+5';}},
      {text:'玉小刚带你观察唐三的双生武魂，详细分析武魂兼容性的理论。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'玉小刚讲述他与比比东的往事，你被这段跨越身份与仇恨的师生情深深触动。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]},
    {name:'弗兰德',soul:'四眼猫鹰',desc:'史莱克学院院长，武魂四眼猫鹰，七十八级敏攻系魂圣，以"只收怪物不收普通人"闻名。',color:'#4488aa',weight:6,ageRange:[35,55],events:[
      {text:'弗兰德院长亲自对你进行速度测试，四眼猫鹰的敏锐感知让你对战斗节奏有了新领悟。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'弗兰德带你参观史莱克学院的怪物训练营，那些训练方式让你大开眼界。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.gold=(g.gold||0)+30;return '魂力+1级，获得30金魂币';}},
      {text:'弗兰德讲述史莱克学院从无到有的创业史，你感受到了一位老院长对教育的热忱。',effect:(g)=>{g.merit=(g.merit||0)+6;return '名声+6';}}
    ]},
    {name:'柳二龙',soul:'火龙',desc:'蓝电霸王龙家族旁支，变异武魂火龙，玉小刚的恋人，史莱克学院创始人之一，脾气暴躁但重情重义。',color:'#ff4444',weight:6,ageRange:[30,50],events:[
      {text:'柳二龙在训练中暴怒，火龙武魂的烈焰险些烧到你的衣角，但你从中感受到了极致火焰的力量。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'柳二龙在月下独自饮酒，向你倾诉她与玉小刚跨越二十年的感情纠葛。',effect:(g)=>{g.merit=(g.merit||0)+7;return '名声+7';}},
      {text:'柳二龙以火龙之力为你淬炼体魄，高温灼烧后的经脉变得更加坚韧。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.maxLevel=Math.min(g.maxLevel+1,150);return '魂力+2级，魂力上限+1';}}
    ]},
    {name:'赵无极',soul:'大力金刚熊',desc:'史莱克学院副院长，武魂大力金刚熊，七十六级强攻系魂圣，以强悍的防御和力量著称。',color:'#664422',weight:6,ageRange:[30,50],events:[
      {text:'赵无极以大力金刚熊的熊掌对你进行力量测试，你切身体会到了什么叫"不动明王"。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '魂力+2级';}},
      {text:'赵无极在斗魂场示范重力控制技巧，你学到了如何在重压下保持身体平衡。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+4;return '魂力+1级，名声+4';}},
      {text:'赵无极讲述当年被唐昊暴打三天三夜的经历，那位昊天斗罗的恐怖让你不寒而栗。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]}
  ],
  douluo2:[
    {name:'霍雨浩',soul:'灵眸 / 冰碧帝皇蝎',desc:'绝世唐门主角，精神系与冰系双生武魂的天才魂师，情绪之神传承者。',color:'#44ddff',weight:12,ageRange:[11,26],events:[
      {text:'霍雨浩在星斗大森林用精神探测与你共享视野，极北之地的极致冰寒也影响到了你，但你受益匪浅。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'霍雨浩带你去明德堂参观魂导器，十级魂导师的杰作让你对魂导科技大开眼界。',effect:(g)=>{g.battleArmor=Math.max(g.battleArmor||0,1);g.gold=(g.gold||0)+40;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'battleArmor+1, gold+40, sp+1';}},
      {text:'霍雨浩的天梦冰蚕与你交流精神力的运用，你感到精神之海在缓缓扩大。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}}
    ]},
    {name:'唐舞桐',soul:'光明龙神蝶 / 昊天锤',desc:'唐三与小舞之女，拥有光明女神蝶与昊天锤双生武魂，后继承蝶神神位。',color:'#ff66aa',weight:10,ageRange:[10,26],events:[
      {text:'唐舞桐（王冬儿）带你翱翔天际，光明龙神蝶的光辉让你魂力产生奇异共鸣。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'唐舞桐用昊天锤为你演示乱披风锤法，那是唐门绝学的精髓。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+2, merit+5';}},
      {text:'唐舞桐在海神缘上展露女儿身，光明女神蝶的美丽让你为之倾倒，你的武魂因之振奋。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}}
    ]},
    {name:'贝贝',soul:'光明圣龙',desc:'唐门大师兄，史莱克七怪队长，拥有光明圣龙武魂，后成为龙神斗罗。',color:'#ffdd44',weight:8,ageRange:[12,26],events:[
      {text:'贝贝以史莱克七怪队长身份指点你修炼，龙皇破邪裂的龙族威压让你受益匪浅。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'贝贝带你参观重建中的唐门，讲述了唐门万年的兴衰史。',effect:(g)=>{g.merit=(g.merit||0)+8;g.gold=(g.gold||0)+20;return 'merit+8, gold+20';}},
      {text:'贝贝传授你唐门绝学中的控鹤擒龙手，这招近身格斗技在实战中极为实用。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}}
    ]},
    {name:'马小桃',soul:'邪火凤凰',desc:'史莱克内院弟子，拥有邪火凤凰武魂，后净化为黑凤凰，成为凤凰斗罗。',color:'#ff4444',weight:8,ageRange:[14,26],events:[
      {text:'马小桃的凤凰穿云击在你面前划破长空，极致之火的热浪让你的武魂为之震动。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'马小桃在邪火失控时你帮忙用冰水泼醒她，事后她对你心存感激，教你修炼火系魂技。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+2, merit+5';}},
      {text:'马小桃展示了武魂进化后的黑凤凰之力，凤凰涅槃的壮观景象让你震撼。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+3;return 'sp+1, merit+3';}}
    ]},
    {name:'和菜头',soul:'雪茄',desc:'日月帝国前太子，后成为唐门成员，食物系魂导师。',color:'#44aa44',weight:7,ageRange:[12,26],events:[
      {text:'和菜头送你几枚自制的定装魂导炮弹，"当食物系魂师也能火力全开"。',effect:(g)=>{g.gold=(g.gold||0)+35;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'gold+35, sp+1';}},
      {text:'和菜头教你制作基础魂导器，日月帝国的魂导技术果然精妙。',effect:(g)=>{g.battleArmor=Math.max(g.battleArmor||0,1);return 'battleArmor+1';}},
      {text:'和菜头向你坦白了他的真实身份——日月帝国前太子徐和，你被他的隐忍所感动。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}}
    ]},
    {name:'玄老',soul:'饕餮神牛',desc:'史莱克学院海神阁宿老，后成为海神阁阁主，九十九级极限斗罗。',color:'#aa8844',weight:7,ageRange:[8,60],events:[
      {text:'玄老一边啃鸡腿一边指点你修炼，饕餮神牛的力量灌入你体内，魂力暴涨。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return 'sp+3';}},
      {text:'玄老带你前往明斗山脉剿灭邪魂师盗匪，实战中的饕餮之怒让你见识了封号斗罗的恐怖。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+2, merit+5';}},
      {text:'玄老在兽潮中凭一己之力战平帝天，你远观此战后对封号斗罗的境界有了全新认知。',effect:(g)=>{g.merit=(g.merit||0)+10;return 'merit+10';}}
    ]},
    {name:'穆老',soul:'光明圣龙',desc:'史莱克学院海神阁前阁主，龙神斗罗穆恩，九十九级极限斗罗。',color:'#ffdd88',weight:6,ageRange:[8,60],events:[
      {text:'穆老在黄金树下为你灌顶，光明圣龙之力洗涤你的身心，邪气尽消。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return 'sp+3';}},
      {text:'穆老传授你自创战技"君临天下"的入门心法，物理与精神攻击融合的奥义让你大开眼界。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+8;return 'sp+2, merit+8';}},
      {text:'穆老讲述了百年前与龙逍遥、叶夕水的三角往事，你对那个时代的爱恨纠葛感慨万千。',effect:(g)=>{g.merit=(g.merit||0)+10;return 'merit+10';}}
    ]},
    {name:'王冬',soul:'昊天锤',desc:'霍雨浩的室友兼挚友，唐舞桐的女扮男装身份，拥有昊天锤武魂。',color:'#ff88aa',weight:8,ageRange:[11,26],events:[
      {text:'王冬在宿舍中与你切磋，昊天锤的霸道力量让你印象深刻。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'王冬带你到海神湖畔，施展昊天锤乱披风锤法，你的武魂根基得到巩固。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'王冬与你并肩作战，双人武魂融合技的雏形让你们之间的默契大增。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}}
    ]},
    {name:'王秋儿',soul:'黄金龙枪',desc:'十万年魂兽黄金龙化形，拥有强大的龙族血脉，对霍雨浩情深意重。',color:'#ffdd44',weight:8,ageRange:[14,26],events:[
      {text:'王秋儿以黄金龙枪横扫战场，金龙之力的霸道让你热血沸腾。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'王秋儿教你黄金龙枪的基础运用，龙族秘技的力量让你受益匪浅。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+2, merit+5';}},
      {text:'王秋儿讲述了她对霍雨浩的感情，那份不求回报的付出让你感动不已。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}}
    ]},
    {name:'徐三石',soul:'玄冥龟',desc:'史莱克七怪之一，防御型魂师，拥有玄冥龟武魂，后进化为玄武。',color:'#44aa44',weight:7,ageRange:[12,26],events:[
      {text:'徐三石展示玄冥龟的绝对防御，玄武之盾的坚固让你叹为观止。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'徐三石教你玄冥龟的防御技巧，你的抗击打能力大幅提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'徐三石讲述他与江楠楠之间的感情故事，厚脸皮的追爱方式让你忍俊不禁。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'江楠楠',soul:'柔骨魅兔',desc:'史莱克七怪之一，敏攻系魂师，徐三石的恋人，拥有柔骨魅兔武魂。',color:'#ff66aa',weight:7,ageRange:[12,26],events:[
      {text:'江楠楠以柔骨魅兔的灵动身法为你演示闪避技巧，速度与柔韧的结合让你大开眼界。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'江楠楠教你柔技中的腰弓入门，腰腹力量得到显著提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+3;return 'sp+1, merit+3';}},
      {text:'江楠楠分享了她在史莱克学院的成长经历，激励你不断前进。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'萧萧',soul:'九凤来仪箫 / 三生镇魂鼎',desc:'史莱克七怪之一，双生武魂拥有者，辅助与控制兼备的全面型魂师。',color:'#aa66ff',weight:7,ageRange:[11,26],events:[
      {text:'萧萧以九凤来仪箫吹奏一曲，悦耳的箫声中魂力缓缓流淌，你的精神力得到滋养。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'萧萧展示三生镇魂鼎的镇压之力，一鼎镇三生的气势让你震撼。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'萧萧与你合奏一曲，音律与魂力的共鸣让你们对武魂的理解更加深刻。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+4;return 'sp+1, merit+4';}}
    ]},
    {name:'橘子',soul:'光明女神蝶',desc:'日月帝国太子妃，拥有光明女神蝶武魂，才华横溢的战术家和魂导师。',color:'#ff8844',weight:7,ageRange:[14,28],events:[
      {text:'橘子向你展示日月帝国的魂导科技，她对魂导器的理解让你大开眼界。',effect:(g)=>{g.gold=(g.gold||0)+30;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'gold+30, sp+1';}},
      {text:'橘子讲述她在日月帝国宫廷中的经历，你对权力斗争的残酷有了更深的理解。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}},
      {text:'橘子以光明女神蝶的领域之力为你加持，暖金色的光芒中你的魂力活跃起来。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}}
    ]},
    {name:'戴华斌',soul:'邪眸白虎',desc:'星罗帝国皇子，戴沐白的后裔，拥有邪眸白虎武魂，性格高傲。',color:'#ffdd44',weight:6,ageRange:[12,26],events:[
      {text:'戴华斌以邪眸白虎的威压挑衅你，一场激战后你们互相认可了对方的实力。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'戴华斌展示白虎金刚变，白虎之力让你感受到星罗皇室血脉的强大。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'戴华斌放下高傲与你交谈，讲述了他对星罗帝国的责任感。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'王冬儿',soul:'光明女神蝶',desc:'唐舞桐的化名，以女儿身行走大陆时使用的身份，与霍雨浩有着不解之缘。',color:'#ff88aa',weight:7,ageRange:[12,26],events:[
      {text:'王冬儿以光明女神蝶的绚丽光彩吸引你的目光，蝶翼翩翩中你的武魂产生共鸣。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'王冬儿教你光明女神蝶的光系魂技基础运用，你对光元素的理解大幅提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'王冬儿与你分享她的心事，那份隐藏身份的无奈让你心生同情。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'轩梓文',soul:'九级魂导核心',desc:'明德堂首席魂导师，九级魂导师，魂导器领域的巅峰人物。',color:'#44aaff',weight:6,ageRange:[18,50],events:[
      {text:'轩梓文向你展示九级魂导器的威力，魂导科技的巅峰之作让你叹为观止。',effect:(g)=>{g.gold=(g.gold||0)+50;g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'gold+50, sp+2';}},
      {text:'轩梓文教你魂导核心的制作原理，你对魂导器的理解更加深入。',effect:(g)=>{g.battleArmor=Math.max(g.battleArmor||0,1);return 'battleArmor+1';}},
      {text:'轩梓文讲述了他与霍雨浩在魂导研究上的合作经历，天才的碰撞让你深受启发。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+4;return 'sp+1, merit+4';}}
    ]},
    {name:'张乐萱',soul:'月神',desc:'史莱克学院内院弟子，日辰斗罗，拥有月神武魂，史莱克七怪之一。',color:'#88aaff',weight:6,ageRange:[14,28],events:[
      {text:'张乐萱以月神之力为你展示月华之光，清冷的月光中你的魂力更加精纯。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'张乐萱指导你如何在夜间修炼，月华之力对魂力的滋养效果极佳。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'张乐萱讲述了她与贝贝之间的感情，那份含蓄而深沉的爱让你感动。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'梦红尘',soul:'红尘眷恋',desc:'日月帝国公主，笑红尘的妹妹，拥有红尘眷恋武魂，天性活泼。',color:'#ff6688',weight:6,ageRange:[14,26],events:[
      {text:'梦红尘用红尘眷恋向你施展魅惑之力，你险些沦陷在她的风情之中。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'梦红尘带你参观日月皇宫，帝国的繁华让你大开眼界。',effect:(g)=>{g.gold=(g.gold||0)+30;return 'gold+30';}},
      {text:'梦红尘讲述她与哥哥笑红尘在日月帝国的成长经历，皇室子女的酸甜苦辣让你感慨。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'笑红尘',soul:'火龙王',desc:'日月帝国皇子，梦红尘的哥哥，拥有火龙王武魂，天才魂导师。',color:'#ff4444',weight:6,ageRange:[14,26],events:[
      {text:'笑红尘以火龙王之力向你展示火龙咆哮，烈焰滔天中你感受到龙族的威严。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'笑红尘与你切磋魂导器实战运用，日月帝国的魂导战术让你受益匪浅。',effect:(g)=>{g.gold=(g.gold||0)+25;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'gold+25, sp+1';}},
      {text:'笑红尘讲述了他们兄妹的野心与抱负，你对日月帝国的未来有了新的认识。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'娜娜',soul:'冰元素',desc:'来自极北之地的冰系魂师，拥有强大的冰元素掌控力，后成为传灵塔高层。',color:'#88ddff',weight:5,ageRange:[16,30],events:[
      {text:'娜娜以极北冰原的冰元素之力为你淬炼体魄，极寒之气让你的意志更加坚定。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'娜娜教你冰系魂技的进阶运用，冰元素在你手中变得更加得心应手。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'娜娜讲述了她来自极北之地的身世，那份孤独与坚韧让你心生敬意。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]}
  ],
  douluo3:[
    {name:'唐舞麟',soul:'蓝银草 / 金龙王',desc:'龙王传说主角，表面武魂为蓝银草，实际体内封印金龙王之力，拥有恐怖的肉身力量，后继承海神与毁灭神位。',color:'#4488ff',weight:12,ageRange:[6,28],events:[
      {text:'唐舞麟在锻造台上挥汗如雨，九级神匠的手艺让你叹为观止，他送你一块有灵合金。',effect:(g)=>{g.gold=(g.gold||0)+50;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'gold+50, sp+1';}},
      {text:'唐舞麟展示金龙九式，金龙王血脉的力量让你感受到龙族的威压与荣耀。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'唐舞麟邀请你加入血神军团，在血神大阵中修炼，你的魂力在阵法加持下大幅提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return 'sp+3';}}
    ]},
    {name:'古月娜',soul:'银龙王 / 元素掌控',desc:'魂兽共主银龙王化形，拥有掌控元素的恐怖能力，后分裂为古月和娜儿两个人格，唐舞麟的恋人。',color:'#aa66ff',weight:10,ageRange:[10,28],events:[
      {text:'古月娜向你展示了七元素同时操控的恐怖能力，火水风土光暗空间在你面前交织。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'古月娜带你前往传灵塔参观魂灵体系，你对魂兽与人类的共存方式有了新的认识。',effect:(g)=>{g.merit=(g.merit||0)+8;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'merit+8, sp+1';}},
      {text:'古月娜与唐舞麟施展武魂融合技"龙神变"，金银双色龙神之力让你血脉沸腾。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return 'sp+3';}}
    ]},
    {name:'谢邂',soul:'光龙匕 / 影龙匕',desc:'唐舞麟的挚友，双生器武魂拥有者，敏攻系魂师，时空之龙传承者。',color:'#44ddff',weight:8,ageRange:[10,28],events:[
      {text:'谢邂用光龙匕和影龙匕的融合技"双龙风暴"为你演示敏攻系的速度极限。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'谢邂教你唐门敏堂的隐匿身法，鬼影迷踪步的精妙让你受益匪浅。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'谢邂在北方军团的实战中展示了进化后的时空之龙之力，穿越刺的瞬间移动让你叹为观止。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}}
    ]},
    {name:'原恩夜辉',soul:'泰坦巨猿 / 堕落天使',desc:'史莱克七怪之一，双生武魂，拥有强大的力量和黑暗属性。',color:'#662266',weight:8,ageRange:[14,28],events:[
      {text:'原恩夜辉以泰坦巨猿之拳震碎大地，泰坦神拳的刚猛让你感受到力量型魂师的霸道。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'原恩夜辉展示了堕落天使的恶魔之眼领域，黑暗与光明的双重属性让你武魂产生共鸣。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'原恩夜辉讲述了泰坦巨猿二明与母亲的故事，你对魂兽与人类的跨界之恋感慨万千。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}}
    ]},
    {name:'云冥',soul:'擎天枪',desc:'史莱克学院海神阁阁主，擎天斗罗，当世最强者之一。',color:'#ffdd44',weight:7,ageRange:[8,50],events:[
      {text:'云冥以擎天枪为你演示"一枪擎天"的绝技，准神级的战力让你感受到天地的震颤。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return 'sp+3';}},
      {text:'云冥讲述史莱克学院万年传承的历史，你的心中涌起一股莫名的使命感。',effect:(g)=>{g.merit=(g.merit||0)+10;return 'merit+10';}},
      {text:'云冥在圣灵教袭击中用擎天枪硬挡九级定装魂导炮弹，枪杆断裂的瞬间你感受到了他守护学院的决意。',effect:(g)=>{g.merit=(g.merit||0)+12;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'merit+12, sp+1';}}
    ]},
    {name:'圣灵斗罗雅莉',soul:'祈愿天使',desc:'史莱克学院海神阁副阁主，大陆最强治疗系魂师。',color:'#ffddff',weight:6,ageRange:[8,50],events:[
      {text:'雅莉用祈愿天使的力量为你治愈暗伤，第九魂技"群体祈愿天使"的光辉让你焕然一新。',effect:(g)=>{g.maxAge=(g.maxAge||100)+15;g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'maxAge+15, sp+2';}},
      {text:'雅莉讲述了她为云冥守候百年的故事，你对纯粹的爱情充满敬意。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}},
      {text:'雅莉教你感知生命之力的方法，你对魂力运行的理解更加深入。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}}
    ]},
    {name:'许小言',soul:'星辰锁链',desc:'史莱克七怪之一，控制系魂师，拥有星辰锁链武魂，擅长星象之力。',color:'#8888ff',weight:7,ageRange:[10,26],events:[
      {text:'许小言以星辰锁链向你展示星象占卜，星辰之力对你的命运产生了微妙影响。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'许小言教你利用星辰之力修炼，夜空下的冥想让你的魂力更加精纯。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'许小言为你占卜未来，模糊的星象中你看到了自己命运的蛛丝马迹。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}}
    ]},
    {name:'叶星澜',soul:'星神剑',desc:'史莱克七怪之一，强攻系魂师，拥有星神剑武魂，星辰剑法出神入化。',color:'#aaccff',weight:7,ageRange:[12,26],events:[
      {text:'叶星澜以星神剑施展星辰剑法，星光璀璨中剑气纵横，让你对剑道有了新的领悟。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'叶星澜指导你剑法基础，一招一式中蕴含着星辰的轨迹。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'叶星澜讲述她在星罗村的童年往事，那段艰苦的修炼岁月让你深受触动。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'徐笠智',soul:'包子',desc:'史莱克七怪之一，食物系魂师，拥有包子武魂，性格憨厚老实。',color:'#44aa44',weight:6,ageRange:[12,26],events:[
      {text:'徐笠智递给你一个热腾腾的恢复大包子，食物中蕴含的魂力让你精神大振。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.gold=(g.gold||0)+10;return 'sp+1, gold+10';}},
      {text:'徐笠智展示了他的包子武魂的多种效果，食物系魂师的辅助能力让你叹为观止。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'徐笠智与你分享他的人生哲学，知足常乐的心态让你在修行路上更加从容。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'乐正宇',soul:'神圣天使',desc:'史莱克七怪之一，拥有神圣天使武魂，来自神圣家族，拥有强大的光明之力。',color:'#ffdd88',weight:7,ageRange:[12,26],events:[
      {text:'乐正宇以神圣天使的光明之力为你洗礼，圣光驱散了你体内的杂质。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'乐正宇展示神圣天使的审判之剑，光明与正义的力量让你心生敬畏。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'乐正宇讲述神圣家族的使命，那份守护光明的责任让你感动。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'龙跃',soul:'山龙王',desc:'史莱克学院内院弟子，拥有山龙王武魂，力量型魂师，史莱克七怪之一。',color:'#44aa44',weight:6,ageRange:[14,28],events:[
      {text:'龙跃以山龙王之力震碎大地，恐怖的肉身力量让你感受到龙族的霸道。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'龙跃教你山龙王的防御技巧，你的身体强度得到显著提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'龙跃讲述他与原恩夜辉之间的羁绊，那份跨越武魂对立的情感让你动容。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'戴云儿',soul:'灵眸',desc:'星罗帝国公主，拥有灵眸武魂，精神系魂师，性格活泼可爱。',color:'#ff88aa',weight:6,ageRange:[12,24],events:[
      {text:'戴云儿以灵眸之力与你进行精神交流，精神力的碰撞让你对精神魂技有了新的认识。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'戴云儿带你游览星罗皇宫，帝国的繁华与底蕴让你大开眼界。',effect:(g)=>{g.gold=(g.gold||0)+30;return 'gold+30';}},
      {text:'戴云儿讲述她与唐舞麟在星罗帝国的往事，那段充满欢笑的回忆让你心情愉悦。',effect:(g)=>{g.merit=(g.merit||0)+4;return 'merit+4';}}
    ]},
    {name:'司马金驰',soul:'魔剑',desc:'史莱克学院海神阁成员，拥有魔剑武魂，九十八级超级斗罗。',color:'#6644aa',weight:6,ageRange:[18,50],events:[
      {text:'司马金驰以魔剑演示剑意，凌厉的剑气让你对剑道有了全新的理解。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'司马金驰指导你实战剑术，一招一式皆是杀伐之道。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'司马金驰讲述他追随唐舞麟征战四方的经历，那段热血岁月让你心驰神往。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}}
    ]},
    {name:'陈瑛',soul:'碧磷蛇',desc:'史莱克学院内院弟子，用毒高手，拥有碧磷蛇武魂，独孤博的传人。',color:'#44ff44',weight:5,ageRange:[14,26],events:[
      {text:'陈瑛教你辨识天下奇毒，碧磷蛇的毒功虽然凶险但极为实用。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'陈瑛展示了碧磷蛇的毒雾领域，你从中领悟了以毒攻毒的战斗思路。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'陈瑛讲述她与毒打交道的经历，那份在毒中求生的坚韧让你敬佩。',effect:(g)=>{g.merit=(g.merit||0)+4;return 'merit+4';}}
    ]},
    {name:'舞长空',soul:'冰霜龙',desc:'史莱克学院外院教师，谢邂的导师，拥有冰霜龙武魂，冷傲而强大。',color:'#88ddff',weight:6,ageRange:[18,40],events:[
      {text:'舞长空以冰霜龙之力为你演示冰系魂技，极寒之气让你对冰元素有了更深的理解。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'舞长空指导你剑法修炼，他冷傲的教学风格虽严格但效果显著。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'舞长空讲述了他与圣灵教的恩怨，那份刻骨铭心的仇恨让你对邪魂师更加警惕。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}}
    ]},
    {name:'圣灵教教主',soul:'死神',desc:'圣灵教最高领袖，九十九级极限斗罗，拥有死神武魂，斗罗大陆的黑暗面。',color:'#442222',weight:5,ageRange:[20,60],events:[
      {text:'圣灵教教主以死神之力笼罩四野，死亡的阴影让你感受到前所未有的压迫感。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'你与圣灵教教主交手，虽然不敌但侥幸逃脱，生死边缘的感悟让魂力突破。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);g.merit=(g.merit||0)+10;return 'sp+3, merit+10';}},
      {text:'圣灵教教主向你展示死神镰刀的恐怖，那毁灭一切的力量让你心有余悸。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}}
    ]},
    {name:'冻千秋',soul:'魔魂大白鲨',desc:'来自精灵星的魂兽公主，魔魂大白鲨化形，蓝轩宇的红颜知己。',color:'#44aaff',weight:7,ageRange:[8,25],events:[
      {text:'冻千秋带你游览精灵星的深海，魔魂大白鲨领地中的美景让你流连忘返。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'冻千秋教你冰系魂技的海洋运用，海与冰的融合之力让你大开眼界。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'冻千秋讲述她与蓝轩宇在精灵星的初遇，那段跨越种族的缘分让你感动。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'蓝佛子',soul:'蓝魔龙',desc:'龙族强者，拥有蓝魔龙武魂，唐舞麟在龙谷中结识的伙伴。',color:'#4488ff',weight:5,ageRange:[20,60],events:[
      {text:'蓝佛子以蓝魔龙之力为你展示龙族秘技，龙族的传承让你对力量有了新的理解。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'蓝佛子讲述龙谷的历史，龙族的辉煌与衰落让你感慨万千。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}},
      {text:'蓝佛子教你龙族语言的入门，龙语中的力量密码让你受益匪浅。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}}
    ]},
    {name:'阿如恒',soul:'泰坦巨猿',desc:'泰坦巨猿一族的强者，继承泰坦血脉，拥有恐怖的肉身力量。',color:'#886644',weight:5,ageRange:[18,50],events:[
      {text:'阿如恒以泰坦巨猿之力与你角力，纯力量的碰撞让你热血沸腾。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'阿如恒教你泰坦一族的炼体术，你的肉身强度得到显著提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'阿如恒讲述泰坦巨猿一族的传承，那份对力量的执着让你深受启发。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'韩泽',soul:'破魂枪',desc:'史莱克学院内院弟子，拥有破魂枪武魂，强攻系魂师，性格坚毅。',color:'#8866aa',weight:5,ageRange:[14,26],events:[
      {text:'韩泽以破魂枪演示枪法，枪出如龙的气势让你对枪道有了新的认识。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'韩泽与你切磋枪法，实战中的经验教训让你的战斗技巧更加纯熟。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+4;return 'sp+1, merit+4';}},
      {text:'韩泽讲述他在史莱克学院的求学经历，那份坚持不懈的精神让你敬佩。',effect:(g)=>{g.merit=(g.merit||0)+4;return 'merit+4';}}
    ]}
  ],
  douluo4:[
    {name:'蓝轩宇',soul:'水元素掌控 / 金银龙王双血脉',desc:'终极斗罗主角，觉醒水元素掌控，后续觉醒金银龙王双血脉，龙神血脉继承者，天龙首座之子，拥有创造与毁灭的双重力量。',color:'#4488ff',weight:12,ageRange:[6,25],events:[
      {text:'蓝轩宇的金银双色龙神血脉与你产生共鸣，九元素之力在你体内隐隐涌动。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return 'sp+3';}},
      {text:'蓝轩宇带你参观史莱克学院母星的战舰，星际时代的科技让你大开眼界。',effect:(g)=>{g.gold=(g.gold||0)+40;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'gold+40, sp+1';}},
      {text:'蓝轩宇展示"元素剥离"魂技，你亲眼看到敌人的元素护罩被一层层剥离。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+2, merit+5';}}
    ]},
    {name:'白秀秀',soul:'深渊冰魔龙',desc:'蓝轩宇的伴侣，由魔魂大白鲨化形为深渊冰魔龙，后天龙族成员。',color:'#44ddff',weight:10,ageRange:[8,25],events:[
      {text:'白秀秀带你潜入深海的魔魂大白鲨领地，冰潮魂技在海底爆发，美丽而致命。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'白秀秀与蓝轩宇施展武魂融合技"深蓝凝视"，万年暗黑魔虎级别的强敌被瞬间冻结。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+2, merit+5';}},
      {text:'白秀秀讲述她从魔魂大白鲨化形的经历，你对魂兽化形有了更深的理解。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'唐乐',soul:'金龙王',desc:'蓝轩宇之父，实为唐舞麟失忆后的身份，星际时代的传奇歌手与强者。',color:'#ffdd44',weight:10,ageRange:[10,40],events:[
      {text:'唐乐在你面前弹奏那首"灵魂歌神"级别的曲子，金龙王的记忆碎片在旋律中涌动。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return 'sp+3';}},
      {text:'唐乐教你锻造之术，九级神匠的技法让你受益匪浅。',effect:(g)=>{g.gold=(g.gold||0)+50;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'gold+50, sp+1';}},
      {text:'唐乐带你去星际演唱会，全场观众在他的歌声中魂力共振，你也受益匪浅。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}}
    ]},
    {name:'娜娜',soul:'银龙王',desc:'蓝轩宇之母，实为古月娜失忆后的身份，古武系教师。',color:'#aa66ff',weight:9,ageRange:[10,40],events:[
      {text:'娜娜用元素掌控力教你基础古武，她的教学方法与传统截然不同，效果却极好。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'娜娜在教导你时银色蝎子辫微微发光，银龙王残留的元素之力让你武魂产生共鸣。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'娜娜讲述了她模糊记忆中关于"重要的人"的碎片，你感受到她内心深处的牵挂。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'钱磊',soul:'召唤金钱',desc:'蓝轩宇的挚友，拥有召唤武魂，能召唤强大的魂兽作战。',color:'#ffaa22',weight:7,ageRange:[8,25],events:[
      {text:'钱磊开启召唤之门，冻千秋的冰系力量从门中涌出，你第一次见到召唤系的实战威力。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'钱磊向你展示第二魂技"复刻"，完美复制了你的一个魂技并反手释放。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'钱磊请你吃了一顿大餐，席间讲述他在天罗初等学院垫底的糗事。',effect:(g)=>{g.gold=(g.gold||0)+20;g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'gold+20, sp+1';}}
    ]},
    {name:'冻千秋',soul:'魔魂大白鲨',desc:'蓝轩宇最初的伙伴之一，魔魂大白鲨公主，后成为白秀秀的一部分。',color:'#44aaff',weight:7,ageRange:[8,25],events:[
      {text:'冻千秋带你游览天斗星的冰原，极寒环境中的冰系魂技修炼让她游刃有余。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'冻千秋讲述她失去记忆后在人类世界的孤独，你对她产生了同情。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}},
      {text:'冻千秋教你冰系魂技的基础运用，你对冰元素的控制有了初步掌握。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}}
    ]},
    {name:'刘锋',soul:'白龙枪',desc:'蓝轩宇的挚友，拥有白龙枪武魂，敏攻系魂师，史莱克七怪之一。',color:'#4488ff',weight:7,ageRange:[8,25],events:[
      {text:'刘锋以白龙枪展示枪法，银龙枪出如流星，速度与精准的结合让你大开眼界。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'刘锋教你白龙枪的刺击技巧，你的枪法基础得到巩固。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+4;return 'sp+1, merit+4';}},
      {text:'刘锋讲述他与蓝轩宇在天罗初等学院相识的往事，真挚的友情让你感动。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'原恩辉辉',soul:'泰坦巨猿 / 堕落天使',desc:'原恩夜辉的后代，拥有泰坦巨猿与堕落天使双武魂，天赋异禀。',color:'#662266',weight:7,ageRange:[10,28],events:[
      {text:'原恩辉辉以泰坦巨猿之拳展示力量，大地震颤中你感受到泰坦血脉的霸道。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'原恩辉辉展示堕落天使的黑暗之力，光与暗的交织让你对武魂属性有了新的理解。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'原恩辉辉讲述家族传承的故事，那份跨越万年的血脉羁绊让你感慨。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'蓝梦琴',soul:'玉凰琴',desc:'蓝轩宇的伙伴，拥有玉凰琴武魂，辅助系魂师，琴音中蕴含治愈与攻击之力。',color:'#88ddff',weight:6,ageRange:[8,25],events:[
      {text:'蓝梦琴以玉凰琴弹奏一曲，优美的琴音中你的魂力得到滋养。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'蓝梦琴展示玉凰琴的治愈之力，琴音所到之处伤势尽愈。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}},
      {text:'蓝梦琴与你合奏，音律与魂力的共鸣让你对武魂的理解更加深刻。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+3;return 'sp+1, merit+3';}}
    ]},
    {name:'唐雨格',soul:'五行龙',desc:'蓝轩宇的伙伴，拥有五行龙武魂，能掌控五行元素，天赋卓绝。',color:'#ffaa44',weight:7,ageRange:[10,25],events:[
      {text:'唐雨格以五行龙之力展示五行轮转，金木水火土的循环让你对元素法则有了新的领悟。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'唐雨格教你五行相生相克之理，你对元素的理解更加全面。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+5;return 'sp+1, merit+5';}},
      {text:'唐雨格讲述她与蓝轩宇在龙马星系的冒险，星际探险的故事让你心驰神往。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'唐震华',soul:'星际战舰',desc:'史莱克学院星际系教师，蓝轩宇的导师，顶尖的星际战术家。',color:'#4488cc',weight:6,ageRange:[20,50],events:[
      {text:'唐震华带你进行星际航行模拟训练，你对星际战舰的操作有了初步了解。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'唐震华讲授星际战术，太空中的战斗方式与传统魂师对决截然不同。',effect:(g)=>{g.merit=(g.merit||0)+8;return 'merit+8';}},
      {text:'唐震华讲述他在联邦军方的经历，星际时代的战争残酷让你深思。',effect:(g)=>{g.merit=(g.merit||0)+6;return 'merit+6';}}
    ]},
    {name:'肖启',soul:'天圣裂渊',desc:'史莱克学院教师，蓝轩宇的班主任，拥有天圣裂渊武魂，深不可测。',color:'#8866aa',weight:6,ageRange:[20,45],events:[
      {text:'肖启以天圣裂渊之力为你展示剑法，剑意滔天中你感受到他的强大。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'肖启指导你修炼基础，他的教学方式严谨而高效。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'肖启讲述他作为教师的理念，那份对学生的责任心让你感动。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'白凌霜',soul:'冰霜巨龙',desc:'白秀秀的族人，拥有冰霜巨龙武魂，龙族强者，性格冷傲。',color:'#88ddff',weight:5,ageRange:[18,40],events:[
      {text:'白凌霜以冰霜巨龙之力展示龙族冰系魂技，极寒龙息让你对冰元素有了更深的理解。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'白凌霜教你龙族冰系秘法，你的冰系魂技威力大增。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'白凌霜讲述龙族在星际时代的生存之道，种族的存续让你深思。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'李娜',soul:'银月',desc:'史莱克学院教师，古武系导师，拥有银月武魂，擅长近身格斗。',color:'#aaaaff',weight:5,ageRange:[18,40],events:[
      {text:'李娜以银月之力展示古武技巧，月华般的拳法让你对近身战斗有了新的认识。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'李娜指导你古武基础，一招一式皆是实战精华。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);g.merit=(g.merit||0)+4;return 'sp+1, merit+4';}},
      {text:'李娜讲述她在史莱克学院的教学生涯，那份对古武传承的热爱让你敬佩。',effect:(g)=>{g.merit=(g.merit||0)+4;return 'merit+4';}}
    ]},
    {name:'羽沐曦',soul:'神圣天使',desc:'史莱克学院内院弟子，拥有神圣天使武魂，光明系魂师，乐正宇的后裔。',color:'#ffdd88',weight:5,ageRange:[12,26],events:[
      {text:'羽沐曦以神圣天使之光为你洗礼，光明的力量驱散了你体内的暗伤。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'羽沐曦展示神圣天使的治愈之力，圣光所至万物复苏。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}},
      {text:'羽沐曦讲述神圣家族的传承使命，那份守护光明的责任让你动容。',effect:(g)=>{g.merit=(g.merit||0)+4;return 'merit+4';}}
    ]},
    {name:'凌梓晨',soul:'时空之龙',desc:'史莱克学院内院天才，拥有时空之龙武魂，掌控时间与空间之力。',color:'#aa66ff',weight:5,ageRange:[12,26],events:[
      {text:'凌梓晨以时空之龙之力展示时间减速，时空的扭曲让你对法则之力有了初步认识。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'凌梓晨教你时空之力的基础运用，你对空间的理解更加深入。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'凌梓晨讲述她与时空之龙武魂的渊源，那份掌控时空的使命感让你敬佩。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]},
    {name:'龙当当',soul:'龙神变',desc:'龙族后裔，拥有龙神变武魂，龙族血脉纯正，实力强大。',color:'#ffdd44',weight:5,ageRange:[14,30],events:[
      {text:'龙当当以龙神变之力展示龙族秘技，龙神血脉的威压让你感受到龙族的强大。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return 'sp+2';}},
      {text:'龙当当教你龙族炼体术，你的肉身强度得到显著提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+1,g.maxLevel);return 'sp+1';}},
      {text:'龙当当讲述龙族的历史与荣耀，那份对龙族复兴的渴望让你感动。',effect:(g)=>{g.merit=(g.merit||0)+5;return 'merit+5';}}
    ]}
  ],
  godrealm:[
    {name:'海神唐三',soul:'海神三叉戟 / 修罗神',desc:'已飞升神界的唐三，海神与修罗神双神位拥有者，神界执法者。',color:'#4488ff',weight:12,events:[
      {text:'海神唐三亲自指点你，神界法则的力量让你脱胎换骨。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+5,g.maxLevel);return '魂力+5级（神之指点）';}},
      {text:'唐三向你展示海神三叉戟的十大能力，每一件都足以毁天灭地。',effect:(g)=>{g.merit=(g.merit||0)+15;return '名声+15';}}
    ]},
    {name:'小舞（神后）',soul:'修罗剑鞘',desc:'与唐三共用神位的神后，温柔而强大的存在，修罗神的剑鞘。',color:'#ff66aa',weight:10,events:[
      {text:'神后小舞以生命之力为你治愈暗伤，你的修为更加稳固。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级';}},
      {text:'小舞讲述她与唐三在神界的日常，神界也有温馨的一面。',effect:(g)=>{g.maxAge=(g.maxAge||100)+10;return '寿命+10年';}}
    ]},
    {name:'善良之神',soul:'善良之心',desc:'神界五大神王之一，掌控善良法则的至高存在，与邪恶之神共同管理神界。',color:'#ffdd88',weight:7,events:[
      {text:'善良之神赐予你一丝善良之力，你的内心变得更加纯粹。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);g.merit=(g.merit||0)+10;return '魂力+3级，名声+10';}},
      {text:'善良之神向你展示神界的美好面，万物生长、生机盎然。',effect:(g)=>{g.maxAge=(g.maxAge||100)+15;return '寿命+15年';}}
    ]},
    {name:'邪恶之神',soul:'审判天平',desc:'神界五大神王之一，掌控邪恶与审判的至高存在，性格桀骜不驯。',color:'#664488',weight:7,events:[
      {text:'邪恶之神考验你的意志，在审判天平前你证明了自己的价值。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+4,g.maxLevel);return '魂力+4级（通过考验）';}},
      {text:'邪恶之神向你展示神界的黑暗面，弱肉强食是永恒的法则。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]},
    {name:'毁灭之神',soul:'毁灭权杖',desc:'神界五大神王之一，掌控毁灭法则的至高存在，与生命女神为伴侣。',color:'#aa2288',weight:8,events:[
      {text:'毁灭之神向你展示了毁灭的真谛，力量与毁灭仅在一念之间。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+4,g.maxLevel);return '魂力+4级';}},
      {text:'你卷入了毁灭之神与唐三的权力纷争，险些成为牺牲品。',effect:(g)=>{if(Math.random()<0.5){g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '侥幸脱身，魂力+2级';}else{g.soulPower=Math.max(g.soulPower-2,1);return '被波及受伤，魂力-2级';}}}
    ]},
    {name:'生命女神',soul:'生命之树',desc:'神界五大神王之一，掌控生命法则的至高存在，毁灭之神的妻子。',color:'#44ff88',weight:8,events:[
      {text:'生命女神赐予你生命精华，你的生命力得到极大提升。',effect:(g)=>{g.maxAge=(g.maxAge||100)+20;g.soulPower=Math.min(g.soulPower+2,g.maxLevel);return '寿命+20年，魂力+2级';}},
      {text:'生命女神讲述她与毁灭之神的爱情故事，神界也有温情。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]},
    {name:'情绪之神霍雨浩',soul:'情绪之神',desc:'已飞升神界的霍雨浩，一级神祇情绪之神，唐三的女婿。',color:'#44ddff',weight:8,events:[
      {text:'情绪之神以七种情绪之力为你洗礼，你的精神力达到新的高度。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+4,g.maxLevel);return '魂力+4级';}},
      {text:'霍雨浩讲述他在神界与舞桐的生活，以及岳父唐三的"关照"。',effect:(g)=>{g.merit=(g.merit||0)+10;return '名声+10';}}
    ]},
    {name:'唐舞麟（金龙王）',soul:'金龙王 / 海神',desc:'已飞升神界的唐舞麟，海神与毁灭神双神位拥有者，蓝轩宇之父。',color:'#ffdd44',weight:7,events:[
      {text:'唐舞麟以金龙王之力为你淬炼肉身，你的身体强度堪比神兽。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+4,g.maxLevel);return '魂力+4级';}},
      {text:'唐舞麟讲述他与古月娜在神界的重逢，万年等待终有回报。',effect:(g)=>{g.maxAge=(g.maxAge||100)+15;return '寿命+15年';}}
    ]},
    {name:'七原罪神·贪食之神',soul:'饕餮之胃',desc:'毁灭之神麾下七大原罪神之一，代表贪食的原罪。',color:'#aa6644',weight:5,events:[
      {text:'贪食之神邀请你品尝神界珍馐，食物中蕴含的神力让你修为大涨。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+2,g.maxLevel);g.gold=(g.gold||0)+50;return '魂力+2级，金币+50';}},
      {text:'贪食之神的饕餮之胃险些将你也吞进去！',effect:(g)=>{if(Math.random()<0.7){return '侥幸逃脱';}else{g.soulPower=Math.max(g.soulPower-2,1);return '被吞噬部分神力，魂力-2级';}}}
    ]},
    {name:'七元素神·火神',soul:'火焰神格',desc:'神界七大元素神之首，掌控火焰元素的一级神祇。',color:'#ff4422',weight:5,events:[
      {text:'火神以神火为你淬炼神格，你的火系能力大幅提升。',effect:(g)=>{g.soulPower=Math.min(g.soulPower+3,g.maxLevel);return '魂力+3级';}},
      {text:'火神与你切磋，火焰的力量让你对元素法则有了更深的理解。',effect:(g)=>{g.merit=(g.merit||0)+8;return '名声+8';}}
    ]}
  ]
};

// ============================================================
// SPIRIT SOUL SYSTEM
// ============================================================
const SPIRIT_SOUL_NAMES = [
  '冰碧蝎','光明圣龙','暗金恐爪熊','三眼金猊','翡翠天鹅','妖眼魔树','泰坦巨猿','天青牛蟒',
  '地狱魔龙','山龙王','海龙王','雷鸣阎魔藤','火凤凰','冰凤凰','邪眸白虎','六翼天使',
  '蓝电霸王龙','深海魔鲸','金龙王','银龙王','时空双龙','混沌青牛','鸿蒙凤凰',
  '金语','绮罗郁金香','霸王龙','雷鸣阎狱藤','邪魔虎鲸王','碧姬','赤王',
  '冰天雪女','天梦冰蚕','八角玄冰草','烈火杏娇疏','幽香绮罗仙品'
];
const SPIRIT_SOUL_HIGH_NAMES = [
  '冰碧帝皇蝎','雪帝','冰帝','帝天','邪帝','碧姬','赤王','泰坦巨猿','天青牛蟒',
  '深海魔鲸','金龙王','银龙王','邪魔虎鲸王','火凤凰','冰凤凰'
];
const SPIRIT_SOUL_PREFIXES = ['十年（白）','百年（黄）','千年（紫）','万年（黑）','十万年（红）','凶兽（橙）','不屈','伴生','传承','本命'];