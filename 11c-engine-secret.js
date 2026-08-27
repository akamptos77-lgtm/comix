'use strict';
/* 11c-ENGINE-SECRET: испытание стража.
   Встроены: пояснения с кнопкой СТАРТ + видимые таймеры */

function secIntro(title,icon,rules,startFn){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">'+title+'</h3>'+
'<div class="ev-anim">'+icon+'</div>'+
'<p style="font-size:14px;line-height:1.5;max-width:460px;margin:0 auto">'+rules+'</p>'+
'<button class="cbtn grn" id="sec-start" style="font-size:20px;padding:14px 44px;margin-top:14px">▶ СТАРТ</button></div>';
$('#sec-start').onclick=function(){sfx.click();startFn();};
}
function secTimerBar(){
return '<div style="max-width:420px;margin:10px auto 0">'+
'<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700"><span>⏱ Время</span><span id="sec-timer-txt">—</span></div>'+
'<div style="height:12px;border:3px solid var(--ink);border-radius:8px;background:#fff;overflow:hidden">'+
'<div id="sec-timer-fill" style="height:100%;width:100%;background:var(--grn)"></div></div></div>';
}
function secCountdown(seconds,onExpire){
var t0=Date.now();
var iv=setInterval(function(){
var left=seconds-(Date.now()-t0)/1000;
var fill=$('#sec-timer-fill'),txt=$('#sec-timer-txt');
if(left<=0){clearInterval(iv);if(txt)txt.textContent='0.0';if(fill){fill.style.width='0%';fill.style.background='var(--red)';}onExpire();return;}
if(txt)txt.textContent=left.toFixed(1);
if(fill){var p=left/seconds*100;fill.style.width=p+'%';fill.style.background=p>50?'var(--grn)':(p>25?'var(--yel)':'var(--red)');}
},100);
return function(){clearInterval(iv);};
}
function secretReward(){
var rel=dropRelic(),html;
if(rel){giveRelic(rel);html='<div class="ev-anim anim-glow">'+rel.i+'</div><div class="loot"><div><b>РЕЛИКВИЯ:</b> '+rel.n+'</div><div style="font-size:14px">'+rel.d+'</div></div>';}
else{var it=dropItem(2);giveItem(it);var g=ri(60,120)+G.floor*2;G.gold+=g;html='<div class="ev-anim anim-glow">💰</div><div class="loot"><div>'+it.i+' '+it.n+'!</div><div>+'+g+' золота!</div></div>';}
updateHUD();saveRun();
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ Страж доволен!</h3>'+html+'<button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';
$('#btn-next').onclick=function(){sfx.click();afterEvent();};
}
function secretFail(){log('❌ Не вышло! Страж пробуждается!');startCombat('elite',false);}
function shuffleLocal(a){for(var i=a.length-1;i>0;i--){var j=ri(0,i),t=a[i];a[i]=a[j];a[j]=t;}return a;}

function openSecret(){
var r=Math.random();
if(r<.25)trialMemory();
else if(r<.5)trialStopFlow();
else if(r<.75)trialCatchRune();
else trialOddOne();
}

/* === 1. ПАМЯТЬ (без таймера, спокойно) === */
function trialMemory(){
secIntro('🗝️ ИСПЫТАНИЕ: ПАМЯТЬ','🗿','Страж покажет порядок из 3 рун. Внимательно смотри, затем повтори порядок кликами. Ошибка пробуждает стража!',memoryGame);
}
function memoryGame(){
var el=$('#event-layer');var runes=['🔥','❄️','⚡','☠️'];var seq=[ri(0,3),ri(0,3),ri(0,3)];var phase='show',pos=0;
el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ПАМЯТЬ</h3><p id="sec-msg" style="font-size:16px;font-weight:700">👁️ Смотри: страж показывает порядок...</p><div id="sec-dots" style="font-size:22px;letter-spacing:8px;margin:6px 0">⬜⬜⬜</div>'+
'<div style="display:flex;gap:14px;justify-content:center;margin:16px 0">'+runes.map(function(r,i){return'<button class="sec-rune" data-r="'+i+'" style="font-size:36px;width:80px;height:80px;border:4px solid var(--ink);border-radius:14px;background:#fff;box-shadow:4px 4px 0 var(--ink);cursor:pointer" disabled>'+r+'</button>';}).join('')+'</div></div>';
var btns=el.querySelectorAll('.sec-rune');var dots=['⬜','⬜',''];
function setDots(){var d=$('#sec-dots');if(d)d.textContent=dots.join('');}
function flash(i,idx){var b=btns[i];b.style.background='var(--yel)';b.style.transform='scale(1.2)';b.style.boxShadow='0 0 18px var(--yel)';sfx.magic();dots[idx]='🟨';setDots();setTimeout(function(){b.style.background='#fff';b.style.transform='scale(1)';b.style.boxShadow='4px 4px 0 var(--ink)';},500);}
var step=0;
var iv=setInterval(function(){
if(step<seq.length){var m=$('#sec-msg');if(m)m.textContent='👁️ Руна '+(step+1)+' из 3...';flash(seq[step],step);step++;}
else{clearInterval(iv);phase='input';var m2=$('#sec-msg');if(m2)m2.textContent='✍️ Повтори порядок!';dots=['❓','❓','❓'];setDots();btns.forEach(function(b){b.disabled=false;});}
},900);
btns.forEach(function(b){
b.onclick=function(){
if(phase!=='input')return;
var r=parseInt(this.dataset.r,10),self=this;
if(r===seq[pos]){self.style.background='var(--grn)';setTimeout(function(){self.style.background='#fff';},300);sfx.click();pos++;dots[pos-1]='🟩';setDots();if(pos>=seq.length){phase='done';sfx.mystic();secretReward();}}
else{phase='done';secretFail();}
};
});
}

