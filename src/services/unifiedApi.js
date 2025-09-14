import { 
  projectApi, 
  specificationApi, 
  componentSpecificationApi,
  generateComponentRequirements,
  generateComponentDesign,
  generateComponentTasks
} from './api';
import { 
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getAllProjects,
  createSpecification,
  getSpecification,
  getSpecificationByProjectId,
  updateSpecification,
  deleteSpecification,
  createComponentSpecification,
  getComponentSpecification,
  getComponentSpecificationsByProjectId,
  updateComponentSpecification,
  deleteComponentSpecification,
  getAllComponentSpecifications
} from './firebaseService';

// Request interceptor for adding authentication headers and logging
const requestInterceptor = (config) => {
  // In a real implementation, you would add authentication tokens here
  // For now, we'll just log the request
  console.log('Making API request:', config);
  
  // Add timestamp to request
  return {
    ...config,
    timestamp: new Date().toISOString()
  };
};

// Response interceptor for handling responses and data transformation
const responseInterceptor = (response) => {
  // Log successful responses
  console.log('API response received:', response);
  
  // Transform response data if needed
  // For example, ensure all objects have proper timestamps
  if (response && typeof response === 'object') {
    if (Array.isArray(response)) {
      // Process array responses
      return response.map(item => normalizeData(item));
    } else {
      // Process single object responses
      return normalizeData(response);
    }
  }
  
  return response;
};

// Normalize data to ensure consistent structure
const normalizeData = (data) => {
  console.log('normalizeData: Input data:', data);
  console.log('normalizeData: Input data ID:', data?.id);
  
  if (!data || typeof data !== 'object') {
    console.log('normalizeData: Returning data as-is (not object)');
    return data;
  }
  
  // Create a copy to avoid mutating the original
  const normalizedData = { ...data };
  
  // Ensure createdAt and updatedAt fields are properly formatted
  if (normalizedData.createdAt && typeof normalizedData.createdAt === 'string') {
    try {
      normalizedData.createdAt = new Date(normalizedData.createdAt);
    } catch (e) {
      // If parsing fails, leave as is
    }
  }
  
  if (normalizedData.updatedAt && typeof normalizedData.updatedAt === 'string') {
    try {
      normalizedData.updatedAt = new Date(normalizedData.updatedAt);
    } catch (e) {
      // If parsing fails, leave as is
    }
  }
  
  console.log('normalizeData: Output data:', normalizedData);
  console.log('normalizeData: Output data ID:', normalizedData?.id);
  
  return normalizedData;
};

// Error interceptor for handling API errors with better user feedback
const errorInterceptor = (error) => {
  console.error('API error occurred:', error);
  
  // Create a user-friendly error message
  let userMessage = 'An unexpected error occurred';
  
  // Handle different types of errors
  if (error && error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        userMessage = 'Invalid request data';
        break;
      case 401:
        // Unauthorized - redirect to login
        userMessage = 'Please log in to continue';
        console.warn('Unauthorized access - redirecting to login');
        break;
      case 403:
        // Forbidden
        userMessage = 'Access forbidden';
        console.warn('Access forbidden');
        break;
      case 404:
        // Not found
        userMessage = 'Requested resource not found';
        console.warn('Resource not found');
        break;
      case 429:
        // Rate limited
        userMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        // Server error
        userMessage = 'Server error. Please try again later.';
        console.error('Internal server error');
        break;
      case 502:
      case 503:
      case 504:
        // Service unavailable
        userMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        userMessage = `Unexpected error (${error.response.status}). Please try again.`;
        console.error(`Unexpected error: ${error.response.status}`);
    }
    
    // If the server provided an error message, use it
    if (error.response.data && error.response.data.message) {
      userMessage = error.response.data.message;
    }
  } else if (error.request) {
    // Request was made but no response received
    userMessage = 'Network error. Please check your connection and try again.';
    console.error('No response received from server');
  } else {
    // Something else happened
    userMessage = 'Error setting up request. Please try again.';
    console.error('Error setting up request:', error.message);
  }
  
  // Return error with user-friendly message
  const enhancedError = new Error(userMessage);
  enhancedError.originalError = error;
  enhancedError.userMessage = userMessage;
  
  return Promise.reject(enhancedError);
};

