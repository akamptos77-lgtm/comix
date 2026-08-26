'use strict';
/* ============================================
   14-RENDER-FX: canvas, частицы, снаряды,
   пузыри, цифры урона, статус-эффекты
   ============================================ */

var cv  = $('#stage'), ctx = cv.getContext('2d');
var T   = 0;
var TAU = Math.PI * 2;
var INK = '#171022';

var fx = {shake:0, flash:0, parts:[], floats:[], bursts:[], projectiles:[], bubbles:[]};

/* --- Создание эффектов --- */
function addFloat(x, y, txt, color, size){
  fx.floats.push({x:x, y:y, txt:txt, color:color, size:size||28, t:0, life:1.15});
}
function addBurst(x, y, word){
  fx.bursts.push({x:x, y:y, word:word, t:0, rot:rand(-.14, .14)});
}
function addParts(x, y, color, n){
  n = n || 14;
  for(var i = 0; i < n; i++){
    fx.parts.push({x:x, y:y, vx:rand(-1,1)*230, vy:rand(-1.5,.3)*230,
                   color:color, t:0, life:rand(.35,.75), r:rand(3,7)});
  }
}
function fireProjectile(type, x1, y1, x2, y2){
  return new Promise(function(resolve){
    fx.projectiles.push({type:type, x:x1, y:y1, x1:x1, y1:y1, x2:x2, y2:y2,
                         t:0, dur:.35, onHit:resolve});
    if(type === 'bullet') sfx.shot();
    else if(['fireball','arcane','lightning','icebolt','arrow'].indexOf(type) >= 0) sfx.magic();
    else sfx.swing();
  });
}

/* --- Хелперы рисования --- */
function rr(x, y, w, h, r, fill){
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill; ctx.fill(); ctx.stroke();
}
function cc(x, y, r, fill){
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = fill; ctx.fill(); ctx.stroke();
}
function ee(x, y, rx, ry, fill){
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  ctx.fillStyle = fill; ctx.fill(); ctx.stroke();
}
function dot(x, y, r, c){
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = c; ctx.fill();
}

/* === СТАТУС-ЭФФЕКТЫ НАД СУЩНОСТЯМИ === */

/* Оглушение: крутящиеся звёзды */
function drawStunFx(x, y, t){
  for(var i = 0; i < 3; i++){
    var a = t * 4 + i * (TAU / 3);
    var sx = x + Math.cos(a) * 22;
    var sy = y + Math.sin(a) * 8;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(t * 3 + i);
    ctx.fillStyle = '#ffd23d';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('⭐', 0, 5);
    ctx.restore();
  }
}

/* Заморозка: глыба льда */
function drawFreezeFx(x, y, scale){
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale || 1, scale || 1);
  ctx.fillStyle = 'rgba(159,216,255,.35)';
  ctx.strokeStyle = '#9fd8ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -70); ctx.lineTo(30, -30); ctx.lineTo(20, 0);
  ctx.lineTo(-20, 0); ctx.lineTo(-30, -30);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  /* Трещины */
  ctx.strokeStyle = 'rgba(255,255,255,.5)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-5, -60); ctx.lineTo(5, -40); ctx.lineTo(-3, -25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -50); ctx.lineTo(5, -35); ctx.stroke();
  ctx.restore();
}

/* Поджог: языки пламени */
function drawBurnFx(x, y, t){
  for(var i = 0; i < 5; i++){
    var a = t * 5 + i * 1.3;
    var fx2 = x - 25 + i * 12;
    var fy = y - 20 - Math.sin(a) * 10 - i * 5;
    var s = 4 + Math.sin(a * 1.5) * 2;
    ctx.fillStyle = i % 2 === 0 ? '#ff8b4a' : '#ffd23d';
    ctx.beginPath();
    ctx.ellipse(fx2, fy, s, s * 1.8, Math.sin(a) * .3, 0, TAU);
    ctx.fill();
  }
}

