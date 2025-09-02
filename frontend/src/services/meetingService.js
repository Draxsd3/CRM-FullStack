import api from './api';
import { toast } from 'react-toastify';

const meetingService = {
  // Obter todas as reuniões
  getAllMeetings: async () => {
    const response = await api.get('/meetings');
    return response.data.data;
  },
  
  // Obter reunião por ID
  getMeetingById: async (id) => {
    const response = await api.get(`/meetings/${id}`);
    return response.data.data;
  },
  
  // Criar reunião
  createMeeting: async (meetingData) => {
    const response = await api.post('/meetings', meetingData);
    return response.data.data;
  },
  
  // Atualizar reunião
  updateMeeting: async (id, meetingData) => {
    try {
      // Log the update attempt with the ID
      console.log('Updating meeting with ID:', id, 'and data:', meetingData);
      
      // Ensure numeric ID
      const numericId = Number(id);
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error('ID de reunião inválido');
      }
      
      const response = await api.put(`/meetings/${numericId}`, meetingData);
      console.log('Meeting update successful:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Update Meeting Error:', error.response?.data || error);
      
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar reunião';
      
      // More specific error handling
      if (error.response?.status === 403) {
        toast.error('Você não tem permissão para editar esta reunião');
      } else if (error.response?.status === 404) {
        toast.error('Reunião não encontrada');
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  },
  
  // Excluir reunião - fixed to handle ID validation
  deleteMeeting: async (id) => {
    try {
      // Log the ID being sent to the server
      console.log('Sending delete request for meeting ID:', id);
      
      // Validate ID is a number before sending to API
      const numericId = Number(id);
      
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error('ID de reunião inválido');
      }
      
      // FIXED: Ensure we're sending a clean numeric ID in the URL
      const response = await api.delete(`/meetings/${numericId}`);
      console.log('Meeting delete successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete Meeting Error:', error.response?.data || error);
      
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao excluir reunião';
      
      // More specific error handling
      if (error.response?.status === 403) {
        toast.error('Você não tem permissão para excluir esta reunião');
      } else if (error.response?.status === 404) {
        toast.error('Reunião não encontrada');
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  },
  
  // Obter reuniões por intervalo de datas
  getMeetingsByDateRange: async (startDate, endDate) => {
    const response = await api.get(`/meetings/range?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },
  
  // Obter reuniões de uma empresa específica
  getCompanyMeetings: async (companyId) => {
    const response = await api.get(`/meetings/company/${companyId}`);
    return response.data.data;
  },
};

export default meetingService;