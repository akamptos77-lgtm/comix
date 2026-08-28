'use strict';
/* 11b-ENGINE-ARCADE: экономика = фикс + % от золота;
   рыбалка переработана */

function arcadeCost(base){return base+Math.floor(G.gold*0.06);}
function gameIntro(title,icon,rules,startFn){var el=$('#event-layer');el.innerHTML='<div class="ev"><h3 class="ev-title">'+title+'</h3><div class="ev-anim">'+icon+'</div><p style="font-size:14px;line-height:1.5;max-width:460px;margin:0 auto">'+rules+'</p><button class="cbtn grn" id="gm-start" style="font-size:20px;padding:14px 44px;margin-top:14px">▶ СТАРТ</button></div>';$('#gm-start').onclick=function(){sfx.click();startFn();};}
function timerBarHtml(){return '<div style="max-width:420px;margin:10px auto 0"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700"><span>⏱ Время</span><span id="gm-timer-txt">—</span></div><div style="height:12px;border:3px solid var(--ink);border-radius:8px;background:#fff;overflow:hidden"><div id="gm-timer-fill" style="height:100%;width:100%;background:var(--grn)"></div></div></div>';}
function startCountdown(seconds,onExpire){var t0=Date.now();var iv=setInterval(function(){var left=seconds-(Date.now()-t0)/1000;var fill=$('#gm-timer-fill'),txt=$('#gm-timer-txt');if(left<=0){clearInterval(iv);if(txt)txt.textContent='0.0';if(fill){fill.style.width='0%';fill.style.background='var(--red)';}onExpire();return;}if(txt)txt.textContent=left.toFixed(1);if(fill){var p=left/seconds*100;fill.style.width=p+'%';fill.style.background=p>50?'var(--grn)':(p>25?'var(--yel)':'var(--red)');}},100);return function(){clearInterval(iv);};}

function openArcade(){
var el=$('#event-layer');
var cQD=arcadeCost(15),cARM=arcadeCost(10),cSH=arcadeCost(15),cCG=arcadeCost(12),cWH=arcadeCost(25);
el.innerHTML='<div class="ev"><h3 class="ev-title">🎰 ИГРОВОЙ ЗАЛ</h3><div class="ev-anim anim-glow">🎰</div>'+
'<p>Ставки растут с твоим золотом! Золото: <b>'+G.gold+'</b>💰</p>'+
'<div class="ev-choices" style="flex-direction:column;gap:8px">'+
'<button class="cbtn red" id="arc-qd" '+(G.gold<cQD?'disabled':'')+'>⚡ Быстрая реакция ('+cQD+'💰)</button>'+
'<button class="cbtn grn" id="arc-arm" '+(G.gold<cARM?'disabled':'')+'>💪 Армрестлинг ('+cARM+'💰)</button>'+
'<button class="cbtn" id="arc-shoot" style="background:var(--yel)" '+(G.gold<cSH?'disabled':'')+'>🎯 Тир ('+cSH+'💰)</button>'+
'<button class="cbtn" id="arc-cg" style="background:#ffd8a8" '+(G.gold<cCG?'disabled':'')+'>🔨 Бей кротов ('+cCG+'💰)</button>'+
'<button class="cbtn blu" id="arc-wheel" '+(G.gold<cWH?'disabled':'')+'>🎡 Колесо Фортуны ('+cWH+'💰)</button>'+
'<button class="cbtn ghost" id="arc-leave">🚪 Уйти</button></div></div>';
$('#arc-qd').onclick=function(){quickDraw();};
$('#arc-arm').onclick=function(){armWrestle();};
$('#arc-shoot').onclick=function(){shootingGallery();};
$('#arc-cg').onclick=function(){whackMole();};
$('#arc-wheel').onclick=function(){wheelFortune();};
$('#arc-leave').onclick=function(){afterEvent();};
}
function showArcadeResult(title,anim,msg){var el=$('#event-layer');el.innerHTML='<div class="ev"><h3 class="ev-title">'+title+'</h3><div class="ev-anim">'+anim+'</div><div class="loot"><div>'+msg+'</div></div><div class="ev-choices"><button class="cbtn" id="arc-back" style="background:var(--yel)">🎰 В зал</button><button class="cbtn ghost" id="arc-exit">🚪 Уйти</button></div></div>';$('#arc-back').onclick=function(){openArcade();};$('#arc-exit').onclick=function(){afterEvent();};}

