'use strict';
/* ============================================
   22-UI-INIT: Инициализация + Автосейв UI
   ============================================ */

function init(){
  initTooltip();
  
  // 1. Проверяем наличие сохранения
  var hasSave = checkSave();
  
  // 2. Рендерим меню
  renderScoresAsync(); // Асинхронный зал славы
  renderHeroCards();
  updateHUD();
  
  // 3. Показываем/скрываем кнопку "Продолжить"
  var btnContinue = $('#btn-continue');
  if (btnContinue) {
    btnContinue.style.display = hasSave ? 'inline-block' : 'none';
  }

  /* --- КНОПКИ МЕНЮ --- */
  var btnStart = $('#btn-start');
  if(btnStart) btnStart.onclick = function(){ 
    clearRun(); // Новая игра стирает старое сохранение
    ac(); sfx.click(); show('scr-hero'); 
  };

  var btnContinue = $('#btn-continue');
  if(btnContinue) btnContinue.onclick = function(){
    if (loadRun()) {
      ac(); sfx.click();
      show('scr-game');
      // Восстанавливаем UI
      buildActions();
      updateHUD();
      updateActions();
      renderElixirs();
      
      // Если мы были в бою, нужно перерисовать врага и героя
      if (G.phase === 'combat') {
        $('#actions').classList.remove('hidden');
        $('#elixirs').classList.remove('hidden');
        // Canvas сам перерисуется в цикле loop()
      } else if (G.phase === 'doors') {
        renderDoors();
      } else {
        // Если фаза неизвестна, сбрасываем на двери
        G.phase = 'doors';
        renderDoors();
      }
      log('📂 Забег восстановлен! Этаж ' + G.floor);
    } else {
      log('Ошибка загрузки сохранения');
      show('scr-menu');
    }
  };

  var btnHeroback = $('#btn-heroback');
  if(btnHeroback) btnHeroback.onclick = function(){ sfx.click(); show('scr-menu'); checkSave(); $('#btn-continue').style.display = G.hasSave?'inline-block':'none'; };

  /* --- СЛОЖНОСТЬ --- */
  var diffs = $('#diffs');
  if(diffs){
    diffs.addEventListener('click', function(e){
      var b = e.target.closest('.diff-pill');
      if(!b) return;
      sfx.click();
      G.diff = b.dataset.d;
      $$('.diff-pill').forEach(function(p){ p.classList.toggle('sel', p === b); });
    });
  }

  /* --- ВХОД --- */
  var btnLogin = $('#btn-login');
  if(btnLogin){
    btnLogin.onclick = function(){
      if(getUser()){ localStorage.removeItem(LU_USER); renderScoresAsync(); }
      else { openOvl('ovl-login'); setTimeout(function(){ var li=$('#login-inp'); if(li) li.focus(); },100); }
    };
  }
  var loginOk = $('#login-ok');
  if(loginOk) loginOk.onclick = function(){
    var n = $('#login-inp').value.trim();
    if(n){ setUser(n); renderScoresAsync(); closeOvl('ovl-login'); }
  };
  var loginCancel = $('#login-cancel');
  if(loginCancel) loginCancel.onclick = function(){ closeOvl('ovl-login'); };

  /* --- ТУТОРИАЛ --- */
  var btnTut = $('#btn-tutorial');
  if(btnTut) btnTut.onclick = showTutorial;
  var tutPrev = $('#tut-prev');
  if(tutPrev) tutPrev.onclick = function(){ if(tutStep>0){ tutStep--; renderTut(); } };
  var tutNext = $('#tut-next');
  if(tutNext) tutNext.onclick = function(){
    if(tutStep < TUTORIAL.length-1){ tutStep++; renderTut(); }
    else closeOvl('ovl-tutorial');
  };

  /* --- БЕСТИАРИЙ --- */
  var btnBest = $('#btn-bestiary');
  if(btnBest) btnBest.onclick = function(){ renderBestiary(); openOvl('ovl-bestiary'); };
  var btnBest2 = $('#btn-best2');
  if(btnBest2) btnBest2.onclick = function(){ renderBestiary(); openOvl('ovl-bestiary'); };

  /* --- ИНВЕНТАРЬ --- */
  var btnInv = $('#btn-inv');
  if(btnInv) btnInv.onclick = function(){ renderInv(); openOvl('ovl-inv'); };

  /* --- ЗАКРЫТИЕ МОДАЛОК --- */
  $$('.ovl [data-close]').forEach(function(b){
    b.addEventListener('click', function(){
      var ovl = b.closest('.ovl');
      if(ovl) ovl.classList.remove('on');
    });
  });
  $$('.ovl').forEach(function(o){
    o.addEventListener('click', function(e){
      if(e.target === o && !o.dataset.locked) o.classList.remove('on');
    });
  });

  /* --- НАВЫКИ --- */
  var btnSkills = $('#btn-skills');
  if(btnSkills){
    btnSkills.onclick = function(){
      if(G.phase === 'combat'){ log('Нельзя в бою!'); return; }
      if(!G.hero) return;
      renderSkillBook(); openOvl('ovl-skills');
    };
  }

  /* --- ЛИСТ ПЕРСОНАЖА --- */
  var btnSheet = $('#btn-sheet');
  if(btnSheet){
    btnSheet.onclick = function(){
      if(!G.hero) return;
      renderSheet(); openOvl('ovl-sheet');
    };
  }
  
  /* --- ЖУРНАЛ --- */
  var btnLog = $('#btn-log');
  if(btnLog) btnLog.onclick = function(){ renderLog(); openOvl('ovl-log'); };

  /* --- БОЙ --- */
  var actions = $('#actions');
  if(actions){
    actions.addEventListener('click', function(e){
      var b = e.target.closest('button[data-a]');
      if(b && !b.disabled) onAction(b.dataset.a);
    });
  }

  /* --- ФИНАЛ --- */
  var endSaveBtn = $('#end-save');
  if(endSaveBtn){
    endSaveBtn.onclick = function(){
      var n = $('#end-inp').value.trim() || getUser() || 'Аноним';
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
  if(endRetry){
    endRetry.onclick = function(){
      clearRun(); // Стираем сохранение при рестарте
      closeOvl('ovl-end');
      var cls = G.lastClass || 'knight';
      show('scr-game');
      startRun(cls);
    };
  }
  var endMenu = $('#end-menu');
  if(endMenu){
    endMenu.onclick = function(){ 
      clearRun(); // Стираем сохранение при выходе в меню
      closeOvl('ovl-end'); 
      show('scr-menu'); 
      renderScoresAsync(); 
      checkSave();
      $('#btn-continue').style.display = 'none';
    };
  }

  /* --- КЛАВИАТУРА --- */
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      $$('.ovl.on').forEach(function(o){
        if(['ovl-attrs','ovl-cards','ovl-quest'].indexOf(o.id) < 0) closeOvl(o.id);
      });
      return;
    }
    if(e.key === 'i' || e.key === 'I' || e.key === 'ш' || e.key === 'Ш'){
      if(G.hero && G.phase !== 'over'){ renderInv(); openOvl('ovl-inv'); }
      return;
    }
    if(e.key === 'Enter'){
      var n = $('#btn-next');
      var p2 = document.querySelector('#event-layer .ev .cbtn');
      if($('#ovl-end') && $('#ovl-end').classList.contains('on')) return;
      if(n){ n.click(); return; }
      if(p2 && !$('#ovl-cards').classList.contains('on') && !$('#ovl-attrs').classList.contains('on') && !$('#ovl-quest').classList.contains('on')){ p2.click(); return; }
    }
    if(G.phase !== 'combat' || G.busy) return;
    var m = {'1':'atk','2':'skill','3':'skill2','4':'def','5':'pot','6':'flee'};
    if(m[e.key]) onAction(m[e.key]);
  });

  /* --- ТУТОРИАЛ ПРИ ПЕРВОМ ЗАПУСКЕ --- */
  if(!localStorage.getItem('kcigames_tut_seen')){
    localStorage.setItem('kcigames_tut_seen','1');
    setTimeout(showTutorial, 500);
  }
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();