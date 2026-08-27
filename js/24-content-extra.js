'use strict';
/* ============================================
24-CONTENT-EXTRA:
- Перекрёсток (выбор событий)
- Испытание Пустоты: трейды с риском,
  без бесплатного ухода, навыки Пустоты
  выбираются и добавляются в книгу навыков
============================================ */

/* ============================================
НАВЫКИ ПУСТОТЫ
(умеренные, добавляются в книгу навыков)
============================================ */
var VOID_SKILLS = [
  {
    id:'v_rift',
    name:'Разлом',
    icon:'🌀',
    desc:'180% урона тьмой, игнор брони',
    cd:5,
    el:'dark',
    pow:1.8,
    run:function(h,e){
      return heroStrike(1.8,{ignoreDef:true,word:'РАЗЛОМ!',big:true,el:'dark'});
    }
  },
  {
    id:'v_drain',
    name:'Поглощение',
    icon:'🩸',
    desc:'130% урона тьмой + лечение 20%',
    cd:4,
    el:'dark',
    pow:1.3,
    heal:0.20,
    run:function(h,e){
      return heroStrike(1.3,{word:'ПОГЛОЩЕНИЕ!',el:'dark'}).then(function(){ healHero(.20); });
    }
  },
  {
    id:'v_veil',
    name:'Покров тьмы',
    icon:'🌑',
    desc:'+25% уклонения на 2 хода',
    cd:4,
    run:function(h,e){
      buffHero('dodge',2);
      return Promise.resolve();
    }
  }
];

/* ============================================
ТРЕЙДЫ ПУСТОТЫ
Каждый даёт выгоду ценой чего-то важного.
Значения умеренные, чтобы не ломать баланс.
============================================ */
var VOID_TRIALS = [
  {
    icon:'💪',
    n:'Кровь за мощь',
    d:'−20% макс. HP, +8 атаки',
    f:function(h){
      h.maxHp = Math.max(1, Math.round(h.maxHp * 0.8));
      h.hp = Math.min(h.hp, h.maxHp);
      h.atk += 8;
    }
  },
  {
    icon:'🎯',
    n:'Пустотные рефлексы',
    d:'−8% уклонения, +8% крит',
    f:function(h){
      h.dodgePenalty = (h.dodgePenalty || 0) + 8;
      h.crit += 8;
    }
  },
  {
    icon:'🏺',
    n:'Теневой контракт',
    d:'Потерять половину золота, +1 реликвия',
    f:function(h){
      G.gold = Math.floor(G.gold / 2);
      var r = dropRelic();
      if (r) giveRelic(r);
      else G.gold += 50;
    }
  },
  {
    icon:'🌀',
    n:'Знание Пустоты',
    d:'−15% макс. HP, изучить навык Пустоты',
    f:function(h){
      h.maxHp = Math.max(1, Math.round(h.maxHp * 0.85));
      h.hp = Math.min(h.hp, h.maxHp);
      grantVoidSkill();
      return 'voidSkill';
    }
  },
  {
    icon:'🔥',
    n:'Пепел силы',
    d:'−2 ко всем атрибутам, +10 атаки',
    f:function(h){
      h.stats.str = Math.max(0, h.stats.str - 2);
      h.stats.agi = Math.max(0, h.stats.agi - 2);
      h.stats.int = Math.max(0, h.stats.int - 2);
      h.stats.vit = Math.max(0, h.stats.vit - 2);
      h.atk += 10;
    }
  },
  {
    icon:'📉',
    n:'Жертва опыта',
    d:'−1 уровень, +1 ко всем атрибутам',
    f:function(h){
      if (h.level > 1) {
        h.level--;
        h.xpNeed = 50 + (h.level - 1) * 35;
        h.xp = Math.min(h.xp, h.xpNeed - 1);
      }
      h.stats.str += 1;
      h.stats.agi += 1;
      h.stats.int += 1;
      h.stats.vit += 1;
    }
  }
];

