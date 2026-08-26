'use strict';
/* 21-UI-PANELS: бестиарий, лист, навыки, туториал, выбор героя */

/* === БЕСТИАРИЙ (+ КАРТОЧКИ МОНСТРОВ) === */
function renderBestiary(){
  var b = getBestiary();
  var cards = getCards();
  var cnt = Object.keys(b).length;
  var cardCnt = Object.keys(cards).filter(function(id){ return cards[id] > 0; }).length;
  var total = ALL_MONSTERS.length;
  var bp = $('#best-prog'); if(bp) bp.textContent = cnt + '/' + total;
  var bc = $('#best-count'); if(bc) bc.textContent = cnt + '/' + total;
  var list = $('#best-list');
  if(!list) return;
  var cardsDoneFlag = cardsDone();
  var header = '<div style="grid-column:1/-1;text-align:center;margin-bottom:8px">' +
    '<p style="font-size:14px">🃏 Карточки монстров: <b>' + cardCnt + '/' + total + '</b>' +
    (cardsDoneFlag ? ' <span style="color:#2a8a4a">✅ Коллекция собрана! +5% крит, +5% уворот</span>' : '') +
    '</p></div>';
  list.innerHTML = header + ALL_MONSTERS.map(function(m){
    var seen = b[m.id];
    var kills = cards[m.id] || 0;
    if(!seen){
      return '<div class="best-card locked"><div class="bi">❓</div>' +
        '<b>???</b><p>Сразись с этим врагом...</p></div>';
    }
    return '<div class="best-card"><div class="bi">' + getMonsterIcon(m.id) + '</div>' +
      '<b>' + m.name + '</b>' + elemLabel(m.el) +
      '<div style="margin-top:4px">' +
      (m.weak ? '<span class="elem" style="background:#3ecf6f;color:#171022">слабость: ' +
        ELEMENTS[m.weak].icon + ' ' + ELEMENTS[m.weak].name + '</span>' : '') +
      (m.resist ? '<span class="elem" style="background:#ff8b94;color:#171022">устойчив: ' +
        ELEMENTS[m.resist].icon + ' ' + ELEMENTS[m.resist].name + '</span>' : '') +
      '</div><p>' + m.desc + '</p>' +
      '<p style="font-size:10px;opacity:.6">🃏 Побед: ' + kills + '</p></div>';
  }).join('');
}

/* === ЛИСТ ПЕРСОНАЖА (+ РЕЛИКВИИ) === */
function renderSheet(){
  var h = G.hero; if(!h) return;
  var el = $('#sheet-content'); if(!el) return;
  var stat = function(tip, label, val){
    return '<div class="sheet-stat" data-tip="' + tip + '"><span>' + label + '</span><b>' + val + '</b></div>';
  };
  var relicsHtml = '';
  if(G.relics && G.relics.length){
    relicsHtml = '<div class="sheet-sec"><h3>🏺 РЕЛИКВИИ (' + G.relics.length + '/3)</h3>' +
      G.relics.map(function(rid){
        var rel = null;
        for(var i = 0; i < RELICS.length; i++) if(RELICS[i].id === rid){ rel = RELICS[i]; break; }
        if(!rel) return '';
        return '<div class="relic-chip" data-tip="' + rel.d + '">' + rel.i + ' ' + rel.n + '</div>';
      }).join('') + '</div>';
  }
  el.innerHTML = '<div class="sheet-grid">' +
    '<div class="sheet-sec"><h3>📊 ХАРАКТЕРИСТИКИ</h3>' +
    stat('Текущее и максимальное здоровье. Если упадёт до 0 — герой падает.', '❤️ HP', Math.round(h.hp) + '/' + pMaxHp()) +
    stat('Базовый урон героя. Складывается из силы, оружия и баффов.', '⚔️ Атака', pAtk()) +
    stat('Уменьшает входящий урон от врагов.', '🛡️ Защита', pDef()) +
    stat('Шанс нанести критический удар (×1.8 урона).', '🎯 Крит', pCrit() + '%') +
    stat('Шанс полностью уклониться от удара врага.', '💨 Уклонение', pDodge() + '%') +
    stat('Лечит % от нанесённого урона.', '🩸 Вампиризм', Math.round(pVamp() * 100) + '%') +
    stat('Влияет на шанс побега и уклонение. Чем выше — тем чаще убегаешь и уклоняешься.', '👟 Скорость', h.spd) +
    stat('Общий уровень героя. Повышается за опыт.', '⭐ Уровень', h.level) +
    stat('Опыт до следующего уровня.', '✨ Опыт', h.xp + '/' + h.xpNeed) +
    '</div>' +
    '<div class="sheet-sec"><h3>💪 АТРИБУТЫ</h3>' +
    stat('+2 к атаке за единицу. Повышает урон всех ударов и навыков.', '💪 Сила', h.stats.str) +
    stat('+3% крит и +2% уклонение за единицу.', '🏹 Ловкость', h.stats.agi) +
    stat('+10% к урону навыков и +5% к лечению зелий за единицу.', '🔮 Интеллект', h.stats.int) +
    stat('+15 макс. HP за единицу.', '❤️ Живучесть', h.stats.vit) +
    '</div>' +
    '<div class="sheet-sec"><h3>🎽 ЭКИПИРОВКА</h3>' +
    ['weapon','armor','helmet','boots','gloves','ring1','ring2','amulet'].map(function(sl){
      var it = h.equip[sl];
      return stat(
        it ? it.n + ': ' + bonusTxt(it) + (it.cursed ? '. ПРОКЛЯТО: ' + it.curse : '') : SLOT_NAME[sl] + ': пусто',
        SLOT_NAME[sl],
        it ? it.i + ' ' + it.n + (it.up ? ' +' + it.up : '') : '—'
      );
    }).join('') +
    '</div>' +
    relicsHtml +
    '<div class="sheet-sec"><h3>📜 КВЕСТЫ</h3>' +
    (G.quests ? G.quests.map(function(q){
      return stat(q.desc, q.name, q.progress + '/' + q.need + (q.progress >= q.need ? ' ✅' : ''));
    }).join('') : '—') +
    '</div>' +
    '</div>';
}

