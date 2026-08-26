'use strict';
/* ============================================
12-ENGINE-LOOT: дроп, реликвии без лимита,
магазин, квесты, улучшенные тексты наград
============================================ */

function dropItem(minRar){
  minRar = minRar || 0;

  var f = G.floor;
  var cls = G.hero.cls;

  /* Проклятые предметы */
  if (Math.random() < .08) {
    var cursed = pick(CURSED_ITEMS);
    var copy = {};

    for (var k in cursed) {
      copy[k] = cursed[k];
    }

    copy.b = {};
    for (var b in cursed.b) {
      copy.b[b] = cursed.b[b];
    }

    copy.up = 0;
    copy.cursed = true;

    return copy;
  }

  var pool = ITEMS().filter(function(it){
    return it.f <= f && it.rar >= minRar && (!it.cls || it.cls.indexOf(cls) >= 0);
  });

  if (!pool.length) {
    pool = ITEMS().filter(function(it){
      return it.f <= f && (!it.cls || it.cls.indexOf(cls) >= 0);
    });
  }

  if (!pool.length) {
    pool = ITEMS().filter(function(it){
      return it.f <= f;
    });
  }

  if (!pool.length) {
    pool = ITEMS();
  }

  var weighted = [];

  pool.forEach(function(it){
    var w = [5, 2, 1][it.rar] || 1;

    for (var i = 0; i < w; i++) {
      weighted.push(it);
    }
  });

  var src = pick(weighted);

  var copy2 = {
    slot: src.slot,
    i: src.i,
    n: src.n,
    rar: src.rar,
    b: {},
    up: 0,
    cls: src.cls,
    el: src.el
  };

  for (var b2 in src.b) {
    copy2.b[b2] = src.b[b2];
  }

  return copy2;
}

function giveItem(it){
  if (G.hero.inv.length >= 24) {
    log('🎒 Сумка полна!');
    return false;
  }

  G.hero.inv.push(it);

  log(
    '🎒 Предмет получен: ' +
    it.i + ' ' + it.n +
    ' (' + (SLOT_NAME[it.slot] || it.slot) + ')' +
    (it.cursed ? ' (ПРОКЛЯТО!)' : '')
  );

  saveRun();

  return true;
}

function giveElixir(et){
  var h = G.hero;

  if (h.elixirs.length >= h.elixirCap) {
    log('Ячейки эликсиров полны!');
    return false;
  }

  h.elixirs.push(et);

  log(
    '🧪 Эликсир получен: ' +
    ELIXIRS[et].i + ' ' + ELIXIRS[et].n +
    ' — ' + ELIXIRS[et].d
  );

  saveRun();

  return true;
}

/* === Реликвии: лимит убран === */
function giveRelic(rel){
  if (!rel) return false;

  if (!G.relics) G.relics = [];

  if (G.relics.indexOf(rel.id) >= 0) {
    G.gold += 60;
    log('🏺 Дубликат реликвии превращён в 60💰');
    return false;
  }

  G.relics.push(rel.id);

  log('🏺 Реликвия получена: ' + rel.i + ' «' + rel.n + '» — ' + rel.d);

  sfx.mystic();
  saveRun();

  return true;
}

function dropRelic(){
  var owned = G.relics || [];

  var pool = RELICS.filter(function(r){
    return owned.indexOf(r.id) < 0;
  });

  if (!pool.length) return null;

  return pick(pool);
}

function bonusTxt(it){
  var names = {
    atk: 'атаки',
    def: 'защиты',
    hp: 'HP',
    crit: 'крит',
    dodge: 'уворот',
    vamp: 'вамп',
    spd: 'скорость'
  };

  return Object.keys(it.b).map(function(k){
    var mul = 1 + (it.up || 0) * .25;
    var val = Math.round(it.b[k] * mul * 100) / 100;

    if (k === 'vamp') {
      return '+' + Math.round(val * 100) + '% вампиризма';
    }

    if (k === 'crit' || k === 'dodge') {
      return '+' + val + '% ' + names[k];
    }

    return '+' + val + ' ' + (names[k] || k);
  }).join(' · ');
}

