'use strict';
/* ============================================
24-CONTENT-EXTRA:
- Перекрёсток: больше выбора в событиях
- Испытание Пустоты: ЭКСТРАОРДИНАРНЫЕ опции
============================================ */

/* === Уникальные артефакты Пустоты === */
var VOID_ARTIFACTS = [
  {id:'void_heart',i:'🖤',n:'Сердце Пустоты',d:'+50% урона, но −2% макс.HP каждый ход',
    fx:function(h){h.atk=Math.round(h.atk*1.5);h.voidHeart=true;}},
  {id:'void_eye',i:'👁️‍🗨️',n:'Око Бездны',d:'+30% крит, но −25% макс.HP',
    fx:function(h){h.crit+=30;h.maxHp=Math.round(h.maxHp*0.75);h.hp=Math.min(h.hp,h.maxHp);}},
  {id:'void_gloves',i:'🧤',n:'Перчатки Хаоса',d:'+8 атаки, но 5% шанс промахнуться по себе',
    fx:function(h){h.atk+=8;h.voidGloves=true;}},
  {id:'void_crown',i:'👑',n:'Корона Безумия',d:'+4 ко всем атрибутам, но −15% уклонения',
    fx:function(h){h.stats.str+=4;h.stats.agi+=4;h.stats.int+=4;h.stats.vit+=4;h.dodgePenalty=(h.dodgePenalty||0)+15;}}
];

/* === Уникальные навыки Пустоты === */
var VOID_SKILLS = [
  {id:'v_rift',name:'Разлом',icon:'🌀',desc:'400% урона, игнор брони',
    cd:6,el:'dark',pow:4.0,
    run:function(h,e){return heroStrike(4.0,{ignoreDef:true,word:'РАЗЛОМ!',big:true,el:'dark'});}},
  {id:'v_drain',name:'Поглощение',icon:'👁️‍🗨️',desc:'250% урона + лечение 30%',
    cd:5,el:'dark',pow:2.5,heal:0.30,
    run:function(h,e){return heroStrike(2.5,{word:'ПОГЛОЩЕНИЕ!',big:true,el:'dark'}).then(function(){healHero(.30);});}},
  {id:'v_summon',name:'Призыв Тени',icon:'👤',desc:'Призвать тёмного спутника на 5 боёв',
    cd:7,
    run:function(h,e){
      G.companion={name:'Тень Пустоты',icon:'👤',atk:Math.round(getHeroAtk()*.6),battlesLeft:5};
      addFloat(225,200,'👤','#b66bff');log('👤 Тень Пустоты призвана!');
      return Promise.resolve();
    }},
  {id:'v_void',name:'Шаг в Пустоту',icon:'🌌',desc:'Исчезнуть: следующий удар врага промахнётся + 200% урона',
    cd:5,el:'dark',pow:2.0,
    run:function(h,e){h.shield=true;h.buffs.atk=Math.max(h.buffs.atk||0,2);log('🌌 Ты исчезаешь в пустоте!');return Promise.resolve();}}
];

