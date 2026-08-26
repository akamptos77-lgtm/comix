'use strict';
/* ============================================
21-UI-PANELS: бестиарий, лист персонажа,
книга навыков, обучение, выбор героя
============================================ */

function panelEscape(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c];
  });
}

function panelSkillDamage(pow, hits){
  if (typeof skillDmgPreview === 'function') {
    return skillDmgPreview(pow, hits);
  }

  return Math.round(getHeroAtk() * (pow || 1) * (hits || 1) * pSkillPow());
}

/* ============================================
БЕСТИАРИЙ
============================================ */
function renderBestiary(){
  var b = getBestiary();
  var cards = getCards();

  var cnt = Object.keys(b).length;
  var cardCnt = Object.keys(cards).filter(function(id){
    return cards[id] > 0;
  }).length;

  var total = ALL_MONSTERS.length;

  var bp = $('#best-prog');
  if (bp) bp.textContent = cnt + '/' + total;

  var bc = $('#best-count');
  if (bc) bc.textContent = cnt + '/' + total;

  var list = $('#best-list');
  if (!list) return;

  var cardsDoneFlag = cardsDone();

  var header =
    '<div style="grid-column:1/-1;text-align:center;margin-bottom:8px">' +
    '<p style="font-size:14px">🃏 Карточки монстров: <b>' + cardCnt + '/' + total + '</b>' +
    (cardsDoneFlag ? ' <span style="color:#2a8a4a">✅ Коллекция собрана! +5% крит, +5% уворот</span>' : '') +
    '</p>' +
    '</div>';

  list.innerHTML = header + ALL_MONSTERS.map(function(m){
    var seen = b[m.id];
    var kills = cards[m.id] || 0;

    if (!seen) {
      return (
        '<div class="best-card locked">' +
        '<div class="bi">❓</div>' +
        '<b>???</b>' +
        '<p>Сразись с этим врагом...</p>' +
        '</div>'
      );
    }

    return (
      '<div class="best-card">' +
      '<div class="bi">' + getMonsterIcon(m.id) + '</div>' +
      '<b>' + panelEscape(m.name) + '</b>' +
      elemLabel(m.el) +
      '<div style="margin-top:4px">' +
      (m.weak
        ? '<span class="elem" style="background:#3ecf6f;color:#171022">слабость: ' +
          ELEMENTS[m.weak].icon + ' ' + ELEMENTS[m.weak].name +
          '</span>'
        : '') +
      (m.resist
        ? '<span class="elem" style="background:#ff8b94;color:#171022">устойчив: ' +
          ELEMENTS[m.resist].icon + ' ' + ELEMENTS[m.resist].name +
          '</span>'
        : '') +
      '</div>' +
      '<p>' + panelEscape(m.desc) + '</p>' +
      '<p style="font-size:10px;opacity:.6">🃏 Побед: ' + kills + '</p>' +
      '</div>'
    );
  }).join('');
}

