'use strict';
/* 11b-ENGINE-ARCADE: игровой зал (6 интерактивных мини-игр) */

function openArcade(){arcadeMenu();}

function arcadeMenu(){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">🎰 ИГРОВОЙ ЗАЛ</h3>'+
    '<div class="ev-anim anim-glow">🎰</div>'+
    '<p>Испытай удачу и реакцию, герой! Золото: <b>'+G.gold+'</b>💰</p>'+
    '<div class="ev-choices" style="flex-direction:column;gap:8px">'+
    '<button class="cbtn red" id="arc-qd" '+(G.gold<15?'disabled':'')+'>⚡ Быстрая реакция (15💰)</button>'+
    '<button class="cbtn grn" id="arc-arm" '+(G.gold<10?'disabled':'')+'>💪 Армрестлинг (10💰)</button>'+
    '<button class="cbtn" id="arc-shoot" style="background:var(--yel)" '+(G.gold<15?'disabled':'')+'>🎯 Тир (15💰)</button>'+
    '<button class="cbtn blu" id="arc-cg" '+(G.gold<10?'disabled':'')+'>💰 Лови золото (10💰)</button>'+
    '<button class="cbtn" id="arc-wm" style="background:#ffd8a8" '+(G.gold<12?'disabled':'')+'>🔨 Бей кротов (12💰)</button>'+
    '<button class="cbtn blu" id="arc-wheel" '+(G.gold<25?'disabled':'')+'>🎡 Колесо Фортуны (25💰)</button>'+
    '<button class="cbtn ghost" id="arc-leave">🚪 Уйти</button>'+
    '</div></div>';
  $('#arc-qd').onclick=function(){quickDraw();};
  $('#arc-arm').onclick=function(){armWrestle();};
  $('#arc-shoot').onclick=function(){shootingGallery();};
  $('#arc-cg').onclick=function(){catchGold();};
  $('#arc-wm').onclick=function(){whackMole();};
  $('#arc-wheel').onclick=function(){wheelFortune();};
  $('#arc-leave').onclick=function(){afterEvent();};
}

function showArcadeResult(title,anim,msg){
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><h3 class="ev-title">'+title+'</h3>'+
    '<div class="ev-anim">'+anim+'</div>'+
    '<div class="loot"><div>'+msg+'</div></div>'+
    '<div class="ev-choices">'+
    '<button class="cbtn" id="arc-back" style="background:var(--yel)">🎰 В зал</button>'+
    '<button class="cbtn ghost" id="arc-exit">🚪 Уйти</button>'+
    '</div></div>';
  updateHUD();
  $('#arc-back').onclick=function(){arcadeMenu();};
  $('#arc-exit').onclick=function(){afterEvent();};
}

/* === 💪 АРМРЕСТЛИНГ (перетягивание линий) === */
function armWrestle(){
  var bet=10;
  if(G.gold<bet){log('Не хватает золота!');return;}
  G.gold-=bet;updateHUD();
  var el=$('#event-layer');
  var pos=50,done=false;
  var rate=Math.min(1.6,0.7+G.floor*0.015);
  el.innerHTML='<div class="ev"><h3 class="ev-title">💪 АРМРЕСТЛИНГ</h3>'+
    '<p>Жми кнопку! Твоя <b style="color:#2a8a4a">зелёная</b> линия борется с <b style="color:#c44">красной</b>. Дотолкни врага до края!</p>'+
    '<div class="lock-bar" style="max-width:520px">'+
    '<div id="arm-you" style="position:absolute;left:0;top:0;bottom:0;background:var(--grn);width:50%"></div>'+
    '<div id="arm-foe" style="position:absolute;right:0;top:0;bottom:0;background:var(--red);width:50%"></div>'+
    '<div id="arm-pin" style="position:absolute;top:0;bottom:0;width:4px;background:var(--ink);left:50%"></div>'+
    '</div>'+
    '<p>💪 ТЫ | 🤜 ВРАГ</p>'+
    '<button class="cbtn grn" id="arm-mash" style="font-size:24px;padding:20px 40px">💪 ЖМИ!</button></div>';
  function draw(){
    $('#arm-you').style.width=pos+'%';
    $('#arm-foe').style.width=(100-pos)+'%';
    $('#arm-pin').style.left=pos+'%';
  }
  function end(win,msg){
    if(done)return;done=true;clearInterval(iv);
    if(win){G.gold+=bet*2;G.hero.atk+=1;sfx.gold();showArcadeResult('💪 АРМРЕСТЛИНГ','🎉','Победа! +'+(bet*2)+'💰 и +1 атака!');}
    else{sfx.hurt();showArcadeResult('💪 АРМРЕСТЛИНГ','😞',msg||'Противник оказался сильнее!');}
  }
  var iv=setInterval(function(){
    if(done)return;
    pos-=rate;
    if(pos<=0){end(false);return;}
    if(pos>=100){end(true);return;}
    draw();
  },90);
  $('#arm-mash').onclick=function(){
    if(done)return;
    pos=Math.min(100,pos+3);
    if(pos>=100){end(true);return;}
    draw();
  };
  setTimeout(function(){if(!done)end(pos>=50,'Время вышло!');},7000);
  draw();
}

