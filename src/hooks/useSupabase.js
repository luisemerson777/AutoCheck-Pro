import { useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

const API_LOCAL = 'http://localhost:3001/api';

/**
 * Hook customizado para operações com Supabase
 * Facilita o tratamento de erros e estado de loading
 */
export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInspections = useCallback(async (filter = null) => {
    try {
      setIsLoading(true);
      setError(null);

      if (supabase) {
        let query = supabase
          .from('inspecoes')
          .select('*')
          .order('created_at', { ascending: false });

        if (filter?.user) {
          query = query.eq('user', filter.user);
        }

        const { data, error: err } = await query;

        if (err) {
          throw new Error(err.message);
        }

        return data || [];
      } else {
        // fallback para API local quando Supabase não estiver configurado
        const q = filter?.user ? `?user=${encodeURIComponent(filter.user)}` : '';
        const res = await fetch(`${API_LOCAL}/inspections${q}`);
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      const errorMsg = `❌ Erro ao buscar inspeções: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInspection = useCallback(async (inspection) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!inspection.id) {
        inspection.id = Date.now();
      }
      if (!inspection.date) {
        inspection.date = new Date().toISOString();
      }

      if (supabase) {
        const { data, error: err } = await supabase
          .from('inspecoes')
          .insert([inspection])
          .select();

        if (err) {
          throw new Error(err.message);
        }

        console.log('✅ Inspeção criada com sucesso:', data?.[0]);
        return data?.[0] || null;
      } else {
        const res = await fetch(`${API_LOCAL}/inspections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inspection),
        });
        const json = await res.json();
        return json.data || null;
      }
    } catch (err) {
      const errorMsg = `❌ Erro ao criar inspeção: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateInspection = useCallback(async (id, updates) => {
    try {
      setIsLoading(true);
      setError(null);

      if (supabase) {
        const { data, error: err } = await supabase
          .from('inspecoes')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select();

        if (err) {
          throw new Error(err.message);
        }

        console.log('✅ Inspeção atualizada com sucesso:', data?.[0]);
        return data?.[0] || null;
      } else {
        const res = await fetch(`${API_LOCAL}/inspections/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
        });
        const json = await res.json();
        return json.data || null;
      }
    } catch (err) {
      const errorMsg = `❌ Erro ao atualizar inspeção: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const upsertInspection = useCallback(async (inspection) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!inspection.id) {
        inspection.id = Date.now();
      }
      if (!inspection.date) {
        inspection.date = new Date().toISOString();
      }

      if (supabase) {
        const { data, error: err } = await supabase
          .from('inspecoes')
          .upsert([inspection], { onConflict: 'id' })
          .select();

        if (err) {
          throw new Error(err.message);
        }

        console.log('✅ Inspeção salva com sucesso:', data?.[0]);
        return data?.[0] || null;
      } else {
        const res = await fetch(`${API_LOCAL}/inspections/${inspection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inspection),
        });
        const json = await res.json();
        return json.data || null;
      }
    } catch (err) {
      const errorMsg = `❌ Erro ao salvar inspeção: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteInspection = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);

      if (supabase) {
        const { error: err } = await supabase
          .from('inspecoes')
          .delete()
          .eq('id', id);

        if (err) {
          throw new Error(err.message);
        }

        console.log('✅ Inspeção deletada com sucesso');
        return true;
      } else {
        const res = await fetch(`${API_LOCAL}/inspections/${id}`, {
          method: 'DELETE',
        });
        const json = await res.json();
        return res.ok && json.error === null;
      }
    } catch (err) {
      const errorMsg = `❌ Erro ao deletar inspeção: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    clearError,
    fetchInspections,
    createInspection,
    updateInspection,
    upsertInspection,
    deleteInspection,
  };
};

export default useSupabase;
