import {
  createComponentSpecification,
  getComponentSpecification,
  getComponentSpecificationsByProjectId,
  updateComponentSpecification,
  deleteComponentSpecification,
  getAllComponentSpecifications
} from './firebaseService';

// Mock Firebase functions
const mockDoc = jest.fn();
const mockCollection = jest.fn();
const mockSetDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockQuery = jest.fn();
const mockOrderBy = jest.fn();
const mockWhere = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc: (...args) => mockDoc(...args),
  collection: (...args) => mockCollection(...args),
  setDoc: (...args) => mockSetDoc(...args),
  getDoc: (...args) => mockGetDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  query: (...args) => mockQuery(...args),
  orderBy: (...args) => mockOrderBy(...args),
  where: (...args) => mockWhere(...args)
}));

// Mock Firebase app
jest.mock('../firebase', () => ({
  db: {}
}));

describe('firebaseService', () => {
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

  describe('createComponentSpecification', () => {
    test('should create a new component specification', async () => {
      const mockDocRef = { id: 'spec-123' };
      mockDoc.mockReturnValue(mockDocRef);
      mockSetDoc.mockResolvedValue(undefined);
      
      const result = await createComponentSpecification(mockSpecData);
      
      expect(mockDoc).toHaveBeenCalled();
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        id: 'spec-123',
        ...mockSpecData,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
      expect(result).toEqual({
        id: 'spec-123',
        ...mockSpecData,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    test('should throw error when creation fails', async () => {
      const mockDocRef = { id: 'spec-123' };
      mockDoc.mockReturnValue(mockDocRef);
      mockSetDoc.mockRejectedValue(new Error('Creation failed'));
      
      await expect(createComponentSpecification(mockSpecData)).rejects.toThrow('Error creating component specification: Creation failed');
    });
  });

  describe('getComponentSpecification', () => {
    test('should return component specification when it exists', async () => {
      const mockDocSnapshot = {
        exists: () => true,
        id: 'spec-123',
        data: () => mockSpecData
      };
      mockGetDoc.mockResolvedValue(mockDocSnapshot);
      
      const result = await getComponentSpecification('spec-123');
      
      expect(mockGetDoc).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'spec-123',
        ...mockSpecData
      });
    });

    test('should return null when component specification does not exist', async () => {
      const mockDocSnapshot = {
        exists: () => false
      };
      mockGetDoc.mockResolvedValue(mockDocSnapshot);
      
      const result = await getComponentSpecification('spec-123');
      
      expect(result).toBeNull();
    });

    test('should throw error when fetching fails', async () => {
      mockGetDoc.mockRejectedValue(new Error('Fetch failed'));
      
      await expect(getComponentSpecification('spec-123')).rejects.toThrow('Error fetching component specification: Fetch failed');
    });
  });

  describe('getComponentSpecificationsByProjectId', () => {
    test('should return component specifications for a project', async () => {
      const mockQuerySnapshot = {
        forEach: (callback) => {
          callback({
            id: 'spec-1',
            data: () => mockSpecData
          });
          callback({
            id: 'spec-2',
            data: () => ({ ...mockSpecData, componentName: 'Another Component' })
          });
        }
      };
      mockQuery.mockReturnValue('test-query');
      mockGetDocs.mockResolvedValue(mockQuerySnapshot);
      
      const result = await getComponentSpecificationsByProjectId('project-123');
      
      expect(mockQuery).toHaveBeenCalled();
      expect(mockGetDocs).toHaveBeenCalledWith('test-query');
      expect(result).toEqual([
        { id: 'spec-1', ...mockSpecData },
        { id: 'spec-2', ...mockSpecData, componentName: 'Another Component' }
      ]);
    });

    test('should throw error when fetching fails', async () => {
      mockGetDocs.mockRejectedValue(new Error('Fetch failed'));
      
      await expect(getComponentSpecificationsByProjectId('project-123')).rejects.toThrow('Error fetching component specifications by project ID: Fetch failed');
    });
  });

  describe('updateComponentSpecification', () => {
    test('should update component specification', async () => {
      const updateData = { componentName: 'Updated Component' };
      const updatedSpec = { 
        id: 'spec-123',
        ...mockSpecData, 
        ...updateData, 
        updatedAt: expect.any(String) 
      };
      mockUpdateDoc.mockResolvedValue(undefined);
      
      const result = await updateComponentSpecification('spec-123', updateData);
      
      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'spec-123',
        ...updatedSpec
      });
    });

    test('should throw error when update fails', async () => {
      mockUpdateDoc.mockRejectedValue(new Error('Update failed'));
      
      await expect(updateComponentSpecification('spec-123', { componentName: 'Updated' })).rejects.toThrow('Error updating component specification: Update failed');
    });
  });

  describe('deleteComponentSpecification', () => {
    test('should delete component specification', async () => {
      mockDeleteDoc.mockResolvedValue(undefined);
      
      const result = await deleteComponentSpecification('spec-123');
      
      expect(mockDeleteDoc).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Component specification deleted successfully' });
    });

    test('should throw error when deletion fails', async () => {
      mockDeleteDoc.mockRejectedValue(new Error('Deletion failed'));
      
      await expect(deleteComponentSpecification('spec-123')).rejects.toThrow('Error deleting component specification: Deletion failed');
    });
  });

  describe('getAllComponentSpecifications', () => {
    test('should return all component specifications', async () => {
      const mockQuerySnapshot = {
        forEach: (callback) => {
          callback({
            id: 'spec-1',
            data: () => mockSpecData
          });
        }
      };
      mockQuery.mockReturnValue('test-query');
      mockOrderBy.mockReturnValue('ordered-query');
      mockGetDocs.mockResolvedValue(mockQuerySnapshot);
      
      const result = await getAllComponentSpecifications();
      
      expect(mockQuery).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalledWith(expect.anything(), 'createdAt', 'desc');
      expect(mockGetDocs).toHaveBeenCalledWith('test-query');
      expect(result).toEqual([
        { id: 'spec-1', ...mockSpecData }
      ]);
    });

    test('should throw error when fetching fails', async () => {
      mockGetDocs.mockRejectedValue(new Error('Fetch failed'));
      
      await expect(getAllComponentSpecifications()).rejects.toThrow('Error fetching component specifications: Fetch failed');
    });
  });
});