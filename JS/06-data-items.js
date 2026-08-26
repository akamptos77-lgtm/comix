'use strict';
/* 06-DATA-ITEMS: предметы, проклятия, эликсиры, крафт */

var CURSED_ITEMS=[
{slot:'weapon',i:'🗡️',n:'Клинок Крови',rar:2,b:{atk:12,vamp:.2},curse:'−20 макс. HP',curseFx:function(h){h.maxHp-=20;h.hp=Math.min(h.hp,pMaxHp());}},
{slot:'ring',i:'💍',n:'Кольцо Жадности',rar:2,b:{crit:15,atk:5},curse:'+50% цены в лавках',curseFx:function(h){h.shopMult=1.5;}},
{slot:'armor',i:'🛡️',n:'Доспех Боли',rar:2,b:{def:10,hp:40},curse:'−10% уклонения',curseFx:function(h){h.dodgePenalty=10;}},
{slot:'amulet',i:'📿',n:'Амулет Тьмы',rar:2,b:{atk:8,crit:8},curse:'Свет наносит тебе −20% урона',curseFx:function(h){h.holyWeak=true;}}
];

function ITEMS(){return[
/* Оружие */
{slot:'weapon',i:'⚔️',n:'Железный меч',rar:0,f:1,b:{atk:3},cls:['knight']},
{slot:'weapon',i:'⚔️',n:'Длинный меч',rar:1,f:3,b:{atk:5,crit:2},cls:['knight']},
{slot:'weapon',i:'⚔️',n:'Пламенный клинок',rar:2,f:7,b:{atk:9,crit:4},el:'fire',cls:['knight']},
{slot:'weapon',i:'',n:'Дубовый посох',rar:0,f:1,b:{atk:2,crit:2},cls:['mage']},
{slot:'weapon',i:'🔮',n:'Посох молний',rar:1,f:3,b:{atk:4,crit:4},el:'lightning',cls:['mage']},
{slot:'weapon',i:'🔮',n:'Посох архимага',rar:2,f:7,b:{atk:8,crit:6},el:'fire',cls:['mage']},
{slot:'weapon',i:'🗡️',n:'Ржавый кинжал',rar:0,f:1,b:{atk:2,crit:3},cls:['rogue']},
{slot:'weapon',i:'🗡️',n:'Парные клинки',rar:1,f:3,b:{atk:4,crit:5},cls:['rogue']},
{slot:'weapon',i:'🗡️',n:'Клинки тени',rar:2,f:7,b:{atk:7,crit:8},el:'dark',cls:['rogue']},
{slot:'weapon',i:'🪓',n:'Костяной топор',rar:0,f:1,b:{atk:4},cls:['barbarian']},
{slot:'weapon',i:'🪓',n:'Секира берсерка',rar:1,f:3,b:{atk:6,crit:2},cls:['barbarian']},
{slot:'weapon',i:'🪓',n:'Топор Хаоса',rar:2,f:7,b:{atk:11,crit:5},cls:['barbarian']},
{slot:'weapon',i:'🔫',n:'Дерринджер',rar:0,f:1,b:{atk:3,crit:2},cls:['inventor']},
{slot:'weapon',i:'🔫',n:'Винтовка',rar:1,f:3,b:{atk:5,crit:4},cls:['inventor']},
{slot:'weapon',i:'🔫',n:'Гаусс-пушка',rar:2,f:7,b:{atk:10,crit:7},el:'lightning',cls:['inventor']},
{slot:'weapon',i:'🏹',n:'Короткий лук',rar:0,f:1,b:{atk:3,crit:3},cls:['archer']},
{slot:'weapon',i:'🏹',n:'Композитный лук',rar:1,f:3,b:{atk:5,crit:4},cls:['archer']},
{slot:'weapon',i:'🏹',n:'Лук небес',rar:2,f:7,b:{atk:9,crit:8},el:'holy',cls:['archer']},
{slot:'weapon',i:'✨',n:'Волшебная палочка',rar:0,f:1,b:{atk:2,crit:3},cls:['fairy']},
{slot:'weapon',i:'✨',n:'Жезл сияния',rar:1,f:3,b:{atk:4,crit:4},el:'holy',cls:['fairy']},
{slot:'weapon',i:'✨',n:'Скипетр зари',rar:2,f:7,b:{atk:8,crit:7},el:'holy',cls:['fairy']},
/* Броня */
{slot:'armor',i:'🛡️',n:'Кольчуга',rar:0,f:1,b:{def:3},cls:ARMORABLE},
{slot:'armor',i:'🛡️',n:'Латы рыцаря',rar:1,f:3,b:{def:5,hp:10},cls:['knight']},
{slot:'armor',i:'🛡️',n:'Латы бастиона',rar:2,f:7,b:{def:9,hp:25},cls:['knight']},
{slot:'armor',i:'👘',n:'Холщовая мантия',rar:0,f:1,b:{def:1,crit:2},cls:ROBABLE},
{slot:'armor',i:'👘',n:'Шёлковая роба',rar:1,f:3,b:{def:2,crit:5},cls:ROBABLE},
{slot:'armor',i:'👘',n:'Мантия архимага',rar:2,f:7,b:{def:4,crit:8,hp:20},cls:ROBABLE},
{slot:'armor',i:'🧥',n:'Кожаный плащ',rar:0,f:1,b:{def:2,dodge:3},cls:LEATHERABLE},
{slot:'armor',i:'🧥',n:'Маскировочный плащ',rar:1,f:3,b:{def:3,dodge:6},cls:LEATHERABLE},
{slot:'armor',i:'🧥',n:'Плащ убийцы',rar:2,f:7,b:{def:5,dodge:9,crit:3},cls:['rogue','archer']},
{slot:'armor',i:'🦺',n:'Меховой жилет',rar:0,f:1,b:{def:2,hp:15},cls:['barbarian']},
{slot:'armor',i:'🦺',n:'Доспех вождя',rar:2,f:7,b:{def:6,hp:45,crit:4},cls:['barbarian']},
/* Шлемы */
{slot:'helmet',i:'⛑️',n:'Кожаный шлем',rar:0,f:1,b:{def:1,hp:5}},
{slot:'helmet',i:'⛑️',n:'Стальной шлем',rar:1,f:3,b:{def:3,hp:10},cls:['knight','barbarian']},
{slot:'helmet',i:'⛑️',n:'Рогатый шлем',rar:2,f:7,b:{def:5,hp:20,atk:2},cls:['barbarian']},
{slot:'helmet',i:'🎩',n:'Остроконечная шляпа',rar:1,f:3,b:{def:1,crit:4},cls:ROBABLE},
{slot:'helmet',i:'🌸',n:'Венок из цветов',rar:1,f:3,b:{def:1,crit:3,dodge:3},cls:['fairy']},
{slot:'helmet',i:' hood',n:'Капюшон тени',rar:1,f:3,b:{def:2,dodge:4},cls:['rogue','archer']},
{slot:'helmet',i:'🥽',n:'Гогглы изобретателя',rar:1,f:3,b:{def:2,crit:4},cls:['inventor']},
/* Ботинки */
{slot:'boots',i:'👢',n:'Кожаные ботинки',rar:0,f:1,b:{dodge:2,spd:1}},
{slot:'boots',i:'👢',n:'Сапоги странника',rar:1,f:3,b:{dodge:4,spd:2}},
{slot:'boots',i:'👢',n:'Ботинки тени',rar:2,f:7,b:{dodge:7,spd:3,crit:2}},
{slot:'boots',i:'🥾',n:'Латные сапоги',rar:1,f:3,b:{def:2,dodge:1},cls:['knight','barbarian']},
{slot:'boots',i:'👟',n:'Лёгкие туфельки',rar:1,f:3,b:{dodge:5,crit:2},cls:['fairy','rogue','archer']},
/* Перчатки */
{slot:'gloves',i:'🧤',n:'Кожаные перчатки',rar:0,f:1,b:{atk:1,crit:1}},
{slot:'gloves',i:'🧤',n:'Перчатки силы',rar:1,f:3,b:{atk:3}},
{slot:'gloves',i:'🧤',n:'Перчатки точности',rar:2,f:7,b:{atk:3,crit:6}},
{slot:'gloves',i:'🧤',n:'Латные рукавицы',rar:1,f:3,b:{atk:2,def:2},cls:['knight','barbarian']},
{slot:'gloves',i:'🧤',n:'Шёлковые перчатки',rar:1,f:3,b:{atk:2,crit:3},cls:ROBABLE.concat(['fairy'])},
/* Кольца */
{slot:'ring',i:'💍',n:'Кольцо меткости',rar:1,f:3,b:{crit:6}},
{slot:'ring',i:'💍',n:'Кольцо жизни',rar:1,f:3,b:{hp:20}},
{slot:'ring',i:'💍',n:'Кольцо мощи',rar:2,f:7,b:{atk:4,crit:3}},
{slot:'ring',i:'💍',n:'Кольцо стража',rar:2,f:7,b:{def:4,hp:15}},
{slot:'ring',i:'💍',n:'Кольцо уворота',rar:1,f:3,b:{dodge:5}},
{slot:'ring',i:'💍',n:'Кольцо вампира',rar:2,f:7,b:{vamp:.1}},
{slot:'ring',i:'💍',n:'Кольцо мудрости',rar:1,f:3,b:{crit:4,hp:10}},
{slot:'ring',i:'💍',n:'Печатка королей',rar:2,f:7,b:{atk:3,def:3,crit:3}},
/* Амулеты */
{slot:'amulet',i:'📿',n:'Амулет жизни',rar:0,f:1,b:{hp:25}},
{slot:'amulet',i:'🧿',n:'Оберег-глаз',rar:1,f:4,b:{dodge:6}},
{slot:'amulet',i:'🦷',n:'Клык вампира',rar:2,f:6,b:{vamp:.12}},
{slot:'amulet',i:'🔮',n:'Сфера магии',rar:1,f:3,b:{atk:2,crit:3}},
{slot:'amulet',i:'⚙️',n:'Шестерёнка удачи',rar:1,f:4,b:{crit:5,dodge:3}},
{slot:'amulet',i:'💎',n:'Кристалл силы',rar:2,f:7,b:{atk:4,crit:4}}
];}

