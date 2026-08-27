'use strict';
/* ============================================
17b-RENDER-BOSS: ПОЖИРАТЕЛЬ МИРОВ —
серый монстр, зелёные глаза-молнии, пасть с
клыками, щупальца, хвост, лапа с планетой
============================================ */
function dDevourer(t){
  var b=Math.sin(t*1.6)*3;
  ctx.lineWidth=4;ctx.strokeStyle=INK;

  /* === Аура Пустоты + молнии на фоне === */
  var g=ctx.createRadialGradient(0,-100,20,0,-100,170);
  g.addColorStop(0,'rgba(138,30,255,.30)');
  g.addColorStop(1,'rgba(138,30,255,0)');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,-100,170,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(140,220,255,.75)';ctx.lineWidth=3;
  for(var L=0;L<3;L++){
    var lx=(L-1)*110,ly=-195+((t*80+L*50)%50);
    ctx.beginPath();ctx.moveTo(lx,ly);
    ctx.lineTo(lx+14,ly+20);ctx.lineTo(lx-6,ly+34);ctx.lineTo(lx+12,ly+56);
    ctx.stroke();
  }
  ctx.strokeStyle=INK;ctx.lineWidth=5;

  /* === Хвост с шипами (слева) === */
  ctx.fillStyle='#7a7a80';
  ctx.beginPath();
  ctx.moveTo(-40,-40+b);
  ctx.quadraticCurveTo(-110,-60+b,-120,-120+b);
  ctx.quadraticCurveTo(-126,-142+b,-108,-132+b);
  ctx.quadraticCurveTo(-84,-96+b,-30,-70+b);
  ctx.closePath();ctx.fill();ctx.stroke();
  for(var s=0;s<4;s++){
    var sx=-56-s*18,sy=-62-s*17+b;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-9,sy-15);ctx.lineTo(sx+8,sy-6);ctx.closePath();
    ctx.fillStyle='#9a9aa0';ctx.fill();ctx.stroke();
  }

  /* === Ноги === */
  rr(-34,-26,20,26,6,'#6a6a70');
  rr(12,-26,20,26,6,'#6a6a70');

  /* === Массивный торс === */
  ctx.beginPath();
  ctx.moveTo(-46,-40+b);
  ctx.quadraticCurveTo(-58,-96+b,-30,-118+b);
  ctx.lineTo(30,-118+b);
  ctx.quadraticCurveTo(58,-96+b,46,-40+b);
  ctx.quadraticCurveTo(0,-24+b,-46,-40+b);
  ctx.closePath();
  ctx.fillStyle='#84848a';ctx.fill();ctx.stroke();
  ctx.strokeStyle='#5a5a60';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(-16,-84+b,12,0.2,Math.PI-0.2);ctx.stroke();
  ctx.beginPath();ctx.arc(16,-84+b,12,0.2,Math.PI-0.2);ctx.stroke();
  ctx.strokeStyle=INK;ctx.lineWidth=5;

  /* === Левая рука-гора с шипом на плече === */
  ctx.beginPath();ctx.ellipse(-52,-78+b,20,26,-.3,0,TAU);
  ctx.fillStyle='#8f8f95';ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(-58,-98+b);ctx.lineTo(-68,-118+b);ctx.lineTo(-46,-104+b);ctx.closePath();
  ctx.fillStyle='#9a9aa0';ctx.fill();ctx.stroke();

  /* === Правая рука тянется к планете === */
  ctx.beginPath();
  ctx.moveTo(40,-100+b);
  ctx.quadraticCurveTo(66,-92+b,70,-70+b);
  ctx.quadraticCurveTo(72,-56+b,58,-52+b);
  ctx.lineTo(44,-58+b);
  ctx.closePath();
  ctx.fillStyle='#84848a';ctx.fill();ctx.stroke();

  /* === ПЛАНЕТА (Земля), сжатая когтями === */
  ctx.save();
  ctx.translate(52,-64+b);
  ctx.beginPath();ctx.arc(0,0,24,0,TAU);
  ctx.fillStyle='#3a7ad0';ctx.fill();ctx.stroke();
  ctx.fillStyle='#58b368';
  ctx.beginPath();ctx.ellipse(-8,-6,9,6,.4,0,TAU);ctx.fill();
  ctx.beginPath();ctx.ellipse(8,6,7,5,-.3,0,TAU);ctx.fill();
  ctx.beginPath();ctx.ellipse(2,-14,5,3,0,0,TAU);ctx.fill();
  ctx.fillStyle='#c9c9cf';
  for(var c=0;c<3;c++){
    ctx.beginPath();
    ctx.moveTo(-14+c*10,-20);
    ctx.quadraticCurveTo(-9+c*10,-6,-14+c*10,3);
    ctx.quadraticCurveTo(-19+c*10,-8,-14+c*10,-20);
    ctx.closePath();ctx.fill();ctx.stroke();
  }
  ctx.restore();

  /* === Щупальца от шеи === */
  ctx.strokeStyle='#6a6a70';ctx.lineWidth=7;ctx.lineCap='round';
  for(var q=0;q<3;q++){
    ctx.beginPath();
    ctx.moveTo(-18+q*10,-112+b);
    ctx.quadraticCurveTo(-44+q*14,-84+b+Math.sin(t*2+q)*4,-32+q*12,-54+b);
    ctx.stroke();
  }
  ctx.lineCap='butt';ctx.strokeStyle=INK;ctx.lineWidth=5;

  /* === ГОЛОВА === */
  ctx.save();
  ctx.translate(0,-138+b);
  /* грива из шипов */
  ctx.fillStyle='#9a9aa0';
  for(var sp=0;sp<7;sp++){
    var a=-Math.PI*0.9+sp*(Math.PI*0.8/6);
    ctx.beginPath();
    ctx.moveTo(Math.cos(a)*20,Math.sin(a)*20-6);
    ctx.lineTo(Math.cos(a)*40,Math.sin(a)*40-12);
    ctx.lineTo(Math.cos(a+0.25)*22,Math.sin(a+0.25)*22-6);
    ctx.closePath();ctx.fill();ctx.stroke();
  }
  /* череп */
  ctx.beginPath();ctx.ellipse(0,-4,26,22,0,0,TAU);
  ctx.fillStyle='#8f8f95';ctx.fill();ctx.stroke();
  /* ЗЕЛЁНЫЕ ГЛАЗА + молнии из них */
  ctx.save();
  ctx.shadowColor='#5eff5e';ctx.shadowBlur=16;
  ctx.fillStyle='#5eff5e';
  ctx.beginPath();ctx.ellipse(-10,-8,6,4,-.2,0,TAU);ctx.fill();
  ctx.beginPath();ctx.ellipse(10,-8,6,4,.2,0,TAU);ctx.fill();
  ctx.shadowBlur=0;
  ctx.strokeStyle='#5eff5e';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(-16,-8);ctx.lineTo(-30,-6);ctx.lineTo(-26,-11);ctx.lineTo(-46,-8);ctx.stroke();
  ctx.beginPath();ctx.moveTo(16,-8);ctx.lineTo(30,-6);ctx.lineTo(26,-11);ctx.lineTo(46,-8);ctx.stroke();
  ctx.restore();
  /* открытая пасть */
  ctx.beginPath();
  ctx.moveTo(-16,4);
  ctx.quadraticCurveTo(0,6,16,4);
  ctx.quadraticCurveTo(10,26,0,28);
  ctx.quadraticCurveTo(-10,26,-16,4);
  ctx.closePath();
  ctx.fillStyle='#5c1220';ctx.fill();ctx.stroke();
  /* клыки верхние и нижние */
  ctx.fillStyle='#fff';
  for(var f1=0;f1<5;f1++){
    var fx=-14+f1*7;
    ctx.beginPath();ctx.moveTo(fx,5);ctx.lineTo(fx+3,13);ctx.lineTo(fx+6,5);ctx.closePath();ctx.fill();
  }
  for(var f2=0;f2<4;f2++){
    var fx2=-10+f2*7;
    ctx.beginPath();ctx.moveTo(fx2,24);ctx.lineTo(fx2+3,16);ctx.lineTo(fx2+6,24);ctx.closePath();ctx.fill();
  }
  ctx.restore();
}

/* Подменяем отрисовку финального босса */
ENEMY_DRAW.worlddevourer = dDevourer;