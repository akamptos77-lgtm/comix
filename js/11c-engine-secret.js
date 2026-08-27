'use strict';
/* ============================================
11c-ENGINE-SECRET: СЕКРЕТНАЯ КОМНАТА —
4 испытания стража, ВСЕ на скорость (таймеры)
============================================ */
var SEC_RUNES=['🔥','❄️','⚡','☠️'];
var SEC_BTN_STYLE='font-size:36px;width:80px;height:80px;border:4px solid var(--ink);border-radius:14px;background:#fff;box-shadow:4px 4px 0 var(--ink);cursor:pointer;transition:all .15s';

function openSecret(){
  pick([secretMemory,secretStopFlow,secretCatchRune,secretOddOne])();
}

/* --- Общие исходы --- */
function secretWin(){
  var el=$('#event-layer');
  var rel=dropRelic(),html;
  if(rel){
    giveRelic(rel);
    html='<div class="ev-anim anim-glow">'+rel.i+'</div><div class="loot"><div><b>РЕЛИКВИЯ:</b> '+rel.n+'</div><div style="font-size:14px">'+rel.d+'</div></div>';
  }else{
    var it=dropItem(2);giveItem(it);
    var g=ri(60,120)+G.floor*2;G.gold+=g;
    html='<div class="ev-anim anim-glow">💰</div><div class="loot"><div>'+it.i+' '+it.n+'!</div><div>+'+g+' золота!</div></div>';
  }
  updateHUD();saveRun();
  el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ Страж доволен!</h3>'+html+'<button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';
  $('#btn-next').onclick=function(){sfx.click();afterEvent();};
}
function secretLose(msg){
  log('❌ '+msg+' Страж пробуждается!');
  startCombat('elite',false);
}

/* --- Таймер: полоска + текст, по истечении — провал --- */
function timerHtml(){
  return '<div style="margin:12px auto 0;max-width:420px">'+
    '<div id="sec-time-txt" style="font-family:\'Russo One\';font-size:18px">⏱ 0.0</div>'+
    '<div style="height:12px;border:3px solid var(--ink);border-radius:8px;background:#fff;overflow:hidden">'+
    '<div id="sec-time-bar" style="height:100%;width:100%;background:var(--grn)"></div></div></div>';
}
function runCountdown(total,onExpire){
  var t0=Date.now();
  var iv=setInterval(function(){
    var left=total-(Date.now()-t0)/1000;
    var txt=$('#sec-time-txt'),bar=$('#sec-time-bar');
    if(left<=0){
      clearInterval(iv);
      if(txt)txt.textContent='⏱ 0.0';
      if(bar){bar.style.width='0%';bar.style.background='var(--red)';}
      onExpire();
      return;
    }
    if(txt)txt.textContent='⏱ '+left.toFixed(1);
    if(bar){
      var p=left/total*100;
      bar.style.width=p+'%';
      bar.style.background=p>50?'var(--grn)':(p>25?'var(--yel)':'var(--red)');
    }
  },100);
  return function(){clearInterval(iv);};
}

/* === ИСПЫТАНИЕ 1: ПАМЯТЬ (повтори порядок за 6 сек) === */
function secretMemory(){
  var el=$('#event-layer');
  var seq=[ri(0,3),ri(0,3),ri(0,3)];
  var phase='show',pos=0,stopTimer=null;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ: ПАМЯТЬ</h3>'+
    '<div class="ev-anim">🗿</div>'+
    '<p id="sec-msg" style="font-size:16px;font-weight:700">👁️ Смотри: страж показывает порядок рун...</p>'+
    '<div id="sec-dots" style="font-size:22px;letter-spacing:8px;margin:6px 0">⬜⬜</div>'+
    '<div style="display:flex;gap:14px;justify-content:center;margin:16px 0">'+
    SEC_RUNES.map(function(r,i){return'<button class="sec-rune" data-r="'+i+'" style="'+SEC_BTN_STYLE+'" disabled>'+r+'</button>';}).join('')+
    '</div>'+timerHtml()+
    '<p style="font-size:12px;opacity:.7">Успех — сокровище. Ошибка или таймаут — страж пробуждается!</p></div>';
  var btns=el.querySelectorAll('.sec-rune');
  var dots=['⬜','⬜',''];
  function setDots(){var d=$('#sec-dots');if(d)d.textContent=dots.join('');}
  function flash(i,idx){
    var b=btns[i];
    b.style.background='var(--yel)';b.style.transform='scale(1.2)';b.style.boxShadow='0 0 18px var(--yel)';
    sfx.magic();dots[idx]='🟨';setDots();
    setTimeout(function(){b.style.background='#fff';b.style.transform='scale(1)';b.style.boxShadow='4px 4px 0 var(--ink)';},500);
  }
  var step=0;
  var iv=setInterval(function(){
    if(step<seq.length){
      var msg=$('#sec-msg');if(msg)msg.textContent='👁️ Руна '+(step+1)+' из '+seq.length+'...';
      flash(seq[step],step);step++;
    }else{
      clearInterval(iv);phase='input';
      var msg2=$('#sec-msg');if(msg2)msg2.textContent='✍️ Повтори порядок! БЫСТРО!';
      var d2=$('#sec-dots');if(d2)d2.textContent='❓❓';
      dots=['','❓','❓'];
      btns.forEach(function(b){b.disabled=false;});
      stopTimer=runCountdown(6,function(){
        if(phase!=='done'){phase='done';secretLose('Время вышло!');}
      });
    }
  },800);
  btns.forEach(function(b){
    b.onclick=function(){
      if(phase!=='input')return;
      var r=parseInt(this.dataset.r,10),self=this;
      if(r===seq[pos]){
        self.style.background='var(--grn)';
        setTimeout(function(){self.style.background='#fff';},300);
        sfx.click();pos++;
        if(pos>=seq.length){
          phase='done';
          if(stopTimer)stopTimer();
          sfx.mystic();secretWin();
        }
      }else{
        phase='done';
        if(stopTimer)stopTimer();
        secretLose('Ошибка в порядке!');
      }
    };
  });
}

