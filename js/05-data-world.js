'use strict';
/* ============================================
05-DATA-WORLD: биомы, эффекты, загадки,
карточки, реликвии, квесты, обучение
============================================ */

var BIOMES = [
  {name:'Подземелье', ico:'🕯️', bg:['#2a2050', '#120d24'], ground:'#0d0919', acc:'#ffd23d', scene:'dungeon'},
  {name:'Склеп', ico:'⚰️', bg:['#1e3a2e', '#0d1f16'], ground:'#0a1810', acc:'#7ef29a', scene:'crypt'},
  {name:'Дорога разбойников', ico:'🛣️', bg:['#7a9a5a', '#4a6a3a'], ground:'#6a5a3a', acc:'#ffce6b', scene:'road'},
  {name:'Тёмный лес', ico:'🌲', bg:['#1e3a1e', '#0d1f0d'], ground:'#0a180a', acc:'#8ef5a6', scene:'forest'},
  {name:'Гнилое болото', ico:'🐸', bg:['#2e3a20', '#161f0d'], ground:'#101808', acc:'#b6e35e', scene:'swamp'},
  {name:'Горные пики', ico:'🏔️', bg:['#5a6a8a', '#3a4a6a'], ground:'#4a4a5a', acc:'#c9d2e8', scene:'mountain'},
  {name:'Огненное сердце', ico:'🌋', bg:['#4a2010', '#260d06'], ground:'#1c0804', acc:'#ff8b4a', scene:'volcano'},
  {name:'Ледяные пустоши', ico:'❄️', bg:['#4a6a8a', '#2a4a6a'], ground:'#3a5a7a', acc:'#9fd8ff', scene:'ice'},
  {name:'Бездна', ico:'👁️', bg:['#2a1040', '#12061f'], ground:'#0d0418', acc:'#b66bff', scene:'abyss'},
  {name:'Пустота', ico:'🌌', bg:['#101018', '#060608'], ground:'#030304', acc:'#8a1eff', scene:'void'}
];

var getBiomeIdx = function(f){
  return Math.min(10, Math.ceil(f / 10));
};

var getBiome = function(f){
  return BIOMES[getBiomeIdx(f) - 1];
};

var BIOME_FX = {
  dungeon: null,
  crypt: {elem:'dark', mult:1.25, label:'🌑 Тьма сильнее: +25% урона тьмой'},
  road: {elem:'physical', mult:1.1, label:'⚔️ Открытый бой: +10% физ. урона'},
  forest: {elem:'poison', mult:1.25, label:'☠️ Яды сильнее: +25% урона ядом'},
  swamp: {tick:true, label:'🐸 Испарения: каждый 3-й раунд −3% HP обоим'},
  mountain: {elem:'physical', mult:1.25, label:'⚔️ Физ. урон +25%'},
  volcano: {elem:'fire', mult:1.25, label:'🔥 Огонь сильнее: +25% урона огнём'},
  ice: {elem:'ice', mult:1.25, dodge:-5, label:'❄️ Лёд +25%, всем −5% уклонения'},
  abyss: {elem:'dark', mult:1.25, label:'🌑 Тьма +25%'},
  void: {critMult:2.5, label:'🌌 Криты наносят ×2.5 вместо ×1.8'}
};

function getBiomeFx(){
  return BIOME_FX[getBiome(G.floor).scene] || null;
}

