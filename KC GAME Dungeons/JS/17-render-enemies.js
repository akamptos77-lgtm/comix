'use strict';
/* ============================================
   17-RENDER-ENEMIES: отрисовка всех врагов
   и боссов
   ============================================ */

function dSlime(t){
  var s=1+Math.sin(t*3)*.07;
  ee(0,-30*s,46*s,34*s,'#4ed96f');
  dot(-16,-48*s,7,'rgba(255,255,255,.55)');
  cc(-14,-36*s,8,'#fff'); cc(14,-36*s,8,'#fff');
  dot(-12,-35*s,3.5,INK); dot(16,-35*s,3.5,INK);
  ctx.beginPath(); ctx.arc(0,-20*s,10,.2,Math.PI-.2); ctx.stroke();
}
function dBat(t){
  var f=Math.sin(t*9)*14;
  ctx.fillStyle='#9a5fe0';
  ctx.beginPath(); ctx.moveTo(-8,-42); ctx.lineTo(-62,-66-f); ctx.lineTo(-30,-28);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8,-42); ctx.lineTo(62,-66-f); ctx.lineTo(30,-28);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ee(0,-40,20,24,'#9a5fe0');
  dot(-7,-44,4,'#ff4d5e'); dot(7,-44,4,'#ff4d5e');
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.moveTo(-5,-30); ctx.lineTo(-2,-24); ctx.lineTo(1,-30); ctx.fill();
  ctx.beginPath(); ctx.moveTo(5,-30); ctx.lineTo(2,-24); ctx.lineTo(-1,-30); ctx.fill();
}
function dGoblin(t){
  var b=Math.sin(t*2.5)*2;
  rr(-14,-22,11,22,4,'#3f8450'); rr(3,-22,11,22,4,'#3f8450');
  rr(-20,-66+b,40,46,10,'#58b368');
  cc(0,-84+b,20,'#58b368');
  ctx.beginPath(); ctx.moveTo(-18,-88+b); ctx.lineTo(-40,-98+b); ctx.lineTo(-16,-76+b);
  ctx.closePath(); ctx.fillStyle='#58b368'; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18,-88+b); ctx.lineTo(40,-98+b); ctx.lineTo(16,-76+b);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  cc(-8,-86+b,6,'#fff'); cc(8,-86+b,6,'#fff');
  dot(-6,-85+b,3,INK); dot(10,-85+b,3,INK);
  ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(-14,-94+b); ctx.lineTo(-3,-90+b);
  ctx.moveTo(14,-94+b); ctx.lineTo(3,-90+b); ctx.stroke();
  ctx.lineWidth=5;
  ctx.beginPath(); ctx.arc(0,-72+b,8,.2,Math.PI-.2); ctx.stroke();
  ctx.save(); ctx.translate(30,-52+b); ctx.rotate(.5);
  rr(-4,-34,9,36,4,'#8a5a2b'); ee(0,-40,11,13,'#6f4518');
  ctx.restore();
}
function dSkeleton(t){
  var b=Math.sin(t*2)*2;
  rr(-13,-24,9,24,3,'#f2eee2'); rr(4,-24,9,24,3,'#f2eee2');
  ee(0,-30,14,9,'#f2eee2');
  ctx.lineWidth=6; ctx.strokeStyle='#f2eee2';
  ctx.beginPath(); ctx.moveTo(0,-36); ctx.lineTo(0,-72+b); ctx.stroke();
  for(var i=0;i<3;i++){
    ctx.beginPath(); ctx.arc(0,-64+b+i*9,13,0.25,Math.PI-0.25); ctx.stroke();
  }
  for(var s=-1;s<=1;s+=2){
    ctx.beginPath(); ctx.moveTo(s*12,-66+b); ctx.lineTo(s*28,-48+b); ctx.stroke();
  }
  ctx.strokeStyle=INK; ctx.lineWidth=5;
  cc(0,-90+b,18,'#f2eee2');
  dot(-7,-92+b,5,INK); dot(7,-92+b,5,INK);
  rr(-6,-80+b,12,5,2,'#171022');
}
function dGhost(t){
  var b=Math.sin(t*2.2)*6;
  ctx.globalAlpha=.92;
  ctx.beginPath(); ctx.arc(0,-78+b,34,Math.PI,0); ctx.lineTo(34,-24+b);
  for(var i=3;i>=-3;i--) ctx.quadraticCurveTo(i*11+6,-14+b,i*11,-24+b);
  ctx.closePath(); ctx.fillStyle='#eef2ff'; ctx.fill(); ctx.stroke();
  ee(-11,-80+b,6,9,'#171022'); ee(11,-80+b,6,9,'#171022');
  ee(0,-60+b,6,8,'#171022');
  ctx.globalAlpha=1;
}
function dZombie(t){
  var b=Math.sin(t*1.5)*2;
  rr(-14,-24,10,24,4,'#5a6a4a'); rr(4,-24,10,24,4,'#5a6a4a');
  rr(-18,-66+b,36,44,8,'#6a7a5a');
  cc(0,-82+b,16,'#8a9a6a');
  dot(-6,-84+b,3,'#ff4d5e'); dot(6,-84+b,3,'#ff4d5e');
  ctx.beginPath(); ctx.arc(0,-76+b,6,.2,Math.PI-.2); ctx.stroke();
  ctx.strokeStyle='#4a5a3a'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-10,-40+b); ctx.lineTo(-14,-30+b); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8,-44+b); ctx.lineTo(12,-32+b); ctx.stroke();
  ctx.strokeStyle=INK; ctx.lineWidth=5;
}
function dBandit(t){
  var b=Math.sin(t*2.4)*2;
  rr(-12,-24,9,24,3,'#4a3a2a'); rr(3,-24,9,24,3,'#4a3a2a');
  rr(-17,-66+b,34,44,8,'#6b4a2f');
  ctx.fillStyle='#5a3a20'; ctx.fillRect(-17,-40+b,34,7); ctx.strokeRect(-17,-40+b,34,7);
  cc(0,-82+b,14,'#d8b088'); rr(-11,-86+b,22,7,3,'#3a2a1a');
  dot(-5,-82.5+b,2,'#fff'); dot(5,-82.5+b,2,'#fff');
  ctx.beginPath(); ctx.moveTo(-14,-88+b); ctx.quadraticCurveTo(0,-104+b,14,-88+b);
  ctx.lineTo(11,-82+b); ctx.lineTo(-11,-82+b); ctx.closePath();
  ctx.fillStyle='#8a2222'; ctx.fill(); ctx.stroke();
  ctx.save(); ctx.translate(24,-46+b); ctx.rotate(.5+Math.sin(t*3)*.1);
  rr(-2,-20,4,20,1,'#cfd6e6'); rr(-5,-2,10,4,2,'#ffd23d');
  ctx.restore();
}
function dWolf(t,b2,col){
  var breathe=Math.sin(t*2.5)*1.5;
  var bodyCol=col||'#6a6a7a', darkCol=col?'#4a5a7a':'#4a4a5a';
  ee(0,-34+b2+breathe,42,22,bodyCol);
  ctx.fillStyle=darkCol;
  rr(-32,-18+b2,8,18,3,darkCol); rr(-16,-18+b2,8,18,3,darkCol);
  rr(8,-18+b2,8,18,3,darkCol);   rr(18,-18+b2,8,18,3,darkCol);
  ctx.strokeStyle=bodyCol; ctx.lineWidth=8;
  ctx.beginPath(); ctx.moveTo(-40,-38+b2);
  ctx.quadraticCurveTo(-54,-46+b2,-50,-58+b2); ctx.stroke();
  ee(36,-44+b2+breathe,12,10,bodyCol);
  ctx.fillStyle=bodyCol;
  ctx.beginPath(); ctx.moveTo(22,-44+b2); ctx.lineTo(24,-54+b2); ctx.lineTo(28,-45+b2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(30,-44+b2); ctx.lineTo(34,-54+b2); ctx.lineTo(38,-43+b2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ee(38,-32+b2+breathe,6,4,darkCol);
  dot(30,-40+b2+breathe,2,col?'#9fd8ff':'#ff4d5e');
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.moveTo(36,-28+b2); ctx.lineTo(38,-25+b2); ctx.lineTo(40,-28+b2);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle=INK; ctx.lineWidth=5;
}
function dSpider(t){
  ee(0,-40,46,30,'#4a2d6b'); ee(0,-70,24,22,'#6b3f8f');
  [-1,1].forEach(function(s){
    for(var i=0;i<4;i++){
      var a=i*.5-.8;
      ctx.strokeStyle='#4a2d6b'; ctx.lineWidth=6;
      ctx.beginPath(); ctx.moveTo(s*10,-40);
      ctx.lineTo(s*50+Math.cos(a+t*2+i)*8,-20+Math.sin(a+i)*12);
      ctx.stroke();
    }
  });
  ctx.strokeStyle=INK; ctx.lineWidth=5;
  for(var j=-1;j<=1;j++) dot(j*8,-74,3,'#ff4d5e');
}
function dOwl(t){
  var b=Math.sin(t*2)*2;
  ee(0,-46+b,30,36,'#8a6a4a');
  ctx.fillStyle='#6a4a2a';
  ctx.beginPath(); ctx.ellipse(-28,-46+b,14,28,-.3,0,TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(28,-46+b,14,28,.3,0,TAU); ctx.fill(); ctx.stroke();
  cc(0,-78+b,20,'#8a6a4a');
  ctx.fillStyle='#6a4a2a';
  ctx.beginPath(); ctx.moveTo(-12,-92+b); ctx.lineTo(-8,-102+b); ctx.lineTo(-4,-92+b);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(4,-92+b); ctx.lineTo(8,-102+b); ctx.lineTo(12,-92+b);
  ctx.closePath(); ctx.fill();
  cc(-8,-80+b,7,'#ffd23d'); cc(8,-80+b,7,'#ffd23d');
  dot(-8,-80+b,3,INK); dot(8,-80+b,3,INK);
  ctx.fillStyle='#ffa04a';
  ctx.beginPath(); ctx.moveTo(0,-74+b); ctx.lineTo(-4,-68+b); ctx.lineTo(4,-68+b);
  ctx.closePath(); ctx.fill();
}
function dEnt(t){
  var b=Math.sin(t*1.2)*1;
  rr(-20,-70+b,40,70,8,'#5a4a2a');
  ctx.strokeStyle='#4a3a1a'; ctx.lineWidth=6;
  ctx.beginPath(); ctx.moveTo(-14,0); ctx.lineTo(-24,10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14,0); ctx.lineTo(24,10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-18,-50+b); ctx.lineTo(-40,-60+b); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18,-50+b); ctx.lineTo(40,-56+b); ctx.stroke();
  ctx.fillStyle='#2a5a1a';
  ctx.beginPath(); ctx.arc(0,-80+b,30,0,TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(-18,-70+b,20,0,TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(18,-72+b,22,0,TAU); ctx.fill();
  dot(-8,-52+b,4,'#ffd23d'); dot(8,-52+b,4,'#ffd23d');
  ee(0,-38+b,8,6,'#3a2a1a');
  ctx.strokeStyle=INK; ctx.lineWidth=5;
}
function dToad(t){
  var b=Math.sin(t*2)*2;
  ee(0,-28+b,44,28,'#5a8a3a'); ee(0,-44+b,30,20,'#6a9a4a');
  cc(-14,-56+b,8,'#6a9a4a'); cc(14,-56+b,8,'#6a9a4a');
  dot(-14,-56+b,4,'#ffd23d'); dot(14,-56+b,4,'#ffd23d');
  dot(-14,-56+b,2,INK); dot(14,-56+b,2,INK);
  ctx.fillStyle='#4a7a2a';
  ee(-30,-10+b,12,8,'#4a7a2a'); ee(30,-10+b,12,8,'#4a7a2a');
  ctx.strokeStyle=INK; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(0,-36+b,12,.2,Math.PI-.2); ctx.stroke();
  dot(-20,-40+b,3,'#4a7a2a'); dot(20,-42+b,3,'#4a7a2a');
}
function dSnake(t){
  var w=Math.sin(t*3)*6;
  ctx.strokeStyle='#4a8a3f'; ctx.lineWidth=16; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-40,-12);
  ctx.quadraticCurveTo(-20,-40+w,0,-20);
  ctx.quadraticCurveTo(20,0-w,34,-30); ctx.stroke();
  ctx.strokeStyle=INK; ctx.lineWidth=5; ctx.lineCap='butt';
  ee(38,-36,14,11,'#5aa04f');
  dot(34,-40,2.5,'#ffd23d'); dot(44,-40,2.5,'#ffd23d');
  ctx.strokeStyle='#ff4d5e'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(50,-34); ctx.lineTo(58,-32); ctx.stroke();
}
function dTroll(t){
  var b=Math.sin(t*1.8)*2;
  rr(-20,-24,16,24,5,'#5a7a4a'); rr(4,-24,16,24,5,'#5a7a4a');
  rr(-28,-76+b,56,54,10,'#6a8a5a');
  cc(0,-92+b,20,'#6a8a5a');
  dot(-10,-96+b,3,'#5a7a4a'); dot(10,-94+b,3,'#5a7a4a');
  dot(-6,-88+b,2,'#ff4d5e'); dot(6,-88+b,2,'#ff4d5e');
  ee(0,-90+b,6,8,'#5a7a4a');
  ctx.save(); ctx.translate(36,-56+b); ctx.rotate(.3+Math.sin(t*1.8)*.1);
  ctx.fillStyle='#6a4a2a'; rr(-5,-40,10,50,4,'#6a4a2a');
  ee(0,-46,14,12,'#5a3a1a');
  ctx.restore();
}
function dHarpy(t){
  var f=Math.sin(t*8)*12;
  ctx.fillStyle='#8a6a4a';
  ctx.beginPath(); ctx.moveTo(-8,-46); ctx.lineTo(-56,-70-f); ctx.lineTo(-24,-36);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8,-46); ctx.lineTo(56,-70-f); ctx.lineTo(24,-36);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ee(0,-42,18,24,'#c9a888'); cc(0,-70,14,'#d8b898');
  ctx.fillStyle='#6a4a2a';
  ctx.beginPath(); ctx.arc(0,-76,14,Math.PI,0); ctx.fill();
  dot(-5,-72,2,INK); dot(5,-72,2,INK);
  ctx.fillStyle='#ffa04a';
  ctx.beginPath(); ctx.moveTo(0,-66); ctx.lineTo(-3,-60); ctx.lineTo(3,-60);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#4a3a2a'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(-8,-20); ctx.lineTo(-12,-12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8,-20); ctx.lineTo(12,-12); ctx.stroke();
  ctx.strokeStyle=INK; ctx.lineWidth=5;
}
function dGolem(t){
  var b=Math.sin(t*1.5)*1.5;
  rr(-30,-70+b,60,54,8,'#7a7a85');
  rr(-40,-60+b,12,36,5,'#6a6a75'); rr(28,-60+b,12,36,5,'#6a6a75');
  rr(-24,-16,16,16,4,'#6a6a75');   rr(8,-16,16,16,4,'#6a6a75');
  rr(-20,-92+b,40,26,7,'#8a8a95');
  dot(-9,-80+b,4,'#ffd23d'); dot(9,-80+b,4,'#ffd23d');
}
function dElemental(t){
  var b=Math.sin(t*3)*4;
  ctx.shadowColor='#ff8b4a'; ctx.shadowBlur=18;
  ee(0,-46+b,30,36,'#ff8b4a'); ctx.shadowBlur=0;
  ee(0,-46+b,30,36,'#ff8b4a'); ee(0,-40+b,18,22,'#ffd23d');
  dot(-9,-52+b,4,'#fff'); dot(9,-52+b,4,'#fff');
  for(var i=0;i<3;i++){
    var a=t*2+i*2.1;
    dot(Math.cos(a)*40,-46+b+Math.sin(a)*30,4,'#ffd23d');
  }
}
function dWitch(t){
  var b=Math.sin(t*2.2)*3;
  ctx.beginPath(); ctx.moveTo(-26,-12); ctx.lineTo(-12,-78+b);
  ctx.lineTo(12,-78+b); ctx.lineTo(26,-12); ctx.closePath();
  ctx.fillStyle='#3a5a8a'; ctx.fill(); ctx.stroke();
  cc(0,-86+b,14,'#cfd8ee');
  dot(-5,-88+b,2.5,'#4a80e0'); dot(5,-88+b,2.5,'#4a80e0');
  ctx.beginPath(); ctx.moveTo(-17,-95+b); ctx.lineTo(17,-95+b); ctx.lineTo(2,-132+b);
  ctx.closePath(); ctx.fillStyle='#2a3a5a'; ctx.fill(); ctx.stroke();
  ctx.strokeStyle='#6a4a2b'; ctx.lineWidth=5;
  ctx.beginPath(); ctx.moveTo(-28,-12); ctx.lineTo(-32,-96+b); ctx.stroke();
  ctx.shadowColor='#9fd8ff'; ctx.shadowBlur=12;
  cc(-32,-102+b,8,'#9fd8ff'); ctx.shadowBlur=0;
  ctx.strokeStyle=INK; ctx.lineWidth=5;
}
function dImp(t){
  var b=Math.sin(t*3)*2;
  ee(0,-40+b,28,32,'#c94a4a'); cc(0,-72+b,16,'#d95a5a');
  ctx.fillStyle='#8a2a2a';
  ctx.beginPath(); ctx.moveTo(-10,-84+b); ctx.lineTo(-8,-94+b); ctx.lineTo(-4,-84+b);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(4,-84+b); ctx.lineTo(8,-94+b); ctx.lineTo(10,-84+b);
  ctx.closePath(); ctx.fill();
  dot(-5,-74+b,2.5,'#ffd23d'); dot(5,-74+b,2.5,'#ffd23d');
  ctx.strokeStyle='#c94a4a'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(0,-10+b);
  ctx.quadraticCurveTo(20,-20+b,16,-36+b); ctx.stroke();
  ctx.fillStyle='rgba(201,74,74,.5)';
  ctx.beginPath(); ctx.ellipse(-24,-50+b,10,16,-.4,0,TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(24,-50+b,10,16,.4,0,TAU); ctx.fill();
  ctx.strokeStyle=INK; ctx.lineWidth=5;
}
function dAssassin(t){
  var b=Math.sin(t*2.6)*2;
  rr(-11,-24,8,24,3,'#2a2a3a'); rr(3,-24,8,24,3,'#2a2a3a');
  rr(-15,-64+b,30,42,7,'#3a3a4a');
  cc(0,-78+b,13,'#4a4a5a');
  ctx.fillStyle='#2a2a3a';
  ctx.beginPath(); ctx.moveTo(-13,-82+b); ctx.quadraticCurveTo(0,-100+b,13,-82+b);
  ctx.lineTo(10,-74+b); ctx.lineTo(-10,-74+b); ctx.closePath(); ctx.fill();
  dot(-4,-78+b,2,'#ff4d5e'); dot(4,-78+b,2,'#ff4d5e');
  [-1,1].forEach(function(s){
    ctx.save(); ctx.translate(s*20,-44+b); ctx.rotate(s*.4);
    rr(-2,-18,4,18,1,'#8a8a9a'); ctx.restore();
  });
  ctx.fillStyle='rgba(58,58,74,.3)';
  ctx.beginPath(); ctx.ellipse(0,-40+b,24,30,0,0,TAU); ctx.fill();
}
function dSoulater(t){
  var b=Math.sin(t*2)*3;
  ctx.globalAlpha=.85;
  ctx.beginPath(); ctx.arc(0,-60+b,36,Math.PI,0); ctx.lineTo(36,-20+b);
  for(var i=3;i>=-3;i--) ctx.quadraticCurveTo(i*12+6,-10+b,i*12,-20+b);
  ctx.closePath(); ctx.fillStyle='#4a2a6a'; ctx.fill(); ctx.stroke();
  ee(-12,-64+b,7,10,'#b66bff'); ee(12,-64+b,7,10,'#b66bff');
  ee(0,-44+b,8,10,'#2a1a3a');
  ctx.globalAlpha=1;
  for(var j=0;j<3;j++){
    var a=t*1.5+j*2;
    ctx.fillStyle='rgba(182,107,255,.4)';
    ctx.beginPath(); ctx.arc(Math.cos(a)*44,-50+b+Math.sin(a)*30,5,0,TAU); ctx.fill();
  }
}
function dVoid(t){
  ctx.fillStyle='#0a0518'; ee(0,-60,80,80,'#0a0518');
  for(var i=0;i<16;i++){
    var a=i/16*TAU+t, r=80+Math.sin(t*3+i)*6;
    dot(Math.cos(a)*r,-60+Math.sin(a)*r*.7,5+Math.sin(t*4+i)*2,'#8a1eff');
  }
  ctx.shadowColor='#b6ff5e'; ctx.shadowBlur=20;
  cc(-18,-66,12,'#b6ff5e'); cc(18,-66,12,'#b6ff5e');
  ctx.shadowBlur=0;
  dot(-18,-66,5,'#1e0808'); dot(18,-66,5,'#1e0808');
}
function dHydra(t){
  ee(0,-40,50,36,'#2d6b3f');
  for(var i=-1;i<=1;i++){
    ctx.strokeStyle=INK; ctx.lineWidth=10;
    ctx.beginPath(); ctx.moveTo(i*10,-40);
    ctx.quadraticCurveTo(i*30,-80,i*20+Math.sin(t*2+i)*5,-100); ctx.stroke();
    ee(i*20+Math.sin(t*2+i)*5,-108,14,12,'#3a8a4f');
    dot(i*20+Math.sin(t*2+i)*5-4,-110,3,'#ff4d5e');
    dot(i*20+Math.sin(t*2+i)*5+4,-110,3,'#ff4d5e');
  }
}
function dDemon(t){
  ee(0,-46,48,40,'#8a1e1e'); cc(0,-90,20,'#6b1515');
  ctx.fillStyle='#1e0808';
  ctx.beginPath(); ctx.moveTo(-16,-100); ctx.lineTo(-10,-128); ctx.lineTo(-6,-100);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(16,-100); ctx.lineTo(10,-128); ctx.lineTo(6,-100);
  ctx.closePath(); ctx.fill();
  ctx.shadowColor='#ff4d5e'; ctx.shadowBlur=12;
  dot(-7,-92,4,'#ffd23d'); dot(7,-92,4,'#ffd23d');
  ctx.shadowBlur=0;
}
function dPhoenix(t){
  var b=Math.sin(t*3)*5, f=Math.sin(t*4)*12;
  ctx.fillStyle='#ff8c1e';
  ctx.beginPath(); ctx.moveTo(-10,-70+b); ctx.lineTo(-60,-110-f+b); ctx.lineTo(-30,-60+b);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10,-70+b); ctx.lineTo(60,-110-f+b); ctx.lineTo(30,-60+b);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ee(0,-50+b,30,30,'#ff4d1e'); ee(0,-80+b,16,18,'#ffd23d');
  ctx.shadowColor='#ff4d1e'; ctx.shadowBlur=20;
  ee(0,-50+b,38,38,'rgba(255,140,30,.4)'); ctx.shadowBlur=0;
}
function dTitan(t){
  rr(-22,-24,16,26,5,'#5b4226'); rr(6,-24,16,26,5,'#5b4226');
  rr(-36,-80,72,60,12,'#8a6b3f');
  cc(0,-96,22,'#8a6b3f');
  dot(-8,-100,4,'#ff4d5e'); dot(8,-100,4,'#ff4d5e');
  ctx.strokeStyle='#5b4226'; ctx.lineWidth=10;
  ctx.beginPath(); ctx.moveTo(-36,-60); ctx.lineTo(-60,-20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(36,-60); ctx.lineTo(60,-20); ctx.stroke();
  ctx.strokeStyle=INK; ctx.lineWidth=5;
}
function dLich(t){
  var b=Math.sin(t*1.8)*3;
  ctx.beginPath(); ctx.moveTo(-28,-12); ctx.lineTo(-14,-84+b);
  ctx.lineTo(14,-84+b); ctx.lineTo(28,-12); ctx.closePath();
  ctx.fillStyle='#1e1b3a'; ctx.fill(); ctx.stroke();
  cc(0,-90+b,16,'#f2eee2');
  dot(-6,-92+b,3,'#b6ff5e'); dot(6,-92+b,3,'#b6ff5e');
  ctx.shadowColor='#b6ff5e'; ctx.shadowBlur=16;
  cc(-32,-102+b,10,'#b6ff5e'); ctx.shadowBlur=0;
}
function dMimic(t){
  var b=Math.sin(t*4)*2;
  ctx.fillStyle='#6a4a2a'; rr(-30,-40+b,60,40,6,'#6a4a2a');
  ctx.save(); ctx.translate(0,-40+b); ctx.rotate(-.4+Math.sin(t*3)*.1);
  ctx.fillStyle='#8a6a4a'; rr(-30,-20,60,20,6,'#8a6a4a');
  ctx.restore();
  ctx.fillStyle='#fff';
  for(var i=0;i<5;i++){
    ctx.beginPath(); ctx.moveTo(-24+i*12,-40+b);
    ctx.lineTo(-20+i*12,-32+b); ctx.lineTo(-16+i*12,-40+b);
    ctx.closePath(); ctx.fill();
  }
  dot(-14,-52+b,4,'#ff4d5e'); dot(14,-52+b,4,'#ff4d5e');
  ctx.fillStyle='#ff4d5e';
  ctx.beginPath(); ctx.ellipse(0,-24+b,8,12,0,0,TAU); ctx.fill();
}

/* --- Карта отрисовки врагов --- */
var ENEMY_DRAW = {
  slime:dSlime, bat:dBat, goblin:dGoblin, skeleton:dSkeleton,
  ghost:dGhost, zombie:dZombie, bandit:dBandit,
  wolf:function(t){ ctx.save(); ctx.scale(-1,1); dWolf(t,0,null); ctx.restore(); },
  hgoblin:dGoblin, fspider:dSpider, owl:dOwl, ent:dEnt,
  toad:dToad, bog:dZombie, snake:dSnake, troll:dTroll,
  harpy:dHarpy, golem:dGolem, felem:dElemental, salamander:dSnake,
  lgolem:dGolem,
  icewolf:function(t){ ctx.save(); ctx.scale(-1,1); dWolf(t,0,'#8ab8e8'); ctx.restore(); },
  snowgolem:dGolem, icewitch:dWitch, imp:dImp, assassin:dAssassin,
  soulater:dSoulater, voidguard:dVoid, voidkeeper:dLich, chaos:dVoid,
  slimeking:dSlime, necromancer:dLich, banditboss:dBandit,
  spiderqueen:dSpider, leshy:dHydra, colossus:dTitan,
  firelord:dPhoenix, icequeen:dWitch, archdemon:dDemon,
  worlddevourer:dVoid, mimic:dMimic
};