/* === КНИГА НАВЫКОВ === */
function renderSkillBook(){
  var h = G.hero; if(!h) return;
  var book = SKILL_BOOKS[h.cls];
  var base = CLASSES[h.cls].skill;
  var baseDmg = base.pow ? skillDmgPreview(base.pow, base.hits) : 0;
  var baseTip = base.name + ': ' + base.desc + (base.pow ? ' · Урон: ~' + baseDmg : '');
  $('#base-skill').innerHTML = '<div class="fate-card" style="cursor:default;background:#fff3b8" data-tip="' + baseTip + '">' +
    '<div class="fc-i">' + h.icon + '</div><b>' + base.name + '</b>' + base.desc +
    (base.pow ? '<br><small>Урон: ~' + baseDmg + '</small>' : '') +
    '<br><small>КД: ' + base.cd + '</small></div>';
  var unlocked = h.skills;
  $('#skill-list').innerHTML = unlocked.length ? unlocked.map(function(id){
    var s = null;
    for(var i = 0; i < book.length; i++) if(book[i].id === id){ s = book[i]; break; }
    if(!s) return '';
    var active = h.activeSkill === id;
    var tip = s.name + ': ' + s.desc +
      (s.pow ? ' · Урон: ~' + skillDmgPreview(s.pow, s.hits) : '') +
      (s.heal ? ' · Лечение: +' + Math.round(pMaxHp() * s.heal) + ' HP' : '');
    var dmgLine = s.pow ? '<br><small>Урон: ~' + skillDmgPreview(s.pow, s.hits) + '</small>' :
                  s.heal ? '<br><small>Лечение: +' + Math.round(pMaxHp() * s.heal) + ' HP</small>' : '';
    return '<button class="fate-card" data-sk="' + id + '" data-tip="' + tip + '" style="' +
      (active ? 'background:#d8f0d8;border-color:#2a8a4a' : '') + '">' +
      '<div class="fc-i">' + s.icon + '</div><b>' + s.name + '</b>' + s.desc + dmgLine + '<br>' +
      '<small>КД: ' + s.cd + (s.el ? ' ' + elemLabel(s.el) : '') + (active ? ' · ✔' : '') + '</small></button>';
  }).join('') : '<p class="hint">Навыки не изучены. Ищи их в 📖 Санктилиях и у боссов!</p>';
  $('#skill-list').querySelectorAll('[data-sk]').forEach(function(b){
    b.onclick = function(){
      h.activeSkill = this.dataset.sk;
      var s = null;
      for(var i = 0; i < book.length; i++) if(book[i].id === h.activeSkill){ s = book[i]; break; }
      if(s) log('Выбран: ' + s.icon + ' ' + s.name);
      sfx.click();
      renderSkillBook(); updateHUD(); updateActions();
    };
  });
}

function showTutorial(){
  tutStep = 0;
  renderTut();
  openOvl('ovl-tutorial');
}
function renderTut(){
  var s = TUTORIAL[tutStep];
  $('#tut-title').textContent = s.t;
  $('#tut-ico').textContent = s.ico;
  $('#tut-text').innerHTML = s.x;
  $('#tut-prev').disabled = tutStep === 0;
  $('#tut-next').textContent = tutStep === TUTORIAL.length - 1 ? 'Начать! →' : 'Далее →';
}

function renderHeroCards(){
  var el = $('#hero-cards'); if(!el) return;
  el.innerHTML = Object.keys(CLASSES).map(function(k){
    var c = CLASSES[k];
    return '<button class="panel hero-card" data-k="' + k + '">' +
      '<div class="hc-ico">' + c.icon + '</div><h3>' + c.name + '</h3>' +
      '<p class="hc-desc">' + c.desc + '</p>' +
      '<div class="hc-stats"><span>❤️' + c.hp + '</span><span>⚔️' + c.atk + '</span><span>🛡' + c.def + '</span><span>🎯' + c.crit + '%</span></div>' +
      '<div class="hc-stats"><span>💪' + c.stats.str + '</span><span>🏹' + c.stats.agi + '</span><span>🔮' + c.stats.int + '</span><span>❤️' + c.stats.vit + '</span></div>' +
      '<div class="hc-skill">✨ <b>' + c.skill.name + '</b><br>' + c.skill.desc + '</div>' +
      '</button>';
  }).join('');
  el.querySelectorAll('.hero-card').forEach(function(b){
    b.onclick = function(){ sfx.click(); startRun(this.dataset.k); };
  });
}