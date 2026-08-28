'use strict';
/* 22-UI-INIT: ОБЯЗАТЕЛЬНЫЙ вход, имя закрепляется НАВСЕГДА */
function init(){
  if(typeof initTooltip==='function')initTooltip();
  if(!getUser()){ if(window.closeIntro)closeIntro(); openLoginGate(); }

  var hasSave=checkSave();
  if(typeof renderScoresAsync==='function')renderScoresAsync();
  if(typeof renderHeroCards==='function')renderHeroCards();
  if(typeof updateHUD==='function')updateHUD();

  var btnContinue=$('#btn-continue');
  if(btnContinue)btnContinue.style.display=hasSave?'inline-block':'none';

  var btnStart=$('#btn-start');
  if(btnStart)btnStart.onclick=function(){
    if(!getUser()){openLoginGate();return;}
    clearRun();if(typeof sfx!=='undefined'&&sfx.click)sfx.click();show('scr-hero');
  };
  if(btnContinue)btnContinue.onclick=function(){
    if(!getUser()){openLoginGate();return;}
    if(loadRun()){G.busy=false;if(typeof sfx!=='undefined'&&sfx.click)sfx.click();show('scr-game');
      if(typeof buildActions==='function')buildActions();
      if(typeof updateHUD==='function')updateHUD();
      if(typeof renderElixirs==='function')renderElixirs();
      if(G.phase==='combat'){var a=$('#actions');if(a)a.classList.remove('hidden');var x=$('#elixirs');if(x)x.classList.remove('hidden');if(typeof updateActions==='function')updateActions();}
      else{G.phase='doors';if(typeof renderDoors==='function')renderDoors();}
      log('📂 Забег восстановлен! Этаж '+G.floor);
    }else{log('Ошибка загрузки');show('scr-menu');}
  };
  var btnHeroback=$('#btn-heroback');
  if(btnHeroback)btnHeroback.onclick=function(){if(typeof sfx!=='undefined'&&sfx.click)sfx.click();show('scr-menu');checkSave();var c=$('#btn-continue');if(c)c.style.display=G.hasSave?'inline-block':'none';};
  var diffs=$('#diffs');
  if(diffs)diffs.addEventListener('click',function(e){var b=e.target.closest('.diff-pill');if(!b)return;G.diff=b.dataset.d;$$('.diff-pill').forEach(function(p){p.classList.toggle('sel',p===b);});});

  /* Имя закреплено навсегда — сменить нельзя */
  var btnLogin=$('#btn-login');
  if(btnLogin)btnLogin.onclick=function(){ if(getUser()){ log('👤 Имя закреплено навсегда: '+getUser()); } else openLoginGate(); };

  var btnTut=$('#btn-tutorial');if(btnTut)btnTut.onclick=function(){if(typeof showTutorial==='function')showTutorial();};
  var tutPrev=$('#tut-prev');if(tutPrev)tutPrev.onclick=function(){if(tutStep>0){tutStep--;renderTut();}};
  var tutNext=$('#tut-next');if(tutNext)tutNext.onclick=function(){if(tutStep<TUTORIAL.length-1){tutStep++;renderTut();}else closeOvl('ovl-tutorial');};
  var btnBest=$('#btn-bestiary');if(btnBest)btnBest.onclick=function(){if(typeof renderBestiary==='function')renderBestiary();openOvl('ovl-bestiary');};
  var btnBest2=$('#btn-best2');if(btnBest2)btnBest2.onclick=function(){if(typeof renderBestiary==='function')renderBestiary();openOvl('ovl-bestiary');};
  var btnInv=$('#btn-inv');if(btnInv)btnInv.onclick=function(){if(typeof renderInv==='function')renderInv();openOvl('ovl-inv');};
  var btnSkills=$('#btn-skills');if(btnSkills)btnSkills.onclick=function(){if(G.phase==='combat'){log('Нельзя в бою!');return;}if(!G.hero)return;if(typeof renderSkillBook==='function')renderSkillBook();openOvl('ovl-skills');};
  var btnSheet=$('#btn-sheet');if(btnSheet)btnSheet.onclick=function(){if(!G.hero)return;if(typeof renderSheet==='function')renderSheet();openOvl('ovl-sheet');};
  var btnLog=$('#btn-log');if(btnLog)btnLog.onclick=function(){if(typeof renderLog==='function')renderLog();openOvl('ovl-log');};

  $$('.ovl [data-close]').forEach(function(b){b.addEventListener('click',function(){var o=b.closest('.ovl');if(!o)return;if(['ovl-attrs','ovl-cards','ovl-quest','ovl-login'].indexOf(o.id)>=0)return;o.classList.remove('on');});});
  $$('.ovl').forEach(function(o){o.addEventListener('click',function(e){if(e.target===o&&!o.dataset.locked&&o.id!=='ovl-login')o.classList.remove('on');});});

  var actions=$('#actions');
  if(actions)actions.addEventListener('click',function(e){var b=e.target.closest('button[data-a]');if(b&&!b.disabled)onAction(b.dataset.a);});

  var endSaveBtn=$('#end-save');
  if(endSaveBtn)endSaveBtn.onclick=function(){
    var n=getUser()||'Аноним';
    endSaveBtn.disabled=true;endSaveBtn.textContent='⏳ Сохраняю...';
    saveScoreAsync(n,calcScore(),G.floor).then(function(){endSaveBtn.textContent='✔ Сохранено!';if(typeof renderScoresAsync==='function')renderScoresAsync();});
  };
  var endRetry=$('#end-retry');if(endRetry)endRetry.onclick=function(){clearRun();closeOvl('ovl-end');show('scr-game');startRun(G.lastClass||'knight');};
  var endMenu=$('#end-menu');if(endMenu)endMenu.onclick=function(){clearRun();closeOvl('ovl-end');show('scr-menu');if(typeof renderScoresAsync==='function')renderScoresAsync();checkSave();var c=$('#btn-continue');if(c)c.style.display='none';};

  document.addEventListener('keydown',function(e){
    var active=document.activeElement;var isTyping=active&&(active.tagName==='INPUT'||active.tagName==='TEXTAREA');
    if(e.key==='Escape'){if(isTyping){active.blur();return;}$$('.ovl.on').forEach(function(o){if(['ovl-attrs','ovl-cards','ovl-quest','ovl-login'].indexOf(o.id)<0)closeOvl(o.id);});return;}
    if(isTyping)return;
    if(e.key==='i'||e.key==='I'||e.key==='ш'||e.key==='Ш'){if(G.hero&&G.phase!=='over'){if(typeof renderInv==='function')renderInv();openOvl('ovl-inv');}return;}
    if(e.key==='Enter'){if(uiOn('#ovl-end')||uiOn('#ovl-attrs')||uiOn('#ovl-cards')||uiOn('#ovl-quest')||uiOn('#ovl-login'))return;var n=$('#btn-next');if(n&&!n.disabled){n.click();return;}var p2=document.querySelector('#event-layer .ev .cbtn:not(:disabled)');if(p2){p2.click();return;}}
    if(typeof G==='undefined'||G.phase!=='combat'||G.busy)return;
    if(e.repeat)return;
    var m={'1':'atk','2':'skill','3':'skill2','4':'def','5':'pot','6':'flee'};var k=e.key;
    if(e.code&&e.code.indexOf('Digit')===0)k=e.code.slice(5);
    if(e.code&&e.code.indexOf('Numpad')===0)k=e.code.slice(6);
    var a=m[k];if(!a)return;
    var btn=document.querySelector('.abtn[data-a="'+a+'"]');if(!btn||btn.disabled)return;
    if(e.preventDefault)e.preventDefault();onAction(a);
  });

  if(!localStorage.getItem('kcigames_tut_seen')){localStorage.setItem('kcigames_tut_seen','1');if(typeof showTutorial==='function')setTimeout(showTutorial,500);}
  refreshLoginLabel();
}
function uiOn(sel){var o=$(sel);return !!(o&&o.classList.contains('on'));}
function openLoginGate(){
  var ovl=$('#ovl-login');if(!ovl)return;
  ovl.dataset.locked='1';
  var inp=$('#login-inp');if(inp)inp.value='';
  if(!$('#login-gate-hint')&&ovl.querySelector('.panel')){
    var g=document.createElement('p');g.id='login-gate-hint';
    g.style.cssText='font-size:13px;color:#8a2222;margin:6px 0';
    g.textContent='Введите имя — оно закрепляется НАВСЕГДА, без него игра не запустится.';
    ovl.querySelector('.panel').insertBefore(g,ovl.querySelector('.panel').firstChild);
  }
  var cancel=$('#login-cancel');if(cancel)cancel.style.display='none';
  ovl.classList.add('on');
  var ok=$('#login-ok');
  if(ok)ok.onclick=function(){
    var i2=$('#login-inp');var n=i2?i2.value.trim():'';
    if(!n){if(i2)i2.focus();return;}
    setUser(n);refreshLoginLabel();closeOvl('ovl-login');
    if(typeof renderScoresAsync==='function')renderScoresAsync();
    if(window.playIntro)playIntro();
  };
  setTimeout(function(){var i=$('#login-inp');if(i)i.focus();},100);
}
function refreshLoginLabel(){var b=$('#btn-login');if(b)b.textContent=getUser()?'👤 '+getUser():'👤 Войти';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();