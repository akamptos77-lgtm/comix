'use strict';
/* ============================================
   11c: СЕКРЕТНАЯ КОМНАТА — испытание памяти
   ИСПРАВЛЕНО: теперь ВИДЕН порядок рун
   ============================================ */
function openSecret(){
  var el=$('#event-layer');
  var runes=['🔥','❄️','⚡','☠️'];
  var seq=[ri(0,3),ri(0,3),ri(0,3)];
  var phase='show',pos=0;

  el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ ИСПЫТАНИЕ СТРАЖА</h3>'+
    '<div class="ev-anim">🗿</div>'+
    '<p id="sec-msg" style="font-size:16px;font-weight:700">👁️ Смотри: страж показывает порядок рун...</p>'+
    '<div id="sec-dots" style="font-size:22px;letter-spacing:8px;margin:6px 0">⬜⬜</div>'+
    '<div style="display:flex;gap:14px;justify-content:center;margin:16px 0">'+
    runes.map(function(r,i){
      return '<button class="sec-rune" data-r="'+i+'" style="font-size:36px;width:80px;height:80px;border:4px solid var(--ink);border-radius:14px;background:#fff;box-shadow:4px 4px 0 var(--ink);cursor:pointer;transition:all .15s" disabled>'+r+'</button>';
    }).join('')+
    '</div>'+
    '<p style="font-size:12px;opacity:.7">Успех — сокровище. Ошибка — страж пробуждается!</p></div>';

  var btns=el.querySelectorAll('.sec-rune');
  var dots=['⬜','⬜',''];
  function setDots(){var d=$('#sec-dots');if(d)d.textContent=dots.join('');}

  /* Яркая вспышка руны: жёлтый фон + свечение + увеличение */
  function flash(i,idx){
    var b=btns[i];
    b.style.background='var(--yel)';
    b.style.transform='scale(1.2)';
    b.style.boxShadow='0 0 18px var(--yel)';
    sfx.magic();
    dots[idx]='🟨';setDots();
    setTimeout(function(){
      b.style.background='#fff';
      b.style.transform='scale(1)';
      b.style.boxShadow='4px 4px 0 var(--ink)';
    },500);
  }

  /* Показ последовательности (медленнее и с подписью) */
  var step=0;
  var iv=setInterval(function(){
    if(step<seq.length){
      var msg=$('#sec-msg');
      if(msg)msg.textContent='👁️ Руна '+(step+1)+' из '+seq.length+'...';
      flash(seq[step],step);
      step++;
    } else {
      clearInterval(iv);
      phase='input';
      var msg2=$('#sec-msg');
      if(msg2)msg2.textContent='✍️ Теперь повтори порядок!';
      var d2=$('#sec-dots');if(d2)d2.textContent='❓❓❓';
      btns.forEach(function(b){b.disabled=false;});
    }
  },900);

  /* Ввод игрока */
  btns.forEach(function(b){
    b.onclick=function(){
      if(phase!=='input')return;
      var r=parseInt(this.dataset.r,10);
      var self=this;
      if(r===seq[pos]){
        self.style.background='var(--grn)';
        setTimeout(function(){self.style.background='#fff';},300);
        sfx.click();
        pos++;
        if(pos>=seq.length){
          phase='done';
          sfx.mystic();
          var rel=dropRelic(),html;
          if(rel){
            giveRelic(rel);
            html='<div class="ev-anim anim-glow">'+rel.i+'</div><div class="loot"><div><b>РЕЛИКВИЯ:</b> '+rel.n+'</div><div style="font-size:14px">'+rel.d+'</div></div>';
          } else {
            var it=dropItem(2);giveItem(it);
            var g=ri(60,120)+G.floor*2;G.gold+=g;
            html='<div class="ev-anim anim-glow">💰</div><div class="loot"><div>'+it.i+' '+it.n+'!</div><div>+'+g+' золота!</div></div>';
          }
          updateHUD();saveRun();
          el.innerHTML='<div class="ev"><h3 class="ev-title">🗝️ Страж доволен!</h3>'+html+'<button class="cbtn" id="btn-next" style="background:var(--yel)">Дальше ▼</button></div>';
          $('#btn-next').onclick=function(){sfx.click();afterEvent();};
        }
      } else {
        phase='done';
        log('❌ Ошибка! Страж пробуждается!');
        startCombat('elite',false);
      }
    };
  });
}