'use strict';
/* ============================================
   03-DATA-HEROES: 7 героев и 56 навыков
   (с параметрами pow, hits, heal для UI)
   ============================================ */

var CLASSES = {
  knight: {
    name:'Рыцарь', icon:'🛡️', hp:140, atk:14, def:8, spd:6, crit:8,
    atkType:'melee', projType:null, el:'physical',
    stats:{str:2, agi:0, int:0, vit:2},
    desc:'Латы и щит. Надёжная защита.',
    skill:{name:'Щитовой удар', desc:'135% урона + защита', cd:3, pow:1.35}
  },
  mage: {
    name:'Маг', icon:'🔮', hp:105, atk:18, def:4, spd:8, crit:12,
    atkType:'ranged', projType:'fireball', el:'fire',
    stats:{str:0, agi:1, int:3, vit:0},
    desc:'Мантия и посох. Огонь сквозь броню.',
    skill:{name:'Огненный шар', desc:'210% 🔥 сквозь броню', cd:4, pow:2.1}
  },
  rogue: {
    name:'Плут', icon:'🗡️', hp:120, atk:15, def:5, spd:12, crit:25,
    atkType:'melee', projType:null, el:'physical',
    stats:{str:0, agi:3, int:0, vit:0},
    desc:'Капюшон и кинжалы. Криты и увороты.',
    skill:{name:'Танец клинков', desc:'2 удара по 85%, +крит', cd:3, pow:0.85, hits:2}
  },
  barbarian: {
    name:'Варвар', icon:'⚔️', hp:160, atk:17, def:4, spd:7, crit:14,
    atkType:'melee', projType:null, el:'physical',
    stats:{str:3, agi:1, int:0, vit:1},
    desc:'Мех и топор. Грубая сила.',
    skill:{name:'Яростный удар', desc:'220% + ярость', cd:4, pow:2.2}
  },
  inventor: {
    name:'Изобретатель', icon:'🔫', hp:110, atk:16, def:5, spd:10, crit:15,
    atkType:'ranged', projType:'bullet', el:'lightning',
    stats:{str:0, agi:2, int:2, vit:0},
    desc:'Паровое ружьё. Стреляет издалека.',
    skill:{name:'Залп картечью', desc:'3 выстрела по 75%', cd:4, pow:0.75, hits:3}
  },
  archer: {
    name:'Лучница', icon:'🏹', hp:115, atk:16, def:5, spd:13, crit:20,
    atkType:'ranged', projType:'arrow', el:'physical',
    stats:{str:1, agi:3, int:0, vit:0},
    desc:'Меткий лук. Бьёт точно в цель.',
    skill:{name:'Тройной выстрел', desc:'3 стрелы по 70%, +крит', cd:3, pow:0.7, hits:3}
  },
  fairy: {
    name:'Фея', icon:'🧚', hp:95, atk:17, def:3, spd:14, crit:14,
    atkType:'ranged', projType:'arcane', el:'holy',
    stats:{str:0, agi:2, int:3, vit:0},
    desc:'Крылья и свет. Лечит и карает.',
    skill:{name:'Сияние', desc:'180% ✨ + лечение 15%', cd:4, pow:1.8, heal:0.15}
  }
};