(function(){

  if(typeof DOOR_RESULT_LABEL!=='undefined'){
    DOOR_RESULT_LABEL.crossroads='🤔 Перекрёсток!';
    DOOR_RESULT_LABEL.trial='🌌 Испытание Пустоты!';
  }

  var oldMakeDoors=(typeof makeDoors==='function')?makeDoors:null;

  if(oldMakeDoors){
    window.makeDoors=function(){
      var doors=oldMakeDoors();
      if(!G||typeof G.floor!=='number')return doors;
      if(G.floor%10===0||G.floor===100)return doors;

      if(Math.random()<0.12){
        doors.push({type:'crossroads',hint:'🚪 Тропа раздваивается...',ico:'🤔',revealed:null});
      }

      if((G.cycle||0)>0&&Math.random()<0.18){
        doors.push({type:'trial',hint:'❓ Пустота шепчет...',ico:'🌌',revealed:null});
      }

      return doors;
    };
  }

  var oldOpenDoor=(typeof openDoor==='function')?openDoor:null;

  if(oldOpenDoor){
    window.openDoor=function(i){
      var d=G.doors&&G.doors[i];
      if(d&&d.type==='crossroads'){handleExtraDoor(d,'🤔',openCrossroads);return;}
      if(d&&d.type==='trial'){handleExtraDoor(d,'🌌',openTrial);return;}
      return oldOpenDoor(i);
    };
  }

  function handleExtraDoor(d,icon,fn){
    var idx=G.doors.indexOf(d);
    d.revealed=icon;d.selected=true;
    G.doors.forEach(function(x,j){if(j!==idx&&!x.revealed)x.revealed='🚪';});
    if(typeof renderDoors==='function')renderDoors();
    var label=(typeof DOOR_RESULT_LABEL!=='undefined'&&DOOR_RESULT_LABEL[d.type])?DOOR_RESULT_LABEL[d.type]:d.type;
    if(typeof log==='function')log('Дверь распахнулась: '+label);
    if(typeof sleep==='function')sleep(450).then(fn);else fn();
  }

  function finishExtraEvent(){
    if(typeof afterEvent==='function')afterEvent();
    else if(typeof nextFloor==='function')nextFloor();
  }

  /* === ПЕРЕКРЁСТОК === */
  function openCrossroads(){
    var el=$('#event-layer');if(!el)return;
    el.innerHTML=
      '<div class="ev"><h3 class="ev-title">🤔 ПЕРЕКРЁСТОК</h3>'+
      '<div class="ev-anim">🤔</div>'+
      '<p>Дороги расходятся. Каждая сулит своё.</p>'+
      '<div class="ev-choices" style="flex-direction:column;gap:8px">'+
      '<button class="cbtn red" id="cr-fight">⚔️ Сразиться с элитой (лучше лут)</button>'+
      '<button class="cbtn" id="cr-search" style="background:var(--yel)">🔍 Обыскать окрестности</button>'+
      '<button class="cbtn blu" id="cr-risk">🎁 Рискнуть со странным сундуком</button>'+
      '<button class="cbtn ghost" id="cr-leave">🚪 Пройти мимо</button>'+
      '</div></div>';

    $('#cr-fight').onclick=function(){if(typeof sfx!=='undefined'&&sfx.click)sfx.click();startCombat('elite',false);};
    $('#cr-search').onclick=function(){
      if(Math.random()<0.75){var g=ri(20,40)+G.floor*2;G.gold+=g;if(typeof sfx!=='undefined'&&sfx.gold)sfx.gold();log('🔍 Найдено '+g+'💰!');}
      else{var dm=ri(6,12)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);if(typeof sfx!=='undefined'&&sfx.hurt)sfx.hurt();log('🕸️ Ловушка! −'+dm+' HP');}
      updateHUD();saveRun();finishExtraEvent();
    };
    $('#cr-risk').onclick=function(){
      var r=Math.random();
      if(r<0.3){var rel=(typeof dropRelic==='function')?dropRelic():null;if(rel&&typeof giveRelic==='function'&&giveRelic(rel)){log('🎁 Сундук хранит реликвию!');}else{G.gold+=100;log('🎁 Реликвий нет, но найдено 100💰!');}if(typeof sfx!=='undefined'&&sfx.mystic)sfx.mystic();}
      else if(r<0.55){var it=(typeof dropItem==='function')?dropItem(1):null;if(it&&typeof giveItem==='function'&&giveItem(it)){log('🎁 В сундуке предмет!');}else{G.gold+=80;}if(typeof sfx!=='undefined'&&sfx.gold)sfx.gold();}
      else if(r<0.8){var g2=ri(50,90)+G.floor*2;G.gold+=g2;if(typeof sfx!=='undefined'&&sfx.gold)sfx.gold();log('🎁 Сундук полон золота: +'+g2+'💰!');}
      else{var dm2=ri(10,18)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm2);if(typeof sfx!=='undefined'&&sfx.hurt)sfx.hurt();log('💥 Сундук оказался ловушкой! −'+dm2+' HP');}
      updateHUD();saveRun();finishExtraEvent();
    };
    $('#cr-leave').onclick=function(){if(typeof sfx!=='undefined'&&sfx.click)sfx.click();finishExtraEvent();};
  }

  /* === ИСПЫТАНИЕ ПУСТОТЫ: 4 экстраординарные опции === */
  function openTrial(){
    var el=$('#event-layer');if(!el)return;

    /* Выбираем 3 случайных опции из 4 */
    var options=[
      {id:'artifact',i:'💀',n:'Пустотный артефакт',d:'Уникальный предмет с мощным эффектом и ценой'},
      {id:'rebirth',i:'🌑',n:'Тёмное перерождение',d:'Сброс уровня + бонусы за каждый потерянный'},
      {id:'deal',i:'⚡',n:'Сделка с Бездной',d:'Обмен: мощная награда в обмен на что-то ценное'},
      {id:'skill',i:'🎭',n:'Пустотный облик',d:'Изучить уникальный навык Пустоты (один раз за забег)'}
    ];
    var picked=[];
    var pool=options.slice();
    while(picked.length<3&&pool.length){
      picked.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    }

    var buttonsHtml=picked.map(function(opt){
      return '<button class="cbtn trial-opt" data-opt="'+opt.id+'" style="background:var(--ink);color:var(--yel);border-color:#8a1eff">'+
        opt.i+' <b>'+opt.n+'</b><br><small style="opacity:.8;font-weight:400">'+opt.d+'</small>'+
        '</button>';
    }).join('');

    el.innerHTML=
      '<div class="ev"><h3 class="ev-title">🌌 ИСПЫТАНИЕ ПУСТОТЫ</h3>'+
      '<div class="ev-anim anim-glow">🌌</div>'+
      '<p>Пустота смотрит на тебя сквозь ткань миров. Выбери свою судьбу.</p>'+
      '<div class="ev-choices" style="flex-direction:column;gap:10px">'+
      buttonsHtml+
      '<button class="cbtn ghost" id="tr-leave">🚪 Уйти</button>'+
      '</div></div>';

    el.querySelectorAll('[data-opt]').forEach(function(b){
      b.onclick=function(){
        var opt=this.dataset.opt;
        if(opt==='artifact')trialArtifact();
        else if(opt==='rebirth')trialRebirth();
        else if(opt==='deal')trialDeal();
        else if(opt==='skill')trialSkill();
      };
    });

    $('#tr-leave').onclick=function(){if(typeof sfx!=='undefined'&&sfx.click)sfx.click();finishExtraEvent();};
  }

  /* === ВАРИАНТ 1: Пустотный артефакт === */
  function trialArtifact(){
    var el=$('#event-layer');
    var owned=(G.hero.ownedVoid||[]);
    var available=VOID_ARTIFACTS.filter(function(a){return owned.indexOf(a.id)<0;});

    if(!available.length){
      log('🌌 Пустота исчерпана. Больше артефактов нет.');
      finishExtraEvent();
      return;
    }

    /* Выбираем 3 случайных */
    var picks=[];
    var pool=available.slice();
    while(picks.length<Math.min(3,available.length)&&pool.length){
      picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    }

    var html=picks.map(function(a,i){
      return '<button class="cbtn trial-artifact" data-i="'+i+'" style="background:var(--ink);color:var(--yel);border-color:#8a1eff;text-align:left;min-height:80px">'+
        '<div style="font-size:32px;text-align:center">'+a.i+'</div>'+
        '<b style="display:block;text-align:center">'+a.n+'</b>'+
        '<small style="display:block;text-align:center;opacity:.85;font-weight:400;margin-top:4px">'+a.d+'</small>'+
        '</button>';
    }).join('');

    el.innerHTML=
      '<div class="ev"><h3 class="ev-title">💀 ПУСТОТНЫЙ АРТЕФАКТ</h3>'+
      '<div class="ev-anim anim-glow">💀</div>'+
      '<p>Выбери один. Каждый несёт и силу, и проклятие.</p>'+
      '<div class="ev-choices" style="flex-direction:column;gap:10px">'+html+'</div>'+
      '<button class="cbtn ghost" id="art-cancel" style="margin-top:12px">Уйти</button></div>';

    el.querySelectorAll('.trial-artifact').forEach(function(b){
      b.onclick=function(){
        var a=picks[parseInt(this.dataset.i,10)];
        a.fx(G.hero);
        if(!G.hero.ownedVoid)G.hero.ownedVoid=[];
        G.hero.ownedVoid.push(a.id);
        sfx.mystic();
        log('💀 Получен: '+a.i+' '+a.n);
        updateHUD();saveRun();
        finishExtraEvent();
      };
    });

    $('#art-cancel').onclick=function(){finishExtraEvent();};
  }

  /* === ВАРИАНТ 2: Тёмное перерождение === */
  function trialRebirth(){
    var el=$('#event-layer');
    var h=G.hero;
    var lostLevels=h.level-1;
    var bonusPerLevel=2;
    var totalBonus=lostLevels*bonusPerLevel;

    if(lostLevels<2){
      log('🌌 Ты слишком молод для перерождения (нужен уровень 3+).');
      finishExtraEvent();
      return;
    }

    el.innerHTML=
      '<div class="ev"><h3 class="ev-title">🌑 ТЁМНОЕ ПЕРЕРОЖДЕНИЕ</h3>'+
      '<div class="ev-anim anim-glow">🌑</div>'+
      '<p>Сбрось свой уровень и обрети силу Пустоты.</p>'+
      '<div style="background:var(--ink);color:var(--yel);padding:14px;border-radius:12px;margin:14px 0">'+
      '<b>Ты потеряешь:</b><br>Уровень '+h.level+' → 1<br>Опыт ('+h.xp+' / '+h.xpNeed+')<br><br>'+
      '<b>Ты получишь:</b><br>'+
      '+ '+totalBonus+' ко <u>всем</u> атрибутам (×'+bonusPerLevel+' за уровень)<br>'+
      '+1 уникальный навык Пустоты<br>'+
      'Полное восстановление HP'+
      '</div>'+
      '<div class="ev-choices">'+
      '<button class="cbtn red" id="reb-confirm">🌑 Принять перерождение</button>'+
      '<button class="cbtn ghost" id="reb-cancel">Отказаться</button>'+
      '</div></div>';

    $('#reb-confirm').onclick=function(){
      /* Сброс уровня */
      h.level=1;
      h.xp=0;
      h.xpNeed=50;

      /* Бонус к атрибутам */
      h.stats.str+=totalBonus;
      h.stats.agi+=totalBonus;
      h.stats.int+=totalBonus;
      h.stats.vit+=totalBonus;

      /* Полное восстановление */
      h.hp=pMaxHp();

      /* Выбрать случайный навык Пустоты */
      var owned=(h.ownedVoidSkills||[]);
      var available=VOID_SKILLS.filter(function(s){return owned.indexOf(s.id)<0;});
      if(available.length){
        var sk=pick(available);
        h.skills.push(sk.id);
        if(!h.activeSkill)h.activeSkill=sk.id;
        if(!h.ownedVoidSkills)h.ownedVoidSkills=[];
        h.ownedVoidSkills.push(sk.id);
        log('🌑 Перерождение! '+sk.icon+' '+sk.name);
      } else {
        G.gold+=500;
        log('🌑 Перерождение! Все навыки изучены. +500💰');
      }

      sfx.mystic();
      updateHUD();saveRun();
      finishExtraEvent();
    };

    $('#reb-cancel').onclick=function(){finishExtraEvent();};
  }

  /* === ВАРИАНТ 3: Сделка с Бездной === */
  function trialDeal(){
    var el=$('#event-layer');
    var h=G.hero;

    var deals=[];

    /* Сделка 1: все зелья → мощные статы */
    if(h.pots>0){
      deals.push({
        id:'pots',
        offer:'Отдать ВСЕ зелья ('+h.pots+')',
        reward:'+100 макс.HP и +10 атаки',
        ok:true,
        apply:function(){
          var n=h.pots;
          h.pots=0;
          h.maxHp+=100;
          h.hp=Math.min(h.hp+100,pMaxHp());
          h.atk+=10;
          log('⚡ Отдано '+n+' зелий. +100 HP, +10 атаки!');
        }
      });
    }

    /* Сделка 2: половина золота → 3 реликвии (можно иметь больше 3!) */
    if(G.gold>=100){
      deals.push({
        id:'gold',
        offer:'Потерять '+Math.floor(G.gold/2)+' золота',
        reward:'3 случайные реликвии (лимит игнорируется!)',
        ok:true,
        apply:function(){
          G.gold=Math.floor(G.gold/2);
          for(var i=0;i<3;i++){
            var pool=RELICS.filter(function(r){return !(G.relics||[]).some(function(x){return x===r.id;});});
            if(pool.length){
              var r=pick(pool);
              if(!G.relics)G.relics=[];
              G.relics.push(r.id);
              log('🏺 '+r.i+' '+r.n);
            }
          }
        }
      });
    }

    /* Сделка 3: сбросить активный навык → +5 ко всем атрибутам */
    if(h.skills.length>0){
      deals.push({
        id:'skill',
        offer:'Забыть все изученные навыки',
        reward:'+5 ко всем атрибутам навсегда',
        ok:true,
        apply:function(){
          h.skills=[];
          h.activeSkill=null;
          h.stats.str+=5;
          h.stats.agi+=5;
          h.stats.int+=5;
          h.stats.vit+=5;
          log('⚡ Все навыки забыты. +5 ко всем атрибутам!');
        }
      });
    }

    /* Сделка 4: -50% макс.HP → мощнейший артефакт */
    deals.push({
      id:'hp',
      offer:'Потерять 50% макс.HP',
      reward:'👑 Корона Безумия (+4 ко всем атрибутам)',
      ok:true,
      apply:function(){
        h.maxHp=Math.round(h.maxHp*0.5);
        h.hp=Math.min(h.hp,h.maxHp);
        h.stats.str+=4;h.stats.agi+=4;h.stats.int+=4;h.stats.vit+=4;
        log('👑 Получена Корона Безумия! +4 ко всем атрибутам.');
      }
    });

    var html=deals.map(function(d,i){
      return '<button class="cbtn trial-deal" data-i="'+i+'" style="background:var(--ink);color:var(--yel);border-color:#8a1eff;text-align:left;min-height:70px">'+
        '<b>⚡ '+d.offer+'</b><br>'+
        '<small style="opacity:.9;font-weight:400">→ '+d.reward+'</small>'+
        '</button>';
    }).join('');

    el.innerHTML=
      '<div class="ev"><h3 class="ev-title">⚡ СДЕЛКА С БЕЗДНОЙ</h3>'+
      '<div class="ev-anim anim-glow">⚡</div>'+
      '<p>Бездна предлагает обмен. Каждое решение — навсегда.</p>'+
      '<div class="ev-choices" style="flex-direction:column;gap:10px">'+html+'</div>'+
      '<button class="cbtn ghost" id="deal-cancel" style="margin-top:12px">Отказаться</button></div>';

    el.querySelectorAll('.trial-deal').forEach(function(b){
      b.onclick=function(){
        var d=deals[parseInt(this.dataset.i,10)];
        d.apply();
        sfx.mystic();
        updateHUD();saveRun();
        finishExtraEvent();
      };
    });

    $('#deal-cancel').onclick=function(){finishExtraEvent();};
  }

  /* === ВАРИАНТ 4: Пустотный облик (уникальный навык) === */
  function trialSkill(){
    var el=$('#event-layer');
    var h=G.hero;
    var owned=(h.ownedVoidSkills||[]);
    var available=VOID_SKILLS.filter(function(s){return owned.indexOf(s.id)<0;});

    if(!available.length){
      log('🌌 Все навыки Пустоты уже изучены!');
      G.gold+=300;
      sfx.gold();
      log('🌌 Пустота дарит 300💰.');
      updateHUD();saveRun();
      finishExtraEvent();
      return;
    }

    var picks=[];
    var pool=available.slice();
    while(picks.length<Math.min(3,available.length)&&pool.length){
      picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    }

    var html=picks.map(function(s,i){
      return '<button class="cbtn trial-skill" data-i="'+i+'" style="background:var(--ink);color:var(--yel);border-color:#8a1eff;text-align:left;min-height:90px">'+
        '<div style="font-size:36px;text-align:center">'+s.icon+'</div>'+
        '<b style="display:block;text-align:center">'+s.name+'</b>'+
        '<small style="display:block;text-align:center;opacity:.85;font-weight:400;margin-top:4px">'+s.desc+'</small>'+
        '<small style="display:block;text-align:center;opacity:.7;margin-top:4px">КД: '+s.cd+'</small>'+
        '</button>';
    }).join('');

    el.innerHTML=
      '<div class="ev"><h3 class="ev-title">🎭 ПУСТОТНЫЙ ОБЛИК</h3>'+
      '<div class="ev-anim anim-glow">🎭</div>'+
      '<p>Пустота дарует тебе запрещённое знание. Выбери один навык — он будет с тобой до конца забега.</p>'+
      '<div class="ev-choices" style="flex-direction:column;gap:10px">'+html+'</div>'+
      '<button class="cbtn ghost" id="skill-cancel" style="margin-top:12px">Уйти</button></div>';

    el.querySelectorAll('.trial-skill').forEach(function(b){
      b.onclick=function(){
        var s=picks[parseInt(this.dataset.i,10)];
        h.skills.push(s.id);
        if(!h.activeSkill)h.activeSkill=s.id;
        if(!h.ownedVoidSkills)h.ownedVoidSkills=[];
        h.ownedVoidSkills.push(s.id);
        sfx.mystic();
        log('🎭 Изучен: '+s.icon+' '+s.name);
        updateHUD();saveRun();
        finishExtraEvent();
      };
    });

    $('#skill-cancel').onclick=function(){finishExtraEvent();};
  }

  window.spawnExtraDoor=function(type){
    if(!G)return;
    if(G.phase!=='doors'){if(typeof log==='function')log('Используй spawnExtraDoor на экране дверей.');return;}
    if(!G.doors)G.doors=(typeof makeDoors==='function')?makeDoors():[];
    G.doors.push({type:type||'crossroads',hint:'❓ Тестовая дверь',ico:'🤔',revealed:null});
    if(typeof renderDoors==='function')renderDoors();
  };

})();