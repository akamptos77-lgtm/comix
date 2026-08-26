'use strict';
/* ============================================
   16-RENDER-HEROES: отрисовка 7 героев
   (переработанные, узнаваемые)
   ============================================ */

/* ═══════════════════════════════════════
   РЫЦАРЬ: латы, большой щит с крестом,
   меч за спиной, шлем с забралом
   ═══════════════════════════════════════ */
function drawKnight(t, b){
  var breath = Math.sin(t*2.3)*1.5;
  var legSwing = Math.sin(t*2.3)*2;

  /* Ноги в латных ботинках */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#5a6a8a';
  rr(-16, -26+b, 12, 26, 4, '#5a6a8a');
  rr(4, -26+b, 12, 26, 4, '#5a6a8a');
  /* Сапоги */
  ctx.fillStyle = '#3d3222';
  rr(-18, -4+b, 16, 8, 3, '#3d3222');
  rr(2, -4+b, 16, 8, 3, '#3d3222');

  /* Тело — латы */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#4a80e0';
  ctx.beginPath(); ctx.roundRect(-24, -74+b+breath, 48, 50, 8);
  ctx.fill(); ctx.stroke();

  /* Блеск на латах */
  ctx.strokeStyle = 'rgba(255,255,255,.3)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-16, -70+b+breath); ctx.lineTo(-12, -50+b+breath); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 4;

  /* Пояс */
  ctx.fillStyle = '#c9a45c';
  ctx.fillRect(-24, -38+b+breath, 48, 7);
  ctx.strokeRect(-24, -38+b+breath, 48, 7);
  ctx.fillStyle = '#ffd23d';
  ctx.fillRect(-4, -38+b+breath, 8, 7);

  /* Эмблема на груди — крест */
  ctx.fillStyle = '#ffd23d';
  ctx.fillRect(-3, -66+b+breath, 6, 18);
  ctx.fillRect(-8, -60+b+breath, 16, 6);

  /* ЩИТ (большой, слева) */
  ctx.save();
  ctx.translate(-36, -52+b+breath);
  ctx.rotate(-.05 + Math.sin(t*2)*.02);
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#2a5ab8';
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.quadraticCurveTo(20, -28, 20, -5);
  ctx.quadraticCurveTo(20, 18, 0, 30);
  ctx.quadraticCurveTo(-20, 18, -20, -5);
  ctx.quadraticCurveTo(-20, -28, 0, -32);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  /* Крест на щите */
  ctx.fillStyle = '#ffd23d';
  ctx.fillRect(-3, -22, 6, 40);
  ctx.fillRect(-12, -8, 24, 6);
  /* Окантовка щита */
  ctx.strokeStyle = '#c9a45c'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.quadraticCurveTo(16, -24, 16, -5);
  ctx.quadraticCurveTo(16, 14, 0, 26);
  ctx.quadraticCurveTo(-16, 14, -16, -5);
  ctx.quadraticCurveTo(-16, -24, 0, -28);
  ctx.stroke();
  ctx.restore();

  /* МЕЧ (справа) */
  ctx.save();
  ctx.translate(34, -56+b+breath);
  ctx.rotate(-.12 + Math.sin(t*2.3)*.04);
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  /* Лезвие */
  ctx.fillStyle = '#e8e8f0';
  ctx.beginPath();
  ctx.moveTo(-2, -58); ctx.lineTo(2, -58);
  ctx.lineTo(4, -10); ctx.lineTo(-4, -10);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  /* Остриё */
  ctx.beginPath(); ctx.moveTo(-2, -58); ctx.lineTo(0, -66); ctx.lineTo(2, -58);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  /* Гарда */
  ctx.fillStyle = '#ffd23d';
  ctx.fillRect(-10, -10, 20, 5);
  ctx.strokeRect(-10, -10, 20, 5);
  /* Рукоять */
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(-2, -5, 4, 14);
  ctx.strokeRect(-2, -5, 4, 14);
  /* Навершие */
  ctx.fillStyle = '#ffd23d';
  ctx.beginPath(); ctx.arc(0, 12, 4, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();

  /* ШЛЕМ с забралом */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#7a8aa5';
  ctx.beginPath(); ctx.arc(0, -88+b+breath, 18, 0, TAU); ctx.fill(); ctx.stroke();
  /* Забрало */
  ctx.fillStyle = '#4a5a75';
  ctx.fillRect(-12, -90+b+breath, 24, 8);
  ctx.strokeRect(-12, -90+b+breath, 24, 8);
  /* Глаза через забрало */
  ctx.fillStyle = '#a0d8ff';
  ctx.fillRect(-8, -88+b+breath, 5, 4);
  ctx.fillRect(3, -88+b+breath, 5, 4);
  /* Гребень шлема */
  ctx.fillStyle = '#ff4d5e';
  ctx.beginPath();
  ctx.moveTo(-3, -106+b+breath);
  ctx.quadraticCurveTo(0, -114+b+breath, 3, -106+b+breath);
  ctx.lineTo(3, -100+b+breath);
  ctx.lineTo(-3, -100+b+breath);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
}

/* ═══════════════════════════════════════
   МАГ: остроконечная шляпа, посох со
   светящимся шаром, мантия, борода
   ═══════════════════════════════════════ */
function drawMage(t, b){
  var breath = Math.sin(t*2.3)*1.5;
  var sway = Math.sin(t*2)*2;

  /* Мантия (длинная, расклешённая) */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#5a2ea0';
  ctx.beginPath();
  ctx.moveTo(-14, -70+b+breath);
  ctx.lineTo(-28, -2+b);
  ctx.quadraticCurveTo(-30, 2+b, -26, 2+b);
  ctx.lineTo(26, 2+b);
  ctx.quadraticCurveTo(30, 2+b, 28, -2+b);
  ctx.lineTo(14, -70+b+breath);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  /* Декор на мантии — руны */
  ctx.fillStyle = '#ffd23d';
  ctx.font = '10px serif';
  ctx.fillText('✦', -8, -40+b+breath);
  ctx.fillText('✦', 4, -30+b+breath);
  ctx.fillText('✦', -4, -15+b);

  /* Пояс с камнем */
  ctx.fillStyle = '#c9a45c';
  ctx.fillRect(-14, -44+b+breath, 28, 5);
  ctx.fillStyle = '#b66bff';
  ctx.beginPath(); ctx.arc(0, -41+b+breath, 5, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
  ctx.lineWidth = 4;

  /* Голова */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#ffd9b3';
  ctx.beginPath(); ctx.arc(0, -82+b+breath, 13, 0, TAU); ctx.fill(); ctx.stroke();

  /* Борода */
  ctx.fillStyle = '#d0d0d0';
  ctx.beginPath();
  ctx.moveTo(-8, -76+b+breath);
  ctx.quadraticCurveTo(-6, -62+b+breath, 0, -58+b+breath);
  ctx.quadraticCurveTo(6, -62+b+breath, 8, -76+b+breath);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  /* Глаза */
  ctx.fillStyle = '#4a80e0';
  ctx.beginPath(); ctx.arc(-5, -84+b+breath, 2.5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -84+b+breath, 2.5, 0, TAU); ctx.fill();

  /* ОСТРОКОНЕЧНАЯ ШЛЯПА */
  ctx.fillStyle = '#3a1a7a';
  ctx.beginPath();
  ctx.moveTo(-20, -88+b+breath);
  ctx.lineTo(20, -88+b+breath);
  ctx.lineTo(3+sway, -130+b+breath);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  /* Поля шляпы */
  ctx.fillStyle = '#4a2a9a';
  ctx.beginPath();
  ctx.ellipse(0, -88+b+breath, 24, 6, 0, 0, TAU);
  ctx.fill(); ctx.stroke();
  /* Звезда на шляпе */
  ctx.fillStyle = '#ffd23d';
  ctx.font = '12px serif';
  ctx.fillText('★', -3+sway*.5, -108+b+breath);

  /* ПОСОХ (справа) */
  ctx.save();
  ctx.translate(32, -40+b+breath);
  ctx.rotate(.05 + Math.sin(t*1.5)*.03);
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, -55); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  /* Шар на посохе */
  var pulse = 6 + Math.sin(t*5)*3;
  ctx.shadowColor = '#ff8b4a'; ctx.shadowBlur = 20;
  ctx.fillStyle = '#ff6b2e';
  ctx.beginPath(); ctx.arc(0, -62, 10+pulse*.5, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffd23d';
  ctx.beginPath(); ctx.arc(0, -62, 5+pulse*.3, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -62, 10+pulse*.5, 0, TAU); ctx.stroke();
  ctx.restore();
}

/* ═══════════════════════════════════════
   ПЛУТ: капюшон скрывает лицо, два
   кинжала, тёмный плащ, хитрый блеск глаз
   ═══════════════════════════════════════ */
function drawRogue(t, b){
  var breath = Math.sin(t*2.3)*1.5;

  /* Ноги */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#1e2c3d';
  rr(-12, -24+b, 9, 24, 3, '#1e2c3d');
  rr(3, -24+b, 9, 24, 3, '#1e2c3d');
  /* Мягкие сапоги */
  ctx.fillStyle = '#2a1a0a';
  rr(-14, -4+b, 12, 7, 3, '#2a1a0a');
  rr(2, -4+b, 12, 7, 3, '#2a1a0a');

  /* Тело — кожаный доспех */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#3d5570';
  ctx.beginPath(); ctx.roundRect(-18, -68+b+breath, 36, 46, 8);
  ctx.fill(); ctx.stroke();

  /* Ремни на груди */
  ctx.strokeStyle = '#2a1a0a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-16, -64+b+breath); ctx.lineTo(14, -40+b+breath); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(16, -64+b+breath); ctx.lineTo(-14, -40+b+breath); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 4;

  /* Пояс с кинжалами */
  ctx.fillStyle = '#3d2817';
  ctx.fillRect(-18, -30+b+breath, 36, 6);
  ctx.strokeRect(-18, -30+b+breath, 36, 6);

  /* ПЛАЩ (развевается) */
  var capeWave = Math.sin(t*3)*4;
  ctx.fillStyle = 'rgba(30,44,61,.6)';
  ctx.beginPath();
  ctx.moveTo(-16, -66+b+breath);
  ctx.quadraticCurveTo(-28+capeWave, -40+b, -24+capeWave, -6+b);
  ctx.lineTo(-18, -6+b);
  ctx.quadraticCurveTo(-20, -40+b, -14, -64+b+breath);
  ctx.closePath();
  ctx.fill();

  /* КАПЮШОН (большой, скрывает лицо) */
  ctx.fillStyle = '#2a3a4a';
  ctx.beginPath();
  ctx.moveTo(-16, -84+b+breath);
  ctx.quadraticCurveTo(-18, -98+b+breath, 0, -102+b+breath);
  ctx.quadraticCurveTo(18, -98+b+breath, 16, -84+b+breath);
  ctx.lineTo(12, -74+b+breath);
  ctx.lineTo(-12, -74+b+breath);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  /* Тень внутри капюшона */
  ctx.fillStyle = '#0a0a14';
  ctx.beginPath();
  ctx.ellipse(0, -82+b+breath, 10, 8, 0, 0, TAU);
  ctx.fill();

  /* Хитрые глаза в тени */
  ctx.fillStyle = '#a0ff9a';
  ctx.beginPath(); ctx.arc(-4, -83+b+breath, 2, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -83+b+breath, 2, 0, TAU); ctx.fill();
  /* Блеск */
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-3.5, -83.5+b+breath, .8, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(4.5, -83.5+b+breath, .8, 0, TAU); ctx.fill();

  /* КИНЖАЛЫ (оба в руках) */
  [-1, 1].forEach(function(s){
    ctx.save();
    ctx.translate(s*24, -46+b+breath);
    ctx.rotate(s*(.6 + Math.sin(t*3+s)*.1));
    ctx.strokeStyle = INK; ctx.lineWidth = 3;
    /* Лезвие */
    ctx.fillStyle = '#d0d8e8';
    ctx.beginPath();
    ctx.moveTo(-1, -22); ctx.lineTo(1, -22);
    ctx.lineTo(2, -4); ctx.lineTo(-2, -4);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    /* Остриё */
    ctx.beginPath(); ctx.moveTo(-1, -22); ctx.lineTo(0, -27); ctx.lineTo(1, -22);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    /* Гарда */
    ctx.fillStyle = '#c9a45c';
    ctx.fillRect(-4, -4, 8, 3);
    /* Рукоять */
    ctx.fillStyle = '#3d2817';
    ctx.fillRect(-1.5, -1, 3, 10);
    ctx.restore();
  });
}

/* ═══════════════════════════════════════
   ВАРВАР: огромный, мускулистый, меховая
   шкура на плечах, огромный топор, волосы
   ═══════════════════════════════════════ */
function drawBarbarian(t, b){
  var breath = Math.sin(t*1.8)*1.5;

  /* Ноги (толстые) */
  ctx.strokeStyle = INK; ctx.lineWidth = 5;
  ctx.fillStyle = '#8a6b3f';
  rr(-18, -24+b, 14, 24, 5, '#8a6b3f');
  rr(4, -24+b, 14, 24, 5, '#8a6b3f');
  /* Меховые сапоги */
  ctx.fillStyle = '#5a3a1f';
  rr(-20, -4+b, 18, 9, 4, '#5a3a1f');
  rr(2, -4+b, 18, 9, 4, '#5a3a1f');

  /* Тело — голое, мускулистое */
  ctx.strokeStyle = INK; ctx.lineWidth = 5;
  ctx.fillStyle = '#c88a5a';
  ctx.beginPath(); ctx.roundRect(-26, -76+b+breath, 52, 54, 10);
  ctx.fill(); ctx.stroke();

  /* Мускулы на груди */
  ctx.strokeStyle = '#a06a3a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(-10, -60+b+breath, 8, 0, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(10, -60+b+breath, 8, 0, Math.PI); ctx.stroke();
  /* Пресс */
  ctx.beginPath(); ctx.moveTo(0, -52+b+breath); ctx.lineTo(0, -30+b+breath); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, -46+b+breath); ctx.lineTo(8, -46+b+breath); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, -38+b+breath); ctx.lineTo(8, -38+b+breath); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 5;

  /* МЕХОВАЯ ШКУРА на плечах */
  ctx.fillStyle = '#6a4a2a';
  ctx.beginPath();
  ctx.moveTo(-30, -76+b+breath);
  ctx.quadraticCurveTo(-34, -82+b+breath, -28, -84+b+breath);
  ctx.lineTo(28, -84+b+breath);
  ctx.quadraticCurveTo(34, -82+b+breath, 30, -76+b+breath);
  ctx.lineTo(26, -68+b+breath);
  ctx.lineTo(-26, -68+b+breath);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  /* Мех (зубчики) */
  ctx.fillStyle = '#8a6a4a';
  for(var i = 0; i < 8; i++){
    var fx = -26 + i*7;
    ctx.beginPath();
    ctx.moveTo(fx, -68+b+breath);
    ctx.lineTo(fx+3, -62+b+breath);
    ctx.lineTo(fx+6, -68+b+breath);
    ctx.fill();
  }
  /* Голова волка на шкуре */
  ctx.fillStyle = '#5a3a1a';
  ctx.beginPath(); ctx.arc(-20, -84+b+breath, 8, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a2a0a';
  ctx.beginPath(); ctx.moveTo(-26, -88+b+breath); ctx.lineTo(-24, -94+b+breath); ctx.lineTo(-20, -88+b+breath); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-14, -88+b+breath); ctx.lineTo(-12, -94+b+breath); ctx.lineTo(-10, -88+b+breath); ctx.fill();

  /* Пояс из костей */
  ctx.fillStyle = '#e8e0d0';
  ctx.fillRect(-26, -26+b+breath, 52, 6);
  ctx.strokeRect(-26, -26+b+breath, 52, 6);
  for(var j = 0; j < 5; j++){
    ctx.fillStyle = '#f0e8d8';
    ctx.fillRect(-22+j*10, -26+b+breath, 4, 6);
  }

  /* ГОЛОВА (без шлема, с волосами) */
  ctx.strokeStyle = INK; ctx.lineWidth = 5;
  ctx.fillStyle = '#c88a5a';
  ctx.beginPath(); ctx.arc(0, -92+b+breath, 16, 0, TAU); ctx.fill(); ctx.stroke();

  /* Дикие волосы */
  ctx.fillStyle = '#8a3a1a';
  ctx.beginPath();
  ctx.moveTo(-16, -96+b+breath);
  ctx.quadraticCurveTo(-20, -108+b+breath, -12, -110+b+breath);
  ctx.quadraticCurveTo(-6, -112+b+breath, 0, -112+b+breath);
  ctx.quadraticCurveTo(6, -112+b+breath, 12, -110+b+breath);
  ctx.quadraticCurveTo(20, -108+b+breath, 16, -96+b+breath);
  ctx.lineTo(14, -98+b+breath);
  ctx.quadraticCurveTo(8, -104+b+breath, 0, -104+b+breath);
  ctx.quadraticCurveTo(-8, -104+b+breath, -14, -98+b+breath);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  /* Шрам на щеке */
  ctx.strokeStyle = '#a04a2a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(6, -90+b+breath); ctx.lineTo(12, -84+b+breath); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 5;

  /* Глаза (яростные) */
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-6, -93+b+breath, 3, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -93+b+breath, 3, 0, TAU); ctx.fill();
  ctx.fillStyle = '#c41e1e';
  ctx.beginPath(); ctx.arc(-6, -93+b+breath, 1.5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -93+b+breath, 1.5, 0, TAU); ctx.fill();
  /* Брови (нахмурены) */
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-10, -98+b+breath); ctx.lineTo(-3, -96+b+breath); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -98+b+breath); ctx.lineTo(3, -96+b+breath); ctx.stroke();
  ctx.lineWidth = 5;

  /* ТОПОР (огромный, справа) */
  ctx.save();
  ctx.translate(38, -56+b+breath);
  ctx.rotate(-.15 + Math.sin(t*1.8)*.06);
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  /* Рукоять */
  ctx.fillStyle = '#6a4a2a';
  ctx.beginPath(); ctx.roundRect(-4, -50, 8, 60, 3);
  ctx.fill(); ctx.stroke();
  /* Обмотка */
  ctx.strokeStyle = '#4a3010'; ctx.lineWidth = 2;
  for(var k = 0; k < 4; k++){
    ctx.beginPath(); ctx.moveTo(-4, 10+k*5); ctx.lineTo(4, 12+k*5); ctx.stroke();
  }
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  /* Лезвие топора (большое, полукруглое) */
  ctx.fillStyle = '#a0a8b8';
  ctx.beginPath();
  ctx.moveTo(4, -48);
  ctx.quadraticCurveTo(28, -52, 30, -38);
  ctx.quadraticCurveTo(30, -26, 4, -28);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  /* Блеск на лезвии */
  ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, -46); ctx.quadraticCurveTo(22, -48, 26, -38); ctx.stroke();
  ctx.restore();
}

