'use strict';
/* ============================================
   15-RENDER-ARENA: арена + 10 биомов
   ============================================ */

function drawArena(){
  var bio = getBiome(G.floor);
  var g = ctx.createLinearGradient(0, 0, 0, 430);
  g.addColorStop(0, bio.bg[0]);
  g.addColorStop(1, bio.bg[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 960, 430);
  drawScene(bio.scene);
  ctx.fillStyle = bio.ground;
  ctx.fillRect(0, 352, 960, 78);
  ctx.strokeStyle = bio.acc + '44';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 352); ctx.lineTo(960, 352); ctx.stroke();
}

function drawScene(s){
  if(s === 'dungeon')  drawDungeon();
  else if(s === 'crypt')    drawCrypt();
  else if(s === 'road')     drawRoad();
  else if(s === 'forest')   drawForest();
  else if(s === 'swamp')    drawSwamp();
  else if(s === 'mountain') drawMountain();
  else if(s === 'volcano')  drawVolcano();
  else if(s === 'ice')      drawIce();
  else if(s === 'abyss')    drawAbyss();
  else if(s === 'void')     drawVoid();
}

/* --- 1. Подземелье --- */
function drawDungeon(){
  ctx.fillStyle = '#2a2040';
  for(var i = 0; i < 6; i++) ctx.fillRect(i*160, 80, 140, 272);
  ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 2;
  for(var j = 0; j < 6; j++){
    ctx.strokeRect(j*160+10, 90, 120, 60);
    ctx.strokeRect(j*160+10, 160, 120, 60);
    ctx.strokeRect(j*160+10, 230, 120, 60);
  }
  [120, 480, 840].forEach(function(tx){
    ctx.fillStyle = '#5b3b1e'; ctx.fillRect(tx-4, 180, 8, 60);
    var f = Math.sin(T*13+tx)*3;
    ctx.fillStyle = '#ff9d2e';
    ctx.beginPath(); ctx.arc(tx, 170+f*.4, 11+f*.5, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ffd23d';
    ctx.beginPath(); ctx.arc(tx, 168+f*.4, 6, 0, TAU); ctx.fill();
  });
  ctx.strokeStyle = '#5a5a6a'; ctx.lineWidth = 3;
  [200, 700].forEach(function(cx){
    ctx.beginPath(); ctx.moveTo(cx, 80); ctx.lineTo(cx, 140); ctx.stroke();
    for(var i = 0; i < 3; i++){
      ctx.beginPath(); ctx.arc(cx, 90+i*20, 6, 0, TAU); ctx.stroke();
    }
  });
}

/* --- 2. Склеп --- */
function drawCrypt(){
  ctx.fillStyle = '#1a2a1f'; ctx.fillRect(0, 200, 960, 152);
  ctx.fillStyle = '#3a4a3f';
  [100, 300, 500, 700, 880].forEach(function(gx){
    ctx.beginPath(); ctx.roundRect(gx-25, 240, 50, 100, 10); ctx.fill();
    ctx.strokeStyle = '#2a3a2f'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#2a3a2f';
    ctx.fillRect(gx-15, 260, 30, 4);
    ctx.fillRect(gx-2, 250, 4, 50);
    ctx.fillStyle = '#3a4a3f';
  });
  ctx.fillStyle = 'rgba(126,242,154,.08)';
  for(var i = 0; i < 5; i++){
    var fx2 = 100+i*200+Math.sin(T+i)*30;
    ctx.beginPath(); ctx.ellipse(fx2, 320, 80, 25, 0, 0, TAU); ctx.fill();
  }
  [180, 600].forEach(function(sx){
    ctx.fillStyle = '#e8e8d8'; ctx.fillRect(sx-3, 280, 6, 30);
    ctx.fillStyle = '#ffd23d';
    ctx.beginPath(); ctx.arc(sx, 276, 4, 0, TAU); ctx.fill();
  });
}

/* --- 3. Дорога разбойников --- */
function drawRoad(){
  ctx.fillStyle = '#8ab4e8'; ctx.fillRect(0, 0, 960, 200);
  ctx.fillStyle = '#ffd23d';
  ctx.beginPath(); ctx.arc(800, 70, 40, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  for(var i = 0; i < 3; i++){
    var cx = 150+i*300+Math.sin(T*.3+i)*20;
    ctx.beginPath(); ctx.ellipse(cx, 60+i*30, 60, 18, 0, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = '#7a9a4a';
  ctx.fillRect(0, 200, 300, 152); ctx.fillRect(660, 200, 300, 152);
  ctx.fillStyle = '#6a8a3a';
  for(var j = 0; j < 8; j++){
    ctx.fillRect(20+j*36, 210, 4, 30);
    ctx.fillRect(680+j*36, 210, 4, 30);
  }
  ctx.fillStyle = '#8a7a5a';
  ctx.beginPath();
  ctx.moveTo(380, 352); ctx.lineTo(580, 352);
  ctx.lineTo(520, 200); ctx.lineTo(440, 200);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#6a5a3a'; ctx.lineWidth = 3;
  ctx.setLineDash([12, 8]);
  ctx.beginPath(); ctx.moveTo(480, 352); ctx.lineTo(480, 200); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(700, 280, 80, 40);
  ctx.fillStyle = '#4a3a1a';
  ctx.beginPath(); ctx.arc(720, 320, 15, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(760, 320, 15, 0, TAU); ctx.fill();
  [80, 880].forEach(function(tx){
    ctx.fillStyle = '#5a3a1a'; ctx.fillRect(tx-8, 240, 16, 80);
    ctx.fillStyle = '#3a6a2a';
    ctx.beginPath(); ctx.arc(tx, 220, 40, 0, TAU); ctx.fill();
  });
}

/* --- 4. Тёмный лес --- */
function drawForest(){
  ctx.fillStyle = '#e8e8d8';
  ctx.beginPath(); ctx.arc(800, 80, 30, 0, TAU); ctx.fill();
  for(var i = 0; i < 8; i++){
    var tx = 60+i*120;
    ctx.fillStyle = '#2a1a0a'; ctx.fillRect(tx-10, 150, 20, 202);
    ctx.fillStyle = '#0a2a0a';
    ctx.beginPath(); ctx.moveTo(tx, 100); ctx.lineTo(tx-50, 200); ctx.lineTo(tx+50, 200);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(tx, 80); ctx.lineTo(tx-40, 160); ctx.lineTo(tx+40, 160);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#ffd23d';
  for(var j = 0; j < 10; j++){
    var fx2 = 80+j*95+Math.sin(T*2+j)*20;
    var fy  = 200+Math.cos(T*1.5+j)*30;
    ctx.globalAlpha = .5+Math.sin(T*3+j)*.3;
    ctx.beginPath(); ctx.arc(fx2, fy, 2, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* --- 5. Гнилое болото --- */
function drawSwamp(){
  ctx.fillStyle = '#1a2510'; ctx.fillRect(0, 250, 960, 102);
  ctx.fillStyle = '#2a3518';
  [150, 400, 650, 850].forEach(function(kx){
    ctx.beginPath(); ctx.ellipse(kx, 330, 50, 18, 0, 0, TAU); ctx.fill();
  });
  ctx.strokeStyle = '#4a5a2a'; ctx.lineWidth = 3;
  for(var i = 0; i < 8; i++){
    var rx = 60+i*120;
    ctx.beginPath(); ctx.moveTo(rx, 350);
    ctx.lineTo(rx+Math.sin(T+i)*5, 250); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx+8, 350);
    ctx.lineTo(rx+8+Math.sin(T+i+1)*5, 260); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(182,227,94,.07)';
  for(var j = 0; j < 4; j++){
    var fx3 = 150+j*250+Math.sin(T*.5+j)*40;
    ctx.beginPath(); ctx.ellipse(fx3, 300, 100, 25, 0, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = 'rgba(182,227,94,.3)';
  for(var k = 0; k < 6; k++){
    var bx = 120+k*150;
    var by = 320-((T*20+k*30)%50);
    ctx.beginPath(); ctx.arc(bx, by, 3+k%3, 0, TAU); ctx.fill();
  }
}

/* --- 6. Горные пики --- */
function drawMountain(){
  ctx.fillStyle = '#7a8a9a';
  ctx.beginPath(); ctx.moveTo(0, 352); ctx.lineTo(200, 100); ctx.lineTo(400, 352);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(300, 352); ctx.lineTo(500, 60); ctx.lineTo(700, 352);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(600, 352); ctx.lineTo(800, 130); ctx.lineTo(960, 352);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8e8f0';
  ctx.beginPath(); ctx.moveTo(170, 140); ctx.lineTo(200, 100); ctx.lineTo(230, 140);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(470, 100); ctx.lineTo(500, 60); ctx.lineTo(530, 100);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(770, 165); ctx.lineTo(800, 130); ctx.lineTo(830, 165);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  for(var i = 0; i < 3; i++){
    var cx = 150+i*300+Math.sin(T*.3+i)*20;
    ctx.beginPath(); ctx.ellipse(cx, 80+i*25, 60, 18, 0, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = '#3a3a4a'; ctx.lineWidth = 2;
  var ex = 480+Math.sin(T)*100;
  ctx.beginPath(); ctx.moveTo(ex-15, 80);
  ctx.quadraticCurveTo(ex, 70, ex+15, 80); ctx.stroke();
}

/* --- 7. Огненное сердце --- */
function drawVolcano(){
  ctx.fillStyle = '#3a2010';
  ctx.beginPath(); ctx.moveTo(300, 352); ctx.lineTo(480, 100); ctx.lineTo(660, 352);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ff4d1e';
  ctx.beginPath(); ctx.ellipse(480, 105, 40, 12, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#ff8b4a'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(480, 115);
  ctx.quadraticCurveTo(450, 200, 420, 352); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(480, 115);
  ctx.quadraticCurveTo(520, 220, 560, 352); ctx.stroke();
  ctx.fillStyle = '#ffd23d';
  for(var i = 0; i < 10; i++){
    var sx = 380+((i*67+T*40)%200);
    var sy = 100-((T*30+i*20)%80);
    ctx.globalAlpha = .7;
    ctx.beginPath(); ctx.arc(sx, sy, 2, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#2a1a0a';
  [150, 750].forEach(function(rx){
    ctx.beginPath(); ctx.arc(rx, 330, 25, 0, TAU); ctx.fill();
  });
}

/* --- 8. Ледяные пустоши --- */
function drawIce(){
  ctx.fillStyle = 'rgba(159,216,255,.08)';
  for(var i = 0; i < 3; i++){
    ctx.beginPath();
    ctx.ellipse(300+i*200, 80+Math.sin(T*.5+i)*20, 100, 30, 0, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(159,216,255,.5)';
  [150, 400, 650, 850].forEach(function(ix){
    ctx.beginPath();
    ctx.moveTo(ix, 352); ctx.lineTo(ix-20, 280);
    ctx.lineTo(ix, 250); ctx.lineTo(ix+20, 280);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#9fd8ff'; ctx.lineWidth = 2; ctx.stroke();
  });
  ctx.fillStyle = '#fff';
  for(var j = 0; j < 15; j++){
    var sx = (j*67+T*20)%960;
    var sy = (j*43+T*30)%350;
    ctx.globalAlpha = .6;
    ctx.beginPath(); ctx.arc(sx, sy, 2, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* --- 9. Бездна --- */
function drawAbyss(){
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(0, 0, 960, 352);
  ctx.fillStyle = '#b66bff';
  for(var i = 0; i < 4; i++){
    var ex2 = 150+i*220;
    var blink = Math.sin(T*2+i) > 0.8;
    if(!blink){
      ctx.beginPath(); ctx.ellipse(ex2, 150+i*30, 8, 12, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(ex2+30, 150+i*30, 8, 12, 0, 0, TAU); ctx.fill();
    }
  }
  ctx.strokeStyle = '#4a2060'; ctx.lineWidth = 8;
  for(var j = 0; j < 3; j++){
    var sx = 200+j*250;
    ctx.beginPath(); ctx.moveTo(sx, 352);
    ctx.quadraticCurveTo(sx+Math.sin(T+j)*30, 250, sx+Math.sin(T*1.5+j)*50, 180);
    ctx.stroke();
  }
}

/* --- 10. Пустота --- */
function drawVoid(){
  ctx.fillStyle = '#fff';
  for(var i = 0; i < 30; i++){
    var sx = (i*37)%960;
    var sy = (i*23)%300;
    var tw = Math.sin(T*3+i) > 0 ? 1 : .3;
    ctx.globalAlpha = tw;
    ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#8a1eff'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(300, 100); ctx.lineTo(350, 180); ctx.lineTo(320, 260); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(650, 80);  ctx.lineTo(620, 170); ctx.lineTo(680, 250); ctx.stroke();
}