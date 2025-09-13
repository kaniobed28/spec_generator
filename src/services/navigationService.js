import { projectApi, specificationApi } from './api';

// Navigation service to handle API calls for navigation components
export const navigationService = {
  // Fetch all projects for navigation
  fetchProjects: async () => {
    try {
      const projects = await projectApi.getAllProjects();
      return projects;
    } catch (error) {
      console.error('Error fetching projects for navigation:', error);
      throw error;
    }
  },

  // Fetch project by ID for navigation
  fetchProject: async (id) => {
    try {
      const project = await projectApi.getProject(id);
      return project;
    } catch (error) {
      console.error(`Error fetching project ${id} for navigation:', error);
      throw error;
    }
  },

  // Fetch component specifications by project ID for navigation
  fetchComponentSpecifications: async (projectId) => {
    try {
      const specifications = await specificationApi.componentSpecificationApi.getComponentSpecificationsByProject(projectId);
      return specifications;
    } catch (error) {
      console.error(`Error fetching component specifications for project ${projectId} for navigation:', error);
      throw error;
    }
  },

  // Fetch component specification by ID for navigation
  fetchComponentSpecification: async (id) => {
    try {
      const specification = await specificationApi.componentSpecificationApi.getComponentSpecification(id);
      return specification;
    } catch (error) {
      console.error(`Error fetching component specification ${id} for navigation:', error);
      throw error;
    }
  }
};

export default navigationService;