function quickDraw(){gameIntro('⚡ БЫСТРАЯ РЕАКЦИЯ','🔫','Жди сигнал «ОГОНЬ!» и жми как можно быстрее. Фальстарт или промедление — проигрыш.',quickDrawGame);}
function quickDrawGame(){var cost=arcadeCost(15);if(G.gold<cost){log('Не хватает золота!');return;}G.gold-=cost;updateHUD();
var el=$('#event-layer'),state='wait',t0=0,done=false;
el.innerHTML='<div class="ev"><h3 class="ev-title">⚡ БЫСТРАЯ РЕАКЦИЯ</h3><p>Жди сигнал <b>🔔 ОГОНЬ!</b> и жми!</p><p id="qd-msg" style="font-size:22px;margin:14px 0">…ждём…</p><button class="cbtn red" id="qd-btn" style="font-size:24px;padding:20px 50px">🔫 ОГОНЬ!</button></div>';
var btn=$('#qd-btn'),msg=$('#qd-msg');
var to=setTimeout(function(){state='go';t0=Date.now();msg.textContent='🔔 ОГОНЬ!!!';btn.style.background='var(--grn)';setTimeout(function(){if(!done){done=true;sfx.hurt();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🤠','Слишком медленно!');}},900);},1200+Math.random()*2000);
btn.onclick=function(){if(done)return;
if(state==='wait'){done=true;clearTimeout(to);sfx.hurt();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','❌','Фальстарт!');}
else{done=true;var rt=Date.now()-t0;
if(rt<260){G.gold+=cost*3;sfx.gold();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🏆','Молния! '+rt+' мс! +'+(cost*3)+'💰');}
else if(rt<380){G.gold+=cost*2;sfx.gold();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🎉','Отлично! '+rt+' мс! +'+(cost*2)+'💰');}
else if(rt<500){G.gold+=cost;sfx.click();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🤝','Впритык. '+rt+' мс. Возврат ставки.');}
else{sfx.hurt();showArcadeResult('⚡ БЫСТРАЯ РЕАКЦИЯ','🤠','Слишком медленно! '+rt+' мс.');}
updateHUD();}};}

function armWrestle(){gameIntro('💪 АРМРЕСТЛИНГ','💪','Жми «ЖМИ!», чтобы зелёная сторона выдавила красную. Таймера нет — только сила!',armWrestleGame);}
function armWrestleGame(){var cost=arcadeCost(10);if(G.gold<cost){log('Не хватает золота!');return;}G.gold-=cost;updateHUD();
var el=$('#event-layer'),pos=50,done=false;var rate=Math.min(1.6,0.7+G.floor*0.015);
el.innerHTML='<div class="ev"><h3 class="ev-title">💪 АРМРЕСТЛИНГ</h3><p>Твоя <b style="color:#2a8a4a">зелёная</b> линия борется с <b style="color:#c44">красной</b>.</p><div class="lock-bar" style="max-width:520px"><div id="arm-you" style="position:absolute;left:0;top:0;bottom:0;background:var(--grn);width:50%"></div><div id="arm-foe" style="position:absolute;right:0;top:0;bottom:0;background:var(--red);width:50%"></div><div id="arm-pin" style="position:absolute;top:0;bottom:0;width:4px;background:var(--ink);left:50%"></div></div><button class="cbtn grn" id="arm-mash" style="font-size:24px;padding:20px 40px">💪 ЖМИ!</button></div>';
function draw(){var y=$('#arm-you'),f=$('#arm-foe'),p=$('#arm-pin');if(y)y.style.width=pos+'%';if(f)f.style.width=(100-pos)+'%';if(p)p.style.left=pos+'%';}
function end(win,msg){if(done)return;done=true;clearInterval(iv);
if(win){G.gold+=cost*2;G.hero.atk+=1;sfx.gold();showArcadeResult('💪 АРМРЕСТЛИНГ','🎉','Победа! +'+(cost*2)+'💰 и +1 атака!');}
else{sfx.hurt();showArcadeResult('💪 АРМРЕСТЛИНГ','😞',msg||'Противник сильнее!');}
updateHUD();}
var iv=setInterval(function(){if(done)return;pos-=rate;if(pos<=0){end(false);return;}if(pos>=100){end(true);return;}draw();},90);
$('#arm-mash').onclick=function(){if(done)return;pos=Math.min(100,pos+3);if(pos>=100){end(true);return;}draw();};
draw();}

function shootingGallery(){gameIntro('🎯 ТИР','🎯','Кликни по всем мишеням за 8 секунд.',shootingGalleryGame);}
function shootingGalleryGame(){var cost=arcadeCost(15);if(G.gold<cost){log('Не хватает золота!');return;}G.gold-=cost;updateHUD();
var el=$('#event-layer'),targets=3,hits=0,done=false,cancelTimer=null;
el.innerHTML='<div class="ev"><h3 class="ev-title">🎯 ТИР</h3><p>Осталось: <span id="shoot-left">'+targets+'</span></p>'+timerBarHtml()+'<div id="shoot-area" style="position:relative;height:200px;background:#2a2050;border-radius:12px;overflow:hidden;margin:10px 0"></div></div>';
var area=$('#shoot-area');
for(var i=0;i<targets;i++){var t=document.createElement('button');t.textContent='🎯';t.style.cssText='position:absolute;font-size:36px;background:none;border:none;cursor:pointer;transition:left .5s,top .5s;';t.style.left=ri(10,80)+'%';t.style.top=ri(10,70)+'%';
t.onclick=function(){if(this.disabled||done)return;this.disabled=true;this.textContent='💥';hits++;$('#shoot-left').textContent=targets-hits;sfx.hit();
if(hits>=targets){done=true;if(cancelTimer)cancelTimer();clearInterval(moveIv);G.gold+=cost*2;sfx.gold();updateHUD();setTimeout(function(){showArcadeResult('🎯 ТИР','🏆','Все мишени! +'+(cost*2)+'💰');},500);}};
area.appendChild(t);}
var moveIv=setInterval(function(){area.querySelectorAll('button:not(:disabled)').forEach(function(btn){btn.style.left=ri(5,80)+'%';btn.style.top=ri(5,70)+'%';});},800);
cancelTimer=startCountdown(8,function(){if(!done){done=true;clearInterval(moveIv);sfx.hurt();showArcadeResult('🎯 ТИР','⏱️','Время вышло! Попадания: '+hits+'/'+targets);}});}

function whackMole(){gameIntro('🔨 БЕЙ КРОТОВ','🐹','Бей кротов 🐹, не трогай черепа 💀. 12 секунд.',whackMoleGame);}
function whackMoleGame(){var cost=arcadeCost(12);if(G.gold<cost){log('Не хватает золота!');return;}G.gold-=cost;updateHUD();
var el=$('#event-layer'),score=0,done=false,cancelTimer=null;
var perMole=Math.max(2,Math.round(cost*0.25));
el.innerHTML='<div class="ev"><h3 class="ev-title">🔨 БЕЙ КРОТОВ</h3><p>Счёт: <span id="wm-score">0</span> · Крот = '+perMole+'💰</p>'+timerBarHtml()+'<div id="wm-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0"></div></div>';
var grid=$('#wm-grid'),cells=[];
for(var i=0;i<9;i++){var d=document.createElement('button');d.style.cssText='height:70px;font-size:34px;background:#3a2a5a;border:3px solid var(--ink);border-radius:10px;cursor:pointer;';grid.appendChild(d);cells.push(d);}
var spawnIv=setInterval(function(){if(done)return;var idx=ri(0,8),cell=cells[idx];if(cell.dataset.on)return;var isSkull=Math.random()<0.25;cell.dataset.on='1';cell.textContent=isSkull?'💀':'';
cell.onclick=function(){if(done||!cell.dataset.on)return;cell.dataset.on='';
if(isSkull){G.hero.hp=Math.max(1,G.hero.hp-3);sfx.hurt();cell.textContent='💥';}
else{score++;$('#wm-score').textContent=score;sfx.hit();cell.textContent='💥';}
updateHUD();setTimeout(function(){cell.textContent='';},200);};
setTimeout(function(){cell.dataset.on='';cell.textContent='';},900);},650);
cancelTimer=startCountdown(12,function(){if(done)return;done=true;clearInterval(spawnIv);var win=score*perMole;G.gold+=win;sfx.gold();updateHUD();showArcadeResult('🔨 БЕЙ КРОТОВ','🔨','Выбито '+score+' кротов! +'+win+'💰');});}

function wheelFortune(){var cost=arcadeCost(25);if(G.gold<cost){log('Не хватает золота!');return;}G.gold-=cost;updateHUD();
var el=$('#event-layer');
var prizes=[
{i:'💰',n:'+'+(cost*3)+' золота',f:function(){G.gold+=cost*3;}},
{i:'🧪',n:'+2 зелья',f:function(){G.hero.pots+=2;}},
{i:'🗡️',n:'Редкий предмет',f:function(){var it=dropItem(1);giveItem(it);}},
{i:'✨',n:'+50 опыта',f:function(){gainXp(50);}},
{i:'💀',n:'Ловушка! −15 HP',f:function(){G.hero.hp=Math.max(1,G.hero.hp-15);}},
{i:'🏺',n:'Реликвия!',f:function(){var r=dropRelic();if(r)giveRelic(r);else G.gold+=cost;}},
{i:'❌',n:'Пусто',f:function(){}},
{i:'💪',n:'+3 атаки навсегда',f:function(){G.hero.atk+=3;}}
];
var winIdx=ri(0,prizes.length-1);
el.innerHTML='<div class="ev"><h3 class="ev-title">🎡 КОЛЕСО ФОРТУНЫ</h3><div class="ev-anim anim-glow">🎡</div><p>Крутим...</p><div style="font-size:48px;margin:20px 0" id="wheel-result">❓</div></div>';
var spins=0;
var iv=setInterval(function(){spins++;$('#wheel-result').textContent=prizes[ri(0,prizes.length-1)].i;
if(spins>20){clearInterval(iv);$('#wheel-result').textContent=prizes[winIdx].i;prizes[winIdx].f();sfx.gold();updateHUD();setTimeout(function(){showArcadeResult('🎡 КОЛЕСО ФОРТУНЫ',prizes[winIdx].i,'Выпало: '+prizes[winIdx].n);},700);}},100);}

/* === РЫБАЛКА: дешёвая и полезная, цена не взрывается === */
function fishingCost(){return 5+Math.floor(G.gold*0.02);}
function goFishing(){
var cost=fishingCost();
if(G.gold<cost){log('Не хватает золота! Нужно '+cost+'💰');return;}
G.gold-=cost;
var el=$('#event-layer');var r=Math.random();var result;var f=G.floor;
if(r<0.35){var g=ri(20,50)+f*3;G.gold+=g;result='🐟 Золотая рыбка! +'+g+'💰';sfx.gold();}
else if(r<0.6){var minR=f>50?1:0;var it=dropItem(minR);giveItem(it);result='🎣 Выловил: '+it.i+' '+it.n+'!';sfx.mystic();}
else if(r<0.8){var ek=pick(Object.keys(ELIXIRS));giveElixir(ek);result='🧪 Рыба проглотила эликсир: '+ELIXIRS[ek].n+'!';sfx.potion();}
else if(r<0.9&&f>30){var rel=dropRelic();if(rel){giveRelic(rel);result='🏺 На дне блестела реликвия: '+rel.n+'!';}else{G.gold+=cost*2;result='🏺 Реликвий нет, но нашёл клад: +'+(cost*2)+'💰';}sfx.mystic();}
else{result='🥾 Поймал... старый сапог. Ничего.';sfx.click();}
updateHUD();saveRun();
var nextCost=fishingCost();
el.innerHTML='<div class="ev"><h3 class="ev-title">🎣 РЫБАЛКА</h3><div class="ev-anim anim-bounce">🎣</div><div class="loot"><div>'+result+'</div></div><div class="ev-choices"><button class="cbtn grn" id="fish-again" '+(G.gold<nextCost?'disabled':'')+'>🎣 Ещё раз ('+nextCost+'💰)</button><button class="cbtn ghost" id="fish-leave">Уйти</button></div></div>';
$('#fish-again').onclick=function(){goFishing();};
$('#fish-leave').onclick=function(){afterEvent();};
}