/* === ИСПЫТАНИЕ 2: СТОП-ПОТОК (успей за 7 сек) === */
function secretStopFlow(){
  var el=$('#event-layer');
  var target=ri(0,3),current=ri(0,3),done=false;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ: СТОП-ПОТОК</h3>'+
    '<div class="ev-anim">🗿</div>'+
    '<p style="font-size:16px;font-weight:700">Жми СТОП, когда в слоте будет: <span style="font-size:28px">'+SEC_RUNES[target]+'</span></p>'+
    '<div id="sf-slot" style="font-size:64px;margin:14px 0">'+SEC_RUNES[current]+'</div>'+
    '<button class="cbtn red" id="sf-stop" style="font-size:22px;padding:14px 40px">🛑 СТОП!</button>'+
    timerHtml()+'</div>';
  var slot=$('#sf-slot');
  var iv=setInterval(function(){
    if(done)return;
    current=ri(0,3);
    slot.textContent=SEC_RUNES[current];
  },220);
  var stopTimer=runCountdown(7,function(){
    if(done)return;done=true;clearInterval(iv);
    secretLose('Время вышло!');
  });
  $('#sf-stop').onclick=function(){
    if(done)return;
    done=true;clearInterval(iv);stopTimer();
    if(current===target){sfx.mystic();secretWin();}
    else secretLose('Не та руна!');
  };
}

/* === ИСПЫТАНИЕ 3: ПОЙМАЙ РУНУ (3 раунда, таймер сжимается) === */
function secretCatchRune(){
  var el=$('#event-layer');
  var round=0,total=3,stopTimer=null;
  var limits=[2.0,1.6,1.2];
  function nextRound(){
    round++;
    if(round>total){sfx.mystic();secretWin();return;}
    var target=ri(0,3),locked=false;
    el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ: ПОЙМАЙ РУНУ</h3>'+
      '<div class="ev-anim">🗿</div>'+
      '<p style="font-size:16px;font-weight:700">Раунд '+round+'/'+total+' — жми: <span style="font-size:28px">'+SEC_RUNES[target]+'</span></p>'+
      '<div id="cr-box" style="display:flex;gap:14px;justify-content:center;margin:16px 0"></div>'+
      timerHtml()+'</div>';
    var box=$('#cr-box');
    stopTimer=runCountdown(limits[round-1],function(){
      if(locked)return;locked=true;
      secretLose('Время вышло!');
    });
    shuffleArrLocal([0,1,2,3]).forEach(function(r){
      var b=document.createElement('button');
      b.textContent=SEC_RUNES[r];
      b.style.cssText=SEC_BTN_STYLE;
      b.onclick=function(){
        if(locked)return;locked=true;
        if(stopTimer)stopTimer();
        if(r===target){sfx.click();b.style.background='var(--grn)';setTimeout(nextRound,350);}
        else secretLose('Не та руна!');
      };
      box.appendChild(b);
    });
  }
  nextRound();
}

/* === ИСПЫТАНИЕ 4: НАЙДИ ЛИШНЮЮ (3 раунда на скорость) === */
function secretOddOne(){
  var el=$('#event-layer');
  var round=0,total=3,stopTimer=null;
  var limits=[2.5,2.0,1.5];
  function nextRound(){
    round++;
    if(round>total){sfx.mystic();secretWin();return;}
    var base=ri(0,3);
    var odd=(base+1+ri(0,2))%4;
    var oddPos=ri(0,8);
    var locked=false;
    el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ: НАЙДИ ЛИШНЮЮ</h3>'+
      '<div class="ev-anim">🗿</div>'+
      '<p style="font-size:16px;font-weight:700">Раунд '+round+'/'+total+' — кликни по отличающейся руне!</p>'+
      '<div id="oo-grid" style="display:grid;grid-template-columns:repeat(3,80px);gap:10px;justify-content:center;margin:16px 0"></div>'+
      timerHtml()+'</div>';
    var grid=$('#oo-grid');
    stopTimer=runCountdown(limits[round-1],function(){
      if(locked)return;locked=true;
      secretLose('Время вышло!');
    });
    for(var i=0;i<9;i++){
      (function(pos){
        var b=document.createElement('button');
        b.textContent=(pos===oddPos)?SEC_RUNES[odd]:SEC_RUNES[base];
        b.style.cssText=SEC_BTN_STYLE;
        b.onclick=function(){
          if(locked)return;locked=true;
          if(stopTimer)stopTimer();
          if(pos===oddPos){sfx.click();b.style.background='var(--grn)';setTimeout(nextRound,350);}
          else secretLose('Ошибка!');
        };
        grid.appendChild(b);
      })(i);
    }
  }
  nextRound();
}
function shuffleArrLocal(a){
  for(var i=a.length-1;i>0;i--){
    var j=ri(0,i),t=a[i];a[i]=a[j];a[j]=t;
  }
  return a;
}