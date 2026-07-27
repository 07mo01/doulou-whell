function addEventLog(age,type,text,isInit){
  if(!G.eventLog) G.eventLog=[];
  G.eventLog.push({age,type,text,timestamp:Date.now(),isInit});
}

function getYearStep(){
  if(G.soulPower >= 90) return 10;
  if(G.soulPower >= 70) return 5;
  if(G.soulPower >= 50) return 3;
  return 1;
}

function rollYearEvent(){
  let roll = Math.random() * 100;
  let cum = 0;
  let eventTypes = [
    {type: 'cultivate', weight: 35},
    {type: 'social', weight: 15},
    {type: 'battle', weight: 20},
    {type: 'opportunity', weight: 15},
    {type: 'crisis', weight: 15}
  ];
  for(let et of eventTypes){
    cum += et.weight;
    if(roll < cum) return et.type;
  }
  return 'normal';
}

function processPartnerEvent(){
  let candidates = getRomanceCandidates();
  if(candidates.length === 0){
    return {type:'partner',text:'你独自修炼，内心平静。'};
  }
  
  let char = weightedRandom(candidates);
  let existingPartner = G.partner;
  
  if(existingPartner && existingPartner.name === char.name){
    let effect = '';
    if(char.spBonus && Math.random() < 0.5){
      G.soulPower = Math.min(G.soulPower + 1, G.maxLevel);
      effect = `\n与${char.name}心意相通，魂力+1`;
    }
    return {type:'partner',text:`与${char.name}共度甜蜜时光${effect}`};
  }
  
  if(existingPartner){
    return {type:'partner',text:`你遇到了${char.name}，但你已有伴侣，礼貌地保持了距离。`};
  }
  
  if(Math.random() < 0.4){
    G.partner = char;
    G.relationship = 'lover';
    if(char.spBonus) G.soulPower = Math.min(G.soulPower + char.spBonus, G.maxLevel);
    return {type:'partner',text:`💕 你与${char.name}情投意合，成为了恋人！${char.spBonus?'（魂力+'+char.spBonus+'）':''}`};
  }
  
  return {type:'partner',text:`你遇到了${char.name}，相谈甚欢，但缘分未到。`};
}

function processJusticeEvent(){
  let events = TIMELINE_SPECIFIC_EVENTS[G.timeline.id]?.justice || [];
  if(events.length === 0) events = TIMELINE_SPECIFIC_EVENTS.douluo1.justice;
  
  let event = weightedRandom(events);
  
  if(event.sp) G.soulPower = Math.min(G.soulPower + event.sp, G.maxLevel);
  if(event.loss && Math.random() < 0.3){
    G.soulPower = Math.max(G.soulPower - event.loss, 1);
    return {type:'justice',text:`${event.text}（但在战斗中受伤，魂力-${event.loss}）`};
  }
  
  return {type:'justice',text:event.text};
}

function processAuctionEvent(){
  let items = AUCTION_ITEMS;
  let item = weightedRandom(items);
  
  let canAfford = (G.gold || 0) + (G.familyWealth || 0) >= item.price;
  
  if(canAfford){
    G.gold = (G.gold || 0) - item.price;
    if(item.sp) G.soulPower = Math.min(G.soulPower + item.sp, G.maxLevel);
    if(item.bone && !G.soulBones.includes(item.bone)) G.soulBones.push(item.bone);
    if(item.skill) G.customSkills = (G.customSkills||[]).concat({name: item.skill, desc:'拍卖获得'});
    
    return {type:'auction',text:`你花费${item.price}金魂币拍下了${item.name}！${item.sp?'（魂力+'+item.sp+'）':''}${item.bone?'（获得'+item.bone+'）':''}`};
  }
  
  return {type:'auction',text:`拍卖会上出现了${item.name}（${item.price}金魂币），但你囊中羞涩，只能遗憾错过。`};
}

function processFortuneEvent(){
  let events = TIMELINE_SPECIFIC_EVENTS[G.timeline.id]?.opportunity || [];
  if(events.length === 0) events = TIMELINE_SPECIFIC_EVENTS.douluo1.opportunity;
  
  let event = weightedRandom(events);
  
  if(event.sp) G.soulPower = Math.min(G.soulPower + event.sp, G.maxLevel);
  if(event.gold) G.gold = (G.gold || 0) + event.gold;
  if(event.bone && !G.soulBones.includes(event.bone)) G.soulBones.push(event.bone);
  
  return {type:'fortune',text:event.text};
}

function processSchoolEvent(){
  let events = TIMELINE_SPECIFIC_EVENTS[G.timeline.id]?.school || [];
  if(events.length === 0) events = TIMELINE_SPECIFIC_EVENTS.douluo1.school;
  
  let event = weightedRandom(events);
  
  if(event.sp) G.soulPower = Math.min(G.soulPower + event.sp, G.maxLevel);
  
  return {type:'school',text:event.text};
}

function processNormalEvent(){
  let timelineId = G.timeline?.id || 'douluo1';
  let eventType = rollYearEvent();
  
  let events = [];
  if(G.identityType === 'soul_beast'){
    events = TIMELINE_BEAST_EVENTS[timelineId]?.[eventType] || [];
    if(events.length === 0){
      events = TIMELINE_BEAST_EVENTS.douluo1[eventType] || [];
    }
  } else {
    events = TIMELINE_SPECIFIC_EVENTS[timelineId]?.[eventType] || [];
    if(events.length === 0){
      events = TIMELINE_SPECIFIC_EVENTS.douluo1[eventType] || [];
    }
  }
  
  if(events.length === 0){
    return {type:eventType,text:'平静的一年过去了。'};
  }
  
  let event = weightedRandom(events);
  
  if(event.sp) G.soulPower = Math.min(G.soulPower + event.sp, G.maxLevel);
  if(event.loss) G.soulPower = Math.max(G.soulPower - event.loss, 1);
  if(event.gold) G.gold = (G.gold || 0) + event.gold;
  if(event.bone && !G.soulBones.includes(event.bone)) G.soulBones.push(event.bone);
  if(event.skill) G.customSkills = (G.customSkills||[]).concat({name: event.skill, desc:'领悟技能'});
  
  if(event.choices){
    return {type:eventType,text:event.text,choices:event.choices,_hasChoices:true};
  }
  
  return {type:eventType,text:event.text};
}

function makeChoice(idx){
  let choice = G.currentEventChoices[idx];
  if(!choice) return;
  
  if(choice.spWin && Math.random() < (choice.winChance || 0.5)){
    G.soulPower = Math.min(G.soulPower + choice.spWin, G.maxLevel);
  }
  if(choice.spLose && Math.random() < (choice.loseChance || 0.3)){
    G.soulPower = Math.max(G.soulPower - choice.spLose, 1);
  }
  if(choice.deathChance && Math.random() < choice.deathChance){
    triggerDeath('事件选择失败');
    return;
  }
  
  closeEventModal();
  G.currentEventChoices = null;
  
  if(choice.effect){
    choice.effect(G);
  }
}