/* === 2. СТОП-ПОТОК (таймер 7с) === */
function trialStopFlow(){
secIntro('🗝️ ИСПЫТАНИЕ: СТОП-ПОТОК','⏳','Руны крутятся по кругу. Жми СТОП, когда в слоте появится нужная руна. У тебя <b>7 секунд</b>.',stopFlowGame);
}
function stopFlowGame(){
var runes=['🔥','️','⚡','☠️'];var target=ri(0,3),cur=ri(0,3),done=false,cancelTimer=null;
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">⏳ СТОП-ПОТОК</h3><p>Жми СТОП, когда будет: <span style="font-size:26px">'+runes[target]+'</span></p>'+secTimerBar()+
'<p id="sf-slot" style="font-size:56px;margin:14px 0">'+runes[cur]+'</p><button class="cbtn red" id="sf-stop" style="font-size:22px;padding:14px 40px">🛑 СТОП!</button></div>';
var slot=$('#sf-slot');
var speed=Math.max(120,260-G.floor*2);
var iv=setInterval(function(){if(done)return;cur=(cur+1)%4;slot.textContent=runes[cur];},speed);
cancelTimer=secCountdown(7,function(){if(!done){done=true;clearInterval(iv);secretFail();}});
$('#sf-stop').onclick=function(){if(done)return;done=true;clearInterval(iv);if(cancelTimer)cancelTimer();if(cur===target){sfx.mystic();secretReward();}else secretFail();};
}

/* === 3. ПОЙМАЙ РУНУ (3 раунда, таймер) === */
function trialCatchRune(){
secIntro('🗝️ ИСПЫТАНИЕ: ПОЙМАЙ РУНУ','🎯','3 раунда. Каждый раунд кликни по нужной руне, пока не вышло время. Промах или таймаут — страж проснётся!',catchRuneGame);
}
function catchRuneGame(){
var runes=['🔥','️','','☠️'];var round=0,total=3,cancelTimer=null;
function next(){
round++;
if(round>total){if(cancelTimer)cancelTimer();sfx.mystic();secretReward();return;}
var target=ri(0,3),locked=false;
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">🎯 ПОЙМАЙ РУНУ</h3><p>Раунд '+round+'/'+total+' — кликни: <span style="font-size:26px">'+runes[target]+'</span></p>'+secTimerBar()+
'<div id="cr-box" style="display:flex;gap:14px;justify-content:center;margin:16px 0"></div></div>';
var box=$('#cr-box');
var tl=Math.max(900,2000-round*300);
if(cancelTimer)cancelTimer();
cancelTimer=secCountdown(tl,function(){if(!locked){locked=true;secretFail();}});
shuffleLocal([0,1,2,3]).forEach(function(r){
var b=document.createElement('button');b.textContent=runes[r];
b.style.cssText='font-size:36px;width:80px;height:80px;border:4px solid var(--ink);border-radius:14px;background:#fff;box-shadow:4px 4px 0 var(--ink);cursor:pointer;';
b.onclick=function(){if(locked)return;locked=true;if(cancelTimer)cancelTimer();if(r===target){sfx.click();b.style.background='var(--grn)';setTimeout(next,300);}else secretFail();};
box.appendChild(b);
});
}
next();
}

/* === 4. НАЙДИ ЛИШНЮЮ (3 раунда, таймер) === */
function trialOddOne(){
secIntro('🗝️ ИСПЫТАНИЕ: НАЙДИ ЛИШНЮЮ','🧩','3 раунда. Каждый раунд одна руна отличается. Кликни по ней, пока не вышло время!',oddOneGame);
}
function oddOneGame(){
var runes=['🔥','❄️','⚡','☠️'];var round=0,total=3,cancelTimer=null;
function next(){
round++;
if(round>total){if(cancelTimer)cancelTimer();sfx.mystic();secretReward();return;}
var base=ri(0,3);var odd=(base+1+ri(0,2))%4;var oddPos=ri(0,8);var locked=false;
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">🧩 НАЙДИ ЛИШНЮЮ</h3><p>Раунд '+round+'/'+total+' — кликни по отличающейся!</p>'+secTimerBar()+
'<div id="oo-grid" style="display:grid;grid-template-columns:repeat(3,80px);gap:10px;justify-content:center;margin:16px 0"></div></div>';
var grid=$('#oo-grid');
var tl=Math.max(1000,2600-round*500);
if(cancelTimer)cancelTimer();
cancelTimer=secCountdown(tl,function(){if(!locked){locked=true;secretFail();}});
for(var i=0;i<9;i++){
(function(pos){
var b=document.createElement('button');
b.textContent=(pos===oddPos)?runes[odd]:runes[base];
b.style.cssText='height:70px;font-size:34px;background:#fff;border:3px solid var(--ink);border-radius:10px;cursor:pointer;';
b.onclick=function(){if(locked)return;locked=true;if(cancelTimer)cancelTimer();if(pos===oddPos){sfx.click();b.style.background='var(--grn)';setTimeout(next,300);}else secretFail();};
grid.appendChild(b);
})(i);
}
}
next();
}