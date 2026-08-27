'use strict';
/* ============================================
20-UI-INVENTORY: инвентарь, эликсиры,
сравнение, «уровень предмета» вместо «+1»
============================================ */
function itemLvl(it){return (it.tier||0)*3+(it.up||0);}
function lvlTag(it){
  var l=itemLvl(it);
  return l>0?' <span class="up-tag">ур.'+l+'</span>':'';
}
function compareTxt(it){
  var h=G.hero;
  var cur=null;
  if(it.slot==='ring'){cur=h.equip.ring1||h.equip.ring2||null;}
  else{cur=h.equip[it.slot];}
  if(!cur)return'Слот свободен — просто надень.';
  var keys={atk:'⚔️',def:'🛡️',hp:'❤️',crit:'🎯',dodge:'💨',vamp:'🩸'};
  var out=[];
  for(var k in keys){
    var a=cur.b[k]||0,b=it.b[k]||0;
    if(a||b){
      var d=Math.round((b-a)*100)/100;
      out.push(keys[k]+' '+(d>=0?'+':'')+d);
    }
  }
  return out.length?'Сравнение с '+cur.n+': '+out.join(', '):'Характеристики одинаковы.';
}
function renderElixirs(){
  var h=G.hero;if(!h)return;
  var el=$('#elixirs');if(!el)return;
  if(!h.elixirs.length){
    el.innerHTML='<p class="hint" style="text-align:center">Нет эликсиров</p>';
    el.classList.remove('hidden');
    return;
  }
  el.innerHTML=h.elixirs.map(function(et,i){
    return'<button class="ebtn" data-el="'+i+'" data-tip="'+ELIXIRS[et].n+': '+ELIXIRS[et].d+'">'+
      '<span class="ei">'+ELIXIRS[et].i+'</span>'+ELIXIRS[et].n+'<br><small>'+ELIXIRS[et].d+'</small></button>';
  }).join('');
  el.querySelectorAll('[data-el]').forEach(function(b){
    b.onclick=function(){useElixir(parseInt(this.dataset.el,10));};
  });
  el.classList.remove('hidden');
}
function useElixir(i){
  if(G.busy||G.phase!=='combat')return;
  var h=G.hero,e=G.enemy;
  if(!e||e.dead)return;
  var et=h.elixirs[i];if(!et)return;
  G.busy=true;
  h.elixirs.splice(i,1);
  var ex=ELIXIRS[et];
  enemyReact(['Что ты бросил?!','Эй, это не честно!','Ай!']);
  log('🧪 Брошен '+ex.n+'!');
  var projType=et==='freeze'?'icebolt':et==='burn'?'fireball':et==='thunder'?'lightning':et==='poison'?'poison':'arcane';
  fireProjectile(projType,225,320,700,320).then(function(){
    if(et==='stun'){stunEnemy(2);}
    else if(et==='freeze'){freezeEnemy(Math.round(getHeroAtk()*.8));}
    else if(et==='burn'){burnEnemy(3,Math.max(3,Math.round(getHeroAtk()*.4)));return heroStrike(.5,{el:'fire',word:'ГОРИ!'});}
    else if(et==='poison'){poisonEnemy(3,Math.max(3,Math.round(getHeroAtk()*.35)));}
    else if(et==='heal'){healHero(.4);}
    else if(et==='thunder'){return heroStrike(1.8,{el:'lightning',word:'ГРОМ!',big:true});}
    return Promise.resolve();
  }).then(function(){
    renderElixirs();
    if(e.dead)return winCombat();
    G.busy=false;
    updateHUD();
  });
}
function renderInv(){
  var h=G.hero;if(!h)return;
  var slots=['weapon','armor','helmet','boots','gloves','ring1','ring2','amulet'];
  var equipRow=$('#equipRow');
  if(equipRow){
    equipRow.innerHTML=slots.map(function(sl){
      var it=h.equip[sl];
      var tip=it?it.n+': '+bonusTxt(it)+(it.cursed?' ПРОКЛЯТО: '+it.curse:'')+'. Клик чтобы снять.':SLOT_NAME[sl]+': пусто.';
      return'<div class="inv-slot '+(it?'':'empty')+(it&&it.cursed?' cursed':'')+'" data-slot="'+sl+'" data-tip="'+tip+'">'+
        '<small>'+SLOT_NAME[sl]+'</small>'+
        (it?'<div class="ii">'+it.i+'</div><b>'+it.n+lvlTag(it)+'</b><span>'+bonusTxt(it)+'</span>'+
        (it.cursed?'<span style="color:#8a1eff">☠ ПРОКЛЯТО</span>':'')+
        '<small style="color:#8a2222">снять ↩</small>'
        :'<div class="ii">➖</div><b>пусто</b>')+
        '</div>';
    }).join('');
  }
  var elixCap=$('#elix-cap');if(elixCap)elixCap.textContent=h.elixirCap;
  var bagCount=$('#bag-count');if(bagCount)bagCount.textContent=h.inv.length;
  var bagRow=$('#bagRow');
  if(bagRow){
    bagRow.innerHTML=h.inv.length?
      h.inv.map(function(it,i){
        var suitable=!it.cls||it.cls.indexOf(h.cls)>=0;
        var cmp=compareTxt(it);
        var tip=it.cursed?it.n+': '+bonusTxt(it)+'. ПРОКЛЯТИЕ: '+it.curse+'. '+cmp:it.n+': '+bonusTxt(it)+'. '+SLOT_NAME[it.slot]+'. '+cmp;
        return'<div class="bag-item rar'+it.rar+(it.cursed?' cursed':'')+'" data-tip="'+tip+'">'+
          '<b>'+it.i+' '+it.n+lvlTag(it)+' <span class="rar-tag">'+RAR[it.rar]+'</span></b>'+
          '<span>'+bonusTxt(it)+(it.el?' '+elemLabel(it.el):'')+'</span>'+
          '<small>'+SLOT_NAME[it.slot]+(!suitable?' ⚠ не твой класс':'')+(it.cursed?' ☠ '+it.curse:'')+'</small>'+
          '<small style="color:#4a6b2f">'+cmp+'</small>'+
          '<div class="bag-actions">'+
          '<button class="cbtn small grn" data-eq="'+i+'">Надеть</button>'+
          '<button class="cbtn small ghost" data-sell="'+i+'">'+sellPrice(it)+'💰</button>'+
          '</div></div>';
      }).join('')
      :'<p class="hint" style="grid-column:1/-1">Сумка пуста.</p>';
  }
  var mats=Object.keys(G.materials).filter(function(m){return G.materials[m]>0;});
  var matsHtml=mats.length?
    '<div class="bag-title">🔮 ИНГРЕДИЕНТЫ</div><div class="bag-row">'+
    mats.map(function(m){
      return'<div class="bag-item" data-tip="Ингредиент для крафта ⚒️"><b>🔮 '+m+'</b><span>×'+G.materials[m]+'</span></div>';
    }).join('')+'</div>':'';
  var invStats=$('#invStats');
  if(invStats){
    invStats.innerHTML=
      '⚔️ Атака: <b>'+pAtk()+'</b> · 🛡️ Защита: <b>'+pDef()+'</b> · ❤️ HP: <b>'+pMaxHp()+'</b><br>'+
      '🎯 Крит: <b>'+pCrit()+'%</b> · 💨 Уворот: <b>'+pDodge()+'%</b> · 🩸 Вамп: <b>'+Math.round(pVamp()*100)+'%</b><br>'+
      '💪'+h.stats.str+' 🏹'+h.stats.agi+' 🔮'+h.stats.int+' ❤️'+h.stats.vit+
      ' · 🧪 Эликсиры: '+h.elixirs.length+'/'+h.elixirCap+matsHtml;
  }
  $$('#equipRow .inv-slot').forEach(function(el){
    el.onclick=function(){
      var sl=this.dataset.slot,it=h.equip[sl];
      if(!it)return;
      h.inv.push(it);h.equip[sl]=null;
      clampHp();sfx.click();renderInv();updateHUD();
    };
  });
  $$('#bagRow [data-eq]').forEach(function(el){
    el.onclick=function(){
      var i=parseInt(this.dataset.eq,10),it=h.inv[i];
      if(!it)return;
      var targetSlot=it.slot;
      if(it.slot==='ring'){
        if(!h.equip.ring1)targetSlot='ring1';
        else if(!h.equip.ring2)targetSlot='ring2';
        else targetSlot='ring1';
      }
      var prev=h.equip[targetSlot];
      h.equip[targetSlot]=it;
      h.inv.splice(i,1);
      if(prev)h.inv.push(prev);
      if(it.cursed&&it.curseFx)it.curseFx(h);
      clampHp();sfx.gold();renderInv();updateHUD();
    };
  });
  $$('#bagRow [data-sell]').forEach(function(el){
    el.onclick=function(){
      var i=parseInt(this.dataset.sell,10),it=h.inv[i];
      if(!it)return;
      var price=sellPrice(it);
      h.inv.splice(i,1);
      G.gold+=price;
      log('💰 Продано: '+it.n+' за '+price+'💰');
      sfx.gold();renderInv();updateHUD();
    };
  });
}