/**
 * Configuração de API - Usa Neon PostgreSQL via REST API
 * Este arquivo funciona como um adaptador entre o app e o backend FastAPI
 */

import { API_URL, isNeonConfigured } from "./neonClient";

// ============ OPERAÇÕES DE INSPEÇÕES ============

export const inspectionsAPI = {
  /**
   * Buscar todas as inspeções
   */
  async getAll(filter = null) {
    try {
      if (!isNeonConfigured) {
        throw new Error("API não configurada. Verifique VITE_API_URL.");
      }

      let url = `${API_URL}/inspections`;
      if (filter?.user) {
        url += `?user=${encodeURIComponent(filter.user)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return { data: json.inspections || [], error: null };
    } catch (err) {
      const errorMsg = `Erro ao buscar inspeções: ${err.message}`;
      return { data: [], error: errorMsg };
    }
  },

  /**
   * Buscar uma inspeção por ID
   */
  async getById(id) {
    try {
      if (!isNeonConfigured) {
        throw new Error("API não configurada. Verifique VITE_API_URL.");
      }

      const response = await fetch(`${API_URL}/inspections/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { data: null, error: "Inspeção não encontrada" };
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      const errorMsg = `Erro ao buscar inspeção: ${err.message}`;
      return { data: null, error: errorMsg };
    }
  },

  /**
   * Criar nova inspeção
   */
  async create(inspection) {
    try {
      if (!isNeonConfigured) {
        throw new Error("API não configurada. Verifique VITE_API_URL.");
      }

      const inspectionData = {
        ...inspection,
        id: inspection.id || undefined,
        date: inspection.date || new Date().toISOString(),
      };

      const response = await fetch(`${API_URL}/inspections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inspectionData),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return { data: json.inspection, error: null };
    } catch (err) {
      const errorMsg = `Erro ao criar inspeção: ${err.message}`;
      return { data: null, error: errorMsg };
    }
  },

  /**
   * Atualizar inspeção (upsert)
   */
  async upsert(inspection) {
    try {
      if (!isNeonConfigured) {
        throw new Error("API não configurada. Verifique VITE_API_URL.");
      }

      const inspectionData = {
        ...inspection,
        id: inspection.id || Date.now(),
        date: inspection.date || new Date().toISOString(),
      };

      const response = await fetch(
        `${API_URL}/inspections/${inspectionData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inspectionData),
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return { data: json.inspection, error: null };
    } catch (err) {
      const errorMsg = `Erro ao salvar inspeção: ${err.message}`;
      return { data: null, error: errorMsg };
    }
  },

  /**
   * Deletar inspeção
   */
  async delete(id) {
    try {
      if (!isNeonConfigured) {
        throw new Error("API não configurada. Verifique VITE_API_URL.");
      }

      const response = await fetch(`${API_URL}/inspections/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { error: "Inspeção não encontrada" };
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      return { error: null };
    } catch (err) {
      const errorMsg = `Erro ao deletar inspeção: ${err.message}`;
      return { error: errorMsg };
    }
  },
};

// ============ OPERAÇÕES DE AUTENTICAÇÃO ============

export const authAPI = {
  /**
   * Login
   */
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.detail || "Falha ao autenticar");
      }

      const json = await response.json();
      return { data: json.data || json, error: null };
    } catch (err) {
      const errorMsg = `Erro de autenticação: ${err.message}`;
      return { data: null, error: errorMsg };
    }
  },
};

// ============ STATUS ============

export const getApiStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const health = await response.json();

    return {
      neon: health.database === "connected" ? "conectado" : "desconectado",
      api: "disponível",
      mode: isNeonConfigured ? "produção" : "desenvolvimento",
    };
  } catch (err) {
    return {
      neon: "desconectado",
      api: "indisponível",
      error: err.message,
    };
  }
};

export default {
  inspectionsAPI,
  authAPI,
  getApiStatus,
  isNeonConfigured,
};
