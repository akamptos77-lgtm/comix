'use strict';
/* ============================================
06b-DATA-CYCLE-WEAPONS: оружие Пустоты
для бесконечных циклов
============================================ */
var CYCLE_WEAPONS=[
  /* Цикл 1+ */
  {slot:'weapon',i:'🌀',n:'Клинок Пустоты',rar:2,f:1,b:{atk:15,crit:10,vamp:.15},cycleReq:1,desc:'+15 атаки, +10% крит, +15% вамп'},
  {slot:'weapon',i:'⚡',n:'Разряд Хаоса',rar:2,f:1,b:{atk:18,crit:8},cycleReq:1,el:'lightning',desc:'+18 атаки, +8% крит'},
  {slot:'armor',i:'🖤',n:'Доспех Бездны',rar:2,f:1,b:{def:12,hp:40,dodge:5},cycleReq:1,desc:'+12 защиты, +40 HP, +5% уворот'},
  {slot:'ring',i:'💀',n:'Кольцо Небытия',rar:2,f:1,b:{atk:8,crit:6,vamp:.1},cycleReq:1,desc:'+8 атаки, +6% крит, +10% вамп'},
  {slot:'amulet',i:'🔮',n:'Сердце Пустоты',rar:2,f:1,b:{atk:10,hp:30,crit:5},cycleReq:1,desc:'+10 атаки, +30 HP, +5% крит'},

  /* Цикл 2+ */
  {slot:'weapon',i:'🌑',n:'Жнец Миров',rar:2,f:1,b:{atk:22,crit:12,vamp:.2},cycleReq:2,desc:'+22 атаки, +12% крит, +20% вамп'},
  {slot:'weapon',i:'☄️',n:'Осколок Звезды',rar:2,f:1,b:{atk:20,crit:15},cycleReq:2,el:'fire',desc:'+20 атаки, +15% крит'},
  {slot:'armor',i:'🌌',n:'Покров Хаоса',rar:2,f:1,b:{def:15,hp:50,dodge:8},cycleReq:2,desc:'+15 защиты, +50 HP, +8% уворот'},
  {slot:'helmet',i:'👁️',n:'Око Бездны',rar:2,f:1,b:{def:10,hp:35,crit:8},cycleReq:2,desc:'+10 защиты, +35 HP, +8% крит'},
  {slot:'boots',i:'🌪️',n:'Шаги Сквозь Время',rar:2,f:1,b:{dodge:12,spd:5,crit:4},cycleReq:2,desc:'+12% уворот, +5 скорость, +4% крит'},

  /* Цикл 3+ */
  {slot:'weapon',i:'✴️',n:'Клинок Вечности',rar:2,f:1,b:{atk:28,crit:14,vamp:.25},cycleReq:3,desc:'+28 атаки, +14% крит, +25% вамп'},
  {slot:'weapon',i:'💫',n:'Стрела Пустоты',rar:2,f:1,b:{atk:25,crit:18},cycleReq:3,el:'dark',desc:'+25 атаки, +18% крит'},
  {slot:'armor',i:'🕳️',n:'Броня Небытия',rar:2,f:1,b:{def:18,hp:60,dodge:10},cycleReq:3,desc:'+18 защиты, +60 HP, +10% уворот'},
  {slot:'gloves',i:'🤲',n:'Перчатки Творца',rar:2,f:1,b:{atk:12,crit:10,hp:20},cycleReq:3,desc:'+12 атаки, +10% крит, +20 HP'},
  {slot:'amulet',i:'♾️',n:'Символ Бесконечности',rar:2,f:1,b:{atk:15,def:8,hp:40,crit:8},cycleReq:3,desc:'+15 атаки, +8 защиты, +40 HP, +8% крит'}
];

/* Переопределяем ITEMS(), чтобы добавить оружие циклов */
var _origITEMS = ITEMS;
ITEMS = function(){
  var base = _origITEMS();
  if(G.cycle > 0){
    var cyclePool = CYCLE_WEAPONS.filter(function(it){
      return it.cycleReq <= G.cycle;
    });
    base = base.concat(cyclePool);
  }
  return base;
};