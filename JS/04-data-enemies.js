'use strict';
/* ============================================
   04-DATA-ENEMIES: 30 врагов + 10 боссов,
   особенности, иконки
   ============================================ */

/* --- 30 обычных врагов (по 3 на каждый тир) --- */
var ENEMY_POOL = [
  /* Тир 1 */
  {id:'slime',    name:'Хлюпающий Слизень',    tier:1,  hp:36,  atk:8,  def:2,  spd:4,  crit:3,  gold:12,  xp:18,  ai:'basic',  el:'poison',    weak:'lightning', resist:'poison',   desc:'Комок живой слизи.',              mat:'Слизь'},
  {id:'bat',      name:'Пещерный Нетопырь',    tier:1,  hp:30,  atk:10, def:1,  spd:12, crit:6,  gold:14,  xp:20,  tr:'swift', ai:'swift',  el:'dark',      weak:'holy',      resist:'dark',     desc:'Мечется в темноте.',              mat:'Крыло мыши'},
  {id:'goblin',   name:'Гоблин-Громила',       tier:1,  hp:46,  atk:11, def:3,  spd:6,  crit:4,  gold:16,  xp:24,  ai:'melee',  el:'physical',  weak:'lightning', resist:null,       desc:'Тупой, но злой.',                 mat:'Гоблинское ухо'},
  /* Тир 2 */
  {id:'skeleton', name:'Костяной Воин',        tier:2,  hp:60,  atk:14, def:6,  spd:6,  crit:5,  gold:22,  xp:32,  tr:'armor', ai:'tank',   el:'dark',      weak:'holy',      resist:'physical', desc:'Кости крепки, но свет жжёт.',     mat:'Костяная пыль'},
  {id:'ghost',    name:'Блуждающий Дух',       tier:2,  hp:50,  atk:15, def:3,  spd:11, crit:8,  gold:24,  xp:34,  tr:'swift', ai:'caster', el:'dark',      weak:'holy',      resist:'physical', desc:'Бестелесный.',                    mat:'Эктоплазма'},
  {id:'zombie',   name:'Гниющий Зомби',        tier:2,  hp:75,  atk:15, def:4,  spd:4,  crit:4,  gold:26,  xp:36,  tr:'rage',  ai:'tank',   el:'poison',    weak:'fire',      resist:'poison',   desc:'Медленный, но живучий.',          mat:'Гнилая плоть'},
  /* Тир 3 */
  {id:'bandit',   name:'Дорожный Разбойник',   tier:3,  hp:70,  atk:17, def:5,  spd:9,  crit:8,  gold:30,  xp:40,  ai:'melee',  el:'physical',  weak:'lightning', resist:null,       desc:'Грабит путников.',                mat:'Рваный плащ'},
  {id:'wolf',     name:'Серый Волк',           tier:3,  hp:62,  atk:18, def:4,  spd:13, crit:9,  gold:28,  xp:38,  tr:'swift', ai:'swift',  el:'physical',  weak:'fire',      resist:null,       desc:'Быстрый хищник.',                 mat:'Волчья шкура'},
  {id:'hgoblin',  name:'Гоблин-Налётчик',      tier:3,  hp:80,  atk:18, def:6,  spd:7,  crit:6,  gold:32,  xp:42,  tr:'rage',  ai:'melee',  el:'physical',  weak:'lightning', resist:null,       desc:'Крупнее обычного гоблина.',       mat:'Гоблинское ухо'},
  /* Тир 4 */
  {id:'fspider',  name:'Паук-Ткач',            tier:4,  hp:85,  atk:20, def:6,  spd:10, crit:9,  gold:36,  xp:48,  tr:'venom', ai:'caster', el:'poison',    weak:'fire',      resist:'poison',   desc:'Плетёт сети и плюётся ядом.',     mat:'Паучий шёлк'},
  {id:'owl',      name:'Ночная Сова',          tier:4,  hp:75,  atk:21, def:5,  spd:14, crit:11, gold:34,  xp:46,  tr:'swift', ai:'swift',  el:'dark',      weak:'lightning', resist:'dark',     desc:'Бесшумный охотник.',              mat:'Совиное перо'},
  {id:'ent',      name:'Древний Энт',          tier:4,  hp:110, atk:22, def:9,  spd:4,  crit:5,  gold:40,  xp:52,  tr:'armor', ai:'tank',   el:'physical',  weak:'fire',      resist:'poison',   desc:'Ожившее дерево.',                 mat:'Живая древесина'},
  /* Тир 5 */
  {id:'toad',     name:'Болотная Жаба',        tier:5,  hp:100, atk:24, def:7,  spd:6,  crit:6,  gold:44,  xp:56,  tr:'venom', ai:'caster', el:'poison',    weak:'fire',      resist:'poison',   desc:'Раздутая и ядовитая.',            mat:'Болотная слизь'},
  {id:'bog',      name:'Трясинный Ходулочник', tier:5,  hp:115, atk:25, def:8,  spd:5,  crit:6,  gold:46,  xp:58,  tr:'rage',  ai:'tank',   el:'poison',    weak:'fire',      resist:'poison',   desc:'Бродит по трясине.',              mat:'Трясинный мох'},
  {id:'snake',    name:'Ядовитый Полоз',       tier:5,  hp:95,  atk:26, def:6,  spd:12, crit:10, gold:48,  xp:60,  tr:'venom', ai:'caster', el:'poison',    weak:'ice',       resist:'poison',   desc:'Клыки полны яда.',                mat:'Змеиная чешуя'},
  /* Тир 6 */
  {id:'troll',    name:'Горный Тролль',        tier:6,  hp:140, atk:28, def:10, spd:5,  crit:6,  gold:54,  xp:68,  tr:'rage',  ai:'tank',   el:'physical',  weak:'lightning', resist:null,       desc:'Кожа как камень.',                mat:'Каменная кожа'},
  {id:'harpy',    name:'Свистящая Гарпия',     tier:6,  hp:110, atk:29, def:7,  spd:15, crit:12, gold:52,  xp:66,  tr:'swift', ai:'swift',  el:'lightning', weak:'ice',       resist:'lightning',desc:'Пикирует с неба.',                mat:'Коготь гарпии'},
  {id:'golem',    name:'Каменный Голем',       tier:6,  hp:160, atk:28, def:13, spd:4,  crit:4,  gold:58,  xp:72,  tr:'armor', ai:'tank',   el:'physical',  weak:'lightning', resist:'physical', desc:'Оживший камень.',                 mat:'Каменное ядро'},
  /* Тир 7 */
  {id:'felem',    name:'Огненный Элементаль',  tier:7,  hp:135, atk:32, def:9,  spd:9,  crit:9,  gold:64,  xp:80,  tr:'venom', ai:'caster', el:'fire',      weak:'ice',       resist:'fire',     desc:'Сгусток пламени.',                mat:'Уголёк'},
  {id:'salamander',name:'Пепельная Саламандра',tier:7,  hp:125, atk:33, def:8,  spd:12, crit:10, gold:62,  xp:78,  tr:'swift', ai:'swift',  el:'fire',      weak:'ice',       resist:'fire',     desc:'Оставляет ожоги.',                mat:'Пепельная чешуя'},
  {id:'lgolem',   name:'Лавовый Голем',        tier:7,  hp:175, atk:32, def:14, spd:4,  crit:5,  gold:68,  xp:84,  tr:'armor', ai:'tank',   el:'fire',      weak:'ice',       resist:'fire',     desc:'Из застывшей лавы.',              mat:'Застывшая лава'},
  /* Тир 8 */
  {id:'icewolf',  name:'Ледяной Волк',         tier:8,  hp:150, atk:36, def:10, spd:13, crit:11, gold:74,  xp:92,  tr:'swift', ai:'swift',  el:'ice',       weak:'fire',      resist:'ice',      desc:'Шерсть изо льда.',                mat:'Ледяной клык'},
  {id:'snowgolem',name:'Снежный Голем',        tier:8,  hp:190, atk:35, def:15, spd:4,  crit:5,  gold:78,  xp:96,  tr:'armor', ai:'tank',   el:'ice',       weak:'fire',      resist:'ice',      desc:'Из вечного снега.',               mat:'Вечный снег'},
  {id:'icewitch', name:'Ледяная Ведьма',       tier:8,  hp:140, atk:38, def:8,  spd:10, crit:12, gold:76,  xp:94,  tr:'venom', ai:'caster', el:'ice',       weak:'fire',      resist:'ice',      desc:'Замораживает кровь.',             mat:'Ледяной осколок'},
  /* Тир 9 */
  {id:'imp',      name:'Бес-Прислужник',       tier:9,  hp:165, atk:40, def:10, spd:12, crit:12, gold:86,  xp:106, tr:'venom', ai:'caster', el:'dark',      weak:'holy',      resist:'dark',     desc:'Мелкий демон.',                   mat:'Демонический рог'},
  {id:'assassin', name:'Теневой Ассасин',      tier:9,  hp:150, atk:42, def:8,  spd:16, crit:16, gold:88,  xp:108, tr:'swift', ai:'swift',  el:'dark',      weak:'holy',      resist:'dark',     desc:'Невидим во тьме.',                mat:'Теневой клинок'},
  {id:'soulater', name:'Пожиратель Душ',       tier:9,  hp:180, atk:41, def:11, spd:9,  crit:10, gold:90,  xp:110, tr:'rage',  ai:'tank',   el:'dark',      weak:'holy',      resist:'dark',     desc:'Пьёт жизненную силу.',            mat:'Осколок души'},
  /* Тир 10 */
  {id:'voidguard', name:'Страж Пустоты',       tier:10, hp:210, atk:44, def:14, spd:8,  crit:10, gold:100, xp:124, tr:'armor', ai:'tank',   el:'dark',      weak:'holy',      resist:'dark',     desc:'Страж границы миров.',            mat:'Пустотный камень'},
  {id:'voidkeeper',name:'Хранитель Бездны',    tier:10, hp:195, atk:46, def:11, spd:11, crit:13, gold:102, xp:126, tr:'venom', ai:'caster', el:'dark',      weak:'holy',      resist:'dark',     desc:'Шепчет на забытых языках.',       mat:'Шёпот бездны'},
  {id:'chaos',    name:'Аватар Хаоса',         tier:10, hp:230, atk:46, def:13, spd:10, crit:12, gold:106, xp:130, tr:'rage',  ai:'caster', el:'dark',      weak:'holy',      resist:'dark',     desc:'Воплощение разрушения.',          mat:'Осколок хаоса'}
];

