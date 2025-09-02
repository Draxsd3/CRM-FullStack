import { useState, useCallback } from 'react';
import api from '../services/api';

const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar dados
  const fetchData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(endpoint, { params });
      setData(response.data.data || response.data);
      
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Função para criar dados
  const createData = useCallback(async (payload) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(endpoint, payload);
      
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Função para atualizar dados
  const updateData = useCallback(async (id, payload) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`${endpoint}/${id}`, payload);
      
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Função para excluir dados
  const deleteData = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.delete(`${endpoint}/${id}`);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao excluir dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    fetchData,
    createData,
    updateData,
    deleteData
  };
};

export default useApi;

