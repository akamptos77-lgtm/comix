'use strict';
/* 25-INTRO-GAMES: пояснения + кнопка СТАРТ перед мини-играми */
function introScreen(title,icon,rules,onStart){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">'+title+'</h3>'+
'<div class="ev-anim">'+icon+'</div>'+
'<p style="font-size:14px;line-height:1.5;max-width:460px;margin:0 auto">'+rules+'</p>'+
'<button class="cbtn grn" id="intro-start" style="font-size:20px;padding:14px 44px;margin-top:14px">▶ СТАРТ</button></div>';
$('#intro-start').onclick=function(){sfx.click();onStart();};
}
/* Оборачиваем мини-игры аркады */
if(typeof quickDraw==='function'){var _qd=quickDraw;quickDraw=function(){introScreen('⚡ БЫСТРАЯ РЕАКЦИЯ','🔫','Жди сигнал <b>«ОГОНЬ!»</b> и жми кнопку как можно быстрее. Фальстарт или промедление — проигрыш.',_qd);};}
if(typeof armWrestle==='function'){var _aw=armWrestle;armWrestle=function(){introScreen('💪 АРМРЕСТЛИНГ','💪','Быстро жми <b>«ЖМИ!»</b>, чтобы твоя зелёная сторона выдавила красную. Если твоя полоса упадёт до нуля — проиграешь.',_aw);};}
if(typeof shootingGallery==='function'){var _sg=shootingGallery;shootingGallery=function(){introScreen('🎯 ТИР','🎯','Кликни по <b>всем мишеням</b>, пока они убегают. Успей до конца таймера!',_sg);};}
if(typeof whackMole==='function'){var _wm=whackMole;whackMole=function(){introScreen('🔨 БЕЙ КРОТОВ','🐹','Бей кротов 🐹 и <b>не трогай</b> черепа 💀. У тебя 12 секунд.',_wm);};}
/* Оборачиваем мини-игры сундуков */
if(typeof forceChestGame==='function'){var _fc=forceChestGame;forceChestGame=function(cb){introScreen('💪 ВЫЛОМАТЬ СИЛОЙ','💪','Быстро жми <b>«ЖМИ!»</b>. Если красная сторона победит или время выйдет — сработает ловушка.',function(){_fc(cb);});};}
if(typeof lockpickGame==='function'){var _lp=lockpickGame;lockpickGame=function(cb){introScreen('🗝️ ВЗЛОМ ЗАМКА','🗝️','Метка ходит по полосе. Нажми <b>СТОП</b>, когда она будет в <b>зелёной зоне</b>. Промах — ловушка.',function(){_lp(cb);});};}
if(typeof intellectChestGame==='function'){var _ic=intellectChestGame;intellectChestGame=function(cb){introScreen('🔮 ОТКРЫТЬ ХИТРОСТЬЮ','🔮','Жди, пока руны вспыхнут <b>зелёным</b>, и жми <b>«СЕЙЧАС!»</b>. Раньше времени — охрана сработает.',function(){_ic(cb);});};}