/* ============================================
Перекрёсток (без изменений)
============================================ */
(function(){

  if (typeof DOOR_RESULT_LABEL !== 'undefined') {
    DOOR_RESULT_LABEL.crossroads = '🤔 Перекрёсток!';
    DOOR_RESULT_LABEL.trial = '🌌 Испытание Пустоты!';
  }

  var oldMakeDoors = (typeof makeDoors === 'function') ? makeDoors : null;

  if (oldMakeDoors) {
    window.makeDoors = function(){
      var doors = oldMakeDoors();

      if (!G || typeof G.floor !== 'number') return doors;
      if (G.floor % 10 === 0 || G.floor === 100) return doors;

      if (Math.random() < 0.12) {
        doors.push({type:'crossroads', hint:'🚪 Тропа раздваивается...', ico:'🤔', revealed:null});
      }

      if ((G.cycle || 0) > 0 && Math.random() < 0.18) {
        doors.push({type:'trial', hint:'❓ Пустота шепчет...', ico:'🌌', revealed:null});
      }

      return doors;
    };
  }

  var oldOpenDoor = (typeof openDoor === 'function') ? openDoor : null;

  if (oldOpenDoor) {
    window.openDoor = function(i){
      var d = G.doors && G.doors[i];

      if (d && d.type === 'crossroads') { handleExtraDoor(d, '🤔', openCrossroads); return; }
      if (d && d.type === 'trial')      { handleExtraDoor(d, '🌌', openTrial);      return; }

      return oldOpenDoor(i);
    };
  }

  function handleExtraDoor(d, icon, fn){
    var idx = G.doors.indexOf(d);

    d.revealed = icon;
    d.selected = true;

    G.doors.forEach(function(x, j){
      if (j !== idx && !x.revealed) x.revealed = '🚪';
    });

    if (typeof renderDoors === 'function') renderDoors();

    var label = (typeof DOOR_RESULT_LABEL !== 'undefined' && DOOR_RESULT_LABEL[d.type])
      ? DOOR_RESULT_LABEL[d.type]
      : d.type;

    if (typeof log === 'function') log('Дверь распахнулась: ' + label);

    if (typeof sleep === 'function') sleep(450).then(fn);
    else fn();
  }

  function finishExtraEvent(){
    if (typeof afterEvent === 'function') afterEvent();
    else if (typeof nextFloor === 'function') nextFloor();
  }

  /* === ПЕРЕКРЁСТОК === */
  function openCrossroads(){
    var el = $('#event-layer');
    if (!el) return;

    el.innerHTML =
      '<div class="ev"><h3 class="ev-title">🤔 ПЕРЕКРЁСТОК</h3>' +
      '<div class="ev-anim">🤔</div>' +
      '<p>Дороги расходятся. Каждая сулит своё.</p>' +
      '<div class="ev-choices" style="flex-direction:column;gap:8px">' +
      '<button class="cbtn red" id="cr-fight">⚔️ Сразиться с элитой (лучше лут)</button>' +
      '<button class="cbtn" id="cr-search" style="background:var(--yel)">🔍 Обыскать окрестности</button>' +
      '<button class="cbtn blu" id="cr-risk">🎁 Рискнуть со странным сундуком</button>' +
      '<button class="cbtn ghost" id="cr-leave">🚪 Пройти мимо</button>' +
      '</div></div>';

    $('#cr-fight').onclick = function(){
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
      startCombat('elite', false);
    };

    $('#cr-search').onclick = function(){
      if (Math.random() < 0.75) {
        var g = ri(20, 40) + G.floor * 2;
        G.gold += g;
        if (typeof sfx !== 'undefined' && sfx.gold) sfx.gold();
        log('🔍 Найдено ' + g + '💰!');
      } else {
        var dm = ri(6, 12) + Math.floor(G.floor / 2);
        G.hero.hp = Math.max(1, G.hero.hp - dm);
        if (typeof sfx !== 'undefined' && sfx.hurt) sfx.hurt();
        log('🕸️ Ловушка! −' + dm + ' HP');
      }
      updateHUD();
      saveRun();
      finishExtraEvent();
    };

    $('#cr-risk').onclick = function(){
      var r = Math.random();

      if (r < 0.3) {
        var rel = (typeof dropRelic === 'function') ? dropRelic() : null;
        if (rel && typeof giveRelic === 'function' && giveRelic(rel)) {
          log('🎁 Сундук хранит реликвию!');
        } else {
          G.gold += 100;
          log('🎁 Реликвий нет, но найдено 100💰!');
        }
        if (typeof sfx !== 'undefined' && sfx.mystic) sfx.mystic();
      } else if (r < 0.55) {
        var it = (typeof dropItem === 'function') ? dropItem(1) : null;
        if (it && typeof giveItem === 'function' && giveItem(it)) {
          log('🎁 В сундуке предмет!');
        } else {
          G.gold += 80;
        }
        if (typeof sfx !== 'undefined' && sfx.gold) sfx.gold();
      } else if (r < 0.8) {
        var g2 = ri(50, 90) + G.floor * 2;
        G.gold += g2;
        if (typeof sfx !== 'undefined' && sfx.gold) sfx.gold();
        log('🎁 Сундук полон золота: +' + g2 + '💰!');
      } else {
        var dm2 = ri(10, 18) + Math.floor(G.floor / 2);
        G.hero.hp = Math.max(1, G.hero.hp - dm2);
        if (typeof sfx !== 'undefined' && sfx.hurt) sfx.hurt();
        log('💥 Сундук оказался ловушкой! −' + dm2 + ' HP');
      }

      updateHUD();
      saveRun();
      finishExtraEvent();
    };

    $('#cr-leave').onclick = function(){
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
      finishExtraEvent();
    };
  }

  /* ============================================
  ИСПЫТАНИЕ ПУСТОТЫ
  - 3 случайных трейда
  - нельзя уйти бесплатно
  - навыки Пустоты выбираются отдельно
  ============================================ */
  function openTrial(){
    var el = $('#event-layer');
    if (!el) return;

    var picks = pickTrials(3);

    var buttonsHtml = picks.map(function(tr, i){
      return (
        '<button class="cbtn" data-trial="' + i + '" ' +
        'style="background:var(--ink);color:var(--yel);border-color:#8a1eff;text-align:left;min-height:70px">' +
        '<b>' + tr.icon + ' ' + tr.n + '</b><br>' +
        '<small style="opacity:.9;font-weight:400">' + tr.d + '</small>' +
        '</button>'
      );
    }).join('');

    el.innerHTML =
      '<div class="ev"><h3 class="ev-title">🌌 ИСПЫТАНИЕ ПУСТОТЫ</h3>' +
      '<div class="ev-anim anim-glow">🌌</div>' +
      '<p>Пустота не даёт ничего даром. Выбери цену.</p>' +
      '<div class="ev-choices" style="flex-direction:column;gap:10px">' +
      buttonsHtml +
      '<button class="cbtn ghost" id="tr-refuse" style="margin-top:12px">🚪 Отказаться (−15% макс. HP)</button>' +
      '</div></div>';

    el.querySelectorAll('[data-trial]').forEach(function(b){
      b.onclick = function(){
        var tr = picks[parseInt(this.dataset.trial, 10)];
        applyTrial(tr);
      };
    });

    $('#tr-refuse').onclick = function(){
      var h = G.hero;
      h.maxHp = Math.max(1, Math.round(h.maxHp * 0.85));
      h.hp = Math.min(h.hp, h.maxHp);
      log('🌌 Ты отказался. Пустота забрала часть твоей жизни.');
      if (typeof sfx !== 'undefined' && sfx.hurt) sfx.hurt();
      updateHUD();
      saveRun();
      finishExtraEvent();
    };
  }

  function pickTrials(n){
    var pool = VOID_TRIALS.slice();
    var out = [];
    while (out.length < n && pool.length) {
      out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return out;
  }

  function applyTrial(tr){
    var h = G.hero;
    var res = tr.f(h);

    if (res === 'voidSkill') {
      updateHUD();
      saveRun();
      return;
    }

    log('🌌 ' + tr.n + ': ' + tr.d);
    if (typeof sfx !== 'undefined' && sfx.mystic) sfx.mystic();
    updateHUD();
    saveRun();
    finishExtraEvent();
  }

  /* === Выбор навыка Пустоты === */
  function grantVoidSkill(){
    var h = G.hero;

    var available = VOID_SKILLS.filter(function(s){
      return h.skills.indexOf(s.id) < 0;
    });

    if (!available.length) {
      G.gold += 200;
      log('Все навыки Пустоты уже изучены. +200 золота.');
      updateHUD();
      saveRun();
      finishExtraEvent();
      return;
    }

    showVoidSkillChoice(available);
  }

  function showVoidSkillChoice(list){
    var el = $('#event-layer');
    if (!el) return;

    var html = list.map(function(s, i){
      return (
        '<button class="cbtn" data-vskill="' + i + '" ' +
        'style="background:var(--ink);color:var(--yel);border-color:#8a1eff;text-align:left;min-height:80px">' +
        '<div style="font-size:28px;text-align:center">' + s.icon + '</div>' +
        '<b style="display:block;text-align:center">' + s.name + '</b>' +
        '<small style="display:block;text-align:center;opacity:.9;font-weight:400">' + s.desc + '</small>' +
        '<small style="display:block;text-align:center;opacity:.7;margin-top:4px">КД: ' + s.cd + '</small>' +
        '</button>'
      );
    }).join('');

    el.innerHTML =
      '<div class="ev"><h3 class="ev-title">🌌 ВЫБЕРИ НАВЫК ПУСТОТЫ</h3>' +
      '<p>Навык будет добавлен в книгу навыков. В бою используй кнопку <b>3</b>.</p>' +
      '<div class="ev-choices" style="flex-direction:column;gap:10px">' +
      html +
      '</div></div>';

    el.querySelectorAll('[data-vskill]').forEach(function(b){
      b.onclick = function(){
        var s = list[parseInt(this.dataset.vskill, 10)];
        addVoidSkill(s);
      };
    });
  }

  function addVoidSkill(sk){
    var h = G.hero;
    var book = SKILL_BOOKS[h.cls];

    var exists = false;
    for (var i = 0; i < book.length; i++) {
      if (book[i].id === sk.id) { exists = true; break; }
    }
    if (!exists) book.push(sk);

    if (h.skills.indexOf(sk.id) < 0) h.skills.push(sk.id);

    h.activeSkill = sk.id;
    h.skill2Cd = 0;

    log('🌌 Навык Пустоты изучен: ' + sk.icon + ' ' + sk.name + '. Используй кнопку 3 в бою!');
    if (typeof sfx !== 'undefined' && sfx.mystic) sfx.mystic();

    updateHUD();
    saveRun();
    finishExtraEvent();
  }

  /* Восстановление навыков Пустоты после перезагрузки */
  function restoreVoidSkills(){
    var h = G.hero;
    if (!h) return;

    var book = SKILL_BOOKS[h.cls];
    if (!book) return;

    VOID_SKILLS.forEach(function(sk){
      if (h.skills.indexOf(sk.id) >= 0) {
        var exists = false;
        for (var i = 0; i < book.length; i++) {
          if (book[i].id === sk.id) { exists = true; break; }
        }
        if (!exists) book.push(sk);
      }
    });
  }

  var _loadRun24 = window.loadRun;
  if (typeof _loadRun24 === 'function') {
    window.loadRun = function(){
      var r = _loadRun24();
      restoreVoidSkills();
      return r;
    };
  }

  /* Отладочная команда */
  window.spawnExtraDoor = function(type){
    if (!G) return;

    if (G.phase !== 'doors') {
      if (typeof log === 'function') log('Используй spawnExtraDoor на экране дверей.');
      return;
    }

    if (!G.doors) G.doors = (typeof makeDoors === 'function') ? makeDoors() : [];

    G.doors.push({
      type: type || 'crossroads',
      hint: '❓ Тестовая дверь',
      ico: '🤔',
      revealed: null
    });

    if (typeof renderDoors === 'function') renderDoors();
  };

})();