'use strict';
/* 05-DATA-WORLD: биомы, эффекты, загадки, карточки, реликвии, квесты */

var BIOMES=[
{name:'Подземелье',ico:'🕯️',bg:['#2a2050','#120d24'],ground:'#0d0919',acc:'#ffd23d',scene:'dungeon'},
{name:'Склеп',ico:'️',bg:['#1e3a2e','#0d1f16'],ground:'#0a1810',acc:'#7ef29a',scene:'crypt'},
{name:'Дорога разбойников',ico:'🛤️',bg:['#7a9a5a','#4a6a3a'],ground:'#6a5a3a',acc:'#ffce6b',scene:'road'},
{name:'Тёмный лес',ico:'🌲',bg:['#1e3a1e','#0d1f0d'],ground:'#0a180a',acc:'#8ef5a6',scene:'forest'},
{name:'Гнилое болото',ico:'🐸',bg:['#2e3a20','#161f0d'],ground:'#101808',acc:'#b6e35e',scene:'swamp'},
{name:'Горные пики',ico:'🏔️',bg:['#5a6a8a','#3a4a6a'],ground:'#4a4a5a',acc:'#c9d2e8',scene:'mountain'},
{name:'Огненное сердце',ico:'🌋',bg:['#4a2010','#260d06'],ground:'#1c0804',acc:'#ff8b4a',scene:'volcano'},
{name:'Ледяные пустоши',ico:'❄️',bg:['#4a6a8a','#2a4a6a'],ground:'#3a5a7a',acc:'#9fd8ff',scene:'ice'},
{name:'Бездна',ico:'👁️',bg:['#2a1040','#12061f'],ground:'#0d0418',acc:'#b66bff',scene:'abyss'},
{name:'Пустота',ico:'🌌',bg:['#101018','#060608'],ground:'#030304',acc:'#8a1eff',scene:'void'}
];
var getBiomeIdx=function(f){return Math.min(10,Math.ceil(f/10));};
var getBiome=function(f){return BIOMES[getBiomeIdx(f)-1];};

var BIOME_FX={
dungeon:null,
crypt:{elem:'dark',mult:1.25,label:'🌑 Тьма сильнее: +25% урона тьмой'},
road:{elem:'physical',mult:1.1,label:'⚔️ Открытый бой: +10% физ. урона'},
forest:{elem:'poison',mult:1.25,label:'☠️ Яды сильнее: +25% урона ядом'},
swamp:{tick:true,label:'🐸 Испарения: каждый 3-й раунд −3% HP обоим'},
mountain:{elem:'physical',mult:1.25,label:'⚔️ Физ. урон +25%'},
volcano:{elem:'fire',mult:1.25,label:'🔥 Огонь сильнее: +25% урона огнём'},
ice:{elem:'ice',mult:1.25,dodge:-5,label:'❄️ Лёд +25%, всем −5% уклонения'},
abyss:{elem:'dark',mult:1.25,label:'🌑 Тьма +25%'},
void:{critMult:2.5,label:'🌌 Криты наносят ×2.5 вместо ×1.8'}
};
function getBiomeFx(){return BIOME_FX[getBiome(G.floor).scene]||null;}

var RELICS=[
{id:'vamp_heart',i:'🩸',n:'Сердце Вампира',d:'+5% вампиризма'},
{id:'luck_bone',i:'🎲',n:'Кость Судьбы',d:'15% шанс удвоить золото с врагов'},
{id:'hourglass',i:'⏳',n:'Песочные часы',d:'−1 КД всех навыков'},
{id:'berskull',i:'💀',n:'Череп Берсерка',d:'+10% атаки, но −10% макс. HP'},
{id:'clover',i:'🍀',n:'Клевер Вора',d:'+20% к шансу ингредиента'},
{id:'phoenix',i:'🪶',n:'Перо Феникса',d:'Один раз за 10 боёв: при смертельном ударе остаётся 1 HP'},
{id:'dragonscale',i:'🐉',n:'Чешуя Дракона',d:'+2 защиты, +10 макс. HP'},
{id:'swiftboot',i:'👟',n:'Сапоги Ветрохода',d:'+3% уклонения, +2 к побегу'}
];