var SKILL_BOOKS = {
  knight:[
    {id:'k_pierce',  name:'Пробивающий удар', icon:'🗡️', desc:'160%, игнор брони',         cd:3, el:'physical', pow:1.6, run:function(h,e){ return heroStrike(1.6,{ignoreDef:true,word:'ПРОБИТИЕ!',el:'physical'}); }},
    {id:'k_warcry',  name:'Боевой клич',      icon:'📣', desc:'+50% атаки 3 хода',           cd:4, run:function(h,e){ buffHero('atk',3); return Promise.resolve(); }},
    {id:'k_iron',    name:'Железная кожа',    icon:'🛡️', desc:'+50% защиты 3 хода',         cd:4, run:function(h,e){ buffHero('def',3); return Promise.resolve(); }},
    {id:'k_holy',    name:'Святая кара',      icon:'✨', desc:'130% ✨ + лечение 15%',      cd:4, el:'holy', pow:1.3, heal:0.15, run:function(h,e){ return heroStrike(1.3,{word:'КАРА!',el:'holy'}).then(function(){ healHero(.15); }); }},
    {id:'k_cleanse', name:'Очищение',         icon:'💫', desc:'Снимает негатив',            cd:3, run:function(h,e){ cleanseHero(); return Promise.resolve(); }},
    {id:'k_stun',    name:'Оглушающий удар',  icon:'💥', desc:'100% + оглушение',           cd:4, el:'physical', pow:1.0, run:function(h,e){ return heroStrike(1.0,{word:'БАМ!',el:'physical'}).then(function(){ stunEnemy(1); }); }},
    {id:'k_wall',    name:'Стена щитов',      icon:'🧱', desc:'Блок атаки',                  cd:4, run:function(h,e){ shieldHero(); return Promise.resolve(); }},
    {id:'k_execute', name:'Казнь',            icon:'⚰️', desc:'120%, ×2 при <30% HP',       cd:4, el:'physical', pow:1.2, run:function(h,e){ var m=1.2; if(e.hp<e.maxHp*.3)m=2.4; return heroStrike(m,{word:'КАЗНЬ!',big:true,el:'physical'}); }}
  ],
  mage:[
    {id:'m_ice',    name:'Ледяная стрела',    icon:'❄️', desc:'140% ❄️ + оглушение',         cd:3, el:'ice', pow:1.4, run:function(h,e){ return heroStrike(1.4,{ignoreDef:true,word:'ЛЁД!',el:'ice'}).then(function(){ stunEnemy(1); }); }},
    {id:'m_storm',  name:'Огненный шторм',    icon:'🔥', desc:'230% 🔥 сквозь броню',       cd:5, el:'fire', pow:2.3, run:function(h,e){ return heroStrike(2.3,{ignoreDef:true,word:'ШТОРМ!',big:true,el:'fire'}); }},
    {id:'m_bolt',   name:'Молния',            icon:'⚡', desc:'200% ⚡ всегда попадает',    cd:4, el:'lightning', pow:2.0, run:function(h,e){ return heroStrike(2.0,{word:'ЗЫСЬ!',el:'lightning',sure:true}); }},
    {id:'m_mana',   name:'Мана-поток',        icon:'🔷', desc:'Лечит 25%, сброс КД',        cd:5, heal:0.25, run:function(h,e){ healHero(.25); h.skillCd=0; log('База готова!'); return Promise.resolve(); }},
    {id:'m_clear',  name:'Очищение разума',   icon:'🌀', desc:'Снимает негатив',            cd:3, run:function(h,e){ cleanseHero(); return Promise.resolve(); }},
    {id:'m_freeze', name:'Заморозка',         icon:'🥶', desc:'Оглушение 2 хода',           cd:5, el:'ice', run:function(h,e){ stunEnemy(2); return Promise.resolve(); }},
    {id:'m_drain',  name:'Вампирский контакт',icon:'🩸', desc:'150% + лечение 20%',         cd:4, el:'dark', pow:1.5, heal:0.20, run:function(h,e){ return heroStrike(1.5,{word:'РАЗРЯД!',el:'dark'}).then(function(){ healHero(.20); }); }},
    {id:'m_meteor', name:'Метеор',            icon:'☄️', desc:'300% 🔥 сквозь броню',       cd:6, el:'fire', pow:3.0, run:function(h,e){ return heroStrike(3.0,{ignoreDef:true,word:'МЕТЕОР!',big:true,el:'fire'}); }}
  ],
  rogue:[
    {id:'r_poison',  name:'Отравленный клинок', icon:'☠️', desc:'100% + яд 3 хода',          cd:3, el:'poison', pow:1.0, run:function(h,e){ return heroStrike(1.0,{word:'РЕЗ!',el:'poison'}).then(function(){ poisonEnemy(3,Math.max(3,Math.round(getHeroAtk()*.3))); }); }},
    {id:'r_shadow',  name:'Теневой удар',       icon:'🌑', desc:'Гарантированный крит',      cd:4, el:'dark', pow:1.8, run:function(h,e){ return heroStrike(1.8,{word:'КРИТ!',crit:true,el:'dark'}); }},
    {id:'r_smoke',   name:'Дымовая завеса',     icon:'💨', desc:'+уклонение и щит',          cd:4, run:function(h,e){ buffHero('dodge',2); shieldHero(); return Promise.resolve(); }},
    {id:'r_fan',     name:'Веер ножей',         icon:'🔪', desc:'3 удара по 60%',            cd:4, el:'physical', pow:0.6, hits:3, run:function(h,e){ var chain=Promise.resolve(); for(var i=0;i<3;i++){ (function(idx){ chain=chain.then(function(){ if(!e.dead) return heroStrike(.6,{word:'ВЖУХ!',el:'physical'}); }); })(i); } return chain; }},
    {id:'r_agi',     name:'Ловкость',           icon:'👟', desc:'+уклонение 3 хода',         cd:4, run:function(h,e){ buffHero('dodge',3); return Promise.resolve(); }},
    {id:'r_antitox', name:'Антитоксин',         icon:'🧪', desc:'Снимает негатив + лечит',   cd:3, heal:0.10, run:function(h,e){ cleanseHero(); healHero(.10); return Promise.resolve(); }},
    {id:'r_stealth', name:'Скрытный удар',      icon:'🤫', desc:'120% + оглушение',          cd:4, el:'physical', pow:1.2, run:function(h,e){ return heroStrike(1.2,{word:'ТЫК!',el:'physical'}).then(function(){ stunEnemy(1); }); }},
    {id:'r_death',   name:'Танец смерти',       icon:'💃', desc:'4 удара по 70%',            cd:6, el:'physical', pow:0.7, hits:4, run:function(h,e){ var chain=Promise.resolve(); for(var i=0;i<4;i++){ (function(idx){ chain=chain.then(function(){ if(!e.dead) return heroStrike(.7,{word:'ТАНЕЦ!',el:'physical'}); }); })(i); } return chain; }}
  ],
  barbarian:[
    {id:'b_rage',    name:'Ярость берсерка', icon:'😡', desc:'+80% атаки 3 хода',        cd:4, run:function(h,e){ buffHero('atk',3); buffHero('rage',3); return Promise.resolve(); }},
    {id:'b_cleave',  name:'Рассечение',      icon:'🪓', desc:'200% урона',                 cd:4, el:'physical', pow:2.0, run:function(h,e){ return heroStrike(2.0,{word:'РАССЕЧЕНИЕ!',big:true,el:'physical'}); }},
    {id:'b_roar',    name:'Варварский рёв',  icon:'📣', desc:'Оглушение 2 хода',           cd:5, run:function(h,e){ stunEnemy(2); return Promise.resolve(); }},
    {id:'b_smash',   name:'Сокрушение',      icon:'💥', desc:'180% + игнор брони',         cd:4, el:'physical', pow:1.8, run:function(h,e){ return heroStrike(1.8,{ignoreDef:true,word:'КРУШУ!',big:true,el:'physical'}); }},
    {id:'b_blood',   name:'Кровавая жажда',  icon:'🩸', desc:'150% + лечение 25%',         cd:4, el:'physical', pow:1.5, heal:0.25, run:function(h,e){ return heroStrike(1.5,{word:'ЖАЖДА!',el:'physical'}).then(function(){ healHero(.25); }); }},
    {id:'b_fury',    name:'Неистовство',     icon:'🔥', desc:'3 удара по 90%',             cd:5, el:'physical', pow:0.9, hits:3, run:function(h,e){ var chain=Promise.resolve(); for(var i=0;i<3;i++){ (function(idx){ chain=chain.then(function(){ if(!e.dead) return heroStrike(.9,{word:'НЕИСТОВСТВО!',el:'physical'}); }); })(i); } return chain; }},
    {id:'b_wall',    name:'Скала',           icon:'🧱', desc:'Щит + защита',               cd:4, run:function(h,e){ shieldHero(); buffHero('def',2); return Promise.resolve(); }},
    {id:'b_heal',    name:'Живучесть',       icon:'❤️', desc:'Лечит 35% HP',               cd:5, heal:0.35, run:function(h,e){ healHero(.35); return Promise.resolve(); }}
  ],
  inventor:[
    {id:'i_headshot', name:'Точный выстрел',      icon:'🎯', desc:'200%, гарант. крит',       cd:4, el:'lightning', pow:2.0, run:function(h,e){ return heroStrike(2.0,{crit:true,word:'ХЕДШОТ!',big:true,el:'lightning'}); }},
    {id:'i_net',       name:'Сеть',               icon:'🕸️', desc:'Оглушение 2 хода',         cd:5, pow:0.5, run:function(h,e){ stunEnemy(2); return heroStrike(.5,{word:'В СЕТЬ!',el:'physical'}); }},
    {id:'i_grenade',   name:'Граната',            icon:'💣', desc:'250%, игнор брони',        cd:5, el:'fire', pow:2.5, run:function(h,e){ return heroStrike(2.5,{ignoreDef:true,word:'БАБАХ!',big:true,el:'fire'}); }},
    {id:'i_poison',    name:'Отравленная пуля',   icon:'☠️', desc:'120% + яд',                cd:4, el:'poison', pow:1.2, run:function(h,e){ return heroStrike(1.2,{word:'ОТРАВА!',el:'poison'}).then(function(){ poisonEnemy(3,Math.max(3,Math.round(getHeroAtk()*.3))); }); }},
    {id:'i_scope',     name:'Прицел',             icon:'🔭', desc:'+100% крит 2 хода',         cd:4, run:function(h,e){ buffHero('crit',2); return Promise.resolve(); }},
    {id:'i_multi',     name:'Очередь',            icon:'🔫', desc:'4 выстрела по 55%',        cd:5, el:'lightning', pow:0.55, hits:4, run:function(h,e){ var chain=Promise.resolve(); for(var i=0;i<4;i++){ (function(idx){ chain=chain.then(function(){ if(!e.dead) return heroStrike(.55,{word:'ТРА-ТА!',el:'lightning'}); }); })(i); } return chain; }},
    {id:'i_emp',       name:'ЭМИ-заряд',          icon:'⚡', desc:'150% ⚡ + оглушение',      cd:4, el:'lightning', pow:1.5, run:function(h,e){ return heroStrike(1.5,{word:'ЭМИ!',el:'lightning'}).then(function(){ stunEnemy(1); }); }},
    {id:'i_heal',      name:'Аптечка',            icon:'🩹', desc:'Лечит 30% HP',             cd:4, heal:0.30, run:function(h,e){ healHero(.30); return Promise.resolve(); }}
  ],
  archer:[
    {id:'a_multi', name:'Веер стрел',          icon:'🏹', desc:'4 стрелы по 55%',           cd:4, el:'physical', pow:0.55, hits:4, run:function(h,e){ var chain=Promise.resolve(); for(var i=0;i<4;i++){ (function(idx){ chain=chain.then(function(){ if(!e.dead) return heroStrike(.55,{word:'ВЖУХ!',el:'physical'}); }); })(i); } return chain; }},
    {id:'a_fire',  name:'Огненная стрела',     icon:'🔥', desc:'180% 🔥 + поджог',          cd:4, el:'fire', pow:1.8, run:function(h,e){ return heroStrike(1.8,{word:'ГОРИ!',el:'fire'}).then(function(){ burnEnemy(3,Math.max(3,Math.round(getHeroAtk()*.3))); }); }},
    {id:'a_ice',   name:'Ледяная стрела',      icon:'❄️', desc:'140% ❄️ + оглушение',      cd:3, el:'ice', pow:1.4, run:function(h,e){ return heroStrike(1.4,{word:'ЛЁД!',el:'ice'}).then(function(){ stunEnemy(1); }); }},
    {id:'a_snipe', name:'Снайперский выстрел', icon:'🎯', desc:'250%, гарант. крит',        cd:5, el:'physical', pow:2.5, run:function(h,e){ return heroStrike(2.5,{crit:true,word:'ТОЧНО!',big:true,el:'physical'}); }},
    {id:'a_agi',   name:'Орлиный глаз',        icon:'🦅', desc:'+100% крит 2 хода',          cd:4, run:function(h,e){ buffHero('crit',2); return Promise.resolve(); }},
    {id:'a_trap',  name:'Капкан',              icon:'🪤', desc:'Оглушение 2 хода',          cd:5, run:function(h,e){ stunEnemy(2); return Promise.resolve(); }},
    {id:'a_pier',  name:'Пронзающий выстрел',  icon:'🗡️', desc:'170%, игнор брони',         cd:4, el:'physical', pow:1.7, run:function(h,e){ return heroStrike(1.7,{ignoreDef:true,word:'ПРОНЗИЛ!',el:'physical'}); }},
    {id:'a_heal',  name:'Травяной отвар',      icon:'🌿', desc:'Лечит 30% HP',              cd:4, heal:0.30, run:function(h,e){ healHero(.30); return Promise.resolve(); }}
  ],
  fairy:[
    {id:'f_heal',   name:'Живительная пыльца', icon:'🌸', desc:'Лечит 45% HP',              cd:4, heal:0.45, run:function(h,e){ healHero(.45); return Promise.resolve(); }},
    {id:'f_holy',   name:'Луч света',          icon:'✨', desc:'200% ✨',                    cd:4, el:'holy', pow:2.0, run:function(h,e){ return heroStrike(2.0,{word:'СИЯЙ!',el:'holy'}); }},
    {id:'f_bless',  name:'Благословение',      icon:'🕊️', desc:'+50% атаки и защиты',       cd:5, run:function(h,e){ buffHero('atk',3); buffHero('def',3); return Promise.resolve(); }},
    {id:'f_stun',   name:'Сонная пыль',        icon:'💤', desc:'Оглушение 2 хода',          cd:5, run:function(h,e){ stunEnemy(2); return Promise.resolve(); }},
    {id:'f_nature', name:'Гнев природы',       icon:'🌿', desc:'180% + лечение 20%',        cd:4, el:'poison', pow:1.8, heal:0.20, run:function(h,e){ return heroStrike(1.8,{word:'ПРИРОДА!',el:'poison'}).then(function(){ healHero(.20); }); }},
    {id:'f_clean',  name:'Очищение',           icon:'💫', desc:'Снимает негатив',           cd:3, run:function(h,e){ cleanseHero(); return Promise.resolve(); }},
    {id:'f_shield', name:'Крылья-щит',         icon:'🧚', desc:'Щит + уклонение',           cd:4, run:function(h,e){ shieldHero(); buffHero('dodge',2); return Promise.resolve(); }},
    {id:'f_wrath',  name:'Гнев зари',          icon:'☀️', desc:'250% ✨ сквозь броню',      cd:6, el:'holy', pow:2.5, run:function(h,e){ return heroStrike(2.5,{ignoreDef:true,word:'ЗАРЯ!',big:true,el:'holy'}); }}
  ]
};