'use strict';
/* ============================================
11-ENGINE-EVENTS: события + ХУДОЖЕСТВЕННЫЕ
описания исходов (каждое событие — мини-рассказ)
============================================ */

/* --- Взлом замка (полоска) --- */
function lockpickGame(onDone){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ВЗЛОМ ЗАМКА</h3>'+
'<div class="lock-bar"><div id="lock-pin"></div><div class="lock-zone"></div></div>'+
'<p>Останови метку в зелёной зоне — и замок щёлкнет открытым.</p>'+
'<button class="cbtn grn" id="lock-stop">СТОП!</button></div>';
var pos=0,dir=1,speed=2.2+Math.min(1.3,G.floor*0.01);
var pin=$('#lock-pin');
var iv=setInterval(function(){pos+=dir*speed;if(pos>100||pos<0){dir*=-1;pos=Math.max(0,Math.min(100,pos));}pin.style.left=pos+'%';},16);
$('#lock-stop').onclick=function(){clearInterval(iv);onDone(pos>=40&&pos<=60);};
}
/* --- Силовой взлом (армрестлинг) --- */
function forceChestGame(onDone){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">💪 ВЫЛОМАТЬ СИЛОЙ</h3>'+
'<p>Ты упираешься пальцами в щель и налегаешь. Жми <b>«ЖМИ!»</b>, пока петли не поддадутся!</p>'+
'<div class="lock-bar" style="max-width:520px"><div id="fg-you" style="position:absolute;left:0;top:0;bottom:0;background:var(--grn);width:50%"></div><div id="fg-foe" style="position:absolute;right:0;top:0;bottom:0;background:var(--red);width:50%"></div><div id="fg-pin" style="position:absolute;top:0;bottom:0;width:4px;background:var(--ink);left:50%"></div></div>'+
'<button class="cbtn grn" id="fg-mash" style="font-size:22px;padding:16px 40px">💪 ЖМИ!</button></div>';
var pos=50,done=false;
var rate=Math.min(2.4,0.9+G.floor*0.012);
function draw(){var y=$('#fg-you'),f=$('#fg-foe'),p=$('#fg-pin');if(y)y.style.width=pos+'%';if(f)f.style.width=(100-pos)+'%';if(p)p.style.left=pos+'%';}
function end(win){if(done)return;done=true;clearInterval(iv);onDone(win);}
var iv=setInterval(function(){if(done)return;pos-=rate;if(pos<=0){end(false);return;}if(pos>=100){end(true);return;}draw();},90);
$('#fg-mash').onclick=function(){if(done)return;pos=Math.min(100,pos+2.5+G.hero.stats.str*0.05);if(pos>=100){end(true);return;}draw();};
draw();
}
/* --- Интеллектуальный взлом (реакция) --- */
function intellectChestGame(onDone){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">🔮 ОТКРЫТЬ ХИТРОСТЬЮ</h3>'+
'<p>Ты изучаешь гравировку на замке. Жди, пока руны вспыхнут <b>зелёным</b>, и жми <b>«СЕЙЧАС!»</b>.</p>'+
'<p id="ic-msg" style="font-size:22px;margin:14px 0">…руны мерцают…</p>'+
'<button class="cbtn blu" id="ic-btn" style="font-size:22px;padding:16px 40px">🔮 СЕЙЧАС!</button></div>';
var msg=$('#ic-msg'),btn=$('#ic-btn'),state='wait',done=false;
var to=setTimeout(function(){if(done)return;state='go';msg.textContent='🟢 СЕЙЧАС!!!';btn.style.background='var(--grn)';
setTimeout(function(){if(!done){done=true;onDone(false);}},800);},1200+Math.random()*2000);
btn.onclick=function(){if(done)return;
if(state==='wait'){done=true;clearTimeout(to);onDone(false);}
else{done=true;onDone(true);}};
}
function chestStatReq(){return 4+Math.floor(G.floor*0.35);}
function chestAttemptResult(ok){
if(ok){log('✅ Замок поддался! Внутри вдвое больше добра!');doChestOpen(2,true);}
else{
log('❌ Замок не поддаётся...');
if(Math.random()<.5){var dm=ri(6,12)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('💥 Изнутри бьёт пружинный механизм! −'+dm+' HP');updateHUD();}
doChestOpen(1,true);
}
}