/* === ЗАГАДКИ (лёгкие, однозначные) === */
var RIDDLES=[
{q:'Сколько ног у паука?',a:['4','6','8'],ok:2},
{q:'Что из этого летает?',a:['Камень','Птица','Рыба'],ok:1},
{q:'Кто живёт в воде?',a:['Волк','Рыба','Медведь'],ok:1},
{q:'Что растёт на дереве?',a:['Яблоко','Морковь','Картошка'],ok:0},
{q:'Что из этого горячее?',a:['Лёд','Огонь','Снег'],ok:1},
{q:'Сколько глаз у человека?',a:['1','2','3'],ok:1},
{q:'Что из этого круглое?',a:['Колесо','Книга','Кирпич'],ok:0},
{q:'Кто мяукает?',a:['Собака','Кошка','Корова'],ok:1},
{q:'Что из этого сладкое?',a:['Мёд','Лимон','Соль'],ok:0},
{q:'Что из этого холодное?',a:['Солнце','Лёд','Огонь'],ok:1},
{q:'Сколько месяцев в году?',a:['10','12','14'],ok:1},
{q:'Чем кузнец бьёт металл?',a:['Молотом','Ложкой','Подушкой'],ok:0},
{q:'Что светит в подземелье?',a:['Факел','Дождь','Снег'],ok:0},
{q:'Зимой и летом одним цветом.',a:['Берёза','Ель','Дуб'],ok:1},
{q:'Кто из этого мычит?',a:['Корова','Курица','Лошадь'],ok:0}
];

/* === БЛАГОСЛОВЕНИЯ (сбалансированы, −1 КД убран) === */
var CARDS=[
{i:'💪',n:'Стальная воля',d:'+3 к атаке',f:function(h){h.atk+=3;}},
{i:'❤️',n:'Второе дыхание',d:'+20 макс. HP и лечение 20',f:function(h){h.maxHp+=20;h.hp=Math.min(pMaxHp(),h.hp+20);}},
{i:'🛡️',n:'Крепкая шкура',d:'+3 к защите',f:function(h){h.def+=3;}},
{i:'👟',n:'Лёгкость',d:'+2 скорости',f:function(h){h.spd+=2;}},
{i:'🎯',n:'Глаз-алмаз',d:'+6% к криту',f:function(h){h.crit+=6;}},
{i:'💰',n:'Заначка',d:'+50 золота',f:function(){G.gold+=50;}},
{i:'🩸',n:'Вампиризм',d:'Лечит 10% от урона',f:function(h){h.vamp=.10;},once:'vamp'},
{i:'🧪',n:'Запас зелий',d:'+2 зелья',f:function(h){h.pots+=2;}},
{i:'📜',n:'Опыт предков',d:'+40 опыта',f:function(h){gainXp(40);}},
{i:'⚖️',n:'Гармония',d:'+1 Сила и +1 Ловкость',f:function(h){h.stats.str+=1;h.stats.agi+=1;}}
];

var COMPANIONS={
knight:{name:'Спасённый Рыцарь',icon:'🛡️',atk:12,battles:2},
wolf:{name:'Освобождённый Волк',icon:'🐺',atk:10,battles:2},
fairy_c:{name:'Раненая Фея',icon:'🧚',atk:8,battles:2}
};

