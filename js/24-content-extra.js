'use strict';
var VOID_SKILLS=[
{id:'v_rift',name:'Разлом',icon:'🌀',desc:'180% урона тьмой, игнор брони',cd:5,el:'dark',pow:1.8,run:function(h,e){return heroStrike(1.8,{ignoreDef:true,word:'РАЗЛОМ!',el:'dark'});}},
{id:'v_drain',name:'Поглощение',icon:'🩸',desc:'150% урона + лечение 20%',cd:4,el:'dark',pow:1.5,heal:0.2,run:function(h,e){return heroStrike(1.5,{word:'ПОГЛОЩЕНИЕ!',el:'dark'}).then(function(){healHero(.2);});}},
{id:'v_veil',name:'Покров тьмы',icon:'🌑',desc:'+уклонение и щит',cd:4,run:function(h,e){buffHero('dodge',2);shieldHero();return Promise.resolve();}}
];
function grantVoidSkill(){var h=G.hero;if(!h)return null;var locked=VOID_SKILLS.filter(function(s){return h.skills.indexOf(s.id)<0;});if(!locked.length){G.gold+=100;log('Все навыки Пустоты изучены! +100💰');return null;}var s=pick(locked);var book=SKILL_BOOKS[h.cls];var ex=false;for(var i=0;i<book.length;i++)if(book[i].id===s.id)ex=true;if(!ex)book.push(s);h.skills.push(s.id);if(!h.activeSkill)h.activeSkill=s.id;log('🌑 Изучен навык Пустоты: '+s.icon+' '+s.name+'!');sfx.mystic();saveRun();return s;}
if(typeof BOSSES!=='undefined'&&BOSSES[100]){BOSSES[100].weak=null;BOSSES[100].hp=520;BOSSES[100].atk=60;}
if(typeof DOOR_RESULT_LABEL!=='undefined'){DOOR_RESULT_LABEL.crossroads='🤔 Перекрёсток!';DOOR_RESULT_LABEL.trial='🌌 Испытание Пустоты!';}
var _mk=typeof makeDoors==='function'?makeDoors:null;
if(_mk){makeDoors=function(){var doors=_mk();if(!G||G.floor%10===0||G.floor===100)return doors;if(Math.random()<.12)doors.push({type:'crossroads',hint:'🚪 Тропа раздваивается...',ico:'🤔',revealed:null});if((G.cycle||0)>0&&Math.random()<.18)doors.push({type:'trial',hint:'❓ Пустота шепчет...',ico:'🌌',revealed:null});return doors;};}
var _od=typeof openDoor==='function'?openDoor:null;
if(_od){openDoor=function(i){var d=G.doors&&G.doors[i];if(d&&d.type==='crossroads'){_extraDoor(d,'🤔',openCrossroads);return;}if(d&&d.type==='trial'){_extraDoor(d,'🌌',openTrial);return;}return _od(i);};}
function _extraDoor(d,icon,fn){var idx=G.doors.indexOf(d);d.revealed=icon;d.selected=true;G.doors.forEach(function(x,j){if(j!==idx&&!x.revealed)x.revealed='🚪';});if(typeof renderDoors==='function')renderDoors();log('Дверь распахнулась!');sleep(450).then(fn);}
/* ПЕРЕКРЁСТОК: как был — бой / обыск / пройти (БЕЗ интеллекта) */
function openCrossroads(){var el=$('#event-layer');el.innerHTML='<div class="ev"><h3 class="ev-title">🤔 ПЕРЕКРЁСТОК</h3><div class="ev-anim">🤔</div><p>Дороги расходятся. Куда пойдёшь?</p><div class="ev-choices" style="flex-direction:column;gap:8px"><button class="cbtn red" id="cr-fight">⚔️ Сразиться с элитой (лучше лут)</button><button class="cbtn" id="cr-search" style="background:var(--yel)">🔍 Обыскать окрестности</button><button class="cbtn ghost" id="cr-leave">🚪 Пройти мимо</button></div></div>';
$('#cr-fight').onclick=function(){startCombat('elite',false);};
$('#cr-search').onclick=function(){if(Math.random()<.7){var g=ri(20,40)+G.floor*2;G.gold+=g;sfx.gold();log('🔍 Найдено '+g+'💰!');}else{var dm=ri(6,12)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('🕸️ Ловушка! −'+dm+' HP');}updateHUD();afterEvent();};
$('#cr-leave').onclick=function(){afterEvent();};}
function openTrial(){var el=$('#event-layer');el.innerHTML='<div class="ev"><h3 class="ev-title">🌌 ИСПЫТАНИЕ ПУСТОТЫ</h3><div class="ev-anim anim-glow">🌌</div><p>Пустота предлагает сделку.</p><div class="ev-choices" style="flex-direction:column;gap:8px"><button class="cbtn red" id="tr-power">💪 Сила Пустоты: +3 атаки, −10 макс. HP</button><button class="cbtn" id="tr-gamble" style="background:var(--yel)">🎲 Азарт Пустоты</button><button class="cbtn blu" id="tr-skill">🌑 Знание Пустоты: навык</button><button class="cbtn ghost" id="tr-leave">Уйти</button></div></div>';
$('#tr-power').onclick=function(){var h=G.hero;h.atk+=3;h.maxHp=Math.max(30,h.maxHp-10);clampHp();sfx.mystic();log('💪 Сила Пустоты: +3 атаки, −10 макс. HP');updateHUD();saveRun();afterEvent();};
$('#tr-gamble').onclick=function(){var r=Math.random();if(r<.4){var g=ri(60,120)+G.floor*2;G.gold+=g;sfx.gold();log('🎲 +'+g+'💰!');}else if(r<.7){var it=dropItem(2);giveItem(it);log('🎲 Выпал предмет: '+it.n+'!');}else{var dm=ri(10,18)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('🎲 Пустота наказывает! −'+dm+' HP');}updateHUD();saveRun();afterEvent();};
$('#tr-skill').onclick=function(){grantVoidSkill();updateHUD();saveRun();afterEvent();};
$('#tr-leave').onclick=function(){afterEvent();};}
function spawnExtraDoor(type){if(!G||G.phase!=='doors')return;if(!G.doors)G.doors=makeDoors();G.doors.push({type:type||'crossroads',hint:'❓ Тестовая дверь',ico:'🤔',revealed:null});renderDoors();}