/* === ⚡ БЫСТРАЯ РЕАКЦИЯ (дуэль) === */
function quickDraw(){
  var bet=15;
  if(G.gold<bet){log('Не хватает золота!');return;}
  G.gold-=bet;updateHUD();
  var el=$('#event-layer');
  var state='wait',t0=0,done=false;
  el.innerHTML='<div class="ev"><h3 class="ev-title">⚡ БЫСТРАЯ РЕАКЦИЯ</h3>'+
    '<p>🤠 Бандит крутит ствол... Жди сигнал <b>🔔 ОГОНЬ!</b> и жми кнопку как можно быстрее!</p>'+
    '<p id="qd-msg" style="font-size:22px;margin:14px 0">…ждём…</p>'+
    '<button class="cbtn red" id="qd-btn" style="font-size:24px;padding:20px 50px">🔫 ОГОНЬ!</button></div>';
  var btn=$('#qd-btn'),msg=$('#qd-msg');
  var to=setTimeout(function(){
    state='go';t0=Date.now();
    msg.textContent='🔔 ОГОНЬ!!!';
    btn.style.background='var(--grn)';
    setTimeout(function(){
      if(!done){done=true;sfx.hurt();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🤠','Слишком медленно! Бандит выстрелил первым.');}
    },900);
  },1200+Math.random()*2000);
  btn.onclick=function(){
    if(done)return;
    if(state==='wait'){
      done=true;clearTimeout(to);
      sfx.hurt();
      showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','❌','Фальстарт! Ставка потеряна.');
    } else {
      done=true;
      var rt=Date.now()-t0;
      if(rt<260){G.gold+=bet*3;sfx.gold();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🏆','Молния! '+rt+' мс! +'+(bet*3)+'💰');}
      else if(rt<380){G.gold+=bet*2;sfx.gold();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🎉','Отлично! '+rt+' мс! +'+(bet*2)+'💰');}
      else if(rt<500){G.gold+=bet;sfx.click();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🤝','Впритык. '+rt+' мс. Ставка возвращена.');}
      else{sfx.hurt();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🤠','Слишком медленно! '+rt+' мс.');}
      updateHUD();
    }
  };
}

/* === 💰 ЛОВИ ЗОЛОТО (исправлено: 💰 вместо 🪙) === */
function catchGold(){
  var bet=10;
  if(G.gold<bet){log('Не хватает золота!');return;}
  G.gold-=bet;updateHUD();
  var el=$('#event-layer');
  var got=0,done=false,timeLeft=10;
  el.innerHTML='<div class="ev"><h3 class="ev-title">💰 ЛОВИ ЗОЛОТО</h3>'+
    '<p>Хватай монеты 💰, не трогай бомбы 💣! Время: <span id="cg-time">10</span>с · Поймано: <span id="cg-got">0</span></p>'+
    '<div id="cg-area" style="position:relative;height:220px;background:#2a2050;border-radius:12px;overflow:hidden;margin:10px 0"></div></div>';
  var area=$('#cg-area');
  var spawnIv=setInterval(function(){
    if(done)return;
    var isBomb=Math.random()<0.3;
    var c=document.createElement('button');
    c.textContent=isBomb?'💣':'💰';
    c.style.cssText='position:absolute;font-size:34px;background:none;border:none;cursor:pointer;left:'+ri(5,86)+'%;top:'+ri(5,76)+'%;transition:opacity .3s;line-height:1;padding:0;';
    area.appendChild(c);
    setTimeout(function(){c.style.opacity='0';setTimeout(function(){if(c.parentNode)c.parentNode.removeChild(c);},300);},1200);
    c.onclick=function(){
      if(done||!c.parentNode)return;
      c.parentNode.removeChild(c);
      if(isBomb){G.hero.hp=Math.max(1,G.hero.hp-4);sfx.hurt();}
      else{got++;$('#cg-got').textContent=got;sfx.gold();}
      updateHUD();
    };
  },450);
  var timeIv=setInterval(function(){
    timeLeft--;
    var t=$('#cg-time');if(t)t.textContent=timeLeft;
    if(timeLeft<=0){
      done=true;clearInterval(spawnIv);clearInterval(timeIv);
      var win=got*3;
      G.gold+=win;sfx.gold();updateHUD();
      showArcadeResult('💰 ЛОВИ ЗОЛОТО','💰','Поймано '+got+' монет! +'+win+'💰');
    }
  },1000);
}

/* === 🔨 БЕЙ КРОТОВ (исправлено: кроты видны) === */
function whackMole(){
  var bet=12;
  if(G.gold<bet){log('Не хватает золота!');return;}
  G.gold-=bet;updateHUD();
  var el=$('#event-layer');
  var score=0,done=false,timeLeft=12;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🔨 БЕЙ КРОТОВ</h3>'+
    '<p>Бей кротов 🐹, не трогай черепа 💀! Время: <span id="wm-time">12</span>с · Счёт: <span id="wm-score">0</span></p>'+
    '<div id="wm-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0"></div></div>';
  var grid=$('#wm-grid');
  var cells=[];
  for(var i=0;i<9;i++){
    var d=document.createElement('button');
    d.style.cssText='height:80px;font-size:44px;background:#4a3a6a;border:3px solid var(--ink);border-radius:12px;cursor:pointer;line-height:1;padding:0;transition:background .15s;';
    d.textContent='';
    grid.appendChild(d);
    cells.push(d);
  }
  var spawnIv=setInterval(function(){
    if(done)return;
    var idx=ri(0,8);
    var cell=cells[idx];
    if(cell.dataset.on)return;
    var isSkull=Math.random()<0.25;
    cell.dataset.on='1';
    cell.textContent=isSkull?'💀':'🐹';
    cell.style.background=isSkull?'#6a2a3a':'#7a6a3a';
    cell.onclick=function(){
      if(done||!cell.dataset.on)return;
      cell.dataset.on='';
      if(isSkull){G.hero.hp=Math.max(1,G.hero.hp-3);sfx.hurt();cell.textContent='💥';}
      else{score++;$('#wm-score').textContent=score;sfx.hit();cell.textContent='💥';}
      updateHUD();
      cell.style.background='#4a3a6a';
      setTimeout(function(){cell.textContent='';},200);
    };
    setTimeout(function(){
      if(cell.dataset.on){cell.dataset.on='';cell.textContent='';cell.style.background='#4a3a6a';}
    },1200);
  },600);
  var timeIv=setInterval(function(){
    timeLeft--;
    var t=$('#wm-time');if(t)t.textContent=timeLeft;
    if(timeLeft<=0){
      done=true;clearInterval(spawnIv);clearInterval(timeIv);
      var win=score*2;
      G.gold+=win;sfx.gold();updateHUD();
      showArcadeResult('🔨 БЕЙ КРОТОВ','🔨','Выбито '+score+' кротов! +'+win+'💰');
    }
  },1000);
}

/* === 🎯 ТИР === */
function shootingGallery(){
  var bet=15;
  if(G.gold<bet){log('Не хватает золота!');return;}
  G.gold-=bet;updateHUD();
  var el=$('#event-layer');
  var targets=3,hits=0,done=false;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🎯 ТИР</h3>'+
    '<p>Кликни по всем мишеням! Осталось: <span id="shoot-left">'+targets+'</span></p>'+
    '<div id="shoot-area" style="position:relative;height:200px;background:#2a2050;border-radius:12px;overflow:hidden;margin:10px 0"></div></div>';
  var area=$('#shoot-area');
  for(var i=0;i<targets;i++){
    var t=document.createElement('button');
    t.textContent='🎯';
    t.style.cssText='position:absolute;font-size:36px;background:none;border:none;cursor:pointer;transition:left .5s,top .5s;line-height:1;padding:0;';
    t.style.left=ri(10,80)+'%';
    t.style.top=ri(10,70)+'%';
    t.onclick=function(){
      if(this.disabled||done)return;
      this.disabled=true;
      this.textContent='💥';
      hits++;
      $('#shoot-left').textContent=targets-hits;
      sfx.hit();
      if(hits>=targets){
        done=true;clearInterval(moveIv);
        G.gold+=bet*2;
        sfx.gold();
        setTimeout(function(){showArcadeResult('🎯 ТИР','🏆','Все мишени! +'+(bet*2)+'💰');},500);
      }
    };
    area.appendChild(t);
  }
  var moveIv=setInterval(function(){
    area.querySelectorAll('button:not(:disabled)').forEach(function(btn){
      btn.style.left=ri(5,80)+'%';
      btn.style.top=ri(5,70)+'%';
    });
  },800);
  setTimeout(function(){
    if(!done){
      done=true;clearInterval(moveIv);
      sfx.hurt();
      showArcadeResult('🎯 ТИР','⏱️','Время вышло! Попадания: '+hits+'/'+targets);
    }
  },8000);
}

/* === 🎡 КОЛЕСО ФОРТУНЫ === */
function wheelFortune(){
  var bet=25;
  if(G.gold<bet){log('Не хватает золота!');return;}
  G.gold-=bet;updateHUD();
  var el=$('#event-layer');
  var prizes=[
    {i:'💰',n:'+'+(bet*3)+' золота',f:function(){G.gold+=bet*3;}},
    {i:'🧪',n:'+2 зелья',f:function(){G.hero.pots+=2;}},
    {i:'🗡️',n:'Редкий предмет',f:function(){var it=dropItem(1);giveItem(it);}},
    {i:'✨',n:'+50 опыта',f:function(){gainXp(50);}},
    {i:'💀',n:'Ловушка! −15 HP',f:function(){G.hero.hp=Math.max(1,G.hero.hp-15);}},
    {i:'🏺',n:'Реликвия!',f:function(){var r=dropRelic();if(r)giveRelic(r);else G.gold+=50;}},
    {i:'❌',n:'Пусто',f:function(){}},
    {i:'💪',n:'+3 атаки навсегда',f:function(){G.hero.atk+=3;}}
  ];
  var winIdx=ri(0,prizes.length-1);
  el.innerHTML='<div class="ev"><h3 class="ev-title">🎡 КОЛЕСО ФОРТУНЫ</h3>'+
    '<div class="ev-anim anim-glow">🎡</div>'+
    '<p>Крутим колесо...</p>'+
    '<div style="font-size:48px;margin:20px 0" id="wheel-result">❓</div></div>';
  var spins=0;
  var iv=setInterval(function(){
    spins++;
    var rnd=ri(0,prizes.length-1);
    $('#wheel-result').textContent=prizes[rnd].i;
    if(spins>20){
      clearInterval(iv);
      $('#wheel-result').textContent=prizes[winIdx].i;
      prizes[winIdx].f();
      sfx.gold();
      updateHUD();
      setTimeout(function(){
        showArcadeResult('🎡 КОЛЕСО ФОРТУНЫ',prizes[winIdx].i,'Выпало: '+prizes[winIdx].n);
      },700);
    }
  },100);
}