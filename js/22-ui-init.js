'use strict';
/* ============================================
22-UI-INIT: инициализация интерфейса,
защита важных модалок, досрочное завершение
забега с занесением в зал славы
============================================ */
/* ============================================
Список важных оверлеев, которые нельзя
закрывать кликом по фону или Escape
============================================ */
var UI_LOCKED_OVLS = [
'ovl-attrs',
'ovl-cards',
'ovl-quest',
'ovl-end',
'ovl-end-run'
];
function uiIsLocked(id){
return UI_LOCKED_OVLS.indexOf(id) >= 0;
}
function uiIsOn(selector){
var o = $(selector);
return !!(o && o.classList.contains('on'));
}
function uiAnyLockedOpen(){
for (var i = 0; i < UI_LOCKED_OVLS.length; i++) {
if (uiIsOn('#' + UI_LOCKED_OVLS[i])) {
return true;
}
}
return false;
}
/* ============================================
Кнопка досрочного завершения забега
============================================ */
function updateEndRunButton(){
var btn = $('#btn-end-run');
if (!btn) return;
var visible =
typeof G !== 'undefined' &&
G.hero &&
G.phase &&
G.phase !== 'menu' &&
G.phase !== 'over';
btn.style.display = visible ? 'inline-block' : 'none';
}
function initEndRunButton(){
if ($('#btn-end-run')) return;
var btn = document.createElement('button');
btn.id = 'btn-end-run';
btn.className = 'cbtn small red';
btn.textContent = '🏁 Завершить';
btn.title = 'Завершить забег и занести результат в зал славы';
btn.style.cssText =
'position:fixed;right:14px;bottom:14px;z-index:95;' +
'box-shadow:4px 4px 0 var(--ink);';
btn.onclick = function(){
openEndRunModal();
};
document.body.appendChild(btn);
}
function ensureEndRunModal(){
var o = $('#ovl-end-run');
if (o) return o;
o = document.createElement('div');
o.className = 'ovl';
o.id = 'ovl-end-run';
o.dataset.locked = '1';
o.innerHTML =
' <div class= "panel " >' +
' <h2 >🏁 ЗАВЕРШИТЬ ЗАБЕГ? </h2 >' +
' <p >Забег будет завершён. Результат можно занести в зал славы. </p >' +
' <div id= "endrun-stats " class= "end-stats " > </div >' +
' <div id="endrun-name-display" style="font-size:16px;margin:10px 0;color:#2a8a4a;font-weight:bold;"></div>' +
' <div class= "center " >' +
' <button id= "endrun-save " class= "cbtn grn " >🏆 В рейтинг и в меню </button >' +
' <button id= "endrun-cancel " class= "cbtn ghost " >Отмена </button >' +
' </div >' +
' </div >';
document.body.appendChild(o);
$('#endrun-cancel').onclick = function(){
closeOvl('ovl-end-run');
};
$('#endrun-save').onclick = function(){
var btnSave = this;
if (!G || !G.hero) return;

btnSave.disabled = true;
btnSave.textContent = '⏳ Сохраняю...';

// Получаем настоящее имя из второй БД
var savePromise;
if (typeof getRealUsernameAsync === 'function') {
savePromise = getRealUsernameAsync();
} else {
savePromise = Promise.resolve(getUser() || 'Аноним');
}

savePromise.then(function(finalName) {
// Сохраняем имя в localStorage игры (для отображения на главной)
try { localStorage.setItem('kcigames_user', finalName); } catch(e){}

var score = (typeof calcScore === 'function') ? calcScore() : 0;
var floor = G.floor || 1;

var promise;
if (typeof saveScoreAsync === 'function') {
promise = saveScoreAsync(finalName, score, floor);
} else {
if (typeof saveScore === 'function') {
saveScore(finalName, score, floor);
}
promise = Promise.resolve();
}

promise.then(function(){
try {
if (G.enemy) G.enemy.dead = true;
} catch(e) {}
G.busy = false;
G.phase = 'over';
clearRun();
closeOvl('ovl-end-run');
show('scr-menu');
if (typeof renderScoresAsync === 'function') {
renderScoresAsync();
}
if (typeof checkSave === 'function') {
checkSave();
}
var c = $('#btn-continue');
if (c) c.style.display = 'none';
updateEndRunButton();
});
});
};
return o;
}
function openEndRunModal(){
if (typeof G === 'undefined' || !G.hero) return;
if (G.phase === 'menu' || G.phase === 'over') return;
/* Нельзя открывать, если уже открыта важная модалка */
if (uiAnyLockedOpen()) return;
var o = ensureEndRunModal();
var h = G.hero;
var score = (typeof calcScore === 'function') ? calcScore() : 0;
var stats = $('#endrun-stats');
if (stats) {
stats.innerHTML =
' <div >🏰 Этаж <br > <b >' + G.floor + ' </b > </div >' +
' <div >💀 Побед <br > <b >' + G.kills + ' </b > </div >' +
' <div >💰 Золото <br > <b >' + G.gold + ' </b > </div >' +
' <div >⭐ Уровень <br > <b >' + h.level + ' </b > </div >' +
' <div class= "big " >ОЧКИ: ' + score + ' </div >';
}

// Показываем имя из второй БД
var nameDisplay = $('#endrun-name-display');
if (nameDisplay) {
nameDisplay.textContent = '⏳ Загрузка имени...';
if (typeof getRealUsernameAsync === 'function') {
getRealUsernameAsync().then(function(name) {
nameDisplay.textContent = '👤 Имя в рейтинге: ' + name;
});
} else {
nameDisplay.textContent = '👤 Имя в рейтинге: ' + (getUser() || 'Аноним');
}
}

var btnSave = $('#endrun-save');
if (btnSave) {
btnSave.disabled = false;
btnSave.textContent = '🏆 В рейтинг и в меню';
}
o.classList.add('on');
}
/* ============================================
Инициализация
============================================ */
function init(){
if (typeof initTooltip === 'function') {
initTooltip();
}
/* Помечаем важные оверлеи как заблокированные */
UI_LOCKED_OVLS.forEach(function(id){
var o = $('#' + id);
if (o) o.dataset.locked = '1';
});
var hasSave = checkSave();
if (typeof renderScoresAsync === 'function') {
renderScoresAsync();
}
if (typeof renderHeroCards === 'function') {
renderHeroCards();
}
if (typeof updateHUD === 'function') {
updateHUD();
}
var btnContinue = $('#btn-continue');
if (btnContinue) {
btnContinue.style.display = hasSave ? 'inline-block' : 'none';
}
/* === Кнопки меню === */
var btnStart = $('#btn-start');
if (btnStart) {
btnStart.onclick = function(){
clearRun();
if (typeof ac === 'function') ac();
if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
show('scr-hero');
};
}
if (btnContinue) {
btnContinue.onclick = function(){
if (loadRun()) {
/* Защита от зависшего состояния */
G.busy = false;
    if (typeof ac === 'function') ac();
     if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
     show('scr-game');
     if (typeof buildActions === 'function') buildActions();
     if (typeof updateHUD === 'function') updateHUD();
     if (typeof renderElixirs === 'function') renderElixirs();
     if (G.phase === 'combat') {
       var act = $('#actions');
       if (act) act.classList.remove('hidden');
       var elx = $('#elixirs');
       if (elx) elx.classList.remove('hidden');
       if (typeof updateActions === 'function') updateActions();
     } else if (G.phase === 'doors') {
       if (typeof renderDoors === 'function') renderDoors();
     } else {
       G.phase = 'doors';
       if (typeof renderDoors === 'function') renderDoors();
     }
     log('📂 Забег восстановлен! Этаж ' + G.floor);
   } else {
     log('Ошибка загрузки сохранения');
     show('scr-menu');
   }
 };
}
var btnHeroback = $('#btn-heroback');
if (btnHeroback) {
btnHeroback.onclick = function(){
if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
  show('scr-menu');
  checkSave();
  var c = $('#btn-continue');
  if (c) {
    c.style.display = G.hasSave ? 'inline-block' : 'none';
  }
};
}
/* === Сложность === */
var diffs = $('#diffs');
if (diffs) {
diffs.addEventListener('click', function(e){
var b = e.target.closest('.diff-pill');
if (!b) return;
  if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
  G.diff = b.dataset.d;
  $$('.diff-pill').forEach(function(p){
    p.classList.toggle('sel', p === b);
  });
});
}
/* === Вход === */
var btnLogin = $('#btn-login');
if (btnLogin) {
btnLogin.onclick = function(){
// Имя теперь берётся из второй БД, поэтому кнопка только показывает имя
// Если нужно сбросить — можно добавить отдельную логику
if (typeof renderScoresAsync === 'function') renderScoresAsync();
};
}
/* === Туториал === */
var btnTut = $('#btn-tutorial');
if (btnTut) {
btnTut.onclick = function(){
if (typeof showTutorial === 'function') showTutorial();
};
}
var tutPrev = $('#tut-prev');
if (tutPrev) {
tutPrev.onclick = function(){
if (tutStep > 0) {
tutStep--;
renderTut();
}
};
}
var tutNext = $('#tut-next');
if (tutNext) {
tutNext.onclick = function(){
if (tutStep < TUTORIAL.length - 1) {
tutStep++;
renderTut();
} else {
closeOvl('ovl-tutorial');
}
};
}
/* === Бестиарий === */
var btnBest = $('#btn-bestiary');
if (btnBest) {
btnBest.onclick = function(){
if (typeof renderBestiary === 'function') renderBestiary();
openOvl('ovl-bestiary');
};
}
var btnBest2 = $('#btn-best2');
if (btnBest2) {
btnBest2.onclick = function(){
if (typeof renderBestiary === 'function') renderBestiary();
openOvl('ovl-bestiary');
};
}
/* === Инвентарь === */
var btnInv = $('#btn-inv');
if (btnInv) {
btnInv.onclick = function(){
if (typeof renderInv === 'function') renderInv();
openOvl('ovl-inv');
};
}
/* === Закрытие модалок через [data-close] ===
Но важные модалки закрыть нельзя */
document.addEventListener('click', function(e){
var b = e.target.closest('[data-close]');
if (!b) return;
var ovl = b.closest('.ovl');
if (!ovl) return;
if (uiIsLocked(ovl.id) || ovl.dataset.locked) return;
ovl.classList.remove('on');
});
/* === Закрытие модалок кликом по фону ===
Но важные модалки закрыть нельзя */
document.addEventListener('click', function(e){
var o = e.target.closest('.ovl');
if (!o || e.target !== o) return;
if (uiIsLocked(o.id) || o.dataset.locked) return;
o.classList.remove('on');
});
/* === Навыки === */
var btnSkills = $('#btn-skills');
if (btnSkills) {
btnSkills.onclick = function(){
if (G.phase === 'combat') {
log('Нельзя в бою!');
return;
}
  if (!G.hero) return;
  if (typeof renderSkillBook === 'function') renderSkillBook();
  openOvl('ovl-skills');
};
}
/* === Лист персонажа === */
var btnSheet = $('#btn-sheet');
if (btnSheet) {
btnSheet.onclick = function(){
if (!G.hero) return;
  if (typeof renderSheet === 'function') renderSheet();
  openOvl('ovl-sheet');
};
}
/* === Журнал === */
var btnLog = $('#btn-log');
if (btnLog) {
btnLog.onclick = function(){
if (typeof renderLog === 'function') renderLog();
openOvl('ovl-log');
};
}
/* === Бой: клики мышью === */
var actions = $('#actions');
if (actions) {
actions.addEventListener('click', function(e){
var b = e.target.closest('button[data-a]');
if (b && !b.disabled) {
onAction(b.dataset.a);
}
});
}
/* === Финал (поражение/победа) === */
var endSaveBtn = $('#end-save');
if (endSaveBtn) {
endSaveBtn.onclick = function(){
endSaveBtn.disabled = true;
endSaveBtn.textContent = '⏳ Сохраняю...';

// Получаем настоящее имя из второй БД
var savePromise;
if (typeof getRealUsernameAsync === 'function') {
savePromise = getRealUsernameAsync();
} else {
savePromise = Promise.resolve(getUser() || 'Аноним');
}

savePromise.then(function(finalName) {
// Сохраняем имя в localStorage игры
try { localStorage.setItem('kcigames_user', finalName); } catch(e){}

saveScoreAsync(finalName, calcScore(), G.floor).then(function(){
endSaveBtn.textContent = '✔ Сохранено!';
if (typeof renderScoresAsync === 'function') renderScoresAsync();
});
});
};
}
var endRetry = $('#end-retry');
if (endRetry) {
endRetry.onclick = function(){
clearRun();
closeOvl('ovl-end');
  var cls = G.lastClass || 'knight';
  show('scr-game');
  startRun(cls);
};
}
var endMenu = $('#end-menu');
if (endMenu) {
endMenu.onclick = function(){
clearRun();
closeOvl('ovl-end');
  show('scr-menu');
  if (typeof renderScoresAsync === 'function') renderScoresAsync();
  checkSave();
  var c = $('#btn-continue');
  if (c) c.style.display = 'none';
};
}
/* ============================================
Клавиатура
============================================ */
document.addEventListener('keydown', function(e){
var active = document.activeElement;
var isTyping =
active &&
(active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
/* Escape закрывает только необязательные окна */
 if (e.key === 'Escape') {
   if (isTyping) {
     active.blur();
     return;
   }
   $$('.ovl.on').forEach(function(o){
     if (!uiIsLocked(o.id) && !o.dataset.locked) {
       closeOvl(o.id);
     }
   });
   return;
 }
 if (isTyping) return;
 /* Инвентарь */
 if (e.key === 'i' || e.key === 'I' || e.key === 'ш' || e.key === 'Ш') {
   if (G.hero && G.phase !== 'over') {
     if (typeof renderInv === 'function') renderInv();
     openOvl('ovl-inv');
   }
   return;
 }
 /* Enter не должен нажимать кнопки, если открыт важный выбор */
 if (e.key === 'Enter') {
   if (
     uiIsOn('#ovl-end') ||
     uiIsOn('#ovl-end-run') ||
     uiIsOn('#ovl-attrs') ||
     uiIsOn('#ovl-cards') ||
     uiIsOn('#ovl-quest')
   ) {
     return;
   }
   var n = $('#btn-next');
   if (n && !n.disabled) {
     n.click();
     return;
   }
   var p2 = document.querySelector('#event-layer .ev .cbtn:not(:disabled)');
   if (p2) {
     p2.click();
     return;
   }
 }
 /* Боевые клавиши */
 if (typeof G === 'undefined' || G.phase !== 'combat' || G.busy) return;
 /* Защита от зажатой клавиши */
 if (e.repeat) return;
 var m = {
   '1': 'atk',
   '2': 'skill',
   '3': 'skill2',
   '4': 'def',
   '5': 'pot',
   '6': 'flee'
 };
 var k = e.key;
 if (e.code && e.code.indexOf('Digit') === 0) {
   k = e.code.slice(5);
 }
 if (e.code && e.code.indexOf('Numpad') === 0) {
   k = e.code.slice(6);
 }
 var a = m[k];
 if (!a) return;
 /* фикс: клавиша не работает, если кнопка на перезарядке */
 var btn = document.querySelector('.abtn[data-a="' + a + '"]');
 if (!btn || btn.disabled) return;
 if (e.preventDefault) e.preventDefault();
 onAction(a);
});
/* ============================================
Досрочное завершение забега
============================================ */
initEndRunButton();
/* Следим за сменой экранов, чтобы показывать/скрывать кнопку */
var oldShow = window.show;
if (typeof oldShow === 'function') {
window.show = function(){
var result = oldShow.apply(this, arguments);
updateEndRunButton();
return result;
};
}
var oldShowEnd = window.showEnd;
if (typeof oldShowEnd === 'function') {
window.showEnd = function(){
var result = oldShowEnd.apply(this, arguments);
updateEndRunButton();
return result;
};
}
updateEndRunButton();
/* Туториал при первом запуске */
if (!localStorage.getItem('kcigames_tut_seen')) {
localStorage.setItem('kcigames_tut_seen', '1');
if (typeof showTutorial === 'function') {
  setTimeout(showTutorial, 500);
}
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