/* --- СУНДУК --- */
function openChest(){
var el=$('#event-layer');
var locked=Math.random()<0.3;
if(!locked){
el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-bounce">📦</div>'+
'<p>У стены стоит открытый сундук. Внутри что-то блестит.</p>'+
'<div class="ev-choices"><button class="cbtn grn" id="chest-open">📦 Заглянуть</button>'+
'<button class="cbtn ghost" id="chest-leave">🚪 Пройти мимо</button></div></div>';
$('#chest-open').onclick=function(){doChestOpen(1,false);};
$('#chest-leave').onclick=function(){log('Ты решаешь не трогать чужое.');afterEvent();};
return;
}
var req=chestStatReq(),h=G.hero;
el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-bounce">🔒</div>'+
'<p>Ты нашёл <b>запертый сундук</b>. Замок старый, но крепкий. Попробуешь аккуратно взломать или выломать силой?</p>'+
'<p style="font-size:12px;opacity:.7">Чем глубже этаж, тем крепче замки.</p>'+
'<div class="ev-choices" style="flex-direction:column;gap:8px">'+
'<button class="cbtn red" id="chest-force" '+(h.stats.str<req?'disabled':'')+'>💪 Выломать силой (нужно 💪 '+req+')</button>'+
'<button class="cbtn blu" id="chest-pick" '+(h.stats.agi<req?'disabled':'')+'>🗝️ Взломать отмычкой (нужно 🏹 '+req+')</button>'+
'<button class="cbtn" id="chest-mind" style="background:var(--yel)" '+(h.stats.int<req?'disabled':'')+'>🔮 Открыть хитростью (нужно 🔮 '+req+')</button>'+
'<button class="cbtn ghost" id="chest-kick">📦 Сорвать замок (риск!)</button>'+
'<button class="cbtn ghost" id="chest-leave">🚪 Пройти мимо</button></div></div>';
$('#chest-force').onclick=function(){forceChestGame(chestAttemptResult);};
$('#chest-pick').onclick=function(){lockpickGame(chestAttemptResult);};
$('#chest-mind').onclick=function(){intellectChestGame(chestAttemptResult);};
$('#chest-kick').onclick=function(){doChestOpen(1,false);};
$('#chest-leave').onclick=function(){log('Ты решаешь не трогать чужое.');afterEvent();};
}
function doChestOpen(mult,safe){
G.chestsOpened++;updateQuestProgress('chest');
if(!safe&&Math.random()<.15){log('⚠️ Сундук скалится зубами — это МИМИК!');startCombat('fight',true);return;}
var r=Math.random(),el=$('#event-layer');
if(safe&&r>=.85)r=.25;
el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-glow">✨</div><p>Ты поднимаешь крышку...</p></div>';
sleep(600).then(function(){
if(r<.3){var g=(ri(15,30)+G.floor*2)*mult;G.gold+=g;sfx.gold();
el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-glow">💰</div><div class="loot"><div>Крышка откидывается — внутри горка монет! <b>+'+g+'</b>💰</div></div><button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';}
else if(r<.5){G.hero.pots+=mult;sfx.potion();
el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-glow">🧪</div><div class="loot"><div>В соломе бережно уложены зелья. 🧪 +'+mult+'</div></div><button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';}
else if(r<.7){var it=dropItem(mult>1?1:0);giveItem(it);sfx.mystic();
el.innerHTML='<div class="ev"><h3 class="ev-title">🎁 СУНДУК</h3><div class="ev-anim anim-glow">'+it.i+'</div><div class="loot"><div>Под слоем пыли лежит '+it.i+' <b>'+it.n+'</b>'+(it.cursed?' (ПРОКЛЯТО!)':'')+'!</div><div style="font-size:13px">'+bonusTxt(it)+'</div></div><button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';}
else if(r<.85){var xp=(ri(15,30)+G.floor*2)*mult;sfx.mystic();
el.innerHTML='<div class="ev"><h3 class="ev-title">📜 СВИТОК</h3><div class="ev-anim anim-glow">✨</div><div class="loot"><div>Внутри свиток с мудростью предков. +'+xp+' опыта</div></div><button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';
gainXp(xp).then(function(){if(G.phase!=='over'){var nb=el.querySelector('#btn-next');if(nb)nb.onclick=function(){sfx.click();nextFloor();};}});return;}
else{var dm=ri(6,12)+G.floor;G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();
el.innerHTML='<div class="ev"><h3 class="ev-title">💥 ЛОВУШКА!</h3><div class="ev-anim anim-shake">🥊</div><div class="loot"><div>Щелчок! Из стенок бьют отравленные иглы! −<b>'+dm+'</b> HP</div></div><button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';}
updateHUD();saveRun();
var nb=el.querySelector('#btn-next');if(nb)nb.onclick=function(){sfx.click();nextFloor();};
});
}

/* --- ЗАГАДКА --- */
function openRiddle(){
var el=$('#event-layer'),r=pick(RIDDLES),answered=false;
el.innerHTML='<div class="ev"><h3 class="ev-title">🧩 ЗАГАДКА СТРАННИКА</h3><div class="ev-anim">🧙</div><p style="font-style:italic;font-size:17px">«'+r.q+'»</p><div class="riddle-opts">'+r.a.map(function(ans,i){return'<button class="cbtn riddle-btn" data-idx="'+i+'">'+ans+'</button>';}).join('')+'</div></div>';
var buttons=el.querySelectorAll('.riddle-btn');
buttons.forEach(function(btn){
btn.onclick=function(){
if(answered)return;answered=true;
var idx=parseInt(this.dataset.idx,10);
buttons.forEach(function(b){b.disabled=true;});
if(idx===r.ok){
this.style.background='var(--grn)';this.style.color='#fff';
var g=ri(15,30)+G.floor*2,xp=ri(20,40)+G.floor*2;G.gold+=g;sfx.gold();
log('🧙 «Верно!» — странник улыбается и сыплет тебе монет. +'+g+'💰');
setTimeout(function(){gainXp(xp).then(function(){updateHUD();afterEvent();});},500);
}else{
this.style.background='var(--red)';this.style.color='#fff';
buttons[r.ok].style.background='var(--grn)';buttons[r.ok].style.color='#fff';
var dm=ri(6,12)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();
log('🧙 «Увы...» — странник щёлкает пальцами, и тебя жалит боль. −'+dm+' HP');
updateHUD();setTimeout(function(){afterEvent();},800);
}
};
});
}

/* --- ЛАГЕРЬ --- */
function relicCampCost(){return Math.round(250*Math.pow(2,G.relicBuys||0));}
function openRest(){
var el=$('#event-layer');
var healCost=25+G.floor*2;
var relicCost=relicCampCost();
el.innerHTML='<div class="ev"><h3 class="ev-title">🔥 ЛАГЕРЬ</h3><div class="ev-anim anim-glow">🏕️</div>'+
'<p>Ты набредаешь на тихий привал. Костёр потрескивает, пахнет дымом и домом. Золото: <b>'+G.gold+'</b>💰</p>'+
'<div class="ev-choices">'+
'<button class="cbtn grn" id="rest-heal">😴 Отдых +35% HP</button>'+
'<button class="cbtn red" id="rest-train">🏋️ Тренировка +2 атаки</button>'+
'<button class="cbtn blu" id="rest-craft">⚒️ Крафт</button>'+
'<button class="cbtn grn" id="rest-doc" '+((G.gold<healCost||G.hero.hp>=pMaxHp())?'disabled':'')+'>⚕️ Целитель ('+healCost+'💰)</button>'+
'<button class="cbtn" id="rest-relic" style="background:var(--yel)" '+(G.gold<relicCost?'disabled':'')+'>🏺 Реликвия ('+relicCost+'💰)</button>'+
'</div></div>';
$('#rest-heal').onclick=function(){healHero(.35);log('😴 Ты растягиваешься у костра и смыкаешь глаза. Тело благодарно.');afterEvent();};
$('#rest-train').onclick=function(){G.hero.atk+=2;sfx.gold();log('🏋️ До седьмого пота машешь мечом. Мышцы гудят, но удар стал тяжелее. +2 атаки');afterEvent();};
$('#rest-craft').onclick=function(){openCraft();};
$('#rest-doc').onclick=function(){
var cost=25+G.floor*2;if(G.gold<cost)return;
G.gold-=cost;G.hero.hp=pMaxHp();G.hero.poison=null;G.hero.burn=null;
sfx.potion();log('⚕️ Целитель шепчет заклинание, и раны тают на глазах. HP восстановлены!');
updateHUD();saveRun();openRest();
};
$('#rest-relic').onclick=function(){
var cost=relicCampCost();if(G.gold<cost)return;
var rel=dropRelic();if(!rel){log('🏺 Торговец разводит руками: реликвий больше нет.');return;}
G.gold-=cost;G.relicBuys=(G.relicBuys||0)+1;giveRelic(rel);
updateHUD();saveRun();openRest();
};
}

/* --- КРАФТ --- */
function openCraft(){
var el=$('#event-layer');
var recipesHtml=RECIPES.map(function(rec,idx){
var canCraft=true;
var matsStr=Object.keys(rec.mats).map(function(m){var have=G.materials[m]||0,need=rec.mats[m];if(have<need)canCraft=false;return'<span style="color:'+(have>=need?'#2a8a4a':'#c44')+'">'+m+' '+have+'/'+need+'</span>';}).join(' · ');
return'<div class="bag-item rar'+rec.rar+'"><b>'+rec.i+' '+rec.n+' <span class="rar-tag">'+RAR[rec.rar]+'</span></b><span>'+rec.desc+'</span><small>'+matsStr+'</small><div class="bag-actions"><button class="cbtn small grn" data-craft="'+idx+'" '+(!canCraft?'disabled':'')+'>⚒️ Создать</button></div></div>';
}).join('');
el.innerHTML='<div class="ev" style="max-width:720px"><h3 class="ev-title">⚒️ КРАФТ</h3><p style="font-size:13px;opacity:.8;margin-bottom:10px">Наковальня ждёт. Собери ингредиенты и выкуй предмет!</p><div class="bag-row" style="max-height:300px;overflow-y:auto">'+recipesHtml+'</div><button class="cbtn ghost" id="craft-back" style="margin-top:14px">← Назад</button></div>';
el.querySelectorAll('[data-craft]').forEach(function(b){
b.onclick=function(){
var rec=RECIPES[parseInt(this.dataset.craft,10)];
for(var m in rec.mats){if((G.materials[m]||0)<rec.mats[m]){log('Не хватает ингредиентов!');return;}}
for(var m2 in rec.mats){G.materials[m2]-=rec.mats[m2];}
var item={slot:rec.slot,i:rec.i,n:rec.n,rar:rec.rar,b:{},up:0,tier:0};
for(var b2 in rec.b)item.b[b2]=rec.b[b2];
giveItem(item);sfx.smith();log('⚒️ Молот звенит, искры летят — готово: '+rec.i+' '+rec.n+'!');
updateHUD();openCraft();
};
});
$('#craft-back').onclick=function(){openRest();};
}

/* --- КУЗНЕЦ (улучшение надетых) --- */
function itemLevel(it){return (it.tier||0)*3+(it.up||0);}
function upCost(it){var t=itemLevel(it);return Math.round((40+it.rar*40)+t*25);}
function upRow(it,key,where){
var c=upCost(it);var lvl=itemLevel(it);
var lvlTag=lvl>0?' <span class="up-tag">ур.'+lvl+'</span>':'';
return'<div class="bag-item rar'+it.rar+'"><b>'+it.i+' '+it.n+lvlTag+' <span class="rar-tag">'+RAR[it.rar]+'</span></b><span>'+bonusTxt(it)+'</span><small>'+where+' · уровень предмета: '+lvl+'</small><div class="bag-actions"><button class="cbtn small grn" data-up="'+key+'"'+((G.gold<c)?' disabled':'')+'>🔨 Улучшить до ур.'+(lvl+1)+' ('+c+'💰)</button></div></div>';
}
function openForge(){
var el=$('#event-layer'),h=G.hero;var rows='';
for(var sl in h.equip){var it=h.equip[sl];if(it)rows+=upRow(it,'eq:'+sl,SLOT_NAME[sl]||sl);}
el.innerHTML='<div class="ev" style="max-width:720px"><h3 class="ev-title">🔨 КУЗНЕЦ — УЛУЧШЕНИЕ</h3><p style="font-size:13px;opacity:.8;margin-bottom:10px">Кузнец обходит тебя: «Только то, что надето, — остальное неси в сумке». Каждое улучшение = +25% к бонусам. Золото: <b>'+G.gold+'</b>💰</p><div class="bag-row" style="max-height:300px;overflow-y:auto">'+(rows||'<p class="hint">Нет надетых предметов для улучшения.</p>')+'</div><button class="cbtn ghost" id="forge-back" style="margin-top:14px">← Уйти</button></div>';
el.querySelectorAll('[data-up]').forEach(function(b){
b.onclick=function(){
var key=this.dataset.up;if(key.indexOf('eq:')!==0)return;
var it=h.equip[key.slice(3)];if(!it)return;
var c=upCost(it);if(G.gold<c)return;
G.gold-=c;it.up=(it.up||0)+1;
if(it.up>=3){it.up=0;it.tier=(it.tier||0)+1;sfx.smith();log('🔨 Кузнец доволен: '+it.i+' '+it.n+' теперь «+'+it.tier+'»!');}
else{sfx.smith();log('🔨 '+it.i+' '+it.n+' → уровень '+itemLevel(it));}
updateHUD();saveRun();openForge();
};
});
$('#forge-back').onclick=function(){afterEvent();};
}

/* --- ФОНТАН --- */
function openFount(){
var el=$('#event-layer'),fishCost=fishingCost();
el.innerHTML='<div class="ev"><h3 class="ev-title">⛲ ФОНТАН</h3><div class="ev-anim anim-glow">⛲</div>'+
'<p>Старый фонтан всё ещё журчит прозрачной водой. На дне что-то поблёскивает.</p>'+
'<div class="ev-choices">'+
'<button class="cbtn grn" id="f-drink">💧 Напиться +30% HP</button>'+
'<button class="cbtn" id="f-bottle" style="background:var(--yel)">🧪 Наполнить флягу +1 зелье</button>'+
'<button class="cbtn red" id="f-dive">🏊 Нырнуть за блеском</button>'+
'<button class="cbtn blu" id="f-fish" '+(G.gold<fishCost?'disabled':'')+'>🎣 Рыбалка ('+fishCost+'💰)</button>'+
'</div></div>';
$('#f-drink').onclick=function(){healHero(.3);log('💧 Вода холодная и сладкая. Усталость смывает как рукой.');afterEvent();};
$('#f-bottle').onclick=function(){G.hero.pots++;sfx.potion();log('🧪 Ты наполняешь флягу живой водой.');afterEvent();};
$('#f-dive').onclick=function(){
if(Math.random()<.6){var g=ri(30,60)+G.floor*2;G.gold+=g;sfx.gold();log('🏊 Ты ныряешь и нащупываешь на дне золотой кубок! Отёр от ила. +'+g+'💰');}
else{var dm=ri(10,18)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('🏊 Ты ныряешь и со всей скорости врезаешься в скрытый камень! Грудь ноет. −'+dm+' HP');}
updateHUD();afterEvent();
};
$('#f-fish').onclick=function(){goFishing();};
}

/* --- АЛТАРЬ --- */
function openShrine(){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">🕯️ АЛТАРЬ</h3><div class="ev-anim anim-glow">🕯️</div>'+
'<p>Полуразрушенный алтарь. Свечи горят, хотя здесь никого нет.</p>'+
'<div class="ev-choices">'+
'<button class="cbtn" id="sh-pray" style="background:var(--yel)">🙏 Молиться</button>'+
'<button class="cbtn grn" id="sh-give" '+(G.gold<20?'disabled':'')+'>💰 Пожертвовать 20 золота</button>'+
'<button class="cbtn ghost" id="sh-leave">Уйти</button></div></div>';
$('#sh-pray').onclick=function(){
var r=Math.random();
if(r<.55){sfx.mystic();log('🙏 Ты преклоняешь колено. Тёплый свет окутывает тебя — боги благосклонны!');chooseCard().then(function(){afterEvent();});}
else if(r<.85){healHero(.15);log('🕯️ Алтарь тихо гудит. Раны затягиваются.');afterEvent();}
else{var dm=ri(8,14)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('🕯️ Алтарь вспыхивает чёрным пламенем и отбрасывает тебя! −'+dm+' HP');updateHUD();afterEvent();}
};
$('#sh-give').onclick=function(){G.gold-=20;log('💰 Ты кладёшь монеты. Чаши весов дрогнули...');chooseCard().then(function(){updateHUD();afterEvent();});};
$('#sh-leave').onclick=function(){log('Ты решаешь не тревожить древнее место.');afterEvent();};
}

/* --- ЛОВУШКА --- */
function openTrap(){
var dodgeChance=Math.min(.85,.4+G.hero.stats.agi*.04);
if(Math.random()<dodgeChance){sfx.click();log('🕸️ Ты замечаешь натянутую нить и аккуратно перешагиваешь. Ловушка щёлкает впустую.');}
else{var dm=ri(8,14)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);sfx.hurt();log('🕸️ Пол проваливается, и в тебя летят отравленные шипы! −'+dm+' HP');}
updateHUD();afterEvent();
}

/* --- ТАВЕРНА --- */
function openTavern(){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">🍺 ТАВЕРНА</h3><div class="ev-anim anim-glow">🍺</div>'+
'<p>За стойкой пахнет элем и жареным мясом. Хозяин кивает тебе как старому знакомцу.</p>'+
'<div class="ev-choices">'+
'<button class="cbtn grn" id="tv-drink" '+(G.gold<10?'disabled':'')+'>🍺 Эль 10💰 +25% HP</button>'+
'<button class="cbtn" id="tv-meal" '+(G.gold<25?'disabled':'')+'>🍖 Похлёбка 25💰 +50% HP</button>'+
'<button class="cbtn ghost" id="tv-leave">Уйти</button></div></div>';
$('#tv-drink').onclick=function(){G.gold-=10;healHero(.25);log('🍺 Ты залпом выпиваешь кружку эля. Тепло разливается по телу.');afterEvent();};
$('#tv-meal').onclick=function(){G.gold-=25;healHero(.5);log('🍖 Горячая похлёбка возвращает силы. За это можно и заплатить.');afterEvent();};
$('#tv-leave').onclick=function(){log('Ты киваешь хозяину и выходишь в ночь.');afterEvent();};
}

/* --- БИБЛИОТЕКА --- */
function openLibrary(){
var cost=30+G.floor,el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">📚 БИБЛИОТЕКА</h3><div class="ev-anim">📖</div>'+
'<p>Пыльные стеллажи уходят в темноту. Где-то капает вода.</p>'+
'<div class="ev-choices">'+
'<button class="cbtn" id="lib-read" '+(G.gold<cost?'disabled':'')+'>📖 Изучить фолиант +60 опыта ('+cost+'💰)</button>'+
'<button class="cbtn grn" id="lib-study" '+(G.gold<cost*2?'disabled':'')+'>🔮 Урок наставника +1 интеллект ('+(cost*2)+'💰)</button>'+
'<button class="cbtn ghost" id="lib-leave">Уйти</button></div></div>';
$('#lib-read').onclick=function(){G.gold-=cost;log('📖 Ты листаешь древний фолиант. Знания ложатся в душу.');gainXp(60).then(function(){updateHUD();afterEvent();});};
$('#lib-study').onclick=function(){G.gold-=cost*2;G.hero.stats.int++;sfx.mystic();log('🔮 Наставник объясняет тонкости магии. +1 интеллект');updateHUD();afterEvent();};
$('#lib-leave').onclick=function(){log('Ты тихо прикрываешь дверь библиотеки.');afterEvent();};
}

/* --- САНКТИЛИЙ --- */
function openSkillEvent(){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">📖 САНКТИЛИЙ</h3><div class="ev-anim anim-glow">📖</div>'+
'<p>Книга лежит на постаменте, и страницы перелистываются сами.</p>'+
'<div class="ev-choices"><button class="cbtn grn" id="sk-learn">📖 Изучить навык</button><button class="cbtn ghost" id="sk-leave">Уйти</button></div></div>';
$('#sk-learn').onclick=function(){var s=grantRandomSkill();if(s){showSkillLearned(s);}else{afterEvent();}};
$('#sk-leave').onclick=function(){log('Ты не рискуешь трогать живую книгу.');afterEvent();};
}
function showSkillLearned(s){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">📖 НОВЫЙ НАВЫК!</h3><div style="font-size:48px">'+s.icon+'</div><div class="loot"><div><b>Навык «'+s.name+'»</b></div><div style="font-size:14px">'+s.desc+'</div></div><button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';
saveRun();
$('#btn-next').onclick=function(){sfx.click();nextFloor();};
}

/* --- СПУТНИК --- */
function openCompanionEvent(){
var el=$('#event-layer'),opts=[COMPANIONS.knight,COMPANIONS.wolf,COMPANIONS.fairy_c],comp=pick(opts);
var scenarios={knight:'Под обломками ты находишь рыцаря. Он жив, но сам не выберется.',wolf:'Волк попал в капкан и скулит, глядя на тебя жёлтыми глазами.',fairy_c:'У дороги лежит раненая фея. Её крылья сломаны.'};
var key=comp===COMPANIONS.knight?'knight':comp===COMPANIONS.wolf?'wolf':'fairy_c';
el.innerHTML='<div class="ev"><h3 class="ev-title">🆘 НУЖНА ПОМОЩЬ</h3><div class="ev-anim anim-shake">'+comp.icon+'</div><p>'+scenarios[key]+'</p><div class="ev-choices"><button class="cbtn grn" id="comp-help">🤝 Помочь</button><button class="cbtn red" id="comp-rob">💰 Ограбить</button><button class="cbtn ghost" id="comp-ignore">Пройти мимо</button></div></div>';
$('#comp-help').onclick=function(){G.companion={name:comp.name,icon:comp.icon,atk:comp.atk,battlesLeft:comp.battles};sfx.mystic();log(comp.icon+' '+comp.name+' поднимается и встаёт рядом. Теперь вы — команда!');updateHUD();saveRun();afterEvent();};
$('#comp-rob').onclick=function(){
if(Math.random()<.5){var g=ri(30,60)+G.floor*2;G.gold+=g;sfx.gold();log('💰 Ты обыскиваешь несчастного. Кошелёк тяжёлый, но на душе скребут кошки. +'+g+'💰');}
else{var it=dropItem(0);giveItem(it);log('💰 Ты забираешь вещь у беспомощного. '+it.n+'.');}
G.companion=null;updateHUD();saveRun();afterEvent();
};
$('#comp-ignore').onclick=function(){log('Ты отводишь взгляд и идёшь дальше.');afterEvent();};
}

/* --- МАНЕКЕН --- */
function openDummy(){
var el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">🥊 МАНЕКЕН</h3><div class="ev-anim anim-shake">🥊</div>'+
'<p>Тренировочный манекен стоит, будто ждёт тебя.</p>'+
'<div class="ev-choices"><button class="cbtn" id="dm-atk" style="background:var(--yel)">⚔️ Отработать удар +2 атаки</button><button class="cbtn" id="dm-def" style="background:var(--yel)">🛡️ Отработать блок +2 защиты</button><button class="cbtn ghost" id="dm-leave">Уйти</button></div></div>';
$('#dm-atk').onclick=function(){G.hero.atk+=2;sfx.gold();log('⚔️ Ты отрабатываешь удары до хруста в плечах. Удар стал тяжелее. +2 атаки');afterEvent();};
$('#dm-def').onclick=function(){G.hero.def+=2;sfx.gold();log('🛡️ Ты учишься держать блок. Руки гудят, но щит теперь как влитой. +2 защиты');afterEvent();};
$('#dm-leave').onclick=function(){log('Ты оставляешь манекен в покое.');afterEvent();};
}

/* --- ПРОКЛЯТОЕ ЗОЛОТО --- */
function openCursed(){
var amt=ri(30,60)+G.floor*2,el=$('#event-layer');
el.innerHTML='<div class="ev"><h3 class="ev-title">💰 ПРОКЛЯТОЕ ЗОЛОТО</h3><div class="ev-anim anim-glow">💰</div>'+
'<p>Груда монет ('+amt+'💰) лежит в углу. От неё веет холодом, и шёпот царапает уши.</p>'+
'<div class="ev-choices"><button class="cbtn red" id="cg-take">💰 Взять (риск)</button><button class="cbtn ghost" id="cg-leave">Не трогать</button></div></div>';
$('#cg-take').onclick=function(){
if(Math.random()<.5){G.gold+=amt;sfx.gold();log('💰 Ты гребишь золото горстами. Оно почему-то ледяное, но своё есть своё. +'+amt+'💰');}
else{var dm=ri(8,14)+Math.floor(G.floor/2);G.hero.hp=Math.max(1,G.hero.hp-dm);G.gold+=Math.round(amt/2);sfx.hurt();log('💰 Проклятие вцепляется в руку! Кожа чернеет, и часть монет рассыпается прахом. −'+dm+' HP');}
updateHUD();afterEvent();
};
$('#cg-leave').onclick=function(){log('Ты решаешь не брать чужое проклятие.');afterEvent();};
}