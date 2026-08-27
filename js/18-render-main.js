'use strict';
/* ============================================
18-RENDER-MAIN: сущности, СТАТУС-ЭФФЕКТЫ
текстом над героем и врагом, главный цикл
============================================ */
function drawStatusLines(x,yy,lines){
  if(!lines.length)return;
  ctx.font='12px "Balsamiq Sans"';
  ctx.textAlign='center';
  for(var i=0;i<lines.length;i++){
    var y=yy-i*16;
    ctx.lineWidth=3;ctx.strokeStyle='rgba(23,16,34,.9)';
    ctx.strokeText(lines[i],x,y);
    ctx.fillStyle='#fff';
    ctx.fillText(lines[i],x,y);
  }
  ctx.textAlign='left';
}
function heroStatusLines(h){
  var L=[];
  if(h.defending)L.push('🛡 защита: −55% урона');
  if(h.shield)L.push('🛡️ щит: поглотит удар');
  if(h.poison&&h.poison.turns>0)L.push('☠ яд: −'+h.poison.dmg+' HP ('+h.poison.turns+' х.)');
  if(h.burn&&h.burn.turns>0)L.push('🔥 огонь: −'+h.burn.dmg+' HP ('+h.burn.turns+' х.)');
  if(h.buffs.atk>0)L.push('⬆ атака +50% ('+h.buffs.atk+' х.)');
  if(h.buffs.rage>0)L.push('😡 ярость +30% ('+h.buffs.rage+' х.)');
  if(h.buffs.def>0)L.push('🛡 защита +50% ('+h.buffs.def+' х.)');
  if(h.buffs.dodge>0)L.push('💨 уворот +25 ('+h.buffs.dodge+' х.)');
  if(h.buffs.crit>0)L.push('🎯 крит ×2 ('+h.buffs.crit+' х.)');
  return L;
}
function enemyStatusLines(e){
  var L=[];
  if(e.stun>0)L.push('💫 оглушение: '+e.stun+' х.');
  if(e.frozen>0)L.push('🧊 заморозка: '+e.frozen+' х.');
  if(e.poison&&e.poison.turns>0)L.push('☠ яд: −'+e.poison.dmg+' HP ('+e.poison.turns+' х.)');
  if(e.burn&&e.burn.turns>0)L.push('🔥 огонь: −'+e.burn.dmg+' HP ('+e.burn.turns+' х.)');
  if(e.defending)L.push('🛡 защита: −50% урона');
  if(e.raged)L.push('😡 ярость: +40% атаки');
  if(e.dodge>0)L.push('💨 уворот: '+Math.round(e.dodge*100)+'%');
  return L;
}
function drawHeroEnt(t){
  var h=G.hero;if(!h)return;
  var x=225,y=352;
  if(h.fx.lunge>0)x+=Math.sin((1-h.fx.lunge/.45)*Math.PI)*230;
  if(h.fx.hurt>0)x+=(Math.random()-.5)*9;
  ctx.fillStyle='rgba(0,0,0,.4)';
  ctx.beginPath();ctx.ellipse(x,362,52,12,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(x,y);
  if(h.dead){
    var k=Math.max(0,h.fx.death);
    ctx.globalAlpha=k;ctx.rotate((1-k)*.7);ctx.translate(0,(1-k)*36);
  }
  HERO_DRAW[h.cls](t,Math.sin(t*2.3)*2);
  ctx.restore();
  if(!h.dead){
    ctx.strokeStyle=INK;ctx.lineWidth=4;
    var fr=h.hp/pMaxHp();
    ctx.fillStyle='#111';ctx.fillRect(x-42,y-150,84,13);
    ctx.fillStyle=fr<.3?'#ff4d5e':'#3ecf6f';
    ctx.fillRect(x-40,y-148,80*fr,9);
    ctx.strokeRect(x-42,y-150,84,13);
    if(h.shield)drawShieldFx(x,y,t);
    drawStatusLines(x,y-195,heroStatusLines(h));
  }
  if(G.companion){
    ctx.save();ctx.translate(x-80,y);ctx.scale(0.7,0.7);
    if(G.companion.icon==='🛡️')drawCompanionKnight(t);
    else if(G.companion.icon==='🐺')drawCompanionWolf(t);
    else if(G.companion.icon==='🧚')drawCompanionFairy(t);
    ctx.restore();
  }
}
function drawEnemyEnt(t){
  var e=G.enemy;if(!e)return;
  var x=700,y=352;
  if(e.fx.enter>0)x+=e.fx.enter*520;
  if(e.fx.lunge>0)x-=Math.sin((1-e.fx.lunge/.45)*Math.PI)*230;
  if(e.fx.hurt>0)x+=(Math.random()-.5)*10;
  ctx.fillStyle='rgba(0,0,0,.4)';
  ctx.beginPath();ctx.ellipse(x,362,58*(e.scale||1),13,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(x,y);ctx.scale(e.scale,e.scale);
  if(e.dead){
    var k=Math.max(0,e.fx.death);
    ctx.globalAlpha=k;ctx.rotate((1-k)*.8);ctx.translate(0,(1-k)*44);
  }
  (ENEMY_DRAW[e.id]||dSlime)(t);
  ctx.restore();
  if(!e.dead&&e.fx.enter<=0.3){
    ctx.strokeStyle=INK;ctx.lineWidth=4;
    /* полоска HP босса поднята выше модели */
    var top=y-(e.boss?205:150)*(e.scale||1),fr=e.hp/e.maxHp;
    ctx.fillStyle='#111';ctx.fillRect(x-52,top,104,14);
    ctx.fillStyle=fr<.3?'#ff8d2e':'#ff4d5e';
    ctx.fillRect(x-50,top+2,100*fr,10);
    ctx.strokeRect(x-52,top,104,14);
    ctx.font='16px "Russo One"';ctx.textAlign='center';
    ctx.fillStyle='#fff';ctx.strokeStyle=INK;ctx.lineWidth=4;
    var nm=(e.boss?(e.final?'☠ ':'👑 '):e.elite?'⭐ ':'')+e.name;
    ctx.strokeText(nm,x,top-10);ctx.fillText(nm,x,top-10);
    if(e.nextAction&&ACTION_LABELS[e.nextAction]){
      ctx.font='13px "Balsamiq Sans"';ctx.fillStyle='#ffd23d';
      ctx.strokeText(ACTION_LABELS[e.nextAction],x,top+28);
      ctx.fillText(ACTION_LABELS[e.nextAction],x,top+28);
    }
    if(e.stun>0)drawStunFx(x,top-40,T);
    if(e.frozen&&e.frozen>0)drawFreezeFx(x,y-40*e.scale,e.scale);
    if(e.burn&&e.burn.turns>0)drawBurnFx(x,y-40*e.scale,T);
    if(e.poison&&e.poison.turns>0)drawPoisonFx(x,y-40*e.scale,T);
    drawStatusLines(x,top-52,enemyStatusLines(e));
    ctx.textAlign='left';
  }
}
var last=0;
function loop(ts){
  var dt=Math.min(.05,(ts-last)/1000||0);
  last=ts;T+=dt;
  updEnt(G.hero,dt);updEnt(G.enemy,dt);
  fx.shake=Math.max(0,fx.shake-dt*34);
  ctx.save();
  if(fx.shake>0)ctx.translate((Math.random()-.5)*fx.shake,(Math.random()-.5)*fx.shake);
  drawArena();
  if(G.hero){drawHeroEnt(T);drawEnemyEnt(T);}
  drawFx(dt);
  ctx.restore();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);