/* --- 10 Боссов (каждый 10-й этаж) --- */
var BOSSES = {
  10:  {id:'slimeking',    name:'Король Слизней',     hp:130, atk:18, def:7,  spd:7,  crit:6,  gold:150,  xp:120, ai:'tank',   el:'poison',    weak:'lightning', resist:'poison',   desc:'Гигантский слизень в короне.',    mat:'Королевская слизь'},
  20:  {id:'necromancer',  name:'Некромант Склепа',   hp:160, atk:22, def:8,  spd:9,  crit:9,  gold:200,  xp:160, tr:'venom', ai:'caster', el:'dark',      weak:'holy',      resist:'dark',     desc:'Поднимает мёртвых.',              mat:'Некротический фолиант'},
  30:  {id:'banditboss',   name:'Атаман Разбойников', hp:190, atk:26, def:9,  spd:11, crit:11, gold:260,  xp:200, tr:'swift', ai:'melee',  el:'physical',  weak:'lightning', resist:null,       desc:'Главарь банды.',                  mat:'Золотая цепь'},
  40:  {id:'spiderqueen',  name:'Королева Пауков',    hp:230, atk:30, def:10, spd:12, crit:11, gold:320,  xp:250, tr:'venom', ai:'caster', el:'poison',    weak:'fire',      resist:'poison',   desc:'Мать тысячи пауков.',             mat:'Шёлк королевы'},
  50:  {id:'leshy',        name:'Болотный Леший',     hp:270, atk:34, def:12, spd:7,  crit:8,  gold:400,  xp:300, tr:'rage',  ai:'tank',   el:'poison',    weak:'fire',      resist:'poison',   desc:'Хозяин топей.',                   mat:'Сердце болота'},
  60:  {id:'colossus',     name:'Каменный Колосс',    hp:320, atk:38, def:15, spd:5,  crit:6,  gold:480,  xp:360, tr:'armor', ai:'tank',   el:'physical',  weak:'lightning', resist:'physical', desc:'Исполин из породы.',              mat:'Ядро колосса'},
  70:  {id:'firelord',     name:'Повелитель Пламени', hp:360, atk:42, def:13, spd:11, crit:12, gold:560,  xp:420, tr:'venom', ai:'caster', el:'fire',      weak:'ice',       resist:'fire',     desc:'Дух вулкана.',                    mat:'Сердце пламени'},
  80:  {id:'icequeen',     name:'Ледяная Королева',   hp:400, atk:46, def:14, spd:12, crit:13, gold:660,  xp:480, tr:'swift', ai:'caster', el:'ice',       weak:'fire',      resist:'ice',      desc:'Правительница мерзлоты.',         mat:'Ледяная корона'},
  90:  {id:'archdemon',    name:'Архидемон Бездны',   hp:450, atk:50, def:16, spd:11, crit:14, gold:780,  xp:560, tr:'rage',  ai:'caster', el:'dark',      weak:'holy',      resist:'dark',     desc:'Князь тьмы.',                     mat:'Демоническое сердце'},
  100: {id:'worlddevourer',name:'Пожиратель Миров',   hp:420, atk:56, def:18, spd:12, crit:16, gold:1200, xp:800, tr:'rage',  ai:'caster', el:'dark',      weak:'holy',      resist:'dark',     final:true, desc:'Конец всего.',       mat:'Осколок мира'}
};

/* --- Все монстры (для бестиария) --- */
var ALL_MONSTERS = ENEMY_POOL.concat(Object.values(BOSSES));

/* --- Особенности врагов --- */
var TR_LBL = {
  swift: '⚡ ловкий',
  armor: '🪖 бронированный',
  rage:  '😡 ярость',
  venom: '☠️ ядовитый'
};

/* --- Слова ударов --- */
var HIT_WORDS = ['БАМ!', 'ХРЯСЬ!', 'ТРЕСЬ!', 'ШМЯК!', 'ЧВЯК!'];

/* --- Намерения врагов --- */
var ACTION_LABELS = {
  attack:     '⚔️ готовит удар',
  heavy:      '💥 заряжает МОЩНЫЙ УДАР',
  defend:     '🛡️ встаёт в защиту',
  spell:      '🔮 колдует заклинание',
  double:     '⚡⚡ двойная атака',
  dodge_prep: '💨 готовится уклоняться',
  debuff:     '☠️ готовит проклятие'
};

/* --- Иконки монстров для бестиария --- */
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

function getMonsterIcon(id){ return MONSTER_ICONS[id] || '👾'; }