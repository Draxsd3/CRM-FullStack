import axios from 'axios';
import { toast } from 'react-toastify';

// Always use local backend for development
const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    const hasToken = !!localStorage.getItem('token');
    
    // Log the error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: response?.status,
      data: response?.data
    });
    
    if (response && response.data) {
      if (response.status === 401 && !hasToken) {
        return Promise.reject(error);
      }
      // Don't show toast for 404 errors on company details - let component handle it
      if (!(response.status === 404 && error.config?.url?.includes('/companies/'))) {
        toast.error(response.data.error || 'Ocorreu um erro na requisição');
      }
    } else if (!response) {
      toast.error('Não foi possível conectar ao servidor');
    }
    return Promise.reject(error);
  }
);

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;