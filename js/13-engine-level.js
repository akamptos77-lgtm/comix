'use strict';
/* ============================================
13-ENGINE-LEVEL: опыт, уровни, атрибуты,
благословения, финал, старт забега
ФИКС: все герои начинают с ПОЛНЫМ HP
============================================ */
function gainXp(n){
  var h=G.hero;
  if(!h)return Promise.resolve();
  h.xp+=n;
  var chain=Promise.resolve();
  while(h.xp>=h.xpNeed){
    h.xp-=h.xpNeed;h.level++;h.xpNeed=50+(h.level-1)*35;
    h.maxHp+=8;h.hp=Math.min(pMaxHp(),h.hp+12);
    h.atk+=1;h.def+=1;h.spd+=1;h.crit+=1;
    sfx.level();updateHUD();
    (function(lvl){chain=chain.then(function(){return chooseAttr(lvl);});})(h.level);
  }
  saveRun();
  return chain;
}
function chooseAttr(lvl){
  return new Promise(function(res){
    var h=G.hero;
    var title=$('#attr-title'),row=$('#attr-row');
    if(!title||!row){res();return;}
    title.innerHTML='Уровень <b>'+(lvl||h.level)+'</b>! Выбери атрибут:';
    row.innerHTML=[
      {k:'str',i:'💪',n:'Сила',d:'+2 к атаке',v:h.stats.str},
      {k:'agi',i:'🏹',n:'Ловкость',d:'+3% крит, +уклонение',v:h.stats.agi},
      {k:'int',i:'🔮',n:'Интеллект',d:'+10% навык, +зелья',v:h.stats.int},
      {k:'vit',i:'❤️',n:'Живучесть',d:'+15 макс. HP',v:h.stats.vit}
    ].map(function(a){
      return'<button class="attr-btn" data-k="'+a.k+'"><b><span class="attr-ico">'+a.i+'</span>'+a.n+'</b><div class="av">сейчас: '+a.v+'</div><small>'+a.d+'</small></button>';
    }).join('');
    openOvl('ovl-attrs');
    var resolved=false;
    row.querySelectorAll('.attr-btn').forEach(function(b){
      b.onclick=function(){
        if(resolved)return;resolved=true;
        row.querySelectorAll('.attr-btn').forEach(function(x){x.disabled=true;});
        var k=this.dataset.k;
        h.stats[k]++;
        if(k==='vit')h.hp=Math.min(pMaxHp(),h.hp+15);
        closeOvl('ovl-attrs');
        log('🆙 '+k.toUpperCase()+' = '+h.stats[k]);
        saveRun();
        if(Math.random()<.15){
          chooseCard().then(function(){updateHUD();res();});
        }else{updateHUD();res();}
      };
    });
  });
}
function chooseCard(){
  return new Promise(function(res){
    var h=G.hero;
    var pool=CARDS.filter(function(c){return!c.once||h.owned.indexOf(c.once)<0;});
    var picks=[];
    while(picks.length<3&&pool.length)picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    var title=$('#cards-title'),row=$('#cards-row');
    if(!title||!row||!picks.length){res();return;}
    title.innerHTML='Благословение! Выбери бонус:';
    row.innerHTML=picks.map(function(c,i){
      return'<button class="fate-card" data-i="'+i+'"><div class="fc-i">'+c.i+'</div><b>'+c.n+'</b>'+c.d+'</button>';
    }).join('');
    openOvl('ovl-cards');
    var resolved=false;
    row.querySelectorAll('.fate-card').forEach(function(b){
      b.onclick=function(){
        if(resolved)return;resolved=true;
        row.querySelectorAll('.fate-card').forEach(function(x){x.disabled=true;});
        var c=picks[parseInt(this.dataset.i,10)];
        c.f(h);
        if(c.once)h.owned.push(c.once);
        sfx.gold();closeOvl('ovl-cards');
        log('🎁 '+c.n);updateHUD();saveRun();
        res();
      };
    });
  });
}
function calcScore(){
  var h=G.hero;if(!h)return 0;
  return G.floor*120+G.kills*15+G.gold+(h.level-1)*60+(G.winBonus?2000:0);
}
function showEnd(win){
  G.phase='over';G.busy=false;
  var actions=$('#actions');if(actions)actions.classList.add('hidden');
  var elixirs=$('#elixirs');if(elixirs)elixirs.classList.add('hidden');
  var h=G.hero;if(!h)return;
  var s=calcScore();
  var emoji=$('#end-emoji');if(emoji)emoji.textContent=win?'🏆':'';
  var title=$('#end-title');
  if(title)title.textContent=win?'ПОБЕДА! ПОЖИРАТЕЛЬ МИРОВ ПАЛ!':'ГЕРОЙ ПАЛ…';
  var stats=$('#end-stats');
  if(stats){
    stats.innerHTML=
      '<div>🏰 Этаж<br><b>'+G.floor+'</b></div>'+
      '<div>💀 Побед<br><b>'+G.kills+'</b></div>'+
      '<div>💰 Золото<br><b>'+G.gold+'</b></div>'+
      '<div>⭐ Уровень<br><b>'+h.level+'</b></div>'+
      '<div>⏱ Время<br><b>'+getRunTimeText()+'</b></div>'+
      '<div>🏺 Реликвии<br><b>'+(G.relics?G.relics.length:0)+'</b></div>'+
      '<div class="big">ОЧКИ: '+s+'</div>';
  }
  var inp=$('#end-inp');if(inp)inp.value=getUser();
  var saveBtn=$('#end-save');
  if(saveBtn){saveBtn.disabled=false;saveBtn.textContent='🏆 В рейтинг!';}
  openOvl('ovl-end');
  clearRun();
}
function getRunTimeText(){
  if(!G.startTime)return'—';
  var sec=Math.floor((Date.now()-G.startTime)/1000);
  return Math.floor(sec/60)+'м '+(sec%60)+'с';
}
function startRun(k){
  var c=CLASSES[k];
  G.lastClass=k;G.phase='doors';G.busy=false;
  G.hero={cls:k,name:c.name,icon:c.icon,hp:c.hp,maxHp:c.hp,atk:c.atk,def:c.def,spd:c.spd,crit:c.crit,
    stats:{str:c.stats.str,agi:c.stats.agi,int:c.stats.int,vit:c.stats.vit},
    equip:{weapon:null,armor:null,helmet:null,boots:null,gloves:null,ring1:null,ring2:null,amulet:null},
    inv:[],elixirs:[],elixirCap:3,buffs:{atk:0,def:0,dodge:0,rage:0,crit:0},
    shield:false,skills:[],activeSkill:null,skill2Cd:0,
    pots:DIFF[G.diff].pots,level:1,xp:0,xpNeed:50,skillCd:0,skillCdMax:c.skill.cd,skillName:c.skill.name,
    defending:false,vamp:0,thorns:0,poison:null,burn:null,dead:false,fx:{lunge:0,hurt:0,death:1},
    owned:[],shopMult:1,dodgePenalty:0,holyWeak:false};
  /* ФИКС: герой начинает с ПОЛНЫМ HP (макс. HP учитывает Живучесть) */
  G.hero.hp=pMaxHp();
  G.floor=1;G.gold=25;G.kills=0;G.won=false;G.winBonus=false;
  G.enemy=null;G.doors=null;G.companion=null;G.materials={};G.chestsOpened=0;G.shopGoods=null;
  G.cycle=0;G.relics=[];G.relicBuys=0;G.pendingQuests=[];G.round=0;G.logArr=[];G.phoenixCd=0;
  G.startTime=Date.now();
  G.quests=QUESTS.map(function(q){
    return{id:q.id,name:q.name,desc:q.desc,target:q.target,need:q.need,rewards:q.rewards,progress:0};
  });
  show('scr-game');buildActions();updateHUD();renderDoors();
  log('Добро пожаловать в '+getBiome(1).name+'!');
  saveRun();
}