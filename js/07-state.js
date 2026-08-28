'use strict';
/* ============================================
07-STATE: Глобальное состояние + Supabase + Автосейв
============================================ */
// --- Инициализация Supabase теперь в supabase-config.js ---
// Переменные supabaseClient и supabaseClient2 доступны глобально оттуда.

// --- Глобальное состояние ---
var G = {
diff:'normal', phase:'menu', hero:null, enemy:null,
floor:1, gold:25, kills:0, busy:false, won:false, winBonus:false,
doors:null, lastClass:null, companion:null, quests:null,
materials:{}, chestsOpened:0, shopGoods:null,
cycle:0, relics:[], pendingQuests:[], round:0, logArr:[],
phoenixCd:0,
hasSave: false // Флаг наличия сохранения
};
var tutStep = 0;
// --- Ключи localStorage ---
var LS_SCORES = 'kcigames_rpg_scores';
var LU_USER   = 'kcigames_user';
var LB_BEST   = 'kcigames_bestiary';
var LC_CARDS  = 'kcigames_cards';
var LS_RUN    = 'kcigames_rpg_run'; // <-- КЛЮЧ ДЛЯ СОХРАНЕНИЯ ЗАБЕГА
// =============================================
// АВТОСОХРАНЕНИЕ ЗАБЕГА
// =============================================
/** Сохранить текущий забег в localStorage */
function saveRun() {
try {
// Не сохраняем, если игра в меню или завершена
if (G.phase === 'menu' || G.phase === 'over') {
clearRun();
return;
}
// Сериализуем всё состояние G
var data = JSON.stringify(G);
localStorage.setItem(LS_RUN, data);
G.hasSave = true;
} catch(e) {
console.error('Ошибка сохранения:', e);
}
}
/** Загрузить забег из localStorage */
function loadRun() {
try {
var data = localStorage.getItem(LS_RUN);
if (!data) return false;
var saved = JSON.parse(data);
// Восстанавливаем состояние
for (var k in saved) {
  G[k] = saved[k];
}
G.hasSave = true;
console.log('📂 Забег загружен (Этаж ' + G.floor + ')');
return true;
} catch(e) {
console.error('Ошибка загрузки:', e);
clearRun();
return false;
}
}
/** Удалить сохранение (при победе/поражении/новой игре) */
function clearRun() {
localStorage.removeItem(LS_RUN);
G.hasSave = false;
}
/** Проверить наличие сохранения при старте */
function checkSave() {
G.hasSave = !!localStorage.getItem(LS_RUN);
return G.hasSave;
}
// =============================================
// ЗАЛ СЛАВЫ (Supabase + LocalStorage)
// =============================================

/**
 * Получает реальное имя пользователя из второй БД по его ID.
 * ID берётся из URL (?uid=...) или из localStorage.
 * Если что-то пошло не так — возвращается имя из localStorage игры (фолбэк).
 * ВАЖНО: эта функция делает ТОЛЬКО SELECT ко второй БД.
 */
function getRealUsernameAsync() {
    // 1. Получаем ID пользователя (из URL или localStorage)
    var userId = null;
    if (typeof getGameUserId === 'function') {
        userId = getGameUserId();
    }

    // 2. Если ID нет — возвращаем фолбэк
    if (!userId) {
        console.warn('⚠️ Нет user_id, используем имя из localStorage игры');
        return Promise.resolve(getUser() || 'Аноним');
    }

    // 3. Если вторая БД не подключена — фолбэк
    if (typeof supabaseClient2 === 'undefined' || !supabaseClient2) {
        console.warn('⚠️ Вторая БД не подключена, используем фолбэк');
        return Promise.resolve(getUser() || 'Аноним');
    }

    // 4. Запрос ко ВТОРОЙ БД (ТОЛЬКО SELECT — ничего не пишем!)
    return supabaseClient2
        .from('users')
        .select('data')
        .eq('id', userId)
        .maybeSingle()
        .then(function(res) {
            if (res.error) {
                console.warn('⚠️ Ошибка запроса ко второй БД:', res.error.message);
                return getUser() || 'Аноним';
            }

            var row = res.data;
            if (row && row.data && row.data.username) {
                var username = row.data.username;
                console.log('✅ Имя получено из второй БД:', username);
                // Сохраняем в localStorage игры, чтобы показывать на главной
                try { localStorage.setItem(LU_USER, username); } catch(e){}
                return username;
            }

            console.warn('⚠️ Поле data.username не найдено во второй БД');
            return getUser() || 'Аноним';
        })
        .catch(function(err) {
            console.error('❌ Критическая ошибка при чтении второй БД:', err);
            return getUser() || 'Аноним';
        });
}

