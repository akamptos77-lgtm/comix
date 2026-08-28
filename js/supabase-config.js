'use strict';
/* ============================================
SUPABASE CONFIG
Первая БД — для записи рейтинга игры
Вторая БД — ТОЛЬКО ЧТЕНИЕ (получение имени пользователя)
============================================ */

// ==========================================
// 1. ПЕРВАЯ БД (куда пишем рейтинг игры)
// ==========================================
const SUPABASE_URL = 'https://rwsltjjoaqkqknpnxceb.supabase.co/rest/v1/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3c2x0ampvYXFrcWtucG54Y2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NjI3MDIsImV4cCI6MjEwMzIzODcwMn0.Pbb48QxI-LZwl3lzn1pX_x2KZHBXflTDnYpx23XW8P4';

// ==========================================
// 2. ВТОРАЯ БД (ТОЛЬКО ЧТЕНИЕ — получаем имя пользователя)
// ==========================================
const SUPABASE_URL_2 = 'https://zelcomhsdguzgtzhjkhk.supabase.co';
const SUPABASE_KEY_2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbGNvbWhzZGd1emd0emhqa2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTAxMjMsImV4cCI6MjEwMDk4NjEyM30.t3-Zd66YYgOrhpuGsDPdnFwFhBeaWkxvPHu9c4S_N2g';

// ==========================================
// 3. Инициализация клиентов
// ==========================================
let supabaseClient = null;
let supabaseClient2 = null;

try {
    if (window.supabase) {
        // Первая БД — для записи рейтинга
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Первая БД (рейтинг) подключена успешно!');

        // Вторая БД — ТОЛЬКО для чтения имени пользователя
        supabaseClient2 = window.supabase.createClient(SUPABASE_URL_2, SUPABASE_KEY_2);
        console.log('✅ Вторая БД (users) подключена в режиме ТОЛЬКО ЧТЕНИЕ!');
    } else {
        console.error('❌ Библиотека Supabase не загружена! Проверь index.html');
    }
} catch (e) {
    console.error('❌ Ошибка инициализации Supabase:', e);
}

// ==========================================
// 4. Получение ID пользователя при старте игры
//    Основной сайт передаёт ID через URL (?uid=... или ?user_id=...)
//    или через localStorage ('main_app_user_id')
// ==========================================
function getGameUserId() {
    // 1. Проверяем URL-параметры (?uid=... или ?user_id=...)
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const uidFromUrl = urlParams.get('uid') || urlParams.get('user_id');
        if (uidFromUrl) {
            // Сохраняем в localStorage, чтобы не терялся при перезагрузке
            try { localStorage.setItem('kcigames_user_id', uidFromUrl); } catch(e){}
            console.log('✅ User ID получен из URL:', uidFromUrl);
            return uidFromUrl;
        }
    } catch(e) {
        console.warn('⚠️ Ошибка чтения URL:', e);
    }

    // 2. Проверяем LocalStorage (сохранённый при предыдущем переходе)
    try {
        const uidFromStorage = localStorage.getItem('kcigames_user_id');
        if (uidFromStorage) {
            console.log('✅ User ID получен из localStorage:', uidFromStorage);
            return uidFromStorage;
        }
    } catch(e) {}

    console.warn('⚠️ User ID не найден. Игра работает в анонимном режиме.');
    return null;
}

// ==========================================
// 5. Получение имени пользователя из второй БД
//    Возвращает Promise с именем (строка)
//    ВАЖНО: НИЧЕГО НЕ ПИШЕМ во вторую БД!
// ==========================================
function getRealUsernameAsync() {
    const userId = getGameUserId();

    // Если ID нет — возвращаем фолбэк
    if (!userId) {
        console.warn('⚠️ Нет user_id, используем имя из localStorage игры');
        const fallback = (typeof getUser === 'function') ? getUser() : '';
        return Promise.resolve(fallback || 'Аноним');
    }

    // Если вторая БД не подключена — фолбэк
    if (!supabaseClient2) {
        console.warn('⚠️ Вторая БД не подключена, используем фолбэк');
        const fallback = (typeof getUser === 'function') ? getUser() : '';
        return Promise.resolve(fallback || 'Аноним');
    }

    // Запрос ко ВТОРОЙ БД (ТОЛЬКО SELECT — ничего не пишем!)
    return supabaseClient2
        .from('users')
        .select('data')
        .eq('id', userId)
        .maybeSingle()
        .then(function(res) {
            if (res.error) {
                console.warn('⚠️ Ошибка запроса ко второй БД:', res.error.message);
                const fallback = (typeof getUser === 'function') ? getUser() : '';
                return fallback || 'Аноним';
            }

            const row = res.data;
            if (row && row.data && row.data.username) {
                const username = row.data.username;
                console.log('✅ Имя получено из второй БД:', username);
                // Сохраняем в localStorage игры, чтобы показывать на главной
                try { localStorage.setItem('kcigames_user', username); } catch(e){}
                return username;
            }

            console.warn('⚠️ Поле data.username не найдено во второй БД');
            const fallback = (typeof getUser === 'function') ? getUser() : '';
            return fallback || 'Аноним';
        })
        .catch(function(err) {
            console.error('❌ Критическая ошибка при чтении второй БД:', err);
            const fallback = (typeof getUser === 'function') ? getUser() : '';
            return fallback || 'Аноним';
        });
}

// ==========================================
// 6. Функция проверки подключения (для отладки)
// ==========================================
function checkSupabaseConnection() {
    if (!supabaseClient) return false;
    supabaseClient.from('scores').select('id').limit(1).then(res => {
        if (res.error) console.warn('⚠️ Ошибка доступа к первой БД:', res.error.message);
        else console.log('✅ Связь с первой БД установлена.');
    });
    return true;
}

// ==========================================
// 7. Автозагрузка имени при старте страницы
//    Чтобы на главной сразу отображалось имя
// ==========================================
(function initUserNameOnLoad() {
    // Ждём, пока загрузится DOM и функция getUser станет доступна
    function tryLoadName() {
        if (typeof getUser !== 'function') {
            setTimeout(tryLoadName, 200);
            return;
        }
        getRealUsernameAsync().then(function(name) {
            console.log('🎮 Имя игрока на старте:', name);
            // Обновляем кнопку входа, если она есть
            const btnLogin = document.getElementById('btn-login');
            if (btnLogin) {
                btnLogin.textContent = '👤 ' + name;
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryLoadName);
    } else {
        tryLoadName();
    }
})();