/* ============================================
РЕЛИКВИИ: 50 штук
Старые сохранены, добавлены новые с эффектами
============================================ */
var RELICS = [
  /* --- Старые 8 реликвий --- */
  {id:'vamp_heart', i:'🩸', n:'Сердце Вампира', d:'+5% вампиризма'},
  {id:'luck_bone', i:'🎲', n:'Кость Судьбы', d:'15% шанс удвоить золото с врагов'},
  {id:'hourglass', i:'⏳', n:'Песочные часы', d:'−1 КД всех навыков'},
  {id:'berskull', i:'💀', n:'Череп Берсерка', d:'+10% атаки, но −10% макс. HP'},
  {id:'clover', i:'🍀', n:'Клевер Вора', d:'+20% к шансу ингредиента'},
  {id:'phoenix', i:'🪶', n:'Перо Феникса', d:'Один раз за 10 боёв: при смертельном ударе остаётся 1 HP'},
  {id:'dragonscale', i:'🐉', n:'Чешуя Дракона', d:'+2 защиты, +10 макс. HP'},
  {id:'swiftboot', i:'👟', n:'Сапоги Ветрохода', d:'+3% уклонения, +2 к побегу'},

  /* --- Новые 42 реликвии --- */
  {id:'r_atk1', i:'🗡️', n:'Осколок клинка', d:'+2 атаки', fx:{atk:2}},
  {id:'r_atk2', i:'🔪', n:'Заточенный клык', d:'+4 атаки', fx:{atk:4}},
  {id:'r_atk3', i:'🧿', n:'Боевая печать', d:'+6 атаки', fx:{atk:6}},

  {id:'r_atkp1', i:'🐺', n:'Волчий тотем', d:'+5% атаки', fx:{atkPct:5}},
  {id:'r_atkp2', i:'🦁', n:'Львиное сердце', d:'+8% атаки', fx:{atkPct:8}},

  {id:'r_def1', i:'🪵', n:'Дубовая пластина', d:'+2 защиты', fx:{def:2}},
  {id:'r_def2', i:'🧱', n:'Каменная плита', d:'+4 защиты', fx:{def:4}},
  {id:'r_def3', i:'🛡️', n:'Обломок щита героя', d:'+6 защиты', fx:{def:6}},

  {id:'r_defp1', i:'🕸️', n:'Плотная сетка', d:'+5% защиты', fx:{defPct:5}},
  {id:'r_defp2', i:'⚙️', n:'Железная структура', d:'+8% защиты', fx:{defPct:8}},

  {id:'r_hp1', i:'🍖', n:'Вяленое мясо', d:'+15 макс. HP', fx:{hp:15}},
  {id:'r_hp2', i:'🍯', n:'Целебный мёд', d:'+25 макс. HP', fx:{hp:25}},
  {id:'r_hp3', i:'❤️', n:'Крепкое сердце', d:'+40 макс. HP', fx:{hp:40}},

  {id:'r_hpp1', i:'🌿', n:'Живой корень', d:'+5% макс. HP', fx:{hpPct:5}},
  {id:'r_hpp2', i:'🌳', n:'Сердце древа', d:'+8% макс. HP', fx:{hpPct:8}},

  {id:'r_crit1', i:'🎯', n:'Точёный наконечник', d:'+4% крит', fx:{crit:4}},
  {id:'r_crit2', i:'👁️', n:'Зоркий глаз', d:'+6% крит', fx:{crit:6}},
  {id:'r_crit3', i:'🌟', n:'Звезда охотника', d:'+9% крит', fx:{crit:9}},

  {id:'r_dodge1', i:'🪶', n:'Лёгкое перо', d:'+3% уклонения', fx:{dodge:3}},
  {id:'r_dodge2', i:'💨', n:'Ловчий ветер', d:'+5% уклонения', fx:{dodge:5}},
  {id:'r_dodge3', i:'🐈', n:'Кошачья грация', d:'+8% уклонения', fx:{dodge:8}},

  {id:'r_vamp1', i:'🦇', n:'Клыки ночницы', d:'+4% вампиризма', fx:{vamp:4}},
  {id:'r_vamp2', i:'🍷', n:'Чаша крови', d:'+6% вампиризма', fx:{vamp:6}},

  {id:'r_skill1', i:'📘', n:'Записи мастера', d:'+8% урона навыков', fx:{skillPct:8}},
  {id:'r_skill2', i:'🔮', n:'Руна силы', d:'+12% урона навыков', fx:{skillPct:12}},
  {id:'r_skill3', i:'🧠', n:'Ясный ум', d:'+16% урона навыков', fx:{skillPct:16}},

  {id:'r_potion1', i:'🍵', n:'Травяной отвар', d:'+8% силы зелий', fx:{potionPct:8}},
  {id:'r_potion2', i:'⚗️', n:'Алхимический набор', d:'+12% силы зелий', fx:{potionPct:12}},

  {id:'r_gold1', i:'🪙', n:'Медный талисман', d:'+10% золота', fx:{goldPct:10}},
  {id:'r_gold2', i:'💰', n:'Кошель торговца', d:'+15% золота', fx:{goldPct:15}},
  {id:'r_gold3', i:'👑', n:'Золотая корона', d:'+25% золота', fx:{goldPct:25}},

  {id:'r_mat1', i:'🧺', n:'Плетёная корзина', d:'+10% шанс ингредиента', fx:{matPct:10}},
  {id:'r_mat2', i:'🧲', n:'Магнит искателя', d:'+15% шанс ингредиента', fx:{matPct:15}},
  {id:'r_mat3', i:'🗺️', n:'Карта тайников', d:'+20% шанс ингредиента', fx:{matPct:20}},

  {id:'r_mix1', i:'🧿', n:'Оберег воина', d:'+2 атаки и +10 макс. HP', fx:{atk:2, hp:10}},
  {id:'r_mix2', i:'📿', n:'Амулет стража', d:'+2 защиты и +10 макс. HP', fx:{def:2, hp:10}},
  {id:'r_mix3', i:'🎭', n:'Маска актёра', d:'+3% крит и +3% уклонения', fx:{crit:3, dodge:3}},
  {id:'r_mix4', i:'🌙', n:'Лунный камень', d:'+4% крит и +6% урона навыков', fx:{crit:4, skillPct:6}},
  {id:'r_mix5', i:'☀️', n:'Солнечный камень', d:'+4% уклонения и +8% силы зелий', fx:{dodge:4, potionPct:8}},
  {id:'r_mix6', i:'🩹', n:'Кровавая повязка', d:'+3% вампиризма и +15 макс. HP', fx:{vamp:3, hp:15}},
  {id:'r_mix7', i:'🔥', n:'Уголь войны', d:'+3 атаки и +3% крит', fx:{atk:3, crit:3}},
  {id:'r_mix8', i:'🧊', n:'Ледяная галька', d:'+3 защиты и +3% уклонения', fx:{def:3, dodge:3}}
];

