import api from './api';

// Add a function to refresh the pipeline
const refreshPipeline = () => {
  window.dispatchEvent(new CustomEvent('refreshPipeline'));
};

const companyService = {
  // Obter todas as empresas
  getAllCompanies: async () => {
    try {
      const response = await api.get('/companies');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  },
  
  // Obter empresa por ID
  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data.data;
  },
  
  // Criar empresa - FIXING ISSUE WITH LEAD DISPLAY
  createCompany: async (companyData) => {
    /** @tweakable Company creation configuration */
    const CREATION_CONFIG = {
      /** Number of retries for failed creation attempts */
      MAX_RETRIES: 3,
      /** Delay between retries (ms) */
      RETRY_DELAY: 1000,
      /** Automatically set pipeline status to 'Lead' */
      DEFAULT_PIPELINE_STATUS: 'Lead',
      /** Default owner type for new companies */
      DEFAULT_OWNER_TYPE: 'SDR',
      /** Log creation events */
      ENABLE_LOGGING: true
    };

    // Ensure CNPJ is clean
    if (companyData.cnpj) {
      companyData.cnpj = companyData.cnpj.replace(/\D/g, '');
    }
    
    // *** CRITICAL FIX: Always explicitly set pipeline status to Lead for all new companies ***
    companyData.pipelineStatus = 'Lead';
    companyData.ownerType = CREATION_CONFIG.DEFAULT_OWNER_TYPE;

    console.log('📝 Company data before sending to API:', companyData);

    // Create retry function
    const attemptCreation = async (retryCount = 0) => {
      try {
        if (CREATION_CONFIG.ENABLE_LOGGING) {
          console.log('Creating company with data:', {
            ...companyData,
            pipelineStatus: companyData.pipelineStatus // Log to verify status
          });
        }

        const response = await api.post('/companies', companyData);
        
        if (CREATION_CONFIG.ENABLE_LOGGING) {
          console.log('Company created successfully:', response.data);
        }
        
        // Dispatch event to refresh the pipeline
        refreshPipeline();
        
        return response.data.data;
      } catch (error) {
        console.error('Company creation error:', error.response?.data || error.message);

        if (retryCount < CREATION_CONFIG.MAX_RETRIES) {
          const delay = CREATION_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
          console.log(`Retrying company creation in ${delay}ms (attempt ${retryCount + 1})`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptCreation(retryCount + 1);
        }

        throw error;
      }
    };

    return attemptCreation();
  },
  
  // Atualizar empresa
  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data.data;
  },
  
  // Excluir empresa
  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },
  
  // Buscar empresas
  searchCompanies: async (searchTerm) => {
    const response = await api.get(`/companies/search?term=${searchTerm}`);
    return response.data.data;
  },
  
  // Obter todas as empresas do sistema (para administradores)
  getAllCompaniesInSystem: async () => {
    try {
      /* @tweakable flag to enable detailed error logging */
      const ENABLE_DEBUG_LOGGING = process.env.NODE_ENV === 'development';
      
      const response = await api.get('/companies/all');
      
      if (ENABLE_DEBUG_LOGGING) {
        console.log('All companies response:', response);
      }
      
      // Make sure we always return an array
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching all companies:', error);
      return [];
    }
  },
};

export default companyService;