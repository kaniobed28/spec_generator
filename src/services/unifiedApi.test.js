import { unifiedApi } from './unifiedApi';
import * as api from './api';
import * as firebaseService from './firebaseService';

// Mock all Firebase service functions
jest.mock('./firebaseService', () => ({
  // Project functions
  createProject: jest.fn(),
  getProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
  getAllProjects: jest.fn(),
  
  // Specification functions
  createSpecification: jest.fn(),
  getSpecification: jest.fn(),
  getSpecificationByProjectId: jest.fn(),
  updateSpecification: jest.fn(),
  deleteSpecification: jest.fn(),
  
  // Component specification functions
  createComponentSpecification: jest.fn(),
  getComponentSpecification: jest.fn(),
  getComponentSpecificationsByProjectId: jest.fn(),
  updateComponentSpecification: jest.fn(),
  deleteComponentSpecification: jest.fn(),
  getAllComponentSpecifications: jest.fn()
}));

// Mock AI generation functions
jest.mock('./api', () => ({
  // Project API functions
  createProject: jest.fn(),
  getProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
  getAllProjects: jest.fn(),
  
  // Specification API functions
  createSpecification: jest.fn(),
  getSpecification: jest.fn(),
  getSpecificationByProjectId: jest.fn(),
  updateSpecification: jest.fn(),
  deleteSpecification: jest.fn(),
  
  // Component Specification API functions
  createComponentSpecification: jest.fn(),
  getComponentSpecification: jest.fn(),
  getComponentSpecificationsByProjectId: jest.fn(),
  updateComponentSpecification: jest.fn(),
  deleteComponentSpecification: jest.fn(),
  getAllComponentSpecifications: jest.fn(),
  
  // AI Generation functions
  generateComponentRequirements: jest.fn(),
  generateComponentDesign: jest.fn(),
  generateComponentTasks: jest.fn()
}));

describe('unifiedApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('component operations', () => {
    test('create should call firebase service and return result with ID', async () => {
      const mockData = {
        componentName: 'Test Component',
        projectId: 'project-123',
        componentDescription: 'A test component'
      };
      
      const mockResult = {
        id: 'component-123',
        ...mockData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      firebaseService.createComponentSpecification.mockResolvedValue(mockResult);
      
      const result = await unifiedApi.component.create(mockData);
      
      expect(firebaseService.createComponentSpecification).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockResult);
      expect(result).toHaveProperty('id', 'component-123');
    });
  });

  describe('AI operations with context', () => {
    test('generateComponentRequirements should pass project specification context', async () => {
      const mockProjectSpec = {
        title: 'Test Project',
        sections: {
          planning: { content: 'Project planning content' },
          design: { content: 'Project design content' },
          implementation: { content: 'Project implementation content' }
        }
      };
      
      api.generateComponentRequirements.mockResolvedValue('Generated requirements with context');
      
      const result = await unifiedApi.ai.generateComponentRequirements(
        'Test Component',
        'A test component',
        mockProjectSpec
      );
      
      expect(api.generateComponentRequirements).toHaveBeenCalledWith(
        'Test Component',
        'A test component',
        mockProjectSpec
      );
      expect(result).toBe('Generated requirements with context');
    });

    test('generateComponentDesign should pass project specification context', async () => {
      const mockProjectSpec = {
        sections: {
          design: { content: 'Project design content' }
        }
      };
      
      api.generateComponentDesign.mockResolvedValue('Generated design with context');
      
      const result = await unifiedApi.ai.generateComponentDesign(
        'Test Component',
        'A test component',
        'Requirements content',
        mockProjectSpec
      );
      
      expect(api.generateComponentDesign).toHaveBeenCalledWith(
        'Test Component',
        'A test component',
        'Requirements content',
        mockProjectSpec
      );
      expect(result).toBe('Generated design with context');
    });

    test('generateComponentTasks should pass project specification context', async () => {
      const mockProjectSpec = {
        sections: {
          implementation: { content: 'Project implementation content' }
        }
      };
      
      api.generateComponentTasks.mockResolvedValue('Generated tasks with context');
      
      const result = await unifiedApi.ai.generateComponentTasks(
        'Test Component',
        'A test component',
        'Design content',
        mockProjectSpec
      );
      
      expect(api.generateComponentTasks).toHaveBeenCalledWith(
        'Test Component',
        'A test component',
        'Design content',
        mockProjectSpec
      );
      expect(result).toBe('Generated tasks with context');
    });
  });
});