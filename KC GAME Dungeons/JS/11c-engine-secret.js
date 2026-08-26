'use strict';
/* 11c: СЕКРЕТНАЯ КОМНАТА — испытание памяти (переопределяет openSecret) */
function openSecret(){
  var el=$('#event-layer');
  var runes=[{i:'🔥'},{i:'❄️'},{i:'⚡'},{i:'☠️'}];
  var seq=[ri(0,3),ri(0,3),ri(0,3)];
  var phase='show',pos=0;
  el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ СТРАЖА</h3>'+
    '<div class="ev-anim">🗿</div>'+
    '<p id="sec-msg">Страж сокровищ проверяет память. Следи за порядком рун!</p>'+
    '<div style="display:flex;gap:14px;justify-content:center;margin:16px 0">'+
    runes.map(function(r,i){return '<button class="cbtn sec-rune" data-r="'+i+'" style="font-size:36px;width:80px;height:80px;padding:0" disabled>'+r.i+'</button>';}).join('')+
    '</div>'+
    '<p style="font-size:12px;opacity:.7">Успех — сокровище. Ошибка — страж пробуждается!</p></div>';
  var btns=el.querySelectorAll('.sec-rune');
  function flash(i){
    var b=btns[i];
    b.style.background='var(--yel)';b.style.transform='scale(1.15)';sfx.click();
    setTimeout(function(){b.style.background='';b.style.transform='';},450);
  }
  var step=0;
  var iv=setInterval(function(){
    if(step<seq.length){flash(seq[step]);step++;}
    else{clearInterval(iv);phase='input';$('#sec-msg').textContent='Теперь повтори порядок!';
      btns.forEach(function(b){b.disabled=false;});}
  },700);
  btns.forEach(function(b){
    b.onclick=function(){
      if(phase!=='input')return;
      var r=parseInt(this.dataset.r,10);
      if(r===seq[pos]){
        flash(r);pos++;
        if(pos>=seq.length){
          phase='done';sfx.mystic();
          var rel=dropRelic(),html;
          if(rel){giveRelic(rel);
            html='<div class="ev-anim anim-glow">'+rel.i+'</div><div class="loot"><div><b>РЕЛИКВИЯ:</b> '+rel.n+'</div><div style="font-size:14px">'+rel.d+'</div></div>';
          }else{
            var it=dropItem(2);giveItem(it);
            var g=ri(60,120)+G.floor*2;G.gold+=g;
            html='<div class="ev-anim anim-glow">💰</div><div class="loot"><div>'+it.i+' '+it.n+'!</div><div>+'+g+' золота!</div></div>';
          }
          updateHUD();
          el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ Страж доволен!</h3>'+html+'<button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';
          $('#btn-next').onclick=function(){sfx.click();afterEvent();};
        }
      }else{
        phase='done';
        log('❌ Ошибка! Страж пробуждается!');
        startCombat('elite',false);
      }
    };
  });
}