/* ═══════════════════════════════════════
   ИЗОБРЕТАТЕЛЬ: гогглы на лбу, паровое
   ружьё в руках, пояс с инструментами,
   фартук, шляпа-котелок
   ═══════════════════════════════════════ */
function drawInventor(t, b){
  var breath = Math.sin(t*2.3)*1.5;

  /* Ноги */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#3a2a1a';
  rr(-12, -24+b, 10, 24, 3, '#3a2a1a');
  rr(2, -24+b, 10, 24, 3, '#3a2a1a');
  /* Ботинки */
  ctx.fillStyle = '#2a1a0a';
  rr(-14, -4+b, 13, 8, 3, '#2a1a0a');
  rr(1, -4+b, 13, 8, 3, '#2a1a0a');

  /* Тело — кожаный фартук поверх рубашки */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#7a5a30';
  ctx.beginPath(); ctx.roundRect(-20, -70+b+breath, 40, 48, 8);
  ctx.fill(); ctx.stroke();

  /* Рубашка под фартуком (воротник) */
  ctx.fillStyle = '#d8c8a0';
  ctx.fillRect(-12, -70+b+breath, 24, 8);
  ctx.strokeRect(-12, -70+b+breath, 24, 8);

  /* Карманы фартука */
  ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 2;
  ctx.strokeRect(-16, -44+b+breath, 12, 10);
  ctx.strokeRect(4, -44+b+breath, 12, 10);
  /* Гаечный ключ торчит из кармана */
  ctx.fillStyle = '#8a8a9a';
  ctx.fillRect(-12, -48+b+breath, 3, 8);
  ctx.strokeStyle = INK; ctx.lineWidth = 4;

  /* Пояс с инструментами */
  ctx.fillStyle = '#4a3010';
  ctx.fillRect(-20, -28+b+breath, 40, 6);
  ctx.strokeRect(-20, -28+b+breath, 40, 6);
  /* Отвёртка и молоток на поясе */
  ctx.fillStyle = '#c9a45c';
  ctx.fillRect(-16, -28+b+breath, 3, 12);
  ctx.fillStyle = '#8a8a9a';
  ctx.fillRect(12, -28+b+breath, 3, 12);

  /* ГОЛОВА */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#e8c898';
  ctx.beginPath(); ctx.arc(0, -82+b+breath, 13, 0, TAU); ctx.fill(); ctx.stroke();

  /* КОТЕЛОК (маленькая шляпа) */
  ctx.fillStyle = '#4a3a2a';
  ctx.beginPath();
  ctx.ellipse(0, -94+b+breath, 14, 5, 0, 0, TAU);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -96+b+breath, 10, Math.PI, 0);
  ctx.fill(); ctx.stroke();

  /* ГОГГЛЫ на лбу */
  ctx.fillStyle = '#c9a45c';
  ctx.fillRect(-12, -90+b+breath, 24, 5);
  ctx.strokeRect(-12, -90+b+breath, 24, 5);
  ctx.fillStyle = '#9fd8ff';
  ctx.beginPath(); ctx.arc(-6, -88+b+breath, 4, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -88+b+breath, 4, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#5a4a2a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(-6, -88+b+breath, 4, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(6, -88+b+breath, 4, 0, TAU); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 4;

  /* Глаза */
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath(); ctx.arc(-4, -82+b+breath, 2, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -82+b+breath, 2, 0, TAU); ctx.fill();

  /* Улыбка */
  ctx.strokeStyle = INK; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -78+b+breath, 5, .2, Math.PI-.2); ctx.stroke();
  ctx.lineWidth = 4;

  /* ПАРОСЕ РУЖЬЁ (в руках) */
  ctx.save();
  ctx.translate(26, -50+b+breath);
  ctx.rotate(-.08 + Math.sin(t*2)*.02);
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  /* Ствол */
  ctx.fillStyle = '#5a5a6a';
  ctx.beginPath(); ctx.roundRect(-3, -38, 8, 42, 2);
  ctx.fill(); ctx.stroke();
  /* Прицел */
  ctx.fillStyle = '#8a6a3a';
  ctx.beginPath(); ctx.roundRect(-2, -42, 6, 6, 2);
  ctx.fill(); ctx.stroke();
  /* Дуло */
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(-1, -40, 4, 4);
  /* Рукоять */
  ctx.fillStyle = '#6a4020';
  ctx.beginPath(); ctx.roundRect(-4, 4, 10, 16, 3);
  ctx.fill(); ctx.stroke();
  /* Паровой баллон */
  ctx.fillStyle = '#8a6a3a';
  ctx.beginPath(); ctx.ellipse(6, -20, 6, 10, 0, 0, TAU);
  ctx.fill(); ctx.stroke();
  /* Пар (анимированный) */
  ctx.fillStyle = 'rgba(255,255,255,.4)';
  var steamT = (t*3) % 1;
  ctx.beginPath(); ctx.arc(8, -34-steamT*8, 3+steamT*2, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(10, -38-steamT*6, 2+steamT*1.5, 0, TAU); ctx.fill();
  ctx.restore();
}

