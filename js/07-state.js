'use strict';
/* ============================================
07-STATE: состояние, сохранения, рейтинг
«один игрок = одна строка (лучший результат)»,
обязательный пользователь
============================================ */
var LS_RUN='kcigames_rpg_run', LS_USER='kcigames_user', LS_SCORES='kcigames_scores_local',
    LS_BEST='kcigames_bestiary', LS_CARDS='kcigames_cards';

var supabaseClient=(window.supabase&&window.SUPABASE_URL&&window.SUPABASE_KEY)
  ?window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_KEY):null;

var G={
  phase:'menu',diff:'normal',floor:1,gold:0,kills:0,cycle:0,
  hero:null,enemy:null,doors:null,companion:null,
  relics:[],relicBuys:0,materials:{},chestsOpened:0,shopGoods:null,
  quests:[],pendingQuests:[],logArr:[],
  round:0,busy:false,phoenixCd:0,startTime:0,
  won:false,winBonus:false,hasSave:false
};

/* --- пользователь (обязательный) --- */
function getUser(){return localStorage.getItem(LS_USER)||'';}
function setUser(n){localStorage.setItem(LS_USER,n);}

/* --- бестиарий / карточки --- */
function getBestiary(){return JSON.parse(localStorage.getItem(LS_BEST)||'{}');}
function unlockBestiary(id){var b=getBestiary();if(!b[id]){b[id]=1;localStorage.setItem(LS_BEST,JSON.stringify(b));}}
function getCards(){return JSON.parse(localStorage.getItem(LS_CARDS)||'{}');}
function addCard(id){var c=getCards();c[id]=(c[id]||0)+1;localStorage.setItem(LS_CARDS,JSON.stringify(c));}
function cardsDone(){var c=getCards();var t=ALL_MONSTERS.length,d=0;for(var i=0;i<t;i++){if((c[ALL_MONSTERS[i].id]||0)>0)d++;}return d>=t;}

/* --- сохранение забега --- */
function saveRun(){
  try{localStorage.setItem(LS_RUN,JSON.stringify(G));G.hasSave=true;}catch(e){}
}
function loadRun(){
  try{
    var raw=localStorage.getItem(LS_RUN);
    if(!raw)return false;
    var data=JSON.parse(raw);
    for(var k in data)G[k]=data[k];
    G.hasSave=true;G.busy=false;
    return true;
  }catch(e){return false;}
}
function clearRun(){localStorage.removeItem(LS_RUN);G.hasSave=false;}
function checkSave(){return !!localStorage.getItem(LS_RUN);}

/* --- рейтинг: лучший результат на человека --- */
function _dedupe(rows){
  var map={};
  (rows||[]).forEach(function(r){
    var k=(r.name||'').toLowerCase();
    if(!map[k]||(r.score||0)>(map[k].score||0))map[k]=r;
  });
  var arr=[];for(var k in map)arr.push(map[k]);
  arr.sort(function(a,b){return(b.score||0)-(a.score||0);});
  return arr;
}
function saveScoreAsync(name,score,floor){
  name=name||getUser()||'Аноним';
  if(supabaseClient){
    return supabaseClient.from('scores').select('*').eq('name',name).then(function(res){
      var row=res.data&&res.data[0];
      if(row){
        if((score||0)>(row.score||0))
          return supabaseClient.from('scores').update({score:score,floor:floor}).eq('name',name);
        return Promise.resolve();
      }
      return supabaseClient.from('scores').insert([{name:name,score:score,floor:floor}]);
    });
  }
  var arr=JSON.parse(localStorage.getItem(LS_SCORES)||'[]');
  var i=-1;
  for(var j=0;j<arr.length;j++)if((arr[j].name||'').toLowerCase()===name.toLowerCase())i=j;
  if(i>=0){if(score>arr[i].score){arr[i].score=score;arr[i].floor=floor;}}
  else arr.push({name:name,score:score,floor:floor});
  localStorage.setItem(LS_SCORES,JSON.stringify(arr));
  return Promise.resolve();
}
function getScoresAsync(){
  if(supabaseClient){
    return supabaseClient.from('scores').select('name,score,floor').order('score',{ascending:false}).limit(200)
      .then(function(res){return _dedupe(res.data||[]);});
  }
  return Promise.resolve(_dedupe(JSON.parse(localStorage.getItem(LS_SCORES)||'[]')));
}