/* ============================================
ЛИСТ ПЕРСОНАЖА
============================================ */
function renderSheet(){
  var h = G.hero;
  if (!h) return;

  var el = $('#sheet-content');
  if (!el) return;

  var stat = function(tip, label, val){
    return (
      '<div class="sheet-stat" data-tip="' + panelEscape(tip) + '">' +
      '<span>' + label + '</span>' +
      '<b>' + val + '</b>' +
      '</div>'
    );
  };

  var relicsHtml = '';

  if (G.relics && G.relics.length) {
    relicsHtml =
      '<div class="sheet-sec">' +
      '<h3>🏺 РЕЛИКВИИ (' + G.relics.length + ')</h3>' +
      G.relics.map(function(rid){
        var rel = null;

        for (var i = 0; i < RELICS.length; i++) {
          if (RELICS[i].id === rid) {
            rel = RELICS[i];
            break;
          }
        }

        if (!rel) return '';

        return (
          '<div class="relic-chip" data-tip="' + panelEscape(rel.d) + '">' +
          rel.i + ' ' + panelEscape(rel.n) +
          '</div>'
        );
      }).join('') +
      '</div>';
  }

  var equipSlots = ['weapon', 'armor', 'helmet', 'boots', 'gloves', 'ring1', 'ring2', 'amulet'];

  var equipHtml = equipSlots.map(function(sl){
    var it = h.equip[sl];

    var tip = it
      ? it.n + ': ' + bonusTxt(it) + (it.cursed ? '. ПРОКЛЯТО: ' + it.curse : '')
      : SLOT_NAME[sl] + ': пусто';

    var val = it
      ? it.i + ' ' + it.n + (it.up ? ' +' + it.up : '')
      : '—';

    return stat(tip, SLOT_NAME[sl], val);
  }).join('');

  var questsHtml = '—';

  if (G.quests && G.quests.length) {
    questsHtml = G.quests.map(function(q){
      var done = q.progress >= q.need;
      return stat(q.desc, q.name, q.progress + '/' + q.need + (done ? ' ✅' : ''));
    }).join('');
  }

  el.innerHTML =
    '<div class="sheet-grid">' +

    '<div class="sheet-sec">' +
    '<h3>📊 ХАРАКТЕРИСТИКИ</h3>' +
    stat('Текущее и максимальное здоровье. Если упадёт до 0 — герой падает.', '❤️ HP', Math.round(h.hp) + '/' + pMaxHp()) +
    stat('Базовый урон героя. Складывается из силы, оружия и баффов.', '⚔️ Атака', pAtk()) +
    stat('Уменьшает входящий урон от врагов.', '🛡️ Защита', pDef()) +
    stat('Шанс нанести критический удар. Крит увеличивает урон.', '🎯 Крит', pCrit() + '%') +
    stat('Шанс полностью уклониться от удара врага.', '💨 Уклонение', pDodge() + '%') +
    stat('Лечит процент от нанесённого урона.', '🩸 Вампиризм', Math.round(pVamp() * 100) + '%') +
    stat('Влияет на шанс побега и уклонение.', '👟 Скорость', h.spd) +
    stat('Общий уровень героя. Повышается за опыт.', '⭐ Уровень', h.level) +
    stat('Опыт до следующего уровня.', '✨ Опыт', h.xp + '/' + h.xpNeed) +
    '</div>' +

    '<div class="sheet-sec">' +
    '<h3>💪 АТРИБУТЫ</h3>' +
    stat('+2 к атаке за единицу. Повышает урон всех ударов и навыков.', '💪 Сила', h.stats.str) +
    stat('+3% крит и +2% уклонение за единицу.', '🏹 Ловкость', h.stats.agi) +
    stat('+10% к урону навыков и +5% к лечению зелий за единицу.', '🔮 Интеллект', h.stats.int) +
    stat('+15 макс. HP за единицу.', '❤️ Живучесть', h.stats.vit) +
    '</div>' +

    '<div class="sheet-sec">' +
    '<h3>🎽 ЭКИПИРОВКА</h3>' +
    equipHtml +
    '</div>' +

    relicsHtml +

    '<div class="sheet-sec">' +
    '<h3>📜 КВЕСТЫ</h3>' +
    questsHtml +
    '</div>' +

    '</div>';
}

