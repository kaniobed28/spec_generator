import {
  componentSpecificationApi,
  generateComponentRequirements,
  generateComponentDesign,
  generateComponentTasks
} from './api';

// Mock Firebase service functions
jest.mock('./firebaseService', () => ({
  createComponentSpecification: jest.fn(),
  getComponentSpecification: jest.fn(),
  getComponentSpecificationsByProjectId: jest.fn(),
  updateComponentSpecification: jest.fn(),
  deleteComponentSpecification: jest.fn(),
  getAllComponentSpecifications: jest.fn()
}));

// Mock Google Generative AI
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn(() => ({
  generateContent: mockGenerateContent
}));

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel
  }))
}));

const {
  createComponentSpecification,
  getComponentSpecification,
  getComponentSpecificationsByProjectId,
  updateComponentSpecification,
  deleteComponentSpecification,
  getAllComponentSpecifications
} = require('./firebaseService');

describe('api', () => {
  const mockSpecData = {
    componentName: 'Test Component',
    projectId: 'project-123',
    requirements: { content: 'Test requirements' },
    design: { content: 'Test design' },
    tasks: { content: 'Test tasks' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('componentSpecificationApi', () => {
    test('createComponentSpecification should call firebase service', async () => {
      createComponentSpecification.mockResolvedValue({ id: 'spec-123', ...mockSpecData });
      
      const result = await componentSpecificationApi.createComponentSpecification(mockSpecData);
      
      expect(createComponentSpecification).toHaveBeenCalledWith(mockSpecData);
      expect(result).toEqual({ id: 'spec-123', ...mockSpecData });
    });

    test('getComponentSpecification should call firebase service', async () => {
      getComponentSpecification.mockResolvedValue({ id: 'spec-123', ...mockSpecData });
      
      const result = await componentSpecificationApi.getComponentSpecification('spec-123');
      
      expect(getComponentSpecification).toHaveBeenCalledWith('spec-123');
      expect(result).toEqual({ id: 'spec-123', ...mockSpecData });
    });

    test('getComponentSpecificationsByProject should call firebase service', async () => {
      getComponentSpecificationsByProjectId.mockResolvedValue([{ id: 'spec-123', ...mockSpecData }]);
      
      const result = await componentSpecificationApi.getComponentSpecificationsByProject('project-123');
      
      expect(getComponentSpecificationsByProjectId).toHaveBeenCalledWith('project-123');
      expect(result).toEqual([{ id: 'spec-123', ...mockSpecData }]);
    });

    test('updateComponentSpecification should call firebase service', async () => {
      const updateData = { componentName: 'Updated Component' };
      updateComponentSpecification.mockResolvedValue({ id: 'spec-123', ...mockSpecData, ...updateData });
      
      const result = await componentSpecificationApi.updateComponentSpecification('spec-123', updateData);
      
      expect(updateComponentSpecification).toHaveBeenCalledWith('spec-123', updateData);
      expect(result).toEqual({ id: 'spec-123', ...mockSpecData, ...updateData });
    });

    test('deleteComponentSpecification should call firebase service', async () => {
      deleteComponentSpecification.mockResolvedValue({ message: 'Component specification deleted successfully' });
      
      const result = await componentSpecificationApi.deleteComponentSpecification('spec-123');
      
      expect(deleteComponentSpecification).toHaveBeenCalledWith('spec-123');
      expect(result).toEqual({ message: 'Component specification deleted successfully' });
    });

    test('getAllComponentSpecifications should call firebase service', async () => {
      getAllComponentSpecifications.mockResolvedValue([{ id: 'spec-123', ...mockSpecData }]);
      
      const result = await componentSpecificationApi.getAllComponentSpecifications();
      
      expect(getAllComponentSpecifications).toHaveBeenCalled();
      expect(result).toEqual([{ id: 'spec-123', ...mockSpecData }]);
    });
  });

  describe('AI Generation Functions', () => {
    const mockResponse = {
      response: {
        text: () => 'Generated content'
      }
    };

    beforeEach(() => {
      mockGenerateContent.mockResolvedValue(mockResponse);
    });

    test('generateComponentRequirements should generate requirements', async () => {
      const result = await generateComponentRequirements('Test Component', 'A test component');
      
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toBe('Generated content');
    });

    test('generateComponentRequirements should return error message when generation fails', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Generation failed'));
      
      const result = await generateComponentRequirements('Test Component', 'A test component');
      
      expect(result).toContain('Error generating requirements: Generation failed');
    });

    test('generateComponentDesign should generate design', async () => {
      const result = await generateComponentDesign('Test Component', 'A test component', 'Requirements content');
      
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toBe('Generated content');
    });

    test('generateComponentDesign should return error message when generation fails', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Generation failed'));
      
      const result = await generateComponentDesign('Test Component', 'A test component', 'Requirements content');
      
      expect(result).toContain('Error generating design: Generation failed');
    });

    test('generateComponentTasks should generate tasks', async () => {
      const result = await generateComponentTasks('Test Component', 'A test component', 'Design content');
      
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toBe('Generated content');
    });

    test('generateComponentTasks should return error message when generation fails', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Generation failed'));
      
      const result = await generateComponentTasks('Test Component', 'A test component', 'Design content');
      
      expect(result).toContain('Error generating tasks: Generation failed');
    });
  });
});