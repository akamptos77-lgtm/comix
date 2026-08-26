'use strict';
/* 02-DATA-ELEMENTS: стихии, сложность, редкости, слоты */

var ELEMENTS = {
  physical:  { name:'Физ.',   icon:'⚔️', color:'#9a9aa5' },
  fire:      { name:'Огонь',  icon:'🔥', color:'#ff8b4a' },
  ice:       { name:'Лёд',    icon:'❄️', color:'#9fd8ff' },
  lightning: { name:'Молния', icon:'⚡', color:'#ffd23d' },
  poison:    { name:'Яд',     icon:'☠️', color:'#b6ff5e' },
  holy:      { name:'Свет',   icon:'✨', color:'#fff2b8' },
  dark:      { name:'Тьма',   icon:'🌑', color:'#b66bff' }
};

function elemMult(elem, enemy){
  if(!elem || !enemy) return 1;
  var m = 1;
  if(enemy.weak   === elem) m *= 1.5;
  if(enemy.resist === elem) m *= 0.5;
  return m;
}

function elemLabel(e){
  if(!e) return '';
  var el = ELEMENTS[e];
  if(!el) return '';
  return '<span class="elem" style="background:' + el.color + ';color:#171022">' +
         el.icon + ' ' + el.name + '</span>';
}

var DIFF = {
  easy:   { hp:.8,  atk:.75, gold:1.4, pots:4, elite:.08 },
  normal: { hp:1,   atk:.9,  gold:1.1, pots:3, elite:.1  },
  hard:   { hp:1.2, atk:1.1, gold:.9,  pots:2, elite:.18 }
};

var RAR = ['обычный', 'редкий', 'эпический'];

/* === СЛОТЫ: добавлен универсальный 'ring' === */
var SLOT_NAME = {
  weapon: '⚔️ Оружие',
  armor:  '🛡️ Броня',
  helmet: '🪖 Шлем',
  boots:  '👢 Ботинки',
  gloves: '🧤 Перчатки',
  ring:   '💍 Кольцо',      /* универсальное кольцо */
  ring1:  '💍 Кольцо 1',
  ring2:  '💍 Кольцо 2',
  amulet: '📿 Амулет'
};

var ARMORABLE   = ['knight', 'barbarian'];
var ROBABLE     = ['mage', 'fairy'];
var LEATHERABLE = ['rogue', 'archer', 'inventor'];