/* ============================================
КНИГА НАВЫКОВ
============================================ */
function renderSkillBook(){
  var h = G.hero;
  if (!h) return;

  var book = SKILL_BOOKS[h.cls];
  var base = CLASSES[h.cls].skill;

  var baseSkillEl = $('#base-skill');
  var skillListEl = $('#skill-list');

  if (!baseSkillEl || !skillListEl) return;

  var baseDmg = base.pow ? panelSkillDamage(base.pow, base.hits) : 0;
  var baseTip = base.name + ': ' + base.desc + (base.pow ? ' · Урон: ~' + baseDmg : '');

  baseSkillEl.innerHTML =
    '<div class="fate-card" style="cursor:default;background:#fff3b8" data-tip="' + panelEscape(baseTip) + '">' +
    '<div class="fc-i">' + h.icon + '</div>' +
    '<b>' + panelEscape(base.name) + '</b>' +
    panelEscape(base.desc) +
    (base.pow ? '<br><small>Урон: ~' + baseDmg + '</small>' : '') +
    '<br><small>КД: ' + base.cd + '</small>' +
    '</div>';

  var unlocked = h.skills;

  skillListEl.innerHTML = unlocked.length
    ? unlocked.map(function(id){
        var s = null;

        for (var i = 0; i < book.length; i++) {
          if (book[i].id === id) {
            s = book[i];
            break;
          }
        }

        if (!s) return '';

        var active = h.activeSkill === id;

        var tip = s.name + ': ' + s.desc;

        if (s.pow) {
          tip += ' · Урон: ~' + panelSkillDamage(s.pow, s.hits);
        }

        if (s.heal) {
          tip += ' · Лечение: +' + Math.round(pMaxHp() * s.heal) + ' HP';
        }

        var dmgLine = '';

        if (s.pow) {
          dmgLine = '<br><small>Урон: ~' + panelSkillDamage(s.pow, s.hits) + '</small>';
        } else if (s.heal) {
          dmgLine = '<br><small>Лечение: +' + Math.round(pMaxHp() * s.heal) + ' HP</small>';
        }

        return (
          '<button class="fate-card" data-sk="' + id + '" data-tip="' + panelEscape(tip) + '" style="' +
          (active ? 'background:#d8f0d8;border-color:#2a8a4a' : '') +
          '">' +
          '<div class="fc-i">' + s.icon + '</div>' +
          '<b>' + panelEscape(s.name) + '</b>' +
          panelEscape(s.desc) +
          dmgLine +
          '<br>' +
          '<small>КД: ' + s.cd +
          (s.el ? ' ' + elemLabel(s.el) : '') +
          (active ? ' · ✔' : '') +
          '</small>' +
          '</button>'
        );
      }).join('')
    : '<p class="hint">Навыки не изучены. Ищи их в 📖 Санктилиях и у боссов!</p>';

  skillListEl.querySelectorAll('[data-sk]').forEach(function(b){
    b.onclick = function(){
      h.activeSkill = this.dataset.sk;

      var s = null;

      for (var i = 0; i < book.length; i++) {
        if (book[i].id === h.activeSkill) {
          s = book[i];
          break;
        }
      }

      if (s && typeof log === 'function') {
        log('Выбран навык: ' + s.icon + ' «' + s.name + '»');
      }

      if (typeof sfx !== 'undefined' && sfx.click) {
        sfx.click();
      }

      renderSkillBook();

      if (typeof updateHUD === 'function') updateHUD();
      if (typeof updateActions === 'function') updateActions();
    };
  });
}

/* ============================================
ОБУЧЕНИЕ
============================================ */
function showTutorial(){
  tutStep = 0;
  renderTut();

  if (typeof openOvl === 'function') {
    openOvl('ovl-tutorial');
  }
}

function renderTut(){
  var s = TUTORIAL[tutStep];
  if (!s) return;

  var title = $('#tut-title');
  var ico = $('#tut-ico');
  var text = $('#tut-text');
  var prev = $('#tut-prev');
  var next = $('#tut-next');

  if (title) title.textContent = s.t;
  if (ico) ico.textContent = s.ico;
  if (text) text.innerHTML = s.x;

  if (prev) prev.disabled = tutStep === 0;

  if (next) {
    next.textContent = tutStep === TUTORIAL.length - 1 ? 'Начать! →' : 'Далее →';
  }
}

/* ============================================
ВЫБОР ГЕРОЯ
============================================ */
function renderHeroCards(){
  var el = $('#hero-cards');
  if (!el) return;

  el.innerHTML = Object.keys(CLASSES).map(function(k){
    var c = CLASSES[k];

    return (
      '<button class="panel hero-card" data-k="' + k + '">' +
      '<div class="hc-ico">' + c.icon + '</div>' +
      '<h3>' + panelEscape(c.name) + '</h3>' +
      '<p class="hc-desc">' + panelEscape(c.desc) + '</p>' +
      '<div class="hc-stats">' +
      '<span>❤️' + c.hp + '</span>' +
      '<span>⚔️' + c.atk + '</span>' +
      '<span>🛡' + c.def + '</span>' +
      '<span>🎯' + c.crit + '%</span>' +
      '</div>' +
      '<div class="hc-stats">' +
      '<span>💪' + c.stats.str + '</span>' +
      '<span>🏹' + c.stats.agi + '</span>' +
      '<span>🔮' + c.stats.int + '</span>' +
      '<span>❤️' + c.stats.vit + '</span>' +
      '</div>' +
      '<div class="hc-skill">' +
      '✨ <b>' + panelEscape(c.skill.name) + '</b><br>' +
      panelEscape(c.skill.desc) +
      '</div>' +
      '</button>'
    );
  }).join('');

  el.querySelectorAll('.hero-card').forEach(function(b){
    b.onclick = function(){
      if (typeof sfx !== 'undefined' && sfx.click) {
        sfx.click();
      }

      startRun(this.dataset.k);
    };
  });
}