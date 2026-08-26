'use strict';
/* ============================================
   18-RENDER-MAIN: отрисовка сущностей
   + статус-эффекты + главный игровой цикл
   ============================================ */

/* --- Отрисовка героя --- */
function drawHeroEnt(t){
  var h = G.hero; if(!h) return;
  var x = 225, y = 352;
  if(h.fx.lunge > 0) x += Math.sin((1-h.fx.lunge/.45)*Math.PI)*230;
  if(h.fx.hurt  > 0) x += (Math.random()-.5)*9;

  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.beginPath(); ctx.ellipse(x, 362, 52, 12, 0, 0, TAU); ctx.fill();

  ctx.save(); ctx.translate(x, y);
  if(h.dead){
    var k = Math.max(0, h.fx.death);
    ctx.globalAlpha = k; ctx.rotate((1-k)*.7); ctx.translate(0, (1-k)*36);
  }
  HERO_DRAW[h.cls](t, Math.sin(t*2.3)*2);
  ctx.restore();

  if(!h.dead){
    ctx.strokeStyle = INK; ctx.lineWidth = 4;
    var fr = h.hp / pMaxHp();
    ctx.fillStyle = '#111'; ctx.fillRect(x-42, y-150, 84, 13);
    ctx.fillStyle = fr < .3 ? '#ff4d5e' : '#3ecf6f';
    ctx.fillRect(x-40, y-148, 80*fr, 9);
    ctx.strokeRect(x-42, y-150, 84, 13);

    /* Статус-эффекты героя */
    var statusY = y - 175;
    if(h.shield){
      drawShieldFx(x, y, t);
    }
    if(h.defending){
      ctx.font = '20px serif'; ctx.fillText('🛡', x-52, y-120);
    }
    if(h.poison){
      drawPoisonFx(x, y-40, t);
      ctx.font = '16px serif'; ctx.textAlign = 'center';
      ctx.fillText('☠', x, statusY); statusY -= 20;
      ctx.textAlign = 'left';
    }
    if(h.burn){
      drawBurnFx(x, y-30, t);
      ctx.font = '16px serif'; ctx.textAlign = 'center';
      ctx.fillText('🔥', x, statusY); statusY -= 20;
      ctx.textAlign = 'left';
    }
  }

  /* Спутник */
  if(G.companion){
    ctx.save(); ctx.translate(x-80, y); ctx.scale(0.7, 0.7);
    if(G.companion.icon === '🛡️')     drawCompanionKnight(t);
    else if(G.companion.icon === '🐺') drawCompanionWolf(t);
    else if(G.companion.icon === '🧚') drawCompanionFairy(t);
    ctx.restore();
  }
}

/* --- Отрисовка врага --- */
function drawEnemyEnt(t){
  var e = G.enemy; if(!e) return;
  var x = 700, y = 352;
  if(e.fx.enter > 0) x += e.fx.enter * 520;
  if(e.fx.lunge > 0) x -= Math.sin((1-e.fx.lunge/.45)*Math.PI)*230;
  if(e.fx.hurt  > 0) x += (Math.random()-.5)*10;

  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.beginPath(); ctx.ellipse(x, 362, 58*(e.scale||1), 13, 0, 0, TAU); ctx.fill();

  ctx.save(); ctx.translate(x, y); ctx.scale(e.scale, e.scale);
  if(e.dead){
    var k = Math.max(0, e.fx.death);
    ctx.globalAlpha = k; ctx.rotate((1-k)*.8); ctx.translate(0, (1-k)*44);
  }
  (ENEMY_DRAW[e.id] || dSlime)(t);
  ctx.restore();

  if(!e.dead && e.fx.enter <= 0.3){
    ctx.strokeStyle = INK; ctx.lineWidth = 4;
    var top = y - 150*e.scale, fr = e.hp/e.maxHp;
    ctx.fillStyle = '#111'; ctx.fillRect(x-52, top, 104, 14);
    ctx.fillStyle = fr < .3 ? '#ff8d2e' : '#ff4d5e';
    ctx.fillRect(x-50, top+2, 100*fr, 10);
    ctx.strokeRect(x-52, top, 104, 14);

    ctx.font = '16px "Russo One"'; ctx.textAlign = 'center';
    ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    var nm = (e.boss ? (e.final ? '☠ ' : '👑 ') : e.elite ? '⭐ ' : '') + e.name;
    ctx.strokeText(nm, x, top-10); ctx.fillText(nm, x, top-10);

    if(e.nextAction && ACTION_LABELS[e.nextAction]){
      ctx.font = '13px "Balsamiq Sans"'; ctx.fillStyle = '#ffd23d';
      ctx.strokeText(ACTION_LABELS[e.nextAction], x, top+28);
      ctx.fillText(ACTION_LABELS[e.nextAction], x, top+28);
    }

    /* === СТАТУС-ЭФФЕКТЫ ВРАГА === */
    var statusY = top - 30;

    /* Оглушение: крутящиеся звёзды */
    if(e.stun > 0){
      drawStunFx(x, top - 40, T);
      ctx.font = '16px serif'; ctx.textAlign = 'center';
      ctx.fillText('💫', x, statusY); statusY -= 22;
      ctx.textAlign = 'left';
    }

    /* Заморозка: глыба льда */
    if(e.frozen && e.frozen > 0){
      drawFreezeFx(x, y - 40*e.scale, e.scale);
    }

    /* Поджог: языки пламени */
    if(e.burn && e.burn.turns > 0){
      drawBurnFx(x, y - 40*e.scale, T);
      ctx.font = '16px serif'; ctx.textAlign = 'center';
      ctx.fillText('🔥', x, statusY); statusY -= 22;
      ctx.textAlign = 'left';
    }

    /* Яд: зелёные пузыри */
    if(e.poison && e.poison.turns > 0){
      drawPoisonFx(x, y - 40*e.scale, T);
      ctx.font = '16px serif'; ctx.textAlign = 'center';
      ctx.fillText('☠️', x, statusY); statusY -= 22;
      ctx.textAlign = 'left';
    }

    /* Защита врага */
    if(e.defending){
      ctx.font = '24px serif'; ctx.fillText('🛡', x-60, y-120*e.scale);
    }

    ctx.textAlign = 'left';
  }
}

/* --- Главный цикл --- */
var last = 0;
function loop(ts){
  var dt = Math.min(.05, (ts-last)/1000 || 0);
  last = ts; T += dt;
  updEnt(G.hero, dt); updEnt(G.enemy, dt);
  fx.shake = Math.max(0, fx.shake - dt*34);
  ctx.save();
  if(fx.shake > 0) ctx.translate((Math.random()-.5)*fx.shake, (Math.random()-.5)*fx.shake);
  drawArena();
  if(G.hero){ drawHeroEnt(T); drawEnemyEnt(T); }
  drawFx(dt);
  ctx.restore();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);