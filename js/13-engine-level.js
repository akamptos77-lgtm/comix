'use strict';
/* ============================================
13-ENGINE-LEVEL: опыт, уровни, атрибуты,
благословения, финальный экран, статистика
+ защита от повторных кликов
============================================ */

function gainXp(n){
  var h = G.hero;

  if (!h) return Promise.resolve();

  h.xp += n;

  var chain = Promise.resolve();

  while (h.xp >= h.xpNeed) {
    h.xp -= h.xpNeed;
    h.level++;
    h.xpNeed = 50 + (h.level - 1) * 35;

    h.maxHp += 8;
    h.hp = Math.min(pMaxHp(), h.hp + 12);
    h.atk += 1;
    h.def += 1;
    h.spd += 1;
    h.crit += 1;

    sfx.level();
    updateHUD();

    (function(lvl){
      chain = chain.then(function(){
        return chooseAttr(lvl);
      });
    })(h.level);
  }

  saveRun();

  return chain;
}

function chooseAttr(lvl){
  return new Promise(function(res){
    var h = G.hero;

    var title = $('#attr-title');
    var row = $('#attr-row');

    if (!title || !row) {
      res();
      return;
    }

    var showLevel = lvl || h.level;

    title.innerHTML = 'Уровень <b>' + showLevel + '</b>! Выбери атрибут:';

    row.innerHTML = [
      {k:'str', i:'💪', n:'Сила', d:'+2 к атаке', v:h.stats.str},
      {k:'agi', i:'🏹', n:'Ловкость', d:'+3% крит, +уклонение', v:h.stats.agi},
      {k:'int', i:'🔮', n:'Интеллект', d:'+10% навык, +зелья', v:h.stats.int},
      {k:'vit', i:'❤️', n:'Живучесть', d:'+15 макс. HP', v:h.stats.vit}
    ].map(function(a){
      return (
        '<button class="attr-btn" data-k="' + a.k + '">' +
        '<b><span class="attr-ico">' + a.i + '</span>' + a.n + '</b>' +
        '<div class="av">сейчас: ' + a.v + '</div>' +
        '<small>' + a.d + '</small>' +
        '</button>'
      );
    }).join('');

    if (typeof openOvl === 'function') {
      openOvl('ovl-attrs');
    } else {
      res();
      return;
    }

    /* Защита от повторного выбора */
    var resolved = false;

    row.querySelectorAll('.attr-btn').forEach(function(b){
      b.onclick = function(){
        if (resolved) return;
        resolved = true;

        /* Блокируем все кнопки, чтобы нельзя было кликнуть ещё раз */
        row.querySelectorAll('.attr-btn').forEach(function(x){
          x.disabled = true;
        });

        var k = this.dataset.k;

        h.stats[k]++;

        if (k === 'vit') {
          h.hp = Math.min(pMaxHp(), h.hp + 15);
        }

        closeOvl('ovl-attrs');
        log('🆙 ' + k.toUpperCase() + ' = ' + h.stats[k]);

        saveRun();

        if (Math.random() < .15) {
          chooseCard().then(function(){
            updateHUD();
            res();
          });
        } else {
          updateHUD();
          res();
        }
      };
    });
  });
}

function chooseCard(){
  return new Promise(function(res){
    var h = G.hero;

    var pool = CARDS.filter(function(c){
      return !c.once || h.owned.indexOf(c.once) < 0;
    });

    var picks = [];

    while (picks.length < 3 && pool.length) {
      picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }

    var title = $('#cards-title');
    var row = $('#cards-row');

    if (!title || !row || !picks.length) {
      res();
      return;
    }

    title.innerHTML = 'Благословение! Выбери бонус:';

    row.innerHTML = picks.map(function(c, i){
      return (
        '<button class="fate-card" data-i="' + i + '">' +
        '<div class="fc-i">' + c.i + '</div>' +
        '<b>' + c.n + '</b>' +
        c.d +
        '</button>'
      );
    }).join('');

    if (typeof openOvl === 'function') {
      openOvl('ovl-cards');
    } else {
      res();
      return;
    }

    /* Защита от повторного выбора */
    var resolved = false;

    row.querySelectorAll('.fate-card').forEach(function(b){
      b.onclick = function(){
        if (resolved) return;
        resolved = true;

        /* Блокируем все карточки */
        row.querySelectorAll('.fate-card').forEach(function(x){
          x.disabled = true;
        });

        var c = picks[parseInt(this.dataset.i, 10)];

        c.f(h);

        if (c.once) {
          h.owned.push(c.once);
        }

        sfx.gold();
        closeOvl('ovl-cards');
        log('🎁 ' + c.n);
        updateHUD();

        saveRun();

        res();
      };
    });
  });
}

function calcScore(){
  var h = G.hero;

  if (!h) return 0;

  return (
    G.floor * 120 +
    G.kills * 15 +
    G.gold +
    (h.level - 1) * 60 +
    (G.winBonus ? 2000 : 0)
  );
}

/* === Статистика забега === */
function getRunTimeText(){
  if (!G.startTime) return '—';

  var ms = Date.now() - G.startTime;
  var totalSec = Math.floor(ms / 1000);

  var min = Math.floor(totalSec / 60);
  var sec = totalSec % 60;

  return min + 'м ' + sec + 'с';
}

