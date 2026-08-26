'use strict';
/* 11-ENGINE-EVENTS: События + Автосохранение */

function openChest(){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-bounce">📦</div><p>Открыть его?</p><div class="ev-choices"><button class="cbtn grn" id="chest-open">📦 Открыть</button><button class="cbtn ghost" id="chest-leave">Пройти мимо</button></div></div>';
  $('#chest-open').onclick=function(){
    G.chestsOpened++;updateQuestProgress('chest');
    if(Math.random() < .15){log('⚠️ Это МИМИК!');startCombat('fight',true);return;}
    var r=Math.random();
    el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-glow">✨</div><p>Что внутри?..</p></div>';
    sleep(600).then(function(){
      if(r < .3){var g=ri(20,45)+G.floor*3;G.gold+=g;sfx.gold();el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-glow">💰</div><div class="loot"><div>+<b>'+g+'</b> золота!</div></div><button class="cbtn primary" id="btn-next">Дальше ▼</button></div>';}
      else if(r < .5){G.hero.pots++;sfx.potion();el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-glow">🧪</div><div class="loot"><div>+1 зелье!</div></div><button class="cbtn primary" id="btn-next">Дальше ▼</button></div>';}
      else if(r < .7){var it=dropItem(0);giveItem(it);sfx.mystic();el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-glow">'+it.i+'</div><div class="loot"><div><b>'+it.n+'</b>!</div></div><button class="cbtn primary" id="btn-next">Дальше ▼</button></div>';}
      else if(r < .85){var xp=ri(15,30)+G.floor*2;sfx.mystic();el.innerHTML='<div class="ev"><h3 class="ev-title">📜 СВИТОК</h3><div class="ev-anim anim-glow">✨</div><div class="loot"><div>+'+xp+' опыта!</div></div><button class="cbtn primary" id="btn-next">Дальше ▼</button></div>';gainXp(xp).then(function(){if(G.phase!=='over'){var nb=el.querySelector('#btn-next');if(nb)nb.onclick=function(){sfx.click();nextFloor();};}});return;}
      else{var dm=ri(6,12)+G.floor;G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();el.innerHTML='<div class="ev"><h3 class="ev-title">💥 ЛОВУШКА!</h3><div class="ev-anim anim-shake">🥊</div><div class="loot"><div>−<b>'+dm+' HP</b></div></div><button class="cbtn primary" id="btn-next">Дальше ▼</button></div>';}
      updateHUD();
      saveRun(); // Сохраняем после открытия сундука
      var nb=el.querySelector('#btn-next');if(nb)nb.onclick=function(){sfx.click();nextFloor();};
    });
  };
  $('#chest-leave').onclick=function(){afterEvent();};
}

function openRiddle(){
  var el=$('#event-layer');var r=pick(RIDDLES);var answered=false;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🧩 ЗАГАДКА СТРАННИКА</h3><div class="ev-anim">🧙</div><p style="font-style:italic;font-size:17px">«'+r.q+'»</p><div class="riddle-opts">'+r.a.map(function(ans,i){return'<button class="cbtn riddle-btn" data-idx="'+i+'">'+ans+'</button>';}).join('')+'</div></div>';
  var buttons=el.querySelectorAll('.riddle-btn');
  buttons.forEach(function(btn){
    btn.onclick=function(){
      if(answered)return;answered=true;var idx=parseInt(this.dataset.idx,10);buttons.forEach(function(b){b.disabled=true;});
      if(idx===r.ok){
        this.style.background='var(--grn)';this.style.color='#fff';
        var g=ri(20,40)+G.floor*2,xp=ri(20,40)+G.floor*2;G.gold+=g;sfx.gold();log('Разгадал! +'+g+'💰');
        setTimeout(function(){gainXp(xp).then(function(){updateHUD();saveRun();afterEvent();});},500);
      } else {
        this.style.background='var(--red)';this.style.color='#fff';buttons[r.ok].style.background='var(--grn)';buttons[r.ok].style.color='#fff';
        var dm=ri(6,12)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('Неверно… −'+dm+' HP');
        updateHUD();saveRun();setTimeout(function(){afterEvent();},800);
      }
    };
  });
}

function openRest(){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">🔥 ПРИВАЛ</h3><div class="ev-anim anim-glow">🏕️</div><p>Костёр потрескивает...</p><div class="ev-choices"><button class="cbtn grn" id="rest-heal">😴 Отдохнуть +35% HP</button><button class="cbtn red" id="rest-train">🏋️ Тренировка +2 атаки</button></div></div>';
  $('#rest-heal').onclick=function(){healHero(.35);log('Отдых!');updateHUD();saveRun();afterEvent();};
  $('#rest-train').onclick=function(){G.hero.atk+=2;sfx.gold();log('+2 атаки!');updateHUD();saveRun();afterEvent();};
}

function openFount(){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">⛲ ФОНТАН</h3><div class="ev-anim anim-glow">⛲</div><div class="ev-choices"><button class="cbtn grn" id="f-drink">💧 +30% HP</button><button class="cbtn" id="f-bottle">🧪 +1 зелье</button><button class="cbtn red" id="f-dive">🏊 Нырнуть</button></div></div>';
  $('#f-drink').onclick=function(){healHero(.3);log('Живая вода!');updateHUD();saveRun();afterEvent();};
  $('#f-bottle').onclick=function(){G.hero.pots++;sfx.potion();log('Фляга полна!');updateHUD();saveRun();afterEvent();};
  $('#f-dive').onclick=function(){
    if(Math.random() < .6){var g=ri(40,80)+G.floor*3;G.gold+=g;sfx.gold();log('+'+g+'💰!');}
    else{var dm=ri(10,18)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('−'+dm+' HP');}
    updateHUD();saveRun();afterEvent();
  };
}

function openShrine(){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">🕯️ АЛТАРЬ</h3><div class="ev-anim anim-glow">🕯️</div><div class="ev-choices"><button class="cbtn" id="sh-pray">🙏 Молиться</button><button class="cbtn grn" id="sh-give" '+(G.gold < 20?'disabled':'')+'>💰 20 золота</button><button class="cbtn ghost" id="sh-leave">Уйти</button></div></div>';
  $('#sh-pray').onclick=function(){
    var r=Math.random();
    if(r < .55){sfx.mystic();log('Боги услышали!');chooseCard().then(function(){updateHUD();saveRun();afterEvent();});}
    else if(r < .85){healHero(.15);updateHUD();saveRun();afterEvent();}
    else{var dm=ri(8,14)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('−'+dm+' HP');updateHUD();saveRun();afterEvent();}
  };
  $('#sh-give').onclick=function(){G.gold-=20;chooseCard().then(function(){updateHUD();saveRun();afterEvent();});};
  $('#sh-leave').onclick=function(){afterEvent();};
}

function openTrap(){
  var dodgeChance=Math.min(.85,.4+G.hero.stats.agi*.04);
  if(Math.random() < dodgeChance){sfx.click();log('🕸️ Уклонился!');}
  else{var dm=ri(8,14)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('🕸️ Ловушка! −'+dm+' HP');}
  updateHUD();saveRun();afterEvent();
}

function openTavern(){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">🍺 ТАВЕРНА</h3><div class="ev-anim anim-glow">🍺</div><div class="ev-choices"><button class="cbtn grn" id="tv-drink" '+(G.gold < 10?'disabled':'')+'>Эль 10💰 +25% HP</button><button class="cbtn" id="tv-meal" '+(G.gold < 25?'disabled':'')+'>Похлёбка 25💰 +50% HP</button><button class="cbtn ghost" id="tv-leave">Уйти</button></div></div>';
  $('#tv-drink').onclick=function(){G.gold-=10;healHero(.25);updateHUD();saveRun();afterEvent();};
  $('#tv-meal').onclick=function(){G.gold-=25;healHero(.5);updateHUD();saveRun();afterEvent();};
  $('#tv-leave').onclick=function(){afterEvent();};
}

function openLibrary(){
  var cost=30+G.floor;var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">📚 БИБЛИОТЕКА</h3><div class="ev-anim">📖</div><div class="ev-choices"><button class="cbtn" id="lib-read" '+(G.gold < cost?'disabled':'')+'>+60 опыта ('+cost+'💰)</button><button class="cbtn grn" id="lib-study" '+(G.gold < cost*2?'disabled':'')+'>+1 INT ('+(cost*2)+'💰)</button><button class="cbtn ghost" id="lib-leave">Уйти</button></div></div>';
  $('#lib-read').onclick=function(){G.gold-=cost;gainXp(60).then(function(){updateHUD();saveRun();afterEvent();});};
  $('#lib-study').onclick=function(){G.gold-=cost*2;G.hero.stats.int++;sfx.mystic();log('🔮 INT: '+G.hero.stats.int);updateHUD();saveRun();afterEvent();};
  $('#lib-leave').onclick=function(){afterEvent();};
}

function openSkillEvent(){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">📖 САНКТИЛИЙ</h3><div class="ev-anim anim-glow">📖</div><p>Изучить навык?</p><div class="ev-choices"><button class="cbtn grn" id="sk-learn">📖 Изучить</button><button class="cbtn ghost" id="sk-leave">Уйти</button></div></div>';
  $('#sk-learn').onclick=function(){var s=grantRandomSkill();if(s){showSkillLearned(s);}else{afterEvent();}};
  $('#sk-leave').onclick=function(){afterEvent();};
}

function showSkillLearned(s){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">📖 НОВЫЙ НАВЫК!</h3><div style="font-size:48px">'+s.icon+'</div><div class="loot"><div><b>'+s.name+'</b></div><div style="font-size:14px">'+s.desc+'</div></div><button class="cbtn primary" id="btn-next">Дальше ▼</button></div>';
  saveRun(); // Сохраняем новый навык
  $('#btn-next').onclick=function(){sfx.click();nextFloor();};
}

function openCompanionEvent(){
  var el=$('#event-layer');var opts=[COMPANIONS.knight,COMPANIONS.wolf,COMPANIONS.fairy_c];var comp=pick(opts);
  var scenarios={knight:'Ты находишь рыцаря, придавленного обломками.',wolf:'Волк попал в капкан и скулит.',fairy_c:'Раненая фея лежит у дороги.'};
  var key=comp===COMPANIONS.knight?'knight':comp===COMPANIONS.wolf?'wolf':'fairy_c';
  el.innerHTML='<div class="ev"><h3 class="ev-title">🆘 НУЖНА ПОМОЩЬ</h3><div class="ev-anim anim-shake">'+comp.icon+'</div><p>'+scenarios[key]+'</p><div class="ev-choices"><button class="cbtn grn" id="comp-help">🤝 Помочь</button><button class="cbtn red" id="comp-rob">💰 Ограбить</button><button class="cbtn ghost" id="comp-ignore">Пройти мимо</button></div></div>';
  $('#comp-help').onclick=function(){G.companion={name:comp.name,icon:comp.icon,atk:comp.atk,battlesLeft:comp.battles};sfx.mystic();log(comp.icon+' '+comp.name+' присоединяется!');updateHUD();saveRun();afterEvent();};
  $('#comp-rob').onclick=function(){
    if(Math.random() < .5){var g=ri(30,60)+G.floor*2;G.gold+=g;sfx.gold();log('Ограбил: +'+g+'💰');}
    else{var it=dropItem(0);giveItem(it);log('Ограбил: '+it.n);}
    G.companion=null;updateHUD();saveRun();afterEvent();
  };
  $('#comp-ignore').onclick=function(){afterEvent();};
}

function openDummy(){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">🥊 МАНЕКЕН</h3><div class="ev-anim anim-shake">🥊</div><div class="ev-choices"><button class="cbtn" id="dm-atk">⚔️ +2 атаки</button><button class="cbtn" id="dm-def">🛡️ +2 защиты</button><button class="cbtn ghost" id="dm-leave">Уйти</button></div></div>';
  $('#dm-atk').onclick=function(){G.hero.atk+=2;sfx.gold();log('+2 атаки!');updateHUD();saveRun();afterEvent();};
  $('#dm-def').onclick=function(){G.hero.def+=2;sfx.gold();log('+2 защиты!');updateHUD();saveRun();afterEvent();};
  $('#dm-leave').onclick=function(){afterEvent();};
}

function openCursed(){
  var amt=ri(30,60)+G.floor*2;var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">💰 ПРОКЛЯТОЕ ЗОЛОТО</h3><div class="ev-anim anim-glow">💰</div><p>Груда ('+amt+'💰), но проклята...</p><div class="ev-choices"><button class="cbtn red" id="cg-take">💰 Взять (риск)</button><button class="cbtn ghost" id="cg-leave">Не трогать</button></div></div>';
  $('#cg-take').onclick=function(){
    if(Math.random() < .5){G.gold+=amt;sfx.gold();log('+'+amt+'💰!');}
    else{var dm=ri(8,14)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);G.gold+=Math.round(amt/2);sfx.hurt();log('Проклятие! −'+dm+' HP');}
    updateHUD();saveRun();afterEvent();
  };
  $('#cg-leave').onclick=function(){afterEvent();};
}

function openQuestEvent(){
  var el=$('#event-layer');var available=G.quests.filter(function(q){return q.progress < q.need;});
  if(!available.length){el.innerHTML='<div class="ev"><h3 class="ev-title">📜 КВЕСТЫ</h3><p>Все квесты выполнены!</p><button class="cbtn primary" id="btn-next">Дальше ▼</button></div>';$('#btn-next').onclick=function(){afterEvent();};return;}
  var q=pick(available);
  el.innerHTML='<div class="ev"><h3 class="ev-title">📜 КВЕСТ: '+q.name+'</h3><div class="ev-anim">📜</div><p>'+q.desc+'</p><div class="quest-prog">Прогресс: '+q.progress+'/'+q.need+'</div><p style="font-size:13px;margin-top:8px">Награда: '+q.reward.gold+'💰 + '+q.reward.item.i+' '+q.reward.item.n+'</p><div class="ev-choices"><button class="cbtn grn" id="q-accept">✅ Принять</button><button class="cbtn ghost" id="q-decline">Пройти мимо</button></div></div>';
  $('#q-accept').onclick=function(){log('📜 Квест принят: '+q.name);saveRun();afterEvent();};
  $('#q-decline').onclick=function(){afterEvent();};
}

function renderShop(){
  var el=$('#event-layer');if(!G.shopGoods)generateShopGoods();var mult=G.hero.shopMult||1;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🛒 ЛАВКА</h3><div class="ev-anim">🧙</div><p>Золото: <b>'+G.gold+'</b> 💰</p><div class="ev-shop">'+G.shopGoods.map(function(s,i){var price=Math.round(s.p*mult);return'<button class="shop-it" data-i="'+i+'" '+(G.gold < price?'disabled':'')+'><span class="si-i">'+s.i+'</span><b>'+s.n+'</b><small>'+s.d+'</small><span class="p">'+price+' 💰</span></button>';}).join('')+'</div><button class="cbtn ghost primary" id="shop-exit">Уйти →</button></div>';
  el.querySelectorAll('.shop-it').forEach(function(b){
    b.onclick=function(){
      var item=G.shopGoods[parseInt(this.dataset.i,10)];var price=Math.round(item.p*(G.hero.shopMult||1));
      if(G.gold < price)return;
      G.gold-=price;sfx.gold();
      if(item.kind==='item'){giveItem(item.it);log('Куплено: '+item.it.n);}
      else if(item.kind==='elixir'){giveElixir(item.et);log('Куплен эликсир: '+ELIXIRS[item.et].n);}
      else{item.b(G.hero);log('Куплено: '+item.n);}
      G.shopGoods.splice(parseInt(this.dataset.i,10),1);
      updateHUD();saveRun();renderShop(); // Сохраняем после покупки
    };
  });
  $('#shop-exit').onclick=function(){G.shopGoods=null;sfx.click();afterEvent();};
}

function generateShopGoods(){
  var goods=[];
  goods.push({kind:'consume',i:'🧪',n:'Зелье',d:'+1 зелье',p:25,b:function(h){h.pots++;}});
  goods.push({kind:'consume',i:'🍖',n:'Похлёбка',d:'Лечит 50% HP',p:40,b:function(h){h.hp=Math.min(pMaxHp(),h.hp+Math.round(pMaxHp()*.5));}});
  for(var i=0;i<ri(2,3);i++){var it=dropShopItem();var price=([20,45,90][it.rar]||20)+G.floor*2;goods.push({kind:'item',i:it.i,n:it.n,d:bonusTxt(it),p:price,it:it});}
  var ek=pick(Object.keys(ELIXIRS));goods.push({kind:'elixir',i:ELIXIRS[ek].i,n:ELIXIRS[ek].n,d:ELIXIRS[ek].d,p:35,et:ek});
  G.shopGoods=goods;
}

function dropShopItem(){
  var pool=ITEMS().filter(function(it){return it.f <= Math.min(G.floor+5,100);});
  if(!pool.length)return ITEMS()[0];
  var src=pick(pool);var copy={};for(var k in src)copy[k]=src[k];copy.b={};for(var b in src.b)copy.b[b]=src.b[b];copy.up=0;return copy;
}