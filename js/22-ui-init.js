'use strict';
/* ============================================
22-UI-INIT: инициализация интерфейса,
сохранения, клавиатура, фикс КД навыков
============================================ */

function init(){
  if (typeof initTooltip === 'function') {
    initTooltip();
  }

  var hasSave = checkSave();

  if (typeof renderScoresAsync === 'function') {
    renderScoresAsync();
  }

  if (typeof renderHeroCards === 'function') {
    renderHeroCards();
  }

  if (typeof updateHUD === 'function') {
    updateHUD();
  }

  var btnContinue = $('#btn-continue');
  if (btnContinue) {
    btnContinue.style.display = hasSave ? 'inline-block' : 'none';
  }

  /* --- Кнопки меню --- */
  var btnStart = $('#btn-start');
  if (btnStart) {
    btnStart.onclick = function(){
      clearRun();
      if (typeof ac === 'function') ac();
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
      show('scr-hero');
    };
  }

  if (btnContinue) {
    btnContinue.onclick = function(){
      if (loadRun()) {
        G.busy = false;
        if (typeof sfx !== 'undefined' && sfx.click) sfx.click();

        show('scr-game');

        if (typeof buildActions === 'function') buildActions();
        if (typeof updateHUD === 'function') updateHUD();
        if (typeof renderElixirs === 'function') renderElixirs();

        if (G.phase === 'combat') {
          var actionsEl = $('#actions');
          if (actionsEl) actionsEl.classList.remove('hidden');

          var elixirsEl = $('#elixirs');
          if (elixirsEl) elixirsEl.classList.remove('hidden');

          if (typeof updateActions === 'function') updateActions();
        } else if (G.phase === 'doors') {
          if (typeof renderDoors === 'function') renderDoors();
        } else {
          G.phase = 'doors';
          if (typeof renderDoors === 'function') renderDoors();
        }

        log('📂 Забег восстановлен! Этаж ' + G.floor);
      } else {
        log('Ошибка загрузки сохранения');
        show('scr-menu');
      }
    };
  }

  var btnHeroback = $('#btn-heroback');
  if (btnHeroback) {
    btnHeroback.onclick = function(){
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();

      show('scr-menu');
      checkSave();

      var c = $('#btn-continue');
      if (c) {
        c.style.display = G.hasSave ? 'inline-block' : 'none';
      }
    };
  }

  /* --- Сложность --- */
  var diffs = $('#diffs');
  if (diffs) {
    diffs.addEventListener('click', function(e){
      var b = e.target.closest('.diff-pill');
      if (!b) return;

      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();

      G.diff = b.dataset.d;

      $$('.diff-pill').forEach(function(p){
        p.classList.toggle('sel', p === b);
      });
    });
  }

  /* --- Вход --- */
  var btnLogin = $('#btn-login');
  if (btnLogin) {
    btnLogin.onclick = function(){
      if (getUser()) {
        localStorage.removeItem('kcigames_user');
        renderScoresAsync();
      } else {
        openOvl('ovl-login');
        setTimeout(function(){
          var li = $('#login-inp');
          if (li) li.focus();
        }, 100);
      }
    };
  }

  var loginOk = $('#login-ok');
  if (loginOk) {
    loginOk.onclick = function(){
      var inp = $('#login-inp');
      var n = inp ? inp.value.trim() : '';

      if (n) {
        setUser(n);
        renderScoresAsync();
        closeOvl('ovl-login');
      }
    };
  }

  var loginCancel = $('#login-cancel');
  if (loginCancel) {
    loginCancel.onclick = function(){
      closeOvl('ovl-login');
    };
  }

  /* --- Туториал --- */
  var btnTut = $('#btn-tutorial');
  if (btnTut) {
    btnTut.onclick = function(){
      if (typeof showTutorial === 'function') showTutorial();
    };
  }

  var tutPrev = $('#tut-prev');
  if (tutPrev) {
    tutPrev.onclick = function(){
      if (tutStep > 0) {
        tutStep--;
        renderTut();
      }
    };
  }

  var tutNext = $('#tut-next');
  if (tutNext) {
    tutNext.onclick = function(){
      if (tutStep < TUTORIAL.length - 1) {
        tutStep++;
        renderTut();
      } else {
        closeOvl('ovl-tutorial');
      }
    };
  }

  /* --- Бестиарий --- */
  var btnBest = $('#btn-bestiary');
  if (btnBest) {
    btnBest.onclick = function(){
      if (typeof renderBestiary === 'function') renderBestiary();
      openOvl('ovl-bestiary');
    };
  }

  var btnBest2 = $('#btn-best2');
  if (btnBest2) {
    btnBest2.onclick = function(){
      if (typeof renderBestiary === 'function') renderBestiary();
      openOvl('ovl-bestiary');
    };
  }

  /* --- Инвентарь --- */
  var btnInv = $('#btn-inv');
  if (btnInv) {
    btnInv.onclick = function(){
      if (typeof renderInv === 'function') renderInv();
      openOvl('ovl-inv');
    };
  }

  /* --- Закрытие модалок --- */
  $$('.ovl [data-close]').forEach(function(b){
    b.addEventListener('click', function(){
      var ovl = b.closest('.ovl');
      if (ovl) ovl.classList.remove('on');
    });
  });

  $$('.ovl').forEach(function(o){
    o.addEventListener('click', function(e){
      if (e.target === o && !o.dataset.locked) {
        o.classList.remove('on');
      }
    });
  });

  /* --- Навыки --- */
  var btnSkills = $('#btn-skills');
  if (btnSkills) {
    btnSkills.onclick = function(){
      if (G.phase === 'combat') {
        log('Нельзя в бою!');
        return;
      }

      if (!G.hero) return;

      if (typeof renderSkillBook === 'function') renderSkillBook();
      openOvl('ovl-skills');
    };
  }

  /* --- Лист персонажа --- */
  var btnSheet = $('#btn-sheet');
  if (btnSheet) {
    btnSheet.onclick = function(){
      if (!G.hero) return;

      if (typeof renderSheet === 'function') renderSheet();
      openOvl('ovl-sheet');
    };
  }

  /* --- Журнал --- */
  var btnLog = $('#btn-log');
  if (btnLog) {
    btnLog.onclick = function(){
      if (typeof renderLog === 'function') renderLog();
      openOvl('ovl-log');
    };
  }

  /* --- Бой: клики мышью --- */
  var actions = $('#actions');
  if (actions) {
    actions.addEventListener('click', function(e){
      var b = e.target.closest('button[data-a]');
      if (b && !b.disabled) {
        onAction(b.dataset.a);
      }
    });
  }

  /* --- Финал --- */
  var endSaveBtn = $('#end-save');
  if (endSaveBtn) {
    endSaveBtn.onclick = function(){
      var inp = $('#end-inp');
      var n = inp ? inp.value.trim() : '';

      n = n || getUser() || 'Аноним';

      setUser(n);
      endSaveBtn.disabled = true;
      endSaveBtn.textContent = '⏳ Сохраняю...';

      saveScoreAsync(n, calcScore(), G.floor).then(function(){
        endSaveBtn.textContent = '✔ Сохранено!';
        renderScoresAsync();
      });
    };
  }

  var endRetry = $('#end-retry');
  if (endRetry) {
    endRetry.onclick = function(){
      clearRun();
      closeOvl('ovl-end');

      var cls = G.lastClass || 'knight';

      show('scr-game');
      startRun(cls);
    };
  }

  var endMenu = $('#end-menu');
  if (endMenu) {
    endMenu.onclick = function(){
      clearRun();
      closeOvl('ovl-end');

      show('scr-menu');
      renderScoresAsync();
      checkSave();

      var c = $('#btn-continue');
      if (c) c.style.display = 'none';
    };
  }

  /* ============================================
  КЛАВИАТУРА
  Фикс: теперь проверяется disabled кнопки
  и блокируется автоповтор клавиши
  ============================================ */
  document.addEventListener('keydown', function(e){
    if (typeof G === 'undefined') return;

    var active = document.activeElement;
    var isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');

    if (e.key === 'Escape') {
      if (isTyping) {
        active.blur();
        return;
      }

      $$('.ovl.on').forEach(function(o){
        if (['ovl-attrs', 'ovl-cards', 'ovl-quest'].indexOf(o.id) < 0) {
          closeOvl(o.id);
        }
      });

      return;
    }

    if (isTyping) return;

    if (e.key === 'i' || e.key === 'I' || e.key === 'ш' || e.key === 'Ш') {
      if (G.hero && G.phase !== 'over') {
        if (typeof renderInv === 'function') renderInv();
        openOvl('ovl-inv');
      }
      return;
    }

    function isOn(id){
      var o = $(id);
      return o && o.classList.contains('on');
    }

    if (e.key === 'Enter') {
      if (isOn('#ovl-end') || isOn('#ovl-attrs') || isOn('#ovl-cards') || isOn('#ovl-quest')) {
        return;
      }

      var n = $('#btn-next');
      if (n) {
        n.click();
        return;
      }

      var p2 = document.querySelector('#event-layer .ev .cbtn');
      if (p2) {
        p2.click();
        return;
      }
    }

    if (G.phase !== 'combat' || G.busy) return;

    /* Защита от зажатой клавиши */
    if (e.repeat) return;

    var m = {
      '1': 'atk',
      '2': 'skill',
      '3': 'skill2',
      '4': 'def',
      '5': 'pot',
      '6': 'flee'
    };

    var k = e.key;

    if (e.code && e.code.indexOf('Digit') === 0) {
      k = e.code.slice(5);
    }

    if (e.code && e.code.indexOf('Numpad') === 0) {
      k = e.code.slice(6);
    }

    var a = m[k];
    if (!a) return;

    /* Главное исправление: клавиша не работает, если кнопка на перезарядке */
    var btn = document.querySelector('.abtn[data-a="' + a + '"]');
    if (!btn || btn.disabled) return;

    if (e.preventDefault) e.preventDefault();

    onAction(a);
  });

  /* --- Туториал при первом запуске --- */
  if (!localStorage.getItem('kcigames_tut_seen')) {
    localStorage.setItem('kcigames_tut_seen', '1');

    if (typeof showTutorial === 'function') {
      setTimeout(showTutorial, 500);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}