function getMaterialsTotal(){
  var n = 0;

  if (!G.materials) return 0;

  for (var k in G.materials) {
    if (G.materials.hasOwnProperty(k)) {
      n += G.materials[k];
    }
  }

  return n;
}

function getQuestsDoneCount(){
  if (!G.quests) return 0;

  var n = 0;

  for (var i = 0; i < G.quests.length; i++) {
    if (G.quests[i].progress >= G.quests[i].need) {
      n++;
    }
  }

  return n;
}

function showEnd(win){
  G.phase = 'over';
  G.busy = false;

  var actions = $('#actions');
  if (actions) actions.classList.add('hidden');

  var elixirs = $('#elixirs');
  if (elixirs) elixirs.classList.add('hidden');

  var h = G.hero;
  if (!h) return;

  var s = calcScore();

  var emoji = $('#end-emoji');
  if (emoji) emoji.textContent = win ? '🏆' : '💀';

  var title = $('#end-title');
  if (title) {
    title.textContent = win
      ? 'ПОБЕДА! ПОЖИРАТЕЛЬ МИРОВ ПАЛ!'
      : 'ГЕРОЙ ПАЛ…';
  }

  var relicsCount = G.relics ? G.relics.length : 0;
  var chests = G.chestsOpened || 0;
  var materials = getMaterialsTotal();
  var questsDone = getQuestsDoneCount();
  var runTime = getRunTimeText();
  var cycles = G.cycle || 0;

  var stats = $('#end-stats');
  if (stats) {
    stats.innerHTML =
      '<div>🏰 Этаж<br><b>' + G.floor + '</b></div>' +
      '<div>💀 Побед<br><b>' + G.kills + '</b></div>' +
      '<div>💰 Золото<br><b>' + G.gold + '</b></div>' +
      '<div>⭐ Уровень<br><b>' + h.level + '</b></div>' +
      '<div>⏱ Время<br><b>' + runTime + '</b></div>' +
      '<div>♾ Цикл<br><b>' + cycles + '</b></div>' +
      '<div>🎁 Сундуки<br><b>' + chests + '</b></div>' +
      '<div>🔮 Ингредименты<br><b>' + materials + '</b></div>' +
      '<div>🏺 Реликвии<br><b>' + relicsCount + '</b></div>' +
      '<div>📜 Квесты<br><b>' + questsDone + '</b></div>' +
      '<div class="big">ОЧКИ: ' + s + '</div>';
  }

  var inp = $('#end-inp');
  if (inp) inp.value = getUser();

  var saveBtn = $('#end-save');
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.textContent = '🏆 В рейтинг!';
  }

  openOvl('ovl-end');

  clearRun();
}

function startRun(k){
  var c = CLASSES[k];

  G.lastClass = k;
  G.phase = 'doors';

  /* Сброс зависшего состояния */
  G.busy = false;

  G.hero = {
    cls: k,
    name: c.name,
    icon: c.icon,
    hp: c.hp,
    maxHp: c.hp,
    atk: c.atk,
    def: c.def,
    spd: c.spd,
    crit: c.crit,

    stats: {
      str: c.stats.str,
      agi: c.stats.agi,
      int: c.stats.int,
      vit: c.stats.vit
    },

    equip: {
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      gloves: null,
      ring1: null,
      ring2: null,
      amulet: null
    },

    inv: [],
    elixirs: [],
    elixirCap: 3,

    buffs: {
      atk: 0,
      def: 0,
      dodge: 0,
      rage: 0,
      crit: 0
    },

    shield: false,
    skills: [],
    activeSkill: null,
    skill2Cd: 0,

    pots: DIFF[G.diff].pots,
    level: 1,
    xp: 0,
    xpNeed: 50,
    skillCd: 0,
    skillCdMax: c.skill.cd,
    skillName: c.skill.name,

    defending: false,
    vamp: 0,
    thorns: 0,
    poison: null,
    burn: null,
    dead: false,

    fx: {
      lunge: 0,
      hurt: 0,
      death: 1
    },

    owned: [],
    shopMult: 1,
    dodgePenalty: 0,
    holyWeak: false
  };

  G.floor = 1;
  G.gold = 25;
  G.kills = 0;
  G.won = false;
  G.winBonus = false;

  G.enemy = null;
  G.doors = null;
  G.companion = null;
  G.materials = {};
  G.chestsOpened = 0;
  G.shopGoods = null;

  G.cycle = 0;
  G.relics = [];
  G.relicBuys = 0;
  G.pendingQuests = [];
  G.round = 0;
  G.logArr = [];
  G.phoenixCd = 0;

  G.startTime = Date.now();

  G.quests = QUESTS.map(function(q){
    return {
      id: q.id,
      name: q.name,
      desc: q.desc,
      target: q.target,
      need: q.need,
      rewards: q.rewards,
      progress: 0
    };
  });

  show('scr-game');
  buildActions();
  updateHUD();
  renderDoors();

  log('Добро пожаловать в ' + getBiome(1).name + '!');

  saveRun();
}