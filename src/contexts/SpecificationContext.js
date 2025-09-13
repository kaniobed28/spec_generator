import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { 
  projectApi, 
  specificationApi
} from '../services/api';
import { unifiedApi } from '../services/unifiedApi';
import { useLocation, useParams } from 'react-router-dom';

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  specifications: {},
  componentSpecifications: {},
  currentComponentSpecification: null,
  loading: {
    projects: false,
    specifications: false,
    componentSpecifications: false,
    general: false
  },
  error: null,
  navigation: {
    currentPath: '/',
    projectId: null,
    componentSpecId: null
  }
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CREATE_PROJECT: 'CREATE_PROJECT',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  ADD_SPECIFICATION: 'ADD_SPECIFICATION',
  UPDATE_SPECIFICATION: 'UPDATE_SPECIFICATION',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_COMPONENT_SPECIFICATIONS: 'SET_COMPONENT_SPECIFICATIONS',
  ADD_COMPONENT_SPECIFICATION: 'ADD_COMPONENT_SPECIFICATION',
  UPDATE_COMPONENT_SPECIFICATION: 'UPDATE_COMPONENT_SPECIFICATION',
  SET_CURRENT_COMPONENT_SPECIFICATION: 'SET_CURRENT_COMPONENT_SPECIFICATION',
  SET_NAVIGATION: 'SET_NAVIGATION',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const specificationReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ACTIONS.CREATE_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    
    case ACTIONS.SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload
      };
    
    case ACTIONS.ADD_SPECIFICATION:
      return {
        ...state,
        specifications: {
          ...state.specifications,
          [action.payload.projectId]: action.payload
        }
      };
    
    case ACTIONS.UPDATE_SPECIFICATION:
      return {
        ...state,
        specifications: {
          ...state.specifications,
          [action.payload.projectId]: {
            ...state.specifications[action.payload.projectId],
            ...action.payload
          }
        }
      };
    
    case ACTIONS.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload
      };
    
    case ACTIONS.SET_COMPONENT_SPECIFICATIONS:
      return {
        ...state,
        componentSpecifications: {
          ...state.componentSpecifications,
          [action.payload.projectId]: action.payload.specifications
        }
      };
    
    case ACTIONS.ADD_COMPONENT_SPECIFICATION:
      const projectId = action.payload.projectId;
      const existingSpecs = state.componentSpecifications[projectId] || [];
      return {
        ...state,
        componentSpecifications: {
          ...state.componentSpecifications,
          [projectId]: [...existingSpecs, action.payload]
        }
      };
    
    case ACTIONS.UPDATE_COMPONENT_SPECIFICATION:
      const updateProjectId = action.payload.projectId;
      const currentSpecs = state.componentSpecifications[updateProjectId] || [];
      const updatedSpecs = currentSpecs.map(spec => 
        spec.id === action.payload.id ? action.payload : spec
      );
      return {
        ...state,
        componentSpecifications: {
          ...state.componentSpecifications,
          [updateProjectId]: updatedSpecs
        }
      };
    
    case ACTIONS.SET_CURRENT_COMPONENT_SPECIFICATION:
      return {
        ...state,
        currentComponentSpecification: action.payload
      };
    
    case ACTIONS.SET_NAVIGATION:
      return {
        ...state,
        navigation: {
          ...state.navigation,
          ...action.payload
        }
      };
    
    default:
      return state;
  }
};

// Create context
const SpecificationContext = createContext();