/* ═══════════════════════════════════════
   ЛУЧНИЦА: зелёный плащ, капюшон, лук
   натянут, колчан за спиной, рыжие волосы
   ═══════════════════════════════════════ */
function drawArcher(t, b){
  var breathe = Math.sin(t*2)*1.5;
  var bowPull = Math.sin(t*1.5)*2;

  /* Ноги */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#5a4a3a';
  rr(-10, -24+b, 8, 24, 3, '#5a4a3a');
  rr(2, -24+b, 8, 24, 3, '#5a4a3a');
  /* Сапоги */
  ctx.fillStyle = '#3a2a1a';
  rr(-12, -4+b, 11, 7, 3, '#3a2a1a');
  rr(1, -4+b, 11, 7, 3, '#3a2a1a');

  /* Тело — кожаный доспех */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#6a5a3a';
  ctx.beginPath(); ctx.roundRect(-15, -66+b+breathe, 30, 44, 7);
  ctx.fill(); ctx.stroke();

  /* Зелёный плащ (сзади) */
  ctx.fillStyle = 'rgba(58,107,79,.7)';
  ctx.beginPath();
  ctx.moveTo(-13, -64+b+breathe);
  ctx.quadraticCurveTo(-20, -40+b, -16, -8+b);
  ctx.lineTo(-10, -8+b);
  ctx.quadraticCurveTo(-14, -40+b, -10, -62+b+breathe);
  ctx.closePath();
  ctx.fill();

  /* КОЛЧАН за спиной */
  ctx.fillStyle = '#5a3a1a';
  ctx.beginPath(); ctx.roundRect(14, -68+b+breathe, 8, 30, 3);
  ctx.fill(); ctx.stroke();
  /* Стрелы в колчане */
  ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(16, -68+b+breathe); ctx.lineTo(15, -74+b+breathe); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18, -68+b+breathe); ctx.lineTo(18, -76+b+breathe); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, -68+b+breathe); ctx.lineTo(21, -73+b+breathe); ctx.stroke();
  /* Оперение */
  ctx.fillStyle = '#ff4d5e';
  ctx.fillRect(14, -76+b+breathe, 3, 3);
  ctx.fillRect(17, -78+b+breathe, 3, 3);
  ctx.fillRect(20, -75+b+breathe, 3, 3);
  ctx.strokeStyle = INK; ctx.lineWidth = 4;

  /* ГОЛОВА */
  ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.fillStyle = '#e8c8a8';
  ctx.beginPath(); ctx.arc(0, -80+b+breathe, 12, 0, TAU); ctx.fill(); ctx.stroke();

  /* Рыжие волосы (хвост) */
  ctx.fillStyle = '#c85a1a';
  ctx.beginPath();
  ctx.moveTo(-12, -86+b+breathe);
  ctx.quadraticCurveTo(-16, -94+b+breathe, -8, -96+b+breathe);
  ctx.quadraticCurveTo(0, -98+b+breathe, 8, -96+b+breathe);
  ctx.quadraticCurveTo(16, -94+b+breathe, 12, -86+b+breathe);
  ctx.lineTo(10, -88+b+breathe);
  ctx.quadraticCurveTo(4, -92+b+breathe, 0, -92+b+breathe);
  ctx.quadraticCurveTo(-4, -92+b+breathe, -10, -88+b+breathe);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  /* Хвост волос */
  ctx.beginPath();
  ctx.moveTo(10, -90+b+breathe);
  ctx.quadraticCurveTo(18, -86+b+breathe, 16, -72+b+breathe);
  ctx.quadraticCurveTo(14, -66+b+breathe, 12, -70+b+breathe);
  ctx.quadraticCurveTo(14, -80+b+breathe, 8, -88+b+breathe);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  /* Глаза (меткие, зелёные) */
  ctx.fillStyle = '#2a8a3a';
  ctx.beginPath(); ctx.arc(-4, -81+b+breathe, 2.5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -81+b+breathe, 2.5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-3.5, -81.5+b+breathe, 1, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(4.5, -81.5+b+breathe, 1, 0, TAU); ctx.fill();

  /* ЛУК (натянут, в руках) */
  ctx.save();
  ctx.translate(24, -48+b+breathe);
  ctx.rotate(-.03 + Math.sin(t*2)*.02);
  /* Тетива и лук */
  ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, 26, -1.0, 1.0); ctx.stroke();
  ctx.strokeStyle = '#e8e8d8'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(Math.cos(-1.0)*26, Math.sin(-1.0)*26);
  ctx.lineTo(-4-bowPull, 0);
  ctx.lineTo(Math.cos(1.0)*26, Math.sin(1.0)*26);
  ctx.stroke();
  /* Стрела на тетиве */
  ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-4-bowPull, 0); ctx.lineTo(20, 0); ctx.stroke();
  ctx.fillStyle = '#c9c9c9';
  ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(15, -3); ctx.lineTo(15, 3);
  ctx.closePath(); ctx.fill();
  /* Оперение стрелы */
  ctx.fillStyle = '#3a8a4a';
  ctx.beginPath(); ctx.moveTo(-4-bowPull, 0); ctx.lineTo(-8-bowPull, -3); ctx.lineTo(-6-bowPull, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-4-bowPull, 0); ctx.lineTo(-8-bowPull, 3); ctx.lineTo(-6-bowPull, 0); ctx.fill();
  ctx.restore();
}