function sellPrice(it){
  return Math.round(([8, 18, 40][it.rar] || 8) * (1 + (it.up || 0) * .5));
}

function getActiveSkill(){
  if (!G.hero || !G.hero.activeSkill) return null;

  var book = SKILL_BOOKS[G.hero.cls];

  for (var i = 0; i < book.length; i++) {
    if (book[i].id === G.hero.activeSkill) return book[i];
  }

  return null;
}

function grantRandomSkill(){
  var h = G.hero;
  var book = SKILL_BOOKS[h.cls];

  var locked = book.filter(function(s){
    return h.skills.indexOf(s.id) < 0;
  });

  if (!locked.length) {
    G.gold += 50;
    log('Все навыки изучены! +50 золота');
    return null;
  }

  var s = pick(locked);

  h.skills.push(s.id);

  log('📖 Изучен навык «' + s.name + '»!');

  if (!h.activeSkill) h.activeSkill = s.id;

  sfx.mystic();
  saveRun();

  return s;
}

/* === КВЕСТЫ === */
function updateQuestProgress(type){
  if (!G.quests) return;

  G.quests.forEach(function(q){
    if (q.progress >= q.need) return;

    var matched = false;

    if (q.target === 'kill' && type === 'kill') matched = true;
    if (q.target === 'chest' && type === 'chest') matched = true;
    if (q.target === 'material' && type === 'material') matched = true;

    if (matched) {
      q.progress++;

      if (q.progress >= q.need) {
        log('🎉 КВЕСТ ВЫПОЛНЕН: «' + q.name + '»!');
        sfx.win();

        if (!G.pendingQuests) G.pendingQuests = [];

        G.pendingQuests.push(q);

        setTimeout(flushQuests, 700);
      } else {
        log('📜 Квест «' + q.name + '»: ' + q.progress + '/' + q.need);
      }
    }
  });
}

function flushQuests(){
  if (!G.pendingQuests || !G.pendingQuests.length) return;

  var ovl = $('#ovl-quest');

  if (ovl && ovl.classList.contains('on')) return;

  showQuestComplete(G.pendingQuests[0]);
}

function showQuestComplete(q){
  openOvl('ovl-quest');

  var el = $('#quest-content');
  if (!el) return;

  var rewards = q.rewards || (q.reward ? [q.reward] : [{gold:50, item:null}]);

  var rewardsHtml = rewards.map(function(r, i){
    var label;

    if (r.item) {
      label =
        (SLOT_NAME[r.item.slot] || 'Предмет') + ': ' +
        r.item.i + ' ' + r.item.n +
        ' <span class="rar-tag">' + RAR[r.item.rar] + '</span>';
    } else {
      label = '💰 ' + r.gold + ' золота';
    }

    return (
      '<button class="cbtn" data-reward="' + i + '" style="background:var(--yel);margin:4px;font-size:14px">' +
      label +
      '</button>'
    );
  }).join('');

  el.innerHTML =
    '<h3 class="ev-title">🎉 КВЕСТ ВЫПОЛНЕН!</h3>' +
    '<div class="ev-anim anim-glow">🏆</div>' +
    '<p style="font-size:18px"><b>«' + q.name + '»</b></p>' +
    '<p style="font-size:14px;opacity:.8;margin:8px 0">Выбери награду:</p>' +
    '<div style="display:flex;flex-direction:column;gap:8px;align-items:center">' +
    rewardsHtml +
    '</div>';

  el.querySelectorAll('[data-reward]').forEach(function(b){
    b.onclick = function(){
      var reward = rewards[parseInt(this.dataset.reward, 10)];

      if (reward.gold) {
        G.gold += reward.gold;
      }

      if (reward.item) {
        var item = {
          slot: reward.item.slot,
          i: reward.item.i,
          n: reward.item.n,
          rar: reward.item.rar,
          b: {},
          up: 0
        };

        for (var k in reward.item.b) {
          item.b[k] = reward.item.b[k];
        }

        giveItem(item);
      }

      sfx.win();
      log('🎉 Награда получена!');
      updateHUD();

      G.pendingQuests.shift();

      if (G.pendingQuests.length) {
        showQuestComplete(G.pendingQuests[0]);
      } else {
        closeOvl('ovl-quest');
      }

      saveRun();
    };
  });
}