/* ============================================
Подсчёт бонусов от реликвий
Используется в 08-engine-hero.js и 09-engine-combat.js
============================================ */
function relicFxSum(key){
  if (typeof G === 'undefined' || !G.relics || typeof RELICS === 'undefined') return 0;

  var sum = 0;

  for (var i = 0; i < G.relics.length; i++) {
    var id = G.relics[i];

    for (var j = 0; j < RELICS.length; j++) {
      if (RELICS[j].id === id) {
        if (RELICS[j].fx && RELICS[j].fx[key]) {
          sum += RELICS[j].fx[key];
        }
        break;
      }
    }
  }

  return sum;
}

/* === ЗАГАДКИ === */
var RIDDLES = [
  {q:'Спит в гробу, боится солнца и пьёт кровь. Кто это?', a:['Оборотень', 'Тролль', 'Вампир'], ok:2},
  {q:'Днём — человек, в полнолуние — воющий зверь. Кто это?', a:['Рыцарь', 'Оборотень', 'Вампир'], ok:1},
  {q:'Сотворён из глины и камня, слушает слово хозяина. Что это?', a:['Голем', 'Дракон', 'Дварф'], ok:0},
  {q:'Копит золото в логове и дышит огнём. Кто это?', a:['Гоблин', 'Маг', 'Дракон'], ok:2},
  {q:'Нет рук, а держат; нет тела, а защищает. Что это?', a:['Щит', 'Плащ', 'Шлем'], ok:0},
  {q:'Перо есть, а не летает; голова есть, а не думает. Что это?', a:['Птица', 'Перо писца', 'Стрела'], ok:2},
  {q:'Маленький, железный, а любую дверь без слова открывает. Что это?', a:['Ключ', 'Монета', 'Дварф'], ok:0},
  {q:'Чем больше из неё берёшь, тем больше она становится. Что это?', a:['Сундук', 'Яма', 'Мешок'], ok:1},
  {q:'Живёт без тела, говорит без языка. Кто это?', a:['История', 'Эхо', 'Тень'], ok:1},
  {q:'Невидим, но гнёт деревья; без крыльев летит. Что это?', a:['Тень', 'Призрак', 'Ветер'], ok:2},
  {q:'Идёт за тобой при свете и исчезает во тьме. Что это?', a:['Волк', 'Плащ', 'Тень'], ok:2},
  {q:'Дороги есть, а никто не ходит; леса есть, а деревья не растут. Что это?', a:['Зеркало', 'Карта', 'Книга'], ok:1},
  {q:'Что можно сломать, не прикасаясь?', a:['Камень', 'Щит', 'Клятва'], ok:2},
  {q:'Какого металла боится оборотень?', a:['Золота', 'Железа', 'Серебра'], ok:2}
];

