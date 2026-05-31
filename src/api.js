/**
 * Configuração de API - Suporta Supabase e API Local
 * Este arquivo funciona como um adaptador entre o app e diferentes backends
 */

import { supabase } from './supabaseClient';

// Detecta se Supabase está configurado
const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://seu-projeto-aqui.supabase.co' &&
    (import.meta.env.VITE_SUPABASE_URL.startsWith('http://') || import.meta.env.VITE_SUPABASE_URL.startsWith('https://'))
  );
};

const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
};

// ============ OPERAÇÕES DE INSPEÇÕES ============

export const inspectionsAPI = {
  /**
   * Buscar todas as inspeções
   */
  async getAll() {
    try {
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from('inspecoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return { data: data || [], error: null };
    } catch (err) {
      console.error('❌ Erro ao buscar inspeções:', err.message);
      return { data: [], error: err.message };
    }
  },

  /**
   * Buscar uma inspeção por ID
   */
  async getById(id) {
    try {
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from('inspecoes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (err) {
      console.error('❌ Erro ao buscar inspeção:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Criar nova inspeção
   */
  async create(inspection) {
    try {
      const inspectionData = {
        ...inspection,
        id: inspection.id || Date.now(),
        created_at: inspection.created_at || new Date().toISOString(),
        updated_at: inspection.updated_at || new Date().toISOString(),
      };

      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from('inspecoes')
        .insert([inspectionData])
        .select();

      if (error) throw new Error(error.message);
      return { data: data?.[0], error: null };
    } catch (err) {
      console.error('❌ Erro ao criar inspeção:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Atualizar inspeção (upsert)
   */
  async upsert(inspection) {
    try {
      const inspectionData = {
        ...inspection,
        id: inspection.id || Date.now(),
        updated_at: new Date().toISOString(),
      };

      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from('inspecoes')
        .upsert([inspectionData], { onConflict: 'id' })
        .select();

      if (error) throw new Error(error.message);
      return { data: data?.[0], error: null };
    } catch (err) {
      console.error('❌ Erro ao salvar inspeção:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Deletar inspeção
   */
  async delete(id) {
    try {
      const supabaseClient = getSupabaseClient();
      const { error } = await supabaseClient
        .from('inspecoes')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { error: null };
    } catch (err) {
      console.error('❌ Erro ao deletar inspeção:', err.message);
      return { error: err.message };
    }
  },
};

// ============ OPERAÇÕES DE AUTENTICAÇÃO ============

export const authAPI = {
  /**
   * Login - sempre usa API local (compatibilidade com backend Python)
   */
  async login(username, password) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Falha ao autenticar');
      }

      const json = await res.json();
      console.log('✅ Login bem-sucedido');
      return { data: json.data || json, error: null };
    } catch (err) {
      console.error('❌ Erro de autenticação:', err.message);
      return { data: null, error: err.message };
    }
  },
};

// ============ STATUS ============

export const getApiStatus = async () => {
  const status = {
    supabase: isSupabaseConfigured() ? 'configurado' : 'não configurado',
    localApi: 'desabilitado',
    mode: isSupabaseConfigured() ? 'produção' : 'desenvolvimento',
  };

  return status;
};

export default {
  inspectionsAPI,
  authAPI,
  getApiStatus,
  isSupabaseConfigured,
};
