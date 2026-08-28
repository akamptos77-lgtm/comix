'use strict';
/* ============================================
   SUPABASE CONFIG
   Вставь сюда свои ключи из настроек Supabase
   ============================================ */

// 1. Замени эти строки на свои данные
const SUPABASE_URL = 'https://rwsltjjoaqkqknpnxceb.supabase.co/rest/v1/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3c2x0ampvYXFrcWtucG54Y2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NjI3MDIsImV4cCI6MjEwMzIzODcwMn0.Pbb48QxI-LZwl3lzn1pX_x2KZHBXflTDnYpx23XW8P4';

// 2. Инициализация клиента
let supabaseClient = null;

try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase подключен успешно!');
  } else {
    console.error('❌ Библиотека Supabase не загружена! Проверь index.html');
  }
} catch (e) {
  console.error('❌ Ошибка инициализации Supabase:', e);
}

// 3. Функция проверки подключения (для отладки)
function checkSupabaseConnection() {
  if (!supabaseClient) return false;
  // Простой запрос к таблице scores (даже если она пуста)
  supabaseClient.from('scores').select('id').limit(1).then(res => {
    if (res.error) console.warn('⚠️ Ошибка доступа к БД:', res.error.message);
    else console.log(' Связь с БД установлена.');
  });
  return true;
}