/* === БЛАГОСЛОВЕНИЯ === */
var CARDS = [
  {i:'💪', n:'Стальная воля', d:'+3 к атаке', f:function(h){ h.atk += 3; }},
  {i:'❤️', n:'Второе дыхание', d:'+20 макс. HP и лечение 20', f:function(h){ h.maxHp += 20; h.hp = Math.min(pMaxHp(), h.hp + 20); }},
  {i:'🛡️', n:'Крепкая шкура', d:'+3 к защите', f:function(h){ h.def += 3; }},
  {i:'👟', n:'Лёгкость', d:'+2 скорости', f:function(h){ h.spd += 2; }},
  {i:'🎯', n:'Глаз-алмаз', d:'+6% к криту', f:function(h){ h.crit += 6; }},
  {i:'💰', n:'Заначка', d:'+50 золота', f:function(){ G.gold += 50; }},
  {i:'🩸', n:'Вампиризм', d:'Лечит 10% от урона', f:function(h){ h.vamp = .10; }, once:'vamp'},
  {i:'🧪', n:'Запас зелий', d:'+2 зелья', f:function(h){ h.pots += 2; }},
  {i:'📜', n:'Опыт предков', d:'+40 опыта', f:function(){ gainXp(40); }},
  {i:'⚖️', n:'Гармония', d:'+1 Сила и +1 Ловкость', f:function(h){ h.stats.str += 1; h.stats.agi += 1; }}
];

var COMPANIONS = {
  knight: {name:'Спасённый Рыцарь', icon:'🛡️', atk:12, battles:2},
  wolf: {name:'Освобождённый Волк', icon:'🐺', atk:10, battles:2},
  fairy_c: {name:'Раненая Фея', icon:'🧚', atk:8, battles:2}
};

/* === КВЕСТЫ === */
var QUESTS = [
  {
    id:'kills5',
    name:'Охотник',
    desc:'Победи 5 любых врагов',
    target:'kill',
    need:5,
    rewards:[
      {gold:100, item:{slot:'amulet', i:'📿', n:'Амулет Защитника', rar:2, b:{def:5, hp:30}}},
      {gold:150, item:null},
      {gold:80, item:{slot:'ring', i:'💍', n:'Кольцо Силы', rar:1, b:{atk:3, crit:2}}}
    ]
  },
  {
    id:'chests5',
    name:'Искатель сокровищ',
    desc:'Открой 5 сундуков',
    target:'chest',
    need:5,
    rewards:[
      {gold:150, item:{slot:'ring', i:'💍', n:'Кольцо Древних', rar:2, b:{atk:5, crit:5}}},
      {gold:200, item:null},
      {gold:100, item:{slot:'boots', i:'👢', n:'Сапоги Искателя', rar:1, b:{dodge:4, spd:2}}}
    ]
  },
  {
    id:'materials8',
    name:'Собиратель',
    desc:'Собери 8 ингредиентов',
    target:'material',
    need:8,
    rewards:[
      {gold:80, item:{slot:'amulet', i:'⚗️', n:'Флакон Алхимика', rar:1, b:{hp:20, crit:3}}},
      {gold:120, item:null},
      {gold:60, item:{slot:'gloves', i:'🧤', n:'Перчатки Мастера', rar:1, b:{atk:2, crit:2}}}
    ]
  },
  {
    id:'kills15',
    name:'Истребитель',
    desc:'Победи 15 врагов',
    target:'kill',
    need:15,
    rewards:[
      {gold:250, item:{slot:'weapon', i:'⚔️', n:'Клинок Истребителя', rar:2, b:{atk:8, crit:4}}},
      {gold:350, item:null},
      {gold:200, item:{slot:'armor', i:'🛡️', n:'Доспех Ветерана', rar:2, b:{def:6, hp:20}}}
    ]
  },
  {
    id:'chests10',
    name:'Золотой глаз',
    desc:'Открой 10 сундуков',
    target:'chest',
    need:10,
    rewards:[
      {gold:300, item:{slot:'amulet', i:'💎', n:'Око Алчности', rar:2, b:{crit:6, dodge:3}}},
      {gold:400, item:null},
      {gold:250, item:{slot:'helmet', i:'🪖', n:'Шлем Искателя', rar:2, b:{def:4, hp:15, crit:2}}}
    ]
  },
  {
    id:'materials20',
    name:'Алхимик',
    desc:'Собери 20 ингредиентов',
    target:'material',
    need:20,
    rewards:[
      {gold:200, item:{slot:'amulet', i:'⚗️', n:'Философский камень', rar:2, b:{atk:4, hp:20, crit:3}}},
      {gold:300, item:null},
      {gold:150, item:{slot:'ring', i:'💍', n:'Кольцо Алхимика', rar:2, b:{vamp:.08, hp:10}}}
    ]
  },
  {
    id:'kills30',
    name:'Легенда подземелья',
    desc:'Победи 30 врагов',
    target:'kill',
    need:30,
    rewards:[
      {gold:500, item:{slot:'weapon', i:'⚔️', n:'Легендарный клинок', rar:2, b:{atk:12, crit:6}}},
      {gold:700, item:null},
      {gold:400, item:{slot:'armor', i:'🛡️', n:'Латы Легенды', rar:2, b:{def:8, hp:35, atk:3}}}
    ]
  },
  {
    id:'chests15',
    name:'Великий расхититель',
    desc:'Открой 15 сундуков',
    target:'chest',
    need:15,
    rewards:[
      {gold:400, item:{slot:'ring', i:'💍', n:'Перстень Королей', rar:2, b:{atk:4, def:3, crit:3}}},
      {gold:600, item:null},
      {gold:350, item:{slot:'boots', i:'👢', n:'Сапоги Теней', rar:2, b:{dodge:7, spd:3, crit:2}}}
    ]
  }
];

