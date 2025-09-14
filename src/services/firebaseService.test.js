import {
  createComponentSpecification,
  getComponentSpecification,
  getComponentSpecificationsByProjectId,
  updateComponentSpecification,
  deleteComponentSpecification,
  getAllComponentSpecifications
} from './firebaseService';

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn()
}));

// Mock the Firebase db import
jest.mock('../firebase', () => ({
  db: {}
}));

describe('firebaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComponentSpecification', () => {
    test('should create a component specification with project specification reference', async () => {
      // Mock implementation
      const mockDocRef = { id: 'test-id' };
      const mockCollection = {};
      
      require('firebase/firestore').doc.mockReturnValue(mockDocRef);
      require('firebase/firestore').collection.mockReturnValue(mockCollection);
      require('firebase/firestore').setDoc.mockResolvedValue();
      
      const specData = {
        componentName: 'Test Component',
        projectId: 'project-123',
        projectSpecificationId: 'spec-456', // New field
        componentDescription: 'A test component',
        requirements: {
          content: 'Test requirements',
          format: 'ears'
        },
        design: {
          content: 'Test design',
          architecture: 'Test architecture',
          diagrams: []
        },
        tasks: {
          content: 'Test tasks',
          breakdown: []
        }
      };
      
      const result = await createComponentSpecification(specData);
      
      expect(result).toHaveProperty('id', 'test-id');
      expect(result).toHaveProperty('componentName', 'Test Component');
      expect(result).toHaveProperty('projectId', 'project-123');
      expect(result).toHaveProperty('projectSpecificationId', 'spec-456'); // New field
      expect(result).toHaveProperty('componentDescription', 'A test component');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('updateComponentSpecification', () => {
    test('should update a component specification with project specification reference', async () => {
      // Mock implementation
      const mockDocRef = {};
      require('firebase/firestore').doc.mockReturnValue(mockDocRef);
      require('firebase/firestore').updateDoc.mockResolvedValue();
      
      const updateData = {
        componentName: 'Updated Component',
        projectSpecificationId: 'spec-789', // New field
        componentDescription: 'An updated component'
      };
      
      const result = await updateComponentSpecification('test-id', updateData);
      
      expect(result).toHaveProperty('id', 'test-id');
      expect(result).toHaveProperty('componentName', 'Updated Component');
      expect(result).toHaveProperty('projectSpecificationId', 'spec-789'); // New field
      expect(result).toHaveProperty('componentDescription', 'An updated component');
      expect(result).toHaveProperty('updatedAt');
    });
  });
});