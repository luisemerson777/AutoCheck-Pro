import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://seu-projeto-aqui.supabase.co' &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);

if (!isSupabaseConfigured) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas ou inválidas!');
  console.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local ou nas variáveis de ambiente da Vercel.');
}

let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('❌ Falha ao inicializar Supabase:', err.message || err);
    supabase = null;
  }
}

export { supabase };
