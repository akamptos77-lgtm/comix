'use strict';
/* 10-ENGINE-DOORS: Двери + Автосохранение */

var DOOR_RESULT_LABEL={fight:'⚔️ Бой!',elite:'⭐ Элита!',boss:'💀 БОСС!',final:'☠ ФИНАЛ!',chest:'🎁 Сундук',shop:'🛒 Лавка',rest:'🔥 Привал',riddle:'🧩 Загадка',fount:'⛲ Фонтан',shrine:'🕯️ Алтарь',trap:'🕸️ Ловушка!',tavern:'🍺 Таверна',library:'📚 Библиотека',skill:'📖 Санктилий',companion:'🆘 Помощь!',cursed:'💰 Проклятие',dummy:'🥊 Манекен',quest:'📜 Квест!'};

function getDoorRevealIcon(t){var m={fight:'⚔️',elite:'⭐',boss:'💀',final:'☠',chest:'🎁',shop:'🛒',rest:'🔥',riddle:'🧩',fount:'⛲',shrine:'🕯️',trap:'🕸️',tavern:'🍺',library:'📚',skill:'📖',companion:'🆘',cursed:'💰',dummy:'🥊',quest:'📜'};return m[t]||'🚪';}

function makeDoors(){
  if(G.floor===100)return[{type:'final',hint:'☠ ЛОГОВО ПОЖИРАТЕЛЯ МИРОВ!',ico:'☠',revealed:null}];
  if(G.floor%10===0)return[{type:'boss',hint:'💀 ЛОГОВО БОССА!',ico:'💀',revealed:null}];
  var dm=DIFF[G.diff],types=[];
  var w={fight:.30,elite:dm.elite,chest:.12,shop:.10,rest:.08,riddle:.06,fount:.05,shrine:.05,trap:.04,tavern:.05,library:.04,skill:.03,companion:.06,cursed:.03,dummy:.03,quest:.05};
  for(var t in w)for(var i=0;i<Math.round(w[t]*100);i++)types.push(t);
  var hints={fight:'🚪 Тяжёлая дверь',elite:'🚪 Слышен рык',chest:'🚪 Что-то блестит',shop:'🚪 Пахнет благовониями',rest:'🚪 Тёплый сквозняк',riddle:'🚪 За дверью шёпот',fount:'🚪 Плеск воды',shrine:'🚪 Мерцают свечи',trap:'🚪 Подозрительно тихо',tavern:'🚪 Слышны песни',library:'🚪 Пахнет пергаментом',skill:'🚪 Светятся руны',companion:'🚪 Кто-то зовёт',cursed:'🚪 Холодит душу',dummy:'🚪 Слышны удары',quest:'🚪 Просят помощи'};
  var doors=[];for(var j=0;j<3;j++){var tt=pick(types);doors.push({type:tt,hint:hints[tt],ico:'🚪',revealed:null});}
  return doors;
}

function renderDoors(){
  G.phase='doors';$('#actions').classList.add('hidden');$('#elixirs').classList.add('hidden');
  if(!G.doors)G.doors=makeDoors();
  var doors=G.doors,el=$('#event-layer');
  var isBossFloor=G.floor%10===0||G.floor===100;
  var bio=getBiome(G.floor);
  el.innerHTML='<div class="ev"><h3 class="ev-title">'+bio.ico+' ЭТАЖ '+G.floor+(isBossFloor?' — БОСС!':'')+'</h3><p style="opacity:.75;margin-bottom:10px"><i>'+bio.name+'. Подглядеть нельзя...</i></p><div class="doors">'+doors.map(function(d,i){
    return'<button class="door '+(d.type==='boss'||d.type==='final'?'boss':'')+(d.revealed?' opened':'')+(d.revealed==='selected'?' selected':'')+'" data-i="'+i+'" '+(d.revealed?'disabled':'')+'><div class="door-ico">'+(d.revealed?d.revealed:d.ico)+'</div><div class="door-hint">'+(d.revealed?(DOOR_RESULT_LABEL[d.type]||''):d.hint)+'</div></button>';
  }).join('')+'</div></div>';
  el.querySelectorAll('.door').forEach(function(b){if(b.disabled)return;b.onclick=function(){sfx.door();openDoor(parseInt(this.dataset.i,10));};});
}

function openDoor(i){
  var d=G.doors[i],h=G.hero;
  d.revealed=getDoorRevealIcon(d.type);d.selected=true;
  G.doors.forEach(function(x,idx){if(idx!==i && !x.revealed)x.revealed='🚪';});
  renderDoors();log('Дверь распахнулась: '+DOOR_RESULT_LABEL[d.type]);
  sleep(450).then(function(){
    if(d.type==='fight'||d.type==='elite'||d.type==='boss'||d.type==='final'){startCombat(d.type,false);return;}
    if(d.type==='chest'){openChest();return;}
    if(d.type==='shop'){renderShop();return;}
    if(d.type==='rest'){openRest();return;}
    if(d.type==='riddle'){openRiddle();return;}
    if(d.type==='fount'){openFount();return;}
    if(d.type==='shrine'){openShrine();return;}
    if(d.type==='trap'){openTrap();return;}
    if(d.type==='tavern'){openTavern();return;}
    if(d.type==='library'){openLibrary();return;}
    if(d.type==='skill'){openSkillEvent();return;}
    if(d.type==='companion'){openCompanionEvent();return;}
    if(d.type==='dummy'){openDummy();return;}
    if(d.type==='cursed'){openCursed();return;}
    if(d.type==='quest'){openQuestEvent();return;}
  });
}

function afterEvent(){
  updateHUD();
  saveRun(); // Сохраняем после завершения события
  var el=$('#event-layer');
  el.innerHTML='<div class="ev"><p><b>Этаж пройден!</b></p><button class="cbtn primary" id="btn-next">Спуститься ниже ▼</button></div>';
  $('#btn-next').onclick=function(){sfx.click();nextFloor();};
}

function nextFloor(){
  G.floor++;G.doors=null;G.phase='doors';$('#event-layer').innerHTML='';renderDoors();updateHUD();
  var bio=getBiome(G.floor);log(bio.ico+' Этаж '+G.floor+' — '+bio.name+(G.floor%10===0?' — БОСС!':G.floor===100?' — ФИНАЛ!':''));
  saveRun(); // Сохраняем при переходе на новый этаж
}