// Provider component
export const SpecificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(specificationReducer, initialState);
  const location = useLocation();
  const { id: projectId, componentSpecId } = useParams();

  // Update navigation state when route changes
  useEffect(() => {
    dispatch({
      type: ACTIONS.SET_NAVIGATION,
      payload: {
        currentPath: location.pathname,
        projectId: projectId || null,
        componentSpecId: componentSpecId || null
      }
    });
  }, [location, projectId, componentSpecId]);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  const createProject = (project) => {
    dispatch({ type: ACTIONS.CREATE_PROJECT, payload: project });
  };

  const setCurrentProject = (project) => {
    dispatch({ type: ACTIONS.SET_CURRENT_PROJECT, payload: project });
  };

  const addSpecification = (specification) => {
    dispatch({ type: ACTIONS.ADD_SPECIFICATION, payload: specification });
  };

  const updateSpecification = (specification) => {
    dispatch({ type: ACTIONS.UPDATE_SPECIFICATION, payload: specification });
  };

  const setProjects = (projects) => {
    dispatch({ type: ACTIONS.SET_PROJECTS, payload: projects });
  };

  const setComponentSpecifications = (projectId, specifications) => {
    dispatch({ 
      type: ACTIONS.SET_COMPONENT_SPECIFICATIONS, 
      payload: { projectId, specifications } 
    });
  };

  const addComponentSpecification = (specification) => {
    dispatch({ type: ACTIONS.ADD_COMPONENT_SPECIFICATION, payload: specification });
  };

  const updateComponentSpecification = (specification) => {
    dispatch({ type: ACTIONS.UPDATE_COMPONENT_SPECIFICATION, payload: specification });
  };

  const setCurrentComponentSpecification = (specification) => {
    dispatch({ type: ACTIONS.SET_CURRENT_COMPONENT_SPECIFICATION, payload: specification });
  };

  // API functions with useCallback to prevent infinite loops
  const fetchProjects = useCallback(async () => {
    setLoading({ projects: true });
    try {
      const projects = await projectApi.getAllProjects();
      setProjects(projects);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading({ projects: false });
    }
  }, []);

  const fetchProject = useCallback(async (id) => {
    setLoading({ general: true });
    try {
      const project = await projectApi.getProject(id);
      setCurrentProject(project);
      return project;
    } catch (err) {
      setError('Failed to fetch project');
      console.error('Error fetching project:', err);
      throw err;
    } finally {
      setLoading({ general: false });
    }
  }, []);

  const generateSpecifications = useCallback(async (projectData) => {
    setLoading({ general: true });
    try {
      const response = await specificationApi.generateSpecifications(projectData);
      createProject(response.project);
      addSpecification(response.specification);
      return response;
    } catch (err) {
      setError('Failed to generate specifications');
      console.error('Error generating specifications:', err);
      throw err;
    } finally {
      setLoading({ general: false });
    }
  }, []);

  const fetchComponentSpecifications = useCallback(async (projectId) => {
    setLoading({ componentSpecifications: true });
    try {
      const specifications = await unifiedApi.component.listByProject(projectId);
      setComponentSpecifications(projectId, specifications);
      return specifications;
    } catch (err) {
      setError('Failed to fetch component specifications');
      console.error('Error fetching component specifications:', err);
      throw err;
    } finally {
      setLoading({ componentSpecifications: false });
    }
  }, []);

  const fetchComponentSpecification = useCallback(async (id) => {
    setLoading({ general: true });
    try {
      const specification = await unifiedApi.component.get(id);
      setCurrentComponentSpecification(specification);
      return specification;
    } catch (err) {
      setError('Failed to fetch component specification');
      console.error('Error fetching component specification:', err);
      throw err;
    } finally {
      setLoading({ general: false });
    }
  }, []);

  const createComponentSpecification = useCallback(async (specData) => {
    setLoading({ general: true });
    try {
      console.log('SpecificationContext.createComponentSpecification: Input data:', specData);
      const specification = await unifiedApi.component.create(specData);
      console.log('SpecificationContext.createComponentSpecification: Received specification:', specification);
      console.log('SpecificationContext.createComponentSpecification: Specification ID:', specification?.id);
      
      addComponentSpecification(specification);
      
      console.log('SpecificationContext.createComponentSpecification: Returning specification:', specification);
      return specification;
    } catch (err) {
      setError('Failed to create component specification');
      console.error('SpecificationContext.createComponentSpecification: Error:', err);
      throw err;
    } finally {
      setLoading({ general: false });
    }
  }, []);

  // Navigation functions
  const navigateToProject = useCallback((project) => {
    setCurrentProject(project);
  }, []);

  return (
    <SpecificationContext.Provider
      value={{
        ...state,
        setLoading,
        setError,
        clearError,
        createProject,
        setCurrentProject,
        addSpecification,
        updateSpecification,
        setProjects,
        setComponentSpecifications,
        addComponentSpecification,
        updateComponentSpecification,
        setCurrentComponentSpecification,
        fetchProjects,
        fetchProject,
        generateSpecifications,
        fetchComponentSpecifications,
        fetchComponentSpecification,
        createComponentSpecification,
        navigateToProject
      }}
    >
      {children}
    </SpecificationContext.Provider>
  );
};

// Custom hook to use the context
export const useSpecification = () => {
  const context = useContext(SpecificationContext);
  if (!context) {
    throw new Error('useSpecification must be used within a SpecificationProvider');
  }
  return context;
};