/* Яд: зелёные пузыри */
function drawPoisonFx(x, y, t){
  for(var i = 0; i < 4; i++){
    var a = t * 3 + i * 1.6;
    var bx = x - 18 + i * 12 + Math.sin(a) * 5;
    var by = y - 10 - ((a * 20) % 50);
    var s = 3 + Math.sin(a * 2) * 1.5;
    ctx.fillStyle = 'rgba(182,255,94,.6)';
    ctx.beginPath(); ctx.arc(bx, by, s, 0, TAU); ctx.fill();
  }
}

/* Щит: полупрозрачный купол */
function drawShieldFx(x, y, t){
  ctx.save();
  ctx.translate(x, y - 60);
  ctx.strokeStyle = 'rgba(159,216,255,' + (.5 + Math.sin(t * 4) * .2) + ')';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 55, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = 'rgba(159,216,255,.1)';
  ctx.beginPath();
  ctx.arc(0, 0, 55, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/* --- Отрисовка всех эффектов --- */
function drawFx(dt){
  var i;

  /* Частицы */
  for(i = 0; i < fx.parts.length; i++){
    var p = fx.parts[i];
    p.t += dt; p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 620*dt;
    ctx.globalAlpha = 1 - p.t/p.life;
    dot(p.x, p.y, p.r, p.color);
  }
  ctx.globalAlpha = 1;
  fx.parts = fx.parts.filter(function(p){ return p.t < p.life; });

  /* Всплывающие цифры */
  for(i = 0; i < fx.floats.length; i++){
    var f = fx.floats[i];
    f.t += dt; f.y -= 46*dt;
    ctx.globalAlpha = 1 - Math.max(0, (f.t - f.life*.55)/(f.life*.45));
    ctx.font = f.size + 'px "Russo One"';
    ctx.textAlign = 'center';
    ctx.lineWidth = 5; ctx.strokeStyle = INK;
    ctx.strokeText(f.txt, f.x, f.y);
    ctx.fillStyle = f.color;
    ctx.fillText(f.txt, f.x, f.y);
  }
  ctx.globalAlpha = 1;
  fx.floats = fx.floats.filter(function(f){ return f.t < f.life; });
  ctx.textAlign = 'left';

  /* Взрывы-звёзды */
  for(i = 0; i < fx.bursts.length; i++){
    var b = fx.bursts[i];
    b.t += dt;
    var k = Math.min(1, b.t/.15), r = 78*k;
    var al = b.t > .5 ? 1-(b.t-.5)/.3 : 1;
    if(al <= 0) continue;
    ctx.globalAlpha = al;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rot);
    ctx.beginPath();
    for(var j = 0; j < 24; j++){
      var rad = j%2 ? r*.62 : r, an = j/24*TAU;
      ctx[j ? 'lineTo' : 'moveTo'](Math.cos(an)*rad, Math.sin(an)*rad);
    }
    ctx.closePath();
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.font = '26px "Russo One"';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff4d5e';
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 5;
    ctx.strokeText(b.word, 0, 9);
    ctx.fillText(b.word, 0, 9);
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }
  fx.bursts = fx.bursts.filter(function(b){ return b.t < .8; });

  /* Вспышка экрана */
  if(fx.flash > 0){
    ctx.fillStyle = 'rgba(255,255,255,' + fx.flash + ')';
    ctx.fillRect(0, 0, 960, 430);
    fx.flash = Math.max(0, fx.flash - dt*1.4);
  }

  drawProjectiles(dt);
  drawBubbles(dt);
}

/* --- Снаряды --- */
function drawProjectiles(dt){
  fx.projectiles = fx.projectiles.filter(function(p){
    p.t += dt;
    var k = Math.min(1, p.t/p.dur);
    p.x = p.x1 + (p.x2-p.x1)*k;
    p.y = p.y1 + (p.y2-p.y1)*k;
    drawProjectile(p);
    if(p.t >= p.dur){ if(p.onHit) p.onHit(); return false; }
    return true;
  });
}

function drawProjectile(p){
  var x = p.x, y = p.y, i;

  if(p.type === 'fireball'){
    ctx.shadowColor = '#ff8b4a'; ctx.shadowBlur = 18;
    cc(x, y, 16, '#ff4d1e'); cc(x, y, 10, '#ffd23d');
    ctx.shadowBlur = 0;
    for(i = 1; i <= 4; i++){
      ctx.globalAlpha = .6 - .1*i;
      cc(x-(p.x2-p.x1)*.02*i, y-(p.y2-p.y1)*.02*i, 10-i*2, '#ff8b4a');
    }
    ctx.globalAlpha = 1;
  }
  else if(p.type === 'icebolt'){
    ctx.shadowColor = '#9fd8ff'; ctx.shadowBlur = 14;
    cc(x, y, 13, '#9fd8ff'); cc(x, y, 7, '#fff');
    ctx.shadowBlur = 0;
  }
  else if(p.type === 'arcane'){
    ctx.shadowColor = '#b66bff'; ctx.shadowBlur = 16;
    cc(x, y, 14, '#b66bff'); cc(x, y, 7, '#e8c8ff');
    ctx.shadowBlur = 0;
  }
  else if(p.type === 'lightning'){
    ctx.strokeStyle = '#ffd23d'; ctx.lineWidth = 3;
    ctx.shadowColor = '#ffd23d'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(p.x1, p.y1);
    for(i = 1; i <= 6; i++){
      var k = i/6;
      ctx.lineTo(p.x1+(p.x2-p.x1)*k+(Math.random()-.5)*20*(1-k),
                 p.y1+(p.y2-p.y1)*k+(Math.random()-.5)*20*(1-k));
    }
    ctx.stroke(); ctx.shadowBlur = 0;
    cc(x, y, 10, '#ffd23d');
  }
  else if(p.type === 'bullet'){
    ctx.fillStyle = '#c9a45c';
    ctx.shadowColor = '#ffd23d'; ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(x, y, 8, 4, Math.atan2(p.y2-p.y1, p.x2-p.x1), 0, TAU);
    ctx.fill(); ctx.shadowBlur = 0;
    for(i = 1; i <= 3; i++){
      ctx.globalAlpha = .4 - .1*i;
      cc(x-(p.x2-p.x1)*.015*i, y-(p.y2-p.y1)*.015*i, 3, '#888');
    }
    ctx.globalAlpha = 1;
  }
  else if(p.type === 'arrow'){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.atan2(p.y2-p.y1, p.x2-p.x1));
    ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(10, 0); ctx.stroke();
    ctx.fillStyle = '#c9c9c9';
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(4, -4); ctx.lineTo(4, 4);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  else if(p.type === 'poison'){
    ctx.shadowColor = '#b6ff5e'; ctx.shadowBlur = 12;
    cc(x, y, 12, '#6ba82f'); cc(x, y, 7, '#b6ff5e');
    ctx.shadowBlur = 0;
  }
}

/* --- Пузыри реакций врага --- */
function drawBubbles(dt){
  fx.bubbles = fx.bubbles.filter(function(b){
    b.t += dt;
    if(b.t >= b.life) return false;
    var al = b.t > b.life-.4 ? (b.life-b.t)/.4 : 1;
    ctx.globalAlpha = al;
    ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.font = '13px "Balsamiq Sans"';
    var w = ctx.measureText(b.txt).width + 30;
    var bx = b.x - w/2, by = b.y - 20;
    ctx.beginPath(); ctx.roundRect(bx, by, w, 36, 12); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(b.x-8, by+36); ctx.lineTo(b.x, by+48); ctx.lineTo(b.x+8, by+36);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK; ctx.textAlign = 'center';
    ctx.fillText(b.txt, b.x, by+22);
    ctx.globalAlpha = 1; ctx.textAlign = 'left';
    return true;
  });
}

/* --- Обновление анимаций сущностей --- */
function updEnt(en, dt){
  if(!en) return;
  var f = en.fx;
  if(f.lunge > 0) f.lunge -= dt;
  if(f.hurt  > 0) f.hurt  -= dt;
  if(f.enter > 0) f.enter = Math.max(0, f.enter - dt*2.2);
  if(en.dead)     f.death = Math.max(0, (f.death === undefined ? 1 : f.death) - dt*1.7);
}