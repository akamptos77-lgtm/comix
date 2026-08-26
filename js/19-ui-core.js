'use strict';
/* ============================================
19-UI-CORE: экран, оверлеи, лог, зал славы,
слабости врага, подсказки, звук
============================================ */

function show(id){
  $$('.screen').forEach(function(s){
    s.classList.remove('on');
  });

  var scr = $('#' + id);
  if (scr) scr.classList.add('on');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function openOvl(id){
  var o = $('#' + id);
  if (o) o.classList.add('on');
}

function closeOvl(id){
  var o = $('#' + id);
  if (o) o.classList.remove('on');
}

function blog(m){
  if (!G.logArr) G.logArr = [];

  G.logArr.push(m);

  if (G.logArr.length > 30) G.logArr.shift();
}

function log(m){
  blog(m);

  var b = $('#battle-msg');
  if (!b) return;

  b.textContent = m;
  b.classList.remove('pop');
  void b.offsetWidth;
  b.classList.add('pop');
}

function renderLog(){
  var el = $('#log-list');
  if (!el) return;

  el.innerHTML = (G.logArr || []).map(function(m){
    return '<div class="log-row">' + m + '</div>';
  }).reverse().join('') || '<p class="hint">Журнал пуст.</p>';
}

function escapeHtml(s){
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

/* === Зал славы === */
function renderScoresAsync(){
  getScoresAsync().then(function(a){
    var tb = $('#scores');
    if (!tb) return;

    if (!a.length) {
      tb.innerHTML = '<tr><td colspan="3" style="text-align:center">Пока пусто</td></tr>';
    } else {
      tb.innerHTML = a.map(function(r, i){
        return (
          '<tr>' +
          '<td>' + (['🥇', '🥈', '🥉'][i] || i + 1) + '</td>' +
          '<td>' + escapeHtml(r.name || r.n || 'Аноним') + '</td>' +
          '<td><b>' + (r.score || r.s) + '</b> ' +
          '<span class="dim">(' + (r.floor || r.f) + ' эт.)</span>' +
          '</td>' +
          '</tr>'
        );
      }).join('');
    }

    var fh = $('#fame-hint');
    if (fh) fh.style.display = getUser() ? 'none' : 'block';

    var bl = $('#btn-login');
    if (bl) bl.textContent = getUser() ? '👤 ' + getUser() : '👤 Войти';
  });
}

function renderScores(){
  renderScoresAsync();
}

/* === Информация о слабостях врага в бою === */
function renderEnemyInfo(){
  var wrap = $('#stage-wrap');
  var el = $('#enemy-info');

  if (!wrap) {
    if (el) el.style.display = 'none';
    return;
  }

  if (!el) {
    el = document.createElement('div');
    el.id = 'enemy-info';
    el.style.cssText =
      'position:absolute;left:12px;bottom:12px;z-index:6;' +
      'background:#fff;border:3px solid var(--ink);border-radius:10px;' +
      'padding:6px 10px;font-size:12px;box-shadow:3px 3px 0 var(--ink);' +
      'max-width:70%;display:none;';
    wrap.appendChild(el);
  }

  var e = G.enemy;

  if (G.phase === 'combat' && e && !e.dead) {
    var parts = [];

    if (e.weak && typeof ELEMENTS !== 'undefined' && ELEMENTS[e.weak]) {
      parts.push('слаб: ' + ELEMENTS[e.weak].icon + ' ' + ELEMENTS[e.weak].name);
    } else if (e.weak) {
      parts.push('слаб: ' + e.weak);
    }

    if (e.resist && typeof ELEMENTS !== 'undefined' && ELEMENTS[e.resist]) {
      parts.push('устойчив: ' + ELEMENTS[e.resist].icon + ' ' + ELEMENTS[e.resist].name);
    } else if (e.resist) {
      parts.push('устойчив: ' + e.resist);
    }

    if (e.tr && typeof TR_LBL !== 'undefined' && TR_LBL[e.tr]) {
      parts.push(TR_LBL[e.tr]);
    }

    el.style.display = 'block';
    el.innerHTML =
      '<b>' + escapeHtml(e.name) + '</b>' +
      (parts.length ? ' · ' + parts.join(' · ') : '');
  } else {
    el.style.display = 'none';
  }
}

/* === Подсказки для новых игроков === */
function getHintText(){
  if (!G) return '';

  if (G.phase === 'doors') {
    if (G.floor === 1) {
      return 'Выбери одну из дверей. Что за ней — скрыто!';
    }

    if (G.floor % 10 === 0) {
      return 'Впереди босс. Следи за его намерениями и используй защиту.';
    }

    if ((G.cycle || 0) > 0 && G.floor === 1) {
      return 'Бесконечный режим: враги стали сильнее. Появились испытания Пустоты!';
    }

    return '';
  }

  if (G.phase !== 'combat') return '';

  var h = G.hero;
  var e = G.enemy;

  if (!h || !e || e.dead) return '';

  var maxHp = (typeof pMaxHp === 'function') ? pMaxHp() : h.maxHp;

  if (h.hp < maxHp * .35 && h.pots > 0) {
    return 'HP мало! Нажми 5 или клавишу 5 — зелье.';
  }

  if (e.nextAction === 'heavy' && !h.defending) {
    return 'Враг готовит мощный удар! Нажми 4 — защита.';
  }

  if (e.nextAction === 'spell' && !h.defending) {
    return 'Враг колдует! Защита уменьшит урон.';
  }

  if (h.skillCd === 0 && G.floor <= 5) {
    return 'Базовый навык готов! Нажми 2.';
  }

  if (e.weak && G.floor <= 8 && typeof ELEMENTS !== 'undefined' && ELEMENTS[e.weak]) {
    return 'Враг слаб к стихии: ' + ELEMENTS[e.weak].icon + ' ' + ELEMENTS[e.weak].name + '.';
  }

  if (G.floor <= 2) {
    return 'Управление: 1 — атака, 2 — навык, 4 — защита, 5 — зелье.';
  }

  return '';
}

function updateHint(){
  var wrap = $('#stage-wrap');
  var box = $('#game-hint');

  if (!wrap) {
    if (box) box.style.display = 'none';
    return;
  }

  if (!box) {
    box = document.createElement('div');
    box.id = 'game-hint';
    box.style.cssText =
      'position:absolute;right:12px;bottom:12px;z-index:6;' +
      'background:#fff3b8;border:3px solid var(--ink);border-radius:10px;' +
      'padding:6px 10px;font-size:12px;box-shadow:3px 3px 0 var(--ink);' +
      'max-width:240px;display:none;';
    wrap.appendChild(box);
  }

  var txt = getHintText();

  if (txt) {
    box.textContent = txt;
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
  }
}

/* === HUD === */
function updateHUD(){
  var h = G.hero;

  if (!h) {
    var enemyInfo = $('#enemy-info');
    if (enemyInfo) enemyInfo.style.display = 'none';

    var hintBox = $('#game-hint');
    if (hintBox) hintBox.style.display = 'none';

    return;
  }

  var set = function(id, v){
    var el = $(id);
    if (el) el.textContent = v;
  };

  set('#hud-floor', '🏰 Этаж ' + G.floor);

  var bio = getBiome(G.floor);
  set('#hud-biome', bio.ico + ' ' + bio.name);

  set('#hud-hero', h.icon + ' ' + h.name + ' · ур.' + h.level);
  set('#hud-stats', '💪' + h.stats.str + ' 🏹' + h.stats.agi + ' 🔮' + h.stats.int + ' ❤️' + h.stats.vit);
  set('#hud-gold', G.gold);
  set('#hud-pots', h.pots);

  var compEl = $('#hud-comp');
  if (compEl) {
    if (G.companion) {
      compEl.style.display = 'inline-block';
      compEl.textContent = G.companion.icon + ' ' + G.companion.battlesLeft + ' боя';
    } else {
      compEl.style.display = 'none';
    }
  }

  var maxHp = pMaxHp();
  var hpP = maxHp > 0 ? (h.hp / maxHp * 100) : 0;

  var hpFill = $('#hp-fill');
  if (hpFill) hpFill.style.width = hpP + '%';

  var hpTxt = $('#hp-txt');
  if (hpTxt) hpTxt.textContent = 'HP ' + Math.round(h.hp) + '/' + maxHp;

  var hpBar = $('#hp-bar');
  if (hpBar) hpBar.classList.toggle('low', hpP < 30);

  var need = h.xpNeed || 1;

  var xpFill = $('#xp-fill');
  if (xpFill) xpFill.style.width = (h.xp / need * 100) + '%';

  var xpTxt = $('#xp-txt');
  if (xpTxt) xpTxt.textContent = 'ОПЫТ ' + h.xp + '/' + need;

  renderEnemyInfo();
  updateHint();
}

function skillDmgPreview(pow, hits){
  var atk = (typeof getHeroAtk === 'function') ? getHeroAtk() : 0;
  var skillPow = (typeof pSkillPow === 'function') ? pSkillPow() : 1;

  return Math.round(atk * (pow || 1) * (hits || 1) * skillPow);
}

function buildActions(){
  var el = $('#actions');
  if (!el) return;

  el.innerHTML =
    '<button class="abtn a-atk" data-a="atk" data-tip="Обычная атака.">⚔️ Атака <span id="atk-val" class="aval"></span> <kbd>1</kbd></button>' +
    '<button class="abtn a-skill" data-a="skill" data-tip="Базовый навык класса.">✨ <span id="sk-name"></span> <span id="sk-val" class="aval"></span> <kbd>2</kbd><span class="cd-wrap"><span class="cd-fill" id="cd-skill"></span></span></button>' +
    '<button class="abtn a-skill2" data-a="skill2" data-tip="Второй навык из книги.">🎯 <span id="sk2-name"></span> <span id="sk2-val" class="aval"></span> <kbd>3</kbd><span class="cd-wrap"><span class="cd-fill" id="cd-skill2"></span></span></button>' +
    '<button class="abtn a-def" data-a="def" data-tip="Защита: −55% урона.">🛡 Защита <kbd>4</kbd></button>' +
    '<button class="abtn a-pot" data-a="pot" data-tip="Зелье: лечит HP.">🧪 Зелье <span id="pot-val" class="aval"></span> <kbd>5</kbd></button>' +
    '<button class="abtn a-flee" data-a="flee" data-tip="Побег. Не работает на боссах.">🏃 Побег <span id="flee-val" class="aval"></span> <kbd>6</kbd></button>';
}

function updateActions(){
  var h = G.hero;
  if (!h) return;

  var e = G.enemy;

  var setTxt = function(id, v){
    var el = $(id);
    if (el) el.textContent = v;
  };

  var setTip = function(btn, tip){
    if (btn) btn.dataset.tip = tip;
  };

  var atkDmg = getHeroAtk();

  setTxt('#atk-val', '~' + atkDmg);
  setTip($('.a-atk'), 'Обычная атака. Примерный урон: ~' + atkDmg + '. Клавиша 1.');

  var sk = CLASSES[h.cls].skill;

  setTxt('#sk-name', sk.name + (h.skillCd > 0 ? ' (' + h.skillCd + ')' : ''));

  if (sk.pow) {
    var skDmg = skillDmgPreview(sk.pow, sk.hits);
    setTxt('#sk-val', '~' + skDmg);
    setTip($('.a-skill'), sk.name + ': ' + sk.desc + ' · Урон: ~' + skDmg + '. Клавиша 2.');
  } else {
    setTxt('#sk-val', '');
    setTip($('.a-skill'), sk.name + ': ' + sk.desc + '. Клавиша 2.');
  }

  var s2 = getActiveSkill();

  if (s2) {
    setTxt('#sk2-name', s2.icon + ' ' + s2.name + (h.skill2Cd > 0 ? ' (' + h.skill2Cd + ')' : ''));

    if (s2.pow) {
      var s2Dmg = skillDmgPreview(s2.pow, s2.hits);
      setTxt('#sk2-val', '~' + s2Dmg);
      setTip($('.a-skill2'), s2.name + ': ' + s2.desc + ' · Урон: ~' + s2Dmg + '. Клавиша 3.');
    } else if (s2.heal) {
      var s2Heal = Math.round(pMaxHp() * s2.heal);
      setTxt('#sk2-val', '+' + s2Heal + ' HP');
      setTip($('.a-skill2'), s2.name + ': ' + s2.desc + ' · Лечение: +' + s2Heal + ' HP. Клавиша 3.');
    } else {
      setTxt('#sk2-val', '');
      setTip($('.a-skill2'), s2.name + ': ' + s2.desc + '. Клавиша 3.');
    }
  } else {
    setTxt('#sk2-name', '—');
    setTxt('#sk2-val', '');
    setTip($('.a-skill2'), 'Второй навык не выбран. Изучи навык в 📖 Санктилии.');
  }

  var potHeal = Math.round(pMaxHp() * pPotionPow());

  setTxt('#pot-val', '+' + potHeal + ' HP');
  setTip($('.a-pot'), 'Зелье: лечит ~' + potHeal + ' HP. Осталось: ' + h.pots + '. Клавиша 5.');

  var fleeChance = clamp(
    50 + (h.spd + ((typeof hasRelic === 'function' && hasRelic('swiftboot')) ? 2 : 0)) * 2,
    35,
    92
  );

  setTxt('#flee-val', fleeChance + '%');
  setTip($('.a-flee'), 'Побег: шанс ' + fleeChance + '%. Не работает на боссах. Клавиша 6.');

  var cdSk = $('#cd-skill');
  if (cdSk) {
    var maxCd = effCd(h.skillCdMax);
    cdSk.style.width = (h.skillCd > 0 ? (h.skillCd / maxCd * 100) : 0) + '%';
  }

  var cdSk2 = $('#cd-skill2');
  if (cdSk2) {
    var maxCd2 = h.skill2CdMax || effCd(s2 ? s2.cd : 1);
    cdSk2.style.width = (h.skill2Cd > 0 ? (h.skill2Cd / maxCd2 * 100) : 0) + '%';
  }

  $$('.abtn').forEach(function(b){
    var a = b.dataset.a;
    var dis = G.busy || G.phase !== 'combat';

    if (a === 'skill' && h.skillCd > 0) dis = true;
    if (a === 'skill2' && (!s2 || h.skill2Cd > 0)) dis = true;
    if (a === 'pot' && (h.pots <= 0 || h.hp >= pMaxHp())) dis = true;
    if (a === 'flee' && e && e.boss) dis = true;

    b.disabled = dis;
  });

  updateHint();
}

/* === Тултипы === */
function initTooltip(){
  if (document.getElementById('tip-box')) return;

  var tip = document.createElement('div');
  tip.id = 'tip-box';

  document.body.appendChild(tip);

  function positionTip(e){
    var pad = 14;

    var x = e.clientX + pad;
    var y = e.clientY + pad;

    var r = tip.getBoundingClientRect();

    if (x + r.width > window.innerWidth - 8) {
      x = e.clientX - r.width - pad;
    }

    if (y + r.height > window.innerHeight - 8) {
      y = e.clientY - r.height - pad;
    }

    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }

  document.addEventListener('mouseover', function(e){
    var el = e.target.closest('[data-tip]');

    if (!el || !el.dataset.tip) {
      tip.style.display = 'none';
      return;
    }

    tip.textContent = el.dataset.tip;
    tip.style.display = 'block';
    positionTip(e);
  });

  document.addEventListener('mousemove', function(e){
    if (tip.style.display === 'block') {
      positionTip(e);
    }
  });

  document.addEventListener('mouseout', function(e){
    var el = e.target.closest('[data-tip]');
    if (!el) return;

    var to = e.relatedTarget;

    if (to && el.contains(to)) return;

    tip.style.display = 'none';
  });
}

/* === Кнопка звука === */
function initSoundToggle(){
  if ($('#btn-sound')) return;

  var btn = document.createElement('button');

  btn.id = 'btn-sound';
  btn.className = 'cbtn small';
  btn.style.cssText =
    'position:fixed;right:14px;top:14px;z-index:120;' +
    'padding:8px 12px;font-size:14px;';

  var muted = (typeof isSoundMuted === 'function') ? isSoundMuted() : false;

  btn.textContent = muted ? '🔇 Звук выкл' : '🔊 Звук вкл';

  btn.onclick = function(){
    if (typeof toggleSound !== 'function') return;

    var nowMuted = toggleSound();

    btn.textContent = nowMuted ? '🔇 Звук выкл' : '🔊 Звук вкл';

    if (!nowMuted && typeof sfx !== 'undefined' && sfx.click) {
      sfx.click();
    }
  };

  document.body.appendChild(btn);
}

function initUiExtras(){
  initSoundToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUiExtras);
} else {
  initUiExtras();
}