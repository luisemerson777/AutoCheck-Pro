import { useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

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

      const { data, error: err } = await supabase
        .from('inspecoes')
        .insert([inspection])
        .select();

      if (err) {
        throw new Error(err.message);
      }

      console.log('✅ Inspeção criada com sucesso:', data?.[0]);
      return data?.[0] || null;
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

      const { data, error: err } = await supabase
        .from('inspecoes')
        .upsert([inspection], { onConflict: 'id' })
        .select();

      if (err) {
        throw new Error(err.message);
      }

      console.log('✅ Inspeção salva com sucesso:', data?.[0]);
      return data?.[0] || null;
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

      const { error: err } = await supabase
        .from('inspecoes')
        .delete()
        .eq('id', id);

      if (err) {
        throw new Error(err.message);
      }

      console.log('✅ Inspeção deletada com sucesso');
      return true;
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
