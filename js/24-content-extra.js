'use strict';
/* ============================================
24-CONTENT-EXTRA:
- больше выбора в событиях: «Перекрёсток»
- бесконечный режим: «Испытание Пустоты»
============================================ */

(function(){

  if (typeof DOOR_RESULT_LABEL !== 'undefined') {
    DOOR_RESULT_LABEL.crossroads = '🤔 Перекрёсток!';
    DOOR_RESULT_LABEL.trial = '🌌 Испытание Пустоты!';
  }

  /* Добавляем новые двери в генерацию */
  var oldMakeDoors = (typeof makeDoors === 'function') ? makeDoors : null;

  if (oldMakeDoors) {
    window.makeDoors = function(){
      var doors = oldMakeDoors();

      if (!G || G.floor % 10 === 0 || G.floor === 100) {
        return doors;
      }

      /* Дополнительный выбор на обычных этажах */
      if (Math.random() < .08) {
        doors.push({
          type: 'crossroads',
          hint: '🚪 Тропа раздваивается...',
          ico: '🤔',
          revealed: null
        });
      }

      /* Контент бесконечного режима */
      if ((G.cycle || 0) > 0 && Math.random() < .12) {
        doors.push({
          type: 'trial',
          hint: '❓ Пустота шепчет...',
          ico: '🌌',
          revealed: null
        });
      }

      return doors;
    };
  }

  /* Обрабатываем открытие новых дверей */
  var oldOpenDoor = (typeof openDoor === 'function') ? openDoor : null;

  if (oldOpenDoor) {
    window.openDoor = function(i){
      var d = G.doors && G.doors[i];

      if (d && d.type === 'crossroads') {
        handleExtraDoor(d, '🤔', openCrossroads);
        return;
      }

      if (d && d.type === 'trial') {
        handleExtraDoor(d, '🌌', openTrial);
        return;
      }

      return oldOpenDoor(i);
    };
  }

  function handleExtraDoor(d, icon, fn){
    var idx = G.doors.indexOf(d);

    d.revealed = icon;
    d.selected = true;

    G.doors.forEach(function(x, j){
      if (j !== idx && !x.revealed) {
        x.revealed = '🚪';
      }
    });

    if (typeof renderDoors === 'function') {
      renderDoors();
    }

    log('Дверь распахнулась: ' + (DOOR_RESULT_LABEL[d.type] || d.type));

    sleep(450).then(function(){
      fn();
    });
  }

  function finishExtraEvent(){
    if (typeof afterEvent === 'function') {
      afterEvent();
    } else if (typeof nextFloor === 'function') {
      nextFloor();
    }
  }

  /* === ПЕРЕКРЁСТОК: больше выбора === */
  function openCrossroads(){
    var el = $('#event-layer');
    if (!el) return;

    el.innerHTML =
      '<div class="ev">' +
      '<h3 class="ev-title">🤔 ПЕРЕКРЁСТОК</h3>' +
      '<div class="ev-anim">🤔</div>' +
      '<p>Дороги расходятся. Каждая сулит своё.</p>' +
      '<div class="ev-choices" style="flex-direction:column;gap:8px">' +
      '<button class="cbtn red" id="cr-fight">⚔️ Сразиться с элитой (лучше лут)</button>' +
      '<button class="cbtn" id="cr-search" style="background:var(--yel)">🔍 Обыскать окрестности</button>' +
      '<button class="cbtn blu" id="cr-risk">🎁 Рискнуть со странным сундуком</button>' +
      '</div>' +
      '</div>';

    $('#cr-fight').onclick = function(){
      sfx.click();
      startCombat('elite', false);
    };

    $('#cr-search').onclick = function(){
      if (Math.random() < .7) {
        var g = ri(20, 40) + G.floor * 2;
        G.gold += g;

        sfx.gold();
        log('🔍 Найдено ' + g + '💰!');
      } else {
        var dm = ri(6, 12) + Math.floor(G.floor / 2);

        G.hero.hp = Math.max(1, G.hero.hp - dm);

        sfx.hurt();
        log('🕸️ Ловушка! −' + dm + ' HP');
      }

      updateHUD();
      saveRun();
      finishExtraEvent();
    };

    $('#cr-risk').onclick = function(){
      var r = Math.random();

      if (r < .3) {
        var rel = (typeof dropRelic === 'function') ? dropRelic() : null;

        if (rel && typeof giveRelic === 'function' && giveRelic(rel)) {
          log('🎁 Сундук хранит реликвию!');
        } else {
          G.gold += 100;
          log('🎁 Реликвий нет, но найдено 100💰!');
        }

        sfx.mystic();
      } else if (r < .55) {
        var it = (typeof dropItem === 'function') ? dropItem(1) : null;

        if (it && typeof giveItem === 'function') {
          giveItem(it);
          log('🎁 В сундуке предмет!');
        } else {
          G.gold += 80;
        }

        sfx.gold();
      } else if (r < .8) {
        var g2 = ri(50, 90) + G.floor * 2;
        G.gold += g2;

        sfx.gold();
        log('🎁 Сундук полон золота: +' + g2 + '💰!');
      } else {
        var dm2 = ri(10, 18) + Math.floor(G.floor / 2);

        G.hero.hp = Math.max(1, G.hero.hp - dm2);

        sfx.hurt();
        log('💥 Сундук оказался ловушкой! −' + dm2 + ' HP');
      }

      updateHUD();
      saveRun();
      finishExtraEvent();
    };
  }

  /* === ИСПЫТАНИЕ ПУСТОТЫ: бесконечный режим === */
  function openTrial(){
    var el = $('#event-layer');
    if (!el) return;

    var relicCost = 250;

    el.innerHTML =
      '<div class="ev">' +
      '<h3 class="ev-title">🌌 ИСПЫТАНИЕ ПУСТОТЫ</h3>' +
      '<div class="ev-anim anim-glow">🌌</div>' +
      '<p>Пустота смотрит на тебя. Выбери, чем рискнуть.</p>' +
      '<div class="ev-choices" style="flex-direction:column;gap:8px">' +
      '<button class="cbtn red" id="tr-power">💪 Принять силу: +3 атаки, −10 макс. HP</button>' +
      '<button class="cbtn" id="tr-gamble" style="background:var(--yel)">🎲 Азарт Пустоты</button>' +
      '<button class="cbtn blu" id="tr-relic" ' + (G.gold < relicCost ? 'disabled' : '') + '>🏺 Реликвия за ' + relicCost + '💰</button>' +
      '<button class="cbtn ghost" id="tr-leave">Уйти</button>' +
      '</div>' +
      '</div>';

    $('#tr-power').onclick = function(){
      var h = G.hero;

      if (!h) return;

      h.atk += 3;
      h.maxHp = Math.max(30, h.maxHp - 10);

      if (typeof clampHp === 'function') {
        clampHp();
      } else {
        h.hp = Math.min(h.hp, h.maxHp);
      }

      sfx.level();
      log('🌌 Сила Пустоты: +3 атаки, −10 макс. HP');

      updateHUD();
      saveRun();
      finishExtraEvent();
    };

    $('#tr-gamble').onclick = function(){
      var r = Math.random();

      if (r < .35) {
        var g = 120 + G.floor * 2;
        G.gold += g;

        sfx.gold();
        log('🎲 Пустота довольна: +' + g + '💰');
      } else if (r < .6) {
        G.hero.pots++;

        sfx.potion();
        log('🎲 Пустота даёт зелье!');
      } else if (r < .8) {
        var rel = (typeof dropRelic === 'function') ? dropRelic() : null;

        if (rel && typeof giveRelic === 'function' && giveRelic(rel)) {
          log('🎲 Пустота дарит реликвию!');
        } else {
          G.gold += 120;
          log('🎲 Реликвий нет: +120💰');
        }

        sfx.mystic();
      } else {
        var dm = 15 + Math.floor(G.floor / 3);

        G.hero.hp = Math.max(1, G.hero.hp - dm);

        sfx.hurt();
        log('🎲 Пустота наказывает: −' + dm + ' HP');
      }

      updateHUD();
      saveRun();
      finishExtraEvent();
    };

    $('#tr-relic').onclick = function(){
      if (G.gold < relicCost) return;

      var rel = (typeof dropRelic === 'function') ? dropRelic() : null;

      if (!rel) {
        G.gold += 100;
        log('🌌 Реликвий больше нет. Пустота возвращает 100💰.');
      } else {
        G.gold -= relicCost;

        if (typeof giveRelic === 'function') {
          giveRelic(rel);
        }

        log('🌌 Реликвия получена за ' + relicCost + '💰!');
      }

      updateHUD();
      saveRun();
      finishExtraEvent();
    };

    $('#tr-leave').onclick = function(){
      sfx.click();
      finishExtraEvent();
    };
  }

})();