/* === ОБУЧЕНИЕ === */
var TUTORIAL = [
  {ico:'⚔️', t:'Добро пожаловать!', x:'Пройди <b>100 этажей</b>. Каждый 10-й — <b>босс</b>!'},
  {ico:'🚪', t:'Двери скрыты', x:'Что за дверью — <b>неизвестно</b>, пока не откроешь!'},
  {ico:'🎮', t:'Управление в бою', x:'<b>Атака, Навык, Защита, Зелье, Побег</b>. Клавиши 1-6.'},
  {ico:'👁️', t:'Намерения врага', x:'Враг <b>показывает</b>, что сделает в свой ход.'},
  {ico:'🔥', t:'Стихии', x:'Враги <b>уязвимы</b> к одним стихиям и <b>устойчивы</b> к другим.'},
  {ico:'🎒', t:'Экипировка', x:'Предметы падают с врагов и из сундуков. Надевай их в 🎒 сумке!'},
  {ico:'⚒️', t:'Кузница', x:'На привале: <b>крафт</b>, <b>улучшение предметов до +3</b>, целитель и торговец реликвиями!'},
  {ico:'🎓', t:'Готово!', x:'Удачи в подземелье, герой!'}
];

var ACTION_LABELS = {
  attack: '⚔️ готовит удар',
  heavy: '💥 заряжает МОЩНЫЙ УДАР',
  defend: '🛡️ встаёт в защиту',
  spell: '🔮 колдует заклинание',
  double: '⚡⚡ двойная атака',
  dodge_prep: '💨 готовится уклоняться',
  debuff: '☠️ готовит проклятие'
};

var HIT_WORDS = ['БАМ!', 'ХРЯСЬ!', 'ТРЕСЬ!', 'ШМЯК!', 'ЧВЯК!'];

var MONSTER_ICONS = {
  slime:'🟢', bat:'🦇', goblin:'👺', skeleton:'💀', ghost:'👻', zombie:'🧟',
  bandit:'🥷', wolf:'🐺', hgoblin:'👺', fspider:'🕷️', owl:'🦉', ent:'🌳',
  toad:'🐸', bog:'🦑', snake:'🐍', troll:'🧌', harpy:'🦅', golem:'🗿',
  felem:'🔥', salamander:'🦎', lgolem:'🌋', icewolf:'🐺', snowgolem:'⛄',
  icewitch:'🧙', imp:'😈', assassin:'🥷', soulater:'👻', voidguard:'🗿',
  voidkeeper:'🧙', chaos:'🌀',
  slimeking:'👑', necromancer:'🧟', banditboss:'🥷', spiderqueen:'🕷️',
  leshy:'🧌', colossus:'🗿', firelord:'🔥', icequeen:'❄️',
  archdemon:'😈', worlddevourer:'🌌', mimic:'📦'
};

function getMonsterIcon(id){
  return MONSTER_ICONS[id] || '👾';
}