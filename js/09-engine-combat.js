'use strict';
/* ============================================
09-ENGINE-COMBAT: бой, стихии оружия, эхо/кактус/
призрачный шаг, оглушение, понятный лут
============================================ */
function calcDmg(atk,def,mult,ign){
  return Math.max(1,Math.round(atk*(mult||1)*rand(.85,1.15)-(ign?0:def*.5)));
}
/* --- Удар героя: стихия берётся из ОРУЖИЯ, если оно элементальное --- */
function heroStrike(mult,opts){
  opts=opts||{};var h=G.hero,e=G.enemy;
  if(!e||e.dead)return Promise.resolve();
  var projType=opts.proj||CLASSES[h.cls].projType;
  var w=h.equip?h.equip.weapon:null;
  var el=opts.el||(w&&w.el?w.el:(CLASSES[h.cls].el||'physical'));
  var chain=Promise.resolve();
  if(projType){chain=chain.then(function(){return fireProjectile(projType,260,290,700,300);});}
  else{chain=chain.then(function(){h.fx.lunge=.45;sfx.swing();return sleep(190);});}
  chain=chain.then(function(){
    if(!opts.sure&&e.dodge&&Math.random()<e.dodge){addFloat(700,190,'МИМО!','#9fd8ff');log(e.name+' уклоняется!');return sleep(240);}
    var isCrit=opts.crit||Math.random()*100<getHeroCrit()+(opts.bonusCrit||0);
    var em=elemMult(el,e);
    var bfx=getBiomeFx();
    if(bfx&&bfx.elem===el)em=bfx.mult;
    var dmg=calcDmg(getHeroAtk(),e.def,mult*pSkillPow()*em,opts.ignoreDef);
    var critMult=(bfx&&bfx.critMult)?bfx.critMult:1.8;
    if(isCrit)dmg=Math.round(dmg*critMult);
    if(e.tr==='armor'&&!opts.ignoreDef)dmg=Math.max(1,Math.round(dmg*.75));
    if(e.defending)dmg=Math.max(1,Math.round(dmg*.5));
    if(em>1)addFloat(700,160,'СЛАБОСТЬ!','#7ef29a',20);
    if(em<1)addFloat(700,160,'сопротивление...','#c9c9c9',18);
    return hitEnemy(dmg,{crit:isCrit,word:opts.word,big:opts.big}).then(function(){
      /* РЕЛИКВИЯ «Эхо Героя»: удар повторяется */
      if(hasRelic('echo')&&!opts.echo&&!e.dead&&Math.random()<.2){
        addFloat(700,150,'🌀 ЭХО!','#b66bff',20);
        return hitEnemy(Math.max(1,Math.round(dmg*.5)),{word:'ЭХО!'});
      }
    });
  });
  return chain;
}
function hitEnemy(dmg,opts){
  var e=G.enemy;if(!e||e.dead)return Promise.resolve();
  e.hp=Math.max(0,e.hp-dmg);if(e.hp<=0)e.dead=true;
  e.fx.hurt=.32;fx.shake=(opts.crit||opts.big)?15:9;
  (opts.crit||opts.big)?sfx.crit():sfx.hit();
  addBurst(700,180,opts.word||(opts.crit?'КРИТ!':pick(HIT_WORDS)));
  addFloat(700,230,'−'+dmg,opts.crit?'#ffd23d':'#fff');
  addParts(700,240,opts.crit?'#ffd23d':'#ff8b94');
  if(pVamp()>0){var hl=Math.max(1,Math.round(dmg*pVamp()));G.hero.hp=Math.min(pMaxHp(),G.hero.hp+hl);addFloat(225,210,'+'+hl,'#7ef29a',20);}
  if(opts.crit&&Math.random()<.35)enemyReact(['Ай, больно же!','Да как ты посмел!','Это не честно!']);
  updateHUD();return sleep(260);
}
function makeEnemy(base,kind,isMimic){
  var dm=DIFF[G.diff],f=G.floor,cycle=G.cycle||0;
  var cycleMult=1+cycle*0.6;
  var boss=kind==='boss'||kind==='final',elite=kind==='elite';
  var hpScale=1+0.06*(f-1);
  if(f>50)hpScale+=(f-50)*0.015;
  if(f>100)hpScale+=(f-100)*0.025;
  var atkScale=1+0.035*(f-1);
  if(f>50)atkScale+=(f-50)*0.01;
  if(f>100)atkScale+=(f-100)*0.02;
  var defScale=1+0.03*(f-1);
  if(f>50)defScale+=(f-50)*0.008;
  var hpM=hpScale*(boss?1.4:1)*(elite?1.4:1)*dm.hp*cycleMult;
  var atkM=atkScale*(boss?1.1:1)*(elite?1.2:1)*dm.atk*cycleMult;
  var defM=defScale*(elite?1.15:1)*cycleMult;
  if(isMimic){
    return{id:'mimic',name:'Мимик',boss:false,elite:false,tr:null,ai:'melee',el:'physical',weak:'fire',resist:null,
      hp:Math.round(60*hpM),maxHp:Math.round(60*hpM),atk:Math.round(20*atkM),def:Math.round(5*defM),
      spd:8,crit:8,gold:Math.round(40*(1+.08*f)*cycleMult),xp:Math.round(50*(1+.1*f)*cycleMult),
      scale:1,dodge:.1,raged:false,stun:0,poison:null,burn:null,frozen:0,defending:false,nextAction:null,dead:false,mutation:null,
      fx:{lunge:0,hurt:0,death:1,enter:1}};
  }
  var mutation=null;
  if(cycle>0&&Math.random()<0.3+cycle*0.1){
    mutation=pick(['regen','thorns','vampiric','enraged','shielded']);
  }
  var mutName='';
  if(mutation){
    var mutNames={regen:'♻️',thorns:'🌵',vampiric:'🩸',enraged:'💢',shielded:'🛡️'};
    mutName=(mutNames[mutation]||'')+' ';
  }
  var e={id:base.id,name:mutName+base.name+(cycle>0?' +'+cycle:''),
    boss:boss,elite:elite,final:kind==='final',
    tr:base.tr||null,ai:base.ai||'basic',el:base.el||'physical',
    weak:base.weak||null,resist:base.resist||null,
    hp:Math.round(base.hp*hpM),maxHp:Math.round(base.hp*hpM),
    atk:Math.round(base.atk*atkM),def:Math.round(base.def*defM),
    spd:base.spd,crit:base.crit||5,
    gold:Math.round(base.gold*(1+.08*(f-1))*dm.gold*(elite?1.8:1)*(boss?1.5:1)*cycleMult),
    xp:Math.round(base.xp*(1+.1*(f-1))*(elite?1.8:1)*(boss?1.6:1)*cycleMult),
    scale:boss?1.28:elite?1.12:1,dodge:base.tr==='swift'?.22:0,
    raged:false,stun:0,poison:null,burn:null,frozen:0,defending:false,nextAction:null,dead:false,
    mutation:mutation,fx:{lunge:0,hurt:0,death:1,enter:1}};
  e.maxHp=e.hp;e.nextAction=decideEnemyAction(e);unlockBestiary(e.id);
  if(mutation==='enraged')e.atk=Math.round(e.atk*1.3);
  if(mutation==='shielded')e.def=Math.round(e.def*1.5);
  return e;
}
function decideEnemyAction(e){
  var ai=e.ai||'basic',pool;
  if(ai==='basic')pool=[{a:'attack',w:80},{a:'heavy',w:10},{a:'defend',w:10}];
  else if(ai==='melee')pool=[{a:'attack',w:55},{a:'heavy',w:25},{a:'defend',w:20}];
  else if(ai==='tank')pool=[{a:'attack',w:40},{a:'heavy',w:20},{a:'defend',w:40}];
  else if(ai==='swift')pool=[{a:'attack',w:70},{a:'double',w:20},{a:'dodge_prep',w:10}];
  else if(ai==='caster')pool=[{a:'spell',w:50},{a:'attack',w:25},{a:'debuff',w:15},{a:'defend',w:10}];
  else pool=[{a:'attack',w:100}];
  if(e.boss&&e.hp<e.maxHp*.4)pool=pool.map(function(p){return(p.a==='heavy'||p.a==='spell')?{a:p.a,w:p.w*1.5}:p;});
  var total=pool.reduce(function(s,p){return s+p.w;},0);
  var roll=Math.random()*total,cur=0;
  for(var i=0;i<pool.length;i++){cur+=pool[i].w;if(roll<cur)return pool[i].a;}
  return'attack';
}
function startCombat(kind,isMimic){
  var f=G.floor,base;
  if(isMimic){G.enemy=makeEnemy(null,kind,true);}
  else if(kind==='boss'||kind==='final'){base=BOSSES[f]||BOSSES[90];G.enemy=makeEnemy(base,kind,false);}
  else{
    var tier=getBiomeIdx(f);
    var pool=ENEMY_POOL.filter(function(e){return e.tier===tier;});
    if(!pool.length)pool=ENEMY_POOL;
    if(kind==='elite'){var ep=pool.filter(function(e){return e.tier>=Math.max(1,tier-1);});if(ep.length)pool=ep;}
    base=pick(pool);G.enemy=makeEnemy(base,kind,false);
  }
  G.phase='combat';G.busy=false;G.round=0;
  $('#event-layer').innerHTML='';$('#actions').classList.remove('hidden');renderElixirs();
  var e=G.enemy;var t=e.boss?(e.final?'☠ ФИНАЛЬНЫЙ БОСС':'👑 БОСС'):e.elite?'⭐ ЭЛИТА':'⚔️ Бой';
  log(t+': '+e.name+(e.weak?' · слаб к '+ELEMENTS[e.weak].icon:''));
  updateHUD();updateActions();
}
function enemyTurn(){
  var h=G.hero,e=G.enemy;
  if(!e||e.dead)return Promise.resolve();
  var chain=Promise.resolve();
  if(e.poison&&e.poison.turns>0){
    chain=chain.then(function(){
      e.hp=Math.max(0,e.hp-e.poison.dmg);e.poison.turns--;
      addFloat(700,260,'☠−'+e.poison.dmg,'#b6ff5e',20);
      if(e.poison.turns<=0)e.poison=null;
      if(e.hp<=0){e.dead=true;updateHUD();return sleep(300).then(function(){return winCombat();});}
      return sleep(250);
    });
  }
  chain=chain.then(function(){
    if(e.dead||G.phase!=='combat')return;
    if(e.burn&&e.burn.turns>0){
      e.hp=Math.max(0,e.hp-e.burn.dmg);e.burn.turns--;
      addFloat(700,280,'🔥−'+e.burn.dmg,'#ff8b4a',20);
      if(e.burn.turns<=0)e.burn=null;
      if(e.hp<=0){e.dead=true;updateHUD();return sleep(300).then(function(){return winCombat();});}
      return sleep(200);
    }
    return Promise.resolve();
  });
  chain=chain.then(function(){
    if(e.dead||G.phase!=='combat')return;
    e.defending=false;
    /* ОГЛУШЕНИЕ: враг пропускает ровно столько своих ходов, сколько указано */
    if(e.stun&&e.stun>0){
      e.stun--;
      addFloat(700,190,'💫','#ffd23d');
      log(e.name+' пропускает ход! (оглушение ещё '+e.stun+')');
      updateHUD();
      e.nextAction=decideEnemyAction(e);
      return sleep(300);
    }
    if(e.frozen&&e.frozen>0){
      e.frozen--;
      addFloat(700,190,'🧊','#9fd8ff');
      log(e.name+' заморожен!');
      updateHUD();
      e.nextAction=decideEnemyAction(e);
      return sleep(300);
    }
    if(e.tr==='rage'&&!e.raged&&e.hp<e.maxHp*.35){
      e.raged=true;e.atk=Math.round(e.atk*1.4);
      addBurst(700,180,'ЯРОСТЬ!','#ff4d5e');
      log(e.name+' в ярости! (+40% атаки)');
      sfx.hurt();e.nextAction=decideEnemyAction(e);
      return sleep(600);
    }
    var action=e.nextAction||'attack';
    if(action==='attack'){e.fx.lunge=.45;sfx.swing();return sleep(190).then(function(){return doEnemyAttack(e,h,1.0,{});});}
    else if(action==='heavy'){addBurst(700,160,'МОЩЬ!','#ff8b4a');return sleep(300).then(function(){e.fx.lunge=.55;sfx.swing();return sleep(220);}).then(function(){return doEnemyAttack(e,h,1.7,{big:true});});}
    else if(action==='defend'){e.defending=true;addFloat(700,200,'🛡','#9fd8ff');log(e.name+' защищается!');sfx.click();return sleep(400);}
    else if(action==='spell'){return fireProjectile(e.tr==='venom'?'poison':'arcane',700,320,225,320).then(function(){addFloat(225,230,'✨','#b66bff');return doEnemyAttack(e,h,1.3,{magic:true,word:'ЗАКЛИНАНИЕ!'});});}
    else if(action==='double'){e.fx.lunge=.35;sfx.swing();return sleep(150).then(function(){return doEnemyAttack(e,h,.7,{word:'УДАР!'});}).then(function(){if(!h.dead){e.fx.lunge=.35;sfx.swing();return sleep(150).then(function(){return doEnemyAttack(e,h,.7,{word:'УДАР!'});});}});}
    else if(action==='dodge_prep'){e.dodge=Math.min(.7,e.dodge+.3);addFloat(700,200,'💨','#9fd8ff');log(e.name+' уклоняется!');sfx.click();return sleep(400);}
    else if(action==='debuff'){return fireProjectile('poison',700,320,225,320).then(function(){if(!h.poison){h.poison={turns:3,dmg:Math.max(2,Math.round(e.atk*.25))};log('☠️ Проклятие!');}return doEnemyAttack(e,h,.6,{});});}
    return Promise.resolve();
  });
  chain=chain.then(function(){
    if(G.phase!=='combat'||e.dead)return;
    if(h.hp<=0)return defeat();
    e.nextAction=decideEnemyAction(e);
    updateHUD();updateActions();
  });
  return chain;
}
function doEnemyAttack(e,h,mult,opts){
  if(Math.random()*100<getHeroDodge()){
    addFloat(225,200,'ВЖУХ!','#9fd8ff');log('Уклонение!');
    /* РЕЛИКВИЯ «Призрачный шаг»: уклонение лечит */
    if(hasRelic('ghoststep')){
      var gh=Math.max(1,Math.round(pMaxHp()*.03));
      h.hp=Math.min(pMaxHp(),h.hp+gh);
      addFloat(225,210,'👻+'+gh,'#7ef29a',18);
    }
    updateHUD();return sleep(300);
  }
  if(h.shield){h.shield=false;addFloat(225,200,'🛡 блок!','#9fd8ff');log('Щит поглотил удар!');sfx.click();updateHUD();return sleep(300);}
  var crit=Math.random()*100<e.crit;
  var bfx=getBiomeFx();var em=1;
  if(bfx&&bfx.elem===e.el)em=bfx.mult;
  var dmg=calcDmg(e.atk,getHeroDef(),mult*em*(crit?1.5:1),opts.magic);
  if(h.defending)dmg=Math.max(1,Math.round(dmg*.45));
  if(e.defending)dmg=Math.round(dmg*.7);
  h.hp=Math.max(0,h.hp-dmg);h.fx.hurt=.32;
  fx.shake=(crit||opts.big)?16:10;fx.flash=.25;sfx.hurt();
  addBurst(225,180,opts.word||(crit?'КРИТ!':pick(['АЙ!','ОЙ!','ХРЯСЬ!'])));
  addFloat(225,230,'−'+dmg,'#ff6b7a');addParts(225,240,'#ff6b7a');
  /* РЕЛИКВИЯ «Кактус-талисман»: обидчик получает сдачу */
  if(hasRelic('cactus')&&dmg>0&&!e.dead){
    var cd2=Math.max(1,Math.round(dmg*.25));
    e.hp=Math.max(0,e.hp-cd2);
    addFloat(700,260,'🌵−'+cd2,'#b6ff5e',16);
    if(e.hp<=0){e.dead=true;updateHUD();return sleep(300).then(function(){return winCombat();});}
  }
  if(e.tr==='venom'&&Math.random()<.4&&!h.poison){h.poison={turns:3,dmg:Math.max(2,Math.round(e.atk*.25))};log('☠️ Яд!');}
  if(h.thorns>0){e.hp=Math.max(0,e.hp-h.thorns);addFloat(700,260,'−'+h.thorns,'#c9f7d4',18);if(e.hp<=0){e.dead=true;updateHUD();return sleep(300).then(function(){return winCombat();});}}
  if(h.hp<h.maxHp*.25&&Math.random()<.3)enemyReact(['Ты уже на последнем издыхании!','Сдавайся!','Ха-ха, слабак!']);
  updateHUD();return Promise.resolve();
}
function onAction(a){
  if(G.busy||G.phase!=='combat')return;
  var h=G.hero;
  if(h.poison&&h.poison.turns>0){
    h.hp=Math.max(0,h.hp-h.poison.dmg);h.poison.turns--;
    addFloat(225,250,'☠−'+h.poison.dmg,'#b6ff5e',20);log('Яд: −'+h.poison.dmg);updateHUD();
    if(h.poison.turns<=0)h.poison=null;
    if(h.hp<=0){defeat();return;}
    sleep(400).then(function(){continueAction(a);});return;
  }
  continueAction(a);
}
function continueAction(a){
  var h=G.hero,e=G.enemy;G.busy=true;updateActions();var chain=Promise.resolve();
  if(a==='atk'){chain=heroStrike(1,{});}
  else if(a==='skill'){
    h.skillCd=h.skillCdMax;
    if(h.cls==='knight'){chain=heroStrike(1.35,{el:'physical'}).then(function(){h.defending=true;log('Щитовой удар!');});}
    if(h.cls==='mage'){chain=heroStrike(2.1,{ignoreDef:true,word:'ПШШШ!',el:'fire'});}
    if(h.cls==='rogue'){chain=heroStrike(.85,{bonusCrit:15,el:'physical'}).then(function(){if(e&&!e.dead)return heroStrike(.85,{bonusCrit:15,el:'physical'});});}
    if(h.cls==='barbarian'){chain=heroStrike(2.2,{word:'ЯРОСТЬ!',big:true,el:'physical'}).then(function(){buffHero('rage',1);});}
    if(h.cls==='inventor'){chain=Promise.resolve();for(var i=0;i<3;i++){(function(idx){chain=chain.then(function(){if(!e.dead)return heroStrike(.75,{word:'ЗАЛП!',el:'lightning'});});})(i);}}
    if(h.cls==='archer'){chain=Promise.resolve();for(var j=0;j<3;j++){(function(idx){chain=chain.then(function(){if(!e.dead)return heroStrike(.7,{bonusCrit:10,el:'physical'});});})(j);}}
    if(h.cls==='fairy'){chain=heroStrike(1.8,{word:'СИЯЙ!',el:'holy'}).then(function(){healHero(.15);});}
  }
  else if(a==='skill2'){
    var s=getActiveSkill();
    if(!s){log('Навык не выбран!');G.busy=false;updateActions();return;}
    h.skill2Cd=s.cd;chain=Promise.resolve(s.run(h,e));
  }
  else if(a==='def'){h.defending=true;addFloat(225,200,'🛡','#9fd8ff');log('Защита!');sfx.click();chain=sleep(400);}
  else if(a==='pot'){
    if(h.pots<=0){log('Зелий нет!');G.busy=false;updateActions();return;}
    if(h.hp>=pMaxHp()){log('HP полные!');G.busy=false;updateActions();return;}
    h.pots--;var hl=Math.round(pMaxHp()*pPotionPow());h.hp=Math.min(pMaxHp(),h.hp+hl);
    sfx.potion();addFloat(225,210,'+'+hl,'#7ef29a');log('+'+hl+' HP!');updateHUD();chain=sleep(450);
  }
  else if(a==='flee'){
    if(e.boss){log('От босса не сбежать!');G.busy=false;updateActions();return;}
    enemyReact(['Ты что, сбежать от меня?!','Куда ты собрался?!','Трус! Вернись!']);
    if(Math.random()*100<clamp(50+h.spd*2+(hasRelic('swiftboot')?2:0),35,92)){
      log('Побег удался!');sfx.door();G.phase='doors';G.doors=null;
      $('#actions').classList.add('hidden');$('#elixirs').classList.add('hidden');
      G.busy=false;$('#event-layer').innerHTML='';renderDoors();saveRun();return;
    }
    log('Не вышло!');chain=sleep(400);
  }
  chain.then(function(){
    if(h.hp<=0)return defeat();
    if(e&&e.dead)return winCombat();
    return sleep(200);
  }).then(function(){
    if(G.phase!=='combat')return;
    if(e&&e.dead)return;
    if(h.hp<=0)return defeat();
    if(G.companion&&!e.dead){
      return companionAttack().then(function(){if(e.dead)return winCombat();}).catch(function(err){console.warn('companionAttack error',err);});
    }
    return Promise.resolve();
  }).then(function(){
    if(G.phase!=='combat')return;
    if(e&&e.dead)return;
    if(h.hp<=0)return defeat();
    return enemyTurn();
  }).then(function(){
    if(G.phase!=='combat')return;
    if(h.hp<=0)return defeat();
    roundEnd();h.defending=false;G.busy=false;updateHUD();updateActions();
  });
}
function roundEnd(){
  var h=G.hero;for(var k in h.buffs)if(h.buffs[k]>0)h.buffs[k]--;
  if(h.skillCd>0)h.skillCd--;if(h.skill2Cd>0)h.skill2Cd--;
  G.round++;
  var bfx=getBiomeFx();
  if(bfx&&bfx.tick&&G.round%3===0){
    var tick=Math.max(1,Math.round(pMaxHp()*.03));
    h.hp=Math.max(1,h.hp-tick);
    if(G.enemy&&!G.enemy.dead)G.enemy.hp=Math.max(1,G.enemy.hp-tick);
    addFloat(225,250,'☁−'+tick,'#b6e35e',18);
    log('🐸 Испарения: −'+tick+' HP обоим');
    updateHUD();
  }
  saveRun();
}
function companionAttack(){
  var c=G.companion,e=G.enemy;if(!c||!e||e.dead)return Promise.resolve();
  log(c.icon+' '+c.name+' атакует!');
  return fireProjectile('arcane',180,300,700,300).then(function(){
    var dmg=Math.max(1,Math.round((c.atk||10)*rand(.9,1.2)-e.def*.3));
    e.hp=Math.max(0,e.hp-dmg);
    addFloat(700,250,'−'+dmg,'#ffd8a8');addParts(700,240,'#ffd8a8',8);
    if(e.hp<=0)e.dead=true;
    updateHUD();return sleep(300);
  });
}
/* --- Победа: ПОНЯТНЫЙ лут с приписками --- */
function winCombat(){
  var e=G.enemy,h=G.hero;if(!e)return Promise.resolve();
  e.dead=true;sfx.win();var lines=[];
  return sleep(800).then(function(){
    $('#actions').classList.add('hidden');$('#elixirs').classList.add('hidden');G.kills++;
    if(G.phoenixCd>0)G.phoenixCd--;
    h.hp=Math.min(pMaxHp(),h.hp+Math.round(pMaxHp()*.06));
    var g=Math.round(e.gold*0.75)+ri(-3,5);
    if(hasRelic('luck_bone')&&Math.random()<.15)g*=2;
    if(hasRelic('midas'))g=Math.round(g*1.4);
    var goldBonus=Math.min(100,relicFxSum('goldPct'));
    if(goldBonus)g=Math.round(g*(1+goldBonus/100));
    G.gold+=g;
    lines=['💰 Золото: +'+g,'✨ Опыт: +'+e.xp];
    var monster=null;for(var i=0;i<ALL_MONSTERS.length;i++)if(ALL_MONSTERS[i].id===e.id){monster=ALL_MONSTERS[i];break;}
    var matChance=Math.min(.95,.6+(hasRelic('clover')?.2:0)+relicFxSum('matPct')/100);
    if(monster&&monster.mat&&Math.random()<matChance){G.materials[monster.mat]=(G.materials[monster.mat]||0)+1;lines.push('🔮 Ингредиент: '+monster.mat+'!');updateQuestProgress('material');}
    if(Math.random()<(e.boss?1:e.elite?.5:.2)){h.pots++;lines.push('🧪 Зелье: +1');}
    var dropChance=e.boss?1:e.elite?.6:.3;
    if(Math.random()<dropChance){
      var minR=e.boss?(e.final?2:1):0;
      var it=dropItem(minR);
      if(giveItem(it)){
        lines.push(it.i+' '+(SLOT_NAME[it.slot]||'Предмет')+': '+it.n+(it.cursed?' (ПРОКЛЯТО!)':'')+' · '+bonusTxt(it));
      }
    }
    if((e.elite||e.boss)&&Math.random()<.25){
      var sk=grantRandomSkill();
      if(sk)lines.push(sk.icon+' Навык «'+sk.name+'»: '+sk.desc);
    }
    if(e.boss&&Math.random()<.35){
      var rel=dropRelic();
      if(rel){giveRelic(rel);}
      else{G.gold+=100;lines.push('🏺 Все реликвии собраны! +100💰');}
    }
    if(Math.random()<.3){
      var ek=pick(Object.keys(ELIXIRS));
      if(giveElixir(ek))lines.push(ELIXIRS[ek].i+' Эликсир: '+ELIXIRS[ek].n+' — '+ELIXIRS[ek].d);
    }
    if(G.companion){G.companion.battlesLeft--;if(G.companion.battlesLeft<=0){log(G.companion.icon+' '+G.companion.name+' уходит. Спасибо!');G.companion=null;}}
    addCard(e.id);updateQuestProgress('kill');
    updateHUD();saveRun();
    return gainXp(e.xp);
  }).then(function(){
    if(G.phase==='over')return;
    var el=$('#event-layer');
    if(e.final){
      G.won=true;G.winBonus=true;
      el.innerHTML='<div class="ev"><h3 class="ev-title">🏆 ФИНАЛЬНАЯ ПОБЕДА!</h3><div class="ev-anim anim-glow">🏆</div><p>Пожиратель Миров повержен!</p><p style="font-size:14px;opacity:.8;margin:8px 0">Пройдено циклов: <b>'+(G.cycle||0)+'</b></p><div class="center"><button class="cbtn grn" id="win-continue">♾️ Бесконечный режим</button><button class="cbtn red" id="win-end">🏁 Завершить</button></div></div>';
      $('#win-continue').onclick=function(){G.cycle=(G.cycle||0)+1;G.won=false;G.winBonus=false;G.floor=1;G.doors=null;$('#event-layer').innerHTML='';renderDoors();updateHUD();saveRun();log('♾️ ЦИКЛ '+(G.cycle+1)+'! Враги усилились!');};
      $('#win-end').onclick=function(){showEnd(true);};
      return;
    }
    if(e.boss&&G.floor%10===0){
      el.innerHTML='<div class="ev"><h3 class="ev-title">👑 БОСС ПОВЕРЖЕН!</h3><div class="loot">'+lines.map(function(l){return'<div>'+l+'</div>';}).join('')+'</div><button class="cbtn" id="btn-next" style="background:var(--yel)">Спуститься ниже ▼</button></div>';
      $('#btn-next').onclick=function(){sfx.click();nextFloor();};flushQuests();return;
    }
    el.innerHTML='<div class="ev"><h3 class="ev-title">💥 ВРАГ ПОВЕРЖЕН!</h3><div class="loot">'+lines.map(function(l){return'<div>'+l+'</div>';}).join('')+'</div><button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';
    $('#btn-next').onclick=function(){sfx.click();nextFloor();};flushQuests();
  });
}
function defeat(){
  var h=G.hero;if(!h)return Promise.resolve();
  if(h.hp<=0&&hasRelic('phoenix')&&phoenixReady()){
    h.hp=1;h.dead=false;G.phoenixCd=10;
    addFloat(225,200,'🪶 ФЕНИКС!','#ffd23d',24);
    log('🪶 Перо Феникса спасает героя!');
    sfx.level();updateHUD();
    return Promise.resolve();
  }
  h.dead=true;G.phase='over';sfx.lose();clearRun();
  return sleep(1000).then(function(){showEnd(false);});
}