var QUESTS=[
{id:'kills5',name:'Охотник',desc:'Победи 5 любых врагов',target:'kill',need:5,
rewards:[{gold:100,item:{slot:'amulet',i:'📿',n:'Амулет Защитника',rar:2,b:{def:5,hp:30}}},{gold:150,item:null},{gold:80,item:{slot:'ring',i:'💍',n:'Кольцо Силы',rar:1,b:{atk:3,crit:2}}}]},
{id:'chests5',name:'Искатель сокровищ',desc:'Открой 5 сундуков',target:'chest',need:5,
rewards:[{gold:150,item:{slot:'ring',i:'💍',n:'Кольцо Древних',rar:2,b:{atk:5,crit:5}}},{gold:200,item:null},{gold:100,item:{slot:'boots',i:'👢',n:'Сапоги Искателя',rar:1,b:{dodge:4,spd:2}}}]},
{id:'materials8',name:'Собиратель',desc:'Собери 8 ингредиентов',target:'material',need:8,
rewards:[{gold:80,item:{slot:'amulet',i:'⚗️',n:'Флакон Алхимика',rar:1,b:{hp:20,crit:3}}},{gold:120,item:null},{gold:60,item:{slot:'gloves',i:'🧤',n:'Перчатки Мастера',rar:1,b:{atk:2,crit:2}}}]},
{id:'kills15',name:'Истребитель',desc:'Победи 15 врагов',target:'kill',need:15,
rewards:[{gold:250,item:{slot:'weapon',i:'⚔️',n:'Клинок Истребителя',rar:2,b:{atk:8,crit:4}}},{gold:350,item:null},{gold:200,item:{slot:'armor',i:'🛡️',n:'Доспех Ветерана',rar:2,b:{def:6,hp:20}}}]},
{id:'chests10',name:'Золотой глаз',desc:'Открой 10 сундуков',target:'chest',need:10,
rewards:[{gold:300,item:{slot:'amulet',i:'💎',n:'Око Алчности',rar:2,b:{crit:6,dodge:3}}},{gold:400,item:null},{gold:250,item:{slot:'helmet',i:'⛑️',n:'Шлем Искателя',rar:2,b:{def:4,hp:15,crit:2}}}]},
{id:'materials20',name:'Алхимик',desc:'Собери 20 ингредиентов',target:'material',need:20,
rewards:[{gold:200,item:{slot:'amulet',i:'⚗️',n:'Философский камень',rar:2,b:{atk:4,hp:20,crit:3}}},{gold:300,item:null},{gold:150,item:{slot:'ring',i:'💍',n:'Кольцо Алхимика',rar:2,b:{vamp:.08,hp:10}}}]},
{id:'kills30',name:'Легенда подземелья',desc:'Победи 30 врагов',target:'kill',need:30,
rewards:[{gold:500,item:{slot:'weapon',i:'⚔️',n:'Легендарный клинок',rar:2,b:{atk:12,crit:6}}},{gold:700,item:null},{gold:400,item:{slot:'armor',i:'🛡️',n:'Латы Легенды',rar:2,b:{def:8,hp:35,atk:3}}}]},
{id:'chests15',name:'Великий расхититель',desc:'Открой 15 сундуков',target:'chest',need:15,
rewards:[{gold:400,item:{slot:'ring',i:'💍',n:'Перстень Королей',rar:2,b:{atk:4,def:3,crit:3}}},{gold:600,item:null},{gold:350,item:{slot:'boots',i:'👢',n:'Сапоги Теней',rar:2,b:{dodge:7,spd:3,crit:2}}}]}
];

var TUTORIAL=[
{ico:'⚔️',t:'Добро пожаловать!',x:'Пройди <b>100 этажей</b>. Каждый 10-й — <b>босс</b>!'},
{ico:'🚪',t:'Двери скрыты',x:'Что за дверью — <b>неизвестно</b>. Иногда попадается ❓ <b>секретная комната</b> с реликвией!'},
{ico:'🏺',t:'Реликвии',x:'Пассивные артефакты (макс. 3). Падают с боссов и секретных комнат.'},
{ico:'🌋',t:'Эффекты биомов',x:'Каждый биом меняет бой: огонь сильнее в вулкане, криты ×2.5 в Пустоте!'},
{ico:'🎮',t:'Управление',x:'<b>Атака, Навык, Защита, Зелье, Побег</b>. Клавиши 1-6.'},
{ico:'🎲',t:'Мини-игры',x:'В игровом зале 🎰 — реакция, армрестлинг, тир и другие!'},
{ico:'📋',t:'Лист персонажа',x:'Кнопка 📋 показывает характеристики. Наводи на иконки для подсказок!'},
{ico:'🎓',t:'Готово!',x:'Удачи в подземелье, герой!'}
];

var ACTION_LABELS={attack:'⚔️ готовит удар',heavy:'💥 заряжает МОЩНЫЙ УДАР',defend:'🛡️ встаёт в защиту',spell:'🔮 колдует заклинание',double:'⚡⚡ двойная атака',dodge_prep:'💨 готовится уклоняться',debuff:'☠️ готовит проклятие'};
var HIT_WORDS=['БАМ!','ХРЯСЬ!','ТРЕСЬ!','ШМЯК!','ЧВЯК!'];

var MONSTER_ICONS={slime:'🟢',bat:'🦇',goblin:'👺',skeleton:'💀',ghost:'👻',zombie:'🧟',bandit:'🥷',wolf:'🐺',hgoblin:'👺',fspider:'🕷️',owl:'🦉',ent:'🌳',toad:'🐸',bog:'🦑',snake:'🐍',troll:'🧌',harpy:'🦅',golem:'🗿',felem:'🔥',salamander:'🦎',lgolem:'🌋',icewolf:'🐺',snowgolem:'⛄',icewitch:'🧙',imp:'😈',assassin:'🥷',soulater:'👻',voidguard:'🗿',voidkeeper:'🧙',chaos:'🌀',slimeking:'👑',necromancer:'🧟',banditboss:'🥷',spiderqueen:'🕷️',leshy:'🧌',colossus:'🗿',firelord:'🔥',icequeen:'❄️',archdemon:'😈',worlddevourer:'🌌',mimic:'📦'};
function getMonsterIcon(id){return MONSTER_ICONS[id]||'👾';}