var ELIXIRS={
stun:{i:'💫',n:'Оглушающая бомба',d:'Оглушает 2 хода',el:'physical'},
freeze:{i:'🧊',n:'Ледяная колба',d:'Урон льдом + оглушение',el:'ice'},
burn:{i:'🔥',n:'Огненная фляга',d:'Поджигает 3 хода',el:'fire'},
poison:{i:'☠️',n:'Ядовитый флакон',d:'Отравляет 3 хода',el:'poison'},
heal:{i:'❤️',n:'Эликсир жизни',d:'Лечит 40% HP',el:'holy'},
thunder:{i:'⚡',n:'Громовой камень',d:'Большой урон молнией',el:'lightning'}
};

var RECIPES=[
{id:'c_sword',i:'⚔️',n:'Кованый меч',slot:'weapon',rar:1,b:{atk:8,crit:3},mats:{'Гоблинское ухо':3,'Костяная пыль':2},desc:'+8 атаки, +3% крит'},
{id:'c_staff',i:'🔮',n:'Посох стихий',slot:'weapon',rar:1,b:{atk:7,crit:5},mats:{'Эктоплазма':3,'Совиное перо':2},desc:'+7 атаки, +5% крит'},
{id:'c_dagger',i:'🗡️',n:'Отравленный стилет',slot:'weapon',rar:1,b:{atk:7,crit:6},mats:{'Паучий шёлк':3,'Змеиная чешуя':2},desc:'+7 атаки, +6% крит'},
{id:'c_axe',i:'🪓',n:'Боевой топор',slot:'weapon',rar:1,b:{atk:9,crit:2},mats:{'Каменная кожа':3,'Каменное ядро':2},desc:'+9 атаки, +2% крит'},
{id:'c_gun',i:'🔫',n:'Улучшенная винтовка',slot:'weapon',rar:1,b:{atk:8,crit:4},mats:{'Уголёк':3,'Рваный плащ':2},desc:'+8 атаки, +4% крит'},
{id:'c_bow',i:'🏹',n:'Охотничий лук',slot:'weapon',rar:1,b:{atk:8,crit:5},mats:{'Волчья шкура':3,'Живая древесина':2},desc:'+8 атаки, +5% крит'},
{id:'c_wand',i:'✨',n:'Жезл природы',slot:'weapon',rar:1,b:{atk:7,crit:4},mats:{'Болотная слизь':3,'Слизь':2},desc:'+7 атаки, +4% крит'},
{id:'c_chain',i:'🛡️',n:'Укреплённая кольчуга',slot:'armor',rar:1,b:{def:5,hp:20},mats:{'Костяная пыль':4,'Гоблинское ухо':2},desc:'+5 защиты, +20 HP'},
{id:'c_cloak',i:'🧥',n:'Плащ разведчика',slot:'armor',rar:1,b:{def:4,dodge:6},mats:{'Рваный плащ':3,'Волчья шкура':2},desc:'+4 защиты, +6% уворот'},
{id:'c_fur',i:'🦺',n:'Меховая броня',slot:'armor',rar:1,b:{def:5,hp:25},mats:{'Волчья шкура':4,'Гнилая плоть':2},desc:'+5 защиты, +25 HP'},
{id:'c_helm',i:'⛑️',n:'Кованый шлем',slot:'helmet',rar:1,b:{def:4,hp:15},mats:{'Каменное ядро':3,'Костяная пыль':2},desc:'+4 защиты, +15 HP'},
{id:'c_hood',i:'',n:'Капюшон следопыта',slot:'helmet',rar:1,b:{def:3,dodge:4},mats:{'Рваный плащ':3,'Совиное перо':2},desc:'+3 защиты, +4% уворот'},
{id:'c_boots',i:'👢',n:'Сапоги ветра',slot:'boots',rar:1,b:{dodge:5,spd:3},mats:{'Волчья шкура':3,'Крыло мыши':2},desc:'+5% уворот, +3 скорость'},
{id:'c_gloves',i:'🧤',n:'Перчатки воина',slot:'gloves',rar:1,b:{atk:4,def:2},mats:{'Гоблинское ухо':3,'Каменная кожа':2},desc:'+4 атаки, +2 защита'},
{id:'c_ring',i:'💍',n:'Кольцо стихий',slot:'ring',rar:1,b:{crit:6,hp:15},mats:{'Эктоплазма':3,'Уголёк':2},desc:'+6% крит, +15 HP'},
{id:'c_ring2',i:'💍',n:'Кольцо ловкости',slot:'ring',rar:1,b:{dodge:5,spd:2},mats:{'Крыло мыши':3,'Змеиная чешуя':2},desc:'+5% уворот, +2 скорость'},
{id:'c_amulet',i:'📿',n:'Амулет жизни',slot:'amulet',rar:1,b:{hp:30,def:3},mats:{'Болотная слизь':3,'Живая древесина':2},desc:'+30 HP, +3 защиты'},
{id:'c_amulet2',i:'⚗️',n:'Флакон алхимика',slot:'amulet',rar:1,b:{atk:4,crit:4},mats:{'Змеиная чешуя':3,'Паучий шёлк':2},desc:'+4 атаки, +4% крит'},
{id:'c_epic1',i:'⚔️',n:'Клинок Бездны',slot:'weapon',rar:2,b:{atk:14,crit:8,vamp:.1},mats:{'Пустотный камень':3,'Шёпот бездны':2,'Осколок души':1},desc:'+14 атаки, +8% крит, +10% вамп'},
{id:'c_epic2',i:'🛡️',n:'Доспех Титана',slot:'armor',rar:2,b:{def:10,hp:40,atk:3},mats:{'Каменное ядро':4,'Ядро колосса':2,'Каменная кожа':2},desc:'+10 защиты, +40 HP, +3 атаки'},
{id:'c_epic3',i:'📿',n:'Сердце Стихий',slot:'amulet',rar:2,b:{atk:7,crit:7,hp:20},mats:{'Сердце пламени':2,'Вечный снег':2,'Ледяной клык':2},desc:'+7 атаки, +7% крит, +20 HP'},
{id:'c_epic4',i:'🗡️',n:'Жнец Душ',slot:'weapon',rar:2,b:{atk:12,crit:10,vamp:.15},mats:{'Осколок души':3,'Демонический рог':2,'Теневой клинок':1},desc:'+12 атаки, +10% крит, +15% вамп'},
{id:'c_epic5',i:'🏹',n:'Лук Пустоты',slot:'weapon',rar:2,b:{atk:13,crit:9,dodge:4},mats:{'Пустотный камень':2,'Осколок хаоса':2,'Крыло мыши':3},desc:'+13 атаки, +9% крит, +4% уворот'},
{id:'c_epic6',i:'💍',n:'Перстень Вечности',slot:'ring',rar:2,b:{atk:5,def:5,crit:5,hp:15},mats:{'Осколок мира':1,'Ледяная корона':1,'Сердце пламени':1},desc:'+5 ко всему, +15 HP'},
{id:'c_epic7',i:'⛑️',n:'Корона Хаоса',slot:'helmet',rar:2,b:{atk:6,crit:8,hp:25},mats:{'Осколок хаоса':2,'Демоническое сердце':1,'Королевская слизь':2},desc:'+6 атаки, +8% крит, +25 HP'},
{id:'c_epic8',i:'🧤',n:'Рукавицы Пожирателя',slot:'gloves',rar:2,b:{atk:8,crit:6,vamp:.08},mats:{'Осколок мира':1,'Демоническое сердце':1,'Теневой клинок':2},desc:'+8 атаки, +6% крит, +8% вамп'}
];

var ALL_MATS=['Слизь','Крыло мыши','Гоблинское ухо','Костяная пыль','Эктоплазма','Гнилая плоть','Рваный плащ','Волчья шкура','Паучий шёлк','Совиное перо','Живая древесина','Болотная слизь','Трясинный мох','Змеиная чешуя','Каменная кожа','Коготь гарпии','Каменное ядро','Уголёк','Пепельная чешуя','Застывшая лава','Ледяной клык','Вечный снег','Ледяной осколок','Демонический рог','Теневой клинок','Осколок души','Пустотный камень','Шёпот бездны','Осколок хаоса','Королевская слизь','Некротический фолиант','Золотая цепь','Шёлк королевы','Сердце болота','Ядро колосса','Сердце пламени','Ледяная корона','Демоническое сердце','Осколок мира'];