// Unified API service
export const unifiedApi = {
  // Project operations
  project: {
    create: async (data) => {
      try {
        const config = requestInterceptor({ method: 'CREATE', resource: 'project', data });
        const result = await createProject(data);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    get: async (id) => {
      try {
        const config = requestInterceptor({ method: 'GET', resource: 'project', id });
        const result = await getProject(id);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    update: async (id, data) => {
      try {
        const config = requestInterceptor({ method: 'UPDATE', resource: 'project', id, data });
        const result = await updateProject(id, data);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    delete: async (id) => {
      try {
        const config = requestInterceptor({ method: 'DELETE', resource: 'project', id });
        const result = await deleteProject(id);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    list: async () => {
      try {
        const config = requestInterceptor({ method: 'LIST', resource: 'projects' });
        const result = await getAllProjects();
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    }
  },
  
  // Specification operations
  specification: {
    generate: async (projectData) => {
      try {
        const config = requestInterceptor({ method: 'GENERATE', resource: 'specification', data: projectData });
        const result = await specificationApi.generateSpecifications(projectData);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    get: async (id) => {
      try {
        const config = requestInterceptor({ method: 'GET', resource: 'specification', id });
        const result = await getSpecification(id);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    getByProjectId: async (projectId) => {
      try {
        const config = requestInterceptor({ method: 'GET_BY_PROJECT', resource: 'specification', projectId });
        const result = await getSpecificationByProjectId(projectId);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    update: async (id, data) => {
      try {
        const config = requestInterceptor({ method: 'UPDATE', resource: 'specification', id, data });
        const result = await updateSpecification(id, data);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    delete: async (id) => {
      try {
        const config = requestInterceptor({ method: 'DELETE', resource: 'specification', id });
        const result = await deleteSpecification(id);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    }
  },
  
  // Component specification operations
  component: {
    create: async (data) => {
      try {
        if (!data) {
          throw new Error('No data provided for component creation');
        }
        
        console.log('unifiedApi.component.create: Input data:', data);
        
        const result = await createComponentSpecification(data);
        
        if (!result) {
          throw new Error('No result returned from Firebase service');
        }
        
        // Enhanced ID validation with multiple fallback methods
        let extractedId = null;
        
        // Check direct ID property
        if (result.id) {
          extractedId = result.id;
        }
        // Check alternative ID properties
        else if (result._id) {
          extractedId = result._id;
        }
        else if (result.specId) {
          extractedId = result.specId;
        }
        // Check if result is a Firebase document snapshot
        else if (result.ref && result.ref.id) {
          extractedId = result.ref.id;
        }
        // Check if result has a data property with ID
        else if (result.data && typeof result.data === 'function') {
          const dataResult = result.data();
          if (dataResult && dataResult.id) {
            extractedId = dataResult.id;
          }
        }
        
        if (!extractedId) {
          throw new Error('No ID found in result from Firebase service');
        }
        
        // Ensure the result object has the ID property
        const resultWithId = {
          ...result,
          id: extractedId
        };
        
        console.log('unifiedApi.component.create: Returning result with ID:', resultWithId.id);
        return resultWithId;
      } catch (error) {
        console.error('Error creating component specification:', error);
        throw error;
      }
    },
    
    get: async (id) => {
      try {
        const result = await getComponentSpecification(id);
        return result;
      } catch (error) {
        console.error('Error fetching component specification:', error);
        throw error;
      }
    },
    
    listByProject: async (projectId) => {
      try {
        const config = requestInterceptor({ method: 'LIST_BY_PROJECT', resource: 'components', projectId });
        const result = await getComponentSpecificationsByProjectId(projectId);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    update: async (id, data) => {
      try {
        const config = requestInterceptor({ method: 'UPDATE', resource: 'component', id, data });
        const result = await updateComponentSpecification(id, data);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    delete: async (id) => {
      try {
        const config = requestInterceptor({ method: 'DELETE', resource: 'component', id });
        const result = await deleteComponentSpecification(id);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    listAll: async () => {
      try {
        const config = requestInterceptor({ method: 'LIST', resource: 'components' });
        const result = await getAllComponentSpecifications();
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    }
  },
  
  // AI Generation services
  ai: {
    generateComponentRequirements: async (componentName, componentDescription, projectSpecification = null) => {
      try {
        const config = requestInterceptor({ 
          method: 'GENERATE_REQUIREMENTS', 
          resource: 'ai', 
          data: { componentName, componentDescription, projectSpecification } 
        });
        const result = await generateComponentRequirements(componentName, componentDescription, projectSpecification);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    generateComponentDesign: async (componentName, componentDescription, requirements, projectSpecification = null) => {
      try {
        const config = requestInterceptor({ 
          method: 'GENERATE_DESIGN', 
          resource: 'ai', 
          data: { componentName, componentDescription, requirements, projectSpecification } 
        });
        const result = await generateComponentDesign(componentName, componentDescription, requirements, projectSpecification);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    },
    
    generateComponentTasks: async (componentName, componentDescription, design, projectSpecification = null) => {
      try {
        const config = requestInterceptor({ 
          method: 'GENERATE_TASKS', 
          resource: 'ai', 
          data: { componentName, componentDescription, design, projectSpecification } 
        });
        const result = await generateComponentTasks(componentName, componentDescription, design, projectSpecification);
        return responseInterceptor(result);
      } catch (error) {
        throw errorInterceptor(error);
      }
    }
  }
};

export default unifiedApi;