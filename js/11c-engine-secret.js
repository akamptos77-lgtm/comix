'use strict';
/* ============================================
11c-ENGINE-SECRET: СЕКРЕТНАЯ КОМНАТА —
4 РАЗНЫХ испытания стража (выбираются случайно)
============================================ */
function openSecret(){
  var games=[secretMemory,secretStopFlow,secretCatchRune,secretOddOne];
  pick(games)();
}
function shuffleArr(a){
  for(var i=a.length-1;i>0;i--){
    var j=ri(0,i),t=a[i];a[i]=a[j];a[j]=t;
  }
  return a;
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
var SEC_RUNES=['🔥','❄️','⚡','☠️'];
var SEC_BTN_STYLE='font-size:36px;width:80px;height:80px;border:4px solid var(--ink);border-radius:14px;background:#fff;box-shadow:4px 4px 0 var(--ink);cursor:pointer;transition:all .15s';

/* === ИСПЫТАНИЕ 1: ПАМЯТЬ (повтори порядок) === */
function secretMemory(){
  var el=$('#event-layer');
  var seq=[ri(0,3),ri(0,3),ri(0,3)];
  var phase='show',pos=0;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ: ПАМЯТЬ</h3>'+
    '<div class="ev-anim">🗿</div>'+
    '<p id="sec-msg" style="font-size:16px;font-weight:700">👁️ Смотри: страж показывает порядок рун...</p>'+
    '<div id="sec-dots" style="font-size:22px;letter-spacing:8px;margin:6px 0">⬜⬜</div>'+
    '<div style="display:flex;gap:14px;justify-content:center;margin:16px 0">'+
    SEC_RUNES.map(function(r,i){return'<button class="sec-rune" data-r="'+i+'" style="'+SEC_BTN_STYLE+'" disabled>'+r+'</button>';}).join('')+
    '</div><p style="font-size:12px;opacity:.7">Успех — сокровище. Ошибка — страж пробуждается!</p></div>';
  var btns=el.querySelectorAll('.sec-rune');
  var dots=['','⬜',''];
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
      var msg2=$('#sec-msg');if(msg2)msg2.textContent='✍️ Теперь повтори порядок!';
      var d2=$('#sec-dots');if(d2)d2.textContent='❓❓';
      dots=['❓','❓','❓'];
      btns.forEach(function(b){b.disabled=false;});
    }
  },900);
  btns.forEach(function(b){
    b.onclick=function(){
      if(phase!=='input')return;
      var r=parseInt(this.dataset.r,10),self=this;
      if(r===seq[pos]){
        self.style.background='var(--grn)';
        setTimeout(function(){self.style.background='#fff';},300);
        sfx.click();pos++;
        if(pos>=seq.length){phase='done';sfx.mystic();secretWin();}
      }else{
        phase='done';secretLose('Ошибка в порядке!');
      }
    };
  });
}

/* === ИСПЫТАНИЕ 2: СТОП-ПОТОК (останови на нужной руне) === */
function secretStopFlow(){
  var el=$('#event-layer');
  var target=ri(0,3),current=ri(0,3),done=false;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ: СТОП-ПОТОК</h3>'+
    '<div class="ev-anim">🗿</div>'+
    '<p style="font-size:16px;font-weight:700">Жми СТОП, когда в слоте будет: <span style="font-size:28px">'+SEC_RUNES[target]+'</span></p>'+
    '<div id="sf-slot" style="font-size:64px;margin:14px 0">'+SEC_RUNES[current]+'</div>'+
    '<button class="cbtn red" id="sf-stop" style="font-size:22px;padding:14px 40px">🛑 СТОП!</button></div>';
  var slot=$('#sf-slot');
  var iv=setInterval(function(){
    if(done)return;
    current=ri(0,3);
    slot.textContent=SEC_RUNES[current];
  },220);
  $('#sf-stop').onclick=function(){
    if(done)return;
    done=true;clearInterval(iv);
    if(current===target){sfx.mystic();secretWin();}
    else secretLose('Не та руна!');
  };
}

/* === ИСПЫТАНИЕ 3: ПОЙМАЙ РУНУ (3 раунда на время) === */
function secretCatchRune(){
  var el=$('#event-layer');
  var round=0,total=3;
  function nextRound(){
    round++;
    if(round>total){sfx.mystic();secretWin();return;}
    var target=ri(0,3),locked=false;
    var timeLimit=2400-round*500;
    el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ: ПОЙМАЙ РУНУ</h3>'+
      '<div class="ev-anim">🗿</div>'+
      '<p style="font-size:16px;font-weight:700">Раунд '+round+'/'+total+' — жми: <span style="font-size:28px">'+SEC_RUNES[target]+'</span></p>'+
      '<div id="cr-box" style="display:flex;gap:14px;justify-content:center;margin:16px 0"></div></div>';
    var box=$('#cr-box');
    var to=setTimeout(function(){if(!locked){locked=true;secretLose('Слишком медленно!');}},timeLimit);
    shuffleArr([0,1,2,3]).forEach(function(r){
      var b=document.createElement('button');
      b.textContent=SEC_RUNES[r];
      b.style.cssText=SEC_BTN_STYLE;
      b.onclick=function(){
        if(locked)return;locked=true;clearTimeout(to);
        if(r===target){sfx.click();b.style.background='var(--grn)';setTimeout(nextRound,350);}
        else secretLose('Не та руна!');
      };
      box.appendChild(b);
    });
  }
  nextRound();
}

/* === ИСПЫТАНИЕ 4: НАЙДИ ЛИШНЮЮ (3 раунда на время) === */
function secretOddOne(){
  var el=$('#event-layer');
  var round=0,total=3;
  function nextRound(){
    round++;
    if(round>total){sfx.mystic();secretWin();return;}
    var base=ri(0,3);
    var odd=(base+1+ri(0,2))%4;
    var oddPos=ri(0,8);
    var locked=false;
    var timeLimit=3000-round*700;
    el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ: НАЙДИ ЛИШНЮЮ</h3>'+
      '<div class="ev-anim">🗿</div>'+
      '<p style="font-size:16px;font-weight:700">Раунд '+round+'/'+total+' — кликни по отличающейся руне!</p>'+
      '<div id="oo-grid" style="display:grid;grid-template-columns:repeat(3,80px);gap:10px;justify-content:center;margin:16px 0"></div></div>';
    var grid=$('#oo-grid');
    var to=setTimeout(function(){if(!locked){locked=true;secretLose('Слишком медленно!');}},timeLimit);
    for(var i=0;i<9;i++){
      (function(pos){
        var b=document.createElement('button');
        b.textContent=(pos===oddPos)?SEC_RUNES[odd]:SEC_RUNES[base];
        b.style.cssText=SEC_BTN_STYLE;
        b.onclick=function(){
          if(locked)return;locked=true;clearTimeout(to);
          if(pos===oddPos){sfx.click();b.style.background='var(--grn)';setTimeout(nextRound,350);}
          else secretLose('Ошибка!');
        };
        grid.appendChild(b);
      })(i);
    }
  }
  nextRound();
}