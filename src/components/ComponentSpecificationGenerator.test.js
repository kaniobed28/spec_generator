import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComponentSpecificationGenerator from './ComponentSpecificationGenerator';
import { useSpecification } from '../contexts/SpecificationContext';
import { unifiedApi } from '../services/unifiedApi';

// Mock the SpecificationContext
jest.mock('../contexts/SpecificationContext', () => ({
  useSpecification: jest.fn()
}));

// Mock the unifiedApi
jest.mock('../services/unifiedApi', () => ({
  unifiedApi: {
    specification: {
      getByProjectId: jest.fn()
    },
    ai: {
      generateComponentRequirements: jest.fn(),
      generateComponentDesign: jest.fn(),
      generateComponentTasks: jest.fn()
    },
    component: {
      get: jest.fn()
    }
  }
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'project-123' }),
  useNavigate: () => mockNavigate
}));

const mockContext = {
  loading: { general: false },
  error: null,
  setError: jest.fn(),
  clearError: jest.fn(),
  createComponentSpecification: jest.fn()
};

describe('ComponentSpecificationGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSpecification.mockReturnValue(mockContext);
  });

  test('should fetch project specification on mount', async () => {
    const mockProjectSpec = {
      id: 'spec-456',
      title: 'Test Project',
      sections: {
        planning: { content: 'Project planning content' },
        design: { content: 'Project design content' },
        implementation: { content: 'Project implementation content' },
        tasks: { content: 'Project tasks content' }
      }
    };
    
    unifiedApi.specification.getByProjectId.mockResolvedValue(mockProjectSpec);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationGenerator />
      </BrowserRouter>
    );
    
    // Wait for the project specification to be fetched
    await waitFor(() => {
      expect(unifiedApi.specification.getByProjectId).toHaveBeenCalledWith('project-123');
    });
  });

  test('should display project context information when project specification is available', async () => {
    const mockProjectSpec = {
      id: 'spec-456',
      title: 'Test Project',
      sections: {
        planning: { content: 'Project planning content' },
        design: { content: 'Project design content' },
        implementation: { content: 'Project implementation content' },
        tasks: { content: 'Project tasks content' }
      }
    };
    
    unifiedApi.specification.getByProjectId.mockResolvedValue(mockProjectSpec);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationGenerator />
      </BrowserRouter>
    );
    
    // Wait for the component to update with project specification
    await waitFor(() => {
      expect(screen.getByText(/Generating specifications with project context: Test Project/)).toBeInTheDocument();
    });
  });

  test('should display warning when no project specification is found', async () => {
    unifiedApi.specification.getByProjectId.mockResolvedValue(null);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationGenerator />
      </BrowserRouter>
    );
    
    // Wait for the component to update
    await waitFor(() => {
      expect(screen.getByText(/No project specification found/)).toBeInTheDocument();
    });
  });

  test('should generate specifications with project context', async () => {
    const mockProjectSpec = {
      id: 'spec-456',
      title: 'Test Project',
      sections: {
        planning: { content: 'Project planning content' },
        design: { content: 'Project design content' },
        implementation: { content: 'Project implementation content' },
        tasks: { content: 'Project tasks content' }
      }
    };
    
    unifiedApi.specification.getByProjectId.mockResolvedValue(mockProjectSpec);
    
    // Mock AI generation functions
    unifiedApi.ai.generateComponentRequirements.mockResolvedValue('Generated requirements');
    unifiedApi.ai.generateComponentDesign.mockResolvedValue('Generated design');
    unifiedApi.ai.generateComponentTasks.mockResolvedValue('Generated tasks');
    
    render(
      <BrowserRouter>
        <ComponentSpecificationGenerator />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Component Name/), {
      target: { value: 'Test Component' }
    });
    
    fireEvent.change(screen.getByLabelText(/Component Description/), {
      target: { value: 'A test component description' }
    });
    
    // Click generate button
    fireEvent.click(screen.getByText(/Generate Specifications/));
    
    // Wait for generation to complete
    await waitFor(() => {
      expect(unifiedApi.ai.generateComponentRequirements).toHaveBeenCalledWith(
        'Test Component',
        'A test component description',
        mockProjectSpec
      );
    });
    
    expect(unifiedApi.ai.generateComponentDesign).toHaveBeenCalledWith(
      'Test Component',
      'A test component description',
      'Generated requirements',
      mockProjectSpec
    );
    
    expect(unifiedApi.ai.generateComponentTasks).toHaveBeenCalledWith(
      'Test Component',
      'A test component description',
      'Generated design',
      mockProjectSpec
    );
  });
});