function getScoresAsync() {
return new Promise(function(resolve) {
if (typeof supabaseClient !== 'undefined' && supabaseClient) {
supabaseClient.from('scores').select('name, score, floor').order('score', { ascending: false }).limit(10).then(function(res) {
if (res.error) resolve(getScoresLocal());
else {
try { localStorage.setItem(LS_SCORES, JSON.stringify(res.data || [])); } catch(e){}
resolve(res.data || []);
}
});
} else resolve(getScoresLocal());
});
}
function getScoresLocal() { try { return JSON.parse(localStorage.getItem(LS_SCORES)) || []; } catch(e) { return []; } }
function getScores() { return getScoresLocal(); }

/**
 * Сохраняет результат в первую БД.
 * ИМЯ БЕРЁТСЯ ИЗ ВТОРОЙ БД (через getRealUsernameAsync).
 * Переданное имя (name) игнорируется — мы всегда подставляем настоящее.
 */
function saveScoreAsync(name, score, floor) {
return new Promise(function(resolve) {
// 1. Получаем настоящее имя из второй БД
getRealUsernameAsync().then(function(finalName) {
var record = { name: finalName || 'Аноним', score: score, floor: floor };

// 2. Записываем в ПЕРВУЮ БД
if (typeof supabaseClient !== 'undefined' && supabaseClient) {
supabaseClient.from('scores').insert([record]).then(function(res) {
if (res.error) {
console.warn('⚠️ Ошибка записи в первую БД, сохраняем локально:', res.error.message);
saveScoreLocal(record);
}
resolve(true);
});
} else { 
saveScoreLocal(record); 
resolve(true); 
}
});
});
}
function saveScoreLocal(r) {
var a = getScoresLocal(); a.push(r); a.sort(function(x,y){return y.score-x.score;});
try { localStorage.setItem(LS_SCORES, JSON.stringify(a.slice(0,10))); } catch(e){}
}
function saveScore(n,s,f) { saveScoreAsync(n,s,f).then(renderScoresAsync); }
// =============================================
// ПРОЧИЕ ДАННЫЕ (User, Bestiary, Cards)
// =============================================
function getUser() { return localStorage.getItem(LU_USER) || ''; }
function setUser(n) { if(n) localStorage.setItem(LU_USER, n); else localStorage.removeItem(LU_USER); }
function getBestiary() { try { return JSON.parse(localStorage.getItem(LB_BEST))||{}; } catch(e){ return {}; } }
function unlockBestiary(id) { var b=getBestiary(); if(!b[id]){b[id]=true; localStorage.setItem(LB_BEST,JSON.stringify(b));} }
function getCards() { try { return JSON.parse(localStorage.getItem(LC_CARDS))||{}; } catch(e){ return {}; } }
function addCard(id) {
var c=getCards(); c[id]=(c[id]||0)+1;
try { localStorage.setItem(LC_CARDS, JSON.stringify(c)); } catch(e){}
var done=true; for(var i=0;i<ALL_MONSTERS.length;i++) if(!(c[ALL_MONSTERS[i].id]>0)){done=false;break;}
if(done && localStorage.getItem('kcigames_cards_done')!=='1'){
localStorage.setItem('kcigames_cards_done','1');
log('🃏 КОЛЛЕКЦИЯ СОБРАНА! +5% крит, +5% уворот НАВСЕГДА!'); sfx.level();
}
}
function cardsDone() { return localStorage.getItem('kcigames_cards_done')==='1'; }