/* === МАГАЗИН === */
function shopMultNow(){
  return (G.hero.shopMult || 1) * (1 + G.floor * 0.02);
}

function renderShop(){
  var el = $('#event-layer');

  if (!G.shopGoods) generateShopGoods();

  var mult = shopMultNow();

  el.innerHTML =
    '<div class="ev">' +
    '<h3 class="ev-title">🛒 ЛАВКА</h3>' +
    '<div class="ev-anim">🧙</div>' +
    '<p>Золото: <b>' + G.gold + '</b> 💰 <small>(цены растут с этажом)</small></p>' +
    '<div class="ev-shop">' +
    G.shopGoods.map(function(s, i){
      var price = Math.round(s.p * mult);

      return (
        '<button class="shop-it" data-i="' + i + '" ' + (G.gold < price ? 'disabled' : '') + '>' +
        '<span class="si-i">' + s.i + '</span>' +
        '<b>' + s.n + '</b>' +
        '<small>' + s.d + '</small>' +
        '<span class="p">' + price + ' 💰</span>' +
        '</button>'
      );
    }).join('') +
    '</div>' +
    '<button class="cbtn ghost" id="shop-exit" style="margin-top:10px">Уйти →</button>' +
    '</div>';

  el.querySelectorAll('.shop-it').forEach(function(b){
    b.onclick = function(){
      var item = G.shopGoods[parseInt(this.dataset.i, 10)];
      var price = Math.round(item.p * shopMultNow());

      if (G.gold < price) return;

      G.gold -= price;
      sfx.gold();

      if (item.kind === 'item') {
        giveItem(item.it);
        log('Куплено: ' + item.it.n);
      } else if (item.kind === 'elixir') {
        giveElixir(item.et);
        log('Куплен: ' + ELIXIRS[item.et].n);
      } else {
        item.b(G.hero);
        log('Куплено: ' + item.n);
      }

      G.shopGoods.splice(parseInt(this.dataset.i, 10), 1);

      updateHUD();
      saveRun();
      renderShop();
    };
  });

  $('#shop-exit').onclick = function(){
    G.shopGoods = null;
    sfx.click();
    afterEvent();
  };
}

function generateShopGoods(){
  var goods = [];

  goods.push({
    kind: 'consume',
    i: '🧪',
    n: 'Зелье',
    d: '+1 зелье',
    p: 25,
    b: function(h){
      h.pots++;
    }
  });

  goods.push({
    kind: 'consume',
    i: '🍖',
    n: 'Похлёбка',
    d: 'Лечит 50% HP',
    p: 40,
    b: function(h){
      h.hp = Math.min(pMaxHp(), h.hp + Math.round(pMaxHp() * .5));
    }
  });

  for (var i = 0; i < ri(2, 3); i++) {
    var it = dropShopItem();
    var price = ([20, 45, 90][it.rar] || 20) + G.floor * 2;

    goods.push({
      kind: 'item',
      i: it.i,
      n: it.n,
      d: bonusTxt(it),
      p: price,
      it: it
    });
  }

  var ek = pick(Object.keys(ELIXIRS));

  goods.push({
    kind: 'elixir',
    i: ELIXIRS[ek].i,
    n: ELIXIRS[ek].n,
    d: ELIXIRS[ek].d,
    p: 35,
    et: ek
  });

  G.shopGoods = goods;
}

function dropShopItem(){
  var pool = ITEMS().filter(function(it){
    return it.f <= Math.min(G.floor + 5, 100);
  });

  if (!pool.length) return ITEMS()[0];

  var src = pick(pool);

  var copy = {
    slot: src.slot,
    i: src.i,
    n: src.n,
    rar: src.rar,
    b: {},
    up: 0,
    cls: src.cls,
    el: src.el
  };

  for (var b in src.b) {
    copy.b[b] = src.b[b];
  }

  return copy;
}