/* ═══════════════════════════════════════
   ФЕЯ: крылья, светящееся облако,
   маленькая, волшебная палочка, платье
   ═══════════════════════════════════════ */
function drawFairy(t, b){
  var fl = Math.sin(t*3)*4;
  var wingFlap = Math.sin(t*6)*.3;

  /* Крылья (большие, полупрозрачные) */
  ctx.save();
  ctx.translate(0, -60+b+fl);
  ctx.globalAlpha = .7;
  /* Левое крыло */
  ctx.save();
  ctx.rotate(-wingFlap);
  ctx.fillStyle = '#c8e8ff';
  ctx.strokeStyle = '#8ab8d8'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-4, -8);
  ctx.quadraticCurveTo(-30, -28, -22, -8);
  ctx.quadraticCurveTo(-28, 6, -4, 8);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
  /* Правое крыло */
  ctx.save();
  ctx.rotate(wingFlap);
  ctx.beginPath();
  ctx.moveTo(4, -8);
  ctx.quadraticCurveTo(30, -28, 22, -8);
  ctx.quadraticCurveTo(28, 6, 4, 8);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.restore();

  /* Светящееся облако под феей */
  ctx.save();
  ctx.translate(0, -20+b+fl);
  ctx.globalAlpha = .4;
  ctx.fillStyle = '#fff8dc';
  ctx.beginPath(); ctx.ellipse(0, 0, 20, 8, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = .25;
  ctx.beginPath(); ctx.ellipse(0, 4, 26, 6, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  /* Тело — платье */
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.fillStyle = '#f8a8d8';
  ctx.beginPath();
  ctx.moveTo(-10, -58+b+fl);
  ctx.lineTo(-14, -28+b+fl);
  ctx.quadraticCurveTo(-16, -24+b+fl, -12, -24+b+fl);
  ctx.lineTo(12, -24+b+fl);
  ctx.quadraticCurveTo(16, -24+b+fl, 14, -28+b+fl);
  ctx.lineTo(10, -58+b+fl);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  /* Декор платья */
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(0, -44+b+fl, 3, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(-4, -36+b+fl, 2, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -36+b+fl, 2, 0, TAU); ctx.fill();

  /* Ножки (маленькие) */
  ctx.fillStyle = '#ffd8c8';
  rr(-6, -24+b+fl, 4, 14, 2, '#ffd8c8');
  rr(2, -24+b+fl, 4, 14, 2, '#ffd8c8');

  /* Голова */
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.fillStyle = '#ffe8d8';
  ctx.beginPath(); ctx.arc(0, -68+b+fl, 10, 0, TAU); ctx.fill(); ctx.stroke();

  /* Волосы (золотые) */
  ctx.fillStyle = '#ffd23d';
  ctx.beginPath();
  ctx.moveTo(-10, -72+b+fl);
  ctx.quadraticCurveTo(-12, -80+b+fl, -4, -82+b+fl);
  ctx.quadraticCurveTo(0, -83+b+fl, 4, -82+b+fl);
  ctx.quadraticCurveTo(12, -80+b+fl, 10, -72+b+fl);
  ctx.lineTo(8, -74+b+fl);
  ctx.quadraticCurveTo(4, -78+b+fl, 0, -78+b+fl);
  ctx.quadraticCurveTo(-4, -78+b+fl, -8, -74+b+fl);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  /* Цветок в волосах */
  ctx.fillStyle = '#ff8b94';
  ctx.beginPath(); ctx.arc(-8, -78+b+fl, 3, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ffd23d';
  ctx.beginPath(); ctx.arc(-8, -78+b+fl, 1.5, 0, TAU); ctx.fill();

  /* Глаза (большие, добрые) */
  ctx.fillStyle = '#4a80e0';
  ctx.beginPath(); ctx.arc(-3, -69+b+fl, 2.5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(3, -69+b+fl, 2.5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-2.5, -69.5+b+fl, 1, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(3.5, -69.5+b+fl, 1, 0, TAU); ctx.fill();

  /* Улыбка */
  ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -65+b+fl, 3, .2, Math.PI-.2); ctx.stroke();
  ctx.lineWidth = 3;

  /* ВОЛШЕБНАЯ ПАЛОЧКА (в руке) */
  ctx.save();
  ctx.translate(14, -50+b+fl);
  ctx.rotate(-.3 + Math.sin(t*2.5)*.1);
  ctx.strokeStyle = '#ffd23d'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(0, -8); ctx.stroke();
  /* Звезда на палочке */
  ctx.shadowColor = '#fff8dc'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#fff8dc';
  ctx.font = '12px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', 0, -12);
  ctx.shadowBlur = 0;
  ctx.restore();

  /* Искры вокруг феи */
  for(var i = 0; i < 4; i++){
    var a = t*2 + i*1.57;
    var sx = Math.cos(a)*18;
    var sy = -50+b+fl + Math.sin(a)*14;
    ctx.fillStyle = 'rgba(255,248,220,' + (.5+Math.sin(t*4+i)*.3) + ')';
    ctx.beginPath(); ctx.arc(sx, sy, 2, 0, TAU); ctx.fill();
  }
}

/* ═══════════════════════════════════════
   СПУТНИКИ
   ═══════════════════════════════════════ */
function drawCompanionKnight(t){
  var b = Math.sin(t*2.3)*2;
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.fillStyle = '#6b7a99';
  rr(-10, -20, 8, 20, 3, '#6b7a99');
  rr(2, -20, 8, 20, 3, '#6b7a99');
  rr(-14, -5, 12, 7, 2, '#3d3222');
  rr(2, -5, 12, 7, 2, '#3d3222');
  rr(-18, -56+b, 36, 40, 6, '#4a80e0');
  ctx.strokeStyle = '#c9a45c'; ctx.lineWidth = 2;
  ctx.strokeRect(-18, -56+b, 36, 40);
  ctx.fillStyle = '#31539e'; ctx.fillRect(-18, -28+b, 36, 6);
  ctx.fillStyle = '#ffd23d';
  ctx.fillRect(-2, -48+b, 4, 12);
  ctx.fillRect(-5, -44+b, 10, 4);
  /* Щит */
  ctx.save(); ctx.translate(-28, -40+b); ctx.rotate(-.08);
  ctx.fillStyle = '#2a5ab8'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -20); ctx.quadraticCurveTo(14, -16, 14, -3);
  ctx.quadraticCurveTo(14, 10, 0, 18);
  ctx.quadraticCurveTo(-14, 10, -14, -3);
  ctx.quadraticCurveTo(-14, -16, 0, -20);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd23d';
  ctx.fillRect(-2, -14, 4, 24);
  ctx.fillRect(-8, -5, 16, 4);
  ctx.restore();
  /* Меч */
  ctx.save(); ctx.translate(24, -44+b); ctx.rotate(-.12+Math.sin(t*2.3)*.06);
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.fillStyle = '#e8e8f0';
  ctx.fillRect(-2, -40, 4, 36);
  ctx.strokeRect(-2, -40, 4, 36);
  ctx.fillStyle = '#ffd23d';
  ctx.fillRect(-6, -4, 12, 4);
  ctx.restore();
  /* Шлем */
  ctx.fillStyle = '#9fb2c8';
  ctx.beginPath(); ctx.arc(0, -68+b, 14, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#4a5a75';
  ctx.fillRect(-9, -70+b, 18, 6);
  ctx.fillStyle = '#4a80e0';
  ctx.beginPath(); ctx.moveTo(-9, -80+b); ctx.lineTo(0, -90+b); ctx.lineTo(9, -80+b);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

function drawCompanionWolf(t){
  var breathe = Math.sin(t*2.5)*1.5;
  var bodyCol = '#8a8a9a', darkCol = '#5a5a6a';
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ee(0, -26+breathe, 32, 18, bodyCol);
  ctx.fillStyle = darkCol;
  rr(-24, -14, 6, 14, 2, darkCol); rr(-12, -14, 6, 14, 2, darkCol);
  rr(6, -14, 6, 14, 2, darkCol); rr(18, -14, 6, 14, 2, darkCol);
  ctx.strokeStyle = bodyCol; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(-30, -30);
  ctx.quadraticCurveTo(-42, -36, -38, -46); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ee(28, -36+breathe, 12, 10, bodyCol);
  ctx.fillStyle = bodyCol;
  ctx.beginPath(); ctx.moveTo(22, -44); ctx.lineTo(24, -54); ctx.lineTo(28, -45);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(30, -44); ctx.lineTo(34, -54); ctx.lineTo(38, -43);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ee(38, -32+breathe, 6, 4, darkCol);
  ctx.fillStyle = '#ff4d5e';
  ctx.beginPath(); ctx.arc(30, -40+breathe, 2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(36, -28); ctx.lineTo(38, -25); ctx.lineTo(40, -28);
  ctx.closePath(); ctx.fill();
}

function drawCompanionFairy(t){
  var fl = Math.sin(t*3)*4;
  ctx.save(); ctx.translate(0, -48+fl); ctx.globalAlpha = .7;
  ctx.fillStyle = '#c8e8ff'; ctx.strokeStyle = '#8ab8d8'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(-14, -8, 12, 18, -.5, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(14, -8, 12, 18, .5, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.globalAlpha = 1; ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.fillStyle = '#f8a8d8';
  ctx.beginPath();
  ctx.moveTo(-10, -24+fl); ctx.lineTo(-12, -44+fl);
  ctx.lineTo(12, -44+fl); ctx.lineTo(10, -24+fl);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd8c8';
  rr(-6, -19+fl, 4, 14, 2, '#ffd8c8');
  rr(2, -19+fl, 4, 14, 2, '#ffd8c8');
  ctx.fillStyle = '#ffe8d8';
  ctx.beginPath(); ctx.arc(0, -54+fl, 10, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd23d';
  ctx.beginPath(); ctx.arc(0, -58+fl, 10, Math.PI, 0); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.arc(-3, -55+fl, 1.5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(3, -55+fl, 1.5, 0, TAU); ctx.fill();
  for(var i = 0; i < 3; i++){
    var a = t*2+i;
    ctx.fillStyle = 'rgba(255,248,220,.6)';
    ctx.beginPath(); ctx.arc(Math.cos(a)*16, -44+fl+Math.sin(a)*12, 1.5, 0, TAU); ctx.fill();
  }
}

/* --- Карта отрисовки героев --- */
var HERO_DRAW = {
  knight: drawKnight,
  mage: drawMage,
  rogue: drawRogue,
  barbarian: drawBarbarian,
  inventor: drawInventor,
  archer: drawArcher,
  fairy: drawFairy
};